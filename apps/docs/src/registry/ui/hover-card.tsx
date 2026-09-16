import { merge, omit } from "solid-js"
import type { ComponentProps, ValidComponent } from "@solidjs/web"

import * as HoverCardPrimitive from "@kobalte/core/hover-card"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"

import { cn } from "~/lib/utils"

const HoverCard = (props: HoverCardPrimitive.HoverCardRootProps) => {
  const mergedProps = merge({ gutter: 4 }, props)
  return <HoverCardPrimitive.Root data-slot="hover-card" {...mergedProps} />
}

type HoverCardTriggerProps<T extends ValidComponent = "a"> = PolymorphicProps<
  T,
  HoverCardPrimitive.HoverCardTriggerProps<T>
>

const HoverCardTrigger = <T extends ValidComponent = "a">(props: HoverCardTriggerProps<T>) => (
  <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
)

type HoverCardContentProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  HoverCardPrimitive.HoverCardContentProps<T>
> &
  Pick<ComponentProps<T>, "class" | "children">

const HoverCardContent = <T extends ValidComponent = "div">(props: HoverCardContentProps<T>) => {
  const others = omit(props as HoverCardContentProps, "class", "children")
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        class={cn(
          "cn-hover-card-content z-50 origin-(--kb-hovercard-content-transform-origin) outline-hidden",
          props.class
        )}
        data-slot="hover-card-content"
        {...others}
      >
        {props.children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
