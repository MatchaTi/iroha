import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "cn"
import {
  CaseSensitive,
  ChevronDown,
  Component,
  Feather,
  List,
  Palette,
  Settings,
  Space,
  SquareRoundCorner,
  VectorSquare,
} from "lucide-react"
import { useState } from "react"
import { Link, Outlet, useMatch, useParams } from "react-router"

type SubItem = {
  label: string
  href: string
}

type NavItem = {
  label: string
  href?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  subItems?: SubItem[]
  disabled: boolean
}

function MarkdownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      fill="currentColor"
    >
      <path d="M593.8 123.1L46.2 123.1C20.7 123.1 0 143.8 0 169.2L0 470.7C0 496.2 20.7 516.9 46.2 516.9L593.9 516.9C619.4 516.9 640.1 496.2 640 470.8L640 169.2C640 143.8 619.3 123.1 593.8 123.1zM338.5 424.6L277 424.6L277 304.6L215.5 381.5L154 304.6L154 424.6L92.3 424.6L92.3 215.4L153.8 215.4L215.3 292.3L276.8 215.4L338.3 215.4L338.3 424.6L338.5 424.6zM473.8 427.7L381.5 320L443 320L443 215.4L504.5 215.4L504.5 320L566 320L473.8 427.7z" />
    </svg>
  )
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
      label: "Corner",
      href: `/projects/${id}/corner`,
      icon: SquareRoundCorner,
      disabled: false,
    },
    {
      label: "Shadow",
      href: `/projects/${id}/shadow`,
      icon: Space,
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
      icon: Component,
      disabled: false,
      subItems: [
        {
          label: "Button",
          href: `/projects/${id}/button`,
        },
        {
          label: "Input",
          href: `/projects/${id}/input`,
        },
      ],
    },
    {
      label: "Brand Kit",
      href: `/projects/${id}/brand-kit`,
      icon: VectorSquare,
      disabled: true,
    },
    {
      label: "DESIGN.md",
      href: `/projects/${id}/design-md`,
      icon: MarkdownIcon,
      disabled: true,
    },
  ]

  return (
    <div className="flex w-full">
      <aside className="hidden min-h-screen border-r bg-sidebar p-4 lg:block">
        <div className="sticky top-4 w-52 space-y-1">
          {NAV_ITEMS.map((item) => (
            <ProjectNav
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              disabled={item.disabled}
              subItems={item.subItems}
              className={"justify-start"}
            />
          ))}
        </div>
      </aside>

      <section className="w-full">
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
  href?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  subItems?: SubItem[]
} & React.ComponentProps<typeof SidebarMenuButton>

function SubNavItem({ label, href }: SubItem) {
  const match = useMatch(href)
  return (
    <SidebarMenuButton
      render={<Link to={href}>{label}</Link>}
      isActive={match !== null}
      className="pl-6"
    />
  )
}

function ProjectNav({
  label,
  href,
  icon,
  disabled,
  subItems,
  ...props
}: ProjectNavProps) {
  const match = useMatch(href || "")
  const Icon = icon
  const [open, setOpen] = useState(false)

  if (!href) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton {...props}>
              <Icon />
              {label}
              <ChevronDown
                className={cn("ml-auto duration-200", open && "rotate-180")}
              />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent>
          <SidebarGroup>
            {subItems?.map((subItem) => (
              <SubNavItem key={subItem.label} label={subItem.label} href={subItem.href} />
            ))}
          </SidebarGroup>
        </CollapsibleContent>
      </Collapsible>
    )
  }

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
