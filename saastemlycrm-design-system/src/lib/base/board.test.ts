import { describe, it, expect } from "vite-plus/test";
import {
  CELL,
  LAYOUT_STEP,
  MAX_ROWS,
  MIN_ROWS,
  SIZE_TILES,
  boundsOf,
  clampRows,
  designSpan,
  keepOrder,
  lanesFor,
  layoutLanes,
  moveTo,
  place,
  resizeTo,
  rowsAt,
  rowsFor,
  rowsHeight,
  scaleArranged,
  sizesWithin,
  spanOf,
  stretch,
  type Placed,
} from "./board";
import { TILE_H_REM, tileH, tileW } from "./tiles";

describe("grid measures", () => {
  it("counts whole lanes with a little tolerance, at least one", () => {
    expect(lanesFor(tileW() * 12)).toBe(12);
    expect(lanesFor(tileW() * 11.96)).toBe(12);
    expect(lanesFor(tileW() * 11.9)).toBe(11);
    expect(lanesFor(0)).toBe(1);
    expect(lanesFor(tileW(2) * 6, 2)).toBe(6);
  });

  it("converts rows to pixels and back, clamped", () => {
    expect(CELL).toBe(TILE_H_REM);
    expect(rowsHeight(3)).toBe(3 * tileH());
    expect(rowsHeight(1, 2)).toBe(tileH(2));
    expect(rowsFor(tileH() * 2)).toBe(2);
    expect(rowsFor(tileH() * 2 + 1)).toBe(3);
    expect(rowsFor(0)).toBe(MIN_ROWS);
    expect(rowsFor(1e9)).toBe(MAX_ROWS);
    expect(rowsFor(tileH(2) * 3, 2)).toBe(3);
  });

  it("clamps and rounds row counts", () => {
    expect(clampRows(2.4)).toBe(2);
    expect(clampRows(-3)).toBe(MIN_ROWS);
    expect(clampRows(9999)).toBe(MAX_ROWS);
  });

  it("spans sizes up to the available lanes", () => {
    expect(spanOf("s", 24)).toBe(SIZE_TILES.s);
    expect(spanOf("l", 12)).toBe(12);
    expect(spanOf("full", 7)).toBe(7);
    expect(designSpan("m")).toBe(12);
    expect(designSpan("full")).toBe(18);
  });

  it("rounds layouts down to whole steps beyond a step", () => {
    expect(LAYOUT_STEP).toBe(6);
    expect(layoutLanes(4)).toBe(4);
    expect(layoutLanes(6)).toBe(6);
    expect(layoutLanes(17)).toBe(12);
  });
});

describe("rowsAt", () => {
  it("grows rows by the narrowing factor, capped by the reflow", () => {
    expect(rowsAt(3, 12, 6)).toBe(3);
    expect(rowsAt(3, 12, 6, 4)).toBe(6);
    expect(rowsAt(3, 18, 3, 4)).toBe(12);
    expect(rowsAt(3, 6, 12, 4)).toBe(3);
    expect(rowsAt(3, 12, 6, 0)).toBe(3);
  });
});

describe("boundsOf", () => {
  it("derives row bounds from the rows without given bounds", () => {
    expect(boundsOf({ size: "m", rows: 10 })).toEqual({
      size: "m",
      rows: 10,
      minSize: "s",
      maxSize: "full",
      minRows: 5,
      maxRows: 20,
      minSpan: 6,
      maxSpan: undefined,
    });
    expect(boundsOf({ size: "s", rows: 2 })).toMatchObject({ minRows: 2, maxRows: 4 });
  });

  const stats = { minSpan: 3, maxSpan: 8, minRows: 2, maxRows: 6 };

  it("uses the given span and row bounds when sizes are not given", () => {
    expect(boundsOf({ size: "s", rows: 3 }, stats)).toMatchObject({ minRows: 2, maxRows: 6, minSpan: 3, maxSpan: 8 });
  });

  it("prefers explicit sizes and widths over the given bounds", () => {
    expect(boundsOf({ size: "m", rows: 8, minSize: "m", maxSize: "l" }, stats)).toMatchObject({
      minSpan: 12,
      maxSpan: 18,
    });
    expect(boundsOf({ size: "m", rows: 8, minWidth: 2, maxWidth: 30 }, stats)).toMatchObject({
      minSpan: 2,
      maxSpan: 30,
    });
    expect(boundsOf({ size: "m", rows: 8, minRows: 1, maxRows: 50 })).toMatchObject({ minRows: 1, maxRows: 50 });
  });

  it("keeps the current rows and width inside their bounds", () => {
    expect(boundsOf({ size: "m", rows: 8, minRows: 12, maxRows: 4 })).toMatchObject({ minRows: 8, maxRows: 8 });
    expect(boundsOf({ size: "m", rows: 8, width: 4, minWidth: 6, maxWidth: 3 })).toMatchObject({
      minSpan: 4,
      maxSpan: 4,
    });
  });

  it("clamps the size between the min and max sizes", () => {
    expect(boundsOf({ size: "s", rows: 4, minSize: "m" }).size).toBe("m");
    expect(boundsOf({ size: "full", rows: 4, maxSize: "l" }).size).toBe("l");
  });

  it("leaves spans open for full-width tiles", () => {
    expect(boundsOf({ size: "full", rows: 4, minSize: "full" })).toMatchObject({
      minSpan: undefined,
      maxSpan: undefined,
    });
    expect(boundsOf({ size: "full", rows: 4 }, stats)).toMatchObject({ minSpan: 3, maxSpan: 8 });
  });
});

