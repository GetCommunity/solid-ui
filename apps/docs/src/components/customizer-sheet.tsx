import { createSignal } from "solid-js"

import { useDesignSystem } from "~/components/design-system-provider"
import { IconLibraryPicker } from "~/components/icon-library-picker"
import { StylePicker } from "~/components/style-picker"
import { useLocks } from "~/hooks/use-locks"
import { iconLibraries } from "~/registry/icon-libraries"
import { STYLES } from "~/registry/styles"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/registry/ui/alert-dialog"
import { Button } from "~/registry/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "~/registry/ui/sheet"

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export function CustomizerSheet() {
  const [open, setOpen] = createSignal(false)
  const { style, setStyle, iconLibrary, setIconLibrary } = useDesignSystem()
  const { isLocked } = useLocks()

  const handleShuffle = () => {
    const randomStyle = isLocked("style") ? style() : randomItem(STYLES)
    const randomIconLibrary = isLocked("iconLibrary")
      ? iconLibraries[iconLibrary()]
      : randomItem(Object.values(iconLibraries))

    if (randomStyle && randomIconLibrary) {
      setStyle(randomStyle)
      setIconLibrary(randomIconLibrary.name)
    }
  }

  const handleReset = () => {
    setStyle(STYLES[0])
    setIconLibrary("lucide")
  }

  return (
    <Sheet onOpenChange={setOpen} open={open()}>
      <SheetTrigger as={Button<"button">}>Customize</SheetTrigger>
      <SheetContent class="w-full gap-0 p-0 sm:max-w-80" side="right">
        <div class="flex h-full flex-col">
          <SheetHeader class="border-b pr-12">
            <SheetTitle>Customize</SheetTitle>
            <SheetDescription>Choose your own style!</SheetDescription>
          </SheetHeader>

          <div class="flex min-h-0 flex-1 flex-col justify-between p-4">
            <div class="flex min-h-0 flex-col gap-4 overflow-y-auto">
              <StylePicker />
              <IconLibraryPicker />
            </div>
            <div class="mt-4 grid grid-cols-1 gap-2 pt-1">
              <Button
                class="h-[calc(--spacing(13.5))] w-full touch-manipulation select-none justify-between rounded-xl border border-foreground/10 bg-muted/50 px-2 text-left hover:bg-muted md:rounded-lg md:border-transparent md:bg-transparent"
                onClick={handleShuffle}
                variant="ghost"
              >
                <span class="flex min-w-0 flex-col justify-start text-left">
                  <span class="text-muted-foreground text-xs">Random</span>
                  <span class="truncate font-medium text-sm">Try Random</span>
                </span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  as={Button<"button">}
                  class="h-[calc(--spacing(13.5))] w-full touch-manipulation select-none justify-between rounded-xl border border-foreground/10 bg-muted/50 px-2 text-left hover:bg-muted md:rounded-lg md:border-transparent md:bg-transparent"
                  variant="ghost"
                >
                  <span class="flex min-w-0 flex-col justify-start text-left">
                    <span class="text-muted-foreground text-xs">Reset</span>
                    <span class="truncate font-medium text-sm">Start Over</span>
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent class="dialog-ring p-4 sm:max-w-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all customization options to their default values. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
