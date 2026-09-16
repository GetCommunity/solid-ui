import { omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { cn } from "~/lib/utils"

type MessageGroupProps = ComponentProps<"div">

const MessageGroup = (props: MessageGroupProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-message-group flex min-w-0 flex-col", props.class)}
      data-slot="message-group"
      {...others}
    />
  )
}

type MessageProps = ComponentProps<"div"> & { align?: "start" | "end" }

const Message = (props: MessageProps) => {
  const others = omit(props, "align", "class")
  const align = () => props.align ?? "start"
  return (
    <div
      class={cn(
        "cn-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse",
        props.class
      )}
      data-align={align()}
      data-slot="message"
      {...others}
    />
  )
}

type MessageAvatarProps = ComponentProps<"div">

const MessageAvatar = (props: MessageAvatarProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "cn-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted",
        props.class
      )}
      data-slot="message-avatar"
      {...others}
    />
  )
}

type MessageContentProps = ComponentProps<"div">

const MessageContent = (props: MessageContentProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-message-content wrap-break-word flex w-full min-w-0 flex-col", props.class)}
      data-slot="message-content"
      {...others}
    />
  )
}

type MessageHeaderProps = ComponentProps<"div">

const MessageHeader = (props: MessageHeaderProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-message-header flex min-w-0 max-w-full items-center", props.class)}
      data-slot="message-header"
      {...others}
    />
  )
}

type MessageFooterProps = ComponentProps<"div">

const MessageFooter = (props: MessageFooterProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "cn-message-footer flex min-w-0 max-w-full items-center group-data-[align=end]/message:justify-end",
        props.class
      )}
      data-slot="message-footer"
      {...others}
    />
  )
}

export { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader }
