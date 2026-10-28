import type { ColorPalette } from "@/store/use-project"
import { copyToClipboard } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type ColorPaletteTwoProps = Pick<ColorPalette, "name" | "purpose" | "colors">

export function ColorPaletteTwo({
  name,
  purpose,
  colors,
}: ColorPaletteTwoProps) {
  return (
    <div className="w-full overflow-x-auto">
      <h3 className="mb-4 capitalize">
        {name} - {purpose}
      </h3>
      <ScrollArea>
        <div className="flex gap-2">
          {colors.map((color) => {
            return (
              <div
                key={color.level}
                className="w-24 flex-none space-y-2 lg:w-full lg:flex-1"
                onClick={() => copyToClipboard(color.hex)}
              >
                <div
                  className="aspect-square w-full rounded-lg"
                  style={{ backgroundColor: color.hex }}
                ></div>

                <div className="space-y-1">
                  <p className={"font-mono text-xs"}>
                    {name}-{color.level}
                  </p>
                  <p className={"font-mono text-xs"}>
                    {color.hex.toUpperCase()}
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
