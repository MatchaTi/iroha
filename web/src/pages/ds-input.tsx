import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignInput,
  type DesignInputState,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignInputStarterPacks } from "@/lib/constants"
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
import { RotateCcw, Expand } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { MousePointerClick } from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATES: DesignInputState[] = ["default", "focus", "error", "disabled"]

// ─── Token resolvers ──────────────────────────────────────────────────────────

function resolveColor(
  ref: string | null | undefined,
  palettes: ColorPalette[]
): string {
  if (!ref) return "#000000"
  if (ref === "transparent") return "transparent"
  if (!ref.includes("::")) return ref
  const [purpose, level] = ref.split("::")
  const palette = palettes.find((p) => p.purpose === purpose)
  return palette?.colors.find((c) => c.level === level)?.hex ?? "#000000"
}

function resolveCorner(id: string, corners: Corner[]): number {
  return corners.find((c) => c.id === id)?.radius ?? 0
}

function resolveTypography(
  id: string,
  typos: Typography[]
): Typography | undefined {
  return typos.find((t) => t.id === id)
}

function resolveShadow(id: string, shadows: ShadowType[]): string {
  if (id === "none") return "none"
  const s = shadows.find((s) => s.id === id)
  return s ? `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}` : "none"
}

// ─── InputPreview ─────────────────────────────────────────────────────────────

interface ResolvedInput {
  background: string
  foreground: string
  border: string
  placeholder: string
  label: string
  helper: string
  radius: number
  fontFamily: string
  fontSize: number
  fontWeight: string
  paddingX: number
  paddingY: number
  shadow: string
  state: DesignInputState
}

function InputPreview({ inp }: { inp: ResolvedInput }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: inp.label }}>
        Label
      </label>
      <input
        readOnly={inp.state === "disabled"}
        disabled={inp.state === "disabled"}
        placeholder="Placeholder"
        className="outline-none"
        style={{
          backgroundColor: inp.background,
          color: inp.foreground,
          border: `1px solid ${inp.border}`,
          borderRadius: inp.radius >= 9999 ? 9999 : inp.radius,
          fontFamily: inp.fontFamily,
          fontSize: inp.fontSize,
          fontWeight: inp.fontWeight,
          paddingLeft: inp.paddingX,
          paddingRight: inp.paddingX,
          paddingTop: inp.paddingY,
          paddingBottom: inp.paddingY,
          boxShadow: inp.shadow === "none" ? "none" : inp.shadow,
          width: "100%",
        }}
      />
      <span className="text-xs" style={{ color: inp.helper }}>
        Helper text
      </span>
    </div>
  )
}

function resolveInput(
  inp: DesignInput,
  palettes: ColorPalette[],
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): ResolvedInput {
  const typo = resolveTypography(inp.typographyId, typographies)
  return {
    background: resolveColor(inp.background, palettes),
    foreground: resolveColor(inp.foreground, palettes),
    border: resolveColor(inp.border, palettes),
    placeholder: resolveColor(inp.placeholder, palettes),
    label: resolveColor(inp.label, palettes),
    helper: resolveColor(inp.helper, palettes),
    radius: resolveCorner(inp.cornerId, corners),
    fontFamily: typo?.fontFamily ?? "sans-serif",
    fontSize: typo?.fontSize ?? 14,
    fontWeight: typo?.fontWeight ?? "Regular",
    paddingX: inp.paddingX,
    paddingY: inp.paddingY,
    shadow: resolveShadow(inp.shadowId, shadows),
    state: inp.state,
  }
}

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
        <Select value={value} onValueChange={onChange}>
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

// ─── InputEditor ──────────────────────────────────────────────────────────────

interface InputEditorProps {
  inp: DesignInput
  onCommit: (updated: Partial<DesignInput>) => void
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
}

