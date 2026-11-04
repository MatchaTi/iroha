import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Check, Minus } from "lucide-react"
import { useState, type ComponentProps, type ReactNode } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import { resolveLabelTypography, typographyStyle } from "@/lib/typography"
import {
  type DesignCheckbox as DesignCheckboxConfig,
  type DesignCheckboxState,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

export const DESIGN_CHECKBOX_STATES: DesignCheckboxState[] = [
  "default",
  "checked",
  "indeterminate",
  "disabled",
]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designCheckboxVariants = cva("flex items-center gap-2", {
  variants: {
    state: {
      default: "",
      checked: "",
      indeterminate: "",
      disabled: "opacity-50",
    },
  },
  defaultVariants: {
    state: "default",
  },
})

// ─── DesignCheckbox ───────────────────────────────────────────────────────────

type DesignCheckboxProps = ComponentProps<"div"> &
  VariantProps<typeof designCheckboxVariants> & {
    /** Project that owns the checkbox design and its token collections. */
    project: Project
    /** Optional design override; defaults to the matching state in the project. */
    design?: DesignCheckboxConfig
    label?: ReactNode
    /** Click to toggle between this state and its complementary state. */
    interactive?: boolean
  }

/**
 * Preview of a project's checkbox design for a single state.
 */
function DesignCheckbox({
  project,
  design: designProp,
  state = "default",
  label = "Checkbox",
  interactive = true,
  className,
  ...props
}: DesignCheckboxProps) {
  const [flipped, setFlipped] = useState(false)

  const current =
    designProp ??
    project.designCheckbox?.find((checkbox) => checkbox.state === state)

  if (!current) return null

  const complementaryState = state === "default" ? "checked" : "default"
  const complementary = project.designCheckbox?.find(
    (checkbox) => checkbox.state === complementaryState
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
  const iconSize = Math.round(shown.size * 0.6)

  return (
    <div
      data-slot="design-checkbox"
      data-state={shown.state}
      className={cn(designCheckboxVariants({ state }), className)}
      {...props}
    >
      <span
        onClick={canFlip ? () => setFlipped((value) => !value) : undefined}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center transition-all select-none",
          canFlip && "cursor-pointer"
        )}
        style={{
          backgroundColor: resolveColor(shown.background, palettes),
          border: `1px solid ${resolveColor(shown.border, palettes)}`,
          borderRadius: radius >= 9999 ? 9999 : radius,
          width: shown.size,
          height: shown.size,
          boxShadow: shadow === "none" ? "none" : shadow,
        }}
      >
        {shown.state === "checked" && (
          <Check
            strokeWidth={3}
            size={iconSize}
            color={resolveColor(shown.foreground, palettes)}
          />
        )}
        {shown.state === "indeterminate" && (
          <Minus
            strokeWidth={3}
            size={iconSize}
            color={resolveColor(shown.foreground, palettes)}
          />
        )}
      </span>
      <span
        className="text-sm"
        style={labelStyle}

        onClick={canFlip ? () => setFlipped((value) => !value) : undefined}
      >
        {label}
      </span>
    </div>
  )
}

export { DesignCheckbox, designCheckboxVariants }
