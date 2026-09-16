import { merge, omit } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import { ChevronDown } from "lucide-solid"

import { cn } from "~/lib/utils"

type NativeSelectProps = ComponentProps<"select"> & {
  size?: "sm" | "default"
}

function NativeSelect(props: NativeSelectProps) {
  const mergedProps = merge({ size: "default" }, props)
  const others = omit(mergedProps, "class", "size")
  return (
    <div
      class={cn(
        "group/native-select cn-native-select-wrapper relative w-fit has-[select:disabled]:opacity-50",
        props.class
      )}
      data-size={props.size}
      data-slot="native-select-wrapper"
    >
      <select
        class="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        data-size={props.size}
        data-slot="native-select"
        {...others}
      />
      <ChevronDown
        class="cn-native-select-icon pointer-events-none absolute select-none"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption(props: ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup(props: ComponentProps<"optgroup">) {
  const others = omit(props, "class")
  return <optgroup class={cn(props.class)} data-slot="native-select-optgroup" {...others} />
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
