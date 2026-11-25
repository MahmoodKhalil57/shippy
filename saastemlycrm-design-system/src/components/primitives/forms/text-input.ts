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

const TYPED_TEXT = new Set<TextInputType>(["text", "email", "password", "search", "url", "tel"]);

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
    validator: { true: "validator" },
    width: {
      fill: "min-w-[min(100%,16rem)] flex-1",
      auto: "w-auto",
      "64": tiles["5"],
      xs: tiles["6"],
      sm: tiles["7"],
      md: tiles["8"],
      lg: tiles["10"],
      full: "w-full",
    },
    tabular: { true: "tabular-nums" },
  },
});

export const textInputWrapper = rcva("[&>svg]:h-[1em] [&>svg]:opacity-50");
export const textInputField = rcva("grow", {
  variants: {
    tabular: { true: "tabular-nums" },
  },
});
export const textInputAdornment = rcva("label");
export const textInputIcon = rcva("h-[1em] opacity-50");

const inputIcon = (name: IconName) => iconSvg(name, {}, { class: textInputIcon() });

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

@customElement("ui-text-input")
export class UiTextInput extends LightElement {
  @property() color: TextInputVariants["color"];
  @property() variant: TextInputVariants["variant"];
  @property() size: TextInputVariants["size"];
  @property() width: TextInputVariants["width"];
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) tabular: Responsive<boolean> = false;
  @property() icon?: TextInputIcon;

  @property() type: TextInputType = "text";
  @property() name?: string;
  @property() value = "";
  @property() placeholder?: string;
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
  @property({ attribute: "pattern-title" }) patternTitle?: string;
  @property({ attribute: false }) suggestions: string[] = [];

  @property() leading?: string;
  @property() trailing?: string;

  @property() legend: Renderable = "";
  @property() label: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  @property({ type: Boolean, attribute: "hint-on-invalid" }) hintOnInvalid = false;
  @property({ type: Boolean }) floating = false;
  @property({ attribute: "field-surface" }) fieldSurface: FieldsetVariants["surface"];
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
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
        dir=${TYPED_TEXT.has(this.type) ? "auto" : nothing}
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
