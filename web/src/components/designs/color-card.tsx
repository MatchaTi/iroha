import type { Color, ColorPalette } from "@/store/use-design"
import type { CSSProperties } from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item"
import { Button } from "../ui/button"
import { Copy, Edit } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { copyToClipboard } from "@/lib/utils"
import { useColorModalStore } from "@/store/use-color-modal"

type Props = {
  color?: Color
  /** Design that owns this palette token, used to persist edits. */
  designId?: string
  /** Palette token this card displays, e.g. "primary". */
  token?: keyof ColorPalette
}

export function ColorCard({
  color = { label: "Primary", value: "#3388bb" },
  designId,
  token,
}: Props) {
  const openColorModal = useColorModalStore((state) => state.openColorModal)

  return (
    <Item className="group p-1 hover:bg-muted/50">
      <ItemContent className="flex-row items-center gap-4">
        <div
          style={
            {
              "--swatch": color.value,
              "--swatch-dark": color.darkValue ?? color.value,
            } as CSSProperties
          }
          className="aspect-square w-full max-w-16 rounded-lg border border-border bg-(--swatch) dark:bg-(--swatch-dark)"
        ></div>
        <div>
          <ItemTitle>{color.label}</ItemTitle>
          {/* Light and dark hex are both rendered; CSS picks the visible one
              based on the active theme (same technique as the swatch). */}
          <ItemDescription className="font-mono">
            <span className="dark:hidden">{color.value}</span>
            <span className="hidden dark:inline">
              {color.darkValue ?? color.value}
            </span>
          </ItemDescription>
        </div>
      </ItemContent>
      <ItemActions className="hidden flex-col gap-0 group-hover:flex">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                onClick={() =>
                  openColorModal({ color, designId: designId ?? "", token: token ?? "primary" })
                }
              >
                <Edit />
              </Button>
            }
          />
          <TooltipContent>Edit Color</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                onClick={() => copyToClipboard(color.value)}
              >
                <Copy />
              </Button>
            }
          />
          <TooltipContent>Copy Color</TooltipContent>
        </Tooltip>
      </ItemActions>
    </Item>
  )
}
