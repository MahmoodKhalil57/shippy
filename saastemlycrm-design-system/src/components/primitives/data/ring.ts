import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, fixedWidth, row, rowFill, rowLine, stack, text, tiles } from "../layout/algebra.ts";

/**
 * Ring: parts of a whole as a donut, or one reading of a known most (a progress ring), with what
 * it adds up to in its middle and its parts listed beside it.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **Identity by a fixed order of hues:** part 1 is `chart-1`, part 2 `chart-2` … up to six; a
 *   seventh and later fold into one "Other" in `chart-muted` (never a generated hue). With `max`,
 *   what's left to it is the track, in the highest container colour, and isn't listed.
 * - **A 2px gap** between touching parts (1.5° at this size), the hole two thirds of the ring.
 * - **Text in text colours:** the legend's labels and values never take a part's hue; a dot beside
 *   each carries it, so identity is never colour alone.
 * - **Alive:** pointing at a part of the ring, or its row in the legend (hover or focus), brings it
 *   forward (the others fade to 30%) and the middle reads that part: its value, its label and its
 *   share. A part with `href` opens it (its legend row is the link). The ring sweeps round from 12
 *   o'clock as it enters (`ring-sweep`, theme.css), as ambient motion (src/components/base/motion-queue.ts);
 *   with Reduce motion it's simply there.
 * - The legend is what assistive tech reads (the ring itself is drawn, `aria-hidden`); `label`
 *   names the whole.
 *
 * No `<svg>`: the ring is a `conic-gradient` masked to a ring (and, entering, to the swept angle).
 */
export const ring = rcva(`${row} w-full items-center gap-4`);
/** The ring and its middle: two tiles square, never squeezed. */
export const ringDial = rcva(`${tiles["2"]} relative aspect-square`);
export const ringArc = rcva(
  "absolute inset-0 rounded-full [background:var(--ring-fill)] [mask-image:radial-gradient(closest-side,transparent_66%,#000_67%),conic-gradient(#000_var(--ring-sweep),transparent_0)] [mask-composite:intersect] [animation:ring-sweep_var(--duration-long2)_var(--ease-emphasized-decelerate)_both] [transition:background_var(--duration-short4)_var(--ease-standard)] motion-reduce:[animation:none]",
);
/** What it adds up to (or the part pointed at), in the hole. */
export const ringMiddle = rcva(
  `${stack} pointer-events-none absolute inset-[22%] items-center justify-center text-center`,
);
export const ringValue = rcva(`${text.label} max-w-full text-title-sm tabular-nums text-on-surface`);
export const ringCaption = rcva(`${text.label} line-clamp-2 text-label-sm text-on-surface-variant`);
export const ringLegend = rcva(`${stack} ${rowFill} gap-0.5`);
export const ringItem = rcva(
  `${row} items-center gap-2 rounded-field px-1 py-0.5 ${text.label} text-body-sm outline-none [transition:opacity_var(--duration-short4)_var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-primary`,
  {
    variants: {
      dim: { true: "opacity-50", false: "" },
      link: { true: "cursor-pointer hover:underline", false: "" },
    },
  },
);
export const ringDot = rcva(`${fixed["2.5"]} rounded-full`, {
  variants: {
    slot: {
      "0": "bg-chart-1",
      "1": "bg-chart-2",
      "2": "bg-chart-3",
      "3": "bg-chart-4",
      "4": "bg-chart-5",
      "5": "bg-chart-6",
      muted: "bg-chart-muted",
    },
  },
});
export const ringLabel = rcva(`${rowLine} text-on-surface`);
export const ringAmount = rcva(`${text.label} tabular-nums text-on-surface`);
export const ringShare = rcva(`${fixedWidth["10"]} ${text.label} text-end tabular-nums text-on-surface-variant`);

export interface RingPart {
  label: string;
  value: number;
  /** How the value reads ("USD 41.7k"); left out, the number. */
  valueText?: string;
  /** Pointing at it and choosing it opens this (its legend row is the link). */
  href?: string;
}

type Slot = "0" | "1" | "2" | "3" | "4" | "5" | "muted";
interface Drawn extends RingPart {
  slot: Slot;
  from: number;
  to: number;
}

/** A part's hue as a CSS colour, at full strength or faded. */
const hue = (slot: Slot, faded: boolean) => {
  const c = slot === "muted" ? "var(--chart-muted)" : `var(--chart-${Number(slot) + 1})`;
  return faded ? `color-mix(in oklab, ${c} 30%, transparent)` : c;
};
/** The gap between touching parts, in degrees (2px at this size). */
const GAP = 1.5;

/**
 * @example <ui-ring label="Receivables by age" center-label="Open" .parts=${[{ label: "Not due", value: 41.7, valueText: "USD 41.7k" }, …]}></ui-ring>
 * @example <ui-ring label="Lines quoted" .max=${8} center-label="of 8 quoted" .parts=${[{ label: "Quoted", value: 5 }]}></ui-ring>
 */
