import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { useState, type ComponentProps, type ReactNode } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import { resolveLabelTypography, typographyStyle } from "@/lib/typography"
import {
  type DesignSwitch as DesignSwitchConfig,
  type DesignSwitchState,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

export const DESIGN_SWITCH_STATES: DesignSwitchState[] = [
  "default",
  "checked",
  "disabled",
]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designSwitchVariants = cva("flex items-center gap-3", {
  variants: {
    state: {
      default: "",
      checked: "",
      disabled: "opacity-50",
    },
  },
  defaultVariants: {
    state: "default",
  },
})

// ─── DesignSwitch ─────────────────────────────────────────────────────────────

type DesignSwitchProps = ComponentProps<"div"> &
  VariantProps<typeof designSwitchVariants> & {
    /** Project that owns the switch design and its token collections. */
    project: Project
    /** Optional design override; defaults to the matching state in the project. */
    design?: DesignSwitchConfig
    label?: ReactNode
    /** Click to toggle between this state and its complementary state. */
    interactive?: boolean
  }

/**
 * Preview of a project's switch design for a single state.
 */
function DesignSwitch({
  project,
  design: designProp,
  state = "default",
  label = "Switch",
  interactive = true,
  className,
  ...props
}: DesignSwitchProps) {
  const [flipped, setFlipped] = useState(false)

  const current =
    designProp ?? project.designSwitch?.find((sw) => sw.state === state)

  if (!current) return null

  const complementaryState = state === "default" ? "checked" : "default"
  const complementary = project.designSwitch?.find(
    (sw) => sw.state === complementaryState
  )
  const canFlip =
    interactive && state !== "disabled" && complementary !== undefined
  const shown = flipped && complementary ? complementary : current

  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []
  const radius = resolveCorner(shown.cornerId, corners)
  const shadow = resolveShadow(shown.shadowId, shadows)
  const labelStyle = typographyStyle(resolveLabelTypography(typographies))

  const height = shown.size
  const width = Math.round(height * 1.75)
  const inset = Math.max(2, Math.round(height / 6))
  const thumbSize = Math.max(4, height - 2 * inset - 2)

  return (
    <div
      data-slot="design-switch"
      data-state={shown.state}
      className={cn(designSwitchVariants({ state }), className)}
      {...props}
    >
      <span
        onClick={canFlip ? () => setFlipped((value) => !value) : undefined}
        className={cn(
          "relative inline-flex shrink-0 items-center transition-all select-none",
          canFlip && "cursor-pointer"
        )}
        style={{
          backgroundColor: resolveColor(shown.background, palettes),
          border: `1px solid ${resolveColor(shown.border, palettes)}`,
          borderRadius: radius >= 9999 ? 9999 : radius,
          width,
          height,
          padding: inset,
          justifyContent: shown.state === "checked" ? "flex-end" : "flex-start",
          boxShadow: shadow === "none" ? "none" : shadow,
        }}
      >
        <span
          className="inline-flex shrink-0 rounded-full transition-all"
          style={{
            backgroundColor: resolveColor(shown.foreground, palettes),
            width: thumbSize,
            height: thumbSize,
          }}
        />
      </span>
      <span className="text-sm" style={labelStyle}>
        {label}
      </span>
    </div>
  )
}

export { DesignSwitch, designSwitchVariants }
