import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Indicator: Places an element on the corner of another element.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/indicator/
 *
 * Default position is top-end. Each indicator is wrapped in an
 * `indicator-item` span, so its content can be any primitive
 * (`<ui-badge>`, `<ui-status>`, `<ui-button>`). Plain-text indicators get a
 * badge look (`badge`). Positions are responsive, e.g. the docs' responsive
 * example: `horizontal="start lg:center xl:end" vertical="sm:middle md:bottom"`.
 */
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
    /** Badge size: `xs` for a count on an icon (tabular, compact). */
    size: {
      xs: "badge-xs h-4 min-w-4 px-1 text-[0.625rem] font-semibold tabular-nums",
    },
    /** Badge look for plain-text indicators (docs "Badge as indicator"). */
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

/**
 * @example
 * <ui-indicator item="new" badge="secondary"><ui-button>Inbox</ui-button></ui-indicator>
 * @example <ui-indicator item="7" badge="warning" size="xs"><ui-icon name="bell"></ui-icon></ui-indicator>
 * @example
 * <ui-indicator horizontal="center" vertical="bottom">
 *   <ui-status slot="item" color="success"></ui-status>
 *   <ui-button>Inbox</ui-button>
 * </ui-indicator>
 * @example
 * <ui-indicator .items=${[{ content: "↖", horizontal: "start", badge: "plain" }, { content: "↘", vertical: "bottom", badge: "plain" }]}>…</ui-indicator>
 *
 * Indicators come from `item` (+ `badge` look when it's text), `slot="item"`
 * children, or `items` (several, each with its own placement).
 */
@customElement("ui-indicator")
export class UiIndicator extends LightElement {
  @property() item: Renderable = "";
  /** Badge look for `item` (default `secondary` when `item` is plain text). */
  @property() badge: IndicatorItemVariants["badge"];
  @property() horizontal: IndicatorItemVariants["horizontal"];
  @property() vertical: IndicatorItemVariants["vertical"];
  /** Size of the `item` badge (`xs`: a count on an icon). */
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
