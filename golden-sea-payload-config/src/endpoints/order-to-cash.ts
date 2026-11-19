import type { Endpoint, PayloadRequest } from "payload";
import { money, type CaseOps } from "../widgets/o2c-shared.ts";
import { bodyOf, failWith, forward } from "./forward.ts";
import { operationsEndpoints } from "./operations.ts";

/**
 * The actions of the case tabs "Order & purchasing" and "Delivery & billing"
 * (../widgets/case-order.ts, ../widgets/case-delivery.ts) that answer in words: each runs the
 * order-to-cash data endpoint (./operations.ts) as the same request and says what happened
 * (`{ message }`, shown as the snackbar). Registered next to the operations endpoints in ./index.ts.
 */

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
        message: `${r.created ? "Customer PO read and checked" : "PO re-checked"}: ${open ? `${open} mismatch(es) block commitment` : "all lines match"}.`,
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
        message: `Sales order confirmed${r.created.length ? ` · supplier POs ${r.created.join(", ")} prepared for re-check & approval` : ""}.`,
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
        if (!po) return failWith("Purchase order not found.", 404);
        const as = { req, overrideAccess: false };
        try {
          await req.payload.create({
            ...as,
            collection: "approvals" as never,
            data: {
              title: `Supplier PO ${po.number} to ${po.supplierName}`,
              type: "Supplier PO",
              case: d.case.id,
              detail: `PO ${po.number} · re-check done${po.recheck.some((r) => !r.ok) ? " — changes flagged" : ", no changes"}.`,
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
              title: `Approve supplier PO ${po.number}`,
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
    // The supplier emails the same bill again: booking it is refused (same supplier + bill number).
    path: "/case-order/:id/book-bill",
    method: "post",
    handler: (req) =>
      withOps(req, async (d) => {
        const bill = d.bills[0];
        if (!bill) return failWith("No supplier bill to book.");
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
          return failWith(`Duplicate bill blocked — ${errorText(e)}`);
        }
        return Response.json({ ok: true });
      }),
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
        message: r.message ?? `ETA updated — ${r.changed} drop(s) re-planned; owner and management alerted.`,
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
        message: `${r.doc.number} created from ${x?.number ?? "the delivery"} — delivered quantities only.`,
      });
    },
  },
  {
    // Sign & submit (or refresh): a submission the tax authority accepts is checked again at once,
    // so the person sees the final status.
    path: "/case-delivery/:id/einvoice",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const r = await operation<{ result: string; message: string }>(req, "einvoice", {
        invoice: b.invoice,
        taxId: b.taxId || undefined,
      });
      if (r instanceof Response || r.result !== "submitted") return r instanceof Response ? r : Response.json(r);
      const v = await operation<{ message: string }>(req, "einvoice", { invoice: b.invoice });
      return v instanceof Response ? v : Response.json({ message: v.message });
    },
  },
  {
    // A customer payment, recorded after the money is in the bank.
    path: "/case-delivery/:id/payment",
    method: "post",
    handler: async (req) => {
      const b = await bodyOf(req);
      const d = await loadOps(req);
      if (d instanceof Response) return d;
      const inv = d.invoices.find((i) => i.id === String(b.invoice));
      if (!inv) return failWith("Invoice not found.", 404);
      const amount = Number(b.amount);
      if (!(amount > 0)) return failWith("Enter the amount received.");
      try {
        await req.payload.create({
          req,
          overrideAccess: false,
          collection: "payments" as never,
          data: {
            direction: "in",
            reference: typeof b.reference === "string" && b.reference ? b.reference : "TRX-",
            paidAt: new Date().toISOString(),
            amount,
            currency: inv.currency,
            invoice: inv.id,
            kind: amount < inv.balance ? "Installment" : "Balance",
            status: "Recorded",
          } as never,
        });
      } catch (e) {
        return failWith((e as Error).message);
      }
      const left = Math.max(0, inv.balance - amount);
      return Response.json({
        message: `${money(amount, inv.currency)} allocated to ${inv.number}${left ? ` — balance ${money(left, inv.currency)}` : " — paid in full"}.`,
      });
    },
  },
];
