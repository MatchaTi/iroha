import * as React from "react"
import convert from "color-convert"
import { FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { COLOR_PALETTE_STATER_PACKS } from "@/constants/color-palette"
import { useDesignStore, type ColorPalette } from "@/store/use-design"

/**
 * Imports shadcn color variables pasted as CSS (an `index.css` snippet or
 * bare `--token: value;` lines). Accepts hex, rgb(), hsl(), oklch() and
 * Tailwind v3 channel values, in both `:root` and `.dark` blocks.
 */

const KNOWN_TOKENS = new Set(Object.keys(COLOR_PALETTE_STATER_PACKS))

/** "primary-foreground" → "primaryForeground", "chart-1" → "chart1" */
function kebabToToken(kebab: string): string | null {
  const token = kebab
    .split("-")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("")
  return KNOWN_TOKENS.has(token) ? token : null
}

/**
 * oklch → sRGB hex. `color-convert` has no oklch support, so this uses the
 * standard OKLab → linear-sRGB matrices. L is 0–1, H in degrees.
 */
function oklchToRgb01(
  l: number,
  c: number,
  h: number
): [number, number, number] {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const lms = [l_ ** 3, m_ ** 3, s_ ** 3]

  const rgb = [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ]

  return rgb.map((channel) => {
    const clamped = Math.min(Math.max(channel, 0), 1)
    const gamma =
      clamped <= 0.0031308
        ? clamped * 12.92
        : 1.055 * clamped ** (1 / 2.4) - 0.055
    return Math.round(gamma * 255)
  }) as [number, number, number]
}

/** Parse one CSS color value into "#rrggbb" / "#rrggbbaa". Null if unsupported. */
function parseColor(raw: string): string | null {
  const value = raw.trim().toLowerCase()
  if (!value || value.includes("var(")) return null

  // Hex: #rgb, #rgba, #rrggbb, #rrggbbaa
  const hex = value.match(/^#([0-9a-f]{3,8})$/)
  if (hex) {
    let digits = hex[1]
    if (digits.length === 3 || digits.length === 4) {
      // Doubling maps #rgb → #rrggbb and #rgba → #rrggbbaa directly.
      digits = digits
        .split("")
        .map((d) => d + d)
        .join("")
    }
    if (digits.length === 6) return `#${digits}`
    if (digits.length === 8) {
      const alpha = parseInt(digits.slice(6), 16)
      // Opaque colors collapse back to 6 digits; alpha < 1 keeps 8 digits.
      return alpha === 255 ? `#${digits.slice(0, 6)}` : `#${digits}`
    }
    return null
  }

  // Function form: rgb(), rgba(), hsl(), hsla(), oklch()
  const fn = value.match(/^(rgba?|hsla?|oklch)\(([^)]+)\)$/)
  if (fn) {
    const kind = fn[1].replace(/a$/, "") as "rgb" | "hsl" | "oklch"
    const [body, alphaPart] = fn[2].split("/")
    const parts = body
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
    const alpha = alphaPart != null ? parseAlpha(alphaPart.trim()) : null
    if (parts.length !== 3) return null

    if (kind === "rgb") {
      // Unitless channels are 0–255, percentage channels 0–100%.
      const channels = parts.map((p) =>
        p.endsWith("%")
          ? (Number.parseFloat(p) / 100) * 255
          : Number.parseFloat(p)
      )
      if (channels.some((n) => Number.isNaN(n))) return null
      const rgb = channels.map((c) =>
        Math.round(Math.min(Math.max(c, 0), 255))
      ) as [number, number, number]
      return withAlpha(convert.rgb.hex(rgb).toLowerCase(), alpha)
    }

    if (kind === "hsl") {
      const [h, s, l] = parts.map((p) => Number.parseFloat(p))
      if ([h, s, l].some((n) => Number.isNaN(n))) return null
      return withAlpha(
        convert.hsl.hex([h, Math.min(s, 100), Math.min(l, 100)]).toLowerCase(),
        alpha
      )
    }

    // oklch: L is 0–1 or a percentage; H may be `none`.
    const lRaw = parts[0]
    const c = Number.parseFloat(parts[1])
    const hRaw = parts[2]
    const l = lRaw.endsWith("%")
      ? Number.parseFloat(lRaw) / 100
      : Number.parseFloat(lRaw)
    const h = hRaw === "none" ? 0 : Number.parseFloat(hRaw)
    if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) return null
    return withAlpha(
      oklchToRgb01(l, c, h)
        .map((v) => v.toString(16).padStart(2, "0"))
        .join(""),
      alpha
    )
  }

  // Tailwind v3 channels: `214 96% 48%`
  const channels = value.split(/[\s,]+/).filter(Boolean)
  if (channels.length === 3 && channels[1].endsWith("%")) {
    const h = Number(channels[0])
    const s = Number(channels[1].replace("%", ""))
    const l = Number(channels[2].replace("%", ""))
    if ([h, s, l].every((n) => !Number.isNaN(n))) {
      const hsl = [h, Math.min(s, 100), Math.min(l, 100)] as [
        number,
        number,
        number,
      ]
      return withAlpha(convert.hsl.hex(hsl).toLowerCase(), null)
    }
  }

  return null
}

