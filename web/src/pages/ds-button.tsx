import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignButton,
  type DesignButtonVariant,
  type DesignButtonSize,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignButtonStarterPacks } from "@/lib/constants"
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

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANTS: DesignButtonVariant[] = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
]

const SIZES: DesignButtonSize[] = ["xs", "sm", "default", "lg"]

// ─── Token resolvers ──────────────────────────────────────────────────────────

/** Resolve "primary::500" → hex, "transparent" → "transparent", null/undefined → fallback */
function resolveColor(
  ref: string | null | undefined,
  palettes: ColorPalette[]
): string {
  if (!ref) return "#000000"
  if (ref === "transparent") return "transparent"
  if (!ref.includes("::")) return ref // old format — raw hex
  const [purpose, level] = ref.split("::")
  const palette = palettes.find((p) => p.purpose === purpose)
  return palette?.colors.find((c) => c.level === level)?.hex ?? "#000000"
}

/** Resolve cornerId → radius */
function resolveCorner(id: string, corners: Corner[]): number {
  return corners.find((c) => c.id === id)?.radius ?? 0
}

/** Resolve typographyId → Typography */
function resolveTypography(
  id: string,
  typos: Typography[]
): Typography | undefined {
  return typos.find((t) => t.id === id)
}

/** Resolve shadowId → CSS string */
function resolveShadow(id: string, shadows: ShadowType[]): string {
  if (id === "none") return "none"
  const s = shadows.find((s) => s.id === id)
  return s ? `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}` : "none"
}

// ─── ButtonPreview ────────────────────────────────────────────────────────────

interface ResolvedButton {
  background: string
  foreground: string
  border: string
  radius: number
  fontFamily: string
  fontSize: number
  fontWeight: string
  paddingX: number
  paddingY: number
  shadow: string
  variant: DesignButtonVariant
}

function ButtonPreview({ btn }: { btn: ResolvedButton }) {
  return (
    <div
      className="inline-flex cursor-default items-center justify-center transition-all select-none"
      style={{
        backgroundColor:
          btn.background === "transparent" ? "transparent" : btn.background,
        color: btn.foreground,
        border: `1px solid ${btn.border === "transparent" ? "transparent" : btn.border}`,
        borderRadius: btn.radius >= 9999 ? 9999 : btn.radius,
        fontFamily: btn.fontFamily,
        fontSize: btn.fontSize,
        fontWeight: btn.fontWeight,
        paddingLeft: btn.paddingX,
        paddingRight: btn.paddingX,
        paddingTop: btn.paddingY,
        paddingBottom: btn.paddingY,
        boxShadow: btn.shadow === "none" ? "none" : btn.shadow,
        textDecoration: btn.variant === "link" ? "underline" : "none",
        textUnderlineOffset: btn.variant === "link" ? "4px" : undefined,
      }}
    >
      Button
    </div>
  )
}

/** Resolve a DesignButton from token refs to actual values */
function resolveButton(
  btn: DesignButton,
  palettes: ColorPalette[],
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): ResolvedButton {
  const typo = resolveTypography(btn.typographyId, typographies)
  return {
    background: resolveColor(btn.background, palettes),
    foreground: resolveColor(btn.foreground, palettes),
    border: resolveColor(btn.border, palettes),
    radius: resolveCorner(btn.cornerId, corners),
    fontFamily: typo?.fontFamily ?? "sans-serif",
    fontSize: typo?.fontSize ?? 14,
    fontWeight: typo?.fontWeight ?? "Regular",
    paddingX: btn.paddingX,
    paddingY: btn.paddingY,
    shadow: resolveShadow(btn.shadowId, shadows),
    variant: btn.variant,
  }
}

// ─── ColorTokenSelect ─────────────────────────────────────────────────────────

