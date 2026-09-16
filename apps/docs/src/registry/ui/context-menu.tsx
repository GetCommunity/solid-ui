import { type Component, merge, omit } from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import * as ContextMenuPrimitive from "@kobalte/core/context-menu"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Check, CheckIcon, ChevronRight } from "lucide-solid"

import { cn } from "~/lib/utils"

const ContextMenu: Component<ContextMenuPrimitive.ContextMenuRootProps> = (props) => {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

const ContextMenuPortal: Component<ContextMenuPrimitive.ContextMenuPortalProps> = (props) => (
  <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
)

type ContextMenuTriggerProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuTriggerProps<T> & {
    class?: string | undefined
  }

const ContextMenuTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuTriggerProps<T>>
) => {
  const others = omit(props as ContextMenuTriggerProps, "class")
  return (
    <ContextMenuPrimitive.Trigger
      class={cn("cn-context-menu-trigger select-none", props.class)}
      data-slot="context-menu-trigger"
      {...others}
    />
  )
}

type ContextMenuContentProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuContentProps<T> & {
    class?: string | undefined
  }

const ContextMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuContentProps<T>>
) => {
  const others = omit(props as ContextMenuContentProps, "class")
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        class={cn(
          "cn-context-menu-content cn-menu-target z-50 max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) overflow-y-auto overflow-x-hidden",
          props.class
        )}
        data-slot="context-menu-content"
        {...others}
      />
    </ContextMenuPrimitive.Portal>
  )
}

const ContextMenuGroup: Component<ContextMenuPrimitive.ContextMenuGroupProps> = (props) => (
  <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
)

type ContextMenuItemProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuItemProps<T> & {
    class?: string | undefined
    variant?: "default" | "destructive"
  }

const ContextMenuItem = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, ContextMenuItemProps<T>>
) => {
  const props = merge({ variant: "default" }, rawProps)
  const others = omit(props as ContextMenuItemProps, "class", "variant")
  return (
    <ContextMenuPrimitive.Item
      class={cn(
        "cn-context-menu-item group/context-menu-item relative flex cursor-default select-none items-center outline-hidden data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        props.class
      )}
      data-slot="context-menu-item"
      data-variant={props.variant}
      {...others}
    />
  )
}

const ContextMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class")
  return (
    <span
      class={cn("cn-context-menu-shortcut", props.class)}
      data-slot="context-menu-shortcut"
      {...others}
    />
  )
}

const ContextMenuLabel: Component<ComponentProps<"div"> & { inset?: boolean }> = (props) => {
  const others = omit(props, "class", "inset")
  return (
    <div
      class={cn("cn-context-menu-label data-[inset]:pl-8", props.class)}
      data-inset={props.inset}
      data-slot="context-menu-label"
      {...others}
    />
  )
}

type ContextMenuSeparatorProps<T extends ValidComponent = "hr"> =
  ContextMenuPrimitive.ContextMenuSeparatorProps<T> & {
    class?: string | undefined
  }

const ContextMenuSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, ContextMenuSeparatorProps<T>>
) => {
  const others = omit(props as ContextMenuSeparatorProps, "class")
  return (
    <ContextMenuPrimitive.Separator
      class={cn("cn-context-menu-separator", props.class)}
      data-slot="context-menu-separator"
      {...others}
    />
  )
}

const ContextMenuSub: Component<ContextMenuPrimitive.ContextMenuSubProps> = (props) => (
  <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
)

type ContextMenuSubTriggerProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuSubTriggerProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

const ContextMenuSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuSubTriggerProps<T>>
) => {
  const others = omit(props as ContextMenuSubTriggerProps, "class", "children")
  return (
    <ContextMenuPrimitive.SubTrigger
      class={cn(
        "cn-context-menu-sub-trigger flex cursor-default select-none items-center justify-between outline-hidden data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        props.class
      )}
      data-slot="context-menu-sub-trigger"
      {...others}
    >
      {props.children}
      <ChevronRight />
    </ContextMenuPrimitive.SubTrigger>
  )
}

type ContextMenuSubContentProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuSubContentProps<T> & {
    class?: string | undefined
  }

const ContextMenuSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuSubContentProps<T>>
) => {
  const others = omit(props as ContextMenuSubContentProps, "class")
  return (
    <ContextMenuPrimitive.SubContent
      class={cn(
        "cn-context-menu-sub-content cn-menu-target z-50 origin-(--radix-context-menu-content-transform-origin) overflow-hidden",
        props.class
      )}
      data-slot="context-menu-sub-content"
      {...others}
    />
  )
}

type ContextMenuCheckboxItemProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuCheckboxItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

const ContextMenuCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuCheckboxItemProps<T>>
) => {
  const others = omit(props as ContextMenuCheckboxItemProps, "class", "children")
  return (
    <ContextMenuPrimitive.CheckboxItem
      class={cn(
        "cn-context-menu-checkbox-item relative flex cursor-default select-none items-center outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        props.class
      )}
      data-slot="context-menu-checkbox-item"
      {...others}
    >
      <span class="cn-context-menu-item-indicator pointer-events-none">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

type ContextMenuGroupLabelProps<T extends ValidComponent = "span"> =
  ContextMenuPrimitive.ContextMenuGroupLabelProps<T> & {
    class?: string | undefined
  }

const ContextMenuGroupLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, ContextMenuGroupLabelProps<T>>
) => {
  const others = omit(props as ContextMenuGroupLabelProps, "class")
  return (
    <ContextMenuPrimitive.GroupLabel
      class={cn("px-2 py-1.5 font-semibold text-sm", props.class)}
      data-slot="context-menu-group-label"
      {...others}
    />
  )
}

type ContextMenuRadioGroupProps<
  T extends ValidComponent = "div",
  TValue = string
> = ContextMenuPrimitive.ContextMenuRadioGroupProps<T, TValue>

const ContextMenuRadioGroup = <T extends ValidComponent = "div", TValue = string>(
  props: PolymorphicProps<T, ContextMenuRadioGroupProps<T, TValue>>
) => <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />

type ContextMenuRadioItemProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuRadioItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

const ContextMenuRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuRadioItemProps<T>>
) => {
  const others = omit(props as ContextMenuRadioItemProps, "class", "children")
  return (
    <ContextMenuPrimitive.RadioItem
      class={cn(
        "cn-context-menu-radio-item relative flex cursor-default select-none items-center outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        props.class
      )}
      data-slot="context-menu-radio-item"
      {...others}
    >
      <span class="cn-context-menu-item-indicator pointer-events-none">
        <ContextMenuPrimitive.ItemIndicator>
          <Check />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </ContextMenuPrimitive.RadioItem>
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
}
