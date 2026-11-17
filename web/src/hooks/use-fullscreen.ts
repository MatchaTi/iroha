import * as React from "react"

/**
 * Fullscreen API helper for design previews. Attach `ref` to the element
 * that should fill the screen and call `toggle` to enter/exit. The state
 * follows the browser's `fullscreenchange` event, so it stays correct even
 * when the user exits with ESC or the browser UI.
 */
export function useFullscreen<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // Event-driven: the browser notifies us when the fullscreen state changes.
  React.useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  const toggle = React.useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void ref.current?.requestFullscreen()
    }
  }, [])

  return { ref, isFullscreen, toggle }
}
