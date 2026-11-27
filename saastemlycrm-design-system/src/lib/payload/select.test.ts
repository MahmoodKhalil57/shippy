import { describe, expect, it } from "vite-plus/test";
import { applySelect, parseJoins, parsePopulate, parseSelect, selects, type Select } from "./index.ts";

const deal = {
  id: "deal-1",
  title: "Warehouse lease",
  stage: "won",
  amount: 52000,
  owner: { id: "usr-1", name: "Ana", email: "ana@example.com" },
  lines: [
    { id: "l1", sku: "A-1", qty: 2, note: "rush" },
    { id: "l2", sku: "B-2", qty: 1, note: "" },
  ],
  layout: [{ blockType: "hero", heading: "Hello", image: "img-1" }],
};

describe("selects", () => {
  it("selects every field without a select", () => {
    expect(selects(undefined, "title")).toBe(true);
    expect(selects({}, "title")).toBe(true);
  });

  it("selects only the named fields when a select includes any field", () => {
    const select: Select = { title: true, owner: { name: true }, lines: { qty: false }, stage: false };
    expect(selects(select, "title")).toBe(true);
    expect(selects(select, "owner")).toBe(true);
    expect(selects(select, "lines")).toBe(false);
    expect(selects(select, "stage")).toBe(false);
    expect(selects(select, "amount")).toBe(false);
  });

  it("selects everything but the dropped fields when a select only excludes", () => {
    const select: Select = { amount: false, owner: { email: false } };
    expect(selects(select, "amount")).toBe(false);
    expect(selects(select, "owner")).toBe(true);
    expect(selects(select, "title")).toBe(true);
  });
});

describe("applySelect", () => {
  it("returns the document itself without a select", () => {
    expect(applySelect(deal, undefined)).toBe(deal);
    expect(applySelect(deal, {})).toBe(deal);
  });

  it("keeps the id, block types and the included fields, deeply and in every array row", () => {
    expect(
      applySelect(deal, {
        title: true,
        missing: true,
        stage: false,
        owner: { name: true },
        lines: { sku: true },
        layout: { heading: true },
        amount: { nested: true },
      }),
    ).toEqual({
      id: "deal-1",
      title: "Warehouse lease",
      owner: { id: "usr-1", name: "Ana" },
      lines: [
        { id: "l1", sku: "A-1" },
        { id: "l2", sku: "B-2" },
      ],
      layout: [{ blockType: "hero", heading: "Hello" }],
      amount: 52000,
    });
  });

  it("drops the excluded fields, deeply and in every array row", () => {
    expect(
      applySelect(deal, {
        amount: false,
        owner: { email: false },
        lines: { note: false },
        title: { nested: false },
        missing: { nested: false },
      } as Select),
    ).toEqual({
      id: "deal-1",
      title: "Warehouse lease",
      stage: "won",
      owner: { id: "usr-1", name: "Ana" },
      lines: [
        { id: "l1", sku: "A-1", qty: 2 },
        { id: "l2", sku: "B-2", qty: 1 },
      ],
      layout: deal.layout,
    });
  });

  it("does not change the document it is given", () => {
    const copy = structuredClone(deal);
    applySelect(deal, { amount: false, owner: { email: false } });
    applySelect(deal, { title: true });
    expect(deal).toEqual(copy);
  });
});

describe("parseSelect", () => {
  it("reads a query string select into booleans and nested selects", () => {
    expect(
      parseSelect({ title: "true", stage: true, amount: "false", notes: false, owner: { name: "true" }, junk: "1" }),
    ).toEqual({ title: true, stage: true, amount: false, notes: false, owner: { name: true } });
  });

  it("ignores anything that is not an object", () => {
    expect(parseSelect(undefined)).toBeUndefined();
    expect(parseSelect("title")).toBeUndefined();
    expect(parseSelect(["title"])).toBeUndefined();
  });
});

describe("parsePopulate", () => {
  it("reads a select per collection and an empty select for anything else", () => {
    expect(parsePopulate({ customers: { name: "true" }, users: "all" })).toEqual({
      customers: { name: true },
      users: {},
    });
  });

  it("ignores anything that is not an object", () => {
    expect(parsePopulate(null)).toBeUndefined();
  });
});

describe("parseJoins", () => {
  it("turns joins off with false", () => {
    expect(parseJoins(false)).toBe(false);
    expect(parseJoins("false")).toBe(false);
  });

  it("ignores anything else that is not an object", () => {
    expect(parseJoins(undefined)).toBeUndefined();
    expect(parseJoins("true")).toBeUndefined();
  });

  it("reads each join's query and turns single joins off", () => {
    expect(
      parseJoins({
        invoices: { limit: "5", page: 2, sort: "-createdAt", where: { status: { equals: "paid" } }, count: "true" },
        notes: { limit: "", page: null, sort: 3, where: "status", count: true },
        tasks: { count: "yes" },
        events: false,
        calls: "false",
        files: "all",
      }),
    ).toEqual({
      invoices: { limit: 5, page: 2, sort: "-createdAt", where: { status: { equals: "paid" } }, count: true },
      notes: { limit: undefined, page: undefined, sort: undefined, where: undefined, count: true },
      tasks: { limit: undefined, page: undefined, sort: undefined, where: undefined, count: false },
      events: false,
      calls: false,
      files: false,
    });
  });
});
