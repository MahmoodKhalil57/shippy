import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../../lib/base/motion-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { row, stack, text, tiles } from "../../../styles/algebra.ts";
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
} from "../../../lib/base/visual-math.ts";

export const dial = rcva(`${stack} w-full items-center gap-1`);
export const dialFace = rcva(
  `${tiles["4"]} relative aspect-[2/1] overflow-hidden [--clips:shape] rounded-t-full [animation:dial-sweep_var(--duration-long4)_var(--ease-emphasized-decelerate)_backwards] [transition:--dial-angle_var(--duration-medium4)_var(--ease-emphasized-decelerate)] motion-reduce:[animation:none] motion-reduce:transition-none`,
);
export const dialArc = rcva(
  "absolute inset-x-0 top-0 aspect-square rounded-full [background:var(--dial-fill)] [mask-image:radial-gradient(closest-side,transparent_71%,#000_72%)]",
);
export const dialNeedle = rcva(
  "pointer-events-none absolute bottom-0 h-full w-1 origin-bottom [rotate:calc(var(--dial-angle)_-_90deg)]",
);
export const dialNeedleTip = rcva("block h-[40%] w-full rounded-full bg-on-surface");
export const dialMiddle = rcva(
  `${stack} pointer-events-none absolute inset-x-[22%] bottom-0 items-center justify-end text-center`,
);
export const dialValue = rcva(`${text.label} text-headline-sm tabular-nums text-on-surface`);
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
const GAP = 1;

@customElement("ui-dial")
export class UiDial extends LightElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property() label = "";
  @property({ attribute: "value-text" }) valueText = "";
  @property() caption = "";
  @property({ attribute: false }) zones?: Zone[];
  @state() private _reading = false;
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
