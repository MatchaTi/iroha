import type { Project } from "@/store/use-project"
import { ComponentContainer } from "../shared/component-container"
import { DesignButton } from "../shared/design-button"

type Props = {
  fontFamily: string
  project: Project
}

export function PDTypography({ fontFamily, project }: Props) {
  return (
    <ComponentContainer className="space-y-4 p-6">
      <p>{fontFamily}</p>
      <h2 className="text-3xl">Designing with rhythm and hierarchy.</h2>
      <p className="text-muted-foreground">
        A strong body style keeps long-form content readable and balances the
        visual weight of headings.
      </p>
      <p className="text-muted-foreground">
        Thoughtful spacing and cadence help paragraphs scan quickly without
        feeling dense.
      </p>
      <DesignButton
        project={project}
        variant="secondary"
        size="default"
        className="w-full"
      >
        Share Feedback
      </DesignButton>
    </ComponentContainer>
  )
}
