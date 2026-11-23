import type { Cell, Figure, KindData, ViewHeader } from "saastemlycrm-design-system/contracts";
import { organise } from "../actions/inbox-history.ts";
import type { HistoryPayload } from "../endpoints/sourcing.ts";
import { m } from "../i18n/paraglide/messages.js";
import { count, dateFormat } from "./index.ts";

/**
 * The email-history import (GET /api/inbox-history, ../endpoints/sourcing.ts), read for the
 * widgets that show it: the mailboxes scanned, the de-duplication, its progress and approval, and
 * what "Organise" found (customers, vessels, suppliers, dated prices). Pure:
 * data in, what a kind draws out.
 */

export { count };
/** A date with its year (the history goes back to 2019). */
export const dated = (v: string) =>
  v ? dateFormat({ day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(v)) : "";

/** A name with the "New to Odoo" tag beside it when Odoo doesn't know it yet. */
export const named = (name: string, known: boolean): Cell => ({
  text: name,
  strong: true,
  tags: known ? undefined : [{ label: m.inbox_history_new_to_odoo(), tone: "primary" as const }],
});

/** The import's totals, as one phrase. */
export const totalsText = (t: { customers: number; vessels: number; suppliers: number }) =>
  m.inbox_history_totals({
    customers: t.customers,
    customersText: count(t.customers),
    vessels: t.vessels,
    vesselsText: count(t.vessels),
    suppliers: t.suppliers,
    suppliersText: count(t.suppliers),
  });

/** The screen's header: "Organise" until the history is organised, then the "Organised" tag. */
export const historyHeader = (d: HistoryPayload): ViewHeader => ({
  eyebrow: m.inbox_history_eyebrow(),
  heading: m.inbox_history_heading(),
  subtitle: m.inbox_history_subtitle(),
  tags: d.organised ? [{ label: m.inbox_history_organised(), tone: "success", icon: "success" }] : undefined,
  actions: d.organised ? undefined : [organise],
});

const steps = () => [
  m.inbox_history_step_connect(),
  m.inbox_history_step_scan(),
  m.inbox_history_step_dedup(),
  m.inbox_history_step_organise(),
  m.inbox_history_step_review(),
  m.inbox_history_approve(),
];

/** Where the import is, from connecting the mailboxes to management's approval, and what it waits for. */
export const importProgress = (d: HistoryPayload): KindData<"steps"> => ({
  note: d.approved
    ? m.inbox_history_status_approved({ by: d.approvedBy })
    : d.organised
      ? d.pending
        ? m.inbox_history_status_pending({ count: d.pending })
        : m.inbox_history_status_waiting()
      : m.inbox_history_status_dry_run(),
  current: d.approved ? 5 : d.organised ? (d.pending ? 4 : 5) : 3,
  items: steps().map((label) => ({ label })),
});

/** How many messages each year of the mailboxes holds: the years of history the import reads. */
export const messagesPerYear = (d: HistoryPayload): KindData<"chart"> => ({
  label: m.inbox_history_per_year(),
  chart: {
    kind: "bars",
    labels: d.perYear.labels,
    series: [{ name: m.inbox_history_messages(), values: d.perYear.values }],
    format: { unit: "count" },
  },
});

/** What de-duplication removed, by reason: the same email often sits in three mailboxes. */
export const dedup = (d: HistoryPayload): KindData<"gauges"> => ({
  note: m.inbox_history_dedup_note(),
  items: d.dedup.map((x) => ({
    label: x.label,
    value: x.count,
    max: d.scanned,
    tone: "neutral",
    valueText: m.inbox_history_dedup_value({ count: count(x.count) }),
    a11y: m.inbox_history_dedup_a11y({ label: x.label, count: count(x.count) }),
  })),
});

/** The business messages left once de-duplication is done: what "Organise" reads. */
export const KEPT = ["Business messages kept"] as const;
/** A `KEPT` key's words. */
export const keptFigureName = (key: (typeof KEPT)[number]): string =>
  ({ "Business messages kept": m.inbox_history_kept() })[key];
export const kept = (d: HistoryPayload): Figure<(typeof KEPT)[number]>[] => [
  {
    key: "Business messages kept",
    label: m.inbox_history_kept(),
    value: count(d.kept),
    share: d.scanned
      ? { value: d.kept / d.scanned, text: m.inbox_history_kept_share({ scanned: count(d.scanned) }) }
      : undefined,
  },
];

/**
 * Management's approval of the import, until it's given: only Karim Balbaa approves, once the
 * history is organised and every uncertain item decided. Nothing becomes a record before.
 */
export const importApproval = (d: HistoryPayload): KindData<"text"> => {
  const blocked = !d.organised
    ? m.inbox_history_organise_first()
    : d.pending
      ? m.inbox_history_pending_decision({ count: d.pending })
      : "";
  return {
    text: m.inbox_history_approval_text(),
    note: d.canApprove
      ? undefined
      : m.inbox_history_approval_waiting({ blocked: blocked || m.inbox_history_approval_ready() }),
    alerts: d.canApprove && blocked ? [{ tone: "warning", text: blocked }] : undefined,
    actions: d.canApprove
      ? [
          {
            label: m.inbox_history_approve(),
            icon: "check",
            main: true,
            disabled: Boolean(blocked),
            call: { path: "/inbox-history/approve" },
            confirm: {
              heading: m.inbox_history_confirm_heading(),
              text: m.inbox_history_confirm_text({
                totals: totalsText(d.totals),
                prices: count(d.totals.prices),
                kept: count(d.kept),
                decisions: d.review.length,
              }),
              label: m.inbox_history_approve(),
            },
            done: m.inbox_history_approve_done(),
          },
        ]
      : undefined,
  };
};

/** Once management approved the import: what was saved, and examples of the new records to open. */
export const importApproved = (d: HistoryPayload): KindData<"text"> => ({
  alerts: [{ tone: "success", text: m.inbox_history_approved_by({ by: d.approvedBy }) }],
  text: m.inbox_history_searchable({ totals: totalsText(d.totals), prices: count(d.totals.prices) }),
  actions: d.created.map((c) => ({ label: m.inbox_history_created({ kind: c.kind, name: c.name }), href: c.href })),
});

/** Before "Organise": the call to action. */
export const organiseCall = (): KindData<"text"> => ({
  muted: true,
  text: m.inbox_history_organise_text(),
  note: m.inbox_history_organise_note(),
  actions: [organise],
});

/**
 * The import's next step, in one tile whatever stage it is at (so the screen keeps its shape):
 * "Organise" until the history is organised, then management's approval, then what was saved.
 */
export const importNext = (d: HistoryPayload): KindData<"text"> =>
  d.approved ? importApproved(d) : d.organised ? importApproval(d) : organiseCall();

/** Every mailbox and WhatsApp export the import reads, with its years, messages and attachments. */
export const mailboxes = (d: HistoryPayload): KindData<"table"> => ({
  head: { tags: [{ label: m.inbox_history_scanned({ count: count(d.scanned) }) }] },
  note: m.inbox_history_mailboxes_note(),
  columns: [
    { key: "mailbox", label: m.inbox_history_col_mailbox() },
    { key: "provider", label: m.inbox_history_col_source() },
    { key: "years", label: m.inbox_history_col_years() },
    { key: "emails", label: m.inbox_history_messages(), align: "end" },
    { key: "attachments", label: m.inbox_history_col_attachments(), align: "end" },
  ],
  rows: d.mailboxes.map((b) => ({
    mailbox: { text: b.mailbox, strong: true },
    provider: { text: b.provider, tag: true },
    years: `${b.from}–${b.to}`,
    emails: count(b.emails),
    attachments: count(b.attachments),
  })),
});

/** After "Organise": what was found, one figure each (before it, each label with no value). */
export const FOUND_TOTALS = ["Customers", "Vessels", "Suppliers", "Dated prices"] as const;
/** A `FOUND_TOTALS` key's words. */
export const foundFigureName = (key: (typeof FOUND_TOTALS)[number]): string =>
  ({
    Customers: m.inbox_history_customers(),
    Vessels: m.inbox_history_vessels(),
    Suppliers: m.inbox_history_suppliers(),
    "Dated prices": m.inbox_history_dated_prices(),
  })[key];
export const foundTotals = (d: HistoryPayload): Figure<(typeof FOUND_TOTALS)[number]>[] =>
  d.organised
    ? [
        {
          key: "Customers",
          label: m.inbox_history_customers(),
          value: count(d.totals.customers),
          note: m.inbox_history_customers_note(),
        },
        {
          key: "Vessels",
          label: m.inbox_history_vessels(),
          value: count(d.totals.vessels),
          note: m.inbox_history_vessels_note(),
        },
        {
          key: "Suppliers",
          label: m.inbox_history_suppliers(),
          value: count(d.totals.suppliers),
          note: m.inbox_history_suppliers_note(),
        },
        {
          key: "Dated prices",
          label: m.inbox_history_dated_prices(),
          value: count(d.totals.prices),
          note: m.inbox_history_prices_note({ count: count(d.totals.pricesWithoutPo) }),
        },
      ]
    : [];

/** After "Organise": the ship managers found in the history, top 5 by RFQs, new ones tagged. */
export const foundCustomers = (d: HistoryPayload): KindData<"table"> => ({
  note: m.inbox_history_customers_found({ count: count(d.totals.customers) }),
  columns: [
    { key: "name", label: m.inbox_history_col_customer() },
    { key: "country", label: m.inbox_history_col_country() },
    { key: "years", label: m.inbox_history_col_years() },
    { key: "rfqs", label: m.inbox_history_col_rfqs() },
    { key: "vessels", label: m.inbox_history_vessels() },
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
  note: m.inbox_history_vessels_found({ count: count(d.totals.vessels) }),
  columns: [
    { key: "name", label: m.inbox_history_col_vessel() },
    { key: "imo", label: m.inbox_history_col_imo() },
    { key: "fleet", label: m.inbox_history_col_fleet() },
    { key: "ports", label: m.inbox_history_col_ports() },
    { key: "calls", label: m.inbox_history_col_calls() },
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
  note: m.inbox_history_suppliers_found({ count: count(d.totals.suppliers) }),
  columns: [
    { key: "name", label: m.inbox_history_col_supplier() },
    { key: "categories", label: m.inbox_history_col_categories() },
    { key: "quoted", label: m.inbox_history_col_quoted() },
    { key: "ordered", label: m.inbox_history_ordered() },
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
  note: m.inbox_history_prices_found({ count: count(d.totals.prices) }),
  columns: [
    { key: "item", label: m.inbox_history_col_item() },
    { key: "supplier", label: m.inbox_history_col_supplier() },
    { key: "price", label: m.inbox_history_col_price() },
    { key: "quotedAt", label: m.inbox_history_col_quoted_at() },
    { key: "ordered", label: m.inbox_history_col_po() },
  ],
  rows: d.prices.map((p) => ({
    item: { text: p.item, strong: true },
    supplier: p.supplier,
    price:
      d.canSeePrices && typeof p.price === "number"
        ? m.inbox_history_price({ price: m.index_money({ currency: p.currency, amount: count(p.price) }), per: p.per })
        : { text: m.inbox_history_price_hidden(), tone: "neutral" },
    quotedAt: dated(String(p.quotedAt)),
    ordered: p.ordered
      ? { text: m.inbox_history_ordered(), tone: "success", tag: true }
      : { text: m.inbox_history_no_po(), tag: true },
  })),
});
