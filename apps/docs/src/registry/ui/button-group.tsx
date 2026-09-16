import { merge, omit } from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import { Polymorphic } from "@kobalte/core/polymorphic"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import { Separator } from "~/registry/ui/separator"

const buttonGroupVariants = cva(
  "group/button-group cn-button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "cn-button-group-orientation-horizontal *:data-slot:rounded-r-none [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
        vertical:
          "cn-button-group-orientation-vertical flex-col *:data-slot:rounded-b-none [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0"
      }
    },
    defaultVariants: {
      orientation: "horizontal"
    }
  }
)

type ButtonGroupProps = ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>

const ButtonGroup = (props: ButtonGroupProps) => {
  const others = omit(props, "class", "orientation")
  return (
    <div
      class={cn(buttonGroupVariants({ orientation: props.orientation }), props.class)}
      data-orientation={props.orientation}
      data-slot="button-group"
      role="group"
      {...others}
    />
  )
}

type ButtonGroupTextProps<T extends ValidComponent = "div"> = {
  as?: T
  class?: string | undefined
  children?: JSX.Element
} & Omit<ComponentProps<T>, "as" | "class" | "children">

const ButtonGroupText = <T extends ValidComponent = "div">(rawProps: ButtonGroupTextProps<T>) => {
  const props = merge({ as: "div" as T } as const, rawProps)
  const others = omit(props as ButtonGroupTextProps, "as", "class")
  return (
    <Polymorphic
      as={props.as}
      class={cn("cn-button-group-text flex items-center [&_svg]:pointer-events-none", props.class)}
      data-slot="button-group-text"
      {...others}
    />
  )
}

type ButtonGroupSeparatorProps = ComponentProps<typeof Separator>

const ButtonGroupSeparator = (props: ButtonGroupSeparatorProps) => {
  const mergedProps = merge({ orientation: "vertical" } as const, props)
  const others = omit(mergedProps, "class", "orientation")
  return (
    <Separator
      class={cn(
        "cn-button-group-separator relative self-stretch data-[orientation=horizontal]:mx-px data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto data-[orientation=horizontal]:w-auto",
        props.class
      )}
      data-slot="button-group-separator"
      orientation={props.orientation}
      {...others}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }
