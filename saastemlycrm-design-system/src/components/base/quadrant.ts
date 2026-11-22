/**
 * A quadrant chart's arithmetic: the median that splits each axis, the padded domain each axis
 * shows, where a value sits on it (0–100%), and which quadrant a point is in. No DOM;
 * tests/quadrant.test.ts proves it over every multiset of 1–5 values from 0..4 and every point of
 * a grid: the median has at least half the values on each side, the domain holds every value
 * strictly inside, a position is monotone and clamped, and a point's quadrant is the one it's drawn
 * in (above the horizontal midline on screen is the top row, past the vertical one the end column).
 */

/** The middle value (the mean of the two middle ones for an even count); 0 for none. */
export function median(values: readonly number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

/** The values' extent padded by 8% of its span a side (by 1 when they're all one value). */
export function paddedExtent(values: readonly number[]): [number, number] {
  if (!values.length) return [0, 1];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = hi > lo ? (hi - lo) * 0.08 : 1;
  return [lo - pad, hi + pad];
}

/** Where `v` sits in the domain, 0 (its low end) to 100 (its high end), clamped to the plot. */
export function position(v: number, [lo, hi]: readonly [number, number]): number {
  if (!(hi > lo)) return 50;
  return Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
}

/** Height from the plot's bottom (%): high values up, or low ones up with `invert` (lower is better). */
export const heightOf = (v: number, domain: readonly [number, number], invert = false): number =>
  invert ? 100 - position(v, domain) : position(v, domain);

/** The quadrants in reading order. */
export type Quadrant = 0 | 1 | 2 | 3; // top start, top end, bottom start, bottom end

/**
 * Which quadrant a point is drawn in: the top row when it's above the horizontal midline (higher
 * y, or lower with `invert`), the end column when it's past the vertical one. A point on a line
 * counts as the better side: the top, and the end.
 */
export function quadrantOf(x: number, y: number, xMid: number, yMid: number, invert = false): Quadrant {
  const top = invert ? y <= yMid : y >= yMid;
  const end = x >= xMid;
  return ((top ? 0 : 2) + (end ? 1 : 0)) as Quadrant;
}

/** A dot's size step (0–3) for `size` among sizes up to `most`, by area (√), so area reads as amount. */
export function sizeStep(size: number | undefined, most: number): 0 | 1 | 2 | 3 {
  if (size === undefined || !(size > 0) || !(most > 0)) return 0;
  return Math.min(3, Math.round(Math.sqrt(Math.min(1, size / most)) * 3)) as 0 | 1 | 2 | 3;
}
