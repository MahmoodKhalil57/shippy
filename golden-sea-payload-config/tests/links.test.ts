import { describe, expect, it } from "vite-plus/test";
import config from "../src/config.ts";
import { COLLECTIONS, GLOBALS, VIEWS, doc, list } from "../src/links.ts";

/** The typed link names (src/links.ts) are the config's own. */
describe("links", () => {
  it("name every collection, global and root view of the config", () => {
    expect([...COLLECTIONS].sort()).toEqual(config.collections.map((c) => c.slug).sort());
    expect([...GLOBALS].sort()).toEqual((config.globals ?? []).map((g) => g.slug).sort());
    expect([...VIEWS].sort()).toEqual(
      Object.values(config.admin?.components?.views ?? {})
        .map((v) => v.path)
        .sort(),
    );
  });

  it("build the dashboard's paths", () => {
    expect(doc("cases", "gs-rfq-0142", "pricing")).toBe("/collections/cases/gs-rfq-0142/pricing");
    expect(list("invoices")).toBe("/collections/invoices");
    expect(list("invoices", { status: "Overdue" })).toBe(
      "/collections/invoices?filters[0][field]=status&filters[0][operator]=equals&filters[0][value]=Overdue",
    );
  });
});
