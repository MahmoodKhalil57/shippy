import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Footer: Logo, copyright notice and links to other pages.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/footer/
 *
 * Vertical by default. The element's default `direction` is the docs pattern
 * "vertical, horizontal from sm up" = `"sm:horizontal"`, which renders
 * `sm:footer-horizontal` (spelled out here so Tailwind generates it, as the
 * value is a primitive default rather than app usage).
 */
export const footer = rcva("footer", {
  variants: {
    direction: {
      vertical: "footer-vertical",
      horizontal: "footer-horizontal",
    },
    placement: {
      start: "",
      center: "footer-center",
    },
    color: {
      base: "bg-base-200 text-base-content",
      "base-300": "bg-base-300 text-base-content",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      none: "",
    },
    padding: {
      default: "p-10",
      compact: "p-4",
      /** Docs "Two footer" bottom row. */
      bar: "px-10 py-4",
      none: "",
    },
    /** Top border (docs "Two footer"). */
    border: { true: "border-base-300 border-t" },
    rounded: { true: "rounded" },
    /** Vertically center the sections (docs "copyright text and social icons"). */
    centerItems: { true: "items-center" },
    /** Two rows of columns (docs "Footer with 2 rows"). */
    twoRows: { true: "grid-rows-2" },
  },
  defaultVariants: { color: "base", padding: "default" },
});

export const footerTitle = rcva("footer-title");
export const footerLink = rcva("link link-hover");
/** An icon link; its SVG takes the text colour. */
export const footerIconLink = rcva("[&_svg]:fill-current");
/** A `<nav>` column. */
export const footerNav = rcva("", {
  variants: {
    /** `icons`: a row of icon links (docs social icons). */
    kind: { links: "", icons: "grid grid-flow-col gap-4" },
    /** `end`: pushed to the end from md up (docs "copyright text and social icons"). */
    placement: { start: "", end: "md:place-self-center md:justify-self-end" },
  },
});
/** The logo/brand `<aside>`. */
export const footerAside = rcva("", {
  variants: {
    /** Logo and text side by side (docs "copyright text and social icons"). */
    inline: { true: "grid-flow-col items-center" },
  },
});
export const footerBrand = rcva("", { variants: { bold: { true: "font-bold" } } });

export type FooterVariants = VariantProps<typeof footer>;
export type FooterNavVariants = VariantProps<typeof footerNav>;

export interface FooterLink {
  label: Renderable;
  href?: string;
  /** Accessible name for icon-only links. */
  ariaLabel?: string;
}

export interface FooterColumn extends FooterNavVariants {
  heading?: Renderable;
  links: FooterLink[];
}

/**
 * @example
 * <ui-footer color="neutral" .columns=${[
 *   { heading: "Services", links: [{ label: "Branding" }, { label: "Design" }] },
 *   { heading: "Company", links: [{ label: "About us" }, { label: "Contact" }] },
 * ]} .logo=${logoSvg} brand="ACME Industries Ltd." tagline="Providing reliable tech since 1992">
 * </ui-footer>
 * @example
 * <ui-footer color="neutral" padding="compact" center-items .logo=${logoSvg} brand="Copyright © 2025" aside-inline
 *   .columns=${[{ kind: "icons", placement: "end", links: [{ label: twitterSvg, ariaLabel: "Twitter" }] }]}></ui-footer>
 *
 * Renders the brand `<aside>` (from `logo` / `brand` / `tagline`), then
 * `slot="start"` children, one `<nav>` per column, then the remaining children
 * (e.g. a newsletter form).
 */
@customElement("ui-footer")
export class UiFooter extends LightElement {
  @property() direction: FooterVariants["direction"] = "sm:horizontal";
  @property() placement: FooterVariants["placement"];
  @property() color: FooterVariants["color"] = "base";
  @property() padding: FooterVariants["padding"] = "default";
  @property({ converter: responsiveBoolean }) border: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) rounded: Responsive<boolean> = false;
  @property({ attribute: "center-items", converter: responsiveBoolean }) centerItems: Responsive<boolean> = false;
  @property({ attribute: "two-rows", converter: responsiveBoolean }) twoRows: Responsive<boolean> = false;
  @property({ attribute: false }) columns: FooterColumn[] = [];
  /** Brand aside: logo (e.g. an SVG template), name and tagline. */
  @property({ attribute: false }) logo: Renderable = nothing;
  @property() brand: Renderable = "";
  @property() tagline: Renderable = "";
  @property({ attribute: "brand-bold", type: Boolean }) brandBold = false;
  @property({ attribute: "aside-inline", converter: responsiveBoolean }) asideInline: Responsive<boolean> = false;

  private _aside() {
    if (!this.brand && !this.tagline && this.logo === nothing) return nothing;
    return html`<aside class=${footerAside({ inline: this.asideInline })}>
      ${this.logo}
      ${
        this.brand || this.tagline
          ? html`<p class=${footerBrand({ bold: this.brandBold })}>
              ${this.brand}${this.brand && this.tagline ? html`<br />` : nothing}${this.tagline}
            </p>`
          : nothing
      }
    </aside>`;
  }

  render() {
    return html`<footer
      class=${footer({
        direction: this.direction,
        placement: this.placement,
        color: this.color,
        padding: this.padding,
        border: this.border,
        rounded: this.rounded,
        centerItems: this.centerItems,
        twoRows: this.twoRows,
      })}
    >
      ${this._aside()} ${this.slotted("start")}
      ${this.columns.map(
        ({ heading, links, kind, placement }) =>
          html`<nav class=${footerNav({ kind, placement })}>
            ${heading ? html`<h6 class=${footerTitle()}>${heading}</h6>` : nothing}
            ${links.map(
              (l) =>
                html`<a
                  class=${kind === "icons" ? footerIconLink() : footerLink()}
                  href=${ifDefined(l.href)}
                  aria-label=${ifDefined(l.ariaLabel)}
                  >${l.label}</a
                >`,
            )}
          </nav>`,
      )}
      ${this.slotted()}
    </footer>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-footer": UiFooter;
  }
}
