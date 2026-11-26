import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, waitFor } from "storybook/test";
import { MAX_WAIT_MS, MotionQueue, plan } from "../../../lib/base/motion-queue.ts";
import "./chart.ts";
import type { ChartRange, ChartSeries, UiChart } from "./chart.ts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const money = new Intl.NumberFormat("en", { style: "currency", currency: "USD", notation: "compact" });
const usd = (v: number) => money.format(v);

const revenue: ChartSeries[] = [
  { name: "Revenue", values: [42000, 45500, 44100, 49800, 53200, 51900, 58400, 61700, 60300, 66800, 71200, 76500] },
];

const regions: ChartSeries[] = [
  { name: "North", values: [120, 132, 128, 141, 150, 158, 163, 171, 169, 180, 188, 197] },
  { name: "South", values: [96, 101, 99, 108, 112, 109, 118, 121, 127, 125, 133, 139] },
  { name: "West", values: [64, 70, 75, 73, 81, 88, 86, 94, 99, 104, 101, 112] },
];

const channels: ChartSeries[] = [
  { name: "Direct", values: [18, 20, 21, 23, 22, 25, 27, 28, 30, 31, 33, 35] },
  { name: "Partners", values: [9, 10, 12, 11, 13, 14, 15, 15, 17, 18, 18, 20] },
  { name: "Online", values: [5, 6, 6, 8, 9, 9, 11, 12, 12, 14, 15, 17] },
];

const weeks = Array.from({ length: 26 }, (_, i) => `W${i + 1}`);
const signups: ChartSeries[] = [
  { name: "Sign-ups", values: weeks.map((_, i) => Math.round(140 + i * 9 + ((i * 37) % 23) - 11)) },
];
const ranges: ChartRange[] = [
  { label: "6 weeks", points: 6 },
  { label: "13 weeks", points: 13 },
  { label: "26 weeks", points: 26 },
];

const count = (v: number) => new Intl.NumberFormat("en").format(v);

const tipOf = (el: HTMLElement) => el.querySelector<HTMLElement>("[data-chart-tip]");

const cellsOf = (row: Element) => [...row.querySelectorAll("th, td")].map((c) => c.textContent?.trim());

