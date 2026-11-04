import { COLOR_PALETTE_STARTER_PACKS } from "@/lib/constants"
import { ColorPaletteOne } from "../template/color-palette-one"

export function DisplayColorPalette() {
  return (
    <section>
      <div className="hidden space-y-6 lg:block">
        {COLOR_PALETTE_STARTER_PACKS.slice(0, 5).map((palette) => {
          return (
            <ColorPaletteOne
              name={palette.name}
              purpose={palette.purpose}
              colors={palette.colors}
            />
          )
        })}
      </div>
      <div className="space-y-6 lg:hidden">
        {COLOR_PALETTE_STARTER_PACKS.slice(0, 3).map((palette) => {
          return (
            <ColorPaletteOne
              name={palette.name}
              purpose={palette.purpose}
              colors={palette.colors}
            />
          )
        })}
      </div>
    </section>
  )
}
