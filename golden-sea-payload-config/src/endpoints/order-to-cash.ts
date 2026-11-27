import type { Endpoint, PayloadRequest } from "payload";
import { bodyOf, failWith, forward } from "./forward.ts";
import { operationsEndpoints, type BookLine, type Check } from "./operations.ts";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";
import { m } from "../i18n/paraglide/messages.js";
import { langOf } from "./insights-shared.ts";

function supplierPoApprover(): string {
  if (IS_TEMP_MOCK) {
    return "kb";
  } else {
    throw new TempMockError("the supplier PO approver from the approval-rules global, not the demo user kb");
  }
}

const loc = (req: PayloadRequest) => ({ locale: langOf(req) });

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
  bills: { id: string; billNumber: string; status: string }[];
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

const loadOps = (req: PayloadRequest) =>
  forward<CaseOps>(req, operationsEndpoints, "/operations/case/:id", { params: { id: String(req.routeParams?.id) } });

const operation = <T>(req: PayloadRequest, name: string, body: Record<string, unknown>) =>
  forward<T>(req, operationsEndpoints, `/operations/${name}`, { body });

async function withOps(req: PayloadRequest, fn: (d: CaseOps) => Promise<Response>) {
  const d = await loadOps(req);
  return d instanceof Response ? d : fn(d);
}

const errorText = (e: unknown) => {
  const err = e as Error & { data?: { errors?: { message: string }[] } };
  return err.data?.errors?.map((x) => x.message).join("; ") || err.message;
};

export const orderToCashEndpoints: Endpoint[] = [
  {
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
              approvers: [supplierPoApprover()],
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
              user: supplierPoApprover(),
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
    path: "/case-order/book-bill",
    method: "post",
    handler: async (req) => {
      if (!req.user) return failWith(m.api_insights_shared_not_allowed({}, loc(req)), 401);
      const { bill: id } = await bodyOf(req);
      const bill = (await req.payload
        .findByID({ collection: "supplier-bills" as never, id: String(id), depth: 0, req, overrideAccess: false })
        .catch(() => null)) as Record<string, unknown> | null;
      if (!bill) return failWith(m.api_order_to_cash_no_bill({}, loc(req)), 404);
      if (IS_MOCK) {
      } else {
        throw new NotConnectedError(
          "a supplier's bill arriving by email (mailbox): in production it is booked from the email, not resent from a button",
        );
      }
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
        if ((e as { status?: number }).status === 403) return failWith(errorText(e), 403);
        return failWith(m.api_order_to_cash_duplicate_bill({ reason: errorText(e) }, loc(req)));
      }
      return Response.json({ ok: true });
    },
  },

  {
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
