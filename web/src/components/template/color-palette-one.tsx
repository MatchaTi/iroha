import type { ColorPalette } from "@/store/use-project"
import { getContrastColor } from "@/lib/color-utils"
import { cn, copyToClipboard } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type ColorPaletteOneProps = Pick<ColorPalette, "name" | "purpose" | "colors">

export function ColorPaletteOne({
  name,
  purpose,
  colors,
}: ColorPaletteOneProps) {
  return (
    <div className="w-full overflow-x-auto">
      <h3 className="mb-4 capitalize">
        {name} - {purpose}
      </h3>
      <ScrollArea>
        <div className="flex">
          {colors.map((color) => {
            const textColor = getContrastColor(color.hex)
            return (
              <div
                key={color.level}
                className="flex aspect-[3/4] flex-none flex-col items-start justify-between rounded-xl p-4 not-first:-ml-3 not-last:rounded-r-none lg:w-full lg:flex-1"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyToClipboard(color.hex)}
              >
                <span
                  className={cn(
                    "text-[11px] leading-none font-semibold",
                    textColor === "black" ? "text-black/80" : "text-white/80"
                  )}
                >
                  {color.level}
                </span>
                <div className="space-y-1">
                  <p
                    className={cn(
                      "font-mono text-[9px] leading-none",
                      textColor === "black" ? "text-black/60" : "text-white/60"
                    )}
                  >
                    {color.hex.toUpperCase()}
                  </p>
                  <p
                    className={cn(
                      "font-mono text-[9px] leading-none",
                      textColor === "black" ? "text-black/60" : "text-white/60"
                    )}
                  >
                    {color.rgb}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
