import {
  CircleSmall,
  Home,
  Moon,
  Palette,
  Plus,
  Sun,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar"
import { Link, useMatch } from "react-router"
import { PROJECT_NAME_JP } from "@/lib/constants"
import { useProject } from "@/store/use-project"
import { cn } from "cn"
import { useTheme } from "../theme-provider"
import { Kbd } from "../ui/kbd"
import { GithubIcon } from "./github-icon"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <Header />
      <Content />
      <Footer />
    </Sidebar>
  )
}

function Header() {
  const { open } = useSidebar()

  return (
    <SidebarHeader className="border-b">
      <div className="flex items-center">
        <SidebarMenuButton size="lg">
          <div className="group flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Palette className={cn(!open && "group-hover:hidden")} />
            <SidebarTrigger
              className={cn("hidden", !open && "group-hover:flex")}
            />
          </div>
          {PROJECT_NAME_JP}
        </SidebarMenuButton>
        <SidebarTrigger className={cn(!open && "hidden")} />
      </div>
    </SidebarHeader>
  )
}

function Content() {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavItem label="Home" href="/" icon={Home} />
          <NavItem
            label="New Project"
            href="/new"
            icon={Plus}
            onClick={() => setOpenMobile(false)}
          />
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

function Footer() {
  const { theme, setTheme } = useTheme()
  return (
    <SidebarFooter>
      <SidebarMenuButton
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <>
            <Sun /> Light Mode
          </>
        ) : (
          <>
            <Moon /> Dark Mode
          </>
        )}
        <Kbd>d</Kbd>
      </SidebarMenuButton>
      <SidebarMenuButton
        tooltip="View on Github"
        render={
          <a
            href="https://github.com/MatchaTi/iroha"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            Github
          </a>
        }
      />
    </SidebarFooter>
  )
}

function Projects() {
  const projects = useProject((state) => state.projects)
  const { setOpenMobile } = useSidebar()

  if (!projects || projects.length === 0) {
    return (
      <SidebarMenuButton tooltip="No projects" isActive={false}>
        No projects yet
      </SidebarMenuButton>
    )
  }

  return projects.map((project) => (
    <NavItem
      onClick={() => setOpenMobile(false)}
      key={project.id}
      label={project.name}
      href={`/projects/${project.id}`}
      icon={CircleSmall}
    />
  ))
}

type NavItemProps = {
  label: string
  href: string
  icon: LucideIcon
} & React.ComponentProps<typeof SidebarMenuButton>

function NavItem({ label, href, icon, ...props }: NavItemProps) {
  const match = useMatch(`${href}/*`)
  const Icon = icon

  return (
    <SidebarMenu key={label}>
      <SidebarMenuButton
        {...props}
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
