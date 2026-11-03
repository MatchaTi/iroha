import { useState, type CSSProperties } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignRadio,
  type DesignRadioState,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignRadioStarterPacks } from "@/lib/constants"
import { resolveLabelTypography, typographyStyle } from "@/lib/typography"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCcw, Expand, CircleDot } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATES: DesignRadioState[] = ["default", "checked", "disabled"]

function formatRadius(r: number) {
  return r >= 99 ? "Full" : `${r}px`
}

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

function resolveShadow(id: string, shadows: ShadowType[]): string {
  if (id === "none") return "none"
  const s = shadows.find((s) => s.id === id)
  return s ? `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}` : "none"
}

// ─── RadioPreview ─────────────────────────────────────────────────────────────

interface ResolvedRadio {
  background: string
  foreground: string
  border: string
  radius: number
  size: number
  shadow: string
  state: DesignRadioState
  labelStyle: CSSProperties
}

function RadioPreview({
  radio,
  other,
}: {
  radio: ResolvedRadio
  other?: ResolvedRadio
}) {
  const options = ["Option 1", "Option 2", "Option 3"]
  // Interactive radio group: click an option to select it (radio semantics —
  // a selection moves between options and never deselects)
  const interactive = other !== undefined && radio.state !== "disabled"
  const [selected, setSelected] = useState<number | null>(
    radio.state === "checked" ? 0 : null
  )
  // Selected items use the "checked" config, unselected use the "default" one.
  // For the checked row those are this row / its complement; for the default
  // row it's the opposite; for the disabled row everything uses this row.
  const checkedCfg = radio.state === "checked" ? radio : (other ?? radio)
  const defaultCfg = radio.state === "checked" ? (other ?? radio) : radio
  const itemOpacity = radio.state === "disabled" ? 0.5 : 1

  return (
    <div className="flex flex-col items-start gap-3">
      {options.map((label, index) => {
        const isSelected = selected === index
        const shown = isSelected ? checkedCfg : defaultCfg
        const dotSize = Math.round(shown.size * 0.5)
        return (
          <div
            key={label}
            onClick={interactive ? () => setSelected(index) : undefined}
            className={
              "flex items-center gap-2" + (interactive ? " cursor-pointer" : "")
            }
          >
            <span
              className="relative inline-flex shrink-0 items-center justify-center transition-all select-none"
              style={{
                backgroundColor: shown.background,
                border: `1px solid ${shown.border === "transparent" ? "transparent" : shown.border}`,
                borderRadius: shown.radius >= 9999 ? 9999 : shown.radius,
                width: shown.size,
                height: shown.size,
                boxShadow: shown.shadow === "none" ? "none" : shown.shadow,
                opacity: itemOpacity,
              }}
            >
              {isSelected && (
                <span
                  className="absolute inset-0 m-auto rounded-full"
                  style={{
                    backgroundColor: shown.foreground,
                    width: dotSize,
                    height: dotSize,
                  }}
                />
              )}
            </span>
            <span
              className="text-sm"
              style={{ ...shown.labelStyle, opacity: itemOpacity }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function resolveRadio(
  radio: DesignRadio,
  palettes: ColorPalette[],
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): ResolvedRadio {
  return {
    background: resolveColor(radio.background, palettes),
    foreground: resolveColor(radio.foreground, palettes),
    border: resolveColor(radio.border, palettes),
    radius: resolveCorner(radio.cornerId, corners),
    size: radio.size,
    shadow: resolveShadow(radio.shadowId, shadows),
    state: radio.state,
    labelStyle: typographyStyle(resolveLabelTypography(typographies)),
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

// ─── StateEditor (per-state: colors) ─────────────────────────────────────────

interface StateEditorProps {
  radio: DesignRadio
  onCommit: (updated: Partial<DesignRadio>) => void
  palettes: ColorPalette[]
}

function StateEditor({ radio, onCommit, palettes }: StateEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <ColorTokenSelect
        label="Background"
        value={radio.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Foreground (Dot)"
        value={radio.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={radio.border}
        palettes={palettes}
        onChange={(v) => onCommit({ border: v })}
      />
    </div>
  )
}

// ─── SharedTokensEditor ───────────────────────────────────────────────────────

type SharedRadioTokens = Pick<DesignRadio, "cornerId" | "shadowId" | "size">

function SharedTokensEditor({
  shared,
  corners,
  shadows,
  onCommit,
}: {
  shared: SharedRadioTokens
  corners: Corner[]
  shadows: ShadowType[]
  onCommit: (updated: Partial<SharedRadioTokens>) => void
}) {
  const [size, setSize] = useState(String(shared.size))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  const commitSize = (raw: string) => {
    const parsed = parseFloat(raw)
    if (!isNaN(parsed) && parsed >= 0) onCommit({ size: parsed })
    else setSize(String(shared.size))
  }

  return (
    <div className="flex max-w-sm flex-col gap-4 p-6">
      <p className="text-xs text-muted-foreground">
        These tokens apply to all radio states.
      </p>

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Corner Radius
        </FieldLabel>
        <Select
          value={shared.cornerId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ cornerId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === shared.cornerId)
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

      <Separator />

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Shadow
        </FieldLabel>
        <Select
          value={shared.shadowId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ shadowId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {shared.shadowId === "none"
                ? "None"
                : (shadows.find((s) => s.id === shared.shadowId)?.name ??
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

      {/* Size */}
      <div className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Size (px)
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Expand />
            </InputGroupAddon>
            <InputGroupInput
              value={size}
              onChange={(e) => setSize(e.target.value)}
              onBlur={() => commitSize(size)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
      </div>
    </div>
  )
}

// ─── RadioRow ─────────────────────────────────────────────────────────────────

interface RadioRowProps {
  state: DesignRadioState
  radio: DesignRadio | undefined
  otherResolved: ResolvedRadio | undefined
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (updated: Partial<DesignRadio>) => void
}

function RadioRow({
  state,
  radio,
  otherResolved,
  palettes,
  corners,
  shadows,
  typographies,
  onCommit,
}: RadioRowProps) {
  if (!radio) return null
  const resolved = resolveRadio(radio, palettes, corners, shadows, typographies)

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-20 items-center px-6 py-8 md:col-span-3">
        <RadioPreview radio={resolved} other={otherResolved} />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {state}
        </p>
        <StateEditor radio={radio} palettes={palettes} onCommit={onCommit} />
      </div>
    </div>
  )
}

// ─── DSRadio page ─────────────────────────────────────────────────────────────

export function DSRadio() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    state: DesignRadioState,
    updated: Partial<DesignRadio>
  ) => {
    if (!project) return
    updateProject(id!, {
      designRadio: project.designRadio.map((radio) =>
        radio.state === state ? { ...radio, ...updated } : radio
      ),
    })
  }

  const commitShared = (updated: Partial<SharedRadioTokens>) => {
    if (!project) return
    updateProject(id!, {
      designRadio: project.designRadio.map((radio) => ({
        ...radio,
        ...updated,
      })),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designRadio: resolveDesignRadioStarterPacks(
        project.corner ?? [],
        project.shadow ?? []
      ),
    })
  }

  const palettes = project?.colorPalette ?? []
  const corners = project?.corner ?? []
  const shadows = project?.shadow ?? []
  const typographies = project?.typography ?? []

  // Shared token display values — only when every state agrees
  const firstRadio = project?.designRadio?.[0]
  const shared: SharedRadioTokens = firstRadio
    ? {
        cornerId: (project?.designRadio ?? []).every(
          (radio) => radio.cornerId === firstRadio.cornerId
        )
          ? firstRadio.cornerId
          : "",
        shadowId: (project?.designRadio ?? []).every(
          (radio) => radio.shadowId === firstRadio.shadowId
        )
          ? firstRadio.shadowId
          : "",
        size: firstRadio.size,
      }
    : { cornerId: "", shadowId: "", size: 16 }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Radio</h1>
          <p>Customize radio styles for each state in your design system</p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
      </section>

      <section className="border-t">
        {!project?.designRadio || project.designRadio.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleDot />
              </EmptyMedia>
              <EmptyTitle>No radio styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default radio styles.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={resetToDefault}>
                <RotateCcw /> Load Defaults
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Tabs defaultValue="states">
            {/* Tab nav */}
            <div className="border-b px-4 pt-4">
              <TabsList variant="line">
                <TabsTrigger value="states">States</TabsTrigger>
                <TabsTrigger value="shared">Shared Tokens</TabsTrigger>
              </TabsList>
            </div>

            {/* ── States tab ── */}
            <TabsContent value="states">
              {STATES.map((state) => {
                const radio = project.designRadio.find(
                  (radio) => radio.state === state
                )
                // Clicking a preview toggles it to the complementary state
                const complementary =
                  state === "default" ? "checked" : "default"
                const otherRadio = project.designRadio.find(
                  (x) => x.state === complementary
                )
                return (
                  <RadioRow
                    key={state}
                    state={state}
                    radio={radio}
                    otherResolved={
                      otherRadio
                        ? resolveRadio(
                            otherRadio,
                            palettes,
                            corners,
                            shadows,
                            typographies
                          )
                        : undefined
                    }
                    palettes={palettes}
                    corners={corners}
                    shadows={shadows}
                    typographies={typographies}
                    onCommit={(updated) => handleCommit(state, updated)}
                  />
                )
              })}
            </TabsContent>

            {/* ── Shared tokens tab ── */}
            <TabsContent value="shared">
              <SharedTokensEditor
                shared={shared}
                corners={corners}
                shadows={shadows}
                onCommit={commitShared}
              />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </main>
  )
}
