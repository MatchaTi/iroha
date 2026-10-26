import {
  CaseSensitive,
  Grid3x2,
  LayoutDashboard,
  Palette,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar"
import { Link, useMatch } from "react-router"
import { PROJECT_NAME_JP } from "@/lib/constants"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <Header />
      <Content />
    </Sidebar>
  )
}

function Header() {
  return (
    <SidebarHeader>
      <SidebarMenuButton size="lg">
        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Grid3x2 />
        </div>
        {PROJECT_NAME_JP}
      </SidebarMenuButton>
    </SidebarHeader>
  )
}

function Content() {
  const ITEMS = [
    {
      label: "Navigation",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Menu",
      items: [
        {
          label: "Typography",
          href: "/typography",
          icon: CaseSensitive,
        },
        {
          label: "Color Palette",
          href: "/color-palette",
          icon: Palette,
        },
      ],
    },
  ]

  return (
    <SidebarContent>
      {ITEMS.map((item) => (
        <SidebarGroup key={item.label}>
          <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            {item.items.map((subItem) => (
              <NavItem
                key={subItem.label}
                label={subItem.label}
                href={subItem.href}
                icon={subItem.icon}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}

function NavItem({
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
    <SidebarMenu key={label}>
      <SidebarMenuButton
        tooltip={label}
        isActive={!!match}
        render={
          <Link to={href}>
            <Icon />
            {label}
          </Link>
        }
      />
    </SidebarMenu>
  )
}
