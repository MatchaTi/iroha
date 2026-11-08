import { TYPOGRAPHY_STATER_PACKS } from "@/lib/constants"
import { TypographyOne } from "../template/typography-one"

export function DisplayTypography() {
  return (
    <section>
      <div className="hidden space-y-6 lg:block">
        {TYPOGRAPHY_STATER_PACKS.slice(0, 9).map((pack) => (
          <TypographyOne
            id={pack.id}
            name={pack.name}
            purpose={pack.purpose}
            level={pack.level}
            fontFamily={"Inter"}
            fontSize={pack.fontSize}
            fontWeight={pack.fontWeight}
            lineHeight={`${pack.lineHeight}px`}
            letterSpacing={`${pack.letterSpacing}px`}
          />
        ))}
      </div>

      <div className="space-y-6 lg:hidden">
        {TYPOGRAPHY_STATER_PACKS.slice(3, 9).map((pack) => (
          <TypographyOne
            id={pack.id}
            name={pack.name}
            purpose={pack.purpose}
            level={pack.level}
            fontFamily={"Inter Variable"}
            fontSize={pack.fontSize}
            fontWeight={pack.fontWeight}
            lineHeight={`${pack.lineHeight}px`}
            letterSpacing={`${pack.letterSpacing}px`}
          />
        ))}
      </div>
    </section>
  )
}
