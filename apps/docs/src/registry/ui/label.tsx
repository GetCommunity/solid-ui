import type { Component } from "solid-js"
import { omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { cn } from "~/lib/utils"

const Label: Component<ComponentProps<"label">> = (props) => {
  const others = omit(props, "class")
  return (
    <label
      class={cn(
        "cn-label flex select-none items-center peer-disabled:cursor-not-allowed group-data-disabled:pointer-events-none peer-data-disabled:cursor-not-allowed",
        props.class
      )}
      data-slot="label"
      {...others}
    />
  )
}

export { Label }
