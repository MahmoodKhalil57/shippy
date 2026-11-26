import { describe, expect, it } from "vite-plus/test";
import { matchPath, pathParams, placeOf, placesOf, viewWidgets } from "./places.ts";
import { collectionPage, documentPage, globalPage, widgets, type Widget } from "./widget.ts";

const note: Widget = { size: "s", render: () => null };
const page = (path: string, ...list: Widget[]) => ({ path, Component: widgets({ widgets: list }) });

describe("viewWidgets and paths", () => {
  it("flattens grids and splits", () => {
    const inner: Widget = { size: "s", render: () => null };
    expect(viewWidgets(page("/", { grid: [note, { split: { main: [inner], side: [note] } }] }))).toEqual([
      note,
      inner,
      note,
    ]);
    expect(viewWidgets({ path: "/" })).toEqual([]);
    expect(viewWidgets({ path: "/", Component: "x" })).toEqual([]);
  });

  it("matches paths with params", () => {
    expect(pathParams("/a/:id/b/:tab")).toEqual(["id", "tab"]);
    expect(matchPath("/a/:id", "/a/x%20y")).toEqual({ id: "x y" });
    expect(matchPath("/a/:id", "/a")).toBeNull();
    expect(matchPath("/a/:id", "/b/1")).toBeNull();
    expect(matchPath("/a", "/a/")).toEqual({});
  });
});

describe("places", () => {
  const places = placesOf({
    money: collectionPage("invoices", { path: "/money", key: "inv" }),
    archive: page("/archive", { collection: { collection: "invoices" }, size: "full" }),
    bill: documentPage("invoices", { path: "/bill/:id" }),
    loose: page("/loose/:id", { document: { collection: "tasks", id: "$param.other" }, size: "full" }),
    fixed: page("/fixed", { document: { collection: "tasks", id: "t1" }, size: "full" }),
    setup: globalPage("settings", { path: "/setup", key: "s" }),
    later: globalPage("settings", { path: "/later" }),
    task: page("/task/:id", note, { document: { collection: "tasks", id: "$param.id" }, size: "full" }),
    other: page("/other", { collection: { collection: "tasks" }, size: "full" }),
  });

  it("finds the home of each collection, document and global", () => {
    expect(places.collections.get("invoices")).toEqual({ view: "money", path: "/money", key: "inv" });
    expect(places.documents.get("invoices")).toEqual({ view: "bill", path: "/bill/:id", key: "invoices", param: "id" });
    expect(places.documents.get("tasks")).toEqual({ view: "task", path: "/task/:id", key: "tasks", param: "id" });
    expect(places.globals.get("settings")).toEqual({ view: "setup", path: "/setup", key: "s" });
    expect(places.collections.get("tasks")).toEqual({ view: "other", path: "/other", key: "tasks" });
  });

  it("keeps the first place when none is home", () => {
    const p = placesOf({
      a: page("/a", { collection: { collection: "x" }, size: "full" }),
      b: page("/b", { collection: { collection: "x" }, size: "full" }),
    });
    expect(p.collections.get("x")?.view).toBe("a");
  });

  it("sends links to their place", () => {
    expect(placeOf("/collections/invoices", places)).toBe("/money");
    expect(placeOf("/collections/invoices?status=paid", places)).toBe("/money?inv[status]=paid");
    expect(placeOf("/collections/invoices/i 1", places)).toBe("/bill/i%201");
    expect(placeOf("/collections/invoices/i1/lines", places)).toBe("/bill/i1?invoices[tab]=lines");
    expect(placeOf("/collections/invoices/create", places)).toBe("/bill/create");
    expect(placeOf("/collections/missing", places)).toBeNull();
    expect(placeOf("/globals/settings", places)).toBe("/setup");
    expect(placeOf("/globals/settings/advanced", places)).toBe("/setup?s[tab]=advanced");
    expect(placeOf("/globals/missing", places)).toBeNull();
    expect(placeOf("/reports", places)).toBeNull();
  });

  it("opens a document in its list when it has no screen", () => {
    const p = placesOf({ list: collectionPage("customers", { path: "/people" }) });
    expect(placeOf("/collections/customers/c1", p)).toBe("/people?customers[open]=c1");
    expect(placeOf("/collections/customers/create", p)).toBeNull();
    expect(placeOf("/collections/missing/c1", p)).toBeNull();
  });
});
