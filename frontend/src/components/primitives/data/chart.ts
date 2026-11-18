import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Chart: a small, accessible chart for dashboards — a sparkline, bars or lines over one x axis.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - one y axis from zero, recessive (no grid but the baseline, the max on the left);
 * - thin marks: 2px lines, bars with rounded data ends and a 2px gap between them;
 * - up to three series, coloured in a fixed order (primary, secondary, accent) — the series'
 *   identity, never its rank — with a legend for two or more, and text in text colours;
 * - an optional target (a dashed reference line, labelled);
 * - a hover / focus layer: a crosshair and a tooltip with every series' value at that x;
 * - the numbers as a table for screen readers.
 * The only `<svg>` drawn outside the icon registry (tests/icons.test.ts): lines need one.
 */
export const chart = rcva("relative flex w-full flex-col gap-2 text-xs text-base-content/75 select-none", {
  variants: {
    /** Plot height: `spark` for KPI tiles, `md` for cards. */
    height: { spark: "[--chart-h:2.5rem]", sm: "[--chart-h:7rem]", md: "[--chart-h:11rem]" },
  },
  defaultVariants: { height: "md" },
});

/** The plot area: marks, target and hover layer stacked over each other. */
export const chartPlot = rcva(
  "relative h-(--chart-h) w-full border-b border-base-content/15 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
  // Sparklines are bare; other plots leave room above for the max label.
  { variants: { bare: { true: "border-b-0", false: "mt-4" } } },
);
export const chartSvg = rcva("absolute inset-0 size-full overflow-visible");
/** Series colours, in their fixed order. */
const SERIES = ["text-primary", "text-secondary", "text-accent"] as const;
export const chartLine = rcva(
  "fill-none stroke-current [stroke-width:2] [stroke-linejoin:round] [stroke-linecap:round]",
  {
    variants: { series: { "0": SERIES[0], "1": SERIES[1], "2": SERIES[2] } },
  },
);
export const chartArea = rcva("fill-current stroke-none opacity-15", {
  variants: { series: { "0": SERIES[0], "1": SERIES[1], "2": SERIES[2] } },
});
export const chartBars = rcva("absolute inset-0 flex items-end gap-0.5");
export const chartBarSlot = rcva("flex h-full min-w-0 flex-1 items-end justify-center gap-0.5");
export const chartBar = rcva(
  "h-(--bar) max-w-8 min-w-0 flex-1 rounded-t-[4px] bg-current transition-[height,opacity] duration-(--duration-spatial) ease-spatial motion-reduce:transition-none",
  {
    variants: {
      series: { "0": SERIES[0], "1": SERIES[1], "2": SERIES[2] },
      /** Other bars fade back while one x is hovered. */
      dim: { true: "opacity-40" },
      /** Draw the latest bar in full and the history lighter. */
      muted: { true: "opacity-50" },
    },
  },
);
/** Stacked bars: one column per x, the series' segments on top of each other (a build-up). */
export const chartStack = rcva("flex h-full w-full max-w-8 min-w-0 flex-col-reverse");
export const chartStackSegment = rcva(
  "h-(--bar) w-full shrink-0 bg-current transition-[height,opacity] duration-(--duration-spatial) ease-spatial last:rounded-t-[4px] motion-reduce:transition-none",
  {
    variants: {
      series: { "0": SERIES[0], "1": SERIES[1], "2": SERIES[2] },
      dim: { true: "opacity-40" },
    },
  },
);
export const chartTarget = rcva(
  "pointer-events-none absolute inset-x-0 bottom-(--at) border-t border-dashed border-base-content/40",
);
export const chartTargetLabel = rcva(
  "absolute end-0 bottom-0.5 rounded bg-base-100/80 px-1 text-[0.6875rem] leading-4",
);
export const chartCrosshair = rcva(
  "pointer-events-none absolute inset-y-0 start-(--x) border-s border-base-content/30",
);
export const chartDot = rcva(
  "pointer-events-none absolute start-(--x) bottom-(--y) size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-current ring-2 ring-base-100",
  { variants: { series: { "0": SERIES[0], "1": SERIES[1], "2": SERIES[2] } } },
);
export const chartTooltip = rcva(
  "liquid-glass pointer-events-none absolute bottom-full z-10 mb-2 flex min-w-28 -translate-x-(--shift) flex-col gap-0.5 rounded-field px-2.5 py-1.5 whitespace-nowrap text-base-content start-(--x)",
);
export const chartTooltipRow = rcva("flex items-center gap-1.5 tabular-nums");
export const chartSwatch = rcva("inline-block size-2 shrink-0 rounded-full bg-current", {
  variants: { series: { "0": SERIES[0], "1": SERIES[1], "2": SERIES[2] } },
});
export const chartAxis = rcva("flex justify-between gap-1 tabular-nums [&>span]:min-w-0 [&>span]:truncate");
export const chartMax = rcva("pointer-events-none absolute -top-1 start-0 -translate-y-full tabular-nums");
export const chartLegend = rcva("flex flex-wrap gap-x-3 gap-y-1 text-base-content/80");
export const chartLegendItem = rcva("inline-flex items-center gap-1.5");
export const chartTable = rcva("sr-only");

