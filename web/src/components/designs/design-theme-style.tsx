import { useEffect } from "react"
import { useLocation } from "react-router"
import {
  useDesignStore,
  type ColorPalette,
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
        (design.typography ? buildTypographyCss(design.typography) : "")}
    </style>
  )
}