const meta = preview.type<{ args: { onRange: (e: CustomEvent) => void } }>().meta({
  title: "Primitives/Data/Chart",
  component: "ui-chart",
  parameters: { canvas: "column" },
  args: {
    kind: "line",
    height: "md",
    label: "Orders by region",
    labels: months,
    series: regions,
    format: count,
    tickFormat: undefined,
    target: undefined,
    targetLabel: "",
    highlightLast: false,
    stacked: false,
    ranges: [],
    range: undefined,
    rangeLabel: "Range" as UiChart["rangeLabel"],
    onRange: fn(),
  },
  argTypes: {
    kind: { control: "inline-radio", options: ["line", "bars", "spark"] },
    height: { control: "inline-radio", options: [undefined, "spark", "sm", "md", "fill"] },
    label: { control: "text" },
    labels: { control: "object" },
    series: { control: "object", description: "Up to six series of values, one per label." },
    format: { control: false },
    tickFormat: { control: false },
    target: { control: { type: "number", min: 0, step: 1 } },
    targetLabel: { control: "text" },
    highlightLast: { control: "boolean" },
    stacked: { control: "boolean" },
    ranges: { control: "object" },
    range: { control: { type: "number", min: 1, step: 1 } },
    rangeLabel: { control: "text" },
    onRange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-chart
      kind=${ifDefined(args.kind)}
      height=${ifDefined(args.height)}
      label=${ifDefined(args.label)}
      .labels=${args.labels}
      .series=${args.series}
      .format=${args.format}
      .tickFormat=${args.tickFormat}
      target=${ifDefined(args.target)}
      target-label=${ifDefined(args.targetLabel)}
      ?highlight-last=${args.highlightLast}
      ?stacked=${args.stacked}
      .ranges=${args.ranges}
      range=${ifDefined(args.range)}
      range-label=${ifDefined(args.rangeLabel)}
      @ui-range=${args.onRange}
    ></ui-chart>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Every control drives the chart; legend chips toggle series and arrow keys, Home and End read points.",
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole("img", { name: "Orders by region" });
    await expect(canvas.getByRole("table", { name: "Orders by region" })).toBeInTheDocument();
    await expect(await canvas.findAllByRole("row")).toHaveLength(13);
    const rows = () => canvas.getAllByRole("row");
    await expect(cellsOf(rows()[0]!)).toEqual(["", "North", "South", "West"]);
    await expect(cellsOf(rows()[1]!)).toEqual(["Jan", "120", "96", "64"]);
    await expect(cellsOf(rows()[12]!)).toEqual(["Dec", "197", "139", "112"]);
    await expect(canvas.getByRole("group", { name: "Series" })).toBeInTheDocument();
    const north = canvas.getByRole("button", { name: "North" });
    const south = canvas.getByRole("button", { name: "South" });
    const west = canvas.getByRole("button", { name: "West" });
    await expect(north).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(north);
    await expect(north).toHaveAttribute("aria-pressed", "false");
    await expect(cellsOf(rows()[0]!)).toEqual(["", "South", "West"]);
    south.focus();
    await userEvent.keyboard(" ");
    await expect(south).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(west);
    await expect(west).toHaveAttribute("aria-pressed", "true");
    await expect(cellsOf(rows()[1]!)).toEqual(["Jan", "64"]);
    await userEvent.click(north);
    await userEvent.click(south);
    await expect(cellsOf(rows()[0]!)).toEqual(["", "North", "South", "West"]);
    plot.focus();
    await expect(plot).toHaveFocus();
    const status = canvas.getByRole("status");
    await expect(plot).not.toContainElement(status);
    await expect(status).toHaveTextContent(/^$/);
    await userEvent.keyboard("{Home}");
    await expect(await canvas.findByText("Jan, North 120, South 96, West 64")).toBe(status);
    await waitFor(() => expect(tipOf(canvasElement)).toBeVisible());
    await expect(tipOf(canvasElement)).toHaveTextContent("North120");
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Feb, North 132, South 101, West 70")).toBe(status);
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}");
    await expect(await canvas.findByText(/^Mar, /)).toBe(status);
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("Dec, North 197, South 139, West 112")).toBe(status);
    await waitFor(() => expect(tipOf(canvasElement)).toBeVisible());
    await expect(tipOf(canvasElement)).toHaveTextContent("Dec");
    await expect(tipOf(canvasElement)).toHaveTextContent("North197");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByText("Nov, North 188, South 133, West 101")).toBe(status);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(status).toHaveTextContent(/^$/));
    await expect(tipOf(canvasElement)).toBeNull();
  },
});

export const RangesArgs = meta.story({
  name: "Range picker",
  args: { label: "Weekly sign-ups", labels: weeks, series: signups, ranges, range: 13 },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Range" })).toBeInTheDocument();
    const thirteen = canvas.getByRole("radio", { name: "13 weeks" });
    await expect(thirteen).toHaveAttribute("aria-checked", "true");
    await expect(thirteen).toHaveAttribute("tabindex", "0");
    await expect(await canvas.findAllByRole("row")).toHaveLength(14);
    await expect(cellsOf(canvas.getAllByRole("row")[1]!)[0]).toBe("W14");
    thirteen.focus();
    await userEvent.keyboard("{ArrowRight}");
    const all = canvas.getByRole("radio", { name: "26 weeks" });
    await expect(all).toHaveFocus();
    await expect(all).toHaveAttribute("aria-checked", "true");
    await expect(args.onRange).toHaveBeenCalledOnce();
    await expect(args.onRange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { points: 26 } }));
    await expect(canvas.getAllByRole("row")).toHaveLength(27);
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "6 weeks" })).toHaveFocus();
    await expect(args.onRange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { points: 6 } }));
    await expect(canvas.getAllByRole("row")).toHaveLength(7);
    await userEvent.click(canvas.getByRole("radio", { name: "13 weeks" }));
    await expect(args.onRange).toHaveBeenCalledTimes(3);
    await expect(canvas.getByRole("radio", { name: "13 weeks" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(canvas.getByRole("radio", { name: "13 weeks" }));
    await expect(args.onRange).toHaveBeenCalledTimes(3);
  },
});

