import { auditContrast } from "../base/contrast.ts";
import { auditLayout } from "../base/layout.ts";
import type { TileBounds } from "../base/board.ts";
import { tileH, tileW } from "../base/tiles.ts";

export interface Screen {
  width: number;
  height: number;
}

export const SCREENS: readonly Screen[] = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1536, height: 864 },
  { width: 1920, height: 1080 },
];

export interface TileCase {
  span: number;
  rows: number;
  width: number;
  height: number;
}

export function tileCases(b: TileBounds, lanes: number, scale = 1): TileCase[] {
  const most = Math.min(lanes, b.maxSpan ?? lanes);
  const least = Math.min(most, Math.max(1, b.minSpan ?? 1));
  const out: TileCase[] = [];
  for (let span = least; span <= most; span++)
    for (let rows = b.minRows; rows <= b.maxRows; rows++)
      out.push({ span, rows, width: span * tileW(scale), height: rows * tileH(scale) });
  return out;
}

export function problems(root: Element): string[] {
  const where = (el: Element) => {
    const id = el.id ? `#${el.id}` : "";
    const tag = el.localName;
    const label = el.textContent!.trim().replace(/\s+/g, " ").slice(0, 40);
    return `${tag}${id}${label ? ` "${label}"` : ""}`;
  };
  return [
    ...auditLayout(root).map((i) => `${i.kind}: ${where(i.element)}: ${i.detail}`),
    ...auditContrast(root).map(
      (i) => `contrast ${i.ratio.toFixed(2)} < ${i.required}: ${where(i.element)} (${i.color} on ${i.background})`,
    ),
  ];
}

export const frames = (count = 2) =>
  new Promise<void>((resolve) => {
    let left = count;
    const step = () => (--left <= 0 ? resolve() : requestAnimationFrame(step));
    requestAnimationFrame(step);
  });

export function settleAnimations(root: Document = document) {
  for (const a of root.getAnimations()) if (a.effect?.getComputedTiming().endTime !== Infinity) a.finish();
}
