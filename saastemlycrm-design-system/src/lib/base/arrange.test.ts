import { describe, it, expect } from "vite-plus/test";
import { compact, insert, putAt, settle, type Box, type Spot } from "./arrange";

type Spec = Record<string, [lane: number, row: number, span: number, rows: number]>;

const boxes = (spec: Spec) =>
  new Map(Object.entries(spec).map(([k, [lane, row, span, rows]]) => [k, { lane, row, span, rows }]));
const spots = (out: Map<string, Spot | Box>) =>
  Object.fromEntries([...out].sort(([a], [b]) => a.localeCompare(b)).map(([k, s]) => [k, [s.lane, s.row]]));
const none = new Set<string>();

const overlapFree = (spec: Spec, out: Map<string, Spot>, lanes: number) => {
  const placed = [...out].map(([k, s]) => ({ ...s, span: spec[k]![2], rows: spec[k]![3] }));
  for (const b of placed) {
    expect(b.lane).toBeGreaterThanOrEqual(0);
    expect(b.row).toBeGreaterThanOrEqual(0);
    expect(b.lane + b.span).toBeLessThanOrEqual(lanes);
  }
  for (let i = 0; i < placed.length; i++)
    for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i]!;
      const b = placed[j]!;
      const hit =
        a.row < b.row + b.rows && a.row + a.rows > b.row && a.lane < b.lane + b.span && a.lane + a.span > b.lane;
      expect(hit).toBe(false);
    }
};

describe("settle", () => {
  it("pushes overlapped boxes below the mover, transitively", () => {
    const b = boxes({ m: [0, 0, 2, 2], a: [0, 1, 1, 1], c: [0, 2, 2, 1], x: [3, 0, 1, 1] });
    settle(b, ["m"], none);
    expect(spots(b)).toEqual({ a: [0, 2], c: [0, 3], m: [0, 0], x: [3, 0] });
  });

  it("drops boxes below fixed and already settled boxes instead of overlapping them", () => {
    const b = boxes({ m: [0, 0, 1, 1], n: [0, 0, 1, 1], f: [0, 0, 1, 1] });
    settle(b, ["m", "n"], new Set(["f"]));
    expect(spots(b)).toEqual({ f: [0, 0], m: [0, 1], n: [0, 2] });
  });

  it("drops a pushed box past a fixed box in its way", () => {
    const b = boxes({ m: [0, 0, 2, 1], a: [0, 0, 1, 1], f: [0, 1, 1, 2], c: [1, 1, 1, 1] });
    settle(b, ["m"], new Set(["f"]));
    expect(spots(b)).toEqual({ a: [0, 3], c: [1, 1], f: [0, 1], m: [0, 0] });
  });

  it("does nothing without movers", () => {
    const b = boxes({ a: [0, 0, 1, 1], c: [0, 0, 1, 1] });
    settle(b, [], none);
    expect(spots(b)).toEqual({ a: [0, 0], c: [0, 0] });
  });
});

describe("insert beside a box", () => {
  it("puts the mover before the target and shifts the row along", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [1, 0, 1, 1], c: [2, 0, 1, 1], d: [3, 0, 1, 1] };
    const out = insert(boxes(spec), "d", "a", "start", 4, 0, none);
    expect(spots(out)).toEqual({ a: [1, 0], b: [2, 0], c: [3, 0], d: [0, 0] });
    overlapFree(spec, out, 4);
  });

  it("puts the mover after the target into free room", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [1, 0, 1, 1], c: [2, 0, 1, 1], d: [0, 1, 1, 1] };
    const out = insert(boxes(spec), "d", "b", "end", 4, 0, none);
    expect(spots(out)).toEqual({ a: [0, 0], b: [1, 0], c: [3, 0], d: [2, 0] });
    overlapFree(spec, out, 4);
  });

  it("shifts earlier boxes back and drops those that run out of room", () => {
    const spec: Spec = { a: [0, 0, 2, 1], b: [2, 0, 2, 1], d: [0, 1, 2, 1] };
    const out = insert(boxes(spec), "d", "b", "end", 4, 0, none);
    expect(spots(out)).toEqual({ a: [0, 1], b: [0, 0], d: [2, 0] });
    overlapFree(spec, out, 4);
  });

  it("never shifts back past a fixed box", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [2, 0, 1, 1], d: [0, 1, 2, 1] };
    const out = insert(boxes(spec), "d", "b", "end", 4, 0, new Set(["a"]));
    expect(spots(out)).toEqual({ a: [0, 0], b: [1, 0], d: [2, 0] });
    overlapFree(spec, out, 4);
  });

  it("keeps fixed boxes put and wraps boxes pushed past the last lane", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [1, 0, 1, 1], c: [2, 0, 2, 1], f: [0, 1, 1, 1], d: [1, 1, 2, 1] };
    const out = insert(boxes(spec), "d", "b", "start", 4, 0, new Set(["f"]));
    overlapFree(spec, out, 4);
    expect(out.get("f")).toEqual({ lane: 0, row: 1 });
    expect(out.get("d")).toEqual({ lane: 1, row: 0 });
    expect(out.get("c")).toEqual({ lane: 0, row: 2 });
  });

  it("clamps the mover inside the lanes", () => {
    const spec: Spec = { a: [0, 0, 3, 1], d: [0, 1, 2, 1] };
    const out = insert(boxes(spec), "d", "a", "end", 4, 0, none);
    expect(out.get("d")).toEqual({ lane: 2, row: 0 });
    overlapFree(spec, out, 4);
  });
});

