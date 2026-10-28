import { toast } from "@/components/ui/toast"

export { cn } from "cn"

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.add({
      title: text,
      type: "success",
    })
  } else {
    toast.add({
      title: "Failed to copy to clipboard",
      type: "error",
    })
  }
}
