import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../base/variants.ts";

/**
 * Hero: Large box or image with a title and description.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/hero/
 */
export const hero = rcva("hero", {
  variants: {
    /** Full viewport height, as in the docs examples. */
    fullHeight: { true: "min-h-screen" },
    /** Background (docs: `bg-surface-container`). */
    surface: {
      "base-100": "bg-surface",
      "base-200": "bg-surface-container",
      "base-300": "bg-surface-container-highest",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
    },
  },
});

export const heroContent = rcva("hero-content", {
  variants: {
    /**
     * `centered`: text only. `figure`: figure + text stacked, side by side from
     * `lg`. `figure-reverse`: same, figure on the right (docs "reverse order",
     * also used for "Hero with form").
     */
    layout: {
      centered: "text-center",
      figure: "flex-col lg:flex-row",
      "figure-reverse": "flex-col lg:flex-row-reverse",
    },
    /** Light text for use over a background image. */
    overImage: { true: "text-neutral-content" },
  },
  defaultVariants: { layout: "centered" },
});

/** The text column (heading, text, actions). */
export const heroText = rcva("", {
  variants: {
    width: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "",
    },
    /** Docs "Hero with form": `align="center lg:start"`. */
    align: {
      center: "text-center",
      start: "text-left",
      end: "text-right",
    },
  },
  defaultVariants: { width: "md" },
});

export const heroOverlay = rcva("hero-overlay");
export const heroHeading = rcva("text-display-md font-bold", { variants: { overImage: { true: "mb-5" } } });
export const heroParagraph = rcva("", { variants: { overImage: { true: "mb-5", false: "py-6" } } });
export const heroFigure = rcva("max-w-sm rounded-sm shadow-elevation-3");

export type HeroVariants = VariantProps<typeof hero>;
export type HeroContentVariants = VariantProps<typeof heroContent>;
export type HeroTextVariants = VariantProps<typeof heroText>;

/**
 * @example
 * <ui-hero heading="Hello there" text="Provident cupiditate…" surface="base-200" full-height>
 *   <ui-button color="primary">Get Started</ui-button>
 * </ui-hero>
 * @example
 * <ui-hero layout="figure" figure="/photo.webp" heading="Box Office News!" surface="base-200" full-height>
 *   <ui-button color="primary">Get Started</ui-button>
 * </ui-hero>
 * @example
 * <ui-hero layout="figure-reverse" text-align="center lg:start" heading="Login now!" surface="base-200" full-height>
 *   <ui-card slot="figure">…form…</ui-card>
 * </ui-hero>
 *
 * Unslotted children go under the heading/text (actions, forms). `figure`
 * (image URL) or `slot="figure"` children go beside the text. With `image`, a
 * background image + overlay is used.
 */
@customElement("ui-hero")
export class UiHero extends LightElement {
  @property() heading: Renderable = "";
  @property() text: Renderable = "";
  @property() layout: HeroContentVariants["layout"] = "centered";
  @property({ attribute: "full-height", converter: responsiveBoolean }) fullHeight: Responsive<boolean> = false;
  @property() surface: HeroVariants["surface"];
  /** Background image URL; adds `hero-overlay` and light text. */
  @property() image?: string;
  /** Show the dark overlay over `image` (default on). */
  @property({ converter: booleanAttribute }) overlay = true;
  /** Image shown beside the text (docs "Hero with figure"). */
  @property() figure?: string;
  @property({ attribute: "figure-alt" }) figureAlt = "";
  /** Max width of the text column. */
  @property({ attribute: "text-width" }) textWidth: HeroTextVariants["width"] = "md";
  @property({ attribute: "text-align" }) textAlign: HeroTextVariants["align"];

  render() {
    const overImage = !!this.image;
    const text = html`<div class=${heroText({ width: this.textWidth, align: this.textAlign })}>
      ${this.heading ? html`<h1 class=${heroHeading({ overImage })}>${this.heading}</h1>` : nothing}
      ${this.text ? html`<p class=${heroParagraph({ overImage })}>${this.text}</p>` : nothing} ${this.slotted()}
    </div>`;

    return html`<div
      class=${hero({ fullHeight: this.fullHeight, surface: this.surface })}
      style=${overImage ? styleMap({ backgroundImage: `url(${this.image})` }) : nothing}
    >
      ${overImage && this.overlay ? html`<div class=${heroOverlay()}></div>` : nothing}
      <div class=${heroContent({ layout: this.layout, overImage })}>
        ${this.figure ? html`<img src=${this.figure} alt=${this.figureAlt} class=${heroFigure()} />` : nothing}
        ${this.slotted("figure")} ${text}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-hero": UiHero;
  }
}
