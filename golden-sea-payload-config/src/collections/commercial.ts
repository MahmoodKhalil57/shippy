import type { CollectionConfig, PayloadRequest } from "payload";
import {
  CURRENCIES,
  QUOTE_DECISIONS,
  ROLES,
  UNITS,
  caseRef,
  computed,
  costVisible,
  deskAccess,
  evidence,
  idOf,
  logActivity,
  ruleError,
  scalar,
} from "./shared.ts";
import { formats, tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";
import { quotePreview } from "../pages/quote-preview.ts";

type Json = Record<string, unknown>;
const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);

const QUOTE_STATUSES = ["Draft", "Awaiting approval", "Approved", "Returned", "Submitted", "Superseded"];
const QUOTE_TONES = tones({
  Draft: "neutral",
  "Awaiting approval": "warning",
  Approved: "success",
  Returned: "error",
  Submitted: "info",
  Superseded: "neutral",
});

/** Who sees costs and margins: everyone but Sales (`costVisible`). */
const COST_ROLES = ROLES.map((r) => r.value).filter((r) => r !== "sales");

/** The pricing policy's minimum margin (%), read once per request. */
function minMarginOf(req: PayloadRequest): Promise<number> {
  const ctx = (req.context ??= {}) as { minMargin?: Promise<number> };
  ctx.minMargin ??= req.payload
    .findGlobal({ slug: "pricing-policy" as never, depth: 0 } as never)
    .then((p) => num((p as Json).minMarginPct, 15))
    .catch(() => 15);
  return ctx.minMargin;
}

