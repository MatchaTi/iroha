import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar"
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
import { useState } from "react"
import { Link, Outlet, useMatch, useParams } from "react-router"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  disabled: boolean
}

export function ProjectLayout() {
  const { id } = useParams<{ id: string }>()
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
    <div className="flex">
      <aside className="hidden min-h-screen border-r bg-sidebar p-4 lg:block">
        <div className="sticky top-4 w-52 space-y-1">
          {NAV_ITEMS.map((item) => (
            <ProjectNav
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              disabled={item.disabled}
              className={"justify-start"}
            />
          ))}
        </div>
      </aside>

      <section>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-sidebar/50 px-4 py-2 backdrop-blur lg:hidden">
          <SidebarTrigger />
          <NavDrawer items={NAV_ITEMS} />
        </div>
        <Outlet />
      </section>
    </div>
  )
}

type ProjectNavProps = {
  label: string
  href: string
  icon: LucideIcon
} & React.ComponentProps<typeof SidebarMenuButton>

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
    <SidebarMenuButton
      {...props}
      isActive={match !== null}
      render={
        disabled ? (
          <span className="text-muted-foreground">
            <Icon />
            {label}
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
  const [open, setOpen] = useState(false)

  return (
    <Drawer showSwipeHandle open={open} onOpenChange={setOpen}>
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
              onClick={() => setOpen(false)}
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
