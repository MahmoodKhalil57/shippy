import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { tiles } from "../layout/algebra.ts";
import { fieldsetField, type FieldsetVariants } from "./fieldset.ts";
import { label as labelRecipe } from "./label.ts";

/**
 * Text Input: Simple input field.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/input/
 *
 * `input` can sit on the `<input>` itself, or on a `<label>` wrapping the
 * `<input>` plus icons, kbd hints, badges or inline `label` text.
 */
export const textInput = rcva("input min-w-0", {
  variants: {
    color: {
      neutral: "input-neutral",
      primary: "input-primary",
      secondary: "input-secondary",
      accent: "input-accent",
      info: "input-info",
      success: "input-success",
      warning: "input-warning",
      error: "input-error",
    },
    variant: {
      ghost: "input-ghost",
    },
    size: {
      xs: "input-xs",
      sm: "input-sm",
      md: "input-md",
      lg: "input-lg",
      xl: "input-xl",
    },
    /** Turns on `:user-invalid` colouring + `validator-hint` (see Validator). */
    validator: { true: "validator" },
    width: {
      /** Grows to fill a wrapping row, never narrower than 16rem (or the row). */
      fill: "min-w-[min(100%,16rem)] flex-1",
      auto: "w-auto",
      // Whole tiles (`tiles.*`): 5, 6, 7, 8, 10 (the old 16, 20, 24, 28, 32rem, to the nearest tile).
      "64": tiles["5"],
      xs: tiles["6"],
      sm: tiles["7"],
      md: tiles["8"],
      lg: tiles["10"],
      full: "w-full",
    },
    /** Monospaced digits (the docs' telephone example). */
    tabular: { true: "tabular-nums" },
  },
});

/** `label.input` wrapper: a bare `<svg>` placed inside gets the docs' icon size and muted look. */
export const textInputWrapper = rcva("[&>svg]:h-[1em] [&>svg]:opacity-50");
/** The bare `<input>` inside a `label.input` wrapper. */
export const textInputField = rcva("grow", {
  variants: {
    tabular: { true: "tabular-nums" },
  },
});
/** Inline label text inside the wrapper (e.g. "https://", ".com"). */
export const textInputAdornment = rcva("label");
/** Built-in icon inside the wrapper. */
export const textInputIcon = rcva("h-[1em] opacity-50");

const inputIcon = (name: IconName) => iconSvg(name, {}, { class: textInputIcon() });

/** The icons used in the daisyUI input examples, as system icons. */
export const textInputIcons = {
  file: inputIcon("file"),
  user: inputIcon("user"),
  mail: inputIcon("mail"),
  key: inputIcon("key"),
  phone: inputIcon("phone"),
  link: inputIcon("link"),
} as const;

export type TextInputIcon = keyof typeof textInputIcons;

export type TextInputVariants = VariantProps<typeof textInput>;

export type TextInputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "url"
  | "tel"
  | "number"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week";

/**
 * @example <ui-text-input placeholder="Type here" color="primary" size="sm"></ui-text-input>
 * @example
 * <ui-text-input type="email" icon="mail" required validator placeholder="mail@site.com"
 *   validator-hint="Enter valid email address" hint-on-invalid></ui-text-input>
 * @example
 * <ui-text-input icon="key" placeholder="Licence key">
 *   <ui-kbd slot="end" size="sm">⌘</ui-kbd><ui-kbd slot="end" size="sm">K</ui-kbd>
 * </ui-text-input>
 *
 * A search field is `<ui-search>`, not a text input.
 * @example <ui-text-input leading="https://" placeholder="URL"></ui-text-input>
 * @example <ui-text-input floating label="Your Email" placeholder="mail@site.com"></ui-text-input>
 * @example <ui-text-input size="xs sm:sm md:md lg:lg xl:xl" width="full md:xs"></ui-text-input>
 *
 * `icon` adds one of the docs' icons before the field. Children marked
 * `slot="start"` / `slot="end"` (`ui-kbd`, `ui-badge`, plain text, or a bare
 * `<svg>`, which gets the docs' icon size and opacity) render inside the
 * `label.input` wrapper around the field. Native `input` / `change` events
 * bubble out; `value` stays in sync with what the user types.
 */
