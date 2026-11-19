import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Diff: Side-by-side comparison of two items with a draggable resizer.
 *
 * Purpose: Showcase & docs · Kind: primitive
 * Docs: https://daisyui.com/components/diff/
 * Browser support: Chrome 105, Firefox 110, Safari 16.
 */
export const diff = rcva("diff", {
  variants: {
    aspect: {
      "16/9": "aspect-16/9",
      "4/3": "aspect-4/3",
      "3/2": "aspect-3/2",
      "21/9": "aspect-21/9",
      "1/1": "aspect-square",
    },
  },
  defaultVariants: { aspect: "16/9" },
});

/** First (top/left-revealed) item. */
export const diffItem1 = rcva("diff-item-1");
/** Second item. */
export const diffItem2 = rcva("diff-item-2");
/** The draggable resizer control. */
export const diffResizer = rcva("diff-resizer");

/** Big centered text panel, as in the docs' "Diff text" example. */
export const diffText = rcva("grid place-content-center text-9xl font-black", {
  variants: {
    color: {
      "base-100": "bg-surface",
      "base-200": "bg-surface-container",
      "base-300": "bg-surface-container-highest",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
    },
  },
});

export type DiffVariants = VariantProps<typeof diff>;
export type DiffTextVariants = VariantProps<typeof diffText>;

/**
 * @example <ui-diff first-src="/sharp.webp" second-src="/blur.webp" alt="daisy"></ui-diff>
 * @example <ui-diff first-text="DAISY" second-text="DAISY"></ui-diff>   (docs "Diff text": primary vs base-200)
 *
 * Each side comes from (in priority order) a `slot="first"|"second"` child,
 * the `first`/`second` property, the `first-text`/`second-text` panel, or the
 * `first-src`/`second-src` image.
 */
@customElement("ui-diff")
export class UiDiff extends LightElement {
  @property() aspect: DiffVariants["aspect"] = "16/9";
  @property({ attribute: false }) first: Renderable;
  @property({ attribute: false }) second: Renderable;
  @property({ attribute: "first-src" }) firstSrc?: string;
  @property({ attribute: "second-src" }) secondSrc?: string;
  @property({ attribute: "first-text" }) firstText?: string;
  @property({ attribute: "second-text" }) secondText?: string;
  @property({ attribute: "first-color" }) firstColor: DiffTextVariants["color"] = "primary";
  @property({ attribute: "second-color" }) secondColor: DiffTextVariants["color"] = "base-200";
  @property() alt = "";

  private _side(name: "first" | "second") {
    if (this.hasSlotted(name)) return this.slotted(name);
    const value = name === "first" ? this.first : this.second;
    if (value !== undefined && value !== null && value !== "") return value;
    const text = name === "first" ? this.firstText : this.secondText;
    if (text) {
      return html`<div class=${diffText({ color: name === "first" ? this.firstColor : this.secondColor })}>
        ${text}
      </div>`;
    }
    const src = name === "first" ? this.firstSrc : this.secondSrc;
    return src ? html`<img alt=${this.alt} src=${src} />` : "";
  }

  render() {
    return html`<figure class=${diff({ aspect: this.aspect })} tabindex="0">
      <div class=${diffItem1()} role="img" tabindex="0">${this._side("first")}</div>
      <div class=${diffItem2()} role="img">${this._side("second")}</div>
      <div class=${diffResizer()}></div>
    </figure>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-diff": UiDiff;
  }
}
