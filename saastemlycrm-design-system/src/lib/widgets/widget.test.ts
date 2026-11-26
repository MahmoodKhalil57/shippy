import { describe, expect, it } from "vite-plus/test";
import { m } from "../i18n/index.ts";
import type { ViewBlock } from "./schema.ts";
import {
  collectionPage,
  documentPage,
  eachSlots,
  eachTiles,
  figures,
  fill,
  globalPage,
  KEPT_LINE,
  widgets,
  type Widget,
  type WidgetScope,
} from "./widget.ts";

const scope: WidgetScope = {
  user: { id: "u1", role: "manager", name: "Maya Patel", age: 3 },
  doc: { id: "i 7", slug: "invoices" },
  params: { tab: "open" },
  today: "2026-03-16T09:00:00.000Z",
};

describe("fill", () => {
  it("puts whole values in place and encodes them inside text", () => {
    expect(
      fill(
        {
          id: "$doc.id",
          slug: "$doc.slug",
          who: "$user.id",
          role: "$user.role",
          tab: "$param.tab",
          path: "/invoices/$doc.id/$user.name?n=$user.age&x=$user.missing",
          other: "$doc.other",
        },
        scope,
      ),
    ).toEqual({
      id: "i 7",
      slug: "invoices",
      who: "u1",
      role: "manager",
      tab: "open",
      path: "/invoices/i%207/Maya%20Patel?n=3&x=",
      other: undefined,
    });
  });

  it("works through arrays and leaves other values alone", () => {
    const date = new Date(0);
    expect(fill(["$param.tab", 4, null, date, "$nothing.here"], scope)).toEqual([
      "open",
      4,
      null,
      date,
      "$nothing.here",
    ]);
    expect(fill(["$param.tab"], { user: { id: "" }, params: {} })).toEqual([undefined]);
    expect(fill("$doc.id", { user: { id: "" }, params: {} })).toBeUndefined();
  });

  it("reads days relative to the project's today", () => {
    expect(fill("$today", scope)).toBe("2026-03-16T00:00:00.000Z");
    expect(fill("$today+3d", scope)).toBe("2026-03-19T00:00:00.000Z");
    expect(fill("$today-2w", scope)).toBe("2026-03-02T00:00:00.000Z");
    const real = new Date();
    const midnight = Date.UTC(real.getUTCFullYear(), real.getUTCMonth(), real.getUTCDate());
    expect(fill("$today", { user: { id: "" }, params: {} })).toBe(new Date(midnight).toISOString());
  });
});

describe("figures", () => {
  it("makes one tile per label with its own figure", () => {
    const w = figures<{ n: number }, "Open" | "Paid">({
      labels: ["Open", "Paid"],
      name: (k) => `${k} invoices`,
      format: (d) => [
        { key: "Open", label: "Open now", value: String(d.n) },
        { label: "Paid", value: "4" },
      ],
    });
    expect(w).toMatchObject({ size: "s", width: 4, skeleton: "stats" });
    expect(eachSlots(w as Widget, scope)).toEqual(["Open", "Paid"]);
    expect((w.each!.tiles as (s: WidgetScope) => number)(scope)).toBe(2);
    const tiles = eachTiles(w, { n: 9 }, scope);
    expect(tiles.map((t) => t.key)).toEqual(["Open", "Paid"]);
    expect(tiles[0]!.widget.render({ n: 9 }, scope)).toEqual([
      { type: "stats", size: "md", items: [{ key: "Open", label: "Open now", value: "9" }] },
    ]);
    expect(w.each!.key({ label: "", value: "1" }, 2)).toBe("2");
    expect(w.each!.title({}, 0)).toBe("");
  });

  it("names empty slots and shrinks one-row figures", () => {
    const w = figures<null>({ rows: 1, labels: () => ["Late"], format: () => [] });
    const [late] = eachTiles(w, null, scope);
    expect(late!.widget.render(null, scope)).toEqual({
      type: "stats",
      size: "sm",
      items: [{ label: "Late", value: "—" }],
    });
  });
});

