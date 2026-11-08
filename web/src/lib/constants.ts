import type {
  ColorPalette,
  Corner,
  DesignBadge,
  DesignButton,
  DesignCheckbox,
  DesignInput,
  DesignRadio,
  DesignSlider,
  DesignSwitch,
  DesignTextarea,
  Shadow,
  Typography,
} from "@/store/use-project"
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
    colors: generateColorPalette("#4E86D6"),
  },
  {
    id: crypto.randomUUID(),
    name: "Secondary",
    purpose: "secondary",
    colors: generateColorPalette("#A9C9F0"),
  },
  {
    id: crypto.randomUUID(),
    name: "Accent",
    purpose: "accent",
    colors: generateColorPalette("#1B4FA0"),
  },
  {
    id: crypto.randomUUID(),
    name: "Background",
    purpose: "background",
    colors: generateColorPalette("#F5F6F8"),
  },
  {
    id: crypto.randomUUID(),
    name: "Foreground",
    purpose: "foreground",
    colors: generateColorPalette("#0B2B57"),
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
    name: "Default",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#4E86D6" },
      { name: "Secondary", purpose: "secondary", anchor: "#A9C9F0" },
      { name: "Accent", purpose: "accent", anchor: "#1B4FA0" },
      { name: "Background", purpose: "background", anchor: "#F5F6F8" },
      { name: "Foreground", purpose: "foreground", anchor: "#0B2B57" },
      { name: "Muted", purpose: "muted", anchor: "#E7E0EC" },
      { name: "Error", purpose: "error", anchor: "#B3261E" },
      { name: "Success", purpose: "success", anchor: "#386A20" },
      { name: "Warning", purpose: "warning", anchor: "#7D5700" },
    ],
  },
  {
    name: "Everforest",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#35A77C" },
      { name: "Secondary", purpose: "secondary", anchor: "#3A94C5" },
      { name: "Accent", purpose: "accent", anchor: "#DF69BA" },
      { name: "Background", purpose: "background", anchor: "#FFFBEF" },
      { name: "Foreground", purpose: "foreground", anchor: "#5C6A72" },
      { name: "Muted", purpose: "muted", anchor: "#F2EFDF" },
      { name: "Error", purpose: "error", anchor: "#F85552" },
      { name: "Success", purpose: "success", anchor: "#8DA101" },
      { name: "Warning", purpose: "warning", anchor: "#DFA000" },
    ],
  },
  {
    name: "Everblush",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#C47FD5" },
      { name: "Secondary", purpose: "secondary", anchor: "#6CBFBF" },
      { name: "Accent", purpose: "accent", anchor: "#67B0E8" },
      { name: "Background", purpose: "background", anchor: "#DADADA" },
      { name: "Foreground", purpose: "foreground", anchor: "#141B1E" },
      { name: "Muted", purpose: "muted", anchor: "#B3B9B8" },
      { name: "Error", purpose: "error", anchor: "#E57474" },
      { name: "Success", purpose: "success", anchor: "#8CCF7E" },
      { name: "Warning", purpose: "warning", anchor: "#E5C76B" },
    ],
  },
  {
    name: "Gruvbox",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#D65D0E" },
      { name: "Secondary", purpose: "secondary", anchor: "#689D6A" },
      { name: "Accent", purpose: "accent", anchor: "#B16286" },
      { name: "Background", purpose: "background", anchor: "#FBF1C7" },
      { name: "Foreground", purpose: "foreground", anchor: "#3C3836" },
      { name: "Muted", purpose: "muted", anchor: "#EBDBB2" },
      { name: "Error", purpose: "error", anchor: "#CC241D" },
      { name: "Success", purpose: "success", anchor: "#98971A" },
      { name: "Warning", purpose: "warning", anchor: "#D79921" },
    ],
  },
  {
    name: "Catppuccin Latte",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#8839EF" },
      { name: "Secondary", purpose: "secondary", anchor: "#7287FD" },
      { name: "Accent", purpose: "accent", anchor: "#EA76CB" },
      { name: "Background", purpose: "background", anchor: "#EFF1F5" },
      { name: "Foreground", purpose: "foreground", anchor: "#4C4F69" },
      { name: "Muted", purpose: "muted", anchor: "#CCD0DA" },
      { name: "Error", purpose: "error", anchor: "#D20F39" },
      { name: "Success", purpose: "success", anchor: "#40A02B" },
      { name: "Warning", purpose: "warning", anchor: "#DF8E1D" },
    ],
  },
  {
    name: "Solarized",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#268BD2" },
      { name: "Secondary", purpose: "secondary", anchor: "#2AA198" },
      { name: "Accent", purpose: "accent", anchor: "#6C71C4" },
      { name: "Background", purpose: "background", anchor: "#FDF6E3" },
      { name: "Foreground", purpose: "foreground", anchor: "#657B83" },
      { name: "Muted", purpose: "muted", anchor: "#EEE8D5" },
      { name: "Error", purpose: "error", anchor: "#DC322F" },
      { name: "Success", purpose: "success", anchor: "#859900" },
      { name: "Warning", purpose: "warning", anchor: "#B58900" },
    ],
  },
  {
    name: "Tokyo Night",
    palettes: [
      { name: "Primary", purpose: "primary", anchor: "#2959AA" },
      { name: "Secondary", purpose: "secondary", anchor: "#385F0D" },
      { name: "Accent", purpose: "accent", anchor: "#965027" },
      { name: "Background", purpose: "background", anchor: "#E6E7ED" },
      { name: "Foreground", purpose: "foreground", anchor: "#343B58" },
      { name: "Muted", purpose: "muted", anchor: "#6C6E75" },
      { name: "Error", purpose: "error", anchor: "#8C4351" },
      { name: "Success", purpose: "success", anchor: "#33635C" },
      { name: "Warning", purpose: "warning", anchor: "#8F5E15" },
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

export const DESIGN_BUTTON_STARTER_PACKS = {
  cornerName: "Full",
  typographyName: "Label Large",
  shadowName: "none",
  variants: [
    {
      variant: "default",
      background: "primary::500",
      foreground: "primary::50",
      border: "transparent",
    },
    {
      variant: "outline",
      background: "transparent",
      foreground: "primary::500",
      border: "primary::300",
    },
    {
      variant: "secondary",
      background: "primary::100",
      foreground: "primary::900",
      border: "transparent",
    },
    {
      variant: "ghost",
      background: "transparent",
      foreground: "primary::500",
      border: "transparent",
    },
    {
      variant: "destructive",
      background: "error::100",
      foreground: "error::500",
      border: "transparent",
    },
    {
      variant: "link",
      background: "transparent",
      foreground: "primary::500",
      border: "transparent",
    },
    {
      variant: "error",
      background: "error::500",
      foreground: "error::50",
      border: "transparent",
    },
    {
      variant: "warning",
      background: "warning::500",
      foreground: "warning::50",
      border: "transparent",
    },
    {
      variant: "success",
      background: "success::500",
      foreground: "success::50",
      border: "transparent",
    },
  ],
  sizes: [
    { size: "xs", paddingX: 10, paddingY: 4 },
    { size: "sm", paddingX: 12, paddingY: 6 },
    { size: "default", paddingX: 10, paddingY: 8 },
    { size: "lg", paddingX: 16, paddingY: 10 },
  ],
}

/** Resolve button starter pack name refs to actual token IDs */
export function resolveDesignButtonStarterPacks(
  corners: Corner[],
  shadows: Shadow[],
  typographies: Typography[]
): DesignButton {
  const corner = corners.find(
    (c) => c.name === DESIGN_BUTTON_STARTER_PACKS.cornerName
  )
  const shadow = shadows.find(
    (s) => s.name === DESIGN_BUTTON_STARTER_PACKS.shadowName
  )
  const typo = typographies.find(
    (t) => t.name === DESIGN_BUTTON_STARTER_PACKS.typographyName
  )
  return {
    cornerId: corner?.id ?? corners[0]?.id ?? "",
    typographyId: typo?.id ?? typographies[0]?.id ?? "",
    shadowId: shadow?.id ?? "none",
    variants: DESIGN_BUTTON_STARTER_PACKS.variants as DesignButton["variants"],
    sizes: DESIGN_BUTTON_STARTER_PACKS.sizes as DesignButton["sizes"],
  }
}

export const DESIGN_INPUT_STARTER_PACKS: (Omit<
  DesignInput,
  "cornerId" | "typographyId" | "shadowId"
> & {
  cornerName: string
  typographyName: string
  shadowName: string
})[] = [
  // ── default ──
  {
    state: "default",
    background: "background::50",
    foreground: "foreground::900",
    border: "muted::600",
    placeholder: "muted::700",
    label: "foreground::900",
    helper: "muted::700",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
  },
  // ── focus ──
  {
    state: "focus",
    background: "background::50",
    foreground: "foreground::900",
    border: "primary::500",
    placeholder: "muted::700",
    label: "foreground::900",
    helper: "muted::700",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
  },
  // ── error ──
  {
    state: "error",
    background: "background::50",
    foreground: "foreground::900",
    border: "error::500",
    placeholder: "muted::700",
    label: "foreground::900",
    helper: "error::600",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
  },
  // ── disabled ──
  {
    state: "disabled",
    background: "muted::200",
    foreground: "muted::600",
    border: "muted::600",
    placeholder: "muted::500",
    label: "muted::600",
    helper: "muted::500",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
  },
]

/** Resolve input starter pack name refs to actual token IDs */
export function resolveDesignInputStarterPacks(
  corners: Corner[],
  shadows: Shadow[],
  typographies: Typography[]
): DesignInput[] {
  return DESIGN_INPUT_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow =
      pack.shadowName === "none"
        ? undefined
        : shadows.find((s) => s.name === pack.shadowName)
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

export const DESIGN_TEXTAREA_STARTER_PACKS: (Omit<
  DesignTextarea,
  "cornerId" | "typographyId" | "shadowId"
> & {
  cornerName: string
  typographyName: string
  shadowName: string
})[] = [
  // ── default ──
  {
    state: "default",
    background: "background::50",
    foreground: "foreground::900",
    border: "muted::600",
    placeholder: "muted::700",
    label: "foreground::900",
    helper: "muted::700",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
    minHeight: 96,
  },
  // ── focus ──
  {
    state: "focus",
    background: "background::50",
    foreground: "foreground::900",
    border: "primary::500",
    placeholder: "muted::700",
    label: "foreground::900",
    helper: "muted::700",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
    minHeight: 96,
  },
  // ── error ──
  {
    state: "error",
    background: "background::50",
    foreground: "foreground::900",
    border: "error::500",
    placeholder: "muted::700",
    label: "foreground::900",
    helper: "error::600",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
    minHeight: 96,
  },
  // ── disabled ──
  {
    state: "disabled",
    background: "muted::200",
    foreground: "muted::600",
    border: "muted::600",
    placeholder: "muted::500",
    label: "muted::600",
    helper: "muted::500",
    cornerName: "Medium",
    typographyName: "Body Medium",
    shadowName: "none",
    paddingX: 12,
    paddingY: 8,
    minHeight: 96,
  },
]

/** Resolve textarea starter pack name refs to actual token IDs */
export function resolveDesignTextareaStarterPacks(
  corners: Corner[],
  shadows: Shadow[],
  typographies: Typography[]
): DesignTextarea[] {
  return DESIGN_TEXTAREA_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow =
      pack.shadowName === "none"
        ? undefined
        : shadows.find((s) => s.name === pack.shadowName)
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
      minHeight: pack.minHeight,
    }
  })
}

