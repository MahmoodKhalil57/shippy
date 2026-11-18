import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../base/variants.ts";

/**
 * Carousel: Shows images or content in a scrollable area.
 *
 * Purpose: Content containers & disclosure · Kind: primitive
 * Docs: https://daisyui.com/components/carousel/
 */
export const carousel = rcva("carousel", {
  variants: {
    /** Scroll-snap alignment. daisyUI default: start. */
    snap: {
      start: "carousel-start",
      center: "carousel-center",
      end: "carousel-end",
    },
    direction: {
      horizontal: "carousel-horizontal",
      vertical: "carousel-vertical",
    },
    /** Neutral track with padding and gaps (the "full-bleed" example). */
    padded: { true: "space-x-4 bg-neutral p-4" },
    rounded: { true: "rounded-box" },
    /** Track width, as in the docs examples. */
    width: {
      full: "w-full",
      "96": "w-96",
      "64": "w-64",
      md: "max-w-md",
    },
    /** Track height (vertical carousels). */
    height: {
      "96": "h-96",
    },
  },
  defaultVariants: { rounded: true },
});

export const carouselItem = rcva("carousel-item", {
  variants: {
    /** Item width, as in the docs examples. */
    width: {
      auto: "",
      full: "relative w-full",
      half: "w-1/2",
    },
    /** Item height (vertical carousels). */
    height: {
      auto: "",
      full: "h-full",
    },
  },
  defaultVariants: { width: "auto" },
});

export const carouselImage = rcva("", {
  variants: {
    fill: { true: "w-full" },
    rounded: { true: "rounded-box" },
  },
});
/** Positions the arrow controls over the track. */
export const carouselFrame = rcva("relative");
export const carouselControls = rcva("absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between");
export const carouselIndicators = rcva("flex w-full justify-center gap-2 py-2");

export type CarouselVariants = VariantProps<typeof carousel>;

/** A slide: an image or arbitrary content. */
/** A plain string is treated as an image URL. */
export type CarouselSlide = string | { src: string; alt?: string } | { content: Renderable };

/**
 * @example
 * <ui-carousel item-width="full" controls="arrows" width="full"
 *   .items=${[{ src: "/1.webp", alt: "Burger" }, { src: "/2.webp", alt: "Pizza" }]}>
 * </ui-carousel>
 * @example <ui-carousel snap="center" padded width="md" image-rounded .items=${urls}></ui-carousel>  <!-- full-bleed -->
 * @example <ui-carousel direction="vertical" height="96" item-height="full" .items=${urls}></ui-carousel>
 *
 * Without `items`, authored children are used as the slides (render them with
 * the `carouselItem` recipe).
 * Navigation scrolls the carousel itself (no anchor links, so the page doesn't jump).
 * Methods: `next()`, `prev()`, `goTo(i)`. Event: `ui-change` with `{ index }`.
 */
