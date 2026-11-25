export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface MonthOf {
  year: number;
  month: number;
  days: number;
}

export function readMonth(text: string): MonthOf | undefined {
  const m = /^(\d{4})-(\d{2})$/.exec(text);
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return undefined;
  return { year, month, days: new Date(Date.UTC(year, month, 0)).getUTCDate() };
}

export const weekdayOf = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day)).getUTCDay();

export const weekdayOrder = (weekStart: WeekStart): number[] =>
  Array.from({ length: 7 }, (_, i) => (i + weekStart) % 7);

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
