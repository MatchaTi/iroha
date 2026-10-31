import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Typography = {
  id: string
  name: string
  purpose: "display" | "headline" | "title" | "body" | "label"
  level: "large" | "medium" | "small"
  fontFamily: string
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing: number
}

export type Color = {
  level:
    "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
  hex: string
  rgb: string
}

export type ColorPalette = {
  id: string
  name: string
  purpose:
    | "background"
    | "heading"
    | "foreground"
    | "primary"
    | "secondary"
    | "accent"
    | "muted"
    | "error"
    | "warning"
    | "success"
  colors: Color[]
}

export type Corner = {
  id: string
  name: string
  radius: number
}

export type Shadow = {
  id: string
  name: string
  x: number
  y: number
  blur: number
  spread: number
  color: string // rgba
}

export type DesignButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"
  | "error"
  | "warning"
  | "success"

export type DesignButtonSize = "xs" | "sm" | "default" | "lg"

export type DesignButton = {
  variant: DesignButtonVariant
  size: DesignButtonSize
  // color refs: "transparent" or "paletteId::level"
  background: string
  foreground: string
  border: string
  // token refs
  cornerId: string
  typographyId: string
  shadowId: string // "none" or shadow.id
  // spacing
  paddingX: number
  paddingY: number
}

export type DesignInputState = "default" | "focus" | "error" | "disabled"

export type DesignInput = {
  state: DesignInputState
  // color refs: "transparent" or "purpose::level"
  background: string
  foreground: string
  border: string
  placeholder: string
  label: string
  helper: string
  // token refs
  cornerId: string
  typographyId: string
  shadowId: string
  // spacing
  paddingX: number
  paddingY: number
}

export type DesignBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "error"
  | "warning"
  | "success"
  | "outline"

export type DesignBadge = {
  variant: DesignBadgeVariant
  // color refs: "transparent" or "purpose::level"
  background: string
  foreground: string
  border: string
  // token refs
  cornerId: string
  typographyId: string
  shadowId: string
  // spacing
  paddingX: number
  paddingY: number
}

export type Project = {
  id: string
  name: string
  description: string
  typography: Typography[]
  colorPalette: ColorPalette[]
  corner: Corner[]
  shadow: Shadow[]
  designButton: DesignButton[]
  designInput: DesignInput[]
  designBadge: DesignBadge[]
  templateTypography: string
  templateColorPalette: string
}

type ProjectState = {
  projects: Project[]
  getProject: (id: string) => Project | undefined
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
}

export const useProject = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      getProject: (id: string) => {
        return get().projects.find((project) => project.id === id)
      },
      addProject: (project: Project) => {
        set((state) => ({
          projects: [...state.projects, project],
        }))
      },
      updateProject: (id: string, updatedProject: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedProject } : p
          ),
        }))
      },
      deleteProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }))
      },
    }),
    {
      name: "project-storage",
    }
  )
)
