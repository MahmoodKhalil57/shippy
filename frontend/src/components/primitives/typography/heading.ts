import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Heading: a section title, h1–h6.
 *
 * Purpose: Typography · Kind: primitive (Shippy, not daisyUI)
 *
 * `level` sets the element (document outline); `size` sets the look and
 * defaults per level. Every variant is responsive, e.g. `size="2xl md:4xl"`.
 *
 * Variant options are written out inline (not shared constants) so the CSS
 * plugin can read them for responsive values.
 */
export const heading = rcva("", {
  variants: {
    size: {
      /** Page title: 1.5rem → 1.875rem as the space it sits in grows (container units). */
      page: "text-[clamp(1.5rem,1.2rem_+_1.6cqi,1.875rem)] leading-tight",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
      "8xl": "text-8xl",
      "9xl": "text-9xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    color: {
      "base-content": "text-base-content",
      muted: "text-base-content/80",
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
  defaultVariants: { weight: "bold" },
});

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

/** Default size per level when `size` isn't set. */
const HEADING_SIZES: Record<HeadingLevel, NonNullable<HeadingVariants["size"]>> = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "base",
};

/**
 * @example <ui-heading level="1">Dashboard</ui-heading>
 * @example <ui-heading level="2" size="xl md:3xl" color="primary" balance>Revenue this quarter</ui-heading>
 */
@customElement("ui-heading")
export class UiHeading extends LightElement {
  @property({ type: Number }) level: HeadingLevel = 2;
  @property() size: HeadingVariants["size"];
  @property() weight: HeadingVariants["weight"];
  @property() color: HeadingVariants["color"];
  @property() align: HeadingVariants["align"];
  @property() tracking: HeadingVariants["tracking"];
  @property({ converter: responsiveBoolean }) balance: Responsive<boolean> = false;

  render() {
    const level = (HEADING_TAGS[this.level] ? this.level : 2) as HeadingLevel;
    const tag = HEADING_TAGS[level];
    const cls = heading({
      size: this.size ?? HEADING_SIZES[level],
      weight: this.weight,
      color: this.color,
      align: this.align,
      tracking: this.tracking,
      balance: this.balance,
    });
    return html`<${tag} class=${cls}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-heading": UiHeading;
  }
}
