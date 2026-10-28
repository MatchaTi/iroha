import {
  CircleSmall,
  LayoutDashboard,
  Palette,
  Plus,
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
import { useProject } from "@/store/use-project"

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
    <SidebarHeader className="border-b">
      <SidebarMenuButton size="lg">
        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Palette />
        </div>
        {PROJECT_NAME_JP}
      </SidebarMenuButton>
    </SidebarHeader>
  )
}

function Content() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavItem label="Dashboard" href="/dashboard" icon={LayoutDashboard} />
          <NavItem label="New Project" href="/new" icon={Plus} />
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <Projects />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

function Projects() {
  const projects = useProject((state) => state.projects)

  if (!projects || projects.length === 0) {
    return (
      <SidebarMenuButton tooltip="No projects" isActive={false}>
        No projects yet
      </SidebarMenuButton>
    )
  }

  return projects.map((project) => (
    <NavItem
      key={project.id}
      label={project.name}
      href={`/projects/${project.id}`}
      icon={CircleSmall}
    />
  ))
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
  const match = useMatch(`${href}/*`)
  const Icon = icon

  return (
    <SidebarMenu key={label}>
      <SidebarMenuButton
        className="rounded-full px-8 py-6"
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
