import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";

export const indicator = rcva("indicator");

export const indicatorItem = rcva("indicator-item", {
  variants: {
    horizontal: {
      start: "indicator-start",
      center: "indicator-center",
      end: "indicator-end",
    },
    vertical: {
      top: "indicator-top",
      middle: "indicator-middle",
      bottom: "indicator-bottom",
    },
    size: {
      xs: "badge-xs h-4 min-w-4 px-1 text-label-sm font-semibold tabular-nums",
    },
    badge: {
      plain: "badge",
      neutral: "badge badge-neutral",
      primary: "badge badge-primary",
      secondary: "badge badge-secondary",
      accent: "badge badge-accent",
      info: "badge badge-info",
      success: "badge badge-success",
      warning: "badge badge-warning",
      error: "badge badge-error",
    },
  },
});

export type IndicatorItemVariants = VariantProps<typeof indicatorItem>;

export interface IndicatorItem extends IndicatorItemVariants {
  content: Renderable;
}

@customElement("ui-indicator")
export class UiIndicator extends LightElement {
  @property() item: Renderable = "";
  @property() badge: IndicatorItemVariants["badge"];
  @property() horizontal: IndicatorItemVariants["horizontal"];
  @property() vertical: IndicatorItemVariants["vertical"];
  @property() size: IndicatorItemVariants["size"];
  @property({ attribute: false }) items: IndicatorItem[] = [];

  render() {
    const pos = { horizontal: this.horizontal, vertical: this.vertical };
    const text = typeof this.item === "string" || typeof this.item === "number";
    return html`<div class=${indicator()}>
      ${
        this.item
          ? html`<span
              class=${indicatorItem({ ...pos, size: this.size, badge: this.badge ?? (text ? "secondary" : undefined) })}
              >${this.item}</span
            >`
          : ""
      }
      ${this.slottedNodes("item").map((n) => html`<span class=${indicatorItem(pos)}>${n}</span>`)}
      ${repeat(
        this.items,
        (_, i) => i,
        ({ content, ...v }) => html`<span class=${indicatorItem(v)}>${content}</span>`,
      )}
      ${this.slotted()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-indicator": UiIndicator;
  }
}
