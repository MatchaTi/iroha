import type { Color, ColorPalette } from "@/store/use-design"
import { COLOR_PALETTE_STATER_PACKS } from "./color-palette"

export type PalettePreset = {
  id: string
  name: string
  /** 5 colors: primary + 4 tints (drives the swatch strip and the chart tokens). */
  colors: [string, string, string, string, string]
}

const INK_DARK = "#0a0a0a"
const INK_LIGHT = "#fafafa"

/** Perceived luminance (WCAG formula) of a #rrggbb hex, 0–1 */
function luminance(hex: string) {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

/** Contrast ink (matching the shadcn token values) for a given background hex. */
function contrastInk(hex: string) {
  return luminance(hex) > 0.55 ? INK_DARK : INK_LIGHT
}

/** Convert "#rrggbb" to HSL [0-360, 0-100, 0-100] */
function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  return [h, Math.round(s * 100), Math.round(l * 100)]
}

/** Convert HSL [0-360, 0-100, 0-100] to "#rrggbb" */
function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)

  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: "default",
    name: "Default",
    colors: ["#101012", "#525252", "#737373", "#a1a1a1", "#d4d4d4"],
  },
  {
    id: "purple",
    name: "Purple",
    colors: ["#7F22FE", "#A684FF", "#C4B4FF", "#DDD6FF", "#EDE9FE"],
  },
  {
    id: "blue",
    name: "Blue",
    colors: ["#155DFC", "#2B7FFF", "#8EC5FF", "#BEDBFF", "#DBEAFE"],
  },
  {
    id: "green",
    name: "Green",
    colors: ["#008236", "#00C950", "#7BF1A8", "#B9F8CF", "#DCFCE7"],
  },
  {
    id: "coral",
    name: "Coral",
    colors: ["#FF637E", "#FFA1AD", "#FFCCD3", "#FFE4E6", "#FFF1F2"],
  },
  {
    id: "amber",
    name: "Amber",
    colors: ["#BB4D00", "#FE9A00", "#FFD230", "#FEE685", "#FEF3C6"],
  },
  {
    id: "teal",
    name: "Teal",
    colors: ["#00786F", "#00BBA7", "#46ECD5", "#96F7E4", "#CBFBF1"],
  },
  {
    id: "mono",
    name: "Mono",
    colors: ["#3F3F46", "#71717B", "#9F9FA9", "#D4D4D8", "#E4E4E7"],
  },
]

/**
 * Build a full `ColorPalette` from a preset.
 *
 * The primary color's hue drives the whole theme: surfaces (background,
 * card, popover, muted, border, input, sidebar) are generated as subtle
 * tints of that hue — in light AND dark — so every token follows the
 * preset like the shadcn theme builder. Charts use the preset ramp as-is
 * and destructive keeps the shadcn red defaults.
 */
export function paletteFromPreset(preset: PalettePreset): ColorPalette {
  if (preset.id === "default") {
    return structuredClone(COLOR_PALETTE_STATER_PACKS)
  }

  const base = COLOR_PALETTE_STATER_PACKS
  const [primary, tint1, tint2, tint3, tint4] = preset.colors
  const [h, s] = hexToHsl(primary)

  /** Tinted surface derived from the primary hue (s = saturation multiplier) */
  const surface = (l: number, sm = 0.2, alpha = "") =>
    hslToHex(h, Math.min(100, Math.round(s * sm)), l) + alpha

  /** Override a token's colors while keeping its label */
  const recolor = (
    token: keyof ColorPalette,
    value: string,
    darkValue = value
  ): Color => ({
    ...base[token],
    value,
    darkValue,
  })

  const darkInk = surface(12, 0.35)
  const lightInk = surface(96, 0.08)

  return {
    ...base,
    background: recolor("background", surface(98.5, 0.12), surface(12, 0.1)),
    foreground: recolor("foreground", darkInk, lightInk),
    card: recolor("card", surface(99.5, 0.1), surface(15, 0.1)),
    cardForeground: recolor("cardForeground", darkInk, lightInk),
    popover: recolor("popover", surface(99.5, 0.1), surface(15, 0.1)),
    popoverForeground: recolor("popoverForeground", darkInk, lightInk),
    primary: recolor("primary", primary, tint1),
    primaryForeground: recolor(
      "primaryForeground",
      contrastInk(primary),
      contrastInk(tint1)
    ),
    secondary: recolor("secondary", surface(94, 0.25), surface(20, 0.2)),
    secondaryForeground: recolor("secondaryForeground", darkInk, lightInk),
    accent: recolor("accent", surface(94.5, 0.25), surface(20, 0.2)),
    accentForeground: recolor("accentForeground", darkInk, lightInk),
    muted: recolor("muted", surface(95.5, 0.2), surface(18, 0.12)),
    mutedForeground: recolor(
      "mutedForeground",
      surface(45, 0.2),
      surface(63, 0.1)
    ),
    border: recolor("border", surface(89, 0.2), surface(95, 0.12) + "1a"),
    input: recolor("input", surface(89, 0.2), surface(95, 0.12) + "26"),
    ring: recolor("ring", primary, tint1),
    chart1: recolor("chart1", primary),
    chart2: recolor("chart2", tint1),
    chart3: recolor("chart3", tint2),
    chart4: recolor("chart4", tint3),
    chart5: recolor("chart5", tint4),
    sidebar: recolor("sidebar", surface(98, 0.12), surface(15, 0.1)),
    sidebarForeground: recolor("sidebarForeground", darkInk, lightInk),
    sidebarPrimary: recolor("sidebarPrimary", primary, tint1),
    sidebarPrimaryForeground: recolor(
      "sidebarPrimaryForeground",
      contrastInk(primary),
      contrastInk(tint1)
    ),
    sidebarAccent: recolor("sidebarAccent", surface(94.5, 0.2), surface(20, 0.12)),
    sidebarAccentForeground: recolor(
      "sidebarAccentForeground",
      darkInk,
      lightInk
    ),
    sidebarBorder: recolor(
      "sidebarBorder",
      surface(89, 0.2),
      surface(95, 0.12) + "1a"
    ),
    sidebarRing: recolor("sidebarRing", primary, tint1),
  }
}

/** Whether the given palette is exactly the one this preset produces. */
export function isActivePreset(preset: PalettePreset, palette: ColorPalette) {
  const target = paletteFromPreset(preset)
  return (Object.keys(target) as (keyof ColorPalette)[]).every((token) => {
    const a = target[token]
    const b = palette[token]
    return (
      a.value === b.value &&
      (a.darkValue ?? a.value) === (b.darkValue ?? b.value)
    )
  })
}
