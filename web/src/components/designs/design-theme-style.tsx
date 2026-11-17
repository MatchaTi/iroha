import { useEffect } from "react"
import { useLocation } from "react-router"
import {
  useDesignStore,
  type ColorPalette,
  type ShadowConfig,
  type Typography,
} from "@/store/use-design"
import { loadGoogleFont } from "@/lib/google-fonts"

/** Token key → CSS variable name, e.g. "sidebarPrimary" → "--sidebar-primary" */
function toCssVar(token: keyof ColorPalette) {
  return `--${token.replace(/([A-Z0-9])/g, "-$1").toLowerCase()}`
}

/**
 * Build CSS that overrides the shadcn theme tokens from `index.css`.
 * Light values go to `:root`, dark values to `.dark`, so the existing
 * dark mode class toggling keeps working.
 */
function buildPaletteCss(palette: ColorPalette) {
  const entries = Object.entries(palette) as [
    keyof ColorPalette,
    ColorPalette[keyof ColorPalette],
  ][]

  const root = entries
    .map(([token, color]) => `${toCssVar(token)}: ${color.value};`)
    .join("\n    ")
  const dark = entries
    .map(
      ([token, color]) => `${toCssVar(token)}: ${color.darkValue ?? color.value};`
    )
    .join("\n    ")

  return `:root {\n    ${root}\n  }\n\n  .dark {\n    ${dark}\n  }`
}

/**
 * Build CSS that overrides the theme font stacks on `:root`. Fonts do not
 * differ between light and dark mode, so only `:root` is targeted. The
 * variables are the ones `index.css` chains into `--font-sans`,
 * `--font-serif` and `--font-mono`, so every `font-*` utility follows.
 */
function buildTypographyCss(typography: Typography) {
  const rules: string[] = []
  if (typography.sans) {
    rules.push(`--font-default-sans: "${typography.sans}", sans-serif;`)
  }
  if (typography.serif) {
    rules.push(`--font-default-serif: "${typography.serif}", serif;`)
  }
  if (typography.mono) {
    rules.push(`--font-default-mono: "${typography.mono}", monospace;`)
  }
  if (rules.length === 0) return ""

  // Make sure the selected families are available after a page reload —
  // idempotent via the loader's internal Set.
  for (const family of [typography.sans, typography.serif, typography.mono]) {
    if (family) loadGoogleFont(family)
  }

  return `\n\n:root {\n    ${rules.join("\n    ")}\n  }`
}

/**
 * Build CSS that overrides `--radius`. Every `rounded-*` utility is derived
 * from it via the `calc()` chain in `index.css`, so one value scales them all.
 * Radius does not differ between light and dark mode — only `:root` targeted.
 */
function buildRadiusCss(radius: number | null | undefined) {
  if (radius == null) return ""
  return `\n\n:root {\n    --radius: ${radius}rem;\n  }`
}

/**
 * Tailwind compiles `shadow-*` utilities to literal `--tw-shadow` values,
 * so the classes themselves are overridden. The design's shadow config is
 * scaled per tier (sm 0.5× → xl 2×) so elevation hierarchy is preserved;
 * blur is derived from the y offset (≈1.5×) since it is not user-facing.
 * The color fallback is kept behind `--tw-shadow-color` so `shadow-color`
 * utilities keep working.
 */
const SHADOW_TIERS = [
  { utility: "shadow-sm", factor: 0.5 },
  { utility: "shadow-md", factor: 1 },
  { utility: "shadow-lg", factor: 1.5 },
  { utility: "shadow-xl", factor: 2 },
]

/** Values used for parameters the user left untouched. */
const SHADOW_DEFAULTS = {
  color: "#000000",
  opacity: 0.1,
  x: 0,
  y: 4,
  blur: 6,
  spread: 0,
}

function shadowAlphaHex(color: string, opacity: number) {
  const rgb = color.replace("#", "").slice(0, 6).padEnd(6, "0")
  const alpha = Math.round(Math.min(Math.max(opacity, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0")
  return `#${rgb}${alpha}`
}

function buildShadowCss(config: ShadowConfig | null | undefined) {
  // Designs persisted while `shadow` was a plain number are ignored.
  if (!config || typeof config !== "object") return ""
  const color = config.color ?? SHADOW_DEFAULTS.color
  const opacity = config.opacity ?? SHADOW_DEFAULTS.opacity
  const x = config.x ?? SHADOW_DEFAULTS.x
  const y = config.y ?? SHADOW_DEFAULTS.y
  const blur = config.blur ?? SHADOW_DEFAULTS.blur
  const spread = config.spread ?? SHADOW_DEFAULTS.spread
  const rgba = shadowAlphaHex(color, opacity)

  const rules = SHADOW_TIERS.map(({ utility, factor }) => {
    const layer = `${Math.round(x * factor)}px ${Math.round(y * factor)}px ${Math.max(Math.round(blur * factor), 0)}px ${Math.round(spread * factor)}px`
    return `.${utility} {\n    --tw-shadow: ${layer} var(--tw-shadow-color, ${rgba});\n  }`
  }).join("\n\n  ")

  return `\n\n  ${rules}`
}

/**
 * Applies the active design's color palette to the whole website by
 * injecting CSS variables that override the ones defined in `index.css`.
 *
 * The active design is `lastDesignId`: it is set when a design is created
 * and promoted whenever a design route is visited, so the palette keeps
 * applying on every page afterwards.
 */
export function DesignThemeStyle() {
  const location = useLocation()
  const designs = useDesignStore((state) => state.designs)
  const lastDesignId = useDesignStore((state) => state.lastDesignId)
  const setLastDesignId = useDesignStore((state) => state.setLastDesignId)

  // Navigation event → store sync: visiting a design route promotes it to
  // the active design. Only existing designs are promoted.
  const routeDesignId = location.pathname.match(/^\/designs\/([^/]+)/)?.[1]
  useEffect(() => {
    if (!routeDesignId || routeDesignId === lastDesignId) return
    if (designs.some((d) => d.id === routeDesignId)) {
      setLastDesignId(routeDesignId)
    }
  }, [routeDesignId, lastDesignId, designs, setLastDesignId])

  const design = designs.find((d) => d.id === lastDesignId)
  if (!design) return null

  return (
    <style>
      {buildPaletteCss(design.colorPalette) +
        (design.typography ? buildTypographyCss(design.typography) : "") +
        buildRadiusCss(design.radius) +
        buildShadowCss(design.shadow)}
    </style>
  )
}
