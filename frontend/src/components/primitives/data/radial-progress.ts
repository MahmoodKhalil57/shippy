import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Radial progress: Circular progress indicator for a task or the passing of time.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/radial-progress/
 *
 * Driven by CSS variables: `--value` (0–100), `--size`, `--thickness`.
 * `color` tints the ring (docs: "Custom color"); `filled="<color>"` gives the
 * docs' "With background color and border" look. `size` / `thickness` are
 * design-token steps (the docs' `--size:12rem` is `2xl`, `--thickness:2px` is
 * `xs`, `2rem` is `xl`). All variants are responsive.
 */
export const radialProgress = rcva("radial-progress", {
  variants: {
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
    filled: {
      neutral: "bg-neutral text-neutral-content border-4 border-neutral",
      primary: "bg-primary text-primary-content border-4 border-primary",
      secondary: "bg-secondary text-secondary-content border-4 border-secondary",
      accent: "bg-accent text-accent-content border-4 border-accent",
      info: "bg-info text-info-content border-4 border-info",
      success: "bg-success text-success-content border-4 border-success",
      warning: "bg-warning text-warning-content border-4 border-warning",
      error: "bg-error text-error-content border-4 border-error",
    },
    /** Diameter (daisyUI's default is 5rem = `md`). */
    size: {
      xs: "[--size:3rem]",
      sm: "[--size:4rem]",
      md: "[--size:5rem]",
      lg: "[--size:6rem]",
      xl: "[--size:8rem]",
      "2xl": "[--size:12rem]",
    },
    /** Ring width (daisyUI's default is 10% of the size). */
    thickness: {
      xs: "[--thickness:2px]",
      sm: "[--thickness:4px]",
      md: "[--thickness:0.5rem]",
      lg: "[--thickness:1rem]",
      xl: "[--thickness:2rem]",
    },
  },
});

export type RadialProgressVariants = VariantProps<typeof radialProgress>;

/**
 * @example <ui-radial-progress value="70" color="primary"></ui-radial-progress>
 * @example <ui-radial-progress value="70" filled="primary"></ui-radial-progress>
 * @example <ui-radial-progress value="70" size="2xl" thickness="xs"></ui-radial-progress>
 *
 * The label defaults to `{value}%`; authored children replace it.
 */
@customElement("ui-radial-progress")
export class UiRadialProgress extends LightElement {
  /** 0–100. */
  @property({ type: Number }) value = 0;
  @property() color: RadialProgressVariants["color"];
  /** Filled background + border in this colour. */
  @property() filled: RadialProgressVariants["filled"];
  @property() size: RadialProgressVariants["size"];
  @property() thickness: RadialProgressVariants["thickness"];

  render() {
    const value = Math.min(100, Math.max(0, this.value));
    // `--value` is data (the progress), not styling.
    const vars = { "--value": String(value) };
    return html`<div
      class=${radialProgress({ color: this.color, filled: this.filled, size: this.size, thickness: this.thickness })}
      style=${styleMap(vars)}
      role="progressbar"
      aria-valuenow=${value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      ${this.hasContent ? this.content : `${value}%`}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-radial-progress": UiRadialProgress;
  }
}
