import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Hover Gallery: Image container where hovering reveals other images (up to 10).
 *
 * Purpose: Media & visual effects · Kind: primitive
 * Docs: https://daisyui.com/components/hover-gallery/
 *
 * The first image shows by default; the others split the width into invisible
 * columns and each one appears while the pointer is over its column.
 */
export const hoverGallery = rcva("hover-gallery", {
  variants: {
    /** Max width. The docs' standalone example uses `sm` (max-w-60). */
    size: {
      sm: "max-w-60",
      md: "max-w-100",
      full: "w-full",
    },
  },
});

export type HoverGalleryVariants = VariantProps<typeof hoverGallery>;

export interface HoverGalleryImage {
  src: string;
  alt?: string;
}

/** daisyUI supports at most 10 images. */
export const HOVER_GALLERY_MAX_IMAGES = 10;

/**
 * @example <ui-hover-gallery size="sm" .images=${["/hat-1.webp", "/hat-2.webp"]}></ui-hover-gallery>
 *
 * Without `images`, authored `<img>` children are used.
 */
@customElement("ui-hover-gallery")
export class UiHoverGallery extends LightElement {
  @property({ attribute: false }) images: (string | HoverGalleryImage)[] = [];
  @property() size: HoverGalleryVariants["size"];
  /** Alt text used for images given as plain URLs. */
  @property() alt = "";

  render() {
    const imgs = this.images.slice(0, HOVER_GALLERY_MAX_IMAGES).map((i) => (typeof i === "string" ? { src: i } : i));
    return html`<figure class=${hoverGallery({ size: this.size })}>
      ${imgs.length ? imgs.map((i) => html`<img src=${i.src} alt=${i.alt ?? this.alt} />`) : this.content}
    </figure>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-hover-gallery": UiHoverGallery;
  }
}
