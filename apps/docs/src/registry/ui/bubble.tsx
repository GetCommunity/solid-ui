import { merge, omit } from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import { Polymorphic } from "@kobalte/core/polymorphic"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

type BubbleGroupProps = ComponentProps<"div">

const BubbleGroup = (props: BubbleGroupProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-bubble-group flex min-w-0 flex-col", props.class)}
      data-slot="bubble-group"
      {...others}
    />
  )
}

const bubbleVariants = cva("cn-bubble group/bubble relative flex w-fit min-w-0 flex-col", {
  variants: {
    variant: {
      default: "cn-bubble-variant-default",
      secondary: "cn-bubble-variant-secondary",
      muted: "cn-bubble-variant-muted",
      tinted: "cn-bubble-variant-tinted",
      outline: "cn-bubble-variant-outline",
      ghost: "cn-bubble-variant-ghost",
      destructive: "cn-bubble-variant-destructive"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type BubbleProps = ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }

const Bubble = (rawProps: BubbleProps) => {
  const props = merge({ align: "start" as const, variant: "default" as const }, rawProps)
  const others = omit(props, "align", "class", "variant")
  return (
    <div
      class={cn(bubbleVariants({ variant: props.variant }), props.class)}
      data-align={props.align}
      data-slot="bubble"
      data-variant={props.variant}
      {...others}
    />
  )
}

type BubbleContentProps<T extends ValidComponent = "div"> = {
  as?: T
  class?: string | undefined
  children?: JSX.Element
} & Omit<ComponentProps<T>, "as" | "class" | "children">

const BubbleContent = <T extends ValidComponent = "div">(rawProps: BubbleContentProps<T>) => {
  const props = merge({ as: "div" as T } as const, rawProps)
  const others = omit(props as BubbleContentProps, "as", "class")
  return (
    <Polymorphic
      as={props.as}
      class={cn(
        "cn-bubble-content wrap-break-word w-fit min-w-0 max-w-full overflow-hidden [button,a]:transition-colors [button]:text-left",
        props.class
      )}
      data-slot="bubble-content"
      {...others}
    />
  )
}

const bubbleReactionsVariants = cva(
  "cn-bubble-reactions absolute z-10 flex w-fit items-center justify-center",
  {
    variants: {
      side: {
        top: "cn-bubble-reactions-side-top",
        bottom: "cn-bubble-reactions-side-bottom"
      },
      align: {
        start: "cn-bubble-reactions-align-start",
        end: "cn-bubble-reactions-align-end"
      }
    },
    defaultVariants: {
      side: "bottom",
      align: "end"
    }
  }
)

type BubbleReactionsProps = ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}

const BubbleReactions = (rawProps: BubbleReactionsProps) => {
  const props = merge({ align: "end" as const, side: "bottom" as const }, rawProps)
  const others = omit(props, "align", "class", "side")
  return (
    <div
      class={cn(bubbleReactionsVariants({ align: props.align, side: props.side }), props.class)}
      data-align={props.align}
      data-side={props.side}
      data-slot="bubble-reactions"
      {...others}
    />
  )
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions }
