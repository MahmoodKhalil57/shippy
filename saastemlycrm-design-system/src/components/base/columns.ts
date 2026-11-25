export interface OrderedColumn {
  key: string;
  fixed?: boolean;
}

export function orderColumns<T extends OrderedColumn>(columns: readonly T[], order: readonly string[] = []): T[] {
  const rank = new Map(order.map((k, i) => [k, i]));
  const out = columns.filter((c) => rank.has(c.key)).sort((a, b) => rank.get(a.key)! - rank.get(b.key)!);
  columns.forEach((c, i) => {
    if (rank.has(c.key)) return;
    const before = columns
      .slice(0, i)
      .reverse()
      .find((p) => out.includes(p));
    out.splice(before ? out.indexOf(before) + 1 : 0, 0, c);
  });
  return [...out.filter((c) => c.fixed), ...out.filter((c) => !c.fixed)];
}

export function moveColumn(keys: readonly string[], key: string, to: { before?: string; after?: string }): string[] {
  const rest = keys.filter((k) => k !== key);
  const anchor = to.before ?? to.after;
  const at = anchor === undefined ? -1 : rest.indexOf(anchor);
  if (at < 0) return [...keys];
  rest.splice(to.before !== undefined ? at : at + 1, 0, key);
  return rest;
}

export const COLUMN_MIN_WIDTH = 64;
export const COLUMN_MAX_WIDTH = 800;
export const clampColumnWidth = (w: number) => Math.round(Math.min(COLUMN_MAX_WIDTH, Math.max(COLUMN_MIN_WIDTH, w)));
