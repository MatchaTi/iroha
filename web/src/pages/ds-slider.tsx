import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignSlider,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
} from "@/store/use-project"
import { resolveDesignSliderStarterPacks } from "@/lib/constants"
import { formatRadius } from "@/lib/design-tokens"
import { DesignSlider as DesignSliderPreview } from "@/components/shared/design-slider"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCcw, Expand, SlidersHorizontal } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// ─── ColorTokenSelect ─────────────────────────────────────────────────────────

function ColorTokenSelect({
  label,
  value,
  palettes,
  onChange,
}: {
  label: string
  value: string
  palettes: ColorPalette[]
  onChange: (ref: string) => void
}) {
  const isTransparent = value === "transparent" || !value
  const [purpose, level] = isTransparent
    ? ["", ""]
    : value.includes("::")
      ? value.split("::")
      : ["", ""]
  const matchedPalette = palettes.find((p) => p.purpose === purpose)
  const matchedColor = matchedPalette?.colors.find((c) => c.level === level)
  const hex = isTransparent ? undefined : (matchedColor?.hex ?? "#000000")

  const displayLabel = isTransparent
    ? "Transparent"
    : matchedPalette
      ? `${matchedPalette.name} ${level}`
      : value

  return (
    <Field>
      <FieldLabel className="text-xs text-muted-foreground">{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <div
          className="size-5 shrink-0 rounded-full border"
          style={{ backgroundColor: hex }}
        />
        <Select
          value={value}
          onValueChange={(v) => onChange(v ?? "transparent")}
        >
          <SelectTrigger className="flex-1">
            <SelectValue>{displayLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transparent">Transparent</SelectItem>
            {palettes.map((palette) =>
              palette.colors.map((color) => (
                <SelectItem
                  key={`${palette.purpose}::${color.level}`}
                  value={`${palette.purpose}::${color.level}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3.5 rounded-full border border-border/50"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>
                      {palette.name} {color.level}
                    </span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {color.hex}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </Field>
  )
}

// ─── SliderEditor ─────────────────────────────────────────────────────────────

interface SliderEditorProps {
  sl: DesignSlider
  onCommit: (updated: Partial<DesignSlider>) => void
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
}

function SliderEditor({
  sl,
  onCommit,
  palettes,
  corners,
  shadows,
}: SliderEditorProps) {
  const [height, setHeight] = useState(String(sl.height))
  const [thumbSize, setThumbSize] = useState(String(sl.thumbSize))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  const commitNumber = (
    raw: string,
    key: "height" | "thumbSize",
    setter: (v: string) => void,
    fallback: number
  ) => {
    const parsed = parseFloat(raw)
    if (!isNaN(parsed) && parsed >= 0) onCommit({ [key]: parsed })
    else setter(String(fallback))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Colors */}
      <ColorTokenSelect
        label="Track"
        value={sl.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Range Fill"
        value={sl.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Thumb"
        value={sl.thumb}
        palettes={palettes}
        onChange={(v) => onCommit({ thumb: v })}
      />

      <Separator />

      {/* Corner */}
      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Corner Radius (Track)
        </FieldLabel>
        <Select
          value={sl.cornerId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ cornerId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === sl.cornerId)
                return c ? `${c.name} - ${formatRadius(c.radius)}` : "Custom"
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {corners.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} - {formatRadius(c.radius)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Thumb shadow */}
      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Thumb Shadow
        </FieldLabel>
        <Select
          value={sl.thumbShadowId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ thumbShadowId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {sl.thumbShadowId === "none"
                ? "None"
                : (shadows.find((s) => s.id === sl.thumbShadowId)?.name ??
                  "Custom")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {shadows.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Separator />

      {/* Geometry */}
      <div className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Track Height (px)
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand className="rotate-90" />
            </InputGroupAddon>
            <InputGroupInput
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onBlur={() =>
                commitNumber(height, "height", setHeight, sl.height)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Thumb Size (px)
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand />
            </InputGroupAddon>
            <InputGroupInput
              value={thumbSize}
              onChange={(e) => setThumbSize(e.target.value)}
              onBlur={() =>
                commitNumber(thumbSize, "thumbSize", setThumbSize, sl.thumbSize)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
      </div>
    </div>
  )
}

// ─── DSSlider page ────────────────────────────────────────────────────────────

export function DSSlider() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (updated: Partial<DesignSlider>) => {
    if (!project) return
    updateProject(id!, {
      designSlider: { ...project.designSlider, ...updated },
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designSlider: resolveDesignSliderStarterPacks(
        project.corner ?? [],
        project.shadow ?? []
      ),
    })
  }

  const palettes = project?.colorPalette ?? []
  const corners = project?.corner ?? []
  const shadows = project?.shadow ?? []

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Slider</h1>
          <p>Customize slider styles in your design system</p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
      </section>

      <section className="border-t">
        {!project?.designSlider ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SlidersHorizontal />
              </EmptyMedia>
              <EmptyTitle>No slider styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default slider styles.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={resetToDefault}>
                <RotateCcw /> Load Defaults
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid border-b last:border-b-0 md:grid-cols-4">
            {/* Preview */}
            <div className="flex min-h-24 flex-col items-start justify-center gap-6 px-6 py-8 md:col-span-3">
              <DesignSliderPreview project={project} />
              <DesignSliderPreview project={project} />
            </div>

            {/* Editor */}
            <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Tokens
              </p>
              <SliderEditor
                sl={project.designSlider}
                palettes={palettes}
                corners={corners}
                shadows={shadows}
                onCommit={handleCommit}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
