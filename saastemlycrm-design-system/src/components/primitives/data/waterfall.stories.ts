import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./waterfall.ts";
import type { WaterfallStep } from "./waterfall.ts";

const money = new Intl.NumberFormat("en", { style: "currency", currency: "USD", notation: "compact" });
const usd = (v: number) => money.format(v);

const profit: WaterfallStep[] = [
  { label: "Revenue", value: 480000 },
  { label: "Cost of goods", value: -212000 },
  { label: "Gross profit", value: 0, total: true },
  { label: "Salaries", value: -118000 },
  { label: "Marketing", value: -36000 },
  { label: "Rent", value: -24000 },
  { label: "Other income", value: 14000 },
  { label: "Net profit", value: 0, total: true },
];

const cash: WaterfallStep[] = [
  { label: "Opening", value: 125000 },
  { label: "Collections", value: 86000 },
  { label: "Payroll", value: -64000 },
  { label: "Suppliers", value: -41000 },
  { label: "Tax", value: -18000 },
  { label: "Closing", value: 0, total: true },
];

const loss: WaterfallStep[] = [
  { label: "Revenue", value: 90000 },
  { label: "Costs", value: -112000 },
  { label: "Refunds", value: -9000 },
  { label: "Grant", value: 6000 },
  { label: "Result", value: 0, total: true },
];

const meta = preview.meta({
  title: "Primitives/Data/Waterfall",
  component: "ui-waterfall",
  parameters: { canvas: "column" },
  args: {
    steps: cash,
    label: "Cash flow",
    format: usd,
    fit: false,
  },
  argTypes: {
    steps: { control: "object" },
    label: { control: "text" },
    format: { control: false },
    fit: { control: "boolean" },
  },
  render: (args) => html`
    <ui-waterfall
      .steps=${args.steps}
      label=${ifDefined(args.label)}
      .format=${args.format}
      ?fit=${args.fit}
    ></ui-waterfall>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the waterfall; arrow keys, Home and End move between columns." },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const plot = canvas.getByRole("list", { name: "Cash flow" });
    await expect(canvas.getAllByRole("listitem")).toHaveLength(6);
    await expect(canvas.getByText("Cash flow · $88K")).toBeInTheDocument();
    await userEvent.tab();
    const opening = canvas.getByRole("listitem", { name: /^Opening: .*\$125K.* → \$125K$/ });
    await expect(opening).toHaveFocus();
    await expect(plot).toContainElement(opening);
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("listitem", { name: /^Collections: .*\+\$86K.* → \$211K$/ })).toHaveFocus();
    await expect(await canvas.findByText(/^Collections: .*\+\$86K.* → \$211K$/)).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("listitem", { name: /^Payroll: .*\$64K.* → \$147K$/ })).toHaveFocus();
    await userEvent.keyboard("{End}");
    const closing = canvas.getByRole("listitem", { name: "Closing: $88K" });
    await expect(closing).toHaveFocus();
    await expect(await canvas.findByText("Closing: $88K")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    await expect(closing).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(opening).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(opening).toHaveFocus();
    opening.blur();
    await canvasElement.querySelector("ui-waterfall")?.updateComplete;
    await expect(canvas.getByText("Cash flow · $88K")).toBeInTheDocument();
  },
});

export const NetLoss = meta.story({
  name: "Net loss",
  args: { steps: loss, label: "Quarter result", fit: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Quarter result · -$25K")).toBeInTheDocument();
    await expect(canvas.getByRole("listitem", { name: "Result: -$25K" })).toBeInTheDocument();
  },
});

export const SingleStep = meta.story({
  name: "Single step",
  args: { steps: [{ label: "Opening", value: 40000 }], label: "Balance" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.getByText("Balance · $40K")).toBeInTheDocument();
  },
});

export const NoSteps = meta.story({
  name: "No steps",
  args: { steps: [], label: "Empty bridge" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
  },
});

export const ProfitBridge = meta.story({
  name: "Profit bridge",
  parameters: {
    docs: {
      description: {
        story:
          "Totals show the running sum so far; each column is focusable, arrow keys move between them and the readout gives the change and the running total.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-waterfall label="Net profit" .format=${usd} .steps=${profit}></ui-waterfall>`,
});

export const CashFlow = meta.story({
  name: "Cash flow",
  parameters: { canvas: "column" },
  render: () => html`<ui-waterfall label="Cash in March" .format=${usd} .steps=${cash}></ui-waterfall>`,
});

export const FitToTheChanges = meta.story({
  name: "Fit to the changes",
  parameters: {
    docs: {
      description: {
        story:
          "fit crops the axis around the running totals, so small changes read clearly; the dashed baseline marks the cut.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-waterfall label="Cash in March" fit .format=${usd} .steps=${cash}></ui-waterfall>`,
});

export const BelowZero = meta.story({
  name: "Below zero",
  parameters: {
    docs: {
      description: {
        story: "When the running total goes negative the baseline moves up and later columns hang below it.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-waterfall label="Quarter result" .format=${usd} .steps=${loss}></ui-waterfall>`,
});

export const OnlyIncreases = meta.story({
  name: "Only increases",
  parameters: { docs: { description: { story: "The key lists only the kinds of column present." } }, canvas: "column" },
  render: () => html`
    <ui-waterfall
      label="New customers by channel"
      .steps=${[
        { label: "Direct", value: 120 },
        { label: "Partners", value: 64 },
        { label: "Online", value: 41 },
        { label: "Events", value: 18 },
      ]}
    ></ui-waterfall>
  `,
});

export const RightToLeftPointer = meta.story({
  name: "Right to left with a pointer",
  parameters: {
    docs: { description: { story: "Arrow keys follow the mirrored columns; pointing at a column reads it." } },
  },
  render: () => html`
    <div dir="rtl">
      <ui-waterfall .steps=${loss} .format=${usd}></ui-waterfall>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    await expect(canvas.getByText("-$25K")).toBeInTheDocument();
    const revenue = canvas.getByRole("listitem", { name: /^Revenue: / });
    const costs = canvas.getByRole("listitem", { name: /^Costs: / });
    revenue.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(costs).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(revenue).toHaveFocus();
    await userEvent.keyboard("a");
    await expect(revenue).toHaveFocus();
    await userEvent.hover(revenue);
    await expect(canvas.getByText(/^Revenue: .*\+\$90K.* → \$90K$/)).toBeInTheDocument();
    await userEvent.hover(costs);
    await expect(await canvas.findByText(/^Costs: .*\$112K.* → -\$22K$/)).toBeInTheDocument();
    await userEvent.unhover(canvas.getByRole("list"));
    await expect(await canvas.findByText("-$25K")).toBeInTheDocument();
  },
});
