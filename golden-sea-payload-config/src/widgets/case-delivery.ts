import { block, type Entry, type Action, type Row } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source } from "saastemlycrm-design-system/contracts";
import {
  day,
  dayTime,
  money,
  person,
  statusTone,
  type CaseOps,
  type OpsDelivery,
  type OpsInvoice,
} from "./o2c-shared.ts";
import * as link from "../links.ts";

/**
 * Case tab "Delivery & billing" (/collections/cases/<id>/delivery): the vessel delivery plan
 * (port, ETA, agent, truck, boarding staff, launch, documents, pre-dispatch check), the agent's
 * ETA change re-planning every open drop (escalated to the owner and management), drops with
 * proof of delivery (a signed delivery note is required), backorders from late suppliers, and
 * invoicing only delivered quantities with the Egyptian e-invoice status per invoice and
 * partial payments. Data: GET /api/operations/case/:id (../endpoints/operations.ts); writes:
 * the POST endpoints there and in ../endpoints/order-to-cash.ts.
 */

const ops: Source = { endpoint: "/operations/case/$doc.id" };
/** A widget drawn from the case's order-to-cash data (one request, however many widgets use it). */
const on = from<CaseOps>(ops);

const own = "/case-delivery/$doc.id";
const delivered = (x: OpsDelivery) => /confirmed/.test(x.status);

/** The agents' ETA emails the presenter can "receive" (mirrors ETA_UPDATES in the endpoint). */
const AGENT_EMAIL: Record<string, { from: string; subject: string; body: string; eta: string }> = {
  "gs-rfq-0133": {
    from: "ops@abuqir-marine.example",
    subject: "DOS Falcon — revised return to base",
    body: "Good morning, due to weather at the rig the DOS Falcon will now return to Abu Qir base on 22 Nov at 16:00 local slot. Please re-arrange your delivery accordingly. Regards, Abu Qir Marine Services",
    eta: "2026-11-22T16:00:00.000Z",
  },
  "gs-rfq-0142": {
    from: "ops@canallink.example",
    subject: "MV Aurora Crest — ETA update",
    body: "Dear Golden Sea, MV Aurora Crest now expected Port Said anchorage 20 Nov 22:00 (was 21 Nov 08:00). Launch to be re-booked. Rgds, Canal Link Agency",
    eta: "2026-11-20T22:00:00.000Z",
  },
};

/** The re-plan notice after an ETA change, or the case's blocker. */
const alerts = on({
  skeleton: "text",
  render: (d) => {
    const eta = d.alerts.find((a) => /ETA change/.test(a.text));
    if (eta)
      return block("alert", {
        tone: "warning",
        heading: `Re-planned after the agent's ETA change — escalated to ${person(d.case.owner)} and Karim Balbaa`,
        text: `${dayTime(eta.at)} · ${eta.text}`,
      });
    return d.case.blocker ? block("alert", { tone: "info", text: d.case.blocker }) : null;
  },
});

function etaAction(d: CaseOps): Action | undefined {
  const email = AGENT_EMAIL[d.case.id];
  if (!email) return undefined;
  const open = d.deliveries.filter((x) => !/confirmed|Cancelled|Dispatched/.test(x.status));
  const moves = [
    ...(open.length
      ? open.map(
          (x) =>
            `${x.number}: on board ${dayTime(x.plannedAt)} → ${dayTime(email.eta)} · launch re-booked · truck & boarding staff re-confirmed (task for ${person(d.case.owner)})`,
        )
      : ["No open drop to move."]),
    ...d.backorders.map(
      (b) =>
        `Backorder L${b.lineNo} (${b.supplierName}, ${day(b.date)}): ${b.date && b.date > email.eta ? "still late — escalate" : "now in time for the drop"}`,
    ),
    `Alert to ${person(d.case.owner)} and Karim Balbaa.`,
  ];
  return {
    label: "Agent email: ETA update",
    call: { path: `${own}/eta` },
    confirm: {
      heading: "Agent email — ETA update",
      text: [
        `From ${email.from} · Subject: ${email.subject}`,
        email.body,
        "",
        `AI read · 97% · New ETA ${dayTime(email.eta)} (was ${dayTime(d.case.eta)})`,
        "",
        "What moves",
        ...moves,
      ].join("\n"),
      label: "Apply re-plan & alert",
    },
    reply: true,
  };
}

/** The drop the plan is about: the next open one, else the first. */
const nextDrop = (d: CaseOps) => d.deliveries.find((x) => !/confirmed|Cancelled/.test(x.status)) ?? d.deliveries[0];

