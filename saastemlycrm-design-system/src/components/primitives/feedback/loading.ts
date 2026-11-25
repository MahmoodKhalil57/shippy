import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { m } from "../../../i18n/index.ts";

export const loading = rcva("loading", {
  variants: {
    variant: {
      spinner: "loading-spinner",
      morph:
        "[mask-image:none]! rounded-full bg-current [animation:m3-morph_calc(var(--duration-spatial)*4)_infinite] motion-reduce:[animation:m3-pulse_var(--duration-extra-long4)_var(--ease-standard)_infinite]",
    },
    size: {
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
      xl: "loading-xl",
    },
    color: {
      primary: "text-primary",
    },
  },
  defaultVariants: { variant: "spinner" },
});

export type LoadingVariants = VariantProps<typeof loading>;

@customElement("ui-loading")
export class UiLoading extends LightElement {
  @property() variant: LoadingVariants["variant"] = "spinner";
  @property() size: LoadingVariants["size"];
  @property() color: LoadingVariants["color"];
  @property() label = m.loading_label();

  render() {
    return html`<span
      class=${loading({ variant: this.variant, size: this.size, color: this.color })}
      role="status"
      aria-label=${this.label}
    ></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-loading": UiLoading;
  }
}
