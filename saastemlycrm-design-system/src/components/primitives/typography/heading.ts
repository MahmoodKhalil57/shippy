import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";

export const heading = rcva("min-w-0 [overflow-wrap:anywhere]", {
  variants: {
    variant: {
      page: "text-page-title",
      "display-lg": "text-display-lg",
      "display-md": "text-display-md",
      "display-sm": "text-display-sm",
      "headline-lg": "text-headline-lg",
      "headline-md": "text-headline-md",
      "headline-sm": "text-headline-sm",
      "title-lg": "text-title-lg",
      "title-md": "text-title-md",
      "title-sm": "text-title-sm",
      "label-lg": "text-label-lg",
    },
    color: {
      "base-content": "text-on-surface",
      muted: "text-on-surface-variant",
      primary: "text-primary-ink",
      secondary: "text-secondary-ink",
      accent: "text-accent-ink",
      neutral: "text-neutral",
      info: "text-info-ink",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      start: "text-start",
      end: "text-end",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },
    balance: { true: "text-balance" },
  },
});
export const headingEmphasis = rcva("", { variants: { step: { regular: "font-semibold", strong: "font-bold" } } });

export type HeadingVariants = VariantProps<typeof heading>;
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_TAGS: Record<HeadingLevel, StaticValue> = {
  1: literal`h1`,
  2: literal`h2`,
  3: literal`h3`,
  4: literal`h4`,
  5: literal`h5`,
  6: literal`h6`,
};

const HEADING_ROLES: Record<HeadingLevel, NonNullable<HeadingVariants["variant"]>> = {
  1: "headline-lg",
  2: "headline-sm",
  3: "title-lg",
  4: "title-md",
  5: "title-sm",
  6: "label-lg",
};

@customElement("ui-heading")
export class UiHeading extends LightElement {
  @property({ type: Number }) level: HeadingLevel = 2;
  @property() variant: HeadingVariants["variant"];
  @property({ type: Boolean }) emphasized = false;
  @property() color: HeadingVariants["color"];
  @property() align: HeadingVariants["align"];
  @property() tracking: HeadingVariants["tracking"];
  @property({ converter: responsiveBoolean }) balance: Responsive<boolean> = false;

  render() {
    const level = (HEADING_TAGS[this.level] ? this.level : 2) as HeadingLevel;
    const tag = HEADING_TAGS[level];
    const variant = this.variant ?? HEADING_ROLES[level];
    const cls = heading({
      variant,
      color: this.color,
      align: this.align,
      tracking: this.tracking,
      balance: this.balance,
    });
    const emphasis =
      this.emphasized && variant !== "page"
        ? headingEmphasis({ step: /^(headline|title)-/.test(variant) ? "strong" : "regular" })
        : "";
    return html`<${tag} class=${[cls, emphasis].filter(Boolean).join(" ")}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-heading": UiHeading;
  }
}
