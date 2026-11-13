import { create } from "zustand"
import type { Color, ColorPalette } from "./use-design"

type ColorModalState = {
  isOpen: boolean
  /** Color currently being edited. */
  color: Color
  /** Design that owns the color palette. */
  designId: string
  /** Palette token being edited, e.g. "primary". */
  token: keyof ColorPalette
  setIsOpen: (isOpen: boolean) => void
  openColorModal: (payload: {
    color: Color
    designId: string
    token: keyof ColorPalette
  }) => void
}

export const useColorModalStore = create<ColorModalState>((set) => ({
  isOpen: false,
  color: { label: "", value: "" },
  designId: "",
  token: "primary",
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  openColorModal: ({ color, designId, token }) =>
    set({ isOpen: true, color, designId, token }),
}))
