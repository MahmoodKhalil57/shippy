import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, fn, waitFor, type Mock } from "storybook/test";
import {
  at,
  calls,
  fire,
  fullAccess,
  ids,
  listPage,
  listRender,
  mountList,
  own,
  peek,
  settled,
  show,
  shown,
  titles,
  unmount,
  urlWith,
} from "../../../.storybook/fixtures/list-view.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import "./list-view.ts";

const meta = preview.meta({
  component: "dashboard-list-view",
  parameters: { layout: "fullscreen" },
  beforeEach: listPage,
  render: listRender(),
});

export const MalformedQuery = meta.story({
  name: "Reads its own query, ignoring what is malformed",
  beforeEach: at(
    [
      "k[q]=plan",
      "k[sort]=-amount",
      "k[page]=x",
      "k[limit]=33",
      "k[match]=or",
      "k[view]=nope",
      "k[month]=2026-3",
      "k[filters][0][field]=urgent",
      "k[filters][0][operator]=equals",
      "k[filters][0][value]=true",
      "k[filters][1][field]=urgent",
      "k[filters][1][operator]=not_equals",
      "k[filters][1][value]=false",
      "k[filters][2][field]=title",
      "k[filters][2][operator]=exists",
      "k[filters][3][operator]=equals",
    ].join("&"),
  ),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(peek(view).query).toEqual({
      q: "plan",
      sort: "-amount",
      page: 1,
      limit: "10",
      match: "or",
      view: undefined,
      month: undefined,
      filters: [
        { field: "urgent", operator: "equals", value: true },
        { field: "urgent", operator: "not_equals", value: false },
        { field: "title", operator: "exists", value: "" },
      ],
    });
  },
});

export const ValidQuery = meta.story({
  name: "Keeps a valid page, limit, layout and month",
  beforeEach: at("k[page]=2&k[limit]=25&k[view]=cards&k[month]=2026-02&k[filters]=x"),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(peek(view).query).toMatchObject({
      page: 2,
      limit: "25",
      view: "cards",
      month: "2026-02",
      match: "and",
      filters: [],
    });
  },
});

export const FromSpec = meta.story({
  name: "Starts from the spec",
  beforeEach: at("k=plain"),
  render: listRender({
    spec: {
      sort: "title",
      limit: 25,
      layout: "list",
      filters: [{ field: "urgent", operator: "equals", value: true }],
    },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(peek(view).query).toMatchObject({ sort: "title", limit: "25", view: "list" });
    await expect(ids(view)).toEqual(["t9", "t1", "t5"]);
  },
});

export const WholeQuery = meta.story({
  name: "Uses the whole query without a key of its own",
  beforeEach: at("q=laptops&other=1"),
  render: listRender({ stateKey: "", spec: null }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(titles(view)).toEqual(["Order new laptops"]);
    fire(view.querySelector("ui-select[leading=Rows]")!, "change");
    const select = view.querySelector<HTMLSelectElement>("ui-select[leading=Rows] select")!;
    select.value = "25";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(location.search).toBe("?q=laptops&limit=25");
  },
});

export const WritesDifferences = meta.story({
  name: "Writes only what differs from the defaults",
  beforeEach: at("other=1"),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const builder = view.querySelector("ui-filter-builder")!;
    const two = [
      { field: "urgent", operator: "equals", value: true },
      { field: "title", operator: "like", value: "plan" },
    ];
    fire(builder, "ui-change", { value: two, match: "or" });
    await settled(view);
    await expect(own().get("other")).toBe("1");
    await expect(own().get("k[match]")).toBe("or");
    fire(builder, "ui-change", { value: two.slice(0, 1), match: "or" });
    await settled(view);
    await expect(own().get("k[match]")).toBeNull();
    fire(builder, "ui-change", { value: [], match: "and" });
    await settled(view);
    await expect(location.search).toBe("?other=1");
  },
});

export const CachedPage = meta.story({
  name: "Shows a cached page at once, keeping the latest answer",
  play: async ({ canvasElement }) => {
    const first = await shown(canvasElement);
    const { dashboard } = first;
    const find = dashboard.data.find;
    let release!: () => void;
    dashboard.data.find = (...args) => new Promise((r) => (release = () => r(find(...args))));
    const second = await mountList(
      html`<dashboard-list-view .slug=${"tasks"} .stateKey=${"k"} .access=${fullAccess}></dashboard-list-view>`,
      dashboard,
    );
    const view = second.host.querySelector("dashboard-list-view")!;
    await waitFor(() => expect(peek(view).result?.docs).toHaveLength(10));
    await expect(peek(view).loading).toBe(true);
    release();
    await settled(view);
    await expect(ids(first.view)).toEqual(ids(view));
    unmount();
  },
});