/** "0.5", "50%" → 0–255 byte or null. */
function parseAlpha(part: string | undefined): number | null {
  if (part == null) return null
  const n = part.endsWith("%") ? Number(part.slice(0, -1)) / 100 : Number(part)
  if (Number.isNaN(n)) return null
  const clamped = Math.min(Math.max(n, 0), 1)
  return Math.round(clamped * 255)
}

/** "#rrggbb" + alpha byte → "#rrggbbaa", or unchanged when opaque/absent. */
function withAlpha(hex6: string, alpha: number | null): string {
  if (alpha == null || alpha === 255) return `#${hex6}`
  return `#${hex6}${alpha.toString(16).padStart(2, "0")}`
}

type ParsedVariables = {
  root: Partial<Record<keyof ColorPalette, string>>
  dark: Partial<Record<keyof ColorPalette, string>>
  recognized: number
  unrecognized: number
}

/** Extract shadcn tokens out of pasted CSS. Unrecognized variables are counted, not imported. */
function parseVariables(text: string): ParsedVariables {
  // Strip block & line comments so they can't swallow declarations.
  const clean = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")

  const root: Partial<Record<keyof ColorPalette, string>> = {}
  const dark: Partial<Record<keyof ColorPalette, string>> = {}
  let recognized = 0
  let unrecognized = 0

  const collect = (
    body: string,
    target: Partial<Record<keyof ColorPalette, string>>
  ) => {
    const decls = body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;{]+);/gi)
    for (const decl of decls) {
      const token = kebabToToken(decl[1])
      if (!token) {
        unrecognized++
        continue
      }
      const hex = parseColor(decl[2])
      if (!hex) {
        unrecognized++
        continue
      }
      target[token as keyof ColorPalette] = hex
      recognized++
    }
  }

  const rootBlock = clean.match(/:root\s*\{([^}]*)\}/)
  const darkBlock = clean.match(/\.dark\s*\{([^}]*)\}/)

  if (rootBlock) collect(rootBlock[1], root)
  if (darkBlock) collect(darkBlock[1], dark)

  // Declarations outside any block count as light values.
  const rest = clean
    .replace(/:root\s*\{[^}]*\}/g, "")
    .replace(/\.dark\s*\{[^}]*\}/g, "")
  collect(rest, root)

  return { root, dark, recognized, unrecognized }
}

export function ImportVariablesButton({ designId }: { designId: string }) {
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === designId)
  )
  const updateDesign = useDesignStore((state) => state.updateDesign)
  const [open, setOpen] = React.useState(false)
  const [css, setCss] = React.useState("")

  const parsed = React.useMemo(
    () => (open && css.trim() ? parseVariables(css) : null),
    [open, css]
  )
  const lightCount = parsed ? Object.keys(parsed.root).length : 0
  const darkCount = parsed ? Object.keys(parsed.dark).length : 0

  const apply = () => {
    if (!design || !parsed || lightCount + darkCount === 0) return

    const palette = { ...design.colorPalette }
    for (const [token, hex] of Object.entries(parsed.root) as [
      keyof ColorPalette,
      string,
    ][]) {
      const darkHex = parsed.dark[token]
      palette[token] = {
        ...palette[token],
        value: hex,
        darkValue: darkHex && darkHex !== hex ? darkHex : undefined,
      }
    }
    // Tokens that only exist in `.dark` still update their dark value.
    for (const [token, hex] of Object.entries(parsed.dark) as [
      keyof ColorPalette,
      string,
    ][]) {
      if (parsed.root[token]) continue
      palette[token] = {
        ...palette[token],
        darkValue: hex !== palette[token].value ? hex : undefined,
      }
    }

    updateDesign(designId, { ...design, colorPalette: palette })
    toast.add({
      title: "Variables imported",
      description: `${lightCount + darkCount} color variables applied to this design.`,
      type: "success",
    })
    setOpen(false)
    setCss("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setCss("")
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="lg">
            <FileUp />
            Import
          </Button>
        }
      />
      <DialogContent className="max-h-[calc(100dvh-4rem)] w-full max-w-7xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Variables</DialogTitle>
          <DialogDescription>
            Paste your shadcn index.css (or any CSS with --token lines) to
            replace this design's colors.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={css}
          onChange={(event) => setCss(event.target.value)}
          placeholder={PLACEHOLDER}
          className="h-64 font-mono text-xs"
          spellCheck={false}
        />

        {parsed && (
          <p className="text-sm text-muted-foreground">
            {lightCount + darkCount > 0 ? (
              <>
                {lightCount} light{darkCount > 0 ? ` · ${darkCount} dark` : ""}{" "}
                variables recognized
                {parsed.unrecognized > 0 && ` · ${parsed.unrecognized} ignored`}
              </>
            ) : (
              "No known shadcn variables found in the pasted CSS."
            )}
          </p>
        )}

        <DialogFooter>
          <Button
            onClick={apply}
            disabled={!parsed || lightCount + darkCount === 0}
          >
            Apply to design
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const PLACEHOLDER = `:root {
  --background: #ffffff;
  --primary: oklch(0.208 0.042 265.755);
  ...
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  ...
}`
