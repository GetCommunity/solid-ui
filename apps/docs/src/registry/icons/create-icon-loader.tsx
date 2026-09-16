import { type Component, createMemo, omit, Show } from "solid-js"
import { type ComponentProps, Dynamic } from "@solidjs/web"

import type { IconLibraryName } from "~/registry/icon-libraries"

type IconComponent = Component<ComponentProps<"svg">>
type IconLibraryModule = Record<string, IconComponent>

const iconPromiseCaches = new Map<IconLibraryName, Promise<IconLibraryModule>>()

function loadIconLibrary(libraryName: IconLibraryName) {
  if (!iconPromiseCaches.has(libraryName)) {
    const promise =
      libraryName === "lucide"
        ? import("~/registry/icons/__lucide__")
        : import("~/registry/icons/__tabler__")

    iconPromiseCaches.set(libraryName, promise as Promise<IconLibraryModule>)
  }

  return iconPromiseCaches.get(libraryName)!
}

export function createIconLoader(libraryName: IconLibraryName) {
  return function IconLoader(props: { name: string } & ComponentProps<"svg">) {
    const svgProps = omit(props, "name")
    const icons = createMemo<IconLibraryModule>(async () => await loadIconLibrary(libraryName))

    return (
      <Show
        fallback={<span class="size-4" />}
        when={icons()?.[props.name] as IconComponent | undefined}
      >
        {(IconComponent) => <Dynamic component={IconComponent()} {...svgProps} />}
      </Show>
    )
  }
}
