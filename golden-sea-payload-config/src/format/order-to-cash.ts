import type { Action, Entry, KindData, Row, Stat } from "saastemlycrm-design-system/contracts";
import { caseDeliveryPath, etaAction } from "../actions/case-delivery.ts";
import { caseOrderPath, readPo } from "../actions/case-order.ts";
import type { Check } from "../endpoints/operations.ts";
import type { CaseOps, OpsDelivery, OpsPO } from "../endpoints/order-to-cash.ts";
import { dayTime, person, statusTone } from "./index.ts";

/**
 * A case's order to cash, read for the case tabs that show it ("Order & purchasing", "Delivery &
 * billing"): what spans the case's records or is a multi-step workflow — the order at a glance,
 * the customer's PO check (against the quotation, with amendments and partial awards), the supplier
 * POs' re-check and confirmation, the delivery plan, its pre-dispatch checks, the drops with their
 * proof of delivery. The supplier POs, bills, receipts, backorders and invoices themselves (and the
 * invoiced balance) are their collections' records (their fields and actions, no formatter).
 * Pure: data in (GET /api/operations/case/:id, typed in ../endpoints/order-to-cash.ts), what a kind
 * draws out.
 */

/* ------------------------------------------------------------------------------------- shared */

/** A case line as the tables name it: "L3 · Hydraulic oil". */
export const lineLabel = (l: { lineNo: number; description: string }) => `L${l.lineNo} · ${l.description}`;

const plural = (n: number, one: string, many = `${one}es`) => (n === 1 ? one : many);

/* ------------------------------------------------------------------------- the order at a glance */

/**
 * The order at a glance: the customer's PO check, supplier POs confirmed, units received, and
 * (for those who see costs) supplier bills with any on hold.
 */
export const orderFigures = (d: CaseOps): Stat[] => {
  const po = d.customerPo;
  const confirmed = d.purchaseOrders.filter((p) => !["Draft", "Awaiting approval", "Cancelled"].includes(p.status));
  const ordered = d.receipts.reduce((s, r) => s + r.ordered, 0);
  const received = d.receipts.reduce((s, r) => s + r.received, 0);
  const held = d.bills.filter((b) => b.status === "On hold").length;
  return [
    {
      label: "Customer PO",
      value: po ? po.status : d.orderConfirmed ? "Validated" : "Not received",
      note: po
        ? `${po.number} vs ${po.quotation}`
        : d.orderConfirmed
          ? "Sales order confirmed"
          : "Waiting for the customer's order",
      tone: po ? (po.status === "Validated" ? "success" : "error") : d.orderConfirmed ? "success" : undefined,
    },
    {
      label: "Supplier POs confirmed",
      value: `${confirmed.length} of ${d.purchaseOrders.length}`,
      note: d.purchaseOrders.length ? "Re-checked before confirming" : "Prepared when the sales order is confirmed",
    },
    {
      label: "Received",
      value: ordered ? `${received} of ${ordered}` : "—",
      note: ordered && received < ordered ? `${ordered - received} on backorder` : "Units across all receipts",
      tone: ordered && received < ordered ? "warning" : undefined,
    },
    ...(d.canSeeCosts
      ? [
          {
            label: "Supplier bills",
            value: `${d.bills.length}`,
            note: held ? `${held} on hold — 3-way match` : "Matched to PO and receipt",
            tone: held ? ("error" as const) : undefined,
          },
        ]
      : []),
  ];
};

/* -------------------------------------------------------------------------- the customer's PO */

/** Quoted lines missing from the customer's PO. */
export const unorderedLines = (d: CaseOps) => {
  const po = d.customerPo;
  if (!po) return [];
  const onPo = new Set(po.checks.filter((c) => c.lineNo > 0).map((c) => c.lineNo));
  return d.lines.filter((l) => !onPo.has(l.lineNo));
};

/**
 * Quoted lines the customer didn't order, each kept open for a revision or closed with a reason:
 * a partly awarded case never shows as complete.
 */
