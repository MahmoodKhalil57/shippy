import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { card, cardBody, cardLinkIcon } from "../containers/card.ts";
import { stack, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Stat: one key figure — what it is, the number, a line of context, and optionally its trend
 * (Apple: "gauges" / large-title numerals; M3: display / headline type for numerals).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * Drawn as a small outlined card (the same as `<ui-card size="sm">`), so a row of stats sits
 * beside cards without a seam. `tone` colours the value when it means something (overdue,
 * on target), in the tone's readable ink. With `href` the whole stat opens the list behind it.
 * Put a sparkline in the `trend` slot (`<ui-chart kind="spark" slot="trend">`).
 */
export const statLabel = rcva(`${text.line} text-body-md text-on-surface-variant`);
export const statValue = rcva(`${text.label} tabular-nums`, {
  variants: {
    size: { md: "text-headline-sm", lg: "text-headline-md" },
    tone: {
      neutral: "text-on-surface",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
      info: "text-info-ink",
      primary: "text-primary-ink",
    },
  },
  defaultVariants: { size: "md", tone: "neutral" },
});
export const statNote = rcva(`${text.label} line-clamp-2 text-body-sm text-on-surface-variant`);
export const statText = rcva(`${stack} min-w-0 gap-1`);

export type StatVariants = VariantProps<typeof statValue>;

/**
 * @example <ui-stat label="Overdue" .value=${"USD 96,400"} note="2 invoices · oldest 12 days" tone="error"></ui-stat>
 * @example
 * <ui-stat label="Awaiting supplier" .value=${2} note="1 request awaiting reply" href="/collections/orders" size="lg">
 *   <ui-chart slot="trend" kind="spark" …></ui-chart>
 * </ui-stat>
 */
@customElement("ui-stat")
export class UiStat extends LightElement {
  @property() label: Renderable = "";
  @property() value: Renderable = "";
  @property() note: Renderable = "";
  @property() tone: StatVariants["tone"];
  /** `lg` for the page's headline figures. */
  @property() size: StatVariants["size"];
  /** The whole stat links to the records behind the figure. */
  @property() href?: string;

  render() {
    const body = html`<div class=${cardBody()}>
      <div class=${statText()}>
        <p class=${statLabel()}>${this.label}</p>
        <p class=${statValue({ size: this.size, tone: this.tone })}>${this.value}</p>
        ${this.note ? html`<p class=${statNote()}>${this.note}</p>` : nothing}
      </div>
      ${this.slotted("trend")}
    </div>`;
    const cls = card({ variant: "outlined", size: "sm", link: !!this.href });
    return this.href
      ? html`<a href=${this.href} class=${cls}
          >${body}<span class=${cardLinkIcon()} aria-hidden="true">${iconSvg("arrow-right", { size: "sm" })}</span></a
        >`
      : html`<div class=${cls}>${body}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-stat": UiStat;
  }
}