export type ChartVariants = VariantProps<typeof chart>;

export interface ChartSeries {
  name: string;
  values: number[];
}

type Index = "0" | "1" | "2";

/**
 * @example <ui-chart kind="spark" height="spark" .labels=${weeks} .series=${[{ name: "Inquiries", values }]}></ui-chart>
 * @example <ui-chart kind="bars" label="My deadlines" .labels=${days} .series=${[{ name: "Deadlines", values }]}></ui-chart>
 * @example <ui-chart kind="bars" stacked label="Price build-up" .labels=${lines} .series=${[cost, charges, profit]}></ui-chart>
 * @example
 * <ui-chart kind="line" label="Quote turnaround" .labels=${weeks} .series=${[{ name: "Median days", values }]}
 *   .target=${1} target-label="Target 1 d" .format=${(v) => `${v.toFixed(1)} d`}></ui-chart>
 *
 * `label` names the chart for assistive tech (the card heading usually says the same).
 * Arrow keys move the tooltip along the x axis while the plot has focus.
 */
@customElement("ui-chart")
export class UiChart extends LightElement {
  @property() kind: "spark" | "bars" | "line" = "line";
  @property() height: ChartVariants["height"];
  @property() label = "";
  @property({ attribute: false }) labels: string[] = [];
  @property({ attribute: false }) series: ChartSeries[] = [];
  /** How values read in the tooltip, the max and the table. */
  @property({ attribute: false }) format: (v: number) => string = (v) => v.toLocaleString();
  /** A reference value drawn as a dashed line (e.g. a target or a policy minimum). */
  @property({ type: Number }) target?: number;
  @property({ attribute: "target-label" }) targetLabel = "";
  /** Bars: draw the last x in full and the rest lighter (the current period against history). */
  @property({ type: Boolean, attribute: "highlight-last" }) highlightLast = false;
  /** Bars: stack the series in one column per x (e.g. cost + charges + profit = price). */
  @property({ type: Boolean }) stacked = false;
  @state() private _hover = -1;

  private get _n() {
    return Math.max(0, ...this.series.map((s) => s.values.length));
  }

  /** Top of the y scale: the largest value or the target, with a little headroom. */
  private get _max() {
    const values =
      this.stacked && this.kind === "bars"
        ? Array.from({ length: this._n }, (_, i) =>
            this.series.slice(0, 3).reduce((sum, s) => sum + Math.max(0, s.values[i] ?? 0), 0),
          )
        : this.series.flatMap((s) => s.values);
    const max = Math.max(0, this.target ?? 0, ...values);
    return max === 0 ? 1 : max * 1.08;
  }

  /** x of point `i` in percent: points span the full width for lines, slot centres for bars. */
  private _x(i: number) {
    const n = this._n;
    if (this.kind === "bars") return ((i + 0.5) / n) * 100;
    return n <= 1 ? 50 : (i / (n - 1)) * 100;
  }

  private _y(v: number) {
    return (v / this._max) * 100;
  }

  private _pick(e: PointerEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const n = this._n;
    this._hover = this.kind === "bars" ? Math.min(n - 1, Math.floor(f * n)) : Math.round(f * (n - 1));
  }

