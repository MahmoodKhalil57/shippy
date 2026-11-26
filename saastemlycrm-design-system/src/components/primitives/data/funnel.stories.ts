import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./funnel.ts";
import type { FunnelStage, UiFunnel } from "./funnel.ts";

const sales: FunnelStage[] = [
  { label: "Leads", value: 4820, valueText: "4,820" },
  { label: "Qualified", value: 2150, valueText: "2,150" },
  { label: "Proposal", value: 860, valueText: "860" },
  { label: "Negotiation", value: 410, valueText: "410" },
  { label: "Won", value: 236, valueText: "236" },
];

const checkout: FunnelStage[] = [
  { label: "Cart", value: 12400, valueText: "12.4k", href: "#cart" },
  { label: "Shipping", value: 7300, valueText: "7.3k", href: "#shipping" },
  { label: "Payment", value: 5100, valueText: "5.1k", href: "#payment" },
  { label: "Order placed", value: 4620, valueText: "4.6k", href: "#placed" },
];

const meta = preview.meta({
  title: "Primitives/Data/Funnel",
  component: "ui-funnel",
  parameters: { canvas: "column" },
  args: {
    stages: sales,
    label: "Sales pipeline",
    step: "went on" as UiFunnel["step"],
  },
  argTypes: {
    stages: { control: "object" },
    label: { control: "text" },
    step: { control: "text" },
  },
  render: (args) => html`
    <ui-funnel .stages=${args.stages} label=${ifDefined(args.label)} step=${ifDefined(args.step)}></ui-funnel>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "Every control drives the funnel; Tab moves between stages and dims the rest." } },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const list = canvas.getByRole("list", { name: "Sales pipeline" });
    await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
    await expect(canvas.getByText("5% of leads reach won")).toBeVisible();
    await expect(list).toHaveTextContent("45% went on");
    await userEvent.tab();
    const first = canvas.getByText("Leads").closest("[tabindex]");
    await expect(first).toHaveFocus();
    const second = canvas.getByText("Qualified").closest("[tabindex]")!;
    const bar = (stage: Element) => stage.querySelector("[aria-hidden]");
    await expect(bar(second)).toHaveClass("opacity-40");
    await expect(second.className).not.toMatch(/opacity/);
    await userEvent.tab();
    await expect(second).toHaveFocus();
    await expect(bar(second)).not.toHaveClass("opacity-40");
    await expect(bar(first!)).toHaveClass("opacity-40");
    (second as HTMLElement).blur();
    await canvasElement.querySelector("ui-funnel")?.updateComplete;
    await expect(bar(first!)).not.toHaveClass("opacity-40");
    // End with a stage focused, so the accessibility check reads the dimmed stages' contrast.
    await userEvent.click(second);
    await expect(bar(first!)).toHaveClass("opacity-40");
  },
});

export const LinkedArgs = meta.story({
  name: "Links",
  args: { stages: checkout, label: "Checkout", step: "continued" as UiFunnel["step"] },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const cart = canvas.getByRole("link", { name: /Cart/ });
    await expect(cart).toHaveAttribute("href", "#cart");
    await expect(canvas.getByRole("list", { name: "Checkout" })).toHaveTextContent("59% continued");
    await userEvent.tab();
    await expect(cart).toHaveFocus();
    const shipping = canvas.getByRole("link", { name: /Shipping/ });
    await expect(shipping.querySelector("[aria-hidden]")).toHaveClass("opacity-40");
    await expect(shipping.className).not.toMatch(/opacity/);
    cart.blur();
    await canvasElement.querySelector("ui-funnel")?.updateComplete;
    await expect(shipping.querySelector("[aria-hidden]")).not.toHaveClass("opacity-40");
    await userEvent.tab();
    await expect(shipping.querySelector("[aria-hidden]")).toHaveClass("opacity-40");
  },
});

export const SingleStage = meta.story({
  name: "Single stage",
  args: { stages: [{ label: "Sign-ups", value: 940 }], label: "Sign-ups" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.queryByText(/reach/)).toBeNull();
    await expect(canvas.getByText("940")).toBeVisible();
  },
});

export const NoStages = meta.story({
  name: "No stages",
  args: { stages: [], label: "" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
  },
});

export const ZeroFirstStage = meta.story({
  name: "Zero first stage",
  args: {
    stages: [
      { label: "Visits", value: 0 },
      { label: "Orders", value: 0 },
    ],
    label: "Launch day",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "Launch day" })).toHaveTextContent("— went on");
  },
});

export const SalesPipeline = meta.story({
  name: "Sales pipeline",
  parameters: {
    docs: {
      description: {
        story: "The caption gives the overall conversion; each step shows the share that went on from the stage above.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-funnel label="Sales pipeline" .stages=${sales}></ui-funnel>`,
});

export const LinkedStages = meta.story({
  name: "Linked stages",
  parameters: {
    docs: { description: { story: "Stages with an href become links; hovering or focusing one dims the rest." } },
    canvas: "column",
  },
  render: () => html`<ui-funnel label="Checkout" step="continued" .stages=${checkout}></ui-funnel>`,
});

export const ShortAndSingleStage = meta.story({
  name: "Short and single stage",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-funnel
      label="Quotes"
      .stages=${[
        { label: "Quotes sent", value: 320 },
        { label: "Accepted", value: 118 },
      ]}
    ></ui-funnel>
    <ui-funnel label="Sign-ups" .stages=${[{ label: "Sign-ups", value: 940 }]}></ui-funnel>
  `,
});

export const TinyLastStage = meta.story({
  name: "Tiny last stage",
  parameters: {
    docs: { description: { story: "A bar never drops below a sliver, so a stage near zero stays visible." } },
    canvas: "column",
  },
  render: () => html`
    <ui-funnel
      label="Trial conversions"
      .stages=${[
        { label: "Trials started", value: 5000 },
        { label: "Activated", value: 1200 },
        { label: "Paid", value: 14 },
      ]}
    ></ui-funnel>
  `,
});
