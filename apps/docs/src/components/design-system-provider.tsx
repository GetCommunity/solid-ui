import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"

import type { IconLibraryName } from "~/registry/icon-libraries"
import { STYLES, type Style } from "~/registry/styles"

type DesignSystemContextType = {
  style: Accessor<Style>
  setStyle: (value: Style) => void
  iconLibrary: Accessor<IconLibraryName>
  setIconLibrary: (value: IconLibraryName) => void
}

const DesignSystemContext = createContext<DesignSystemContextType>()

export function useDesignSystem() {
  return useContext(DesignSystemContext)
}

export function DesignSystemProvider(props: ParentProps) {
  const [style, rawSetStyle] = createSignal<Style>(STYLES[0])
  const [iconLibrary, setIconLibrary] = createSignal<IconLibraryName>("lucide")

  const setStyle = (value: Style) => {
    rawSetStyle(value)

    const body = document.body
    body.classList.forEach((cls) => {
      if (cls.startsWith("style-")) {
        body.classList.remove(cls)
      }
    })
    body.classList.add(`style-${value.name}`)
  }

  const context: DesignSystemContextType = {
    style,
    setStyle,
    iconLibrary,
    setIconLibrary
  }

  return <DesignSystemContext value={context}>{props.children}</DesignSystemContext>
}
