import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./quadrant.ts";
import "../containers/tile.ts";
import { auditLayout } from "../../../lib/base/layout.ts";
import type { QuadrantPoint, UiQuadrant } from "./quadrant.ts";

const accounts: QuadrantPoint[] = [
  { label: "Account 1041", x: 82, y: 24, size: 410 },
  { label: "Account 1052", x: 71, y: 31, size: 260 },
  { label: "Account 1077", x: 64, y: 12, size: 520 },
  { label: "Account 1083", x: 38, y: 28, size: 140 },
  { label: "Account 1090", x: 22, y: 19, size: 90 },
  { label: "Account 1102", x: 45, y: 6, size: 300 },
  { label: "Account 1118", x: 91, y: 8, size: 640 },
  { label: "Account 1124", x: 15, y: 34, size: 60 },
  { label: "Account 1131", x: 56, y: 17, size: 220 },
  { label: "Account 1145", x: 30, y: 9, size: 180 },
];

const products: QuadrantPoint[] = [
  { label: "Desk lamp", x: 1200, y: 42, valueText: "$18k revenue", href: "#lamp" },
  { label: "Office chair", x: 340, y: 58, valueText: "$61k revenue", href: "#chair" },
  { label: "Monitor arm", x: 860, y: 21, valueText: "$9k revenue", href: "#arm" },
  { label: "Standing desk", x: 150, y: 64, valueText: "$72k revenue", href: "#desk" },
  { label: "Cable tray", x: 1500, y: 12, valueText: "$4k revenue", href: "#tray" },
  { label: "Footrest", x: 420, y: 18, valueText: "$5k revenue", href: "#footrest" },
];

const meta = preview.meta({
  title: "Primitives/Data/Quadrant",
  component: "ui-quadrant",
  parameters: { canvas: "column" },
  args: {
    points: products,
    label: "Products by units sold and margin",
    xLabel: "Units sold",
    yLabel: "Margin %",
    xMid: undefined,
    yMid: undefined,
    xDomain: undefined,
    yDomain: undefined,
    quadrants: undefined,
    invertY: false,
  },
  argTypes: {
    points: { control: "object" },
    label: { control: "text" },
    xLabel: { control: "text" },
    yLabel: { control: "text" },
    xMid: { control: { type: "number", step: 1 } },
    yMid: { control: { type: "number", step: 1 } },
    xDomain: { control: "object", description: "Fixed [min, max] for the x axis." },
    yDomain: { control: "object", description: "Fixed [min, max] for the y axis." },
    quadrants: { control: "object", description: "Captions: top start, top end, bottom start, bottom end." },
    invertY: { control: "boolean" },
  },
  render: (args) => html`
    <ui-quadrant
      .points=${args.points}
      label=${ifDefined(args.label)}
      x-label=${ifDefined(args.xLabel)}
      y-label=${ifDefined(args.yLabel)}
      x-mid=${ifDefined(args.xMid)}
      y-mid=${ifDefined(args.yMid)}
      .xDomain=${args.xDomain}
      .yDomain=${args.yDomain}
      .quadrants=${args.quadrants}
      ?invert-y=${args.invertY}
    ></ui-quadrant>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story:
          "Every control drives the quadrant; Left and Right step through points in x order, Up and Down to the next point above or below, Home and End to the ends.",
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole("list", { name: "Products by units sold and margin" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("link")).toHaveLength(6);
    await expect(canvas.getByText("Split at Units sold 640 · Margin % 31.5")).toBeInTheDocument();
    await userEvent.tab();
    const lamp = canvas.getByRole("link", {
      name: "Desk lamp · Units sold 1,200 · Margin % 42 · $18k revenue",
    });
    await expect(lamp).toHaveFocus();
    await expect(lamp).toHaveAttribute("href", "#lamp");
    await expect(
      await canvas.findByText("Desk lamp · Units sold 1,200 · Margin % 42 · $18k revenue"),
    ).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("link", { name: /^Cable tray / })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("link", { name: /^Footrest / })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("link", { name: /^Monitor arm / })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("link", { name: /^Footrest / })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("link", { name: /^Cable tray / })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("link", { name: /^Cable tray / })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByRole("link", { name: /^Standing desk / })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("link", { name: /^Standing desk / })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("link", { name: /^Office chair / })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("link", { name: /^Office chair / })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("link", { name: /^Footrest / })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("link", { name: /^Cable tray / })).toHaveFocus();
    (document.activeElement as HTMLElement).blur();
    await canvasElement.querySelector("ui-quadrant")?.updateComplete;
    await expect(canvas.getByText("Split at Units sold 640 · Margin % 31.5")).toBeInTheDocument();
  },
});

export const InvertedFixedSplit = meta.story({
  name: "Inverted y with a fixed split",
  args: {
    points: accounts.slice(0, 3),
    label: "Accounts by spend and days to pay",
    xLabel: "Spend score",
    yLabel: "Days to pay",
    xMid: 50,
    yMid: 20,
    xDomain: [0, 100],
    yDomain: [0, 40],
    quadrants: ["Fast, small", "Fast, large", "Slow, small", "Slow, large"],
    invertY: true,
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByText("Split at Spend score 50 · Days to pay 20")).toBeInTheDocument();
    const items = canvas.getAllByRole("listitem", { name: /Account/ });
    await expect(items).toHaveLength(3);
    await expect(
      canvas.getByRole("listitem", { name: "Account 1077 · Spend score 64 · Days to pay 12, Fast, large" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("listitem", { name: "Account 1041 · Spend score 82 · Days to pay 24, Slow, large" }),
    ).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole("listitem", { name: /^Account 1041/ })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByRole("listitem", { name: /^Account 1077/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("listitem", { name: /^Account 1041/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("listitem", { name: /^Account 1052/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await expect(canvas.getByRole("listitem", { name: /^Account 1077/ })).toHaveFocus();
    (document.activeElement as HTMLElement).blur();
    await canvasElement.querySelector("ui-quadrant")?.updateComplete;
  },
});

export const SinglePoint = meta.story({
  name: "Single point",
  args: {
    points: [{ label: "Account 1041", x: 82, y: 24 }],
    label: "One account",
    xLabel: "",
    yLabel: "",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("listitem", { name: "Account 1041 · 82 · 24" })).toBeInTheDocument();
    await expect(canvas.getByText("Split at 82 · 24")).toBeInTheDocument();
  },
});

export const NoPoints = meta.story({
  name: "No points",
  args: { points: [], label: "Empty scatter" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("link")).toHaveLength(0);
    await expect(canvas.queryByText(/Split at/)).toBeNull();
  },
});

export const AccountsBySpendAndPaymentTime = meta.story({
  name: "Accounts by spend and payment time",
  parameters: {
    docs: {
      description: {
        story:
          "Points are a list in x order: Tab reaches them, arrow keys step through, and the readout names the focused point and its quadrant.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-quadrant
      label="Accounts by spend and days to pay"
      x-label="Spend score"
      y-label="Days to pay"
      .quadrants=${["Fast, small", "Fast, large", "Slow, small", "Slow, large"]}
      invert-y
      .points=${accounts}
    ></ui-quadrant>
  `,
});

