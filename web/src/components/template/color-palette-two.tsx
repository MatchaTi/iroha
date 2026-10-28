import type { ColorPalette } from "@/store/use-project"
import { getContrastColor } from "@/lib/color-utils"
import { cn } from "@/lib/utils"

type ColorPaletteTwoProps = Pick<ColorPalette, "name" | "purpose" | "colors">

export function ColorPaletteTwo({ name, purpose, colors }: ColorPaletteTwoProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Name + purpose badges */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-foreground px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-widest text-background uppercase">
          {name}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {purpose}
        </span>
      </div>

      {/* Full-width horizontal band */}
      <div className="flex h-14 w-full overflow-hidden rounded-2xl">
        {colors.map((color, i) => {
          const textColor = getContrastColor(color.hex)
          const isAnchor = color.level === "500"
          return (
            <div
              key={color.level}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all",
                // anchor gets slightly more width
                isAnchor ? "flex-[1.6]" : "flex-1"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {/* Level label — only show on hover or for anchor */}
              <span
                className={cn(
                  "text-[10px] font-semibold leading-none",
                  isAnchor ? "opacity-90" : "opacity-0 group-hover:opacity-70",
                  textColor === "black" ? "text-black" : "text-white"
                )}
              >
                {isAnchor ? color.level : ""}
              </span>
            </div>
          )
        })}
      </div>

      {/* Hex labels row below */}
      <div className="flex w-full">
        {colors.map((color) => {
          const isAnchor = color.level === "500"
          return (
            <div
              key={color.level}
              className={cn(
                "flex flex-col items-center gap-0.5",
                isAnchor ? "flex-[1.6]" : "flex-1"
              )}
            >
              <span className="font-mono text-[9px] text-muted-foreground/70">
                {color.level}
              </span>
              <span className="font-mono text-[8px] text-muted-foreground/50 hidden md:block">
                {color.hex.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
