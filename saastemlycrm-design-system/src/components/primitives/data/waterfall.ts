import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { bridge, bridgeAt, bridgeDomain, bridgeFit, type BridgeColumn } from "../../base/waterfall.ts";
import { fixed, row, stack, text } from "../layout/algebra.ts";

/**
 * Waterfall: how a start value becomes an end value (a bridge): each change a column that rises or
 * falls from where the last one ended, and subtotals standing on the baseline.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **Direction by two palette slots, never status:** a rise is `chart-1`, a fall `chart-3`, a
 *   total `chart-muted`, keyed under the plot, and the readout says the sign, so it's never colour
 *   alone. Labels and values stay in text colours.
 * - **Every column starts where the last ended** (src/components/base/waterfall.ts, proved in
 *   tests/waterfall.test.ts), with a hairline connector between them at that level, and a total
 *   stands on the zero baseline (drawn in `outline`).
 * - **The x labels under it** each in its own column, cut with an ellipsis when long.
 * - **Alive:** the columns grow from their base as it enters, one after the other (a `scale`
 *   transition from `@starting-style`, as ambient motion); pointing at a column (hover, focus, or
 *   ←→ / Home / End once one has focus) brings it forward, fades the rest, and the line under it
 *   reads it ("Freight: −USD 4.2k → USD 38.1k"); otherwise it reads the end total.
 * - It's a list of the steps for assistive tech, each named with its change and running total;
 *   `label` names the whole; the readout is a live region.
 *
 * - **`fit`:** for a bridge whose changes are small next to its totals, the plot spans the levels
 *   it moves through, not zero (`bridgeFit`); the totals then stand on a dashed line, the cut axis,
 *   instead of the solid zero line.
 *
 * No `<svg>`: each column is a positioned box, placed by `--x` `--w` (its slot) and `--b` `--h`
 * (its base and height, percentages of the plot).
 */
export const waterfall = rcva(`${stack} w-full gap-2`);
export const waterfallPlot = rcva("relative h-40 w-full");
/** A step's slot: the full height of the plot, its share of the width. */
export const waterfallSlot = rcva(
  "absolute inset-y-0 start-(--x) w-(--w) max-w-full rounded-xs [transition:opacity_var(--duration-short4)_var(--ease-standard)]",
  {
    variants: {
      dim: { true: "opacity-40", false: "" },
      on: { true: "bg-on-surface/(--state-hover)", false: "" },
    },
  },
);
/**
 * The column: from its base (`--b`) up `--h`. It grows from its base as it enters: a rise and a
 * total from the bottom, a fall from the top (it hangs from where the last column ended).
 */
export const waterfallBar = rcva(
  "pointer-events-none absolute inset-x-[18%] bottom-(--b) h-(--h) min-h-px rounded-xs [transition:scale_var(--duration-long2)_var(--ease-emphasized-decelerate)_calc(var(--i)*var(--duration-short2))] motion-reduce:transition-none starting:scale-y-0",
  {
    variants: {
      kind: {
        up: "origin-bottom bg-chart-1",
        down: "origin-top bg-chart-3",
        total: "origin-bottom bg-chart-muted",
      },
    },
  },
);
/** The hairline from one column's end to the next one's start, at the running total. */
export const waterfallConnector = rcva(
  "pointer-events-none absolute start-(--x) w-(--w) max-w-full bottom-(--y) border-t border-outline-variant",
);
export const waterfallBaseline = rcva("pointer-events-none absolute inset-x-0 bottom-(--y) border-t border-outline", {
  variants: { cut: { true: "border-dashed", false: "" } },
});
export const waterfallAxis = rcva("relative h-5 w-full");
export const waterfallTick = rcva(
  `${text.line} absolute top-0 start-(--x) w-(--w) max-w-full text-center text-label-sm text-on-surface-variant`,
);
export const waterfallFoot = rcva(`${row} items-center justify-between gap-x-3 gap-y-1`);
export const waterfallReadout = rcva(`${text.label} text-label-md tabular-nums text-on-surface-variant`);
export const waterfallKey = rcva(`${row} items-center gap-x-3 gap-y-1 text-label-sm text-on-surface-variant`);
export const waterfallKeyItem = rcva(`${row} items-center gap-1`);
export const waterfallSwatch = rcva(`${fixed["2.5"]} rounded-xs`, {
  variants: { kind: { up: "bg-chart-1", down: "bg-chart-3", total: "bg-chart-muted" } },
});

export interface WaterfallStep {
  label: string;
  /** The change (or, for a total, ignored: a total is the running total). */
  value: number;
  /** How the change reads ("USD 4.2k", no sign); left out, `format` of its size. */
  valueText?: string;
  /** A subtotal: drawn from 0 to the running total; it doesn't add. */
  total?: boolean;
}

const MINUS = "−";

/**
 * @example <ui-waterfall label="Margin bridge" .format=${(n) => `USD ${n.toFixed(1)}k`} .steps=${[{ label: "Revenue", value: 120 }, { label: "Freight", value: -18 }, { label: "Duty", value: -9 }, { label: "Margin", value: 0, total: true }]}></ui-waterfall>
 */
