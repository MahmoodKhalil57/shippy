import type { Endpoint, PayloadRequest } from "payload";
import { bodyOf, failWith, forward } from "./forward.ts";
import { operationsEndpoints, type BookLine, type Check } from "./operations.ts";
import { m } from "../i18n/paraglide/messages.js";
import { langOf } from "./insights-shared.ts";

/** The request's language, as Paraglide's options. */
const loc = (req: PayloadRequest) => ({ locale: langOf(req) });

/**
 * The actions of the case tabs "Order & purchasing" and "Delivery & billing"
 * (../pages/case-order.ts, ../pages/case-delivery.ts) that answer in words: each runs the
 * order-to-cash data endpoint (./operations.ts) as the same request and says what happened
 * (`{ message }`, shown as the snackbar). Registered next to the operations endpoints in ./index.ts.
 */

/**
 * A case's order to cash: what GET /api/operations/case/:id (./operations.ts) answers, its purchase
 * orders, deliveries and checks, for the order and delivery tabs' formatters
 * (../format/order-to-cash.ts) and the actions here.
 */

/** A supplier PO as the re-check and confirmation read it (its table reads the collection). */
export interface OpsPO {
  id: string;
  number: string;
  supplier: string;
  supplierName: string;
  status: string;
  recheck: { item: string; atQuotation?: string; now?: string; ok?: boolean }[];
  recheckDone?: boolean;
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
  /** Its supplier bills (none for Sales), for the order's figures. */
  bills: { id: string; billNumber: string; status: string }[];
  /** Its receipts' quantities, for the order's figures. */
  receipts: { lineNo: number; ordered: number; received: number }[];
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
  alerts: { at: string; text: string }[];
}

/** The case's order-to-cash data as the signed-in user may see it, or the error response. */
const loadOps = (req: PayloadRequest) =>
  forward<CaseOps>(req, operationsEndpoints, "/operations/case/:id", { params: { id: String(req.routeParams?.id) } });

/** Runs an order-to-cash action (POST /api/operations/<name>) as this request. */
const operation = <T>(req: PayloadRequest, name: string, body: Record<string, unknown>) =>
  forward<T>(req, operationsEndpoints, `/operations/${name}`, { body });

/** The case's data for an action, or the error response. */
async function withOps(req: PayloadRequest, fn: (d: CaseOps) => Promise<Response>) {
  const d = await loadOps(req);
  return d instanceof Response ? d : fn(d);
}

const errorText = (e: unknown) => {
  const err = e as Error & { data?: { errors?: { message: string }[] } };
  return err.data?.errors?.map((x) => x.message).join("; ") || err.message;
};

