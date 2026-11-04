import { useCallback, useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { Palette, Shapes, Type, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DisplayTypography } from "./display-typography"
import { DisplayColorPalette } from "./display-color-palette"
import { DisplayDesignSystem } from "./display-design-system"
import { DisplayDesignMD } from "./display-design-md"
import { ComponentContainer } from "../shared/component-container"

// ─── Data ─────────────────────────────────────────────────────────────────────

type Feature = {
  id: string
  index: string
  title: string
  description: string
  icon: LucideIcon
  preview: React.ReactNode
}

const FEATURES: Feature[] = [
  {
    id: "typography",
    index: "01",
    title: "Typography",
    description:
      "Build a clear type scale with real font metrics. Pair styles with variables so every screen stays in rhythm.",
    icon: Type,
    preview: <DisplayTypography />,
  },
  {
    id: "color-palettes",
    index: "02",
    title: "Color Palettes",
    description:
      "Generate complete palettes from a single anchor color, then fine-tune every shade without losing consistency.",
    icon: Palette,
    preview: <DisplayColorPalette />,
  },
  {
    id: "design-system",
    index: "03",
    title: "Design System",
    description:
      "Compose buttons, inputs, badges, and more from your tokens. A consistent component language, ready to ship.",
    icon: Shapes,
    preview: <DisplayDesignSystem />,
  },
  {
    id: "design-md",
    index: "04",
    title: "Design.md",
    description:
      "A living style guide for your design system so AI coding Agents can generate consistent user interface.",
    icon: Shapes,
    preview: <DisplayDesignMD />,
  },
]

// ─── Features ─────────────────────────────────────────────────────────────────

export function Features() {
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const lenis = useLenis()

  const updateFromScroll = useCallback(() => {
    const anchor = window.innerHeight * 0.5
    let next = 0

    itemRefs.current.forEach((element, index) => {
      if (element && element.getBoundingClientRect().top <= anchor) {
        next = index
      }
    })

    setActiveIndex((current) => (current === next ? current : next))

    const list = listRef.current
    if (list && progressRef.current) {
      const rect = list.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      progressRef.current.style.transform = `scaleX(${progress})`
    }
  }, [])

  // Drive the section from Lenis' smoothed scroll position.
  useLenis(updateFromScroll)

  useEffect(() => {
    const frame = requestAnimationFrame(updateFromScroll)
    window.addEventListener("resize", updateFromScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", updateFromScroll)
    }
  }, [updateFromScroll])

  const active = FEATURES[activeIndex]

  const scrollToFeature = (index: number) => {
    const target = itemRefs.current[index]
    if (target && lenis) {
      lenis.scrollTo(target, { offset: -1, duration: 1.2 })
    } else {
      target?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="features" className="relative">
      <div className="mx-auto px-4 lg:px-60">
        <div ref={listRef} className="flex flex-col lg:flex-row lg:gap-16">
          {/* Sticky column */}
          <div className="hidden lg:block lg:w-[42%]">
            <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
              <div
                key={active.id}
                className="animate-in space-y-4 duration-500 fade-in slide-in-from-bottom-2"
              >
                <ComponentContainer className="w-fit p-2">
                  <h3 className="text-5xl">{active.title}</h3>
                </ComponentContainer>
                <p className="max-w-md text-balance text-muted-foreground lg:text-lg">
                  {active.description}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {FEATURES.map((feature, index) => (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => scrollToFeature(index)}
                      aria-label={`Go to ${feature.title}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        index === activeIndex
                          ? "w-8 bg-foreground"
                          : "w-3 bg-border hover:bg-muted-foreground/50"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling column */}
          <div className="lg:w-[58%]">
            {FEATURES.map((feature, index) => {
              const isActive = index === activeIndex

              return (
                <article
                  key={feature.id}
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  className="flex min-h-[70vh] items-center py-10 lg:min-h-screen lg:py-24"
                  aria-labelledby={`feature-${feature.id}`}
                >
                  <div
                    className={cn(
                      "w-full transition-all duration-500",
                      isActive
                        ? "opacity-100"
                        : "opacity-60 lg:opacity-40 lg:saturate-[0.85]"
                    )}
                  >
                    <div className="mb-6 lg:hidden">
                      <div className="relative w-fit border border-dashed p-2">
                        <h3 className="text-5xl">{active.title}</h3>
                        <div className="absolute top-0 left-0 size-3 -translate-x-1/2 -translate-y-1/2 border bg-background" />
                        <div className="absolute top-0 right-0 size-3 translate-x-1/2 -translate-y-1/2 border bg-background" />
                        <div className="absolute right-0 bottom-0 size-3 translate-x-1/2 translate-y-1/2 border bg-background" />
                        <div className="absolute bottom-0 left-0 size-3 -translate-x-1/2 translate-y-1/2 border bg-background" />
                        <div className="absolute bottom-0 left-1/2 size-3 -translate-x-1/2 translate-y-1/2 border bg-background" />
                        <div className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 border bg-background" />
                      </div>
                    </div>
                    {feature.preview}
                    <p className="mt-5 text-sm text-muted-foreground lg:hidden">
                      {feature.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
