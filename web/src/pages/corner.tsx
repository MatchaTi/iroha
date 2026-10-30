import { useState } from "react"
import { useParams } from "react-router"
import { useProject, type Corner } from "@/store/use-project"
import { CORNER_STARTER_PACKS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, RotateCcw, Trash2 } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SquareRoundCorner } from "lucide-react"

// ─── CornerRow ────────────────────────────────────────────────────────────────

interface CornerRowProps {
  corner: Corner
  onCommit: (updated: Partial<Corner>) => void
  onDelete: () => void
}

function CornerRow({ corner, onCommit, onDelete }: CornerRowProps) {
  const [name, setName] = useState(corner.name)
  const [radius, setRadius] = useState(corner.radius)

  const displayRadius = radius >= 99 ? "Full" : `${radius}px`
  const previewRadius = Math.min(radius, 48)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className="relative aspect-video w-full border-2 border-border bg-sidebar transition-all duration-200"
        style={{ borderRadius: previewRadius }}
      >
        <div
          className="absolute right-0 bottom-0 h-full w-full border-r border-b border-primary"

          style={{ borderRadius: previewRadius }}
        />
        <div
          className="absolute top-0 right-0 h-1/2 w-1/2 bg-sidebar"
          // only round the top-right corner
          style={{ borderTopRightRadius: previewRadius }}
        />
        <div
          className="absolute bottom-0 left-0 h-1/2 w-3/5 bg-sidebar"
          // only round the bottom-left corner
          style={{ borderBottomLeftRadius: previewRadius }}
        />
      </div>

      {/* Inline editor */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Name + radius value + delete */}
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => onCommit({ name })}
            onKeyDown={handleKeyDown}
          />
          <span className="w-12 shrink-0 text-right font-mono text-sm text-muted-foreground">
            {displayRadius}
          </span>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{corner.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this corner style from the
                  project.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Slider */}
        <Slider
          min={0}
          max={100}
          value={[radius]}
          onValueChange={(val) => setRadius(Array.isArray(val) ? val[0] : val)}
          onValueCommitted={(val) => {
            const v = Array.isArray(val) ? val[0] : val
            setRadius(v)
            onCommit({ radius: v })
          }}
        />
      </div>
    </div>
  )
}

// ─── Corner page ──────────────────────────────────────────────────────────────

export function Corner() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (cornerId: string, updated: Partial<Corner>) => {
    if (!project) return
    updateProject(id!, {
      corner: project.corner.map((c) =>
        c.id === cornerId ? { ...c, ...updated } : c
      ),
    })
  }

  const handleDelete = (cornerId: string) => {
    if (!project) return
    updateProject(id!, {
      corner: project.corner.filter((c) => c.id !== cornerId),
    })
  }

  const handleAdd = () => {
    if (!project) return
    updateProject(id!, {
      corner: [
        ...project.corner,
        { id: crypto.randomUUID(), name: "New Corner", radius: 8 },
      ],
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      corner: CORNER_STARTER_PACKS.map((c) => ({
        ...c,
        id: crypto.randomUUID(),
      })),
    })
  }

  return (
    <main>
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Corner</h1>
          <p>
            Define border radius tokens for consistent rounded corners across
            your design system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw /> Reset
          </Button>
          <Button onClick={handleAdd}>
            <Plus /> Add Corner
          </Button>
        </div>
      </section>

      {/* List */}
      <section className="grid gap-8 p-4 lg:grid-cols-4">
        {!project?.corner || project.corner.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SquareRoundCorner />
              </EmptyMedia>
              <EmptyTitle>No corner styles yet</EmptyTitle>
              <EmptyDescription>
                Add corner radius tokens to keep your UI consistently rounded.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={handleAdd}>
                <Plus /> Add Your First Corner
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          project.corner.map((corner) => (
            <CornerRow
              key={corner.id}
              corner={corner}
              onCommit={(updated) => handleCommit(corner.id, updated)}
              onDelete={() => handleDelete(corner.id)}
            />
          ))
        )}
      </section>
    </main>
  )
}
