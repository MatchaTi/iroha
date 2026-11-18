import { FigmaIcon } from "@/components/shared/figma-icon"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useDesignStore, type Design } from "@/store/use-design"

/**
 * Exports the active design as the manifest JSON consumed by the Figma
 * "Iroha Token Importer" plugin: shadcn color tokens (light/dark hex),
 * typography families, base radius and the shadow config.
 */

/** "primaryForeground" → "primary-foreground", "chart1" → "chart-1" */
function toKebab(token: string): string {
  return token
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase()
}

function buildManifest(design: Design) {
  const tokens: Record<string, { light: string; dark?: string }> = {}
  for (const [token, color] of Object.entries(design.colorPalette)) {
    const dark = color.darkValue && color.darkValue !== color.value
      ? color.darkValue
      : undefined
    tokens[toKebab(token)] = dark
      ? { light: color.value, dark }
      : { light: color.value }
  }

  return {
    format: "iroha-design-system",
    version: 2,
    name: design.name,
    description: design.description ?? "",
    tokens,
    typography: design.typography ?? { sans: null, serif: null, mono: null },
    radius: design.radius ?? null,
    shadow: design.shadow ?? null,
  }
}

export function ExportFigmaButton({ designId }: { designId: string }) {
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === designId)
  )

  const exportManifest = async () => {
    if (!design) return
    const json = JSON.stringify(buildManifest(design), null, 2)
    try {
      await navigator.clipboard.writeText(json)
      toast.add({
        title: "Manifest copied",
        description:
          "Paste it into the Iroha Token Importer plugin in Figma, then click Import.",
        type: "success",
      })
    } catch {
      toast.add({
        title: "Copy failed",
        description: "The clipboard is not available in this browser context.",
        type: "error",
      })
    }
  }

  return (
    <Button variant="secondary" size="lg" onClick={exportManifest}>
      <FigmaIcon />
      Export to Figma
    </Button>
  )
}
