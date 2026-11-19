import { describe, expect, it } from "vite-plus/test";
import {
  fuzzyMatch,
  highlightParts,
  search,
  semanticScore,
  stem,
  words,
  type SearchEntry,
} from "../src/app/command-search.ts";

const entries: SearchEntry[] = [
  {
    id: "p:orders",
    kind: "page",
    title: "Orders",
    group: "Sales",
    description: "Customer orders and everything that follows",
  },
  { id: "p:invoices", kind: "page", title: "Invoices", group: "Finance", description: "What customers owe us" },
  { id: "p:suppliers", kind: "page", title: "Suppliers", group: "Directory", description: "Companies we buy from" },
  { id: "p:vehicles", kind: "page", title: "Vehicles", group: "Directory", description: "The cars we rent out" },
  { id: "p:customer-pos", kind: "page", title: "Customer POs", group: "Sales" },
  { id: "a:new-order", kind: "action", title: "Create new Order", group: "Actions" },
  { id: "r:acme", kind: "record", title: "Acme Trading Ltd", group: "Customers", keywords: ["Rotterdam"] },
];
const ids = (q: string, synonyms?: string[][]) => search(entries, q, 40, synonyms).map((h) => h.entry.id);

describe("command search", () => {
  it("stems words", () => {
    expect(stem("invoices")).toBe(stem("invoice"));
    expect(stem("invoicing")).toBe(stem("invoice"));
    expect(words("Acme — Trading/Ltd 2")).toEqual(["acme", "trading", "ltd", "2"]);
  });

  it("fuzzy: substrings at word starts, characters in order, and a typo", () => {
    expect(fuzzyMatch("pos", "Customer POs")?.ranges).toEqual([[9, 12]]);
    expect(fuzzyMatch("cus pos", "Customer POs")!.score).toBeGreaterThan(0.8);
    expect(fuzzyMatch("cpo", "Customer POs")).not.toBeNull();
    expect(fuzzyMatch("invoce", "Invoices")).not.toBeNull();
    expect(fuzzyMatch("zzz", "Invoices")).toBeNull();
    // characters in order must stay compact: "case" is not "Create new Stock item"
    expect(fuzzyMatch("case", "Create new Stock item")).toBeNull();
    // a word's stem highlights the whole stem: "vendors" → "Vendor"
    expect(fuzzyMatch("vendors", "Vendor registrations")?.ranges).toEqual([[0, 6]]);
  });

  it("ranks literal title matches first", () => {
    expect(ids("order")[0]).toMatch(/orders|new-order/);
    expect(ids("acme")[0]).toBe("r:acme");
    expect(ids("rotterdam")).toContain("r:acme");
  });

  it("semantic: finds entries by meaning", () => {
    expect(semanticScore("bills", new Set([stem("invoice")]))).toBeGreaterThan(0.5);
    expect(ids("bills")).toContain("p:invoices");
    expect(ids("vendors")).toContain("p:suppliers");
    const bills = search(entries, "bills").find((h) => h.entry.id === "p:invoices")!;
    expect(bills.related).toBe(true);
    expect(bills.ranges).toEqual([]);
  });

  it("semantic: a project's own synonyms join the thesaurus", () => {
    const synonyms = [["vehicle", "car", "van", "fleet"]];
    expect(ids("vans")).not.toContain("p:vehicles");
    expect(ids("vans", synonyms)).toContain("p:vehicles");
    // the generic words still work alongside them
    expect(ids("bills", synonyms)).toContain("p:invoices");
  });

  it("splits titles into highlighted parts", () => {
    expect(highlightParts("Customer POs", [[9, 11]])).toEqual([
      { text: "Customer ", match: false },
      { text: "PO", match: true },
      { text: "s", match: false },
    ]);
  });
});
