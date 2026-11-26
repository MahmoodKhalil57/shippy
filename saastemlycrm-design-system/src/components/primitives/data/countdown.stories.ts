import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "./countdown.ts";
import type { CountdownItem } from "./countdown.ts";

const deadlines: CountdownItem[] = [
  { label: "Quarterly tax filing", due: "2026-03-09T17:00:00Z", supporting: "Finance" },
  { label: "Renewal quote for account 2041", due: "2026-03-03T12:00:00Z", supporting: "Sales" },
  { label: "Warehouse stock count", due: "2026-03-02T11:45:00Z", supporting: "Operations" },
  { label: "Invoice INV-20391 payment", due: "2026-03-02T09:20:00Z", supporting: "Accounts receivable" },
];

const meta = preview.meta({
  title: "Primitives/Data/Countdown",
  component: "ui-countdown",
  parameters: { canvas: "column" },
  args: {
    items: deadlines,
    now: "2026-03-02T08:59:30Z",
    label: "Deadlines",
  },
  argTypes: {
    items: { control: "object" },
    now: { control: "text", description: "The fixed start of the clock, as an ISO date-time." },
    label: { control: "text" },
  },
  render: (args) => html`
    <ui-countdown .items=${args.items} now=${ifDefined(args.now)} label=${ifDefined(args.label)}></ui-countdown>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the countdown; items sort by due time." } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "Deadlines" })).toBeInTheDocument();
    const rows = canvas.getAllByRole("listitem");
    await expect(rows).toHaveLength(4);
    await expect(rows[0]).toHaveTextContent("Invoice INV-20391 payment");
    await expect(rows[0]).toHaveTextContent("20 min left");
    await expect(rows[0]).toHaveTextContent("Accounts receivable");
    await expect(rows[1]).toHaveTextContent("2 h 45 min left");
    await expect(rows[2]).toHaveTextContent("1 d 3 h left");
    await expect(rows[3]).toHaveTextContent("Quarterly tax filing");
    await expect(rows[3]).toHaveTextContent("7 d left");
  },
});

export const OverdueArgs = meta.story({
  name: "Overdue items",
  args: {
    label: "Payments",
    now: "2026-03-02T09:00:30Z",
    items: [
      { label: "Supplier invoice 7712", due: "2026-02-26T17:00:00Z" },
      { label: "Freight charges", due: "2026-03-02T05:30:00Z" },
      { label: "Office lease", due: "2026-03-02T08:58:00Z" },
      { label: "Payroll run", due: "2026-03-04T10:00:00Z" },
    ],
  },
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole("listitem");
    await expect(rows[0]).toHaveTextContent("overdue 3 d");
    await expect(rows[1]).toHaveTextContent("overdue 3 h");
    await expect(rows[2]).toHaveTextContent("overdue 2 min");
    await expect(rows[3]).toHaveTextContent("2 d left");
    await expect(rows[0]?.querySelector("svg")).not.toBeNull();
    await expect(rows[3]?.querySelector("svg")).toBeNull();
  },
});

export const Links = meta.story({
  name: "Links",
  args: {
    label: "Open quotes",
    items: [
      { label: "Quote Q-3381 expires", due: "2026-03-06T23:59:00Z", href: "#q-3381" },
      { label: "Quote Q-3379 expires", due: "2026-03-04T23:59:00Z", href: "#q-3379" },
    ],
  },
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole("link");
    await expect(links[0]).toHaveAccessibleName(/Quote Q-3379 expires/);
    await expect(links[0]).toHaveAttribute("href", "#q-3379");
    await expect(links[1]).toHaveAttribute("href", "#q-3381");
  },
});

export const InvalidAndEmpty = meta.story({
  name: "Invalid dates are left out",
  args: {
    label: "Reminders",
    items: [
      { label: "Follow-up call", due: "not a date" },
      { label: "Send contract", due: "2026-03-02T10:01:00Z" },
    ],
  },
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole("listitem");
    await expect(rows).toHaveLength(1);
    await expect(rows[0]).toHaveTextContent("1 h 1 min left");
    await expect(canvas.queryByText("Follow-up call")).toBeNull();
  },
});

export const NoItems = meta.story({
  name: "No items",
  args: { items: [], label: "Nothing due" },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
  },
});

export const UpcomingDeadlines = meta.story({
  name: "Upcoming deadlines",
  parameters: {
    docs: {
      description: {
        story:
          "Items sort by due time and each bar drains in real time; with no from, bars are scaled to the furthest deadline.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-countdown label="Deadlines" now="2026-03-02T09:00:00Z" .items=${deadlines}></ui-countdown>`,
});

