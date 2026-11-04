import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignInputState,
  type DesignTextarea,
  type ColorPalette,
  type Corner,
  type Project,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignTextareaStarterPacks } from "@/lib/constants"
import { formatRadius } from "@/lib/design-tokens"
import {
  DesignTextarea as DesignTextareaPreview,
  DESIGN_TEXTAREA_STATES,
} from "@/components/shared/design-textarea"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCcw, Expand, TextCursorInput } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// ─── ColorTokenSelect ─────────────────────────────────────────────────────────

function ColorTokenSelect({
  label,
  value,
  palettes,
  onChange,
}: {
  label: string
  value: string
  palettes: ColorPalette[]
  onChange: (ref: string) => void
}) {
  const isTransparent = value === "transparent" || !value
  const [purpose, level] = isTransparent
    ? ["", ""]
    : value.includes("::")
      ? value.split("::")
      : ["", ""]
  const matchedPalette = palettes.find((p) => p.purpose === purpose)
  const matchedColor = matchedPalette?.colors.find((c) => c.level === level)
  const hex = isTransparent ? undefined : (matchedColor?.hex ?? "#000000")

  const displayLabel = isTransparent
    ? "Transparent"
    : matchedPalette
      ? `${matchedPalette.name} ${level}`
      : value

  return (
    <Field>
      <FieldLabel className="text-xs text-muted-foreground">{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <div
          className="size-5 shrink-0 rounded-full border"
          style={{ backgroundColor: hex }}
        />
        <Select
          value={value}
          onValueChange={(v) => onChange(v ?? "transparent")}
        >
          <SelectTrigger className="flex-1">
            <SelectValue>{displayLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transparent">Transparent</SelectItem>
            {palettes.map((palette) =>
              palette.colors.map((color) => (
                <SelectItem
                  key={`${palette.purpose}::${color.level}`}
                  value={`${palette.purpose}::${color.level}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3.5 rounded-full border border-border/50"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>
                      {palette.name} {color.level}
                    </span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {color.hex}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </Field>
  )
}

// ─── StateEditor (per-state: colors) ─────────────────────────────────────────

interface StateEditorProps {
  textarea: DesignTextarea
  onCommit: (updated: Partial<DesignTextarea>) => void
  palettes: ColorPalette[]
}

function StateEditor({ textarea, onCommit, palettes }: StateEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Colors */}
      <ColorTokenSelect
        label="Background"
        value={textarea.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Foreground"
        value={textarea.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={textarea.border}
        palettes={palettes}
        onChange={(v) => onCommit({ border: v })}
      />
      <ColorTokenSelect
        label="Placeholder"
        value={textarea.placeholder}
        palettes={palettes}
        onChange={(v) => onCommit({ placeholder: v })}
      />
      <ColorTokenSelect
        label="Label"
        value={textarea.label}
        palettes={palettes}
        onChange={(v) => onCommit({ label: v })}
      />
      <ColorTokenSelect
        label="Helper"
        value={textarea.helper}
        palettes={palettes}
        onChange={(v) => onCommit({ helper: v })}
      />
    </div>
  )
}

// ─── SharedTokensEditor ───────────────────────────────────────────────────────

function SharedTokensEditor({
  shared,
  corners,
  shadows,
  typographies,
  onCommit,
}: {
  shared: Pick<
    DesignTextarea,
    "cornerId" | "typographyId" | "shadowId" | "paddingX" | "paddingY"
  > & { minHeight: number }
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (
    updated: Partial<
      Pick<
        DesignTextarea,
        | "cornerId"
        | "typographyId"
        | "shadowId"
        | "paddingX"
        | "paddingY"
        | "minHeight"
      >
    >
  ) => void
}) {
  const [paddingX, setPaddingX] = useState(String(shared.paddingX))
  const [paddingY, setPaddingY] = useState(String(shared.paddingY))
  const [minHeight, setMinHeight] = useState(String(shared.minHeight))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  const commitNumber = (
    raw: string,
    key: "paddingX" | "paddingY" | "minHeight",
    setter: (v: string) => void,
    fallback: number
  ) => {
    const parsed = parseFloat(raw)
    if (!isNaN(parsed) && parsed >= 0) onCommit({ [key]: parsed })
    else setter(String(fallback))
  }

  return (
    <div className="flex max-w-sm flex-col gap-4 p-6">
      <p className="text-xs text-muted-foreground">
        These tokens apply to all textarea states.
      </p>

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Corner Radius
        </FieldLabel>
        <Select
          value={shared.cornerId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ cornerId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === shared.cornerId)
                return c ? `${c.name} - ${formatRadius(c.radius)}` : "Custom"
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {corners.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} - {formatRadius(c.radius)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Separator />

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Typography
        </FieldLabel>
        <Select
          value={shared.typographyId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ typographyId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const t = typographies.find((t) => t.id === shared.typographyId)
                return t
                  ? `${t.name} - ${t.fontSize}px / ${t.fontWeight}`
                  : "Custom"
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {typographies.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {t.fontSize}px / {t.fontWeight}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Separator />

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Shadow
        </FieldLabel>
        <Select
          value={shared.shadowId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ shadowId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {shared.shadowId === "none"
                ? "None"
                : (shadows.find((s) => s.id === shared.shadowId)?.name ??
                  "Custom")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {shadows.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Separator />

      {/* Padding + height */}
      <div className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Padding X
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand className="rotate-90" />
            </InputGroupAddon>
            <InputGroupInput
              value={paddingX}
              onChange={(e) => setPaddingX(e.target.value)}
              onBlur={() =>
                commitNumber(paddingX, "paddingX", setPaddingX, shared.paddingX)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Padding Y
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand />
            </InputGroupAddon>
            <InputGroupInput
              value={paddingY}
              onChange={(e) => setPaddingY(e.target.value)}
              onBlur={() =>
                commitNumber(paddingY, "paddingY", setPaddingY, shared.paddingY)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
      </div>

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Min Height (px)
        </FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <Expand />
          </InputGroupAddon>
          <InputGroupInput
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value)}
            onBlur={() =>
              commitNumber(
                minHeight,
                "minHeight",
                setMinHeight,
                shared.minHeight
              )
            }
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
      </Field>
    </div>
  )
}

// ─── TextareaRow ──────────────────────────────────────────────────────────────

interface TextareaRowProps {
  state: DesignInputState
  textarea: DesignTextarea | undefined
  project: Project
  palettes: ColorPalette[]
  onCommit: (updated: Partial<DesignTextarea>) => void
}

function TextareaRow({
  state,
  textarea,
  project,
  palettes,
  onCommit,
}: TextareaRowProps) {
  if (!textarea) return null

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-24 items-center px-6 py-8 md:col-span-3">
        <DesignTextareaPreview
          project={project}
          design={textarea}
          state={state}
        />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {state}
        </p>
        <StateEditor
          textarea={textarea}
          palettes={palettes}
          onCommit={onCommit}
        />
      </div>
    </div>
  )
}

// ─── DSTextarea page ──────────────────────────────────────────────────────────

export function DSTextarea() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    state: DesignInputState,
    updated: Partial<DesignTextarea>
  ) => {
    if (!project) return
    updateProject(id!, {
      designTextarea: (project.designTextarea ?? []).map((i) =>
        i.state === state ? { ...i, ...updated } : i
      ),
    })
  }

  const commitShared = (
    updated: Partial<
      Pick<
        DesignTextarea,
        | "cornerId"
        | "typographyId"
        | "shadowId"
        | "paddingX"
        | "paddingY"
        | "minHeight"
      >
    >
  ) => {
    if (!project) return
    updateProject(id!, {
      designTextarea: (project.designTextarea ?? []).map((i) => ({
        ...i,
        ...updated,
      })),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designTextarea: resolveDesignTextareaStarterPacks(
        project.corner ?? [],
        project.shadow ?? [],
        project.typography ?? []
      ),
    })
  }

  const palettes = project?.colorPalette ?? []
  const corners = project?.corner ?? []
  const shadows = project?.shadow ?? []
  const typographies = project?.typography ?? []

  // Shared token display values — only when every state agrees
  const textareas = project?.designTextarea ?? []
  const firstTextarea = textareas[0]
  const shared = firstTextarea
    ? {
        cornerId: textareas.every((i) => i.cornerId === firstTextarea.cornerId)
          ? firstTextarea.cornerId
          : "",
        typographyId: textareas.every(
          (i) => i.typographyId === firstTextarea.typographyId
        )
          ? firstTextarea.typographyId
          : "",
        shadowId: textareas.every((i) => i.shadowId === firstTextarea.shadowId)
          ? firstTextarea.shadowId
          : "",
        paddingX: firstTextarea.paddingX,
        paddingY: firstTextarea.paddingY,
        minHeight: firstTextarea.minHeight,
      }
    : {
        cornerId: "",
        typographyId: "",
        shadowId: "",
        paddingX: 12,
        paddingY: 8,
        minHeight: 96,
      }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Textarea</h1>
          <p>Customize textarea styles for each state in your design system</p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
      </section>

      <section className="border-t">
        {textareas.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TextCursorInput />
              </EmptyMedia>
              <EmptyTitle>No textarea styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default textarea styles.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={resetToDefault}>
                <RotateCcw /> Load Defaults
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Tabs defaultValue="states">
            {/* Tab nav */}
            <div className="border-b px-4 pt-4">
              <TabsList variant="line">
                <TabsTrigger value="states">States</TabsTrigger>
                <TabsTrigger value="shared">Shared Tokens</TabsTrigger>
              </TabsList>
            </div>

            {/* ── States tab ── */}
            <TabsContent value="states">
              {DESIGN_TEXTAREA_STATES.map((state) => {
                const textarea = textareas.find((i) => i.state === state)
                return (
                  <TextareaRow
                    key={state}
                    state={state}
                    textarea={textarea}
                    project={project!}
                    palettes={palettes}
                    onCommit={(updated) => handleCommit(state, updated)}
                  />
                )
              })}
            </TabsContent>

            {/* ── Shared tokens tab ── */}
            <TabsContent value="shared">
              <SharedTokensEditor
                shared={shared}
                corners={corners}
                shadows={shadows}
                typographies={typographies}
                onCommit={commitShared}
              />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </main>
  )
}
