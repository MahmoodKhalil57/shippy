import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn } from "storybook/test";
import "./whatif.ts";
import type { WhatifInput, WhatifOutput } from "./whatif.ts";

const money = new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pct = (n: number) => `${n}%`;

const pricing: WhatifInput[] = [
  { key: "price", label: "Unit price", min: 20, max: 80, step: 1, value: 45, format: (n) => money.format(n) },
  { key: "units", label: "Units per month", min: 100, max: 2000, step: 50, value: 800 },
  { key: "discount", label: "Average discount", min: 0, max: 30, step: 1, value: 10, format: pct },
];

const unitCost = 22;
const fixedCosts = 12000;

const priceModel = (v: Record<string, number>): WhatifOutput[] => {
  const price = v.price ?? 0;
  const units = v.units ?? 0;
  const net = price * (1 - (v.discount ?? 0) / 100);
  const revenue = net * units;
  const profit = revenue - unitCost * units - fixedCosts;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  return [
    { label: "Revenue", value: money.format(revenue), note: "per month" },
    {
      label: "Profit",
      value: money.format(profit),
      tone: profit < 0 ? "error" : profit < 5000 ? "warning" : "success",
      note: profit < 0 ? "below break-even" : "after fixed costs",
    },
    { label: "Margin", value: `${margin.toFixed(1)}%`, tone: margin < 0 ? "error" : undefined },
  ];
};

const hiring: WhatifInput[] = [
  { key: "reps", label: "Sales reps", min: 1, max: 20, step: 1, value: 6 },
  {
    key: "quota",
    label: "Quota per rep",
    min: 50000,
    max: 300000,
    step: 10000,
    value: 150000,
    format: (n) => money.format(n),
  },
  { key: "attain", label: "Attainment", min: 40, max: 120, step: 5, value: 85, format: pct },
];

const hiringModel = (v: Record<string, number>): WhatifOutput[] => {
  const bookings = (v.reps ?? 0) * (v.quota ?? 0) * ((v.attain ?? 0) / 100);
  return [
    {
      label: "Bookings",
      value: money.format(bookings),
      tone: bookings >= 1000000 ? "success" : undefined,
      note: bookings >= 1000000 ? "meets the yearly plan" : "below the $1M plan",
    },
  ];
};

const meta = preview.type<{ args: { onChange: (e: CustomEvent) => void } }>().meta({
  title: "Primitives/Data/What-if",
  component: "ui-whatif",
  parameters: { canvas: "column" },
  args: {
    inputs: pricing,
    compute: priceModel,
    label: "Pricing model",
    onChange: fn(),
  },
  argTypes: {
    inputs: { control: "object" },
    compute: { control: false },
    label: { control: "text" },
    onChange: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-whatif
      .inputs=${args.inputs}
      .compute=${args.compute}
      label=${ifDefined(args.label)}
      @ui-whatif-change=${args.onChange}
    ></ui-whatif>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Every control drives the model; moving a slider recomputes the outputs and Reset restores them.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("group", { name: "Pricing model" })).toBeInTheDocument();
    const price = canvas.getByRole("slider", { name: "Unit price" });
    await expect(price).toHaveValue("45");
    await expect(price).toHaveAttribute("aria-valuetext", "$45");
    await expect(canvas.getByText("$32,400")).toBeInTheDocument();
    await expect(canvas.getByText("$2,800")).toBeInTheDocument();
    await expect(canvas.getByText("8.6%")).toBeInTheDocument();
    const reset = canvas.getByRole("button", { name: "Reset" });
    await expect(reset).toBeDisabled();
    await fireEvent.input(price, { target: { value: "46" } });
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { values: { price: 46, units: 800, discount: 10 } } }),
    );
    await expect(await canvas.findByText("$33,120")).toBeInTheDocument();
    await expect(price).toHaveAttribute("aria-valuetext", "$46");
    await expect(reset).toBeEnabled();
    const discount = canvas.getByRole("slider", { name: "Average discount" });
    await fireEvent.input(discount, { target: { value: "0" } });
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { values: { price: 46, units: 800, discount: 0 } } }),
    );
    await expect(await canvas.findByText("$36,800")).toBeInTheDocument();
    await expect(discount).toHaveAttribute("aria-valuetext", "0%");
    await userEvent.click(reset);
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { values: { price: 45, units: 800, discount: 10 } } }),
    );
    await expect(await canvas.findByText("$32,400")).toBeInTheDocument();
    await expect(price).toHaveValue("45");
    await expect(reset).toBeDisabled();
  },
});

