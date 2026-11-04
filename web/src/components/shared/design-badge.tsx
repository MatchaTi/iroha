import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import { findTypographyById, typographyStyle } from "@/lib/typography"
import {
  type DesignBadge as DesignBadgeConfig,
  type DesignBadgeVariant,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fixed variant list — users can customize tokens, but cannot add new variants. */
export const DESIGN_BADGE_VARIANTS: DesignBadgeVariant[] = [
  "default",
  "secondary",
  "destructive",
  "error",
  "warning",
  "success",
  "outline",
]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designBadgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center border bg-clip-padding whitespace-nowrap transition-all select-none",
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
        destructive: "",
        error: "",
        warning: "",
        success: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ─── DesignBadge ──────────────────────────────────────────────────────────────

type DesignBadgeProps = ComponentProps<"span"> &
  VariantProps<typeof designBadgeVariants> & {
    /** Project that owns the badge design and its token collections. */
    project: Project
    /** Optional design override; defaults to the matching variant in the project. */
    design?: DesignBadgeConfig
  }

/**
 * Preview of a project's badge design.
 *
 * The variant API mirrors `components/ui/badge.tsx`, but the visual values are
 * resolved from the project's design tokens instead of static classes.
 */
function DesignBadge({
  project,
  design: designProp,
  variant = "default",
  className,
  children = "Badge",
  style,
  ...props
}: DesignBadgeProps) {
  const design =
    designProp ??
    project.designBadge?.find((badge) => badge.variant === variant)

  if (!design) return null

  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []
  const typo = findTypographyById(typographies, design.typographyId)
  const radius = resolveCorner(design.cornerId, corners)

  return (
    <span
      data-slot="design-badge"
      data-variant={variant}
      className={cn(designBadgeVariants({ variant }), className)}
      style={{
        backgroundColor: resolveColor(design.background, palettes),
        color: resolveColor(design.foreground, palettes),
        borderColor: resolveColor(design.border, palettes),
        borderRadius: radius >= 9999 ? 9999 : radius,
        paddingLeft: design.paddingX,
        paddingRight: design.paddingX,
        paddingTop: design.paddingY,
        paddingBottom: design.paddingY,
        boxShadow: resolveShadow(design.shadowId, shadows),
        ...(typo ? typographyStyle(typo) : undefined),
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export { DesignBadge, designBadgeVariants }
