import { describe, it, expect } from "vite-plus/test";
import { clampColumnWidth, COLUMN_MAX_WIDTH, COLUMN_MIN_WIDTH, moveColumn, orderColumns } from "./columns";

const cols = [{ key: "a" }, { key: "b" }, { key: "c" }, { key: "d" }];
const keys = (list: { key: string }[]) => list.map((c) => c.key);

describe("orderColumns", () => {
  it("keeps the natural order without an order list", () => {
    expect(keys(orderColumns(cols))).toEqual(["a", "b", "c", "d"]);
  });

  it("follows a full order list", () => {
    expect(keys(orderColumns(cols, ["d", "b", "a", "c"]))).toEqual(["d", "b", "a", "c"]);
  });

  it("inserts unlisted columns after their nearest listed predecessor", () => {
    expect(keys(orderColumns(cols, ["c", "a"]))).toEqual(["c", "d", "a", "b"]);
    expect(keys(orderColumns(cols, ["d", "b"]))).toEqual(["a", "d", "b", "c"]);
  });

  it("puts unlisted leading columns first", () => {
    expect(keys(orderColumns(cols, ["c"]))).toEqual(["a", "b", "c", "d"]);
  });

  it("ignores unknown keys in the order list", () => {
    expect(keys(orderColumns(cols, ["z", "b"]))).toEqual(["a", "b", "c", "d"]);
  });

  it("moves fixed columns to the front in their relative order", () => {
    const withFixed = [{ key: "a" }, { key: "b", fixed: true }, { key: "c" }, { key: "d", fixed: true }];
    expect(keys(orderColumns(withFixed, ["c", "d", "a", "b"]))).toEqual(["d", "b", "c", "a"]);
  });

  it("does not mutate its input", () => {
    const input = [...cols];
    orderColumns(input, ["d", "c"]);
    expect(keys(input)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("moveColumn", () => {
  const list = ["a", "b", "c", "d"];

  it("moves before an anchor", () => {
    expect(moveColumn(list, "d", { before: "b" })).toEqual(["a", "d", "b", "c"]);
  });

  it("moves after an anchor", () => {
    expect(moveColumn(list, "a", { after: "c" })).toEqual(["b", "c", "a", "d"]);
  });

  it("prefers before when both are given", () => {
    expect(moveColumn(list, "a", { before: "d", after: "b" })).toEqual(["b", "c", "a", "d"]);
  });

  it("returns an unchanged copy without a usable anchor", () => {
    const none = moveColumn(list, "a", {});
    expect(none).toEqual(list);
    expect(none).not.toBe(list);
    expect(moveColumn(list, "a", { before: "z" })).toEqual(list);
    expect(moveColumn(list, "a", { after: "a" })).toEqual(list);
  });
});

describe("clampColumnWidth", () => {
  it("clamps to the limits and rounds", () => {
    expect(clampColumnWidth(10)).toBe(COLUMN_MIN_WIDTH);
    expect(clampColumnWidth(5000)).toBe(COLUMN_MAX_WIDTH);
    expect(clampColumnWidth(120.4)).toBe(120);
    expect(clampColumnWidth(120.5)).toBe(121);
  });
});
