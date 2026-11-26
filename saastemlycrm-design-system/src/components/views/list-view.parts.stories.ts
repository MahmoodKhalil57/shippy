import preview from "#.storybook/preview";
import type { CollectionConfig } from "payload";
import { expect, fn, spyOn, waitFor } from "storybook/test";
import { testDashboard } from "../../../.storybook/dashboard.ts";
import {
  calls,
  config,
  doc,
  fire,
  listPage,
  listRender,
  listTemplate,
  mountList,
  peek,
  readAccess,
  seed,
  settled,
  show,
  shown,
  tasks,
  TODAY,
  unmount,
  withTasks,
  type ListOptions,
} from "../../../.storybook/fixtures/list-view.ts";
import type { Doc, MockConfig } from "../../lib/contracts/config.ts";
import type { Dashboard } from "../../lib/dashboard/context.ts";
import type { CollectionViewSpec, WidgetScope } from "../../lib/widgets/widget.ts";
import type { ViewContext } from "../widgets/registry.ts";
import "./list-view.ts";

class AroundPart extends HTMLElement {
  reload = fn();
}
if (!customElements.get("test-around-part")) customElements.define("test-around-part", AroundPart);

const meta = preview.meta({
  component: "dashboard-list-view",
  parameters: { layout: "fullscreen" },
  beforeEach: listPage,
  render: listRender(),
});

const around: CollectionConfig = {
  ...tasks,
  slug: "around",
  admin: {
    ...tasks.admin,
    components: {
      beforeList: ["test-around-part", 42],
      afterList: [{ path: "test-around-part", clientProps: { tone: "info" } }],
    },
  } as never,
};
const withAround = { ...config, collections: [...config.collections, around] };

