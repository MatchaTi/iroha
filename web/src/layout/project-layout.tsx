import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "cn"
import {
  CaseSensitive,
  Component,
  Feather,
  List,
  Palette,
  Settings,
  VectorSquare,
  type LucideIcon,
} from "lucide-react"
import { Link, Outlet, useMatch, useParams } from "react-router"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  disabled: boolean
}

export function ProjectLayout() {
  const { id } = useParams<{ id: string }>()
  const match = useMatch(`/projects/${id}`)
  const NAV_ITEMS: NavItem[] = [
    {
      label: "Details",
      href: `/projects/${id}`,
      icon: List,
      disabled: false,
    },
    {
      label: "Typography",
      href: `/projects/${id}/typography`,
      icon: CaseSensitive,
      disabled: false,
    },
    {
      label: "Color Palette",
      href: `/projects/${id}/color-palette`,
      icon: Palette,
      disabled: false,
    },
    {
      label: "Icon",
      href: `/projects/${id}/icon`,
      icon: Feather,
      disabled: true,
    },
    {
      label: "Design System",
      href: `/projects/${id}/design-system`,
      icon: Component,
      disabled: true,
    },
    {
      label: "Brand Kit",
      href: `/projects/${id}/brand-kit`,
      icon: VectorSquare,
      disabled: true,
    },
  ]

  return (
    <div>
      <div className="sticky top-0 z-10 grid border-b backdrop-blur lg:grid-cols-4">
        <div className={"hidden p-4 lg:col-span-3 lg:block"}>
          <ButtonGroup>
            {NAV_ITEMS.map((item) => (
              <ProjectNav
                key={item.label}
                label={item.label}
                href={item.href}
                icon={item.icon}
                disabled={item.disabled}
              />
            ))}
          </ButtonGroup>
        </div>
        <div className="flex items-center justify-between p-2 lg:hidden">
          <SidebarTrigger />
          <NavDrawer items={NAV_ITEMS} />
        </div>
        <div
          className={cn(
            "hidden items-center border-l bg-sidebar px-4 lg:flex",
            match && "lg:hidden"
          )}
        >
          Editor
        </div>
      </div>
      <Outlet />
    </div>
  )
}

type ProjectNavProps = {
  label: string
  href: string
  icon: LucideIcon
} & React.ComponentProps<typeof Button>

function ProjectNav({
  label,
  href,
  icon,
  disabled,
  ...props
}: ProjectNavProps) {
  const match = useMatch(href)
  const Icon = icon

  return (
    <Button
      {...props}
      variant={match ? "secondary" : "outline"}
      render={
        disabled ? (
          <span className="text-muted-foreground">
            <Icon />
            {label}{" "}
            <Badge className="italic" variant={"secondary"}>
              Coming Soon
            </Badge>
          </span>
        ) : (
          <Link to={href}>
            <Icon />
            {label}
          </Link>
        )
      }
      disabled={disabled}
    />
  )
}

function NavDrawer({ items }: { items: NavItem[] }) {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        className={"w-fit"}
        render={
          <Button variant={"outline"}>
            <Settings /> Menu
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <section className="grid flex-1 gap-2 p-4">
          {items.map((item) => (
            <ProjectNav
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              disabled={item.disabled}
              className={"justify-start"}
            />
          ))}
        </section>
        <DrawerFooter>
          <DrawerClose render={<Button variant={"outline"}>Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
