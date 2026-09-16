import { merge, omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { cn } from "~/lib/utils"

type CardProps = ComponentProps<"div"> & { size?: "default" | "sm" }

const Card = (props: CardProps) => {
  const mergedProps = merge({ size: "default" } as const, props)
  const others = omit(mergedProps, "class", "size")
  return (
    <div
      class={cn("group/card cn-card flex flex-col", props.class)}
      data-size={mergedProps.size}
      data-slot="card"
      {...others}
    />
  )
}

type CardHeaderProps = ComponentProps<"div">

const CardHeader = (props: CardHeaderProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "group/card-header @container/card-header cn-card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        props.class
      )}
      data-slot="card-header"
      {...others}
    />
  )
}

type CardTitleProps = ComponentProps<"div">

const CardTitle = (props: CardTitleProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-card-title z-font-heading", props.class)}
      data-slot="card-title"
      {...others}
    />
  )
}

type CardDescriptionProps = ComponentProps<"div">

const CardDescription = (props: CardDescriptionProps) => {
  const others = omit(props, "class")
  return (
    <div class={cn("cn-card-description", props.class)} data-slot="card-description" {...others} />
  )
}

type CardActionProps = ComponentProps<"div">

const CardAction = (props: CardActionProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        props.class
      )}
      data-slot="card-action"
      {...others}
    />
  )
}

type CardContentProps = ComponentProps<"div">

const CardContent = (props: CardContentProps) => {
  const others = omit(props, "class")
  return <div class={cn("cn-card-content", props.class)} data-slot="card-content" {...others} />
}

type CardFooterProps = ComponentProps<"div">

const CardFooter = (props: CardFooterProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-card-footer flex items-center", props.class)}
      data-slot="card-footer"
      {...others}
    />
  )
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
