import { For, omit } from "solid-js"
import type { JSX } from "@solidjs/web"

import { docsConfig } from "~/config/docs"
import { cn } from "~/lib/utils"
import { Button } from "~/registry/ui/button"

export function MainNav(props: JSX.IntrinsicElements["nav"]) {
  const others = omit(props, "class")
  return (
    <nav class={cn("items-center", props.class)} {...others}>
      <For each={docsConfig.mainNav}>
        {(item) => (
          <Button as="a" href={item.href} size="sm" variant="ghost">
            {item.title}
          </Button>
        )}
      </For>
    </nav>
  )
}
