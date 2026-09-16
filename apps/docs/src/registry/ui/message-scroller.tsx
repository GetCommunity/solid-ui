import {
  children,
  createContext,
  createEffect,
  merge,
  omit,
  onCleanup,
  onSettled,
  useContext
} from "solid-js"
import type { JSX } from "@solidjs/web"

import { ArrowDown } from "lucide-solid"

import { cn } from "~/lib/utils"
import {
  callEventHandler,
  createMessageScrollerController,
  DEFAULT_SCROLL_EDGE_THRESHOLD,
  DEFAULT_SCROLL_MARGIN,
  DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
  type MessageScrollerButtonProps,
  type MessageScrollerButtonRenderState,
  type MessageScrollerContentProps,
  type MessageScrollerContextValue,
  type MessageScrollerItemProps,
  type MessageScrollerProps,
  type MessageScrollerProviderProps,
  type MessageScrollerScrollable,
  type MessageScrollerViewportProps,
  type MessageScrollerVisibilityState,
  setElementRef,
  USER_SCROLL_KEYS
} from "~/registry/hooks/use-message-scroller"
import { Button, type ButtonProps } from "~/registry/ui/button"

const MessageScrollerContext = createContext<MessageScrollerContextValue>()

function useMessageScrollerContext() {
  const context = useContext(MessageScrollerContext)

  if (!context) {
    throw new Error("MessageScroller parts must be used within MessageScroller.")
  }

  return context
}

function useMessageScroller() {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScrollerContext()

  return { scrollToEnd, scrollToMessage, scrollToStart }
}

function useMessageScrollerScrollable(): MessageScrollerScrollable {
  const context = useMessageScrollerContext()

  return {
    get start() {
      return context.scrollable().start
    },
    get end() {
      return context.scrollable().end
    }
  }
}

function useMessageScrollerVisibility(): MessageScrollerVisibilityState {
  const context = useMessageScrollerContext()
  const unsubscribe = context.subscribeVisibility()

  onCleanup(unsubscribe)

  return {
    get currentAnchorId() {
      return context.visibility().currentAnchorId
    },
    get visibleMessageIds() {
      return context.visibility().visibleMessageIds
    }
  }
}

const MessageScrollerProvider = (rawProps: MessageScrollerProviderProps) => {
  const props = merge(
    {
      autoScroll: false,
      defaultScrollPosition: "end" as const,
      scrollEdgeThreshold: DEFAULT_SCROLL_EDGE_THRESHOLD,
      scrollMargin: DEFAULT_SCROLL_MARGIN,
      scrollPreviousItemPeek: DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK
    },
    rawProps
  )
  const context = createMessageScrollerController(props)

  return <MessageScrollerContext value={context}>{props.children}</MessageScrollerContext>
}

const MessageScroller = (props: MessageScrollerProps) => {
  const context = useMessageScrollerContext()
  const others = omit(props, "class", "ref")
  let rootElement: HTMLDivElement | undefined

  onCleanup(() => {
    if (rootElement) context.setRootElement(null)
  })

  return (
    <div
      class={cn(
        "cn-message-scroller group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        props.class
      )}
      data-slot="message-scroller"
      ref={(element) => {
        rootElement = element
        context.setRootElement(element)
        setElementRef(props.ref, element)
      }}
      {...others}
    />
  )
}

const MessageScrollerViewport = (rawProps: MessageScrollerViewportProps) => {
  const props = merge({ preserveScrollOnPrepend: true }, rawProps)
  const context = useMessageScrollerContext()
  const others = omit(
    props,
    "aria-label",
    "children",
    "class",
    "onKeyDown",
    "onScroll",
    "onTouchMove",
    "onWheel",
    "preserveScrollOnPrepend",
    "ref",
    "role",
    "tabindex"
  )
  let viewportElement: HTMLDivElement | undefined

  createEffect(
    () => context,
    (c) => c.setPreserveScrollOnPrepend(props.preserveScrollOnPrepend)
  )

  onSettled(() => {
    if (!viewportElement || typeof ResizeObserver === "undefined") return

    // Coalesce into rAF: handleResize mutates the spacer inside the observed
    // content, and resizing an observed element during delivery fires
    // "ResizeObserver loop completed with undelivered notifications".
    let frame = 0
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(context.handleResize)
    })
    observer.observe(viewportElement)

    onCleanup(() => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    })
  })

  onCleanup(() => {
    if (viewportElement) context.setViewportElement(null)
  })

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useAriaPropsSupportedByRole: the labelled native scroll viewport needs scroll-intent handlers and receives a region role by default
    <div
      aria-label={props["aria-label"] ?? "Messages"}
      class={cn(
        "cn-message-scroller-viewport scroll-fade-b scrollbar-thin scrollbar-gutter-stable data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content",
        props.class
      )}
      data-slot="message-scroller-viewport"
      onKeyDown={(event) => {
        if (USER_SCROLL_KEYS.has(event.key)) context.userScrollIntent()
        callEventHandler(props.onKeyDown, event)
      }}
      onScroll={(event) => {
        context.syncAfterScroll()
        callEventHandler(props.onScroll, event)
      }}
      onTouchMove={(event) => {
        context.userScrollIntent()
        callEventHandler(props.onTouchMove, event)
      }}
      onWheel={(event) => {
        context.userScrollIntent()
        callEventHandler(props.onWheel, event)
      }}
      ref={(element) => {
        viewportElement = element
        context.setViewportElement(element)
        setElementRef(props.ref, element)
      }}
      role={props.role ?? "region"}
      tabindex={props.tabindex ?? 0}
      {...others}
    >
      {props.children}
    </div>
  )
}

