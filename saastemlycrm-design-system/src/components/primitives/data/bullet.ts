import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../lib/i18n/index.ts";
import { isRtl } from "../../../lib/base/reading.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../../lib/base/motion-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { row, rowFill, stack, text } from "../../../styles/algebra.ts";
import { bandsOf, fraction, indexAt, percentOf, percentText, type Quality } from "../../../lib/base/visual-math.ts";

export const bullet = rcva(`${stack} w-full gap-1`);
export const bulletHead = rcva(`${row} items-baseline gap-x-2`);
export const bulletHeading = rcva(`${rowFill} truncate text-body-md text-on-surface`);
export const bulletValue = rcva(`${text.label} text-title-sm tabular-nums text-on-surface`);
export const bulletTrack = rcva(
  "relative h-6 w-full overflow-hidden [--clips:bar] rounded-xs bg-surface-container-highest",
);
export const bulletBand = rcva("absolute inset-y-0 [transition:opacity_var(--duration-short4)_var(--ease-standard)]", {
  variants: {
    quality: { poor: "bg-on-surface/20", ok: "bg-on-surface/12", good: "bg-on-surface/5" },
    dim: { true: "opacity-40", false: "" },
  },
});
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

@customElement("ui-bullet")
export class UiBullet extends LightElement {
  @property() label = "";
  @property() heading = "";
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) target?: number;
  @property({ attribute: false }) bands?: number[];
  @property({ attribute: "value-text" }) valueText = "";
  @property({ attribute: "target-text" }) targetText = "";
  @property({ type: Boolean, attribute: "lower-is-better" }) lowerIsBetter = false;
  @state() private _reading = false;
  @state() private _band = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed) {
      this.#revealed = true;
      const grow = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSTransition && a.transitionProperty === "width",
      );
      void motion.add(grow, "ambient", this);
    }
  }

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
