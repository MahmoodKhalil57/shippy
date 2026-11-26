import preview from "#.storybook/preview";
import { html, nothing } from "lit";
import { expect, fn, spyOn, waitFor } from "storybook/test";
import { blockContext, mountElement, type BlockArgs } from "../../../.storybook/fixtures/widgets.ts";
import { m } from "../../lib/i18n/index.ts";
import { getLocale, overwriteGetLocale } from "../../lib/i18n/paraglide/runtime.js";
import type { Action, Cell, ViewBlock } from "../../lib/widgets/schema.ts";
import { action, actionBar, cell, initialsOf, tag } from "./blocks.ts";
import { renderBlocks, type ViewContext } from "./registry.ts";

const meta = preview.type<{ args: BlockArgs }>().meta({
  args: { run: fn(), setParam: fn(), reload: fn(), mount: fn(mountElement) },
});

const all = <K extends keyof HTMLElementTagNameMap>(root: ParentNode, tag: K) => [...root.querySelectorAll(tag)];
const one = <K extends keyof HTMLElementTagNameMap>(root: ParentNode, tag: K) => root.querySelector(tag)!;
const groups = (parts: [string, unknown][]) =>
  html`<ui-flex direction="col" gap="3"
    >${parts.map(([label, content]) => html`<div role="group" aria-label=${label}>${content}</div>`)}</ui-flex
  >`;
const host = (el: Element) => el.closest("ui-button")!;
const draw = (blocks: ViewBlock[], args: BlockArgs, opts?: Parameters<typeof blockContext>[1]) =>
  html`${renderBlocks(blocks, blockContext(args, opts))}`;

let release = () => {};

export const PressAction = meta.story({
  name: "Action pressed once while it runs",
  args: { run: fn(() => new Promise<void>((resolve) => (release = resolve))) },
  render: (args) => html`${action({ label: "Send reminder", icon: "send" }, blockContext(args))}`,
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Send reminder" });
    await userEvent.click(button);
    await expect(args.run).toHaveBeenCalledTimes(1);
    await expect(host(button).loading).toBe(true);
    await waitFor(() => expect(button).toBeDisabled());
    release();
    await waitFor(() => expect(button).toBeEnabled());
    await expect(host(button).loading).toBe(false);
    await userEvent.click(button);
    await expect(args.run).toHaveBeenCalledTimes(1);
    const later = performance.now() + 1000;
    const now = spyOn(performance, "now").mockReturnValue(later);
    await userEvent.click(button);
    now.mockRestore();
    await expect(args.run).toHaveBeenCalledTimes(2);
    release();
  },
});

export const Actions = meta.story({
  name: "Action looks",
  render: (args) => {
    const ctx = blockContext(args);
    return html`<ui-flex gap="2" wrap
      >${action({ label: "Open invoice", href: "/invoices/1" }, ctx)}${action(
        { label: "Mark paid", main: true },
        ctx,
        "sm",
        "text",
      )}${action({ label: "Delete draft", tone: "error" }, ctx)}</ui-flex
    >`;
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("link", { name: "Open invoice" })).toHaveAttribute("href", "/invoices/1");
    const main = canvas.getByRole("button", { name: "Mark paid" });
    await expect(host(main).variant).toBe("filled");
    await userEvent.click(main);
    await expect(args.run).toHaveBeenCalledWith({ label: "Mark paid", main: true });
    await expect(host(main).loading).toBe(false);
    await expect(main).toBeEnabled();
    await expect(host(canvas.getByRole("button", { name: "Delete draft" })).color).toBe("error");
  },
});

const links: Action[] = [
  { label: "Open invoice", href: "/invoices/1" },
  { label: "Customer page", href: "/customers/1" },
  { label: "Statement", href: "/customers/1/statement" },
];

