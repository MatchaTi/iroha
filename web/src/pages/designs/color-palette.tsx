import { ColorCard } from "@/components/designs/color-card"
import { ColorPaletteModal } from "@/components/designs/color-palette-modal"
import { Label } from "@/components/ui/label"
import { COLOR_PALETTE_STATER_PACKS } from "@/constants/color-palette"
import { useDesignStore } from "@/store/use-design"
import { useParams } from "react-router"

export function ColorPalettePage() {
  const { id } = useParams<{ id: string }>()
  // Select the design object itself (not the getDesign action) so this
  // component re-renders whenever its color palette is updated.
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === id)
  )
  const colorPalette = design?.colorPalette ?? COLOR_PALETTE_STATER_PACKS

  return (
    <main className="space-y-6 p-6">
      <ColorPaletteModal />
      <section className="space-y-4">
        <Label>Primary Color</Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.primary}
            designId={design?.id}
            token="primary"
          />
          <ColorCard
            color={colorPalette.primaryForeground}
            designId={design?.id}
            token="primaryForeground"
          />
          <ColorCard
            color={colorPalette.background}
            designId={design?.id}
            token="background"
          />
          <ColorCard
            color={colorPalette.foreground}
            designId={design?.id}
            token="foreground"
          />
        </div>
      </section>

      <section className="space-y-4">
        <Label>Secondary & Accent</Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.secondary}
            designId={design?.id}
            token="secondary"
          />
          <ColorCard
            color={colorPalette.secondaryForeground}
            designId={design?.id}
            token="secondaryForeground"
          />
          <ColorCard
            color={colorPalette.accent}
            designId={design?.id}
            token="accent"
          />
          <ColorCard
            color={colorPalette.accentForeground}
            designId={design?.id}
            token="accentForeground"
          />
        </div>
      </section>

      <section className="space-y-4">
        <Label>Ui Compoment</Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.card}
            designId={design?.id}
            token="card"
          />
          <ColorCard
            color={colorPalette.cardForeground}
            designId={design?.id}
            token="cardForeground"
          />
          <ColorCard
            color={colorPalette.popover}
            designId={design?.id}
            token="popover"
          />
          <ColorCard
            color={colorPalette.popoverForeground}
            designId={design?.id}
            token="popoverForeground"
          />
          <ColorCard
            color={colorPalette.muted}
            designId={design?.id}
            token="muted"
          />
          <ColorCard
            color={colorPalette.mutedForeground}
            designId={design?.id}
            token="mutedForeground"
          />
        </div>
      </section>

      <section className="space-y-4">
        <Label>Utility & Form </Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.border}
            designId={design?.id}
            token="border"
          />
          <ColorCard
            color={colorPalette.input}
            designId={design?.id}
            token="input"
          />
          <ColorCard
            color={colorPalette.ring}
            designId={design?.id}
            token="ring"
          />
        </div>
      </section>

      <section className="space-y-4">
        <Label>Feedback</Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.destructive}
            designId={design?.id}
            token="destructive"
          />
          <ColorCard
            color={colorPalette.destructiveForeground}
            designId={design?.id}
            token="destructiveForeground"
          />
        </div>
      </section>

      <section className="space-y-4">
        <Label>Chart</Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.chart1}
            designId={design?.id}
            token="chart1"
          />
          <ColorCard
            color={colorPalette.chart2}
            designId={design?.id}
            token="chart2"
          />
          <ColorCard
            color={colorPalette.chart3}
            designId={design?.id}
            token="chart3"
          />
          <ColorCard
            color={colorPalette.chart4}
            designId={design?.id}
            token="chart4"
          />
          <ColorCard
            color={colorPalette.chart5}
            designId={design?.id}
            token="chart5"
          />
        </div>
      </section>

      <section className="space-y-4">
        <Label>Sidebar & Navigation</Label>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ColorCard
            color={colorPalette.sidebar}
            designId={design?.id}
            token="sidebar"
          />
          <ColorCard
            color={colorPalette.sidebarForeground}
            designId={design?.id}
            token="sidebarForeground"
          />
          <ColorCard
            color={colorPalette.sidebarPrimary}
            designId={design?.id}
            token="sidebarPrimary"
          />
          <ColorCard
            color={colorPalette.sidebarPrimaryForeground}
            designId={design?.id}
            token="sidebarPrimaryForeground"
          />
          <ColorCard
            color={colorPalette.sidebarAccent}
            designId={design?.id}
            token="sidebarAccent"
          />
          <ColorCard
            color={colorPalette.sidebarAccentForeground}
            designId={design?.id}
            token="sidebarAccentForeground"
          />
          <ColorCard
            color={colorPalette.sidebarBorder}
            designId={design?.id}
            token="sidebarBorder"
          />
          <ColorCard
            color={colorPalette.sidebarRing}
            designId={design?.id}
            token="sidebarRing"
          />
        </div>
      </section>
    </main>
  )
}
