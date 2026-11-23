import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { row, stack, text, tiles } from "../layout/algebra.ts";
import {
  fraction,
  indexAt,
  percentOf,
  percentText,
  TRACK,
  zonesOf,
  type DrawnZone,
  type Zone,
  type ZoneTone,
} from "./visual-math.ts";

/**
 * Dial: one reading on a half-circle scale with a needle (a speedometer): utilisation, on-time
 * rate, a score, where how far round the needle is says it at a glance and the zones say whether
 * that's good.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **One measure, one hue:** without zones the arc fills in `chart-1` up to the reading, the rest
 *   of the half-circle the track (the highest container colour).
 * - **Zones are status, so they take status tones:** `zones` (ascending, each up to its `to`)
 *   colour the arc success / warning / error, a 2px gap between them, and the needle reads the
 *   value on them. Past the last zone the track shows.
 * - **Text in text colours:** the reading big in the middle under the arc, the range's ends under
 *   it, the caption and the line read in ink; never a zone's colour.
 * - **Alive:** the needle (and the filled arc) sweep round from the start of the range to the
 *   reading as it enters, and to a new reading when it changes (`dial-sweep`, theme.css, as
 *   ambient motion; with Reduce motion it's simply there). Pointing at a zone, or stepping to it
 *   with ← → once the dial has focus, brings it forward (the others fade) and the line under it
 *   reads it; pointing anywhere else or focusing it reads the value against its range.
 * - It's a `meter` for assistive tech (value, range and the sentence); `label` names it, and the
 *   line under it is a live region.
 *
 * No `<svg>`: the arc is a `conic-gradient` masked to a ring and clipped to its upper half; the
 * needle a rotated box.
 */
export const dial = rcva(`${stack} w-full items-center gap-1`);
/** The half-circle: four tiles across, half as high. */
export const dialFace = rcva(
  `${tiles["4"]} relative aspect-[2/1] overflow-hidden [--clips:shape] rounded-t-full [animation:dial-sweep_var(--duration-long4)_var(--ease-emphasized-decelerate)_backwards] [transition:--dial-angle_var(--duration-medium4)_var(--ease-emphasized-decelerate)] motion-reduce:[animation:none] motion-reduce:transition-none`,
);
/** The whole circle (its lower half clipped by the face), drawn by `--dial-fill`, masked to a ring. */
export const dialArc = rcva(
  "absolute inset-x-0 top-0 aspect-square rounded-full [background:var(--dial-fill)] [mask-image:radial-gradient(closest-side,transparent_71%,#000_72%)]",
);
/** The needle: a box the face's height, pivoting at the bottom middle; its outer part drawn. */
export const dialNeedle = rcva(
  "pointer-events-none absolute bottom-0 h-full w-1 origin-bottom [rotate:calc(var(--dial-angle)_-_90deg)]",
);
export const dialNeedleTip = rcva("block h-[40%] w-full rounded-full bg-on-surface");
/** The reading, in the middle under the arc. */
export const dialMiddle = rcva(
  `${stack} pointer-events-none absolute inset-x-[22%] bottom-0 items-center justify-end text-center`,
);
export const dialValue = rcva(`${text.label} text-headline-sm tabular-nums text-on-surface`);
/** The range's two ends, under the arc's. */
export const dialEnds = rcva(
  `${row} ${tiles["4"]} justify-between gap-x-2 text-label-sm tabular-nums text-on-surface-variant`,
);
export const dialEnd = rcva(text.label);
export const dialLine = rcva(`${text.label} min-h-4 text-center text-label-md tabular-nums text-on-surface-variant`);

const TONE: Record<ZoneTone, string> = {
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
};
/** The gap between two zones, in degrees (2px at this size). */
const GAP = 1;

/**
 * @example <ui-dial label="Capacity used" caption="Capacity used" .value=${72} value-text="72%"></ui-dial>
 * @example <ui-dial label="On-time rate" .value=${88} value-text="88%" .zones=${[{ to: 70, tone: "error" }, { to: 85, tone: "warning" }, { to: 100, tone: "success", label: "On track" }]}></ui-dial>
 */
