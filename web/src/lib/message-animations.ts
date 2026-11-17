import type { Variants } from "motion/react"

/**
 * Shared message entrance animations for the chat thread.
 */
export const MESSAGE_ANIMATIONS = {
  "slide-up": {
    variants: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
    } satisfies Variants,
  },
} as const
