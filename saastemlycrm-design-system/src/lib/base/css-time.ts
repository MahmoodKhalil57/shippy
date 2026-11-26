export function cssTime(value: string, fallback = 0): number {
  const v = value.trim();
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) return fallback;
  if (/ms$/i.test(v)) return n;
  if (/s$/i.test(v)) return n * 1000;
  return n;
}
