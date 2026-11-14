import { ColorCard } from "@/components/designs/color-card"
import { ColorPaletteModal } from "@/components/designs/color-palette-modal"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Dices, Search } from "lucide-react"
import { COLOR_PALETTE_STATER_PACKS } from "@/constants/color-palette"
import {
  PALETTE_PRESETS,
  paletteFromPreset,
  isActivePreset,
  type PalettePreset,
} from "@/constants/color-palette-presets"
import { useDesignStore, type ColorPalette } from "@/store/use-design"
import { useParams } from "react-router"

export function ColorPalettePage() {
  const { id } = useParams<{ id: string }>()
  // Select the design object itself (not the getDesign action) so this
  // component re-renders whenever its color palette is updated.
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === id)
  )
  const updateDesign = useDesignStore((state) => state.updateDesign)
  const colorPalette = design?.colorPalette ?? COLOR_PALETTE_STATER_PACKS

  const applyPreset = (preset: PalettePreset) => {
    if (!design) return
    updateDesign(design.id, {
      ...design,
      colorPalette: paletteFromPreset(preset),
    })
    toast.add({
      title: "Preset Applied",
      description: `${preset.name} palette applied to the design`,
      type: "success",
    })
  }

  const activePreset = PALETTE_PRESETS.find((preset) =>
    isActivePreset(preset, colorPalette)
  )

  return (
    <main className="space-y-6">
      <ColorPaletteModal />
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between rounded-none border-x-transparent px-6 py-8"
            >
              <span className="flex items-center gap-3">
                <span className="grid aspect-square w-7 rotate-45 grid-cols-2 overflow-hidden rounded-full">
                  <span
                    style={{ backgroundColor: colorPalette.chart1.value }}
                  />
                  <span
                    style={{ backgroundColor: colorPalette.chart2.value }}
                  />
                </span>
                {activePreset?.name ?? "Custom"}
              </span>
              <span className="flex items-center gap-2">
                <span className="flex">
                  {[
                    colorPalette.chart1,
                    colorPalette.chart2,
                    colorPalette.chart3,
                    colorPalette.chart4,
                    colorPalette.chart5,
                  ].map((color, index) => (
                    <span
                      key={index}
                      style={{ backgroundColor: color.value }}
                      className="aspect-square w-5 rounded-full border border-background"
                    />
                  ))}
                </span>
                <ChevronsUpDown className="opacity-40" />
              </span>
            </Button>
          }
        />
        <PopoverContent className="w-80 p-2">
          <PresetPicker colorPalette={colorPalette} onApply={applyPreset} />
        </PopoverContent>
      </Popover>

      <div className="space-y-6 p-6">
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
      </div>
    </main>
  )
}

function PresetPicker({
  colorPalette,
  onApply,
}: {
  colorPalette: ColorPalette
  onApply: (preset: PalettePreset) => void
}) {
  const [search, setSearch] = useState("")
  const query = search.trim().toLowerCase()
  const filtered = PALETTE_PRESETS.filter((preset) =>
    preset.name.toLowerCase().includes(query)
  )

  const applyRandom = () => {
    const others = PALETTE_PRESETS.filter(
      (preset) => !isActivePreset(preset, colorPalette)
    )
    const pick = others[Math.floor(Math.random() * others.length)]
    if (pick) onApply(pick)
  }

  return (
    <>
      <ButtonGroup className="w-full items-center">
        <ButtonGroup className="w-full">
          <InputGroup>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search palette..."
            />
            <InputGroupAddon align={"inline-start"}>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            onClick={applyRandom}
            title="Random palette"
          >
            <Dices />
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
        {filtered.map((preset) => (
          <Item
            key={preset.id}
            variant={"muted"}
            size={"sm"}
            render={
              <button
                type="button"
                onClick={() => onApply(preset)}
                className="w-full cursor-pointer text-left"
              />
            }
            className={cn(
              "rounded-none transition-colors hover:bg-muted",
              isActivePreset(preset, colorPalette) && "ring-2 ring-ring"
            )}
          >
            <ItemContent className="flex-row gap-3">
              <div className="grid aspect-square w-6 rotate-45 grid-cols-2 overflow-hidden rounded-full">
                <div style={{ backgroundColor: preset.colors[0] }} />
                <div style={{ backgroundColor: preset.colors[1] }} />
              </div>
              <ItemTitle>{preset.name}</ItemTitle>
            </ItemContent>
            <ItemContent className="flex-row gap-0">
              {preset.colors.map((color) => (
                <div
                  key={color}
                  style={{ backgroundColor: color }}
                  className="aspect-square w-4 rounded-full border border-background"
                />
              ))}
            </ItemContent>
          </Item>
        ))}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No palette found
          </p>
        )}
      </div>
    </>
  )
}
