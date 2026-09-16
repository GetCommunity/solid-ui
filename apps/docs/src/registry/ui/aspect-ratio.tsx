import { type Component, merge, omit } from "solid-js"
import type { ComponentProps, JSX } from "@solidjs/web"

import { cn } from "~/lib/utils"

type AspectRatioProps = ComponentProps<"div"> & { ratio?: number }

const AspectRatio: Component<AspectRatioProps> = (rawProps) => {
  const props = merge({ ratio: 1 / 1 }, rawProps)
  const others = omit(props, "class", "ratio")
  return (
    <div
      class={cn("relative aspect-(--ratio)", props.class)}
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": props.ratio
        } as JSX.CSSProperties
      }
      {...others}
    />
  )
}

export { AspectRatio }
