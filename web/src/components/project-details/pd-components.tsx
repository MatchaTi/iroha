import type { Project } from "@/store/use-project"
import { ComponentContainer } from "../shared/component-container"
import { DesignButton } from "../shared/design-button"
import { FieldDescription, FieldLabel } from "../ui/field"
import { DesignBadge } from "../shared/design-badge"
import { DesignSlider } from "../shared/design-slider"
import { DesignInput } from "../shared/design-input"
import { DesignRadio } from "../shared/design-radio"
import { DesignCheckbox } from "../shared/design-checkbox"
import { DesignSwitch } from "../shared/design-switch"

type Props = {
  project: Project
}

export function PDComponents({ project }: Props) {
  return (
    <ComponentContainer className="p-6">
      <div className="space-y-6">
        <section className="flex items-center gap-2">
          <DesignButton project={project}>Button</DesignButton>
          <DesignButton project={project} variant={"secondary"}>
            Secondary
          </DesignButton>
          <DesignButton project={project} variant={"outline"}>
            Outline
          </DesignButton>
          <DesignButton project={project} variant={"ghost"}>
            Ghost
          </DesignButton>
        </section>

        <section className="flex items-center justify-between gap-2 rounded-lg border p-4">
          <div className="space-y-1">
            <FieldLabel>Two-factor authentication</FieldLabel>
            <FieldDescription>
              Verify via email or phone number.
            </FieldDescription>
          </div>
          <DesignSwitch project={project} state="checked" label="" />
        </section>

        <DesignSlider project={project} />

        <div className="space-y-6">
          <DesignInput
            project={project}
            placeholder="Name"
            className="min-w-full"
            label="Name"
            helper="Enter your full name."
          />

          <DesignInput
            project={project}
            placeholder="Email"
            className="min-w-full"
            label="Email"
            helper="Enter your email."
          />
        </div>

        <div className="flex items-center gap-2">
          <DesignBadge project={project}>Badge</DesignBadge>
          <DesignBadge project={project} variant="secondary">
            Secondary
          </DesignBadge>
          <DesignBadge project={project} variant="outline">
            Outline
          </DesignBadge>
          <DesignCheckbox project={project} label="Remember" state="checked" />
        </div>

        <div className="flex items-center gap-2">
          <DesignRadio
            project={project}
            options={["Man", "Woman"]}
            state="checked"
          />
        </div>
      </div>
    </ComponentContainer>
  )
}
