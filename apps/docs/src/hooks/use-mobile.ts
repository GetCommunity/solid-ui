import { createSignal, onSettled } from "solid-js"
import { isServer } from "@solidjs/web"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(fallback = false) {
  const [isMobile, setIsMobile] = createSignal(fallback)

  onSettled(() => {
    if (isServer) return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    mql.addEventListener("change", onChange)
    onChange(mql)
    return () => mql.removeEventListener("change", onChange)
  })

  return isMobile
}