@customElement("ui-waterfall")
export class UiWaterfall extends LightElement {
  @property({ attribute: false }) steps: WaterfallStep[] = [];
  /** The whole, for screen readers ("Margin bridge"). */
  @property() label = "";
  /** How a number reads in the readout (running totals, and changes without `valueText`). */
  @property({ attribute: false }) format: (n: number) => string = (n) => n.toLocaleString();
  /** Span the levels the bridge moves through rather than zero (small changes, large totals). */
  @property({ type: Boolean }) fit = false;
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.steps.length) {
      this.#revealed = true;
      const grow = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSTransition && a.transitionProperty === "scale",
      );
      void motion.add(grow, "ambient", this);
    }
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  #read(s: WaterfallStep, c: BridgeColumn) {
    if (c.kind === "total") return `${s.label}: ${this.format(c.run)}`;
    const sign = s.value < 0 ? MINUS : "+";
    return `${s.label}: ${sign}${s.valueText ?? this.format(Math.abs(s.value))} → ${this.format(c.run)}`;
  }

  /** ←→ (mirrored right to left), Home and End move between the columns. */
  #key = (e: KeyboardEvent) => {
    const n = this.steps.length;
    const marks = [...this.querySelectorAll<HTMLElement>("[data-step]")];
    const at = marks.indexOf(document.activeElement as HTMLElement);
    if (!n || at < 0) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    const step: Record<string, number> = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 };
    let next: number;
    if (e.key in step) next = Math.min(n - 1, Math.max(0, at + step[e.key]!));
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    marks[next]?.focus();
  };

  render() {
    const s = this.steps;
    const cols = bridge(s);
    const domain = this.fit ? bridgeFit(cols) : bridgeDomain(cols);
    const [lo, hi] = domain;
    const at = (v: number) => bridgeAt(Math.min(hi, Math.max(lo, v)), domain);
    const cut = lo > 0 || hi < 0;
    const n = s.length || 1;
    const slot = 100 / n;
    const on = s[this._active];
    const end = cols.at(-1);
    const readout = on
      ? this.#read(on, cols[this._active]!)
      : end
        ? `${this.label ? `${this.label} · ` : ""}${this.format(end.run)}`
        : "";
    const kinds = new Set(cols.map((c) => c.kind));
    return html`<div class=${waterfall()}>
      <ul
        class=${waterfallPlot()}
        aria-label=${this.label || nothing}
        @keydown=${this.#key}
        @pointerleave=${() => this.#set(-1)}
      >
        <li class=${waterfallBaseline({ cut })} style=${styleMap({ "--y": `${at(0)}%` })} aria-hidden="true"></li>
        ${cols.slice(0, -1).map(
          (c, i) =>
            html`<li
              class=${waterfallConnector()}
              aria-hidden="true"
              style=${styleMap({
                "--x": `${(i + 0.82) * slot}%`,
                "--w": `${0.36 * slot}%`,
                "--y": `${at(c.run)}%`,
              })}
            ></li>`,
        )}
        ${s.map((x, i) => {
          const c = cols[i]!;
          const cls = waterfallSlot({
            dim: this._active >= 0 && this._active !== i,
            on: this._active === i,
          });
          const style = styleMap({ "--x": `${i * slot}%`, "--w": `${slot}%` });
          const enter = () => this.#set(i);
          const leave = () => this.#set(-1);
          return html`<li
            class=${cls}
            style=${style}
            tabindex="0"
            data-step
            aria-label=${this.#read(x, c)}
            @pointerenter=${enter}
            @focus=${enter}
            @blur=${leave}
          >
            <span
              class=${waterfallBar({ kind: c.kind })}
              style=${styleMap({
                "--b": `${at(Math.min(c.from, c.to))}%`,
                "--h": `${Math.abs(at(c.to) - at(c.from))}%`,
                "--i": String(i),
              })}
            ></span>
          </li>`;
        })}
      </ul>
      <div class=${waterfallAxis()} aria-hidden="true">
        ${s.map(
          (x, i) =>
            html`<span class=${waterfallTick()} style=${styleMap({ "--x": `${i * slot}%`, "--w": `${slot}%` })}
              >${x.label}</span
            >`,
        )}
      </div>
      <div class=${waterfallFoot()}>
        <p class=${waterfallReadout()} aria-live="polite">${readout}</p>
        <span class=${waterfallKey()} aria-hidden="true">
          ${(
            [
              ["up", "Increase"],
              ["down", "Decrease"],
              ["total", "Total"],
            ] as const
          )
            .filter(([k]) => kinds.has(k))
            .map(
              ([k, name]) =>
                html`<span class=${waterfallKeyItem()}
                  ><span class=${waterfallSwatch({ kind: k })}></span>${name}</span
                >`,
            )}
        </span>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-waterfall": UiWaterfall;
  }
}
