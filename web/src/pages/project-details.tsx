import { PDColorPalette } from "@/components/project-details/pd-color-palette"
import { PDComponents } from "@/components/project-details/pd-components"
import { PDEnv } from "@/components/project-details/pd-env"
import { PDIcons } from "@/components/project-details/pd-icons"
import { PDKitchenIsland } from "@/components/project-details/pd-kitchen-island"
import { PDProfile } from "@/components/project-details/pd-profile"
import { PDTypography } from "@/components/project-details/pd-typography"
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/toast"
import { useProject } from "@/store/use-project"
import { Check, Copy, Download, Palette, Trash } from "lucide-react"
import { useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

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
    navigate("/new")
  }

  const palettes = project.colorPalette ?? []
  const typographies = project.typography ?? []

  const displayTypo =
    typographies.find((t) => t.purpose === "display" && t.level === "large") ??
    typographies[0]

  const primaryPalette = palettes.find((p) => p.purpose === "primary")

  return (
    <main className="flex h-[calc(100svh-3rem)] w-full flex-col gap-4 overflow-hidden p-4 lg:h-[calc(100svh-4px)]">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="font-semibold"
            ref={nameRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
          >
            {project.name}
          </h1>
          <p
            className="line-clamp-1 text-xs text-muted-foreground"
            ref={descRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescBlur}
            onKeyDown={handleKeyDown}
          >
            {project.description || "Add a description..."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="icon-lg">
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
                <AlertDialogCancel size={"lg"}>Cancel</AlertDialogCancel>
                <Button variant="destructive" size="lg" onClick={handleDelete}>
                  <Trash /> Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="lg" variant="secondary" onClick={handleCopy}>
            {copied ? (
              <>
                <Check /> Copied
              </>
            ) : (
              <>
                <Copy /> Copy design tokens
              </>
            )}
          </Button>
          <Button size="lg" onClick={handleExport} variant={"secondary"}>
            <Download /> Export design tokens
          </Button>
        </div>
      </section>

      <ScrollArea
        className={"min-h-0 w-full flex-1 rounded-xl border"}
        style={{ fontFamily: displayTypo?.fontFamily ?? "inherit" }}
      >
        <div className="grid min-w-max grid-cols-[repeat(8,_400px)] gap-8 p-4 lg:p-16">
          <div className="space-y-8">
            <PDColorPalette
              name={project.name}
              description={project.description}
              colors={primaryPalette?.colors ?? []}
            />
            <PDTypography
              fontFamily={displayTypo?.fontFamily ?? "N/A"}
              project={project}
            />
          </div>
          <div className="space-y-8">
            <PDIcons project={project} />
            <PDComponents project={project} />
          </div>
          <div className="space-y-8">
            <PDEnv project={project} />
            <PDProfile project={project} />
          </div>
          <div className="space-y-8">
            <PDKitchenIsland project={project} />
          </div>
          {/*
          <div className="space-y-8">hello</div>
          <div className="space-y-8">hello</div>
          <div className="space-y-8">hello</div>
          <div className="space-y-8">hello</div>
          <div className="space-y-8">hello</div>
            */}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  )
}
