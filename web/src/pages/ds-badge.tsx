import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignBadge,
  type DesignBadgeVariant,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignBadgeStarterPacks } from "@/lib/constants"
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
import { Tag } from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANTS: DesignBadgeVariant[] = [
  "default",
  "secondary",
  "destructive",
  "error",
  "warning",
  "success",
  "outline",
]

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

// ─── BadgePreview ─────────────────────────────────────────────────────────────

interface ResolvedBadge {
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
}

function BadgePreview({ badge }: { badge: ResolvedBadge }) {
  return (
    <span
      className="inline-flex items-center justify-center whitespace-nowrap transition-all select-none"
      style={{
        backgroundColor:
          badge.background === "transparent" ? "transparent" : badge.background,
        color: badge.foreground,
        border: `1px solid ${badge.border === "transparent" ? "transparent" : badge.border}`,
        borderRadius: badge.radius >= 9999 ? 9999 : badge.radius,
        fontFamily: badge.fontFamily,
        fontSize: badge.fontSize,
        fontWeight: badge.fontWeight,
        paddingLeft: badge.paddingX,
        paddingRight: badge.paddingX,
        paddingTop: badge.paddingY,
        paddingBottom: badge.paddingY,
        boxShadow: badge.shadow === "none" ? "none" : badge.shadow,
      }}
    >
      Badge
    </span>
  )
}

function resolveBadge(
  badge: DesignBadge,
  palettes: ColorPalette[],
  corners: Corner[],
  shadows: ShadowType[],
  typographies: Typography[]
): ResolvedBadge {
  const typo = resolveTypography(badge.typographyId, typographies)
  return {
    background: resolveColor(badge.background, palettes),
    foreground: resolveColor(badge.foreground, palettes),
    border: resolveColor(badge.border, palettes),
    radius: resolveCorner(badge.cornerId, corners),
    fontFamily: typo?.fontFamily ?? "sans-serif",
    fontSize: typo?.fontSize ?? 12,
    fontWeight: typo?.fontWeight ?? "Medium",
    paddingX: badge.paddingX,
    paddingY: badge.paddingY,
    shadow: resolveShadow(badge.shadowId, shadows),
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

// ─── BadgeEditor ─────────────────────────────────────────────────────────────

interface BadgeEditorProps {
  badge: DesignBadge
  onCommit: (updated: Partial<DesignBadge>) => void
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
}

function BadgeEditor({
  badge,
  onCommit,
  palettes,
  corners,
  shadows,
  typographies,
}: BadgeEditorProps) {
  const [paddingX, setPaddingX] = useState(String(badge.paddingX))
  const [paddingY, setPaddingY] = useState(String(badge.paddingY))

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
        value={badge.background}
        palettes={palettes}
        onChange={(v) => onCommit({ background: v })}
      />
      <ColorTokenSelect
        label="Foreground"
        value={badge.foreground}
        palettes={palettes}
        onChange={(v) => onCommit({ foreground: v })}
      />
      <ColorTokenSelect
        label="Border"
        value={badge.border}
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
          value={badge.cornerId}
          onValueChange={(v) => onCommit({ cornerId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === badge.cornerId)
                return c
                  ? `${c.name} — ${c.radius >= 99 ? "Full" : `${c.radius}px`}`
                  : "Custom"
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {corners.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} — {c.radius >= 99 ? "Full" : `${c.radius}px`}
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
                commitNumber(paddingX, "paddingX", setPaddingX, badge.paddingX)
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
                commitNumber(paddingY, "paddingY", setPaddingY, badge.paddingY)
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
          value={badge.typographyId}
          onValueChange={(v) => onCommit({ typographyId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const t = typographies.find((t) => t.id === badge.typographyId)
                return t
                  ? `${t.name} — ${t.fontSize}px / ${t.fontWeight}`
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
          value={badge.shadowId}
          onValueChange={(v) => onCommit({ shadowId: v })}
        >
          <SelectTrigger>
            <SelectValue>
              {badge.shadowId === "none"
                ? "None"
                : (shadows.find((s) => s.id === badge.shadowId)?.name ??
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

// ─── BadgeRow ─────────────────────────────────────────────────────────────────

interface BadgeRowProps {
  variant: DesignBadgeVariant
  badge: DesignBadge | undefined
  palettes: ColorPalette[]
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (updated: Partial<DesignBadge>) => void
}

function BadgeRow({
  variant,
  badge,
  palettes,
  corners,
  shadows,
  typographies,
  onCommit,
}: BadgeRowProps) {
  if (!badge) return null
  const resolved = resolveBadge(badge, palettes, corners, shadows, typographies)

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-20 items-center px-6 py-8 md:col-span-3">
        <BadgePreview badge={resolved} />
      </div>

      {/* Editor */}
      <div className="flex flex-col border-t px-4 py-4 md:border-t-0 md:border-l">
        <p className="mb-3 text-xs font-medium text-muted-foreground capitalize">
          {variant}
        </p>
        <BadgeEditor
          badge={badge}
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

// ─── DSBadge page ──────────────────────────────────────────────────────────────

export function DSBadge() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (
    variant: DesignBadgeVariant,
    updated: Partial<DesignBadge>
  ) => {
    if (!project) return
    updateProject(id!, {
      designBadge: project.designBadge.map((b) =>
        b.variant === variant ? { ...b, ...updated } : b
      ),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      designBadge: resolveDesignBadgeStarterPacks(
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
          <h1 className="heading">Badge</h1>
          <p>Customize badge styles for each variant in your design system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw /> Reset
          </Button>
        </div>
      </section>

      <section className="border-t">
        {!project?.designBadge || project.designBadge.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Tag />
              </EmptyMedia>
              <EmptyTitle>No badge styles yet</EmptyTitle>
              <EmptyDescription>
                Reset to load the default badge styles.
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
            const badge = project.designBadge.find((b) => b.variant === variant)
            return (
              <BadgeRow
                key={variant}
                variant={variant}
                badge={badge}
                palettes={palettes}
                corners={corners}
                shadows={shadows}
                typographies={typographies}
                onCommit={(updated) => handleCommit(variant, updated)}
              />
            )
          })
        )}
      </section>
    </main>
  )
}
