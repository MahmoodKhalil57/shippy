import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../base/variants.ts";
import { m } from "../../../i18n/index.ts";

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
  @property() label = m.otp_label();
  @property({ converter: booleanAttribute }) required = true;
  @property({ type: Boolean }) disabled = false;
  /** Focus the code as soon as it appears, so typing (or pasting) starts straight away. */
  @property({ type: Boolean, attribute: "focus-on-show" }) focusOnShow = false;

  protected firstUpdated() {
    if (this.focusOnShow) this.querySelector("input")?.focus();
  }

  /**
   * What the code holds of what was typed or pasted: its characters only (digits, unless
   * `alphanumeric`), Arabic-Indic and Persian digits read as 0–9, at most `length`. A letter, a
   * space or a dash never gets in (a pasted "123-456" is 123456).
   */
  static clean(raw: string, length: number, alphanumeric = false) {
    const latin = raw.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => String((d.charCodeAt(0) - 0x0660) % 0x90));
    return latin.replace(alphanumeric ? /[^A-Za-z0-9]/g : /\D/g, "").slice(0, length);
  }

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const clean = UiOtp.clean(input.value, this.length, this.alphanumeric);
    if (clean !== input.value) {
      // Keep the caret where it was, less what was taken out before it.
      const before = UiOtp.clean(
        input.value.slice(0, input.selectionStart ?? input.value.length),
        this.length,
        this.alphanumeric,
      );
      input.value = clean;
      input.setSelectionRange(before.length, before.length);
    }
    this.value = clean;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: this.value }, bubbles: true }));
    if (this.value.length === this.length && input.checkValidity()) {
      this.dispatchEvent(new CustomEvent("ui-complete", { detail: { value: this.value }, bubbles: true }));
    }
  }

  render() {
    const chars = this.alphanumeric ? "[A-Za-z0-9]" : "[0-9]";
    // A code reads left to right in any language: its boxes and its text keep that order.
    return html`<label class=${otp({ joined: this.joined, size: this.size, color: this.color })} dir="ltr">
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
