/**
 * Column order for data tables, shared by `<ui-table>` (dragging headers), `<ui-column-picker>`
 * (Move earlier / later) and the pages that save the order or reuse it (cards, CSV export).
 *
 * An order is a list of column keys. It's applied leniently, so a saved order keeps working
 * when the columns change: keys that no longer exist are ignored, and a column the order
 * doesn't know (a field added later) keeps its place after the column it used to follow.
 * Columns marked `fixed` (the one that links to the record) always come first, in their own order.
 */

export interface OrderedColumn {
  key: string;
  /** Stays at the start and can't be moved. */
  fixed?: boolean;
}

/** `columns` arranged by `order`. */
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

/** `keys` with `key` moved just before `to.before`, or just after `to.after`. */
export function moveColumn(keys: readonly string[], key: string, to: { before?: string; after?: string }): string[] {
  const rest = keys.filter((k) => k !== key);
  const anchor = to.before ?? to.after;
  const at = anchor === undefined ? -1 : rest.indexOf(anchor);
  if (at < 0) return [...keys];
  rest.splice(to.before !== undefined ? at : at + 1, 0, key);
  return rest;
}

/** Narrowest and widest a person can make a column, in px. */
export const COLUMN_MIN_WIDTH = 64;
export const COLUMN_MAX_WIDTH = 800;
export const clampColumnWidth = (w: number) => Math.round(Math.min(COLUMN_MAX_WIDTH, Math.max(COLUMN_MIN_WIDTH, w)));
