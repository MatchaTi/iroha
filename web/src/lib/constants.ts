import type { ColorPalette, Corner, Shadow, Typography } from "@/store/use-project"
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
