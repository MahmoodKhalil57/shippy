import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../i18n/index.ts";
import { isRtl } from "../../base/reading.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { row, rowLine, stack, text } from "../layout/algebra.ts";
import { bandsOf, fraction, indexAt, percentOf, percentText, type Quality } from "./visual-math.ts";

/**
 * Bullet: one measure against its target, on bands of how good it is (Stephen Few's bullet graph):
 * revenue against plan, days to quote against the promise, a single bar that says more than a
 * gauge in the same room.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **One measure, one hue:** the value is a thick bar in `chart-1`; the target a short upright
 *   tick in the ink colour, so it reads whatever the bar's length.
 * - **Quality in one neutral ramp, never in hues:** `bands` (up to two ascending thresholds) shade
 *   the track behind the bar poor / ok / good, darkest for poor, so the bar stays the only colour.
 *   `lower-is-better` turns the ramp round (days late, cost per lead).
 * - **Text in text colours:** the heading and the value above the bar, the reading under it.
 * - **Alive:** the bar grows from the start as it enters (a transition from `@starting-style`, as
 *   ambient motion; with Reduce motion it's simply there). Pointing at it or focusing it reads it
 *   under the bar ("USD 41k of USD 50k · 82% of target"); the band under the pointer, or the one
 *   the ← → keys step to, comes forward (the others fade) and reads its range.
 * - It's a `meter` for assistive tech (its value, range and that sentence); `label` names it.
 *
 * No `<svg>`: bands, bar and tick are positioned boxes on the track.
 */
export const bullet = rcva(`${stack} w-full gap-1`);
export const bulletHead = rcva(`${row} items-baseline gap-x-2`);
export const bulletHeading = rcva(`${rowLine} text-body-md text-on-surface`);
export const bulletValue = rcva(`${text.label} text-title-sm tabular-nums text-on-surface`);
export const bulletTrack = rcva(
  "relative h-6 w-full overflow-hidden [--clips:bar] rounded-xs bg-surface-container-highest",
);
/** A band of the track: darkest for poor, lightest for good (one neutral ramp). */
export const bulletBand = rcva("absolute inset-y-0 [transition:opacity_var(--duration-short4)_var(--ease-standard)]", {
  variants: {
    quality: { poor: "bg-on-surface/20", ok: "bg-on-surface/12", good: "bg-on-surface/5" },
    dim: { true: "opacity-40", false: "" },
  },
});
/** The bar's lane: the middle third of the track. */
export const bulletLane = rcva("pointer-events-none absolute inset-x-0 inset-y-[33%]");
export const bulletBar = rcva(
  "block h-full w-(--fill) max-w-full rounded-e-xs bg-chart-1 [transition:width_var(--duration-long2)_var(--ease-emphasized-decelerate)] starting:w-0 motion-reduce:transition-none",
);
export const bulletTarget = rcva("pointer-events-none absolute inset-y-[12%] w-0.5 rounded-full bg-on-surface");
export const bulletReading = rcva(`${text.label} min-h-4 text-label-md tabular-nums text-on-surface-variant`);

const QUALITY: Record<Quality, () => string> = {
  poor: () => m.bullet_quality_poor(),
  ok: () => m.bullet_quality_ok(),
  good: () => m.bullet_quality_good(),
};

/**
 * @example <ui-bullet heading="Revenue" label="Revenue against plan" .value=${41} .max=${60} .target=${50} .bands=${[30, 45]} value-text="USD 41k" target-text="USD 50k"></ui-bullet>
 * @example <ui-bullet heading="Days to quote" lower-is-better .value=${3} .max=${10} .target=${2} .bands=${[2, 5]} value-text="3 days" target-text="2 days"></ui-bullet>
 */
@customElement("ui-bullet")
export class UiBullet extends LightElement {
  /** The whole sentence for screen readers ("Revenue against plan"); left out, the heading. */
  @property() label = "";
  /** Visible name above the bar ("Revenue"). */
  @property() heading = "";
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  /** What the value should reach (a tick on the track); left out, no tick. */
  @property({ type: Number }) target?: number;
  /** Ascending thresholds inside the range (at most two) that shade the track poor / ok / good. */
  @property({ attribute: false }) bands?: number[];
  /** How the value reads ("USD 41k"); left out, the number. */
  @property({ attribute: "value-text" }) valueText = "";
  /** How the target reads ("USD 50k"); left out, the number. */
  @property({ attribute: "target-text" }) targetText = "";
  /** Less is better (days late, cost): the good band is at the start. */
  @property({ type: Boolean, attribute: "lower-is-better" }) lowerIsBetter = false;
  /** Read under the bar while it's pointed at or focused. */
  @state() private _reading = false;
  /** The band pointed at or stepped to (-1: none). */
  @state() private _band = -1;
  #revealed = false;