export const partialAward = (d: CaseOps): KindData<"list"> => {
  const po = d.customerPo!;
  const award = (lineNo: number, outcome: string, reason?: string) => ({
    path: "/operations/po-award",
    body: { po: po.id, lineNo, outcome, ...(reason ? { reason } : {}) },
  });
  return {
    note: "Quoted lines the customer didn't order: they stay open for a revision or close with a reason — a partly awarded case never shows as complete.",
    items: unorderedLines(d).map((l) => {
      const u = po.unawarded.find((x) => x.lineNo === l.lineNo);
      const actions: Action[] =
        u?.outcome === "Closed"
          ? []
          : [
              ...(u
                ? []
                : [
                    {
                      label: "Keep open",
                      call: award(l.lineNo, "Open — revision to follow", "Revision to follow"),
                      done: `Line ${l.lineNo}: kept open for a revision.`,
                    },
                  ]),
              {
                label: "Close with reason",
                call: award(l.lineNo, "Closed"),
                prompt: `Close line ${l.lineNo} (not awarded)`,
                fields: [
                  {
                    type: "textarea",
                    name: "reason",
                    label: "Reason (kept on the case)",
                    required: true,
                    admin: {
                      placeholder: "e.g. Vessel bought it locally",
                      description: `L${l.lineNo} · ${l.description}. Common: Vessel bought it locally · Customer cancelled the item · Price not accepted`,
                    },
                  },
                ],
                done: `Line ${l.lineNo}: closed with reason.`,
              },
            ];
      return {
        headline: lineLabel(l),
        supporting: u ? `${u.outcome}${u.reason ? ` — ${u.reason}` : ""}` : "Not on the customer's PO — decide",
        tags: [
          u
            ? u.outcome === "Closed"
              ? { label: "Closed", tone: "neutral" as const }
              : { label: "Open — revision to follow", tone: "warning" as const }
            : { label: "Undecided", tone: "error" as const },
        ],
        actions,
      };
    }),
  };
};

/**
 * The order was validated, or the customer's PO is expected, but there is no PO on the case:
 * `customerPoPending` says so where `customerPoCheck` would be.
 */
export const customerPoAwaited = (d: CaseOps) => !d.customerPo && (d.orderConfirmed || d.poExpected);

/**
 * The customer's PO checked line by line against the approved quotation version: commitment stays
 * blocked until every mismatch has the customer's written agreement. Before a PO arrives it says
 * so (the PO that has just arrived, or a confirmed order, is `customerPoPending`).
 */
export const customerPoCheck = (d: CaseOps): KindData<"table"> => {
  const po = d.customerPo;
  if (!po)
    return {
      columns: [],
      rows: [],
      empty: "No customer PO yet. When it arrives it is checked here against the approved quotation version.",
    };
  const blocked = po.status !== "Validated";
  const rows: Row[] = po.checks.map((c) => ({
    line: { text: c.lineNo ? `L${c.lineNo}` : "Header", strong: true },
    field: c.field,
    po: c.po,
    quote: c.quote,
    result: c.matches
      ? { text: "Match", tone: "success", tag: true }
      : c.resolution
        ? { text: "Amendment recorded", tone: "success", tag: true }
        : { text: "Mismatch", tone: "error", tag: true },
    note: c.resolution ? `${c.resolution}${c.evidence ? " · evidence attached" : ""}` : "",
  }));
  return {
    head: {
      subhead: `${po.number} · received ${dayTime(po.receivedAt)} · matched to ${po.quotation} · billing entity ${po.billingEntity ?? "—"}`,
      tags: [{ label: po.status, tone: statusTone(po.status) }, { label: "AI check · 96%" }],
      actions: [{ ...readPo, label: "Re-run PO check" }],
    },
    columns: [
      { key: "line", label: "Line" },
      { key: "field", label: "Checked" },
      { key: "po", label: "Customer PO" },
      { key: "quote", label: `Quotation ${po.quotation}` },
      { key: "result", label: "Result", supporting: "note" },
    ],
    rows,
    alerts: [
      blocked
        ? {
            tone: "error",
            text: `Commitment blocked: ${po.openMismatches} ${plural(po.openMismatches, "mismatch")} need the customer's written agreement (or an approved exception) before the sales order and supplier POs.`,
          }
        : {
            tone: "success",
            text: d.orderConfirmed
              ? "PO validated — sales order confirmed. Supplier POs follow below."
              : "PO validated — every mismatch has written customer agreement.",
          },
    ],
    actions: d.orderConfirmed
      ? []
      : [
          {
            label: "Confirm sales order & prepare supplier POs",
            main: true,
            disabled: blocked,
            call: { path: `${caseOrderPath}/confirm-order` },
            reply: true,
          },
        ],
  };
};

