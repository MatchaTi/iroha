import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignCheckbox,
  type DesignCheckboxState,
  type ColorPalette,
  type Corner,
  type Project,
  type Shadow as ShadowType,
} from "@/store/use-project"
import { resolveDesignCheckboxStarterPacks } from "@/lib/constants"
import { formatRadius } from "@/lib/design-tokens"
import {
  DesignCheckbox as DesignCheckboxPreview,
  DESIGN_CHECKBOX_STATES,
} from "@/components/shared/design-checkbox"
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
import { RotateCcw, Expand, SquareCheck } from "lucide-react"
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

// ─── StateEditor (per-state: colors) ─────────────────────────────────────────

interface StateEditorProps {
  cb: DesignCheckbox
  onCommit: (updated: Partial<DesignCheckbox>) => void
  palettes: ColorPalette[]
}

function StateEditor({ cb, onCommit, palettes }: StateEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <ColorTokenSelect
        label="Background"
        value={cb.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Foreground"
        value={cb.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={cb.border}
        palettes={palettes}
        onChange={(v) => onCommit({ border: v })}
      />
    </div>
  )
}

// ─── SharedTokensEditor ───────────────────────────────────────────────────────

type SharedCheckboxTokens = Pick<
  DesignCheckbox,
  "cornerId" | "shadowId" | "size"
>

function SharedTokensEditor({
  shared,
  corners,
  shadows,
  onCommit,
}: {
  shared: SharedCheckboxTokens
  corners: Corner[]
  shadows: ShadowType[]
  onCommit: (updated: Partial<SharedCheckboxTokens>) => void
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
        These tokens apply to all checkbox states.
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

// ─── CheckboxRow ──────────────────────────────────────────────────────────────

interface CheckboxRowProps {
  state: DesignCheckboxState
  cb: DesignCheckbox | undefined
  project: Project
  palettes: ColorPalette[]
  onCommit: (updated: Partial<DesignCheckbox>) => void
}

function CheckboxRow({
  state,
  cb,
  project,
  palettes,
  onCommit,
}: CheckboxRowProps) {
  if (!cb) return null

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-20 items-center px-6 py-8 md:col-span-3">
        <DesignCheckboxPreview project={project} design={cb} state={state} />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {state}
        </p>
        <StateEditor cb={cb} palettes={palettes} onCommit={onCommit} />
      </div>
    </div>
  )
}

// ─── DSCheckbox page ──────────────────────────────────────────────────────────

export function DSCheckbox() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    state: DesignCheckboxState,
    updated: Partial<DesignCheckbox>
  ) => {
    if (!project) return
    updateProject(id!, {
      designCheckbox: project.designCheckbox.map((cb) =>
        cb.state === state ? { ...cb, ...updated } : cb
      ),
    })
  }

  const commitShared = (updated: Partial<SharedCheckboxTokens>) => {
    if (!project) return
    updateProject(id!, {
      designCheckbox: project.designCheckbox.map((cb) => ({
        ...cb,
        ...updated,
      })),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designCheckbox: resolveDesignCheckboxStarterPacks(
        project.corner ?? [],
        project.shadow ?? []
      ),
    })
  }

  const palettes = project?.colorPalette ?? []
  const corners = project?.corner ?? []
  const shadows = project?.shadow ?? []

  // Shared token display values — only when every state agrees
  const firstCb = project?.designCheckbox?.[0]
  const shared: SharedCheckboxTokens = firstCb
    ? {
        cornerId: (project?.designCheckbox ?? []).every(
          (cb) => cb.cornerId === firstCb.cornerId
        )
          ? firstCb.cornerId
          : "",
        shadowId: (project?.designCheckbox ?? []).every(
          (cb) => cb.shadowId === firstCb.shadowId
        )
          ? firstCb.shadowId
          : "",
        size: firstCb.size,
      }
    : { cornerId: "", shadowId: "", size: 16 }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Checkbox</h1>
          <p>Customize checkbox styles for each state in your design system</p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
      </section>

      <section className="border-t">
        {!project?.designCheckbox || project.designCheckbox.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SquareCheck />
              </EmptyMedia>
              <EmptyTitle>No checkbox styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default checkbox styles.
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
              {DESIGN_CHECKBOX_STATES.map((state) => {
                const cb = project.designCheckbox.find(
                  (cb) => cb.state === state
                )
                return (
                  <CheckboxRow
                    key={state}
                    state={state}
                    cb={cb}
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
                onCommit={commitShared}
              />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </main>
  )
}