  protected updated() {
    // The bar's growth is ambient motion: it plays when nothing a person did is still moving.
    if (!this.#revealed) {
      this.#revealed = true;
      const grow = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSTransition && a.transitionProperty === "width",
      );
      void motion.add(grow, "ambient", this);
    }
  }

  /** The sentence that reads it: value of target and its share of the target (or of the range). */
  #sentence() {
    const value = this.valueText || formatInt(this.value);
    if (this.target === undefined) {
      const p = percentOf(this.value - this.min, this.max - this.min);
      return p === null ? value : m.bullet_reading_range({ value, share: percentText(p), max: formatInt(this.max) });
    }
    const target = this.targetText || formatInt(this.target);
    const p = percentOf(this.value, this.target);
    return p === null
      ? m.bullet_reading_of({ value, target })
      : m.bullet_reading_target({ value, target, share: percentText(p) });
  }

  #point = (e: PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rtl = isRtl(this);
    const f = r.width > 0 ? Math.min(1, Math.max(0, (rtl ? r.right - e.clientX : e.clientX - r.left) / r.width)) : 0;
    const i = indexAt(bandsOf(this.bands ?? [], this.min, this.max, this.lowerIsBetter), f);
    if (i !== this._band) this._band = i;
    this._reading = true;
  };

  #key = (e: KeyboardEvent) => {
    const n = bandsOf(this.bands ?? [], this.min, this.max, this.lowerIsBetter).length;
    if (!n) return;
    const rtl = isRtl(this);
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number;
    if (e.key === forward) next = Math.min(n - 1, this._band + 1);
    else if (e.key === back) next = this._band < 0 ? n - 1 : Math.max(0, this._band - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else if (e.key === "Escape") next = -1;
    else return;
    e.preventDefault();
    this._band = next;
  };

  render() {
    const { min, max } = this;
    const bands = bandsOf(this.bands ?? [], min, max, this.lowerIsBetter);
    const fill = fraction(this.value, min, max) * 100;
    const on = bands[this._band];
    const sentence = this.#sentence();
    const off = () => {
      this._reading = false;
      this._band = -1;
    };
    return html`<div class=${bullet()}>
      ${
        this.heading || this.valueText
          ? html`<div class=${bulletHead()} aria-hidden="true">
              <span class=${bulletHeading()}>${this.heading}</span>
              <span class=${bulletValue()}>${this.valueText || formatInt(this.value)}</span>
            </div>`
          : nothing
      }
      <div
        class=${bulletTrack()}
        role="meter"
        tabindex="0"
        aria-label=${this.label || this.heading || m.bullet_label()}
        aria-valuenow=${this.value}
        aria-valuemin=${min}
        aria-valuemax=${max}
        aria-valuetext=${sentence}
        @pointermove=${this.#point}
        @pointerleave=${off}
        @focus=${() => (this._reading = true)}
        @blur=${off}
        @keydown=${this.#key}
      >
        ${bands.map(
          (b, i) =>
            html`<span
              class=${bulletBand({ quality: b.quality, dim: this._band >= 0 && this._band !== i })}
              style=${styleMap({ insetInlineStart: `${b.from * 100}%`, insetInlineEnd: `${(1 - b.end) * 100}%` })}
            ></span>`,
        )}
        <span class=${bulletLane()}>
          <span class=${bulletBar()} style=${styleMap({ "--fill": `${fill}%` })}></span>
        </span>
        ${
          this.target !== undefined
            ? html`<span
                class=${bulletTarget()}
                style=${styleMap({ insetInlineStart: `calc(${fraction(this.target, min, max) * 100}% - 1px)` })}
              ></span>`
            : nothing
        }
      </div>
      <p class=${bulletReading()} aria-live="polite">
        ${
          on
            ? m.bullet_band({
                quality: QUALITY[on.quality](),
                low: formatInt(on.low),
                high: formatInt(on.high),
                reading: sentence,
              })
            : this._reading
              ? sentence
              : this.target !== undefined
                ? m.bullet_target({ target: this.targetText || formatInt(this.target) })
                : nothing
        }
      </p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-bullet": UiBullet;
  }
}
