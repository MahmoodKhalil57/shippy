import type { PayloadRequest } from "payload";
import type { Doc } from "../types.ts";

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

export const fmtDay = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
export const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/** "today 14:00", "tomorrow", "in 3 days", "2 days overdue". */
export const relative = (d: Date) => {
  const days = Math.floor(d.getTime() / DAY) - Math.floor(NOW.getTime() / DAY);
  if (days === 0) return d < NOW ? `overdue since ${fmtTime(d)}` : `today ${fmtTime(d)}`;
  if (days === 1) return `tomorrow ${fmtTime(d)}`;
  if (days > 1) return `in ${days} days`;
  return `${-days} day${days === -1 ? "" : "s"} overdue`;
};

export const money = (currency: string, n: number, digits = 0) =>
  `${currency} ${n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export const egp = (n: number) => money("EGP", Math.round(n));
export const signed = (n: number, fmt: (n: number) => string) =>
  n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : fmt(0);
export const pct = (n: number) => `${n.toFixed(1)}%`;

/** Roles that see costs, margins, profit and cash (Sales never does). */
export const MONEY_ROLES = ["management", "finance-director", "operations"];
/** Roles that may record receipts, credit notes and close a case. */
export const FINANCE_ROLES = ["management", "finance-director", "operations"];
export const seesCosts = (role: string) => role !== "sales";

export async function all(req: PayloadRequest, collection: string, depth = 1) {
  const r = await req.payload.find({ collection: collection as never, pagination: false, depth });
  return r.docs as unknown as Doc[];
}

export const fail = (status: number, message: string) => Response.json({ errors: [{ message }] }, { status });
export const unauthorized = () => fail(401, "You are not allowed to perform this action.");

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
export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}, ${fmtTime(d)}`;
};
