import { type Component, omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { LoaderIcon } from "lucide-solid"

import { cn } from "~/lib/utils"

const Spinner: Component<ComponentProps<"svg">> = (props) => {
  const others = omit(props, "class")
  return (
    <LoaderIcon
      aria-label="Loading"
      class={cn("size-4 animate-spin", props.class)}
      data-slot="spinner"
      role="status"
      {...others}
    />
  )
}

export default function SpinnerCustom() {
  return (
    <div class="flex items-center gap-4">
      <Spinner />
    </div>
  )
}
