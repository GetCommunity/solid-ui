import type { Accessor, Component } from "solid-js"
import {
  createContext,
  createMemo,
  createSignal,
  createUniqueId,
  Match,
  merge,
  omit,
  onCleanup,
  onSettled,
  Show,
  Switch,
  useContext
} from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Polymorphic } from "@kobalte/core/polymorphic"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-solid"

import { cn } from "~/lib/utils"
import { useIsMobile } from "~/registry/hooks/use-mobile"
import type { ButtonProps } from "~/registry/ui/button"
import { Button } from "~/registry/ui/button"
import { Input } from "~/registry/ui/input"
import { Separator } from "~/registry/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/registry/ui/sheet"
import { Skeleton } from "~/registry/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  TooltipTrigger
} from "~/registry/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: Accessor<"expanded" | "collapsed">
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
  openMobile: Accessor<boolean>
  setOpenMobile: (open: boolean) => void
  isMobile: Accessor<boolean>
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

type SidebarProviderProps = ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarProvider = (props: SidebarProviderProps) => {
  const mergedProps = merge({ defaultOpen: true }, props)
  const others = omit(
    mergedProps,
    "defaultOpen",
    "open",
    "onOpenChange",
    "class",
    "style",
    "children"
  )

  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = createSignal(false)

  // This is the internal state of the sidebar.
  // We use open and onOpenChange for control from outside the component.
  const [_open, _setOpen] = createSignal(mergedProps.defaultOpen)
  const open = () => props.open ?? _open()
  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open()) : value

    if (props.onOpenChange) {
      props.onOpenChange(openState)
    } else {
      _setOpen(openState)
    }

    // This sets the cookie to keep the sidebar state.
    // biome-ignore lint/suspicious/noDocumentCookie: <waiting for better solution>
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }

  // Helper to toggle the sidebar.
  const toggleSidebar = () => {
    return isMobile() ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }

  // Adds a keyboard shortcut to toggle the sidebar.
  onSettled(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown))
  })

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = () => (open() ? "expanded" : "collapsed")

  const contextValue = {
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }

  return (
    <SidebarContext value={contextValue}>
      <div
        class={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          props.class
        )}
        data-slot="sidebar-wrapper"
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...(props.style as JSX.CSSProperties)
        }}
        {...others}
      >
        {props.children}
      </div>
    </SidebarContext>
  )
}

type SidebarProps = ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}

const Sidebar: Component<SidebarProps> = (props) => {
  const mergedProps = merge<SidebarProps[]>(
    {
      side: "left",
      variant: "sidebar",
      collapsible: "offcanvas"
    },
    props
  )
  const others = omit(mergedProps, "side", "variant", "collapsible", "class", "children")

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  return (
    <Switch>
      <Match when={mergedProps.collapsible === "none"}>
        <div
          class={cn(
            "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
            props.class
          )}
          data-slot="sidebar"
          {...others}
        >
          {props.children}
        </div>
      </Match>
      <Match when={isMobile()}>
        <Sheet onOpenChange={setOpenMobile} open={openMobile()} {...others}>
          <SheetContent
            class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            data-mobile="true"
            data-sidebar="sidebar"
            data-slot="sidebar"
            side={mergedProps.side}
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE
            }}
          >
            <SheetHeader class="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div class="flex size-full flex-col">{props.children}</div>
          </SheetContent>
        </Sheet>
      </Match>
      <Match when={!isMobile()}>
        <div
          class="group peer hidden text-sidebar-foreground md:block"
          data-collapsible={state() === "collapsed" ? mergedProps.collapsible : ""}
          data-side={mergedProps.side}
          data-slot="sidebar"
          data-state={state()}
          data-variant={mergedProps.variant}
        >
          {/* This is what handles the sidebar gap on desktop */}
          <div
            class={cn(
              "cn-sidebar-gap relative w-(--sidebar-width) bg-transparent",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              mergedProps.variant === "floating" || mergedProps.variant === "inset"
                ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )}
            data-slot="sidebar-gap"
          />
          <div
            class={cn(
              "data-[side=right]:group-data-[collapsible=offcanvas]:-right-(--sidebar-width) data-[side=left]:group-data-[collapsible=offcanvas]:-left-(--sidebar-width) fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=right]:right-0 data-[side=left]:left-0 md:flex",
              // Adjust the padding for floating and inset variants.
              mergedProps.variant === "floating" || mergedProps.variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              props.class
            )}
            data-side={mergedProps.side}
            data-slot="sidebar-container"
            {...others}
          >
            <div
              class="cn-sidebar-inner flex size-full flex-col"
              data-sidebar="sidebar"
              data-slot="sidebar-inner"
            >
              {props.children}
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  )
}

