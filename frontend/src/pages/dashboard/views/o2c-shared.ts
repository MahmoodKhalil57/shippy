import type { Tone } from "../../../components/primitives/data/tag.ts";
import { api } from "../../../cms/client.ts";
import type { BookLine, Check } from "../../../cms/endpoints/operations.ts";

/**
 * Shared by the order-to-cash views (case-order.ts, case-delivery.ts, cash.ts): the shapes
 * GET /api/operations/case/:id and /api/operations/cash return, number/date formats, status
 * colours and the small "AI is reading" pause.
 */

export type BadgeColor = Tone;
export { statusColor } from "../shared.ts";

export interface OpsPO {
  id: string;
  number: string;
  supplier: string;
  supplierName: string;
  currency: string;
  total?: number;
  deliverTo?: string;
  status: string;
  recheck: { item: string; atQuotation?: string; now?: string; ok?: boolean }[];
  recheckDone?: boolean;
  lines: { lineNo: number; description: string; qty: number; unitPrice?: number; scheduledFor?: string }[];
  acknowledgedAt?: string;
  proforma?: string;
  depositPct?: number;
  deposit?: number;
  balanceDue?: string;
  paid?: number;
  approval: { id: string; title: string; status: string } | null;
}

export interface OpsDelivery {
  id: string;
  number: string;
  drop: number;
  plannedAt: string;
  place: string;
  status: string;
  plan: {
    vehicle?: string;
    boardingStaff?: string;
    launch?: string;
    readyAt?: string;
    clearance?: string;
  };
  lines: { lineNo: number; qty: number; lot?: string; description: string }[];
  dispatchedAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  proof: boolean;
  shortages?: string;
  invoice: string | null;
}

export interface OpsInvoice {
  id: string;
  number: string;
  basis?: string;
  delivery: string | null;
  currency: string;
  amount: number;
  paid: number;
  balance: number;
  issuedAt?: string;
  dueDate?: string;
  status: string;
  vatTreatment?: string;
  eInvoice: { status?: string; uuid?: string; submittedAt?: string; error?: string | null };
  billing: { legalEntity?: string; taxId?: string };
  lines: { lineNo: number; description: string; qty: number; deliveredQty?: number; unitPrice: number }[];
  payments: { reference: string; amount: number; paidAt: string }[];
}

export interface CaseOps {
  case: {
    id: string;
    caseId: string;
    vessel: string;
    port?: string;
    eta?: string;
    agent: string;
    stage: string;
    owner: string;
    nextAction?: string;
    blocker?: string;
    currency: string;
  };
  customer: {
    id: string;
    name: string;
    contactRule?: string;
    billingEntity?: string;
    paymentTermsDays?: number;
    country?: string;
  } | null;
  canSeeCosts: boolean;
  canFinance: boolean;
  isManagement: boolean;
  lines: BookLine[];
  customerPo: {
    id: string;
    number: string;
    receivedAt?: string;
    billingEntity?: string;
    quotation: string;
    status: string;
    openMismatches: number;
    checks: Check[];
    unawarded: { lineNo: number; outcome: string; reason?: string }[];
  } | null;
  poExpected: boolean;
  orderConfirmed: boolean;
  purchaseOrders: OpsPO[];
  bills: {
    id: string;
    billNumber: string;
    supplier: string;
    supplierName: string;
    purchaseOrder: string;
    poNumber?: string;
    amount: number;
    currency: string;
    dueDate?: string;
    status: string;
    holdReason?: string | null;
    match: { lineNo: number; ordered: number; received: number; billed: number }[];
  }[];
  receipts: {
    id: string;
    lineNo: number;
    description: string;
    supplierName: string;
    poNumber?: string;
    ordered: number;
    received: number;
    shortfall: number;
    receivedAt?: string;
    warehouse?: string;
    lot?: string;
    expiry?: string;
    qc: string;
    claim?: string;
    backorderDate?: string;
  }[];
  deliveries: OpsDelivery[];
  backorders: {
    lineNo: number;
    description: string;
    qty: number;
    supplierName: string;
    date?: string;
    owner: string;
    followsIn: string | null;
    late: boolean;
  }[];
  invoices: OpsInvoice[];
  alerts: { at: string; text: string }[];
}

export const loadCaseOps = (id: string) => api.get<CaseOps>(`/operations/case/${encodeURIComponent(id)}`);

/* ---------------------------------------------------------------- formats */

export function money(n: number | undefined | null, cur = "USD"): string {
  if (n == null || Number.isNaN(n)) return "—";
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })}`;
}

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const dayYearFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const valid = (iso?: string | null) => Boolean(iso) && !Number.isNaN(new Date(String(iso)).getTime());
export const day = (iso?: string | null) => (valid(iso) ? dayFmt.format(new Date(String(iso))) : "—");
export const dayYear = (iso?: string | null) => (valid(iso) ? dayYearFmt.format(new Date(String(iso))) : "—");
export const dayTime = (iso?: string | null) => (valid(iso) ? timeFmt.format(new Date(String(iso))) : "—");

/** The short visible "AI is reading" moment before a deterministic stub answers. */
export const reading = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** A stand-in for the presenter's scan or photo (the demo has no real paper). */
export function sampleFile(name: string, lines: string[]) {
  return new File([lines.join("\n")], name, { type: "application/pdf" });
}

/** Uploads evidence to Media and returns its id. */
export async function uploadEvidence(file: File, kind: string, alt: string) {
  const { doc } = await api.create("media", { alt, kind }, file);
  return doc.id;
}

export const USERS: Record<string, string> = {
  ky: "Karim Youssef",
  kb: "Karim Balbaa",
  sa: "Soaad Amer",
  ah: "Ahmedy",
  mh: "Mohamed Helmy",
  em: "Esraa Mohamed",
  ne: "Nancy Elsobhy",
};
