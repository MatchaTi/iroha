import type { Project } from "@/store/use-project"
import { ComponentContainer } from "../shared/component-container"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { DesignSwitch } from "../shared/design-switch"
import { DesignBadge } from "../shared/design-badge"
import { Sun, Thermometer, Timer, Volume2 } from "lucide-react"
import { DesignSlider } from "../shared/design-slider"

type Props = {
  project: Project
}

export function PDKitchenIsland({ project }: Props) {
  return (
    <ComponentContainer className="p-6">
      <div className="space-y-6">
        <section className="flex items-center justify-between gap-2">
          <Field>
            <FieldLabel>Kitchen Island</FieldLabel>
            <FieldDescription>Hue Color Ambient</FieldDescription>
          </Field>
          <DesignSwitch project={project} state="checked" label="" />
        </section>

        <section className="flex items-center gap-2">
          <DesignBadge project={project} variant={"secondary"}>
            Cooking
          </DesignBadge>
          <DesignBadge project={project} variant={"outline"}>
            Dining
          </DesignBadge>
          <DesignBadge project={project} variant={"outline"}>
            Nightlight
          </DesignBadge>
          <DesignBadge project={project} variant={"outline"}>
            Focus
          </DesignBadge>
        </section>

        <section className="space-y-2">
          <div className="grid grid-cols-2 items-center gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Sun size={14} /> Brightness
            </div>
            <DesignSlider project={project} />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Thermometer size={14} /> Color Temp
            </div>
            <DesignSlider project={project} />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Volume2 size={14} /> Volume
            </div>
            <DesignSlider project={project} />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Timer size={14} /> Fade
            </div>
            <DesignSlider project={project} />
          </div>
        </section>
      </div>
    </ComponentContainer>
  )
}
