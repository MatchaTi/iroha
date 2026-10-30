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
import { useProject, type Project } from "@/store/use-project"
import { Check, Copy, Download, Palette, Trash } from "lucide-react"
import { useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

function buildTokenPayload(project: Project) {
  return {
    name: project.name,
    description: project.description,
    templateColorPalette: project.templateColorPalette || "one",
    templateTypography: project.templateTypography || "one",
    colorPalette: project.colorPalette,
    typography: project.typography,
  }
}

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
    const payload = buildTokenPayload(project)
    const json = JSON.stringify(payload, null, 2)
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
    const payload = buildTokenPayload(project)
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!project) {
    return (
      <Empty className="flex h-screen w-full items-center justify-center">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
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

  const anchorColors = project.colorPalette.map((palette) =>
    palette.colors.filter((color) => color.level === "500")
  )

  const handleDelete = () => {
    if (!id) return
    toast.add({
      title: "Project deleted",
      description: `${project.name} has been deleted.`,
    })
    deleteProject(id)
    navigate("/new")
  }

  return (
    <main
      className="space-y-12 p-4"
      style={{ fontFamily: project.typography[0].fontFamily }}
    >
      {/* Token Generator*/}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <p>Token Generator</p>
        <div className="space-x-2">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive">
                  <Trash />
                  Delete Project
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this project?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and all of its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash />
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleCopy}>
            {copied ? (
              <>
                <Check />
                Copied!
              </>
            ) : (
              <>
                <Copy />
                Copy Tokens
              </>
            )}
          </Button>
          <Button onClick={handleExport}>
            <Download />
            Export Tokens
          </Button>
        </div>
      </section>
      <div className="min-h-screen space-y-12 rounded-lg bg-secondary p-4 lg:px-40 lg:py-24">
        {/* Typography */}
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <p>Typography</p>
              <p>{project.typography[0].fontFamily}</p>
            </div>
            <h2
              ref={nameRef}
              className="line-clamp-1 text-[12vw] outline-none lg:text-[4vw]"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleNameBlur}
              onKeyDown={handleKeyDown}
            >
              {project.name}
            </h2>
            <p
              ref={descRef}
              className="line-clamp-3 outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleDescBlur}
              onKeyDown={handleKeyDown}
            >
              {project.description}
            </p>
          </section>
          <section className="space-y-4">
            <p className="text-balance">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Reprehenderit eaque maxime natus eius cum, perferendis ipsa ab.
              Quis.
            </p>
            <p className="grid grid-cols-9 gap-2">
              <span>Aa</span>
              <span>Bb</span>
              <span>Cc</span>
              <span>Dd</span>
              <span>Ee</span>
              <span>Ff</span>
              <span>Gg</span>
              <span>Hh</span>
              <span>Ii</span>
              <span>Jj</span>
              <span>Kk</span>
              <span>Ll</span>
              <span>Mm</span>
              <span>Nn</span>
              <span>Oo</span>
              <span>Pp</span>
              <span>Qq</span>
              <span>Rr</span>
              <span>Ss</span>
              <span>Tt</span>
              <span>Uu</span>
              <span>Vv</span>
              <span>Ww</span>
              <span>Xx</span>
              <span>Yy</span>
              <span>Zz</span>
            </p>
          </section>
        </div>
        {/* Color Palette */}
        <section className="grid h-auto grid-cols-2 overflow-hidden rounded-lg bg-red-500 lg:grid-cols-7">
          {anchorColors.map((colors) =>
            colors.map((color) => (
              <div
                className="aspect-square w-full p-8 lg:aspect-auto lg:h-200 lg:first:col-span-2"
                key={color.hex}
                style={{ backgroundColor: color.hex }}
              >
                <p className="uppercase">{color.hex}</p>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
