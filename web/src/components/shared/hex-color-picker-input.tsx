import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Hash } from "lucide-react"

interface HexColorPickerInputProps {
  value: string // #rrggbb
  onChange: (value: string) => void
}

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/

export function HexColorPickerInput({ value, onChange }: HexColorPickerInputProps) {
  const commitText = (raw: string) => {
    const clean = raw.startsWith("#") ? raw : `#${raw}`
    if (HEX_REGEX.test(clean)) {
      onChange(clean)
    } else {
      onChange(value) // revert to last valid
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger
          className="size-9 shrink-0 rounded-md border shadow-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ backgroundColor: value }}
          aria-label="Pick color"
        />
        <PopoverContent className="w-auto gap-2 p-3" side="bottom" align="start" sideOffset={8}>
          <HexColorPicker color={value} onChange={onChange} />
          <Input
            className="font-mono text-xs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => commitText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="#6750A4"
          />
        </PopoverContent>
      </Popover>

      <InputGroup className="flex-1">
        <InputGroupAddon>
          <Hash />
        </InputGroupAddon>
        <InputGroupInput
          className="font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => commitText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="#6750A4"
        />
      </InputGroup>
    </div>
  )
}
