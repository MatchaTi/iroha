import { HexAlphaColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Blend } from "lucide-react"
import type { ColorPalette } from "@/store/use-project"
import { cn } from "@/lib/utils"

interface ColorPickerInputProps {
  value: string // #rrggbbaa
  onChange: (value: string) => void
  palettes?: ColorPalette[]
}

/** Convert #rrggbb to #rrggbbff (add full alpha) */
function ensureHex8(hex: string): string {
  const clean = hex.replace("#", "")
  if (clean.length === 6) return `#${clean}ff`
  return hex
}

export function ColorPickerInput({
  value,
  onChange,
  palettes,
}: ColorPickerInputProps) {
  return (
    <div className="relative flex items-center gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="size-9 shrink-0 rounded-md border shadow-sm transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              style={{ backgroundColor: value }}
              aria-label="Pick color"
            />
          }
        />
        <PopoverContent className="flex flex-col gap-2">
          <HexAlphaColorPicker
            color={value}
            onChange={onChange}
            className="min-w-full"
          />
          <Input
            className="font-mono text-xs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000ff"
          />

          {/* Palette swatches */}
          {palettes && palettes.length > 0 && (
            <div className="flex flex-col gap-2 border-t pt-2">
              <p className="text-xs text-muted-foreground">From palette</p>
              <div className="flex flex-col gap-1.5">
                {palettes.map((palette) => {
                  const anchor = palette.colors.find((c) => c.level === "500")
                  if (!anchor) return null
                  return (
                    <div key={palette.id} className="flex items-center gap-2">
                      <span className="w-16 truncate text-xs text-muted-foreground capitalize">
                        {palette.name}
                      </span>
                      <div className="flex gap-0.5">
                        {palette.colors.map((color) => {
                          const isSelected =
                            value.toLowerCase() ===
                            ensureHex8(color.hex).toLowerCase()
                          return (
                            <button
                              key={color.level}
                              type="button"
                              title={`${palette.name} ${color.level} — ${color.hex}`}
                              className={cn(
                                "size-5 rounded border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                                isSelected &&
                                  "ring-2 ring-foreground ring-offset-1"
                              )}
                              style={{ backgroundColor: color.hex }}
                              onClick={() => onChange(ensureHex8(color.hex))}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Hex text input */}
      <InputGroup className="flex-1">
        <InputGroupAddon>
          <Blend />
        </InputGroupAddon>
        <InputGroupInput
          className="font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000ff"
        />
      </InputGroup>
    </div>
  )
}
