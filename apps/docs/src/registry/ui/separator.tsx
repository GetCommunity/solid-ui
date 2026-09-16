import { omit } from "solid-js"
import type { ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SeparatorPrimitive from "@kobalte/core/separator"

import { cn } from "~/lib/utils"

type SeparatorRootProps<T extends ValidComponent = "hr"> =
  SeparatorPrimitive.SeparatorRootProps<T> & { class?: string | undefined }

const Separator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, SeparatorRootProps<T>>
) => {
  const others = omit(props as SeparatorRootProps, "class", "orientation")
  return (
    <SeparatorPrimitive.Root
      class={cn(
        "cn-separator shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-auto data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        props.class
      )}
      data-slot="separator"
      orientation={props.orientation ?? "horizontal"}
      {...others}
    />
  )
}

export { Separator }
