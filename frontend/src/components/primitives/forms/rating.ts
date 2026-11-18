import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, uid } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Rating: Set of radio buttons for rating something.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/rating/
 *
 * All variants are responsive (e.g. `size="sm lg:lg"`).
 */
export const rating = rcva("rating", {
  variants: {
    size: {
      xs: "rating-xs",
      sm: "rating-sm",
      md: "rating-md",
      lg: "rating-lg",
      xl: "rating-xl",
    },
    /** Show half shapes, for half-star ratings. */
    half: { true: "rating-half" },
    /** Small gap between shapes (docs: hearts example). */
    spaced: { true: "gap-1" },
  },
});

/** First radio of the group, hidden, so the user can clear the rating. */
export const ratingHidden = rcva("rating-hidden");

/** One rating shape (a masked radio, or a masked div when read-only). */
export const ratingItem = rcva("mask", {
  variants: {
    shape: {
      star: "mask-star",
      "star-2": "mask-star-2",
      heart: "mask-heart",
      circle: "mask-circle",
      squircle: "mask-squircle",
      diamond: "mask-diamond",
      hexagon: "mask-hexagon",
      "hexagon-2": "mask-hexagon-2",
      pentagon: "mask-pentagon",
      decagon: "mask-decagon",
    },
    /** Which half of the shape this item draws (half-star mode). */
    side: {
      1: "mask-half-1",
      2: "mask-half-2",
    },
    /** Shape colour (theme colours; the docs' red-to-green palette is error/warning/success). */
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
  defaultVariants: { shape: "star" },
});

export type RatingVariants = VariantProps<typeof rating>;
export type RatingItemVariants = VariantProps<typeof ratingItem>;

/**
 * @example <ui-rating name="score" value="2" shape="star-2" color="warning"></ui-rating>
 * @example <ui-rating value="1.5" half clearable size="lg" shape="star-2" color="success"></ui-rating>
 * @example <ui-rating value="3" readonly></ui-rating>
 * @example <ui-rating value="2" shape="heart" spaced
 *   .colors=${["error", "warning", "warning", "success", "success"]}></ui-rating>
 *
 * Native `change` events from the radios bubble out; `ui-change` carries `{ value }`.
 */
@customElement("ui-rating")
export class UiRating extends LightElement {
  @property() size: RatingVariants["size"];
  @property() shape: RatingItemVariants["shape"] = "star";
  /** Allow half values (0.5 steps). Structural (doubles the inputs), so not responsive. */
  @property({ type: Boolean }) half = false;
  @property({ converter: responsiveBoolean }) spaced: Responsive<boolean> = false;
  /** Colour of every shape. */
  @property() color: RatingItemVariants["color"];
  /** Add a hidden first radio so the rating can be cleared to 0. */
  @property({ type: Boolean }) clearable = false;
  /** Render non-interactive shapes, marking the current value with `aria-current`. */
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 5;
  @property() name = uid("rating");
  @property({ type: Boolean }) disabled = false;
  /** Per-item colours (one per whole value), e.g. a colour per heart. Overrides `color`. */
  @property({ attribute: false }) colors: NonNullable<RatingItemVariants["color"]>[] = [];

  private _select(value: number) {
    this.value = value;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value }, bubbles: true }));
  }

  private _steps() {
    const step = this.half ? 0.5 : 1;
    return Array.from({ length: Math.round(this.max / step) }, (_, i) => (i + 1) * step);
  }

  render() {
    const cls = rating({ size: this.size, half: this.half, spaced: this.spaced });
    const steps = this._steps();
    const itemCls = (v: number) =>
      ratingItem({
        shape: this.shape,
        side: this.half ? (Number.isInteger(v) ? 2 : 1) : undefined,
        color: this.colors[Math.ceil(v) - 1] ?? this.color,
      });
    const label = (v: number) => `${v} star`;

    if (this.readonly) {
      return html`<div class=${cls} role="img" aria-label=${`${this.value} of ${this.max}`}>
        ${steps.map(
          (v) =>
            html`<div
              class=${itemCls(v)}
              aria-label=${label(v)}
              aria-current=${v === this.value ? "true" : nothing}
            ></div>`,
        )}
      </div>`;
    }

    return html`<div class=${cls}>
      ${
        this.clearable
          ? html`<input
              type="radio"
              name=${this.name}
              class=${ratingHidden()}
              aria-label="clear"
              .checked=${this.value === 0}
              ?disabled=${this.disabled}
              @change=${() => this._select(0)}
            />`
          : nothing
      }
      ${steps.map(
        (v) =>
          html`<input
            type="radio"
            name=${this.name}
            value=${v}
            class=${itemCls(v)}
            aria-label=${label(v)}
            .checked=${v === this.value}
            ?disabled=${this.disabled}
            @change=${() => this._select(v)}
          />`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-rating": UiRating;
  }
}