/**
 * The customer PO check before there is a PO on the case: the order was already validated and
 * confirmed, or the customer's PO has just arrived by email and waits to be read (`customerPoCheck`
 * shows the check itself, in the same place).
 */
export const customerPoPending = (d: CaseOps): KindData<"alert"> =>
  d.orderConfirmed
    ? {
        tone: "success",
        text: "The customer's PO was checked against the approved quotation and validated — the sales order is confirmed.",
      }
    : {
        tone: "info",
        heading: "Nordvik's purchase order has just arrived by email.",
        text: "The AI reads it and checks every line and commercial term against the quotation version it refers to. Nothing is committed until a person resolves each mismatch.",
        actions: [readPo],
      };

/** An open mismatch on the customer's PO, with its place in the PO's checks. */
export type OpenMismatch = { c: Check; i: number };

/** The customer's PO's open mismatches: no match and no recorded agreement yet. */
export const openMismatches = (d: CaseOps): OpenMismatch[] =>
  (d.customerPo?.checks ?? []).flatMap((c, i) => (c.matches || c.resolution ? [] : [{ c, i }]));

/**
 * An open mismatch on the customer's PO: the customer's written agreement (an AI draft from their
 * email, checked by a person) and its evidence, recorded to lift the block.
 */
export const customerAmendment = ({ c, i }: OpenMismatch, d: CaseOps): KindData<"attach"> => {
  const po = d.customerPo!;
  return {
    action: { label: "Record amendment" },
    text: `${c.lineNo ? `L${c.lineNo}` : "Header"} · ${c.field}`,
    heading: `Record customer amendment — line ${c.lineNo || "header"}`,
    intro: `${c.field} — PO: ${c.po} · Quotation: ${c.quote}`,
    fields: [
      {
        type: "textarea",
        name: "resolution",
        label: "Customer's written agreement",
        required: true,
        defaultValue: c.suggestion ?? "",
        admin: {
          description: c.suggestion
            ? "AI draft from the customer's email — check it before recording"
            : "Who agreed, when and what",
        },
      },
    ],
    file: {
      name: "evidence",
      legend: "Evidence (email or signed amendment)",
      hint: "Optional in the demo — a copy of the customer's email is attached if you skip this",
      upload: {
        collection: "media",
        data: { alt: `${po.number} amendment, line ${c.lineNo}`, kind: "Customer PO" },
      },
      sample: {
        filename: `${po.number}-amendment-L${c.lineNo}.pdf`,
        lines: ["From: purchasing (customer)", `Re: ${po.number} line ${c.lineNo}`, "{resolution}"],
      },
    },
    call: { path: "/operations/po-amend", body: { po: po.id, index: i } },
    confirmLabel: "Record amendment & lift block",
    done: `Amendment recorded on line ${c.lineNo} — evidence attached.`,
  };
};

/**
 * A second look at the customer's PO with the on-device AI: prices, items and quantities, and
 * commercial terms against the quotation it refers to. It only advises; a person decides.
 */
export const customerPoAiCheck = (d: CaseOps): KindData<"custom"> => {
  const po = d.customerPo!;
  return {
    element: "ui-ai-check",
    key: `po-${po.number}`,
    props: {
      label: "Second look with AI",
      text: po.checks
        .map(
          (c) =>
            `${c.lineNo > 0 ? `Line ${c.lineNo}` : "Terms"} · ${c.field}: PO says "${c.po}", quotation ${po.quotation} says "${c.quote}"`,
        )
        .join("\n"),
      questions: [
        {
          id: "prices",
          prompt: "Are the prices on the customer's PO the same as on the quotation?",
          yes: "Prices match the quotation",
          no: "A price differs from the quotation",
        },
        {
          id: "items",
          prompt: "Are the items and quantities on the PO the same as on the quotation?",
          yes: "Items and quantities match",
          no: "An item or quantity differs",
        },
        {
          id: "terms",
          prompt: "Do the PO's commercial terms (payment, delivery, validity) match the quotation?",
          yes: "Terms match",
          no: "A term differs",
        },
      ],
    },
  };
};

