import { describe, expect, it } from "vite-plus/test";
import type { Where } from "payload";
import { matches, paginate, sortDocs, valuesAt } from "./index.ts";

const invoice = {
  id: "inv-1",
  number: "INV-001",
  status: "paid",
  total: 1200,
  paid: true,
  issuedAt: "2026-03-14T10:00:00.000Z",
  note: null,
  customer: { relationTo: "customers", value: { id: "cus-1", name: "Atlas Trading" } },
  owner: { id: "usr-1", name: "Ana" },
  tags: ["vip", "export"],
  empty: [],
  lines: [
    { sku: "A-1", qty: 2, product: { id: "p1" } },
    { sku: "B-2", qty: 5, product: { id: "p2" } },
  ],
};

describe("valuesAt", () => {
  it("reads a nested path", () => {
    expect(valuesAt(invoice, "owner.name")).toEqual(["Ana"]);
    expect(valuesAt(invoice, "status")).toEqual(["paid"]);
  });

  it("reads every row of an array", () => {
    expect(valuesAt(invoice, "lines.sku")).toEqual(["A-1", "B-2"]);
    expect(valuesAt(invoice, "lines.product.id")).toEqual(["p1", "p2"]);
  });

  it("reads one row of an array by its index", () => {
    expect(valuesAt(invoice, "lines.1.sku")).toEqual(["B-2"]);
    expect(valuesAt(invoice, "tags.0")).toEqual(["vip"]);
  });

  it("spreads array values and turns an empty array into one missing value", () => {
    expect(valuesAt(invoice, "tags")).toEqual(["vip", "export"]);
    expect(valuesAt(invoice, "empty")).toEqual([undefined]);
  });

  it("finds nothing below a primitive or inside rows that are not objects", () => {
    expect(valuesAt(invoice, "status.length")).toEqual([]);
    expect(valuesAt(invoice, "tags.name")).toEqual([]);
    expect(valuesAt(invoice, "missing")).toEqual([undefined]);
    expect(valuesAt(invoice, "missing.deeper")).toEqual([]);
  });
});

const where = (w: Record<string, unknown>) => w as Where;

