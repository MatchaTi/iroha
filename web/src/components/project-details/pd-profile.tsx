import type { Project } from "@/store/use-project"
import { ComponentContainer } from "../shared/component-container"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { DesignInput } from "../shared/design-input"
import { DesignTextarea } from "../shared/design-textarea"
import { DesignButton } from "../shared/design-button"

type Props = {
  project: Project
}

export function PDProfile({ project }: Props) {
  return (
    <ComponentContainer className="p-6">
      <div className="space-y-6">
        <Field>
          <FieldLabel>Profile</FieldLabel>
          <FieldDescription>Manage your profile information.</FieldDescription>
        </Field>

        <DesignInput
          project={project}
          label="Name"
          placeholder={project.name}
          helper="Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time."
          className="min-w-full"
        />

        <DesignInput
          project={project}
          label="Email"
          placeholder={`${project.name.toLowerCase().replace(/\s+/g, "")}@example.com`}
          helper="You can manage verified email addresses in your email settings."
          className="min-w-full"
        />

        <DesignTextarea
          project={project}
          label="Bio"
          placeholder="Tell us a little about yourself."
          helper="Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time."
          className="min-w-full"
        />

        <DesignButton project={project}>Save Profile</DesignButton>
      </div>
    </ComponentContainer>
  )
}