describe("resizeTo", () => {
  const b = boundsOf({ size: "m", rows: 8, width: 8, minWidth: 4, maxWidth: 10, minRows: 2, maxRows: 12 });

  it("clamps span and rows to the bounds and lanes", () => {
    expect(resizeTo(b, 24, 7.4, 5.6)).toEqual({ span: 7, rows: 6 });
    expect(resizeTo(b, 24, 1, 1)).toEqual({ span: 4, rows: 2 });
    expect(resizeTo(b, 24, 99, 99)).toEqual({ span: 10, rows: 12 });
    expect(resizeTo(b, 3, 8, 8)).toEqual({ span: 3, rows: 8 });
  });

  it("is open-ended without span bounds", () => {
    const open = { ...b, minSpan: undefined, maxSpan: undefined };
    expect(resizeTo(open, 24, 0, 8)).toEqual({ span: 1, rows: 8 });
    expect(resizeTo(open, 24, 30, 8)).toEqual({ span: 24, rows: 8 });
  });
});

describe("ordering", () => {
  it("keeps the previous order and appends new keys", () => {
    expect(keepOrder(["c", "a", "x"], ["a", "b", "c"])).toEqual(["c", "a", "b"]);
    expect(keepOrder([], ["a"])).toEqual(["a"]);
  });

  it("moves a key before or after another", () => {
    expect(moveTo(["a", "b", "c", "d"], "a", "c", false)).toEqual(["b", "a", "c", "d"]);
    expect(moveTo(["a", "b", "c", "d"], "a", "c", true)).toEqual(["b", "c", "a", "d"]);
    expect(moveTo(["a", "b", "c"], "c", "a", false)).toEqual(["c", "a", "b"]);
  });

  it("returns a copy when the move is a no-op", () => {
    const order = ["a", "b"];
    for (const [key, over] of [
      ["a", "a"],
      ["z", "a"],
      ["a", "z"],
    ]) {
      const out = moveTo(order, key!, over!, true);
      expect(out).toEqual(order);
      expect(out).not.toBe(order);
    }
  });

  it("lists the sizes within the bounds", () => {
    expect(sizesWithin(boundsOf({ size: "m", rows: 4 }))).toEqual(["s", "m", "l", "full"]);
    expect(sizesWithin(boundsOf({ size: "m", rows: 4, minSize: "m", maxSize: "l" }))).toEqual(["m", "l"]);
  });
});

describe("stretch and scaleArranged", () => {
  const boxes: Placed[] = [
    { lane: 0, span: 6, row: 0, rows: 2 },
    { lane: 6, span: 6, row: 0, rows: 3 },
  ];

  it("rescales lanes edge to edge", () => {
    expect(stretch(boxes, 12, 18)).toEqual([
      { lane: 0, span: 9, row: 0, rows: 2 },
      { lane: 9, span: 9, row: 0, rows: 3 },
    ]);
    expect(stretch(boxes, 12, 12)).toEqual(boxes);
    expect(stretch(boxes, 12, 12)[0]).not.toBe(boxes[0]);
  });

  it("keeps the spot when the lanes are unchanged", () => {
    expect(scaleArranged(3, 4, 12, 12)).toEqual({ at: 3, span: 4 });
  });

  it("drops the spot when the grid more than halves", () => {
    expect(scaleArranged(6, 6, 24, 6)).toEqual({ span: 6 });
    expect(scaleArranged(0, 12, 24, 6)).toEqual({ span: 6 });
  });

  it("scales the spot proportionally, keeping it on the grid", () => {
    expect(scaleArranged(6, 6, 12, 18)).toEqual({ at: 9, span: 9 });
    expect(scaleArranged(11, 1, 12, 6)).toEqual({ at: 5, span: 1 });
    expect(scaleArranged(0, 1, 12, 7)).toEqual({ at: 0, span: 1 });
  });
});

