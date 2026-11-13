import { useState } from "react"
import { useColorModalStore } from "@/store/use-color-modal"
import { useDesignStore } from "@/store/use-design"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { ButtonGroup } from "../ui/button-group"
import { Palette, Moon, Sun } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { TailwindIcon } from "../shared/tailwind-icon"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { TAILWIND_COLORS } from "@/constants/tailwind-colors"
import { toast } from "../ui/toast"

type ThemeMode = "light" | "dark"

/** Normalize "#abc", "abc", "#aabbcc" or 8-digit hex to uppercase "#RRGGBB[AA]" */
function parseHex(input: string): string | null {
  const clean = input.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{6}$/.test(clean) || /^[0-9a-fA-F]{8}$/.test(clean)) {
    return `#${clean.toUpperCase()}`
  }
  return null
}

export function ColorPaletteModal() {
  const isOpen = useColorModalStore((state) => state.isOpen)
  const setIsOpen = useColorModalStore((state) => state.setIsOpen)
  const editedColor = useColorModalStore((state) => state.color)
  const designId = useColorModalStore((state) => state.designId)
  const token = useColorModalStore((state) => state.token)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {/* Remounted on every open, so the editor always starts from the
            color being edited — no effect-based syncing needed. */}
        <ColorEditor
          key={`${isOpen}:${designId}:${token}:${editedColor.value}`}
        />
      </DialogContent>
    </Dialog>
  )
}

function ColorEditor() {
  const setIsOpen = useColorModalStore((state) => state.setIsOpen)
  const editedColor = useColorModalStore((state) => state.color)
  const designId = useColorModalStore((state) => state.designId)
  const token = useColorModalStore((state) => state.token)
  const updateColor = useDesignStore((state) => state.updateColor)

  // Independent hex per theme mode
  const [lightHex, setLightHex] = useState(() =>
    editedColor.value.toUpperCase()
  )
  const [darkHex, setDarkHex] = useState(
    () => (editedColor.darkValue ?? editedColor.value).toUpperCase()
  )
  const [mode, setMode] = useState<ThemeMode>("light")

  const hex = mode === "light" ? lightHex : darkHex
  const setHex = mode === "light" ? setLightHex : setDarkHex
  const parsed = parseHex(hex)

  // <input type="color"> only accepts #RRGGBB; strip alpha / fall back to black
  const pickerValue = parsed ? parsed.slice(0, 7) : "#000000"

  const handleSave = () => {
    const light = parseHex(lightHex)
    const dark = parseHex(darkHex)

    if (!light || !dark) {
      toast.add({
        title: "Invalid Color",
        description: `One of the hex values is not valid`,
        type: "error",
      })
      return
    }

    updateColor(designId, token, {
      ...editedColor,
      value: light,
      darkValue: dark,
    })
    setIsOpen(false)
    toast.add({
      title: "Color Updated",
      description: `${editedColor.label} updated to ${light} (light) / ${dark} (dark)`,
      type: "success",
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Color</DialogTitle>
      </DialogHeader>

      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as ThemeMode)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="light">
            <Sun /> Light
          </TabsTrigger>
          <TabsTrigger value="dark">
            <Moon /> Dark
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ButtonGroup className="w-full items-center">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => setHex(e.target.value.toUpperCase())}
          className="min-w-8"
        />
        <ButtonGroup className="w-full">
          <InputGroup>
            <InputGroupInput
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#3388BB"
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupAddon align="inline-end">
                    <Palette />
                  </InputGroupAddon>
                }
              />
              <TooltipContent>Color Palette</TooltipContent>
            </Tooltip>
          </InputGroup>
        </ButtonGroup>
        <ButtonGroup>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="icon">
                  <TailwindIcon />
                </Button>
              }
            />
            <PopoverContent className="w-72">
              <PopoverHeader>
                <PopoverTitle>Tailwind Color</PopoverTitle>
              </PopoverHeader>
              <div className="max-h-64 overflow-y-auto">
                {Object.entries(TAILWIND_COLORS).map(([name, shades]) => (
                  <div key={name} className="mb-2 last:mb-0">
                    <div className="mb-1 text-xs font-medium text-muted-foreground capitalize">
                      {name}
                    </div>
                    <div className="grid grid-cols-11 gap-1">
                      {shades.map((shade) => (
                        <button
                          key={shade.label}
                          type="button"
                          title={shade.label}
                          onClick={() => setHex(shade.value)}
                          style={{ backgroundColor: shade.value }}
                          className={
                            "aspect-square cursor-pointer rounded hover:scale-110 " +
                            (parsed?.toLowerCase() === shade.value.toLowerCase()
                              ? "ring-2 ring-ring ring-offset-2 ring-offset-popover"
                              : "")
                          }
                        ></button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </ButtonGroup>
      </ButtonGroup>

      <DialogFooter>
        <DialogClose render={<Button variant={"ghost"}>Cancel</Button>} />
        <Button variant={"secondary"} disabled={!parsed} onClick={handleSave}>
          Save
        </Button>
      </DialogFooter>
    </>
  )
}
