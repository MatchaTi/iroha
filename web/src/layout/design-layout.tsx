import { FigmaIcon } from "@/components/shared/figma-icon"
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

export function DesignLayout() {
  const { id } = useParams<{ id: string }>()
  const NAV_ITEMS: NavItem[] = [
    {
      label: "Details",
      href: `/designs/${id}`,
      icon: List,
      disabled: false,
    },
    {
      label: "Color Palette",
      href: `/designs/${id}/color-palette`,
      icon: Palette,
      disabled: false,
    },
    {
      label: "Typography",
      href: `/designs/${id}/typography`,
      icon: CaseSensitive,
      disabled: false,
    },
    {
      label: "Corner",
      href: `/designs/${id}/corner`,
      icon: SquareRoundCorner,
      disabled: false,
    },
    {
      label: "Shadow",
      href: `/designs/${id}/shadow`,
      icon: Space,
      disabled: false,
    },
    {
      label: "Preview",
      icon: Component,
      disabled: false,
      subItems: [
        {
          label: "Dashboard",
          href: `/designs/${id}/dashboard`,
        },
        {
          label: "Landing Page",
          href: `/designs/${id}/landing-page`,
        },
        {
          label: "AI Chat",
          href: `/designs/${id}/ai-chat`,
        },
      ],
    },
    {
      label: "Brand Kit",
      href: `/projects/${id}/brand-kit`,
      icon: VectorSquare,
      disabled: false,
    },
  ]

  return (
    <div className="flex w-full">
      <aside className="sticky top-0 hidden h-screen w-52 space-y-1 overflow-y-auto border-r bg-sidebar p-4 lg:block">
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
      </aside>

      <section className="min-w-0 flex-1">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-sidebar/50 px-4 py-2 backdrop-blur lg:hidden">
          <SidebarTrigger />
          <NavDrawer items={NAV_ITEMS} />
        </div>
        <div>
          <div className="sticky top-0 flex justify-end border-b bg-background px-6 py-4">
            <Button variant={"secondary"} size={"lg"}>
              <FigmaIcon />
              Export to Figma
            </Button>
          </div>

          <Outlet />
        </div>
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
      size={"lg"}
      render={<Link to={href}>{label}</Link>}
      isActive={match !== null}
      className="rounded-full pl-6"
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
  const [open, setOpen] = useState(true)

  if (!href) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              {...props}
              size={"lg"}
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
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
              <SubNavItem
                key={subItem.label}
                label={subItem.label}
                href={subItem.href}
              />
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
      size={"lg"}
      className="rounded-full"
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
        <section className="grid flex-1 gap-2 overflow-y-auto p-4">
          {items.map((item) => (
            <ProjectNav
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              subItems={item.subItems}
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