describe("place", () => {
  it("flows tiles left to right, wrapping onto new rows", () => {
    expect(
      place(
        [
          { size: "s", rows: 2 },
          { size: "s", rows: 2 },
          { size: "s", rows: 2 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 0, span: 6, row: 0, rows: 2 },
      { lane: 6, span: 6, row: 0, rows: 2 },
      { lane: 0, span: 6, row: 2, rows: 2 },
    ]);
    expect(place([], 12)).toEqual([]);
  });

  it("fits tiles to the lanes and uses their own span", () => {
    expect(place([{ size: "full", rows: 2 }], 3)).toEqual([{ lane: 0, span: 3, row: 0, rows: 2 }]);
    expect(
      place(
        [
          { size: "s", rows: 2, span: 4 },
          { size: "s", rows: 2, span: 0 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 0, span: 4, row: 0, rows: 2 },
      { lane: 4, span: 1, row: 0, rows: 2 },
    ]);
  });

  it("reflows narrowed tiles taller", () => {
    expect(place([{ size: "l", rows: 3, reflow: 4 }], 6)).toEqual([{ lane: 0, span: 6, row: 0, rows: 9 }]);
  });

  it("starts tiles with a lane at that lane, moving to a new row when it goes back", () => {
    expect(
      place(
        [
          { size: "s", rows: 2 },
          { size: "s", rows: 2, at: 0 },
          { size: "s", rows: 1, at: 50 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 0, span: 6, row: 0, rows: 2 },
      { lane: 0, span: 6, row: 2, rows: 2 },
      { lane: 6, span: 6, row: 2, rows: 1 },
    ]);
    expect(place([{ size: "s", rows: 2, at: -4 }], 12)[0]!.lane).toBe(0);
    expect(
      place(
        [
          { size: "s", rows: 1, span: 6 },
          { size: "s", rows: 1, span: 4, at: 8 },
          { size: "s", rows: 1, span: 2, at: 6 },
        ],
        12,
      )[2],
    ).toEqual({ lane: 6, span: 2, row: 1, rows: 1 });
  });

  it("places pinned tiles first and flows the rest after them", () => {
    expect(
      place(
        [
          { size: "s", rows: 2, at: 6, atRow: 4 },
          { size: "s", rows: 2 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 6, span: 6, row: 0, rows: 2 },
      { lane: 0, span: 6, row: 1, rows: 2 },
    ]);
  });

  it("resolves pinned collisions by row, then lane, then order", () => {
    expect(
      place(
        [
          { size: "s", rows: 2, at: 3, atRow: 0 },
          { size: "s", rows: 2, at: 0, atRow: 0 },
          { size: "s", rows: 1, at: 0, atRow: 0 },
          { size: "s", rows: 1, at: 6, atRow: -2.6 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 3, span: 6, row: 3, rows: 2 },
      { lane: 0, span: 6, row: 0, rows: 2 },
      { lane: 0, span: 6, row: 2, rows: 1 },
      { lane: 6, span: 6, row: 0, rows: 1 },
    ]);
  });

  it("ignores half-pinned tiles in the pinned pass", () => {
    expect(place([{ size: "s", rows: 1, atRow: 5 }], 12)).toEqual([{ lane: 0, span: 6, row: 0, rows: 1 }]);
  });

  it("removes empty rows between tiles", () => {
    expect(
      place(
        [
          { size: "s", rows: 1, at: 0, atRow: 0 },
          { size: "s", rows: 1, at: 0, atRow: 3 },
          { size: "s", rows: 2, at: 6, atRow: 6 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 0, span: 6, row: 0, rows: 1 },
      { lane: 0, span: 6, row: 1, rows: 1 },
      { lane: 6, span: 6, row: 2, rows: 2 },
    ]);
  });

  it("widens tiles into free lanes up to their max span", () => {
    expect(
      place(
        [
          { size: "s", rows: 2, maxSpan: 10 },
          { size: "s", rows: 2, maxSpan: 99 },
        ],
        12,
      ).map((p) => p.span),
    ).toEqual([6, 6]);
    expect(place([{ size: "s", rows: 2, maxSpan: 10 }], 12)[0]!.span).toBe(10);
    expect(place([{ size: "s", rows: 2, maxSpan: 99 }], 12)[0]!.span).toBe(12);
  });

  it("grows tiles down to the tallest neighbour in their row, up to their max rows", () => {
    expect(
      place(
        [
          { size: "s", rows: 2, maxRows: 10 },
          { size: "s", rows: 5 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 0, span: 6, row: 0, rows: 5 },
      { lane: 6, span: 6, row: 0, rows: 5 },
    ]);
    expect(
      place(
        [
          { size: "s", rows: 2, maxRows: 3 },
          { size: "s", rows: 5 },
        ],
        12,
      )[0]!.rows,
    ).toBe(3);
  });

  it("does not grow into a tile below", () => {
    expect(
      place(
        [
          { size: "s", rows: 2, maxRows: 10 },
          { size: "s", rows: 5 },
          { size: "s", rows: 1, maxRows: 2 },
        ],
        12,
      ),
    ).toEqual([
      { lane: 0, span: 6, row: 0, rows: 2 },
      { lane: 6, span: 6, row: 0, rows: 5 },
      { lane: 0, span: 6, row: 2, rows: 2 },
    ]);
  });

  it("stops growing down at a tile below", () => {
    const out = place(
      [
        { size: "s", rows: 1, maxRows: 4, at: 0, atRow: 0 },
        { size: "s", rows: 4, at: 6, atRow: 0 },
        { size: "s", rows: 1, at: 0, atRow: 2 },
      ],
      12,
    );
    expect(out[0]).toEqual({ lane: 0, span: 6, row: 0, rows: 2 });
  });
});
