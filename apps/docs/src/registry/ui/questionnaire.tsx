import { createUniqueId, omit, onCleanup } from "solid-js"
import type { JSX } from "@solidjs/web"

import { Check } from "lucide-solid"

import { cn } from "~/lib/utils"
import type {
  QuestionnaireActionsProps,
  QuestionnaireChoiceDescriptionProps,
  QuestionnaireChoiceInputProps,
  QuestionnaireChoiceLabelProps,
  QuestionnaireChoiceProps,
  QuestionnaireChoiceShortcutProps,
  QuestionnaireChoicesProps,
  QuestionnaireDescriptionProps,
  QuestionnaireErrorProps,
  QuestionnaireInputProps,
  QuestionnaireItemProps,
  QuestionnaireNavigationProps,
  QuestionnaireNextProps,
  QuestionnairePreviousProps,
  QuestionnaireProgressProps,
  QuestionnaireRootProps,
  QuestionnaireSkipProps,
  QuestionnaireSubmitProps,
  QuestionnaireTitleProps
} from "~/registry/hooks/use-questionnaire"
import {
  createQuestionnaireChoice,
  createQuestionnaireInput,
  createQuestionnaireItem,
  createQuestionnaireRoot,
  QuestionnaireChoiceContext,
  QuestionnaireContext,
  QuestionnaireItemContext,
  useQuestionnaireChoiceContext,
  useQuestionnaireContext,
  useQuestionnaireItemContext
} from "~/registry/hooks/use-questionnaire"
import { buttonVariants } from "~/registry/ui/button"

const QuestionnaireRoot = (props: QuestionnaireRootProps) => {
  const others = omit(
    props,
    "children",
    "class",
    "defaultItem",
    "item",
    "items",
    "novalidate",
    "onItemChange",
    "onKeyDown",
    "onReset",
    "onSubmit",
    "ref",
    "shortcuts"
  )

  const { context, rootProps } = createQuestionnaireRoot(props)

  return (
    <QuestionnaireContext value={context}>
      <form
        class={cn("cn-questionnaire flex w-full min-w-0 flex-col", props.class)}
        data-current={context.current}
        data-first={context.first ? "" : undefined}
        data-last={context.last ? "" : undefined}
        data-shortcuts={props.shortcuts}
        data-slot="questionnaire"
        data-total={context.total}
        novalidate={props.novalidate ?? true}
        {...rootProps}
        {...others}
      >
        {props.children}
      </form>
    </QuestionnaireContext>
  )
}

const QuestionnaireProgress = (props: QuestionnaireProgressProps) => {
  const context = useQuestionnaireContext("QuestionnaireProgress")
  const others = omit(props, "children", "class")
  const label = () =>
    context.total ? `Question ${context.current} of ${context.total}` : undefined
  const content = () => {
    const children = props.children

    if (typeof children === "function") {
      return children({
        current: context.current,
        first: context.first,
        last: context.last,
        total: context.total
      })
    }

    return children ?? label()
  }

  return (
    <div
      aria-label="Questionnaire progress"
      aria-live="polite"
      aria-valuemax={context.total || undefined}
      aria-valuemin={context.total ? 1 : undefined}
      aria-valuenow={context.total ? context.current : undefined}
      aria-valuetext={label()}
      class={cn(
        "cn-questionnaire-progress min-h-lh w-fit min-w-[14ch] text-left font-medium text-muted-foreground tabular-nums",
        props.class
      )}
      data-current={context.current}
      data-first={context.first ? "" : undefined}
      data-last={context.last ? "" : undefined}
      data-slot="questionnaire-progress"
      data-total={context.total}
      role="progressbar"
      {...others}
    >
      {content()}
    </div>
  )
}

const QuestionnaireItem = (props: QuestionnaireItemProps) => {
  const others = omit(
    props,
    "aria-describedby",
    "aria-keyshortcuts",
    "children",
    "class",
    "disabled",
    "invalid",
    "multiple",
    "name",
    "onStatusChange",
    "ref",
    "required"
  )

  const { context, itemProps, state } = createQuestionnaireItem(props)

  return (
    <QuestionnaireItemContext value={context}>
      <fieldset
        class={cn("cn-questionnaire-item min-w-0 border-0 p-0 outline-none", props.class)}
        data-active={state.active ? "" : undefined}
        data-disabled={state.disabled ? "" : undefined}
        data-invalid={state.invalid ? "" : undefined}
        data-multiple={state.multiple ? "" : undefined}
        data-required={state.required ? "" : undefined}
        data-slot="questionnaire-item"
        data-status={state.status}
        {...itemProps}
        {...others}
      >
        {props.children}
      </fieldset>
    </QuestionnaireItemContext>
  )
}

