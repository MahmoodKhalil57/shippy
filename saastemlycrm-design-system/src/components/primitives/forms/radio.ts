import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { fieldsetField, fieldsetLabel, type FieldsetVariants } from "./fieldset.ts";

export const radio = rcva("radio", {
  variants: {
    color: {
      neutral: "radio-neutral",
      primary: "radio-primary",
      secondary: "radio-secondary",
      accent: "radio-accent",
      info: "radio-info",
      success: "radio-success",
      warning: "radio-warning",
      error: "radio-error",
    },
    size: {
      xs: "radio-xs",
      sm: "radio-sm",
      md: "radio-md",
      lg: "radio-lg",
      xl: "radio-xl",
    },
    validator: { true: "validator" },
  },
});

export const radioGroup = rcva("", {
  variants: {
    direction: {
      vertical: "flex flex-col gap-2",
      horizontal: "flex flex-row flex-wrap max-w-full gap-4",
    },
  },
  defaultVariants: { direction: "vertical" },
});

export type RadioVariants = VariantProps<typeof radio>;
export type RadioGroupVariants = VariantProps<typeof radioGroup>;

export type RadioOption = string | { label: Renderable; value: string; disabled?: boolean };

@customElement("ui-radio")
export class UiRadio extends LightElement {
  @property() color: RadioVariants["color"];
  @property() size: RadioVariants["size"];
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;
  @property() direction: RadioGroupVariants["direction"] = "vertical";

  @property({ attribute: false }) options: RadioOption[] = [];
  @property() name = uid("radio");
  @property() value = "";
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;

  @property() label: Renderable = "";
  @property() legend: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  @property({ attribute: "field-surface" }) fieldSurface: FieldsetVariants["surface"];
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
  @property({ attribute: "aria-label" }) ariaLabelText?: string;

  private _input(value: string, checked: boolean, disabled: boolean, aria?: string) {
    return html`<input
      type="radio"
      class=${radio({ color: this.color, size: this.size, validator: this.validator })}
      name=${this.name}
      value=${value}
      .checked=${live(checked)}
      ?disabled=${disabled || this.disabled}
      ?required=${this.required}
      aria-label=${ifDefined(aria)}
      @change=${(e: Event) => {
        const t = e.target as HTMLInputElement;
        if (this.options.length) this.value = t.value;
        else this.checked = t.checked;
      }}
    />`;
  }

  private _labelled(input: unknown, text: Renderable) {
    return html`<label class=${fieldsetLabel({ control: true })}>${input} ${text}</label>`;
  }

  render() {
    let control;
    if (this.options.length) {
      control = html`<div class=${radioGroup({ direction: this.direction })} role="radiogroup">
        ${this.options.map((o) => {
          const opt = typeof o === "string" ? { label: o, value: o, disabled: false } : o;
          return this._labelled(this._input(opt.value, opt.value === this.value, !!opt.disabled), opt.label);
        })}
      </div>`;
    } else {
      const text = this.label || (this.hasContent ? this.slotted() : "");
      const input = this._input(this.value || "on", this.checked, false, text ? undefined : this.ariaLabelText);
      control = text ? this._labelled(input, text) : input;
    }
    return fieldsetField(
      {
        legend: this.legend,
        hint: this.hint,
        validatorHint: this.validatorHint,
        surface: this.fieldSurface,
        width: this.fieldWidth,
      },
      control,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-radio": UiRadio;
  }
}