type SidebarTriggerProps = ButtonProps

const SidebarTrigger = (props: SidebarTriggerProps) => {
  const others = omit(props, "class", "onClick")
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      class={cn("cn-sidebar-trigger", props.class)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
        const handler = props.onClick as
          | JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
          | undefined
        if (typeof handler === "function") handler(event)
        else handler?.[0](handler[1], event)
        toggleSidebar()
      }}
      size="icon-sm"
      variant="ghost"
      {...others}
    >
      <PanelLeft />
      <span class="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

const SidebarRail = (props: ComponentProps<"button">) => {
  const others = omit(props, "class")
  const { toggleSidebar } = useSidebar()

  return (
    <button
      aria-label="Toggle Sidebar"
      class={cn(
        "cn-sidebar-rail -translate-x-1/2 group-data-[side=left]:-right-4 absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 group-data-[side=right]:left-0 sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        props.class
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabindex={-1}
      title="Toggle Sidebar"
      {...others}
    />
  )
}

const SidebarInset = (props: ComponentProps<"main">) => {
  const others = omit(props, "class")
  return (
    <main
      class={cn("cn-sidebar-inset relative flex w-full flex-1 flex-col", props.class)}
      data-slot="sidebar-inset"
      {...others}
    />
  )
}

const SidebarInput = (props: ComponentProps<typeof Input>) => {
  const others = omit(props, "class")
  return (
    <Input
      class={cn("cn-sidebar-input", props.class)}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...others}
    />
  )
}

const SidebarHeader = (props: ComponentProps<"div">) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-sidebar-header flex flex-col", props.class)}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...others}
    />
  )
}

const SidebarFooter = (props: ComponentProps<"div">) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-sidebar-footer flex flex-col", props.class)}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...others}
    />
  )
}

type SidebarSeparatorProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  ComponentProps<typeof Separator<T>>
>

const SidebarSeparator = <T extends ValidComponent = "div">(props: SidebarSeparatorProps<T>) => {
  const others = omit(props as SidebarSeparatorProps, "class")
  return (
    <Separator
      class={cn("cn-sidebar-separator w-auto", props.class)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...others}
    />
  )
}

const SidebarContent = (props: ComponentProps<"div">) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "cn-sidebar-content flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        props.class
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...others}
    />
  )
}

const SidebarGroup = (props: ComponentProps<"div">) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-sidebar-group relative flex w-full min-w-0 flex-col", props.class)}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...others}
    />
  )
}

type SidebarGroupLabelProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  ComponentProps<T>
>

const SidebarGroupLabel = <T extends ValidComponent = "div">(props: SidebarGroupLabelProps<T>) => {
  const others = omit(props as SidebarGroupLabelProps, "class")

  return (
    <Polymorphic<SidebarGroupLabelProps>
      as="div"
      class={cn(
        "cn-sidebar-group-label flex shrink-0 items-center outline-hidden [&>svg]:shrink-0",
        props.class
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...others}
    />
  )
}

type SidebarGroupActionProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  ComponentProps<T>
>

const SidebarGroupAction = <T extends ValidComponent = "button">(
  props: SidebarGroupActionProps<T>
) => {
  const others = omit(props as SidebarGroupActionProps, "class")
  return (
    <Polymorphic<SidebarGroupActionProps>
      as="button"
      class={cn(
        "cn-sidebar-group-action after:-inset-2 flex aspect-square items-center justify-center outline-hidden transition-transform after:absolute group-data-[collapsible=icon]:hidden md:after:hidden [&>svg]:shrink-0",
        props.class
      )}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      {...others}
    />
  )
}

const SidebarGroupContent = (props: ComponentProps<"div">) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-sidebar-group-content w-full", props.class)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...others}
    />
  )
}

const SidebarMenu = (props: ComponentProps<"ul">) => {
  const others = omit(props, "class")
  return (
    <ul
      class={cn("cn-sidebar-menu flex w-full min-w-0 flex-col", props.class)}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...others}
    />
  )
}

const SidebarMenuItem = (props: ComponentProps<"li">) => {
  const others = omit(props, "class")
  return (
    <li
      class={cn("group/menu-item relative", props.class)}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...others}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button cn-sidebar-menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-sidebar-menu-button-variant-default",
        outline: "cn-sidebar-menu-button-variant-outline"
      },
      size: {
        default: "cn-sidebar-menu-button-size-default",
        sm: "cn-sidebar-menu-button-size-sm",
        lg: "cn-sidebar-menu-button-size-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

type SidebarMenuButtonProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  Pick<ComponentProps<T>, "class" | "children">
> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    isActive?: boolean
    tooltip?: string | TooltipContentProps
  }

