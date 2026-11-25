export const TICK_STEPS = [1, 2, 2.5, 5, 10] as const;
export const WHOLE_STEPS = [1, 2, 4, 5, 10] as const;

const clean = (v: number) => Number(v.toPrecision(12));

export interface Scale {
  top: number;
  step: number;
  ticks: number[];
}
const scale = (step: number, count: number): Scale => ({
  top: clean(step * count),
  step,
  ticks: Array.from({ length: count + 1 }, (_, i) => clean(i * step)),
});

export function niceScale(max: number, whole = false): Scale {
  const m = Number.isFinite(max) && max > 0 ? max : 1;
  const base = 10 ** Math.floor(Math.log10(m / 4));
  for (const size of TICK_STEPS) {
    const step = clean(size * base);
    const count = Math.ceil(m / step - 1e-9);
    if (count > 4) continue;
    if (!whole || Number.isInteger(step)) return scale(step, count);
    for (const one of WHOLE_STEPS) {
      const steps = Math.max(3, Math.ceil(m / one - 1e-9));
      if (steps <= 4) return scale(one, steps);
    }
  }
  return { top: m, step: m, ticks: [0, m] };
}

export function decimalsOf(step: number): number {
  for (let d = 0; d < 3; d++) if (Math.abs(step * 10 ** d - Math.round(step * 10 ** d)) < 1e-9) return d;
  return 3;
}

export type Point = [x: number, y: number];

export function smoothSegments(points: Point[]): [Point, Point, Point][] {
  const n = points.length;
  if (n < 2) return [];
  const slope = Array.from({ length: n - 1 }, (_, i) => {
    const dx = points[i + 1]![0] - points[i]![0];
    return dx === 0 ? 0 : (points[i + 1]![1] - points[i]![1]) / dx;
  });
  const tangent = points.map((_, i) => {
    if (i === 0) return slope[0]!;
    if (i === n - 1) return slope[n - 2]!;
    const a = slope[i - 1]!;
    const b = slope[i]!;
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  return slope.map((_, i) => {
    const [x0, y0] = points[i]!;
    const [x1, y1] = points[i + 1]!;
    const third = (x1 - x0) / 3;
    return [
      [x0 + third, y0 + tangent[i]! * third],
      [x1 - third, y1 - tangent[i + 1]! * third],
      [x1, y1],
    ];
  });
}

const fixed = (v: number) => Number(v.toFixed(3));
export function smoothPath(points: Point[], join = false): string {
  if (!points.length) return "";
  const [x, y] = points[0]!;
  const start = `${join ? "L" : "M"}${fixed(x)},${fixed(y)}`;
  return [
    start,
    ...smoothSegments(points).map(
      ([a, b, c]) => `C${fixed(a[0])},${fixed(a[1])} ${fixed(b[0])},${fixed(b[1])} ${fixed(c[0])},${fixed(c[1])}`,
    ),
  ].join(" ");
}

export interface Axis {
  slot: number;
  edge: number;
}
export function axisOf(count: number, bars: boolean): Axis {
  if (bars) return { slot: count > 0 ? 100 / count : 100, edge: 0.5 };
  return count > 1 ? { slot: 100 / (count - 1), edge: 0 } : { slot: 100, edge: 0.5 };
}
export const pointAt = (i: number, axis: Axis) => (i + axis.edge) * axis.slot;

export function shownLabels(count: number, step: number): number[] {
  const k = Math.max(1, Math.floor(step));
  const out: number[] = [];
  for (let i = count - 1; i >= 0; i -= k) out.unshift(i);
  return out;
}

export function labelRoom(count: number, step: number, bars: boolean): number {
  const axis = axisOf(count, bars);
  const k = Math.max(1, Math.floor(step));
  return Math.min(((2 * k + 2 * axis.edge) / 3) * axis.slot, 100 / Math.max(1, Math.ceil(count / k)));
}

export function labelStep(count: number, bars: boolean, width: number, widest: number, gap = 8): number {
  for (let step = 1; step < count; step++)
    if ((labelRoom(count, step, bars) / 100) * width >= widest + gap) return step;
  return Math.max(1, count);
}

export interface LabelBox {
  index: number;
  from: number;
  to: number;
  align: "start" | "center" | "end";
}

export function labelBoxes(count: number, step: number, bars: boolean): LabelBox[] {
  const axis = axisOf(count, bars);
  const k = Math.max(1, Math.floor(step));
  const half = labelRoom(count, k, bars) / 2;
  return shownLabels(count, k).map((index) => {
    const x = pointAt(index, axis);
    const from = Math.min(Math.max(0, x - half), 100 - 2 * half);
    const align = x - half < -1e-9 ? "start" : x + half > 100 + 1e-9 ? "end" : "center";
    return { index, from, to: from + 2 * half, align };
  });
}
