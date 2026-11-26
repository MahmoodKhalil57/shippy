import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, within } from "storybook/test";
import "./document.ts";
import type { DocumentSpec } from "../../../lib/base/document-spec.ts";

const invoice: DocumentSpec = {
  notices: [
    { tone: "warning", text: "Payment is overdue by 12 days." },
    { tone: "info", text: "Prices include sales tax." },
  ],
  issuer: { name: "Office Supply Store", tagline: "Office equipment and services" },
  title: "Invoice",
  meta: [{ text: "No. 2048", accent: true }, { text: "Issued 3 March 2026" }],
  party: {
    title: "Bill to",
    rows: [
      { label: "Customer", value: "Jordan Lee" },
      { label: "Address", value: "12 Harbour Road, Springfield" },
    ],
  },
  intro: "Thank you for your order. Details are listed below.",
  columns: [
    { key: "item", label: "Item" },
    { key: "sku", label: "Code", upper: true },
    { key: "amount", label: "Amount", ltr: true },
  ],
  lines: [
    { item: "Standing desk", sku: "dsk-200", amount: "$640.00" },
    { item: "Desk lamp", sku: "lmp-031", amount: "$48.00" },
  ],
  adjustments: [
    { label: "Subtotal", value: "$688.00" },
    { label: "Discount", value: "-$38.00" },
  ],
  total: { label: "Total due", value: "$650.00" },
  totalNote: "Due within 30 days of issue.",
  notes: {
    title: "Terms",
    items: ["Goods remain our property until paid in full.", "Returns are accepted within 14 days."],
    closing: "We appreciate your business.",
  },
  footer: { start: "Page 1 of 1", end: "Accounts team" },
  contact: ["accounts@example.com", "+1 555 0100"],
};

const minimal: DocumentSpec = {
  issuer: { name: "Corner Cafe" },
  title: "Receipt",
  meta: [{ text: "No. 17" }],
  columns: [{ key: "item", label: "Item" }],
  lines: [{ item: "Coffee beans" }],
};

const samples = {
  invoice,
  minimal,
  rtl: {
    ...minimal,
    lang: "ar",
    dir: "rtl",
    issuer: { name: "متجر المدينة" },
    title: "إيصال",
    meta: [{ text: "رقم ١٧" }],
    columns: [{ key: "item", label: "الصنف" }],
    lines: [{ item: "قهوة" }],
  } satisfies DocumentSpec,
  adjustmentsOnly: {
    ...minimal,
    adjustments: [{ label: "Shipping", value: "$5.00" }],
    notes: { items: ["Keep this receipt for your records."] },
    footer: {},
    contact: [],
  } satisfies DocumentSpec,
  totalOnly: { ...minimal, total: { label: "Total", value: "$12.00" } } satisfies DocumentSpec,
};

const meta = preview.type<{ args: { doc?: DocumentSpec } }>().meta({
  title: "Composed/Data/Document",
  component: "ui-document",
  args: { doc: invoice },
  argTypes: { doc: { control: "object", description: "The document to print: issuer, lines, totals and notes." } },
  render: (args) => html`<ui-document .doc=${args.doc}></ui-document>`,
});

const box = (root: HTMLElement) => root.querySelector("ui-document ui-box")!;

