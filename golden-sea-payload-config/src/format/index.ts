import type { Tone } from "saastemlycrm-design-system/contracts";

/**
 * The formats Golden Sea's widgets share (money, dates, people, status tones). Pure: no requests,
 * no UI. The formatters (./<domain>.ts) build on these.
 */

export function money(n: number | undefined | null, cur = "USD"): string {
  if (n == null || Number.isNaN(n)) return "—";
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })}`;
}

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const valid = (iso?: string | null) => Boolean(iso) && !Number.isNaN(new Date(String(iso)).getTime());
export const day = (iso?: string | null) => (valid(iso) ? dayFmt.format(new Date(String(iso))) : "—");
export const dayTime = (iso?: string | null) => (valid(iso) ? timeFmt.format(new Date(String(iso))) : "—");

export const USERS: Record<string, string> = {
  ky: "Karim Youssef",
  kb: "Karim Balbaa",
  sa: "Soaad Amer",
  ah: "Ahmedy",
  mh: "Mohamed Helmy",
  em: "Esraa Mohamed",
  ne: "Nancy Elsobhy",
};
export const person = (id: string) => USERS[id] ?? id;

/** A status word's tone: problems red, waiting amber, in progress blue, done green, ended grey. */
export function statusTone(status = ""): Tone {
  if (/not awarded|expired|cancelled|superseded|skipped|ignored/i.test(status)) return "neutral";
  if (
    /blocked|mismatch|rejected|invalid|declined|no response|on hold|held|overdue|short|damaged|wrong|missing|late|unreachable|clarification|not sourced|lost|failed|reversed/i.test(
      status,
    )
  )
    return "error";
  if (
    /awaiting|waiting|pending|partial|planned|rescheduled|draft|submitted|approved 1|open|due|deposit to pay|needs review|requested|revision|returned|on watch|under review|documents pending/i.test(
      status,
    )
  )
    return "warning";
  if (
    /new|sent|validating|sourcing|comparing|purchasing|delivering|customs|scheduled|loading|dispatched|on board|boat transfer|trial|ready|introduced|prospect|in progress/i.test(
      status,
    )
  )
    return "info";
  if (
    /valid|matched|confirmed|ok|paid|received|delivered|approved|closed|settled|acknowledged|reconciled|recorded|done|resolved|won|active|linked|created|replied|selected|ordered|invoiced|released|first rfq/i.test(
      status,
    )
  )
    return "success";
  return "neutral";
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dateDayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** A date as the dashboard shows it: a date at midnight shows as just the day. */
export const formatDate = (v?: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  return d.getHours() === 0 && d.getMinutes() === 0 ? dateDayFmt.format(d) : dateFmt.format(d);
};