export const FixedSplitAndDomain = meta.story({
  name: "Fixed split and domain",
  parameters: {
    docs: {
      description: {
        story:
          "Without x-mid and y-mid the split falls on the medians; here it is fixed at a score of 50 and 20 days, on fixed axes.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-quadrant
      label="Accounts, fixed split"
      x-label="Spend score"
      y-label="Days to pay"
      x-mid="50"
      y-mid="20"
      .xDomain=${[0, 100] as [number, number]}
      .yDomain=${[0, 40] as [number, number]}
      .quadrants=${["", "High spend, slow", "", ""] as [string, string, string, string]}
      .points=${accounts}
    ></ui-quadrant>
  `,
});

export const LinkedPoints = meta.story({
  name: "Linked points",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-quadrant
      label="Products by units sold and margin"
      x-label="Units sold"
      y-label="Margin %"
      .quadrants=${["Premium", "Stars", "Niche", "Volume"]}
      .points=${products}
    ></ui-quadrant>
  `,
});

export const NoLabels = meta.story({
  name: "No labels",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-quadrant
      label="Unlabelled scatter"
      .points=${accounts.map((p) => ({ label: p.label, x: p.x, y: p.y }))}
    ></ui-quadrant>
  `,
});

export const TiesRightToLeft = meta.story({
  name: "Ties, right to left",
  parameters: {
    docs: {
      description: {
        story: "Points sharing an x are ordered by y and points sharing a height by x; arrows mirror in right-to-left.",
      },
    },
  },
  render: () => html`
    <div dir="rtl">
      <ui-quadrant
        .points=${[
          { label: "North", x: 10, y: 5 },
          { label: "East", x: 10, y: 8 },
          { label: "South", x: 20, y: 5 },
        ]}
      ></ui-quadrant>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    const north = canvas.getByRole("listitem", { name: "North · 10 · 5" });
    const east = canvas.getByRole("listitem", { name: "East · 10 · 8" });
    const south = canvas.getByRole("listitem", { name: "South · 20 · 5" });
    await userEvent.tab();
    await expect(north).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(east).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(north).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(south).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(east).toHaveFocus();
    await userEvent.keyboard("a");
    await expect(east).toHaveFocus();
    await expect(canvas.getByText("East · 10 · 8")).toBeInTheDocument();
    await userEvent.hover(east);
    await expect(canvas.getByText("East · 10 · 8")).toBeInTheDocument();
    await userEvent.hover(south);
    await expect(canvas.getByText("South · 20 · 5")).toBeInTheDocument();
    await userEvent.unhover(canvas.getByRole("list"));
    await expect(canvas.getByText(/^Split at/)).toBeInTheDocument();
  },
});

const words = (n: number) => "$389k across every open stage this quarter ".repeat(3).slice(0, n).trim();

export const LongAxisKeepsTheReadout = meta.story({
  name: "Long axis name keeps the readout readable",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: (args) =>
    html`<ui-tile size="s" heading="Suppliers">
      <ui-quadrant
        .points=${args.points}
        label=${ifDefined(args.label)}
        x-label=${ifDefined(args.xLabel)}
      ></ui-quadrant>
    </ui-tile>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<UiQuadrant>("ui-quadrant")!;
    const squeezed: string[] = [];
    for (let n = 1; n <= 80; n++) {
      el.xLabel = words(n);
      await el.updateComplete;
      squeezed.push(
        ...auditLayout(canvasElement)
          .filter((i) => i.kind === "squeezed")
          .map((i) => `${n}: ${i.detail}`),
      );
    }
    await expect(squeezed).toEqual([]);
  },
});
