import { merge, omit } from "solid-js"
import type { ComponentProps, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SwitchPrimitive from "@kobalte/core/switch"

import { cn } from "~/lib/utils"

type SwitchProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  SwitchPrimitive.SwitchRootProps<T>
> &
  Pick<ComponentProps<T>, "class" | "children"> & {
    size?: "sm" | "default"
  }

const Switch = <T extends ValidComponent = "div">(props: SwitchProps<T>) => {
  const mergedProps = merge({ size: "default" as const }, props)
  const others = omit(mergedProps as SwitchProps, "class", "size", "id")
  return (
    <SwitchPrimitive.Root
      class={cn(
        "peer group/switch cn-switch relative inline-flex items-center outline-none transition-all data-disabled:cursor-not-allowed data-disabled:opacity-50",
        props.class
      )}
      data-size={props.size}
      data-slot="switch"
      {...others}
    >
      <SwitchPrimitive.Input class="peer sr-only" data-slot="switch-input" id={props.id} />
      <SwitchPrimitive.Control
        class="absolute inset-0 flex cursor-pointer items-center rounded-full transition-colors data-disabled:cursor-not-allowed"
        data-slot="switch-control"
        onClick={(e: Event) => e.preventDefault()}
      >
        <SwitchPrimitive.Thumb
          class="cn-switch-thumb pointer-events-none block rounded-full ring-0 transition-transform"
          data-slot="switch-thumb"
        />
      </SwitchPrimitive.Control>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
