import type { Tone } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import { getLocale } from "../i18n/paraglide/runtime.js";

/**
 * The formats Golden Sea's widgets share (money, dates, people, status tones). Pure: no requests,
 * no UI. The formatters (./<domain>.ts) build on these. Numbers and dates are in the interface's
 * language: Arabic with Latin digits (`ar-u-nu-latn`), English as en-US numbers and en-GB dates.
 */

/** The language tag for numbers (`en-US`) or dates (`en-GB`); Arabic is the same for both. */
export const numberLocale = () => (getLocale() === "ar" ? "ar-u-nu-latn" : "en-US");
export const dateLocale = () => (getLocale() === "ar" ? "ar-u-nu-latn" : "en-GB");

const numbers = new Map<string, Intl.NumberFormat>();
const dates = new Map<string, Intl.DateTimeFormat>();
/** A number formatter in the interface's language, made once per set of options. */
export function numberFormat(o: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const id = `${numberLocale()} ${JSON.stringify(o)}`;
  let f = numbers.get(id);
  if (!f) numbers.set(id, (f = new Intl.NumberFormat(numberLocale(), o)));
  return f;
}
/** A date formatter in the interface's language, made once per set of options. */
export function dateFormat(o: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const id = `${dateLocale()} ${JSON.stringify(o)}`;
  let f = dates.get(id);
  if (!f) dates.set(id, (f = new Intl.DateTimeFormat(dateLocale(), o)));
  return f;
}
/** A whole number with grouping ("1,234"). */
export const count = (n: number) => numberFormat().format(n);

/** An amount with its currency ("USD 1,234.50"; EGP and large amounts whole). */
export function money(n: number | undefined | null, cur = "USD"): string {
  if (n == null || Number.isNaN(n)) return "—";
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  const amount = numberFormat({ minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).format(n);
  return m.index_money({ currency: cur, amount });
}
/** An amount in thousands, whole, with its currency ("EGP 1,234k"). */
export const thousands = (k: number, cur = "EGP") =>
  m.index_money_k({ currency: cur, amount: numberFormat({ maximumFractionDigits: 0 }).format(Math.round(k)) });

const valid = (iso?: string | null) => Boolean(iso) && !Number.isNaN(new Date(String(iso)).getTime());
export const day = (iso?: string | null) =>
  valid(iso) ? dateFormat({ day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(String(iso))) : "—";
export const dayTime = (iso?: string | null) =>
  valid(iso)
    ? dateFormat({ day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(
        new Date(String(iso)),
      )
    : "—";

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

/** A date as the dashboard shows it: a date at midnight shows as just the day. */
export const formatDate = (v?: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  return d.getHours() === 0 && d.getMinutes() === 0
    ? dateFormat({ day: "2-digit", month: "short", year: "numeric" }).format(d)
    : dateFormat({ day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
};
