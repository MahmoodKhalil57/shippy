import type { Tone } from "saastemlycrm-design-system/contracts";
import type { BookLine, Check } from "../endpoints/operations.ts";

/**
 * Shared by the order-to-cash widgets (case-order.ts, case-delivery.ts) and their action
 * endpoints (../endpoints/order-to-cash.ts): what GET /api/operations/case/:id returns, number /
 * date formats, status tones and people's names. Pure: no requests, no UI.
 */

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
  plan: { vehicle?: string; boardingStaff?: string; launch?: string; readyAt?: string; clearance?: string };
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
