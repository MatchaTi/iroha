import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type ColorPalette as ColorPaletteType,
} from "@/store/use-project"
import { generateColorPalette, isValidHex } from "@/lib/color-utils"
import {
  COLOR_PALETTE_STARTER_PACKS,
  COLOR_PRESETS,
  type ColorPreset,
} from "@/lib/constants"
import { ColorPaletteOne } from "@/components/template/color-palette-one"
import { ColorPaletteTwo } from "@/components/template/color-palette-two"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Palette, Plus, RotateCcw, Trash2 } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

const PURPOSE_OPTIONS: ColorPaletteType["purpose"][] = [
  "primary",
  "secondary",
  "accent",
  "background",
  "foreground",
  "heading",
  "muted",
  "error",
  "warning",
  "success",
]

function PresetPicker({ onApply }: { onApply: (preset: ColorPreset) => void }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="flex gap-3">
      {COLOR_PRESETS.map((preset) => {
        const isActive = active === preset.name
        // show first 6 anchors as mini dots
        const dots = preset.palettes.slice(0, 6)

        return (
          <button
            key={preset.name}
            onClick={() => {
              setActive(preset.name)
              onApply(preset)
            }}
            className={cn(
              "group flex flex-col gap-2 rounded-2xl border p-2 text-left transition-all hover:border-foreground/30 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              isActive ? "border-border bg-muted" : "bg-background"
            )}
          >
            {/* Color dots */}
            <div className="flex gap-1">
              {dots.map((p) => (
                <div
                  key={p.purpose}
                  className="size-4 rounded-full border border-white/20"
                  style={{ backgroundColor: p.anchor }}
                />
              ))}
            </div>
          </button>
        )
      })}
    </div>
  )
}

interface PaletteRowProps {
  palette: ColorPaletteType
  template: string
  onCommit: (updated: Partial<ColorPaletteType>) => void
  onDelete: () => void
}

