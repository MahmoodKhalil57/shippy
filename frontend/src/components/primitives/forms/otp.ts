import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../base/variants.ts";

/**
 * OTP: Input for verification codes (usually 4 to 6 digits), e.g. for 2FA.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/otp/
 *
 * Markup: a `<label class="otp">` with one empty `<span>` per character box
 * followed by a single text input that holds the whole code. All variants are
 * responsive (e.g. `size="sm md:lg"`, `joined="md"`).
 */
export const otp = rcva("otp", {
  variants: {
    /** Connect the character boxes together. */
    joined: { true: "otp-joined" },
    size: {
      xs: "otp-xs",
      sm: "otp-sm",
      md: "otp-md",
      lg: "otp-lg",
      xl: "otp-xl",
    },
    color: {
      neutral: "otp-neutral",
      primary: "otp-primary",
      secondary: "otp-secondary",
      accent: "otp-accent",
      success: "otp-success",
      info: "otp-info",
      warning: "otp-warning",
      error: "otp-error",
    },
  },
});

export type OtpVariants = VariantProps<typeof otp>;

/**
 * @example <ui-otp name="code" length="6" color="primary" joined></ui-otp>
 *
 * Native `input`/`change` bubble out. `ui-change` carries `{ value }` on every
 * edit and `ui-complete` fires once all `length` characters are entered.
 */
@customElement("ui-otp")
export class UiOtp extends LightElement {
  @property({ converter: responsiveBoolean }) joined: Responsive<boolean> = false;
  @property() size: OtpVariants["size"];
  @property() color: OtpVariants["color"];
  @property({ type: Number }) length = 4;
  /** Accept letters as well as digits (digits only by default). */
  @property({ type: Boolean }) alphanumeric = false;
  @property() value = "";
  @property() name?: string;
  @property() label = "One-time code";
  @property({ converter: booleanAttribute }) required = true;
  @property({ type: Boolean }) disabled = false;
  /** Focus the code as soon as it appears, so typing (or pasting) starts straight away. */
  @property({ type: Boolean, attribute: "focus-on-show" }) focusOnShow = false;

  protected firstUpdated() {
    if (this.focusOnShow) this.querySelector("input")?.focus();
  }

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: this.value }, bubbles: true }));
    if (this.value.length === this.length && input.checkValidity()) {
      this.dispatchEvent(new CustomEvent("ui-complete", { detail: { value: this.value }, bubbles: true }));
    }
  }

  render() {
    const chars = this.alphanumeric ? "[A-Za-z0-9]" : "[0-9]";
    return html`<label class=${otp({ joined: this.joined, size: this.size, color: this.color })}>
      ${Array.from({ length: this.length }, () => html`<span></span>`)}
      <input
        type="text"
        autocomplete="one-time-code"
        inputmode=${this.alphanumeric ? "text" : "numeric"}
        maxlength=${this.length}
        pattern=${`${chars}{${this.length}}`}
        .value=${this.value}
        name=${ifDefined(this.name)}
        aria-label=${this.label}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @input=${this._onInput}
      />
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-otp": UiOtp;
  }
}
