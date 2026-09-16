import { createMemo, For, merge, omit } from "solid-js"
import type { ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SliderPrimitive from "@kobalte/core/slider"

import { cn } from "~/lib/utils"

type SliderProps<T extends ValidComponent = "div"> = SliderPrimitive.SliderRootProps<T> & {
  class?: string | undefined
}

const Slider = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, SliderProps<T>>
) => {
  const props = merge({ minValue: 0, maxValue: 100 }, rawProps)
  const others = omit(
    props as SliderProps,
    "class",
    "defaultValue",
    "value",
    "minValue",
    "maxValue"
  )

  const _values = createMemo(() =>
    Array.isArray(props.value)
      ? props.value
      : Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [props.minValue, props.maxValue]
  )

  return (
    <SliderPrimitive.Root
      class={cn(
        "cn-slider relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        props.class
      )}
      data-slot="slider"
      defaultValue={props.defaultValue}
      maxValue={props.maxValue}
      minValue={props.minValue}
      value={props.value}
      {...others}
    >
      <SliderPrimitive.Track
        class={cn(
          "cn-slider-track relative flex grow items-center justify-center rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5"
        )}
        data-slot="slider-track"
      >
        <SliderPrimitive.Fill
          class={cn(
            "cn-slider-range absolute rounded-full bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
          data-slot="slider-range"
        />
        <For each={_values()}>
          {() => (
            <SliderPrimitive.Thumb
              class="cn-slider-thumb block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:outline-hidden focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
              data-slot="slider-thumb"
            >
              <SliderPrimitive.Input />
            </SliderPrimitive.Thumb>
          )}
        </For>
      </SliderPrimitive.Track>
    </SliderPrimitive.Root>
  )
}

export { Slider }
