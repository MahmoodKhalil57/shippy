import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

export const divider = rcva("divider", {
  variants: {
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

const baseValue = (v: unknown) => (typeof v === "string" ? v.split(/\s+/).find((t) => t && !t.includes(":")) : v);

@customElement("ui-divider")
export class UiDivider extends LightElement {
  @property() direction: DividerVariants["direction"];
  @property() placement: DividerVariants["placement"];

  render() {
    const cls = divider({ direction: this.direction, placement: this.placement });
    const orientation = baseValue(this.direction) === "horizontal" ? "vertical" : "horizontal";
    // prettier-ignore
    return html`<div class=${cls} role="separator" aria-orientation=${orientation}>${this.hasContent ? this.content : nothing}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-divider": UiDivider;
  }
}