/* ---------------------------------------------------------------------- supplier purchase orders */

/** How supplier POs are made and confirmed, over their table or over why there are none yet. */
const purchaseOrdersNote = (d: CaseOps) =>
  `Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and lead time are re-checked before a PO is confirmed; Karim Balbaa approves. Deposits go through payment approval.${d.canSeeCosts ? "" : " Supplier costs are hidden for Sales."}`;

/**
 * The supplier POs before there is one: what has to happen first (the customer's PO validated,
 * then the sales order confirmed). The case's tab lists them (the purchase orders' own fields)
 * once they exist.
 */
export const noPurchaseOrders = (d: CaseOps): KindData<"alert"> => ({
  head: { count: 0 },
  note: purchaseOrdersNote(d),
  tone: d.customerPo?.status === "Validated" ? "info" : "warning",
  text:
    d.customerPo?.status === "Validated"
      ? "Confirm the sales order to prepare the supplier POs."
      : "Blocked: no supplier PO is prepared until the customer's PO is validated.",
});

/**
 * The supplier POs still to confirm, re-checked with the supplier (`rechecked`) or not yet.
 * Supplier costs are hidden for Sales, so none for them.
 */
export const purchaseOrdersToConfirm =
  (rechecked: boolean) =>
  (d: CaseOps): OpsPO[] =>
    d.canSeeCosts
      ? d.purchaseOrders.filter(
          (p) => ["Draft", "Awaiting approval"].includes(p.status) && Boolean(p.recheckDone) === rechecked,
        )
      : [];

/** A supplier PO's re-check tile's title, the same before and after the re-check. */
export const recheckTitle = (p: OpsPO) => `Re-check before confirming ${p.number}`;

/**
 * A supplier PO not re-checked yet: the button that re-checks price, availability, FX and lead
 * time with the supplier (the result is `recheckResult`).
 */
export const recheckRequest = (p: OpsPO): KindData<"list"> => ({
  head: { tags: [{ label: p.status, tone: statusTone(p.status) }] },
  items: [
    {
      headline: `${p.number} · ${p.supplierName}`,
      supporting: p.status,
      dot: statusTone(p.status),
      actions: [
        {
          label: "Re-check & confirm",
          call: { path: "/operations/po-recheck", body: { po: p.id } },
          done: `Re-checked price, availability, FX and lead time with ${p.supplierName}.`,
        },
      ],
    },
  ],
});

/**
 * A re-checked supplier PO still to confirm: what changed since the quotation (a shortfall becomes
 * a backorder) and the decision, Karim Balbaa's (management) or a request to him.
 */
export const recheckResult = (p: OpsPO, d: CaseOps): KindData<"table"> => {
  const changed = p.recheck.filter((r) => r.ok === false);
  const decide: Action = d.isManagement
    ? {
        label: `Approve & confirm ${p.number}`,
        main: true,
        call: {
          method: "PATCH",
          path: `/purchase-orders/${encodeURIComponent(p.id)}`,
          body: { status: "Confirmed", recheckDone: true },
        },
        // Outward and not reversible (the supplier receives the order): it asks first, no Undo.
        confirm: {
          heading: `Confirm ${p.number}?`,
          text: `${p.number} goes to ${p.supplierName} as a confirmed order. That can't be undone here.`,
          label: "Confirm & send",
        },
        done: `${p.number} confirmed — sent to ${p.supplierName}.`,
      }
    : {
        label: "Ask Karim Balbaa to approve",
        main: true,
        call: { path: `${caseOrderPath}/ask-approval`, body: { po: p.id } },
        done: `Approval requested from Karim Balbaa for ${p.number}.`,
      };
  return {
    head: { tags: [{ label: p.status, tone: statusTone(p.status) }] },
    note: d.isManagement ? undefined : "Supplier POs are confirmed by Karim Balbaa (management).",
    columns: [
      { key: "item", label: "Item" },
      { key: "atQuotation", label: "At quotation" },
      { key: "now", label: "Now" },
      { key: "ok", label: "" },
    ],
    rows: p.recheck.map((r) => ({
      item: r.item,
      atQuotation: r.atQuotation,
      now: r.now,
      ok: r.ok === false ? { text: "Changed", tone: "warning", tag: true } : { text: "OK", tone: "success", tag: true },
    })),
    alerts: changed.length
      ? [
          {
            tone: "warning",
            text: `${changed.map((c) => `${c.item}: ${c.now}`).join(" · ")} — the shortfall is scheduled as a backorder (the customer promise stays as agreed).`,
          },
        ]
      : [],
    actions: [decide],
  };
};