@customElement("ui-text-input")
export class UiTextInput extends LightElement {
  @property() color: TextInputVariants["color"];
  @property() variant: TextInputVariants["variant"];
  @property() size: TextInputVariants["size"];
  @property() width: TextInputVariants["width"];
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;
  /** Monospaced digits. */
  @property({ converter: responsiveBoolean }) tabular: Responsive<boolean> = false;
  /** One of the docs' icons, shown before the field. */
  @property() icon?: TextInputIcon;

  @property() type: TextInputType = "text";
  @property() name?: string;
  @property() value = "";
  @property() placeholder?: string;
  /** The accessible name when there's no visible label (a field in a table row). */
  @property({ attribute: "aria-label" }) ariaLabelText?: string;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) readonly = false;
  @property() pattern?: string;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property() min?: string;
  @property() max?: string;
  @property() step?: string;
  @property() autocomplete?: string;
  @property() inputmode?: string;
  /** Native tooltip / validation message shown by the browser (input `title`). */
  @property({ attribute: "pattern-title" }) patternTitle?: string;
  /** `<datalist>` suggestions. */
  @property({ attribute: false }) suggestions: string[] = [];

  /** Inline label text before / after the field (`label` inside `label.input`). */
  @property() leading?: string;
  @property() trailing?: string;

  /** Field chrome. With `floating`, `label` becomes the floating label. */
  @property() legend: Renderable = "";
  @property() label: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  @property({ type: Boolean, attribute: "hint-on-invalid" }) hintOnInvalid = false;
  @property({ type: Boolean }) floating = false;
  /** Look of the wrapping fieldset (rendered when legend / label / hint are set). */
  @property({ attribute: "field-surface" }) fieldSurface: FieldsetVariants["surface"];
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
  /** id for the native input (generated when omitted). */
  @property({ attribute: "input-id" }) inputId = uid("input");

  @query("input") input!: HTMLInputElement;

  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }
  checkValidity() {
    return this.input?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.input?.reportValidity() ?? true;
  }

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }

  private _field(cls: string) {
    const listId = this.suggestions.length ? `${this.inputId}-list` : undefined;
    return html`<input
        id=${this.inputId}
        class=${cls}
        type=${this.type}
        name=${ifDefined(this.name)}
        .value=${live(this.value)}
        placeholder=${ifDefined(this.placeholder)}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?readonly=${this.readonly}
        pattern=${ifDefined(this.pattern)}
        minlength=${ifDefined(this.minlength)}
        maxlength=${ifDefined(this.maxlength)}
        min=${ifDefined(this.min)}
        max=${ifDefined(this.max)}
        step=${ifDefined(this.step)}
        autocomplete=${ifDefined(this.autocomplete)}
        inputmode=${ifDefined(this.inputmode)}
        title=${ifDefined(this.patternTitle)}
        list=${ifDefined(listId)}
        aria-label=${ifDefined(this.ariaLabelText ?? (!this.label && !this.legend ? (this.placeholder ?? this.leading) : undefined))}
        @input=${this._onInput}
      />${
        listId
          ? html`<datalist id=${listId}>${this.suggestions.map((s) => html`<option value=${s}></option>`)}</datalist>`
          : nothing
      }`;
  }

  render() {
    const variants = {
      color: this.color,
      variant: this.variant,
      size: this.size,
      width: this.width,
      validator: this.validator,
    };
    const wrapped = this.icon || this.leading || this.trailing || this.hasSlotted("start") || this.hasSlotted("end");

    let control = wrapped
      ? html`<label class=${textInput({ ...variants, class: textInputWrapper() })}>
          ${this.icon ? textInputIcons[this.icon] : nothing}
          ${this.leading ? html`<span class=${textInputAdornment()}>${this.leading}</span>` : nothing}
          ${this.slotted("start")} ${this._field(textInputField({ tabular: this.tabular }))} ${this.slotted("end")}
          ${this.trailing ? html`<span class=${textInputAdornment()}>${this.trailing}</span>` : nothing}
        </label>`
      : this._field(textInput({ ...variants, tabular: this.tabular }));

    if (this.floating) {
      control = html`<label class=${labelRecipe({ variant: "floating" })}
        ><span>${this.label || this.placeholder}</span>${control}</label
      >`;
    }

    return fieldsetField(
      {
        legend: this.legend,
        label: this.floating ? "" : this.label,
        hint: this.hint,
        validatorHint: this.validatorHint,
        hintOnInvalid: this.hintOnInvalid,
        controlId: this.inputId,
        surface: this.fieldSurface,
        width: this.fieldWidth,
      },
      control,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-text-input": UiTextInput;
  }
}
