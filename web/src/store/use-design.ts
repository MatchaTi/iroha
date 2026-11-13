import { create } from "zustand"
import { persist } from "zustand/middleware"

// color palette
export type Color = {
  label: string
  value: string
  /** Value used while the app is in dark mode (shadcn `.dark` tokens). Falls back to `value`. */
  darkValue?: string
}

export type ColorPalette = {
  foreground: Color
  background: Color
  primary: Color
  primaryForeground: Color
  secondary: Color
  secondaryForeground: Color
  accent: Color
  accentForeground: Color
  muted: Color
  mutedForeground: Color
  card: Color
  cardForeground: Color
  popover: Color
  popoverForeground: Color
  border: Color
  input: Color
  ring: Color
  destructive: Color
  destructiveForeground: Color
  chart1: Color
  chart2: Color
  chart3: Color
  chart4: Color
  chart5: Color
  sidebar: Color
  sidebarForeground: Color
  sidebarPrimary: Color
  sidebarPrimaryForeground: Color
  sidebarAccent: Color
  sidebarAccentForeground: Color
  sidebarBorder: Color
  sidebarRing: Color
}

export type Design = {
  id: string
  name: string
  description: string
  colorPalette: ColorPalette
}

type DesignStore = {
  designs: Design[]
  lastDesignId: string | null
  getDesign: (id: string) => Design | undefined
  getDesigns: () => Design[]
  createDesign: (design: Design) => void
  updateDesign: (id: string, design: Design) => void
  updateColor: (
    id: string,
    token: keyof ColorPalette,
    color: Color
  ) => void
  deleteDesign: (id: string) => void
  setLastDesignId: (id: string) => void
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      designs: [],
      getDesign: (id: string) => {
        return get().designs.find((design) => design.id === id)
      },
      lastDesignId: null,
      getDesigns: () => {
        return get().designs
      },
      createDesign: (design: Design) => {
        set((state) => ({
          designs: [...state.designs, design],
        }))
      },
      updateDesign: (id: string, design: Design) => {
        set((state) => ({
          designs: state.designs.map((d) => (d.id === id ? design : d)),
        }))
      },
      updateColor: (id: string, token, color) => {
        set((state) => ({
          designs: state.designs.map((d) =>
            d.id === id
              ? {
                  ...d,
                  colorPalette: {
                    ...d.colorPalette,
                    [token]: color,
                  },
                }
              : d
          ),
        }))
      },
      deleteDesign: (id: string) => {
        set((state) => ({
          designs: state.designs.filter((d) => d.id !== id),
        }))
      },
      setLastDesignId: (id: string) => {
        set(() => ({
          lastDesignId: id,
        }))
      },
    }),
    {
      name: "design-storage",
    }
  )
)
