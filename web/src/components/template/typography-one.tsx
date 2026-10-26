import type { Typography } from "@/store/use-project"
import { Dot } from "lucide-react"

type TypographyOneProps = Omit<Typography, "lineHeight" | "letterSpacing"> & {
  lineHeight: string
  letterSpacing: string
}

export function TypographyOne({
  name,
  purpose,
  level,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
}: TypographyOneProps) {
  return (
    <div>
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
      <section className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground capitalize">
        <p>{purpose}</p> <span>/</span> <p>{level}</p> <Dot />{" "}
        <p>{fontFamily}</p>
        <p>
          {fontSize}px / {lineHeight}
        </p>
        <p>{letterSpacing}</p>
      </section>
    </div>
  )
}
