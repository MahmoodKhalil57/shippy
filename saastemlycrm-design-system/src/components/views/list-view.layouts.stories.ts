import preview from "#.storybook/preview";
import type { CollectionConfig } from "payload";
import { expect, fn, waitFor } from "storybook/test";
import {
  at,
  config,
  doc,
  fire,
  listPage,
  listRender,
  notes,
  peek,
  seed,
  settled,
  show,
  shown,
  unmount,
  withTasks,
  type ListOptions,
} from "../../../.storybook/fixtures/list-view.ts";
import type { Doc } from "../../lib/contracts/config.ts";
import type { CollectionViewSpec } from "../../lib/widgets/widget.ts";
import "./list-view.ts";

const meta = preview.meta({
  component: "dashboard-list-view",
  parameters: { layout: "fullscreen" },
  beforeEach: listPage,
  render: listRender(),
});

export const UndrawableLayout = meta.story({
  name: "Falls back to the table for a layout it cannot draw",
  beforeEach: at("k[view]=board"),
  render: listRender({ slug: "notes" }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-table")).not.toBeNull();
  },
});

export const RememberedLayout = meta.story({
  name: "Uses the remembered layout",
  render: listRender({ spec: null, prepare: (d) => d.stores.preferences.set({ listView: { tasks: "compact" } }) }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-record-chips")).not.toBeNull();
    const select = view.querySelector<HTMLSelectElement>("ui-select[leading=View] select")!;
    select.value = "groups";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await settled(view);
    await expect(view.querySelectorAll("ui-record-list").length).toBeGreaterThan(1);
  },
});

