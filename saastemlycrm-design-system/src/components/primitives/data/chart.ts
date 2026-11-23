import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { axisOf, labelBoxes, labelStep, niceScale, pointAt, smoothPath, type Point } from "../../base/chart.ts";
import { floating as float } from "../../base/floating.ts";
import { LightElement } from "../../base/light-element.ts";
import { whenIdle } from "../../base/work-queue.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { buttonGroup, buttonGroupItem } from "../actions/button-group.ts";
import {
  fixed,
  floatingFit,
  floatingHeight,
  inlineRow,
  pad,
  row,
  rowEnd,
  stack,
  stackReverse,
  text,
} from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Chart: an accessible chart for dashboards — a sparkline, bars or lines over one x axis.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **One y axis from zero**, recessive: 3 or 4 hairline gridlines at round numbers
 *   (`niceScale`), their labels in a gutter, and the x labels thinned evenly to what fits (the
 *   latest point always labelled).
 * - **Thin marks:** smooth 2px lines (never overshooting the data: `smoothPath`), a soft area
 *   under a single series, bars with rounded data ends and a 2px gap between touching marks.
 * - **Up to six series**, coloured in a fixed order by the chart palette (`chart-1` … `chart-6`,
 *   src/styles/theme.css): the series' identity, never its rank, and never a status colour. Text
 *   stays in text colours; a legend for two or more, whose chips show or hide a series (it keeps
 *   its colour; one stays on).
 * - **Stacked** bars or areas for parts of a whole; **highlight-last** draws the latest bar in
 *   colour, its value over it, and the history muted; an optional **target** is a dashed line with
 *   its label.
 * - **A range switch** (`ranges`) cuts every series to its last N points, in the browser
 *   (`ui-range` { points } when someone picks one).
 * - **A hover / focus layer:** a crosshair (lines) or a highlighted column (bars), and a glass
 *   tooltip with the x label and every visible series' value, the total of a stack, and the
 *   target. Arrow keys move it while the plot has focus (Home / End jump, Escape leaves).
 * - **Motion:** bars grow and lines are uncovered on M3's tokens; nothing moves with Reduce motion.
 * - The numbers as a table for screen readers.
 * The only `<svg>` drawn outside the icon registry (tests/icons.test.ts): lines need one. The
 * range switch borrows the button group's recipes.
 */
export const chart = rcva(
  `${stack} ${text.label} relative w-full gap-2 text-body-sm text-on-surface-variant [anchor-scope:--chart-tip]`,
  {
    variants: {
      /**
       * Plot height: `spark` for KPI tiles, `md` for cards, `fill` for the room its parent gives it
       * (a figure tile's trend band: the sparkline grows with the tile).
       */
      height: {
        spark: "[--chart-h:2.5rem]",
        sm: "[--chart-h:7rem]",
        md: "[--chart-h:11rem]",
        fill: "grow basis-0 min-h-10 [--chart-h:100%]",
      },
    },
    defaultVariants: { height: "md" },
  },
);

/** Over the plot: the legend's chips at the start, the range switch at the end. */
export const chartHead = rcva(`${row} items-center justify-between gap-x-3 gap-y-2`);
export const chartLegend = rcva(`${row} min-w-0 gap-1.5`);
/** A legend chip: a toggle for its series. */
export const chartChip = rcva(
  `${inlineRow} ${text.label} ${pad["2"]} touch-target state-layer cursor-pointer items-center gap-1.5 rounded-full border border-outline-variant py-0.5 text-label-md`,
  { variants: { on: { true: "text-on-surface", false: "text-on-surface-variant" } } },
);
export const chartRanges = rcva(rowEnd);

/**
 * The y labels beside the plot. The plot's basis is 0 and the gutter is at most 40% of the row, so
 * the row never wraps: the plot takes what the labels leave.
 */
export const chartFrame = rcva(`${row} items-start gap-2`, {
  // Room over the plot for the highlighted bar's value.
  variants: { headroom: { true: "mt-4", false: "" } },
});
/** The ticks, evenly spaced from zero at the bottom to the scale's top. */
export const chartTicks = rcva(
  `${stackReverse} h-(--chart-h) max-w-[40%] min-w-0 items-end justify-between text-label-sm tabular-nums`,
);
/** A tick's label, centred on its gridline (a line of no height). */
export const chartTick = rcva(`${row} h-0 items-center justify-end text-end`);
export const chartBody = rcva(`${stack} min-w-0 flex-1 gap-1`);

