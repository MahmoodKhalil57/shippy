export function median(values: readonly number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

export function paddedExtent(values: readonly number[]): [number, number] {
  if (!values.length) return [0, 1];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = hi > lo ? (hi - lo) * 0.08 : 1;
  return [lo - pad, hi + pad];
}

export function position(v: number, [lo, hi]: readonly [number, number]): number {
  if (!(hi > lo)) return 50;
  return Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
}

export const heightOf = (v: number, domain: readonly [number, number], invert = false): number =>
  invert ? 100 - position(v, domain) : position(v, domain);

export type Quadrant = 0 | 1 | 2 | 3;

export function quadrantOf(x: number, y: number, xMid: number, yMid: number, invert = false): Quadrant {
  const top = invert ? y <= yMid : y >= yMid;
  const end = x >= xMid;
  return ((top ? 0 : 2) + (end ? 1 : 0)) as Quadrant;
}

export function sizeStep(size: number | undefined, most: number): 0 | 1 | 2 | 3 {
  if (size === undefined || !(size > 0) || !(most > 0)) return 0;
  return Math.min(3, Math.round(Math.sqrt(Math.min(1, size / most)) * 3)) as 0 | 1 | 2 | 3;
}
