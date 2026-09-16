import { For } from "solid-js"
import { useLocation } from "@solidjs/router"

import { docsConfig } from "~/config/docs"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/registry/ui/sidebar"

export function MainNavigation() {
  const location = useLocation()

  return (
    <Sidebar
      class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent class="no-scrollbar px-2 pb-12">
        <div class="h-(--top-spacing) shrink-0" />
        <For each={docsConfig.sidebarNav} keyed={false}>
          {(category) => (
            <SidebarGroup>
              <SidebarGroupLabel class="font-medium text-muted-foreground">
                {category().title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu class="gap-0.5">
                  <For each={category().items} keyed={false}>
                    {(link) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          as="a"
                          class="relative h-[30px] 3xl:fixed:w-full w-fit 3xl:fixed:max-w-48 overflow-visible border border-transparent font-medium text-[0.8rem] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent"
                          href={link().href}
                          isActive={link().href === location.pathname}
                        >
                          {link().title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </For>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </For>
      </SidebarContent>
    </Sidebar>
  )
}
