import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { tiles } from "../layout/algebra.ts";

/**
 * Progress: how far along work the app is doing right now is (M3 linear progress indicator).
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/progress/
 *
 * Always primary. A measurement (lines ready, checks passed, on-time rate) is a `<ui-gauge>`,
 * not progress.
 */
export const progress = rcva("progress progress-primary", {
  variants: {
    /** Bar width; full by default. */
    width: {
      // Whole tiles (`tiles.*`): 2, 4, 5, 7.
      xs: tiles["2"],
      sm: tiles["4"],
      md: tiles["5"],
      lg: tiles["7"],
      full: "w-full",
    },
  },
  defaultVariants: { width: "full" },
});

export type ProgressVariants = VariantProps<typeof progress>;

/**
 * @example <ui-progress value="40" width="sm"></ui-progress>
 * @example <ui-progress indeterminate width="sm"></ui-progress>
 *
 * Leave `value` unset (or set `indeterminate`) for the animated indeterminate state.
 */
@customElement("ui-progress")
export class UiProgress extends LightElement {
  @property() width: ProgressVariants["width"];
  @property({ type: Number }) value?: number;
  @property({ type: Number }) max = 100;
  /** Behaviour (drops the value), not a style variant. */
  @property({ type: Boolean }) indeterminate = false;
  @property() label?: string;

  render() {
    const value = this.indeterminate ? undefined : this.value;
    return html`<progress
      class=${progress({ width: this.width })}
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
