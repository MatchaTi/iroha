import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useDesignStore } from "@/store/use-design"
import { IrohaLogo } from "@/components/designs/iroha-logo"
import { useParams } from "react-router"

export function DesignDetails() {
  const { id } = useParams<{ id: string }>()
  const getDesign = useDesignStore((state) => state.getDesign)
  const design = getDesign(id ?? "")

  if (!design) {
    return
  }

  return (
    <main className="flex h-[calc(100dvh-10rem)] items-center justify-center p-6">
      <Empty>
        <EmptyMedia>
          <IrohaLogo className="size-40" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-4xl">{design.name}</EmptyTitle>
          <EmptyDescription>{design.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            Explore the design details, including color palette, typography,
            shape, and more. Use the navigation options to view different
            aspects of the design and make adjustments as needed.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </main>
  )
}
