import { describe, it, expect } from "vite-plus/test";
import { place, type Placed } from "./board";
import { aligned, bandsOf, contact, less, pack, score, slides, type PackInput } from "./pack";

const box = (lane: number, row: number, span: number, rows: number): Placed => ({ lane, row, span, rows });

const valid = (out: Placed[], tiles: readonly PackInput[], lanes: number) => {
  expect(out).toHaveLength(tiles.length);
  out.forEach((b) => {
    expect(b.lane).toBeGreaterThanOrEqual(0);
    expect(b.row).toBeGreaterThanOrEqual(0);
    expect(b.span).toBeGreaterThanOrEqual(1);
    expect(b.rows).toBeGreaterThanOrEqual(1);
    expect(b.lane + b.span).toBeLessThanOrEqual(lanes);
  });
  for (let i = 0; i < out.length; i++)
    for (let j = i + 1; j < out.length; j++) {
      const a = out[i]!;
      const b = out[j]!;
      const hit =
        a.row < b.row + b.rows && a.row + a.rows > b.row && a.lane < b.lane + b.span && a.lane + a.span > b.lane;
      expect(hit).toBe(false);
    }
};

const gapsOf = (out: Placed[], lanes: number) =>
  lanes * Math.max(0, ...out.map((b) => b.row + b.rows)) - out.reduce((n, b) => n + b.span * b.rows, 0);

describe("less", () => {
  it("compares gaps first, then shape beyond rounding noise", () => {
    expect(less([0, 9], [1, 0])).toBe(true);
    expect(less([1, 0], [0, 9])).toBe(false);
    expect(less([2, 1], [2, 2])).toBe(true);
    expect(less([2, 2], [2, 2 + 1e-12])).toBe(false);
    expect(less([2, 2], [2, 1])).toBe(false);
  });
});

describe("contact", () => {
  it("is full for boxes sharing an edge or overlapping", () => {
    expect(contact(box(0, 0, 2, 2), box(2, 0, 2, 2))).toBe(1);
    expect(contact(box(0, 0, 2, 2), box(0, 2, 2, 1))).toBe(1);
    expect(contact(box(0, 0, 2, 2), box(1, 1, 2, 2))).toBe(1);
  });

  it("is half for boxes meeting at a corner", () => {
    expect(contact(box(0, 0, 2, 2), box(2, 2, 1, 1))).toBe(0.5);
  });

  it("is zero for boxes a lane or more apart", () => {
    expect(contact(box(0, 0, 1, 1), box(2, 0, 1, 1))).toBe(0);
    expect(contact(box(0, 0, 1, 1), box(0, 5, 1, 1))).toBe(0);
    expect(contact(box(3, 3, 1, 1), box(0, 0, 1, 1))).toBe(0);
  });
});

describe("aligned", () => {
  it("counts shared top and bottom lines of side-by-side boxes", () => {
    expect(aligned(box(0, 0, 2, 3), box(2, 0, 2, 3))).toBe(2);
    expect(aligned(box(2, 0, 2, 3), box(0, 1, 2, 2))).toBe(1);
    expect(aligned(box(0, 0, 2, 3), box(2, 1, 2, 1))).toBe(0);
  });

  it("counts shared start and end lines of stacked boxes", () => {
    expect(aligned(box(0, 0, 4, 2), box(0, 2, 4, 1))).toBe(2);
    expect(aligned(box(0, 3, 4, 2), box(1, 0, 3, 3))).toBe(1);
  });

  it("counts a corner as both lines and apart boxes as none", () => {
    expect(aligned(box(0, 0, 2, 2), box(2, 2, 1, 1))).toBe(2);
    expect(aligned(box(0, 0, 1, 1), box(3, 3, 1, 1))).toBe(0);
  });
});

describe("score", () => {
  it("counts empty cells under the skyline", () => {
    const tiles: PackInput[] = [
      { size: "s", rows: 2 },
      { size: "s", rows: 4 },
    ];
    expect(score([box(0, 0, 6, 2), box(6, 0, 6, 4)], tiles, 12)[0]).toBe(12);
    expect(score([box(0, 0, 6, 4), box(6, 0, 6, 4)], tiles, 12)[0]).toBe(0);
    expect(score([], [], 12)).toEqual([0, 0]);
  });

  it("prefers tiles at their asked size", () => {
    const tiles: PackInput[] = [{ size: "s", rows: 4 }];
    const asked = score([box(0, 0, 6, 4)], tiles, 6);
    const stretched = score([box(0, 0, 6, 8)], tiles, 6);
    expect(asked[1]).toBeCloseTo(0);
    expect(less(asked, stretched)).toBe(true);
  });

  it("rewards neighbours with matching edges", () => {
    const tiles: PackInput[] = [
      { size: "s", rows: 4 },
      { size: "s", rows: 4 },
    ];
    const flush = score([box(0, 0, 6, 4), box(6, 0, 6, 4)], tiles, 12)[1];
    const apart = score([box(0, 0, 6, 4), box(6, 4, 6, 4)], tiles, 12)[1];
    expect(flush).toBeGreaterThan(apart);
  });
});

const flexible = (rows: number, extra: Partial<PackInput> = {}): PackInput => ({
  size: "m",
  rows,
  bounds: { minSpan: 3, maxSpan: 24, minRows: 1, maxRows: rows * 3 },
  ...extra,
});

describe("slides", () => {
  it("moves the seam between neighbours within their bounds", () => {
    const tiles = [flexible(4), flexible(4)];
    const boxes = [box(0, 0, 12, 4), box(12, 0, 12, 4)];
    const moved = slides(boxes, tiles, 24);
    expect(moved.length).toBeGreaterThan(0);
    for (const m of moved) {
      valid(m, tiles, 24);
      expect(m[0]!.span + m[1]!.span).toBe(24);
      expect(m[0]!.span).not.toBe(12);
    }
  });

  it("offers nothing for fixed-size tiles", () => {
    const tiles: PackInput[] = [
      { size: "m", rows: 4 },
      { size: "m", rows: 4 },
    ];
    expect(slides([box(0, 0, 12, 4), box(12, 0, 12, 4)], tiles, 24)).toEqual([]);
  });

  it("moves horizontal seams and drops rows into a filled grid", () => {
    const tiles = [flexible(4), flexible(4), flexible(4)];
    const boxes = [box(0, 0, 12, 4), box(0, 4, 12, 4), box(12, 0, 12, 8)];
    const moved = slides(boxes, tiles, 24);
    expect(moved.some((m) => m[0]!.span === m[1]!.span && m[0]!.span !== 12 && m[2]!.lane === m[0]!.span)).toBe(true);
    expect(moved.some((m) => Math.max(...m.map((b) => b.row + b.rows)) > 8)).toBe(true);
    for (const m of moved) valid(m, tiles, 24);
  });

  it("keeps a box that straddles a seam whole and every move valid", () => {
    const tiles: PackInput[] = Array.from({ length: 7 }, () => ({ size: "s", rows: 2 }));
    const boxes = [
      box(0, 0, 1, 2),
      box(1, 0, 2, 4),
      box(3, 0, 1, 2),
      box(0, 2, 1, 4),
      box(3, 2, 1, 4),
      box(1, 4, 1, 2),
      box(2, 4, 1, 2),
    ];
    for (const m of slides(boxes, tiles, 4)) {
      valid(m, tiles, 4);
      expect(m[1]).toEqual(boxes[1]);
    }
  });
});

describe("bandsOf", () => {
  it("skips templates that round to an empty column", () => {
    const tiles: PackInput[] = [{ size: "s", rows: 2 }];
    const all = bandsOf(tiles, 3)(0, 1);
    expect(all.map((b) => b.boxes)).toEqual([[box(0, 0, 3, 2)]]);
  });

  it("memoises bands per tile range", () => {
    const tiles = [flexible(4), flexible(4), flexible(2)];
    const of = bandsOf(tiles, 24);
    const all = of(0, 3);
    expect(of(0, 3)).toBe(all);
    expect(all.length).toBeGreaterThan(0);
    for (const band of all) {
      valid(band.boxes, tiles, 24);
      expect(band.height).toBe(Math.max(...band.boxes.map((b) => b.row + b.rows)));
      expect(band.cost[0]).toBe(gapsOf(band.boxes, 24));
      expect(band.top.every((e) => band.boxes.some((b) => b.row === 0 && b.lane === e.lane))).toBe(true);
    }
  });

  it("stacks tiles that cannot sit side by side", () => {
    const tiles: PackInput[] = [
      { size: "m", rows: 2, span: 10 },
      { size: "m", rows: 3, span: 10 },
    ];
    const all = bandsOf(tiles, 12)(0, 2);
    expect(all.map((b) => b.boxes)).toEqual([[box(0, 0, 10, 2), box(0, 2, 10, 3)]]);
    expect(all[0]!.top).toHaveLength(1);
    expect(all[0]!.bottom).toHaveLength(1);
  });
});

describe("pack", () => {
  it("returns nothing for no tiles", () => {
    expect(pack([], 12)).toEqual([]);
  });

  it("packs tiles without overlap inside the lanes", () => {
    const tiles: PackInput[] = [
      { size: "s", rows: 3, bounds: { minRows: 2, maxRows: 6 } },
      { size: "m", rows: 8, bounds: { minSpan: 6, maxSpan: 18, minRows: 4, maxRows: 14 } },
      { size: "s", rows: 4, bounds: { minRows: 3, maxRows: 8 } },
      { size: "l", rows: 10, bounds: { minSpan: 8, minRows: 5, maxRows: 30 } },
      { size: "s", rows: 2 },
    ];
    for (const lanes of [6, 12, 18, 24]) {
      const out = pack(tiles, lanes);
      valid(out, tiles, lanes);
      expect(less(score(place(tiles, lanes), tiles, lanes), score(out, tiles, lanes))).toBe(false);
    }
  });

  it("never scores worse than the plain flow layout", () => {
    const tiles = [flexible(4), flexible(6), flexible(3), flexible(5)];
    for (const lanes of [12, 24]) {
      const out = pack(tiles, lanes);
      valid(out, tiles, lanes);
      expect(less(score(place(tiles, lanes), tiles, lanes), score(out, tiles, lanes))).toBe(false);
    }
  });

  it("falls back to the flow layout when it beats every band layout", () => {
    const tiles: PackInput[] = [
      { size: "s", rows: 3 },
      { size: "s", rows: 1, bounds: { minSpan: 5, maxSpan: 15, minRows: 1, maxRows: 4 }, span: 10 },
      { size: "l", rows: 5 },
      { size: "l", rows: 2, span: 6 },
    ];
    expect(pack(tiles, 24, false)).toEqual(place(tiles, 24));
  });

  it("puts a fixed tile across every lane", () => {
    const tiles: PackInput[] = [
      { size: "s", rows: 2 },
      { size: "s", rows: 3, fixed: true },
      { size: "s", rows: 2 },
    ];
    const out = pack(tiles, 12);
    valid(out, tiles, 12);
    expect(out[1]).toMatchObject({ lane: 0, span: 12, rows: 3 });
  });

  it("can skip the sliding pass", () => {
    const tiles = [flexible(4), flexible(6), flexible(3)];
    const out = pack(tiles, 24, false);
    valid(out, tiles, 24);
    expect(less(score(out, tiles, 24), score(pack(tiles, 24), tiles, 24))).toBe(false);
  });

  it("returns fresh copies of cached layouts", () => {
    const tiles = [flexible(4), flexible(4)];
    const a = pack(tiles, 24);
    a[0]!.lane = 99;
    const b = pack(tiles, 24);
    expect(b[0]!.lane).not.toBe(99);
    expect(b).toEqual(pack(tiles, 24));
    expect(b[0]).not.toBe(pack(tiles, 24)[0]);
  });

  it("keeps working after its cache fills up", () => {
    for (let r = 1; r <= 205; r++) {
      const tiles: PackInput[] = [{ size: "s", rows: r }];
      expect(pack(tiles, 6, false)).toEqual([{ lane: 0, span: 6, row: 0, rows: Math.min(r, 200) }]);
    }
  });
});