const SidebarMenuButton = <T extends ValidComponent = "button">(
  rawProps: SidebarMenuButtonProps<T>
) => {
  const props = merge({ isActive: false, variant: "default", size: "default" }, rawProps)
  const others = omit(
    props as SidebarMenuButtonProps,
    "isActive",
    "tooltip",
    "variant",
    "size",
    "class"
  )
  const { isMobile, state } = useSidebar()
  const tooltipProps = () =>
    typeof props.tooltip === "string"
      ? ({ children: props.tooltip } satisfies TooltipContentProps)
      : (props.tooltip ?? {})

  const MenuButton = (props: SidebarMenuButtonProps) => {
    const _others = omit(props as SidebarMenuButtonProps, "class")
    return (
      <Polymorphic<SidebarMenuButtonProps>
        as="button"
        class={cn(
          sidebarMenuButtonVariants({ variant: props.variant, size: props.size }),
          rawProps.class,
          props.class
        )}
        data-active={props.isActive ? "true" : undefined}
        data-sidebar="menu-button"
        data-size={props.size}
        data-slot="sidebar-menu-button"
        {..._others}
        {...others}
      />
    )
  }

  return (
    <Show fallback={<MenuButton />} when={props.tooltip}>
      <Tooltip placement="right">
        <TooltipTrigger as={MenuButton} class="w-full" />
        <TooltipContent
          align="center"
          hidden={state() !== "collapsed" || isMobile()}
          side="right"
          {...tooltipProps()}
        />
      </Tooltip>
    </Show>
  )
}

type SidebarMenuActionProps<T extends ValidComponent = "button"> = ComponentProps<T> & {
  showOnHover?: boolean
}

const SidebarMenuAction = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, SidebarMenuActionProps<T>>
) => {
  const props = merge({ showOnHover: false }, rawProps)
  const others = omit(props as SidebarMenuActionProps, "class", "showOnHover")

  return (
    <Polymorphic<SidebarMenuActionProps>
      as="button"
      class={cn(
        "cn-sidebar-menu-action after:-inset-2 flex items-center justify-center outline-hidden transition-transform after:absolute group-data-[collapsible=icon]:hidden md:after:hidden [&>svg]:shrink-0",
        props.showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        props.class
      )}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      {...others}
    />
  )
}

const SidebarMenuBadge: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn(
        "cn-sidebar-menu-badge flex select-none items-center justify-center tabular-nums group-data-[collapsible=icon]:hidden",
        props.class
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...others}
    />
  )
}

type SidebarMenuSkeletonProps = ComponentProps<"div"> & {
  showIcon?: boolean
}

const SidebarMenuSkeleton: Component<SidebarMenuSkeletonProps> = (rawProps) => {
  const props = merge({ showIcon: false }, rawProps)
  const others = omit(props, "class", "showIcon")

  // Random width between 50 to 90%.
  const width = createMemo(() => `${Math.floor(Math.random() * 40) + 50}%`)

  return (
    <div
      class={cn("cn-sidebar-menu-skeleton flex items-center", props.class)}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...others}
    >
      <Show when={props.showIcon}>
        <Skeleton class="cn-sidebar-menu-skeleton-icon" data-sidebar="menu-skeleton-icon" />
      </Show>
      <Skeleton
        class="cn-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{
          "--skeleton-width": width()
        }}
      />
    </div>
  )
}

const SidebarMenuSub: Component<ComponentProps<"ul">> = (props) => {
  const others = omit(props, "class")
  return (
    <ul
      class={cn("cn-sidebar-menu-sub flex min-w-0 flex-col", props.class)}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...others}
    />
  )
}

const SidebarMenuSubItem: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class")
  return (
    <li
      class={cn("group/menu-sub-item relative", props.class)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...others}
    />
  )
}

type SidebarMenuSubButtonProps<T extends ValidComponent = "a"> = ComponentProps<T> & {
  size?: "sm" | "md"
  isActive?: boolean
}

const SidebarMenuSubButton = <T extends ValidComponent = "a">(
  rawProps: PolymorphicProps<T, SidebarMenuSubButtonProps<T>>
) => {
  const props = merge({ size: "md" }, rawProps)
  const others = omit(props as SidebarMenuSubButtonProps, "size", "isActive", "class")

  return (
    <Polymorphic<SidebarMenuSubButtonProps>
      as="a"
      class={cn(
        "cn-sidebar-menu-sub-button -translate-x-px flex min-w-0 items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:hidden [&>span:last-child]:truncate [&>svg]:shrink-0",
        props.class
      )}
      data-active={props.isActive ? "true" : undefined}
      data-sidebar="menu-sub-button"
      data-size={props.size}
      data-slot="sidebar-menu-sub-button"
      {...others}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  type SidebarProps,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
}