const QuestionnaireTitle = (props: QuestionnaireTitleProps) => {
  useQuestionnaireItemContext("QuestionnaireTitle")
  const others = omit(props, "class")

  return (
    <legend
      class={cn("cn-questionnaire-title z-font-heading text-pretty text-left", props.class)}
      data-slot="questionnaire-title"
      {...others}
    />
  )
}

const QuestionnaireDescription = (props: QuestionnaireDescriptionProps) => {
  const itemContext = useQuestionnaireItemContext("QuestionnaireDescription")
  const others = omit(props, "class", "id")
  const generatedId = createUniqueId()
  const descriptionId = () => (props.id ? String(props.id) : generatedId)

  onCleanup(itemContext.registerDescription(descriptionId()))

  return (
    <p
      class={cn(
        "cn-questionnaire-description text-pretty text-left text-muted-foreground",
        props.class
      )}
      data-slot="questionnaire-description"
      id={descriptionId()}
      {...others}
    />
  )
}

const QuestionnaireChoices = (props: QuestionnaireChoicesProps) => {
  const itemContext = useQuestionnaireItemContext("QuestionnaireChoices")
  const others = omit(props, "class")

  return (
    <div
      class={cn("group/questionnaire-choices cn-questionnaire-choices grid min-w-0", props.class)}
      data-shortcuts={itemContext.shortcuts ?? undefined}
      data-slot="questionnaire-choices"
      {...others}
    />
  )
}

const QuestionnaireChoice = (props: QuestionnaireChoiceProps) => {
  const others = omit(
    props,
    "checked",
    "children",
    "class",
    "defaultChecked",
    "disabled",
    "onChange",
    "value"
  )

  const choiceContext = createQuestionnaireChoice(props)
  const state = choiceContext.state

  return (
    <QuestionnaireChoiceContext value={choiceContext}>
      <label
        class={cn(
          "group/questionnaire-choice cn-questionnaire-choice relative flex min-h-11 cursor-pointer select-none items-start text-start outline-none transition-colors",
          "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
          props.class
        )}
        data-checked={state.checked ? "" : undefined}
        data-disabled={state.disabled ? "" : undefined}
        data-invalid={state.invalid ? "" : undefined}
        data-shortcut={state.shortcut ?? undefined}
        data-slot="questionnaire-choice"
        data-type={state.type}
        data-unchecked={state.checked ? undefined : ""}
        {...others}
      >
        <QuestionnaireChoiceInput />
        <span
          aria-hidden="true"
          class="cn-questionnaire-choice-indicator pointer-events-none relative flex shrink-0 items-center justify-center border group-data-[type=radio]/questionnaire-choice:rounded-full"
          data-slot="questionnaire-choice-indicator"
        >
          <span
            class="cn-questionnaire-choice-indicator-dot hidden rounded-full group-data-checked/questionnaire-choice:block group-data-[type=checkbox]/questionnaire-choice:hidden"
            data-slot="questionnaire-choice-indicator-dot"
          />
          <Check
            class="cn-questionnaire-choice-indicator-check hidden group-data-checked/questionnaire-choice:block group-data-[type=radio]/questionnaire-choice:hidden"
            data-slot="questionnaire-choice-indicator-check"
          />
        </span>
        <QuestionnaireChoiceLabel>{props.children}</QuestionnaireChoiceLabel>
        <QuestionnaireChoiceShortcut />
      </label>
    </QuestionnaireChoiceContext>
  )
}

