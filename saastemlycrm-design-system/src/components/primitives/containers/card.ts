import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { cardInset, padEnd, row, text } from "../layout/algebra.ts";
import { badge, type BadgeVariants } from "../data/badge.ts";
import { iconSvg } from "../media/icon.ts";

export const card = rcva("card [&_p]:grow-0", {
  variants: {
    variant: {
      outlined: "card-border border-outline-variant bg-surface",
      filled: "border border-transparent bg-surface-container-highest",
      elevated: "border border-transparent bg-surface-container-low shadow-elevation-1",
    },
    size: {
      xs: `card-sm ${cardInset.xs}`,
      sm: "card-sm",
      md: "card-md [&>.card-body]:[--card-p:clamp(1rem,4cqi,1.5rem)]",
    },
    link: {
      true: "group/card relative [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast),box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),border-color_var(--duration-effects-fast)_var(--ease-effects-fast),outline-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevation-2 motion-reduce:transition-none",
    },
  },
  defaultVariants: { variant: "outlined", size: "md" },
});

export const cardBody = rcva("card-body");
export const cardHeader = rcva(`${row} items-center justify-between gap-x-3 gap-y-1`);
export const cardHeadingGroup = rcva(`${row} items-center gap-2`);
export const cardTitle = rcva("card-title leading-snug tracking-tight", {
  variants: { link: { true: padEnd["6"] } },
});
export const cardTrailing = rcva(`${row} items-center gap-2`);
export const cardSubhead = rcva(`${text.prose} text-body-md text-on-surface-variant`);
export const cardLinkIcon = rcva(
  "pointer-events-none absolute top-4 end-4 text-primary opacity-0 -translate-x-1 [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] group-hover/card:translate-x-0 group-hover/card:opacity-100 group-focus-visible/card:translate-x-0 group-focus-visible/card:opacity-100 motion-reduce:translate-x-0",
);
export const cardActions = rcva("card-actions justify-end");

export type CardVariants = VariantProps<typeof card>;

@customElement("ui-card")
export class UiCard extends LightElement {
  @property() variant: CardVariants["variant"];
  @property() size: CardVariants["size"];
  @property() heading: Renderable = "";
  @property({ type: Number }) count?: number;
  @property({ attribute: "count-tone" }) countTone: BadgeVariants["tone"];
  @property() subhead: Renderable = "";
  @property() href?: string;
  @property({ attribute: "image-src" }) imageSrc?: string;
  @property({ attribute: "image-alt" }) imageAlt = "";

  private _figure() {
    if (this.hasSlotted("figure")) return html`<figure>${this.slotted("figure")}</figure>`;
    if (!this.imageSrc) return nothing;
    return html`<figure><img src=${this.imageSrc} alt=${this.imageAlt} /></figure>`;
  }

  private _header() {
    const title = this.hasSlotted("heading") ? this.slotted("heading") : this.heading;
    const trailing = this.hasSlotted("trailing");
    const count = this.count !== undefined;
    if (!title && !trailing && !count) return nothing;
    return html`<div class=${cardHeader()}>
      <div class=${cardHeadingGroup()}>
        ${title ? html`<h2 class=${cardTitle({ link: !!this.href })}>${title}</h2>` : nothing}
        ${count ? html`<span class=${badge({ kind: "count", tone: this.countTone })}>${this.count}</span>` : nothing}
      </div>
      ${trailing ? html`<div class=${cardTrailing()}>${this.slotted("trailing")}</div>` : nothing}
    </div>`;
  }

  render() {
    const actions = this.hasSlotted("actions")
      ? html`<div class=${cardActions()}>${this.slotted("actions")}</div>`
      : nothing;
    const cls = card({ variant: this.variant, size: this.size, link: !!this.href });
    const inner = html`${this._figure()}
      <div class=${cardBody()}>
        ${this._header()} ${this.subhead ? html`<p class=${cardSubhead()}>${this.subhead}</p>` : nothing}
        ${this.slotted()} ${actions}
      </div>`;
    if (this.href)
      return html`<a href=${this.href} class=${cls}
        >${inner}<span class=${cardLinkIcon()} aria-hidden="true">${iconSvg("arrow-right", { size: "sm" })}</span></a
      >`;
    return html`<div class=${cls}>${inner}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-card": UiCard;
  }
}
