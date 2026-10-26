import { Button } from "@/components/ui/button"
import { useProject, type Project } from "@/store/use-project"
import { Check, Copy, Download } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"

function buildTokenPayload(project: 
  Project
) {
  return {
    name: project.name,
    description: project.description,
    templateColors: project.templateColors || "cards",
    templateTypography: project.templateTypography || "one",
    colors: project.colors,
    typography: project.typography,
  }
}

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const getProject = useProject((s) => s.getProject)
  const project = id ? getProject(id) : undefined
  const [copied, setCopied] = useState(false)

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

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {project ? project.name : `Project ${id}`}
          </h1>
          {project?.description && (
            <p className="text-muted-foreground text-sm mt-1">
              {project.description}
            </p>
          )}
        </div>

        {project && (
          <div className="flex items-center gap-2">
            <Button onClick={handleCopy} variant="outline">
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied!" : "Copy Tokens"}
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download />
              Export Tokens
            </Button>
          </div>
        )}
      </div>

      {project ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {project.colors.length} colors · {project.typography.length} typography styles
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Project not found.</p>
      )}
    </main>
  )
}