export const ActionBar = meta.story({
  name: "Action bar",
  render: (args) =>
    html`${actionBar(
      [
        ...links,
        { label: "Send reminder", main: true },
        { label: "Mark paid", main: true, disabled: true, reason: "Waiting for the bank" },
        { label: "Call customer", call: { path: "/customers/call" } },
      ],
      blockContext(args),
    )}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(one(canvasElement, "ui-dropdown").items).toEqual([
      { label: "Customer page", href: "/customers/1" },
      { label: "Statement", href: "/customers/1/statement" },
    ]);
    const buttons = all(canvasElement, "ui-button").filter((b) => !b.closest("ui-dropdown"));
    await expect(buttons.map((b) => b.textContent!.trim())).toEqual([
      "Open invoice",
      "Send reminder",
      "Call customer",
      "Mark paid",
    ]);
    await expect(canvas.getByRole("button", { name: "Mark paid" })).toBeDisabled();
    await expect(canvas.getByText("Waiting for the bank")).toBeVisible();
  },
});

export const ActionBarLinks = meta.story({
  name: "Action bar of links",
  render: (args) => html`${actionBar(links.slice(0, 2), blockContext(args))}`,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(2);
    await expect(canvasElement.querySelector("ui-dropdown")).toBeNull();
  },
});

export const ActionBarButtons = meta.story({
  name: "Action bar of buttons",
  render: (args) => html`${actionBar([{ label: "Save" }], blockContext(args))}`,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button")).toHaveLength(1);
  },
});

export const ActionBarEmpty = meta.story({
  name: "Action bar with nothing to do",
  render: (args) => {
    const ctx = blockContext(args);
    return html`${actionBar(undefined, ctx)}${actionBar([], ctx)}`;
  },
  play: async ({ canvas, args }) => {
    const ctx = blockContext(args);
    await expect(actionBar(undefined, ctx)).toBe(nothing);
    await expect(actionBar([], ctx)).toBe(nothing);
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
  },
});

export const Tags = meta.story({
  render: () =>
    html`<ui-flex gap="2"
      >${tag({ label: "Late", tone: "error", icon: "calendar" })}${tag({ label: "Plain" })}</ui-flex
    >`,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Late").closest("ui-tag")!.tone).toBe("error");
    await expect(canvas.getByText("Plain").closest("ui-tag")!.tone).toBe("neutral");
  },
});

const cellIn = (c: Cell, ctx?: ViewContext, inTable = false) => cell(c, ctx, inTable);

export const Initials = meta.story({
  render: () =>
    groups([
      ["Two names", cellIn({ text: "  maya   patel  ", person: true })],
      ["One name", cellIn({ text: "Jordan", person: true })],
      ["Accented names", cellIn({ text: "ömer van der berg", person: true })],
    ]),
  play: async ({ canvas }) => {
    const initials = (name: string) => one(canvas.getByRole("group", { name }), "ui-avatar").initials;
    await expect(initials("Two names")).toBe("MP");
    await expect(initials("One name")).toBe("J");
    await expect(initials("Accented names")).toBe("ÖB");
    await expect(initialsOf("  maya   patel  ")).toBe("MP");
  },
});

export const EmptyCells = meta.story({
  name: "Empty and plain cells",
  render: () =>
    groups([
      ["Null", cellIn(null)],
      ["Blank", cellIn("")],
      ["Missing", cellIn(undefined)],
      ["Number", cellIn(12)],
    ]),
  play: async ({ canvas }) => {
    for (const name of ["Null", "Blank", "Missing"])
      await expect(canvas.getByRole("group", { name }).textContent!.trim()).toBe("—");
    await expect(canvas.getByRole("group", { name: "Number" }).textContent).toBe("12");
  },
});

export const TagCells = meta.story({
  name: "Tag cells",
  render: () =>
    groups([
      ["Paid", cellIn({ text: "Paid", tag: true, tone: "success", hue: 2 })],
      ["Gift", cellIn({ text: "Gift", tag: true })],
    ]),
  play: async ({ canvas }) => {
    await expect(one(canvas.getByRole("group", { name: "Paid" }), "ui-tag").hue).toBe(2);
    await expect(one(canvas.getByRole("group", { name: "Gift" }), "ui-tag").tone).toBe("neutral");
  },
});

export const PersonCells = meta.story({
  name: "Person cells",
  render: () =>
    groups([
      ["Linked", cellIn({ text: "Maya Patel", person: true, href: "/users/u1" })],
      ["In a table", cellIn({ text: "Jordan Lee", person: true }, undefined, true)],
    ]),
  play: async ({ canvas }) => {
    const linked = canvas.getByRole("group", { name: "Linked" });
    await expect(one(linked, "ui-avatar").initials).toBe("MP");
    await expect(canvas.getByRole("link", { name: "Maya Patel" })).toHaveAttribute("href", "/users/u1");
    const table = canvas.getByRole("group", { name: "In a table" });
    await expect(table.querySelector("ui-avatar")).toBeNull();
    await expect(table.textContent).toBe("Jordan Lee");
  },
});

const flag = { path: "/customers/flag", body: { id: "c1" } };

export const SwitchCells = meta.story({
  name: "Switch cells",
  render: (args) => {
    const ctx = blockContext(args);
    return groups([
      ["Active", cellIn({ text: "Active", switch: { value: true, call: flag, done: "Saved" } }, ctx)],
      ["Archived", cellIn({ text: "Archived", switch: { value: false } }, ctx)],
      ["Paused", cellIn({ text: "Paused", switch: { value: false, call: flag } })],
    ]);
  },
  play: async ({ canvas, userEvent, args }) => {
    const active = canvas.getByRole("switch", { name: "Active" });
    await expect(active).toBeEnabled();
    await userEvent.click(active);
    await expect(args.run).toHaveBeenCalledWith({
      label: "Active",
      call: { ...flag, body: { id: "c1", value: false } },
      done: "Saved",
      reply: true,
      undo: { ...flag, body: { id: "c1", value: true } },
    });
    const archived = canvas.getByRole("switch", { name: "Archived" });
    const paused = canvas.getByRole("switch", { name: "Paused" });
    await expect(archived).toBeDisabled();
    await expect(paused).toBeDisabled();
    archived.dispatchEvent(new Event("change", { bubbles: true }));
    paused.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(args.run).toHaveBeenCalledTimes(1);
  },
});

export const ToneCells = meta.story({
  name: "Text cells with tones",
  render: () =>
    groups([
      ["Late", cellIn({ text: "Late", tone: "error", mono: true, strong: true })],
      ["Neutral", cellIn({ text: "On time", tone: "neutral" })],
      ["Primary", cellIn({ text: "Due today", tone: "primary" })],
      ["In a table", cellIn({ text: "Draft" }, undefined, true)],
    ]),
  play: async ({ canvas }) => {
    const text = (name: string) => one(canvas.getByRole("group", { name }), "ui-text");
    await expect(text("Late").color).toBe("error");
    await expect(text("Neutral").color).toBeUndefined();
    await expect(text("Primary").color).toBeUndefined();
    await expect(text("Late").variant).toBe("body-md");
    await expect(text("In a table").variant).toBeUndefined();
  },
});

export const LinkCells = meta.story({
  name: "Link and dot cells",
  render: () =>
    groups([
      ["Link", cellIn({ text: "INV-1042", href: "/invoices/1042" })],
      ["Dot", cellIn({ text: "Open", dot: "info" })],
      ["Linked dot", cellIn({ text: "Sent", dot: "info", href: "/invoices/1043" })],
    ]),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "INV-1042" })).toHaveAttribute("href", "/invoices/1042");
    await expect(one(canvas.getByRole("group", { name: "Dot" }), "ui-tag").tone).toBe("info");
    await expect(canvas.getByRole("group", { name: "Linked dot" }).querySelector("ui-link ui-tag")).toBeTruthy();
  },
});

export const GaugeCells = meta.story({
  name: "Gauge cells",
  render: () =>
    groups([
      ["Plain", cellIn({ text: "3 of 4", gauge: { value: 3, max: 4 } })],
      ["Labelled", cellIn({ text: "1 of 2", gauge: { value: 1, max: 2, tone: "error", label: "Half collected" } })],
    ]),
  play: async ({ canvas }) => {
    await expect(one(canvas.getByRole("group", { name: "Plain" }), "ui-gauge")).toMatchObject({
      tone: "primary",
      label: "3 of 4",
    });
    await expect(one(canvas.getByRole("group", { name: "Labelled" }), "ui-gauge")).toMatchObject({
      tone: "error",
      label: "Half collected",
    });
  },
});

const labels = [{ label: "Wholesale" }, { label: "Priority" }];

export const TagListCells = meta.story({
  name: "Cells with tags",
  render: () =>
    groups([
      ["Table with text", cellIn({ text: "Harbor Logistics", tags: labels }, undefined, true)],
      ["Table without text", cellIn({ text: "", tags: labels }, undefined, true)],
      ["With text", cellIn({ text: "Harbor Logistics", tags: labels })],
      ["Without text", cellIn({ text: "", tags: labels })],
    ]),
  play: async ({ canvas }) => {
    for (const name of ["Table with text", "Table without text", "With text", "Without text"])
      await expect(all(canvas.getByRole("group", { name }), "ui-tag")).toHaveLength(2);
    await expect(all(canvas.getByRole("group", { name: "Without text" }), "ui-text")).toHaveLength(0);
  },
});

export const MarkCells = meta.story({
  name: "Cells with marks",
  render: () =>
    groups([
      ["Marks", cellIn({ text: "", marks: [{ text: "Missing proof", tone: "error" }, { text: "Signed late" }] })],
      ["Text and a mark", cellIn({ text: "INV-1042", marks: [{ text: "Disputed" }] })],
      ["Tags and a mark", cellIn({ text: "", tags: labels, marks: [{ text: "Disputed" }] })],
    ]),
  play: async ({ canvas }) => {
    await expect(all(canvas.getByRole("group", { name: "Marks" }), "ui-badge").map((b) => b.tone)).toEqual([
      "error",
      "neutral",
    ]);
    await expect(all(canvas.getByRole("group", { name: "Text and a mark" }), "ui-text")).toHaveLength(2);
    await expect(all(canvas.getByRole("group", { name: "Tags and a mark" }), "ui-tag")).toHaveLength(2);
  },
});

const chase: Action[] = [{ label: "Chase", main: true }];

export const ActionCells = meta.story({
  name: "Cells with actions",
  render: (args) => {
    const ctx = blockContext(args);
    return groups([
      ["In a table", cellIn({ text: "INV-1042", actions: chase }, ctx, true)],
      ["On a page", cellIn({ text: "", actions: chase }, ctx)],
      ["Marked in a table", cellIn({ text: "INV-1043", marks: [{ text: "Disputed" }], actions: chase }, ctx, true)],
      ["Without a context", cellIn({ text: "INV-1044", actions: chase })],
    ]);
  },
  play: async ({ canvas, userEvent, args }) => {
    const button = (name: string) => one(canvas.getByRole("group", { name }), "ui-button");
    await userEvent.click(button("In a table"));
    await expect(args.run).toHaveBeenLastCalledWith({ label: "Chase", main: false });
    await expect(button("On a page").variant).toBe("filled");
    await expect(button("Marked in a table").variant).toBe("tonal");
    await expect(canvas.getByRole("group", { name: "Without a context" }).querySelector("ui-button")).toBeNull();
  },
});

const week: ViewBlock = {
  type: "card",
  heading: "This week",
  subhead: "Monday to Friday",
  count: 2,
  countTone: "error",
  tags: [{ label: "New" }],
  actions: [{ label: "Open" }],
  blocks: [{ type: "text", text: "Two deliveries are late." }],
};

export const Card = meta.story({
  render: (args) => draw([week, { type: "card", blocks: [{ type: "text", text: "No heading here." }] }], args),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Two deliveries are late.")).toBeVisible();
    const [outer, plain] = all(canvasElement, "ui-card");
    await expect(outer).toMatchObject({ variant: undefined, size: undefined, subhead: "Monday to Friday", count: 2 });
    await expect(plain!.querySelector("[slot=heading]")).toBeNull();
  },
});

export const CardInCard = meta.story({
  name: "Card in a card",
  render: (args) => draw([week], args, { inCard: true }),
  play: async ({ canvasElement }) => {
    await expect(one(canvasElement, "ui-card")).toMatchObject({ variant: "filled", size: "sm" });
  },
});

export const GridAndSplit = meta.story({
  name: "Grid and split",
  render: (args) =>
    draw(
      [
        { type: "grid", blocks: [{ type: "text", text: "West: 14 open orders." }] },
        {
          type: "grid",
          blocks: [
            {
              type: "chart",
              label: "Orders",
              chart: { kind: "bars", labels: ["Mon", "Tue"], series: [{ name: "Orders", values: [4, 6] }] },
            },
          ],
        },
        {
          type: "split",
          main: [{ type: "text", text: "Fourteen orders wait to ship." }],
          side: [{ type: "text", text: "Dock 3 is closed." }],
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    const grids = all(canvasElement, "ui-grid").filter((g) => g.parentElement?.closest("ui-grid") === null);
    await expect(grids.map((g) => g.fit)).toEqual(["sm", "md", undefined]);
    await expect(grids[2]!.items).toHaveLength(2);
  },
});

const trend = { labels: ["Jan", "Feb"], values: [1200, 1800], format: { unit: "money" as const } };

export const StatAlone = meta.story({
  name: "Figure alone",
  render: (args) => draw([{ type: "stats", items: [{ label: "Paid", value: "$1,800", trend, main: true }] }], args),
  play: async ({ canvasElement }) => {
    const stat = one(canvasElement, "ui-stat");
    await expect(stat).toMatchObject({ fill: true, main: true, outlined: true, size: "lg" });
    const spark = one(stat, "ui-chart");
    await expect(spark.height).toBe("fill");
    await expect(spark.format!(1200)).toBe("1,200");
  },
});

export const StatMini = meta.story({
  name: "Mini figure",
  render: (args) =>
    draw(
      [
        {
          type: "stats",
          mini: true,
          size: "md",
          items: [
            {
              label: "Paid",
              value: "$1,800",
              trend,
              delta: { text: "+$600", dir: "up", good: false },
              share: { value: 0.4, text: "40%" },
            },
          ],
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    const stat = one(canvasElement, "ui-stat");
    await expect(stat).toMatchObject({ mini: true, deltaTone: "error", shareText: "40%" });
    await expect(one(stat, "ui-chart").height).toBe("spark");
  },
});

export const StatRow = meta.story({
  name: "Figures in a row",
  render: (args) =>
    draw(
      [
        {
          type: "stats",
          items: [
            { label: "Open", value: "14", main: true, delta: { text: "+2", dir: "up", good: true } },
            { label: "Late", value: "3", main: true },
          ],
        },
      ],
      args,
      { inCard: true },
    ),
  play: async ({ canvasElement }) => {
    await expect(one(canvasElement, "ui-grid")).toMatchObject({ balance: "2", fit: undefined });
    const stats = all(canvasElement, "ui-stat");
    await expect(stats.map((s) => s.main)).toEqual([true, false]);
    await expect(stats[0]).toMatchObject({ deltaTone: "success", outlined: false });
  },
});

export const StatMany = meta.story({
  name: "Many figures",
  render: (args) =>
    draw(
      [
        {
          type: "stats",
          items: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({ label, value: String(i + 3) })),
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(one(canvasElement, "ui-grid")).toMatchObject({ fit: "xs", balance: undefined });
    await expect(all(canvasElement, "ui-stat")).toHaveLength(7);
  },
});

export const StatEmpty = meta.story({
  name: "Mini figure with nothing",
  render: (args) => draw([{ type: "stats", mini: true, items: [] }], args),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-stat")).toHaveLength(0);
  },
});

export const HeadingAndText = meta.story({
  name: "Heading and text",
  render: (args) =>
    draw(
      [
        { type: "heading", text: "This week" },
        { type: "text", text: "Quiet so far.", muted: true },
        { type: "text", text: "Two vans leave at nine.", speak: true },
        { type: "text", text: "Deux camions partent à neuf heures.", speak: "fr-FR" },
      ],
      args,
    ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("heading", { name: "This week" })).toBeVisible();
    await expect(canvas.getByText("Quiet so far.").closest("ui-text")).toMatchObject({
      variant: "body-sm",
      color: "muted",
    });
    await expect(all(canvasElement, "ui-speak").map((s) => s.lang)).toEqual(["en-GB", "fr-FR"]);
  },
});

export const TextInArabic = meta.story({
  name: "Text read aloud in Arabic",
  beforeEach: () => {
    const original = getLocale;
    overwriteGetLocale(() => "ar");
    return () => overwriteGetLocale(original);
  },
  render: (args) => draw([{ type: "text", text: "تغادر شاحنتان في التاسعة.", speak: true }], args),
  play: async ({ canvasElement }) => {
    await expect(one(canvasElement, "ui-speak").lang).toBe("ar");
  },
});

export const Table = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "table",
          size: "md",
          totals: true,
          columns: [
            { key: "who", label: "Customer", supporting: "city" },
            { key: "n", label: "Orders", align: "end" },
          ],
          rows: [
            { who: { text: "Maya Patel", person: true }, city: { text: "Austin", tone: "warning" }, n: 2 },
            { who: "Total", city: null, n: { text: "2", tone: "info" } },
          ],
        },
      ],
      args,
    ),
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByText("Maya Patel")).toBeVisible();
    const table = one(canvasElement, "ui-table");
    await expect(table).toMatchObject({ size: "md", footer: true });
    const [who, n] = table.columns;
    const [maya, total] = table.rows;
    await expect(who!.avatar!(maya!, 0)).toEqual({ initials: "MP" });
    await expect(who!.avatar!(total!, 1)).toBeUndefined();
    await expect(who!.supporting!(maya!, 0)).toEqual({ text: "Austin", tone: "warning" });
    await expect(who!.supporting!(total!, 1)).toBe("");
    await expect(who!.supporting!({ city: 3 }, 2)).toBe("3");
    await expect(who!.supporting!({ city: { text: "Dallas", tone: "info" } }, 3)).toBe("Dallas");
    await expect(n!.supporting).toBeUndefined();
    await expect(n!.render!(maya!, 0)).toBeTruthy();
  },
});

export const TableSmall = meta.story({
  name: "Small table",
  render: (args) =>
    draw([{ type: "table", columns: [{ key: "a", label: "Invoice" }], rows: [{ a: "INV-1042" }] }], args),
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByText("INV-1042")).toBeVisible();
    await expect(one(canvasElement, "ui-table")).toMatchObject({ size: "sm", footer: false });
  },
});

export const TableEmpty = meta.story({
  name: "Empty tables",
  render: (args) =>
    draw(
      [
        { type: "table", columns: [], rows: [], empty: "No invoices yet" },
        { type: "table", columns: [], rows: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-empty-state").map((e) => e.textContent!.trim())).toEqual([
      "No invoices yet",
      m.widget_empty(),
    ]);
  },
});

export const List = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "list",
          variant: "separated",
          items: [
            {
              headline: "Harbor Logistics",
              supporting: "Asked for a quote",
              overline: "Lead",
              value: "$2,400",
              dot: "error",
              tags: [{ label: "New" }],
            },
            { headline: "Delivery to Austin", lead: "9:00", href: "/deliveries/1", icon: "calendar" },
            { headline: "This week", trailing: "14 orders", select: { param: "period", value: "week" } },
            { headline: "This month", select: { param: "period", value: "month" }, selected: true },
            { headline: "Team stand-up", lead: "10:00" },
            { headline: "Riverside Bakery", actions: [{ label: "Call" }] },
          ],
        },
      ],
      args,
      { params: { period: "week" } },
    ),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const items = all(canvasElement, "ui-list-item");
    await expect(items.map((i) => i.lines)).toEqual(["2", "1", "2", "2", "1", "2"]);
    await expect(items.map((i) => i.selected)).toEqual([false, false, true, true, false, false]);
    await expect(items[1]!.querySelector("[slot=trailing][name=chevron-right]")).toBeTruthy();
    await expect(items[4]!.querySelector("[slot=trailing]")).toBeNull();
    await userEvent.click(canvas.getByText("This week"));
    await expect(args.setParam).toHaveBeenCalledWith("period", "week");
    await userEvent.click(canvas.getByText("Harbor Logistics"));
    await expect(args.setParam).toHaveBeenCalledTimes(1);
  },
});

export const ListSelectWithActions = meta.story({
  name: "Selectable item with actions",
  parameters: { a11y: { test: "todo" } },
  render: (args) =>
    draw(
      [
        {
          type: "list",
          items: [
            {
              headline: "This week",
              trailing: "14 orders",
              actions: [{ label: "Open" }],
              select: { param: "period", value: "week" },
            },
          ],
        },
      ],
      args,
      { params: { period: "week" } },
    ),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(one(canvasElement, "ui-list-item").selected).toBe(true);
    await expect(canvas.getByText("14 orders")).toBeVisible();
    await userEvent.click(canvas.getByText("This week"));
    await expect(args.setParam).toHaveBeenCalledWith("period", "week");
  },
});

export const ListEmpty = meta.story({
  name: "Empty lists",
  render: (args) =>
    draw(
      [
        { type: "list", items: [], empty: "Nothing due" },
        { type: "list", items: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-empty-state").map((e) => e.textContent!.trim())).toEqual([
      "Nothing due",
      m.widget_empty(),
    ]);
  },
});

export const Details = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "details",
          layout: "inline",
          items: [{ label: "City", value: "Austin", note: "HQ", noteTone: "info" }],
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(one(canvasElement, "ui-description-list").items[0]).toMatchObject({
      label: "City",
      note: "HQ",
      noteTone: "info",
    });
  },
});

export const Gauges = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "gauges",
          items: [
            { label: "Paid", value: 1, max: 2, tone: "success", valueText: "half", a11y: "Paid: half" },
            { label: "Due", value: 1, max: 2 },
            { label: "Late", value: 1, max: 2, valueText: "one" },
          ],
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    const [plain, due, late] = all(canvasElement, "ui-gauge");
    await expect(due).toMatchObject({ tone: "primary", label: "Due: 1", valueText: "" });
    await expect(late).toMatchObject({ label: "Late: one" });
    await expect(plain).toMatchObject({ tone: "success", label: "Paid: half", heading: "Paid" });
  },
});

export const LinkedGauge = meta.story({
  name: "Linked gauge",
  parameters: { a11y: { test: "todo" } },
  render: (args) =>
    draw(
      [
        {
          type: "gauges",
          items: [{ label: "Collected", value: 3, max: 4, href: "/invoices", note: "Of four invoices" }],
        },
      ],
      args,
    ),
  play: async ({ canvas, canvasElement }) => {
    const linked = one(canvasElement, "ui-gauge");
    await expect(linked).toMatchObject({ tone: "primary", label: "Collected: 3" });
    await expect(one(linked, "ui-link").href).toBe("/invoices");
    await expect(canvas.getByRole("meter", { name: "Collected: 3" })).toBeVisible();
    await expect(canvas.getByText("Of four invoices")).toBeVisible();
  },
});

export const Steps = meta.story({
  render: (args) =>
    draw(
      [
        { type: "steps", items: [{ label: "Ordered" }, { label: "Packed" }], current: 1 },
        { type: "steps", items: [{ label: "Shipped" }], current: 0, direction: "vertical", tone: "warning" },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-steps").map((s) => [s.scrollable, s.tone])).toEqual([
      [true, "primary"],
      [false, "warning"],
    ]);
  },
});

export const Charts = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "chart",
          title: "Paid",
          subhead: "By month",
          chart: {
            kind: "bars",
            labels: ["Jan"],
            series: [{ name: "Paid", values: [2000] }],
            format: { unit: "money", currency: "USD" },
            targetLabel: "Goal",
            ranges: [{ label: "All", points: 1 }],
          },
        },
        {
          type: "chart",
          label: "Orders",
          chart: { kind: "line", labels: ["Jan"], series: [{ name: "Orders", values: [3] }] },
        },
        { type: "chart", title: "Refunds", chart: { kind: "line", labels: [], series: [] } },
        { type: "chart", chart: { kind: "line", labels: [], series: [] } },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    const [paid, count, , bare] = all(canvasElement, "ui-chart");
    await expect(one(canvasElement, "ui-card").heading).toBe("Paid");
    await expect([paid!.label, count!.label, bare!.label]).toEqual(["Paid", "Orders", m.widget_blocks_chart()]);
    await expect(paid!.tickFormat!(0, 100)).toBe("0");
    await expect(paid!.tickFormat!(2000, 1000)).toBe(m.number_thousands({ amount: "2" }));
    await expect(paid!.tickFormat!(150, 50)).toBe("150");
    await expect(count!.tickFormat!(1.5, 0.5)).toBe("1.5");
    await expect(paid!.format!(1200)).toContain("1,200");
    await expect(count!.format!(3)).toBe("3");
    await expect(count!.ranges).toEqual([]);
  },
});

const mix = [
  { label: "Wholesale", value: 6 },
  { label: "Retail", value: 4 },
];

export const Ring = meta.story({
  render: (args) =>
    draw(
      [
        { type: "ring", parts: mix, max: 12, label: "Sales mix", center: "orders", total: "10" },
        { type: "ring", parts: mix },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-ring").map((r) => [r.label, r.centerLabel, r.totalText])).toEqual([
      ["Sales mix", "orders", "10"],
      ["", "", ""],
    ]);
  },
});

export const Funnel = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "funnel",
          stages: [
            { label: "Leads", value: 30 },
            { label: "Quotes", value: 12 },
          ],
          label: "Sales",
          step: "Next",
        },
        { type: "funnel", stages: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-funnel").map((f) => f.step)).toEqual(["Next", m.widget_blocks_funnel_step()]);
  },
});

export const Heatmap = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "heatmap",
          days: [
            { label: "2026-03-02", value: 1 },
            { label: "2026-03-03", value: 4 },
          ],
          label: "Deliveries",
          summary: "Busiest on Tuesday",
        },
        { type: "heatmap", days: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-heatmap").map((h) => h.label)).toEqual(["Deliveries", ""]);
  },
});

export const Bullet = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "bullet",
          items: [
            {
              label: "Days to pay",
              value: 2,
              max: 4,
              min: 1,
              target: 3,
              bands: [2],
              valueText: "2 days",
              targetText: "3 days",
              lowerIsBetter: true,
            },
            { label: "Orders shipped", value: 1, max: 2 },
          ],
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-bullet").map((b) => [b.min, b.lowerIsBetter])).toEqual([
      [1, true],
      [0, false],
    ]);
  },
});

export const Dial = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "dial",
          value: 2,
          max: 4,
          min: 1,
          valueText: "2 days",
          caption: "Average delay",
          label: "Delay",
          zones: [],
        },
        { type: "dial", value: 2, max: 4 },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-dial").map((d) => d.min)).toEqual([1, 0]);
  },
});

export const Waffle = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "waffle",
          value: 5,
          max: 10,
          valueText: "5 of 10",
          caption: "Vans out",
          label: "Fleet",
          parts: mix,
        },
        { type: "waffle" },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-waffle").map((w) => [w.value, w.max])).toEqual([
      [5, 10],
      [0, 100],
    ]);
  },
});

export const Share = meta.story({
  render: (args) =>
    draw(
      [
        { type: "share", parts: mix, total: "10", label: "Orders by channel" },
        { type: "share", parts: mix },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-share-bar").map((s) => s.label)).toEqual(["Orders by channel", ""]);
  },
});

export const Treemap = meta.story({
  render: (args) =>
    draw(
      [
        { type: "treemap", items: mix, total: "10", label: "Revenue by channel" },
        { type: "treemap", items: mix },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-treemap").map((s) => s.label)).toEqual(["Revenue by channel", ""]);
  },
});

export const Waterfall = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "waterfall",
          steps: [{ label: "Invoiced", value: 2000 }],
          fit: true,
          label: "Cash this month",
          format: { unit: "money" },
        },
        { type: "waterfall", steps: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    const [fall, plain] = all(canvasElement, "ui-waterfall");
    await expect([fall!.fit, plain!.fit]).toEqual([true, false]);
    await expect(fall!.format!(2000)).toBe("2,000");
  },
});

export const Quadrant = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "quadrant",
          points: [{ label: "Harbor Logistics", x: 4, y: 2 }],
          xLabel: "Orders",
          yLabel: "Days late",
          invertY: true,
          label: "Customers",
        },
        { type: "quadrant", points: [], xLabel: "Orders", yLabel: "Days late" },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-quadrant").map((q) => q.invertY)).toEqual([true, false]);
  },
});

export const Countdown = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "countdown",
          items: [{ label: "Quarterly tax", due: "2026-01-15" }],
          now: "2026-01-01",
          label: "Due dates",
        },
        { type: "countdown", items: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-countdown").map((c) => c.label)).toEqual(["Due dates", ""]);
  },
});

export const Month = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "month",
          month: "2026-03",
          events: [{ date: "2026-03-04", label: "Stock count" }],
          label: "March",
          weekStart: 1,
          today: "2026-03-02",
        },
        { type: "month", month: "2026-03", events: [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-month").map((c) => c.label)).toEqual(["March", ""]);
  },
});

export const WhatIf = meta.story({
  name: "What if",
  render: (args) =>
    draw(
      [
        {
          type: "whatif",
          label: "Price change",
          inputs: [{ key: "p", label: "Price rise", min: 0, max: 10, step: 1, value: 5, format: { unit: "pct" } }],
          compute: (v) => [{ label: "Margin", value: `${20 + (v.p ?? 0)}%` }],
        },
        { type: "whatif", inputs: [], compute: () => [] },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    const [whatif] = all(canvasElement, "ui-whatif");
    await expect(whatif!.inputs[0]!.format!(5)).toBe(m.number_pct({ value: "5.0" }));
  },
});

export const Alerts = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "alert",
          tone: "error",
          heading: "Late",
          text: "Two invoices are overdue.",
          actions: [{ label: "Chase" }],
        },
        { type: "alert", text: "The bank feed updates at noon." },
      ],
      args,
    ),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    await expect(all(canvasElement, "ui-alert").map((a) => a.tone)).toEqual(["error", "info"]);
    await userEvent.click(canvas.getByRole("button", { name: "Chase" }));
    await expect(args.run).toHaveBeenCalledWith({ label: "Chase" });
  },
});

export const EmptyStates = meta.story({
  name: "Empty states",
  render: (args) =>
    draw(
      [
        { type: "empty", heading: "No orders", description: "Add the first one.", icon: "inbox", tone: "error" },
        { type: "empty", heading: "Nothing here" },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(all(canvasElement, "ui-empty-state").map((e) => e.tone)).toEqual(["error", "neutral"]);
  },
});

export const TagsAndActions = meta.story({
  name: "Tags and actions",
  render: (args) =>
    draw(
      [
        { type: "tags", items: [{ label: "Wholesale" }] },
        { type: "actions", items: [{ label: "Save" }] },
      ],
      args,
    ),
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByText("Wholesale")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(args.run).toHaveBeenCalledWith({ label: "Save" });
  },
});

export const Choice = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "choice",
          param: "period",
          label: "Period",
          value: "month",
          options: [
            { value: "week", label: "Week", icon: "calendar" },
            { value: "month", label: "Month" },
          ],
        },
        {
          type: "choice",
          param: "region",
          label: "Region",
          value: "east",
          options: [
            { value: "west", label: "West" },
            { value: "east", label: "East" },
          ],
        },
      ],
      args,
      { params: { period: "week" } },
    ),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const [period, region] = all(canvasElement, "ui-button-group");
    await expect([period!.value, region!.value]).toEqual(["week", "east"]);
    await userEvent.click(canvas.getByRole("radio", { name: "Month" }));
    await expect(args.setParam).toHaveBeenCalledWith("period", "month");
  },
});

export const Timeline = meta.story({
  render: (args) =>
    draw(
      [
        {
          type: "timeline",
          items: [
            { time: "9:00", heading: "Sent", text: "To Harbor Logistics", icon: "send", tone: "success", done: true },
            { heading: "Signed", icon: "check" },
            { icon: "check" },
            { text: "Waiting for payment" },
          ],
        },
      ],
      args,
    ),
  play: async ({ canvasElement }) => {
    await expect(one(canvasElement, "ui-timeline").items.map((i) => !!i.icon)).toEqual([true, true, true, false]);
  },
});

export const Divider = meta.story({
  render: (args) =>
    draw([{ type: "text", text: "Morning" }, { type: "divider" }, { type: "text", text: "Afternoon" }], args),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-divider")).toBeTruthy();
  },
});

export const Custom = meta.story({
  name: "Custom element",
  render: (args) =>
    draw(
      [
        { type: "custom", element: "ui-speak", props: { text: "Your order ships today." }, key: "ship" },
        { type: "custom", element: "ui-speak" },
      ],
      args,
    ),
  play: async ({ canvasElement, args }) => {
    await expect(all(canvasElement, "ui-speak").map((s) => s.text)).toEqual(["Your order ships today.", ""]);
    await expect(args.mount).toHaveBeenCalledWith("ui-speak", { text: "Your order ships today." }, "ship");
    await expect(args.mount).toHaveBeenCalledWith("ui-speak", {}, undefined);
  },
});
