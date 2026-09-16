import { omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { cn } from "~/lib/utils"

type TextareaProps = ComponentProps<"textarea">

const Textarea = (props: TextareaProps) => {
  const others = omit(props, "class")
  return (
    <textarea
      class={cn(
        "cn-textarea field-sizing-content flex min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      data-slot="textarea"
      {...others}
    />
  )
}

export { Textarea, type TextareaProps }
