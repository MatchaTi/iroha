import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignInput,
  type DesignInputState,
  type ColorPalette,
  type Corner,
  type Project,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignInputStarterPacks } from "@/lib/constants"
import { formatRadius } from "@/lib/design-tokens"
import {
  DesignInput as DesignInputPreview,
  DESIGN_INPUT_STATES,
} from "@/components/shared/design-input"
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
  inp: DesignInput
  onCommit: (updated: Partial<DesignInput>) => void
  palettes: ColorPalette[]
}

function StateEditor({ inp, onCommit, palettes }: StateEditorProps) {
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
    </div>
  )
}

// ─── SharedTokensEditor ───────────────────────────────────────────────────────

function SharedTokensEditor({
  shared,
  corners,
  shadows,
  typographies,
  onCommit,
}: {
  shared: Pick<
    DesignInput,
    "cornerId" | "typographyId" | "shadowId" | "paddingX" | "paddingY"
  >
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (
    updated: Partial<
      Pick<
        DesignInput,
        "cornerId" | "typographyId" | "shadowId" | "paddingX" | "paddingY"
      >
    >
  ) => void
}) {
  const [paddingX, setPaddingX] = useState(String(shared.paddingX))
  const [paddingY, setPaddingY] = useState(String(shared.paddingY))

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
    <div className="flex max-w-sm flex-col gap-4 p-6">
      <p className="text-xs text-muted-foreground">
        These tokens apply to all input states.
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
          Typography
        </FieldLabel>
        <Select
          value={shared.typographyId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ typographyId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const t = typographies.find((t) => t.id === shared.typographyId)
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
                commitNumber(paddingX, "paddingX", setPaddingX, shared.paddingX)
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
                commitNumber(paddingY, "paddingY", setPaddingY, shared.paddingY)
              }
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Field>
      </div>
    </div>
  )
}

// ─── InputRow ─────────────────────────────────────────────────────────────────

interface InputRowProps {
  state: DesignInputState
  inp: DesignInput | undefined
  project: Project
  palettes: ColorPalette[]
  onCommit: (updated: Partial<DesignInput>) => void
}

function InputRow({ state, inp, project, palettes, onCommit }: InputRowProps) {
  if (!inp) return null

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-24 items-center px-6 py-8 md:col-span-3">
        <DesignInputPreview project={project} design={inp} state={state} />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {state}
        </p>
        <StateEditor inp={inp} palettes={palettes} onCommit={onCommit} />
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

  const commitShared = (
    updated: Partial<
      Pick<
        DesignInput,
        "cornerId" | "typographyId" | "shadowId" | "paddingX" | "paddingY"
      >
    >
  ) => {
    if (!project) return
    updateProject(id!, {
      designInput: project.designInput.map((i) => ({ ...i, ...updated })),
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

  // Shared token display values — only when every state agrees
  const firstInp = project?.designInput[0]
  const shared =
    firstInp && project?.designInput
      ? {
          cornerId: project.designInput.every(
            (i) => i.cornerId === firstInp.cornerId
          )
            ? firstInp.cornerId
            : "",
          typographyId: project.designInput.every(
            (i) => i.typographyId === firstInp.typographyId
          )
            ? firstInp.typographyId
            : "",
          shadowId: project.designInput.every(
            (i) => i.shadowId === firstInp.shadowId
          )
            ? firstInp.shadowId
            : "",
          paddingX: firstInp.paddingX,
          paddingY: firstInp.paddingY,
        }
      : {
          cornerId: "",
          typographyId: "",
          shadowId: "",
          paddingX: 12,
          paddingY: 8,
        }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Input</h1>
          <p>Customize input styles for each state in your design system</p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
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
              {DESIGN_INPUT_STATES.map((state) => {
                const inp = project.designInput.find((i) => i.state === state)
                return (
                  <InputRow
                    key={state}
                    state={state}
                    inp={inp}
                    project={project}
                    palettes={palettes}
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
                typographies={typographies}
                onCommit={commitShared}
              />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </main>
  )
}
