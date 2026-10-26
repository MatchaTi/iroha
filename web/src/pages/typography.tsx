import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import { Separator } from "@/components/ui/separator"
import { useProject, type Typography } from "@/store/use-project"
import { useParams } from "react-router"
import { FONTS, TYPOGRAPHY_STATER_PACKS } from "@/lib/constants"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  ALargeSmall,
  Copy,
  LetterSpacing,
  LineHeight,
  RotateCcw,
  RulerDimensionLine,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { TypographyOne } from "@/components/template/typography-one"
import { TypographyTwo } from "@/components/template/typography-two"

interface TypoRowProps {
  typo: Typography
  onCommit: (updated: Partial<Typography>) => void
  applyFontToAll: (fontFamily: string) => void
  template: string
}

function TypoRow({ typo, onCommit, applyFontToAll, template }: TypoRowProps) {
  const [fontSize, setFontSize] = useState(String(typo.fontSize))
  const [lineHeight, setLineHeight] = useState(String(typo.lineHeight))
  const [letterSpacing, setLetterSpacing] = useState(String(typo.letterSpacing))
  const [fontFamily, setFontFamily] = useState(typo.fontFamily)
  const [fontWeight, setFontWeight] = useState(typo.fontWeight)
  const [name, setName] = useState(typo.name)
  const [purpose, setPurpose] = useState(typo.purpose)
  const [level, setLevel] = useState(typo.level)

  const previewFontSize = parseFloat(fontSize)

  const commitNumber = (
    raw: string,
    key: "fontSize" | "lineHeight" | "letterSpacing",
    setter: (v: string) => void,
    fallback: number
  ) => {
    const parsed = parseFloat(raw)
    if (!isNaN(parsed) && parsed > 0) {
      onCommit({ [key]: parsed })
    } else {
      setter(String(fallback))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  return (
    <div className="grid border-b last:border-b-0 md:grid-cols-4">
      {/* Preview */}
      <div className="flex min-h-24 items-center px-6 py-8 md:col-span-3">
        {template === "one" && (
          <TypographyOne
            id={typo.id}
            name={name || typo.name}
            purpose={purpose}
            level={level}
            fontFamily={fontFamily}
            fontSize={
              !isNaN(previewFontSize) && previewFontSize > 0
                ? previewFontSize
                : typo.fontSize
            }
            fontWeight={fontWeight}
            lineHeight={`${parseFloat(lineHeight) || typo.lineHeight}px`}
            letterSpacing={`${parseFloat(letterSpacing) || typo.letterSpacing}px`}
          />
        )}

        {template === "two" && (
          <TypographyTwo
            id={typo.id}
            name={name || typo.name}
            purpose={purpose}
            level={level}
            fontFamily={fontFamily}
            fontSize={
              !isNaN(previewFontSize) && previewFontSize > 0
                ? previewFontSize
                : typo.fontSize
            }
            fontWeight={fontWeight}
            lineHeight={`${parseFloat(lineHeight) || typo.lineHeight}px`}
            letterSpacing={`${parseFloat(letterSpacing) || typo.letterSpacing}px`}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 border-t px-4 py-4 md:border-t-0 md:border-l">
        {/* Name + Purpose + Level row */}
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">
            Name
          </FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => onCommit({ name })}
            onKeyDown={handleKeyDown}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Purpose
            </FieldLabel>
            <Select
              value={purpose}
              onValueChange={(value) => {
                const v = value as Typography["purpose"]
                setPurpose(v)
                onCommit({ purpose: v })
              }}
            >
              <SelectTrigger>
                <SelectValue className={"capitalize"} />
              </SelectTrigger>
              <SelectContent>
                {(
                  ["display", "headline", "title", "body", "label"] as const
                ).map((v) => (
                  <SelectItem key={v} value={v} className={"capitalize"}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Level
            </FieldLabel>
            <Select
              value={level}
              onValueChange={(value) => {
                const v = value as Typography["level"]
                setLevel(v)
                onCommit({ level: v })
              }}
            >
              <SelectTrigger>
                <SelectValue className={"capitalize"} />
              </SelectTrigger>
              <SelectContent>
                {(["large", "medium", "small"] as const).map((v) => (
                  <SelectItem key={v} value={v} className={"capitalize"}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Separator />

        <div className="flex items-end gap-2">
          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Font Family
            </FieldLabel>
            <Combobox
              items={FONTS}
              value={fontFamily}
              onValueChange={(value) => {
                setFontFamily(value ?? "")
                onCommit({ fontFamily: value ?? "" })
              }}
            >
              <ComboboxInput
                placeholder="Select font..."
                showClear
                style={{ fontFamily }}
              />
              <ComboboxContent>
                <ComboboxEmpty>No font found.</ComboboxEmpty>
                <ComboboxList>
                  {(font: (typeof FONTS)[number]) => (
                    <ComboboxItem
                      key={font.value}
                      value={font.value}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size={"icon"}
                  variant={"secondary"}
                  onClick={() => applyFontToAll(fontFamily)}
                >
                  <Copy />
                </Button>
              }
            />
            <TooltipContent>
              Apply this font to all typography styles in the project.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Size
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <ALargeSmall />
              </InputGroupAddon>
              <InputGroupInput
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                onBlur={() =>
                  commitNumber(fontSize, "fontSize", setFontSize, typo.fontSize)
                }
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Weight
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <RulerDimensionLine />
              </InputGroupAddon>
              <InputGroupInput
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                onBlur={() => onCommit({ fontWeight })}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Line Height
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LineHeight />
              </InputGroupAddon>
              <InputGroupInput
                value={lineHeight}
                onChange={(e) => setLineHeight(e.target.value)}
                onBlur={() =>
                  commitNumber(
                    lineHeight,
                    "lineHeight",
                    setLineHeight,
                    typo.lineHeight
                  )
                }
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel className="text-xs text-muted-foreground">
              Letter Spacing
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LetterSpacing />
              </InputGroupAddon>
              <InputGroupInput
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(e.target.value)}
                onBlur={() =>
                  commitNumber(
                    letterSpacing,
                    "letterSpacing",
                    setLetterSpacing,
                    typo.letterSpacing
                  )
                }
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Field>
        </div>
      </div>
    </div>
  )
}

export function Typography() {
  const { id } = useParams<{ id: string }>()
  const project = useProject((state) => state.projects.find((p) => p.id === id))
  const updateProject = useProject((state) => state.updateProject)

  const handleCommit = (typoId: string, updated: Partial<Typography>) => {
    if (!project) return
    updateProject(id!, {
      typography: project.typography.map((t) =>
        t.id === typoId ? { ...t, ...updated } : t
      ),
    })
  }

  const applyFontToAll = (fontFamily: string) => {
    if (!project) return
    updateProject(id!, {
      typography: project.typography.map((t) => ({ ...t, fontFamily })),
    })
  }

  const resetToDefault = () => {
    if (!project) return
    updateProject(id!, {
      typography: TYPOGRAPHY_STATER_PACKS,
    })
  }

  const changeTemplate = (template: string) => {
    if (!project) return
    updateProject(id!, {
      templateTypography: template,
    })
  }

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-2">
          <h1 className="heading">Typography</h1>
          <p>Use typography to make content readable and beautiful</p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={project?.templateTypography}
            onValueChange={(value) => changeTemplate(value as string)}
          >
            <SelectTrigger>
              <SelectValue className={"capitalize"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">Template One</SelectItem>
              <SelectItem value="two">Template Two</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={"outline"} onClick={resetToDefault}>
            <RotateCcw /> Reset
          </Button>
        </div>
      </section>
      <section className="mt-6 rounded-2xl border">
        {project?.typography.map((typo) => (
          <TypoRow
            key={`${typo.id}-${typo.fontFamily}`}
            typo={typo}
            onCommit={(updated) => handleCommit(typo.id, updated)}
            applyFontToAll={applyFontToAll}
            template={project.templateTypography}
          />
        ))}
      </section>
    </main>
  )
}
