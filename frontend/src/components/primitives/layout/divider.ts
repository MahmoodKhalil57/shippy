import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Divider: Separates content vertically or horizontally.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/divider/
 *
 * `vertical` (default) separates stacked elements; `horizontal` separates
 * side-by-side elements. Responsive (docs): `direction="lg:horizontal"`.
 */
export const divider = rcva("divider", {
  variants: {
    /** M3: dividers are outline-variant hairlines that group content; no colours. */
    direction: {
      vertical: "divider-vertical",
      horizontal: "divider-horizontal",
    },
    placement: {
      start: "divider-start",
      center: "",
      end: "divider-end",
    },
  },
});

export type DividerVariants = VariantProps<typeof divider>;

/** The value that applies at the smallest width (`"vertical lg:horizontal"` -> `"vertical"`). */
const baseValue = (v: unknown) => (typeof v === "string" ? v.split(/\s+/).find((t) => t && !t.includes(":")) : v);

/**
 * @example <ui-divider>OR</ui-divider>
 * @example <ui-divider direction="horizontal" placement="start"></ui-divider>
 * @example <ui-divider direction="lg:horizontal">OR</ui-divider>
 */
@customElement("ui-divider")
export class UiDivider extends LightElement {
  @property() direction: DividerVariants["direction"];
  @property() placement: DividerVariants["placement"];

  render() {
    const cls = divider({ direction: this.direction, placement: this.placement });
    const orientation = baseValue(this.direction) === "horizontal" ? "vertical" : "horizontal";
    // No whitespace inside the div: daisyUI only adds the gap for a label when
    // the divider is `:not(:empty)` (comments, like Lit's markers, don't count).
    // prettier-ignore
    return html`<div class=${cls} role="separator" aria-orientation=${orientation}>${this.hasContent ? this.content : nothing}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-divider": UiDivider;
  }
}
