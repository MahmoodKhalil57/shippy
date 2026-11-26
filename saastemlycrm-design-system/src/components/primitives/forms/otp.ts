import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../../lib/base/variants.ts";
import { m } from "../../../lib/i18n/index.ts";
import { fieldLabels } from "./fieldset.ts";

export const otp = rcva("otp", {
  variants: {
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

@customElement("ui-otp")
export class UiOtp extends LightElement {
  @property({ converter: responsiveBoolean }) joined: Responsive<boolean> = false;
  @property() size: OtpVariants["size"];
  @property() color: OtpVariants["color"];
  @property({ type: Number }) length = 4;
  @property({ type: Boolean }) alphanumeric = false;
  @property() value = "";
  @property() name?: string;
  @property() label = m.otp_label();
  @property({ converter: booleanAttribute }) required = true;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, attribute: "focus-on-show" }) focusOnShow = false;
  @property({ attribute: "input-id" }) inputId = uid("otp");

  protected firstUpdated() {
    if (this.focusOnShow) this.querySelector("input")?.focus();
  }

  static clean(raw: string, length: number, alphanumeric = false) {
    const latin = raw.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => String((d.charCodeAt(0) - 0x0660) % 0x90));
    return latin.replace(alphanumeric ? /[^A-Za-z0-9]/g : /\D/g, "").slice(0, length);
  }

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const clean = UiOtp.clean(input.value, this.length, this.alphanumeric);
    if (clean !== input.value) {
      const before = UiOtp.clean(input.value.slice(0, input.selectionStart!), this.length, this.alphanumeric);
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
    return html`<label class=${otp({ joined: this.joined, size: this.size, color: this.color })} dir="ltr">
      ${Array.from({ length: this.length }, () => html`<span></span>`)}
      <input
        id=${this.inputId}
        type="text"
        autocomplete="one-time-code"
        inputmode=${this.alphanumeric ? "text" : "numeric"}
        pattern=${`${chars}{${this.length}}`}
        .value=${this.value}
        name=${ifDefined(this.name)}
        aria-label=${ifDefined(fieldLabels(this, this.inputId) ? undefined : this.label)}
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
