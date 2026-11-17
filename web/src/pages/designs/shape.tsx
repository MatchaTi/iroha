import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TAILWIND_COLORS } from "@/constants/tailwind-colors"
import { TailwindIcon } from "@/components/shared/tailwind-icon"
import { ShapePreview } from "@/components/designs/shape-preview"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"
import { Undo2 } from "lucide-react"
import { useState } from "react"
import { useDesignStore, type ShadowConfig } from "@/store/use-design"
import { useParams } from "react-router"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

/** Normalize "#abc"-less forms, "#RRGGBB" or 8-digit hex to "#RRGGBB[AA]" */
function parseHex(input: string): string | null {
  const clean = input.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{6}$/.test(clean) || /^[0-9a-fA-F]{8}$/.test(clean)) {
    return `#${clean.toUpperCase()}`
  }
  return null
}

/** Radius slider bounds — step 1px (1rem = 16px). Theme default: 0.625rem. */
const RADIUS_MIN = 0
const RADIUS_MAX = 2
const RADIUS_STEP = 0.0625
const RADIUS_DEFAULT = 0.625

const RADIUS_PRESETS = [
  { name: "Square", value: 0 },
  { name: "Subtle", value: 0.25 },
  { name: "Default", value: 0.625 },
  { name: "Rounded", value: 1 },
  { name: "Large", value: 1.5 },
  { name: "Extra", value: 2 },
]

/** Fallbacks for shadow parameters the user left untouched. */
const SHADOW_DEFAULTS = {
  color: "#000000",
  opacity: 0.1,
  x: 0,
  y: 4,
  blur: 6,
  spread: 0,
}

const SHADOW_PARAM_BOUNDS = {
  opacity: { min: 0, max: 1, step: 0.01 },
  x: { min: -24, max: 24, step: 1 },
  y: { min: 0, max: 24, step: 1 },
  blur: { min: 0, max: 40, step: 1 },
  spread: { min: -10, max: 20, step: 1 },
} as const