/** Customer quotations, versioned. A revision is a new document; the old version stays. */
export const Quotations: CollectionConfig = {
  slug: "quotations",
  custom: {
    edit: { steps: { field: "status", skip: ["Returned", "Superseded"] } },
    // Where its prices come from: the case's pricing (costs and margins: never for Sales).
    actions: [{ label: "Pricing", roles: COST_ROLES, href: link.doc("cases", "$row.case", "pricing") }],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "version", "status", "totalExVat", "currency", "validUntil"],
    group: "Commercial",
    // The quotation as the customer receives it (Payload custom edit view).
    components: {
      views: {
        edit: {
          preview: {
            Component: quotePreview,
            path: "/preview",
            tab: { label: "Preview & send", href: "/preview" },
          },
        },
      },
    },
  },
  access: deskAccess,
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data?.case) return data;
        const c = (await req.payload.findByID({ collection: "cases", id: String(idOf(data.case)), depth: 0 })) as {
          caseId?: string;
        };
        const { totalDocs } = await req.payload.count({
          collection: "quotations" as never,
          where: { case: { equals: idOf(data.case) } },
        });
        const n = String(c.caseId ?? "").replace(/\D/g, "");
        return {
          ...data,
          version: data.version ?? totalDocs + 1,
          number: data.number ?? `GS-Q-${n} v${totalDocs + 1}`,
        };
      },
    ],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        // Totals from the line snapshot.
        const lines = (data.lines as { qty?: number; unitPrice?: number }[] | undefined) ?? [];
        const gross = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
        data.totalExVat = Math.round(gross * (1 - (Number(data.discountPct) || 0) / 100) * 100) / 100;
        // Approved quotations can't be edited — create a revision instead.
        if (
          originalDoc?.status === "Approved" &&
          data.status === "Approved" &&
          JSON.stringify(originalDoc.lines) !== JSON.stringify(data.lines)
        )
          throw ruleError("This version is approved. Create a revision to change lines or prices.");
        // Only management approves.
        if (data.status === "Approved" && originalDoc?.status !== "Approved" && req.user?.role !== "management")
          throw ruleError("Only management can approve quotations.");
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, {
            case: idOf(doc.case),
            text: `Quotation ${doc.number}: ${previousDoc?.status ?? "—"} → ${doc.status}.`,
          });
        return doc;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "number", type: "text", unique: true, admin: { readOnly: true } },
        caseRef(),
        { name: "version", type: "number", min: 1, admin: { readOnly: true } },
        { name: "previousVersion", type: "relationship", relationTo: "quotations" },
      ],
    },
    {
      name: "lines",
      type: "array",
      labels: { singular: "Line", plural: "Lines" },
      admin: { description: "Customer-facing snapshot — no supplier names, costs or margins." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1 },
            { name: "partNo", type: "text" },
            { name: "description", type: "text", required: true },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "unit", type: "select", options: UNITS },
            { name: "qty", type: "number", min: 0, required: true },
            { name: "unitPrice", type: "number", min: 0, required: true },
            { name: "lead", type: "text", defaultValue: "On arrival" },
          ],
        },
        { name: "alternative", type: "checkbox", label: "Alternative (customer accepted)", defaultValue: false },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "currency", type: "select", options: CURRENCIES, defaultValue: "USD" },
        { name: "fxRate", type: "number", min: 0, label: "FX (EGP per unit)" },
        { name: "discountPct", type: "number", min: 0, max: 50, defaultValue: 0 },
        {
          name: "totalExVat",
          type: "number",
          min: 0,
          admin: { readOnly: true },
          custom: formats.money("currency", { decimals: 2 }),
        },
      ],
    },
    {
      name: "internal",
      type: "group",
      label: "Internal (never printed)",
      access: { read: costVisible },
      fields: [
        {
          type: "row",
          fields: [
            { name: "landedCostEGP", type: "number", min: 0, label: "Landed cost", custom: formats.money("EGP") },
            { name: "grossProfitEGP", type: "number", label: "Gross profit", custom: formats.money("EGP") },
            {
              name: "marginPct",
              type: "number",
              label: "Margin",
              custom: {
                ...formats.percent(),
                // Amber under the pricing policy's minimum.
                toneWhen: [
                  { when: { "internal.belowMinimum": { equals: true } }, tone: "warning" },
                  { when: { "internal.marginPct": { exists: true } }, tone: "success" },
                ],
              },
            },
          ],
        },
        {
          name: "exceptions",
          type: "textarea",
          admin: { description: "Shown to the approver: margin below minimum, alternative pack, advance payment…" },
        },
        // The pricing policy's minimum beside the margin, worked out on read (the policy can change).
        {
          type: "row",
          fields: [
            computed(
              { name: "minMarginPct", type: "number", label: "Policy minimum", custom: formats.percent(0) },
              async (_q, req) => minMarginOf(req),
            ),
            computed(
              { name: "belowMinimum", type: "checkbox", label: "Below the policy minimum" },
              async (q, req) => num((q.internal as Json | undefined)?.marginPct) < (await minMarginOf(req)),
            ),
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "validUntil", type: "date" },
        { name: "paymentTerms", type: "text", defaultValue: "90 days from invoice date" },
        { name: "deliveryTerms", type: "text" },
      ],
    },
    { name: "remarks", type: "textarea" },
    // Every version of this quotation (its case's), oldest first: older ones superseded, kept for audit.
    computed(
      {
        name: "versions",
        type: "array",
        admin: { position: "sidebar" },
        fields: [
          {
            name: "number",
            type: "text",
            custom: { href: link.doc("quotations", "$row.id", "preview") },
          },
          { name: "version", type: "number" },
          { name: "status", type: "select", options: QUOTE_STATUSES, custom: QUOTE_TONES },
          { name: "totalExVat", type: "number", label: "Total", custom: formats.money("currency", { decimals: 2 }) },
          { name: "currency", type: "text" },
        ],
      },
      async (q, req) => {
        // Read without this field (it would read the versions' versions).
        if (req.context?.quotationVersions || !idOf(q.case)) return [];
        const { docs } = await req.payload.find({
          collection: "quotations" as never,
          where: { case: { equals: idOf(q.case) } } as never,
          sort: "version",
          limit: 0,
          depth: 0,
          context: { quotationVersions: true },
        } as never);
        return (docs as unknown as Json[]).map((v) => ({
          id: scalar(v.id),
          number: scalar(v.number),
          version: num(v.version),
          status: scalar(v.status),
          totalExVat: num(v.totalExVat),
          currency: scalar(v.currency),
        }));
      },
    ),
    {
      name: "submission",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "method",
              type: "select",
              options: ["Email from Odoo", "Customer procurement portal"],
              defaultValue: "Email from Odoo",
            },
            { name: "submittedAt", type: "date" },
            { name: "followUpAt", type: "date" },
          ],
        },
        {
          name: "portalCheck",
          type: "array",
          labels: { singular: "Checked field", plural: "Portal vs quote" },
          admin: { condition: (_, s) => s?.method === "Customer procurement portal" },
          fields: [
            {
              type: "row",
              fields: [
                { name: "field", type: "text", required: true },
                { name: "portal", type: "text" },
                { name: "quote", type: "text" },
                { name: "matches", type: "checkbox", defaultValue: false },
              ],
            },
          ],
        },
        evidence("receipt", "Portal receipt / screenshot"),
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: QUOTE_STATUSES,
      custom: QUOTE_TONES,
      admin: { position: "sidebar" },
    },
    {
      name: "decision",
      type: "select",
      options: [...QUOTE_DECISIONS, "Partially won"],
      admin: { position: "sidebar" },
    },
    { name: "preparedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "approvedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar", readOnly: true } },
  ],
};

