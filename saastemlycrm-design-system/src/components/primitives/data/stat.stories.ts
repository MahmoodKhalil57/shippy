import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "./stat.ts";
import "./chart.ts";
import type { ChartSeries } from "./chart.ts";
import type { UiStat } from "./stat.ts";

const rising: ChartSeries[] = [{ name: "Revenue", values: [42, 45, 44, 50, 53, 52, 58, 62, 60, 67, 71, 77] }];
const falling: ChartSeries[] = [{ name: "Churn", values: [31, 29, 30, 26, 24, 25, 21, 19, 18, 16, 15, 12] }];

const meta = preview.meta({
  title: "Primitives/Data/Stat",
  component: "ui-stat",
  args: {
    label: "Revenue",
    value: "$184,200",
    note: "vs last quarter",
    tone: "neutral",
    size: "md",
    href: undefined,
    main: false,
    outlined: false,
    fill: false,
    mini: false,
    delta: "12%",
    deltaDir: "up",
    deltaTone: "success",
    share: undefined,
    shareText: "",
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    note: { control: "text" },
    tone: { control: "select", options: ["neutral", "primary", "info", "success", "warning", "error"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    href: { control: "text" },
    main: { control: "boolean" },
    outlined: { control: "boolean" },
    fill: { control: "boolean" },
    mini: { control: "boolean" },
    delta: { control: "text" },
    deltaDir: { control: "inline-radio", options: ["up", "down", "flat"] },
    deltaTone: { control: "select", options: ["neutral", "success", "warning", "error"] },
    share: { control: { type: "number", min: 0, max: 1.5, step: 0.01 } },
    shareText: { control: "text" },
  },
  render: (args) => html`
    <ui-stat
      label=${ifDefined(args.label)}
      value=${ifDefined(args.value)}
      note=${ifDefined(args.note)}
      tone=${ifDefined(args.tone)}
      size=${ifDefined(args.size)}
      href=${ifDefined(args.href)}
      ?main=${args.main}
      ?outlined=${args.outlined}
      ?fill=${args.fill}
      ?mini=${args.mini}
      delta=${ifDefined(args.delta)}
      delta-dir=${ifDefined(args.deltaDir)}
      delta-tone=${ifDefined(args.deltaTone)}
      share=${ifDefined(args.share)}
      share-text=${ifDefined(args.shareText)}
    ></ui-stat>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the stat." } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Revenue")).toBeInTheDocument();
    await expect(await canvas.findByText("$184,200")).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "Up" })).toBeInTheDocument();
    await expect(canvas.getByText("12%")).toBeInTheDocument();
    await expect(canvas.getByText("vs last quarter")).toBeInTheDocument();
  },
});

export const FlatDelta = meta.story({
  name: "Flat delta",
  args: { label: "Active accounts", value: "1,204", delta: "0%", deltaDir: "flat", deltaTone: "neutral", note: "" },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("1,204")).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "No change" })).toBeInTheDocument();
    await expect(canvas.getByText("0%")).toBeInTheDocument();
  },
});

export const DownDelta = meta.story({
  name: "Down delta",
  args: { label: "Average order", value: "$214", delta: "4%", deltaDir: "down", deltaTone: "error" },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("$214")).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "Down" })).toBeInTheDocument();
  },
});

export const ShareDefaultText = meta.story({
  name: "Share percent",
  args: { label: "Quota attained", value: "$412k", share: 0.82, delta: "", note: "of $500k target" },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("$412k")).toBeInTheDocument();
    await expect(canvas.getByText("82%")).toBeInTheDocument();
  },
});

export const ShareOverflow = meta.story({
  name: "Share over the whole",
  args: { tone: "error", label: "Budget used", value: "$58k", share: 1.16, shareText: "116% of budget", delta: "" },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("$58k")).toBeInTheDocument();
    await expect(canvas.getByText("116% of budget")).toBeInTheDocument();
  },
});

export const MiniShare = meta.story({
  name: "Mini share",
  parameters: { canvas: "column" },
  args: { mini: true, label: "Quota", value: "82%", share: 0.82, delta: "" },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("82%")).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "82%" })).toBeInTheDocument();
  },
});

export const DenseLink = meta.story({
  name: "Dense link",
  args: { size: "sm", href: "#overdue", tone: "error", label: "Overdue invoices", value: "6", note: "", delta: "" },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link");
    await expect(link).toHaveAttribute("href", "#overdue");
    await expect(link).toHaveTextContent("Overdue invoices");
    await expect(await canvas.findByText("6")).toBeInTheDocument();
  },
});

export const Empty = meta.story({
  name: "Empty value",
  args: { label: "Pending", value: "", note: "", delta: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Pending")).toBeInTheDocument();
    await expect(canvas.queryByRole("img")).toBeNull();
  },
});

export const Surfaces = meta.story({
  name: "Surfaces",
  parameters: { docs: { description: { story: "A figure given as text counts up from the last value it showed." } } },
  render: () => html`
    <ui-stat label="Revenue" value="$184,200" note="This quarter"></ui-stat>
    <ui-stat outlined label="Revenue" value="$184,200" note="This quarter"></ui-stat>
    <ui-stat main label="Revenue" value="$184,200" note="This quarter"></ui-stat>
  `,
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { docs: { description: { story: "Size sm is a dense single row with the value at the end." } } },
  render: () => html`
    <ui-stat size="sm" label="Open orders" value="148" note="12 due today"></ui-stat>
    <ui-stat size="md" label="Open orders" value="148" note="12 due today"></ui-stat>
    <ui-stat size="lg" label="Open orders" value="148" note="12 due today"></ui-stat>
  `,
});

export const Tones = meta.story({
  name: "Tones",
  render: () => html`
    <ui-stat label="Invoices sent" value="248"></ui-stat>
    <ui-stat tone="primary" label="Pipeline" value="$412k"></ui-stat>
    <ui-stat tone="info" label="Scheduled" value="36"></ui-stat>
    <ui-stat tone="success" label="Paid" value="$162k"></ui-stat>
    <ui-stat tone="warning" label="Due soon" value="$23.9k"></ui-stat>
    <ui-stat tone="error" label="Overdue" value="$4.2k"></ui-stat>
  `,
});

export const Deltas = meta.story({
  name: "Deltas",
  parameters: {
    docs: {
      description: {
        story: "The arrow is named up, down or unchanged for screen readers; the tone says whether the change is good.",
      },
    },
  },
  render: () => html`
    <ui-stat
      label="Revenue"
      value="$184,200"
      delta="12%"
      delta-dir="up"
      delta-tone="success"
      note="vs last quarter"
    ></ui-stat>
    <ui-stat
      label="Refunds"
      value="$3,120"
      delta="8%"
      delta-dir="down"
      delta-tone="success"
      note="vs last quarter"
    ></ui-stat>
    <ui-stat
      label="Average order"
      value="$214"
      delta="4%"
      delta-dir="down"
      delta-tone="error"
      note="vs last quarter"
    ></ui-stat>
    <ui-stat label="Days to pay" value="27" delta="6 days" delta-dir="up" delta-tone="warning"></ui-stat>
    <ui-stat label="Active accounts" value="1,204" delta="0%" delta-dir="flat"></ui-stat>
  `,
});

export const ShareOfAWhole = meta.story({
  name: "Share of a whole",
  render: () => html`
    <ui-stat label="Quota attained" value="$412k" share="0.82" note="of $500k target"></ui-stat>
    <ui-stat tone="success" label="Invoices collected" value="112" share="0.93" share-text="112 of 120"></ui-stat>
    <ui-stat tone="error" label="Budget used" value="$58k" share="1.16" share-text="116% of budget"></ui-stat>
  `,
});

export const Trend = meta.story({
  name: "Trend",
  parameters: { docs: { description: { story: "A spark chart in the trend slot sits beside the figure." } } },
  render: () => html`
    <ui-stat label="Monthly revenue" value="$77,000" delta="8%" delta-tone="success" note="vs last month">
      <ui-chart slot="trend" kind="spark" label="Revenue rising over 12 months" .series=${rising}></ui-chart>
    </ui-stat>
    <ui-stat size="sm" label="Churned accounts" value="12" note="Falling for 12 months">
      <ui-chart slot="trend" kind="spark" label="Churn falling over 12 months" .series=${falling}></ui-chart>
    </ui-stat>
  `,
});

export const Mini = meta.story({
  name: "Mini",
  parameters: {
    docs: {
      description: {
        story:
          "A mini stat shows one picture: the trend if slotted, else the share, else the delta, and drops it when narrower than 7rem.",
      },
    },
  },
  render: () => html`
    <ui-stat mini label="Revenue" value="$184k">
      <ui-chart slot="trend" kind="spark" label="Revenue rising" .series=${rising}></ui-chart>
    </ui-stat>
    <ui-stat mini label="Quota" value="82%" share="0.82"></ui-stat>
    <ui-stat mini tone="success" label="Paid" value="$162k" delta="12%" delta-tone="success"></ui-stat>
    <ui-stat mini outlined label="Open orders" value="148"></ui-stat>
    <ui-stat mini main label="Overdue" tone="error" value="$4.2k" delta="2" delta-dir="up" delta-tone="error"></ui-stat>
  `,
});

export const Links = meta.story({
  name: "Links",
  parameters: { docs: { description: { story: "With an href the whole card is a link and shows an arrow." } } },
  render: () => html`
    <ui-stat href="#orders" label="Open orders" value="148" note="View all orders"></ui-stat>
    <ui-stat href="#overdue" size="sm" tone="error" label="Overdue invoices" value="6"></ui-stat>
    <ui-stat href="#quota" mini label="Quota" value="82%" share="0.82"></ui-stat>
  `,
});

export const LongLabel = meta.story({
  name: "Long label",
  render: () => html`
    <ui-stat
      label="Average number of days between invoice issue and payment for wholesale accounts"
      value="27 days"
      note="Rolling twelve months across all regions and payment methods"
    ></ui-stat>
  `,
});

const settled = (el: UiStat) =>
  waitFor(async () => {
    await expect(el.getAnimations()).toHaveLength(0);
    await expect(el).toHaveTextContent(el.getAttribute("value")!);
  });

export const DenseSurfaces = meta.story({
  name: "Dense surfaces",
  parameters: { docs: { description: { story: "A dense stat takes the main, outlined and fill surfaces too." } } },
  render: () => html`
    <ui-stat size="sm" main label="Open orders" value="148" note="12 due today"></ui-stat>
    <ui-stat size="sm" outlined label="Backorders" value="9"></ui-stat>
    <ui-stat size="sm" fill href="#returns" label="Returns" value="4"></ui-stat>
  `,
  play: async ({ canvas, canvasElement }) => {
    const [main, outlined, filled] = [...canvasElement.querySelectorAll("ui-stat")];
    await settled(main!);
    await expect(main!.firstElementChild).toHaveAttribute("data-surface", "tinted");
    await expect(main).toHaveTextContent("148");
    await expect(main).toHaveTextContent("12 due today");
    await expect(outlined!.firstElementChild).not.toHaveAttribute("data-surface");
    const link = canvas.getByRole("link", { name: /Returns/ });
    await expect(link).toHaveAttribute("href", "#returns");
    await expect(link).toHaveAttribute("data-tile-lift");
    await settled(filled!);
    await expect(link).toHaveTextContent("4");
  },
});

export const FillTrend = meta.story({
  name: "Fill trend",
  parameters: { docs: { description: { story: "With fill the trend becomes a band under the figure." } } },
  render: () => html`
    <ui-stat fill href="#revenue" label="Monthly revenue" value="$77,000" note="vs last month">
      <ui-chart slot="trend" kind="spark" label="Revenue rising over 12 months" .series=${rising}></ui-chart>
    </ui-stat>
  `,
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole("link", { name: /Monthly revenue/ });
    await expect(link).toHaveAttribute("data-tile-lift");
    const chart = canvasElement.querySelector("ui-chart")!;
    const body = link.firstElementChild!;
    await expect(chart.parentElement).toBe(body.lastElementChild);
    await expect(body.querySelector("p + div")!.children).toHaveLength(1);
    await expect(await canvas.findByText("$77,000")).toBeInTheDocument();
  },
});

export const ReducedMotion = meta.story({
  name: "Reduced motion",
  args: { value: "$1,000", delta: "", note: "" },
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector("ui-stat")!;
    await settled(el);
    await expect(canvas.getByText("$1,000")).toBeInTheDocument();
    el.value = "$1,000.00";
    await el.updateComplete;
    await expect(el.getAnimations()).toHaveLength(0);
    await expect(canvas.getByText("$1,000.00")).toBeInTheDocument();
    const real = window.matchMedia;
    window.matchMedia = (query: string) => {
      const list = real.call(window, query);
      if (query.includes("reduced-motion")) Object.defineProperty(list, "matches", { value: true });
      return list;
    };
    try {
      el.value = "$2,500";
      await el.updateComplete;
      await expect(el.getAnimations()).toHaveLength(0);
      await expect(canvas.getByText("$2,500")).toBeInTheDocument();
    } finally {
      window.matchMedia = real;
    }
  },
});

export const MiniSettled = meta.story({
  name: "Mini settled",
  parameters: { docs: { description: { story: "A mini stat with a rich label leaves the title off." } } },
  render: () => html`
    <ui-stat mini .label=${html`<strong>Quota</strong>`} value="82%" share="0.82"></ui-stat>
    <ui-stat mini size="sm" label="Open orders" value="148"></ui-stat>
  `,
  play: async ({ canvas, canvasElement }) => {
    const [rich, plain] = [...canvasElement.querySelectorAll("ui-stat")];
    await settled(rich!);
    await settled(plain!);
    const label = canvas.getByText("Quota").closest("p")!;
    await expect(label).not.toHaveAttribute("title");
    await expect(canvas.getByText("Open orders")).toHaveAttribute("title", "Open orders");
    await expect(canvas.getByText("82%")).toBeInTheDocument();
    await expect(canvas.getByText("148")).toBeInTheDocument();
  },
});
