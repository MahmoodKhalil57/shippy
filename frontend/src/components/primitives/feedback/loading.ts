import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Loading: Animation indicating that something is loading.
 *
 * Purpose: Feedback & system status · Kind: primitive
 * Docs: https://daisyui.com/components/loading/
 */
export const loading = rcva("loading", {
  variants: {
    variant: {
      spinner: "loading-spinner",
      dots: "loading-dots",
      ring: "loading-ring",
      ball: "loading-ball",
      bars: "loading-bars",
      infinity: "loading-infinity",
    },
    size: {
      xs: "loading-xs",
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
      xl: "loading-xl",
    },
    /** The docs colour loaders with text-* utilities. */
    color: {
      neutral: "text-neutral",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
  },
  defaultVariants: { variant: "spinner" },
});

export type LoadingVariants = VariantProps<typeof loading>;

/**
 * @example <ui-loading variant="dots" size="lg" color="primary"></ui-loading>
 *
 * Children are ignored. `label` is announced to screen readers.
 */
@customElement("ui-loading")
export class UiLoading extends LightElement {
  @property() variant: LoadingVariants["variant"] = "spinner";
  @property() size: LoadingVariants["size"];
  @property() color: LoadingVariants["color"];
  @property() label = "Loading";

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
