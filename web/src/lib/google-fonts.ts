export type GoogleFont = {
  family: string
  category: "sans serif" | "serif" | "display" | "handwriting" | "monospace"
}

const loaded = new Set<string>()

/**
 * Lazily load a Google Font stylesheet so the family renders in previews.
 * Font files are fetched from the Google Fonts CSS API on demand — bundling
 * all families would weigh tens of megabytes.
 */
export function loadGoogleFont(family: string) {
  if (loaded.has(family)) return
  loaded.add(family)

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}&display=swap`
  document.head.append(link)
}
