import {
  generateId,
  type ChatTransport,
  type UIMessage,
  type UIMessageChunk,
} from "ai"

/**
 * Scripted conversation helper for the shadcn "Chat" demo pattern.
 *
 * `createChat` builds a fluent script of user turns and agent turns, each
 * agent turn streaming reasoning, tool calls and a reply. `chat.get(n)`
 * returns the first `n` complete turns as initial messages, `chat.next()`
 * returns the next scripted user message, and `chat.transport()` returns a
 * `ChatTransport` that replays the script as UIMessageChunk streams — with a
 * `fallback` reply once the script runs out.
 */

type ToolAction = {
  kind: "tool"
  name: string
  input: unknown
  /** Pause between the tool input becoming available and its output. */
  sleep: number
  output?: unknown
  errorText?: string
}

type AssistantAction =
  | { kind: "reasoning"; text: string }
  | { kind: "sleep"; ms: number }
  | ToolAction
  | { kind: "text"; text: string }

type ScriptedTurn = {
  userText: string
  actions: AssistantAction[]
}

export type ToolChain = {
  sleep(ms: number): ToolChain
  output(output: unknown): ToolChain
  error(errorText: string): ToolChain
}

export type ScriptWriter = {
  reasoning(text: string): void
  sleep(ms: number): void
  tool<const Name extends string>(
    name: Name,
    options: { input: unknown },
  ): ToolChain
  text(text: string): void
}

function buildUserMessage(text: string): UIMessage {
  return {
    id: generateId(),
    role: "user",
    parts: [{ type: "text", text }],
  }
}

function buildAssistantMessage(actions: AssistantAction[]): UIMessage {
  const parts: UIMessage["parts"] = []

  for (const action of actions) {
    if (action.kind === "reasoning") {
      parts.push({ type: "reasoning", text: action.text, state: "done" })
    } else if (action.kind === "tool") {
      if (action.errorText !== undefined) {
        parts.push({
          type: `tool-${action.name}`,
          toolCallId: generateId(),
          state: "output-error",
          input: action.input,
          errorText: action.errorText,
        })
      } else {
        parts.push({
          type: `tool-${action.name}`,
          toolCallId: generateId(),
          state: "output-available",
          input: action.input,
          output: action.output,
        })
      }
    } else if (action.kind === "text") {
      parts.push({ type: "text", text: action.text, state: "done" })
    }
  }

  return { id: generateId(), role: "assistant", parts }
}

/** Join the text parts of a message into a single string. */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
}

/** Split text into word-ish pieces so it can stream as deltas. */
function pieces(text: string): string[] {
  return text.match(/\S+\s*|\s+/g) ?? [text]
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve()
  }

  if (signal?.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"))
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort)
      resolve()
    }, ms)

    function onAbort() {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    }

    signal?.addEventListener("abort", onAbort, { once: true })
  })
}

async function* textChunks(
  text: string,
  delayMs: number,
  signal: AbortSignal | undefined,
): AsyncGenerator<UIMessageChunk> {
  const id = generateId()
  yield { type: "text-start", id }

  for (const piece of pieces(text)) {
    await delay(delayMs, signal)
    yield { type: "text-delta", id, delta: piece }
  }

  yield { type: "text-end", id }
}

async function* scriptedChunks(
  actions: AssistantAction[],
  delayMs: number,
  signal: AbortSignal | undefined,
): AsyncGenerator<UIMessageChunk> {
  yield { type: "start", messageId: generateId() }
  yield { type: "start-step" }

  for (const action of actions) {
    if (action.kind === "sleep") {
      await delay(action.ms, signal)
      continue
    }

    if (action.kind === "reasoning") {
      const id = generateId()
      yield { type: "reasoning-start", id }
      for (const piece of pieces(action.text)) {
        await delay(delayMs, signal)
        yield { type: "reasoning-delta", id, delta: piece }
      }
      yield { type: "reasoning-end", id }
      continue
    }

    if (action.kind === "tool") {
      const toolCallId = generateId()
      yield {
        type: "tool-input-available",
        toolCallId,
        toolName: action.name,
        input: action.input,
      }
      await delay(action.sleep, signal)
      if (action.errorText !== undefined) {
        yield { type: "tool-output-error", toolCallId, errorText: action.errorText }
      } else {
        yield { type: "tool-output-available", toolCallId, output: action.output }
      }
      continue
    }

    yield* textChunks(action.text, delayMs, signal)
  }

  yield { type: "finish-step" }
  yield { type: "finish", finishReason: "stop" }
}

