import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { badge, type BadgeVariants } from "../data/badge.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Card: one subject's content and actions, set apart from the page (M3 cards).
 *
 * Purpose: Content containers & disclosure · Kind: primitive
 *
 * Three variants, chosen by how much the card should stand apart, nothing else (M3):
 *   outlined   a hairline (outline-variant) on the surface; the default and the right choice for
 *              most dashboard content
 *   filled     the strongest container tone, no line: a prompt, a highlighted option, a "next step"
 *   elevated   a lifted surface (+1): a card that sits over busy content
 * The header is built in: `heading`, an optional `count` (a badge after it), `subhead` (a line of
 * supporting text) and a `trailing` slot at the end of the header row for a tag, a link or one
 * or two small actions. Don't put cards inside cards (M3: use spacing, headlines or dividers).
 * With `href` the whole card is a link: it lifts a level on hover, its edge picks up the primary
 * colour and an arrow slides in.
 *
 * daisyUI grows every `<p>` in a card (`.card p { flex-grow: 1 }`); ours stay their natural height.
 */
export const card = rcva("card [&_p]:grow-0", {
  variants: {
    variant: {
      outlined: "card-border border-outline-variant bg-surface",
      filled: "border border-transparent bg-surface-container-highest",
      elevated: "border border-transparent bg-surface-container-low shadow-elevation-1",
    },
    size: {
      sm: "card-sm",
      md: "card-md",
    },
    /**
     * The whole card is a link (`href`): on hover it lifts a level on a spring, its edge picks up
     * the primary colour, and an arrow slides in at its top corner (`cardLinkIcon`); it shows
     * keyboard focus as a ring.
     */
    link: {
      true: "group/card relative [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast),box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),border-color_var(--duration-effects-fast)_var(--ease-effects-fast),outline-color_var(--duration-effects-fast)_var(--ease-effects-fast)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevation-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
    },
  },
  defaultVariants: { variant: "outlined" },
});

export const cardBody = rcva("card-body");
/** The header row: the heading (and count) at the start, the trailing items at the end. */
export const cardHeader = rcva("flex flex-wrap items-center justify-between gap-x-3 gap-y-1");
export const cardHeadingGroup = rcva("flex min-w-0 items-center gap-2");
/** The title: tight, and clear of the link arrow on link cards. */
export const cardTitle = rcva("card-title leading-snug tracking-tight", {
  variants: { link: { true: "pe-6" } },
});
export const cardTrailing = rcva("flex flex-wrap items-center gap-2");
export const cardSubhead = rcva("text-body-md text-on-surface-variant");
/** A link card's arrow: hidden until the card is hovered or focused, then slides in. */
export const cardLinkIcon = rcva(
  "pointer-events-none absolute top-4 end-4 text-primary opacity-0 -translate-x-1 [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] group-hover/card:translate-x-0 group-hover/card:opacity-100 group-focus-visible/card:translate-x-0 group-focus-visible/card:opacity-100 motion-reduce:translate-x-0",
);
export const cardActions = rcva("card-actions justify-end");

export type CardVariants = VariantProps<typeof card>;

/**
 * @example <ui-card heading="Messages" .count=${messages.length}>…</ui-card>
 * @example
 * <ui-card heading="Line pricing" subhead="Policy: target 18%, minimum 12%">
 *   <ui-button slot="trailing" size="xs" variant="ghost" href="/globals/pricing-policy">Pricing policy</ui-button>
 *   …
 * </ui-card>
 * @example <ui-card variant="filled" heading="Read it into a draft case">…<ui-button slot="actions">Read</ui-button></ui-card>
 * @example <ui-card href="/collections/cases" heading="Awaiting supplier">…</ui-card>
 *
 * Slots: `heading` (a rich title), `trailing` (end of the header row), `figure` (an image above
 * the body), `actions` (a row at the bottom). Default children go in the body.
 */
@customElement("ui-card")
export class UiCard extends LightElement {
  @property() variant: CardVariants["variant"];
  @property() size: CardVariants["size"];
  @property() heading: Renderable = "";
  /** A count after the heading (a badge). */
  @property({ type: Number }) count?: number;
  /** The count's tone, when it needs attention (`warning`, `error`). */
  @property({ attribute: "count-tone" }) countTone: BadgeVariants["tone"];
  /** Supporting text under the heading. */
  @property() subhead: Renderable = "";
  /** Make the whole card a link. */
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
