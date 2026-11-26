import { describe, expect, it } from "vite-plus/test";
import { links, linkTarget } from "./links.ts";

describe("links", () => {
  const to = links<"invoices", "settings", "/home">();

  it("builds dashboard paths, keeping placeholders", () => {
    expect(to.doc("invoices", "a b")).toBe("/collections/invoices/a%20b");
    expect(to.doc("invoices", 7, "lines")).toBe("/collections/invoices/7/lines");
    expect(to.doc("invoices", "$row.id")).toBe("/collections/invoices/$row.id");
    expect(to.list("invoices")).toBe("/collections/invoices");
    expect(to.list("invoices", {})).toBe("/collections/invoices");
    expect(to.list("invoices", { status: "paid" })).toBe(
      "/collections/invoices?filters[0][field]=status&filters[0][operator]=equals&filters[0][value]=paid",
    );
    expect(to.create("invoices")).toBe("/collections/invoices/create");
    expect(to.global("settings")).toBe("/globals/settings");
    expect(to.view("/home")).toBe("/home");
    expect(to.view("/home", { tab: "open" })).toBe("/home?tab=open");
  });

  it("reads where a link goes", () => {
    expect(linkTarget("https://example.com")).toEqual({ kind: "outside" });
    expect(linkTarget("//example.com")).toEqual({ kind: "outside" });
    expect(linkTarget("/collections/invoices?x=1")).toEqual({ kind: "list", collection: "invoices" });
    expect(linkTarget("/collections/invoices/create")).toEqual({ kind: "create", collection: "invoices" });
    expect(linkTarget("/collections/invoices/a%20b/lines#top")).toEqual({
      kind: "doc",
      collection: "invoices",
      id: "a b",
      tab: "lines",
    });
    expect(linkTarget("/globals/settings")).toEqual({ kind: "global", slug: "settings" });
    expect(linkTarget("/collections")).toEqual({ kind: "view", path: "/collections" });
    expect(linkTarget("/reports/")).toEqual({ kind: "view", path: "/reports" });
    expect(linkTarget("/")).toEqual({ kind: "view", path: "/" });
  });
});
