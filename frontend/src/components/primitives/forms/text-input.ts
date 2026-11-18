import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
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
export const textInput = rcva("input", {
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
      auto: "w-auto",
      "64": "w-64",
      xs: "w-xs",
      sm: "w-sm",
      md: "w-md",
      lg: "w-lg",
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

const strokeIcon = (paths: TemplateResult) =>
  html`<svg class=${textInputIcon()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">${paths}</g>
  </svg>`;

/** The icons used in the daisyUI input examples. */
export const textInputIcons = {
  search: strokeIcon(svg`<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>`),
  file: strokeIcon(
    svg`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>`,
  ),
  user: strokeIcon(
    svg`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`,
  ),
  mail: strokeIcon(
    svg`<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>`,
  ),
  key: strokeIcon(
    svg`<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>`,
  ),
  phone: html`<svg class=${textInputIcon()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <g fill="none">
      <path
        d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
        fill="currentColor"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
        fill="currentColor"
      ></path>
    </g>
  </svg>`,
  link: strokeIcon(
    svg`<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>`,
  ),
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
 * <ui-text-input type="search" icon="search" placeholder="Search">
 *   <ui-kbd slot="end" size="sm">⌘</ui-kbd><ui-kbd slot="end" size="sm">K</ui-kbd>
 * </ui-text-input>
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
        aria-label=${ifDefined(!this.label && !this.legend ? (this.placeholder ?? this.leading) : undefined)}
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
