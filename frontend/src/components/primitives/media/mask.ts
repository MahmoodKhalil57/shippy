import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Mask: Crops the element's content to common shapes.
 *
 * Purpose: Media & visual effects · Kind: primitive
 * Docs: https://daisyui.com/components/mask/
 *
 * Every variant is responsive, e.g. `size="sm lg:xl"`.
 */
export const mask = rcva("mask", {
  variants: {
    shape: {
      squircle: "mask-squircle",
      heart: "mask-heart",
      /** vertical hexagon */
      hexagon: "mask-hexagon",
      /** horizontal hexagon */
      "hexagon-2": "mask-hexagon-2",
      decagon: "mask-decagon",
      pentagon: "mask-pentagon",
      diamond: "mask-diamond",
      circle: "mask-circle",
      star: "mask-star",
      /** bold star */
      "star-2": "mask-star-2",
      /** pointing top */
      triangle: "mask-triangle",
      /** pointing down */
      "triangle-2": "mask-triangle-2",
      /** pointing left */
      "triangle-3": "mask-triangle-3",
      /** pointing right */
      "triangle-4": "mask-triangle-4",
    },
    /** Crop only one half of the shape (used for half-star ratings). */
    half: {
      first: "mask-half-1",
      second: "mask-half-2",
    },
    /** Square size. The docs' examples use `xl` (w-40 h-40). */
    size: {
      xs: "size-8",
      sm: "size-16",
      md: "size-24",
      lg: "size-32",
      xl: "size-40",
      full: "size-full",
    },
    /** Fill colour when masking a plain box instead of an image. */
    color: {
      neutral: "bg-neutral",
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      info: "bg-info",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
    },
  },
  defaultVariants: { shape: "squircle" },
});

export type MaskVariants = VariantProps<typeof mask>;

/**
 * @example <ui-mask shape="hexagon" size="xl" src="/avatar.webp" alt="Me"></ui-mask>
 * @example <ui-mask shape="heart" size="md" color="primary"></ui-mask>
 *
 * Renders an `<img>` when `src` is set, otherwise a `<div>` wrapping the children.
 */
@customElement("ui-mask")
export class UiMask extends LightElement {
  @property() shape: MaskVariants["shape"] = "squircle";
  @property() half: MaskVariants["half"];
  @property() size: MaskVariants["size"];
  @property() color: MaskVariants["color"];
  @property() src?: string;
  @property() alt = "";

  render() {
    const cls = mask({ shape: this.shape, half: this.half, size: this.size, color: this.color });
    return this.src
      ? html`<img class=${cls} src=${this.src} alt=${this.alt} />`
      : html`<div class=${cls}>${this.content}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-mask": UiMask;
  }
}
