import { describe, it, expect } from "vite-plus/test";
import { filterComplete, filterWhere, type FilterCondition, type FilterField } from "./filter-query";

const fields: FilterField[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "amount", label: "Amount", type: "number" },
  { name: "due", label: "Due", type: "date" },
  { name: "done", label: "Done", type: "boolean" },
  { name: "stage", label: "Stage", type: "select", options: [{ label: "Open", value: "open" }] },
];

describe("filterComplete", () => {
  it("treats exists as complete whatever the value", () => {
    expect(filterComplete({ field: "title", operator: "exists", value: "" })).toBe(true);
  });

  it("treats a boolean value as complete, including false", () => {
    expect(filterComplete({ field: "done", operator: "equals", value: false })).toBe(true);
    expect(filterComplete({ field: "done", operator: "equals", value: true })).toBe(true);
  });

  it("requires a non-empty array", () => {
    expect(filterComplete({ field: "stage", operator: "in", value: [] })).toBe(false);
    expect(filterComplete({ field: "stage", operator: "in", value: ["open"] })).toBe(true);
  });

  it("requires a non-blank scalar", () => {
    expect(filterComplete({ field: "title", operator: "like", value: "" })).toBe(false);
    expect(filterComplete({ field: "title", operator: "like", value: "   " })).toBe(false);
    expect(filterComplete({ field: "title", operator: "like", value: "a" })).toBe(true);
    expect(filterComplete({ field: "amount", operator: "equals", value: 0 })).toBe(true);
  });

  it("rejects a missing value", () => {
    const c = { field: "title", operator: "like", value: undefined } as unknown as FilterCondition;
    expect(filterComplete(c)).toBe(false);
    expect(filterComplete({ ...c, value: null } as unknown as FilterCondition)).toBe(false);
  });
});

describe("filterWhere", () => {
  it("returns undefined when nothing is complete", () => {
    expect(filterWhere([])).toBeUndefined();
    expect(filterWhere([{ field: "title", operator: "like", value: " " }])).toBeUndefined();
  });

  it("returns a single clause unwrapped", () => {
    expect(filterWhere([{ field: "title", operator: "like", value: "report" }])).toEqual({
      title: { like: "report" },
    });
  });

  it("wraps several clauses in and by default and in or on request, dropping incomplete ones", () => {
    const conditions: FilterCondition[] = [
      { field: "title", operator: "like", value: "report" },
      { field: "stage", operator: "in", value: [] },
      { field: "done", operator: "equals", value: false },
    ];
    expect(filterWhere(conditions)).toEqual({ and: [{ title: { like: "report" } }, { done: { equals: false } }] });
    expect(filterWhere(conditions, "or")).toEqual({ or: [{ title: { like: "report" } }, { done: { equals: false } }] });
  });

  it("coerces numeric strings for number fields only", () => {
    expect(filterWhere([{ field: "amount", operator: "greater_than", value: "12.5" }], "and", fields)).toEqual({
      amount: { greater_than: 12.5 },
    });
    expect(filterWhere([{ field: "amount", operator: "equals", value: 7 }], "and", fields)).toEqual({
      amount: { equals: 7 },
    });
    expect(filterWhere([{ field: "title", operator: "equals", value: "12" }], "and", fields)).toEqual({
      title: { equals: "12" },
    });
  });

  it("turns dates into the start of the day, or its end for greater_than", () => {
    expect(filterWhere([{ field: "due", operator: "less_than", value: "2024-03-05" }], "and", fields)).toEqual({
      due: { less_than: new Date(2024, 2, 5, 0, 0, 0, 0).toISOString() },
    });
    expect(filterWhere([{ field: "due", operator: "greater_than", value: "2024-03-05" }], "and", fields)).toEqual({
      due: { greater_than: new Date(2024, 2, 5, 23, 59, 59, 999).toISOString() },
    });
  });

  it("leaves date exists checks and non-string date values untouched", () => {
    expect(filterWhere([{ field: "due", operator: "exists", value: "true" }], "and", fields)).toEqual({
      due: { exists: "true" },
    });
    expect(filterWhere([{ field: "due", operator: "exists", value: true }], "and", fields)).toEqual({
      due: { exists: true },
    });
  });

  it("passes unknown fields through as is", () => {
    expect(filterWhere([{ field: "other", operator: "not_equals", value: "5" }], "and", fields)).toEqual({
      other: { not_equals: "5" },
    });
  });
});