const MessageScrollerContent = (props: MessageScrollerContentProps) => {
  const context = useMessageScrollerContext()
  const others = omit(props, "aria-relevant", "children", "class", "ref", "role", "spacerClassName")
  let contentElement: HTMLDivElement | undefined
  let spacerElement: HTMLDivElement | undefined

  onSettled(() => {
    if (!contentElement) return

    context.handleContentChange()

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(context.handleContentChange)
    mutationObserver?.observe(contentElement, { childList: true })

    // Coalesce into rAF: handleResize mutates the spacer inside this observed
    // element, and resizing an observed element during delivery fires
    // "ResizeObserver loop completed with undelivered notifications".
    let frame = 0
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(context.handleResize)
          })
    resizeObserver?.observe(contentElement)

    onCleanup(() => {
      window.cancelAnimationFrame(frame)
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
    })
  })

  onCleanup(() => {
    if (contentElement) context.setContentElement(null)
    if (spacerElement) context.setSpacerElement(null)
  })

  return (
    <div
      aria-relevant={props["aria-relevant"] ?? "additions"}
      class={cn("cn-message-scroller-content flex h-max min-h-full flex-col", props.class)}
      data-slot="message-scroller-content"
      ref={(element) => {
        contentElement = element
        context.setContentElement(element)
        setElementRef(props.ref, element)
      }}
      role={props.role ?? "log"}
      {...others}
    >
      {props.children}
      <div
        aria-hidden="true"
        class={props.spacerClassName}
        data-message-scroller-spacer=""
        hidden
        ref={(element) => {
          spacerElement = element
          context.setSpacerElement(element)
        }}
      />
    </div>
  )
}

const MessageScrollerItem = (rawProps: MessageScrollerItemProps) => {
  const props = merge({ scrollAnchor: false }, rawProps)
  const context = useMessageScrollerContext()
  const others = omit(props, "class", "messageId", "ref", "scrollAnchor")
  let itemElement: HTMLDivElement | undefined

  createEffect(() => {
    const messageId = props.messageId
    if (!messageId || !itemElement) return

    context.registerMessage(messageId, itemElement)
    onCleanup(() => context.registerMessage(messageId, null, itemElement))
  })

  return (
    <div
      class={cn(
        "cn-message-scroller-item min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        props.class
      )}
      data-message-id={props.messageId}
      data-scroll-anchor={props.scrollAnchor ? "true" : "false"}
      data-slot="message-scroller-item"
      ref={(element) => {
        itemElement = element
        setElementRef(props.ref, element)
      }}
      {...others}
    />
  )
}

const MessageScrollerButton = (rawProps: MessageScrollerButtonProps) => {
  const props = merge(
    {
      behavior: "smooth" as const,
      direction: "end" as const,
      size: "icon-sm" as const,
      type: "button" as const,
      variant: "secondary" as const
    },
    rawProps
  )
  const context = useMessageScrollerContext()
  const others = omit(
    props,
    "behavior",
    "children",
    "class",
    "direction",
    "inert",
    "onClick",
    "render",
    "size",
    "tabindex",
    "type",
    "variant"
  )
  const isActive = () => {
    const state = context.scrollable()
    return props.direction === "start" ? state.start : state.end
  }
  const resolvedChildren = children(() => props.children)
  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (!isActive()) return

    callEventHandler(props.onClick, event)
    if (event.defaultPrevented) return

    event.currentTarget.blur()
    if (props.direction === "start") context.scrollToStart({ behavior: props.behavior })
    else context.scrollToEnd({ behavior: props.behavior })
  }
  const buttonClass = () =>
    cn(
      "cn-message-scroller-button -translate-x-1/2 data-[direction=start]:data-[active=false]:-translate-y-full absolute inset-s-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[direction=end]:data-[active=false]:translate-y-full data-[active=false]:pointer-events-none data-[direction=start]:top-4 data-[direction=end]:right-4 data-[direction=end]:bottom-4 data-[active=true]:translate-y-0 data-[active=false]:scale-95 data-[active=true]:scale-100 data-[active=false]:opacity-0 data-[active=true]:opacity-100 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
      props.class
    )
  const defaultChildren = () =>
    resolvedChildren() ?? (
      <>
        <ArrowDown />
        <span class="sr-only">
          {props.direction === "end" ? "Scroll to end" : "Scroll to start"}
        </span>
      </>
    )
  // Reactive props handed to the render function; the upstream useRender
  // stateAttributesMapping collapses to literal data-active/data-direction.
  const renderProps = merge(others, {
    get class() {
      return buttonClass()
    },
    get children() {
      return defaultChildren()
    },
    get "data-active"() {
      return isActive() ? "true" : "false"
    },
    get "data-direction"() {
      return props.direction
    },
    get "data-size"() {
      return props.size
    },
    "data-slot": "message-scroller-button",
    get "data-variant"() {
      return props.variant
    },
    get inert() {
      return props.inert ?? !isActive()
    },
    onClick: handleClick,
    get size() {
      return props.size
    },
    get tabindex() {
      return isActive() ? props.tabindex : -1
    },
    get type() {
      return props.type
    },
    get variant() {
      return props.variant
    }
  }) as ButtonProps
  const renderState: MessageScrollerButtonRenderState = {
    get active() {
      return isActive()
    },
    get direction() {
      return props.direction
    }
  }

  if (props.render) return <>{props.render(renderProps, renderState)}</>

  return (
    <Button
      {...others}
      class={buttonClass()}
      data-active={isActive() ? "true" : "false"}
      data-direction={props.direction}
      data-size={props.size}
      data-slot="message-scroller-button"
      data-variant={props.variant}
      inert={props.inert ?? !isActive()}
      onClick={handleClick}
      size={props.size}
      tabindex={isActive() ? props.tabindex : -1}
      type={props.type}
      variant={props.variant}
    >
      {defaultChildren()}
    </Button>
  )
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility
}
