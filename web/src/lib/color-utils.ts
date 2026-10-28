import type { Color } from "@/store/use-project"

/** Parse hex string (#rrggbb or #rgb) to [r, g, b] 0-255 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean
  const num = parseInt(full, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/** Convert [r, g, b] 0-255 to HSL [h°, s%, l%] */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  return [h, Math.round(s * 100), Math.round(l * 100)]
}

/** Convert HSL [h°, s%, l%] to hex string */
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

/** Convert hex to "r, g, b" string */
function hexToRgbString(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  return `${r}, ${g}, ${b}`
}

/**
 * Generate a 10-step color palette (50–900) from a single anchor hex at level 500.
 * Lighter levels (50–400) increase lightness, darker levels (600–900) decrease it.
 * Saturation is kept close to the anchor but slightly boosted for darker shades.
 */
export function generateColorPalette(anchorHex: string): Color[] {
  const [r, g, b] = hexToRgb(anchorHex)
  const [h, s, l] = rgbToHsl(r, g, b)

  // Level name → [lightness offset from anchor, saturation multiplier]
  const stops: {
    level: Color["level"]
    lOffset: number
    sMultiplier: number
  }[] = [
    { level: "50", lOffset: 45, sMultiplier: 0.4 },
    { level: "100", lOffset: 38, sMultiplier: 0.5 },
    { level: "200", lOffset: 28, sMultiplier: 0.65 },
    { level: "300", lOffset: 18, sMultiplier: 0.8 },
    { level: "400", lOffset: 10, sMultiplier: 0.9 },
    { level: "500", lOffset: 0, sMultiplier: 1.0 }, // anchor
    { level: "600", lOffset: -9, sMultiplier: 1.05 },
    { level: "700", lOffset: -18, sMultiplier: 1.1 },
    { level: "800", lOffset: -28, sMultiplier: 1.1 },
    { level: "900", lOffset: -38, sMultiplier: 1.05 },
  ]

  return stops.map(({ level, lOffset, sMultiplier }) => {
    const newL = Math.min(97, Math.max(5, l + lOffset))
    const newS = Math.min(100, Math.max(0, Math.round(s * sMultiplier)))
    const hex = hslToHex(h, newS, newL)
    return {
      level,
      hex,
      rgb: hexToRgbString(hex),
    }
  })
}

/** Determine whether to use black or white text on a given hex background */
export function getContrastColor(hex: string): "black" | "white" {
  const [r, g, b] = hexToRgb(hex)
  // Perceived luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? "black" : "white"
}

/** Check if a string is a valid 6-digit hex color */
export function isValidHex(hex: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(hex)
}
