import { useState, useMemo } from "react"
import { useParams } from "react-router"
import {
  useProject,
  type Project,
  type ColorPalette,
  type Corner,
  type Shadow as ShadowType,
  type Typography,
} from "@/store/use-project"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check, FileText } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// ─── Token resolvers ──────────────────────────────────────────────────────────

function resolveColor(
  ref: string | null | undefined,
  palettes: ColorPalette[]
): string {
  if (!ref) return "—"
  if (ref === "transparent") return "transparent"
  if (!ref.includes("::")) return ref
  const [purpose, level] = ref.split("::")
  const palette = palettes.find((p) => p.purpose === purpose)
  return palette?.colors.find((c) => c.level === level)?.hex ?? "—"
}

function resolveCornerRadius(id: string, corners: Corner[]): string {
  const c = corners.find((c) => c.id === id)
  return c ? (c.radius >= 99 ? "9999px" : `${c.radius}px`) : "—"
}

function resolveTypoName(id: string, typographies: Typography[]): string {
  return typographies.find((t) => t.id === id)?.name ?? "—"
}

function resolveShadowName(id: string, shadows: ShadowType[]): string {
  if (id === "none") return "none"
  return shadows.find((s) => s.id === id)?.name ?? "—"
}

// ─── Markdown generator ───────────────────────────────────────────────────────

function generateMarkdown(project: Project): string {
  const lines: string[] = []
  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []

  // ── Frontmatter (YAML) ──
  lines.push("---")
  lines.push(`name: ${project.name}`)
  lines.push("colors:")
  for (const palette of palettes) {
    const anchor = palette.colors.find((c) => c.level === "500")
    if (anchor) {
      lines.push(`  ${palette.purpose}: "${anchor.hex}"`)
    }
  }
  lines.push("typography:")
  for (const t of typographies) {
    const key = `${t.purpose}-${t.level}`.toLowerCase()
    lines.push(`  ${key}:`)
    lines.push(`    fontFamily: ${t.fontFamily}`)
    lines.push(`    fontSize: ${t.fontSize}px`)
    lines.push(`    fontWeight: ${t.fontWeight}`)
  }
  lines.push("rounded:")
  for (const c of corners) {
    const key = c.name.toLowerCase().replace(/\s+/g, "-")
    lines.push(`  ${key}: ${c.radius >= 9999 ? "9999px" : `${c.radius}px`}`)
  }
  lines.push("shadow:")
  for (const s of shadows) {
    const key = s.name.toLowerCase().replace(/\s+/g, "-")
    lines.push(
      `  ${key}: ${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
    )
  }
  lines.push("---")
  lines.push("")

  // ── Title ──
  lines.push("# Design System")
  lines.push("")

  // ── Overview ──
  lines.push("## Overview")
  if (project.description) {
    lines.push(project.description)
  } else {
    lines.push(`Design tokens for ${project.name}.`)
  }
  lines.push("")

  // ── Colors ──
  lines.push("## Colors")
  for (const palette of palettes) {
    const anchor = palette.colors.find((c) => c.level === "500")
    if (anchor) {
      lines.push(`- **${palette.name}** (${anchor.hex}): ${palette.purpose}`)
    }
  }
  lines.push("")

  // ── Typography ──
  lines.push("## Typography")
  for (const t of typographies) {
    lines.push(
      `- **${t.name}** (${t.purpose}/${t.level}): ${t.fontFamily}, ${t.fontSize}px, ${t.fontWeight}, ${t.lineHeight}px line-height, ${t.letterSpacing}px letter-spacing`
    )
  }
  lines.push("")

  // ── Corner Radius ──
  lines.push("## Corner Radius")
  for (const c of corners) {
    lines.push(
      `- **${c.name}**: ${c.radius >= 9999 ? "9999px (full)" : `${c.radius}px`}`
    )
  }
  lines.push("")

  // ── Shadow ──
  lines.push("## Shadow")
  for (const s of shadows) {
    lines.push(
      `- **${s.name}**: \`${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}\``
    )
  }
  lines.push("")

  // ── Components ──
  lines.push("## Components")
  lines.push("")

  // Button
  if (project.designButton?.length > 0) {
    lines.push("### Button")
    for (const btn of project.designButton) {
      lines.push(
        `- **${btn.variant} (${btn.size})**: bg ${resolveColor(btn.background, palettes)}, fg ${resolveColor(btn.foreground, palettes)}, border ${resolveColor(btn.border, palettes)}, radius ${resolveCornerRadius(btn.cornerId, corners)}, ${resolveTypoName(btn.typographyId, typographies)}, shadow ${resolveShadowName(btn.shadowId, shadows)}, ${btn.paddingX}×${btn.paddingY}px`
      )
    }
    lines.push("")
  }

  // Input
  if (project.designInput?.length > 0) {
    lines.push("### Input")
    for (const inp of project.designInput) {
      lines.push(
        `- **${inp.state}**: bg ${resolveColor(inp.background, palettes)}, fg ${resolveColor(inp.foreground, palettes)}, border ${resolveColor(inp.border, palettes)}, placeholder ${resolveColor(inp.placeholder, palettes)}, label ${resolveColor(inp.label, palettes)}, helper ${resolveColor(inp.helper, palettes)}, radius ${resolveCornerRadius(inp.cornerId, corners)}, ${resolveTypoName(inp.typographyId, typographies)}, shadow ${resolveShadowName(inp.shadowId, shadows)}`
      )
    }
    lines.push("")
  }

  // Badge
  if (project.designBadge?.length > 0) {
    lines.push("### Badge")
    for (const badge of project.designBadge) {
      lines.push(
        `- **${badge.variant}**: bg ${resolveColor(badge.background, palettes)}, fg ${resolveColor(badge.foreground, palettes)}, border ${resolveColor(badge.border, palettes)}, radius ${resolveCornerRadius(badge.cornerId, corners)}, ${resolveTypoName(badge.typographyId, typographies)}, shadow ${resolveShadowName(badge.shadowId, shadows)}, ${badge.paddingX}×${badge.paddingY}px`
      )
    }
    lines.push("")
  }

  // ── Do's and Don'ts ──
  lines.push("## Do's and Don'ts")
  lines.push(
    "- Do use the primary color sparingly, only for the most important action"
  )
  lines.push("- Don't mix rounded and sharp corners in the same view")
  lines.push("- Do maintain 4:1 contrast ratio for all text")
  lines.push("- Don't use more than 2 font families in a single component")

  return lines.join("\n")
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DesignMD() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const [copied, setCopied] = useState(false)

  const markdown = useMemo(
    () => (project ? generateMarkdown(project) : ""),
    [project]
  )

  function handleCopy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    if (!project) return
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!project) {
    return (
      <Empty className="flex h-screen w-full items-center justify-center">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No project found</EmptyTitle>
          <EmptyDescription>
            Create a new project to get started.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <main className="space-y-4 p-4">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-2">
          <h1 className="heading">DESIGN.md</h1>
          <p>Auto-generated design system documentation from your tokens</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
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
          <Button size="sm" onClick={handleDownload}>
            <Download /> Download
          </Button>
        </div>
      </section>

      {/* Markdown preview as code block */}
      <section className="overflow-hidden rounded-2xl border">
        <div className="border-b bg-sidebar px-4 py-2">
          <p className="font-mono text-xs text-muted-foreground">DESIGN.md</p>
        </div>
        <pre className="max-h-[85vh] overflow-auto p-4">
          <code className="font-mono text-xs leading-relaxed">{markdown}</code>
        </pre>
      </section>
    </main>
  )
}