const plan = on({
  title: "Vessel delivery plan",
  head: (d) => {
    const next = nextDrop(d);
    const eta = next ? etaAction(d) : undefined;
    return next
      ? {
          tags: [
            { label: `Drop ${next.drop} of ${d.deliveries.length} · ${next.status}`, tone: statusTone(next.status) },
          ],
          actions: eta ? [eta] : [],
        }
      : {};
  },
  render: (d) => {
    const next = nextDrop(d);
    if (!next)
      return block("text", {
        muted: true,
        text: "No delivery planned yet — the plan is created once supplier POs are confirmed and goods are due.",
      });
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
    return [
      block("text", {
        muted: true,
        text: "Supplier promises and the customer promise are tracked separately; an ETA change moves every open drop, booking and task, and alerts the owner.",
      }),
      block("details", {
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
      }),
      block("text", { text: `Pre-dispatch check — ${next.number}` }),
      block("tags", {
        items: checks.map(([label, ok]) => ({
          label,
          tone: ok ? ("success" as const) : ("warning" as const),
          icon: ok ? "success" : "warning",
        })),
      }),
    ];
  },
});

/** One drop: what goes, when and where, dispatch and receipt, and the proof that closes it. */
function drop(d: CaseOps, x: OpsDelivery): Entry {
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
              call: { path: `${own}/invoice`, body: { delivery: x.id } },
              reply: true,
            },
          ]
        : undefined,
  };
}

const drops = on({
  title: "Drops & proof of delivery",
  subhead:
    "“Delivered” needs evidence: dispatch and confirmed receipt are separate, and a drop is confirmed only with the signed delivery note or photo from the vessel.",
  skeleton: "entries",
  hidden: (d) => !d.deliveries.length,
  head: (d) => ({ tags: [{ label: `${d.deliveries.filter(delivered).length} of ${d.deliveries.length} delivered` }] }),
  render: (d) => block("entries", { items: d.deliveries.map((x) => drop(d, x)) }),
});

const backorders = on({
  title: "Backorders & late suppliers",
  skeleton: "table",
  hidden: (d) => !d.backorders.length,
  render: (d) => [
    block("text", {
      muted: true,
      text: "Receipt shortfalls become backorders with a date and an owner; a late supplier is escalated against the drop it was meant for.",
    }),
    block("table", {
      columns: [
        { key: "line", label: "Line" },
        { key: "qty", label: "Short" },
        { key: "supplier", label: "Supplier" },
        { key: "date", label: "Promised" },
        { key: "follows", label: "Follows in" },
        { key: "owner", label: "Owner" },
        { key: "risk", label: "Risk" },
      ],
      rows: d.backorders.map((b) => ({
        line: { text: `L${b.lineNo} · ${b.description}`, strong: true },
        qty: b.qty,
        supplier: b.supplierName,
        date: day(b.date),
        follows: b.followsIn ?? "Not planned",
        owner: person(b.owner),
        risk: b.late
          ? { text: "Arrives after the drop is packed", tone: "error", tag: true }
          : { text: "In time for the drop", tone: "success", tag: true },
      })),
    }),
  ],
});

function eStatus(inv: OpsInvoice) {
  const e = inv.eInvoice;
  const s = e.status ?? "Not submitted";
  const unreachable = /unreachable/i.test(e.error ?? "");
  return {
    cell: {
      text: unreachable ? "Signature service unreachable" : s,
      tone: unreachable ? "error" : statusTone(s),
      tag: true as const,
    },
    note: e.error ? { text: e.error, tone: "error" as const } : e.uuid ? `UUID ${e.uuid}` : "",
  };
}

function eAction(d: CaseOps, inv: OpsInvoice): Action | undefined {
  if (!d.canFinance) return undefined;
  const s = inv.eInvoice.status ?? "Not submitted";
  if (s === "Valid") return undefined;
  const call = { path: `${own}/einvoice`, body: { invoice: inv.id } };
  if (s === "Submitted") return { label: `Refresh status · ${inv.number}`, call, reply: true };
  const local = inv.vatTreatment === "14% standard";
  const rejected = s === "Rejected";
  return {
    label: `${rejected ? "Correct & resubmit" : inv.eInvoice.error ? "Retry (safe)" : "Sign & submit"} · ${inv.number}`,
    call,
    prompt: `Sign & submit ${inv.number} to the tax authority`,
    confirm: {
      heading: `Sign & submit ${inv.number} to the tax authority`,
      text: [
        `${inv.billing.legalEntity ?? d.customer?.name} · ${money(inv.amount, inv.currency)} · ${inv.vatTreatment}`,
        ...(inv.eInvoice.error ? ["", inv.eInvoice.error] : []),
        "",
        "Signed with Golden Sea's e-signature and submitted; the invoice number is the idempotency key, so a retry never creates a second submission.",
      ].join("\n"),
      label: "Sign & submit",
      tone: "primary",
    },
    fields: local
      ? [
          {
            type: "text",
            name: "taxId",
            label: "Buyer tax registration number",
            defaultValue: inv.billing.taxId ?? "",
            admin: { description: "9 digits — on the customer's tax card on file: 100-200-300" },
          },
        ]
      : undefined,
    reply: true,
  };
}

