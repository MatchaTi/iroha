import type { ColorPalette } from "@/store/use-project"
import { getContrastColor } from "@/lib/color-utils"
import { cn } from "@/lib/utils"

type ColorPaletteOneProps = Pick<ColorPalette, "name" | "purpose" | "colors">

export function ColorPaletteOne({ name, purpose, colors }: ColorPaletteOneProps) {
  const anchor = colors.find((c) => c.level === "500")

  return (
    <div className="flex flex-col gap-3">
      {/* Header row: anchor swatch + name/purpose */}
      <div className="flex items-center gap-3">
        <div
          className="size-8 rounded-md border border-border/30 shadow-sm shrink-0"
          style={{ backgroundColor: anchor?.hex }}
        />
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground capitalize">{purpose}</p>
        </div>
      </div>

      {/* Grid of color swatches */}
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => {
          const textColor = getContrastColor(color.hex)
          return (
            <div
              key={color.level}
              className="flex aspect-square flex-col items-center justify-center rounded-xl gap-0.5 transition-transform hover:scale-105"
              style={{ backgroundColor: color.hex }}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold leading-none",
                  textColor === "black" ? "text-black/80" : "text-white/80"
                )}
              >
                {color.level}
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] leading-none hidden md:block",
                  textColor === "black" ? "text-black/50" : "text-white/50"
                )}
              >
                {color.hex.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
