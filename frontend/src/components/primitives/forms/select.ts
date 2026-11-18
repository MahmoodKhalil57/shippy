import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { fieldsetField, type FieldsetVariants } from "./fieldset.ts";
import { label as labelRecipe } from "./label.ts";

/**
 * Select: Picks a value from a list of options.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/select/
 */
export const select = rcva("select", {
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
    /** Use the OS-native options dropdown instead of daisyUI's styled picker. */
    native: { true: "appearance-none" },
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
    /** Max height of the options picker (the docs' "custom dropdown height" uses `max-h-26`). */
    pickerHeight: {
      "26": "[&::picker(select)]:max-h-26",
      "40": "[&::picker(select)]:max-h-40",
      "60": "[&::picker(select)]:max-h-60",
      "80": "[&::picker(select)]:max-h-80",
    },
  },
});

/** Inline label text when `select` is on a wrapping `<label>` (e.g. "Type"). */
export const selectAdornment = rcva("label");

export type SelectVariants = VariantProps<typeof select>;

export type SelectOption = string | { label: string; value?: string; disabled?: boolean };

/**
 * @example
 * <ui-select placeholder="Pick a browser" .options=${["Chrome", "Firefox", "Safari"]}
 *   legend="Browsers" hint="Optional"></ui-select>
 * @example <ui-select leading="Type" .options=${["Personal", "Business"]}></ui-select>
 * @example
 * <ui-select color="primary"><option>VScode</option><option>Zed</option></ui-select>
 *
 * Without `options`, authored `<option>` / `<optgroup>` children are used.
 * Limit the picker height with `picker-height="26"`; responsive sizes work
 * like everywhere else (`size="xs sm:sm md:md lg:lg xl:xl"`).
 * Native `change` events bubble out; `value` stays in sync.
 */
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
  /** Disabled first option shown until a value is picked. */
  @property() placeholder?: string;
  @property() name?: string;
  @property() value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property() autocomplete?: string;
  /** Inline label inside a `label.select` wrapper. */
  @property() leading?: string;

  @property() legend: Renderable = "";
  @property() label: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "validator-hint" }) validatorHint: Renderable = "";
  @property({ type: Boolean, attribute: "hint-on-invalid" }) hintOnInvalid = false;
  @property({ type: Boolean }) floating = false;
  /** Look of the wrapping fieldset (rendered when legend / label / hint are set). */
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

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    // Applied after options exist (property bindings on <select> run before its children render).
    if (this.select && this.value && this.select.value !== this.value) this.select.value = this.value;
    if (this.select && !this.value) this.value = this.select.value;
  }

  private _options() {
    if (!this.options.length) return this.content;
    return this.options.map((o) => {
      const opt = typeof o === "string" ? { label: o, value: o } : { ...o, value: o.value ?? o.label };
      return html`<option value=${opt.value} ?disabled=${!!opt.disabled} ?selected=${opt.value === this.value}>
        ${opt.label}
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
        aria-label=${ifDefined(!this.label && !this.legend ? (this.leading ?? this.placeholder) : undefined)}
        @change=${(e: Event) => (this.value = (e.target as HTMLSelectElement).value)}
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