describe("eachSlots and eachTiles", () => {
  const card = (text: string): ViewBlock => ({ type: "text", text });

  it("has no tiles without an each", () => {
    const w: Widget = { size: "s", render: () => null };
    expect(eachSlots(w, scope)).toEqual([]);
    expect(eachTiles(w, null, scope)).toEqual([]);
  });

  it("counts tiles from a number or a function, at least one", () => {
    const of = (tiles: number | (() => number)): Widget => ({
      size: "s",
      each: { tiles, items: () => [], key: String, title: String, render: () => null },
    });
    expect(eachSlots(of(2.7), scope)).toEqual(["1", "2"]);
    expect(
      eachSlots(
        of(() => 0),
        scope,
      ),
    ).toEqual(["1"]);
  });

  it("keeps extra items in the last tile under a more card", () => {
    const w: Widget<string[]> = {
      title: "Tasks",
      size: "m",
      rows: 4,
      each: {
        tiles: 2,
        items: (d) => d,
        key: (x) => x,
        title: (x) => `Task ${x}`,
        subhead: (x) => (x === "a" ? "" : `sub ${x}`),
        head: (x) => ({ count: x.length }),
        render: (x) => (x === "c" ? null : card(x)),
      },
    };
    const crowded = eachTiles(w, ["a", "b", "c", "d"], scope)[1]!;
    expect((crowded.widget.render(null as never, scope) as ViewBlock[])[1]).toMatchObject({
      blocks: [
        { type: "heading", text: "Task c" },
        { type: "divider" },
        { type: "heading", text: "Task d" },
        card("d"),
      ],
    });
    const [one, two] = eachTiles(w, ["a", "b", "c"], scope);
    expect(one).toMatchObject({ key: "1", widget: { title: "Task a", subhead: KEPT_LINE, size: "m", rows: 4 } });
    expect(one!.widget.render(null as never, scope)).toEqual([card("a")]);
    expect(one!.widget.head!(null as never, scope)).toEqual({ count: 1 });
    expect(two!.widget).toMatchObject({ title: "Task b", subhead: "sub b" });
    expect(two!.widget.render(null as never, scope)).toEqual([
      card("b"),
      {
        type: "card",
        heading: m.widget_more_heading({ count: 1 }),
        blocks: [{ type: "heading", text: "Task c" }],
      },
    ]);
  });

  it("puts named items in their slot and the rest in the last", () => {
    const w: Widget<{ at: string; n: string }[]> = {
      size: "s",
      empty: { heading: "Nothing yet", description: "Add one" },
      each: {
        tiles: 0,
        slots: () => ["north", "south", "other"],
        slotOf: (x) => x.at,
        items: (d) => d,
        key: (x) => x.n,
        title: (x) => x.n,
        render: (x) => [card(x.n), card(`${x.n}!`)],
      },
    };
    const tiles = eachTiles(
      w,
      [
        { at: "south", n: "S1" },
        { at: "west", n: "W1" },
        { at: "north", n: "N1" },
        { at: "south", n: "S2" },
      ],
      scope,
    );
    expect(tiles.map((t) => t.widget.title)).toEqual(["N1", "S1", "W1"]);
    expect(tiles[1]!.widget.render(null as never, scope)).toEqual([
      card("S1"),
      card("S1!"),
      {
        type: "card",
        heading: m.widget_more_heading({ count: 1 }),
        blocks: [{ type: "heading", text: "S2" }, card("S2"), card("S2!")],
      },
    ]);
    const empty = eachTiles(w, [], scope);
    expect(empty[0]!.widget).toMatchObject({ title: "", subhead: undefined });
    expect(empty[0]!.widget.render(null as never, scope)).toEqual([
      { type: "empty", heading: "Nothing yet", description: "Add one" },
    ]);
  });

  it("shows a vacant block or the default empty state for empty slots", () => {
    const base = { items: () => [], key: String, title: String, render: () => null };
    const vacant: Widget = {
      size: "s",
      each: { ...base, tiles: 1, vacant: () => card("Not yet") },
    };
    expect(eachTiles(vacant, null, scope)[0]!.widget.render(null, scope)).toEqual(card("Not yet"));
    const plain: Widget = { size: "s", title: "Board", each: { ...base, tiles: 1, subhead: () => "" } };
    const [t] = eachTiles(plain, null, scope);
    expect(t!.widget).toMatchObject({ title: "Board", subhead: KEPT_LINE });
    expect(t!.widget.render(null, scope)).toEqual([
      { type: "empty", heading: m.widget_empty(), description: undefined },
    ]);
  });
});

describe("pages", () => {
  it("wraps a page in the widgets host", () => {
    expect(widgets({ widgets: [] })).toEqual({ path: "app-widgets", clientProps: { page: { widgets: [] } } });
  });

  it("builds a collection page with widgets around it", () => {
    const note: Widget = { size: "s", render: () => null };
    expect(collectionPage("invoices", { before: [note], rows: 9, layout: "cards" })).toEqual({
      Component: widgets({
        widgets: [note, { collection: { home: true, layout: "cards", collection: "invoices" }, size: "full", rows: 9 }],
      }),
      path: "/collections/invoices",
      nav: "auto",
    });
    expect(collectionPage("invoices", { path: "/money", nav: false, after: [note] })).toEqual({
      Component: widgets({
        widgets: [{ collection: { home: true, collection: "invoices" }, size: "full", rows: undefined }, note],
      }),
      path: "/money",
    });
    expect(collectionPage("invoices", { nav: { group: "Money", label: "Bills" } }).nav).toEqual({
      group: "Money",
      label: "Bills",
    });
  });

  it("builds document and global pages", () => {
    const note: Widget = { size: "s", render: () => null };
    expect(documentPage("invoices", { tab: "lines", before: [note], after: [note] })).toEqual({
      Component: widgets({
        widgets: [
          note,
          { document: { home: true, tab: "lines", collection: "invoices", id: "$param.id" }, size: "full" },
          note,
        ],
      }),
      path: "/collections/invoices/:id",
    });
    expect(documentPage("invoices", { path: "/bill/:id" }).path).toBe("/bill/:id");
    expect(globalPage("settings")).toEqual({
      Component: widgets({ widgets: [{ global: { home: true, global: "settings" }, size: "full" }] }),
      path: "/globals/settings",
      nav: "auto",
    });
    expect(globalPage("settings", { path: "/setup", nav: false, before: [note], after: [note] })).toEqual({
      Component: widgets({ widgets: [note, { global: { home: true, global: "settings" }, size: "full" }, note] }),
      path: "/setup",
    });
    expect(globalPage("settings", { nav: { group: "Setup", label: "Settings" } }).nav).toEqual({
      group: "Setup",
      label: "Settings",
    });
  });
});
