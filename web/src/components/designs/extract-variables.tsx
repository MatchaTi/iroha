import * as React from "react"
import convert from "color-convert"
import { Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDesignStore, type Design } from "@/store/use-design"

/**
 * Extracts the design's shadcn color tokens as copy-paste CSS variables.
 * Color values are converted with `color-convert`.
 */

type ColorFormat = "oklch" | "hsl" | "rgb" | "hex"

const FORMATS: { value: ColorFormat; label: string }[] = [
  { value: "oklch", label: "oklch" },
  { value: "hsl", label: "hsl" },
  { value: "rgb", label: "rgb" },
  { value: "hex", label: "hex" },
]

/** "primaryForeground" → "primary-foreground", "chart1" → "chart-1" */
function toKebab(token: string): string {
  return token
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase()
}

/** Trim trailing zeros: 0.2200 → "0.22", 0 → "0" */
function trim(value: number): string {
  return String(Number(value.toFixed(4)))
}

/**
 * `color-convert` ships `hex.oklch` at runtime but its types don't declare
 * it — cast to the narrow shape we need. Returns [L, C, H] on 0–100 scale.
 */
function hexToOklch(hex: string): [number, number, number] {
  return (
    convert as unknown as {
      hex: { oklch(hex: string): [number, number, number] }
    }
  ).hex.oklch(hex)
}

/** Convert "#RRGGBB[AA]" into a CSS color function in the chosen format. */
function formatColor(hex: string, format: ColorFormat): string {
  const clean = hex.replace(/^#/, "")
  const base = clean.slice(0, 6)
  const alpha =
    clean.length === 8
      ? Number((parseInt(clean.slice(6), 16) / 255).toFixed(3))
      : null
  const suffix = alpha != null && alpha < 1 ? ` / ${alpha}` : ""

  switch (format) {
    case "hex":
      return hex.toUpperCase()
    case "rgb": {
      const [r, g, b] = convert.hex.rgb(base)
      return `rgb(${r} ${g} ${b}${suffix})`
    }
    case "hsl": {
      const [h, s, l] = convert.hex.hsl(base)
      return `hsl(${h} ${s}% ${l}%${suffix})`
    }
    case "oklch": {
      const [l, c, h] = hexToOklch(base)
      return `oklch(${(l / 100).toFixed(4)} ${trim(c / 100)} ${Math.round(h)}${suffix})`
    }
  }
}

/** Tailwind v3 channel values: `214 96% 48%` (no color function). */
function formatV3Channel(hex: string): string {
  const [h, s, l] = convert.hex.hsl(hex.replace(/^#/, "").slice(0, 6))
  return `${h} ${s}% ${l}%`
}

function buildIndexCss(
  design: Design,
  twVersion: "v4" | "v3",
  format: ColorFormat
): string {
  const tokens = Object.entries(design.colorPalette)

  if (twVersion === "v3") {
    const light = tokens.map(
      ([token, color]) =>
        `  --${toKebab(token)}: ${formatV3Channel(color.value)};`
    )
    const dark = tokens.map(
      ([token, color]) =>
        `  --${toKebab(token)}: ${formatV3Channel(color.darkValue ?? color.value)};`
    )
    return [
      "@tailwind base;",
      "@tailwind components;",
      "@tailwind utilities;",
      "",
      ":root {",
      ...light,
      "}",
      "",
      ".dark {",
      ...dark,
      "}",
      "",
      "// tailwind.config.js → colors:",
      "//   background: 'hsl(var(--background))',",
      "//   foreground: 'hsl(var(--foreground))',",
      "//   …same pattern for every token above.",
      "",
    ].join("\n")
  }

  const light = tokens.map(
    ([token, color]) =>
      `  --${toKebab(token)}: ${formatColor(color.value, format)};`
  )
  const dark = tokens.map(
    ([token, color]) =>
      `  --${toKebab(token)}: ${formatColor(color.darkValue ?? color.value, format)};`
  )
  const theme = tokens.map(
    ([token]) => `  --color-${toKebab(token)}: var(--${toKebab(token)});`
  )

  return [
    '@import "tailwindcss";',
    "",
    "@custom-variant dark (&:is(.dark *));",
    "",
    ":root {",
    ...light,
    "}",
    "",
    ".dark {",
    ...dark,
    "}",
    "",
    "@theme inline {",
    ...theme,
    "}",
    "",
  ].join("\n")
}

export function ExtractVariablesButton({ designId }: { designId: string }) {
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === designId)
  )
  const [twVersion, setTwVersion] = React.useState<"v4" | "v3">("v4")
  const [format, setFormat] = React.useState<ColorFormat>("oklch")

  const css = design ? buildIndexCss(design, twVersion, format) : ""

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="lg">
            <Code2 />
            Code
          </Button>
        }
      />
      <DialogContent className="max-h-[calc(100dvh-4rem)] w-full max-w-7xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Extract Variables</DialogTitle>
          <DialogDescription>
            Copy the shadcn color variables of this design into your project.
          </DialogDescription>
        </DialogHeader>

        {/* Tailwind version & color format */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={twVersion}
            onValueChange={(value) => {
              if (value === "v4" || value === "v3") setTwVersion(value)
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue>
                {twVersion === "v4" ? "Tailwind v4" : "Tailwind v3"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v4">Tailwind v4</SelectItem>
              <SelectItem value="v3">Tailwind v3</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={format}
            onValueChange={(value) => {
              if (typeof value === "string") setFormat(value as ColorFormat)
            }}
            disabled={twVersion === "v3"}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                {FORMATS.find((item) => item.value === format)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>index.css</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={css} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent className="max-h-[50vh]">{css}</CodeBlockContent>
        </CodeBlock>
      </DialogContent>
    </Dialog>
  )
}
