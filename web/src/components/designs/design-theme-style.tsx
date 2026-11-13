import { useEffect } from "react"
import { useLocation } from "react-router"
import { useDesignStore, type ColorPalette } from "@/store/use-design"

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

  return <style>{buildPaletteCss(design.colorPalette)}</style>
}
