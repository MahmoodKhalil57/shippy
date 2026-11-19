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
    id: "p:cases",
    kind: "page",
    title: "Cases",
    group: "Sourcing desk",
    description: "Client RFQs and everything that follows",
  },
  { id: "p:invoices", kind: "page", title: "Invoices", group: "Finance", description: "What customers owe us" },
  { id: "p:suppliers", kind: "page", title: "Suppliers", group: "Directory", description: "Companies we buy from" },
  { id: "p:vessels", kind: "page", title: "Vessels", group: "Directory", description: "Ships we supply" },
  { id: "p:supplier-rfqs", kind: "page", title: "Supplier RFQs", group: "Sourcing desk" },
  { id: "a:new-case", kind: "action", title: "Create new Case", group: "Actions" },
  { id: "r:helios", kind: "record", title: "Helios Bulk Carriers", group: "Customers", keywords: ["Piraeus"] },
];
const ids = (q: string) => search(entries, q).map((h) => h.entry.id);

describe("command search", () => {
  it("stems words", () => {
    expect(stem("invoices")).toBe(stem("invoice"));
    expect(stem("invoicing")).toBe(stem("invoice"));
    expect(words("Helios — Bulk/Carriers 2")).toEqual(["helios", "bulk", "carriers", "2"]);
  });

  it("fuzzy: substrings at word starts, characters in order, and a typo", () => {
    expect(fuzzyMatch("rfq", "Supplier RFQs")?.ranges).toEqual([[9, 12]]);
    expect(fuzzyMatch("sup rfq", "Supplier RFQs")!.score).toBeGreaterThan(0.8);
    expect(fuzzyMatch("srfq", "Supplier RFQs")).not.toBeNull();
    expect(fuzzyMatch("invoce", "Invoices")).not.toBeNull();
    expect(fuzzyMatch("zzz", "Invoices")).toBeNull();
    // characters in order must stay compact: "case" is not "Create new Stock item"
    expect(fuzzyMatch("case", "Create new Stock item")).toBeNull();
    // a word's stem highlights the whole stem: "vendors" → "Vendor"
    expect(fuzzyMatch("vendors", "Vendor registrations")?.ranges).toEqual([[0, 6]]);
  });

  it("ranks literal title matches first", () => {
    expect(ids("case")[0]).toMatch(/cases|new-case/);
    expect(ids("helios")[0]).toBe("r:helios");
    expect(ids("piraeus")).toContain("r:helios");
  });

  it("semantic: finds entries by meaning", () => {
    expect(semanticScore("bills", new Set([stem("invoice")]))).toBeGreaterThan(0.5);
    expect(ids("bills")).toContain("p:invoices");
    expect(ids("vendors")).toContain("p:suppliers");
    expect(ids("ships")).toContain("p:vessels");
    const bills = search(entries, "bills").find((h) => h.entry.id === "p:invoices")!;
    expect(bills.related).toBe(true);
    expect(bills.ranges).toEqual([]);
  });

  it("splits titles into highlighted parts", () => {
    expect(highlightParts("Supplier RFQs", [[9, 12]])).toEqual([
      { text: "Supplier ", match: false },
      { text: "RFQ", match: true },
      { text: "s", match: false },
    ]);
  });
});
