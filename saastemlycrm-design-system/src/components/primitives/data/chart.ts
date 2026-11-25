import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { axisOf, labelBoxes, labelStep, niceScale, pointAt, smoothPath, type Point } from "../../base/chart.ts";
import { floating as float } from "../../base/floating.ts";
import { formatInt, m } from "../../../i18n/index.ts";
import { inlineStep, isRtl } from "../../base/reading.ts";
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

export const chart = rcva(
  `${stack} ${text.label} relative w-full gap-2 text-body-sm text-on-surface-variant [anchor-scope:--chart-tip]`,
  {
    variants: {
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

export const chartHead = rcva(`${row} items-center justify-between gap-x-3 gap-y-2`);
export const chartLegend = rcva(`${row} min-w-0 gap-1.5`);
export const chartChip = rcva(
  `${inlineRow} ${text.label} ${pad["2"]} touch-target state-layer cursor-pointer items-center gap-1.5 rounded-full border border-outline-variant py-0.5 text-label-md`,
  { variants: { on: { true: "text-on-surface", false: "text-on-surface-variant" } } },
);
export const chartRanges = rcva(rowEnd);

export const chartFrame = rcva(`${row} items-start gap-2`, {
  variants: { headroom: { true: "mt-4", false: "" } },
});
export const chartTicks = rcva(
  `${stackReverse} h-(--chart-h) max-w-[40%] min-w-0 items-end justify-between text-label-sm tabular-nums`,
);
export const chartTick = rcva(`${row} h-0 items-center justify-end text-end`);
export const chartBody = rcva(`${stack} min-w-0 flex-1 gap-1`);

export const chartPlot = rcva("relative h-(--chart-h) w-full touch-pan-y", {
  variants: { bare: { true: "", false: "cursor-crosshair border-b border-outline-variant" } },
});
export const chartGridline = rcva(
  "pointer-events-none absolute inset-x-0 bottom-(--at) border-t border-outline-variant",
);

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

export const chartSvg = rcva(
  "absolute inset-0 size-full overflow-visible [animation:chart-reveal_var(--duration-long2)_var(--ease-emphasized-decelerate)_both] motion-reduce:[animation:none] rtl:-scale-x-100",
);
export const chartLine = rcva(
  "fill-none stroke-current [stroke-width:2] [stroke-linejoin:round] [stroke-linecap:round]",
  { variants: { series: SERIES } },
);
export const chartArea = rcva("stroke-none");
export const chartFade = rcva("", { variants: { series: SERIES } });
export const chartBand = rcva("fill-current stroke-none opacity-40", { variants: { series: SERIES } });

export const chartBars = rcva(`${row} absolute inset-0 items-end gap-0.5`);
export const chartBarSlot = rcva(`${row} h-full min-w-0 flex-1 items-end justify-center gap-0.5`);
const GROW =
  "origin-bottom [transition:scale_var(--duration-long2)_var(--ease-emphasized-decelerate)_calc(var(--d)*var(--duration-short4)),color_var(--duration-effects)_var(--ease-effects)] motion-reduce:transition-none starting:scale-y-0";
export const chartBar = rcva(`h-(--bar) max-w-12 min-w-0 flex-1 rounded-t-sm bg-current ${GROW}`, {
  variants: { series: SERIES },
});
export const chartStack = rcva(`${stackReverse} h-full w-full max-w-12 min-w-0 ${GROW}`);
export const chartSegment = rcva(
  "h-(--bar) w-full border-b-2 border-transparent bg-current bg-clip-padding first:border-b-0 [transition:color_var(--duration-effects)_var(--ease-effects)] motion-reduce:transition-none",
  { variants: { series: SERIES, top: { true: "rounded-t-sm", false: "" } } },
);
export const chartValue = rcva(
  "pointer-events-none absolute end-(--e) bottom-(--y) mb-1 max-w-full text-end text-label-md text-on-surface tabular-nums",
);

export const chartTarget = rcva(
  "pointer-events-none absolute inset-x-0 bottom-(--at) border-t border-dashed border-outline",
);
export const chartTargetLabel = rcva("absolute end-0 bottom-0.5 rounded-xs bg-surface/80 px-1 text-label-sm");

export const chartColumn = rcva(
  "pointer-events-none absolute inset-y-0 start-(--a) end-(--b) rounded-t-xs bg-on-surface/(--state-hover)",
);
export const chartCrosshair = rcva("pointer-events-none absolute inset-y-0 start-(--x) border-s border-outline");
export const chartDot = rcva(
  "pointer-events-none absolute start-(--x) bottom-(--y) size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-current ring-2 ring-surface rtl:translate-x-1/2",
  { variants: { series: SERIES } },
);
export const chartTooltip = rcva(
  `${stack} ${pad["2.5"]} ${floatingFit["6"]} ${floatingHeight.fit} liquid-glass pointer-events-none gap-0.5 overflow-visible rounded-field py-1.5 text-on-surface`,
);
export const chartTooltipTitle = rcva("text-label-sm text-on-surface-variant");
export const chartTooltipRow = rcva(`${row} items-center justify-between gap-x-3 tabular-nums`, {
  variants: { total: { true: "mt-0.5 border-t border-outline-variant pt-1", false: "" } },
});
export const chartTooltipName = rcva(`${inlineRow} min-w-0 items-center gap-1.5 text-on-surface-variant`);
export const chartKey = rcva("h-0.5 w-3 shrink-0 rounded-full bg-current", {
  variants: {
    series: SERIES,
    target: { true: "h-0 rounded-none border-t border-dashed border-outline bg-transparent" },
  },
});
export const chartSwatch = rcva(`${fixed["2"]} rounded-full border border-current`, {
  variants: { series: SERIES, on: { true: "bg-current", false: "bg-transparent" } },
});

export const chartAxis = rcva("relative w-full text-label-sm tabular-nums");
export const chartAxisLabel = rcva("absolute top-0 start-(--a) end-(--b) truncate", {
  variants: { align: { start: "text-start", center: "text-center", end: "text-end" } },
});
export const chartAxisSizer = rcva("invisible absolute start-0 top-0 w-fit");
export const chartAxisLine = rcva("invisible");
export const chartTable = rcva("sr-only");

export type ChartVariants = VariantProps<typeof chart>;

export interface ChartSeries {
  name: string;
  values: number[];
}

export interface ChartRange {
  label: string;
  points: number;
}

interface View {
  n: number;
  labels: (string | undefined)[];
  series: { k: number; name: string; values: number[]; on: boolean }[];
  shown: { k: number; name: string; values: number[] }[];
  stacked: boolean;
  tops: number[][];
  totals: number[];
  top: number;
  step: number;
  ticks: number[];
}

let charts = 0;

@customElement("ui-chart")
export class UiChart extends LightElement {
  @property() kind: "spark" | "bars" | "line" = "line";
  @property() height: ChartVariants["height"];
  @property() label = "";
  @property({ attribute: false }) labels: string[] = [];
  @property({ attribute: false }) series: ChartSeries[] = [];
  @property({ attribute: false }) format: (v: number) => string = (v) => formatInt(v);
  @property({ attribute: false }) tickFormat?: (v: number, step: number) => string;
  @property({ type: Number }) target?: number;
  @property({ attribute: "target-label" }) targetLabel = "";
  @property({ type: Boolean, attribute: "highlight-last" }) highlightLast = false;
  @property({ type: Boolean }) stacked = false;
  @property({ attribute: false }) ranges: ChartRange[] = [];
  @property({ type: Number }) range?: number;
  @property({ attribute: "range-label" }) rangeLabel = m.chart_range();
  @state() private _hover = -1;
  @state() private _hidden: ReadonlySet<number> = new Set();
  @state() private _points?: number;
  @state() private _step = 1;
  @state() private _table = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this._table) whenIdle(this, () => (this._table = true));
  }
  #uid = `chart-${++charts}`;
  #points = 0;
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
    if (changed.has("ranges") && !this._offers().some((r) => r.points === this._points)) this._points = undefined;
    if (changed.has("range") && changed.get("range") !== undefined) this._points = undefined;
    if (changed.has("series") && this._hidden.size >= this.series.length) this._hidden = new Set();
  }

  #observed = new WeakSet<Element>();

  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.querySelector("svg, [data-chart-plot]")) {
      this.#revealed = true;
      const reveal = this.getAnimations({ subtree: true }).filter(
        (a) =>
          (a instanceof CSSAnimation && a.animationName === "chart-reveal") ||
          (a instanceof CSSTransition && a.transitionProperty === "scale"),
      );
      void motion.add(reveal, "ambient", this);
    }
    const tip = this.querySelector<HTMLElement>("[data-chart-tip]");
    if (tip && !tip.matches(":popover-open")) tip.showPopover();
    for (const el of this.querySelectorAll<HTMLElement>("[data-chart-axis], [data-chart-sizer]"))
      if (!this.#observed.has(el)) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
    this._fit();
  }

  private _fit() {
    if (!this.#axisWidth || !this.#labelWidth) return;
    const step = labelStep(this.#points, this.kind === "bars", this.#axisWidth, this.#labelWidth);
    if (step !== this._step) this._step = step;
  }

  private get _count() {
    return Math.max(0, ...this.series.slice(0, 6).map((s) => s.values.length));
  }

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

  private _x(i: number, n: number) {
    return pointAt(i, axisOf(n, this.kind === "bars"));
  }

  private _pick(e: PointerEvent, n: number) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const across = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const f = isRtl(el) ? 1 - across : across;
    this._hover = this.kind === "bars" ? Math.min(n - 1, Math.floor(f * n)) : Math.round(f * (n - 1));
  }

  private _key(e: KeyboardEvent, n: number) {
    if (!n) return;
    const step = inlineStep(e.key, e.currentTarget as HTMLElement);
    if (step) this._hover = this._hover < 0 ? n - 1 : Math.min(n - 1, Math.max(0, this._hover + step));
    else if (e.key === "Home") this._hover = 0;
    else if (e.key === "End") this._hover = n - 1;
    else if (e.key === "Escape") this._hover = -1;
    else return;
    e.preventDefault();
  }

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
    const dir = inlineStep(e.key, this) || { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const j = (i + dir + offers.length) % offers.length;
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
          ? html`<div class=${chartLegend()} role="group" aria-label=${m.chart_series()}>
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
    const line = (pts: Point[]) =>
      pts.length === 1 ? `M${pts[0]![0]},${pts[0]![1]} L${pts[0]![0]},${pts[0]![1]}` : smoothPath(pts);
    const single = v.shown.length === 1;
    const end = this._x(v.n - 1, v.n);
    const start = this._x(0, v.n);
    const drawn = v.shown.map((s, at) => {
      const pts = points(v.tops[at]!);
      const fill = `${this.#uid}-${s.k}`;
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
                ><span class=${chartTooltipName()}>${m.chart_total()}</span
                ><strong>${this.format(v.totals[i]!)}</strong></span
              >`
            : nothing
        }
        ${
          this.target !== undefined
            ? html`<span class=${chartTooltipRow()}
                ><span class=${chartTooltipName()}
                  ><span class=${chartKey({ target: true })}></span
                  >${this.targetLabel ? this.targetLabel : m.chart_target()}</span
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
          this._table
            ? html`<tr>
                  <th></th>
                  ${v.shown.map((s) => html`<th>${s.name}</th>`)}
                </tr>
                ${Array.from(
                  { length: v.n },
                  (_, i) =>
                    html`<tr>
                      <th>${v.labels[i] ?? formatInt(i + 1)}</th>
                      ${v.shown.map((s) => html`<td>${this.format(s.values[i]!)}</td>`)}
                    </tr>`,
                )}
                ${
                  this.target !== undefined
                    ? html`<tr>
                        <th>${this.targetLabel || m.chart_target()}</th>
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
