import { createSignal } from "solid-js"

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/registry/ui/input-otp"

export default function InputOTPInvalid() {
  const [value, setValue] = createSignal("000000")

  return (
    <InputOTP maxLength={6} onValueChange={setValue} value={value()}>
      <InputOTPGroup>
        <InputOTPSlot aria-invalid="true" index={0} />
        <InputOTPSlot aria-invalid="true" index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot aria-invalid="true" index={2} />
        <InputOTPSlot aria-invalid="true" index={3} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot aria-invalid="true" index={4} />
        <InputOTPSlot aria-invalid="true" index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
