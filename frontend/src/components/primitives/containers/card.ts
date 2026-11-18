import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Card: Groups and displays content in a readable way.
 *
 * Purpose: Content containers & disclosure · Kind: primitive
 * Docs: https://daisyui.com/components/card/
 *
 * Every variant is responsive, e.g. the docs' responsive card:
 * `side="lg"` (vertical on small screens, image beside the body from `lg`).
 */
/**
 * daisyUI grows every `<p>` in a card (`.card p { flex-grow: 1 }`, to push actions down), which
 * spreads text out whenever a card is stretched by its grid row; ours stay their natural height.
 */
export const card = rcva("card [&_p]:grow-0", {
  variants: {
    variant: {
      border: "card-border",
      dash: "card-dash",
    },
    size: {
      xs: "card-xs",
      sm: "card-sm",
      md: "card-md",
      lg: "card-lg",
      xl: "card-xl",
    },
    /** Image beside the body instead of above it. */
    side: { true: "card-side" },
    /** Image as a full background behind the body. */
    imageFull: { true: "image-full" },
    /** Background + text colour ("custom color" / "neutral" examples). */
    color: {
      base: "bg-base-100",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
      none: "",
    },
    shadow: { true: "shadow-sm" },
    /** Fixed width used throughout the docs (`w-96`), or full width. */
    width: {
      "96": "w-96",
      full: "w-full",
    },
    /** Item of a Join ("selectable cards" example). */
    joinItem: { true: "join-item" },
    /** The whole card is a link (`href`): it lifts on hover with a spring, and shows focus. */
    link: {
      true: "transition-[translate,box-shadow] duration-(--duration-spatial-fast) ease-spatial-fast hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
    },
  },
  defaultVariants: { color: "base", shadow: true },
});

export const cardBody = rcva("card-body", {
  variants: {
    centered: { true: "items-center text-center" },
    /** Dimmed body, e.g. a disabled selectable card. */
    muted: { true: "opacity-60" },
  },
});
export const cardTitle = rcva("card-title");
export const cardActions = rcva("card-actions", {
  variants: {
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
  },
  defaultVariants: { align: "end" },
});
/** Figure wrapper; `padded` matches the "centered content and paddings" example. */
export const cardFigure = rcva("", {
  variants: {
    padded: { true: "px-10 pt-10 [&>img]:rounded-xl" },
  },
});

export type CardVariants = VariantProps<typeof card>;

/**
 * @example
 * <ui-card heading="Card Title" image-src="/shoes.webp" image-alt="Shoes" width="96">
 *   <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
 *   <ui-button slot="actions" color="primary">Buy Now</ui-button>
 * </ui-card>
 * @example <ui-card side="lg" image-src="/movie.webp" heading="New movie is released!">…</ui-card>
 * @example <ui-card selectable="checkbox" name="urgent" color="accent" shadow="false" heading="Urgent">Same day delivery</ui-card>
 *
 * Slots: `figure` (replaces the image), `heading` (rich title, e.g. with a badge),
 * `actions` (rendered in `card-actions`). Default children go in `card-body`.
 *
 * `selectable="checkbox" | "radio"` renders the card as a `<label>` around a
 * native input (`name`, `value`, `checked`, `disabled` are forwarded; native
 * `change` bubbles out). Radio cards sharing a `name` form one choice; for the
 * docs' joined group put them in a Join with `join-item`.
 */
@customElement("ui-card")
export class UiCard extends LightElement {
  @property() variant: CardVariants["variant"];
  @property() size: CardVariants["size"];
  @property() color: CardVariants["color"];
  @property() width: CardVariants["width"];
  @property({ converter: responsiveBoolean }) side: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean, attribute: "image-full" }) imageFull: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) shadow: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean, attribute: "join-item" }) joinItem: Responsive<boolean> = false;
  @property() heading: Renderable = "";
  /** Make the whole card a link. */
  @property() href?: string;
  @property({ attribute: "image-src" }) imageSrc?: string;
  @property({ attribute: "image-alt" }) imageAlt = "";
  /** Put the image below the body. */
  @property({ attribute: "image-position" }) imagePosition: "top" | "bottom" = "top";
  @property({ converter: responsiveBoolean, attribute: "image-padded" }) imagePadded: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) centered: Responsive<boolean> = false;
  @property({ attribute: "actions-align" }) actionsAlign: VariantProps<typeof cardActions>["align"] = "end";
  /** Put the actions above the body content ("action on top" example). */
  @property({ attribute: "actions-position" }) actionsPosition: "top" | "bottom" = "bottom";

  /** Render as a selectable `<label>` with a native checkbox / radio. */
  @property() selectable?: "checkbox" | "radio";
  @property() name?: string;
  @property() value?: string;
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;

  private _figure() {
    const cls = cardFigure({ padded: this.imagePadded });
    if (this.hasSlotted("figure")) return html`<figure class=${cls}>${this.slotted("figure")}</figure>`;
    if (!this.imageSrc) return nothing;
    return html`<figure class=${cls}><img src=${this.imageSrc} alt=${this.imageAlt} /></figure>`;
  }

  render() {
    const title = this.hasSlotted("heading") ? this.slotted("heading") : this.heading;
    const actions = this.hasSlotted("actions")
      ? html`<div class=${cardActions({ align: this.actionsAlign })}>${this.slotted("actions")}</div>`
      : nothing;
    const figure = this._figure();
    const cls = card({
      variant: this.variant,
      size: this.size,
      side: this.side,
      imageFull: this.imageFull,
      color: this.color,
      shadow: this.shadow,
      width: this.width,
      joinItem: this.joinItem,
      link: !!this.href,
    });
    const inner = html`${this.imagePosition === "top" ? figure : nothing}
      <div class=${cardBody({ centered: this.centered, muted: this.disabled && !!this.selectable })}>
        ${this.actionsPosition === "top" ? actions : nothing}
        ${title ? html`<h2 class=${cardTitle()}>${title}</h2>` : nothing} ${this.slotted()}
        ${this.actionsPosition === "bottom" ? actions : nothing}
      </div>
      ${this.imagePosition === "bottom" ? figure : nothing}`;

    if (this.selectable) {
      return html`<label class=${cls}>
        <input
          type=${this.selectable}
          name=${ifDefined(this.name)}
          value=${ifDefined(this.value)}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${(e: Event) => (this.checked = (e.target as HTMLInputElement).checked)}
        />
        ${inner}
      </label>`;
    }
    if (this.href) return html`<a href=${this.href} class=${cls}>${inner}</a>`;
    return html`<div class=${cls}>${inner}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-card": UiCard;
  }
}
