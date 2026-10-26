import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CaseSensitive,
  Component,
  Feather,
  List,
  Palette,
  VectorSquare,
  type LucideIcon,
} from "lucide-react"
import { Link, Outlet, useMatch, useParams } from "react-router"

export function ProjectLayout() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <div className="sticky top-4 z-10">
        <ScrollArea>
          <ButtonGroup className="mb-4">
            <ProjectNav label="Details" href={`/projects/${id}`} icon={List} />
            <ProjectNav
              label="Typography"
              href={`/projects/${id}/typography`}
              icon={CaseSensitive}
            />

            <ProjectNav
              label="Color Palette"
              href={`/projects/${id}/color-palette`}
              icon={Palette}
            />
            <Button variant={"outline"} disabled>
              <Feather /> Icon
              <Badge className="italic">Coming Soon</Badge>
            </Button>
            <Button variant={"outline"} disabled>
              <Component /> Design System
              <Badge className="italic">Coming Soon</Badge>
            </Button>
            <Button variant={"outline"} disabled>
              <VectorSquare /> Brand Kit
              <Badge className="italic">Coming Soon</Badge>
            </Button>
          </ButtonGroup>
        </ScrollArea>
      </div>
      <Outlet />
    </div>
  )
}

function ProjectNav({
  label,
  href,
  icon,
}: {
  label: string
  href: string
  icon: LucideIcon
}) {
  const match = useMatch(href)
  const Icon = icon

  return (
    <Button
      variant={match ? "default" : "outline"}
      render={
        <Link to={href}>
          <Icon />
          {label}
        </Link>
      }
    />
  )
}
