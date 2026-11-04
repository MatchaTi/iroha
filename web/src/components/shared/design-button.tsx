import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import { findTypographyById, typographyStyle } from "@/lib/typography"
import {
  type DesignButton as DesignButtonConfig,
  type DesignButtonVariant,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fixed variant list — users can customize tokens, but cannot add new variants. */
export const DESIGN_BUTTON_VARIANTS: DesignButtonVariant[] = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "error",
  "warning",
  "success",
  "link",
]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designButtonVariants = cva(
  "inline-flex shrink-0 cursor-default items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        secondary: "",
        ghost: "",
        destructive: "",
        error: "",
        warning: "",
        success: "",
        link: "underline underline-offset-4",
      },
      size: {
        xs: "gap-1 text-xs",
        sm: "gap-1 text-sm",
        default: "gap-1.5 text-sm",
        lg: "gap-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ─── DesignButton ─────────────────────────────────────────────────────────────

type DesignButtonProps = ComponentProps<"div"> &
  VariantProps<typeof designButtonVariants> & {
    /** Project that owns the button design and its token collections. */
    project: Project
    /** Optional design override; defaults to `project.designButton`. */
    design?: DesignButtonConfig
  }

/**
 * Preview of a project's button design.
 *
 * The variant/size API mirrors `components/ui/button.tsx`, but the visual values
 * are resolved from the project's design tokens instead of static classes.
 */
function DesignButton({
  project,
  design: designProp,
  variant = "default",
  size = "default",
  className,
  children = "Button",
  style,
  ...props
}: DesignButtonProps) {
  const design = designProp ?? project.designButton

  // Guard against the legacy array format stored in localStorage.
  if (!design || Array.isArray(design)) return null

  const variantConfig = design.variants.find((v) => v.variant === variant)
  const sizeConfig = design.sizes.find((s) => s.size === size)

  if (!variantConfig || !sizeConfig) return null

  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []
  const typo = findTypographyById(typographies, design.typographyId)
  const radius = resolveCorner(design.cornerId, corners)

  return (
    <div
      data-slot="design-button"
      data-variant={variant}
      data-size={size}
      className={cn(designButtonVariants({ variant, size }), className)}
      style={{
        backgroundColor: resolveColor(variantConfig.background, palettes),
        color: resolveColor(variantConfig.foreground, palettes),
        borderColor: resolveColor(variantConfig.border, palettes),
        borderRadius: radius >= 9999 ? 9999 : radius,
        paddingLeft: sizeConfig.paddingX,
        paddingRight: sizeConfig.paddingX,
        paddingTop: sizeConfig.paddingY,
        paddingBottom: sizeConfig.paddingY,
        boxShadow: resolveShadow(design.shadowId, shadows),
        ...(typo ? typographyStyle(typo) : undefined),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export { DesignButton, designButtonVariants }
