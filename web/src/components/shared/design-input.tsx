import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import {
  findTypographyById,
  resolveHelperTypography,
  resolveLabelTypography,
  typographyStyle,
} from "@/lib/typography"
import {
  type DesignInput as DesignInputConfig,
  type DesignInputState,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

export const DESIGN_INPUT_STATES: DesignInputState[] = [
  "default",
  "focus",
  "error",
  "disabled",
]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designInputVariants = cva("flex w-full max-w-xs flex-col gap-1.5", {
  variants: {
    state: {
      default: "",
      focus: "",
      error: "",
      disabled: "",
    },
  },
  defaultVariants: {
    state: "default",
  },
})

// ─── DesignInput ──────────────────────────────────────────────────────────────

type DesignInputProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof designInputVariants> & {
    /** Project that owns the input design and its token collections. */
    project: Project
    /** Optional design override; defaults to the matching state in the project. */
    design?: DesignInputConfig
    label?: ReactNode
    placeholder?: string
    helper?: ReactNode
  }

/**
 * Preview of a project's input design for a single state.
 *
 * The state API mirrors the input variants used across the app, but the visual
 * values are resolved from the project's design tokens.
 */
function DesignInput({
  project,
  design: designProp,
  state = "default",
  label = "Label",
  placeholder = "Placeholder",
  helper = "Helper text",
  className,
  ...props
}: DesignInputProps) {
  const design =
    designProp ?? project.designInput?.find((input) => input.state === state)

  if (!design) return null

  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []
  const typo = findTypographyById(typographies, design.typographyId)
  const labelTypo = resolveLabelTypography(typographies, typo)
  const helperTypo = resolveHelperTypography(typographies, typo)
  const radius = resolveCorner(design.cornerId, corners)
  const shadow = resolveShadow(design.shadowId, shadows)

  return (
    <div
      data-slot="design-input"
      data-state={state}
      className={cn(designInputVariants({ state }), className)}
      {...props}
    >
      <label
        className="text-sm font-medium"
        style={{
          color: resolveColor(design.label, palettes),
          ...typographyStyle(labelTypo),
        }}
      >
        {label}
      </label>
      <input
        readOnly={state === "disabled"}
        disabled={state === "disabled"}
        placeholder={placeholder}
        className="w-full outline-none placeholder:text-[var(--design-input-placeholder)]"
        style={
          {
            backgroundColor: resolveColor(design.background, palettes),
            color: resolveColor(design.foreground, palettes),
            border: `1px solid ${resolveColor(design.border, palettes)}`,
            borderRadius: radius >= 9999 ? 9999 : radius,
            ...(typo
              ? typographyStyle(typo)
              : { fontFamily: "sans-serif", fontSize: 14, fontWeight: 400 }),
            paddingLeft: design.paddingX,
            paddingRight: design.paddingX,
            paddingTop: design.paddingY,
            paddingBottom: design.paddingY,
            boxShadow: shadow === "none" ? "none" : shadow,
            "--design-input-placeholder": resolveColor(
              design.placeholder,
              palettes
            ),
          } as CSSProperties
        }
      />
      <span
        className="text-xs"
        style={{
          color: resolveColor(design.helper, palettes),
          ...typographyStyle(helperTypo),
        }}
      >
        {helper}
      </span>
    </div>
  )
}

export { DesignInput, designInputVariants }
