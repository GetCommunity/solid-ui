import { Loading, lazy, Match, omit, Show, Switch } from "solid-js"
import type { JSX } from "@solidjs/web"

import { useDesignSystem } from "~/components/design-system-provider"
import type { IconLibraryName } from "~/registry/icon-libraries"

type SvgProps = JSX.IntrinsicElements["svg"]

const IconLucide = lazy(() => import("~/registry/icons/icon-lucide"), { export: "IconLucide" })

const IconTabler = lazy(() => import("~/registry/icons/icon-tabler"), { export: "IconTabler" })

function SquarePlaceholder(props: SvgProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height="18" rx="2" width="18" x="3" y="3" />
    </svg>
  )
}

type IconPlaceholderProps = {
  [K in IconLibraryName]?: string
} & SvgProps

export function IconPlaceholder(props: IconPlaceholderProps) {
  const svgProps = omit(props, "lucide", "tabler")
  const { iconLibrary } = useDesignSystem()

  return (
    <Loading fallback={<SquarePlaceholder {...svgProps} />}>
      <Show when={props[iconLibrary()]}>
        {(iconName) => (
          <Switch>
            <Match when={iconLibrary() === "lucide"}>
              <IconLucide name={iconName()} {...svgProps} />
            </Match>
            <Match when={iconLibrary() === "tabler"}>
              <IconTabler name={iconName()} {...svgProps} />
            </Match>
          </Switch>
        )}
      </Show>
    </Loading>
  )
}