async function* fallbackChunks(
  fallback: string,
  delayMs: number,
  signal: AbortSignal | undefined,
): AsyncGenerator<UIMessageChunk> {
  yield { type: "start", messageId: generateId() }
  yield { type: "start-step" }
  yield* textChunks(fallback, delayMs, signal)
  yield { type: "finish-step" }
  yield { type: "finish", finishReason: "stop" }
}

function toStream(
  chunks: AsyncGenerator<UIMessageChunk>,
): ReadableStream<UIMessageChunk> {
  return new ReadableStream<UIMessageChunk>({
    async start(controller) {
      try {
        for await (const chunk of chunks) {
          controller.enqueue(chunk)
        }
      } catch (error) {
        controller.enqueue(
          error instanceof Error && error.name === "AbortError"
            ? { type: "abort" }
            : {
                type: "error",
                errorText: error instanceof Error ? error.message : String(error),
              },
        )
      } finally {
        controller.close()
      }
    },
  })
}

export function createChat<M extends UIMessage = UIMessage>() {
  const turns: ScriptedTurn[] = []
  let pendingSleeps: number[] = []

  const builder = {
    user(text: string) {
      turns.push({ userText: text, actions: [] })
      return builder
    },

    sleep(ms: number) {
      pendingSleeps.push(ms)
      return builder
    },

    assistant(write: (context: { writer: ScriptWriter }) => void) {
      const turn = turns.at(-1)
      if (!turn) {
        return builder
      }

      const actions: AssistantAction[] = pendingSleeps.map((ms) => ({
        kind: "sleep",
        ms,
      }) satisfies AssistantAction)
      pendingSleeps = []

      const writer: ScriptWriter = {
        reasoning(text) {
          actions.push({ kind: "reasoning", text })
        },
        sleep(ms) {
          actions.push({ kind: "sleep", ms })
        },
        tool(name, { input }) {
          const tool: ToolAction = { kind: "tool", name, input, sleep: 0 }
          actions.push(tool)
          const chain: ToolChain = {
            sleep(ms) {
              tool.sleep = ms
              return chain
            },
            output(output) {
              tool.output = output
              return chain
            },
            error(errorText) {
              tool.errorText = errorText
              return chain
            },
          }
          return chain
        },
        text(text) {
          actions.push({ kind: "text", text })
        },
      }

      write({ writer })
      turn.actions = actions
      return builder
    },


    /** The first `count` complete turns as initial messages. */
    get(count: number): M[] {
      const messages: M[] = []
      for (const turn of turns.slice(0, Math.max(0, count))) {
        messages.push(buildUserMessage(turn.userText) as unknown as M)
        messages.push(buildAssistantMessage(turn.actions) as unknown as M)
      }
      return messages
    },

    /** The next scripted user message for the thread, or undefined. */
    next(messages: readonly M[] | undefined): M | undefined {
      const userCount =
        messages?.filter((message) => message.role === "user").length ?? 0
      const turn = turns[userCount]
      if (!turn) {
        return undefined
      }
      return buildUserMessage(turn.userText) as unknown as M
    },

    /** A ChatTransport that replays the script as a UIMessageChunk stream. */
    transport({
      delayMs = 16,
      fallback,
    }: {
      delayMs?: number
      fallback: string
    }): ChatTransport<M> {
      return {
        reconnectToStream: async () => null,
        sendMessages: async (options) => {
          const userCount = options.messages.filter(
            (message) => message.role === "user",
          ).length
          const turn = turns[userCount - 1]

          const chunks = turn
            ? scriptedChunks(turn.actions, delayMs, options.abortSignal)
            : fallbackChunks(fallback, delayMs, options.abortSignal)

          return toStream(chunks)
        },
      }
    },
  }

  return builder
}