export const DESIGN_BADGE_STARTER_PACKS: (Omit<
  DesignBadge,
  "cornerId" | "typographyId" | "shadowId"
> & {
  cornerName: string
  typographyName: string
  shadowName: string
})[] = [
  // ── default ──
  {
    variant: "default",
    background: "primary::500",
    foreground: "primary::50",
    border: "transparent",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
  // ── secondary ──
  {
    variant: "secondary",
    background: "primary::100",
    foreground: "primary::900",
    border: "transparent",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
  // ── destructive ──
  {
    variant: "destructive",
    background: "error::100",
    foreground: "error::500",
    border: "transparent",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
  // ── error ──
  {
    variant: "error",
    background: "error::500",
    foreground: "error::50",
    border: "transparent",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
  // ── warning ──
  {
    variant: "warning",
    background: "warning::500",
    foreground: "warning::50",
    border: "transparent",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
  // ── success ──
  {
    variant: "success",
    background: "success::500",
    foreground: "success::50",
    border: "transparent",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
  // ── outline ──
  {
    variant: "outline",
    background: "transparent",
    foreground: "foreground::900",
    border: "muted::600",
    cornerName: "Full",
    typographyName: "Label Medium",
    shadowName: "none",
    paddingX: 8,
    paddingY: 2,
  },
]

/** Resolve badge starter pack name refs to actual token IDs */
export function resolveDesignBadgeStarterPacks(
  corners: Corner[],
  shadows: Shadow[],
  typographies: Typography[]
): DesignBadge[] {
  return DESIGN_BADGE_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow =
      pack.shadowName === "none"
        ? undefined
        : shadows.find((s) => s.name === pack.shadowName)
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

export const DESIGN_CHECKBOX_STARTER_PACKS: (Omit<
  DesignCheckbox,
  "cornerId" | "shadowId"
> & {
  cornerName: string
  shadowName: string
})[] = [
  // ── default (unchecked) ──
  {
    state: "default",
    background: "muted::100",
    foreground: "transparent",
    border: "muted::600",
    cornerName: "Small",
    shadowName: "none",
    size: 16,
  },
  // ── checked ──
  {
    state: "checked",
    background: "primary::500",
    foreground: "primary::50",
    border: "primary::500",
    cornerName: "Small",
    shadowName: "none",
    size: 16,
  },
  // ── indeterminate ──
  {
    state: "indeterminate",
    background: "primary::500",
    foreground: "primary::50",
    border: "primary::500",
    cornerName: "Small",
    shadowName: "none",
    size: 16,
  },
  // ── disabled ──
  {
    state: "disabled",
    background: "muted::200",
    foreground: "muted::600",
    border: "muted::600",
    cornerName: "Small",
    shadowName: "none",
    size: 16,
  },
]

/** Resolve checkbox starter pack name refs to actual token IDs */
export function resolveDesignCheckboxStarterPacks(
  corners: Corner[],
  shadows: Shadow[]
): DesignCheckbox[] {
  return DESIGN_CHECKBOX_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow =
      pack.shadowName === "none"
        ? undefined
        : shadows.find((s) => s.name === pack.shadowName)
    return {
      state: pack.state,
      background: pack.background,
      foreground: pack.foreground,
      border: pack.border,
      cornerId: corner?.id ?? corners[0]?.id ?? "",
      shadowId: shadow?.id ?? "none",
      size: pack.size,
    }
  })
}

export const DESIGN_RADIO_STARTER_PACKS: (Omit<
  DesignRadio,
  "cornerId" | "shadowId"
> & {
  cornerName: string
  shadowName: string
})[] = [
  // ── default (unchecked) ──
  {
    state: "default",
    background: "muted::100",
    foreground: "transparent",
    border: "muted::600",
    cornerName: "Full",
    shadowName: "none",
    size: 16,
  },
  // ── checked ──
  {
    state: "checked",
    background: "primary::500",
    foreground: "primary::50",
    border: "primary::500",
    cornerName: "Full",
    shadowName: "none",
    size: 16,
  },
  // ── disabled ──
  {
    state: "disabled",
    background: "muted::200",
    foreground: "muted::600",
    border: "muted::600",
    cornerName: "Full",
    shadowName: "none",
    size: 16,
  },
]

/** Resolve radio starter pack name refs to actual token IDs */
export function resolveDesignRadioStarterPacks(
  corners: Corner[],
  shadows: Shadow[]
): DesignRadio[] {
  return DESIGN_RADIO_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow =
      pack.shadowName === "none"
        ? undefined
        : shadows.find((s) => s.name === pack.shadowName)
    return {
      state: pack.state,
      background: pack.background,
      foreground: pack.foreground,
      border: pack.border,
      cornerId: corner?.id ?? corners[0]?.id ?? "",
      shadowId: shadow?.id ?? "none",
      size: pack.size,
    }
  })
}

export const DESIGN_SLIDER_STARTER_PACKS = {
  background: "muted::600",
  foreground: "primary::500",
  thumb: "background::50",
  cornerName: "Extra Large",
  thumbShadowName: "Shadow Small",
  height: 4,
  thumbSize: 16,
}

/** Resolve slider starter pack name refs to actual token IDs */
export function resolveDesignSliderStarterPacks(
  corners: Corner[],
  shadows: Shadow[]
): DesignSlider {
  const corner = corners.find(
    (c) => c.name === DESIGN_SLIDER_STARTER_PACKS.cornerName
  )
  const thumbShadow = shadows.find(
    (s) => s.name === DESIGN_SLIDER_STARTER_PACKS.thumbShadowName
  )
  return {
    background: DESIGN_SLIDER_STARTER_PACKS.background,
    foreground: DESIGN_SLIDER_STARTER_PACKS.foreground,
    thumb: DESIGN_SLIDER_STARTER_PACKS.thumb,
    cornerId: corner?.id ?? corners[0]?.id ?? "",
    thumbShadowId: thumbShadow?.id ?? "none",
    height: DESIGN_SLIDER_STARTER_PACKS.height,
    thumbSize: DESIGN_SLIDER_STARTER_PACKS.thumbSize,
  }
}

export const DESIGN_SWITCH_STARTER_PACKS: (Omit<
  DesignSwitch,
  "cornerId" | "shadowId"
> & {
  cornerName: string
  shadowName: string
})[] = [
  // ── default (off) ──
  {
    state: "default",
    background: "muted::600",
    foreground: "background::50",
    border: "transparent",
    cornerName: "Full",
    shadowName: "none",
    size: 24,
  },
  // ── checked (on) ──
  {
    state: "checked",
    background: "primary::500",
    foreground: "primary::50",
    border: "transparent",
    cornerName: "Full",
    shadowName: "none",
    size: 24,
  },
  // ── disabled ──
  {
    state: "disabled",
    background: "muted::300",
    foreground: "muted::600",
    border: "muted::600",
    cornerName: "Full",
    shadowName: "none",
    size: 24,
  },
]

/** Resolve switch starter pack name refs to actual token IDs */
export function resolveDesignSwitchStarterPacks(
  corners: Corner[],
  shadows: Shadow[]
): DesignSwitch[] {
  return DESIGN_SWITCH_STARTER_PACKS.map((pack) => {
    const corner = corners.find((c) => c.name === pack.cornerName)
    const shadow =
      pack.shadowName === "none"
        ? undefined
        : shadows.find((s) => s.name === pack.shadowName)
    return {
      state: pack.state,
      background: pack.background,
      foreground: pack.foreground,
      border: pack.border,
      cornerId: corner?.id ?? corners[0]?.id ?? "",
      shadowId: shadow?.id ?? "none",
      size: pack.size,
    }
  })
}