const QuestionnaireChoiceInput = (props: QuestionnaireChoiceInputProps) => {
  const choiceContext = useQuestionnaireChoiceContext("QuestionnaireChoiceInput")
  const others = omit(props, "class", "ref")
  const inputProps = omit(choiceContext.inputProps, "ref")
  const state = choiceContext.state

  return (
    <input
      class={cn(
        "cn-questionnaire-choice-input absolute inset-0 z-10 size-full cursor-pointer opacity-0",
        props.class
      )}
      data-checked={state.checked ? "" : undefined}
      data-disabled={state.disabled ? "" : undefined}
      data-invalid={state.invalid ? "" : undefined}
      data-shortcut={state.shortcut ?? undefined}
      data-slot="questionnaire-choice-input"
      data-type={state.type}
      data-unchecked={state.checked ? undefined : ""}
      {...inputProps}
      {...others}
      ref={(element) => {
        choiceContext.inputProps.ref(element)
        props.ref?.(element)
      }}
    />
  )
}

const QuestionnaireChoiceLabel = (props: QuestionnaireChoiceLabelProps) => {
  useQuestionnaireChoiceContext("QuestionnaireChoiceLabel")
  const others = omit(props, "class")

  return (
    <span
      class={cn(
        "cn-questionnaire-choice-content cn-questionnaire-choice-label flex min-w-0 flex-1 flex-col leading-snug",
        props.class
      )}
      data-slot="questionnaire-choice-label"
      {...others}
    />
  )
}

const QuestionnaireChoiceShortcut = (props: QuestionnaireChoiceShortcutProps) => {
  const choiceContext = useQuestionnaireChoiceContext("QuestionnaireChoiceShortcut")
  const others = omit(props, "children", "class")

  return (
    <span
      aria-hidden="true"
      class={cn(
        "cn-questionnaire-choice-shortcut cn-questionnaire-shortcut pointer-events-none ms-auto hidden shrink-0 group-data-shortcut/questionnaire-choice:inline-flex",
        props.class
      )}
      data-shortcut={choiceContext.state.shortcut ?? undefined}
      data-slot="questionnaire-choice-shortcut"
      hidden={choiceContext.state.shortcut === null}
      {...others}
    >
      {props.children ?? choiceContext.state.shortcut}
    </span>
  )
}

const QuestionnaireChoiceDescription = (props: QuestionnaireChoiceDescriptionProps) => {
  const others = omit(props, "class")

  return (
    <span
      class={cn("cn-questionnaire-choice-description", props.class)}
      data-slot="questionnaire-choice-description"
      {...others}
    />
  )
}

const QuestionnaireInput = (props: QuestionnaireInputProps) => {
  const others = omit(props, "class", "defaultValue", "disabled", "onInput", "ref", "type", "value")

  const { inputProps, state } = createQuestionnaireInput(props)

  return (
    <div
      class="group/questionnaire-input cn-questionnaire-input-wrapper relative min-w-0"
      data-slot="questionnaire-input-wrapper"
    >
      <input
        class={cn(
          "cn-questionnaire-input min-h-11 w-full min-w-0 outline-none transition-[color,box-shadow,background-color] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0",
          "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
          props.class
        )}
        data-disabled={state.disabled ? "" : undefined}
        data-empty={state.filled ? undefined : ""}
        data-filled={state.filled ? "" : undefined}
        data-invalid={state.invalid ? "" : undefined}
        data-slot="questionnaire-input"
        {...inputProps}
        {...others}
      />
    </div>
  )
}

const QuestionnaireError = (props: QuestionnaireErrorProps) => {
  const itemContext = useQuestionnaireItemContext("QuestionnaireError")
  const others = omit(props, "children", "class", "id")
  const generatedId = createUniqueId()
  const errorId = () => (props.id ? String(props.id) : generatedId)

  onCleanup(itemContext.registerError(errorId()))

  return (
    <p
      class={cn("cn-questionnaire-error text-destructive", props.class)}
      data-invalid={itemContext.invalid ? "" : undefined}
      data-slot="questionnaire-error"
      hidden={!itemContext.invalid}
      id={errorId()}
      role={itemContext.invalid ? "alert" : undefined}
      {...others}
    >
      {props.children ??
        (itemContext.required
          ? "Choose an answer to continue."
          : "Choose an answer or skip this question.")}
    </p>
  )
}

const QuestionnaireActions = (props: QuestionnaireActionsProps) => {
  const others = omit(props, "class")

  return (
    <div
      class={cn(
        "cn-questionnaire-actions grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center",
        props.class
      )}
      data-slot="questionnaire-actions"
      {...others}
    />
  )
}

