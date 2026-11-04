import { cn } from "cn"
import { useRef, useState, type ComponentProps } from "react"

import { resolveColor, resolveCorner, resolveShadow } from "@/lib/design-tokens"
import {
  type DesignSlider as DesignSliderConfig,
  type Project,
} from "@/store/use-project"

// ─── DesignSlider ─────────────────────────────────────────────────────────────

type DesignSliderProps = Omit<ComponentProps<"div">, "defaultValue"> & {
  /** Project that owns the slider design and its token collections. */
  project: Project
  /** Optional design override; defaults to `project.designSlider`. */
  design?: DesignSliderConfig
  /** Initial value of the live preview, 0–100. */
  initialValue?: number
}

/**
 * Interactive preview of a project's slider design.
 */
function DesignSlider({
  project,
  design: designProp,
  initialValue = 50,
  className,
  style,
  ...props
}: DesignSliderProps) {
  const [value, setValue] = useState(initialValue)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const design = designProp ?? project.designSlider

  // Guard against legacy localStorage shapes.
  if (!design || Array.isArray(design)) return null

  const palettes = project.colorPalette ?? []
  const corners = project.corner ?? []
  const shadows = project.shadow ?? []
  const radius = resolveCorner(design.cornerId, corners)
  const thumbShadow = resolveShadow(design.thumbShadowId, shadows)

  const updateValue = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setValue(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      className={cn(
        "relative flex w-full max-w-sm cursor-pointer touch-none items-center select-none",
        className
      )}
      style={{ height: design.thumbSize, ...style }}
      {...props}
      onPointerDown={(event) => {
        draggingRef.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        updateValue(event.clientX)
      }}
      onPointerMove={(event) => {
        if (draggingRef.current) updateValue(event.clientX)
      }}
      onPointerUp={() => {
        draggingRef.current = false
      }}
    >
      {/* Track + fill */}
      <div
        ref={trackRef}
        className="relative w-full overflow-hidden"
        style={{
          height: design.height,
          borderRadius: radius >= 9999 ? 9999 : radius,
          backgroundColor: resolveColor(design.background, palettes),
        }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${value}%`,
            backgroundColor: resolveColor(design.foreground, palettes),
          }}
        />
      </div>
      {/* Thumb */}
      <div
        className="absolute shrink-0 rounded-full"
        style={{
          width: design.thumbSize,
          height: design.thumbSize,
          backgroundColor: resolveColor(design.thumb, palettes),
          left: `calc(${value}% - ${design.thumbSize / 2}px)`,
          top: "50%",
          transform: "translateY(-50%)",
          boxShadow: thumbShadow === "none" ? "none" : thumbShadow,
        }}
      />
    </div>
  )
}

export { DesignSlider }
