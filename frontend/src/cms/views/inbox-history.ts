import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type Row, type Tone, type View, type ViewBlock } from "../../app/view/schema.ts";
import { historyPayload, type HistoryPayload } from "../endpoints/sourcing.ts";

/**
 * Inbox history (`/inbox-history`): the deck's "We organise your past" moment. Every mailbox is
 * scanned (dry run) and de-duplicated; "Organise" turns years of emails into customers (ship
 * managers), vessels (IMO, fleet, ports), suppliers (who quoted what) and dated prices — even
 * where no PO followed. What the organiser is unsure of waits in a review queue, and nothing is
 * saved before management (Karim Balbaa) approves the import.
 * Data and actions: /api/inbox-history (../endpoints/sourcing.ts).
 */

const n = (v: number) => v.toLocaleString("en-US");
const pct = (c: number) => `${Math.round(c * 100)}%`;
const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const day = (v: string) => (v ? DAY.format(new Date(v)) : "");
const plural = (k: number) => (k > 1 ? "s" : "");

const STEPS = ["Connect mailboxes", "Scan (dry run)", "De-duplicate", "Organise", "Review uncertain", "Approve import"];

const KIND_TONE: Record<string, Tone> = {
  Supplier: "info",
  Vessel: "info",
  Customer: "neutral",
  Price: "warning",
  Confidential: "error",
};

const organise: Action = {
  label: "Organise",
  icon: "sparkles",
  variant: "filled",
  call: { path: "/inbox-history/organise" },
  done: "History organised — uncertain items are waiting for you",
};

const step = (d: HistoryPayload) => (d.approved ? 5 : d.organised ? (d.pending ? 4 : 5) : 3);

/** A name with the "New to Odoo" tag beside it when Odoo doesn't know it yet. */
const named = (name: string, known: boolean) => ({
  name: {
    text: name,
    strong: true,
    tags: known ? undefined : [{ label: "New to Odoo", tone: "primary" as const }],
  },
});

function entities(d: HistoryPayload): ViewBlock {
  const card = (heading: string, sub: string, columns: { key: string; label: string; align?: "end" }[], rows: Row[]) =>
    block("card", {
      heading,
      blocks: [block("text", { text: sub, muted: true, variant: "body-sm" }), block("table", { columns, rows })],
    });
  return block("grid", {
    fit: "lg",
    blocks: [
      card(
        "Customers — ship managers",
        `${n(d.totals.customers)} found · top 5 by RFQs`,
        [
          { key: "name", label: "Customer" },
          { key: "country", label: "Country" },
          { key: "years", label: "Years" },
          { key: "rfqs", label: "RFQs" },
          { key: "vessels", label: "Vessels" },
        ],
        d.customers.map((c) => ({
          ...named(c.name, c.known),
          country: c.country,
          years: c.years,
          rfqs: c.rfqs,
          vessels: c.vessels,
        })),
      ),
      card(
        "Vessels — IMO, fleet, ports",
        `${n(d.totals.vessels)} found · matched by IMO, renames kept`,
        [
          { key: "name", label: "Vessel" },
          { key: "imo", label: "IMO" },
          { key: "fleet", label: "Fleet" },
          { key: "ports", label: "Ports" },
          { key: "calls", label: "Calls" },
        ],
        d.vessels.map((v) => ({
          ...named(v.name, v.known),
          imo: { text: v.imo, mono: true },
          fleet: v.fleet,
          ports: v.ports,
          calls: v.calls,
        })),
      ),
      card(
        "Suppliers — who quoted what",
        `${n(d.totals.suppliers)} found · incl. ones you never ordered from`,
        [
          { key: "name", label: "Supplier" },
          { key: "categories", label: "What they quote" },
          { key: "quoted", label: "Lines quoted" },
          { key: "ordered", label: "Ordered" },
        ],
        d.suppliers.map((s) => ({
          ...named(s.name, s.known),
          categories: s.categories,
          quoted: n(s.quoted),
          ordered: n(s.ordered),
        })),
      ),
      card(
        "Dated prices — even with no PO",
        `${n(d.totals.prices)} prices, each with its date and validity`,
        [
          { key: "item", label: "Item" },
          { key: "supplier", label: "Supplier" },
          { key: "price", label: "Price" },
          { key: "quotedAt", label: "Quoted" },
          { key: "ordered", label: "PO" },
        ],
        d.prices.map((p) => ({
          item: { text: p.item, strong: true },
          supplier: p.supplier,
          price:
            d.canSeePrices && typeof p.price === "number"
              ? `${p.currency} ${n(p.price)} / ${p.per}`
              : { text: "hidden for your role", tone: "neutral" },
          quotedAt: day(String(p.quotedAt)),
          ordered: p.ordered
            ? { text: "Ordered", tone: "success", tag: true }
            : { text: "No PO — still remembered", tag: true },
        })),
      ),
    ],
  });
}

