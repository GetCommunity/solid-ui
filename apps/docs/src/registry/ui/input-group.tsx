import { merge, omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import { Button, type ButtonProps } from "~/registry/ui/button"
import { Input, type InputProps } from "~/registry/ui/input"
import { Textarea } from "~/registry/ui/textarea"

type InputGroupProps = ComponentProps<"div">

const InputGroup = (props: InputGroupProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
        props.class
      )}
      data-slot="input-group"
      role="group"
      {...others}
    />
  )
}

const inputGroupAddonVariants = cva(
  "cn-input-group-addon flex cursor-text select-none items-center justify-center",
  {
    variants: {
      align: {
        "inline-start": "cn-input-group-addon-align-inline-start order-first",
        "inline-end": "cn-input-group-addon-align-inline-end order-last",
        "block-start": "cn-input-group-addon-align-block-start order-first w-full justify-start",
        "block-end": "cn-input-group-addon-align-block-end order-last w-full justify-start"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
)

type InputGroupAddonProps = ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>

const InputGroupAddon = (rawProps: InputGroupAddonProps) => {
  const props = merge({ align: "inline-start" } as const, rawProps)
  const others = omit(props, "class", "align")

  return (
    <div
      class={cn(inputGroupAddonVariants({ align: props.align }), props.class)}
      data-align={props.align}
      data-slot="input-group-addon"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) {
          return
        }
        event.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      role="group"
      {...others}
    />
  )
}

const inputGroupButtonVariants = cva("cn-input-group-button flex items-center shadow-none", {
  variants: {
    size: {
      xs: "cn-input-group-button-size-xs",
      sm: "cn-input-group-button-size-sm",
      "icon-xs": "cn-input-group-button-size-icon-xs",
      "icon-sm": "cn-input-group-button-size-icon-sm"
    }
  },
  defaultVariants: {
    size: "xs"
  }
})

type InputGroupButtonProps = Omit<ButtonProps, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }

const InputGroupButton = (rawProps: InputGroupButtonProps) => {
  const props = merge({ type: "button", variant: "ghost", size: "xs" } as const, rawProps)
  const others = omit(props, "class", "type", "variant", "size")

  return (
    <Button
      class={cn(inputGroupButtonVariants({ size: props.size }), props.class)}
      data-size={props.size}
      type={props.type}
      variant={props.variant}
      {...others}
    />
  )
}

type InputGroupTextProps = ComponentProps<"span">

const InputGroupText = (props: InputGroupTextProps) => {
  const others = omit(props, "class")
  return (
    <span
      class={cn("cn-input-group-text flex items-center [&_svg]:pointer-events-none", props.class)}
      {...others}
    />
  )
}

type InputGroupInputProps = InputProps

const InputGroupInput = (props: InputGroupInputProps) => {
  const others = omit(props, "class")
  return (
    <Input
      class={cn("cn-input-group-input flex-1", props.class)}
      data-slot="input-group-control"
      {...others}
    />
  )
}

type InputGroupTextareaProps = ComponentProps<"textarea">

const InputGroupTextarea = (props: InputGroupTextareaProps) => {
  const others = omit(props, "class")
  return (
    <Textarea
      class={cn("cn-input-group-textarea flex-1 resize-none", props.class)}
      data-slot="input-group-control"
      {...others}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
}