/* ---------------------------------------------------------------- approvals: who decides, and on what */

const shortDay = (v: unknown) =>
  scalar(v) ? new Date(scalar(v)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "";
const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
const amount = (cur: unknown, n: number) =>
  `${scalar(cur)} ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`.trim();

/** What can be asked for approval. */
const APPROVAL_TYPES = [
  "Customer quotation",
  "Quotation margin exception",
  "Customer discount",
  "Alternative product (internal)",
  "Supplier PO",
  "Supplier deposit (payment)",
  "Supplier payment",
  "Bank detail change",
  "Exchange rate",
  "Agency pricelist",
  "Approved-vendor status",
  "Close with exception",
];

/** An approval's statuses: worked out from its decisions (`beforeChange`). */
export const APPROVAL_STATUSES = ["Pending", "Approved 1 of 2", "Approved", "Rejected"];
/** A request that is decided: nothing more to approve. */
export const FINAL_APPROVAL = ["Approved", "Rejected"];
/** Supplier payments: finance records them (with the bank reference) once approved. */
export const PAYMENT_APPROVALS = ["Supplier deposit (payment)", "Supplier payment"];
/** Who records supplier payments. */
const FINANCE_ROLES = ["management", "finance-director", "operations"];

const ROLE_LABEL: Record<string, string> = {
  management: "management",
  "finance-director": "finance",
  "supply-chain": "supply chain",
  sales: "sales",
  operations: "operations",
  "office-admin": "office admin",
};

const all = async (req: PayloadRequest, collection: string, where?: Json): Promise<Json[]> =>
  (
    await req.payload.find({
      collection: collection as never,
      where: where as never,
      limit: 0,
      depth: 0,
    } as never)
  ).docs as unknown as Json[];
const one = (req: PayloadRequest, collection: string, id: string) =>
  req.payload
    .findByID({ collection: collection as never, id, depth: 0 } as never)
    .catch(() => null) as Promise<Json | null>;
const global = (req: PayloadRequest, slug: string) =>
  req.payload.findGlobal({ slug: slug as never, depth: 0 } as never).catch(() => ({})) as Promise<Json>;

/** What every approval read in one request shares: the people, the approval rules, the pricing policy. */
function shared(req: PayloadRequest) {
  const ctx = (req.context ??= {}) as {
    approvalRefs?: Promise<{ users: Map<string, Json>; rules: Json[]; minMargin: number }>;
  };
  ctx.approvalRefs ??= (async () => {
    const [users, rules, policy] = await Promise.all([
      all(req, "users"),
      global(req, "approval-rules"),
      global(req, "pricing-policy"),
    ]);
    return {
      users: new Map(users.map((u) => [scalar(u.id), u])),
      rules: (rules.rules as Json[] | undefined) ?? [],
      minMargin: num(policy.minMarginPct, 15),
    };
  })();
  return ctx.approvalRefs;
}

/** The quotation a request decides on: its subject, or (older data) the newest awaiting approval on its case. */
async function quotationOf(req: PayloadRequest, a: Json): Promise<Json | null> {
  if (!/quotation|discount/i.test(scalar(a.type))) return null;
  const subject = idOf((a.subject as { value?: unknown } | undefined)?.value);
  const caseId = idOf(a.case);
  const quotes = caseId ? await all(req, "quotations", { case: { equals: caseId } }) : [];
  return (
    quotes.find((x) => x.id === subject) ??
    quotes.filter((x) => x.status === "Awaiting approval").sort((x, y) => num(y.version) - num(x.version))[0] ??
    null
  );
}

/** The supplier PO a payment request pays: the one its title or note names, else the case's first. */
async function purchaseOrderOf(req: PayloadRequest, a: Json): Promise<Json | null> {
  if (!/deposit|payment/i.test(scalar(a.type))) return null;
  const caseId = idOf(a.case);
  const pos = await all(req, "purchase-orders", caseId ? { case: { equals: caseId } } : undefined);
  const text = `${scalar(a.title)} ${scalar(a.detail)}`;
  return pos.find((p) => scalar(p.number) && text.includes(scalar(p.number))) ?? (caseId ? (pos[0] ?? null) : null);
}

/** What a request means for the person reading it, and the evidence behind it. */
export interface ApprovalView {
  canDecide: boolean;
  progress: string;
  whoDecides: string;
  why: string;
  afterYou: string;
  evidence: string;
  quotation: string | null;
  payment: {
    /** The supplier PO's id (its link) and number. */
    po: string;
    purchaseOrder: string;
    supplier: string;
    currency: string;
    amount: number;
    amountText: string;
    kind: string;
    recorded: boolean;
    open: boolean;
    reference: string;
  } | null;
}

/**
 * An approval request as the signed-in person reads it: whether they may decide it (a listed
 * approver who hasn't decided, on an open request), how far it has got, who decides and, when
 * they can't, why; and the evidence from the records behind it (the quotation and its margin, the
 * proposed rate, the PO and pro forma). Worked out once per request and document.
 */
export async function approvalView(a: Json, req: PayloadRequest): Promise<ApprovalView> {
  const me = req.user as { id?: string; role?: string } | null | undefined;
  const ctx = (req.context ??= {}) as { approvalViews?: Map<string, Promise<ApprovalView>> };
  const key = [a.id, a.updatedAt, a.status, ((a.decisions as unknown[]) ?? []).length, me?.id].join("|");
  ctx.approvalViews ??= new Map();
  let view = ctx.approvalViews.get(key);
  if (!view) {
    view = compute(a, req, me);
    ctx.approvalViews.set(key, view);
  }
  return view;
}

async function compute(
  a: Json,
  req: PayloadRequest,
  me: { id?: string; role?: string } | null | undefined,
): Promise<ApprovalView> {
  const { users, rules, minMargin } = await shared(req);
  const name = (id: unknown) => scalar(users.get(idOf(id) ?? "")?.name) || scalar(idOf(id));
  const decisions = (a.decisions as { user?: unknown; decision?: string; at?: string; reason?: string }[]) ?? [];
  const listed = ((a.approvers as unknown[] | undefined) ?? []).map((x) => idOf(x) ?? "");
  const ids = listed.length
    ? listed
    : [...users.values()].filter((u) => u.role === "management").map((u) => scalar(u.id));
  const approvers = ids.map((id) => {
    const d = decisions.find((x) => idOf(x.user) === id);
    return { id, name: name(id), decision: d?.decision, at: d?.at };
  });
  const type = scalar(a.type);
  const status = scalar(a.status) || "Pending";
  const done = FINAL_APPROVAL.includes(status);
  const needed = a.twoPerson ? 2 : 1;
  const mine = approvers.find((x) => x.id === me?.id);
  const waiting = approvers.filter((x) => !x.decision);
  const decidedBy = approvers.filter((x) => x.decision);
  const waitingText = waiting.map((x) => (x.id === me?.id ? "you" : x.name)).join(" or ");
  const progress = done
    ? `${status} by ${decidedBy.map((x) => x.name).join(" + ") || "—"}`
    : decidedBy.length
      ? `${decidedBy.map((x) => `${x.name} ${x.decision === "Approve" ? "approved" : "returned"}`).join(" · ")} · waiting for ${waitingText}`
      : `Waiting for ${waitingText}${needed > 1 ? ` (${needed} people)` : ""}`;
  const note = scalar(rules.find((r) => r.type === type)?.note);
  const canDecide = !done && Boolean(mine) && !mine?.decision;
  const why = canDecide
    ? ""
    : done
      ? `Decided — ${progress}.`
      : mine?.decision
        ? `You ${mine.decision === "Approve" ? "approved" : "returned"} this on ${shortDay(mine.at)} · waiting for ${waiting.map((x) => x.name).join(" or ")}.`
        : `Only ${approvers.map((x) => x.name).join(" and ")} can decide ${type.toLowerCase()} approvals${
            note ? ` (${note.toLowerCase()})` : ""
          }; you are signed in as ${ROLE_LABEL[scalar(me?.role)] ?? scalar(me?.role)}.`;
  const approved = decisions.filter((d) => d.decision === "Approve").length;
  const others = approvers.filter((p) => !p.decision && p.id !== me?.id);
  const afterYou =
    a.twoPerson && needed - approved > 1
      ? `\nTwo-person rule: after you, ${others.map((p) => p.name).join(" or ")} must also approve.`
      : "";

  // The evidence, from the records behind the request.
  const evidence: [string, string][] = [];
  const sales = me?.role === "sales";
  const q = await quotationOf(req, a);
  if (q) {
    const internal = (q.internal as Json | undefined) ?? {};
    evidence.push(["Quotation", `${scalar(q.number)} · ${scalar(q.status)}`]);
    evidence.push(["Total (excl. VAT)", amount(q.currency, num(q.totalExVat))]);
    evidence.push([
      "Lines",
      `${((q.lines as unknown[]) ?? []).length} priced · valid until ${shortDay(q.validUntil) || "—"}`,
    ]);
    if (sales) evidence.push(["Margin", "Hidden for your role"]);
    else if (typeof internal.marginPct === "number")
      evidence.push([
        "Margin",
        `${internal.marginPct}% (policy minimum ${minMargin}%) · profit ${egp(num(internal.grossProfitEGP))}`,
      ]);
    if (internal.exceptions && !sales) evidence.push(["Exceptions", scalar(internal.exceptions)]);
  } else if (type === "Exchange rate") {
    const rates = ((await global(req, "fx-rates")).rates as Json[] | undefined) ?? [];
    const proposed = rates.find((r) => r.status === "Awaiting approval");
    const active = rates.find((r) => r.status === "Active" && r.currency === (proposed?.currency ?? "USD"));
    if (proposed && active) {
      const change = ((num(proposed.egpPerUnit) - num(active.egpPerUnit)) / num(active.egpPerUnit, 1)) * 100;
      evidence.push([
        "Current",
        `${scalar(active.currency)}/EGP ${num(active.egpPerUnit).toFixed(2)} since ${shortDay(active.date)}`,
      ]);
      evidence.push([
        "Proposed",
        `${scalar(proposed.currency)}/EGP ${num(proposed.egpPerUnit).toFixed(2)} (${change >= 0 ? "+" : ""}${change.toFixed(2)}%) · ${scalar(proposed.source)}`,
      ]);
    }
    const open = (await all(req, "quotations")).filter((x) =>
      ["Draft", "Awaiting approval", "Approved", "Submitted"].includes(scalar(x.status)),
    );
    evidence.push(["Open quotations re-checked", `${open.length} (prices in USD stay as approved; EGP costs move)`]);
  } else if (type === "Bank detail change") {
    evidence.push(["Supplier", "Port Said Welding Co. (S3) · approved supplier since 2019"]);
    evidence.push(["Request", "New beneficiary account received by email, 16 Nov 14:02"]);
    evidence.push(["Call-back", decisions[0]?.reason ?? "Call the number on file before approving"]);
    evidence.push(["Rule", "Two people: finance + CEO. Payments to S3 on hold until both approve."]);
  } else if (/alternative/i.test(type)) {
    evidence.push(["Requested", "Lincoln Omnia 46 electrodes, 3.2 mm (customer's spec)"]);
    evidence.push(["Proposed", "ESAB OK 46.00, 3.2 mm — same AWS E6013 class, mill certificate attached"]);
    evidence.push(["Customer", "Asked for v2 with the ESAB alternative (email 12 Nov)"]);
  }

  // A supplier payment: the PO it pays, how much, and whether finance has recorded it.
  let payment: ApprovalView["payment"] = null;
  const po = await purchaseOrderOf(req, a);
  if (po) {
    const side = (po.supplierSide as Json | undefined) ?? {};
    const lineTotal = ((po.lines as { qty?: number; unitPrice?: number }[]) ?? []).reduce(
      (s, l) => s + num(l.qty) * num(l.unitPrice),
      0,
    );
    evidence.push([
      "Purchase order",
      `${scalar(po.number)} · ${amount(po.currency, lineTotal)} · ${scalar(po.status)}`,
    ]);
    evidence.push(["Pro forma", `${scalar(side.proforma) || "attached"} · deposit ${num(side.depositPct, 50)}%`]);
    const payments = await all(req, "payments");
    const recorded = payments.some((p) => idOf(p.approval) === a.id);
    const paidOut = payments
      .filter((p) => p.direction === "out" && idOf(p.purchaseOrder) === po.id)
      .reduce((s, p) => s + num(p.amount), 0);
    const deposit = /deposit/i.test(type);
    const due =
      Math.round((deposit ? (num(po.total) * num(side.depositPct || 100)) / 100 : num(po.total) - paidOut) * 100) / 100;
    const supplier = await one(req, "suppliers", scalar(idOf(po.supplier)));
    payment = {
      po: scalar(po.id),
      purchaseOrder: scalar(po.number),
      supplier: scalar(supplier?.name),
      currency: scalar(po.currency),
      amount: due,
      amountText: amount(po.currency, due),
      kind: deposit ? "Deposit / advance" : "Balance",
      recorded,
      open: status !== "Rejected" && !(status === "Approved" && recorded),
      // A sample bank reference, fixed per request.
      reference: `TRX-88${scalar(a.id).slice(-3)}`,
    };
  }
  if (/deposit|payment/i.test(type)) evidence.push(["Bank details", "Unchanged since 2025 — no call-back needed"]);
  if (a.detail) evidence.push(["Note from requester", scalar(a.detail)]);

  return {
    canDecide,
    progress,
    whoDecides: `${approvers.map((x) => x.name).join(a.twoPerson ? " + " : " or ")} decide${approvers.length === 1 ? "s" : ""}${note ? ` · ${note}` : ""}`,
    why,
    afterYou,
    evidence: evidence.map(([label, value]) => `${label}: ${value}`).join("\n"),
    quotation: q ? scalar(q.id) : null,
    payment,
  };
}

/** A virtual field of the request read from its view (`approvalView`). */
const view =
  <K extends keyof ApprovalView>(key: K) =>
  async (a: Json, req: PayloadRequest) =>
    (await approvalView(a, req))[key];

const RECORDED = "Recorded under your name with the time, on the request and the case timeline.";
const decide = (decision: "Approve" | "Reject") => ({
  path: "/commercial/approvals/$row.id/decide",
  body: { decision },
});

/**
 * Everything that needs an authorised person: quotations, discounts, margin exceptions, supplier POs,
 * deposits & payments, bank-detail changes, FX rates, alternatives, pricelists. Status is computed
 * from the decisions — a two-person rule needs two different approvers.
 */
export const Approvals: CollectionConfig = {
  slug: "approvals",
  custom: {
    // Deciding is for a listed approver who hasn't decided yet (`canDecide`, worked out for whoever
    // reads it); the endpoint records it through the hooks below (one decision each, the
    // two-person rule) and answers with how to take it back. Wherever approvals show.
    actions: [
      // Where the evidence comes from: the case, the quotation and its pricing (never for Sales),
      // the rates, the supplier whose bank details change, the PO a payment pays.
      {
        label: "Open $row.case.caseId",
        href: link.doc("cases", "$row.case", "overview"),
        when: { case: { exists: true } },
      },
      {
        label: "Preview quotation",
        href: link.doc("quotations", "$row.quotation", "preview"),
        when: { quotation: { exists: true } },
      },
      {
        label: "Pricing",
        roles: COST_ROLES,
        href: link.doc("cases", "$row.case", "pricing"),
        when: { quotation: { exists: true }, case: { exists: true } },
      },
      { label: "Exchange rates", href: link.global("fx-rates"), when: { type: { equals: "Exchange rate" } } },
      { label: "Supplier record", href: link.doc("suppliers", "S3"), when: { type: { equals: "Bank detail change" } } },
      {
        label: "PO $row.payment.purchaseOrder",
        href: link.doc("purchase-orders", "$row.payment.po"),
        when: { "payment.po": { exists: true } },
      },
      // Finance records a supplier payment made in the bank, once approved (outward: it asks first).
      {
        label: "Record payment",
        roles: FINANCE_ROLES,
        when: { status: { equals: "Approved" }, "payment.recorded": { equals: false } },
        call: { path: "/cash/record-payment", body: { approval: "$row.id" } },
        confirm: {
          heading: "Record supplier payment — $row.payment.purchaseOrder",
          text: "$row.payment.amountText to $row.payment.supplier ($row.payment.kind) — approved. Pay it in the bank first, then record the bank reference here.",
          label: "Record payment",
        },
        fields: [
          {
            type: "text",
            name: "reference",
            label: "Bank reference",
            required: true,
            defaultValue: "$row.payment.reference",
          },
        ],
        done: "Payment $row.payment.amountText to $row.payment.supplier recorded against $row.payment.purchaseOrder.",
      },
      // Returning needs a reason; approving happens at once (Undo withdraws it), except under a
      // two-person rule, where the first approver may leave a note for the second.
      {
        label: "Return",
        tone: "error",
        when: { canDecide: { equals: true } },
        call: decide("Reject"),
        confirm: { heading: "Return with a reason", text: `$row.title\n${RECORDED}`, label: "Return", tone: "error" },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: "Reason (required)",
            required: true,
            admin: { placeholder: "e.g. Margin too thin — ask the customer to accept v1 prices" },
          },
        ],
        reply: true,
      },
      {
        label: "Approve",
        main: true,
        when: { canDecide: { equals: true }, twoPerson: { not_equals: true } },
        call: decide("Approve"),
        reply: true,
      },
      {
        label: "Approve",
        main: true,
        when: { canDecide: { equals: true }, twoPerson: { equals: true } },
        call: decide("Approve"),
        confirm: { heading: "Approve request", text: `$row.title$row.afterYou\n${RECORDED}`, label: "Approve" },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: "Note for the other approver (optional)",
            admin: { placeholder: "e.g. Call-back done on the number on file" },
          },
        ],
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "status", "requestedBy", "createdAt"],
    group: "Commercial",
  },
  defaultSort: "-createdAt",
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "management",
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const decisions = (data.decisions as { user?: unknown; decision?: string; at?: string }[] | undefined) ?? [];
        const before = (originalDoc?.decisions as unknown[] | undefined)?.length ?? 0;
        const approvers = ((data.approvers as unknown[] | undefined) ?? []).map(idOf);
        // New decisions must come from a listed approver, once each, recorded as themselves.
        decisions.slice(before).forEach((d) => {
          const uid = idOf(d.user) ?? idOf(req.user);
          if (!req.context?.seed && uid !== idOf(req.user)) throw ruleError("You can only record your own decision.");
          if (approvers.length && !approvers.includes(uid))
            throw ruleError("You are not an approver for this request.");
          d.user = uid;
          d.at ??= new Date().toISOString();
        });
        const users = decisions.map((d) => idOf(d.user));
        if (new Set(users).size !== users.length) throw ruleError("Each approver decides once.");
        const approved = decisions.filter((d) => d.decision === "Approve").length;
        const needed = data.twoPerson ? 2 : 1;
        data.status = decisions.some((d) => d.decision === "Reject")
          ? "Rejected"
          : approved >= needed
            ? "Approved"
            : approved > 0
              ? `Approved 1 of ${needed}`
              : "Pending";
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, { case: idOf(doc.case), text: `Approval “${doc.title}”: ${doc.status}.` });
        return doc;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          custom: tones(Object.fromEntries(APPROVAL_TYPES.map((t) => [t, "primary" as const]))),
          options: APPROVAL_TYPES,
        },
        caseRef(false),
      ],
    },
    { name: "detail", type: "textarea" },
    {
      name: "subject",
      type: "relationship",
      relationTo: ["quotations", "purchase-orders", "payments", "suppliers", "pricelists"],
      label: "Record to approve",
    },
    {
      type: "row",
      fields: [
        {
          name: "requestedBy",
          type: "relationship",
          relationTo: "users",
          defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
        },
        { name: "approvers", type: "relationship", relationTo: "users", hasMany: true },
        { name: "twoPerson", type: "checkbox", label: "Two-person rule", defaultValue: false },
      ],
    },
    {
      name: "decisions",
      type: "array",
      labels: { singular: "Decision", plural: "Decisions" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "user", type: "relationship", relationTo: "users" },
            { name: "decision", type: "select", options: ["Approve", "Reject"], required: true },
            { name: "at", type: "date" },
          ],
        },
        { name: "reason", type: "textarea" },
      ],
    },
    {
      name: "status",
      type: "select",
      options: APPROVAL_STATUSES,
      defaultValue: "Pending",
      custom: tones({ Pending: "warning", "Approved 1 of 2": "info", Approved: "success", Rejected: "error" }),
      admin: { position: "sidebar", readOnly: true, description: "Computed from the decisions." },
    },
    // What the request means for whoever reads it, worked out on every read (never stored).
    computed(
      { name: "canDecide", type: "checkbox", label: "You can decide", admin: { position: "sidebar" } },
      view("canDecide"),
    ),
    computed({ name: "progress", type: "text", admin: { position: "sidebar" } }, view("progress")),
    computed(
      { name: "whoDecides", type: "text", label: "Who decides", admin: { position: "sidebar" } },
      view("whoDecides"),
    ),
    computed({ name: "why", type: "text", label: "Why you can't decide", admin: { position: "sidebar" } }, view("why")),
    computed({ name: "afterYou", type: "text", admin: { hidden: true } }, view("afterYou")),
    // The two-person rule as a tag on the request.
    computed(
      {
        name: "rule",
        type: "text",
        admin: { hidden: true },
        custom: { toneWhen: [{ when: { twoPerson: { equals: true } }, tone: "warning" }] },
      },
      (a) => (a.twoPerson ? "Two-person rule" : ""),
    ),
    computed({ name: "evidence", type: "textarea", label: "Evidence" }, view("evidence")),
    // The quotation it decides on (its preview and pricing are linked from the request).
    computed(
      { name: "quotation", type: "relationship", relationTo: "quotations", admin: { position: "sidebar" } },
      view("quotation"),
    ),
    computed(
      {
        name: "payment",
        type: "group",
        label: "Supplier payment",
        admin: { condition: (data) => Boolean(data?.payment) },
        fields: [
          {
            type: "row",
            fields: [
              { name: "purchaseOrder", type: "text", label: "PO" },
              { name: "supplier", type: "text" },
              { name: "currency", type: "text" },
              { name: "amount", type: "number", custom: formats.money("currency") },
            ],
          },
          {
            type: "row",
            fields: [
              { name: "kind", type: "text" },
              { name: "recorded", type: "checkbox", label: "Payment recorded" },
              { name: "open", type: "checkbox", label: "Still to pay" },
            ],
          },
          { name: "po", type: "text", admin: { hidden: true } },
          { name: "amountText", type: "text", admin: { hidden: true } },
          { name: "reference", type: "text", admin: { hidden: true } },
        ],
      },
      view("payment"),
    ),
  ],
};