export function ShapePage() {
  const { id } = useParams<{ id: string }>()
  // Select the design object itself (not the getDesign action) so this
  // component re-renders whenever radius or shadow is updated.
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === id)
  )
  const updateRadius = useDesignStore((state) => state.updateRadius)
  const updateShadow = useDesignStore((state) => state.updateShadow)

  const radius = design?.radius ?? null
  const effectiveRadius = radius ?? RADIUS_DEFAULT

  // Designs persisted while `shadow` was a plain number are ignored.
  const storedShadow = design?.shadow
  const shadow =
    storedShadow && typeof storedShadow === "object" ? storedShadow : null

  const setRadius = (value: number | null, announce = false) => {
    if (!design) return
    updateRadius(design.id, value)
    if (announce) {
      toast.add({
        title: value == null ? "Radius Reset" : "Radius Applied",
        description:
          value == null
            ? "Back to the theme default radius"
            : `${value}rem applied to the whole website`,
        type: "success",
      })
    }
  }

  const setShadowParam = (patch: Partial<ShadowConfig>) => {
    if (!design) return
    updateShadow(design.id, {
      color: patch.color ?? shadow?.color ?? null,
      opacity: patch.opacity ?? shadow?.opacity ?? null,
      x: patch.x ?? shadow?.x ?? null,
      y: patch.y ?? shadow?.y ?? null,
      blur: patch.blur ?? shadow?.blur ?? null,
      spread: patch.spread ?? shadow?.spread ?? null,
    })
  }

  const resetShadow = () => {
    if (!design) return
    updateShadow(design.id, null)
    toast.add({
      title: "Shadow Reset",
      description: "Back to the theme default shadows",
      type: "success",
    })
  }

  // Local hex text so partially-typed values don't break the live shadow;
  // the store only receives parsed values.
  const [colorHex, setColorHex] = useState(() =>
    (shadow?.color ?? SHADOW_DEFAULTS.color).toUpperCase()
  )
  const parsedColor = parseHex(colorHex)

  const commitColor = (raw: string) => {
    setColorHex(raw)
    const parsed = parseHex(raw)
    if (parsed) setShadowParam({ color: parsed })
  }

  // <input type="color"> only accepts #RRGGBB; strip alpha / fall back to black
  const pickerValue = parsedColor ? parsedColor.slice(0, 7) : "#000000"

  return (
    <main className="grid gap-6 p-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* Controls */}
      <aside className="space-y-6 self-start lg:sticky lg:top-24">
        {/* Corner slider */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Corner Radius</CardTitle>
              <span className="text-sm text-muted-foreground tabular-nums">
                {effectiveRadius}rem · {effectiveRadius * 16}px
              </span>
            </div>
            <Slider
              value={[effectiveRadius]}
              min={RADIUS_MIN}
              max={RADIUS_MAX}
              step={RADIUS_STEP}
              onValueChange={(value) => {
                // Base UI passes a bare number when `multiple` is unset.
                const next = Array.isArray(value)
                  ? (value[0] ?? RADIUS_DEFAULT)
                  : value
                setRadius(next)
              }}
            />

            {/* Presets, each chip rendered with the radius it represents */}
            <div className="grid grid-cols-3 gap-2">
              {RADIUS_PRESETS.map((preset) => {
                const isActive = radius != null && radius === preset.value
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setRadius(preset.value, true)}
                    className={cn(
                      "group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors hover:bg-muted",
                      isActive && "border-ring ring-2 ring-ring"
                    )}
                  >
                    <span
                      className="size-7 border border-foreground/25 bg-muted transition-colors group-hover:bg-accent"
                      style={{ borderRadius: `${preset.value}rem` }}
                    />
                    <span className="text-xs">{preset.name}</span>
                  </button>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                className="col-start-3 justify-start"
                disabled={radius == null}
                onClick={() => setRadius(null, true)}
              >
                <Undo2 /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shadow controller */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Shadow</Label>
              <Button
                variant="ghost"
                size="icon"
                title="Reset to theme default"
                disabled={shadow == null}
                onClick={resetShadow}
              >
                <Undo2 />
              </Button>
            </div>

            {/* Color — same editor pattern as the color palette modal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Color</Label>
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  {parsedColor ?? "—"}
                </span>
              </div>
              <ButtonGroup className="w-full items-center">
                <input
                  type="color"
                  value={pickerValue}
                  onChange={(e) => commitColor(e.target.value.toUpperCase())}
                  className="min-w-8"
                />
                <ButtonGroup className="w-full">
                  <InputGroup>
                    <InputGroupInput
                      value={colorHex}
                      onChange={(e) => commitColor(e.target.value)}
                      placeholder="#3388BB"
                    />
                  </InputGroup>
                </ButtonGroup>
                <ButtonGroup>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button variant="outline" size="icon">
                          <TailwindIcon />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-72">
                      <PopoverHeader>
                        <PopoverTitle>Tailwind Color</PopoverTitle>
                      </PopoverHeader>
                      <div className="max-h-64 overflow-y-auto">
                        {Object.entries(TAILWIND_COLORS).map(
                          ([name, shades]) => (
                            <div key={name} className="mb-2 last:mb-0">
                              <div className="mb-1 text-xs font-medium text-muted-foreground capitalize">
                                {name}
                              </div>
                              <div className="grid grid-cols-11 gap-1">
                                {shades.map((shade) => (
                                  <button
                                    key={shade.label}
                                    type="button"
                                    title={shade.label}
                                    onClick={() => commitColor(shade.value)}
                                    style={{ backgroundColor: shade.value }}
                                    className={cn(
                                      "aspect-square cursor-pointer rounded hover:scale-110",
                                      parsedColor?.toLowerCase() ===
                                        shade.value.toLowerCase() &&
                                        "ring-2 ring-ring ring-offset-2 ring-offset-popover"
                                    )}
                                  ></button>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </ButtonGroup>
              </ButtonGroup>
            </div>

            {/* Opacity */}
            <div className="flex items-center gap-3">
              <Label className="w-20 shrink-0">Opacity</Label>
              <Slider
                className="flex-1"
                value={[shadow?.opacity ?? SHADOW_DEFAULTS.opacity]}
                min={SHADOW_PARAM_BOUNDS.opacity.min}
                max={SHADOW_PARAM_BOUNDS.opacity.max}
                step={SHADOW_PARAM_BOUNDS.opacity.step}
                onValueChange={(value) => {
                  // Base UI passes a bare number when `multiple` is unset.
                  const next = Array.isArray(value)
                    ? (value[0] ?? SHADOW_DEFAULTS.opacity)
                    : value
                  setShadowParam({ opacity: next })
                }}
              />
              <span className="w-10 text-right text-sm tabular-nums">
                {Math.round((shadow?.opacity ?? SHADOW_DEFAULTS.opacity) * 100)}
                %
              </span>
            </div>

            {/* Offset & spread */}
            <div className="space-y-3">
              {(
                [
                  ["x", "Offset X", "px"],
                  ["y", "Offset Y", "px"],
                  ["blur", "Blur", "px"],
                  ["spread", "Spread", "px"],
                ] as const
              ).map(([param, label, unit]) => {
                const bounds = SHADOW_PARAM_BOUNDS[param]
                const value = shadow?.[param] ?? SHADOW_DEFAULTS[param]
                return (
                  <div key={param} className="flex items-center gap-3">
                    <Label className="w-20 shrink-0">{label}</Label>
                    <Slider
                      className="flex-1"
                      value={[value]}
                      min={bounds.min}
                      max={bounds.max}
                      step={bounds.step}
                      onValueChange={(next) => {
                        // Base UI passes a bare number when `multiple` is unset.
                        const v = Array.isArray(next)
                          ? (next[0] ?? SHADOW_DEFAULTS[param])
                          : next
                        setShadowParam({ [param]: v })
                      }}
                    />
                    <span className="w-10 text-right text-sm tabular-nums">
                      {value}
                      {unit}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Live preview */}
      <ShapePreview />
    </main>
  )
}
