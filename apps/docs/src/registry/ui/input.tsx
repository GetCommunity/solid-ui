import { createUniqueId, omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { cn } from "~/lib/utils"

type InputProps = ComponentProps<"input"> & {
  defaultValue?: ComponentProps<"input">["value"]
}

const Input = (props: InputProps) => {
  const others = omit(props, "class", "defaultValue", "disabled", "id", "type", "value")
  const generatedId = `base-ui-${createUniqueId()}`

  return (
    <input
      class={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      data-disabled={props.disabled ? "" : undefined}
      data-slot="input"
      disabled={props.disabled}
      id={props.id ?? generatedId}
      type={props.type}
      value={props.value ?? props.defaultValue}
      {...others}
    />
  )
}

export { Input, type InputProps }
