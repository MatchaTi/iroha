import type { Project } from "@/store/use-project"
import { DesignButton } from "../shared/design-button"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  Ellipsis,
  LoaderCircle,
  Minus,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Trash,
  Upload,
} from "lucide-react"
import { ComponentContainer } from "../shared/component-container"

type Props = {
  project: Project
}

export function PDIcons({ project }: Props) {
  return (
    <ComponentContainer className="p-6">
      <section className="grid grid-cols-7 gap-2">
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Copy />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <CircleAlert />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Trash />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Upload />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <ShoppingBag />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Ellipsis />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <LoaderCircle />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Plus />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Minus />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <ArrowLeft />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <ArrowRight />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Check />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Search />
        </DesignButton>
        <DesignButton
          project={project}
          variant={"outline"}
          className="aspect-square"
        >
          <Settings />
        </DesignButton>
      </section>
    </ComponentContainer>
  )
}
