import type { Cell, KindData, Stat, ViewHeader } from "saastemlycrm-design-system/contracts";
import { organise } from "../actions/inbox-history.ts";
import type { HistoryPayload } from "../endpoints/sourcing.ts";

/**
 * The email-history import (GET /api/inbox-history, ../endpoints/sourcing.ts), read for the
 * widgets that show it: the mailboxes scanned, the de-duplication, its progress and approval, and
 * what "Organise" found (customers, vessels, suppliers, dated prices). Pure:
 * data in, what a kind draws out.
 */

export const count = (v: number) => v.toLocaleString("en-US");
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
/** A date with its year (the history goes back to 2019). */
export const dated = (v: string) => (v ? DAY.format(new Date(v)) : "");
export const plural = (k: number) => (k > 1 ? "s" : "");

/** A name with the "New to Odoo" tag beside it when Odoo doesn't know it yet. */
export const named = (name: string, known: boolean): Cell => ({
  text: name,
  strong: true,
  tags: known ? undefined : [{ label: "New to Odoo", tone: "primary" as const }],
});

/** The import's totals, as one phrase. */
export const totalsText = (t: { customers: number; vessels: number; suppliers: number }) =>
  `${count(t.customers)} customers, ${count(t.vessels)} vessels, ${count(t.suppliers)} suppliers`;

/** The screen's header: "Organise" until the history is organised, then the "Organised" tag. */
export const historyHeader = (d: HistoryPayload): ViewHeader => ({
  eyebrow: "Sourcing desk · your history",
  heading: "Inbox history",
  subtitle: "We organise your past, not just your future: every inbox, every year.",
  tags: d.organised ? [{ label: "Organised", tone: "success", icon: "success" }] : undefined,
  actions: d.organised ? undefined : [organise],
});

const STEPS = ["Connect mailboxes", "Scan (dry run)", "De-duplicate", "Organise", "Review uncertain", "Approve import"];

/** Where the import is, from connecting the mailboxes to management's approval, and what it waits for. */
export const importProgress = (d: HistoryPayload): KindData<"steps"> => ({
  note: `Status: ${
    d.approved
      ? `imported · approved by ${d.approvedBy}`
      : d.organised
        ? d.pending
          ? `${d.pending} uncertain item${plural(d.pending)} to review`
          : "waiting for management's approval"
        : "dry run ready — nothing has been imported"
  }`,
  current: d.approved ? 5 : d.organised ? (d.pending ? 4 : 5) : 3,
  items: STEPS.map((label) => ({ label })),
});

/** How many messages each year of the mailboxes holds: the years of history the import reads. */
export const messagesPerYear = (d: HistoryPayload): KindData<"chart"> => ({
  label: "Messages per year",
  chart: {
    kind: "bars",
    labels: d.perYear.labels,
    series: [{ name: "Messages", values: d.perYear.values }],
    format: { unit: "count" },
  },
});

/** What de-duplication removed, by reason: the same email often sits in three mailboxes. */
export const dedup = (d: HistoryPayload): KindData<"gauges"> => ({
  note: "The same email often sits in three mailboxes. Each message is kept once, with all its copies linked.",
  items: d.dedup.map((x) => ({
    label: x.label,
    value: x.count,
    max: d.scanned,
    tone: "neutral",
    valueText: `− ${count(x.count)}`,
    a11y: `${x.label}: ${count(x.count)} removed`,
  })),
});

/** The business messages left once de-duplication is done: what "Organise" reads. */
export const kept = (d: HistoryPayload): Stat[] => [
  {
    label: "Business messages kept",
    value: count(d.kept),
    share: d.scanned ? { value: d.kept / d.scanned, text: `of ${count(d.scanned)} scanned` } : undefined,
  },
];

/**
 * Management's approval of the import, until it's given: only Karim Balbaa approves, once the
 * history is organised and every uncertain item decided. Nothing becomes a record before.
 */
export const importApproval = (d: HistoryPayload): KindData<"text"> => {
  const blocked = !d.organised
    ? "Organise the history first."
    : d.pending
      ? `${d.pending} uncertain item${plural(d.pending)} still need a decision.`
      : "";
  return {
    text: "Only management approves the import — nothing from the history becomes a record before Karim Balbaa says yes. Confidential threads stay out.",
    note: d.canApprove
      ? undefined
      : `Waiting for Karim Balbaa (management). ${blocked || "Everything is reviewed — it's ready for approval."}`,
    alerts: d.canApprove && blocked ? [{ tone: "warning", text: blocked }] : undefined,
    actions: d.canApprove
      ? [
          {
            label: "Approve import",
            icon: "check",
            main: true,
            disabled: Boolean(blocked),
            call: { path: "/inbox-history/approve" },
            confirm: {
              heading: "Approve the history import?",
              text: `Saves ${totalsText(d.totals)} and ${count(d.totals.prices)} dated prices from ${count(d.kept)} de-duplicated messages, with your ${d.review.length} decisions on the uncertain items. Rejected and confidential items are left out.`,
              label: "Approve import",
            },
            done: "Import approved — customers, vessels, suppliers and dated prices saved",
          },
        ]
      : undefined,
  };
};

