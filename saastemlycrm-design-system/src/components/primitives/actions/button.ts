import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

export const button = rcva(
  "btn touch-target max-w-full h-auto min-h-(--size) whitespace-normal [text-wrap:balance] active:scale-[0.94] motion-reduce:active:scale-100 active:rounded-[min(var(--radius-sm),var(--radius-field))]",
  {
    variants: {
      variant: {
        filled: "",
        tonal: "btn-ghost state-layer border-transparent",
        outlined: "btn-ghost state-layer border-outline-variant",
        text: "btn-ghost state-layer border-transparent bg-transparent!",
        elevated:
          "btn-ghost state-layer border-transparent bg-surface-container-low! shadow-elevation-1 hover:shadow-elevation-2",
      },
      color: {
        primary: "",
        secondary: "",
        error: "",
      },
      size: {
        xs: "btn-sm",
        sm: "btn-md",
        md: "btn-xl",
      },
      wide: { true: "btn-wide" },
      block: { true: "btn-block" },
      selected: { true: "btn-active rounded-[min(var(--radius-md),var(--radius-field))]" },
      disabled: { true: "btn-disabled" },
      hide: { true: "hidden" },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
      multiline: { true: "h-auto min-h-(--size) py-2 text-start font-normal whitespace-normal" },
    },
    compoundVariants: [
      { variant: "filled", color: "primary", class: "btn-primary" },
      { variant: "filled", color: "secondary", class: "btn-secondary" },
      { variant: "filled", color: "error", class: "btn-error" },
      { variant: "tonal", color: undefined, class: "bg-secondary-container text-on-secondary-container" },
      { variant: "tonal", color: "primary", class: "bg-primary-container text-on-primary-container" },
      { variant: "tonal", color: "secondary", class: "bg-secondary-container text-on-secondary-container" },
      { variant: "tonal", color: "error", class: "bg-error-container text-on-error-container" },
      { variant: ["outlined", "text", "elevated"], color: undefined, class: "text-primary-ink" },
      { variant: ["outlined", "text", "elevated"], color: "primary", class: "text-primary-ink" },
      { variant: ["outlined", "text", "elevated"], color: "secondary", class: "text-secondary-ink" },
      { variant: ["outlined", "text", "elevated"], color: "error", class: "text-error-ink" },
      {
        variant: ["tonal", "outlined", "text"],
        selected: true,
        class: "bg-primary-container! text-on-primary-container!",
      },
    ],
  },
);
export const buttonSpinner = rcva("loading loading-spinner loading-sm");

export type ButtonVariants = VariantProps<typeof button>;

@customElement("ui-button")
export class UiButton extends LightElement {
  @property() color: ButtonVariants["color"];
  @property() variant: ButtonVariants["variant"];
  @property() size: ButtonVariants["size"];
  @property() justify: ButtonVariants["justify"];
  @property({ converter: responsiveBoolean }) wide: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) block: Responsive<boolean> = false;
  @property({ type: Boolean }) toggle = false;
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) multiline = false;
  @property({ converter: responsiveBoolean }) hide: Responsive<boolean> = false;
  @property({ type: Boolean }) disabled = false;
  @property() type: "button" | "submit" | "reset" | "radio" | "checkbox" = "button";
  @property() href?: string;
  @property() target?: string;
  @property() label?: string;
  @property() current?: string;
  @property() name?: string;
  @property() value?: string;
  @property({ type: Boolean }) checked = false;

  render() {
    const variant = this.variant ?? (this.color ? "filled" : "tonal");
    const color = this.color ?? (variant === "filled" ? "primary" : undefined);
    const cls = button({
      color,
      variant,
      size: this.size,
      justify: this.justify,
      wide: this.wide,
      block: this.block,
      selected: this.selected,
      multiline: this.multiline,
      hide: this.hide,
      disabled: this.disabled && !!this.href,
    });
    if (this.type === "radio" || this.type === "checkbox") {
      return html`<input
        class=${cls}
        type=${this.type}
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        aria-label=${ifDefined(this.label)}
        .checked=${live(this.checked)}
        ?disabled=${this.disabled}
        @change=${(e: Event) => (this.checked = (e.target as HTMLInputElement).checked)}
      />`;
    }
    if (this.href) {
      return html`<a
        class=${cls}
        href=${this.href}
        target=${ifDefined(this.target)}
        aria-label=${ifDefined(this.label)}
        aria-current=${ifDefined(this.current)}
        aria-disabled=${ifDefined(this.disabled ? "true" : undefined)}
        tabindex=${ifDefined(this.disabled ? "-1" : undefined)}
        >${this.content}</a
      >`;
    }
    return html`<button
      class=${cls}
      type=${this.type}
      ?disabled=${this.disabled || this.loading}
      aria-busy=${ifDefined(this.loading ? "true" : undefined)}
      aria-label=${ifDefined(this.label)}
      aria-current=${ifDefined(this.current)}
      aria-pressed=${ifDefined(this.toggle ? String(this.selected) : undefined)}
    >
      ${this.loading ? html`<span class=${buttonSpinner()} aria-hidden="true"></span>` : nothing}${this.content}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-button": UiButton;
  }
}
