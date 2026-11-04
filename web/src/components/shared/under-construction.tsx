import { cn } from "cn"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty"
import { Construction } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router"

type Props = React.ComponentProps<typeof Empty>

export function UnderConstruction({ className, ...props }: Props) {
  return (
    <Empty className={cn(className)} {...props}>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <Construction />
        </EmptyMedia>
        <EmptyTitle>Page is under construction</EmptyTitle>
        <EmptyDescription>
          This page is currently under construction. Please check back later for
          updates.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row items-center justify-center gap-2">
        <Button
          render={<Link to="/">Home</Link>}
          className={"w-40"}
          size={"lg"}
        />
        <Button
          render={<Link to="/new">Create Project</Link>}
          variant={"secondary"}
          size={"lg"}
          className={"w-40"}
        />
      </EmptyContent>
    </Empty>
  )
}
