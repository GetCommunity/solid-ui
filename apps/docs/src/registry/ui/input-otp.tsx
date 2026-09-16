import { omit, Show } from "solid-js"
import type { ComponentProps } from "@solidjs/web"

import OtpField, { type RootProps as OtpFieldRootProps } from "@corvu/otp-field"
import { Minus } from "lucide-solid"

import { cn } from "~/lib/utils"

type InputOTPProps = OtpFieldRootProps &
  ComponentProps<"div"> &
  Pick<ComponentProps<"input">, "disabled" | "required"> & {
    containerClass?: string
    /**
     * Regex pattern for the input, forwarded to the underlying `OtpField.Input`.
     * Defaults to digits only (`'^\d*$'`). Pass `null` to allow all characters.
     */
    pattern?: string | null
  }

const InputOTP = (props: InputOTPProps) => {
  const others = omit(
    props as InputOTPProps,
    "class",
    "containerClass",
    "children",
    "id",
    "disabled",
    "required",
    "value",
    "onValueChange",
    "pattern"
  )

  return (
    <OtpField
      class={cn("cn-input-otp flex items-center has-disabled:opacity-50", props.containerClass)}
      data-slot="input-otp"
      spellcheck={false}
      {...others}
    >
      <OtpField.Input
        class={cn("cn-input-otp-input disabled:cursor-not-allowed", props.class)}
        data-slot="input-otp-input"
        disabled={props.disabled}
        id={props.id}
        onChange={(e) => props.onValueChange?.(e.target.value)}
        pattern={props.pattern}
        required={props.required}
        spellcheck={false}
        value={props.value}
      />
      {props.children}
    </OtpField>
  )
}

type InputOTPGroupProps = ComponentProps<"div">

const InputOTPGroup = (props: InputOTPGroupProps) => {
  const others = omit(props, "class")
  return (
    <div
      class={cn("cn-input-otp-group flex items-center", props.class)}
      data-slot="input-otp-group"
      {...others}
    />
  )
}

type InputOTPSlotProps = ComponentProps<"div"> & {
  index: number
}

const InputOTPSlot = (props: InputOTPSlotProps) => {
  const others = omit(props, "index", "class")
  const context = OtpField.useContext()

  const char = () => context.value()[props.index]
  const isActive = () => context.activeSlots().includes(props.index)
  const showCaret = () => isActive() && context.isInserting()

  return (
    <div
      class={cn(
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        props.class
      )}
      data-active={isActive()}
      data-slot="input-otp-slot"
      {...others}
    >
      {char()}
      <Show when={showCaret()}>
        <div class="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="cn-input-otp-caret-line h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      </Show>
    </div>
  )
}

type InputOTPSeparatorProps = ComponentProps<"div">

const InputOTPSeparator = (props: InputOTPSeparatorProps) => {
  const others = omit(props, "class")
  return (
    <div
      aria-hidden="true"
      class={cn("cn-input-otp-separator flex items-center", props.class)}
      data-slot="input-otp-separator"
      {...others}
    >
      <Minus />
    </div>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  type InputOTPGroupProps,
  type InputOTPProps,
  InputOTPSeparator,
  type InputOTPSeparatorProps,
  InputOTPSlot,
  type InputOTPSlotProps
}
