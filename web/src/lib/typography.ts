import type { CSSProperties } from "react"
import type { Typography } from "@/store/use-project"

type Purpose = Typography["purpose"]
type Level = Typography["level"]

/** Cari typography berdasarkan id token. */
export function findTypographyById(
  typos: Typography[],
  id?: string
): Typography | undefined {
  if (!id) return undefined
  return typos.find((t) => t.id === id)
}

/** Cari typography berdasarkan purpose + level, mis. label/large. */
export function findTypographyByRole(
  typos: Typography[],
  purpose: Purpose,
  level: Level
): Typography | undefined {
  return typos.find((t) => t.purpose === purpose && t.level === level)
}

/**
 * Typography untuk label kontrol (checkbox, radio, switch).
 * Mengikuti fallback yang sama dengan plugin Figma:
 * Label Large → Label Medium → Body Medium → fallback → token pertama.
 */
export function resolveLabelTypography(
  typos: Typography[],
  fallback?: Typography
): Typography | undefined {
  return (
    findTypographyByRole(typos, "label", "large") ??
    findTypographyByRole(typos, "label", "medium") ??
    findTypographyByRole(typos, "body", "medium") ??
    fallback ??
    typos[0]
  )
}

/**
 * Typography untuk helper/caption, mis. helper text pada input.
 * Body Small → Body Medium → fallback → label default.
 */
export function resolveHelperTypography(
  typos: Typography[],
  fallback?: Typography
): Typography | undefined {
  return (
    findTypographyByRole(typos, "body", "small") ??
    findTypographyByRole(typos, "body", "medium") ??
    fallback ??
    resolveLabelTypography(typos)
  )
}

const FONT_WEIGHTS: Record<string, number> = {
  thin: 100,
  "extra light": 200,
  extralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  book: 400,
  medium: 500,
  "semi bold": 600,
  semibold: 600,
  "demi bold": 600,
  demibold: 600,
  bold: 700,
  "extra bold": 800,
  extrabold: 800,
  black: 900,
}

/**
 * Token menyimpan fontWeight sebagai nama ("Regular", "Medium", ...),
 * sedangkan CSS membutuhkan angka. Konversi agar weight benar-benar dipakai.
 */
export function fontWeightValue(weight?: string): number | undefined {
  if (!weight) return undefined
  const normalized = weight.trim().toLowerCase().replace(/[-_]+/g, " ")
  return FONT_WEIGHTS[normalized]
}

/** Ubah token Typography menjadi style CSS untuk preview React. */
export function typographyStyle(typo?: Typography): CSSProperties {
  if (!typo) return {}
  return {
    fontFamily: typo.fontFamily,
    fontSize: typo.fontSize,
    fontWeight: fontWeightValue(typo.fontWeight),
    lineHeight: typo.lineHeight ? `${typo.lineHeight}px` : undefined,
    letterSpacing: typo.letterSpacing ? `${typo.letterSpacing}px` : undefined,
  }
}
