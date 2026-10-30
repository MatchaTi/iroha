import { useState } from "react"
import { useParams } from "react-router"
import { useProject, type Shadow, type ColorPalette } from "@/store/use-project"
import { SHADOW_STARTER_PACKS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
import { Grip, Plus, RotateCcw, Trash2 } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Blend, MoveHorizontal, MoveVertical, Expand } from "lucide-react"
import { ColorPickerInput } from "@/components/shared/color-picker-input"

function shadowToCss(s: Shadow) {
  return `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
}

interface ShadowRowProps {
  shadow: Shadow
  palettes: ColorPalette[]
  onCommit: (updated: Partial<Shadow>) => void
  onDelete: () => void
}

function ShadowRow({ shadow, palettes, onCommit, onDelete }: ShadowRowProps) {
  const [name, setName] = useState(shadow.name)
  const [x, setX] = useState(String(shadow.x))
  const [y, setY] = useState(String(shadow.y))
  const [blur, setBlur] = useState(String(shadow.blur))
  const [spread, setSpread] = useState(String(shadow.spread))
  const [color, setColor] = useState(shadow.color)

  // Live preview values (may be mid-edit)
  const previewShadow: Shadow = {
    ...shadow,
    x: parseFloat(x) || 0,
    y: parseFloat(y) || 0,
    blur: parseFloat(blur) || 0,
    spread: parseFloat(spread) || 0,
    color,
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  const commitNumber = (
    raw: string,
    key: "x" | "y" | "blur" | "spread",
    setter: (v: string) => void,
    fallback: number
  ) => {
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) {
      onCommit({ [key]: parsed })
    } else {
      setter(String(fallback))
    }
  }

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-40 items-center justify-center px-6 py-8 md:col-span-3">
        <div className="flex flex-col items-center gap-4">
          <div
            className="size-24 rounded-2xl bg-secondary transition-all duration-200"
            style={{ boxShadow: shadowToCss(previewShadow) }}
          />
          <p className="font-mono text-xs text-muted-foreground">
            {shadowToCss(previewShadow)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 border-t px-4 py-4 md:border-t-0 md:border-l">
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Name
          </FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => onCommit({ name })}
            onKeyDown={handleKeyDown}
          />
        </Field>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel className="text-xs text-muted-foreground">X</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MoveHorizontal />
              </InputGroupAddon>
              <InputGroupInput
                value={x}
                onChange={(e) => setX(e.target.value)}
                onBlur={() => commitNumber(x, "x", setX, shadow.x)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">Y</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MoveVertical />
              </InputGroupAddon>
              <InputGroupInput
                value={y}
                onChange={(e) => setY(e.target.value)}
                onBlur={() => commitNumber(y, "y", setY, shadow.y)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Blur
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Grip />
              </InputGroupAddon>
              <InputGroupInput
                value={blur}
                onChange={(e) => setBlur(e.target.value)}
                onBlur={() => commitNumber(blur, "blur", setBlur, shadow.blur)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Spread
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Expand />
              </InputGroupAddon>
              <InputGroupInput
                value={spread}
                onChange={(e) => setSpread(e.target.value)}
                onBlur={() =>
                  commitNumber(spread, "spread", setSpread, shadow.spread)
                }
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>
        </div>

        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Color
          </FieldLabel>
          <ColorPickerInput
            value={color}
            palettes={palettes}
            onChange={(val) => {
              setColor(val)
              onCommit({ color: val })
            }}
          />
        </Field>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                className="mt-auto text-destructive hover:text-destructive"
              >
                <Trash2 />
                Delete Shadow
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{shadow.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this shadow from the project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// ─── Shadow page ──────────────────────────────────────────────────────────────

export function Shadow() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (shadowId: string, updated: Partial<Shadow>) => {
    if (!project) return
    updateProject(id!, {
      shadow: project.shadow.map((s) =>
        s.id === shadowId ? { ...s, ...updated } : s
      ),
    })
  }

  const handleDelete = (shadowId: string) => {
    if (!project) return
    updateProject(id!, {
      shadow: project.shadow.filter((s) => s.id !== shadowId),
    })
  }

  const handleAdd = () => {
    if (!project) return
    updateProject(id!, {
      shadow: [
        ...project.shadow,
        {
          id: crypto.randomUUID(),
          name: "New Shadow",
          x: 0,
          y: 4,
          blur: 12,
          spread: 0,
          color: "#00000029",
        },
      ],
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      shadow: SHADOW_STARTER_PACKS.map((s) => ({
        ...s,
        id: crypto.randomUUID(),
      })),
    })
  }

  return (
    <main>
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="space-y-2">
          <h1 className="heading">Shadow</h1>
          <p>
            Define elevation and depth with consistent shadow tokens across your
            design system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw /> Reset
          </Button>
          <Button onClick={handleAdd}>
            <Plus /> Add Shadow
          </Button>
        </div>
      </section>

      {/* List */}
      <section className="border-t">
        {!project?.shadow || project.shadow.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Blend />
              </EmptyMedia>
              <EmptyTitle>No shadows yet</EmptyTitle>
              <EmptyDescription>
                Add shadow tokens to define elevation in your design system.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={handleAdd}>
                <Plus /> Add Your First Shadow
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          project.shadow.map((shadow) => (
            <ShadowRow
              key={shadow.id}
              shadow={shadow}
              palettes={project.colorPalette ?? []}
              onCommit={(updated) => handleCommit(shadow.id, updated)}
              onDelete={() => handleDelete(shadow.id)}
            />
          ))
        )}
      </section>
    </main>
  )
}
