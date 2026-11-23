import type { CollectionConfig, PayloadRequest, TextFieldSingleValidation } from "payload";
import { formats, tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import {
  CURRENCIES,
  DAY,
  TODAY,
  WAREHOUSES,
  autoNumber,
  caseRef,
  computed,
  costVisible,
  deskAccess,
  evidence,
  financeAccess,
  fxRates,
  idOf,
  logActivity,
  management,
  related,
  ruleError,
  scalar,
} from "./shared.ts";
import * as link from "../links.ts";

/* ---------------------------------------------------------------- what the computed fields share */

type Doc = Record<string, unknown>;
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const round2 = (n: number) => Math.round(n * 100) / 100;
/** Who manages money: they request payment approvals and book supplier bills. */
export const FINANCE_ROLES = ["management", "finance-director", "operations"];

/** "EGP 48,200", "USD 1,650.00": whole pounds, and whole units from 100,000 up. */
export const moneyText = (n: number, cur: string) => {
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`;
};
const DAY_FMT = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
/** "17 Nov"; "—" for no date. */
export const dayText = (iso: unknown) =>
  typeof iso === "string" && iso && !Number.isNaN(new Date(iso).getTime()) ? DAY_FMT.format(new Date(iso)) : "—";

/**
 * Documents several computed fields read, fetched once per request (outside the request, so one
 * collection's computed fields never wait on another's).
 */
export function once<T>(req: PayloadRequest, key: string, load: () => Promise<T>): Promise<T> {
  const ctx = (req.context ??= {}) as Record<string, Promise<unknown> | undefined>;
  ctx[`once:${key}`] ??= load();
  return ctx[`once:${key}`] as Promise<T>;
}
export const findAll = async (req: PayloadRequest, collection: string, where?: Record<string, unknown>) =>
  (await req.payload.find({ collection: collection as never, where: where as never, depth: 0, limit: 0 }))
    .docs as unknown as Doc[];

/** What a supplier PO's payable is worked out from: every supplier bill, supplier payment and approval. */
const moneyOut = (req: PayloadRequest) =>
  once(req, "money-out", async () => {
    const [bills, payments, approvals] = await Promise.all([
      findAll(req, "supplier-bills"),
      findAll(req, "payments", { direction: { equals: "out" } }),
      findAll(req, "approvals"),
    ]);
    return { bills, payments, approvals };
  });

/** A case's deliveries (a receipt's backorder follows in one of them). */
const deliveriesOf = (req: PayloadRequest, caseId: string) =>
  once(req, `deliveries:${caseId}`, () => findAll(req, "deliveries", { case: { equals: caseId } }));

/** Computed fields about money or costs: never for Sales, and not while seeding. */
const costsFor = (req: PayloadRequest) => !req.context?.seed && costVisible({ req });

/* ---------------------------------------------------------------- payables */

/** Where what we owe a supplier stands. */
export const PAYABLE_STAGES = [
  "Deposit to pay",
  "Balance due",
  "Bill matched",
  "Balance on delivery",
  "Awaiting bill",
  "Bill on hold",
] as const;
/** Supplier payments go through these approvals (Financial Director or CEO). */
export const PAYMENT_APPROVAL_TYPES = ["Supplier deposit (payment)", "Supplier payment"];

/** An approval about this PO: it names the PO's number. */
const names = (a: Doc, number: string) =>
  Boolean(number) && (scalar(a.detail).includes(number) || scalar(a.title).includes(number));

/**
 * What we owe the supplier on a PO: the deposit against the pro forma, the balance on delivery or
 * by the bill's due date, or a bill on hold (more billed than received). Nothing when the PO isn't
 * confirmed yet, is closed, or is paid. Pure: the PO and every supplier bill, supplier payment and
 * approval in (the cash forecast and the PO's `payable` field both read it).
 */
export function payableOf(
  po: Doc,
  { bills, payments, approvals }: { bills: Doc[]; payments: Doc[]; approvals: Doc[] },
) {
  if (["Draft", "Awaiting approval", "Cancelled", "Closed"].includes(scalar(po.status))) return null;
  const id = idOf(po.id);
  const number = scalar(po.number);
  const side = (po.supplierSide ?? {}) as Doc;
  const bill = bills.find((b) => idOf(b.purchaseOrder) === id && b.status !== "Cancelled");
  const out = payments.filter((p) => p.direction === "out");
  const paid = round2(
    out
      .filter((p) => idOf(p.purchaseOrder) === id || (bill ? idOf(p.bill) === idOf(bill.id) : false))
      .reduce((s, p) => s + num(p.amount), 0),
  );
  const total = num(bill?.amount ?? po.total);
  const balance = round2(Math.max(0, total - paid));
  if (!balance) return null;
  const depositPct = num(side.depositPct);
  const deposit = round2((num(po.total) * depositPct) / 100);
  const depositApproval = approvals.find((a) => /deposit/i.test(scalar(a.type)) && names(a, number));
  // A payment approval still under way: not rejected, and not approved with its payment recorded.
  const recorded = new Set(out.map((p) => idOf(p.approval)).filter(Boolean));
  const paymentApproval = approvals.some(
    (a) =>
      PAYMENT_APPROVAL_TYPES.includes(scalar(a.type)) &&
      !(a.status === "Approved" && recorded.has(idOf(a.id))) &&
      a.status !== "Rejected" &&
      names(a, number),
  );
  // A deposit not yet paid comes first (it's due now, whatever the bill says).
  const depositDue = deposit > 0 && paid < deposit;
  const due = depositDue
    ? TODAY.toISOString()
    : scalar(bill?.dueDate) || scalar(side.balanceDue) || new Date(TODAY.getTime() + 30 * DAY).toISOString();
  const stage: (typeof PAYABLE_STAGES)[number] = depositDue
    ? "Deposit to pay"
    : bill?.status === "On hold"
      ? "Bill on hold"
      : paid && side.balanceDue
        ? "Balance on delivery"
        : bill
          ? paid
            ? "Balance due"
            : "Bill matched"
          : "Awaiting bill";
  return {
    stage,
    currency: scalar(bill?.currency ?? po.currency) || "EGP",
    total,
    paid,
    balance,
    deposit,
    depositPct,
    /** What is to pay now: the deposit while it's due, else the balance. */
    toPay: depositDue ? deposit - paid : balance,
    due,
    bill: bill
      ? {
          id: scalar(bill.id),
          number: scalar(bill.billNumber),
          status: scalar(bill.status),
          holdReason: scalar(bill.holdReason) || null,
        }
      : null,
    depositApproval: depositApproval
      ? { id: scalar(depositApproval.id), status: scalar(depositApproval.status) }
      : null,
    paymentApproval,
  };
}
export type Payable = NonNullable<ReturnType<typeof payableOf>>;

/* ---------------------------------------------------------------- backorders */

/**
 * A receipt's shortfall as a backorder: the later drop it follows in (an open one carrying its
 * line, not the first), and whether it arrives after that drop is packed. Nothing when the
 * receipt is complete. Pure: the receipt and its case's deliveries in (the case endpoint and the
 * receipt's `backorder` field both read it).
 */
export function backorderOf(r: Doc, deliveries: Doc[]) {
  if (!(num(r.shortfall) > 0)) return null;
  const sorted = [...deliveries].sort((a, b) => scalar(a.plannedAt).localeCompare(scalar(b.plannedAt)));
  const later = sorted.find(
    (d, i) =>
      i > 0 &&
      !/confirmed|Cancelled/.test(scalar(d.status)) &&
      ((d.lines as { lineNo?: number }[] | undefined) ?? []).some((l) => l.lineNo === r.lineNo),
  );
  const ready = scalar((later?.plan as Doc | undefined)?.readyAt) || scalar(later?.plannedAt);
  return {
    followsIn: later ? scalar(later.number) : null,
    late: Boolean(ready && r.backorderDate && scalar(r.backorderDate) > ready),
  };
}

/** Supplier purchase orders, created from the approved sales requirement (split suppliers, scheduled quantities). */
export const PurchaseOrders: CollectionConfig = {
  slug: "purchase-orders",
  labels: { singular: "Purchase order", plural: "Purchase orders" },
  custom: {
    // Finance asks the Financial Director or the CEO to approve paying what's owed on it (its
    // `payable`), unless its bill is on hold or an approval is already under way.
    actions: [
      {
        label: "Request payment approval",
        when: { "payable.requestable": { equals: true } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/request-approval", body: { payable: "$row.id" } },
        confirm: {
          heading: "Request payment approval — $row.supplier.name",
          text: "$row.payable.summary.\nRouted to Mohamed Helmy (Financial Director) or Karim Balbaa (CEO).",
          label: "Request approval",
        },
        done: "Payment approval requested from Mohamed Helmy or Karim Balbaa.",
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "supplier", "total", "currency", "status"],
    group: "Fulfilment",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: management,
  },
  hooks: {
    beforeValidate: [autoNumber("purchase-orders", "number", "P")],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const lines = (data.lines as { qty?: number; unitPrice?: number }[] | undefined) ?? [];
        data.total =
          Math.round(lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0) * 100) / 100;
        // Confirming a PO is a commercial commitment: re-check must be done and management must approve.
        if (data.status === "Confirmed" && originalDoc?.status !== "Confirmed") {
          if (!data.recheckDone) throw ruleError("Re-check availability, cost, FX and lead time before confirming.");
          if (req.user?.role !== "management" && !req.context?.seed)
            throw ruleError("Supplier POs are approved by management.");
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          unique: true,
          admin: { readOnly: true, description: "Numbered automatically when the order is saved, like PO/2026/0214." },
        },
        caseRef(true, { hint: "The customer case this supplier order is placed for." }),
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          admin: { description: "The supplier the goods are ordered from.", placeholder: "e.g. Delta Marine Stores" },
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      minRows: 1,
      admin: { description: "What is ordered from the supplier, one row per item." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              min: 1,
              required: true,
              admin: { description: "The line's position on the order, starting at 1.", placeholder: "e.g. 1" },
            },
            {
              name: "offer",
              type: "relationship",
              relationTo: "offers",
              admin: {
                description: "The accepted supplier offer this line was ordered from.",
                placeholder: "Search offers",
              },
            },
            {
              name: "description",
              type: "text",
              required: true,
              admin: { description: "The item as the supplier will read it.", placeholder: "e.g. Coverall FR, size L" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              admin: {
                description: "How many units are ordered. Receipts and bills are matched against it.",
                placeholder: "e.g. 40",
              },
            },
            // Supplier costs: never shown to Sales.
            {
              name: "unitPrice",
              type: "number",
              min: 0,
              required: true,
              access: { read: costVisible },
              admin: {
                description: "The supplier's price per unit, in the order's currency, before VAT.",
                placeholder: "e.g. 1,650",
              },
            },
            {
              name: "scheduledFor",
              type: "date",
              label: "Scheduled for",
              admin: { description: "The date the supplier promises to deliver this line." },
            },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          required: true,
          defaultValue: "EGP",
          admin: { description: "The currency the supplier invoices this order in.", placeholder: "EGP" },
        },
        {
          name: "total",
          type: "number",
          min: 0,
          access: { read: costVisible },
          admin: { readOnly: true, description: "Quantity times unit price, summed over all lines." },
          custom: formats.money("currency"),
        },
        {
          name: "deliverTo",
          type: "select",
          label: "Route",
          admin: {
            description: "Where the goods go: a Golden Sea warehouse, or straight to the vessel.",
            placeholder: "e.g. Warehouse · Alexandria",
          },
          options: [
            ...WAREHOUSES.map((w) => ({ label: `Warehouse · ${w}`, value: w })),
            { label: "Drop-ship to vessel", value: "Direct to vessel (dropship)" },
          ],
          custom: tones({
            ...Object.fromEntries(WAREHOUSES.map((w) => [w, "neutral" as const])),
            "Direct to vessel (dropship)": "info",
          }),
        },
      ],
    },
    // Its lines in one line: "L1 · 40 × Coverall FR · EGP 1,650" (supplier prices never for Sales).
    computed(
      {
        name: "linesSummary",
        type: "text",
        label: "Lines",
        admin: { description: "Every line in one row, for lists and the case page." },
      },
      (po, req) =>
        ((po.lines as Doc[] | undefined) ?? [])
          .map(
            (l) =>
              `L${num(l.lineNo)} · ${num(l.qty)} × ${scalar(l.description)}${costVisible({ req }) && l.unitPrice != null ? ` · ${moneyText(num(l.unitPrice), scalar(po.currency))}` : ""}`,
          )
          .join("; "),
    ),
    {
      name: "recheck",
      type: "array",
      labels: { singular: "Re-check", plural: "Re-check before approval" },
      admin: { description: "What is checked against the supplier again before the order is approved." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "item",
              type: "text",
              required: true,
              admin: {
                description: "The price, stock or lead time being re-checked.",
                placeholder: "e.g. Unit price, Coverall FR",
              },
            },
            {
              name: "atQuotation",
              type: "text",
              admin: { description: "The value when the supplier quoted.", placeholder: "e.g. EGP 1,650" },
            },
            {
              name: "now",
              type: "text",
              admin: { description: "The value the supplier gives today.", placeholder: "e.g. EGP 1,720" },
            },
            {
              name: "ok",
              type: "checkbox",
              defaultValue: true,
              admin: { description: "Untick when the value changed and needs a decision." },
            },
          ],
        },
      ],
    },
    {
      name: "recheckDone",
      type: "checkbox",
      label: "Re-check completed",
      defaultValue: false,
      admin: { description: "Tick once every re-check row has been confirmed with the supplier." },
    },
    {
      name: "supplierSide",
      type: "group",
      label: "Supplier documents",
      admin: { description: "The supplier's acknowledgement, pro forma and deposit terms." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "acknowledgedAt",
              type: "date",
              admin: { description: "The day the supplier confirmed they accept the order." },
            },
            {
              name: "proforma",
              type: "text",
              label: "Pro forma no.",
              admin: {
                description: "The number printed on the supplier's pro forma invoice.",
                placeholder: "e.g. PF-2026-0387",
              },
            },
            evidence("proformaFile", "Pro forma", { hint: "The supplier's pro forma invoice, as a scan or PDF." }),
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "depositPct",
              type: "number",
              min: 0,
              max: 100,
              label: "Deposit %",
              admin: {
                description: "Share of the total the supplier wants up front, from 0 to 100.",
                placeholder: "e.g. 30",
              },
            },
            {
              name: "depositPayment",
              type: "relationship",
              relationTo: "payments",
              admin: { description: "The recorded payment that covered the deposit.", placeholder: "Search payments" },
            },
            {
              name: "balanceDue",
              type: "date",
              admin: { description: "When the rest is due, usually on delivery." },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: [
        "Draft",
        "Awaiting approval",
        "Confirmed",
        "Acknowledged",
        "Deposit paid",
        "Partially received",
        "Received",
        "Billed",
        "Closed",
        "Cancelled",
      ],
      custom: tones({
        Draft: "neutral",
        "Awaiting approval": "warning",
        Confirmed: "info",
        Acknowledged: "info",
        "Deposit paid": "info",
        "Partially received": "warning",
        Received: "success",
        Billed: "success",
        Closed: "neutral",
        Cancelled: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: "Where the order is, from draft to closed.",
        placeholder: "Pick a status",
      },
    },
    // Acknowledged by the supplier, re-checked before confirming (and whether it flagged a change).
    computed(
      {
        name: "statusNote",
        type: "text",
        label: "Progress",
        admin: { description: "Acknowledgement and re-check in one line." },
        // A re-check that flagged a change reads as a warning.
        custom: {
          toneWhen: [{ when: { recheckDone: { equals: true }, "recheck.ok": { equals: false } }, tone: "warning" }],
        },
      },
      (po) => {
        const side = (po.supplierSide ?? {}) as Doc;
        const flagged = ((po.recheck as { ok?: boolean }[] | undefined) ?? []).some((x) => x.ok === false);
        return [
          side.acknowledgedAt ? `Acknowledged ${dayText(side.acknowledgedAt)}` : "",
          po.recheckDone ? `Re-checked${flagged ? " · change flagged" : ""}` : "",
        ]
          .filter(Boolean)
          .join(" · ");
      },
    ),
    // The pro forma's deposit and where its payment is: paid, in approval or still to approve.
    computed(
      {
        name: "deposit",
        type: "group",
        label: "Pro forma · deposit",
        admin: { condition: () => false, description: "The pro forma deposit and where its payment stands." },
        fields: [
          // A deposit whose payment is in approval links to the cash page, where it is decided.
          {
            name: "text",
            type: "text",
            label: "Pro forma · deposit",
            admin: { description: "Deposit share, amount and pro forma number.", placeholder: "e.g. 30% · EGP 49,500" },
            custom: { href: "$row.deposit.href" },
          },
          {
            name: "note",
            type: "text",
            admin: {
              description: "Whether the deposit is paid or waiting for approval.",
              placeholder: "e.g. Needs payment approval",
            },
            custom: {
              toneWhen: [
                { when: { "deposit.state": { in: ["Paid", "Approved"] } }, tone: "success" },
                { when: { "deposit.state": { equals: "Rejected" } }, tone: "error" },
                { when: { "deposit.state": { in: ["In approval", "Needs approval"] } }, tone: "warning" },
              ],
            },
          },
          {
            name: "state",
            type: "select",
            options: ["Paid", "Approved", "Rejected", "In approval", "Needs approval"],
            admin: { description: "The deposit payment stage.", placeholder: "Pick a stage" },
          },
          {
            name: "href",
            type: "text",
            admin: {
              description: "Link to the cash page while the payment is in approval.",
              placeholder: "e.g. /cash",
            },
          },
        ],
      },
      async (po, req) => {
        if (!costsFor(req)) return null;
        const side = (po.supplierSide ?? {}) as Doc;
        const proforma = scalar(side.proforma);
        const depositPct = num(side.depositPct);
        if (!depositPct) return { text: proforma || "No deposit", note: "", state: null, href: null };
        const { payments, approvals } = await moneyOut(req);
        const id = idOf(po.id);
        const number = scalar(po.number);
        const cur = scalar(po.currency);
        const paid = round2(
          payments.filter((p) => idOf(p.purchaseOrder) === id).reduce((s, p) => s + num(p.amount), 0),
        );
        const ofCase = approvals.filter((a) => idOf(a.case) === idOf(po.case));
        const approval =
          ofCase.find((a) => /deposit|payment|PO/i.test(scalar(a.type)) && scalar(a.detail).includes(number)) ??
          ofCase.find((a) => idOf((a.subject as Doc | undefined)?.value) === id || scalar(a.title).includes(number));
        const due = side.balanceDue ? ` · Balance on delivery · ${dayText(side.balanceDue)}` : "";
        const status = scalar(approval?.status);
        return {
          text: `${depositPct}% · ${moneyText(round2((num(po.total) * depositPct) / 100), cur)}${proforma ? ` · ${proforma}` : ""}`,
          note:
            paid > 0
              ? `Deposit paid ${moneyText(paid, cur)}${due}`
              : approval
                ? `Payment approval: ${status}${due}`
                : `Needs payment approval${due}`,
          state:
            paid > 0
              ? "Paid"
              : !approval
                ? "Needs approval"
                : status === "Approved"
                  ? "Approved"
                  : /rejected|returned/i.test(status)
                    ? "Rejected"
                    : "In approval",
          href: paid <= 0 && approval ? link.view("/cash") : null,
        };
      },
    ),
    // What we owe the supplier on it (`payableOf`), for those who see costs.
    computed(
      {
        name: "payable",
        type: "group",
        admin: { condition: () => false, description: "What Golden Sea still owes the supplier on this order." },
        fields: [
          {
            name: "stage",
            type: "select",
            options: [...PAYABLE_STAGES],
            admin: {
              description: "How far the payable has got, from awaiting bill to balance due.",
              placeholder: "e.g. Balance due",
            },
            custom: tones({
              "Deposit to pay": "warning",
              "Balance due": "warning",
              "Bill matched": "neutral",
              "Balance on delivery": "neutral",
              "Awaiting bill": "neutral",
              "Bill on hold": "error",
            }),
          },
          {
            name: "currency",
            type: "text",
            admin: { description: "The currency the order is payable in.", placeholder: "e.g. USD" },
          },
          {
            name: "total",
            type: "number",
            admin: { description: "The order total in its own currency.", placeholder: "e.g. 49,500" },
            custom: formats.money("currency"),
          },
          {
            name: "paid",
            type: "number",
            admin: { description: "What has been paid to the supplier so far.", placeholder: "e.g. 14,850" },
            custom: formats.money("currency"),
          },
          {
            name: "balance",
            type: "number",
            admin: { description: "What is still owed, in the order's currency.", placeholder: "e.g. 34,650" },
            custom: formats.money("currency"),
          },
          {
            name: "balanceEgp",
            type: "number",
            label: "Balance (EGP)",
            admin: { description: "The balance at today's FX rate, in pounds.", placeholder: "e.g. 1,684,000" },
            custom: formats.money("EGP"),
          },
          // Virtual like its group, so a widget sorts by it as read.
          {
            name: "due",
            type: "date",
            virtual: true,
            admin: { description: "When the next payment to the supplier falls due." },
          },
          // The supplier, linking to the PO's case (its order tab), where the PO is.
          {
            name: "supplier",
            type: "text",
            label: "Supplier",
            admin: {
              description: "The supplier name, linking to the order on its case.",
              placeholder: "e.g. Delta Marine Stores",
            },
            custom: { href: link.doc("cases", "$row.case", "order") },
          },
          {
            name: "ref",
            type: "text",
            label: "Reference",
            admin: {
              description: "Order number, case and bill in one line.",
              placeholder: "e.g. PO/2026/0214 · GS-0142",
            },
          },
          // A bill on hold's reason reads as an error.
          {
            name: "note",
            type: "text",
            admin: {
              description: "A bill hold reason or the deposit terms.",
              placeholder: "e.g. Deposit 30% EGP 14,850 · paid",
            },
            custom: { toneWhen: [{ when: { "payable.stage": { equals: "Bill on hold" } }, tone: "error" }] },
          },
          {
            name: "next",
            type: "text",
            label: "Next",
            admin: {
              description: "What the payable is waiting for, if anything.",
              placeholder: "e.g. Approval in progress",
            },
          },
          {
            name: "requestable",
            type: "checkbox",
            admin: { description: "On when finance can ask for approval to pay it now." },
          },
          {
            name: "summary",
            type: "text",
            admin: {
              description: "The payable in one line for the approval request.",
              placeholder: "e.g. Delta Marine Stores · PO/2026/0214 · balance EGP 34,650",
            },
          },
        ],
      },
      async (po, req) => {
        if (!costsFor(req)) return null;
        const p = payableOf(po, await moneyOut(req));
        if (!p) return null;
        const fx = await fxRates(req);
        const [supplier, caseDoc] = await Promise.all([
          related(req, "suppliers", po.supplier),
          related(req, "cases", po.case),
        ]);
        const number = scalar(po.number);
        const caseId = scalar(caseDoc?.caseId);
        const next =
          p.stage === "Bill on hold"
            ? "Waits for receipt / credit note"
            : p.paymentApproval || p.depositApproval
              ? "Approval in progress"
              : "";
        return {
          stage: p.stage,
          currency: p.currency,
          total: p.total,
          paid: p.paid,
          balance: p.balance,
          balanceEgp: Math.round(p.balance * (fx[p.currency] ?? 1)),
          due: p.due,
          supplier: scalar(supplier?.name),
          ref: `${number}${caseId ? ` · ${caseId}` : ""}${p.bill ? ` · bill ${p.bill.number}` : ""}`,
          note: [
            p.bill?.holdReason ?? "",
            p.depositPct
              ? `Deposit ${p.depositPct}% ${moneyText(p.deposit, p.currency)}${p.paid ? " · paid" : p.depositApproval ? ` · approval ${p.depositApproval.status}` : ""}`
              : "",
          ]
            .filter(Boolean)
            .join(" · "),
          next,
          requestable: !next,
          summary: `${scalar(supplier?.name)} · ${number} · balance ${moneyText(p.balance, p.currency)} due ${dayText(p.due)}${p.bill ? ` · bill ${p.bill.number} ${p.bill.status}` : ""}`,
        };
      },
    ),
  ],
};

/** The same supplier can't book the same bill number twice (the demo's blocked duplicate bill). */
const uniqueBillNumber: TextFieldSingleValidation = async (value, { req, siblingData, id }) => {
  const supplier = idOf((siblingData as { supplier?: unknown } | undefined)?.supplier);
  if (!value || !supplier) return true;
  const { docs } = await req.payload.find({
    collection: "supplier-bills" as never,
    where: { and: [{ billNumber: { equals: value } }, { supplier: { equals: supplier } }] },
    depth: 0,
    limit: 2,
  });
  return docs.some((d) => String((d as { id: unknown }).id) !== String(id))
    ? "Duplicate bill: this supplier's bill number is already booked."
    : true;
};

/** Supplier bills: matched to PO and received quantities; the same supplier + bill number can't be booked twice. */
export const SupplierBills: CollectionConfig = {
  slug: "supplier-bills",
  labels: { singular: "Supplier bill", plural: "Supplier bills" },
  custom: {
    // The supplier emails the same bill again: finance books it, and the duplicate-bill check
    // (same supplier + bill number) refuses it.
    actions: [
      {
        label: "Book incoming bill",
        when: { status: { not_in: ["Paid", "Cancelled", "Credit note"] } },
        roles: FINANCE_ROLES,
        call: { path: "/case-order/book-bill", body: { bill: "$row.id" } },
        confirm: {
          heading: "Book incoming supplier bill",
          text: "Bill from $row.supplier.name received by email: $row.summary — read by AI (confidence 98%).\nBooking checks the bill number against this supplier's bills first.",
          label: "Book bill",
        },
        done: "Bill booked.",
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "billNumber",
    defaultColumns: ["billNumber", "supplier", "purchaseOrder", "amount", "status", "dueDate"],
    group: "Fulfilment",
  },
  access: financeAccess,
  hooks: {
    beforeChange: [
      // The case is its PO's (so a case's bills can be listed).
      async ({ data, req }) => {
        if (!data.case && data.purchaseOrder) {
          const po = await related(req, "purchase-orders", idOf(data.purchaseOrder));
          if (po?.case) data.case = idOf(po.case);
        }
        return data;
      },
      ({ data }) => {
        // Three-way match: ordered = received = billed, otherwise on hold.
        const lines = (data.match as { ordered?: number; received?: number; billed?: number }[] | undefined) ?? [];
        const mismatch = lines.find(
          (l) => Number(l.billed) > Number(l.received) || Number(l.received) > Number(l.ordered),
        );
        if (!["Paid", "Cancelled", "Credit note"].includes(String(data.status))) {
          data.status = mismatch ? "On hold" : lines.length ? "Matched" : (data.status ?? "Received");
          data.holdReason = mismatch
            ? `Billed ${mismatch.billed}, received ${mismatch.received}, ordered ${mismatch.ordered}`
            : null;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "billNumber",
          type: "text",
          required: true,
          validate: uniqueBillNumber,
          admin: {
            description: "The number printed on the supplier's bill. Each supplier's number can be entered once.",
            placeholder: "e.g. DM-5512",
          },
        },
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          admin: { description: "The supplier who issued the bill.", placeholder: "e.g. Delta Marine Stores" },
        },
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          label: "PO",
          admin: {
            description: "The purchase order the bill is for, used for the 3-way match.",
            placeholder: "e.g. PO/2026/0214",
          },
        },
        {
          name: "case",
          type: "relationship",
          relationTo: "cases",
          index: true,
          admin: { readOnly: true, description: "The PO's case." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "amount",
          type: "number",
          min: 0,
          required: true,
          access: { read: costVisible },
          admin: { description: "The bill total as printed, including VAT.", placeholder: "e.g. 96,400" },
          custom: formats.money("currency"),
        },
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          defaultValue: "EGP",
          admin: { description: "The currency printed on the bill.", placeholder: "EGP" },
        },
        {
          name: "vatAmount",
          type: "number",
          min: 0,
          label: "Input VAT (recoverable)",
          access: { read: costVisible },
          admin: { description: "The 14% VAT on the bill that Golden Sea can recover.", placeholder: "e.g. 11,838" },
        },
        {
          name: "dueDate",
          type: "date",
          admin: { description: "The date payment is due under the supplier's terms." },
        },
      ],
    },
    {
      name: "match",
      type: "array",
      labels: { singular: "Line", plural: "PO / receipt / bill match" },
      admin: { description: "Ordered, received and billed quantities per line, side by side." },
      custom: {
        about:
          "A bill is matched when ordered, received and billed agree on every line. A mismatch puts the bill on hold until a receipt or credit note arrives.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              min: 1,
              admin: { description: "The PO line this row checks.", placeholder: "e.g. 1" },
            },
            {
              name: "ordered",
              type: "number",
              min: 0,
              admin: { description: "Units on the purchase order.", placeholder: "e.g. 40" },
            },
            {
              name: "received",
              type: "number",
              min: 0,
              admin: { description: "Units received into the warehouse.", placeholder: "e.g. 40" },
            },
            {
              name: "billed",
              type: "number",
              min: 0,
              admin: { description: "Units the supplier billed for.", placeholder: "e.g. 40" },
            },
          ],
        },
      ],
    },
    // The 3-way match in one line: "L1: 40 · 40 · 40; L2: 200 · 180 · 200" (ordered · received · billed).
    // In the error tone when the lines don't match (the bill is on hold).
    computed(
      {
        name: "matchLines",
        type: "text",
        label: "PO · receipt · bill",
        admin: { description: "Ordered, received and billed per line, in that order." },
        custom: { toneWhen: [{ when: { status: { equals: "On hold" } }, tone: "error" }] },
      },
      (b) =>
        ((b.match as Doc[] | undefined) ?? [])
          .map((m) => `L${num(m.lineNo)}: ${num(m.ordered)} · ${num(m.received)} · ${num(m.billed)}`)
          .join("; "),
    ),
    // How it reads in a sentence: "DM-5512 · EGP 96,400 · PO P0418".
    computed(
      {
        name: "summary",
        type: "text",
        admin: { condition: () => false, description: "The bill in one sentence: number, amount and PO." },
      },
      async (b, req) => {
        const po = await related(req, "purchase-orders", b.purchaseOrder);
        const amount = b.amount == null ? "" : ` · ${moneyText(num(b.amount), scalar(b.currency) || "EGP")}`;
        return `${scalar(b.billNumber)}${amount} · PO ${scalar(po?.number) || "—"}`;
      },
    ),
    {
      name: "creditNote",
      type: "text",
      label: "Linked credit note",
      admin: {
        description: "The supplier's credit note number that settles a mismatch.",
        placeholder: "e.g. CN-2026-044",
      },
    },
    evidence("file", "Bill document", { hint: "The supplier's bill, as a scan or PDF." }),
    {
      name: "status",
      type: "select",
      defaultValue: "Received",
      options: ["Received", "Matched", "On hold", "Approved for payment", "Paid", "Credit note", "Cancelled"],
      custom: tones({
        Received: "info",
        Matched: "success",
        "On hold": "error",
        "Approved for payment": "success",
        Paid: "success",
        "Credit note": "neutral",
        Cancelled: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: "Where the bill is, from received to paid.",
        placeholder: "Pick a status",
      },
    },
    {
      name: "holdReason",
      type: "text",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Why the 3-way match failed, while the bill is on hold.",
      },
      custom: { toneWhen: [{ when: { status: { equals: "On hold" } }, tone: "error" }] },
    },
  ],
};

/** Goods received: quantities, lots, expiry and quality check per PO line. */
export const Receipts: CollectionConfig = {
  slug: "receipts",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "purchaseOrder", "received", "ordered", "qc"],
    group: "Fulfilment",
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.label = `L${data.lineNo ?? "?"} · ${data.received ?? 0}/${data.ordered ?? 0}`;
        data.shortfall = Math.max(0, (Number(data.ordered) || 0) - (Number(data.received) || 0));
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === "create" && !req.context?.seed && (doc.shortfall > 0 || doc.qc !== "OK"))
          await logActivity(req, {
            case: idOf(doc.case),
            kind: "alert",
            text: `Receipt ${doc.label}: ${doc.qc}${doc.shortfall ? ` — ${doc.shortfall} short` : ""}.`,
          });
        return doc;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", admin: { hidden: true } },
    {
      type: "row",
      fields: [
        caseRef(true, { hint: "The customer case this delivery from the supplier is for." }),
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          required: true,
          admin: { description: "The purchase order the goods arrived against.", placeholder: "e.g. PO/2026/0214" },
        },
        {
          name: "lineNo",
          type: "number",
          min: 1,
          required: true,
          admin: { description: "The PO line number being received.", placeholder: "e.g. 2" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "ordered",
          type: "number",
          min: 0,
          required: true,
          admin: { description: "Units the PO line asked for.", placeholder: "e.g. 200" },
        },
        {
          name: "received",
          type: "number",
          min: 0,
          required: true,
          admin: { description: "Units that actually arrived and were counted.", placeholder: "e.g. 180" },
        },
        // Short of what was ordered: a backorder, in the warning tone.
        {
          name: "shortfall",
          type: "number",
          min: 0,
          admin: { readOnly: true, description: "Ordered minus received. Anything above zero is a backorder." },
          custom: { toneWhen: [{ when: { shortfall: { greater_than: 0 } }, tone: "warning" }] },
        },
        {
          name: "receivedAt",
          type: "date",
          admin: { description: "The day the goods reached the warehouse or dock." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "warehouse",
          type: "select",
          options: [...WAREHOUSES, "Direct to vessel"],
          admin: {
            description: "Where the goods were put away, or straight to the vessel.",
            placeholder: "e.g. Alexandria",
          },
        },
        {
          name: "lot",
          type: "text",
          admin: {
            description: "The supplier's lot or batch number, for traceability.",
            placeholder: "e.g. LOT-24117",
          },
        },
        {
          name: "expiry",
          type: "date",
          admin: { description: "Best-before date for food and chemicals. Leave empty otherwise." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "qc",
          type: "select",
          label: "Quality check",
          options: ["OK", "Short", "Damaged", "Wrong item", "Shelf life too short", "Certificate missing"],
          defaultValue: "OK",
          admin: { description: "The result of inspecting the goods on arrival.", placeholder: "Pick a result" },
          custom: tones({
            OK: "success",
            Short: "error",
            Damaged: "error",
            "Wrong item": "error",
            "Shelf life too short": "warning",
            "Certificate missing": "error",
          }),
        },
        {
          name: "claim",
          type: "text",
          label: "Damage / shortage claim",
          admin: {
            description: "The claim reference raised with the supplier, if any.",
            placeholder: "e.g. CLM-0092, 20 units short",
          },
        },
        {
          name: "backorderDate",
          type: "date",
          label: "Promised",
          admin: { description: "When the supplier promises to send the missing units." },
        },
      ],
    },
    {
      name: "certificates",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: { description: "Test, origin or food-safety certificates that came with the goods." },
    },
    // How the case's tables name it: the PO line and its supplier, and how much of it came.
    {
      type: "row",
      fields: [
        computed(
          { name: "item", type: "text", label: "Line", admin: { description: "The PO line and its description." } },
          async (r, req) => {
            const po = await related(req, "purchase-orders", r.purchaseOrder);
            const line = ((po?.lines as Doc[] | undefined) ?? []).find((l) => l.lineNo === r.lineNo);
            return `L${num(r.lineNo)} · ${scalar(line?.description)}`;
          },
        ),
        computed(
          { name: "from", type: "text", label: "Supplier", admin: { description: "The supplier and the PO number." } },
          async (r, req) => {
            const po = await related(req, "purchase-orders", r.purchaseOrder);
            const supplier = await related(req, "suppliers", po?.supplier);
            return `${scalar(supplier?.name)} · ${scalar(po?.number)}`;
          },
        ),
        computed(
          {
            name: "quantity",
            type: "text",
            label: "Received",
            admin: { description: "Units received out of units ordered." },
            custom: { toneWhen: [{ when: { shortfall: { greater_than: 0 } }, tone: "warning" }] },
          },
          (r) => `${num(r.received)} of ${num(r.ordered)}`,
        ),
      ],
    },
    // A shortfall is a backorder (`backorderOf`): the drop it follows in, its owner (the case's)
    // and whether it is in time.
    computed(
      {
        name: "backorder",
        type: "group",
        admin: {
          condition: () => false,
          description: "What happens to the missing units, and whether they are in time.",
        },
        fields: [
          {
            name: "followsIn",
            type: "text",
            label: "Follows in",
            admin: { description: "The delivery the missing units will travel in.", placeholder: "e.g. DN-0212" },
          },
          {
            name: "owner",
            type: "text",
            admin: { description: "The case owner who chases the supplier.", placeholder: "e.g. Karim Balbaa" },
          },
          {
            name: "risk",
            type: "select",
            admin: {
              description: "Whether the backorder lands before the vessel drop is packed.",
              placeholder: "Pick a risk",
            },
            options: ["Arrives after the drop is packed", "In time for the drop"],
            custom: tones({ "Arrives after the drop is packed": "error", "In time for the drop": "success" }),
          },
        ],
      },
      async (r, req) => {
        if (req.context?.seed) return null;
        const caseId = idOf(r.case);
        if (!caseId) return null;
        const b = backorderOf(r, await deliveriesOf(req, caseId));
        if (!b) return null;
        const caseDoc = await related(req, "cases", r.case);
        const owner = await related(req, "users", caseDoc?.owner);
        return {
          followsIn: b.followsIn ?? "Not planned",
          owner: scalar(owner?.name) || idOf(caseDoc?.owner) || "",
          risk: b.late ? "Arrives after the drop is packed" : "In time for the drop",
        };
      },
    ),
  ],
};

/** Deliveries to vessel or site: plan, dispatch and confirmed receipt with evidence. */
export const Deliveries: CollectionConfig = {
  slug: "deliveries",
  admin: { useAsTitle: "number", defaultColumns: ["number", "case", "plannedAt", "status"], group: "Fulfilment" },
  access: deskAccess,
  hooks: {
    beforeValidate: [autoNumber("deliveries", "number", "DN-")],
    beforeChange: [
      ({ data }) => {
        // "Delivered" needs evidence; dispatch and confirmed receipt are separate.
        if (data.status === "Delivered — confirmed" && !data.proof)
          throw ruleError("Attach the signed delivery note or photo before confirming delivery.");
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          unique: true,
          admin: { readOnly: true, description: "Numbered automatically when saved, like DN-0212." },
        },
        caseRef(true, { hint: "The customer case this delivery to the vessel belongs to." }),
        {
          name: "consolidatedWith",
          type: "relationship",
          relationTo: "cases",
          hasMany: true,
          label: "Also carries (e.g. cleared spares)",
          admin: { description: "Other cases whose goods travel on this same trip.", placeholder: "Search cases" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "plannedAt",
          type: "date",
          required: true,
          admin: {
            description: "The planned date and time of the handover.",
            date: { pickerAppearance: "dayAndTime" },
          },
        },
        {
          name: "place",
          type: "text",
          required: true,
          admin: {
            description: "The port, berth or anchorage where the vessel takes delivery.",
            placeholder: "e.g. Port Said anchorage 4",
          },
        },
      ],
    },
    {
      name: "plan",
      type: "group",
      admin: { description: "How the goods get to the vessel: transport, staff, clearance and cold chain." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "vehicle",
              type: "text",
              admin: {
                description: "The truck or van that carries the goods to the port.",
                placeholder: "Golden Sea truck 3 (reefer)",
              },
            },
            {
              name: "boardingStaff",
              type: "text",
              admin: { description: "Who goes on board with the goods.", placeholder: "e.g. Ahmed Fathy" },
            },
            {
              name: "launch",
              type: "text",
              label: "Launch / boat booking",
              admin: {
                description: "The launch or boat that takes the goods out to the vessel.",
                placeholder: "e.g. Launch Nour, 09:30",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "readyAt",
              type: "date",
              label: "Goods ready",
              admin: { description: "When the goods are packed and ready to leave the warehouse." },
            },
            {
              name: "clearance",
              type: "text",
              label: "Clearance / ship-stores declaration",
              admin: {
                description: "The customs ship-stores declaration number for this drop.",
                placeholder: "e.g. SSD-2026-0381",
              },
            },
            {
              name: "coldChain",
              type: "checkbox",
              label: "Cold chain (temperature log)",
              defaultValue: false,
              admin: { description: "Tick for chilled or frozen goods. It adds a temperature log." },
            },
          ],
        },
        {
          name: "temperatureLog",
          type: "array",
          admin: {
            condition: (_, s) => Boolean(s?.coldChain),
            description: "Temperature readings taken along the trip.",
          },
          fields: [
            {
              type: "row",
              fields: [
                { name: "at", type: "date", admin: { description: "When the reading was taken." } },
                {
                  name: "point",
                  type: "select",
                  options: ["Loading", "Base", "Boat transfer", "On board"],
                  admin: { description: "The step of the trip where it was measured.", placeholder: "Pick a step" },
                },
                {
                  name: "celsius",
                  type: "number",
                  admin: {
                    description: "The reading in degrees Celsius. Chilled goods stay at 2 to 5.",
                    placeholder: "e.g. 4",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      admin: { description: "The order lines and quantities loaded on this delivery." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              min: 1,
              required: true,
              admin: { description: "The order line being delivered.", placeholder: "e.g. 1" },
            },
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              admin: { description: "Units of that line on this trip.", placeholder: "e.g. 40" },
            },
            {
              name: "lot",
              type: "text",
              admin: { description: "The lot the units come from, for traceability.", placeholder: "e.g. LOT-24117" },
            },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "dispatchedAt",
          type: "date",
          admin: { description: "When the goods left the warehouse for the port." },
        },
        {
          name: "confirmedAt",
          type: "date",
          admin: { description: "When the vessel confirmed it received the goods." },
        },
        {
          name: "confirmedBy",
          type: "text",
          label: "Signed by (vessel)",
          admin: { description: "The crew member who signed for the goods.", placeholder: "e.g. Chief Officer Petrov" },
        },
      ],
    },
    evidence("proof", "Signed delivery note / photo", {
      hint: "The signed delivery note or a photo. Needed to confirm delivery.",
    }),
    {
      name: "shortages",
      type: "textarea",
      admin: {
        description: "Items missing or damaged on handover, one per line.",
        placeholder: "e.g. 2 of 40 coveralls short",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Planned",
      options: [
        "Planned",
        "Ready",
        "Dispatched",
        "Delivered — confirmed",
        "Partially delivered",
        "Rescheduled",
        "Cancelled",
      ],
      admin: {
        position: "sidebar",
        description: "Where the delivery is, from planned to confirmed.",
        placeholder: "Pick a status",
      },
    },
  ],
};