@customElement("ui-dial")
export class UiDial extends LightElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  /** The whole, for screen readers ("On-time rate"); left out, the caption. */
  @property() label = "";
  /** How the value reads ("88%"); left out, the number. */
  @property({ attribute: "value-text" }) valueText = "";
  /** What it measures, under the dial ("On-time rate"). */
  @property() caption = "";
  /** Status zones along the range, ascending by `to`; left out, one `chart-1` arc to the value. */
  @property({ attribute: false }) zones?: Zone[];
  /** Read under the dial while it's pointed at or focused. */
  @state() private _reading = false;
  /** The zone pointed at or stepped to (-1: none). */
  @state() private _zone = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed) {
      this.#revealed = true;
      const sweep = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "dial-sweep",
      );
      void motion.add(sweep, "ambient", this);
    }
  }

  #zones(): DrawnZone[] {
    return zonesOf(this.zones ?? [], this.min, this.max);
  }

  #fill(zones: DrawnZone[]) {
    if (!zones.length)
      return `conic-gradient(from 270deg, var(--chart-1) 0deg var(--dial-angle), ${TRACK} var(--dial-angle) 180deg, transparent 180deg)`;
    const stops = zones.flatMap((z, i) => {
      const from = z.from * 180;
      const to = z.end * 180;
      const end = i < zones.length - 1 ? Math.max(from, to - GAP) : to;
      const c = TONE[z.tone];
      const hue = this._zone >= 0 && this._zone !== i ? `color-mix(in oklab, ${c} 30%, transparent)` : c;
      return [`${hue} ${from}deg ${end}deg`, `transparent ${end}deg ${to}deg`];
    });
    const last = zones.at(-1)!.end * 180;
    if (last < 180) stops.push(`${TRACK} ${Math.min(180, last + GAP)}deg 180deg`);
    stops.push("transparent 180deg");
    return `conic-gradient(from 270deg, ${stops.join(", ")})`;
  }

  #sentence() {
    const value = this.valueText || formatInt(this.value);
    const p = percentOf(this.value - this.min, this.max - this.min);
    return p === null
      ? value
      : m.dial_reading({ value, share: percentText(p), min: formatInt(this.min), max: formatInt(this.max) });
  }

  #zoneText(z: DrawnZone) {
    const low = formatInt(z.low);
    const high = formatInt(z.high);
    return z.label ? m.dial_zone({ zone: z.label, low, high }) : m.dial_range({ low, high });
  }

  /** Where the pointer is on the arc, as a fraction of the range (null: off the arc's band). */
  #point = (e: PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = r.bottom - e.clientY;
    const d = Math.hypot(x, y) / (r.width / 2);
    const zones = this.#zones();
    const i = d >= 0.7 && d <= 1 && y >= 0 ? indexAt(zones, 1 - Math.atan2(y, x) / Math.PI) : -1;
    if (i !== this._zone) this._zone = i;
    this._reading = true;
  };

  #key = (e: KeyboardEvent) => {
    const n = this.#zones().length;
    if (!n) return;
    let next: number;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(n - 1, this._zone + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown")
      next = this._zone < 0 ? n - 1 : Math.max(0, this._zone - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else if (e.key === "Escape") next = -1;
    else return;
    e.preventDefault();
    this._zone = next;
  };

  render() {
    const zones = this.#zones();
    const on = zones[this._zone];
    const angle = fraction(this.value, this.min, this.max) * 180;
    const sentence = this.#sentence();
    const off = () => {
      this._reading = false;
      this._zone = -1;
    };
    const line = on ? this.#zoneText(on) : this._reading ? sentence : this.caption;
    return html`<div class=${dial()}>
      <div
        class=${dialFace()}
        role="meter"
        tabindex="0"
        aria-label=${this.label || this.caption || m.dial_label()}
        aria-valuenow=${this.value}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuetext=${sentence}
        style=${styleMap({ "--dial-angle": `${angle}deg` })}
        @pointermove=${this.#point}
        @pointerleave=${off}
        @focus=${() => (this._reading = true)}
        @blur=${off}
        @keydown=${this.#key}
      >
        <div class=${dialArc()} style=${styleMap({ "--dial-fill": this.#fill(zones) })}></div>
        <div class=${dialNeedle()} style=${styleMap({ insetInlineStart: "calc(50% - 2px)" })}>
          <span class=${dialNeedleTip()}></span>
        </div>
        <div class=${dialMiddle()} aria-hidden="true">
          <span class=${dialValue()}>${this.valueText || formatInt(this.value)}</span>
        </div>
      </div>
      <div class=${dialEnds()} aria-hidden="true" dir="ltr">
        <span class=${dialEnd()}>${formatInt(this.min)}</span>
        <span class=${dialEnd()}>${formatInt(this.max)}</span>
      </div>
      <p class=${dialLine()} aria-live="polite">${line || nothing}</p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-dial": UiDial;
  }
}