export const Playground = meta.story({
  name: "Playground",
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByRole("heading", { name: "Office Supply Store" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Invoice" })).toBeVisible();
    await expect(box(canvasElement)).toHaveAttribute("lang", "en");
    await expect(box(canvasElement)).toHaveAttribute("dir", "ltr");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Payment is overdue by 12 days.");
    await expect(canvas.getByRole("status")).toHaveTextContent("Prices include sales tax.");
    await expect(canvas.getByText("Office equipment and services")).toBeVisible();
    await expect(canvas.getByText("No. 2048").closest("ui-text")?.color).toBe("primary");
    await expect(canvas.getByText("Issued 3 March 2026").closest("ui-text")?.color).toBeUndefined();
    await expect(canvas.getByText("Bill to")).toBeVisible();
    const terms = canvas.getAllByRole("term");
    await expect(terms.map((t) => t.textContent?.trim())).toEqual(["Customer", "Address"]);
    await expect(canvas.getAllByRole("definition")[0]).toHaveTextContent("Jordan Lee");
    await expect(canvas.getByText("Thank you for your order. Details are listed below.")).toBeVisible();
    const lines = canvas.getByRole("table");
    const lineRows = within(lines).getAllByRole("row");
    await expect(lineRows).toHaveLength(3);
    await expect(within(lineRows[0]!).getByText("Code")).toBeVisible();
    await expect(within(lines).getByText("dsk-200").closest("ui-text")).toHaveAttribute("uppercase");
    await expect(within(lines).getByText("$640.00").closest("ui-text")).toHaveAttribute("dir", "ltr");
    await expect(within(lines).getByText("Standing desk").closest("ui-text")).toBeNull();
    await expect(canvas.getByText("Subtotal")).toBeVisible();
    await expect(canvas.getByText("-$38.00")).toBeVisible();
    await expect(canvas.getByText("Total due")).toBeVisible();
    await expect(canvas.getByText("$650.00")).toBeVisible();
    await expect(canvas.getByText("Due within 30 days of issue.")).toBeVisible();
    await expect(canvas.getByText("Terms")).toBeVisible();
    await expect(canvas.getByText("Returns are accepted within 14 days.")).toBeVisible();
    await expect(canvas.getByText("We appreciate your business.")).toBeVisible();
    await expect(canvas.getByText("Page 1 of 1")).toBeVisible();
    await expect(canvas.getByText("Accounts team")).toBeVisible();
    await expect(canvas.getByText("accounts@example.com").closest("ui-text")).toHaveAttribute("dir", "ltr");
    await expect(canvas.getByText("+1 555 0100")).toBeVisible();
  },
});

export const Minimal = meta.story({
  name: "Minimal",
  args: { doc: samples.minimal },
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByRole("heading", { name: "Corner Cafe" })).toBeVisible();
    await expect(canvas.getByText("Coffee beans")).toBeVisible();
    await expect(canvas.getAllByRole("table")).toHaveLength(1);
    await expect(canvas.queryByRole("term")).toBeNull();
    await expect(canvas.queryByRole("alert")).toBeNull();
    await expect(canvas.queryByRole("list")).toBeNull();
    await expect(canvasElement.querySelectorAll("ui-document ui-box")).toHaveLength(1);
  },
});

export const RightToLeft = meta.story({
  name: "Right to left",
  args: { doc: samples.rtl },
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByRole("heading", { name: "إيصال" })).toBeVisible();
    await expect(box(canvasElement)).toHaveAttribute("lang", "ar");
    await expect(box(canvasElement)).toHaveAttribute("dir", "rtl");
  },
});

export const AdjustmentsWithoutTotal = meta.story({
  name: "Adjustments without total",
  args: { doc: samples.adjustmentsOnly },
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByText("Shipping")).toBeVisible();
    await expect(canvas.getByText("$5.00")).toBeVisible();
    await expect(canvas.getByRole("listitem")).toHaveTextContent("Keep this receipt for your records.");
    await expect(canvasElement.querySelectorAll("ui-document ui-box")).toHaveLength(1);
    const footer = canvasElement.querySelectorAll("ui-document ui-text[italic]");
    await expect(footer).toHaveLength(1);
    await expect(footer[0]).toHaveTextContent("");
  },
});

export const TotalOnly = meta.story({
  name: "Total only",
  args: { doc: samples.totalOnly },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("Total")).toBeVisible();
    await expect(canvas.getByText("$12.00")).toBeVisible();
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { doc: undefined },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector("ui-document")!;
    await expect(el).toBeInTheDocument();
    await expect(el.childElementCount).toBe(0);
  },
});