function InputEditor({
  inp,
  onCommit,
  palettes,
  corners,
  shadows,
  typographies,
}: InputEditorProps) {
  const [paddingX, setPaddingX] = useState(String(inp.paddingX))
  const [paddingY, setPaddingY] = useState(String(inp.paddingY))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  const commitNumber = (
    raw: string,
    key: "paddingX" | "paddingY",
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
        label="Background"
        value={inp.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Foreground"
        value={inp.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={inp.border}
        palettes={palettes}
        onChange={(v) => onCommit({ border: v })}
      />
      <ColorTokenSelect
        label="Placeholder"
        value={inp.placeholder}
        palettes={palettes}
        onChange={(v) => onCommit({ placeholder: v })}
      />
      <ColorTokenSelect
        label="Label"
        value={inp.label}
        palettes={palettes}
        onChange={(v) => onCommit({ label: v })}
      />
      <ColorTokenSelect
        label="Helper"
        value={inp.helper}
        palettes={palettes}
        onChange={(v) => onCommit({ helper: v })}
      />

      <Separator />

      {/* Corner */}
      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Corner Radius
        </FieldLabel>
        <Select
          value={inp.cornerId}
          onValueChange={(v) => onCommit({ cornerId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === inp.cornerId)
                return c
                  ? `${c.name} - ${c.radius >= 99 ? "Full" : `${c.radius}px`}`
                  : "Custom"
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {corners.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} - {c.radius >= 99 ? "Full" : `${c.radius}px`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Padding */}
      <div className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Padding X
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand className="rotate-90" />
            </InputGroupAddon>
            <InputGroupInput
              value={paddingX}
              onChange={(e) => setPaddingX(e.target.value)}
              onBlur={() =>
                commitNumber(paddingX, "paddingX", setPaddingX, inp.paddingX)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Padding Y
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand />
            </InputGroupAddon>
            <InputGroupInput
              value={paddingY}
              onChange={(e) => setPaddingY(e.target.value)}
              onBlur={() =>
                commitNumber(paddingY, "paddingY", setPaddingY, inp.paddingY)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
      </div>

      <Separator />

      {/* Typography */}
      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Typography
        </FieldLabel>
        <Select
          value={inp.typographyId}
          onValueChange={(v) => onCommit({ typographyId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const t = typographies.find((t) => t.id === inp.typographyId)
                return t
                  ? `${t.name} - ${t.fontSize}px / ${t.fontWeight}`
                  : "Custom"
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {typographies.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {t.fontSize}px / {t.fontWeight}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Separator />

      {/* Shadow */}
      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Shadow
        </FieldLabel>
        <Select
          value={inp.shadowId}
          onValueChange={(v) => onCommit({ shadowId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {inp.shadowId === "none"
                ? "None"
                : (shadows.find((s) => s.id === inp.shadowId)?.name ??
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
    </div>
  )
}

// ─── InputRow ─────────────────────────────────────────────────────────────────

interface InputRowProps {
  state: DesignInputState
  inp: DesignInput | undefined
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (updated: Partial<DesignInput>) => void
}

function InputRow({
  state,
  inp,
  palettes,
  corners,
  shadows,
  typographies,
  onCommit,
}: InputRowProps) {
  if (!inp) return null
  const resolved = resolveInput(inp, palettes, corners, shadows, typographies)

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-24 items-center px-6 py-8 md:col-span-3">
        <InputPreview inp={resolved} />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {state}
        </p>
        <InputEditor
          inp={inp}
          palettes={palettes}
          corners={corners}
          shadows={shadows}
          typographies={typographies}
          onCommit={onCommit}
        />
      </div>
    </div>
  )
}

// ─── DSInput page ──────────────────────────────────────────────────────────────

export function DSInput() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    state: DesignInputState,
    updated: Partial<DesignInput>
  ) => {
    if (!project) return
    updateProject(id!, {
      designInput: project.designInput.map((i) =>
        i.state === state ? { ...i, ...updated } : i
      ),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designInput: resolveDesignInputStarterPacks(
        project.corner ?? [],
        project.shadow ?? [],
        project.typography ?? []
      ),
    })
  }

  const palettes = project?.colorPalette ?? []
  const corners = project?.corner ?? []
  const shadows = project?.shadow ?? []
  const typographies = project?.typography ?? []

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Input</h1>
          <p>Customize input styles for each state in your design system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw /> Reset
          </Button>
        </div>
      </section>

      <section className="border-t">
        {!project?.designInput || project.designInput.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MousePointerClick />
              </EmptyMedia>
              <EmptyTitle>No input styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default input styles.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={resetToDefault}>
                <RotateCcw /> Load Defaults
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          STATES.map((state) => {
            const inp = project.designInput.find((i) => i.state === state)
            return (
              <InputRow
                key={state}
                state={state}
                inp={inp}
                palettes={palettes}
                corners={corners}
                shadows={shadows}
                typographies={typographies}
                onCommit={(updated) => handleCommit(state, updated)}
              />
            )
          })
        )}
      </section>
    </main>
  )
}
