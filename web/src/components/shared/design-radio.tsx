import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { useState, type ComponentProps } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import { resolveLabelTypography, typographyStyle } from "@/lib/typography"
import {
  type DesignRadio as DesignRadioConfig,
  type DesignRadioState,
  type Project,
} from "@/store/use-project"

// ─── Constants ────────────────────────────────────────────────────────────────

export const DESIGN_RADIO_STATES: DesignRadioState[] = [
  "default",
  "checked",
  "disabled",
]

const DEFAULT_OPTIONS = ["Option 1", "Option 2", "Option 3"]

// ─── Variants ─────────────────────────────────────────────────────────────────

const designRadioVariants = cva("flex flex-col items-start gap-3", {
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

// ─── Resolved config ──────────────────────────────────────────────────────────

function resolveRadioConfig(radio: DesignRadioConfig, project: Project) {
  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const typographies = project.typography ?? []

  return {
    background: resolveColor(radio.background, palettes),
    foreground: resolveColor(radio.foreground, palettes),
    border: resolveColor(radio.border, palettes),
    radius: resolveCorner(radio.cornerId, corners),
    size: radio.size,
    shadow: resolveShadow(radio.shadowId, shadows),
    labelStyle: typographyStyle(resolveLabelTypography(typographies)),
  }
}

// ─── DesignRadio ──────────────────────────────────────────────────────────────

type DesignRadioProps = ComponentProps<"div"> &
  VariantProps<typeof designRadioVariants> & {
    /** Project that owns the radio design and its token collections. */
    project: Project
    /** Optional design override; defaults to the matching state in the project. */
    design?: DesignRadioConfig
    options?: string[]
    /** Click an option to select it (radio semantics). */
    interactive?: boolean
  }

/**
 * Preview of a project's radio design for a single state.
 *
 * Selected options use the `checked` config, unselected options use the
 * `default` config, and the `disabled` state applies to every option.
 */
function DesignRadio({
  project,
  design: designProp,
  state = "default",
  options = DEFAULT_OPTIONS,
  interactive = true,
  className,
  ...props
}: DesignRadioProps) {
  const [selected, setSelected] = useState<number | null>(
    state === "checked" ? 0 : null
  )

  const current =
    designProp ?? project.designRadio?.find((radio) => radio.state === state)

  if (!current) return null

  const checkedCfg =
    project.designRadio?.find((radio) => radio.state === "checked") ?? current
  const defaultCfg =
    project.designRadio?.find((radio) => radio.state === "default") ?? current
  const disabledCfg =
    project.designRadio?.find((radio) => radio.state === "disabled") ?? current

  const isDisabled = state === "disabled"
  const checked = resolveRadioConfig(
    isDisabled ? disabledCfg : checkedCfg,
    project
  )
  const fallback = resolveRadioConfig(
    isDisabled ? disabledCfg : defaultCfg,
    project
  )
  const canSelect = interactive && !isDisabled

  return (
    <div
      data-slot="design-radio"
      data-state={state}
      className={cn(designRadioVariants({ state }), className)}
      {...props}
    >
      {options.map((label, index) => {
        const isSelected = selected === index
        const shown = isSelected ? checked : fallback
        const dotSize = Math.round(shown.size * 0.5)

        return (
          <div
            key={label}
            onClick={canSelect ? () => setSelected(index) : undefined}
            className={cn(
              "flex items-center gap-2",
              canSelect && "cursor-pointer"
            )}
          >
            <span
              className="relative inline-flex shrink-0 items-center justify-center transition-all select-none"
              style={{
                backgroundColor: shown.background,
                border: `1px solid ${shown.border}`,
                borderRadius: shown.radius >= 9999 ? 9999 : shown.radius,
                width: shown.size,
                height: shown.size,
                boxShadow: shown.shadow === "none" ? "none" : shown.shadow,
              }}
            >
              {isSelected && (
                <span
                  className="absolute inset-0 m-auto rounded-full"
                  style={{
                    backgroundColor: shown.foreground,
                    width: dotSize,
                    height: dotSize,
                  }}
                />
              )}
            </span>
            <span className="text-sm" style={shown.labelStyle}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { DesignRadio, designRadioVariants }
