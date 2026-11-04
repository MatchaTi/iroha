import type { ColorPalette, Corner, Shadow } from "@/store/use-project"

/** Resolve a color token ref (`purpose::level`, `transparent`, or raw value). */
export function resolveColor(
  ref: string | null | undefined,
  palettes: ColorPalette[]
): string {
  if (!ref) return "#000000"
  if (ref === "transparent") return "transparent"
  if (!ref.includes("::")) return ref
  const [purpose, level] = ref.split("::")
  return (
    palettes
      .find((p) => p.purpose === purpose)
      ?.colors.find((c) => c.level === level)?.hex ?? "#000000"
  )
}

export function resolveCorner(id: string, corners: Corner[]): number {
  return corners.find((c) => c.id === id)?.radius ?? 0
}

export function resolveShadow(id: string, shadows: Shadow[]): string {
  if (id === "none") return "none"
  const s = shadows.find((s) => s.id === id)
  return s ? `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}` : "none"
}

export function formatRadius(radius: number): string {
  return radius >= 99 ? "Full" : `${radius}px`
}
