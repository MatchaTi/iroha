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
  type DesignInputState,
  type DesignTextarea as DesignTextareaConfig,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

export const DESIGN_TEXTAREA_STATES: DesignInputState[] = [
  "default",
  "focus",
  "error",
  "disabled",
]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designTextareaVariants = cva("flex w-full max-w-xs flex-col gap-1.5", {
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

// ─── DesignTextarea ───────────────────────────────────────────────────────────

type DesignTextareaProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof designTextareaVariants> & {
    /** Project that owns the textarea design and its token collections. */
    project: Project
    /** Optional design override; defaults to the matching state in the project. */
    design?: DesignTextareaConfig
    label?: ReactNode
    placeholder?: string
    helper?: ReactNode
  }

/**
 * Preview of a project's textarea design for a single state.
 *
 * Mirrors the input API, but renders a multi-line field whose height comes from
 * the `minHeight` token instead of a fixed line height.
 */
function DesignTextarea({
  project,
  design: designProp,
  state = "default",
  label = "Label",
  placeholder = "Placeholder",
  helper = "Helper text",
  className,
  ...props
}: DesignTextareaProps) {
  const design =
    designProp ??
    project.designTextarea?.find((textarea) => textarea.state === state)

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
      data-slot="design-textarea"
      data-state={state}
      className={cn(designTextareaVariants({ state }), className)}
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
      <textarea
        readOnly={state === "disabled"}
        disabled={state === "disabled"}
        placeholder={placeholder}
        className="w-full resize-none outline-none placeholder:text-[var(--design-textarea-placeholder)]"
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
            minHeight: design.minHeight,
            boxShadow: shadow === "none" ? "none" : shadow,
            "--design-textarea-placeholder": resolveColor(
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

export { DesignTextarea, designTextareaVariants }
