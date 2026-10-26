import type { Typography } from "@/store/use-project"

type TypographyTwoProps = Omit<Typography, "lineHeight" | "letterSpacing"> & {
  lineHeight: string
  letterSpacing: string
}

export function TypographyTwo({
  name,
  purpose,
  level,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
}: TypographyTwoProps) {
  return (
    <div>
      {/* Main content */}
      <div className="relative flex flex-col gap-3">
        {/* Purpose + level badge */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-foreground px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-widest text-background uppercase">
            {purpose}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {level}
          </span>
        </div>

        {/* Preview text */}
        <div
          className="duration-200"
          style={{
            fontFamily,
            fontSize,
            fontWeight,
            lineHeight,
            letterSpacing,
          }}
        >
          {name}
        </div>

        {/* Metrics row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 font-mono text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground">{fontFamily}</span>
          <span className="flex items-center gap-1">
            <span className="text-foreground/40">size</span>
            {fontSize}px
          </span>
          <span className="flex items-center gap-1">
            <span className="text-foreground/40">weight</span>
            {fontWeight}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-foreground/40">lh</span>
            {lineHeight}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-foreground/40">ls</span>
            {letterSpacing}
          </span>
        </div>
      </div>
    </div>
  )
}