type QuestionnaireNavigationButtonProps = QuestionnaireNavigationProps & {
  defaultChildren: string
  navigationClass: string
  shortcut?: "Enter"
  slotName: string
  visible: boolean
}

const QuestionnaireNavigationButton = (props: QuestionnaireNavigationButtonProps) => {
  const context = useQuestionnaireContext("QuestionnaireNavigationButton")
  const others = omit(
    props,
    "children",
    "class",
    "defaultChildren",
    "disabled",
    "navigationClass",
    "shortcut",
    "size",
    "slotName",
    "tabindex",
    "type",
    "variant",
    "visible"
  )

  const disabled = () => props.disabled ?? false
  const activeShortcut = () => (props.visible && !disabled() ? (props.shortcut ?? null) : null)

  return (
    <button
      aria-hidden={!props.visible ? "true" : "false"}
      aria-keyshortcuts={activeShortcut() ?? undefined}
      class={cn(
        buttonVariants({
          size: props.size ?? "default",
          variant: props.variant ?? "default"
        }),
        props.navigationClass,
        props.class
      )}
      data-disabled={disabled() ? "" : undefined}
      data-hidden={props.visible ? undefined : ""}
      data-shortcut={activeShortcut() ?? undefined}
      data-size={props.size ?? "default"}
      data-slot={props.slotName}
      data-status={context.activeItemStatus ?? undefined}
      data-variant={props.variant ?? "default"}
      data-visible={props.visible ? "" : undefined}
      disabled={disabled()}
      hidden={!props.visible}
      inert={!props.visible}
      tabindex={props.visible ? props.tabindex : -1}
      type={props.type ?? "button"}
      {...others}
    >
      {props.children ?? props.defaultChildren}
    </button>
  )
}

const QuestionnairePrevious = (props: QuestionnairePreviousProps) => {
  const context = useQuestionnaireContext("QuestionnairePrevious")
  const others = omit(props, "onClick", "variant")

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") {
      props.onClick(event)
    }

    if (!event.defaultPrevented) {
      context.goPrevious()
    }
  }

  return (
    <QuestionnaireNavigationButton
      defaultChildren="Previous"
      navigationClass="cn-questionnaire-previous col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0"
      onClick={handleClick}
      slotName="questionnaire-previous"
      variant={props.variant ?? "outline"}
      visible={context.total > 1 && !context.first}
      {...others}
    />
  )
}

const QuestionnaireSkip = (props: QuestionnaireSkipProps) => {
  const context = useQuestionnaireContext("QuestionnaireSkip")
  const others = omit(props, "onClick", "variant")

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") {
      props.onClick(event)
    }

    if (!event.defaultPrevented) {
      context.skipCurrent()
    }
  }

  return (
    <QuestionnaireNavigationButton
      defaultChildren="Skip"
      navigationClass="cn-questionnaire-skip col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0"
      onClick={handleClick}
      slotName="questionnaire-skip"
      variant={props.variant ?? "outline"}
      visible={context.activeItemRequired === false}
      {...others}
    />
  )
}

const QuestionnaireNext = (props: QuestionnaireNextProps) => {
  const context = useQuestionnaireContext("QuestionnaireNext")
  const others = omit(props, "onClick")

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (typeof props.onClick === "function") {
      props.onClick(event)
    }

    if (!event.defaultPrevented) {
      context.goNext()
    }
  }

  return (
    <QuestionnaireNavigationButton
      defaultChildren="Next"
      navigationClass="cn-questionnaire-next col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0"
      onClick={handleClick}
      shortcut="Enter"
      slotName="questionnaire-next"
      visible={context.total > 1 && !context.last}
      {...others}
    />
  )
}

const QuestionnaireSubmit = (props: QuestionnaireSubmitProps) => {
  const context = useQuestionnaireContext("QuestionnaireSubmit")
  const others = omit(props, "type")

  return (
    <QuestionnaireNavigationButton
      defaultChildren="Submit"
      navigationClass="cn-questionnaire-submit col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0"
      shortcut="Enter"
      slotName="questionnaire-submit"
      type={props.type ?? "submit"}
      visible={context.total > 0 && context.last}
      {...others}
    />
  )
}

export {
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceInput,
  QuestionnaireChoiceLabel,
  QuestionnaireChoiceShortcut,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireRoot,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle
}
