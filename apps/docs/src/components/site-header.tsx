import { CustomizerSheet } from "~/components/customizer-sheet"
import { GitHubLink } from "~/components/github-link"
import { IconLogo } from "~/components/icons"
import { MainNav } from "~/components/main-nav"
import { MobileNavigation } from "~/components/mobile-navigation"
import { ModeToggle } from "~/components/mode-toggle"
import { Button } from "~/registry/ui/button"
import { Separator } from "~/registry/ui/separator"

export function SiteHeader() {
  return (
    <header class="sticky top-0 z-50 w-full bg-background">
      <div class="container-wrapper px-6">
        <div class="**:data-[slot=separator]:!h-4 container m-auto flex h-(--header-height) items-center justify-between">
          <MobileNavigation />
          <Button as="a" class="hidden size-8 lg:flex" href="/" size="icon" variant="ghost">
            <IconLogo class="size-5" />
          </Button>
          <MainNav class="hidden lg:flex" />
          <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <GitHubLink />
            <Separator orientation="vertical" />
            <ModeToggle />
            <Separator class="mr-2" orientation="vertical" />
            <CustomizerSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
