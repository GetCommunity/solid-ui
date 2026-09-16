import { createContext, merge, omit, useContext } from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { ToggleGroupItemProps, ToggleGroupRootProps } from "@kobalte/core/toggle-group"
import { ToggleGroup as ToggleGroupPrimitive } from "@kobalte/core/toggle-group"
import type { VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import { toggleVariants } from "~/registry/ui/toggle"

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing?: number
  orientation?: "horizontal" | "vertical"
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal"
})

type ToggleGroupProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  ToggleGroupRootProps<T>
> &
  Pick<ComponentProps<T>, "class" | "children"> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }

const ToggleGroup = <T extends ValidComponent = "div">(rawProps: ToggleGroupProps<T>) => {
  const props = merge(
    {
      spacing: 0,
      orientation: "horizontal"
    } as const,
    rawProps
  )
  const others = omit(
    props as ToggleGroupProps,
    "class",
    "children",
    "variant",
    "size",
    "spacing",
    "orientation"
  )

  return (
    <ToggleGroupPrimitive
      class={cn(
        "cn-toggle-group",
        "group group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md",
        "data-[spacing=default]:data-[variant=outline]:shadow-xs",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        props.class
      )}
      data-orientation={props.orientation}
      data-size={props.size}
      data-slot="toggle-group"
      data-spacing={props.spacing}
      data-variant={props.variant}
      style={{ "--gap": props.spacing } as JSX.CSSProperties}
      {...others}
    >
      <ToggleGroupContext
        value={{
          variant: props.variant,
          size: props.size,
          spacing: props.spacing,
          orientation: props.orientation
        }}
      >
        {props.children}
      </ToggleGroupContext>
    </ToggleGroupPrimitive>
  )
}

type ToggleGroupItemComponentProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  ToggleGroupItemProps<T>
> &
  VariantProps<typeof toggleVariants> &
  Pick<ComponentProps<T>, "class" | "children">

const ToggleGroupItem = <T extends ValidComponent = "button">(
  rawProps: ToggleGroupItemComponentProps<T>
) => {
  const props = merge({ variant: "default" as const, size: "default" as const }, rawProps)
  const others = omit(
    props as ToggleGroupItemComponentProps,
    "class",
    "children",
    "variant",
    "size"
  )
  const context = useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      class={cn(
        toggleVariants({
          variant: context.variant || props.variant,
          size: context.size || props.size
        }),
        "cn-toggle-group-item",
        "focus:z-10 focus-visible:z-10",
        "group-data-[spacing=0]:rounded-none group-data-[spacing=0]:shadow-none",
        "group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:group-data-[variant=outline]:border-l-0",
        "group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:group-data-[variant=outline]:first:border-l",
        "group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:group-data-[variant=outline]:border-t-0",
        "group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:group-data-[variant=outline]:first:border-t",
        "group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:first:rounded-l-md!",
        "group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:last:rounded-r-md!",
        "group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:first:rounded-t-md!",
        "group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:last:rounded-b-md!",
        props.class
      )}
      data-size={context.size || props.size}
      data-slot="toggle-group-item"
      data-spacing={context.spacing || 0}
      data-variant={context.variant || props.variant}
      {...others}
    >
      {props.children}
    </ToggleGroupPrimitive.Item>
  )
}

export type { ToggleGroupProps }
export { ToggleGroup, ToggleGroupItem }
