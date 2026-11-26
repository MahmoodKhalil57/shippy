import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, mocked } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../../.storybook/fixtures/widgets.ts";
import { m } from "../../../lib/i18n/index.ts";
import type { ViewBlocks } from "../../../lib/widgets/schema.ts";
import { renderBlocks } from "../registry.ts";
import "./attach.ts";
import "./entries.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

const items: ViewBlocks["entries"]["items"] = [
  {
    id: "e1",
    heading: "Harbor Logistics",
    href: "/customers/c1",
    meta: ["Portland", "", "Priority"],
    status: { label: "Open", tone: "info" },
    tags: [{ label: "New" }],
    summary: { context: "Customer", text: "Asked for a quote." },
    text: "Asked for a revised quote.",
    facts: [{ label: "Owner", value: "Maya Patel", note: "since May" }],
    people: [{ name: "Maya", state: "done", note: "Sent it" }, { name: "Jordan", state: "declined" }, { name: "Sam" }],
    notes: ["Call back Monday"],
    notice: { text: "Quote expires Friday", tone: "warning" },
    actions: [{ label: "Call" }],
    attach: {
      action: { label: "Attach" },
      heading: "Attach the quote",
      file: { name: "file", legend: "Quote", upload: { collection: "files" } },
      call: { path: "/quote" },
      confirmLabel: "Attach",
    },
  },
  {
    heading: "Riverside Bakery",
    summary: { context: "Customer", text: "Paid the March invoice." },
    notice: { text: "Paid in full" },
  },
];

export const Cards = meta.story({
  render: (args) => html`${renderBlocks([{ type: "entries", items }], blockContext(args))}`,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(canvasElement.querySelector("ui-grid")!.fit).toBe("md");
    const [first, second] = [...canvasElement.querySelectorAll("ui-card")];
    await expect(first!.subhead).toBe("Portland · Priority");
    await expect(canvas.getByRole("link", { name: "Harbor Logistics" })).toHaveAttribute("href", "/customers/c1");
    await expect([...first!.querySelectorAll("ui-tag")].map((t) => t.textContent!.trim())).toEqual([
      "Open",
      "New",
      "Maya",
      "Jordan",
      "Sam",
    ]);
    await expect(canvas.getByText("Maya: “Sent it”")).toBeVisible();
    await expect(first!.querySelector("app-attach")).toBeTruthy();
    await expect([...canvasElement.querySelectorAll("ui-alert")].map((a) => a.tone)).toEqual(["warning", "info"]);
    await expect(second!.querySelector("[slot=actions]")).toBeNull();
    await expect(mocked(args.mount).mock.calls.map((c) => c[2])).toEqual(["entry:e1", "entry:Riverside Bakery"]);
    await expect(args.mount).toHaveBeenCalledWith(
      "ui-ai-summary",
      { type: "tldr", auto: true, context: "Customer", text: "Asked for a quote." },
      "entry:e1",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Call" }));
    await expect(args.run).toHaveBeenCalledWith({ label: "Call" });
  },
});

export const Rows = meta.story({
  name: "Rows in a card",
  render: (args) => html`${renderBlocks([{ type: "entries", items }], blockContext(args, { inCard: true }))}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll("ui-divider")).toHaveLength(1);
    await expect(canvas.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    await expect(canvas.getByText("Portland · Priority")).toBeVisible();
  },
});

export const PlainRow = meta.story({
  name: "Plain row",
  render: (args) =>
    html`${renderBlocks([{ type: "entries", items: [{ heading: "Riverside Bakery" }] }], blockContext(args, { inCard: true }))}`,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Riverside Bakery" })).toBeVisible();
  },
});

export const Empty = meta.story({
  render: (args) =>
    html`${renderBlocks(
      [
        { type: "entries", items: [], empty: "No follow-ups" },
        { type: "entries", items: [] },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No follow-ups")).toBeVisible();
    await expect(canvas.getByText(m.widget_empty())).toBeVisible();
  },
});
