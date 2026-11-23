import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../i18n/index.ts";
import { isRtl } from "../../base/reading.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, grid, row, stack, text } from "../layout/algebra.ts";

/**
 * Heatmap: how much happened each day (a calendar of weeks), each day a cell whose depth is its
 * amount, so the busy days and quiet weeks show at a glance.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **Magnitude in one hue, light to dark** (sequential: `chart-1` at four strengths, an empty day
 *   in the highest container colour), never a rainbow; a key under it from less to more.
 * - **Days down, weeks across** (`grid.calendar`): the cells are given oldest first, a week a
 *   column, so a weekday reads along a row.
 * - **Alive:** the cells come in a week at a time as it enters (`cell-in`, theme.css; ambient
 *   motion), and pointing at a day (hover, or the arrow keys once it has focus: ↑↓ a day, ←→ a week,
 *   Home / End) outlines it and the line under it reads that day ("Tue 12 Nov · 4 inquiries");
 *   otherwise it reads `summary`.
 * - That line is a live region, so the day being read is announced; `label` names the whole.
 */
export const heatmap = rcva(`${stack} w-full gap-2`);
export const heatmapGrid = rcva(`${grid.calendar} rounded-field`);
export const heatmapCell = rcva(
  "h-5 min-w-0 rounded-xs [animation:cell-in_var(--duration-medium2)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(var(--c)*var(--duration-short1))] motion-reduce:[animation:none]",
  {
    variants: {
      level: {
        "0": "bg-surface-container-highest",
        "1": "bg-chart-1/25",
        "2": "bg-chart-1/50",
        "3": "bg-chart-1/75",
        "4": "bg-chart-1",
      },
      on: { true: "outline-2 outline-offset-1 outline-on-surface", false: "" },
    },
  },
);
export const heatmapFoot = rcva(`${row} items-center justify-between gap-x-3 gap-y-1`);
export const heatmapCaption = rcva(`${text.label} text-label-md tabular-nums text-on-surface-variant`);
export const heatmapKey = rcva(`${row} items-center gap-1 text-label-sm text-on-surface-variant`);
export const heatmapSwatch = rcva(`${fixed["2.5"]} rounded-xs`, {
  variants: {
    level: {
      "0": "bg-surface-container-highest",
      "1": "bg-chart-1/25",
      "2": "bg-chart-1/50",
      "3": "bg-chart-1/75",
      "4": "bg-chart-1",
    },
  },
});

export interface HeatmapCell {
  /** The day, as it reads ("Tue 12 Nov"). */
  label: string;
  value: number;
  /** How its amount reads ("4 inquiries"); left out, the number. */
  valueText?: string;
}

type Level = "0" | "1" | "2" | "3" | "4";
/** An amount's depth: none, or one of four even steps of the most. */
export const levelOf = (v: number, most: number): Level =>
  v <= 0 || most <= 0 ? "0" : (String(Math.min(4, Math.max(1, Math.ceil((v / most) * 4)))) as Level);

/**
 * @example <ui-heatmap label="Inquiries per day" summary="180 inquiries in 12 weeks" .cells=${days}></ui-heatmap>
 */
@customElement("ui-heatmap")
export class UiHeatmap extends LightElement {
  /** Oldest first, a week (seven days) a column. */
  @property({ attribute: false }) cells: HeatmapCell[] = [];
  @property() label = "";
  /** What the line under it says while no day is pointed at. */
  @property() summary = "";
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.cells.length) {
      this.#revealed = true;
      const enter = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "cell-in",
      );
      void motion.add(enter, "ambient", this);
    }
  }

  #key = (e: KeyboardEvent) => {
    const n = this.cells.length;
    if (!n) return;
    const at = this._active < 0 ? n - 1 : this._active;
    const rtl = isRtl(this);
    const step: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      ArrowLeft: rtl ? 7 : -7,
      ArrowRight: rtl ? -7 : 7,
    };
    let next: number;
    if (e.key in step) next = Math.min(n - 1, Math.max(0, at + step[e.key]!));
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else if (e.key === "Escape") next = -1;
    else return;
    e.preventDefault();
    this._active = next;
  };

  render() {
    const most = Math.max(0, ...this.cells.map((c) => c.value));
    const on = this.cells[this._active];
    return html`<div class=${heatmap()}>
      <div
        class=${heatmapGrid()}
        tabindex="0"
        role="img"
        aria-label=${this.label || m.heatmap_label()}
        @keydown=${this.#key}
        @blur=${() => (this._active = -1)}
        @pointerleave=${() => (this._active = -1)}
      >
        ${this.cells.map(
          (c, i) =>
            html`<span
              class=${heatmapCell({ level: levelOf(c.value, most), on: i === this._active })}
              style=${styleMap({ "--c": String(Math.floor(i / 7)) })}
              @pointerenter=${() => (this._active = i)}
            ></span>`,
        )}
      </div>
      <div class=${heatmapFoot()}>
        <p class=${heatmapCaption()} aria-live="polite">
          ${on ? `${on.label} · ${on.valueText ?? formatInt(on.value)}` : this.summary}
        </p>
        <span class=${heatmapKey()} aria-hidden="true">
          ${m.heatmap_less()}
          ${(["0", "1", "2", "3", "4"] as const).map((l) => html`<span class=${heatmapSwatch({ level: l })}></span>`)}
          ${m.heatmap_more()}
        </span>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-heatmap": UiHeatmap;
  }
}
