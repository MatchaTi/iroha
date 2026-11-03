import { useState, type CSSProperties } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignSwitch,
  type DesignSwitchState,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignSwitchStarterPacks } from "@/lib/constants"
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
import { RotateCcw, Expand, ToggleLeft } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATES: DesignSwitchState[] = ["default", "checked", "disabled"]

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

// ─── SwitchPreview ────────────────────────────────────────────────────────────

interface ResolvedSwitch {
  background: string
  foreground: string
  border: string
  radius: number
  size: number
  shadow: string
  state: DesignSwitchState
  labelStyle: CSSProperties
}

function SwitchPreview({
  sw,
  other,
}: {
  sw: ResolvedSwitch
  other?: ResolvedSwitch
}) {
  const height = sw.size
  const width = Math.round(height * 1.75)
  const inset = Math.max(2, Math.round(height / 6))
  const thumbSize = Math.max(4, height - 2 * inset - 2)
  // Interactive: click flips between this state and the default state
  const interactive = other !== undefined && sw.state !== "disabled"
  const [flipped, setFlipped] = useState(false)
  const shown = flipped && other ? other : sw

  return (
    <div className="flex items-center gap-3">
      <span
        onClick={interactive ? () => setFlipped(!flipped) : undefined}
        className={
          "relative inline-flex shrink-0 items-center transition-all select-none" +
          (interactive ? " cursor-pointer" : "")
        }
        style={{
          backgroundColor: shown.background,
          border: `1px solid ${shown.border === "transparent" ? "transparent" : shown.border}`,
          borderRadius: shown.radius >= 9999 ? 9999 : shown.radius,
          width,
          height,
          padding: inset,
          justifyContent: shown.state === "checked" ? "flex-end" : "flex-start",
          boxShadow: shown.shadow === "none" ? "none" : shown.shadow,
          opacity: shown.state === "disabled" ? 0.5 : 1,
        }}
      >
        <span
          className="inline-flex shrink-0 rounded-full transition-all"
          style={{
            backgroundColor: shown.foreground,
            width: thumbSize,
            height: thumbSize,
          }}
        />
      </span>
      <span
        className="text-sm"
        style={{
          ...shown.labelStyle,
          opacity: shown.state === "disabled" ? 0.5 : 1,
        }}
      >
        Switch
      </span>
    </div>
  )
}

function resolveSwitch(
  sw: DesignSwitch,
  palettes: ColorPalette[],
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): ResolvedSwitch {
  return {
    background: resolveColor(sw.background, palettes),
    foreground: resolveColor(sw.foreground, palettes),
    border: resolveColor(sw.border, palettes),
    radius: resolveCorner(sw.cornerId, corners),
    size: sw.size,
    shadow: resolveShadow(sw.shadowId, shadows),
    state: sw.state,
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
  sw: DesignSwitch
  onCommit: (updated: Partial<DesignSwitch>) => void
  palettes: ColorPalette[]
}

function StateEditor({ sw, onCommit, palettes }: StateEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <ColorTokenSelect
        label="Track"
        value={sw.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Thumb"
        value={sw.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={sw.border}
        palettes={palettes}
        onChange={(v) => onCommit({ border: v })}
      />
    </div>
  )
}

// ─── SharedTokensEditor ───────────────────────────────────────────────────────

type SharedSwitchTokens = Pick<DesignSwitch, "cornerId" | "shadowId" | "size">

function SharedTokensEditor({
  shared,
  corners,
  shadows,
  onCommit,
}: {
  shared: SharedSwitchTokens
  corners: Corner[]
  shadows: ShadowType[]
  onCommit: (updated: Partial<SharedSwitchTokens>) => void
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
        These tokens apply to all switch states.
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
            Height (px)
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

// ─── SwitchRow ────────────────────────────────────────────────────────────────

interface SwitchRowProps {
  state: DesignSwitchState
  sw: DesignSwitch | undefined
  otherResolved: ResolvedSwitch | undefined
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (updated: Partial<DesignSwitch>) => void
}

function SwitchRow({
  state,
  sw,
  otherResolved,
  palettes,
  corners,
  shadows,
  typographies,
  onCommit,
}: SwitchRowProps) {
  if (!sw) return null
  const resolved = resolveSwitch(sw, palettes, corners, shadows, typographies)

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-20 items-center px-6 py-8 md:col-span-3">
        <SwitchPreview sw={resolved} other={otherResolved} />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {state}
        </p>
        <StateEditor sw={sw} palettes={palettes} onCommit={onCommit} />
      </div>
    </div>
  )
}

// ─── DSSwitch page ────────────────────────────────────────────────────────────

export function DSSwitch() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    state: DesignSwitchState,
    updated: Partial<DesignSwitch>
  ) => {
    if (!project) return
    updateProject(id!, {
      designSwitch: project.designSwitch.map((sw) =>
        sw.state === state ? { ...sw, ...updated } : sw
      ),
    })
  }

  const commitShared = (updated: Partial<SharedSwitchTokens>) => {
    if (!project) return
    updateProject(id!, {
      designSwitch: project.designSwitch.map((sw) => ({ ...sw, ...updated })),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designSwitch: resolveDesignSwitchStarterPacks(
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
  const firstSw = project?.designSwitch?.[0]
  const shared: SharedSwitchTokens = firstSw
    ? {
        cornerId: (project?.designSwitch ?? []).every(
          (sw) => sw.cornerId === firstSw.cornerId
        )
          ? firstSw.cornerId
          : "",
        shadowId: (project?.designSwitch ?? []).every(
          (sw) => sw.shadowId === firstSw.shadowId
        )
          ? firstSw.shadowId
          : "",
        size: firstSw.size,
      }
    : { cornerId: "", shadowId: "", size: 24 }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Switch</h1>
          <p>Customize switch styles for each state in your design system</p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
      </section>

      <section className="border-t">
        {!project?.designSwitch || project.designSwitch.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ToggleLeft />
              </EmptyMedia>
              <EmptyTitle>No switch styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default switch styles.
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
                const sw = project.designSwitch.find((sw) => sw.state === state)
                // Clicking a preview toggles it to the complementary state
                const complementary =
                  state === "default" ? "checked" : "default"
                const otherSw = project.designSwitch.find(
                  (x) => x.state === complementary
                )
                return (
                  <SwitchRow
                    key={state}
                    state={state}
                    sw={sw}
                    otherResolved={
                      otherSw
                        ? resolveSwitch(
                            otherSw,
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
