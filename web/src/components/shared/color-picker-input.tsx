import { HexAlphaColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Blend } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface ColorPickerInputProps {
  value: string // #rrggbbaa
  onChange: (value: string) => void
}

export function ColorPickerInput({ value, onChange }: ColorPickerInputProps) {
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
        <PopoverContent>
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
