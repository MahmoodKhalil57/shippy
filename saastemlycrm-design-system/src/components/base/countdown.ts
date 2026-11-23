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
 * The words are messages (`countdown_*`), whole phrases with their numbers, so Arabic counts them
 * its own way.
 */

import { m } from "../../i18n/index.ts";

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
        ? m.countdown_overdue_days({ days: Math.floor(e / DAY_MS) })
        : e >= HOUR_MS
          ? m.countdown_overdue_hours({ hours: Math.floor(e / HOUR_MS) })
          : e >= MINUTE_MS
            ? m.countdown_overdue_minutes({ minutes: Math.floor(e / MINUTE_MS) })
            : m.countdown_just_overdue();
    return { text, overdue: true, share: 0 };
  }
  const span = dueMs - fromMs;
  const share = span > 0 ? Math.min(1, d / span) : 1;
  if (d === 0) return { text: m.countdown_due_now(), overdue: false, share: 0 };
  const days = Math.floor(d / DAY_MS);
  const hours = Math.floor((d % DAY_MS) / HOUR_MS);
  const mins = Math.floor((d % HOUR_MS) / MINUTE_MS);
  const text =
    days >= 3
      ? m.countdown_left_days({ days })
      : days >= 1
        ? hours
          ? m.countdown_left_days_hours({ days, hours })
          : m.countdown_left_days({ days })
        : hours >= 1
          ? mins
            ? m.countdown_left_hours_minutes({ hours, minutes: mins })
            : m.countdown_left_hours({ hours })
          : mins >= 1
            ? m.countdown_left_minutes({ minutes: mins })
            : m.countdown_under_a_minute();
  return { text, overdue: false, share };
}
