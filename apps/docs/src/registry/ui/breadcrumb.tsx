import { omit } from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { ChevronRight, Ellipsis } from "lucide-solid"

import { cn } from "~/lib/utils"

type BreadcrumbProps<T extends ValidComponent = "nav"> = ComponentProps<T> & {
  class?: string | undefined
  children?: JSX.Element
}

const Breadcrumb = <T extends ValidComponent = "nav">(
  props: PolymorphicProps<T, BreadcrumbProps<T>>
) => {
  const others = omit(props as BreadcrumbProps, "class", "children")
  return (
    <nav
      aria-label="breadcrumb"
      class={cn("cn-breadcrumb", props.class)}
      data-slot="breadcrumb"
      {...others}
    >
      {props.children}
    </nav>
  )
}

type BreadcrumbListProps<T extends ValidComponent = "ol"> = ComponentProps<T> & {
  class?: string | undefined
  children?: JSX.Element
}

const BreadcrumbList = <T extends ValidComponent = "ol">(
  props: PolymorphicProps<T, BreadcrumbListProps<T>>
) => {
  const others = omit(props as BreadcrumbListProps, "class", "children")
  return (
    <ol
      class={cn("cn-breadcrumb-list flex flex-wrap items-center break-words", props.class)}
      data-slot="breadcrumb-list"
      {...others}
    >
      {props.children}
    </ol>
  )
}

type BreadcrumbItemProps<T extends ValidComponent = "li"> = ComponentProps<T> & {
  class?: string | undefined
  children?: JSX.Element
}

const BreadcrumbItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, BreadcrumbItemProps<T>>
) => {
  const others = omit(props as BreadcrumbItemProps, "class", "children")
  return (
    <li
      class={cn("cn-breadcrumb-item inline-flex items-center", props.class)}
      data-slot="breadcrumb-item"
      {...others}
    >
      {props.children}
    </li>
  )
}

type BreadcrumbLinkProps<T extends ValidComponent = "a"> = ComponentProps<T> & {
  class?: string | undefined
  children?: JSX.Element
}

const BreadcrumbLink = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, BreadcrumbLinkProps<T>>
) => {
  const others = omit(props as BreadcrumbLinkProps, "class", "children")
  return (
    <a class={cn("cn-breadcrumb-link", props.class)} data-slot="breadcrumb-link" {...others}>
      {props.children}
    </a>
  )
}

type BreadcrumbPageProps<T extends ValidComponent = "span"> = ComponentProps<T> & {
  class?: string | undefined
  children?: JSX.Element
}

const BreadcrumbPage = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, BreadcrumbPageProps<T>>
) => {
  const others = omit(props as BreadcrumbPageProps, "class", "children")
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: <exception for breadcumb>
    <span
      aria-current="page"
      aria-disabled="true"
      class={cn("cn-breadcrumb-page", props.class)}
      data-slot="breadcrumb-page"
      role="link"
      {...others}
    >
      {props.children}
    </span>
  )
}

type BreadcrumbSeparatorProps<T extends ValidComponent = "li"> = ComponentProps<T> & {
  class?: string | undefined
  children?: JSX.Element
}

const BreadcrumbSeparator = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, BreadcrumbSeparatorProps<T>>
) => {
  const others = omit(props as BreadcrumbSeparatorProps, "class", "children")
  return (
    <li
      aria-hidden="true"
      class={cn("cn-breadcrumb-separator", props.class)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...others}
    >
      {props.children ?? <ChevronRight />}
    </li>
  )
}

type BreadcrumbEllipsisProps<T extends ValidComponent = "span"> = ComponentProps<T> & {
  class?: string | undefined
}

const BreadcrumbEllipsis = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, BreadcrumbEllipsisProps<T>>
) => {
  const others = omit(props as BreadcrumbEllipsisProps, "class")
  return (
    <span
      aria-hidden="true"
      class={cn("cn-breadcrumb-ellipsis flex items-center justify-center", props.class)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...others}
    >
      <Ellipsis />
      <span class="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
}
