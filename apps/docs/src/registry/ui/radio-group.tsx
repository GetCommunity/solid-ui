import { omit } from "solid-js"
import type { ComponentProps, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  Item,
  ItemIndicator,
  ItemInput,
  type RadioGroupItemProps as RadioGroupItemPrimitiveProps,
  RadioGroup as RadioGroupRoot,
  type RadioGroupRootProps
} from "@kobalte/core/radio-group"
import { Circle } from "lucide-solid"

import { cn } from "~/lib/utils"

type RadioGroupProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  RadioGroupRootProps<T>
> &
  Pick<ComponentProps<T>, "class" | "children">

const RadioGroup = <T extends ValidComponent = "div">(props: RadioGroupProps<T>) => {
  const others = omit(props as RadioGroupProps, "class")
  return (
    <RadioGroupRoot
      class={cn("cn-radio-group w-full", props.class)}
      data-slot="radio-group"
      {...others}
    />
  )
}

type RadioGroupItemProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  RadioGroupItemPrimitiveProps<T>
> &
  Pick<ComponentProps<T>, "class" | "children">

const RadioGroupItem = <T extends ValidComponent = "div">(props: RadioGroupItemProps<T>) => {
  const others = omit(props as RadioGroupItemProps, "class", "id")
  return (
    <Item
      class={cn(
        "group/radio-group-item peer cn-radio-group-item after:-inset-x-3 after:-inset-y-2 relative aspect-square shrink-0 border outline-none after:absolute data-disabled:cursor-not-allowed data-disabled:opacity-50",
        props.class
      )}
      data-slot="radio-group-item"
      {...others}
    >
      <ItemInput class="peer sr-only" data-slot="radio-group-item-input" id={props.id} />
      <ItemIndicator class="cn-radio-group-indicator" data-slot="radio-group-indicator">
        <Circle class="cn-radio-group-indicator-icon" />
      </ItemIndicator>
    </Item>
  )
}

export { RadioGroup, RadioGroupItem }
