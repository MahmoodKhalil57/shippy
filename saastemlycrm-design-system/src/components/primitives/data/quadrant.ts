import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { heightOf, median, paddedExtent, position, quadrantOf, sizeStep } from "../../base/quadrant.ts";
import { rcva } from "../../base/variants.ts";
import { row, rowLine, stack, text } from "../layout/algebra.ts";

/**
 * Quadrant: things placed by two measures and split into four kinds by a line across each
 * (suppliers by on-time % and reply hours: reliable and fast, reliable but slow …), so where each
 * one falls says what to do about it.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **One series, one hue** (`chart-1`), every dot at least 10px with a 2px ring of the surface so
 *   overlapping dots stay apart; `size` (optional) sets a dot's area in four steps, by √, so area
 *   reads as amount.
 * - **Hairline midlines** (`outline-variant`) at `xMid` / `yMid` (the medians unless given), the
 *   corner captions (`quadrants`) in text colours, the axis names under and over the plot.
 * - **Up is better:** with `invertY` (lower y is better: reply hours) low values are drawn high, so
 *   the top end quadrant is always the good one.
 * - **Alive:** the dots fade and grow in as they enter, one after the other (`cell-in`, theme.css;
 *   ambient motion); pointing at a dot (hover or focus; ←→ / ↑↓ step through them in x order, Home
 *   / End) enlarges it, fades the others, and the line under it reads it ("Brightway · On-time 96 ·
 *   Reply hours 3"); otherwise it reads where the lines split. A dot with `href` is a link.
 * - It's a list of the points for assistive tech, each named with its measures and quadrant;
 *   `label` names the whole; the readout is a live region.
 *
 * No `<svg>`: each dot is a positioned box, placed by `--x` `--y` (percentages of the plot).
 */
export const quadrant = rcva(`${stack} w-full gap-1`);
export const quadrantYLabel = rcva(`${text.line} text-label-sm text-on-surface-variant`);
export const quadrantPlot = rcva(
  "relative h-56 w-full rounded-field border border-outline-variant bg-surface-container-lowest",
);
export const quadrantMidX = rcva("pointer-events-none absolute inset-y-0 start-(--x) border-s border-outline-variant");
export const quadrantMidY = rcva("pointer-events-none absolute inset-x-0 bottom-(--y) border-t border-outline-variant");
/** A corner's caption, inside its corner. */
export const quadrantCaption = rcva(
  `${text.line} pointer-events-none absolute max-w-[45%] text-label-sm text-on-surface-variant opacity-60`,
  {
    variants: {
      corner: {
        "0": "top-1.5 start-2 text-start",
        "1": "top-1.5 end-2 text-end",
        "2": "bottom-1.5 start-2 text-start",
        "3": "bottom-1.5 end-2 text-end",
      },
    },
  },
);
/** A dot's hit area (24px, centred on its point): it fades and grows in as it enters. */
export const quadrantMark = rcva(
  "absolute start-(--x) bottom-(--y) z-0 grid size-6 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full rtl:translate-x-1/2 [animation:cell-in_var(--duration-medium4)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(var(--i)*var(--duration-short1))] [transition:opacity_var(--duration-short4)_var(--ease-standard)] motion-reduce:[animation:none]",
  {
    variants: {
      dim: { true: "opacity-30", false: "" },
      on: { true: "z-10", false: "" },
      link: { true: "cursor-pointer", false: "" },
    },
  },
);
export const quadrantDot = rcva(
  "pointer-events-none rounded-full bg-chart-1 ring-2 ring-surface [transition:scale_var(--duration-short4)_var(--ease-standard)] motion-reduce:transition-none",
  {
    variants: {
      size: { "0": "size-2.5", "1": "size-3.5", "2": "size-4.5", "3": "size-6" },
      on: { true: "scale-150", false: "" },
    },
  },
);
export const quadrantFoot = rcva(`${row} items-baseline gap-x-3 gap-y-1`);
export const quadrantReadout = rcva(`${rowLine} text-label-md tabular-nums text-on-surface-variant`);
export const quadrantXLabel = rcva(`${text.label} text-label-sm text-end text-on-surface-variant`);

export interface QuadrantPoint {
  label: string;
  x: number;
  y: number;
  /** What else it reads ("USD 41.7k spend"), after its measures. */
  valueText?: string;
  /** Choosing the dot opens this. */
  href?: string;
  /** Its weight (spend, volume): a bigger dot by area. */
  size?: number;
}

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/**
 * @example <ui-quadrant label="Suppliers" x-label="On-time %" y-label="Reply hours" invert-y .quadrants=${["Reliable but slow", "Reliable & fast", "Unreliable & slow", "Fast but unreliable"]} .points=${[{ label: "Brightway", x: 96, y: 3 }, …]}></ui-quadrant>
 */