export const orderToCashEndpoints: Endpoint[] = [
  /* ---------------------------------------------------------------- Order & purchasing */
  {
    // The AI reads the customer's PO (or re-runs the check) and says what it found.
    path: "/case-order/:id/po-check",
    method: "post",
    handler: async (req) => {
      const r = await operation<{ created: boolean; doc: { openMismatches?: number } }>(req, "po-check", {
        case: req.routeParams?.id,
      });
      if (r instanceof Response) return r;
      const open = r.doc.openMismatches ?? 0;
      return Response.json({
        message: m.api_order_to_cash_po_checked({ created: r.created ? "yes" : "no", open }, loc(req)),
      });
    },
  },
  {
    path: "/case-order/:id/confirm-order",
    method: "post",
    handler: async (req) => {
      const r = await operation<{ created: string[] }>(req, "confirm-order", { case: req.routeParams?.id });
      if (r instanceof Response) return r;
      return Response.json({
        message: r.created.length
          ? m.api_order_to_cash_order_confirmed_pos({ pos: r.created.join(", ") }, loc(req))
          : m.api_order_to_cash_order_confirmed({}, loc(req)),
      });
    },
  },
  {
    // A supplier PO re-checked by someone outside management goes to Karim Balbaa for approval.
    path: "/case-order/:id/ask-approval",
    method: "post",
    handler: (req) =>
      withOps(req, async (d) => {
        const { po: poId } = await bodyOf(req);
        const po = d.purchaseOrders.find((p) => p.id === String(poId));
        if (!po) return failWith(m.api_order_to_cash_po_not_found({}, loc(req)), 404);
        const as = { req, overrideAccess: false };
        try {
          await req.payload.create({
            ...as,
            collection: "approvals" as never,
            data: {
              title: m.api_order_to_cash_approval_title({ number: po.number, supplier: po.supplierName }, loc(req)),
              type: "Supplier PO",
              case: d.case.id,
              detail: po.recheck.some((r) => !r.ok)
                ? m.api_order_to_cash_approval_detail_flagged({ number: po.number }, loc(req))
                : m.api_order_to_cash_approval_detail_clean({ number: po.number }, loc(req)),
              approvers: ["kb"],
              subject: { relationTo: "purchase-orders", value: po.id },
            } as never,
          });
        } catch (e) {
          return failWith(errorText(e));
        }
        await req.payload
          .create({
            ...as,
            collection: "notifications" as never,
            data: {
              user: "kb",
              title: m.api_order_to_cash_notification_title({ number: po.number }, loc(req)),
              detail: `${po.supplierName} · ${d.case.caseId}`,
              kind: "Approval",
              href: "/approvals",
            } as never,
          })
          .catch(() => null);
        return Response.json({ ok: true });
      }),
  },
  {
    // A supplier bill's own action (../collections/fulfilment.ts): the supplier emails the same bill
    // again, and booking it is refused (same supplier + bill number).
    path: "/case-order/book-bill",
    method: "post",
    handler: async (req) => {
      if (!req.user) return failWith(m.api_insights_shared_not_allowed({}, loc(req)), 401);
      const { bill: id } = await bodyOf(req);
      const bill = (await req.payload
        .findByID({ collection: "supplier-bills" as never, id: String(id), depth: 0, req, overrideAccess: false })
        .catch(() => null)) as Record<string, unknown> | null;
      if (!bill) return failWith(m.api_order_to_cash_no_bill({}, loc(req)), 404);
      try {
        await req.payload.create({
          req,
          overrideAccess: false,
          collection: "supplier-bills" as never,
          data: {
            billNumber: bill.billNumber,
            supplier: bill.supplier,
            purchaseOrder: bill.purchaseOrder,
            amount: bill.amount,
            currency: bill.currency,
          } as never,
        });
      } catch (e) {
        return failWith(m.api_order_to_cash_duplicate_bill({ reason: errorText(e) }, loc(req)));
      }
      return Response.json({ ok: true });
    },
  },

  /* ---------------------------------------------------------------- Delivery & billing */
  {
    // The agent's ETA email applied: every open drop, booking and task re-planned.
    path: "/case-delivery/:id/eta",
    method: "post",
    handler: async (req) => {
      const r = await operation<{ changed: number; message?: string }>(req, "eta-change", {
        case: req.routeParams?.id,
      });
      if (r instanceof Response) return r;
      return Response.json({
        message: r.message ?? m.api_order_to_cash_eta_updated({ changed: r.changed }, loc(req)),
      });
    },
  },
  {
    path: "/case-delivery/:id/invoice",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const d = await loadOps(req);
      if (d instanceof Response) return d;
      const x = d.deliveries.find((y) => y.id === String(b.delivery));
      const r = await operation<{ doc: { number: string } }>(req, "invoice-delivery", { delivery: b.delivery });
      if (r instanceof Response) return r;
      return Response.json({
        message: x?.number
          ? m.api_order_to_cash_invoice_created({ number: r.doc.number, delivery: x.number }, loc(req))
          : m.api_order_to_cash_invoice_created_from_delivery({ number: r.doc.number }, loc(req)),
      });
    },
  },
];
