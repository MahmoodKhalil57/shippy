import type { PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Small helpers shared by the insights endpoints (profit & close, control room, briefing,
 * assistant, growth CRM). Kept import-free of the UI so the endpoints run in the Service Worker
 * and in Node tests alike.
 */

/** The demo's "now" (same morning as GET /api/home: Tue 17 Nov 2026 09:30 UTC). */
export const NOW = new Date("2026-11-17T09:30:00.000Z");
export const DAY = 86_400_000;

export type Tone = "error" | "warning" | "info" | "success" | "neutral";

/** A link to the record an answer or a check is based on. */
export interface Source {
  label: string;
  href: string;
}

export type Me = Doc & { name?: string; role?: string };

/** A scalar as text (relationships and objects read as nothing). */
export const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
export const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);
export const idOf = (v: unknown) =>
  v && typeof v === "object" ? str((v as Doc).id) || undefined : typeof v === "string" ? v : undefined;
export const nameOf = (v: unknown) =>
  v && typeof v === "object"
    ? str((v as Doc).name ?? (v as Doc).company ?? (v as Doc).id)
    : typeof v === "string"
      ? v
      : "";
export const date = (v: unknown) => (typeof v === "string" && v ? new Date(v) : undefined);
export const first = (name: string) => name.split(" ")[0] ?? name;
export const href = (...parts: string[]) => `/${parts.join("/")}`;
export const docHref = (collection: string, id: string) => href("collections", collection, id);

/** The language an endpoint answers in: the request's `?locale=`, else English. */
export type Lang = "en" | "ar";
export const langOf = (req: PayloadRequest): Lang => (req.locale === "ar" ? "ar" : "en");
/** The `Intl` locale for a language: Arabic writes Latin digits; English keeps the code's own. */
export const intlLocale = (lang: Lang, en = "en-GB") => (lang === "ar" ? "ar-u-nu-latn" : en);

/**
 * An option's label in a language, from the select field at `path` (`status`, or through groups
 * and arrays: `registration.status`) of `collection` in the running config
 * (`req.payload.config`). English keeps the stored value, as the endpoints always wrote it; Arabic
 * reads the option's `{ en, ar }` label, else the value.
 */
export function optionLabel(req: PayloadRequest, collection: string, path: string, value: unknown): string {
  const v = str(value);
  if (langOf(req) === "en" || !v) return v;
  type F = { name?: string; options?: unknown[]; fields?: F[]; tabs?: F[] };
  // Unnamed containers (rows, collapsibles, unnamed tabs) don't add a level to a path.
  const flat = (fields: F[] | undefined): F[] =>
    (fields ?? []).flatMap((f) => (f.name ? [f] : flat(f.fields ?? f.tabs)));
  const config = (req.payload as unknown as { config?: { collections?: { slug: string; fields?: F[] }[] } }).config;
  let field: F | undefined = { fields: config?.collections?.find((c) => c.slug === collection)?.fields };
  for (const name of path.split(".")) field = flat(field?.fields).find((f) => f.name === name);
  for (const o of field?.options ?? []) {
    if (!o || typeof o !== "object" || (o as { value?: unknown }).value !== v) continue;
    const label = (o as { label?: unknown }).label;
    return (label && typeof label === "object" ? str((label as Record<string, unknown>).ar) : "") || v;
  }
  return v;
}

export const fmtDay = (d: Date, lang: Lang = "en") =>
  d.toLocaleDateString(intlLocale(lang), { day: "numeric", month: "short", timeZone: "UTC" });
export const fmtTime = (d: Date, lang: Lang = "en") =>
  d.toLocaleTimeString(intlLocale(lang), { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/** "today 14:00", "tomorrow", "in 3 days", "2 days overdue". */
export const relative = (d: Date, lang: Lang = "en") => {
  const days = Math.floor(d.getTime() / DAY) - Math.floor(NOW.getTime() / DAY);
  const o = { locale: lang };
  const time = fmtTime(d, lang);
  if (days === 0)
    return d < NOW ? m.api_insights_shared_overdue_since({ time }, o) : m.api_insights_shared_today_at({ time }, o);
  if (days === 1) return m.api_insights_shared_tomorrow_at({ time }, o);
  if (days > 1) return m.api_insights_shared_in_days({ days }, o);
  return m.api_insights_shared_days_overdue({ days: -days }, o);
};

export const money = (currency: string, n: number, digits = 0, lang: Lang = "en") =>
  `${currency} ${n.toLocaleString(intlLocale(lang, "en-US"), { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export const egp = (n: number, lang: Lang = "en") => money("EGP", Math.round(n), 0, lang);
export const signed = (n: number, fmt: (n: number) => string) =>
  n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : fmt(0);
export const pct = (n: number) => `${n.toFixed(1)}%`;

/** Roles that see costs, margins, profit and cash (Sales never does). */
export const MONEY_ROLES = ["management", "finance-director", "operations"];
/** Roles that may record receipts, credit notes and close a case. */
export const FINANCE_ROLES = ["management", "finance-director", "operations"];

export async function all(req: PayloadRequest, collection: string, depth = 1) {
  const r = await req.payload.find({ locale: req.locale, collection: collection as never, pagination: false, depth });
  return r.docs as unknown as Doc[];
}

export const fail = (status: number, message: string) => Response.json({ errors: [{ message }] }, { status });
export const unauthorized = (lang: Lang = "en") => fail(401, m.api_insights_shared_not_allowed({}, { locale: lang }));

/** The signed-in user, or null. */
export const meOf = (req: PayloadRequest) => (req.user as unknown as Me | null) ?? null;

/** A JSON body, or `{}` when there is none. */
export async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    const data = req.json ? await req.json() : (req as unknown as { data?: unknown }).data;
    return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** "17 Nov 2026, 09:30" (UTC, like the rest of the demo). */
export const formatDateTime = (iso: string, lang: Lang = "en") => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : `${d.toLocaleDateString(intlLocale(lang), { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}, ${fmtTime(d, lang)}`;
};
