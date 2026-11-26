import { describe, expect, it } from "vite-plus/test";
import { KIND_BOUNDS, TILE_KINDS, defaultRows, kindBoundsOf, reflowOf, type TileKind } from "./tile-kind.ts";

describe("tile kinds", () => {
  it("lists every kind with bounds", () => {
    expect([...TILE_KINDS].sort()).toEqual(Object.keys(KIND_BOUNDS).sort());
  });

  it("gives each kind its default height", () => {
    const rows: Record<TileKind, number> = { text: 2, stats: 3, list: 8, chart: 8, card: 8, table: 10, entries: 10 };
    for (const kind of TILE_KINDS) expect(defaultRows(kind, "s")).toBe(rows[kind]);
  });

  it("falls back on the size without a kind", () => {
    expect(defaultRows(undefined, "s")).toBe(8);
    expect(defaultRows(undefined, "m")).toBe(8);
    expect(defaultRows(undefined, "l")).toBe(10);
    expect(defaultRows(undefined, "full")).toBe(10);
  });

  it("lets stats and text reflow taller when narrowed", () => {
    expect(reflowOf("stats")).toBe(4);
    expect(reflowOf("text")).toBe(2);
    expect(reflowOf("chart")).toBe(1);
    expect(reflowOf(undefined)).toBe(1);
  });

  it("bounds a tile by its kind unless the widget says otherwise", () => {
    expect(kindBoundsOf({ size: "s", rows: 3, kind: "stats" })).toMatchObject({
      minRows: 2,
      maxRows: 6,
      minSpan: 3,
      maxSpan: 8,
    });
    expect(kindBoundsOf({ size: "m", rows: 10, kind: "table", minRows: 6 })).toMatchObject({
      minRows: 6,
      maxRows: 30,
      minSpan: 8,
    });
    expect(kindBoundsOf({ size: "m", rows: 10 })).toMatchObject({ minRows: 5, maxRows: 20, minSpan: 6 });
  });
});