  private _key(e: KeyboardEvent) {
    const n = this._n;
    if (!n) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const step = e.key === "ArrowRight" ? 1 : -1;
      this._hover = this._hover < 0 ? n - 1 : Math.min(n - 1, Math.max(0, this._hover + step));
    } else if (e.key === "Escape") this._hover = -1;
  }

  private _lines() {
    const pts = (values: number[]) => values.map((v, i) => `${this._x(i)},${100 - this._y(v)}`).join(" ");
    return svg`<svg class=${chartSvg()} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${this.series.slice(0, 3).map((s, i) => {
        const series = String(i) as Index;
        const line = pts(s.values);
        return svg`${
          this.kind === "spark" || this.series.length === 1
            ? svg`<polygon class=${chartArea({ series })} points=${`0,100 ${line} ${this._x(s.values.length - 1)},100`}></polygon>`
            : nothing
        }<polyline class=${chartLine({ series })} vector-effect="non-scaling-stroke" points=${line}></polyline>`;
      })}
    </svg>`;
  }

  private _bars() {
    const n = this._n;
    const shown = this.series.slice(0, 3);
    return html`<div class=${chartBars()} aria-hidden="true">
      ${Array.from({ length: n }, (_, i) => {
        if (this.stacked)
          return html`<div class=${chartBarSlot()}>
            <div class=${chartStack()}>
              ${shown.map(
                (s, k) =>
                  html`<div
                    class=${chartStackSegment({ series: String(k) as Index, dim: this._hover >= 0 && this._hover !== i })}
                    style=${styleMap({ "--bar": `${this._y(Math.max(0, s.values[i] ?? 0))}%` })}
                  ></div>`,
              )}
            </div>
          </div>`;
        return html`<div class=${chartBarSlot()}>
          ${shown.map(
            (s, k) =>
              html`<div
                class=${chartBar({
                  series: String(k) as Index,
                  dim: this._hover >= 0 && this._hover !== i,
                  muted: this._hover < 0 && this.highlightLast && i !== n - 1,
                })}
                style=${styleMap({ "--bar": `${this._y(s.values[i] ?? 0)}%` })}
              ></div>`,
          )}
        </div>`;
      })}
    </div>`;
  }

  private _hoverLayer() {
    const i = this._hover;
    if (i < 0 || i >= this._n) return nothing;
    const x = this._x(i);
    const shown = this.series.slice(0, 3);
    // Keep the tooltip inside the plot: anchor it left of centre near the end, right near the start.
    const shift = x > 66 ? "100%" : x < 34 ? "0%" : "50%";
    return html`
      ${this.kind === "bars" ? nothing : html`<div class=${chartCrosshair()} style=${styleMap({ "--x": `${x}%` })}></div>`}
      ${
        this.kind === "bars"
          ? nothing
          : shown.map(
              (s, k) =>
                html`<div
                  class=${chartDot({ series: String(k) as Index })}
                  style=${styleMap({ "--x": `${x}%`, "--y": `${this._y(s.values[i] ?? 0)}%` })}
                ></div>`,
            )
      }
      <div class=${chartTooltip()} style=${styleMap({ "--x": `${x}%`, "--shift": shift })} role="status">
        ${this.labels[i] ? html`<strong>${this.labels[i]}</strong>` : nothing}
        ${shown.map(
          (s, k) =>
            html`<span class=${chartTooltipRow()}
              >${shown.length > 1 ? html`<span class=${chartSwatch({ series: String(k) as Index })}></span>` : nothing}
              ${shown.length > 1 ? `${s.name}: ` : ""}<strong>${this.format(s.values[i] ?? 0)}</strong></span
            >`,
        )}
      </div>
    `;
  }

  render() {
    const n = this._n;
    const spark = this.kind === "spark";
    const shown = this.series.slice(0, 3);
    const first = this.labels[0] ?? "";
    const last = this.labels[n - 1] ?? "";
    return html`<div class=${chart({ height: this.height ?? (spark ? "spark" : undefined) })}>
      ${
        shown.length > 1
          ? html`<div class=${chartLegend()}>
              ${shown.map(
                (s, k) =>
                  html`<span class=${chartLegendItem()}
                    ><span class=${chartSwatch({ series: String(k) as Index })}></span>${s.name}</span
                  >`,
              )}
            </div>`
          : nothing
      }
      <div
        class=${chartPlot({ bare: spark })}
        role="img"
        aria-label=${this.label}
        tabindex=${spark ? "-1" : "0"}
        @pointermove=${(e: PointerEvent) => this._pick(e)}
        @pointerleave=${() => (this._hover = -1)}
        @keydown=${(e: KeyboardEvent) => this._key(e)}
        @blur=${() => (this._hover = -1)}
      >
        ${spark ? nothing : html`<span class=${chartMax()}>${this.format(this._max / 1.08)}</span>`}
        ${this.kind === "bars" ? this._bars() : this._lines()}
        ${
          this.target !== undefined
            ? html`<div class=${chartTarget()} style=${styleMap({ "--at": `${this._y(this.target)}%` })}>
                ${this.targetLabel && !spark ? html`<span class=${chartTargetLabel()}>${this.targetLabel}</span>` : nothing}
              </div>`
            : nothing
        }
        ${this._hoverLayer()}
      </div>
      ${
        spark || !n
          ? nothing
          : html`<div class=${chartAxis()} aria-hidden="true">
              ${
                this.kind === "bars" && n <= 8
                  ? this.labels.slice(0, n).map((l) => html`<span>${l}</span>`)
                  : html`<span>${first}</span><span>${last}</span>`
              }
            </div>`
      }
      <table class=${chartTable()}>
        <caption>
          ${this.label}
        </caption>
        <tr>
          <th></th>
          ${shown.map((s) => html`<th>${s.name}</th>`)}
        </tr>
        ${Array.from(
          { length: n },
          (_, i) =>
            html`<tr>
              <th>${this.labels[i] ?? i + 1}</th>
              ${shown.map((s) => html`<td>${this.format(s.values[i] ?? 0)}</td>`)}
            </tr>`,
        )}
      </table>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-chart": UiChart;
  }
}