function ColorTokenSelect({
  label,
  value, // "primary::500" or "transparent"
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

// ─── ButtonEditor ─────────────────────────────────────────────────────────────

interface ButtonEditorProps {
  btn: DesignButton
  onCommit: (updated: Partial<DesignButton>) => void
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
}

function ButtonEditor({
  btn,
  onCommit,
  palettes,
  corners,
  shadows,
  typographies,
}: ButtonEditorProps) {
  const [paddingX, setPaddingX] = useState(String(btn.paddingX))
  const [paddingY, setPaddingY] = useState(String(btn.paddingY))

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
        value={btn.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Foreground"
        value={btn.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={btn.border}
        palettes={palettes}
        onChange={(v) => onCommit({ border: v })}
      />

      <Separator />

      {/* Corner */}
      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Corner Radius
        </FieldLabel>
        <Select
          value={btn.cornerId}
          onValueChange={(v) => onCommit({ cornerId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === btn.cornerId)
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
                commitNumber(paddingX, "paddingX", setPaddingX, btn.paddingX)
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
                commitNumber(paddingY, "paddingY", setPaddingY, btn.paddingY)
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
          value={btn.typographyId}
          onValueChange={(v) => onCommit({ typographyId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const t = typographies.find((t) => t.id === btn.typographyId)
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
          value={btn.shadowId}
          onValueChange={(v) => onCommit({ shadowId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {btn.shadowId === "none"
                ? "None"
                : (shadows.find((s) => s.id === btn.shadowId)?.name ??
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

// ─── ButtonRow ────────────────────────────────────────────────────────────────

interface ButtonRowProps {
  variant: DesignButtonVariant
  buttons: DesignButton[]
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (size: DesignButtonSize, updated: Partial<DesignButton>) => void
}

function ButtonRow({
  variant,
  buttons,
  palettes,
  corners,
  shadows,
  typographies,
  onCommit,
}: ButtonRowProps) {
  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      <div className="flex min-h-32 flex-col gap-6 px-6 py-8 md:col-span-3">
        <p className="text-xs font-medium text-muted-foreground capitalize">
          {variant}
        </p>
        <div className="flex flex-wrap items-end gap-4">
          {SIZES.map((size) => {
            const btn = buttons.find((b) => b.size === size)
            if (!btn) return null
            const resolved = resolveButton(
              btn,
              palettes,
              corners,
              shadows,
              typographies
            )
            return (
              <div key={size} className="flex flex-col items-center gap-2">
                <ButtonPreview btn={resolved} />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {size}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <Tabs defaultValue="default">
          <TabsList className="mb-3 w-full">
            {SIZES.map((size) => (
              <TabsTrigger
                key={size}
                value={size}
                className="flex-1 capitalize"
              >
                {size}
              </TabsTrigger>
            ))}
          </TabsList>
          {SIZES.map((size) => {
            const btn = buttons.find((b) => b.size === size)
            if (!btn) return null
            return (
              <TabsContent key={size} value={size}>
                <ButtonEditor
                  btn={btn}
                  palettes={palettes}
                  corners={corners}
                  shadows={shadows}
                  typographies={typographies}
                  onCommit={(updated) => onCommit(size, updated)}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

// ─── DSButton page ────────────────────────────────────────────────────────────

export function DSButton() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    variant: DesignButtonVariant,
    size: DesignButtonSize,
    updated: Partial<DesignButton>
  ) => {
    if (!project) return
    updateProject(id!, {
      designButton: project.designButton.map((b) =>
        b.variant === variant && b.size === size ? { ...b, ...updated } : b
      ),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designButton: resolveDesignButtonStarterPacks(
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
      <section className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-2">
          <h1 className="heading">Button</h1>
          <p>
            Customize button styles for each variant and size in your design
            system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw /> Reset
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border">
        {!project?.designButton || project.designButton.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MousePointerClick />
              </EmptyMedia>
              <EmptyTitle>No button styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default button styles.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={resetToDefault}>
                <RotateCcw /> Load Defaults
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          VARIANTS.map((variant) => {
            const buttons = (project.designButton ?? []).filter(
              (b) => b.variant === variant
            )
            return (
              <ButtonRow
                key={variant}
                variant={variant}
                buttons={buttons}
                palettes={palettes}
                corners={corners}
                shadows={shadows}
                typographies={typographies}
                onCommit={(size, updated) =>
                  handleCommit(variant, size, updated)
                }
              />
            )
          })
        )}
      </section>
    </main>
  )
}