export const FocusSteps = meta.story({
  name: "Steps through records in focus, mirrored in right-to-left",
  render: listRender({
    spec: { layout: "focus" },
    data: withTasks([doc("a", { owner: null, amount: null }), doc("b")]),
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const box = view.querySelector("ui-record-hero")!.parentElement!;
    const key = (k: string) => box.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
    await expect((view.querySelector("ui-record-hero") as unknown as { meta: string }).meta).toBe("");
    view.style.direction = "rtl";
    key("ArrowLeft");
    await view.updateComplete;
    await expect(peek(view).focusAt).toBe(1);
    await expect((view.querySelector("ui-record-hero") as unknown as { meta: string }).meta).toBe("With Avery Stone");
    key("ArrowRight");
    await view.updateComplete;
    await expect(peek(view).focusAt).toBe(0);
    view.style.direction = "";
    const buttons = box.querySelectorAll("ui-icon-button");
    (buttons[1] as HTMLElement).click();
    await view.updateComplete;
    await expect(peek(view).focusAt).toBe(1);
    (buttons[0] as HTMLElement).click();
    await view.updateComplete;
    await expect(peek(view).focusAt).toBe(0);
  },
});

const labels = (root: Element) =>
  [...root.querySelectorAll("ui-record-list")].map((l) => (l as unknown as { label: string }).label);

export const StatusGroups = meta.story({
  name: "Groups by status, unknown and empty last",
  render: listRender({
    spec: { layout: "groups" },
    data: withTasks([
      doc("a", { status: "done" }),
      doc("b", { status: "odd" }),
      doc("c", { status: null }),
      doc("d", { status: "planned" }),
    ]),
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(labels(view)).toEqual(["Planned", "Done", "odd", "No status"]);
  },
});

export const AmountRanking = meta.story({
  name: "Ranks by amount, leaving out empty amounts",
  render: listRender({
    spec: { layout: "ranking" },
    data: withTasks([doc("a", { amount: 5 }), doc("b", { amount: 0 }), doc("c", { amount: 50 })]),
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const list = view.querySelector("ui-record-list") as unknown as { records: { key: string; progress: number }[] };
    await expect(list.records.map((r) => [r.key, r.progress])).toEqual([
      ["c", 1],
      ["a", 0.1],
    ]);
    const none = await show({ spec: { layout: "treemap" }, data: withTasks([doc("z", { amount: 0 })]) });
    await expect((none.view.querySelector("ui-treemap") as unknown as { items: unknown[] }).items).toEqual([]);
    const tree = await show({ spec: { layout: "treemap" }, data: withTasks([doc("y", { amount: 7 })]) });
    await expect(
      (tree.view.querySelector("ui-treemap") as unknown as { items: { valueText: string }[] }).items[0]!.valueText,
    ).toBe("USD 7");
    unmount();
  },
});

export const ScatterPlot = meta.story({
  name: "Plots two numbers named by the spec",
  render: listRender({
    spec: { layout: "scatter", scatter: { x: "score", y: "effort", xMid: 5, yMid: 3, invertY: true } },
    data: withTasks([doc("a"), doc("b", { score: null }), doc("c", { effort: "x" })]),
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const q = view.querySelector("ui-quadrant") as unknown as {
      points: { label: string }[];
      xLabel: string;
      invertY: boolean;
    };
    await expect(q.points).toHaveLength(1);
    await expect(q.xLabel).toBe("Score");
  },
});

const lone: CollectionConfig = {
  ...notes,
  slug: "lone",
  fields: [
    { name: "heading", type: "text" },
    { name: "n", type: "number" },
  ],
};
const named: CollectionConfig = { ...lone, slug: "named", custom: { list: { scatter: ["n", "missing"] } } };
const two: CollectionConfig = { ...lone, slug: "two", fields: [...lone.fields, { name: "m", type: "number" }] };
const numbered = { ...config, collections: [...config.collections, lone, named, two] };
const numberedOf = (slug: string): ListOptions => ({
  slug,
  config: numbered,
  data: { docs: { [slug]: [{ id: "1", heading: "One", n: 1, m: 2 }] } },
});
const layoutsOf = (root: Element) =>
  [...root.querySelectorAll<HTMLOptionElement>("ui-select[leading=View] option")].map((o) => o.value);

export const ScatterOffer = meta.story({
  name: "Offers a scatter only with two number fields",
  render: listRender(numberedOf("lone")),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(layoutsOf(view)).not.toContain("scatter");
    await expect(layoutsOf((await show(numberedOf("named"))).view)).not.toContain("scatter");
    await expect(layoutsOf((await show(numberedOf("two"))).view)).toContain("scatter");
    unmount();
  },
});

export const MonthCalendar = meta.story({
  name: "Month calendar toned by status",
  render: listRender({
    spec: { layout: "calendar" },
    data: withTasks([
      doc("a", { status: "blocked" }),
      doc("b", { status: "archived" }),
      doc("c", { status: "active" }),
      doc("d", { status: "planned" }),
      doc("e", { status: "done" }),
      doc("f", { status: null }),
      doc("g", { due: null }),
    ]),
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const month = view.querySelector("ui-month") as unknown as { events: { tone?: string; label: string }[] };
    await expect(month.events.map((e) => e.tone)).toEqual([
      "error",
      "neutral",
      undefined,
      "warning",
      "success",
      undefined,
    ]);
    await expect(month.events.at(-1)!.label).toBe("Draft the launch plan");
  },
});

const dated = withTasks([
  doc("a"),
  doc("b", { due: null, status: null, amount: null }),
  doc("c", { due: "2026-05-01T00:00:00.000Z" }),
]);

export const DatedRecords = meta.story({
  name: "Timeline and heatmap of dated records",
  render: listRender({ spec: { layout: "timeline" }, data: dated }),
  play: async ({ canvasElement }) => {
    const t = await shown(canvasElement);
    await expect((t.view.querySelector("ui-timeline") as unknown as { items: unknown[] }).items).toHaveLength(2);
    const h = await show({ spec: { layout: "heatmap" }, data: dated });
    const cells = (h.view.querySelector("ui-heatmap") as unknown as { cells: { value: number }[] }).cells;
    await expect(cells.reduce((n, c) => n + c.value, 0)).toBe(2);
    const plain = await show({
      spec: { layout: "timeline" },
      data: withTasks([
        doc("d", {
          status: null,
          amount: null,
          owner: null,
          project: null,
          priority: null,
          notes: null,
          urgent: null,
          effort: null,
          score: null,
        }),
      ]),
    });
    await expect(
      (plain.view.querySelector("ui-timeline") as unknown as { items: { end: { text: string } }[] }).items[0]!.end.text,
    ).not.toContain("·");
    unmount();
  },
});

interface Chart {
  labels: string[];
  series: { name: string; values: number[] }[];
  kind: string;
  format: (v: number) => string;
}
const chartOf = (root: Element) => root.querySelector("ui-chart") as unknown as Chart;

export const DateCharts = meta.story({
  name: "Charts by date in days, weeks or months, or by a choice",
  render: listRender({ spec: { layout: "chart", chart: {} } }),
  play: async ({ canvasElement }) => {
    const chart = async (c: CollectionViewSpec["chart"], data = seed()) =>
      chartOf((await show({ spec: { layout: "chart", chart: c }, data })).view);
    const days = chartOf((await shown(canvasElement)).view);
    await expect(days.labels).toHaveLength(23);
    await expect(days.series[0]!.values.reduce((a, b) => a + b, 0)).toBe(12);
    const weeks = await chart({ bucket: "week", sum: "amount", kind: "line" });
    await expect(weeks.kind).toBe("line");
    await expect(weeks.series[0]!.name).toBe("Amount");
    await expect(weeks.format(1500)).toBe("USD 1,500");
    const months = await chart(
      { bucket: "month", sum: "effort" },
      withTasks([doc("a"), doc("b", { due: "2026-06-03T00:00:00.000Z", effort: null })]),
    );
    await expect(months.labels).toEqual(["Mar 26", "Apr 26", "May 26", "Jun 26"]);
    await expect(months.series[0]!.values).toEqual([1, 0, 0, 0]);
    await expect(months.format(2)).toBe("2");
    const ahead = await chart({ days: 7 });
    await expect(ahead.labels).toHaveLength(7);
    const empty = await chart({}, withTasks([doc("a", { due: null })]));
    await expect(empty.labels).toEqual([]);
    const byStatus = await chart(
      { by: "status" },
      withTasks([doc("a", { status: "done" }), doc("b", { status: "planned" }), doc("c", { status: null })]),
    );
    await expect(byStatus.labels).toEqual(["Planned", "Done"]);
    const byOwner = await chart(
      { by: "owner" },
      withTasks([
        doc("a"),
        doc("b", { owner: { id: "p2", name: "Jordan Lee" } }),
        doc("c", { owner: { id: "p2", name: "Jordan Lee" } }),
      ]),
    );
    await expect(byOwner.labels).toEqual(["Jordan Lee", "Avery Stone"]);
    const mixed = await chart(
      { by: "priority" },
      withTasks([
        doc("a", { priority: "High" }),
        doc("b", { priority: "Odd" }),
        doc("c", { priority: "Odd" }),
        doc("d", { priority: "Low" }),
      ]),
    );
    await expect(mixed.labels).toEqual(["Odd", "Low", "High"]);
    unmount();
  },
});

const staged: CollectionConfig = {
  slug: "plain",
  fields: [
    { name: "heading", type: "text" },
    { name: "stage", type: "select", options: ["Open", "Closed"] },
  ],
};
const bare: CollectionConfig = { slug: "bare", fields: [{ name: "heading", type: "text" }] };
const undated = { ...config, collections: [...config.collections, staged, bare] };

export const UndatedChart = meta.story({
  name: "Charts by status without a date, no chart without either",
  render: listRender({
    slug: "plain",
    config: undated,
    spec: { layout: "chart" },
    data: {
      docs: {
        plain: [
          { id: "1", heading: "A", stage: "Closed" },
          { id: "2", heading: "B", stage: "Open" },
        ],
      },
    },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(chartOf(view).labels).toEqual(["Open", "Closed"]);
    const b = await show({
      slug: "bare",
      config: undated,
      spec: { layout: "chart" },
      data: { docs: { bare: [{ id: "1", heading: "A" }] } },
    });
    await expect(b.view.querySelector("ui-chart")).toBeNull();
    unmount();
  },
});

const orders: CollectionConfig = {
  slug: "orders",
  admin: { useAsTitle: "code" },
  custom: { list: { status: "state", figure: "total", cardFields: ["vendor", "buyer", "total", "missing", "note"] } },
  fields: [
    { name: "code", type: "text" },
    { name: "state", type: "select", options: ["Open", "Paid"] },
    { name: "total", type: "number" },
    { name: "vendor", type: "relationship", relationTo: "projects" },
    { name: "buyer", type: "relationship", relationTo: "people" },
    { name: "note", type: "text" },
    { name: "nowhere", type: "relationship", relationTo: "ghosts" },
    { name: "links", type: "join", collection: "ghosts", on: "order" },
  ],
};
const withOrders = { ...config, collections: [...config.collections, orders] };
const ordersOf = (docs: Doc[], spec: Partial<CollectionViewSpec> = {}): ListOptions => ({
  slug: "orders",
  config: withOrders,
  spec: { layout: "list", ...spec },
  data: { docs: { orders: docs, projects: [] } },
});
interface Records {
  records: { monogram?: string; figure?: unknown; facts: { label: string }[]; status?: unknown; person?: string }[];
}
const recordsOf = (root: Element) => (root.querySelector("ui-record-list") as unknown as Records).records;

export const CodedRecords = meta.story({
  name: "Names coded records by their related record",
  render: listRender(
    ordersOf([
      {
        id: "1",
        code: "PO-1001",
        vendor: { id: "r1", name: "Website refresh" },
        buyer: { id: "p1", name: "Avery Stone" },
        total: 9,
        state: "Paid",
      },
      { id: "2", code: "PO-1002", vendor: { id: "r2", name: "AB-12" } },
      { id: "3", code: "Lunch order" },
    ] as Doc[]),
  ),
  play: async ({ canvasElement }) => {
    const [a, b, c] = recordsOf((await shown(canvasElement)).view);
    await expect(a!.monogram).toBe("Website refresh");
    await expect(a!.figure).toEqual({ label: "Total", value: "9" });
    await expect(a!.status).toEqual({ label: "Paid", tone: "success" });
    await expect(a!.person).toBe("Avery Stone");
    await expect(a!.facts.map((f) => f.label)).toEqual(["Vendor", "Note"].filter((l) => l !== "Note"));
    await expect(b!.monogram).toBeUndefined();
    await expect(c!.monogram).toBeUndefined();
  },
});

export const SpecFigure = meta.story({
  name: "Takes the figure from the spec",
  render: listRender(ordersOf([{ id: "1", code: "X", total: 3, note: "Rush" }] as Doc[], { figure: "note" })),
  play: async ({ canvasElement }) => {
    const [a] = recordsOf((await shown(canvasElement)).view);
    await expect(a!.figure).toEqual({ label: "Note", value: "Rush" });
  },
});

export const UnknownJoins = meta.story({
  name: "Counts joins of an unknown collection as items",
  render: listRender({
    slug: "orders",
    config: withOrders,
    spec: { columns: ["code", "links", "nowhere"] },
    data: {
      docs: {
        orders: [
          { id: "1", code: "X", links: { totalDocs: 2 } },
          { id: "2", code: "Y" },
        ] as Doc[],
      },
    },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("tbody")!.textContent).toContain("2 items");
    await expect(view.querySelector("tbody")!.textContent).toContain("0 items");
  },
});

const odd: CollectionConfig = { slug: "odd", admin: { useAsTitle: "label" }, fields: [{ name: "x", type: "text" }] };

export const SearchById = meta.story({
  name: "Searches by id without a title",
  render: listRender({ slug: "notes" }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-search")!.getAttribute("label")).toBe("Search by id");
    const o = await show({
      slug: "odd",
      config: { ...config, collections: [...config.collections, odd] },
      data: { docs: { odd: [] } },
    });
    await expect(o.view.querySelector("ui-search")!.getAttribute("label")).toBe("Search by label");
    unmount();
  },
});

interface Kanban {
  columns: { key: string; label: string; items: { key: string }[] }[];
}

export const BoardMoves = meta.story({
  name: "Moves a card, undoes it, keeps it when saving fails",
  render: listRender({
    spec: { layout: "board" },
    data: withTasks([doc("a", { status: "planned" }), doc("b", { status: "odd" }), doc("c", { status: null })]),
  }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    const kanban = view.querySelector("ui-kanban") as unknown as HTMLElement & Kanban;
    await expect(kanban.columns.map((c) => c.label)).toEqual([
      "Planned",
      "In progress",
      "Done",
      "Blocked",
      "Archived",
      "No status",
    ]);
    fire(kanban, "ui-move", { key: "a", to: "done" });
    await waitFor(() => expect(dashboard.notices.at(-1)!.message).toBe("Draft the launch plan → Done"));
    fire(kanban, "ui-move", { key: "a", to: "done" });
    fire(kanban, "ui-move", { key: "gone", to: "done" });
    fire(kanban, "ui-move", { key: "c", to: "" });
    dashboard.data.update = () => Promise.reject(new Error("Locked"));
    fire(kanban, "ui-move", { key: "c", to: "planned" });
    await waitFor(() =>
      expect(dashboard.notices.at(-1)).toMatchObject({
        message: "Draft the launch plan stays in no status: Locked",
        tone: "error",
      }),
    );
    await view.updateComplete;
    await expect(kanban.columns.at(-1)!.items.map((i) => i.key)).toEqual(["b", "c"]);
    const update = fn(() => Promise.resolve({ doc: {} as Doc, message: "" }));
    (dashboard.data as { update: unknown }).update = update;
    fire(kanban, "ui-move", { key: "a", to: "" });
    await waitFor(() => expect(dashboard.notices.at(-1)!.message).toBe("Draft the launch plan → no status"));
    await expect(update).toHaveBeenCalledWith("tasks", "a", { status: null });
  },
});

export const CardMenu = meta.story({
  name: "Moves from a card's menu",
  render: listRender({ spec: { layout: "board" } }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    fire(view.querySelector("ui-kanban ui-dropdown")!, "ui-select", { item: { value: "done" } });
    await waitFor(() => expect(dashboard.notices.at(-1)!.message).toBe("Draft the launch plan → Done"));
  },
});

export const BoardLoading = meta.story({
  name: "Loading board, then an empty one",
  render: listRender({ spec: { layout: "board" }, prepare: (d) => (d.data.find = () => new Promise(() => {})) }),
  play: async ({ canvasElement }) => {
    const view = canvasElement.querySelector("dashboard-list-view")!;
    await view.updateComplete;
    await expect(view.querySelector("ui-empty-state[loading]")).not.toBeNull();
    const empty = await show({ spec: { layout: "board" }, data: { docs: {} } });
    await expect(empty.view.textContent).toContain("No tasks yet");
    unmount();
  },
});
