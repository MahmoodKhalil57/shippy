import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { tiles } from "../../../styles/algebra.ts";

export const progress = rcva("progress progress-primary", {
  variants: {
    width: {
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

@customElement("ui-progress")
export class UiProgress extends LightElement {
  @property() width: ProgressVariants["width"];
  @property({ type: Number }) value?: number;
  @property({ type: Number }) max = 100;
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
