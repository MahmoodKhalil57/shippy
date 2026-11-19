import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { fieldsetField, fieldsetLabel, type FieldsetVariants } from "./fieldset.ts";

/**
 * Checkbox: Selects or deselects a value.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/checkbox/
 */
export const checkbox = rcva("checkbox", {
  variants: {
    color: {
      neutral: "checkbox-neutral",
      primary: "checkbox-primary",
      secondary: "checkbox-secondary",
      accent: "checkbox-accent",
      info: "checkbox-info",
      success: "checkbox-success",
      warning: "checkbox-warning",
      error: "checkbox-error",
    },
    size: {
      xs: "checkbox-xs",
      sm: "checkbox-sm",
      md: "checkbox-md",
      lg: "checkbox-lg",
      xl: "checkbox-xl",
    },
    validator: { true: "validator" },
  },
});

export type CheckboxVariants = VariantProps<typeof checkbox>;

/**
 * @example <ui-checkbox checked color="primary"></ui-checkbox>
 * @example
 * <ui-checkbox checked label="Remember me" legend="Login options"
 *   field-surface="base-100" field-width="64"></ui-checkbox>
 * @example <ui-checkbox indeterminate></ui-checkbox>
 *
 * Native `change` events bubble out; `checked` / `indeterminate` stay in sync.
 * Authored children are used as the label text when `label` is empty.
 */
@customElement("ui-checkbox")
export class UiCheckbox extends LightElement {
  @property() color: CheckboxVariants["color"];
  @property() size: CheckboxVariants["size"];
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;

  @property({ type: Boolean }) checked = false;
  /** Visual "mixed" state; cleared by the next user click. */
  @property({ type: Boolean }) indeterminate = false;
  @property() name?: string;
  @property() value = "on";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;

  /** Text next to the box (wraps both in `<label class="label">`). */
  @property() label: Renderable = "";
  /** Put the label text before the box instead of after it. */
  @property({ attribute: "label-start", type: Boolean }) labelStart = false;
  @property() legend: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  /** Look of the wrapping fieldset (rendered when legend / hint are set). */
  @property({ attribute: "field-surface" }) fieldSurface: FieldsetVariants["surface"];
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
  @property({ attribute: "aria-label" }) ariaLabelText?: string;

  @query("input") input!: HTMLInputElement;

  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  private _onChange(e: Event) {
    const t = e.target as HTMLInputElement;
    this.checked = t.checked;
    this.indeterminate = t.indeterminate;
  }

  render() {
    const text = this.label || (this.hasContent ? this.slotted() : "");
    const box = html`<input
      type="checkbox"
      class=${checkbox({ color: this.color, size: this.size, validator: this.validator })}
      name=${ifDefined(this.name)}
      value=${this.value}
      .checked=${live(this.checked)}
      .indeterminate=${live(this.indeterminate)}
      ?disabled=${this.disabled}
      ?required=${this.required}
      aria-label=${ifDefined(text ? undefined : this.ariaLabelText)}
      @change=${this._onChange}
    />`;
    const control = text
      ? html`<label class=${fieldsetLabel({ control: true })}>
          ${this.labelStart ? text : nothing} ${box} ${this.labelStart ? nothing : text}
        </label>`
      : box;
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
    "ui-checkbox": UiCheckbox;
  }
}
