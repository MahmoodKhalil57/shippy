import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Navbar: Navigation bar at the top of the page.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/navbar/
 *
 * Fill it with other primitives (`ui-menu direction="horizontal"`,
 * `ui-dropdown`, `ui-button`, `ui-text-input`, `ui-indicator`, …) placed in the
 * `start` / `center` / `end` parts, or in `fill` / `fixed` for the docs'
 * `flex-1` / `flex-none` layout.
 */
export const navbar = rcva("navbar", {
  variants: {
    color: {
      base: "bg-base-100",
      "base-200": "bg-base-200",
      "base-300": "bg-base-300",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
    },
    shadow: { true: "shadow-sm" },
    /** Full width (docs drawer examples). */
    full: { true: "w-full" },
  },
  defaultVariants: { color: "base", shadow: true },
});
/** Fills the first 50% of the width. */
export const navbarStart = rcva("navbar-start");
/** Centered horizontally. */
export const navbarCenter = rcva("navbar-center", {
  variants: {
    /** Only shown from a breakpoint up (docs: `hidden lg:flex`). */
    showFrom: { sm: "hidden sm:flex", md: "hidden md:flex", lg: "hidden lg:flex", xl: "hidden xl:flex" },
  },
});
/** Fills the second 50% of the width. */
export const navbarEnd = rcva("navbar-end", { variants: { gap: { true: "gap-2" } } });
/** `flex-1` area (docs "title only" / "search input" layouts). */
export const navbarFill = rcva("flex-1");
/** `flex-none` area. */
export const navbarFixed = rcva("flex-none", { variants: { gap: { true: "flex gap-2" } } });
/** The brand / title link (docs `btn btn-ghost text-xl`). */
export const navbarBrand = rcva("btn btn-ghost text-xl");

export type NavbarVariants = VariantProps<typeof navbar>;
export type NavbarCenterVariants = VariantProps<typeof navbarCenter>;

/**
 * @example
 * <ui-navbar brand="daisyUI">
 *   <ui-menu slot="center" direction="horizontal" .items=${[{ label: "Item 1" }]}></ui-menu>
 *   <ui-button slot="end">Button</ui-button>
 * </ui-navbar>
 * @example
 * <ui-navbar brand="daisyUI" brand-in="fill">
 *   <ui-text-input slot="fixed" placeholder="Search"></ui-text-input>
 * </ui-navbar>
 *
 * Children with `slot="start" | "center" | "end" | "fill" | "fixed"` are
 * wrapped in the matching part; parts without children aren't rendered.
 * `brand` renders the title link at the start of `start` (or `fill`).
 * Unslotted children are rendered directly inside the navbar.
 */
@customElement("ui-navbar")
export class UiNavbar extends LightElement {
  @property() color: NavbarVariants["color"] = "base";
  @property({ converter: responsiveBoolean }) shadow: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) full: Responsive<boolean> = false;
  /** Title / logo link. */
  @property() brand: Renderable = "";
  @property({ attribute: "brand-href" }) brandHref?: string;
  /** Which part the brand goes in. */
  @property({ attribute: "brand-in" }) brandIn: "start" | "fill" = "start";
  /** Show the center part only from this breakpoint (docs responsive navbar). */
  @property({ attribute: "center-from" }) centerFrom: NavbarCenterVariants["showFrom"];
  /** Gap between items in the end / fixed parts. */
  @property({ attribute: "end-gap", type: Boolean }) endGap = false;

  render() {
    const brand = this.brand
      ? html`<a class=${navbarBrand()} href=${ifDefined(this.brandHref)}>${this.brand}</a>`
      : nothing;
    const part = (name: string, cls: string, withBrand = false) =>
      this.hasSlotted(name) || withBrand
        ? html`<div class=${cls}>${withBrand ? brand : nothing}${this.slotted(name)}</div>`
        : nothing;
    const brandIn = this.brand ? this.brandIn : undefined;
    return html`<nav class=${navbar({ color: this.color, shadow: this.shadow, full: this.full })}>
      ${part("start", navbarStart(), brandIn === "start")} ${part("fill", navbarFill(), brandIn === "fill")}
      ${part("center", navbarCenter({ showFrom: this.centerFrom }))} ${this.slotted()}
      ${part("fixed", navbarFixed({ gap: this.endGap }))} ${part("end", navbarEnd({ gap: this.endGap }))}
    </nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-navbar": UiNavbar;
  }
}
