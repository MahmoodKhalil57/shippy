import { describe, it, expect } from "vite-plus/test";
import { NONE, byColumn, columnOf, moved, valueOf } from "./kanban";

const cols = ["todo", "done"];

describe("columnOf", () => {
  it("maps known string values to their column", () => {
    expect(columnOf("todo", cols)).toBe("todo");
  });

  it("maps unknown, empty and non-string values to NONE", () => {
    expect(columnOf("other", cols)).toBe(NONE);
    expect(columnOf("", ["", "todo"])).toBe(NONE);
    expect(columnOf(3, cols)).toBe(NONE);
    expect(columnOf(null, cols)).toBe(NONE);
  });
});

describe("valueOf", () => {
  it("turns NONE into null", () => {
    expect(valueOf(NONE)).toBeNull();
    expect(valueOf("done")).toBe("done");
  });
});

describe("byColumn", () => {
  const items = [
    { id: 1, s: "todo" },
    { id: 2, s: "done" },
    { id: 3, s: "lost" },
    { id: 4, s: "todo" },
  ];

  it("groups items in column order with a trailing NONE group", () => {
    expect(byColumn(items, (i) => i.s, cols)).toEqual([
      { key: "todo", items: [items[0], items[3]] },
      { key: "done", items: [items[1]] },
      { key: NONE, items: [items[2]] },
    ]);
  });

  it("omits the NONE group when every item has a column", () => {
    expect(byColumn(items.slice(0, 2), (i) => i.s, cols).map((g) => g.key)).toEqual(cols);
    expect(byColumn([], (i: { s: string }) => i.s, cols)).toEqual([
      { key: "todo", items: [] },
      { key: "done", items: [] },
    ]);
  });
});

describe("moved", () => {
  it("sets the target column on matching items only", () => {
    const items = [
      { id: 1, s: "todo" as string | null },
      { id: 2, s: "todo" as string | null },
    ];
    const set = (i: (typeof items)[number], s: string | null) => ({ ...i, s });
    const out = moved(items, (i) => i.id === 2, "done", set);
    expect(out).toEqual([items[0], { id: 2, s: "done" }]);
    expect(out[0]).toBe(items[0]);
    expect(moved(items, (i) => i.id === 1, NONE, set)[0]).toEqual({ id: 1, s: null });
  });
});