/** The plot area: gridlines, marks, target and hover layer stacked over each other. */
export const chartPlot = rcva("relative h-(--chart-h) w-full touch-pan-y", {
  variants: { bare: { true: "", false: "cursor-crosshair border-b border-outline-variant" } },
});
export const chartGridline = rcva(
  "pointer-events-none absolute inset-x-0 bottom-(--at) border-t border-outline-variant",
);

/** Series colours, in their fixed order; `muted` is the history behind a highlighted bar. */
const SERIES = {
  "0": "text-chart-1",
  "1": "text-chart-2",
  "2": "text-chart-3",
  "3": "text-chart-4",
  "4": "text-chart-5",
  "5": "text-chart-6",
  muted: "text-chart-muted",
} as const;
type Slot = keyof typeof SERIES;
const slot = (k: number) => String(k) as Slot;

/** Lines and areas, uncovered from the start of the x axis as they enter (`chart-reveal`, theme.css). */
export const chartSvg = rcva(
  "absolute inset-0 size-full overflow-visible [animation:chart-reveal_var(--duration-long2)_var(--ease-emphasized-decelerate)_both] motion-reduce:[animation:none] rtl:-scale-x-100",
);
export const chartLine = rcva(
  "fill-none stroke-current [stroke-width:2] [stroke-linejoin:round] [stroke-linecap:round]",
  { variants: { series: SERIES } },
);
/** The soft area under a single line: a fade of the series colour (a gradient of `chartFade`). */
export const chartArea = rcva("stroke-none");
export const chartFade = rcva("", { variants: { series: SERIES } });
/** A stacked area's band: a wash under its own line, which carries the colour. */
export const chartBand = rcva("fill-current stroke-none opacity-40", { variants: { series: SERIES } });

export const chartBars = rcva(`${row} absolute inset-0 items-end gap-0.5`);
export const chartBarSlot = rcva(`${row} h-full min-w-0 flex-1 items-end justify-center gap-0.5`);
/**
 * Bars grow from the baseline as they enter, one after the other from the start of the axis (`--d`:
 * 0 for the first to 1 for the last); not with Reduce motion. They grow by `scale` (drawn by the
 * compositor), never by `height`, which would lay out the whole page again on every frame.
 */
const GROW =
  "origin-bottom [transition:scale_var(--duration-long2)_var(--ease-emphasized-decelerate)_calc(var(--d)*var(--duration-short4)),color_var(--duration-effects)_var(--ease-effects)] motion-reduce:transition-none starting:scale-y-0";
export const chartBar = rcva(`h-(--bar) max-w-12 min-w-0 flex-1 rounded-t-sm bg-current ${GROW}`, {
  variants: { series: SERIES },
});
/** Stacked bars: one column per x, the series' segments on top of each other (a build-up). */
export const chartStack = rcva(`${stackReverse} h-full w-full max-w-12 min-w-0 ${GROW}`);
export const chartSegment = rcva(
  // A 2px gap between segments, inside each one's own height: the stack still measures its sum.
  "h-(--bar) w-full border-b-2 border-transparent bg-current bg-clip-padding first:border-b-0 [transition:color_var(--duration-effects)_var(--ease-effects)] motion-reduce:transition-none",
  { variants: { series: SERIES, top: { true: "rounded-t-sm", false: "" } } },
);
/** The highlighted bar's value, over it: it ends where the bar does, and never leaves the plot. */
export const chartValue = rcva(
  "pointer-events-none absolute end-(--e) bottom-(--y) mb-1 max-w-full text-end text-label-md text-on-surface tabular-nums",
);

export const chartTarget = rcva(
  "pointer-events-none absolute inset-x-0 bottom-(--at) border-t border-dashed border-outline",
);
export const chartTargetLabel = rcva("absolute end-0 bottom-0.5 rounded-xs bg-surface/80 px-1 text-label-sm");

