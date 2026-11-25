import { m } from "../../i18n/index.ts";

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export interface TimeLeft {
  text: string;
  overdue: boolean;
  share: number;
}

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