/* -------------------------------------------------------------------------------------- drops */

/** A drop is delivered once its receipt is confirmed. */
const delivered = (x: OpsDelivery) => /confirmed/.test(x.status);

/** The drop the plan and its checks are about: the next open one, else the first. */
export const nextDrop = (d: CaseOps): OpsDelivery | undefined =>
  d.deliveries.find((x) => !/confirmed|Cancelled/.test(x.status)) ?? d.deliveries[0];

/**
 * Across the top: the re-plan after the agent's ETA change (escalated to the owner and
 * management), else the case's blocker, else nothing.
 */
export const replanNotice = (d: CaseOps): KindData<"alert"> | null => {
  const eta = d.alerts.find((a) => /ETA change/.test(a.text));
  if (eta)
    return {
      tone: "warning",
      heading: `Re-planned after the agent's ETA change — escalated to ${person(d.case.owner)} and Karim Balbaa`,
      text: `${dayTime(eta.at)} · ${eta.text}`,
    };
  return d.case.blocker ? { tone: "info", text: d.case.blocker } : null;
};

/**
 * The vessel delivery plan for the next open drop (else the first): port, ETA, agent, truck and
 * boarding staff, launch, goods ready, on board, clearance. The agent's ETA email re-plans it.
 */
export const deliveryPlan = (d: CaseOps): KindData<"details"> => {
  const next = nextDrop(d);
  if (!next)
    return {
      note: "No delivery planned yet — the plan is created once supplier POs are confirmed and goods are due.",
      items: [],
    };
  const eta = etaAction(d);
  const p = next.plan;
  return {
    head: {
      tags: [{ label: `Drop ${next.drop} of ${d.deliveries.length} · ${next.status}`, tone: statusTone(next.status) }],
      actions: eta ? [eta] : [],
    },
    note: "Supplier promises and the customer promise are tracked separately; an ETA change moves every open drop, booking and task, and alerts the owner.",
    items: [
      { label: "Port · place", value: `${d.case.port ?? "—"} · ${next.place}` },
      { label: "Vessel ETA", value: dayTime(d.case.eta) },
      { label: "Agent / delivery contact", value: d.case.agent || "—" },
      { label: "Truck & boarding staff", value: `${p.vehicle ?? "—"} · ${p.boardingStaff ?? "—"}` },
      { label: "Launch / boat", value: p.launch ?? "—" },
      { label: "Goods ready", value: dayTime(p.readyAt) },
      { label: "Planned on board", value: dayTime(next.plannedAt) },
      { label: "Clearance", value: p.clearance ?? "—" },
    ],
  };
};

/**
 * What must be true before the next drop leaves (goods ready, documents, ship-stores declaration,
 * transport, no open approval), one tag each: green when it is, amber when it isn't yet. The
 * tags are the content (an `actions` kind with no buttons, its `tags` slot).
 */
export const preDispatchChecks = (d: CaseOps): KindData<"actions"> => {
  const next = nextDrop(d)!;
  const p = next.plan;
  const openApprovals = d.purchaseOrders.some((x) => x.status === "Awaiting approval");
  const goodsReady = d.backorders.every((b) => !next.lines.some((l) => l.lineNo === b.lineNo) || !b.late);
  const checks: [string, boolean][] = [
    ["Goods ready & labelled per line", goodsReady],
    ["Documents: delivery note, packing list, SDS, certificates", true],
    ["Ship-stores declaration", Boolean(p.clearance)],
    ["Transport booked (truck, launch)", Boolean(p.vehicle && p.launch && !/to be confirmed/i.test(p.launch))],
    ["No open approval on the order", !openApprovals],
  ];
  return {
    head: { subhead: next.number },
    tags: checks.map(([label, ok]) => ({
      label,
      tone: ok ? ("success" as const) : ("warning" as const),
      icon: ok ? "success" : "warning",
    })),
    items: [],
  };
};

