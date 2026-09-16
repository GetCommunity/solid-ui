import { omit } from "solid-js"
import type { JSX, ValidComponent } from "@solidjs/web"

import * as AccordionPrimitive from "@kobalte/core/accordion"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"

import { IconPlaceholder } from "~/components/icon-placeholder"
import { cn } from "~/lib/utils"

type AccordionProps<T extends ValidComponent = "div"> = AccordionPrimitive.AccordionRootProps<T> & {
  class?: string | undefined
}

const Accordion = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionProps<T>>
) => {
  const others = omit(props as AccordionProps, "class")
  return (
    <AccordionPrimitive.Root
      class={cn("cn-accordion flex w-full flex-col", props.class)}
      data-slot="accordion"
      {...others}
    />
  )
}

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  class?: string | undefined
  children?: JSX.Element
}

const AccordionItem = (props: AccordionItemProps) => {
  const others = omit(props as AccordionItemProps, "class")
  return (
    <AccordionPrimitive.Item
      class={cn("cn-accordion-item", props.class)}
      data-slot="accordion-item"
      {...others}
    />
  )
}

type AccordionTriggerProps<T extends ValidComponent = "button"> =
  AccordionPrimitive.AccordionTriggerProps<T> & {
    class?: string | undefined
    children?: JSX.Element | undefined
  }

const AccordionTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AccordionTriggerProps<T>>
) => {
  const others = omit(props as AccordionTriggerProps, "class", "children")
  return (
    <AccordionPrimitive.Header class="flex" data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        class={cn(
          "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
          props.class
        )}
        data-slot="accordion-trigger"
        {...others}
      >
        {props.children}
        <IconPlaceholder
          class="cn-accordion-trigger-icon pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
          data-slot="accordion-trigger-icon"
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
        />
        <IconPlaceholder
          class="cn-accordion-trigger-icon pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
          data-slot="accordion-trigger-icon"
          lucide="ChevronUpIcon"
          tabler="IconChevronUp"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

type AccordionContentProps<T extends ValidComponent = "div"> =
  AccordionPrimitive.AccordionContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element | undefined
  }

const AccordionContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionContentProps<T>>
) => {
  const others = omit(props as AccordionContentProps, "class", "children")
  return (
    <AccordionPrimitive.Content
      class="cn-accordion-content overflow-hidden"
      data-slot="accordion-content"
      {...others}
    >
      <div
        class={cn(
          "cn-accordion-content-inner h-(--kb-collapsible-content-height) [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          props.class
        )}
        data-slot="accordion-content-inner"
      >
        {props.children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
