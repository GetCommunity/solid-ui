import { omit } from "solid-js"
import type { ValidComponent } from "@solidjs/web"

import * as CollapsiblePrimitive from "@kobalte/core/collapsible"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"

import { cn } from "~/lib/utils"

type CollapsibleProps<T extends ValidComponent = "div"> =
  CollapsiblePrimitive.CollapsibleRootProps<T> & {
    class?: string | undefined
  }

const Collapsible = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsibleProps<T>>
) => {
  const others = omit(props as CollapsibleProps, "class")
  return (
    <CollapsiblePrimitive.Root
      class={cn("cn-collapsible", props.class)}
      data-slot="collapsible"
      {...others}
    />
  )
}

type CollapsibleTriggerProps<T extends ValidComponent = "button"> =
  CollapsiblePrimitive.CollapsibleTriggerProps<T> & {
    class?: string | undefined
  }

const CollapsibleTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CollapsibleTriggerProps<T>>
) => {
  const others = omit(props as CollapsibleTriggerProps, "class")
  return (
    <CollapsiblePrimitive.Trigger
      class={cn("cn-collapsible-trigger", props.class)}
      data-slot="collapsible-trigger"
      {...others}
    />
  )
}

type CollapsibleContentProps<T extends ValidComponent = "div"> =
  CollapsiblePrimitive.CollapsibleContentProps<T> & {
    class?: string | undefined
  }

const CollapsibleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsibleContentProps<T>>
) => {
  const others = omit(props as CollapsibleContentProps, "class")
  return (
    <CollapsiblePrimitive.Content
      class={cn("cn-collapsible-content", props.class)}
      data-slot="collapsible-content"
      {...others}
    />
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
