import {
  type Accessor,
  createContext,
  createSignal,
  type ParentProps,
  untrack,
  useContext
} from "solid-js"

export const COLOR_MODE_COOKIE_KEY = "theme-color-mode"

export type ColorMode = "light" | "dark"

export type ColorModeContextValue = {
  colorMode: Accessor<ColorMode>
  toggleColorMode: () => void
  setColorMode: (mode: ColorMode) => void
}

export const ColorModeContext = createContext<ColorModeContextValue>()

export function ColorModeProvider(
  props: ParentProps<{
    initialColorMode: ColorMode
  }>
) {
  const [colorMode, setColorMode] = createSignal<ColorMode>(untrack(() => props.initialColorMode))

  const toggleColorMode = () => {
    const nextColorMode = colorMode() === "dark" ? "light" : "dark"
    setColorMode(nextColorMode)

    // Update the HTML element class
    const html = document.documentElement
    html.classList.remove("light", "dark")
    html.classList.add(nextColorMode)

    // Set the cookie
    // biome-ignore lint/suspicious/noDocumentCookie: <TODO: find a better way to do this>
    document.cookie = `${COLOR_MODE_COOKIE_KEY}=${nextColorMode}; path=/; max-age=31536000; SameSite=Lax`
  }

  return (
    <ColorModeContext value={{ colorMode, toggleColorMode, setColorMode }}>
      {props.children}
    </ColorModeContext>
  )
}

export function useColorMode(): ColorModeContextValue {
  return useContext(ColorModeContext)
}

export const getClientColorMode = () =>
  document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COLOR_MODE_COOKIE_KEY}=`))
    ?.split("=")[1] ??
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