/** The customer's purchase order, checked line by line against the approved quotation version. */
export const CustomerPOs: CollectionConfig = {
  slug: "customer-pos",
  labels: { singular: "Customer PO", plural: "Customer POs" },
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "quotation", "status", "receivedAt"],
    group: "Commercial",
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      // Blocked while any mismatch lacks a recorded resolution.
      ({ data }) => {
        const checks = (data.checks as { matches?: boolean; resolution?: string }[] | undefined) ?? [];
        const open = checks.filter((c) => !c.matches && !c.resolution).length;
        if (data.status !== "Cancelled") data.status = open ? "Blocked — mismatch" : "Validated";
        data.openMismatches = open;
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "number", type: "text", required: true, unique: true },
        caseRef(),
        { name: "quotation", type: "relationship", relationTo: "quotations", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "receivedAt", type: "date" },
        { name: "billingEntity", type: "text" },
        { name: "file", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "checks",
      type: "array",
      labels: { singular: "Check", plural: "PO vs quotation" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 0, admin: { description: "0 = header" } },
            {
              name: "field",
              type: "select",
              required: true,
              options: [
                "Price",
                "Quantity",
                "Pack size",
                "Specification",
                "Currency",
                "Taxes",
                "Delivery terms",
                "Billing entity",
                "Payment terms",
                "Quote validity",
              ],
            },
            { name: "matches", type: "checkbox", defaultValue: false },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "po", type: "text", label: "On the PO" },
            { name: "quote", type: "text", label: "On the quotation" },
          ],
        },
        {
          name: "resolution",
          type: "text",
          admin: { description: "Written customer agreement or approved exception." },
        },
        evidence("evidence", "Customer's written confirmation"),
      ],
    },
    {
      name: "unawarded",
      type: "array",
      labels: { singular: "Unawarded line", plural: "Unawarded lines" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1, required: true },
            { name: "outcome", type: "select", options: ["Open — revision to follow", "Closed"], required: true },
            { name: "reason", type: "text" },
          ],
        },
      ],
    },
    { name: "status", type: "text", admin: { position: "sidebar", readOnly: true } },
    { name: "openMismatches", type: "number", admin: { position: "sidebar", readOnly: true } },
  ],
};