@customElement("ui-quadrant")
export class UiQuadrant extends LightElement {
  @property({ attribute: false }) points: QuadrantPoint[] = [];
  /** The whole, for screen readers ("Suppliers"). */
  @property() label = "";
  @property({ attribute: "x-label" }) xLabel = "";
  @property({ attribute: "y-label" }) yLabel = "";
  /** Where the vertical line splits x; left out, the median. */
  @property({ type: Number, attribute: "x-mid" }) xMid?: number;
  /** Where the horizontal line splits y; left out, the median. */
  @property({ type: Number, attribute: "y-mid" }) yMid?: number;
  /** The x range shown; left out, the data's padded by 8% a side. */
  @property({ attribute: false }) xDomain?: [number, number];
  @property({ attribute: false }) yDomain?: [number, number];
  /** The corners' captions: top start, top end, bottom start, bottom end (as drawn). */
  @property({ attribute: false }) quadrants?: [
    topStart: string,
    topEnd: string,
    bottomStart: string,
    bottomEnd: string,
  ];
  /** Lower y is better: low values are drawn high. */
  @property({ type: Boolean, attribute: "invert-y" }) invertY = false;
  /** The point pointed at, by its index (-1: none). */
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.points.length) {
      this.#revealed = true;
      const enter = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "cell-in",
      );
      void motion.add(enter, "ambient", this);
    }
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  /** The points in x order (then y): the order the arrow keys step through. */
  #order(): number[] {
    const p = this.points;
    return p.map((_, i) => i).sort((a, b) => p[a]!.x - p[b]!.x || p[a]!.y - p[b]!.y);
  }

  #key = (e: KeyboardEvent) => {
    const order = this.#order();
    const marks = [...this.querySelectorAll<HTMLElement>("[data-point]")];
    const focused = marks.indexOf(document.activeElement as HTMLElement);
    if (!order.length || focused < 0) return;
    const at = order.indexOf(focused);
    const rtl = getComputedStyle(this).direction === "rtl";
    const step: Record<string, number> = {
      ArrowLeft: rtl ? 1 : -1,
      ArrowRight: rtl ? -1 : 1,
      ArrowUp: 1,
      ArrowDown: -1,
    };
    let next: number;
    if (e.key in step) next = (at + step[e.key]! + order.length) % order.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = order.length - 1;
    else return;
    e.preventDefault();
    marks[order[next]!]?.focus();
  };

  render() {
    const p = this.points;
    const xs = p.map((d) => d.x);
    const ys = p.map((d) => d.y);
    const xMid = this.xMid ?? median(xs);
    const yMid = this.yMid ?? median(ys);
    const xd = this.xDomain ?? paddedExtent(xs);
    const yd = this.yDomain ?? paddedExtent(ys);
    const most = Math.max(0, ...p.map((d) => d.size ?? 0));
    const caps = this.quadrants;
    const x = (v: number) => `${this.xLabel ? `${this.xLabel} ` : ""}${num(v)}`;
    const y = (v: number) => `${this.yLabel ? `${this.yLabel} ` : ""}${num(v)}`;
    const read = (d: QuadrantPoint) => [d.label, x(d.x), y(d.y), d.valueText].filter(Boolean).join(" · ");
    const on = p[this._active];
    const readout = on ? read(on) : p.length ? `Split at ${x(xMid)} · ${y(yMid)}` : "";
    return html`<div class=${quadrant()}>
      ${this.yLabel ? html`<span class=${quadrantYLabel()} aria-hidden="true">${this.yLabel}</span>` : nothing}
      <ul
        class=${quadrantPlot()}
        aria-label=${this.label || nothing}
        @keydown=${this.#key}
        @pointerleave=${() => this.#set(-1)}
      >
        <li class=${quadrantMidX()} aria-hidden="true" style=${styleMap({ "--x": `${position(xMid, xd)}%` })}></li>
        <li
          class=${quadrantMidY()}
          aria-hidden="true"
          style=${styleMap({ "--y": `${heightOf(yMid, yd, this.invertY)}%` })}
        ></li>
        ${
          caps
            ? (["0", "1", "2", "3"] as const).map(
                (c) => html`<li class=${quadrantCaption({ corner: c })} aria-hidden="true">${caps[Number(c)]}</li>`,
              )
            : nothing
        }
        ${p.map((d, i) => {
          const q = quadrantOf(d.x, d.y, xMid, yMid, this.invertY);
          const name = `${read(d)}${caps?.[q] ? `, ${caps[q]}` : ""}`;
          const cls = quadrantMark({
            dim: this._active >= 0 && this._active !== i,
            on: this._active === i,
            link: !!d.href,
          });
          const style = styleMap({
            "--x": `${position(d.x, xd)}%`,
            "--y": `${heightOf(d.y, yd, this.invertY)}%`,
            "--i": String(i),
          });
          const dot = html`<span
            class=${quadrantDot({ size: String(sizeStep(d.size, most)) as "0", on: this._active === i })}
          ></span>`;
          const enter = () => this.#set(i);
          const leave = () => this.#set(-1);
          return d.href
            ? html`<li>
                <a
                  class=${cls}
                  style=${style}
                  href=${d.href}
                  data-point
                  aria-label=${name}
                  @pointerenter=${enter}
                  @focus=${enter}
                  @blur=${leave}
                  >${dot}</a
                >
              </li>`
            : html`<li
                class=${cls}
                style=${style}
                tabindex="0"
                data-point
                aria-label=${name}
                @pointerenter=${enter}
                @focus=${enter}
                @blur=${leave}
              >
                ${dot}
              </li>`;
        })}
      </ul>
      <div class=${quadrantFoot()}>
        <p class=${quadrantReadout()} aria-live="polite">${readout}</p>
        ${this.xLabel ? html`<span class=${quadrantXLabel()} aria-hidden="true">${this.xLabel} →</span>` : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-quadrant": UiQuadrant;
  }
}
