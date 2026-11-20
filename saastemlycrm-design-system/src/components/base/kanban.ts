/**
 * A kanban board's arithmetic, apart from how it's drawn (`<ui-kanban>`,
 * src/components/primitives/data/kanban.ts): which column a record is in, and what moving it
 * means. Pure, so its guarantees are checked over every case (tests/kanban.test.ts):
 * - every record is in exactly one column, whatever its value (a value the board has no column
 *   for, or none at all, puts it in the "none" column, `NONE`);
 * - a move changes that one record and nothing else;
 * - moving a record and then moving it back to the column it was in gives back the columns as
 *   they were (so Undo, which is the opposite move, undoes).
 */

/** The column of records whose value is none of the board's own. */
export const NONE = "";

/** The column a value belongs to: itself when the board has that column, else `NONE`. */
export const columnOf = (value: unknown, columns: readonly string[]): string =>
  typeof value === "string" && value !== NONE && columns.includes(value) ? value : NONE;

/** The value a column stands for: `NONE` is no value. */
export const valueOf = (column: string): string | null => (column === NONE ? null : column);

/** The records of each column, in their order: the board's columns, then `NONE` when it holds any. */
export function byColumn<T>(
  items: readonly T[],
  value: (item: T) => unknown,
  columns: readonly string[],
): { key: string; items: T[] }[] {
  const out = columns.map((key) => ({ key, items: items.filter((i) => columnOf(value(i), columns) === key) }));
  const none = items.filter((i) => columnOf(value(i), columns) === NONE);
  return none.length ? [...out, { key: NONE, items: none }] : out;
}

/** The records after one of them moved to a column: that record with the column's value, the rest as they were. */
export function moved<T>(
  items: readonly T[],
  is: (item: T) => boolean,
  to: string,
  set: (item: T, value: string | null) => T,
): T[] {
  return items.map((i) => (is(i) ? set(i, valueOf(to)) : i));
}