export const PartsAround = meta.story({
  name: "Mounts parts around the list and reloads them",
  render: listRender({
    slug: "around",
    config: withAround,
    spec: { layout: "board" },
    data: { docs: { around: [doc("a")] } },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const parts = [...view.querySelectorAll<AroundPart>("test-around-part")];
    await expect(parts).toHaveLength(2);
    await expect((parts[1] as unknown as { tone: string; slug: string }).tone).toBe("info");
    await expect((parts[0] as unknown as { slug: string }).slug).toBe("around");
    fire(view.querySelector("ui-kanban")!, "ui-move", { key: "a", to: "done" });
    await waitFor(() => expect(parts[0]!.reload).toHaveBeenCalled());
    view.requestUpdate();
    await view.updateComplete;
    await expect([...view.querySelectorAll("test-around-part")]).toEqual(parts);
    const hidden = await show({
      slug: "around",
      config: withAround,
      spec: { hide: ["around"] },
      data: { docs: { around: [] } },
    });
    await expect(hidden.view.querySelector("test-around-part")).toBeNull();
    unmount();
  },
});

const acting: CollectionConfig = {
  ...tasks,
  slug: "acting",
  custom: {
    ...tasks.custom,
    actions: [
      { label: "Approve", call: { path: "/approve" }, when: { status: { equals: "planned" } } },
      { label: "Admins only", call: { path: "/admin" }, roles: ["admin"] },
    ],
  },
} as CollectionConfig;
const withActing = { ...config, collections: [...config.collections, acting] };
const scope: WidgetScope = { user: { id: "p1", role: "member" }, params: {} };

let finish = () => {};
const run = fn((a: { label: string }) => (a.label === "Approve" ? new Promise<void>((r) => (finish = r)) : undefined));
const ctx = { run, setParam: fn(), reload: fn(), params: {}, mount: fn() } as unknown as ViewContext;
type Cards = { records: { actions?: unknown }[] };

export const RecordActions = meta.story({
  name: "Runs a record's action and reloads when it finishes",
  beforeEach: () => {
    run.mockClear();
  },
  render: listRender({
    slug: "acting",
    config: withActing,
    ctx,
    scope,
    spec: { layout: "cards" },
    data: { docs: { acting: [doc("a", { status: "planned" }), doc("b", { status: "done" })] } },
  }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    const cards = view.querySelector("ui-record-cards") as unknown as Cards;
    await expect(cards.records[0]!.actions).toBeDefined();
    await expect(cards.records[1]!.actions).toBeUndefined();
    const options = calls(dashboard, "find")
      .filter((c) => c.args[0] === "acting")
      .at(-1)!.args[1] as { select?: unknown };
    await expect(options.select).toBeUndefined();
    const approve = [...view.querySelectorAll("ui-button")].find((b) => b.textContent!.trim() === "Approve")!;
    approve.click();
    await expect(run).toHaveBeenCalledTimes(1);
    const before = calls(dashboard, "find").length;
    finish();
    await waitFor(() => expect(calls(dashboard, "find").length).toBeGreaterThan(before));
    const runner = (view as unknown as { _runner: ViewContext })._runner;
    await expect((view as unknown as { _runner: ViewContext })._runner).toBe(runner);
    await expect(runner.run({ label: "Other" } as never)).toBeUndefined();
    view.ctx = { ...ctx };
    await view.updateComplete;
    await expect((view as unknown as { _runner: ViewContext })._runner).not.toBe(runner);
  },
});

export const NoActions = meta.story({
  name: "No actions in the table or without a scope",
  render: listRender({
    slug: "acting",
    config: withActing,
    scope,
    data: { docs: { acting: [doc("a", { status: "planned" })] } },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-table")).not.toBeNull();
    const cards = await show({
      slug: "acting",
      config: withActing,
      spec: { layout: "cards" },
      data: { docs: { acting: [doc("a", { status: "planned" })] } },
    });
    await expect((cards.view.querySelector("ui-record-cards") as unknown as Cards).records[0]!.actions).toBeUndefined();
    const plain = await show({ spec: { layout: "cards" }, scope, ctx: { run: fn() } as never });
    await expect((plain.view.querySelector("ui-record-cards") as unknown as Cards).records[0]!.actions).toBeUndefined();
    unmount();
  },
});

export const NoToolbar = meta.story({
  name: "Drops the toolbar when every control is hidden",
  render: listRender({
    spec: { hide: ["filters", "layouts", "columns", "export", "search", "pager", "select", "header", "create"] },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-toolbar")).toBeNull();
    await expect(view.querySelector("ui-search")).toBeNull();
    await expect(view.querySelector("ui-pagination")).toBeNull();
    await expect(view.querySelector("ui-page-header")).toBeNull();
    await expect(view.querySelector("ui-table")!.hasAttribute("selectable")).toBe(false);
  },
});

const someHidden: CollectionViewSpec["hide"] = ["filters", "layouts", "columns", "export"];

export const KeptToolbar = meta.story({
  name: "Keeps the toolbar for cards and for creating in a tile",
  render: listRender({ spec: { hide: someHidden, layout: "cards" } }),
  play: async ({ canvasElement }) => {
    const cards = await shown(canvasElement);
    await expect(cards.view.querySelector("ui-toolbar")).not.toBeNull();
    await expect(cards.view.querySelector("ui-select[leading=Sort]")).toBeNull();
    const tile = await show({ tile: true, spec: { hide: someHidden } });
    await expect(tile.view.querySelector("ui-toolbar")).not.toBeNull();
    const readOnly = await show({ tile: true, access: readAccess, spec: { hide: someHidden } });
    await expect(readOnly.view.querySelector("ui-toolbar")).toBeNull();
    unmount();
  },
});

export const OffHome = meta.story({
  name: "Titles a page off the collection's home without breadcrumbs",
  render: listRender({ spec: { home: false } }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-breadcrumbs")).toBeNull();
    const nothingToCreate: MockConfig = { ...config, admin: { custom: { today: TODAY } } };
    const plain = await show({ config: nothingToCreate });
    await expect(plain.view.querySelector("ui-page-header ui-button")).toBeNull();
    unmount();
  },
});

export const NewDashboard = meta.story({
  name: "Follows a new dashboard and stops listening when removed",
  play: async ({ canvasElement }) => {
    const { view, host } = await shown(canvasElement);
    const next = testDashboard({ config, data: { docs: { tasks: [doc("only")] } } });
    const provider = host.querySelector("dashboard-provider") as unknown as { dashboard: Dashboard };
    provider.dashboard = next;
    await waitFor(() => expect(view.querySelector("ui-pagination")).not.toBeNull());
    next.stores.preferences.set({ listDensity: "-1" });
    await view.updateComplete;
    await expect(view.querySelector("ui-table")!.getAttribute("density")).toBe("-1");
    view.slug = "notes";
    view.spec = { collection: "notes" };
    await settled(view);
    await expect(peek(view).result!.docs).toEqual([]);
    const update = spyOn(view, "requestUpdate");
    view.remove();
    next.stores.preferences.set({ listDensity: "0" });
    await expect(update).not.toHaveBeenCalled();
    host.querySelector("dashboard-provider")!.append(view);
    next.stores.preferences.set({ listDensity: "-2" });
    await expect(update).toHaveBeenCalled();
    update.mockRestore();
    await settled(view);
  },
});

const plain: CollectionConfig = {
  slug: "plain",
  admin: { useAsTitle: "heading" },
  custom: { list: { board: "stage" } },
  fields: [
    { name: "heading", type: "text" },
    { name: "stage", type: "select", options: ["Open", "Closed"] },
    {
      name: "kind",
      type: "select",
      options: [
        { label: "Small", value: "s" },
        { label: "Large", value: "l" },
      ],
    },
  ],
};
const coded: CollectionConfig = {
  slug: "coded",
  admin: { useAsTitle: "id", defaultColumns: ["heading"] },
  fields: [{ name: "heading", type: "text" }],
};
const labelled: CollectionConfig = {
  slug: "labelled",
  admin: { useAsTitle: "label", defaultColumns: ["heading"] },
  fields: [{ name: "heading", type: "text" }],
};
const shaped = { ...config, collections: [...config.collections, plain, coded, labelled] };
const rows = [
  { id: "1", heading: "First", stage: "Open", kind: "l" },
  { id: "2", heading: "Second", stage: "Closed", kind: "x" },
] as Doc[];
const plainOf = (o: ListOptions): ListOptions => ({
  slug: "plain",
  config: shaped,
  data: { docs: { plain: rows } },
  ...o,
});

export const PlainSelectTags = meta.story({
  name: "Tags a plain select by its option's place",
  render: listRender(plainOf({ spec: { columns: ["heading", "kind"] } })),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const tags = [...view.querySelectorAll("tbody ui-tag")] as unknown as { hue: number; textContent: string }[];
    await expect(tags.map((t) => [t.hue, t.textContent])).toEqual([[1, "Large"]]);
  },
});

export const PlainBoard = meta.story({
  name: "Boards and groups by a plain select, without people",
  render: listRender(plainOf({ spec: { layout: "board" } })),
  play: async ({ canvasElement }) => {
    const board = await shown(canvasElement);
    const kanban = board.view.querySelector("ui-kanban") as unknown as {
      columns: { label: string; items: { person?: unknown }[] }[];
    };
    await expect(kanban.columns.map((c) => c.label)).toEqual(["Open", "Closed"]);
    await expect(kanban.columns[0]!.items[0]!.person).toBeUndefined();
    const groups = await show(plainOf({ spec: { layout: "groups" } }));
    await expect(
      [...groups.view.querySelectorAll("ui-record-list")].map((l) => (l as unknown as { label: string }).label),
    ).toEqual(["Open", "Closed"]);
    unmount();
  },
});

export const FirstColumnLink = meta.story({
  name: "Links the first shown column when the title is not shown",
  render: listRender({
    slug: "coded",
    config: shaped,
    data: { docs: { coded: [{ id: "c1", heading: "Hello" }] as Doc[] } },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("tbody a")!.getAttribute("href")).toBe("/collections/coded/c1");
    await expect(view.querySelector("ui-search")!.getAttribute("label")).toBe("Search by id");
    const l = await show({ slug: "labelled", config: shaped, data: { docs: { labelled: [] } } });
    await expect(l.view.querySelector("ui-search")!.getAttribute("label")).toBe("Search by label");
    unmount();
  },
});

export const BasePath = meta.story({
  name: "Opens records under a base path, ignoring the root",
  render: listRender({ base: "/admin" }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const root = document.createElement("a");
    root.href = "/admin";
    view.append(root);
    root.click();
    await expect(peek(view).openId).toBe("");
    view.querySelector<HTMLAnchorElement>('a[href="/admin/collections/tasks/t1"]')!.click();
    await expect(peek(view).openId).toBe("t1");
    root.remove();
  },
});

export const BoardPeople = meta.story({
  name: "Board people only when known, no move menu without access",
  render: listRender({
    spec: { layout: "board", columns: ["title", "owner", "amount"] },
    access: { canAccessAdmin: true, collections: {}, globals: {} },
    data: withTasks([doc("a"), doc("b", { owner: null })]),
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const kanban = view.querySelector("ui-kanban") as unknown as {
      movable: boolean;
      columns: { items: { key: string; person?: { name: string }; trailing?: unknown }[] }[];
    };
    const items = kanban.columns.flatMap((c) => c.items);
    await expect(items.map((i) => i.person?.name)).toEqual(["Avery Stone", undefined]);
    await expect(items.every((i) => i.trailing === undefined)).toBe(true);
    await expect(kanban.movable).toBe(false);
  },
});

let failMove = () => {};

export const GoneBoard = meta.story({
  name: "Does not put back a card whose list has gone",
  render: listRender({
    spec: { layout: "board" },
    prepare: (d) => (d.data.update = () => new Promise((_, reject) => (failMove = () => reject(new Error("Gone"))))),
  }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    fire(view.querySelector("ui-kanban")!, "ui-move", { key: "t1", to: "done" });
    view.slug = "notes";
    view.spec = { collection: "notes" };
    await view.updateComplete;
    failMove();
    await waitFor(() => expect(dashboard.notices.at(-1)!.tone).toBe("error"));
    await expect(view.querySelector("ui-kanban")).toBeNull();
    await settled(view);
  },
});

const hanging = (d: Dashboard) => (d.data.find = () => new Promise(() => {}));

export const LoadingLists = meta.story({
  name: "Loading and empty lists and chips",
  render: listRender({ spec: { layout: "list" }, prepare: hanging }),
  play: async ({ canvasElement }) => {
    for (const layout of ["list", "compact"] as const) {
      const dashboard = testDashboard({ config, data: seed() });
      hanging(dashboard);
      const view =
        layout === "list"
          ? canvasElement.querySelector("dashboard-list-view")!
          : (await mountList(listTemplate({ spec: { layout } }), dashboard)).host.querySelector("dashboard-list-view")!;
      await view.updateComplete;
      await expect(view.querySelectorAll("ui-skeleton").length).toBeGreaterThan(0);
      const empty = await show({ spec: { layout }, data: { docs: {} } });
      await expect(empty.view.textContent).toContain("No tasks yet");
    }
    unmount();
  },
});

export const WithdrawnAccess = meta.story({
  name: "Hides deleting a selection once access is withdrawn",
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    fire(view.querySelector("ui-table")!, "ui-select", { selected: [0] });
    await view.updateComplete;
    view.access = readAccess;
    await view.updateComplete;
    await expect(view.textContent).toContain("1 selected");
    await expect([...view.querySelectorAll("ui-button")].some((b) => b.textContent!.includes("Delete 1"))).toBe(false);
  },
});

const loose = {
  slug: "loose",
  admin: { useAsTitle: "heading" },
  custom: { list: { board: "phase", status: "phase" } },
  fields: [
    { name: "heading", type: "text" },
    { name: "phase", type: "text" },
    { name: "size", type: "select" },
  ],
} as CollectionConfig;
const withLoose = { ...config, collections: [...config.collections, loose] };
const looseData = { docs: { loose: [{ id: "1", heading: "One", phase: "early", size: "big" }] as Doc[] } };

export const LooseFields = meta.story({
  name: "Boards, groups and tags fields without options",
  render: listRender({ slug: "loose", config: withLoose, data: looseData, spec: { layout: "board" } }),
  play: async ({ canvasElement }) => {
    const board = await shown(canvasElement);
    const kanban = board.view.querySelector("ui-kanban") as unknown as { columns: { label: string }[] };
    await expect(kanban.columns.map((c) => c.label)).toEqual(["No phase"]);
    const groups = await show({ slug: "loose", config: withLoose, data: looseData, spec: { layout: "groups" } });
    await expect(groups.view.querySelectorAll("ui-record-list")).toHaveLength(1);
    const table = await show({
      slug: "loose",
      config: withLoose,
      data: looseData,
      spec: { columns: ["heading", "size"] },
    });
    await expect(table.view.querySelector("tbody ui-tag")).toBeNull();
    await expect(table.view.querySelector("tbody")!.textContent).toContain("big");
    unmount();
  },
});

export const TileBoardLevel = meta.story({
  name: "Titles board columns one level under a tile's heading",
  render: listRender({ tile: true, spec: { layout: "board" } }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(view.querySelector("ui-kanban")!.getAttribute("level")).toBe("3");
  },
});

export const SpecChange = meta.story({
  name: "Rereads its state when only the spec changes",
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const before = peek(view).result;
    view.spec = { collection: "tasks", sort: "title" };
    await settled(view);
    await expect(peek(view).query.sort).toBe("title");
    await expect(peek(view).result).not.toBe(before);
  },
});