@customElement("ui-ring")
export class UiRing extends LightElement {
  @property({ attribute: false }) parts: RingPart[] = [];
  /** The whole it's measured against (a progress ring); left out, the parts' sum. */
  @property({ type: Number }) max?: number;
  /** The whole, for screen readers ("Receivables by age"). */
  @property() label = "";
  /** What the middle's total is ("Open", "of 8 quoted"). */
  @property({ attribute: "center-label" }) centerLabel = "";
  /** How the total reads ("USD 58.8k"); left out, the sum. */
  @property({ attribute: "total-text" }) totalText = "";
  /** The part pointed at, by its index (-1: none). */
  @state() private _active = -1;
  #revealed = false;

  /** At most six hues: a seventh part and later fold into "Other". */
  #shown(): RingPart[] {
    const p = this.parts.filter((x) => x.value > 0);
    if (p.length <= 6) return p;
    const rest = p.slice(5);
    return [...p.slice(0, 5), { label: "Other", value: rest.reduce((t, x) => t + x.value, 0) }];
  }

  #drawn(): { parts: Drawn[]; whole: number; sum: number } {
    const shown = this.#shown();
    const sum = shown.reduce((t, x) => t + x.value, 0);
    const whole = Math.max(sum, this.max ?? 0) || 1;
    let at = 0;
    const parts = shown.map((x, i): Drawn => {
      const from = at;
      at += (x.value / whole) * 360;
      const slot: Slot = x.label === "Other" && i === 5 && this.parts.length > 6 ? "muted" : (String(i) as Slot);
      return { ...x, slot, from, to: at };
    });
    return { parts, whole, sum };
  }

  #gradient(parts: Drawn[]) {
    const gap = parts.length > 1 || (this.max ?? 0) > 0 ? GAP : 0;
    const stops = parts.flatMap((p, i) => {
      const end = Math.max(p.from, p.to - gap);
      const c = hue(p.slot, this._active >= 0 && this._active !== i);
      return [`${c} ${p.from}deg ${end}deg`, `transparent ${end}deg ${p.to}deg`];
    });
    const last = parts.at(-1)?.to ?? 0;
    if (last < 360)
      stops.push(`color-mix(in oklab, var(--color-base-100), var(--color-base-content) 10%) ${last}deg 360deg`);
    return `conic-gradient(${stops.join(", ")})`;
  }

  /** The part under the pointer on the ring itself (its angle from 12 o'clock, inside the band). */
  #point(e: PointerEvent, parts: Drawn[]) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(x, y) / (r.width / 2);
    if (d < 0.66 || d > 1) return -1;
    const deg = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
    return parts.findIndex((p) => deg >= p.from && deg < p.to);
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  protected updated() {
    // The sweep is ambient motion: it plays when nothing a person did is still moving.
    if (!this.#revealed && this.parts.length) {
      this.#revealed = true;
      const sweep = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "ring-sweep",
      );
      void motion.add(sweep, "ambient", this);
    }
  }

  render() {
    const { parts, whole, sum } = this.#drawn();
    const active = parts[this._active];
    const share = (v: number) => `${Math.round((v / (this.max ? whole : sum || 1)) * 100)}%`;
    return html`<div class=${ring()}>
      <div class=${ringDial()}>
        <div
          class=${ringArc()}
          aria-hidden="true"
          style=${styleMap({ "--ring-fill": this.#gradient(parts) })}
          @pointermove=${(e: PointerEvent) => this.#set(this.#point(e, parts))}
          @pointerleave=${() => this.#set(-1)}
          @click=${(e: PointerEvent) => {
            const p = parts[this.#point(e, parts)];
            if (p?.href) this.querySelector<HTMLAnchorElement>(`a[data-part="${parts.indexOf(p)}"]`)?.click();
          }}
        ></div>
        <div class=${ringMiddle()} aria-hidden="true">
          <span class=${ringValue()}
            >${active ? (active.valueText ?? String(active.value)) : this.totalText || String(sum)}</span
          >
          <span class=${ringCaption()}>${active ? `${active.label} · ${share(active.value)}` : this.centerLabel}</span>
        </div>
      </div>
      <ul class=${ringLegend()} aria-label=${this.label || nothing}>
        ${parts.map((p, i) => {
          const body = html`<span class=${ringDot({ slot: p.slot })}></span>
            <span class=${ringLabel()}>${p.label}</span>
            <span class=${ringAmount()}>${p.valueText ?? String(p.value)}</span>
            <span class=${ringShare()}>${share(p.value)}</span>`;
          const cls = ringItem({ dim: this._active >= 0 && this._active !== i, link: !!p.href });
          const on = () => this.#set(i);
          const off = () => this.#set(-1);
          return html`<li>
            ${
              p.href
                ? html`<a
                    class=${cls}
                    href=${p.href}
                    data-part=${i}
                    @pointerenter=${on}
                    @pointerleave=${off}
                    @focus=${on}
                    @blur=${off}
                    >${body}</a
                  >`
                : html`<div
                    class=${cls}
                    tabindex="0"
                    @pointerenter=${on}
                    @pointerleave=${off}
                    @focus=${on}
                    @blur=${off}
                  >
                    ${body}
                  </div>`
            }
          </li>`;
        })}
      </ul>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-ring": UiRing;
  }
}
