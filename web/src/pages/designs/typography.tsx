import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { FontSelect } from "@/components/designs/font-select"
import { loadGoogleFont } from "@/lib/google-fonts"
import { toast } from "@/components/ui/toast"
import { ImagePlus } from "lucide-react"
import {
  useDesignStore,
  DEFAULT_TYPOGRAPHY,
  type Typography,
} from "@/store/use-design"
import { useParams } from "react-router"

export function TypographyPage() {
  const { id } = useParams<{ id: string }>()
  // Select the design object itself (not the getDesign action) so this
  // component re-renders whenever its typography is updated.
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === id)
  )
  const updateFont = useDesignStore((state) => state.updateFont)
  const typography = design?.typography ?? DEFAULT_TYPOGRAPHY

  const setFont = (slot: keyof Typography, family: string | null) => {
    if (!design) return
    if (family) loadGoogleFont(family)
    updateFont(design.id, slot, family)
    toast.add({
      title: family ? "Font Applied" : "Font Reset",
      description: family
        ? `${family} applied to the whole website`
        : "Reverted to the theme default font",
      type: "success",
    })
  }

  return (
    <main className="space-y-6">
      <div className="space-y-6">
        <section className="flex gap-2 border-b p-6">
          <Field className="flex-1">
            <FieldLabel>Sans-Serif</FieldLabel>
            <FontSelect
              value={typography.sans}
              onChange={(family) => setFont("sans", family)}
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel>Serif</FieldLabel>
            <FontSelect
              value={typography.serif}
              onChange={(family) => setFont("serif", family)}
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel>Monospace</FieldLabel>
            <FontSelect
              value={typography.mono}
              onChange={(family) => setFont("mono", family)}
            />
          </Field>
        </section>

        <section className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant={"outline"}>Typography</Badge>
            <Badge variant={"outline"}>Design</Badge>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            Building a Typography System That Scales
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <p>Aimyon</p>
            </div>
            <Button variant={"outline"}>Follow</Button>
            <div className="text-muted-foreground">
              5 min read · Jun 12, 2026
            </div>
          </div>

          <div className="flex h-80 flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground">
            <ImagePlus className="size-8" />
            <p className="text-sm">Cover image</p>
          </div>

          <article className="space-y-6">
            <p className="font-serif text-xl leading-relaxed">
              Typography is the foundation of every interface. Long before a
              user taps a button or reads a label, they have already judged your
              product by the shape of its letters. A solid type system keeps
              every screen consistent, readable, and unmistakably yours.
            </p>

            <h2 className="font-heading text-2xl font-semibold">
              Why typography matters
            </h2>
            <p className="leading-relaxed">
              Most of an interface is text: labels, descriptions, errors,
              confirmations. When sizes, weights, and line heights are chosen ad
              hoc, the hierarchy falls apart and reading becomes work. A type
              scale turns those decisions into a small set of reusable rules —
              so headings look like headings everywhere, and body text never
              fights for attention.
            </p>

            <blockquote className="border-l-2 pl-4 font-serif text-lg leading-relaxed italic">
              "Web design is 95% typography." — Oliver Reichenstein
            </blockquote>

            <h2 className="font-heading text-2xl font-semibold">
              Choosing the right fonts
            </h2>
            <p className="leading-relaxed">
              A practical stack needs at least three voices, each with a clear
              job:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Sans-serif</strong> for interface elements — buttons,
                labels, navigation — where clarity at small sizes matters most.
              </li>
              <li>
                <strong>Serif</strong> for long-form reading, where the extra
                character detail reduces fatigue over paragraphs of text.
              </li>
              <li>
                <strong>Monospace</strong> for code, identifiers, and anything
                where fixed-width alignment carries meaning.
              </li>
            </ul>

            <h3 className="font-heading text-xl font-semibold">
              Pairing without clashing
            </h3>
            <p className="leading-relaxed">
              Good pairings share a common rhythm: similar x-heights and stroke
              contrast, but distinct personalities. Limit yourself to two
              families plus a mono, then lean on <em>weight</em> and{" "}
              <em>size</em> for hierarchy. Inline code like{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                font-feature-settings
              </code>{" "}
              should sit comfortably inside a paragraph without breaking its
              line height.
            </p>

            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
              <code>{`@theme inline {
  --font-heading: var(--font-sans);
  --font-sans: "Inter", sans-serif;
  --font-serif: "Lora", serif;
  --font-mono: "Source Code Pro", monospace;
}`}</code>
            </pre>

            <h2 className="font-heading text-2xl font-semibold">Wrapping up</h2>
            <p className="leading-relaxed">
              Start with a scale, name your roles, and enforce them in code —
              not in reviews. The fastest way to keep typography consistent is
              to make the correct choice the easiest one to reach for.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
