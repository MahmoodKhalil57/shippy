import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";
import { fixed, tiles } from "../../../styles/algebra.ts";
import { fieldLabels, fieldsetField, legendLabel, type FieldsetVariants } from "./fieldset.ts";
import { label as labelRecipe } from "./label.ts";

export const select = rcva("select min-w-0", {
  variants: {
    color: {
      neutral: "select-neutral",
      primary: "select-primary",
      secondary: "select-secondary",
      accent: "select-accent",
      info: "select-info",
      success: "select-success",
      warning: "select-warning",
      error: "select-error",
    },
    variant: {
      ghost: "select-ghost",
    },
    size: {
      xs: "select-xs",
      sm: "select-sm",
      md: "select-md",
      lg: "select-lg",
      xl: "select-xl",
    },
    native: { true: "appearance-none" },
    validator: { true: "validator" },
    width: {
      auto: "w-auto",
      "64": tiles["5"],
      xs: tiles["6"],
      sm: tiles["7"],
      md: tiles["8"],
      lg: tiles["10"],
      full: "w-full",
    },
    pickerHeight: {
      "26": "[&_select::picker(select)]:max-h-[calc(2_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(2_*_var(--tile-h))]",
      "40": "[&_select::picker(select)]:max-h-[calc(3_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(3_*_var(--tile-h))]",
      "60": "[&_select::picker(select)]:max-h-[calc(4_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(4_*_var(--tile-h))]",
      "80": "[&_select::picker(select)]:max-h-[calc(6_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(6_*_var(--tile-h))]",
    },
  },
});

export const selectAdornment = rcva("label text-on-surface-variant");

export type SelectVariants = VariantProps<typeof select>;

export const selectDot = rcva(`${fixed["2.5"]} inline-block rounded-full align-middle`, {
  variants: {
    tone: {
      neutral: "bg-outline",
      primary: "bg-primary",
      info: "bg-info",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
    },
    hue: {
      "0": "bg-chart-1",
      "1": "bg-chart-2",
      "2": "bg-chart-3",
      "3": "bg-chart-4",
      "4": "bg-chart-5",
      "5": "bg-chart-6",
    },
  },
});

export type SelectOption =
  | string
  | {
      label: string;
      value?: string;
      disabled?: boolean;
      tone?: "neutral" | "primary" | "info" | "success" | "warning" | "error";
      hue?: number;
    };

@customElement("ui-select")
export class UiSelect extends LightElement {
  @property() color: SelectVariants["color"];
  @property() variant: SelectVariants["variant"];
  @property() size: SelectVariants["size"];
  @property() width: SelectVariants["width"];
  @property({ attribute: "picker-height" }) pickerHeight: SelectVariants["pickerHeight"];
  @property({ converter: responsiveBoolean }) native: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;

  @property({ attribute: false }) options: SelectOption[] = [];
  @property() placeholder?: string;
  @property({ attribute: "aria-label" }) ariaLabelText?: string;
  @property() name?: string;
  @property() value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) readonly = false;
  @property() autocomplete?: string;
  @property() leading?: string;

  @property() legend: Renderable = "";
  @property() label: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  @property({ type: Boolean, attribute: "hint-on-invalid" }) hintOnInvalid = false;
  @property({ type: Boolean }) floating = false;
  @property({ attribute: "field-surface" }) fieldSurface: FieldsetVariants["surface"];
  @property({ attribute: "field-width" }) fieldWidth: FieldsetVariants["width"];
  @property({ attribute: "input-id" }) inputId = uid("select");

  @query("select") select!: HTMLSelectElement;

  focus(options?: FocusOptions) {
    this.select?.focus(options);
  }
  checkValidity() {
    return this.select?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.select?.reportValidity() ?? true;
  }

  get selectedValue() {
    return this.select?.value ?? this.value;
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    if (this.value && this.select.value !== this.value) this.select.value = this.value;
    this.#shown = this.select.value;
  }

  #shown = "";
  private _onChange = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    if (this.readonly) {
      el.value = this.#shown;
      e.stopImmediatePropagation();
      return;
    }
    this.value = el.value;
  };

  private _options() {
    if (!this.options.length) return this.content;
    return this.options.map((o) => {
      const opt = typeof o === "string" ? { label: o, value: o } : { ...o, value: o.value ?? o.label };
      const dot =
        opt.tone || opt.hue != null
          ? html`<span
              class=${selectDot({
                tone: opt.tone,
                hue: opt.hue == null ? undefined : (String(((opt.hue % 6) + 6) % 6) as "0"),
              })}
              aria-hidden="true"
            ></span>`
          : nothing;
      return html`<option value=${opt.value} ?disabled=${!!opt.disabled} ?selected=${opt.value === this.value}>
        ${dot}${opt.label}
      </option>`;
    });
  }

  render() {
    const cls = select({
      color: this.color,
      variant: this.variant,
      size: this.size,
      native: this.native,
      validator: this.validator,
      width: this.width,
      pickerHeight: this.pickerHeight,
    });
    const field = (c: string | undefined) =>
      html`<select
        id=${this.inputId}
        class=${ifDefined(c)}
        name=${ifDefined(this.name)}
        autocomplete=${ifDefined(this.autocomplete)}
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-readonly=${this.readonly ? "true" : nothing}
        aria-label=${ifDefined(
          this.ariaLabelText ??
            (this.label || this.legend || fieldLabels(this, this.inputId)
              ? undefined
              : (this.leading ?? this.placeholder)),
        )}
        aria-labelledby=${ifDefined(
          this.ariaLabelText
            ? undefined
            : legendLabel({ legend: this.legend, label: this.label, controlId: this.inputId }),
        )}
        @change=${this._onChange}
      >
        ${
          this.placeholder
            ? html`<option disabled value="" ?selected=${!this.value}>${this.placeholder}</option>`
            : nothing
        }
        ${this._options()}
      </select>`;

    let control = this.leading
      ? html`<label class=${cls}><span class=${selectAdornment()}>${this.leading}</span>${field(undefined)}</label>`
      : field(cls);

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
    "ui-select": UiSelect;
  }
}
