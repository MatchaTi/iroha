import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import {
  useProject,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { Check, Copy, Download, Palette, Trash } from "lucide-react"
import { useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

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

function getContrastColor(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16)
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return lum > 150 ? "#1A1A1A" : "#FFFFFF"
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Separator />
      {children}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const getProject = useProject((s) => s.getProject)
  const updateProject = useProject((s) => s.updateProject)
  const deleteProject = useProject((s) => s.deleteProject)
  const project = id ? getProject(id) : undefined
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const navigate = useNavigate()

  function handleNameBlur() {
    if (!id || !nameRef.current) return
    const value = nameRef.current.textContent?.trim() ?? ""
    if (value) updateProject(id, { name: value })
    else if (project) nameRef.current.textContent = project.name
  }

  function handleDescBlur() {
    if (!id || !descRef.current) return
    const value = descRef.current.textContent?.trim() ?? ""
    updateProject(id, { description: value })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  function handleExport() {
    if (!project) return
    const json = JSON.stringify(project, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-tokens.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopy() {
    if (!project) return
    navigator.clipboard.writeText(JSON.stringify(project, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!project) {
    return (
      <Empty className="flex h-screen w-full items-center justify-center">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Palette />
          </EmptyMedia>
          <EmptyTitle>No project found</EmptyTitle>
          <EmptyDescription>Create a new project to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link to="/new">Create Project</Link>} />
        </EmptyContent>
      </Empty>
    )
  }

  const handleDelete = () => {
    if (!id) return
    toast.add({ title: "Project deleted", description: `${project.name} has been deleted.` })
    deleteProject(id)
    navigate("/dashboard")
  }

  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []

  const displayTypo =
    typographies.find((t) => t.purpose === "display" && t.level === "large") ??
    typographies[0]
  const bodyTypo =
    typographies.find((t) => t.purpose === "body" && t.level === "medium") ??
    typographies[0]

  // Primary palette untuk color section
  const primaryPalette = palettes.find((p) => p.purpose === "primary")
  const anchor500 = primaryPalette?.colors.find((c) => c.level === "500")
  const otherShades = primaryPalette?.colors.filter((c) => c.level !== "500") ?? []

  // Button samples — all variants × all sizes
  const BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "error", "warning", "success", "link"] as const
  const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const

  // Input per state
  const INPUT_STATES = ["default", "focus", "error", "disabled"] as const

  // Badge all variants
  const BADGE_VARIANTS = ["default", "secondary", "destructive", "error", "warning", "success", "outline"] as const

  return (
    <main className="space-y-16 overflow-x-hidden p-4 lg:p-10">
      {/* ── Header ── */}
      <section className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          <h1
            ref={nameRef}
            className="text-4xl font-bold outline-none lg:text-5xl"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: displayTypo?.fontFamily,
              fontWeight: displayTypo?.fontWeight,
            }}
          >
            {project.name}
          </h1>
          <p
            ref={descRef}
            className="max-w-2xl text-muted-foreground outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescBlur}
            onKeyDown={handleKeyDown}
            style={{ fontFamily: bodyTypo?.fontFamily }}
          >
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm">
                  <Trash />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash /> Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download /> Export
          </Button>
        </div>
      </section>

      {/* ── Color Palette ── */}
      {primaryPalette && (
        <Section
          title={`${primaryPalette.name} Colors`}
          description="Primary color palette"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[2fr_repeat(3,1fr)] sm:grid-rows-2">
            {/* Card besar — shade 500 */}
            {anchor500 && (
              <div
                className="col-span-2 flex flex-col justify-between rounded-2xl p-6 sm:col-span-1 sm:row-span-2"
                style={{ backgroundColor: anchor500.hex }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest opacity-70"
                    style={{ color: getContrastColor(anchor500.hex) }}
                  >
                    HEX CODE:
                  </p>
                  <p
                    className="mt-1 text-3xl font-bold"
                    style={{ color: getContrastColor(anchor500.hex) }}
                  >
                    {anchor500.hex.toUpperCase().replace("#", "")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${getContrastColor(anchor500.hex)}20`,
                      color: getContrastColor(anchor500.hex),
                    }}
                  >
                    {primaryPalette.name}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${getContrastColor(anchor500.hex)}20`,
                      color: getContrastColor(anchor500.hex),
                    }}
                  >
                    500
                  </span>
                </div>
              </div>
            )}

            {/* Grid shade lainnya */}
            {otherShades.slice(0, 6).map((color) => (
              <div
                key={color.level}
                className="flex aspect-square items-center justify-center rounded-xl p-2"
                style={{ backgroundColor: color.hex }}
              >
                <span
                  className="font-mono text-xs font-medium"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  {color.hex.toUpperCase().replace("#", "")}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Typography ── */}
      {typographies.length > 0 && (
        <Section
          title={`${displayTypo?.fontFamily ?? "Typography"} Font Family`}
          description="Type styles and specimen"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Kiri — alphabet + description */}
            <div className="space-y-6">
              <p
                className="text-lg leading-relaxed"
                style={{ fontFamily: displayTypo?.fontFamily }}
              >
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm{" "}
                Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz{" "}
                1234567890 !@#$%^&*
              </p>
              <p
                className="text-sm text-muted-foreground"
                style={{ fontFamily: bodyTypo?.fontFamily }}
              >
                {project.description || "A versatile typeface for modern interfaces, designed for clarity across all screen sizes."}
              </p>
              {/* Heading scale preview */}
              <div className="flex flex-wrap items-end gap-4">
                {typographies
                  .filter((t) => t.purpose === "display" || t.purpose === "headline")
                  .slice(0, 6)
                  .map((t, i) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-center rounded-xl border bg-muted/40 font-bold"
                      style={{
                        fontFamily: t.fontFamily,
                        fontSize: Math.max(14, 40 - i * 5),
                        width: Math.max(48, 88 - i * 10),
                        height: Math.max(48, 88 - i * 10),
                      }}
                    >
                      {["H1", "H2", "H3", "H4", "H5", "H6"][i]}
                    </div>
                  ))}
              </div>
            </div>

            {/* Kanan — specimen list */}
            <div className="space-y-4 lg:border-l lg:pl-8">
              {typographies.slice(0, 8).map((t) => (
                <div key={t.id} className="border-b pb-3 last:border-b-0">
                  <p
                    style={{
                      fontFamily: t.fontFamily,
                      fontSize: Math.min(t.fontSize, 24),
                      fontWeight: t.fontWeight,
                      lineHeight: 1.3,
                    }}
                  >
                    The Quick Brown Fox Jumps Over The Lazy Dogs
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {t.purpose}/{t.level} · {t.fontFamily} · {t.fontSize}px / {t.fontWeight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ── Button ── */}
      {project.designButton.length > 0 && (
        <Section
          title="Buttons"
          description="Button styles for each variant and size"
        >
          <div className="space-y-6">
            {BUTTON_SIZES.map((size) => {
              const btns = BUTTON_VARIANTS.map((variant) =>
                project.designButton.find((b) => b.variant === variant && b.size === size)
              ).filter(Boolean)
              if (!btns.length) return null
              return (
                <div key={size} className="space-y-2">
                  <p className="font-mono text-xs text-muted-foreground capitalize">
                    Size: {size}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {btns.map((btn) => {
                      if (!btn) return null
                      const typo = resolveTypography(btn.typographyId, typographies)
                      const radius = resolveCorner(btn.cornerId, corners)
                      return (
                        <span
                          key={btn.variant}
                          className="inline-flex cursor-default items-center justify-center select-none"
                          style={{
                            backgroundColor: resolveColor(btn.background, palettes) === "transparent" ? "transparent" : resolveColor(btn.background, palettes),
                            color: resolveColor(btn.foreground, palettes),
                            border: `1px solid ${resolveColor(btn.border, palettes) === "transparent" ? "transparent" : resolveColor(btn.border, palettes)}`,
                            borderRadius: radius >= 9999 ? 9999 : radius,
                            fontFamily: typo?.fontFamily,
                            fontSize: typo?.fontSize ?? 14,
                            fontWeight: typo?.fontWeight,
                            paddingLeft: btn.paddingX,
                            paddingRight: btn.paddingX,
                            paddingTop: btn.paddingY,
                            paddingBottom: btn.paddingY,
                            boxShadow: resolveShadow(btn.shadowId, shadows),
                            textDecoration: btn.variant === "link" ? "underline" : "none",
                          }}
                        >
                          Button
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── Input Fields ── */}
      {project.designInput.length > 0 && (
        <Section
          title="Input Fields"
          description="Input styles for each state"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INPUT_STATES.map((state) => {
              const inp = project.designInput.find((i) => i.state === state)
              if (!inp) return null
              const typo = resolveTypography(inp.typographyId, typographies)
              const radius = resolveCorner(inp.cornerId, corners)
              return (
                <div key={state} className="space-y-3">
                  <p className="font-mono text-xs capitalize text-muted-foreground">
                    {state}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-sm font-medium"
                      style={{ color: resolveColor(inp.label, palettes) }}
                    >
                      Input Field
                    </label>
                    <input
                      readOnly
                      placeholder="Placeholder"
                      className="w-full outline-none"
                      style={{
                        backgroundColor: resolveColor(inp.background, palettes),
                        color: resolveColor(inp.foreground, palettes),
                        border: `1px solid ${resolveColor(inp.border, palettes)}`,
                        borderRadius: radius >= 9999 ? 9999 : radius,
                        fontFamily: typo?.fontFamily,
                        fontSize: typo?.fontSize ?? 14,
                        fontWeight: typo?.fontWeight,
                        paddingLeft: inp.paddingX,
                        paddingRight: inp.paddingX,
                        paddingTop: inp.paddingY,
                        paddingBottom: inp.paddingY,
                        opacity: state === "disabled" ? 0.5 : 1,
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: resolveColor(inp.helper, palettes) }}
                    >
                      Helper text
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── Badge ── */}
      {project.designBadge.length > 0 && (
        <Section
          title="Badge"
          description="Badge styles for each variant"
        >
          <div className="flex flex-wrap items-center gap-3">
            {BADGE_VARIANTS.map((variant) => {
              const badge = project.designBadge.find((b) => b.variant === variant)
              if (!badge) return null
              const typo = resolveTypography(badge.typographyId, typographies)
              const radius = resolveCorner(badge.cornerId, corners)
              return (
                <span
                  key={variant}
                  className="inline-flex cursor-default items-center justify-center select-none"
                  style={{
                    backgroundColor: resolveColor(badge.background, palettes) === "transparent" ? "transparent" : resolveColor(badge.background, palettes),
                    color: resolveColor(badge.foreground, palettes),
                    border: `1px solid ${resolveColor(badge.border, palettes) === "transparent" ? "transparent" : resolveColor(badge.border, palettes)}`,
                    borderRadius: radius >= 9999 ? 9999 : radius,
                    fontFamily: typo?.fontFamily,
                    fontSize: typo?.fontSize ?? 12,
                    fontWeight: typo?.fontWeight,
                    paddingLeft: badge.paddingX,
                    paddingRight: badge.paddingX,
                    paddingTop: badge.paddingY,
                    paddingBottom: badge.paddingY,
                  }}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </span>
              )
            })}
          </div>
        </Section>
      )}
    </main>
  )
}
