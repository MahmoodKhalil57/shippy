import { describe, expect, it } from "vite-plus/test";
import {
  collectionPage,
  documentPage,
  globalPage,
  links,
  matchPath,
  placeOf,
  placesOf,
  widgets,
} from "../src/contracts/index.ts";

/**
 * Where collections, documents and globals are (src/app/widgets/places.ts): nothing has a page of
 * its own, so a canonical address (`links()`) opens the view that holds it, or nothing.
 */
const link = links();
const views = {
  // A page of two lists: the first view to hold `cases`, but not its home.
  desk: {
    path: "/desk",
    Component: widgets({
      widgets: [
        { size: "full", collection: { collection: "cases", key: "open", where: { status: { equals: "Open" } } } },
        { size: "full", collection: { collection: "offers" } },
      ],
    }),
  },
  cases: collectionPage("cases"),
  case: documentPage("cases"),
  // A document widget whose id isn't a path parameter: not a record's page.
  pinned: {
    path: "/pinned",
    Component: widgets({ widgets: [{ size: "full", document: { collection: "offers", id: "o1" } }] }),
  },
  settings: globalPage("settings", { path: "/setup" }),
};
const places = placesOf(views);

describe("places", () => {
  it("finds each one's home: the view that says so, else the first that holds it", () => {
    expect(places.collections.get("cases")).toMatchObject({ view: "cases", key: "cases" });
    expect(places.collections.get("offers")).toMatchObject({ view: "desk", key: "offers" });
    expect(places.documents.get("cases")).toMatchObject({ path: "/collections/cases/:id", param: "id" });
    expect(places.documents.has("offers")).toBe(false);
    expect(places.globals.get("settings")).toMatchObject({ path: "/setup" });
  });

  it("opens an address where it's placed, its state under the widget's key", () => {
    expect(placeOf(link.list("cases", { status: "Open" }), places)).toBe(
      "/collections/cases?cases[filters][0][field]=status&cases[filters][0][operator]=equals&cases[filters][0][value]=Open",
    );
    expect(placeOf(link.doc("cases", "c 1"), places)).toBe("/collections/cases/c%201");
    expect(placeOf(link.doc("cases", "c1", "pricing"), places)).toBe("/collections/cases/c1?cases[tab]=pricing");
    expect(placeOf(link.create("cases"), places)).toBe("/collections/cases/create");
    // A record with no page of its own opens in its collection's sheet.
    expect(placeOf(link.doc("offers", "o2"), places)).toBe("/desk?offers[open]=o2");
    expect(placeOf(link.global("settings"), places)).toBe("/setup");
  });

  it("leads nowhere when no view holds it", () => {
    expect(placeOf(link.list("invoices"), places)).toBeNull();
    expect(placeOf(link.create("offers"), places)).toBeNull();
    expect(placeOf(link.global("theme"), places)).toBeNull();
  });

  it("matches a view's path and reads its parameters", () => {
    expect(matchPath("/collections/cases/:id", "/collections/cases/c%201")).toEqual({ id: "c 1" });
    expect(matchPath("/collections/cases/:id", "/collections/cases")).toBeNull();
    expect(matchPath("/desk", "/desk")).toEqual({});
  });
});
