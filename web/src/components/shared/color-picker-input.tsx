import { useState, useRef, useEffect } from "react"
import { HexAlphaColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Blend } from "lucide-react"

interface ColorPickerInputProps {
  value: string // #rrggbbaa
  onChange: (value: string) => void
}

export function ColorPickerInput({ value, onChange }: ColorPickerInputProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {/* Swatch trigger */}
      <button
        type="button"
        className="size-9 shrink-0 rounded-md border shadow-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ backgroundColor: value }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Pick color"
      />

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

      {/* Picker dropdown */}
      {open && (
        <div className="absolute left-0 top-11 z-50 flex flex-col gap-2 rounded-2xl border bg-popover p-3 shadow-lg">
          <HexAlphaColorPicker color={value} onChange={onChange} />
          <Input
            className="font-mono text-xs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000ff"
          />
        </div>
      )}
    </div>
  )
}