/** Hover: the column under the pointer (bars), or a crosshair with a dot per series (lines). */
export const chartColumn = rcva(
  "pointer-events-none absolute inset-y-0 start-(--a) end-(--b) rounded-t-xs bg-on-surface/(--state-hover)",
);
export const chartCrosshair = rcva("pointer-events-none absolute inset-y-0 start-(--x) border-s border-outline");
export const chartDot = rcva(
  "pointer-events-none absolute start-(--x) bottom-(--y) size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-current ring-2 ring-surface rtl:translate-x-1/2",
  { variants: { series: SERIES } },
);
/**
 * The tooltip: glass, in the top layer (a popover), placed by Floating UI beside the hovered
 * column or crosshair (`data-chart-anchor`): on the side with more room, its top at the plot's, or
 * above a sparkline; it flips when that side has no room. Its own size in tiles: its
 * content's width rounded up to whole tiles (at most 6) and quarter tiles down, so a narrow plot
 * (a sparkline's 64px) never squeezes it, and no card around it clips it.
 */
export const chartTooltip = rcva(
  `${stack} ${pad["2.5"]} ${floatingFit["6"]} ${floatingHeight.fit} liquid-glass pointer-events-none gap-0.5 overflow-visible rounded-field py-1.5 text-on-surface`,
);
export const chartTooltipTitle = rcva("text-label-sm text-on-surface-variant");
export const chartTooltipRow = rcva(`${row} items-center justify-between gap-x-3 tabular-nums`, {
  variants: { total: { true: "mt-0.5 border-t border-outline-variant pt-1", false: "" } },
});
export const chartTooltipName = rcva(`${inlineRow} min-w-0 items-center gap-1.5 text-on-surface-variant`);
/** A series' key in the tooltip: a short stroke of its colour (dashed for the target). */
export const chartKey = rcva("h-0.5 w-3 shrink-0 rounded-full bg-current", {
  variants: {
    series: SERIES,
    target: { true: "h-0 rounded-none border-t border-dashed border-outline bg-transparent" },
  },
});
/** A series' swatch in the legend: filled while it shows, hollow while it's hidden. */
export const chartSwatch = rcva(`${fixed["2"]} rounded-full border border-current`, {
  variants: { series: SERIES, on: { true: "bg-current", false: "bg-transparent" } },
});

/** The x labels: each in its own box on the axis (`labelBoxes`), so two never overlap and none is cut by the edge. */
export const chartAxis = rcva("relative w-full text-label-sm tabular-nums");
export const chartAxisLabel = rcva("absolute top-0 start-(--a) end-(--b) truncate", {
  variants: { align: { start: "text-start", center: "text-center", end: "text-end" } },
});
/** The widest label, measured to decide how many fit (it takes no room). */
export const chartAxisSizer = rcva("invisible absolute start-0 top-0 w-fit");
export const chartAxisLine = rcva("invisible");
export const chartTable = rcva("sr-only");

export type ChartVariants = VariantProps<typeof chart>;

export interface ChartSeries {
  name: string;
  values: number[];
}

/** A choice of the range switch: the last `points` of every series. */
export interface ChartRange {
  label: string;
  points: number;
}

interface View {
  n: number;
  labels: (string | undefined)[];
  /** Every series (up to six), cut to the range; `on`: not hidden by its chip. */
  series: { k: number; name: string; values: number[]; on: boolean }[];
  shown: { k: number; name: string; values: number[] }[];
  stacked: boolean;
  /** Where each shown series is drawn at each x: its value, or its running total in a stack. */
  tops: number[][];
  totals: number[];
  top: number;
  step: number;
  ticks: number[];
}

let charts = 0;

/**
 * @example <ui-chart kind="spark" height="spark" .labels=${weeks} .series=${[{ name: "Inquiries", values }]}></ui-chart>
 * @example <ui-chart kind="bars" highlight-last label="Value won" .labels=${months} .series=${[{ name: "Value won", values }]}></ui-chart>
 * @example <ui-chart kind="bars" stacked label="Price build-up" .labels=${lines} .series=${[cost, charges, profit]}></ui-chart>
 * @example
 * <ui-chart kind="line" label="Quote turnaround" .labels=${weeks} .series=${[{ name: "Median days", values }]}
 *   .ranges=${[{ label: "4 w", points: 4 }, { label: "12 w", points: 12 }]}
 *   .target=${1} target-label="Target 1 d" .format=${(v) => `${v.toFixed(1)} d`}></ui-chart>
 *
 * `label` names the chart for assistive tech (the card heading usually says the same).
 */
