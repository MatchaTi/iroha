import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { COLOR_PALETTE_STATER_PACKS } from "@/constants/color-palette"
import { designSchema, type DesignSchema } from "@/schema/design-schema"
import { useDesignStore } from "@/store/use-design"
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { useNavigate } from "react-router"

export function NewDesign() {
  const createDesign = useDesignStore((state) => state.createDesign)
  const setLastDesignId = useDesignStore((state) => state.setLastDesignId)
  const navigate = useNavigate()
  const [form, fields] = useForm<DesignSchema>({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: designSchema })
    },
    onSubmit(e, { formData }) {
      e.preventDefault()
      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const id = crypto.randomUUID()
      createDesign({
        id,
        name,
        description,
        colorPalette: structuredClone(COLOR_PALETTE_STATER_PACKS),
      })
      setLastDesignId(id)
      navigate(`/designs/${id}`)
      toast.add({
        title: "Design Created",
        description: `Design '${name}' created successfully`,
        type: "success",
      })
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onBlur",
  })

  return (
    <main className="grid gap-4 p-4 lg:grid-cols-[400px_200px_1fr]">
      <form {...getFormProps(form)}>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor={fields.name.id}>Design Name</FieldLabel>
            <Input
              {...getInputProps(fields.name, { type: "text" })}
              placeholder="Design Name..."
            />
            <FieldError>{fields.name.errors}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor={fields.description.id}>Description</FieldLabel>
            <Textarea
              {...getTextareaProps(fields.description)}
              placeholder="Description of design..."
            />
          </Field>
          <Button type="submit" variant={"secondary"}>
            Create
          </Button>
        </FieldSet>
      </form>
      <section>1</section>
      <section>1</section>
    </main>
  )
}
