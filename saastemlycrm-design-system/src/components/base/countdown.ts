/**
 * How long is left until a deadline, in words, and how much of its run is left (a countdown's row,
 * `<ui-countdown>`). Pure: the element reads the clock, this only does the arithmetic, proved over
 * every minute of six days either side of a deadline and every hour of sixty by
 * tests/countdown.test.ts.
 *
 * The wording is whole units, rounded down, so it never promises more time than there is:
 * - under a minute left: "under 1 min left"; under an hour: "14 min left";
 * - under a day: "2 h 14 min left" ("2 h left" on the hour);
 * - under three days: "1 d 5 h left" ("2 d left" on the day); from three days: "3 d left";
 * - past it, the coarsest whole unit: "overdue 12 min", "overdue 5 h", "overdue 3 d", and in its
 *   first minute "just overdue". At the very moment it's due: "due now" (not yet overdue).
 */

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export interface TimeLeft {
  /** "2 h 14 min left", "3 d left", "overdue 5 h". */
  text: string;
  /** Past its deadline. */
  overdue: boolean;
  /** The part of its run still left, 0 to 1 (0 once overdue). */
  share: number;
}

/** The time left from `nowMs` to `dueMs`; `fromMs` is when its run started (left out: now, a full bar). */
export function timeLeft(dueMs: number, nowMs: number, fromMs: number = nowMs): TimeLeft {
  const d = dueMs - nowMs;
  if (d < 0) {
    const e = -d;
    const text =
      e >= DAY_MS
        ? `overdue ${Math.floor(e / DAY_MS)} d`
        : e >= HOUR_MS
          ? `overdue ${Math.floor(e / HOUR_MS)} h`
          : e >= MINUTE_MS
            ? `overdue ${Math.floor(e / MINUTE_MS)} min`
            : "just overdue";
    return { text, overdue: true, share: 0 };
  }
  const span = dueMs - fromMs;
  const share = span > 0 ? Math.min(1, d / span) : 1;
  if (d === 0) return { text: "due now", overdue: false, share: 0 };
  const days = Math.floor(d / DAY_MS);
  const hours = Math.floor((d % DAY_MS) / HOUR_MS);
  const mins = Math.floor((d % HOUR_MS) / MINUTE_MS);
  const text =
    days >= 3
      ? `${days} d left`
      : days >= 1
        ? `${days} d${hours ? ` ${hours} h` : ""} left`
        : hours >= 1
          ? `${hours} h${mins ? ` ${mins} min` : ""} left`
          : mins >= 1
            ? `${mins} min left`
            : "under 1 min left";
  return { text, overdue: false, share };
}
