import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./record.ts";
import "../actions/button.ts";
import type { RecordFact, RecordItem, RecordLink } from "./record.ts";

const customers: RecordItem[] = [
  {
    key: "c1",
    title: "Office supplies distributor",
    eyebrow: "Customer · Wholesale",
    supporting: "Account 1041, 3 sites",
    status: { label: "Active", tone: "success" },
    figure: { label: "Revenue this year", value: "$184,200" },
    facts: [
      { label: "Open orders", value: "12" },
      { label: "Terms", value: "Net 30" },
    ],
    person: "Account Owner",
    href: "#c1",
  },
  {
    key: "c2",
    title: "Regional freight carrier",
    eyebrow: "Customer · Freight",
    supporting: "Account 1052",
    status: { label: "Overdue", tone: "error" },
    figure: { label: "Outstanding", value: "$4,180" },
    facts: [
      { label: "Invoices", value: "2 over 60 days" },
      { label: "Terms", value: "Net 45" },
    ],
    person: "Credit Team",
    href: "#c2",
  },
  {
    key: "c3",
    title: "Medical clinic group",
    eyebrow: "Prospect",
    supporting: "8 clinics",
    status: { label: "Proposal", tone: "info" },
    figure: { label: "Deal value", value: "$62,000" },
    progress: 0.6,
    person: "Sales Desk",
    href: "#c3",
  },
  {
    key: "c4",
    title: "Hardware retailer",
    eyebrow: "Customer · Retail",
    status: { label: "On hold", tone: "warning" },
    facts: [{ label: "Reason", value: "Awaiting credit review" }],
  },
];

const projects: RecordItem[] = [
  {
    key: "p1",
    title: "Warehouse migration",
    eyebrow: "Project",
    supporting: "Move stock to the central hub",
    status: { label: "On track", tone: "success" },
    figure: { label: "Budget", value: "$48k" },
    progress: 0.72,
    person: "Operations",
    href: "#p1",
  },
  {
    key: "p2",
    title: "Price list refresh",
    eyebrow: "Project",
    status: { label: "At risk", tone: "warning" },
    figure: { label: "Budget", value: "$6k" },
    progress: 0.35,
    person: "Pricing",
    href: "#p2",
  },
  {
    key: "p3",
    title: "Supplier onboarding",
    eyebrow: "Project",
    status: { label: "Not started", tone: "neutral" },
    progress: 0,
    person: "Procurement",
  },
];

const withActions: RecordItem[] = customers.slice(0, 2).map((r) => ({
  ...r,
  actions: html`<ui-button variant="text" size="xs">Call</ui-button
    ><ui-button variant="text" size="xs">Email</ui-button>`,
}));

const figures: RecordFact[] = [
  { label: "Revenue this year", value: "$184,200" },
  { label: "Open orders", value: "12" },
  { label: "Outstanding", value: "$23,950" },
  { label: "Average days to pay", value: "27" },
];

const links: RecordLink[] = [
  { label: "Orders", count: 148, href: "#orders" },
  { label: "Invoices", count: 96, href: "#invoices" },
  { label: "Contacts", count: 7, href: "#contacts" },
  { label: "Notes" },
];

const meta = preview.meta({
  title: "Primitives/Data/Record",
  component: "ui-record-cards",
  parameters: { canvas: "column" },
  args: {
    records: projects,
    label: "Projects",
  },
  argTypes: {
    records: { control: "object" },
    label: { control: "text" },
  },
  render: (args) => html`<ui-record-cards .records=${args.records} label=${ifDefined(args.label)}></ui-record-cards>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story:
          "Edit the records to change the cards; a linked card's title is its link, stretched over the card and named by title and status.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "Projects" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    const first = canvas.getByRole("link", { name: "Warehouse migration, On track" });
    await expect(first).toHaveAttribute("href", "#p1");
    await expect(first).toHaveTextContent("Warehouse migration");
    const card = canvas.getAllByRole("listitem")[0]!;
    await expect(card).toHaveTextContent("$48k");
    await expect(card).toHaveTextContent("Operations");
    await expect(canvas.getByRole("link", { name: "Price list refresh, At risk" })).toHaveAttribute("href", "#p2");
    await expect(canvas.getAllByRole("link")).toHaveLength(2);
    await expect(canvas.getByText("Supplier onboarding")).toBeInTheDocument();
  },
});

export const WithFacts = meta.story({
  name: "Records with facts",
  args: { records: customers, label: "Customers" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    const first = canvas.getByRole("link", { name: "Office supplies distributor, Active" });
    await expect(first).toHaveAttribute("href", "#c1");
    await expect(canvas.getAllByRole("listitem")[0]).toHaveTextContent("$184,200");
    await expect(canvas.getByRole("link", { name: "Regional freight carrier, Overdue" })).toHaveAttribute(
      "href",
      "#c2",
    );
    await expect(canvas.getAllByRole("link")).toHaveLength(3);
    await expect(canvas.getAllByRole("term").map((t) => t.textContent?.trim())).toContain("Terms");
    for (const item of [...canvas.getAllByRole("term"), ...canvas.getAllByRole("definition")]) {
      await expect(item.parentElement?.tagName).toBe("DIV");
      await expect(item.parentElement?.parentElement?.tagName).toBe("DL");
    }
    await expect(canvas.getByText("Awaiting credit review")).toBeInTheDocument();
  },
});

export const ActionsStayClickable = meta.story({
  name: "Actions beside the link",
  args: { records: withActions, label: "Customers" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Office supplies distributor, Active" })).toHaveAttribute(
      "href",
      "#c1",
    );
    await expect(canvas.getAllByRole("button", { name: "Call" })).toHaveLength(2);
    await expect(canvas.getAllByRole("button", { name: "Email" })).toHaveLength(2);
    await expect(canvas.getAllByRole("button", { name: "Call" })[0]).toBeEnabled();
  },
});

export const SingleUnlinked = meta.story({
  name: "Single record without a link",
  args: { records: [{ key: "x", title: "Hardware retailer" }], label: "One customer" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.queryByRole("link")).toBeNull();
    await expect(canvas.getByText("Hardware retailer")).toBeInTheDocument();
    await expect(canvas.getByRole("listitem").querySelector("[aria-label]")).toBeNull();
  },
});

export const NoRecords = meta.story({
  name: "No records",
  args: { records: [], label: "No customers" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
  },
});

export const Cards = meta.story({
  name: "Cards",
  parameters: {
    docs: {
      description: {
        story: "A linked card is one link named by its title and status; the stripe on top takes the status tone.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-record-cards label="Customers" .records=${customers}></ui-record-cards>`,
});