describe("matches", () => {
  it("matches everything without a where", () => {
    expect(matches(invoice, undefined)).toBe(true);
    expect(matches(invoice, null)).toBe(true);
    expect(matches(invoice, {})).toBe(true);
  });

  it("skips conditions that are not objects", () => {
    expect(matches(invoice, where({ status: "draft" }))).toBe(true);
  });

  it("compares equals by id for relations, by number, by boolean text and by text", () => {
    expect(matches(invoice, where({ customer: { equals: "cus-1" } }))).toBe(true);
    expect(matches(invoice, where({ owner: { equals: "usr-1" } }))).toBe(true);
    expect(matches(invoice, where({ total: { equals: "1200" } }))).toBe(true);
    expect(matches(invoice, where({ total: { equals: 1199 } }))).toBe(false);
    expect(matches(invoice, where({ paid: { equals: "true" } }))).toBe(true);
    expect(matches(invoice, where({ paid: { equals: false } }))).toBe(false);
    expect(matches(invoice, where({ status: { equals: "paid" } }))).toBe(true);
    expect(matches(invoice, where({ number: { equals: 1 } }))).toBe(false);
    expect(matches({ id: "x", code: "7" }, where({ code: { equals: 7 } }))).toBe(true);
  });

  it("treats null and undefined as equal to each other only", () => {
    expect(matches(invoice, where({ note: { equals: null } }))).toBe(true);
    expect(matches(invoice, where({ missing: { equals: null } }))).toBe(true);
    expect(matches(invoice, where({ note: { equals: "x" } }))).toBe(false);
    expect(matches(invoice, where({ status: { equals: null } }))).toBe(false);
  });

  it("reads a relation whose value is an id rather than a document", () => {
    const doc = { id: "d", customer: { relationTo: "customers", value: "cus-9" }, plain: { value: 3 } };
    expect(matches(doc, where({ customer: { equals: "cus-9" } }))).toBe(true);
    expect(matches(doc, where({ plain: { equals: '{"value":3}' } }))).toBe(true);
  });

  it("negates equals", () => {
    expect(matches(invoice, where({ status: { not_equals: "draft" } }))).toBe(true);
    expect(matches(invoice, where({ status: { not_equals: "paid" } }))).toBe(false);
  });

  it("checks in and not_in against arrays, comma lists and single values", () => {
    expect(matches(invoice, where({ status: { in: ["draft", "paid"] } }))).toBe(true);
    expect(matches(invoice, where({ status: { in: "draft,paid" } }))).toBe(true);
    expect(matches(invoice, where({ total: { in: 1200 } }))).toBe(true);
    expect(matches(invoice, where({ status: { in: ["draft"] } }))).toBe(false);
    expect(matches(invoice, where({ status: { not_in: "draft,void" } }))).toBe(true);
    expect(matches(invoice, where({ status: { not_in: ["paid"] } }))).toBe(false);
  });

  it("requires every value of all to be present", () => {
    expect(matches(invoice, where({ tags: { all: ["vip", "export"] } }))).toBe(true);
    expect(matches(invoice, where({ tags: { all: "vip,export" } }))).toBe(true);
    expect(matches(invoice, where({ tags: { all: ["vip", "retail"] } }))).toBe(false);
  });

  it("checks that a value exists or not", () => {
    expect(matches(invoice, where({ status: { exists: true } }))).toBe(true);
    expect(matches(invoice, where({ status: { exists: "true" } }))).toBe(true);
    expect(matches(invoice, where({ note: { exists: true } }))).toBe(false);
    expect(matches({ id: "d", status: "" }, where({ status: { exists: true } }))).toBe(false);
    expect(matches(invoice, where({ note: { exists: false } }))).toBe(true);
    expect(matches({ id: "d", status: "" }, where({ status: { exists: "false" } }))).toBe(true);
    expect(matches(invoice, where({ status: { exists: false } }))).toBe(false);
  });

  it("checks a path that reaches no value as one missing value", () => {
    expect(matches(invoice, where({ "tags.name": { exists: false } }))).toBe(true);
    expect(matches(invoice, where({ "status.length": { equals: 4 } }))).toBe(false);
  });

  it("orders numbers, dates and text", () => {
    expect(matches(invoice, where({ total: { greater_than: "1000" } }))).toBe(true);
    expect(matches(invoice, where({ total: { greater_than: 1200 } }))).toBe(false);
    expect(matches(invoice, where({ total: { greater_than_equal: 1200 } }))).toBe(true);
    expect(matches(invoice, where({ total: { less_than: 1201 } }))).toBe(true);
    expect(matches(invoice, where({ total: { less_than_equal: 1199 } }))).toBe(false);
    expect(matches(invoice, where({ issuedAt: { greater_than: "2026-03-01" } }))).toBe(true);
    expect(matches(invoice, where({ issuedAt: { less_than: "2026-03-01" } }))).toBe(false);
    expect(matches(invoice, where({ number: { less_than: "INV-002" } }))).toBe(true);
    expect(matches(invoice, where({ number: { greater_than_equal: "INV-002" } }))).toBe(false);
    expect(matches({ id: "d", when: "2026-13-45" }, where({ when: { greater_than: "2026-01-01" } }))).toBe(true);
    expect(matches({ id: "d", when: "2026-01-02" }, where({ when: { greater_than: "soon" } }))).toBe(false);
  });

  it("fails every ordering against a missing value", () => {
    for (const op of ["greater_than", "greater_than_equal", "less_than", "less_than_equal"]) {
      expect(matches(invoice, where({ note: { [op]: 5 } }))).toBe(false);
      expect(matches(invoice, where({ total: { [op]: null } }))).toBe(false);
    }
  });

  it("finds every word of like, in any order and case, and negates it", () => {
    expect(matches(invoice, where({ number: { like: "inv 001" } }))).toBe(true);
    expect(matches(invoice, where({ number: { like: "001 INV" } }))).toBe(true);
    expect(matches(invoice, where({ number: { like: "inv 002" } }))).toBe(false);
    expect(matches(invoice, where({ number: { like: "   " } }))).toBe(true);
    expect(matches(invoice, where({ owner: { like: "usr" } }))).toBe(true);
    expect(matches(invoice, where({ missing: { like: "x" } }))).toBe(false);
    expect(matches(invoice, where({ number: { not_like: "002" } }))).toBe(true);
    expect(matches(invoice, where({ number: { not_like: "001" } }))).toBe(false);
  });

  it("finds a part of the text with contains", () => {
    expect(matches(invoice, where({ number: { contains: "v-0" } }))).toBe(true);
    expect(matches(invoice, where({ number: { contains: "x" } }))).toBe(false);
    expect(matches(invoice, where({ missing: { contains: "" } }))).toBe(true);
  });

  it("needs one array value for positive operators and every value for negative ones", () => {
    expect(matches(invoice, where({ "lines.sku": { equals: "B-2" } }))).toBe(true);
    expect(matches(invoice, where({ "lines.sku": { not_equals: "B-2" } }))).toBe(false);
    expect(matches(invoice, where({ "lines.sku": { not_in: ["C-3"] } }))).toBe(true);
    expect(matches(invoice, where({ "lines.qty": { greater_than: 4 } }))).toBe(true);
  });

  it("joins conditions with and, or and several operators", () => {
    const paid = { status: { equals: "paid" } };
    const draft = { status: { equals: "draft" } };
    expect(matches(invoice, where({ and: [paid, { total: { greater_than: 100 } }] }))).toBe(true);
    expect(matches(invoice, where({ and: [paid, draft] }))).toBe(false);
    expect(matches(invoice, where({ or: [draft, paid] }))).toBe(true);
    expect(matches(invoice, where({ or: [draft] }))).toBe(false);
    expect(matches(invoice, where({ total: { greater_than: 100, less_than: 2000 } }))).toBe(true);
    expect(matches(invoice, where({ total: { greater_than: 100, less_than: 1000 } }))).toBe(false);
    expect(matches(invoice, where({ status: { equals: "paid" }, total: { equals: 1 } }))).toBe(false);
  });

  it("refuses an operator Payload does not have", () => {
    expect(() => matches(invoice, where({ status: { near: "paid" } }))).toThrow('Unsupported query operator "near"');
  });
});

