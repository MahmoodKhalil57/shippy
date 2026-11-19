import { describe, expect, it } from "vite-plus/test";
import { clampColumnWidth, moveColumn, orderColumns } from "../src/components/base/columns.ts";

const cols = (...keys: string[]) => keys.map((key) => ({ key, fixed: key.startsWith("!") }));
const keys = (list: { key: string }[]) => list.map((c) => c.key);

describe("orderColumns", () => {
  it("keeps the given order when there is none saved", () => {
    expect(keys(orderColumns(cols("a", "b", "c")))).toEqual(["a", "b", "c"]);
  });

  it("follows a saved order", () => {
    expect(keys(orderColumns(cols("a", "b", "c"), ["c", "a", "b"]))).toEqual(["c", "a", "b"]);
  });

  it("ignores keys that no longer exist", () => {
    expect(keys(orderColumns(cols("a", "b"), ["gone", "b", "a"]))).toEqual(["b", "a"]);
  });

  it("puts a column added later after the one it follows", () => {
    // `n` is new: it came after `b` in the config, so it stays after `b` wherever `b` went.
    expect(keys(orderColumns(cols("a", "b", "n", "c"), ["c", "b", "a"]))).toEqual(["c", "b", "n", "a"]);
    expect(keys(orderColumns(cols("n", "a", "b"), ["b", "a"]))).toEqual(["n", "b", "a"]);
  });

  it("keeps fixed columns first", () => {
    expect(keys(orderColumns(cols("!id", "a", "b"), ["b", "a", "!id"]))).toEqual(["!id", "b", "a"]);
  });
});

describe("moveColumn", () => {
  it("moves before or after another column", () => {
    expect(moveColumn(["a", "b", "c", "d"], "d", { before: "b" })).toEqual(["a", "d", "b", "c"]);
    expect(moveColumn(["a", "b", "c", "d"], "a", { after: "c" })).toEqual(["b", "c", "a", "d"]);
  });

  it("leaves the order alone for an unknown anchor", () => {
    expect(moveColumn(["a", "b"], "a", { before: "x" })).toEqual(["a", "b"]);
  });
});

describe("clampColumnWidth", () => {
  it("keeps widths between the minimum and the maximum, in whole pixels", () => {
    expect(clampColumnWidth(10)).toBe(64);
    expect(clampColumnWidth(5000)).toBe(800);
    expect(clampColumnWidth(120.6)).toBe(121);
  });
});
