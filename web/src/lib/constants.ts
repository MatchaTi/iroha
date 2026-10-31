import type { ColorPalette, Corner, DesignBadge, DesignButton, DesignInput, Shadow, Typography } from "@/store/use-project"
import { generateColorPalette } from "./color-utils"

export const PROJECT_NAME = "Iroha"

export const FONTS = [
  { label: "Google Sans Flex", value: "Google Sans Flex Variable" },
  { label: "Inter", value: "Inter Variable" },
  { label: "Architects Daughter", value: "Architects Daughter" },
  { label: "Source Code Pro", value: "Source Code Pro Variable" },
]
export const PROJECT_NAME_JP = "いろは"
export const TYPOGRAPHY_STATER_PACKS: Typography[] = [
  // Display
  {
    id: crypto.randomUUID(),
    name: "Display Large",
    purpose: "display",
    level: "large",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 57,
    fontWeight: "Regular",
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  {
    id: crypto.randomUUID(),
    name: "Display Medium",
    purpose: "display",
    level: "medium",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 45,
    fontWeight: "Regular",
    lineHeight: 52,
    letterSpacing: 0,
  },
  {
    id: crypto.randomUUID(),
    name: "Display Small",
    purpose: "display",
    level: "small",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 36,
    fontWeight: "Regular",
    lineHeight: 44,
    letterSpacing: 0,
  },

  // Headline
  {
    id: crypto.randomUUID(),
    name: "Headline Large",
    purpose: "headline",
    level: "large",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 32,
    fontWeight: "Regular",
    lineHeight: 40,
    letterSpacing: 0,
  },
  {
    id: crypto.randomUUID(),
    name: "Headline Medium",
    purpose: "headline",
    level: "medium",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 28,
    fontWeight: "Regular",
    lineHeight: 36,
    letterSpacing: 0,
  },
  {
    id: crypto.randomUUID(),
    name: "Headline Small",
    purpose: "headline",
    level: "small",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 24,
    fontWeight: "Regular",
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Title
  {
    id: crypto.randomUUID(),
    name: "Title Large",
    purpose: "title",
    level: "large",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 22,
    fontWeight: "Regular",
    lineHeight: 28,
    letterSpacing: 0,
  },
  {
    id: crypto.randomUUID(),
    name: "Title Medium",
    purpose: "title",
    level: "medium",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 16,
    fontWeight: "Medium",
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  {
    id: crypto.randomUUID(),
    name: "Title Small",
    purpose: "title",
    level: "small",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 14,
    fontWeight: "Medium",
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Label
  {
    id: crypto.randomUUID(),
    name: "Label Large",
    purpose: "label",
    level: "large",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 14,
    fontWeight: "Medium",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  {
    id: crypto.randomUUID(),
    name: "Label Medium",
    purpose: "label",
    level: "medium",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 12,
    fontWeight: "Medium",
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  {
    id: crypto.randomUUID(),
    name: "Label Small",
    purpose: "label",
    level: "small",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 11,
    fontWeight: "Medium",
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  // Body
  {
    id: crypto.randomUUID(),
    name: "Body Large",
    purpose: "body",
    level: "large",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 16,
    fontWeight: "Regular",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  {
    id: crypto.randomUUID(),
    name: "Body Medium",
    purpose: "body",
    level: "medium",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 14,
    fontWeight: "Regular",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  {
    id: crypto.randomUUID(),
    name: "Body Small",
    purpose: "body",
    level: "small",
    fontFamily: "Google Sans Flex Variable",
    fontSize: 12,
    fontWeight: "Regular",
    lineHeight: 16,
    letterSpacing: 0.4,
  },
]

export const COLOR_PALETTE_STARTER_PACKS: ColorPalette[] = [
  {
    id: crypto.randomUUID(),
    name: "Primary",
    purpose: "primary",
    colors: generateColorPalette("#6750A4"),
  },
  {
    id: crypto.randomUUID(),
    name: "Secondary",
    purpose: "secondary",
    colors: generateColorPalette("#625B71"),
  },
  {
    id: crypto.randomUUID(),
    name: "Accent",
    purpose: "accent",
    colors: generateColorPalette("#7D5260"),
  },
  {
    id: crypto.randomUUID(),
    name: "Background",
    purpose: "background",
    colors: generateColorPalette("#FEF7FF"),
  },
  {
    id: crypto.randomUUID(),
    name: "Foreground",
    purpose: "foreground",
    colors: generateColorPalette("#1C1B1F"),
  },
  {
    id: crypto.randomUUID(),
    name: "Muted",
    purpose: "muted",
    colors: generateColorPalette("#E7E0EC"),
  },
  {
    id: crypto.randomUUID(),
    name: "Error",
    purpose: "error",
    colors: generateColorPalette("#B3261E"),
  },
  {
    id: crypto.randomUUID(),
    name: "Success",
    purpose: "success",
    colors: generateColorPalette("#386A20"),
  },
  {
    id: crypto.randomUUID(),
    name: "Warning",
    purpose: "warning",
    colors: generateColorPalette("#7D5700"),
  },
]

/** A color preset is a named collection of anchor hex values (one per palette role) */
export type ColorPreset = {
  name: string
  palettes: { name: string; purpose: ColorPalette["purpose"]; anchor: string }[]
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Material You",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#6750A4" },
      { name: "Secondary", purpose: "secondary", anchor: "#625B71" },
      { name: "Accent", purpose: "accent", anchor: "#7D5260" },
      { name: "Background", purpose: "background", anchor: "#FEF7FF" },
      { name: "Foreground", purpose: "foreground", anchor: "#1C1B1F" },
      { name: "Muted", purpose: "muted", anchor: "#E7E0EC" },
      { name: "Error", purpose: "error", anchor: "#B3261E" },
      { name: "Success", purpose: "success", anchor: "#386A20" },
      { name: "Warning", purpose: "warning", anchor: "#7D5700" },
    ],
  },
  {
    name: "Ocean",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#0077B6" },
      { name: "Secondary", purpose: "secondary", anchor: "#00B4D8" },
      { name: "Accent", purpose: "accent", anchor: "#90E0EF" },
      { name: "Background", purpose: "background", anchor: "#F0F9FF" },
      { name: "Foreground", purpose: "foreground", anchor: "#0C1E2F" },
      { name: "Muted", purpose: "muted", anchor: "#E0F0F8" },
      { name: "Error", purpose: "error", anchor: "#C1121F" },
      { name: "Success", purpose: "success", anchor: "#2D6A4F" },
      { name: "Warning", purpose: "warning", anchor: "#D9770E" },
    ],
  },
  {
    name: "Forest",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#386641" },
      { name: "Secondary", purpose: "secondary", anchor: "#6A994E" },
      { name: "Accent", purpose: "accent", anchor: "#A7C957" },
      { name: "Background", purpose: "background", anchor: "#F5F7F2" },
      { name: "Foreground", purpose: "foreground", anchor: "#1A2E14" },
      { name: "Muted", purpose: "muted", anchor: "#E5E9DC" },
      { name: "Error", purpose: "error", anchor: "#BC4749" },
      { name: "Success", purpose: "success", anchor: "#3A7D44" },
      { name: "Warning", purpose: "warning", anchor: "#CB8B2A" },
    ],
  },
  {
    name: "Sunset",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#E63946" },
      { name: "Secondary", purpose: "secondary", anchor: "#F4A261" },
      { name: "Accent", purpose: "accent", anchor: "#E9C46A" },
      { name: "Background", purpose: "background", anchor: "#FFF8F0" },
      { name: "Foreground", purpose: "foreground", anchor: "#2D1B0E" },
      { name: "Muted", purpose: "muted", anchor: "#F5E6D8" },
      { name: "Error", purpose: "error", anchor: "#9B1B30" },
      { name: "Success", purpose: "success", anchor: "#2A9D8F" },
      { name: "Warning", purpose: "warning", anchor: "#E76F51" },
    ],
  },
  {
    name: "Monochrome",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#1A1A2E" },
      { name: "Secondary", purpose: "secondary", anchor: "#16213E" },
      { name: "Accent", purpose: "accent", anchor: "#0F3460" },
      { name: "Background", purpose: "background", anchor: "#FFFFFF" },
      { name: "Foreground", purpose: "foreground", anchor: "#1A1A2E" },
      { name: "Muted", purpose: "muted", anchor: "#E8E8E8" },
      { name: "Error", purpose: "error", anchor: "#E43F5A" },
      { name: "Success", purpose: "success", anchor: "#28A745" },
      { name: "Warning", purpose: "warning", anchor: "#FFC107" },
    ],
  },
  {
    name: "Rose",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#C9184A" },
      { name: "Secondary", purpose: "secondary", anchor: "#FF4D6D" },
      { name: "Accent", purpose: "accent", anchor: "#FF85A1" },
      { name: "Background", purpose: "background", anchor: "#FFF5F7" },
      { name: "Foreground", purpose: "foreground", anchor: "#2D0A14" },
      { name: "Muted", purpose: "muted", anchor: "#FCE4EC" },
      { name: "Error", purpose: "error", anchor: "#9D0208" },
      { name: "Success", purpose: "success", anchor: "#40916C" },
      { name: "Warning", purpose: "warning", anchor: "#E9943A" },
    ],
  },
  {
    name: "Nordic",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#5E81AC" },
      { name: "Secondary", purpose: "secondary", anchor: "#81A1C1" },
      { name: "Accent", purpose: "accent", anchor: "#88C0D0" },
      { name: "Background", purpose: "background", anchor: "#ECEFF4" },
      { name: "Foreground", purpose: "foreground", anchor: "#2E3440" },
      { name: "Muted", purpose: "muted", anchor: "#D8DEE9" },
      { name: "Error", purpose: "error", anchor: "#BF616A" },
      { name: "Success", purpose: "success", anchor: "#A3BE8C" },
      { name: "Warning", purpose: "warning", anchor: "#EBCB8B" },
    ],
  },
  {
    name: "Autumn",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#9C4221" },
      { name: "Secondary", purpose: "secondary", anchor: "#C05621" },
      { name: "Accent", purpose: "accent", anchor: "#DD6B20" },
      { name: "Background", purpose: "background", anchor: "#FFF8F1" },
      { name: "Foreground", purpose: "foreground", anchor: "#2D1A0A" },
      { name: "Muted", purpose: "muted", anchor: "#F0E6D6" },
      { name: "Error", purpose: "error", anchor: "#822727" },
      { name: "Success", purpose: "success", anchor: "#276749" },
      { name: "Warning", purpose: "warning", anchor: "#B7791F" },
    ],
  },
]

