export type PageSlot = number | { from: number; to: number };

export function pageSlots(page: number, total: number, siblings = 1): PageSlot[] {
  const n = Math.max(1, total);
  const width = siblings * 2 + 5;
  if (n <= width) return Array.from({ length: n }, (_, i) => i + 1);
  const at = Math.min(Math.max(1, page), n);
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (at <= siblings + 3) return [...range(1, width - 2), { from: width - 1, to: n - 1 }, n];
  if (at >= n - siblings - 2) return [1, { from: 2, to: n - width + 2 }, ...range(n - width + 3, n)];
  const out: PageSlot[] = [1, { from: 2, to: at - siblings - 1 }, ...range(at - siblings, at + siblings)];
  out.push({ from: at + siblings + 1, to: n - 1 }, n);
  return out;
}
