import type { ColorPalette } from "@/store/use-design"

/**
 * Default palette seeded from the shadcn theme tokens in `@/index.css`
 * (oklch values converted to hex).
 *
 * Every token holds the light value (`value`, from `:root`) and, when it
 * differs, the dark value (`darkValue`, from `.dark`). Tokens whose value is
 * identical in both themes (e.g. chart colors) only define `value`.
 * Alpha values use 8-digit hex (RRGGBBAA).
 */
export const COLOR_PALETTE_STATER_PACKS: ColorPalette = {
  background: {
    label: "Background",
    value: "#ffffff",
    darkValue: "#101012",
  },
  foreground: {
    label: "Foreground",
    value: "#0a0a0a",
    darkValue: "#fafafa",
  },
  primary: {
    label: "Primary",
    value: "#101012",
    darkValue: "#e5e5e5",
  },
  primaryForeground: {
    label: "Primary Foreground",
    value: "#fafafa",
    darkValue: "#171717",
  },
  secondary: {
    label: "Secondary",
    value: "#f5f5f5",
    darkValue: "#262626",
  },
  secondaryForeground: {
    label: "Secondary Foreground",
    value: "#171717",
    darkValue: "#fafafa",
  },
  accent: {
    label: "Accent",
    value: "#f5f5f5",
    darkValue: "#262626",
  },
  accentForeground: {
    label: "Accent Foreground",
    value: "#171717",
    darkValue: "#fafafa",
  },
  muted: {
    label: "Muted",
    value: "#f5f5f5",
    darkValue: "#262626",
  },
  mutedForeground: {
    label: "Muted Foreground",
    value: "#737373",
    darkValue: "#a1a1a1",
  },
  card: {
    label: "Card",
    value: "#ffffff",
    darkValue: "#171717",
  },
  cardForeground: {
    label: "Card Foreground",
    value: "#0a0a0a",
    darkValue: "#fafafa",
  },
  popover: {
    label: "Popover",
    value: "#ffffff",
    darkValue: "#171717",
  },
  popoverForeground: {
    label: "Popover Foreground",
    value: "#0a0a0a",
    darkValue: "#fafafa",
  },
  border: {
    label: "Border",
    value: "#e5e5e5",
    darkValue: "#ffffff1a",
  },
  input: {
    label: "Input",
    value: "#e5e5e5",
    darkValue: "#ffffff26",
  },
  ring: {
    label: "Ring",
    value: "#a1a1a1",
    darkValue: "#737373",
  },
  destructive: {
    label: "Destructive",
    value: "#e7000b",
    darkValue: "#ff6467",
  },
  destructiveForeground: {
    label: "Destructive Foreground",
    value: "#fafafa",
    darkValue: "#fafafa",
  },
  chart1: { label: "Chart 1", value: "#d4d4d4" },
  chart2: { label: "Chart 2", value: "#737373" },
  chart3: { label: "Chart 3", value: "#525252" },
  chart4: { label: "Chart 4", value: "#404040" },
  chart5: { label: "Chart 5", value: "#262626" },
  sidebar: {
    label: "Sidebar",
    value: "#fafafa",
    darkValue: "#171717",
  },
  sidebarForeground: {
    label: "Sidebar Foreground",
    value: "#0a0a0a",
    darkValue: "#fafafa",
  },
  sidebarPrimary: {
    label: "Sidebar Primary",
    value: "#171717",
    darkValue: "#1447e6",
  },
  sidebarPrimaryForeground: {
    label: "Sidebar Primary Foreground",
    value: "#fafafa",
    darkValue: "#fafafa",
  },
  sidebarAccent: {
    label: "Sidebar Accent",
    value: "#f5f5f5",
    darkValue: "#262626",
  },
  sidebarAccentForeground: {
    label: "Sidebar Accent Foreground",
    value: "#171717",
    darkValue: "#fafafa",
  },
  sidebarBorder: {
    label: "Sidebar Border",
    value: "#e5e5e5",
    darkValue: "#ffffff1a",
  },
  sidebarRing: {
    label: "Sidebar Ring",
    value: "#a1a1a1",
    darkValue: "#737373",
  },
}
