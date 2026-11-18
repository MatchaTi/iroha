import type * as React from "react"

/**
 * Iroha logo: three stacked rounded squares. The fills derive from the
 * active design's primary color at runtime — a lighter mix behind, the
 * primary itself in the middle, and a darker mix on top — so the logo
 * follows whatever design is currently active.
 */
export function IrohaLogo({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect
        x="97"
        y="97"
        width="566.667"
        height="566.667"
        rx="88"
        fill="color-mix(in oklab, var(--primary) 30%, white)"
      />
      <rect
        x="217"
        y="217"
        width="566.667"
        height="566.667"
        rx="88"
        fill="var(--primary)"
      />
      <rect
        x="337"
        y="337"
        width="566.667"
        height="566.667"
        rx="88"
        fill="color-mix(in oklab, var(--primary) 65%, black)"
      />
    </svg>
  )
}