@customElement("ui-chart")
export class UiChart extends LightElement {
  @property() kind: "spark" | "bars" | "line" = "line";
  @property() height: ChartVariants["height"];
  @property() label = "";
  @property({ attribute: false }) labels: string[] = [];
  @property({ attribute: false }) series: ChartSeries[] = [];
  /** How values read in the tooltip, over a highlighted bar and in the table. */
  @property({ attribute: false }) format: (v: number) => string = (v) => v.toLocaleString();
  /** How the y axis' ticks read (default: `format`); `step` is the distance between two ticks. */
  @property({ attribute: false }) tickFormat?: (v: number, step: number) => string;
  /** A reference value drawn as a dashed line (e.g. a target or a policy minimum). */
  @property({ type: Number }) target?: number;
  @property({ attribute: "target-label" }) targetLabel = "";
  /** Bars, one series: draw the last x in colour with its value over it, and the rest muted. */
  @property({ type: Boolean, attribute: "highlight-last" }) highlightLast = false;
  /** Stack the series: one column per x (bars), or areas on top of each other (lines). */
  @property({ type: Boolean }) stacked = false;
  /** The range switch's choices, shortest first: each cuts the series to its last `points`. */
  @property({ attribute: false }) ranges: ChartRange[] = [];
  /** The range shown at first, in points (default: the first of `ranges`). */
  @property({ type: Number }) range?: number;
  /** The range switch's accessible name. */
  @property({ attribute: "range-label" }) rangeLabel = "Range";
  @state() private _hover = -1;
  @state() private _hidden: ReadonlySet<number> = new Set();
  @state() private _points?: number;
  /** Every how many points an x label shows (measured: `_fit`). */
  @state() private _step = 1;
  /** The screen-reader table's rows are drawn (once the page has settled). */
  @state() private _table = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this._table) whenIdle(this, () => (this._table = true));
  }
  #uid = `chart-${++charts}`;
  /** How many points are on the x axis (set by `render`, read by `_fit`). */
  #points = 0;
  /**
   * The axis's width and the widest label's, as the ResizeObserver last reported them. Read from its
   * entries (sizes the browser already computed in its one layout pass), never from the elements:
   * a chart that measured itself after each render forced a layout of the whole page per chart.
   */
  #axisWidth = 0;
  #labelWidth = 0;
  #resize = new ResizeObserver((entries) => {
    for (const e of entries) {
      const width = e.borderBoxSize?.[0]?.inlineSize ?? e.contentRect.width;
      if ((e.target as HTMLElement).hasAttribute("data-chart-sizer")) this.#labelWidth = width;
      else this.#axisWidth = e.contentBoxSize?.[0]?.inlineSize ?? e.contentRect.width;
    }
    this._fit();
  });

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
  }

  protected willUpdate(changed: PropertyValues) {
    // A new set of ranges or series starts over: its own first range, every series showing. So does
    // a new `range` from outside (a screen's period): the chart follows it until its own switch is used.
    if (changed.has("ranges") && !this._offers().some((r) => r.points === this._points)) this._points = undefined;
    if (changed.has("range") && changed.get("range") !== undefined) this._points = undefined;
    if (changed.has("series") && this._hidden.size >= this.series.length) this._hidden = new Set();
  }

  #observed = new WeakSet<Element>();

  /** Its reveal (lines uncovered, bars growing) has been handed to the motion queue. */
  #revealed = false;

  protected updated() {
    // Its reveal is ambient motion (src/components/base/motion-queue.ts): it plays when nothing a
    // person did is still moving, and on a page whose frames run late it skips to the drawn chart.
    if (!this.#revealed && this.querySelector("svg, [data-chart-plot]")) {
      this.#revealed = true;
      const reveal = this.getAnimations({ subtree: true }).filter(
        (a) =>
          (a instanceof CSSAnimation && a.animationName === "chart-reveal") ||
          (a instanceof CSSTransition && a.transitionProperty === "scale"),
      );
      void motion.add(reveal, "ambient", this);
    }
    // The hover's tooltip goes to the top layer once it's drawn (it leaves it with its element).
    const tip = this.querySelector<HTMLElement>("[data-chart-tip]");
    if (tip && !tip.matches(":popover-open")) tip.showPopover();
    // Observing reports each new element's size on the next frame; nothing is read here.
    for (const el of this.querySelectorAll<HTMLElement>("[data-chart-axis], [data-chart-sizer]"))
      if (!this.#observed.has(el)) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
    // A new number of points (another range) re-thins the labels from the sizes already known.
    this._fit();
  }

  /** Thins the x labels to what fits: the widest label against the room its points have. */
  private _fit() {
    if (!this.#axisWidth || !this.#labelWidth) return;
    const step = labelStep(this.#points, this.kind === "bars", this.#axisWidth, this.#labelWidth);
    if (step !== this._step) this._step = step;
  }

  private get _count() {
    return Math.max(0, ...this.series.slice(0, 6).map((s) => s.values.length));
  }

  /** The ranges worth offering: every one shorter than the data, and the first that holds all of it. */
  private _offers(): ChartRange[] {
    const count = this._count;
    let all = false;
    return this.ranges.filter((r) => {
      if (r.points < count) return true;
      if (all) return false;
      all = true;
      return true;
    });
  }

  /** What's drawn: the series cut to the range, the visible ones, and the y scale they need. */
  private _view(): View {
    const count = this._count;
    const offers = this._offers();
    const points = offers.length > 1 ? (this._points ?? this.range ?? offers[0]!.points) : undefined;
    const from = points && points > 0 ? Math.max(0, count - points) : 0;
    const n = count - from;
    const series = this.series.slice(0, 6).map((s, k) => ({
      k,
      name: s.name,
      values: Array.from({ length: n }, (_, i) => s.values[from + i] ?? 0),
      on: !this._hidden.has(k),
    }));
    const shown = series.filter((s) => s.on);
    const stacked = this.stacked && this.kind !== "spark" && shown.length > 1;
    const running = Array.from({ length: n }, () => 0);
    const tops = shown.map((s) => s.values.map((v, i) => (stacked ? (running[i] = running[i]! + Math.max(0, v)) : v)));
    const totals = Array.from({ length: n }, (_, i) => shown.reduce((sum, s) => sum + Math.max(0, s.values[i]!), 0));
    const peak = Math.max(0, this.target ?? 0, ...tops.flat());
    // Whole numbers (a count) get whole ticks.
    const whole = [this.target ?? 0, ...shown.flatMap((s) => s.values)].every(Number.isInteger);
    const scale =
      this.kind === "spark" ? { top: peak === 0 ? 1 : peak * 1.08, step: 0, ticks: [] } : niceScale(peak, whole);
    return {
      n,
      labels: Array.from({ length: n }, (_, i) => this.labels[from + i]),
      series,
      shown,
      stacked,
      tops,
      totals,
      ...scale,
    };
  }

  /** x of point `i` in percent: points span the full width for lines, slot centres for bars. */
  private _x(i: number, n: number) {
    return pointAt(i, axisOf(n, this.kind === "bars"));
  }

  private _pick(e: PointerEvent, n: number) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const across = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const f = getComputedStyle(el).direction === "rtl" ? 1 - across : across;
    this._hover = this.kind === "bars" ? Math.min(n - 1, Math.floor(f * n)) : Math.round(f * (n - 1));
  }

  private _key(e: KeyboardEvent, n: number) {
    if (!n) return;
    const rtl = getComputedStyle(e.currentTarget as HTMLElement).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (step) this._hover = this._hover < 0 ? n - 1 : Math.min(n - 1, Math.max(0, this._hover + step));
    else if (e.key === "Home") this._hover = 0;
    else if (e.key === "End") this._hover = n - 1;
    else if (e.key === "Escape") this._hover = -1;
    else return;
    e.preventDefault();
  }

  /** Shows or hides a series; the last one showing stays. */
  private _toggle(k: number, v: View) {
    const hidden = new Set(this._hidden);
    if (hidden.has(k)) hidden.delete(k);
    else if (v.shown.length > 1) hidden.add(k);
    this._hidden = hidden;
  }

  private _setRange(points: number) {
    if (points === this._points) return;
    this._points = points;
    this._hover = -1;
    this.dispatchEvent(new CustomEvent("ui-range", { detail: { points }, bubbles: true }));
  }

  private _rangeKey(e: KeyboardEvent, i: number, offers: ChartRange[]) {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const rtl = getComputedStyle(this).direction === "rtl" && (e.key === "ArrowLeft" || e.key === "ArrowRight");
    const j = (i + (rtl ? -dir : dir) + offers.length) % offers.length;
    this.querySelectorAll<HTMLButtonElement>("[data-chart-range]")[j]?.focus();
    this._setRange(offers[j]!.points);
  }

  private _head(v: View) {
    const offers = this._offers();
    const legend = v.series.length > 1 && this.kind !== "spark";
    const ranges = offers.length > 1 && this.kind !== "spark";
    if (!legend && !ranges) return nothing;
    const picked = this._points ?? this.range ?? offers[0]?.points;
    return html`<div class=${chartHead()}>
      ${
        legend
          ? html`<div class=${chartLegend()} role="group" aria-label="Series">
              ${v.series.map(
                (s) =>
                  html`<button
                    type="button"
                    class=${chartChip({ on: s.on })}
                    aria-pressed=${String(s.on)}
                    @click=${() => this._toggle(s.k, v)}
                  >
                    <span class=${chartSwatch({ series: slot(s.k), on: s.on })}></span>${s.name}
                  </button>`,
              )}
            </div>`
          : nothing
      }
      ${
        ranges
          ? html`<div class=${buttonGroup({ class: chartRanges() })} role="radiogroup" aria-label=${this.rangeLabel}>
              ${offers.map((r, i) => {
                const on = r.points === picked;
                return html`<button
                  type="button"
                  data-chart-range
                  class=${buttonGroupItem({ size: "xs", selected: on })}
                  role="radio"
                  aria-checked=${String(on)}
                  tabindex=${on ? "0" : "-1"}
                  @click=${() => this._setRange(r.points)}
                  @keydown=${(e: KeyboardEvent) => this._rangeKey(e, i, offers)}
                >
                  ${on ? iconSvg("check", { size: "sm" }) : nothing}${r.label}
                </button>`;
              })}
            </div>`
          : nothing
      }
    </div>`;
  }

  private _lines(v: View) {
    const y = (value: number) => 100 - (value / v.top) * 100;
    const points = (values: number[]): Point[] => values.map((value, i) => [this._x(i, v.n), y(value)]);
    // One point has no line: a line of no length, whose round ends draw a dot.
    const line = (pts: Point[]) =>
      pts.length === 1 ? `M${pts[0]![0]},${pts[0]![1]} L${pts[0]![0]},${pts[0]![1]}` : smoothPath(pts);
    const single = v.shown.length === 1;
    const end = this._x(v.n - 1, v.n);
    const start = this._x(0, v.n);
    const drawn = v.shown.map((s, at) => {
      const pts = points(v.tops[at]!);
      const fill = `${this.#uid}-${s.k}`;
      // Down to the baseline, or to the line of the series under it in a stack.
      const under =
        v.stacked && at > 0 ? smoothPath(points(v.tops[at - 1]!).reverse(), true) : `L${end},100 L${start},100`;
      const area =
        pts.length < 2
          ? nothing
          : v.stacked
            ? svg`<path class=${chartBand({ series: slot(s.k) })} d=${`${smoothPath(pts)} ${under} Z`}></path>`
            : single
              ? svg`<linearGradient id=${fill} class=${chartFade({ series: slot(s.k) })} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="currentColor" stop-opacity="0.32"></stop>
                    <stop offset="1" stop-color="currentColor" stop-opacity="0.02"></stop>
                  </linearGradient>
                  <path class=${chartArea()} fill=${`url(#${fill})`} d=${`${smoothPath(pts)} ${under} Z`}></path>`
              : nothing;
      return svg`${area}<path class=${chartLine({ series: slot(s.k) })} vector-effect="non-scaling-stroke" d=${line(pts)}></path>`;
    });
    // Keyed by what's drawn, so a new range or set of series is uncovered again.
    return keyed(
      `${v.n}:${v.shown.map((s) => s.k).join()}`,
      svg`<svg class=${chartSvg()} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${drawn}</svg>`,
    );
  }

  private _bars(v: View) {
    const height = (value: number) => `${(Math.max(0, value) / v.top) * 100}%`;
    const highlight = this.highlightLast && v.shown.length === 1;
    return html`<div class=${chartBars()} aria-hidden="true">
      ${Array.from({ length: v.n }, (_, i) => {
        // Bars enter one after the other, from the start of the axis.
        const d = v.n > 1 ? i / (v.n - 1) : 0;
        if (v.stacked) {
          const top = v.shown.findLast((s) => s.values[i]! > 0)?.k;
          return html`<div class=${chartBarSlot()}>
            <div class=${chartStack()} style=${styleMap({ "--d": String(d) })}>
              ${v.series.map(
                (s) =>
                  html`<div
                    class=${chartSegment({ series: slot(s.k), top: s.k === top })}
                    style=${styleMap({ "--bar": height(s.on ? s.values[i]! : 0) })}
                  ></div>`,
              )}
            </div>
          </div>`;
        }
        return html`<div class=${chartBarSlot()}>
          ${v.shown.map(
            (s) =>
              html`<div
                class=${chartBar({ series: highlight && i !== v.n - 1 && i !== this._hover ? "muted" : slot(s.k) })}
                style=${styleMap({ "--bar": height(s.values[i]!), "--d": String(d) })}
              ></div>`,
          )}
        </div>`;
      })}
    </div>`;
  }

  private _hoverLayer(v: View) {
    const i = this._hover;
    if (i < 0 || i >= v.n) return nothing;
    const bars = this.kind === "bars";
    const x = this._x(i, v.n);
    const half = bars ? 50 / v.n : 0;
    // Beside the hovered x, on the side with more room (it flips if that has none).
    const side = x > 50 ? "end" : "start";
    const rtl = this.matches(":dir(rtl)");
    const label = v.labels[i];
    return html`
      ${
        bars
          ? html`<div
              class=${chartColumn()}
              data-chart-anchor
              style=${styleMap({ "--a": `${x - half}%`, "--b": `${100 - x - half}%` })}
            ></div>`
          : html`<div class=${chartCrosshair()} data-chart-anchor style=${styleMap({ "--x": `${x}%` })}></div>
              ${v.shown.map(
                (s, k) =>
                  html`<div
                    class=${chartDot({ series: slot(s.k) })}
                    style=${styleMap({ "--x": `${x}%`, "--y": `${(v.tops[k]![i]! / v.top) * 100}%` })}
                  ></div>`,
              )}`
      }
      <div
        class=${chartTooltip()}
        popover="manual"
        ${float({
          placement: this.kind === "spark" ? "top" : (side === "start") !== rtl ? "right-start" : "left-start",
          anchor: () => this.querySelector("[data-chart-anchor]"),
        })}
        data-chart-tip
        role="status"
      >
        ${label ? html`<span class=${chartTooltipTitle()}>${label}</span>` : nothing}
        ${v.shown.map(
          (s) =>
            html`<span class=${chartTooltipRow()}
              ><span class=${chartTooltipName()}
                >${v.series.length > 1 ? html`<span class=${chartKey({ series: slot(s.k) })}></span>` : nothing}${s.name}</span
              ><strong>${this.format(s.values[i]!)}</strong></span
            >`,
        )}
        ${
          v.stacked
            ? html`<span class=${chartTooltipRow({ total: true })}
                ><span class=${chartTooltipName()}>Total</span><strong>${this.format(v.totals[i]!)}</strong></span
              >`
            : nothing
        }
        ${
          this.target !== undefined
            ? html`<span class=${chartTooltipRow()}
                ><span class=${chartTooltipName()}
                  ><span class=${chartKey({ target: true })}></span
                  >${this.targetLabel ? this.targetLabel : "Target"}</span
                >${this.targetLabel ? nothing : html`<strong>${this.format(this.target)}</strong>`}</span
              >`
            : nothing
        }
      </div>
    `;
  }

  private _axis(v: View) {
    const bars = this.kind === "bars";
    this.#points = v.n;
    const widest = v.labels.reduce<string>((a, l) => ((l ?? "").length > a.length ? l! : a), "");
    return html`<div class=${chartAxis()} aria-hidden="true" data-chart-axis>
      <span class=${chartAxisSizer()} data-chart-sizer>${widest}</span>
      <span class=${chartAxisLine()}>&nbsp;</span>
      ${labelBoxes(v.n, this._step, bars).map(
        (box) =>
          html`<span
            class=${chartAxisLabel({ align: box.align })}
            style=${styleMap({ "--a": `${box.from}%`, "--b": `${100 - box.to}%` })}
            >${v.labels[box.index] ?? ""}</span
          >`,
      )}
    </div>`;
  }

  render() {
    const v = this._view();
    const spark = this.kind === "spark";
    const bars = this.kind === "bars";
    const tick = (value: number) => (this.tickFormat ? this.tickFormat(value, v.step) : this.format(value));
    const highlight = bars && this.highlightLast && v.shown.length === 1 && v.n > 0;
    const plot = html`<div
      class=${chartPlot({ bare: spark })}
      role="img"
      aria-label=${this.label}
      aria-roledescription="chart"
      tabindex=${spark ? "-1" : "0"}
      @pointermove=${(e: PointerEvent) => this._pick(e, v.n)}
      @pointerdown=${(e: PointerEvent) => this._pick(e, v.n)}
      @pointerleave=${() => (this._hover = -1)}
      @keydown=${(e: KeyboardEvent) => this._key(e, v.n)}
      @blur=${() => (this._hover = -1)}
    >
      ${v.ticks
        .slice(1)
        .map((t) => html`<div class=${chartGridline()} style=${styleMap({ "--at": `${(t / v.top) * 100}%` })}></div>`)}
      ${bars ? this._bars(v) : this._lines(v)}
      ${
        this.target !== undefined
          ? html`<div class=${chartTarget()} style=${styleMap({ "--at": `${(this.target / v.top) * 100}%` })}>
              ${this.targetLabel && !spark ? html`<span class=${chartTargetLabel()}>${this.targetLabel}</span>` : nothing}
            </div>`
          : nothing
      }
      ${
        highlight && this._hover < 0
          ? html`<span
              class=${chartValue()}
              aria-hidden="true"
              style=${styleMap({
                "--y": `${(Math.max(0, v.shown[0]!.values[v.n - 1]!) / v.top) * 100}%`,
                // The last bar's end edge: half its slot in from the plot's, less half the bar (at most 48px wide).
                "--e": `calc(${50 / v.n}% - min(${50 / v.n}%, 1.5rem))`,
              })}
              >${this.format(v.shown[0]!.values[v.n - 1]!)}</span
            >`
          : nothing
      }
      ${this._hoverLayer(v)}
    </div>`;
    return html`<div class=${chart({ height: this.height ?? (spark ? "spark" : undefined) })}>
      ${this._head(v)}
      ${
        spark
          ? plot
          : html`<div class=${chartFrame({ headroom: highlight })}>
              <div class=${chartTicks()} aria-hidden="true">
                ${v.ticks.map((t) => html`<span class=${chartTick()}>${tick(t)}</span>`)}
              </div>
              <div class=${chartBody()}>${plot} ${v.n ? this._axis(v) : nothing}</div>
            </div>`
      }
      <table class=${chartTable()}>
        <caption>
          ${this.label}
        </caption>
        ${
          // The rows come at background priority once the page has settled (`whenIdle`): a screen of
          // charts drew hundreds of cells no one sees in the frame it appeared.
          this._table
            ? html`<tr>
                  <th></th>
                  ${v.shown.map((s) => html`<th>${s.name}</th>`)}
                </tr>
                ${Array.from(
                  { length: v.n },
                  (_, i) =>
                    html`<tr>
                      <th>${v.labels[i] ?? i + 1}</th>
                      ${v.shown.map((s) => html`<td>${this.format(s.values[i]!)}</td>`)}
                    </tr>`,
                )}
                ${
                  this.target !== undefined
                    ? html`<tr>
                        <th>${this.targetLabel || "Target"}</th>
                        <td colspan=${v.shown.length}>${this.format(this.target)}</td>
                      </tr>`
                    : nothing
                }`
            : nothing
        }
      </table>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-chart": UiChart;
  }
}