function PaletteRow({
  palette,
  template,
  onCommit,
  onDelete,
}: PaletteRowProps) {
  const anchor500 =
    palette.colors.find((c) => c.level === "500")?.hex ?? "#000000"
  const [hexInput, setHexInput] = useState(anchor500)
  const [name, setName] = useState(palette.name)
  const [purpose, setPurpose] = useState(palette.purpose)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  const applyHex = (raw: string) => {
    const clean = raw.startsWith("#") ? raw : `#${raw}`
    if (isValidHex(clean)) {
      const colors = generateColorPalette(clean)
      onCommit({ colors })
      setHexInput(clean)
    } else {
      setHexInput(anchor500)
    }
  }

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Template preview */}
      <div className="flex min-h-24 items-center px-6 py-8 md:col-span-3">
        {template === "one" && (
          <ColorPaletteOne
            name={name || palette.name}
            purpose={purpose}
            colors={palette.colors}
          />
        )}
        {template === "two" && (
          <ColorPaletteTwo
            name={name || palette.name}
            purpose={purpose}
            colors={palette.colors}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 border-t bg-sidebar px-4 py-4 md:border-t-0 md:border-l lg:border-l">
        {/* Anchor color input */}
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Anchor Color (500)
          </FieldLabel>
          <div className="flex items-center gap-2">
            <label
              className="size-9 shrink-0 cursor-pointer overflow-hidden rounded-md border"
              style={{ backgroundColor: hexInput }}
            >
              <input
                type="color"
                className="sr-only"
                value={hexInput.startsWith("#") ? hexInput : `#${hexInput}`}
                onChange={(e) => {
                  setHexInput(e.target.value)
                  applyHex(e.target.value)
                }}
              />
            </label>
            <Input
              className="font-mono"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={() => applyHex(hexInput)}
              onKeyDown={handleKeyDown}
              placeholder="#6750A4"
            />
          </div>
        </Field>

        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Name
          </FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => onCommit({ name })}
            onKeyDown={handleKeyDown}
          />
        </Field>

        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Purpose
          </FieldLabel>
          <Select
            value={purpose}
            onValueChange={(value) => {
              const v = value as ColorPaletteType["purpose"]
              setPurpose(v)
              onCommit({ purpose: v })
            }}
          >
            <SelectTrigger>
              <SelectValue className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              {PURPOSE_OPTIONS.map((v) => (
                <SelectItem key={v} value={v} className="capitalize">
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                className="mt-auto text-destructive hover:text-destructive"
              >
                <Trash2 />
                Delete Palette
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{palette.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this color palette from the
                project. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// ─── ColorPalette page ────────────────────────────────────────────────────────

export function ColorPalette() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    paletteId: string,
    updated: Partial<ColorPaletteType>
  ) => {
    if (!project) return
    updateProject(id!, {
      colorPalette: project.colorPalette.map((p) =>
        p.id === paletteId ? { ...p, ...updated } : p
      ),
    })
  }

  const handleDelete = (paletteId: string) => {
    if (!project) return
    updateProject(id!, {
      colorPalette: project.colorPalette.filter((p) => p.id !== paletteId),
    })
  }

  const handleAdd = () => {
    if (!project) return
    const newPalette: ColorPaletteType = {
      id: crypto.randomUUID(),
      name: "New Palette",
      purpose: "primary",
      colors: generateColorPalette("#6750A4"),
    }
    updateProject(id!, {
      colorPalette: [...project.colorPalette, newPalette],
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      colorPalette: COLOR_PALETTE_STARTER_PACKS.map((p) => ({
        ...p,
        id: crypto.randomUUID(),
      })),
    })
  }

  const applyPreset = (preset: ColorPreset) => {
    if (!project) return
    updateProject(id!, {
      colorPalette: preset.palettes.map((p) => ({
        id: crypto.randomUUID(),
        name: p.name,
        purpose: p.purpose,
        colors: generateColorPalette(p.anchor),
      })),
    })
  }

  const changeTemplate = (template: string) => {
    if (!project) return
    updateProject(id!, { templateColorPalette: template })
  }

  return (
    <main>
      {/* Header */}
      <div>
        <section className="grid lg:grid-cols-4">
          <div className="space-y-2 p-4 lg:col-span-3">
            <h1 className="heading">Color Palette</h1>
            <p>
              Create accessible, personal color schemes communicating your
              product's hierarchy, state, and brand
            </p>
          </div>

          <div className="overflow-hidden border-l bg-sidebar">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Select
                value={project?.templateColorPalette}
                onValueChange={(value) => changeTemplate(value as string)}
              >
                <SelectTrigger>
                  <SelectValue className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">Template One</SelectItem>
                  <SelectItem value="two">Template Two</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="secondary" onClick={resetToDefault}>
                <RotateCcw /> Reset
              </Button>
              <Button onClick={handleAdd}>
                <Plus /> Add Palette
              </Button>
            </div>

            <div className="w-full min-w-0 border-t p-4">
              <FieldLabel className="mt-2 text-xs text-muted-foreground">
                Preset
              </FieldLabel>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 py-2">
                  <PresetPicker onApply={applyPreset} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Palette list */}
      <section className="border-y">
        {!project?.colorPalette || project.colorPalette.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <Palette />
              </EmptyMedia>
              <EmptyTitle>No color palettes yet</EmptyTitle>
              <EmptyDescription>
                Create your first color palette to get started. You can add more
                palettes later.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={handleAdd}>
                <Plus /> Add Your First Palette
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          project.colorPalette.map((palette) => (
            <PaletteRow
              key={palette.id}
              palette={palette}
              template={project.templateColorPalette}
              onCommit={(updated) => handleCommit(palette.id, updated)}
              onDelete={() => handleDelete(palette.id)}
            />
          ))
        )}
      </section>
    </main>
  )
}