export const StackedBarsTarget = meta.story({
  name: "Stacked bars with a target",
  args: {
    kind: "bars",
    stacked: true,
    label: "New accounts by channel",
    series: channels,
    target: 60,
    targetLabel: "Plan",
  },
  play: async ({ canvas, userEvent }) => {
    const rows = await canvas.findAllByRole("row");
    await expect(rows).toHaveLength(14);
    await expect(cellsOf(rows[13]!)).toEqual(["Plan", "60"]);
    canvas.getByRole("img", { name: "New accounts by channel" }).focus();
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("Dec, Direct 35, Partners 20, Online 17, Total 72, Plan")).toBe(
      canvas.getByRole("status"),
    );
    await userEvent.keyboard("{Escape}");
  },
});

export const HighlightLastArgs = meta.story({
  name: "Highlighted last bar",
  args: { kind: "bars", highlightLast: true, label: "Monthly revenue", series: revenue, format: usd },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("$77K")).toBeInTheDocument();
    const rows = await canvas.findAllByRole("row");
    await expect(cellsOf(rows[12]!)).toEqual(["Dec", "$77K"]);
  },
});

export const Spark = meta.story({
  name: "Spark",
  args: { kind: "spark", height: undefined, label: "Orders rising over 12 months", labels: [] },
  play: async ({ canvas }) => {
    const plot = canvas.getByRole("img", { name: "Orders rising over 12 months" });
    await expect(plot).toHaveAttribute("tabindex", "-1");
    await expect(canvas.queryByRole("group", { name: "Series" })).toBeNull();
    const rows = await canvas.findAllByRole("row");
    await expect(cellsOf(rows[1]!)).toEqual(["1", "120", "96", "64"]);
  },
});

export const NoData = meta.story({
  name: "No data",
  args: { label: "Nothing recorded", labels: [], series: [] },
  play: async ({ canvas, userEvent }) => {
    const plot = canvas.getByRole("img", { name: "Nothing recorded" });
    plot.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("status")).toHaveTextContent(/^$/);
    await expect(canvas.queryByRole("group", { name: "Series" })).toBeNull();
  },
});

const quarters = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];
const profit: ChartSeries[] = [{ name: "Profit", values: [5, -3, 8, -6, 2, 4] }];

export const NegativeBars = meta.story({
  name: "Negative bars",
  args: { kind: "bars", label: "Quarterly profit", labels: quarters, series: profit },
  play: async ({ canvas }) => {
    const plot = canvas.getByRole("img", { name: "Quarterly profit" });
    const zero = plot.querySelector<HTMLElement>("[data-chart-zero]")!;
    await expect(zero).toBeInTheDocument();
    const baseline = zero.offsetTop + zero.offsetHeight;
    const bars = [...plot.querySelectorAll<HTMLElement>("[data-chart-bar]")];
    await expect(bars).toHaveLength(6);
    const top = (b: HTMLElement) => b.offsetTop;
    const bottom = (b: HTMLElement) => b.offsetTop + b.offsetHeight;
    for (const i of [0, 2, 4, 5]) {
      await expect(Math.abs(bottom(bars[i]!) - baseline)).toBeLessThanOrEqual(1);
      await expect(top(bars[i]!)).toBeLessThan(baseline);
    }
    for (const i of [1, 3]) {
      await expect(Math.abs(top(bars[i]!) - baseline)).toBeLessThanOrEqual(1);
      await expect(bottom(bars[i]!)).toBeGreaterThan(baseline + 4);
    }
    await expect(bars[3]!.offsetHeight).toBeGreaterThan(bars[1]!.offsetHeight);
    await expect(bars[3]!.offsetHeight).toBeCloseTo(bars[1]!.offsetHeight * 2, -1);
    const rows = await canvas.findAllByRole("row");
    await expect(cellsOf(rows[4]!)).toEqual(["Q4", "-6"]);
  },
});

