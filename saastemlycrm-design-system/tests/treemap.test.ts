import { describe, expect, it } from "vite-plus/test";
import { squarify, type Rect } from "../src/components/base/treemap.ts";

/**
 * The treemap's layout (src/components/base/treemap.ts), proved over a finite domain by checking
 * every case in it: every multiset of 1–5 values from 1..6 (461 of them), each given largest first,
 * smallest first and interleaved, in boxes of five aspect ratios (square, landscape, portrait, a
 * wide strip and a tall one). For each:
 * - every rectangle is inside the box;
 * - no two overlap (their intersection has no area);
 * - each rectangle's area is its value's share of the box;
 * - together their areas are the box's.
 * The last two with the first two mean the rectangles tile the box exactly.
 */

const EPS = 1e-9;
const BOXES: [number, number][] = [
  [1, 1],
  [16, 10],
  [10, 16],
  [3, 1],
  [1, 3],
];

/** Every multiset of `k` values from `lo..hi`, ascending. */
function* multisets(k: number, lo: number, hi: number, from = lo): Generator<number[]> {
  if (k === 0) return yield [];
  for (let v = from; v <= hi; v++) for (const rest of multisets(k - 1, lo, hi, v)) yield [v, ...rest];
}

const orders = (m: number[]): number[][] => {
  const inter = m.map((_, i) => m[i % 2 ? m.length - 1 - (i >> 1) : i >> 1]!);
  return [m, [...m].reverse(), inter];
};

const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

function problems(values: number[], W: number, H: number): string[] {
  const rs = squarify(values, W, H);
  const out: string[] = [];
  const total = values.reduce((t, v) => t + v, 0);
  const box = W * H;
  if (rs.length !== values.length) out.push("one rectangle per value");
  rs.forEach((r, i) => {
    if (r.x < -EPS || r.y < -EPS || r.x + r.w > W + EPS || r.y + r.h > H + EPS || r.w < -EPS || r.h < -EPS)
      out.push(`${i} outside the box`);
    if (Math.abs(r.w * r.h - (values[i]! / total) * box) > EPS * box) out.push(`${i} area not its share`);
    for (let j = i + 1; j < rs.length; j++) if (overlap(r, rs[j]!) > EPS * box) out.push(`${i} overlaps ${j}`);
  });
  if (Math.abs(rs.reduce((t, r) => t + r.w * r.h, 0) - box) > EPS * box) out.push("areas don't make the box");
  return out;
}

describe("squarify", () => {
  it("tiles the box, each part its share, for every multiset of 1–5 values from 1..6 on five boxes", () => {
    let cases = 0;
    const bad: string[] = [];
    for (let k = 1; k <= 5; k++)
      for (const m of multisets(k, 1, 6))
        for (const vs of orders(m))
          for (const [W, H] of BOXES) {
            cases++;
            for (const p of problems(vs, W, H)) bad.push(`[${vs.join(",")}] in ${W}×${H}: ${p}`);
          }
    expect(cases).toBe(461 * 3 * 5);
    expect(bad).toEqual([]);
  });

  it("puts the largest part at the box's start corner", () => {
    for (let k = 1; k <= 5; k++)
      for (const m of multisets(k, 1, 6))
        for (const [W, H] of BOXES) {
          const vs = [...m].reverse();
          const r = squarify(vs, W, H)[0]!;
          expect([r.x, r.y]).toEqual([0, 0]);
        }
  });

  it("gives nothing to a part of zero or less, and nothing in an empty box", () => {
    const rs = squarify([3, 0, -2, 1], 4, 2);
    expect(rs[1]).toEqual({ x: 0, y: 0, w: 0, h: 0 });
    expect(rs[2]).toEqual({ x: 0, y: 0, w: 0, h: 0 });
    expect(problems([3, 1], 4, 2)).toEqual([]);
    expect(rs[0]!.w * rs[0]!.h + rs[3]!.w * rs[3]!.h).toBeCloseTo(8);
    expect(squarify([1, 2], 0, 5).every((r) => r.w * r.h === 0)).toBe(true);
    expect(squarify([], 4, 4)).toEqual([]);
  });
});
