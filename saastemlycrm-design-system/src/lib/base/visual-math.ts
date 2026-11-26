import { intl, m } from "../i18n/index.ts";

export type Slot = "0" | "1" | "2" | "3" | "4" | "5" | "muted";

export const slotColor = (slot: Slot, faded = false) => {
  const c = slot === "muted" ? "var(--chart-muted)" : `var(--chart-${Number(slot) + 1})`;
  return faded ? `color-mix(in oklab, ${c} 30%, transparent)` : c;
};

export const TRACK = "color-mix(in oklab, var(--color-base-100), var(--color-base-content) 10%)";

export function fraction(value: number, min: number, max: number): number {
  const span = max - min;
  if (!Number.isFinite(value) || !Number.isFinite(span) || span <= 0) return 0;
  return Math.min(1, Math.max(0, (value - min) / span));
}

export const percentText = (p: number) => intl.number({ style: "percent", maximumFractionDigits: 0 }).format(p / 100);

export const percentOf = (a: number, b: number): number | null =>
  b > 0 && Number.isFinite(a) && Number.isFinite(b) ? Math.round((a / b) * 100) : null;

export function apportion(values: number[], total: number): number[] {
  const sum = values.reduce((t, x) => t + x, 0);
  const n = Math.max(0, Math.round(total));
  if (sum <= 0 || n === 0) return values.map(() => 0);
  const exact = values.map((x) => (x / sum) * n);
  const out = exact.map(Math.floor);
  let left = n - out.reduce((t, x) => t + x, 0);
  const order = exact.map((x, i) => [x - Math.floor(x), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (const [, i] of order) {
    if (left <= 0) break;
    out[i]! += 1;
    left -= 1;
  }
  return out;
}

export const sharePercents = (values: number[]) => apportion(values, 100);

export function cellCounts(values: number[], whole: number, cells = 100): number[] {
  const sum = values.reduce((t, x) => t + x, 0);
  const of = Math.max(sum, whole);
  if (of <= 0) return [];
  return apportion(values, Math.round((sum / of) * cells));
}

export interface Folded<T> {
  part: T | { label: string; value: number };
  slot: Slot;
  other: boolean;
}

export function foldParts<T extends { label: string; value: number }>(parts: T[], most = 6): Folded<T>[] {
  const p = parts.filter((x) => Number.isFinite(x.value) && x.value > 0);
  const hue = (i: number) => String(i) as Slot;
  if (p.length <= most) return p.map((part, i) => ({ part, slot: hue(i), other: false }));
  const rest = p.slice(most - 1).reduce((t, x) => t + x.value, 0);
  return [
    ...p.slice(0, most - 1).map((part, i) => ({ part, slot: hue(i), other: false })),
    { part: { label: m.visual_other(), value: rest }, slot: "muted", other: true },
  ];
}

export type Quality = "poor" | "ok" | "good";

export interface Band {
  from: number;
  end: number;
  low: number;
  high: number;
  quality: Quality;
}

export function bandsOf(thresholds: number[], min: number, max: number, lowerIsBetter = false): Band[] {
  if (!(max > min)) return [];
  const t = [...new Set(thresholds.filter((x) => Number.isFinite(x) && x > min && x < max))]
    .sort((a, b) => a - b)
    .slice(0, 2);
  if (!t.length) return [];
  const edges = [min, ...t, max];
  const qualities: Quality[] = t.length === 1 ? ["poor", "good"] : ["poor", "ok", "good"];
  if (lowerIsBetter) qualities.reverse();
  return qualities.map((quality, i) => ({
    from: fraction(edges[i]!, min, max),
    end: fraction(edges[i + 1]!, min, max),
    low: edges[i]!,
    high: edges[i + 1]!,
    quality,
  }));
}

export function indexAt(spans: { from: number; end: number }[], f: number): number {
  const i = spans.findIndex((s) => f >= s.from && f < s.end);
  if (i >= 0) return i;
  const last = spans.length - 1;
  return last >= 0 && f === spans[last]!.end ? last : -1;
}

export type ZoneTone = "success" | "warning" | "error";

export interface Zone {
  to: number;
  tone: ZoneTone;
  label?: string;
}

export interface DrawnZone extends Zone {
  from: number;
  end: number;
  low: number;
  high: number;
}

export function zonesOf(zones: Zone[], min: number, max: number): DrawnZone[] {
  if (!(max > min)) return [];
  const out: DrawnZone[] = [];
  let low = min;
  for (const z of [...zones].filter((z) => Number.isFinite(z.to)).sort((a, b) => a.to - b.to)) {
    const high = Math.min(max, z.to);
    if (high <= low) continue;
    out.push({ ...z, from: fraction(low, min, max), end: fraction(high, min, max), low, high });
    low = high;
  }
  return out;
}