const invoices = on({
  title: "Customer invoices & payments",
  skeleton: "table",
  head: (d) => ({ count: d.invoices.length }),
  render: (d) => {
    const intro = block("text", {
      muted: true,
      text: "Invoices come from signed deliveries: only delivered quantities, never the same quantity twice. Each one is signed and submitted to the Egyptian Tax Authority; a failed signature submits nothing and is safe to retry.",
    });
    if (!d.invoices.length)
      return [
        intro,
        block("text", {
          muted: true,
          text: "No invoice yet — the first one is created from a delivery confirmed with a signed note.",
        }),
      ];
    const cur = d.case.currency;
    const invoiced = d.invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const received = d.invoices.reduce((s, i) => s + (i.paid || 0), 0);
    const balance = d.invoices.reduce((s, i) => s + (i.balance || 0), 0);
    const nextDue = d.invoices
      .filter((i) => i.balance > 0)
      .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))[0];
    const rows: Row[] = d.invoices.map((i) => {
      const e = eStatus(i);
      return {
        number: { text: i.number, href: link.doc("invoices", i.id), strong: true },
        basis: `${i.basis ?? "Delivery"}${i.delivery ? ` · ${i.delivery}` : ""} · ${day(i.issuedAt)}`,
        lines: i.lines
          .map(
            (l) =>
              `L${l.lineNo} · ${l.qty}${l.deliveredQty != null ? ` of ${l.deliveredQty} delivered` : ""} × ${money(l.unitPrice, i.currency)}`,
          )
          .join("; "),
        amount: money(i.amount, i.currency),
        vat: i.vatTreatment ?? "",
        einvoice: e.cell,
        eNote: e.note,
        paid: `${money(i.paid, i.currency)} paid`,
        balance: {
          text: [
            i.balance > 0 ? `Balance ${money(i.balance, i.currency)} due ${day(i.dueDate)}` : "Settled",
            ...i.payments.map((p) => `${day(p.paidAt)} · ${p.reference} · ${money(p.amount, i.currency)}`),
          ].join(" · "),
          tone: i.balance > 0 ? "warning" : "success",
        },
        status: { text: i.status, tone: statusTone(i.status), tag: true },
      };
    });
    const actions: Action[] = d.invoices.flatMap((i) => {
      const out: Action[] = [];
      const e = eAction(d, i);
      if (e) out.push(e);
      if (d.canFinance && i.balance > 0)
        out.push({
          label: `Record payment · ${i.number}`,
          call: { path: `${own}/payment`, body: { invoice: i.id } },
          prompt: `Record customer payment — ${i.number}`,
          fields: [
            {
              type: "number",
              name: "amount",
              label: `Amount received (${i.currency})`,
              required: true,
              defaultValue: i.balance,
              admin: {
                description: `Balance ${money(i.balance, i.currency)} · due ${day(i.dueDate)}. Recorded after the money is in the bank — the system never moves money.`,
              },
            },
            {
              type: "text",
              name: "reference",
              label: "Bank reference",
              // A fixed reference: `render` is pure (the old view stamped it from the clock).
              defaultValue: `TRX-77${i.number.replace(/\D/g, "").slice(-3).padStart(3, "0")}`,
            },
          ],
          reply: true,
        });
      return out;
    });
    return [
      intro,
      block("details", {
        layout: "inline",
        items: [
          { label: "Invoiced", value: money(invoiced, cur) },
          { label: "Received", value: money(received, cur) },
          { label: "Balance", value: { text: money(balance, cur), tone: balance > 0 ? "warning" : "success" } },
          {
            label: "Next due",
            value: nextDue ? `${day(nextDue.dueDate)} · ${money(nextDue.balance, nextDue.currency)}` : "—",
          },
        ],
      }),
      block("table", {
        columns: [
          { key: "number", label: "Invoice", supporting: "basis" },
          { key: "lines", label: "Invoiced lines" },
          { key: "amount", label: "Amount · VAT", supporting: "vat" },
          { key: "einvoice", label: "E-invoice (tax authority)", supporting: "eNote" },
          { key: "paid", label: "Paid · balance", supporting: "balance" },
          { key: "status", label: "Status" },
        ],
        rows,
      }),
      ...(actions.length ? [block("actions", { items: actions })] : []),
    ];
  },
});

export const caseDelivery = widgets({ widgets: [alerts, plan, drops, backorders, invoices] });
