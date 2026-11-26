export const NONE = "";

export const columnOf = (value: unknown, columns: readonly string[]): string =>
  typeof value === "string" && value !== NONE && columns.includes(value) ? value : NONE;

export const valueOf = (column: string): string | null => (column === NONE ? null : column);

export function byColumn<T>(
  items: readonly T[],
  value: (item: T) => unknown,
  columns: readonly string[],
): { key: string; items: T[] }[] {
  const out = columns.map((key) => ({ key, items: items.filter((i) => columnOf(value(i), columns) === key) }));
  const none = items.filter((i) => columnOf(value(i), columns) === NONE);
  return none.length ? [...out, { key: NONE, items: none }] : out;
}

export function moved<T>(
  items: readonly T[],
  is: (item: T) => boolean,
  to: string,
  set: (item: T, value: string | null) => T,
): T[] {
  return items.map((i) => (is(i) ? set(i, valueOf(to)) : i));
}
