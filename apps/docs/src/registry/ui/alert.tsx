import { omit } from "solid-js"
import type { ComponentProps, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const alertVariants = cva("cn-alert group/alert relative w-full", {
  variants: {
    variant: {
      default: "cn-alert-variant-default",
      destructive: "cn-alert-variant-destructive"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type AlertProps<T extends ValidComponent = "div"> = ComponentProps<T> &
  VariantProps<typeof alertVariants> & {
    class?: string | undefined
  }

const Alert = <T extends ValidComponent = "div">(props: PolymorphicProps<T, AlertProps<T>>) => {
  const others = omit(props as AlertProps, "class", "variant")
  return (
    <div
      class={cn(alertVariants({ variant: props.variant }), props.class)}
      data-slot="alert"
      role="alert"
      {...others}
    />
  )
}

type AlertTitleProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined
}

const AlertTitle = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertTitleProps<T>>
) => {
  const others = omit(props as AlertTitleProps, "class")
  return (
    <div
      class={cn(
        "cn-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        props.class
      )}
      data-slot="alert-title"
      {...others}
    />
  )
}

type AlertDescriptionProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined
}

const AlertDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDescriptionProps<T>>
) => {
  const others = omit(props as AlertDescriptionProps, "class")
  return (
    <div
      class={cn(
        "cn-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        props.class
      )}
      data-slot="alert-description"
      {...others}
    />
  )
}

type AlertActionProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined
}

const AlertAction = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertActionProps<T>>
) => {
  const others = omit(props as AlertActionProps, "class")
  return <div class={cn("cn-alert-action", props.class)} data-slot="alert-action" {...others} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants }
