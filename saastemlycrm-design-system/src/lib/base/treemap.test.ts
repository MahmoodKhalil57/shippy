import { describe, it, expect } from "vite-plus/test";
import { squarify, type Rect } from "./treemap";

const area = (r: Rect) => r.w * r.h;
const inside = (r: Rect, w: number, h: number) =>
  r.x >= -1e-9 && r.y >= -1e-9 && r.x + r.w <= w + 1e-9 && r.y + r.h <= h + 1e-9;
const overlap = (a: Rect, b: Rect) =>
  Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 1e-9 &&
  Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 1e-9;

describe("squarify", () => {
  it("returns empty rects for no area or no positive values", () => {
    const empty = { x: 0, y: 0, w: 0, h: 0 };
    expect(squarify([], 10, 10)).toEqual([]);
    expect(squarify([0, -3], 10, 10)).toEqual([empty, empty]);
    expect(squarify([1, 2], 0, 10)).toEqual([empty, empty]);
    expect(squarify([1, 2], 10, -1)).toEqual([empty, empty]);
  });

  it("fills a single value edge to edge", () => {
    expect(squarify([7], 30, 20)).toEqual([{ x: 0, y: 0, w: 30, h: 20 }]);
  });

  it("tiles the box with areas proportional to values and no overlap", () => {
    const values = [6, 6, 4, 3, 2, 2, 1];
    const w = 600;
    const h = 400;
    const rects = squarify(values, w, h);
    const total = values.reduce((a, b) => a + b, 0);
    rects.forEach((r, i) => {
      expect(area(r)).toBeCloseTo((values[i]! / total) * w * h, 6);
      expect(inside(r, w, h)).toBe(true);
    });
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) expect(overlap(rects[i]!, rects[j]!)).toBe(false);
    expect(rects.reduce((t, r) => t + area(r), 0)).toBeCloseTo(w * h, 6);
  });

  it("lays strips down the short side for tall boxes", () => {
    const rects = squarify([3, 1], 100, 400);
    expect(rects[0]).toEqual({ x: 0, y: 0, w: 100, h: 300 });
    expect(rects[1]).toEqual({ x: 0, y: 300, w: 100, h: 100 });
  });

  it("keeps the original index order for ties and skips non-positive values", () => {
    const rects = squarify([2, 0, 2], 200, 100);
    expect(rects[1]).toEqual({ x: 0, y: 0, w: 0, h: 0 });
    expect(rects[0]!.x).toBe(0);
    expect(rects[2]!.x).toBe(100);
  });
});