describe("sortDocs", () => {
  const people = [
    { id: "1", name: "Omar", age: 40, team: { id: "b" } },
    { id: "2", name: "ana", age: 31, team: { id: "a" } },
    { id: "3", name: "Bilal", age: 31, team: null },
    { id: "4", name: "Ana", age: null, team: { id: "a" } },
  ];
  const ids = (docs: { id: string }[]) => docs.map((d) => d.id);

  it("returns the same list when there is nothing to sort by", () => {
    expect(sortDocs(people, undefined)).toBe(people);
    expect(sortDocs(people, "")).toBe(people);
    expect(sortDocs(people, " , ")).toBe(people);
    expect(sortDocs(people, 5)).toBe(people);
    expect(sortDocs(people, [])).toBe(people);
  });

  it("sorts by number ascending and descending, with missing values last", () => {
    expect(ids(sortDocs(people, "age"))).toEqual(["2", "3", "1", "4"]);
    expect(ids(sortDocs(people, "-age"))).toEqual(["1", "2", "3", "4"]);
  });

  it("sorts by text and relation id, and breaks ties with the next key", () => {
    expect(ids(sortDocs(people, "name"))).toEqual(["2", "4", "3", "1"]);
    expect(ids(sortDocs(people, "team,-name"))).toEqual(["4", "2", "1", "3"]);
    expect(ids(sortDocs(people, ["age", " -name "]))).toEqual(["3", "2", "1", "4"]);
  });

  it("keeps the order of rows that tie on every key", () => {
    const rows = [
      { id: "x", v: null },
      { id: "y", v: null },
      { id: "z", v: 1 },
    ];
    expect(ids(sortDocs(rows, "v"))).toEqual(["z", "x", "y"]);
    expect(
      ids(
        sortDocs(
          [
            { id: "p", v: 1 },
            { id: "q", v: 1 },
          ],
          "v",
        ),
      ),
    ).toEqual(["p", "q"]);
  });

  it("does not change the list it is given", () => {
    const copy = [...people];
    sortDocs(people, "name");
    expect(people).toEqual(copy);
  });
});

describe("paginate", () => {
  const docs = ["a", "b", "c", "d", "e"];

  it("cuts a middle page", () => {
    expect(paginate(docs, 2, 2)).toEqual({
      docs: ["c", "d"],
      totalDocs: 5,
      limit: 2,
      totalPages: 3,
      page: 2,
      pagingCounter: 3,
      hasPrevPage: true,
      hasNextPage: true,
      prevPage: 1,
      nextPage: 3,
    });
  });

  it("treats pages below one as the first page", () => {
    expect(paginate(docs, 2, 0)).toMatchObject({ docs: ["a", "b"], page: 1, hasPrevPage: false, prevPage: null });
  });

  it("returns an empty page past the end", () => {
    expect(paginate(docs, 2, 4)).toMatchObject({ docs: [], page: 4, hasNextPage: false, nextPage: null });
  });

  it("counts one page for no documents", () => {
    expect(paginate([], 10, 1)).toMatchObject({ docs: [], totalPages: 1, hasNextPage: false, pagingCounter: 1 });
  });

  it("returns everything without pagination or with a limit of zero", () => {
    const all = {
      docs,
      totalDocs: 5,
      limit: 0,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
    expect(paginate(docs, 2, 3, false)).toEqual(all);
    expect(paginate(docs, 0, 3)).toEqual(all);
    expect(paginate(docs, -1, 1)).toEqual(all);
  });
});
