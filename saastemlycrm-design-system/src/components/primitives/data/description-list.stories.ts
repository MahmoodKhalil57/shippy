import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./description-list.ts";
import type { DescriptionItem } from "./description-list.ts";

const invoice: DescriptionItem[] = [
  { label: "Invoice", value: "INV-20418" },
  { label: "Issued", value: "3 March 2026" },
  { label: "Due", value: "2 April 2026", note: "Net 30" },
  { label: "Billing contact", value: "accounts@example.com" },
  { label: "Payment method", value: "Bank transfer" },
  { label: "Currency", value: "USD" },
];

const totals: DescriptionItem[] = [
  { label: "Revenue", value: "$184,200", note: "+12% on last quarter", noteTone: "success" },
  { label: "Outstanding", value: "$23,950", tone: "warning", note: "6 invoices" },
  { label: "Overdue", value: "$4,180", tone: "error", note: "2 invoices over 60 days", noteTone: "error" },
  { label: "Refunded", value: "$0", tone: "success" },
];

const long: DescriptionItem[] = [
  { label: "Shipping address", value: "Unit 14, 2200 Industrial Parkway, Building C, Loading Dock 3" },
  { label: "Reference", value: "PO-2026-000184-WAREHOUSE-EAST-REPLENISHMENT" },
  { label: "Notes", value: html`Deliver between <strong>8 and 11 am</strong>; call on arrival.` },
];

const meta = preview.meta({
  title: "Primitives/Data/Description list",
  component: "ui-description-list",
  parameters: { canvas: "column" },
  args: {
    items: totals,
    layout: "stacked",
    size: "md",
  },
  argTypes: {
    items: { control: "object" },
    layout: { control: "inline-radio", options: ["stacked", "inline"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: (args) => html`
    <ui-description-list
      .items=${args.items}
      layout=${ifDefined(args.layout)}
      size=${ifDefined(args.size)}
    ></ui-description-list>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the list; edit items to change the rows." } } },
  play: async ({ canvas }) => {
    const terms = canvas.getAllByRole("term");
    await expect(terms).toHaveLength(4);
    await expect(terms[0]).toHaveTextContent("Revenue");
    const values = canvas.getAllByRole("definition");
    await expect(values[0]).toHaveTextContent("$184,200");
    await expect(values[0]).toHaveTextContent("+12% on last quarter");
    await expect(values[3]).toHaveTextContent("$0");
  },
});

export const EmptyList = meta.story({
  name: "Empty",
  args: { items: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("term")).toHaveLength(0);
  },
});

export const InlineArgs = meta.story({
  name: "Inline invoice",
  args: { items: invoice, layout: "inline", size: "sm" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("term")).toHaveLength(6);
    await expect(canvas.getByText("Net 30")).toBeVisible();
  },
});

export const Stacked = meta.story({
  name: "Stacked",
  parameters: {
    docs: { description: { story: "Stacked items fill as many columns as the width allows." } },
    canvas: "column",
  },
  render: () => html`<ui-description-list .items=${invoice}></ui-description-list>`,
});

export const Inline = meta.story({
  name: "Inline",
  parameters: {
    docs: { description: { story: "Inline puts each label beside its value once the list is at least 24rem wide." } },
    canvas: "column",
  },
  render: () => html`<ui-description-list layout="inline" .items=${invoice}></ui-description-list>`,
});

export const Sizes = meta.story({
  name: "Sizes",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-description-list size="sm" .items=${totals.slice(0, 2)}></ui-description-list>
    <ui-description-list size="md" .items=${totals.slice(0, 2)}></ui-description-list>
    <ui-description-list size="lg" .items=${totals.slice(0, 2)}></ui-description-list>
  `,
});

export const TonesAndNotes = meta.story({
  name: "Tones and notes",
  parameters: { canvas: "column" },
  render: () => html`<ui-description-list size="lg" .items=${totals}></ui-description-list>`,
});

export const LongValues = meta.story({
  name: "Long values",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-description-list .items=${long}></ui-description-list>
    <ui-description-list layout="inline" .items=${long}></ui-description-list>
  `,
});
