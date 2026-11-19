import { matches as backendMatches, sortDocs as backendSort } from "mock-runner/payload";
import { matches as dashboardMatches, sortDocs as dashboardSort } from "saastemlycrm-design-system/payload";
import type { Where } from "payload";
import { describe, expect, it } from "vite-plus/test";

/**
 * The dashboard and the backend each read Payload's query language on their own (they import
 * nothing from each other): the form filters a relationship's choices with `where`, the backend
 * filters documents with it. This app is where the two meet, so it checks they agree.
 */

const docs = [
  {
    id: "a",
    status: "Open",
    total: 120,
    tags: ["urgent", "fuel"],
    owner: { id: "u1" },
    due: "2026-11-20",
    note: "Call back",
  },
  { id: "b", status: "Won", total: 80, tags: ["fuel"], owner: { id: "u2" }, due: "2026-11-18", note: null },
  { id: "c", status: "Lost", total: 300, tags: [], owner: null, due: "2026-12-01", note: "Price too high" },
];

const wheres: Where[] = [
  { status: { equals: "Open" } },
  { status: { not_equals: "Open" } },
  { status: { in: ["Open", "Won"] } },
  { status: { not_in: ["Won"] } },
  { tags: { all: ["urgent", "fuel"] } },
  { tags: { contains: "fuel" } },
  { note: { exists: false } },
  { note: { like: "call" } },
  { note: { not_like: "price" } },
  { total: { greater_than: 100 } },
  { total: { less_than_equal: 120 } },
  { due: { greater_than_equal: "2026-11-19" } },
  { "owner.id": { equals: "u1" } },
  { or: [{ status: { equals: "Won" } }, { total: { greater_than: 200 } }] },
  { and: [{ tags: { contains: "fuel" } }, { total: { less_than: 100 } }] },
];

describe("Payload's query language", () => {
  it.each(wheres.map((w) => [JSON.stringify(w), w]))("dashboard and backend agree on %s", (_, where) => {
    expect(docs.filter((d) => dashboardMatches(d, where)).map((d) => d.id)).toEqual(
      docs.filter((d) => backendMatches(d, where)).map((d) => d.id),
    );
  });

  it.each(["total", "-total", "status", "-due"])("and sort the same by %s", (sort) => {
    expect(dashboardSort([...docs], sort).map((d) => d.id)).toEqual(backendSort([...docs], sort).map((d) => d.id));
  });
});
