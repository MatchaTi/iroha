import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  COLOR_PALETTE_STARTER_PACKS,
  CORNER_STARTER_PACKS,
  resolveDesignButtonStarterPacks,
  resolveDesignInputStarterPacks,
  SHADOW_STARTER_PACKS,
  TYPOGRAPHY_STATER_PACKS,
} from "@/lib/constants"
import { projectSchema, type ProjectSchema } from "@/schema/project-schema"
import { useProject } from "@/store/use-project"
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { Palette } from "lucide-react"
import { useNavigate } from "react-router"

export function NewProject() {
  const addProject = useProject((state) => state.addProject)
  const navigate = useNavigate()
  const [form, fields] = useForm<ProjectSchema>({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: projectSchema })
    },
    onSubmit(e, { formData }) {
      e.preventDefault()
      const title = formData.get("name") as string
      const description = formData.get("description") as string
      const id = crypto.randomUUID()
      const typography = TYPOGRAPHY_STATER_PACKS
      const corners = CORNER_STARTER_PACKS
      const shadows = SHADOW_STARTER_PACKS
      addProject({
        id,
        name: title,
        description,
        typography,
        colorPalette: COLOR_PALETTE_STARTER_PACKS,
        corner: corners,
        shadow: shadows,
        designButton: resolveDesignButtonStarterPacks(corners, shadows, typography),
        designInput: resolveDesignInputStarterPacks(corners, shadows, typography),
        templateTypography: "one",
        templateColorPalette: "one",
      })
      toast.add({
        title: "Project created",
        description: `Project "${title}" has been created.`,
        type: "success",
      })
      navigate(`/projects/${id}`)
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onBlur",
  })

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="heading mb-8 flex flex-wrap items-center gap-2">
        <Palette size={32} />
        Hi! Let's create a new project
      </h1>
      <form {...getFormProps(form)} className="w-full max-w-xl space-y-4">
        <Field>
          <FieldLabel htmlFor={fields.name.id}>Project Name</FieldLabel>
          <Input
            className="p-8"
            {...getInputProps(fields.name, { type: "text" })}
            placeholder="Raana e.g"
          />
          <FieldError>{fields.name.errors}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor={fields.description.id}>Description</FieldLabel>
          <Textarea
            className="min-h-[200px] p-8"
            {...getTextareaProps(fields.description)}
            placeholder="Description..."
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </main>
  )
}
