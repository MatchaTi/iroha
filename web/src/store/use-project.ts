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

export type Project = {
  id: string
  name: string
  description: string
  typography: Typography[]
  colorPalette: ColorPalette[]
  corner: Corner[]
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