function review(d: HistoryPayload): ViewBlock {
  const decide = (id: string, decision: "confirm" | "reject", label: string, variant: Action["variant"]): Action => ({
    label,
    variant,
    call: { path: `/inbox-history/review/${encodeURIComponent(id)}`, body: { decision } },
  });
  return block("card", {
    heading: "Uncertain items",
    tags: [
      d.pending ? { label: `${d.pending} to review`, tone: "warning" } : { label: "all decided", tone: "success" },
    ],
    blocks: [
      block("text", {
        text: "Reviewed with you before they are saved — confirm the proposal or reject it.",
        muted: true,
        variant: "body-sm",
      }),
      block("list", {
        variant: "separated",
        items: d.review.map((r) => ({
          overline: `${r.mailbox} · ${day(r.receivedAt)} · “${r.subject}” from ${r.fromName}`,
          headline: r.question,
          supporting: `Proposal: ${r.proposal}`,
          tags: [
            { label: r.kind, tone: KIND_TONE[r.kind] ?? "neutral" },
            { label: pct(r.confidence) },
            ...(r.decision
              ? [
                  {
                    label: `${r.decision}${r.reviewedBy ? ` by ${r.reviewedBy}` : ""}`,
                    tone: r.decision === "Confirmed" ? ("success" as const) : ("neutral" as const),
                  },
                ]
              : []),
          ],
          actions: r.decision
            ? d.approved
              ? undefined
              : [decide(r.id, r.decision === "Confirmed" ? "reject" : "confirm", "Change", "text")]
            : [decide(r.id, "confirm", "Confirm", "tonal"), decide(r.id, "reject", "Reject", "text")],
        })),
      }),
    ],
  });
}

function approval(d: HistoryPayload): ViewBlock {
  const totals = `${n(d.totals.customers)} customers, ${n(d.totals.vessels)} vessels, ${n(d.totals.suppliers)} suppliers`;
  if (d.approved)
    return block("card", {
      heading: "Import approval",
      blocks: [
        block("alert", {
          tone: "success",
          text: `Approved by ${d.approvedBy}. Your history is searchable from day one: ${totals} and ${n(d.totals.prices)} dated prices.`,
        }),
        ...(d.created.length
          ? [
              block("text", { text: "New records (examples)", variant: "label-lg" }),
              block("actions", {
                items: d.created.map((c) => ({ label: `${c.kind}: ${c.name}`, href: c.href })),
              }),
            ]
          : []),
      ],
    });
  const blocked = !d.organised
    ? "Organise the history first."
    : d.pending
      ? `${d.pending} uncertain item${plural(d.pending)} still need a decision.`
      : "";
  return block("card", {
    heading: "Import approval",
    blocks: [
      block("text", {
        text: "Only management approves the import — nothing from the history becomes a record before Karim Balbaa says yes. Confidential threads stay out.",
      }),
      ...(d.canApprove
        ? [
            ...(blocked ? [block("alert", { tone: "warning", text: blocked })] : []),
            block("actions", {
              items: [
                {
                  label: "Approve import",
                  icon: "check",
                  variant: "filled",
                  disabled: Boolean(blocked),
                  call: { path: "/inbox-history/approve" },
                  confirm: {
                    heading: "Approve the history import?",
                    text: `Saves ${totals} and ${n(d.totals.prices)} dated prices from ${n(d.kept)} de-duplicated messages, with your ${d.review.length} decisions on the uncertain items. Rejected and confidential items are left out.`,
                    label: "Approve import",
                  },
                  done: "Import approved — customers, vessels, suppliers and dated prices saved",
                },
              ],
            }),
          ]
        : [
            block("alert", {
              tone: "info",
              text: `Waiting for Karim Balbaa (management). ${blocked || "Everything is reviewed — it's ready for his approval."}`,
            }),
          ]),
    ],
  });
}