export const CORNER_STARTER_PACKS: Corner[] = [
  { id: crypto.randomUUID(), name: "None", radius: 0 },
  { id: crypto.randomUUID(), name: "Extra Small", radius: 2 },
  { id: crypto.randomUUID(), name: "Small", radius: 4 },
  { id: crypto.randomUUID(), name: "Medium", radius: 8 },
  { id: crypto.randomUUID(), name: "Large", radius: 12 },
  { id: crypto.randomUUID(), name: "Extra Large", radius: 16 },
  { id: crypto.randomUUID(), name: "Full", radius: 99 },
]

export const SHADOW_STARTER_PACKS: Shadow[] = [
  {
    id: crypto.randomUUID(),
    name: "Shadow Small",
    x: 0,
    y: 1,
    blur: 3,
    spread: 0,
    color: "#0000001f",
  },
  {
    id: crypto.randomUUID(),
    name: "Shadow Medium",
    x: 0,
    y: 4,
    blur: 12,
    spread: 0,
    color: "#00000029",
  },
  {
    id: crypto.randomUUID(),
    name: "Shadow Large",
    x: 0,
    y: 8,
    blur: 24,
    spread: 0,
    color: "#00000033",
  },
]

export const DESIGN_BUTTON_STARTER_PACKS: Omit<DesignButton, "cornerId" | "typographyId" | "shadowId"> & {
  cornerName: string
  typographyName: string
  shadowName: string
}[] = [
  // ── default ──
  { variant: "default", size: "xs",      background: "primary::500",  foreground: "primary::50",   border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "default", size: "sm",      background: "primary::500",  foreground: "primary::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "default", size: "default", background: "primary::500",  foreground: "primary::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "default", size: "lg",      background: "primary::500",  foreground: "primary::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── outline ──
  { variant: "outline", size: "xs",      background: "transparent",   foreground: "primary::500",  border: "primary::300", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "outline", size: "sm",      background: "transparent",   foreground: "primary::500",  border: "primary::300", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "outline", size: "default", background: "transparent",   foreground: "primary::500",  border: "primary::300", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "outline", size: "lg",      background: "transparent",   foreground: "primary::500",  border: "primary::300", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── secondary ──
  { variant: "secondary", size: "xs",      background: "primary::100",  foreground: "primary::900",  border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "secondary", size: "sm",      background: "primary::100",  foreground: "primary::900",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "secondary", size: "default", background: "primary::100",  foreground: "primary::900",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "secondary", size: "lg",      background: "primary::100",  foreground: "primary::900",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── ghost ──
  { variant: "ghost", size: "xs",      background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "ghost", size: "sm",      background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "ghost", size: "default", background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "ghost", size: "lg",      background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── destructive ──
  { variant: "destructive", size: "xs",      background: "error::100",  foreground: "error::500",  border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY:  4 },
  { variant: "destructive", size: "sm",      background: "error::100",  foreground: "error::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY:  6 },
  { variant: "destructive", size: "default", background: "error::100",  foreground: "error::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY:  8 },
  { variant: "destructive", size: "lg",      background: "error::100",  foreground: "error::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── link ──
  { variant: "link", size: "xs",      background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "link", size: "sm",      background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "link", size: "default", background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "link", size: "lg",      background: "transparent",   foreground: "primary::500",  border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── error ──
  { variant: "error", size: "xs",      background: "error::500",  foreground: "error::50",   border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "error", size: "sm",      background: "error::500",  foreground: "error::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "error", size: "default", background: "error::500",  foreground: "error::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "error", size: "lg",      background: "error::500",  foreground: "error::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── warning ──
  { variant: "warning", size: "xs",      background: "warning::500",  foreground: "warning::50",   border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "warning", size: "sm",      background: "warning::500",  foreground: "warning::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "warning", size: "default", background: "warning::500",  foreground: "warning::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "warning", size: "lg",      background: "warning::500",  foreground: "warning::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
  // ── success ──
  { variant: "success", size: "xs",      background: "success::500",  foreground: "success::50",   border: "transparent", cornerName: "Full", typographyName: "Label Medium",  shadowName: "none", paddingX: 10, paddingY: 4 },
  { variant: "success", size: "sm",      background: "success::500",  foreground: "success::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 12, paddingY: 6 },
  { variant: "success", size: "default", background: "success::500",  foreground: "success::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 10, paddingY: 8 },
  { variant: "success", size: "lg",      background: "success::500",  foreground: "success::50",   border: "transparent", cornerName: "Full", typographyName: "Label Large",  shadowName: "none", paddingX: 16, paddingY: 10 },
]

/** Resolve starter pack name refs to actual token IDs from project data */
export function resolveDesignButtonStarterPacks(
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): DesignButton[] {
  return DESIGN_BUTTON_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow = pack.shadowName === "none" ? undefined : shadows.find((s) => s.name === pack.shadowName)
    // Match typography by name — for sizes, prefer label that matches button size
    const typo = typographies.find((t) => t.name === pack.typographyName)
    return {
      variant: pack.variant,
      size: pack.size,
      background: pack.background,
      foreground: pack.foreground,
      border: pack.border,
      cornerId: corner?.id ?? corners[0]?.id ?? "",
      typographyId: typo?.id ?? typographies[0]?.id ?? "",
      shadowId: shadow?.id ?? "none",
      paddingX: pack.paddingX,
      paddingY: pack.paddingY,
    }
  })
}

export const DESIGN_INPUT_STARTER_PACKS: Omit<DesignInput, "cornerId" | "typographyId" | "shadowId"> & {
  cornerName: string
  typographyName: string
  shadowName: string
}[] = [
  // ── default ──
  { state: "default", background: "background::50",  foreground: "foreground::900", border: "muted::300",     placeholder: "muted::500",   label: "foreground::900", helper: "muted::500",   cornerName: "Medium", typographyName: "Body Medium", shadowName: "none", paddingX: 12, paddingY: 8 },
  // ── focus ──
  { state: "focus",    background: "background::50",  foreground: "foreground::900", border: "primary::500",   placeholder: "muted::500",   label: "foreground::900", helper: "muted::500",   cornerName: "Medium", typographyName: "Body Medium", shadowName: "none", paddingX: 12, paddingY: 8 },
  // ── error ──
  { state: "error",    background: "background::50",  foreground: "foreground::900", border: "error::500",     placeholder: "muted::500",   label: "foreground::900", helper: "error::500",   cornerName: "Medium", typographyName: "Body Medium", shadowName: "none", paddingX: 12, paddingY: 8 },
  // ── disabled ──
  { state: "disabled", background: "muted::100",      foreground: "muted::400",       border: "muted::200",     placeholder: "muted::300",   label: "muted::400",      helper: "muted::300",   cornerName: "Medium", typographyName: "Body Medium", shadowName: "none", paddingX: 12, paddingY: 8 },
]

/** Resolve input starter pack name refs to actual token IDs */
export function resolveDesignInputStarterPacks(
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): DesignInput[] {
  return DESIGN_INPUT_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow = pack.shadowName === "none" ? undefined : shadows.find((s) => s.name === pack.shadowName)
    const typo = typographies.find((t) => t.name === pack.typographyName)
    return {
      state: pack.state,
      background: pack.background,
      foreground: pack.foreground,
      border: pack.border,
      placeholder: pack.placeholder,
      label: pack.label,
      helper: pack.helper,
      cornerId: corner?.id ?? corners[0]?.id ?? "",
      typographyId: typo?.id ?? typographies[0]?.id ?? "",
      shadowId: shadow?.id ?? "none",
      paddingX: pack.paddingX,
      paddingY: pack.paddingY,
    }
  })
}

export const DESIGN_BADGE_STARTER_PACKS: Omit<DesignBadge, "cornerId" | "typographyId" | "shadowId"> & {
  cornerName: string
  typographyName: string
  shadowName: string
}[] = [
  // ── default ──
  { variant: "default",    background: "primary::500",  foreground: "primary::50",  border: "transparent", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
  // ── secondary ──
  { variant: "secondary",  background: "primary::100",  foreground: "primary::900", border: "transparent", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
  // ── destructive ──
  { variant: "destructive", background: "error::100",   foreground: "error::500",   border: "transparent", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
  // ── error ──
  { variant: "error",       background: "error::500",    foreground: "error::50",    border: "transparent", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
  // ── warning ──
  { variant: "warning",     background: "warning::500", foreground: "warning::50",  border: "transparent", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
  // ── success ──
  { variant: "success",     background: "success::500", foreground: "success::50",  border: "transparent", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
  // ── outline ──
  { variant: "outline",     background: "transparent",  foreground: "foreground::900", border: "muted::300", cornerName: "Full", typographyName: "Label Medium", shadowName: "none", paddingX: 8, paddingY: 2 },
]

/** Resolve badge starter pack name refs to actual token IDs */
export function resolveDesignBadgeStarterPacks(
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): DesignBadge[] {
  return DESIGN_BADGE_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow = pack.shadowName === "none" ? undefined : shadows.find((s) => s.name === pack.shadowName)
    const typo = typographies.find((t) => t.name === pack.typographyName)
    return {
      variant: pack.variant,
      background: pack.background,
      foreground: pack.foreground,
      border: pack.border,
      cornerId: corner?.id ?? corners[0]?.id ?? "",
      typographyId: typo?.id ?? typographies[0]?.id ?? "",
      shadowId: shadow?.id ?? "none",
      paddingX: pack.paddingX,
      paddingY: pack.paddingY,
    }
  })
}