export const LossArgs = meta.story({
  name: "At a loss",
  args: { inputs: pricing.map((i) => (i.key === "units" ? { ...i, value: 200 } : i)), label: "Low volume" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("slider", { name: "Units per month" })).toHaveAttribute("aria-valuetext", "200");
    await expect(canvas.getByText("below break-even")).toBeInTheDocument();
    await expect(canvas.getByText("-$8,300")).toBeInTheDocument();
  },
});

export const HiringArgs = meta.story({
  name: "Hiring model",
  args: { inputs: hiring, compute: hiringModel, label: "Sales capacity" },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText("$765,000")).toBeInTheDocument();
    await expect(canvas.getByText("below the $1M plan")).toBeInTheDocument();
    await fireEvent.input(canvas.getByRole("slider", { name: "Sales reps" }), { target: { value: "8" } });
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(await canvas.findByText("$1,020,000")).toBeInTheDocument();
    await expect(canvas.getByText("meets the yearly plan")).toBeInTheDocument();
  },
});

export const NoInputs = meta.story({
  name: "No inputs",
  args: { inputs: [], compute: () => [], label: "Empty model" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("slider")).toHaveLength(0);
    await expect(canvas.getByRole("button", { name: "Reset" })).toBeDisabled();
  },
});

export const PricingModel = meta.story({
  name: "Pricing model",
  parameters: {
    docs: {
      description: {
        story:
          "Each slider is labelled and reads its formatted value; changed outputs flash, are announced, and Reset returns to the starting values.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-whatif label="Pricing model" .inputs=${pricing} .compute=${priceModel}></ui-whatif>`,
});

export const SingleOutput = meta.story({
  name: "Single output",
  parameters: { canvas: "column" },
  render: () => html`<ui-whatif label="Sales capacity" .inputs=${hiring} .compute=${hiringModel}></ui-whatif>`,
});

export const StartingAtALoss = meta.story({
  name: "Starting at a loss",
  parameters: {
    docs: { description: { story: "Output tones follow the computed values, so a scenario can open in the red." } },
    canvas: "column",
  },
  render: () => html`
    <ui-whatif
      label="Pricing model, low volume"
      .inputs=${pricing.map((i) => (i.key === "units" ? { ...i, value: 200 } : i))}
      .compute=${priceModel}
    ></ui-whatif>
  `,
});

export const SameShapeInputs = meta.story({
  name: "Same inputs again",
  parameters: {
    docs: { description: { story: "Passing inputs with the same shape keeps the values the user has moved." } },
  },
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector("ui-whatif")!;
    const units = canvas.getByRole("slider", { name: "Units per month" });
    await fireEvent.input(units, { target: { value: "1000" } });
    await expect(await canvas.findByText("$40,500")).toBeInTheDocument();
    el.inputs = pricing.map((i) => ({ ...i }));
    await el.updateComplete;
    await expect(units).toHaveValue("1000");
    await expect(units).toHaveAttribute("aria-valuetext", "1,000");
    await expect(canvas.getByText("$40,500")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Reset" })).toBeEnabled();
  },
});

export const NoModel = meta.story({
  name: "No model",
  render: () => html`<ui-whatif .inputs=${hiring}></ui-whatif>`,
  play: async ({ canvas, canvasElement }) => {
    const group = canvas.getByRole("group");
    await expect(group).not.toHaveAttribute("aria-label");
    await expect(canvas.getAllByRole("slider")).toHaveLength(3);
    await expect(canvasElement.querySelector("[data-output]")).toBeNull();
    await fireEvent.input(canvas.getByRole("slider", { name: "Sales reps" }), { target: { value: "8" } });
    await canvasElement.querySelector("ui-whatif")!.updateComplete;
    await expect(canvas.getByRole("slider", { name: "Sales reps" })).toHaveAttribute("aria-valuetext", "8");
    await expect(canvasElement.querySelector("[data-output]")).toBeNull();
  },
});
