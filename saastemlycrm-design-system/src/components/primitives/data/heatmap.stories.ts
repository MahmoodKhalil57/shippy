import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./heatmap.ts";
import type { HeatmapCell } from "./heatmap.ts";

const day = new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

const weeks = (count: number, value: (week: number, weekday: number) => number, unit: string): HeatmapCell[] =>
  Array.from({ length: count * 7 }, (_, i) => {
    const week = Math.floor(i / 7);
    const weekday = i % 7;
    const v = Math.max(0, Math.round(value(week, weekday)));
    return {
      label: day.format(Date.UTC(2026, 0, 4 + i)),
      value: v,
      valueText: `${v} ${unit}`,
    };
  });

const orders = weeks(
  16,
  (w, d) => (d === 0 || d === 6 ? 2 + ((w * 3 + d) % 4) : 10 + w * 1.5 + ((w * 7 + d * 5) % 9)),
  "orders",
);

const sparse = weeks(8, (w, d) => ((w * 5 + d * 3) % 11 === 0 ? 3 + (d % 3) : 0), "returns");

const short = weeks(3, (w, d) => w * 7 + d + 1, "orders");

const meta = preview.meta({
  title: "Primitives/Data/Heatmap",
  component: "ui-heatmap",
  args: {
    label: "Orders per day",
    summary: "Orders over 3 weeks",
    cells: short,
  },
  argTypes: {
    label: { control: "text" },
    summary: { control: "text" },
    cells: { control: "object" },
  },
  render: (args) => html`
    <ui-heatmap label=${ifDefined(args.label)} summary=${ifDefined(args.summary)} .cells=${args.cells}></ui-heatmap>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the heatmap; the keyboard moves a day or a week." } },
    canvas: "column",
  },
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("img", { name: "Orders per day" });
    await expect(canvas.getByText("Orders over 3 weeks")).toBeInTheDocument();
    grid.focus();
    await expect(grid).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByText("Sun, Jan 4 · 1 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByText("Mon, Jan 5 · 2 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByText("Mon, Jan 12 · 9 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByText("Mon, Jan 5 · 2 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await expect(canvas.getByText("Sun, Jan 4 · 1 orders")).toBeInTheDocument();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByText("Sat, Jan 24 · 21 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByText("Sat, Jan 24 · 21 orders")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByText("Orders over 3 weeks")).toBeInTheDocument();
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { cells: [], label: "", summary: "No data yet" },
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("img", { name: "Heatmap" });
    grid.focus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByText("No data yet")).toBeInTheDocument();
  },
});

export const SingleDay = meta.story({
  name: "Single day",
  args: { cells: [{ label: "Mon, Jan 5", value: 7 }], summary: "One day" },
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole("img", { name: "Orders per day" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByText("Mon, Jan 5 · 7")).toBeInTheDocument();
  },
});

export const DailyOrders = meta.story({
  name: "Daily orders",
  parameters: {
    docs: {
      description: {
        story:
          "Columns are weeks and rows are weekdays; arrow keys move a day or a week, and the caption reads the focused day.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-heatmap
      label="Orders per day"
      summary=${`${orders.reduce((t, c) => t + c.value, 0).toLocaleString("en")} orders in 16 weeks`}
      .cells=${orders}
    ></ui-heatmap>
  `,
});

export const SparseActivity = meta.story({
  name: "Sparse activity",
  parameters: {
    docs: { description: { story: "Days with nothing stay at the lowest level; shading scales to the busiest day." } },
    canvas: "column",
  },
  render: () => html`
    <ui-heatmap label="Returns per day" summary="Returns over 8 weeks" .cells=${sparse}></ui-heatmap>
  `,
});

export const AllQuiet = meta.story({
  name: "All quiet",
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Refunds per day" })).toBeInTheDocument();
    await expect(canvas.getByText("No refunds in 4 weeks")).toBeInTheDocument();
  },
  render: () => html`
    <ui-heatmap
      label="Refunds per day"
      summary="No refunds in 4 weeks"
      .cells=${weeks(4, () => 0, "refunds")}
    ></ui-heatmap>
  `,
});

export const RightToLeft = meta.story({
  name: "Right to left",
  parameters: {
    docs: { description: { story: "In a right-to-left page the arrow keys follow the mirrored weeks." } },
    canvas: "column",
  },
  render: () => html`
    <div dir="rtl">
      <ui-heatmap label="Orders per day" summary="Orders over 3 weeks" .cells=${short}></ui-heatmap>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("img", { name: "Orders per day" });
    grid.focus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByText("Sun, Jan 4 · 1 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByText("Sun, Jan 11 · 8 orders")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByText("Sun, Jan 4 · 1 orders")).toBeInTheDocument();
    await userEvent.keyboard("{Enter}a");
    await expect(canvas.getByText("Sun, Jan 4 · 1 orders")).toBeInTheDocument();
  },
});

export const PointerHover = meta.story({
  name: "Pointer hover",
  parameters: { canvas: "column" },
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("img", { name: "Orders per day" });
    const cells = grid.querySelectorAll("span");
    await userEvent.hover(cells[9]!);
    await expect(canvas.getByText("Tue, Jan 13 · 10 orders")).toBeInTheDocument();
    await expect(cells[9]!.className).not.toBe(cells[8]!.className);
    await userEvent.unhover(grid);
    await expect(canvas.getByText("Orders over 3 weeks")).toBeInTheDocument();
  },
});
