import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Loading: something is on its way (M3 loading and progress indicators; Apple progress indicators).
 *
 * Purpose: Feedback & system status · Kind: primitive
 *
 * Two kinds, nothing decorative (M3: "never simply decorative"):
 *   spinner   a small indeterminate wait inside a control or a line of text (a button, a row)
 *   morph     M3 Expressive's loading indicator, for a wait of a few seconds over a page or a
 *             card (use `<ui-empty-state loading>` for a whole page); with Reduce motion it pulses
 * At least 24dp (`sm`) except inside a small control. It takes the text colour around it, or the
 * primary colour. When the progress is known, show `<ui-progress>` instead (Apple: prefer a
 * determinate indicator). `label` is what's announced; say what's happening ("Reading the case").
 */
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

/**
 * @example <ui-loading size="sm"></ui-loading>
 * @example <ui-loading variant="morph" size="lg" color="primary" label="Loading the page"></ui-loading>
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