/** One drop: what goes, when and where, dispatch and receipt, and the proof that closes it. */
function dropEntry(d: CaseOps, x: OpsDelivery): Entry {
  const done = delivered(x);
  const signedBy = `Chief Officer, ${d.case.vessel || "vessel"}`;
  return {
    id: x.id,
    heading: `Drop ${x.drop} · ${x.number}`,
    meta: [dayTime(x.plannedAt), x.place],
    status: { label: x.status, tone: statusTone(x.status) },
    text: x.lines.map((l) => `L${l.lineNo} · ${l.qty} × ${l.description}${l.lot ? ` · lot ${l.lot}` : ""}`).join("\n"),
    facts: [
      {
        label: "Dispatch",
        value: x.dispatchedAt
          ? { text: `Dispatched ${dayTime(x.dispatchedAt)}`, tone: "success" }
          : { text: "Not dispatched yet", tone: "neutral" },
      },
      {
        label: "Receipt",
        value: done
          ? {
              text: `Signed by ${x.confirmedBy ?? "vessel"} · ${dayTime(x.confirmedAt)}${x.proof ? " · signed delivery note on file" : ""}`,
              tone: "success",
            }
          : { text: "Confirmed receipt pending — signed delivery note required", tone: "warning" },
      },
      ...(x.shortages ? [{ label: "Shortages", value: { text: x.shortages, tone: "warning" as const } }] : []),
      ...(x.invoice ? [{ label: "Invoiced", value: x.invoice }] : []),
    ],
    attach:
      !done && x.status !== "Cancelled"
        ? {
            action: { label: "Confirm delivery…", main: !!x.dispatchedAt },
            heading: `Confirm ${x.number} delivered`,
            intro: `${x.lines.map((l) => `L${l.lineNo} × ${l.qty}`).join(" · ")} — ${x.place}`,
            file: {
              name: "proof",
              legend: "Signed delivery note or photo (required)",
              accept: "image/*,application/pdf",
              hint: "Photo of the stamped note from the vessel, or the scanned PDF",
              required: true,
              upload: { collection: "media", data: { alt: `${x.number} signed`, kind: "Delivery note / POD" } },
              sample: {
                label: "Use the sample scan from the boarding officer",
                filename: `${x.number}-signed.pdf`,
                lines: [`Delivery note ${x.number}`, "Received on board — {signedBy}"],
              },
            },
            fields: [
              { type: "text", name: "signedBy", label: "Signed by (vessel)", required: true, defaultValue: signedBy },
              {
                type: "textarea",
                name: "shortages",
                label: "Shortages or damage noted on board",
                defaultValue: "",
                admin: { description: "Optional — becomes a claim" },
              },
            ],
            dictate: { label: "Dictate shortages or damage", field: "shortages" },
            extract: {
              label: "Read the signed note from a photo",
              what: "signed delivery note or receipt from a ship",
              fields: [
                { id: "signedBy", label: "Signed by", hint: "name and rank of the officer who signed" },
                { id: "date", label: "Date" },
                { id: "vessel", label: "Vessel" },
                {
                  id: "remarks",
                  label: "Shortages or damage noted",
                  hint: "anything written about missing or damaged items",
                },
              ],
              into: { signedBy: { field: "signedBy" }, remarks: { field: "shortages", append: true } },
            },
            missing: "No evidence, no “Delivered”: attach the signed note first.",
            call: { path: "/operations/confirm-delivery", body: { delivery: x.id } },
            confirmLabel: "Confirm delivered",
            done: `${x.number} delivered — signed delivery note on file.`,
          }
        : undefined,
    actions:
      done && !x.invoice && d.canFinance
        ? [
            {
              label: "Invoice delivered quantities",
              call: { path: `${caseDeliveryPath}/invoice`, body: { delivery: x.id } },
              reply: true,
            },
          ]
        : undefined,
  };
}

/**
 * Each drop with its proof of delivery: dispatch and confirmed receipt are separate, and a drop
 * is confirmed only with the signed delivery note or photo from the vessel. Delivered drops can
 * be invoiced (delivered quantities only).
 */
export const dropEntries = (d: CaseOps): KindData<"entries"> => ({
  head: { tags: [{ label: `${d.deliveries.filter(delivered).length} of ${d.deliveries.length} delivered` }] },
  items: d.deliveries.map((x) => dropEntry(d, x)),
});
