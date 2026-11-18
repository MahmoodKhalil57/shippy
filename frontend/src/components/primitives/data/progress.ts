import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Progress: Progress bar for a task or the passing of time.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/progress/
 *
 * All variants are responsive (e.g. `width="full md:sm"`).
 */
export const progress = rcva("progress", {
  variants: {
    color: {
      neutral: "progress-neutral",
      primary: "progress-primary",
      secondary: "progress-secondary",
      accent: "progress-accent",
      info: "progress-info",
      success: "progress-success",
      warning: "progress-warning",
      error: "progress-error",
    },
    /** Bar width. daisyUI's default is the full container width; the docs use `sm` (w-56). */
    width: {
      xs: "w-32",
      sm: "w-56",
      md: "w-72",
      lg: "w-96",
      full: "w-full",
    },
  },
});

export type ProgressVariants = VariantProps<typeof progress>;

/**
 * @example <ui-progress value="40" color="primary" width="sm"></ui-progress>
 * @example <ui-progress indeterminate width="sm"></ui-progress>
 *
 * Leave `value` unset (or set `indeterminate`) for the animated indeterminate state.
 */
@customElement("ui-progress")
export class UiProgress extends LightElement {
  @property() color: ProgressVariants["color"];
  @property() width: ProgressVariants["width"];
  @property({ type: Number }) value?: number;
  @property({ type: Number }) max = 100;
  /** Behaviour (drops the value), not a style variant. */
  @property({ type: Boolean }) indeterminate = false;
  @property() label?: string;

  render() {
    const value = this.indeterminate ? undefined : this.value;
    return html`<progress
      class=${progress({ color: this.color, width: this.width })}
      value=${ifDefined(value)}
      max=${this.max}
      aria-label=${ifDefined(this.label)}
    ></progress>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-progress": UiProgress;
  }
}
