import { ComponentContainer } from "../shared/component-container"
import { Field, FieldDescription, FieldLabel } from "../ui/field"

export function PDEnv() {
  return (
    <ComponentContainer className="p-6">
      <div className="space-y-6">
        <Field>
          <FieldLabel>Environment Variables</FieldLabel>
          <FieldDescription>Production · 3 variables</FieldDescription>
        </Field>

        <section className="space-y-2 font-mono">
          <div className="flex items-center justify-between rounded-lg border p-2">
            <p>DATABASE_URL</p>
            <p className="text-muted-foreground">••••••••</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-2">
            <p>API_URL</p>
            <p className="text-muted-foreground">https://api.example.com</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-2">
            <p>SECRET_KEY</p>
            <p className="text-muted-foreground">••••••••</p>
          </div>
        </section>
      </div>
    </ComponentContainer>
  )
}
