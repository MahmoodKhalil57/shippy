import { describe, expect, it } from "vite-plus/test";
import {
  fold,
  fuzzyMatch,
  highlightParts,
  mergeRanges,
  search,
  semanticScore,
  stem,
  words,
  type SearchEntry,
} from "./command-search.ts";

const entry = (id: string, title: string, extra: Partial<SearchEntry> = {}): SearchEntry => ({
  id,
  kind: "page",
  title,
  group: "Sales",
  ...extra,
});

describe("command search", () => {
  it("folds Arabic marks and letter forms", () => {
    expect(fold("فَاتُورَة").text).toBe("فاتوره");
    expect(fold("أحمد").text).toBe("احمد");
    expect(words("Hello, World 2")).toEqual(["hello", "world", "2"]);
  });

  it("stems English and Arabic words", () => {
    expect(stem("invoicing")).toBe("invoic");
    expect(stem("cities")).toBe("city");
    expect(stem("box")).toBe("box");
    expect(stem("الفواتير")).toBe("فواتير");
    expect(stem("علم")).toBe("علم");
  });

  it("matches by stem when the word itself is not there", () => {
    expect(fuzzyMatch("invoicing", "my invoices")).toEqual({ score: 0.85, ranges: [[3, 9]] });
    expect(fuzzyMatch("", "anything")).toBeNull();
  });

  it("merges overlapping ranges", () => {
    expect(
      mergeRanges([
        [4, 6],
        [0, 3],
        [2, 5],
      ]),
    ).toEqual([[0, 6]]);
    expect(highlightParts("invoice", [[0, 3]])).toEqual([
      { text: "inv", match: true },
      { text: "oice", match: false },
    ]);
  });

  it("scores related words and caches the synonyms", () => {
    const synonyms = [["parcel", "package"]];
    expect(semanticScore("package", new Set(["parcel"]), synonyms)).toBe(0.7);
    expect(semanticScore("package", new Set(["parcel"]), synonyms)).toBe(0.7);
    expect(semanticScore("a", new Set(["parcel"]))).toBe(0);
    expect(semanticScore("bill", new Set(["invoic"]))).toBe(0.7);
  });

  it("finds nothing for an empty query", () => {
    expect(search([entry("a", "Invoices")], "   ")).toEqual([]);
    expect(
      search([entry("a", "Invoices"), entry("b", "Billing", { description: "Statements" })], "bill").map(
        (h) => h.entry.id,
      ),
    ).toEqual(["b", "a"]);
  });
});