export const OvertakenAnswer = meta.story({
  name: "Drops an answer a newer request overtook",
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    const find = dashboard.data.find;
    const pending: { ok: () => void; fail: () => void }[] = [];
    dashboard.data.find = (...args) =>
      new Promise((resolve, reject) =>
        pending.push({ ok: () => resolve(find(...args)), fail: () => reject(new Error("Too late")) }),
      );
    fire(view.querySelector("ui-pagination")!, "ui-change", { page: 2 });
    await view.updateComplete;
    fire(view.querySelector("ui-table")!, "ui-sort", { sort: "title" });
    await waitFor(() => expect(pending).toHaveLength(2));
    pending[0]!.fail();
    pending[1]!.ok();
    await settled(view);
    await expect(dashboard.notices).toEqual([]);
    pending.length = 0;
    fire(view.querySelector("ui-table")!, "ui-sort", { sort: "-title" });
    await waitFor(() => expect(pending).toHaveLength(1));
    fire(view.querySelector("ui-table")!, "ui-sort", { sort: "amount" });
    await waitFor(() => expect(pending).toHaveLength(2));
    pending[0]!.ok();
    pending[1]!.ok();
    await settled(view);
    await expect(peek(view).query.sort).toBe("amount");
  },
});

export const ShownFields = meta.story({
  name: "Asks only for the shown fields",
  render: listRender({ spec: { columns: ["title", "owner", "comments", "location"] } }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    const options = calls(dashboard, "find")
      .filter((c) => c.args[0] === "tasks")
      .at(-1)!.args[1] as Record<string, unknown>;
    await expect(options).toMatchObject({
      select: { title: true, owner: true, comments: true, location: true },
      populate: { people: { name: true } },
      joins: { comments: { count: true, limit: 1 } },
      limit: 10,
      page: 1,
      depth: 1,
    });
    await expect(view.querySelector("ui-table")).not.toBeNull();
  },
});

type Fields = { fields: { name: string; options?: unknown[] }[] };

export const RelatedChoices = meta.story({
  name: "Related records as filter choices",
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const fields = (view.querySelector("ui-filter-builder") as unknown as Fields).fields;
    await expect(fields.find((f) => f.name === "owner")!.options).toEqual([
      { label: "Avery Stone", value: "p1" },
      { label: "Jordan Lee", value: "p2" },
      { label: "Riley Park", value: "p3" },
    ]);
    await expect(fields.map((f) => f.name)).not.toContain("location");
    const failing = await show({
      prepare: (d) => {
        const find = d.data.find;
        d.data.find = (slug, o) => (slug === "tasks" ? find(slug, o) : Promise.reject(new Error("no")));
      },
    });
    const none = (failing.view.querySelector("ui-filter-builder") as unknown as Fields).fields;
    await expect(none.find((f) => f.name === "owner")!.options).toEqual([]);
    unmount();
  },
});

let releasePeople = () => {};

export const StaleChoices = meta.story({
  name: "Forgets related choices for a collection it left",
  render: listRender({
    prepare: (d) => {
      const find = d.data.find;
      d.data.find = (slug, o) =>
        slug === "people" ? new Promise((r) => (releasePeople = () => r(find(slug, o)))) : find(slug, o);
    },
  }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    view.slug = "notes";
    view.spec = { collection: "notes" };
    await settled(view);
    releasePeople();
    await frames(2);
    const fields = (view.querySelector("ui-filter-builder") as unknown as Fields).fields;
    await expect(fields.map((f) => f.name)).toEqual(["id", "heading", "updatedAt"]);
  },
});

export const FailedLoad = meta.story({
  name: "Reports a failed load",
  render: listRender({ prepare: (d) => (d.data.find = () => Promise.reject(new Error("Offline"))) }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    await expect(peek(view).result).toBeNull();
    await expect(dashboard.notices).toContainEqual({ message: "Offline", tone: "error", action: undefined });
  },
});

export const TranslatedSearch = meta.story({
  name: "Searches the typed words and their English",
  render: listRender({
    prepare: (d) => {
      d.ai.builtIn = {
        toEnglish: fn((q: string) => Promise.resolve(q === "plano" ? "plan" : q === "zz" ? "" : q)),
      } as never;
    },
  }),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    const toEnglish = (dashboard.ai.builtIn as unknown as { toEnglish: Mock }).toEnglish;
    const box = view.querySelector<HTMLInputElement>("ui-search input")!;
    const type = (text: string) => {
      box.value = text;
      box.dispatchEvent(new Event("input", { bubbles: true }));
    };
    type("p");
    type("pla");
    type("plano ");
    await waitFor(() => expect(peek(view).query.q).toBe("plano"));
    await settled(view);
    await expect(titles(view)).toEqual(["Draft the launch plan", "Plan the team offsite"]);
    type("zz");
    await waitFor(() => expect(peek(view).query.q).toBe("zz"));
    await settled(view);
    await expect(titles(view)).toEqual([]);
    toEnglish.mockRejectedValueOnce(new Error("no model"));
    type("laptops");
    await waitFor(() => expect(peek(view).query.q).toBe("laptops"));
    await settled(view);
    await expect(titles(view)).toEqual(["Order new laptops"]);
  },
});

export const ClearFromEmpty = meta.story({
  name: "Clears search and filters from the empty state",
  beforeEach: () => urlWith("k[q]=nothing-like-this"),
  render: listRender({ ai: { builtIn: { toEnglish: (q: string) => Promise.resolve(q) } as never } }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const clear = [...view.querySelectorAll("ui-button")].find((b) => b.textContent!.includes("Clear search"))!;
    clear.click();
    await settled(view);
    await expect(peek(view).query.q).toBe("");
    await expect(ids(view)).toHaveLength(10);
  },
});