export const NegativeLine = meta.story({
  name: "Negative line",
  args: { label: "Quarterly profit trend", labels: quarters, series: profit },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole("img", { name: "Quarterly profit trend" });
    await expect(plot.querySelector("[data-chart-zero]")).toBeInTheDocument();
    plot.focus();
    await userEvent.keyboard("{End}");
    await expect(await canvas.findByText("Q6, Profit 4")).toBe(canvas.getByRole("status"));
    await waitFor(() => expect(tipOf(canvasElement)).toBeVisible());
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}");
    await expect(await canvas.findByText("Q3, Profit 8")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(await canvas.findByText("Q4, Profit -6")).toBeInTheDocument();
  },
});

export const RevealQueue = meta.story({
  name: "Reveal queue",
  parameters: {
    docs: {
      description: {
        story:
          "Chart reveals wait in the ambient motion lane; a reveal that waits too long is skipped to its end, and one whose chart left the page is dropped.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      plan(16, { input: 0, follow: 0, ambient: 1 }, [
        { lane: "ambient", waited: MAX_WAIT_MS },
        { lane: "ambient", waited: 10 },
      ]),
    ).toEqual({ start: [], skip: [0] });
    await expect(
      plan(16, { input: 0, follow: 0, ambient: 0 }, [
        { lane: "ambient", waited: MAX_WAIT_MS + 1 },
        { lane: "ambient", waited: 10 },
      ]),
    ).toEqual({ start: [1], skip: [0] });
    const queue = new MotionQueue();
    const box = () => canvasElement.appendChild(document.createElement("div"));
    const fade = (el: Element) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 60_000 });
    const playing = box();
    const first = fade(playing);
    void queue.add([first], "ambient", playing);
    await waitFor(() => expect(first.playState).toBe("running"));
    const leaving = box();
    const gone = fade(leaving);
    const dropped = queue.add([gone], "ambient", leaving);
    leaving.remove();
    await dropped;
    await expect(gone.playState).toBe("idle");
    const waiting = box();
    const late = fade(waiting);
    await queue.add([late], "ambient", waiting);
    await expect(late.playState).toBe("finished");
    await expect(first.playState).toBe("running");
    first.finish();
    playing.remove();
    waiting.remove();
  },
});