/** Once management approved the import: what was saved, and examples of the new records to open. */
export const importApproved = (d: HistoryPayload): KindData<"alert"> => ({
  tone: "success",
  text: `Approved by ${d.approvedBy}. Your history is searchable from day one: ${totalsText(d.totals)} and ${count(d.totals.prices)} dated prices.`,
  actions: d.created.map((c) => ({ label: `${c.kind}: ${c.name}`, href: c.href })),
});

/** Before "Organise": the call to action. */
export const organiseCall = (): KindData<"text"> => ({
  muted: true,
  text: "Press Organise: the AI reads the kept messages and builds your customers, vessels, suppliers and dated prices. Anything it isn't sure of comes to you first.",
  actions: [organise],
});

/** Every mailbox and WhatsApp export the import reads, with its years, messages and attachments. */
export const mailboxes = (d: HistoryPayload): KindData<"table"> => ({
  head: { tags: [{ label: `${count(d.scanned)} messages · 2019–2026` }] },
  note: "All of Golden Sea's mailboxes and WhatsApp exports, read in a dry run first — nothing is saved before approval.",
  columns: [
    { key: "mailbox", label: "Mailbox" },
    { key: "provider", label: "Source" },
    { key: "years", label: "Years" },
    { key: "emails", label: "Messages", align: "end" },
    { key: "attachments", label: "Attachments", align: "end" },
  ],
  rows: d.mailboxes.map((m) => ({
    mailbox: { text: m.mailbox, strong: true },
    provider: { text: m.provider, tag: true },
    years: `${m.from}–${m.to}`,
    emails: count(m.emails),
    attachments: count(m.attachments),
  })),
});

/** After "Organise": what was found, one figure each. */
export const foundTotals = (d: HistoryPayload): Stat[] => [
  { label: "Customers", value: count(d.totals.customers), note: "ship managers & owners" },
  { label: "Vessels", value: count(d.totals.vessels), note: "IMO · fleet · ports" },
  { label: "Suppliers", value: count(d.totals.suppliers), note: "who quoted what" },
  { label: "Dated prices", value: count(d.totals.prices), note: `${count(d.totals.pricesWithoutPo)} with no PO` },
];

/** After "Organise": the ship managers found in the history, top 5 by RFQs, new ones tagged. */
export const foundCustomers = (d: HistoryPayload): KindData<"table"> => ({
  note: `${count(d.totals.customers)} found · top 5 by RFQs`,
  columns: [
    { key: "name", label: "Customer" },
    { key: "country", label: "Country" },
    { key: "years", label: "Years" },
    { key: "rfqs", label: "RFQs" },
    { key: "vessels", label: "Vessels" },
  ],
  rows: d.customers.map((c) => ({
    name: named(c.name, c.known),
    country: c.country,
    years: c.years,
    rfqs: c.rfqs,
    vessels: c.vessels,
  })),
});

/** After "Organise": the vessels found, matched by IMO (renames kept), with their fleet and ports. */
export const foundVessels = (d: HistoryPayload): KindData<"table"> => ({
  note: `${count(d.totals.vessels)} found · matched by IMO, renames kept`,
  columns: [
    { key: "name", label: "Vessel" },
    { key: "imo", label: "IMO" },
    { key: "fleet", label: "Fleet" },
    { key: "ports", label: "Ports" },
    { key: "calls", label: "Calls" },
  ],
  rows: d.vessels.map((v) => ({
    name: named(v.name, v.known),
    imo: { text: v.imo, mono: true },
    fleet: v.fleet,
    ports: v.ports,
    calls: v.calls,
  })),
});

/** After "Organise": the suppliers found and what they quote, including ones never ordered from. */
export const foundSuppliers = (d: HistoryPayload): KindData<"table"> => ({
  note: `${count(d.totals.suppliers)} found · incl. ones you never ordered from`,
  columns: [
    { key: "name", label: "Supplier" },
    { key: "categories", label: "What they quote" },
    { key: "quoted", label: "Lines quoted" },
    { key: "ordered", label: "Ordered" },
  ],
  rows: d.suppliers.map((s) => ({
    name: named(s.name, s.known),
    categories: s.categories,
    quoted: count(s.quoted),
    ordered: count(s.ordered),
  })),
});

/**
 * After "Organise": the prices found, each with its date, even where no PO followed. The price
 * itself only for those who may see prices.
 */
export const foundPrices = (d: HistoryPayload): KindData<"table"> => ({
  note: `${count(d.totals.prices)} prices, each with its date and validity`,
  columns: [
    { key: "item", label: "Item" },
    { key: "supplier", label: "Supplier" },
    { key: "price", label: "Price" },
    { key: "quotedAt", label: "Quoted" },
    { key: "ordered", label: "PO" },
  ],
  rows: d.prices.map((p) => ({
    item: { text: p.item, strong: true },
    supplier: p.supplier,
    price:
      d.canSeePrices && typeof p.price === "number"
        ? `${p.currency} ${count(p.price)} / ${p.per}`
        : { text: "hidden for your role", tone: "neutral" },
    quotedAt: dated(String(p.quotedAt)),
    ordered: p.ordered
      ? { text: "Ordered", tone: "success", tag: true }
      : { text: "No PO — still remembered", tag: true },
  })),
});