export const Overdue = meta.story({
  name: "Overdue",
  parameters: {
    docs: {
      description: {
        story: "An overdue item turns red with a warning icon, and one that passes while shown is announced.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-countdown
      label="Payments"
      now="2026-03-02T09:00:00Z"
      .items=${[
        { label: "Supplier invoice 7712", due: "2026-02-26T17:00:00Z", supporting: "Overdue by several days" },
        { label: "Freight charges", due: "2026-03-02T05:30:00Z", supporting: "Overdue by a few hours" },
        { label: "Office lease", due: "2026-03-02T08:58:00Z", supporting: "Just passed" },
        { label: "Payroll run", due: "2026-03-04T10:00:00Z", supporting: "Upcoming" },
      ]}
    ></ui-countdown>
  `,
});

export const FromAStartTime = meta.story({
  name: "From a start time",
  parameters: {
    docs: { description: { story: "With from set, the bar shows how much of that window is left." } },
    canvas: "column",
  },
  render: () => html`
    <ui-countdown
      label="Service level targets"
      now="2026-03-02T09:00:00Z"
      .items=${[
        { label: "Ticket 5530 first reply", from: "2026-03-02T08:00:00Z", due: "2026-03-02T12:00:00Z" },
        { label: "Ticket 5527 resolution", from: "2026-02-28T09:00:00Z", due: "2026-03-03T09:00:00Z" },
        { label: "Ticket 5519 resolution", from: "2026-02-23T09:00:00Z", due: "2026-03-02T10:00:00Z" },
      ]}
    ></ui-countdown>
  `,
});

export const LinkedItems = meta.story({
  name: "Linked items",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-countdown
      label="Open quotes"
      now="2026-03-02T09:00:00Z"
      .items=${[
        { label: "Quote Q-3381 expires", due: "2026-03-06T23:59:00Z", href: "#q-3381" },
        { label: "Quote Q-3379 expires", due: "2026-03-04T23:59:00Z", href: "#q-3379" },
      ]}
    ></ui-countdown>
  `,
});

export const MinuteTick = meta.story({
  name: "Minute tick",
  parameters: {
    docs: { description: { story: "Each minute the countdown announces items that have just become overdue." } },
  },
  args: {
    label: "Payments",
    now: "2026-03-02T09:00:00Z",
    items: [
      { label: "Freight charges", due: "2026-03-02T08:00:00Z" },
      { label: "Office lease", due: "2026-03-02T09:00:00.150Z" },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("ui-countdown > div")!;
    const live = root.querySelector("[aria-live]")!;
    await expect(live).toHaveTextContent("");
    const tick = root.querySelector<HTMLElement>("span[aria-hidden]")!;
    const [clock] = tick.getAnimations();
    clock!.playbackRate = 1000;
    await waitFor(() => expect(Number(root.dataset.tick)).toBeGreaterThan(0));
    await waitFor(() => expect(live).toHaveTextContent("Office lease is overdue."));
    await expect(live).not.toHaveTextContent("Freight charges");
    const said = Number(root.dataset.tick);
    await waitFor(() => expect(Number(root.dataset.tick)).toBeGreaterThan(said));
    await expect(live).toHaveTextContent("Office lease is overdue.");
  },
});

export const ClockChanges = meta.story({
  name: "Clock changes",
  parameters: {
    docs: { description: { story: "New items keep the fixed clock; clearing now falls back to the real time." } },
  },
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector("ui-countdown")!;
    el.label = "";
    await el.updateComplete;
    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-label");
    await expect(canvas.getAllByRole("listitem")[0]).toHaveTextContent("20 min left");
    el.items = [{ label: "Stock count", due: "2026-03-02T09:45:00Z" }];
    await el.updateComplete;
    await expect(canvas.getByRole("listitem")).toHaveTextContent("45 min left");
    el.now = "";
    await el.updateComplete;
    await expect(canvas.getByRole("listitem")).toHaveTextContent(/overdue \d+ d/);
  },
});