export function inboxHistoryView(d: HistoryPayload): View {
  const blocks: ViewBlock[] = [
    block("card", {
      heading: "Import progress",
      blocks: [
        block("steps", { current: step(d), items: STEPS.map((label) => ({ label })) }),
        block("text", {
          muted: true,
          variant: "body-sm",
          text: `Status: ${
            d.approved
              ? `imported · approved by ${d.approvedBy}`
              : d.organised
                ? d.pending
                  ? `${d.pending} uncertain item${plural(d.pending)} to review`
                  : "waiting for management's approval"
                : "dry run ready — nothing has been imported"
          }`,
        }),
      ],
    }),
    block("grid", {
      fit: "md",
      blocks: [
        block("card", {
          heading: "Mailboxes imported",
          tags: [{ label: `${n(d.scanned)} messages · 2019–2026` }],
          blocks: [
            block("text", {
              muted: true,
              variant: "body-sm",
              text: "All of Golden Sea's mailboxes and WhatsApp exports, read in a dry run first — nothing is saved before approval.",
            }),
            block("table", {
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
                emails: n(m.emails),
                attachments: n(m.attachments),
              })),
            }),
            block("chart", {
              label: "Messages per year",
              chart: {
                kind: "bars",
                labels: d.perYear.labels,
                series: [{ name: "Messages", values: d.perYear.values }],
                format: { unit: "count" },
              },
            }),
          ],
        }),
        block("card", {
          heading: "De-duplication",
          blocks: [
            block("text", {
              text: "The same email often sits in three mailboxes. Each message is kept once, with all its copies linked.",
            }),
            block("gauges", {
              items: d.dedup.map((x) => ({
                label: x.label,
                value: x.count,
                max: d.scanned,
                tone: "neutral",
                valueText: `− ${n(x.count)}`,
                a11y: `${x.label}: ${n(x.count)} removed`,
              })),
            }),
            block("divider", {}),
            block("stats", {
              size: "md",
              items: [{ label: "Business messages kept", value: n(d.kept), tone: "primary" }],
            }),
          ],
        }),
      ],
    }),
  ];
  if (d.organised)
    blocks.push(
      block("stats", {
        items: [
          { label: "Customers", value: n(d.totals.customers), note: "ship managers & owners" },
          { label: "Vessels", value: n(d.totals.vessels), note: "IMO · fleet · ports" },
          { label: "Suppliers", value: n(d.totals.suppliers), note: "who quoted what" },
          {
            label: "Dated prices",
            value: n(d.totals.prices),
            note: `${n(d.totals.pricesWithoutPo)} with no PO`,
          },
        ],
      }),
      entities(d),
      review(d),
    );
  else
    blocks.push(
      block("card", {
        variant: "filled",
        heading: "Years of emails, RFQs, offers and quotes · scattered",
        blocks: [
          block("text", {
            muted: true,
            text: "Press Organise: the AI reads the kept messages and builds your customers, vessels, suppliers and dated prices. Anything it isn't sure of comes to you first.",
          }),
          block("actions", { items: [organise] }),
        ],
      }),
    );
  blocks.push(approval(d));
  return {
    header: {
      eyebrow: "Sourcing desk · your history",
      heading: "Inbox history",
      subtitle: "We organise your past, not just your future: every inbox, every year.",
      tags: d.organised ? [{ label: "Organised", tone: "success", icon: "success" }] : undefined,
      actions: d.organised ? undefined : [organise],
    },
    blocks,
  };
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/inbox-history: the history import as a View (src/app/view).
    path: "/views/inbox-history",
    method: "get",
    handler: async (req: PayloadRequest) => {
      if (!req.user)
        return Response.json({ errors: [{ message: "You are not allowed to perform this action." }] }, { status: 401 });
      return Response.json(inboxHistoryView(await historyPayload(req)));
    },
  },
];
