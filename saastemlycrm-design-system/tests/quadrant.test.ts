import { describe, expect, it } from "vite-plus/test";
import { heightOf, median, paddedExtent, position, quadrantOf, sizeStep } from "../src/components/base/quadrant.ts";

/**
 * The quadrant chart's arithmetic (src/components/base/quadrant.ts), proved over finite domains:
 * - for every multiset of 1–5 values from 0..4 (and each in reverse order): at least half the
 *   values are ≤ the median and at least half ≥ it; the padded extent holds every value strictly
 *   inside; positions in it are monotone, within 0..100, and its ends are 0 and 100;
 * - for every point and every pair of midlines on a 0..4 grid, upright and inverted: the quadrant
 *   it's in is the one it's drawn in (top row ⇔ drawn at or above the horizontal midline, end
 *   column ⇔ at or past the vertical one);
 * - a dot's size step grows with its size and stays 0–3.
 */

function* multisets(k: number, lo: number, hi: number, from = lo): Generator<number[]> {
  if (k === 0) return yield [];
  for (let v = from; v <= hi; v++) for (const rest of multisets(k - 1, lo, hi, v)) yield [v, ...rest];
}

describe("median and domain", () => {
  it("split and hold every multiset of 1–5 values from 0..4", () => {
    const bad: string[] = [];
    for (let k = 1; k <= 5; k++)
      for (const m of multisets(k, 0, 4))
        for (const vs of [m, [...m].reverse()]) {
          const md = median(vs);
          if (vs.filter((v) => v <= md).length * 2 < vs.length)
            bad.push(`[${vs.join(",")}] median ${md}: under half below`);
          if (vs.filter((v) => v >= md).length * 2 < vs.length)
            bad.push(`[${vs.join(",")}] median ${md}: under half above`);
          const d = paddedExtent(vs);
          if (!vs.every((v) => v > d[0] && v < d[1]))
            bad.push(`[${vs.join(",")}] extent ${d.join(",")}: not strictly inside`);
          if (position(d[0], d) !== 0 || position(d[1], d) !== 100) bad.push(`[${vs.join(",")}] ends`);
          const sorted = [...vs].sort((a, b) => a - b);
          for (let i = 1; i < sorted.length; i++)
            if (position(sorted[i]!, d) < position(sorted[i - 1]!, d)) bad.push(`[${vs.join(",")}] not monotone`);
          if (!vs.every((v) => position(v, d) > 0 && position(v, d) < 100))
            bad.push(`[${vs.join(",")}] not inside 0..100`);
        }
    expect(bad).toEqual([]);
    expect(median([])).toBe(0);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  it("clamps positions to the plot", () => {
    expect(position(-5, [0, 10])).toBe(0);
    expect(position(15, [0, 10])).toBe(100);
    expect(position(3, [2, 2])).toBe(50);
    expect(heightOf(2, [0, 10], true)).toBe(80);
  });
});

describe("quadrantOf", () => {
  it("is the quadrant each point is drawn in, for every point and midline on a 0..4 grid", () => {
    const d: [number, number] = [-1, 5];
    const bad: string[] = [];
    for (const invert of [false, true])
      for (let x = 0; x <= 4; x++)
        for (let y = 0; y <= 4; y++)
          for (let xm = 0; xm <= 4; xm++)
            for (let ym = 0; ym <= 4; ym++) {
              const q = quadrantOf(x, y, xm, ym, invert);
              const top = heightOf(y, d, invert) >= heightOf(ym, d, invert);
              const end = position(x, d) >= position(xm, d);
              if (q !== (top ? 0 : 2) + (end ? 1 : 0)) bad.push(`(${x},${y}) mid (${xm},${ym}) invert ${invert}: ${q}`);
            }
    expect(bad).toEqual([]);
  });
});

describe("sizeStep", () => {
  it("grows with size and stays 0–3", () => {
    let last = 0;
    for (let s = 0; s <= 100; s++) {
      const k = sizeStep(s, 100);
      expect(k).toBeGreaterThanOrEqual(last);
      expect(k).toBeLessThanOrEqual(3);
      last = k;
    }
    expect(sizeStep(undefined, 10)).toBe(0);
    expect(sizeStep(100, 100)).toBe(3);
  });
});
