import { useState } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type DesignButton,
  type DesignButtonVariant,
  type DesignButtonSize,
  type DesignButtonVariantConfig,
  type DesignButtonSizeConfig,
  type ColorPalette,
  type Corner,
  type Project,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { resolveDesignButtonStarterPacks } from "@/lib/constants"
import {
  DesignButton as DesignButtonPreview,
  DESIGN_BUTTON_VARIANTS,
} from "@/components/shared/design-button"
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

function formatRadius(r: number) {
  return r >= 99 ? "Full" : `${r}px`
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DSButton() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  if (!project?.designButton) return null

  // Guard: localStorage might still have old array format
  const btn = Array.isArray(project.designButton) ? null : project.designButton
  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []

  const commitShared = (
    updated: Partial<
      Pick<DesignButton, "cornerId" | "typographyId" | "shadowId">
    >
  ) => {
    if (!btn) return
    updateProject(id!, { designButton: { ...btn, ...updated } })
  }

  const commitVariant = (
    variant: DesignButtonVariant,
    updated: Partial<DesignButtonVariantConfig>
  ) => {
    if (!btn) return
    updateProject(id!, {
      designButton: {
        ...btn,
        variants: btn.variants.map((v) =>
          v.variant === variant ? { ...v, ...updated } : v
        ),
      },
    })
  }

  const commitSize = (
    size: DesignButtonSize,
    updated: Partial<DesignButtonSizeConfig>
  ) => {
    if (!btn) return
    updateProject(id!, {
      designButton: {
        ...btn,
        sizes: btn.sizes.map((s) =>
          s.size === size ? { ...s, ...updated } : s
        ),
      },
    })
  }

  const resetToDefault = () => {
    updateProject(id!, {
      designButton: resolveDesignButtonStarterPacks(
        corners,
        shadows,
        typographies
      ),
    })
  }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Button</h1>
          <p>
            Customize button styles for each variant and size in your design
            system
          </p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw /> Reset
        </Button>
      </section>

      <section className="border-t">
        {!btn ? (
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
          <Tabs defaultValue="variants">
            {/* Tab nav */}
            <div className="border-b px-4 pt-4">
              <TabsList variant="line">
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="sizes">Sizes</TabsTrigger>
                <TabsTrigger value="shared">Shared Tokens</TabsTrigger>
              </TabsList>
            </div>

            {/* ── Variants tab ── */}
            <TabsContent value="variants">
              {DESIGN_BUTTON_VARIANTS.map((variant) => {
                const vc = btn.variants.find((v) => v.variant === variant)
                if (!vc) return null
                return (
                  <div
                    key={variant}
                    className="grid border-b last:border-b-0 md:grid-cols-4"
                  >
                    {/* Preview — all sizes */}
                    <div className="flex min-h-24 flex-col gap-4 px-6 py-6 md:col-span-3">
                      <p className="text-xs font-medium text-muted-foreground capitalize">
                        {variant}
                      </p>
                      <div className="flex flex-wrap items-end gap-3">
                        {btn.sizes.map((sc) => (
                          <div
                            key={sc.size}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <DesignButtonPreview
                              project={project}
                              design={btn}
                              variant={variant}
                              size={sc.size}
                            />
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {sc.size}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Color editor */}
                    <div className="flex flex-col gap-3 border-t px-4 py-4 md:border-t-0 md:border-l">
                      <ColorTokenSelect
                        label="Background"
                        value={vc.background}
                        palettes={palettes}
                        onChange={(v) =>
                          commitVariant(variant, { background: v })
                        }
                      />
                      <ColorTokenSelect
                        label="Foreground"
                        value={vc.foreground}
                        palettes={palettes}
                        onChange={(v) =>
                          commitVariant(variant, { foreground: v })
                        }
                      />
                      <ColorTokenSelect
                        label="Border"
                        value={vc.border}
                        palettes={palettes}
                        onChange={(v) => commitVariant(variant, { border: v })}
                      />
                    </div>
                  </div>
                )
              })}
            </TabsContent>

            {/* ── Sizes tab ── */}
            <TabsContent value="sizes">
              {btn.sizes.map((sc) => (
                <SizeRow
                  key={sc.size}
                  sizeConfig={sc}
                  project={project}
                  onCommit={(updated) => commitSize(sc.size, updated)}
                />
              ))}
            </TabsContent>

            {/* ── Shared tokens tab ── */}
            <TabsContent value="shared">
              <SharedEditor
                btn={btn}
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

// ─── SizeRow ──────────────────────────────────────────────────────────────────

function SizeRow({
  sizeConfig,
  project,
  onCommit,
}: {
  sizeConfig: DesignButtonSizeConfig
  project: Project
  onCommit: (updated: Partial<DesignButtonSizeConfig>) => void
}) {
  const [paddingX, setPaddingX] = useState(String(sizeConfig.paddingX))
  const [paddingY, setPaddingY] = useState(String(sizeConfig.paddingY))

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
    <div className="grid border-b md:grid-cols-4">
      {/* Preview — all variants at this size */}
      <div className="flex min-h-24 flex-col gap-4 px-6 py-6 md:col-span-3">
        <p className="text-xs font-medium text-muted-foreground capitalize">
          {sizeConfig.size}
        </p>
        <div className="flex flex-wrap items-end gap-3">
          {DESIGN_BUTTON_VARIANTS.slice(0, 5).map((variant) => (
            <DesignButtonPreview
              key={variant}
              project={project}
              variant={variant}
              size={sizeConfig.size}
            />
          ))}
        </div>
      </div>
      {/* Padding editor */}
      <div className="flex flex-col gap-3 border-t px-4 py-4 md:border-t-0 md:border-l">
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
                  commitNumber(
                    paddingX,
                    "paddingX",
                    setPaddingX,
                    sizeConfig.paddingX
                  )
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
                  commitNumber(
                    paddingY,
                    "paddingY",
                    setPaddingY,
                    sizeConfig.paddingY
                  )
                }
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>
        </div>
      </div>
    </div>
  )
}

// ─── SharedEditor ─────────────────────────────────────────────────────────────

function SharedEditor({
  btn,
  corners,
  shadows,
  typographies,
  onCommit,
}: {
  btn: DesignButton
  corners: Corner[]
  shadows: ShadowType[]
  typographies: Typography[]
  onCommit: (
    updated: Partial<
      Pick<DesignButton, "cornerId" | "typographyId" | "shadowId">
    >
  ) => void
}) {
  return (
    <div className="flex max-w-sm flex-col gap-4 p-6">
      <p className="text-xs text-muted-foreground">
        These tokens apply to all variants and sizes.
      </p>

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Corner Radius
        </FieldLabel>
        <Select
          value={btn.cornerId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ cornerId: v })
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const c = corners.find((c) => c.id === btn.cornerId)
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
          value={btn.typographyId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ typographyId: v })
          }}
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

      <Field>
        <FieldLabel className="text-xs text-muted-foreground">
          Shadow
        </FieldLabel>
        <Select
          value={btn.shadowId}
          onValueChange={(v) => {
            if (v !== null) onCommit({ shadowId: v })
          }}
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
