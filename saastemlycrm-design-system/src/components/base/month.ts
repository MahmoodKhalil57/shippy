/**
 * A month as a calendar's weeks (`<ui-month>`): rows of seven, the first column the week's first
 * day (`weekStart`: 0 Sunday, 1 Monday), the days before the 1st and after the last left blank
 * (`null`). Pure and timezone-free (UTC dates), proved for every month of 2024–2030 with both week
 * starts by tests/month.test.ts: each date appears once, in its weekday's column, in 4 to 6 rows,
 * with exactly the blanks it needs before and after.
 */

export type WeekStart = 0 | 1;

export interface MonthOf {
  year: number;
  /** 1 to 12. */
  month: number;
  /** Days in the month, 28 to 31. */
  days: number;
}

/** "2026-11" as its year, month and length; undefined when it isn't a month. */
export function readMonth(text: string): MonthOf | undefined {
  const m = /^(\d{4})-(\d{2})$/.exec(text);
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return undefined;
  return { year, month, days: new Date(Date.UTC(year, month, 0)).getUTCDate() };
}

/** The weekday (0 Sunday … 6 Saturday) of a day of a month. */
export const weekdayOf = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day)).getUTCDay();

/** The weekdays in column order (0 Sunday … 6 Saturday). */
export const weekdayOrder = (weekStart: WeekStart): number[] =>
  Array.from({ length: 7 }, (_, i) => (i + weekStart) % 7);

/** The month's weeks: rows of seven, a day's number or `null` for a blank. */
export function monthWeeks(year: number, month: number, weekStart: WeekStart): (number | null)[][] {
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (weekdayOf(year, month, 1) - weekStart + 7) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));
}
