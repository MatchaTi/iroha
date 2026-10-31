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
          <EmptyDescription>
            Create a new project to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link to="/new">Create Project</Link>} />
        </EmptyContent>
      </Empty>
    )
  }

  const handleDelete = () => {
    if (!id) return
    toast.add({
      title: "Project deleted",
      description: `${project.name} has been deleted.`,
    })
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

  // Samples
  const defaultBtn = project.designButton.find(
    (b) => b.variant === "default" && b.size === "default"
  )
  const outlineBtn = project.designButton.find(
    (b) => b.variant === "outline" && b.size === "default"
  )
  const errorBtn = project.designButton.find(
    (b) => b.variant === "error" && b.size === "default"
  )
  const defaultBadge = project.designBadge.find((b) => b.variant === "default")
  const errorBadge = project.designBadge.find((b) => b.variant === "error")
  const successBadge = project.designBadge.find((b) => b.variant === "success")
  const defaultInput = project.designInput.find((i) => i.state === "default")

  return (
    <main
      className="space-y-4 p-4"
      style={{ fontFamily: displayTypo?.fontFamily }}
    >
      {/* Header */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h2
            ref={nameRef}
            className="line-clamp-2 text-3xl font-bold outline-none lg:text-4xl"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: displayTypo?.fontFamily,
              fontSize: displayTypo?.fontSize,
              fontWeight: displayTypo?.fontWeight,
              lineHeight: `${displayTypo?.lineHeight}px`,
            }}
          >
            {project.name}
          </h2>
          <p
            ref={descRef}
            className="max-w-xl text-sm text-muted-foreground outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescBlur}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: bodyTypo?.fontFamily,
              fontSize: bodyTypo?.fontSize,
              fontWeight: bodyTypo?.fontWeight,
              lineHeight: `${bodyTypo?.lineHeight}px`,
            }}
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
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
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
            {copied ? (
              <>
                <Check /> Copied
              </>
            ) : (
              <>
                <Copy /> Copy
              </>
            )}
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download /> Export
          </Button>
        </div>
      </section>

      {/* Bento grid — 4 columns on lg */}
      <section className="grid auto-rows-[120px] grid-cols-2 gap-3 lg:auto-rows-[140px] lg:grid-cols-4">
        {/* Color Palette — big, top-left, spans 2 cols × 2 rows */}
        <div className="col-span-2 row-span-2 flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Color Palette
          </p>
          <div className="flex flex-1 flex-col justify-center gap-2">
            {palettes.slice(0, 4).map((palette) => (
              <div key={palette.id} className="flex items-center gap-2">
                <span className="w-14 shrink-0 truncate text-xs text-muted-foreground capitalize">
                  {palette.name}
                </span>
                <div className="flex flex-1 gap-0.5">
                  {palette.colors.map((color) => (
                    <div
                      key={color.level}
                      className="flex-1 rounded-sm transition-all hover:scale-y-110"
                      style={{ backgroundColor: color.hex, height: 24 }}
                      title={`${palette.name} ${color.level} — ${color.hex}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography — top-right, spans 2 cols */}
        <div className="col-span-2 flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Typography
          </p>
          <div className="flex flex-1 items-end justify-around">
            {typographies.slice(0, 4).map((t) => (
              <div key={t.id} className="flex flex-col items-center gap-1">
                <span
                  style={{
                    fontFamily: t.fontFamily,
                    fontSize: Math.min(t.fontSize, 28),
                    fontWeight: t.fontWeight,
                    lineHeight: 1,
                  }}
                >
                  Aa
                </span>
                <span className="font-mono text-[8px] text-muted-foreground">
                  {t.fontSize}px
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Corner — mid-right */}
        <div className="flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">Corner</p>
          <div className="flex flex-1 flex-wrap items-center justify-around gap-2">
            {corners.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="size-8 border-2 border-foreground/20 bg-foreground/5"
                style={{ borderRadius: Math.min(c.radius, 32) }}
              />
            ))}
          </div>
        </div>

        {/* Shadow — mid-right */}
        <div className="flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">Shadow</p>
          <div className="flex flex-1 flex-wrap items-center justify-around gap-2">
            {shadows.map((s) => (
              <div
                key={s.id}
                className="size-8 rounded-xl bg-background"
                style={{
                  boxShadow: `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Button — bottom-left, spans 2 cols */}
        <div className="col-span-2 flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">Button</p>
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {[defaultBtn, outlineBtn, errorBtn].map((btn, i) => {
              if (!btn) return null
              const typo = resolveTypography(btn.typographyId, typographies)
              const radius = resolveCorner(btn.cornerId, corners)
              return (
                <span
                  key={i}
                  className="inline-flex items-center justify-center whitespace-nowrap"
                  style={{
                    backgroundColor:
                      resolveColor(btn.background, palettes) === "transparent"
                        ? "transparent"
                        : resolveColor(btn.background, palettes),
                    color: resolveColor(btn.foreground, palettes),
                    border: `1px solid ${resolveColor(btn.border, palettes) === "transparent" ? "transparent" : resolveColor(btn.border, palettes)}`,
                    borderRadius: radius >= 9999 ? 9999 : radius,
                    fontFamily: typo?.fontFamily,
                    fontSize: typo?.fontSize ?? 14,
                    fontWeight: typo?.fontWeight ?? "Medium",
                    paddingLeft: btn.paddingX,
                    paddingRight: btn.paddingX,
                    paddingTop: btn.paddingY,
                    paddingBottom: btn.paddingY,
                    boxShadow: resolveShadow(btn.shadowId, shadows),
                  }}
                >
                  {["Default", "Outline", "Error"][i]}
                </span>
              )
            })}
          </div>
        </div>

        {/* Badge */}
        <div className="flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">Badge</p>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {[defaultBadge, errorBadge, successBadge].map((badge, i) => {
              if (!badge) return null
              const typo = resolveTypography(badge.typographyId, typographies)
              const radius = resolveCorner(badge.cornerId, corners)
              return (
                <span
                  key={i}
                  className="inline-flex items-center justify-center whitespace-nowrap"
                  style={{
                    backgroundColor:
                      resolveColor(badge.background, palettes) === "transparent"
                        ? "transparent"
                        : resolveColor(badge.background, palettes),
                    color: resolveColor(badge.foreground, palettes),
                    border: `1px solid ${resolveColor(badge.border, palettes) === "transparent" ? "transparent" : resolveColor(badge.border, palettes)}`,
                    borderRadius: radius >= 9999 ? 9999 : radius,
                    fontFamily: typo?.fontFamily,
                    fontSize: typo?.fontSize ?? 12,
                    fontWeight: typo?.fontWeight ?? "Medium",
                    paddingLeft: badge.paddingX,
                    paddingRight: badge.paddingX,
                    paddingTop: badge.paddingY,
                    paddingBottom: badge.paddingY,
                  }}
                >
                  {["Def", "Err", "Ok"][i]}
                </span>
              )
            })}
          </div>
        </div>

        {/* Input — bottom, spans 2 cols */}
        <div className="col-span-2 flex flex-col gap-3 rounded-2xl border p-4">
          <p className="text-xs font-medium text-muted-foreground">Input</p>
          {defaultInput &&
            (() => {
              const typo = resolveTypography(
                defaultInput.typographyId,
                typographies
              )
              const radius = resolveCorner(defaultInput.cornerId, corners)
              return (
                <div className="flex flex-1 items-center">
                  <div className="flex w-full max-w-xs flex-col gap-1">
                    <label
                      className="text-sm font-medium"
                      style={{
                        color: resolveColor(defaultInput.label, palettes),
                      }}
                    >
                      Label
                    </label>
                    <input
                      placeholder="Placeholder"
                      className="w-full outline-none"
                      style={{
                        backgroundColor: resolveColor(
                          defaultInput.background,
                          palettes
                        ),
                        color: resolveColor(defaultInput.foreground, palettes),
                        border: `1px solid ${resolveColor(defaultInput.border, palettes)}`,
                        borderRadius: radius >= 9999 ? 9999 : radius,
                        fontFamily: typo?.fontFamily,
                        fontSize: typo?.fontSize ?? 14,
                        fontWeight: typo?.fontWeight,
                        paddingLeft: defaultInput.paddingX,
                        paddingRight: defaultInput.paddingX,
                        paddingTop: defaultInput.paddingY,
                        paddingBottom: defaultInput.paddingY,
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: resolveColor(defaultInput.helper, palettes),
                      }}
                    >
                      Helper text
                    </span>
                  </div>
                </div>
              )
            })()}
        </div>
      </section>
    </main>
  )
}
