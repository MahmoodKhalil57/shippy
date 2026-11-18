import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { fieldsetField, fieldsetLabel, type FieldsetVariants } from "./fieldset.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Toggle: Checkbox styled as a switch.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/toggle/
 *
 * `toggle` goes on the checkbox itself, or on a `<label>` that wraps the
 * checkbox plus two icons (first = checked, second = unchecked).
 */
export const toggle = rcva("toggle", {
  variants: {
    color: {
      neutral: "toggle-neutral",
      primary: "toggle-primary",
      secondary: "toggle-secondary",
      accent: "toggle-accent",
      info: "toggle-info",
      success: "toggle-success",
      warning: "toggle-warning",
      error: "toggle-error",
    },
    size: {
      xs: "toggle-xs",
      sm: "toggle-sm",
      md: "toggle-md",
      lg: "toggle-lg",
      xl: "toggle-xl",
    },
    validator: { true: "validator" },
    /** `label.toggle` wrapping the checkbox + two icons (the docs' icons example). */
    icons: { true: "text-base-content" },
  },
});

export type ToggleVariants = VariantProps<typeof toggle>;

const toggleIconOn = iconSvg("check", {}, { label: "enabled", class: "" });
const toggleIconOff = iconSvg("x", {}, { label: "disabled", class: "" });

/**
 * @example <ui-toggle checked color="success" size="lg"></ui-toggle>
 * @example <ui-toggle checked label="Remember me" legend="Login options" field-surface="base-100" field-width="64"></ui-toggle>
 * @example <ui-toggle icons></ui-toggle>
 * @example
 * <ui-toggle icons><svg slot="on" …></svg><svg slot="off" …></svg></ui-toggle>
 *
 * Native `change` events bubble out; `checked` / `indeterminate` stay in sync.
 */
@customElement("ui-toggle")
export class UiToggle extends LightElement {
  @property() color: ToggleVariants["color"];
  @property() size: ToggleVariants["size"];
  @property({ converter: responsiveBoolean }) validator: Responsive<boolean> = false;

  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) indeterminate = false;
  @property() name?: string;
  @property() value = "on";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  /** Show check / cross icons inside the knob (or `slot="on"` / `slot="off"` icons). */
  @property({ type: Boolean }) icons = false;

  @property() label: Renderable = "";
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
    const cls = toggle({ color: this.color, size: this.size, validator: this.validator, icons: this.icons });
    const text = this.label || (this.hasContent ? this.slotted() : "");
    const input = (c: string | undefined) =>
      html`<input
        type="checkbox"
        class=${ifDefined(c)}
        name=${ifDefined(this.name)}
        value=${this.value}
        .checked=${live(this.checked)}
        .indeterminate=${live(this.indeterminate)}
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-label=${ifDefined(text ? undefined : this.ariaLabelText)}
        @change=${this._onChange}
      />`;

    const sw = this.icons
      ? html`<label class=${cls}>
          ${input(undefined)} ${this.hasSlotted("on") ? this.slotted("on") : toggleIconOn}
          ${this.hasSlotted("off") ? this.slotted("off") : toggleIconOff}
        </label>`
      : input(cls);

    const control = text
      ? html`<label class=${fieldsetLabel({ control: true })}>
          ${this.labelStart ? text : nothing} ${sw} ${this.labelStart ? nothing : text}
        </label>`
      : sw;
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
    "ui-toggle": UiToggle;
  }
}