export const CardsWithProgress = meta.story({
  name: "Cards with progress",
  parameters: { canvas: "column" },
  render: () => html`<ui-record-cards label="Projects" .records=${projects}></ui-record-cards>`,
});

export const CardsWithActions = meta.story({
  name: "Cards with actions",
  parameters: {
    docs: {
      description: {
        story: "With actions, the link becomes a cover under the card so the buttons stay separately clickable.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-record-cards label="Customers" .records=${withActions}></ui-record-cards>`,
});

export const List = meta.story({
  name: "List",
  parameters: {
    docs: {
      description: { story: "A row joins the eyebrow, supporting text and fact values into one line under the title." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-record-list label="Customers" .records=${customers}></ui-record-list>
    <ui-record-list label="Projects" .records=${projects}></ui-record-list>
    <ui-record-list label="Customers" .records=${withActions}></ui-record-list>
  `,
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Warehouse migration, On track" });
    await expect(link).toHaveTextContent(/^Warehouse migration$/);
    for (const a of canvas.getAllByRole("link")) {
      await expect(a.getAttribute("aria-label")?.startsWith(a.textContent!.trim())).toBe(true);
    }
  },
});

export const Chips = meta.story({
  name: "Chips",
  parameters: {
    docs: { description: { story: "Chips keep the monogram, title and a status dot; actions are left out." } },
    canvas: "column",
  },
  render: () =>
    html`<ui-record-chips label="Related customers" .records=${[...customers, ...projects]}></ui-record-chips>`,
  play: async ({ canvas, userEvent }) => {
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(5);
    for (const a of links) {
      await expect(a.getAttribute("aria-label")?.startsWith(a.textContent!.trim())).toBe(true);
    }
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Office supplies distributor, Active" })).toHaveFocus();
  },
});

export const Hero = meta.story({
  name: "Hero",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-record-hero
      .record=${{ ...customers[0]!, actions: html`<ui-button color="primary" size="sm">New order</ui-button>` }}
      .tags=${[
        { label: "Wholesale", tone: "primary" },
        { label: "Net 30", tone: "neutral" },
      ]}
      .figures=${figures}
      .links=${links}
      meta="Customer since March 2019 · Updated 2 hours ago"
    ></ui-record-hero>
  `,
  play: async ({ canvas }) => {
    const terms = canvas.getAllByRole("term");
    await expect(terms.map((t) => t.textContent?.trim())).toEqual(figures.map((f) => f.label));
    for (const t of terms) {
      await expect(t.parentElement?.tagName).toBe("DIV");
      await expect(t.parentElement?.parentElement?.tagName).toBe("DL");
      await expect(t.nextElementSibling?.tagName).toBe("DD");
    }
  },
});

export const MinimalHero = meta.story({
  name: "Minimal hero",
  parameters: { canvas: "column" },
  render: () => html`<ui-record-hero .record=${{ key: "x", title: "Hardware retailer" }}></ui-record-hero>`,
});

const plain: RecordItem[] = [
  { key: "a", title: "Garden centre", href: "#a" },
  { key: "b", title: "Bakery supplies", status: { label: "Active", tone: "success" } },
];

export const UnlabelledSparse = meta.story({
  name: "Unlabelled and sparse",
  parameters: {
    docs: { description: { story: "Without a label or status a link is named by its title alone." } },
    canvas: "column",
  },
  render: () => html`
    <ui-record-cards .records=${plain}></ui-record-cards>
    <ui-record-list .records=${plain}></ui-record-list>
    <ui-record-chips .records=${plain}></ui-record-chips>
    <ui-record-hero></ui-record-hero>
  `,
  play: async ({ canvas, canvasElement }) => {
    const lists = canvas.getAllByRole("list");
    await expect(lists).toHaveLength(3);
    for (const list of lists) await expect(list).not.toHaveAttribute("aria-label");
    const links = canvas.getAllByRole("link", { name: "Garden centre" });
    await expect(links).toHaveLength(3);
    for (const a of links) await expect(a).not.toHaveAttribute("aria-label");
    const row = canvasElement.querySelector("ui-record-list li")!;
    await expect(row).toHaveTextContent("Garden centre");
    await expect(row.querySelector(".text-body-sm")).toBeNull();
    const [, bakeryRow] = [...canvasElement.querySelectorAll("ui-record-list li")];
    await expect(bakeryRow).toHaveTextContent("Active");
    const chip = canvasElement.querySelector("ui-record-chips li")!;
    await expect(chip.querySelectorAll("[aria-hidden]")).toHaveLength(1);
    await expect(canvasElement.querySelector("ui-record-hero")!.children).toHaveLength(0);
  },
});
