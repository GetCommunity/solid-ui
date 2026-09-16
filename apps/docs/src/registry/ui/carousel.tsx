import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  merge,
  omit,
  onCleanup,
  useContext
} from "solid-js"
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from "embla-carousel"
import createEmblaCarousel from "embla-carousel-solid"
import { ChevronLeft, ChevronRight } from "lucide-solid"

import { cn } from "~/lib/utils"
import { Button, type ButtonProps } from "~/registry/ui/button"

type CarouselApi = EmblaCarouselType | undefined
type CarouselOptions = EmblaOptionsType
type CarouselPlugin = EmblaPluginType

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin[]
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof createEmblaCarousel>[0]
  api: ReturnType<typeof createEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: Accessor<boolean>
  canScrollNext: Accessor<boolean>
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

type CarouselRootProps<T extends ValidComponent = "div"> = ComponentProps<T> &
  CarouselProps & {
    class?: string | undefined
    children?: JSX.Element
  }

const Carousel = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, CarouselRootProps<T>>
) => {
  const props = merge({ orientation: "horizontal" as const }, rawProps)
  const others = omit(
    props as CarouselRootProps,
    "class",
    "children",
    "opts",
    "plugins",
    "orientation",
    "setApi"
  )

  const [carouselRef, api] = createEmblaCarousel(
    () => ({
      ...props.opts,
      axis: props.orientation === "horizontal" ? "x" : "y"
    }),
    () => props.plugins ?? []
  )

  const [canScrollPrev, setCanScrollPrev] = createSignal(false)
  const [canScrollNext, setCanScrollNext] = createSignal(false)

  const onSelect = (emblaApi: EmblaCarouselType) => {
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }

  const scrollPrev = () => {
    api()?.scrollPrev()
  }

  const scrollNext = () => {
    api()?.scrollNext()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }

  createEffect(
    () => api(),
    (emblaApi) => {
      if (!emblaApi || !props.setApi) return
      props.setApi(emblaApi)
    }
  )

  createEffect(() => {
    const emblaApi = api()
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)

    onCleanup(() => {
      emblaApi.off("select", onSelect)
    })
  })

  return (
    <CarouselContext
      value={{
        carouselRef,
        api,
        opts: props.opts,
        orientation: props.orientation || (props.opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      }}
    >
      <div
        aria-roledescription="carousel"
        class={cn("relative", props.class)}
        data-slot="carousel"
        onKeyDown={handleKeyDown}
        role="region"
        {...others}
      >
        {props.children}
      </div>
    </CarouselContext>
  )
}

type CarouselContentProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined
}

const CarouselContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CarouselContentProps<T>>
) => {
  const others = omit(props as CarouselContentProps, "class")
  const { carouselRef, orientation } = useCarousel()

  return (
    <div class="overflow-hidden" data-slot="carousel-content" ref={carouselRef}>
      <div
        class={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", props.class)}
        {...others}
      />
    </div>
  )
}

type CarouselItemProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined
}

const CarouselItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CarouselItemProps<T>>
) => {
  const others = omit(props as CarouselItemProps, "class")
  const { orientation } = useCarousel()

  return (
    <div
      aria-roledescription="slide"
      class={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        props.class
      )}
      data-slot="carousel-item"
      role="group"
      {...others}
    />
  )
}

type CarouselPreviousProps<T extends ValidComponent = "button"> = ButtonProps<T> & {
  class?: string | undefined
}

const CarouselPrevious = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, CarouselPreviousProps<T>>
) => {
  const props = merge({ variant: "outline" as const, size: "icon-sm" as const }, rawProps)
  const others = omit(props as CarouselPreviousProps, "class", "variant", "size")
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      class={cn(
        "cn-carousel-previous absolute touch-manipulation",
        orientation === "horizontal"
          ? "-left-12 -translate-y-1/2 top-1/2"
          : "-top-12 -translate-x-1/2 left-1/2 rotate-90",
        props.class
      )}
      data-slot="carousel-previous"
      disabled={!canScrollPrev()}
      onClick={scrollPrev}
      size={props.size}
      variant={props.variant}
      {...others}
    >
      <ChevronLeft />
      <span class="sr-only">Previous slide</span>
    </Button>
  )
}

type CarouselNextProps<T extends ValidComponent = "button"> = ButtonProps<T> & {
  class?: string | undefined
}

const CarouselNext = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, CarouselNextProps<T>>
) => {
  const props = merge({ variant: "outline" as const, size: "icon-sm" as const }, rawProps)
  const others = omit(props as CarouselNextProps, "class", "variant", "size")
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      class={cn(
        "cn-carousel-next absolute touch-manipulation",
        orientation === "horizontal"
          ? "-right-12 -translate-y-1/2 top-1/2"
          : "-bottom-12 -translate-x-1/2 left-1/2 rotate-90",
        props.class
      )}
      data-slot="carousel-next"
      disabled={!canScrollNext()}
      onClick={scrollNext}
      size={props.size}
      variant={props.variant}
      {...others}
    >
      <ChevronRight />
      <span class="sr-only">Next slide</span>
    </Button>
  )
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel
}
