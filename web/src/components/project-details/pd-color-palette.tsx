import type { Color } from "@/store/use-project"
import { ComponentContainer } from "../shared/component-container"

type Props = {
  name: string
  description?: string
  colors: Color[]
}

export function PDColorPalette({ name, description, colors }: Props) {
  return (
    <ComponentContainer className="p-6">
      <h2 className="text-lg">{name}</h2>
      <p className="line-clamp-2 leading-relaxed text-muted-foreground">
        {description?.length !== 0
          ? description
          : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti laborum optio sequi molestiae similique quas iste, fugiat tenetur molestias voluptate ad, aliquam iure distinctio voluptatem! Est non voluptatum quia. Architecto!"}
      </p>
      <div className="mt-4 grid grid-cols-5 gap-4">
        {colors.map((color) => (
          <div
            className="aspect-square w-full rounded-lg"
            style={{ background: color.hex }}
          />
        ))}
      </div>
    </ComponentContainer>
  )
}