export const Line = meta.story({
  name: "Line",
  parameters: {
    docs: {
      description: {
        story:
          "The plot is focusable: arrow keys move between points, Home and End jump to the ends, and a tooltip reads each one.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-chart label="Monthly revenue" .labels=${months} .series=${revenue} .format=${usd}></ui-chart>
  `,
});

export const SeveralLines = meta.story({
  name: "Several lines",
  parameters: {
    docs: {
      description: {
        story:
          "With more than one series a legend appears; each chip toggles its series, but the last one shown stays on.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-chart label="Orders by region" .labels=${months} .series=${regions}></ui-chart>`,
});

export const StackedLines = meta.story({
  name: "Stacked lines",
  parameters: {
    docs: { description: { story: "Stacked series draw as bands and the tooltip adds a total." } },
    canvas: "column",
  },
  render: () => html`
    <ui-chart label="New accounts by channel" stacked .labels=${months} .series=${channels}></ui-chart>
  `,
});

export const Bars = meta.story({
  name: "Bars",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-chart kind="bars" label="Monthly revenue" .labels=${months} .series=${revenue} .format=${usd}></ui-chart>
  `,
});

export const HighlightTheLatestBar = meta.story({
  name: "Highlight the latest bar",
  parameters: {
    docs: { description: { story: "highlight-last mutes every bar but the last and labels its value." } },
    canvas: "column",
  },
  render: () => html`
    <ui-chart
      kind="bars"
      highlight-last
      label="Monthly revenue"
      .labels=${months}
      .series=${revenue}
      .format=${usd}
    ></ui-chart>
  `,
});

export const GroupedAndStackedBars = meta.story({
  name: "Grouped and stacked bars",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-chart
      kind="bars"
      label="Orders by region"
      .labels=${months.slice(6)}
      .series=${regions.map((s) => ({ ...s, values: s.values.slice(6) }))}
    ></ui-chart>
    <ui-chart kind="bars" stacked label="New accounts by channel" .labels=${months} .series=${channels}></ui-chart>
  `,
});

export const Target = meta.story({
  name: "Target",
  parameters: {
    docs: {
      description: {
        story:
          "The target is a dashed line; with a target-label the label is drawn on the line and named in the tooltip.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-chart
      label="Monthly revenue against target"
      target="60000"
      target-label="Target"
      .labels=${months}
      .series=${revenue}
      .format=${usd}
    ></ui-chart>
    <ui-chart
      kind="bars"
      label="Tickets closed per month"
      target="150"
      .labels=${months}
      .series=${[{ name: "Closed", values: [118, 124, 131, 140, 137, 149, 152, 158, 147, 161, 166, 172] }]}
    ></ui-chart>
  `,
});

export const Ranges = meta.story({
  name: "Ranges",
  parameters: {
    docs: {
      description: {
        story:
          "Ranges add a radio group that shows only the latest points; arrow keys move between ranges and fire ui-range.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-chart label="Weekly sign-ups" .labels=${weeks} .series=${signups} .ranges=${ranges} range="13"></ui-chart>
  `,
});

export const Heights = meta.story({
  name: "Heights",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-chart height="sm" label="Monthly revenue" .labels=${months} .series=${revenue} .format=${usd}></ui-chart>
    <ui-chart height="md" label="Monthly revenue" .labels=${months} .series=${revenue} .format=${usd}></ui-chart>
  `,
});

export const TickFormat = meta.story({
  name: "Tick format",
  parameters: {
    docs: { description: { story: "tickFormat formats only the axis ticks, while format still formats the tooltip." } },
    canvas: "column",
  },
  render: () => html`
    <ui-chart
      kind="bars"
      label="Average order value"
      .labels=${months}
      .series=${[{ name: "Average order", values: [182.4, 179.9, 188.2, 191.5, 197.3, 203.8, 199.1, 207.6, 214.2, 219.9, 226.4, 231.7] }]}
      .format=${(v: number) => `$${v.toFixed(2)}`}
      .tickFormat=${(v: number) => `$${Math.round(v)}`}
    ></ui-chart>
  `,
});

export const Sparklines = meta.story({
  name: "Sparklines",
  parameters: {
    docs: {
      description: {
        story: "A spark has no axes, legend or keyboard stop; pair it with a label that gives the trend in words.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-chart kind="spark" label="Revenue rising over 12 months" .series=${revenue}></ui-chart>
    <ui-chart
      kind="spark"
      label="Refunds falling over 12 months"
      .series=${[{ name: "Refunds", values: [31, 29, 30, 26, 24, 25, 21, 19, 18, 16, 15, 12] }]}
    ></ui-chart>
    <ui-chart kind="spark" label="Orders by region" .series=${regions}></ui-chart>
  `,
});

const across = (plot: HTMLElement, f: number) => {
  const r = plot.getBoundingClientRect();
  return { target: plot, coords: { clientX: r.left + r.width * f, clientY: r.top + r.height / 2 } };
};

export const PointerReading = meta.story({
  name: "Pointer reading",
  parameters: {
    docs: { description: { story: "Pointing at the plot picks the nearest point; leaving it hides the tooltip." } },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole("img", { name: "Orders by region" });
    await userEvent.pointer(across(plot, 0));
    await waitFor(() => expect(tipOf(canvasElement)).toBeVisible());
    await expect(tipOf(canvasElement)).toHaveTextContent("Jan");
    await expect(tipOf(canvasElement)).toHaveTextContent("North120");
    await expect(canvas.getByRole("status")).toHaveTextContent(/^$/);
    await userEvent.pointer(across(plot, 0.52));
    await waitFor(() => expect(tipOf(canvasElement)).toHaveTextContent("Jul"));
    await userEvent.pointer([{ ...across(plot, 1), keys: "[MouseLeft]" }]);
    await waitFor(() => expect(tipOf(canvasElement)).toHaveTextContent("Dec"));
    await expect(tipOf(canvasElement)).toHaveTextContent("North197");
    await userEvent.unhover(plot);
    await waitFor(() => expect(tipOf(canvasElement)).toBeNull());
  },
});

export const PointerRightToLeft = meta.story({
  name: "Pointer, right to left bars",
  parameters: {
    docs: { description: { story: "In right-to-left the first bar sits at the right edge under the pointer." } },
  },
  render: () => html`
    <div dir="rtl">
      <ui-chart kind="bars" label="Monthly revenue" .labels=${months} .series=${revenue} .format=${usd}></ui-chart>
    </div>
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole("img", { name: "Monthly revenue" });
    await userEvent.pointer(across(plot, 0.99));
    await waitFor(() => expect(tipOf(canvasElement)).toHaveTextContent("Jan"));
    await expect(tipOf(canvasElement)).toHaveTextContent("Revenue$42K");
    await userEvent.pointer(across(plot, 0));
    await waitFor(() => expect(tipOf(canvasElement)).toHaveTextContent("Dec"));
    await userEvent.unhover(plot);
    await waitFor(() => expect(tipOf(canvasElement)).toBeNull());
  },
});

export const UnevenSeries = meta.story({
  name: "Uneven series and labels",
  parameters: {
    docs: {
      description: {
        story:
          "A short series reads as zero where it has no value; points without a label are numbered in the table, and an unlabelled target reads its value.",
      },
    },
  },
  args: {
    label: "Weekly orders",
    labels: ["W1", "W2"],
    series: [
      { name: "Shop", values: [40, 52, 61, 58] },
      { name: "Phone", values: [12, 9] },
    ],
    target: 70,
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const rows = await canvas.findAllByRole("row");
    await expect(rows).toHaveLength(6);
    await expect(cellsOf(rows[3]!)).toEqual(["3", "61", "0"]);
    await expect(cellsOf(rows[5]!)).toEqual(["Target", "70"]);
    const axis = canvasElement.querySelector("[data-chart-axis]")!;
    await expect(axis.querySelector("[data-chart-sizer]")).toHaveTextContent("W1");
    await expect(axis).not.toHaveTextContent("3");
    const plot = canvas.getByRole("img", { name: "Weekly orders" });
    plot.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByText("Shop 58, Phone 0, Target 70")).toBe(canvas.getByRole("status"));
    await waitFor(() => expect(tipOf(canvasElement)).toBeVisible());
    const tip = tipOf(canvasElement)!;
    await expect(tip).toHaveTextContent("Target70");
    await expect(tip).not.toHaveTextContent("W");
    await userEvent.keyboard("a");
    await expect(canvas.getByRole("status")).toHaveTextContent("Shop 58, Phone 0, Target 70");
    await userEvent.keyboard("{Escape}");
  },
});

export const SinglePoint = meta.story({
  name: "Single point",
  parameters: { docs: { description: { story: "One value draws a dot for a line and one full-width bar." } } },
  render: () => html`
    <ui-chart label="Opening balance" .labels=${["Jan"]} .series=${[{ name: "Balance", values: [7] }]}></ui-chart>
    <ui-chart
      kind="bars"
      label="Opening stock"
      .labels=${["Jan"]}
      .series=${[{ name: "Stock", values: [7] }]}
    ></ui-chart>
  `,
  play: async ({ canvas }) => {
    const line = canvas.getByRole("img", { name: "Opening balance" });
    const paths = line.querySelectorAll("path");
    await expect(paths).toHaveLength(1);
    await expect(paths[0]!.getAttribute("d")).toMatch(/^M[\d.]+,[\d.]+ L[\d.]+,[\d.]+$/);
    const bars = canvas.getByRole("img", { name: "Opening stock" }).querySelectorAll<HTMLElement>("[data-chart-bar]");
    await expect(bars).toHaveLength(1);
    await expect(bars[0]!.style.getPropertyValue("--d")).toBe("0");
  },
});

export const FlatSpark = meta.story({
  name: "Flat spark",
  parameters: {
    docs: { description: { story: "An all-zero spark sits on its baseline and still reads its points." } },
  },
  args: {
    kind: "spark",
    height: undefined,
    label: "No refunds",
    labels: [],
    series: [{ name: "Refunds", values: [0, 0, 0] }],
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole("img", { name: "No refunds" });
    const path = plot.querySelector("path")!;
    await expect(path.getAttribute("d")).toContain("100");
    await userEvent.pointer(across(plot, 0.5));
    await waitFor(() => expect(tipOf(canvasElement)).toBeVisible());
    await expect(tipOf(canvasElement)).toHaveTextContent("Refunds0");
    await userEvent.unhover(plot);
  },
});

export const RangeOffers = meta.story({
  name: "Range offers",
  parameters: {
    docs: {
      description: {
        story: "Ranges past the data collapse into one; without range the first is picked; Up and Down move too.",
      },
    },
  },
  args: {
    label: "Weekly sign-ups",
    labels: weeks,
    series: signups,
    ranges: [...ranges, { label: "52 weeks", points: 52 }],
    range: undefined,
  },
  play: async ({ canvas, userEvent, args }) => {
    const radios = canvas.getAllByRole("radio");
    await expect(radios.map((r) => r.textContent?.trim())).toEqual(["6 weeks", "13 weeks", "26 weeks"]);
    await expect(radios[0]).toHaveAttribute("aria-checked", "true");
    radios[0]!.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "13 weeks" })).toHaveFocus();
    await expect(args.onRange).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { points: 13 } }));
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("radio", { name: "6 weeks" })).toHaveFocus();
    await userEvent.keyboard("a");
    await expect(canvas.getByRole("radio", { name: "6 weeks" })).toHaveFocus();
    await expect(args.onRange).toHaveBeenCalledTimes(2);
  },
});

export const HiddenAndReplaced = meta.story({
  name: "Hidden series, replaced and moved",
  parameters: {
    docs: {
      description: {
        story:
          "A hidden stacked series draws no segment; new series with fewer entries show again, and moving the chart keeps its table.",
      },
    },
  },
  args: { kind: "bars", stacked: true, label: "New accounts by channel", series: channels },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const el = canvasElement.querySelector("ui-chart")!;
    await userEvent.click(canvas.getByRole("button", { name: "Direct" }));
    await expect(canvas.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "false");
    const plot = canvas.getByRole("img", { name: "New accounts by channel" });
    const segment = plot.querySelector<HTMLElement>("[aria-hidden] > div > div > div")!;
    await expect(segment.style.getPropertyValue("--bar")).toBe("0%");
    await expect((segment.nextElementSibling as HTMLElement).style.getPropertyValue("--bar")).not.toBe("0%");
    await userEvent.click(canvas.getByRole("button", { name: "Partners" }));
    await expect(canvas.getByRole("button", { name: "Partners" })).toHaveAttribute("aria-pressed", "false");
    el.series = [channels[0]!, channels[1]!];
    await el.updateComplete;
    await expect(canvas.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Partners" })).toHaveAttribute("aria-pressed", "true");
    await expect(await canvas.findAllByRole("row")).toHaveLength(13);
    const parent = el.parentElement!;
    el.remove();
    parent.append(el);
    await el.updateComplete;
    await expect(cellsOf((await canvas.findAllByRole("row"))[0]!)).toEqual(["", "Direct", "Partners"]);
  },
});

export const BarsReveal = meta.story({
  name: "Bars reveal",
  parameters: {
    docs: {
      description: { story: "Bars grow in through the motion queue; a new range from outside replaces the pick." },
    },
  },
  args: { kind: "bars", label: "Weekly sign-ups", labels: weeks, series: signups, ranges, range: 13 },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const el = canvasElement.querySelector("ui-chart")!;
    const grow = el
      .getAnimations({ subtree: true })
      .filter((a) => a instanceof CSSTransition && a.transitionProperty === "scale");
    await expect(grow.length).toBeGreaterThan(0);
    await waitFor(() => expect(grow.every((a) => a.playState === "finished")).toBe(true));
    await userEvent.click(canvas.getByRole("radio", { name: "26 weeks" }));
    await expect(canvas.getByRole("radio", { name: "26 weeks" })).toHaveAttribute("aria-checked", "true");
    el.range = 6;
    await el.updateComplete;
    await expect(canvas.getByRole("radio", { name: "6 weeks" })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getAllByRole("row")).toHaveLength(7);
  },
});
