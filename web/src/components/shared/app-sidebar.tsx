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
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavItem label="Home" href="/" icon={Home} />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor"
              className="size-4"
            >
              <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
            </svg>
            Github
          </a>
        }
      />
    </SidebarFooter>
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