describe("insert above or below a box", () => {
  it("puts the mover above the target and pushes the target down", () => {
    const spec: Spec = { a: [0, 0, 2, 1], b: [0, 1, 2, 1], d: [2, 0, 2, 1] };
    const out = insert(boxes(spec), "d", "b", "top", 4, 0, none);
    expect(spots(out)).toEqual({ a: [0, 0], b: [0, 2], d: [0, 1] });
  });

  it("puts the mover below the target, using the gap above when there is one", () => {
    const spec: Spec = { a: [0, 0, 2, 1], b: [0, 3, 2, 1], d: [2, 0, 2, 1] };
    expect(spots(insert(boxes(spec), "d", "b", "bottom", 4, 0, none))).toEqual({ a: [0, 0], b: [0, 2], d: [0, 3] });
    const tall: Spec = { a: [0, 0, 2, 1], b: [0, 3, 2, 1], d: [2, 0, 2, 2] };
    expect(spots(insert(boxes(tall), "d", "a", "bottom", 4, 0, none))).toEqual({ a: [0, 0], b: [0, 3], d: [0, 1] });
  });

  it("stops lifting the column at a fixed box", () => {
    const spec: Spec = { f: [0, 0, 2, 1], a: [0, 1, 2, 1], b: [0, 4, 2, 1], d: [2, 0, 2, 1] };
    const out = insert(boxes(spec), "d", "b", "bottom", 4, 0, new Set(["f"]));
    overlapFree(spec, out, 4);
    expect(out.get("f")).toEqual({ lane: 0, row: 0 });
    expect(out.get("d")!.row).toBeGreaterThan(out.get("b")!.row);
  });

  it("clamps the requested lane", () => {
    const spec: Spec = { a: [0, 0, 1, 1], d: [3, 3, 2, 1] };
    expect(insert(boxes(spec), "d", "a", "bottom", 4, 9, none).get("d")!.lane).toBe(2);
    expect(insert(boxes(spec), "d", "a", "top", 4, -3, none).get("d")).toEqual({ lane: 0, row: 0 });
  });

  it("places below with no room when the column is full", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [0, 1, 1, 1], d: [1, 0, 1, 1] };
    const out = insert(boxes(spec), "d", "b", "bottom", 2, 0, none);
    expect(spots(out)).toEqual({ a: [0, 0], b: [0, 1], d: [0, 2] });
  });
});

describe("putAt", () => {
  it("moves a box to a spot and makes room along the row", () => {
    const spec: Spec = { a: [0, 0, 2, 1], b: [2, 0, 2, 1], d: [0, 1, 2, 1] };
    const out = putAt(boxes(spec), "d", { lane: 1, row: 0 }, 4, none);
    expect(spots(out)).toEqual({ a: [0, 2], b: [0, 1], d: [1, 0] });
    overlapFree(spec, out, 4);
  });

  it("wraps boxes that no longer fit onto a new row", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [1, 0, 1, 1], c: [2, 0, 1, 1], d: [0, 1, 2, 1] };
    const out = putAt(boxes(spec), "d", { lane: 2, row: 0 }, 4, none);
    expect(spots(out)).toEqual({ a: [0, 0], b: [1, 0], c: [0, 1], d: [2, 0] });
    overlapFree(spec, out, 4);
  });

  it("never moves fixed boxes and drops the mover below one at its spot", () => {
    const spec: Spec = { f: [1, 0, 1, 1], d: [0, 2, 1, 1] };
    const out = putAt(boxes(spec), "d", { lane: 1, row: 0 }, 4, new Set(["f"]));
    expect(spots(out)).toEqual({ d: [1, 1], f: [1, 0] });
  });
});

describe("putAt chains", () => {
  it("wraps a box that a shifted neighbour pushes past the last lane", () => {
    const spec: Spec = { a: [0, 0, 1, 1], b: [1, 0, 2, 1], m: [0, 1, 2, 1] };
    const out = putAt(boxes(spec), "m", { lane: 0, row: 0 }, 4, none);
    expect(spots(out)).toEqual({ a: [2, 0], b: [0, 1], m: [0, 0] });
    overlapFree(spec, out, 4);
  });
});

describe("compact", () => {
  it("orders boxes in the same row by lane", () => {
    const spec: Spec = { r: [2, 3, 2, 1], l: [0, 3, 3, 1] };
    expect(spots(compact(boxes(spec), none))).toEqual({ l: [0, 0], r: [2, 1] });
  });

  it("floats boxes up into free rows, keeping fixed boxes in place", () => {
    const spec: Spec = { a: [0, 2, 1, 1], b: [0, 5, 1, 2], c: [1, 3, 1, 1], f: [2, 4, 1, 1] };
    expect(spots(compact(boxes(spec), new Set(["f"])))).toEqual({ a: [0, 0], b: [0, 1], c: [1, 0], f: [2, 4] });
  });

  it("stops below boxes already placed and is stable", () => {
    const spec: Spec = { a: [0, 0, 2, 1], b: [1, 3, 2, 1] };
    const once = compact(boxes(spec), none);
    expect(spots(once)).toEqual({ a: [0, 0], b: [1, 1] });
    const again = compact(new Map([...once].map(([k, s]) => [k, { ...s, span: 2, rows: 1 }])), none);
    expect(spots(again)).toEqual(spots(once));
  });

  it("returns nothing for no boxes", () => {
    expect(compact(new Map(), none).size).toBe(0);
  });
});
