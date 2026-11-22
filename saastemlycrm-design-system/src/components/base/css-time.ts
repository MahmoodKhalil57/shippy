/**
 * A CSS `<time>` value in milliseconds: "250ms" → 250, ".25s" → 250, "" → `fallback`. Motion
 * tokens must be read with this, never `parseFloat`: the build's CSS minifier writes them in
 * seconds (`250ms` becomes `.25s`), so `parseFloat` turned a 250ms page fade into 0.25ms on the
 * built site while the dev server, which keeps milliseconds, looked right.
 */
export function cssTime(value: string, fallback = 0): number {
  const v = value.trim();
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) return fallback;
  if (/ms$/i.test(v)) return n;
  if (/s$/i.test(v)) return n * 1000;
  return n;
}
