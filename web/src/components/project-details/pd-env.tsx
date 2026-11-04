import type { Project } from "@/store/use-project"
import { ComponentContainer } from "../shared/component-container"
import { DesignButton } from "../shared/design-button"
import { Field, FieldDescription, FieldLabel } from "../ui/field"

type Props = {
  project: Project
}

export function PDEnv({ project }: Props) {
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

        <section className="flex items-center justify-between border-t pt-4">
          <DesignButton project={project} variant={"secondary"}>
            Edit
          </DesignButton>

          <DesignButton project={project}>Deploy</DesignButton>
        </section>
      </div>
    </ComponentContainer>
  )
}
