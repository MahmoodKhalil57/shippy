import { describe, expect, it } from "vite-plus/test";
import { fold, fuzzyMatch, highlightParts, search, stem, type SearchEntry } from "../src/app/command-search.ts";

const entries: SearchEntry[] = [
  { id: "p:invoices", kind: "page", title: "الفواتير", group: "المالية", description: "ما يدين به العملاء" },
  { id: "p:suppliers", kind: "page", title: "الموردون", group: "الدليل" },
  { id: "a:new-quote", kind: "action", title: "إنشاء عرض سعر جديد", group: "عروض الأسعار" },
  { id: "p:settings", kind: "page", title: "الإعدادات", group: "التهيئة" },
  { id: "p:orders", kind: "page", title: "Orders", group: "Sales" },
];
const ids = (q: string) => search(entries, q).map((h) => h.entry.id);

describe("command search in Arabic", () => {
  it("folds case, tashkeel, tatweel and letter forms, keeping where each character came from", () => {
    expect(fold("أإآٱ ى ة").text).toBe("اااا ي ه");
    expect(fold("فَاتُورَة").text).toBe("فاتوره");
    expect(fold("مـــورد").text).toBe("مورد");
    expect(fold("ORDERS").text).toBe("orders");
    const f = fold("فَا");
    expect(f.at).toEqual([0, 2, 3]);
  });

  it("matches whatever way a word is written", () => {
    expect(ids("فاتوره")).toContain("p:invoices");
    expect(ids("فَوَاتِير")).toContain("p:invoices");
    expect(ids("انشاء")).toContain("a:new-quote");
    expect(ids("اعدادات")).toContain("p:settings");
    expect(ids("ORDERS")).toContain("p:orders");
  });

  it("highlights the original characters, a letter's marks with it", () => {
    const title = "فَاتُورَة";
    const m = fuzzyMatch("فاتوره", title)!;
    expect(
      highlightParts(title, m.ranges)
        .map((p) => p.text)
        .join(""),
    ).toBe(title);
    expect(m.ranges).toEqual([[0, title.length]]);
  });

  it("drops the article from a stem and finds words by meaning, across languages", () => {
    expect(stem("الفواتير")).toBe(stem("فواتير"));
    expect(ids("فاتورة")).toContain("p:invoices");
    expect(ids("invoice")).toContain("p:invoices");
    expect(ids("مورد")).toContain("p:suppliers");
  });
});
