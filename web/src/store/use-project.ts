import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Typography = {
  name: string
  purpose: "display" | "headline" | "title" | "body" | "label"
  fontFamily: string
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing: number
}

export type Color = {
  name: string
  purpose:
    | "background"
    | "foreground"
    | "primary"
    | "secondary"
    | "accent"
    | "muted"
    | "error"
    | "warning"
    | "success"
  hex: string
  rgb: string
}

export type Project = {
  id: string
  name: string
  description: string
  typography: Typography[]
  colors: Color[]
  templateTypography: string
  templateColors: string
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
