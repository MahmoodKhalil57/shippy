import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { fixed, tiles } from "../layout/algebra.ts";
import { fieldsetField, type FieldsetVariants } from "./fieldset.ts";
import { label as labelRecipe } from "./label.ts";

/**
 * Select: Picks a value from a list of options.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/select/
 */
/** The options picker floats over the page, so it is liquid glass (src/styles/theme.css). */
/**
 * The open list (`::picker(select)`) is frosted glass for every select in the app, set once in
 * src/styles/daisy-m3.css: here the class sits on a wrapping label, where `::picker` can't reach.
 */
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
    /** Use the OS-native options dropdown instead of daisyUI's styled picker. */
    native: { true: "appearance-none" },
    validator: { true: "validator" },
    width: {
      auto: "w-auto",
      // Whole tiles (`tiles.*`): 5, 6, 7, 8, 10 (the old 16, 20, 24, 28, 32rem, to the nearest tile).
      "64": tiles["5"],
      xs: tiles["6"],
      sm: tiles["7"],
      md: tiles["8"],
      lg: tiles["10"],
      full: "w-full",
    },
    /** Max height of the options picker (the docs' "custom dropdown height" uses `max-h-26`). */
    pickerHeight: {
      // Whole tiles down: 2, 3, 4, 6 (the old 104, 160, 240, 320px, to the nearest tile).
      "26": "[&_select::picker(select)]:max-h-[calc(2_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(2_*_var(--tile-h))]",
      "40": "[&_select::picker(select)]:max-h-[calc(3_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(3_*_var(--tile-h))]",
      "60": "[&_select::picker(select)]:max-h-[calc(4_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(4_*_var(--tile-h))]",
      "80": "[&_select::picker(select)]:max-h-[calc(6_*_var(--tile-h))] [&::picker(select)]:max-h-[calc(6_*_var(--tile-h))]",
    },
  },
});

/**
 * Inline label text when `select` is on a wrapping `<label>` (e.g. "Sort"): the name in the
 * secondary ink, then the value, as one phrase (no divider between them: src/styles/daisy-m3.css).
 */
export const selectAdornment = rcva("label text-on-surface-variant");

export type SelectVariants = VariantProps<typeof select>;

/**
 * An option's colour dot (in the open list and in the field once chosen): a status's `tone`, or a
 * category's `hue` (the chart palette's slot, its place in the field's options).
 */
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
      /** A status's tone: its dot. */
      tone?: "neutral" | "primary" | "info" | "success" | "warning" | "error";
      /** A category's hue slot (0–5): its dot. */
      hue?: number;
    };

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
  /** The accessible name when there's no visible label (a field in a table row). */
  @property({ attribute: "aria-label" }) ariaLabelText?: string;
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
        aria-label=${ifDefined(this.ariaLabelText ?? (!this.label && !this.legend ? (this.leading ?? this.placeholder) : undefined))}
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