@customElement("ui-carousel")
export class UiCarousel extends LightElement {
  @property({ attribute: false }) items: CarouselSlide[] = [];
  @property() snap: CarouselVariants["snap"];
  @property() direction: CarouselVariants["direction"];
  @property() width: CarouselVariants["width"];
  @property() height: CarouselVariants["height"];
  @property({ converter: responsiveBoolean }) padded: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) rounded: Responsive<boolean> = true;
  @property({ attribute: "item-width" }) itemWidth: VariantProps<typeof carouselItem>["width"] = "auto";
  @property({ attribute: "item-height" }) itemHeight: VariantProps<typeof carouselItem>["height"];
  /** Round each image (the full-bleed / snap examples). */
  @property({ converter: responsiveBoolean, attribute: "image-rounded" }) imageRounded: Responsive<boolean> = false;
  /** `arrows`: prev/next buttons over the slides; `indicators`: numbered buttons below; `both`. */
  @property() controls: "none" | "arrows" | "indicators" | "both" = "none";
  /** Wrap around at the ends. */
  @property({ converter: booleanAttribute }) loop = true;
  @property() label = "Carousel";

  @state() private _index = 0;
  @query(".carousel") private _track!: HTMLElement;

  get index() {
    return this._index;
  }

  private get _slides(): HTMLElement[] {
    return this._track ? (Array.from(this._track.children) as HTMLElement[]) : [];
  }

  /** Scroll to slide `i`. */
  goTo(i: number, behavior: ScrollBehavior = "smooth") {
    const slides = this._slides;
    if (!slides.length) return;
    const n = slides.length;
    const target = this.loop ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i));
    const slide = slides[target];
    const vertical = this._vertical;
    this._track.scrollTo({
      left: vertical ? 0 : slide.offsetLeft - this._track.offsetLeft,
      top: vertical ? slide.offsetTop - this._track.offsetTop : 0,
      behavior,
    });
    this._setIndex(target);
  }

  next() {
    this.goTo(this._index + 1);
  }

  prev() {
    this.goTo(this._index - 1);
  }

  private _setIndex(i: number) {
    if (i === this._index) return;
    this._index = i;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { index: i }, bubbles: true }));
  }

  /** Track the slide nearest the scroll position when the user swipes/scrolls. */
  private get _vertical() {
    return this._track ? this._track.scrollHeight > this._track.clientHeight + 1 : false;
  }

  private _onScroll() {
    const vertical = this._vertical;
    const pos = vertical ? this._track.scrollTop : this._track.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    this._slides.forEach((s, i) => {
      const d = Math.abs(
        (vertical ? s.offsetTop - this._track.offsetTop : s.offsetLeft - this._track.offsetLeft) - pos,
      );
      if (d < bestDist) [best, bestDist] = [i, d];
    });
    this._setIndex(best);
  }

  private _slide(slide: CarouselSlide) {
    const cls = carouselItem({ width: this.itemWidth, height: this.itemHeight });
    const item = typeof slide === "string" ? { src: slide } : slide;
    const img = carouselImage({ fill: this.itemWidth !== "auto" && !!this.itemWidth, rounded: this.imageRounded });
    return "src" in item
      ? html`<div class=${cls}><img src=${item.src} alt=${item.alt ?? ""} class=${img} /></div>`
      : html`<div class=${cls}>${item.content}</div>`;
  }

  render() {
    const count = this.items.length || this.slottedNodes().filter((n) => n instanceof Element).length;
    const arrows = this.controls === "arrows" || this.controls === "both";
    const dots = this.controls === "indicators" || this.controls === "both";

    return html`<div class=${carouselFrame()} role="region" aria-roledescription="carousel" aria-label=${this.label}>
        <div
          class=${carousel({
            snap: this.snap,
            direction: this.direction,
            padded: this.padded,
            rounded: this.rounded,
            width: this.width,
            height: this.height,
          })}
          @scroll=${this._onScroll}
        >
          ${
            this.items.length
              ? repeat(
                  this.items,
                  (_, i) => i,
                  (item) => this._slide(item),
                )
              : this.slotted()
          }
        </div>
        ${
          arrows
            ? html`<div class=${carouselControls()}>
                <button type="button" class="btn btn-circle" aria-label="Previous slide" @click=${this.prev}>❮</button>
                <button type="button" class="btn btn-circle" aria-label="Next slide" @click=${this.next}>❯</button>
              </div>`
            : nothing
        }
      </div>
      ${
        dots
          ? html`<div class=${carouselIndicators()}>
              ${Array.from(
                { length: count },
                (_, i) =>
                  html`<button
                    type="button"
                    class="btn btn-xs ${i === this._index ? "btn-active" : ""}"
                    aria-label="Go to slide ${i + 1}"
                    aria-current=${i === this._index ? "true" : nothing}
                    @click=${() => this.goTo(i)}
                  >
                    ${i + 1}
                  </button>`,
              )}
            </div>`
          : nothing
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-carousel": UiCarousel;
  }
}
