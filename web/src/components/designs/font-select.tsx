import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { GOOGLE_FONTS } from "@/constants/google-fonts"
import { loadGoogleFont } from "@/lib/google-fonts"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "cn"

const CATEGORIES = [
  "all",
  "sans serif",
  "serif",
  "monospace",
  "display",
  "handwriting",
] as const

/** How many fonts to render at once — the full list has 1900+ families. */
const MAX_RENDERED = 60

export function FontSelect({
  value,
  onChange,
  placeholder = "Default font",
}: {
  value: string | null
  onChange: (family: string | null) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return GOOGLE_FONTS.filter(
      (font) =>
        (category === "all" || font.category === category) &&
        (!query || font.family.toLowerCase().includes(query))
    )
  }, [search, category])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          >
            <span
              style={value ? { fontFamily: `"${value}"` } : undefined}
              className="truncate"
            >
              {value ?? placeholder}
            </span>
            <ChevronsUpDown className="opacity-40" />
          </Button>
        }
      />
      <PopoverContent className="w-72 p-2" align="start">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts..."
          />
          <InputGroupAddon align={"inline-start"}>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="mt-2 flex flex-wrap gap-1">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "cursor-pointer rounded-full border px-2 py-0.5 text-xs capitalize transition-colors",
                category === item
                  ? "border-transparent bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-2 max-h-64 space-y-0.5 overflow-y-auto">
          {filtered.slice(0, MAX_RENDERED).map((font) => (
            <button
              key={font.family}
              type="button"
              onClick={() => {
                loadGoogleFont(font.family)
                onChange(font.family)
                setOpen(false)
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                value === font.family && "bg-muted"
              )}
            >
              <span className="truncate">{font.family}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {font.category}
              </span>
              {value === font.family && <Check className="size-3.5 shrink-0" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No fonts found
            </p>
          )}
          {filtered.length > MAX_RENDERED && (
            <p className="py-2 text-center text-xs text-muted-foreground">
              {filtered.length - MAX_RENDERED} more — refine your search
            </p>
          )}
        </div>

        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full"
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            Reset to default
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}
