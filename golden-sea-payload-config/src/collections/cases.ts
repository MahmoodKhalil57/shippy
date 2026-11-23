import type { CollectionConfig, Field, PayloadRequest } from "payload";
import { formats, tones, type CollectionSettings, type OptionTone } from "saastemlycrm-design-system/contracts";
import { widgets } from "saastemlycrm-design-system/contracts";
import {
  CASE_TYPES,
  CURRENCIES,
  DAY,
  PORTS,
  QUOTE_DECISIONS,
  STORES,
  TODAY,
  UNITS,
  autoNumber,
  computed,
  costVisible,
  idOf,
  logActivity,
  scalar,
} from "./shared.ts";
import { caseDelivery } from "../pages/case-delivery.ts";
import { caseOrder } from "../pages/case-order.ts";
import { caseOverview } from "../pages/case-overview.ts";
import { caseRfqs } from "../pages/case-rfqs.ts";
import { caseCompare } from "../pages/case-compare.ts";
import { casePricing } from "../pages/case-pricing.ts";
import { caseProfit } from "../pages/case-profit.ts";

export const STAGES = [
  "New",
  "Validating",
  "Sourcing",
  "Awaiting supplier",
  "Comparing offers",
  "Awaiting corrected offer",
  "Awaiting management approval",
  "Quotation submitted",
  "Awaiting customer decision",
  "Revision requested",
  "Won — PO mismatch",
  "Won — sales order confirmed",
  "Purchasing",
  "Delivering (drop 1 of 2)",
  "Delivered",
  "Invoiced — partially paid",
  "Customs clearance",
  "Held for vessel",
  "Closed — settled",
  "On hold",
  "Lost",
  "Expired",
];

export const WAITS = [
  "Awaiting supplier",
  "Awaiting corrected offer",
  "Awaiting internal approval",
  "Awaiting customer decision",
  "Awaiting delivery or payment",
];

/** Line status → the progress bucket it counts in before the order. */
export const LINE_BUCKET: Record<string, LineBucket> = {
  "Clarification needed": "blocked",
  "Not sourced": "noOffer",
  "Awaiting supplier": "waiting",
  "Awaiting customer acceptance": "waiting",
  "Ready to select": "ready",
  "Offer selected": "ready",
  "Split offer selected": "ready",
  Ordered: "ready",
  Received: "ready",
  Delivered: "ready",
  Invoiced: "ready",
  "Closed — not awarded": "closed",
};
export type LineBucket = "ready" | "waiting" | "blocked" | "noOffer" | "closed";

/** How each bucket reads: ready lines in green, waiting amber, blocked red, the rest quiet. */
const BUCKET_TONE: Record<LineBucket, OptionTone> = {
  ready: "success",
  waiting: "warning",
  blocked: "error",
  noOffer: "neutral",
  closed: "neutral",
};

/** A line's bucket by its status (a line with none is not sourced yet). */
export const bucketOf = (status: unknown): LineBucket => LINE_BUCKET[scalar(status) || "Not sourced"] ?? "noOffer";

/**
 * How far a case's lines are before the order: each line by its own status (a partly ready case
 * is never "done"), or the case's line summary when it has no lines yet. Pure: the case in.
 */
export function lineCounts(c: Record<string, unknown>) {
  const items = (c.items as { status?: string }[] | undefined) ?? [];
  if (items.length) {
    const count = (b: LineBucket) => items.filter((l) => bucketOf(l.status) === b).length;
    return {
      total: items.length,
      ready: count("ready"),
      waiting: count("waiting"),
      blocked: count("blocked"),
      noOffer: count("noOffer"),
      closed: count("closed"),
    };
  }
  const s = (c.lines as Record<string, number> | undefined) ?? {};
  const n = (k: string) => Number(s[k]) || 0;
  return {
    total: n("ready") + n("waiting") + n("blocked") + n("noOffer"),
    ready: n("ready"),
    waiting: n("waiting"),
    blocked: n("blocked"),
    noOffer: n("noOffer"),
    closed: 0,
  };
}

/** The risk a case is at (its `tone`), worst first: what queues sort by. */
const RISK_RANK: Record<string, number> = { danger: 0, warn: 1, info: 2, ok: 3, neutral: 4 };

const time = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/** A date against the demo's clock: "today 16:00", "tomorrow 09:00", "in 3 days", "2 days overdue". */
export function relativeDue(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  const days = Math.floor(d.getTime() / DAY) - Math.floor(TODAY.getTime() / DAY);
  if (days === 0) return d < TODAY ? `overdue since ${time(d)}` : `today ${time(d)}`;
  if (days === 1) return `tomorrow ${time(d)}`;
  if (days > 1) return `in ${days} days`;
  return `${-days} day${days === -1 ? "" : "s"} overdue`;
}

/**
 * A value of one row of an array field worked out on read (never stored), from the row itself:
 * Payload's `virtual` with an `afterRead` hook on its `siblingData`.
 */
const rowComputed = <F extends Field>(field: F, compute: (row: Record<string, unknown>) => unknown): F =>
  ({
    ...field,
    virtual: true,
    admin: { readOnly: true, condition: () => false, ...(field as { admin?: object }).admin },
    hooks: {
      afterRead: [({ siblingData }: { siblingData?: Record<string, unknown> }) => compute(siblingData ?? {})],
    },
  }) as F;

/** The counts besides "Ready", each a bar of all the lines in its own tone. */
const LINE_GAUGES = [
  ["waiting", "Waiting", "warning"],
  ["blocked", "Blocked", "error"],
  ["noOffer", "No offer", "neutral"],
] as const;

/** The demo's clock, for what a value's tone says against it (`custom.toneWhen`). */
const NOW = TODAY.toISOString();

/** Who hands a case over: the supply-chain desk and management, besides its owner and backup. */
export const REASSIGN_ROLES = ["management", "supply-chain"];
/** Who a case can be handed to: the people on the desk. */
export const HANDOVER_ROLES = ["supply-chain", "sales", "operations", "management"];
type Reader = { id?: unknown; role?: unknown } | null | undefined;
/** Whether this person may hand the case over. Pure: the case and who is asking in. */
export const mayReassign = (c: Record<string, unknown>, user: Reader) =>
  !!user?.id && (REASSIGN_ROLES.includes(scalar(user.role)) || user.id === idOf(c.owner) || user.id === idOf(c.backup));

/** The desk's people (read once per request), for the handover's "Hand over to". */
async function desk(req: PayloadRequest): Promise<Record<string, unknown>[]> {
  const ctx = (req.context ??= {}) as { desk?: Promise<Record<string, unknown>[]> };
  ctx.desk ??= req.payload
    .find({ collection: "users", limit: 0, depth: 0, pagination: false } as never)
    .then((r) =>
      (r.docs as unknown as Record<string, unknown>[]).filter((u) => HANDOVER_ROLES.includes(scalar(u.role))),
    )
    .catch(() => []);
  return ctx.desk;
}

const LINE_STATUSES = [
  "Clarification needed",
  "Not sourced",
  "Awaiting supplier",
  "Ready to select",
  "Awaiting customer acceptance",
  "Offer selected",
  "Split offer selected",
  "Ordered",
  "Received",
  "Delivered",
  "Invoiced",
  "Closed — not awarded",
];

/** A client RFQ (or service request), from intake to settlement. The parent of everything else. */
export const Cases: CollectionConfig = {
  slug: "cases",
  labels: { singular: "Case", plural: "Cases" },
  admin: {
    useAsTitle: "caseId",
    listSearchableFields: ["caseId", "vessel", "customerRef"],
    defaultColumns: ["caseId", "customer", "vessel", "stage", "deadline", "owner", "value"],
    group: "Sourcing desk",
    description: "Client RFQs and everything that follows: supplier RFQs, quotes, POs, delivery and payment.",
    // The case workspace: one tab per step from first email to last payment (Payload custom
    // edit views, each a screen in src/pages).
    // Counts by what each case is waiting for, above the list, each opening the filtered list.
    components: {
      beforeList: [widgets({ widgets: [{ size: "s", counts: { collection: "cases", field: "wait" } }] })],
      views: {
        edit: {
          overview: {
            Component: caseOverview,
            path: "/overview",
            tab: { label: "Overview", href: "/overview" },
          },
          rfqs: {
            Component: caseRfqs,
            path: "/rfqs",
            tab: { label: "Supplier RFQs", href: "/rfqs" },
          },
          compare: {
            Component: caseCompare,
            path: "/compare",
            tab: { label: "Compare offers", href: "/compare" },
          },
          pricing: {
            Component: casePricing,
            path: "/pricing",
            tab: { label: "Pricing", href: "/pricing" },
          },
          order: {
            Component: caseOrder,
            path: "/order",
            tab: { label: "Order & purchasing", href: "/order" },
          },
          delivery: {
            Component: caseDelivery,
            path: "/delivery",
            tab: { label: "Delivery & billing", href: "/delivery" },
          },
          profit: {
            Component: caseProfit,
            path: "/profit",
            tab: { label: "Profit & close", href: "/profit" },
          },
        },
      },
    },
  },
  defaultSort: "deadline",
  // A board by what each case waits for; the stage as steps above the form.
  custom: {
    list: { board: "wait", cardFields: ["customer", "vessel", "deadline", "owner"] },
    edit: {
      steps: {
        field: "stage",
        skip: [
          "Awaiting corrected offer",
          "Revision requested",
          "Won — PO mismatch",
          "Customs clearance",
          "Held for vessel",
          "On hold",
          "Lost",
          "Expired",
        ],
      },
    },
    // "Reassign": pick who takes over; AI drafts the handover note from the case (its
    // clarifications, open tasks and timeline) for the person picked; edit it, confirm. Offered to
    // whoever may hand the case over (`canReassign`), wherever cases show; the endpoint re-checks.
    actions: [
      {
        label: "Reassign",
        when: { canReassign: { equals: true } },
        call: { path: "/case-overview/$row.id/reassign" },
        confirm: {
          heading: "Reassign $row.caseId",
          text: "The new owner gets the case, its open tasks and a notification. The handover note is logged on the timeline. AI drafts the note from the case, its clarifications, open tasks and timeline.",
          label: "Confirm handover",
        },
        fields: [
          {
            type: "select",
            name: "to",
            label: "Hand over to",
            required: true,
            defaultValue: "$row.backup.id",
            // The desk without the owner (`handoverTeam`), the backup marked.
            options: "$row.handoverTeam" as never,
            admin: { description: "The colleague who takes the case over.", placeholder: "Choose a person" },
          },
          {
            type: "textarea",
            name: "note",
            label: "Handover note",
            required: true,
            admin: {
              description: "Edit freely. Nothing is saved until you confirm.",
              placeholder: "e.g. Offers are in for lines 1 to 6, customer call pending.",
              rows: 10,
            },
          },
        ],
        prefill: { when: "to", into: "note", from: "draft", call: { path: "/case-overview/$row.id/handover" } },
        assist: { field: "note", tools: "formal shorter proofread" },
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "management",
  },
  hooks: {
    // The risk rank queues sort by (worst first), kept with the risk.
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data) data.riskRank = RISK_RANK[scalar(data.tone ?? originalDoc?.tone) || "info"] ?? 2;
        return data;
      },
    ],
    // Number new cases GS-RFQ-0143, GS-RFQ-0144, … (service and held cases use their own prefixes).
    beforeValidate: [
      async (args) => {
        const { data } = args;
        const prefix = data?.caseType === "service" ? "GS-SVC-" : data?.caseType === "held" ? "GS-HLD-" : "GS-RFQ-";
        return autoNumber("cases", "caseId", prefix)(args);
      },
    ],
    afterChange: [
      // Stage, owner and decision changes go to the case timeline.
      async ({ doc, previousDoc, operation, req }) => {
        if (req.context?.seed) return doc;
        if (operation === "create") await logActivity(req, { case: doc.id, text: `Case ${doc.caseId} created.` });
        else {
          if (previousDoc?.stage !== doc.stage)
            await logActivity(req, { case: doc.id, text: `Stage: ${previousDoc?.stage ?? "—"} → ${doc.stage}.` });
          const prevOwner = typeof previousDoc?.owner === "object" ? previousDoc?.owner?.id : previousDoc?.owner;
          const owner = typeof doc.owner === "object" ? doc.owner?.id : doc.owner;
          if (prevOwner && prevOwner !== owner) {
            const user = await req.payload
              .findByID({ collection: "users", id: String(owner), depth: 0 })
              .catch(() => null);
            const name = typeof user?.name === "string" ? user.name : String(owner);
            await logActivity(req, { case: doc.id, text: `Reassigned to ${name}. ${doc.handoverNote ?? ""}`.trim() });
          }
        }
        return doc;
      },
    ],
  },
  endpoints: [
    {
      // GET /api/cases/:id/summary — one-line status for chat replies and notifications.
      path: "/:id/summary",
      method: "get",
      handler: async (req) => {
        const doc = await req.payload.findByID({ collection: "cases", id: String(req.routeParams?.id), depth: 1 });
        const customer = typeof doc.customer === "object" && doc.customer ? doc.customer.name : doc.customer;
        return Response.json({
          id: doc.id,
          summary: `${doc.caseId} · ${customer} · ${doc.vessel}: ${doc.stage}. Next: ${doc.nextAction}.`,
        });
      },
    },
  ],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Case",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "caseId",
                  type: "text",
                  label: "Case",
                  unique: true,
                  admin: { readOnly: true, description: "Numbered automatically when the case is created." },
                },
                {
                  name: "customer",
                  type: "relationship",
                  relationTo: "customers",
                  required: true,
                  admin: {
                    description: "The shipping company or owner asking for the quote.",
                    placeholder: "e.g. Nordvik Ship Management",
                  },
                },
                {
                  name: "customerRef",
                  type: "text",
                  label: "Customer reference",
                  admin: {
                    description: "The customer's own RFQ or requisition number, if any.",
                    placeholder: "e.g. RFQ-2026-0457",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "vessel",
                  type: "text",
                  required: true,
                  admin: { description: "The ship the stores are for.", placeholder: "e.g. MV Nordic Tern" },
                },
                {
                  name: "vesselRecord",
                  type: "relationship",
                  relationTo: "vessels",
                  label: "Vessel record (IMO)",
                  admin: {
                    description: "Link the vessel's record to keep its IMO number and history.",
                    placeholder: "Search vessels",
                  },
                },
                {
                  name: "port",
                  type: "select",
                  options: PORTS,
                  admin: {
                    description: "Where the goods are handed over to the vessel.",
                    placeholder: "e.g. Port Said",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "eta",
                  type: "date",
                  label: "ETA",
                  admin: {
                    date: { pickerAppearance: "dayAndTime" },
                    description: "When the vessel is expected at the port.",
                  },
                },
                {
                  name: "deadline",
                  type: "date",
                  required: true,
                  label: "Quote deadline",
                  admin: { description: "When the customer needs our quotation by." },
                },
                {
                  name: "currency",
                  type: "select",
                  options: CURRENCIES,
                  defaultValue: "USD",
                  label: "Quote currency",
                  admin: { description: "The currency the customer is quoted in.", placeholder: "USD" },
                },
              ],
            },
            {
              name: "agent",
              type: "text",
              label: "Port agent / delivery contact",
              admin: {
                description: "Who meets the goods at the port, usually the vessel's agent.",
                placeholder: "e.g. Ahmed Hassan, Suez Agency",
              },
            },
            {
              name: "nextAction",
              type: "text",
              label: "Next action",
              required: true,
              admin: {
                description: "The next step and who takes it.",
                placeholder: "e.g. Chase supplier offers for lines 3 to 5",
              },
            },
            {
              name: "blocker",
              type: "text",
              // Red on a blocked case.
              custom: { toneWhen: [{ when: { tone: { equals: "danger" } }, tone: "error" }] },
              admin: {
                description: "What stops this case moving, if anything.",
                placeholder: "e.g. Customer has not confirmed the brand",
              },
            },
            {
              name: "handoverNote",
              type: "textarea",
              admin: {
                description: "Logged on the timeline when the owner changes.",
                placeholder: "e.g. Offers are in for lines 1 to 6, customer call pending.",
              },
            },
          ],
        },
        {
          label: "Requested lines",
          fields: [
            {
              name: "items",
              type: "array",
              labels: { singular: "Line", plural: "Lines" },
              admin: {
                description:
                  "The customer's lines, as extracted and validated. Offers and the quotation refer to them by line number.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "lineNo",
                      type: "number",
                      required: true,
                      min: 1,
                      label: "#",
                      admin: { description: "The line's position in the customer's list.", placeholder: "e.g. 3" },
                    },
                    {
                      name: "description",
                      type: "text",
                      required: true,
                      admin: {
                        description: "The item as the customer names it.",
                        placeholder: "e.g. Safety helmet, white, size L",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "product",
                      type: "relationship",
                      relationTo: "products",
                      admin: {
                        description: "Match it to a catalogue product to reuse suppliers and prices.",
                        placeholder: "Search products",
                      },
                    },
                    {
                      name: "brand",
                      type: "text",
                      admin: { description: "The brand the customer asks for.", placeholder: "e.g. Jotun" },
                    },
                    {
                      name: "exactBrand",
                      type: "checkbox",
                      label: "Exact brand / part only",
                      defaultValue: false,
                      admin: { description: "Tick when only this brand or part number is acceptable." },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "model",
                      type: "text",
                      admin: { description: "The model or type of the item.", placeholder: "e.g. HEMPEL 45880" },
                    },
                    {
                      name: "partNo",
                      type: "text",
                      label: "Part no.",
                      admin: { description: "The maker's part number.", placeholder: "e.g. 4410-2203" },
                    },
                    {
                      name: "impa",
                      type: "text",
                      label: "IMPA",
                      admin: {
                        description: "The IMPA code, the standard marine stores number.",
                        placeholder: "e.g. 150101",
                      },
                    },
                    {
                      name: "issa",
                      type: "text",
                      label: "ISSA",
                      admin: {
                        description: "The ISSA code, the ship chandlers' catalogue number.",
                        placeholder: "e.g. 41.01.01",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "qty",
                      type: "number",
                      required: true,
                      min: 0,
                      admin: { description: "How many units the customer wants.", placeholder: "e.g. 12" },
                    },
                    {
                      name: "unit",
                      type: "select",
                      options: UNITS,
                      required: true,
                      admin: { description: "The unit the quantity is counted in.", placeholder: "e.g. pcs" },
                    },
                    {
                      name: "packSize",
                      type: "number",
                      min: 0,
                      label: "Base units per unit",
                      defaultValue: 1,
                      admin: {
                        description: "How many base units one unit holds, such as 12 per carton.",
                        placeholder: "e.g. 12",
                      },
                    },
                    {
                      name: "store",
                      type: "select",
                      options: STORES,
                      admin: {
                        description: "Which store department the item belongs to.",
                        placeholder: "Pick a store",
                      },
                    },
                  ],
                },
                {
                  name: "certificates",
                  type: "text",
                  label: "Certificates / requirements",
                  admin: {
                    description: "Papers or specs the customer needs with the goods.",
                    placeholder: "e.g. Class certificate, MSDS",
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "status",
                      type: "select",
                      options: LINE_STATUSES,
                      defaultValue: "Not sourced",
                      // In the tone of the bucket it counts in: ready, waiting, blocked, no offer.
                      custom: {
                        ...tones(Object.fromEntries(LINE_STATUSES.map((s) => [s, BUCKET_TONE[bucketOf(s)]]))),
                        about: "Each status counts as ready, waiting, blocked or no offer on the case's line bar.",
                      },
                      admin: {
                        description: "Where this line stands in sourcing and delivery.",
                        placeholder: "Pick a status",
                      },
                    },
                    {
                      name: "confidence",
                      type: "number",
                      min: 0,
                      max: 1,
                      label: "AI extraction confidence",
                      admin: {
                        readOnly: true,
                        description: "How sure the AI was when it read this line from the email.",
                      },
                    },
                    // How sure the AI was, as a share; amber under 85% (check it at the source).
                    rowComputed(
                      {
                        name: "aiRead",
                        type: "number",
                        label: "AI read",
                        admin: { description: "The AI's confidence as a percentage; amber under 85%." },
                        custom: {
                          ...formats.percent(0),
                          toneWhen: [{ when: { aiRead: { less_than: 85 } }, tone: "warning" }],
                        },
                      },
                      (l) => (typeof l.confidence === "number" ? Math.round(l.confidence * 100) : null),
                    ),
                  ],
                },
                {
                  name: "missing",
                  type: "text",
                  label: "Missing / unclear",
                  admin: {
                    description: "What is unclear on this line and must be asked.",
                    placeholder: "e.g. Size and colour",
                  },
                },
                {
                  name: "originalText",
                  type: "textarea",
                  admin: { readOnly: true, description: "Exactly as written by the customer." },
                },
                {
                  name: "selection",
                  type: "group",
                  label: "Selected offer",
                  admin: { description: "The offer chosen for this line and why." },
                  fields: [
                    {
                      name: "offers",
                      type: "relationship",
                      relationTo: "offers",
                      hasMany: true,
                      admin: { description: "More than one = split sourcing.", placeholder: "Search offers" },
                    },
                    {
                      name: "splitQty",
                      type: "array",
                      labels: { singular: "Split", plural: "Split quantities" },
                      admin: { description: "How the quantity is shared between offers." },
                      fields: [
                        {
                          type: "row",
                          fields: [
                            {
                              name: "offer",
                              type: "relationship",
                              relationTo: "offers",
                              required: true,
                              admin: {
                                description: "The offer that covers part of the quantity.",
                                placeholder: "Search offers",
                              },
                            },
                            {
                              name: "qty",
                              type: "number",
                              min: 0,
                              required: true,
                              admin: { description: "Units taken from this offer.", placeholder: "e.g. 6" },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "reason",
                      type: "textarea",
                      admin: {
                        description: "Required when the choice isn't the best-fit offer.",
                        placeholder: "e.g. Cheaper offer lacks the certificate",
                      },
                    },
                    {
                      name: "marginPct",
                      type: "number",
                      min: -50,
                      max: 90,
                      label: "Margin %",
                      access: { read: costVisible },
                      admin: { description: "Our margin on this line; hidden from Sales.", placeholder: "e.g. 18" },
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "customerAccepted",
                          type: "checkbox",
                          label: "Customer accepted alternative in writing",
                          defaultValue: false,
                          admin: { description: "Tick once the customer agreed to a substitute in writing." },
                        },
                        {
                          name: "acceptanceEvidence",
                          type: "upload",
                          relationTo: "media",
                          admin: { description: "The email or message where the customer agreed." },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "clarifications",
              type: "array",
              labels: { singular: "Clarification", plural: "Clarifications" },
              admin: { description: "Questions asked about the lines, and the answers." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "lineNo",
                      type: "number",
                      min: 1,
                      label: "Line #",
                      admin: { description: "The line the question is about.", placeholder: "e.g. 4" },
                    },
                    {
                      name: "to",
                      type: "select",
                      options: ["Customer", "Supplier", "Internal"],
                      defaultValue: "Customer",
                      admin: { description: "Who the question goes to.", placeholder: "Customer" },
                    },
                    {
                      name: "via",
                      type: "select",
                      options: ["Email", "Phone", "WhatsApp", "Supplier question"],
                      admin: { description: "How the question was sent.", placeholder: "Email" },
                    },
                  ],
                },
                {
                  name: "question",
                  type: "textarea",
                  required: true,
                  admin: {
                    description: "What we need to know, in one clear question.",
                    placeholder: "e.g. Is size 42 or 43 required?",
                  },
                },
                {
                  type: "row",
                  fields: [
                    { name: "askedAt", type: "date", admin: { description: "When the question was sent." } },
                    {
                      name: "askedBy",
                      type: "relationship",
                      relationTo: "users",
                      admin: { description: "The colleague who asked.", placeholder: "Search team" },
                    },
                  ],
                },
                {
                  name: "answer",
                  type: "textarea",
                  admin: { description: "The reply received.", placeholder: "e.g. Size 42, white." },
                },
                { name: "answeredAt", type: "date", admin: { description: "When the reply came in." } },
                // The answer, or "Waiting" (amber) while the question is open.
                rowComputed(
                  {
                    name: "reply",
                    type: "text",
                    label: "Answer",
                    admin: { description: "The answer, or Waiting while the question is open." },
                    custom: { toneWhen: [{ when: { answer: { exists: false } }, tone: "warning" }] },
                  },
                  (q) => scalar(q.answer) || "Waiting",
                ),
              ],
            },
          ],
        },
        {
          label: "Line status",
          fields: [
            {
              name: "lines",
              type: "group",
              label: "Line status (summary)",
              admin: { description: "Line counts used until the lines themselves are entered." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "ready",
                      type: "number",
                      defaultValue: 0,
                      min: 0,
                      admin: { description: "Lines ready to quote or order.", placeholder: "e.g. 4" },
                    },
                    {
                      name: "waiting",
                      type: "number",
                      defaultValue: 0,
                      min: 0,
                      admin: { description: "Lines waiting on a supplier or the customer.", placeholder: "e.g. 2" },
                    },
                    {
                      name: "blocked",
                      type: "number",
                      defaultValue: 0,
                      min: 0,
                      admin: { description: "Lines stuck on a missing detail.", placeholder: "e.g. 1" },
                    },
                    {
                      name: "noOffer",
                      type: "number",
                      label: "No offer",
                      defaultValue: 0,
                      min: 0,
                      admin: { description: "Lines no supplier has offered on yet.", placeholder: "e.g. 0" },
                    },
                  ],
                },
              ],
            },
            {
              name: "quoteLines",
              type: "array",
              labels: { singular: "Quote line", plural: "Quote lines" },
              admin: { description: "The lines as quoted to the customer." },
              fields: [
                {
                  name: "description",
                  type: "text",
                  required: true,
                  admin: {
                    description: "What the customer is quoted for.",
                    placeholder: "e.g. Safety helmet, white, size L",
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "qty",
                      type: "number",
                      min: 0,
                      admin: { description: "Units quoted.", placeholder: "e.g. 12" },
                    },
                    {
                      name: "unit",
                      type: "select",
                      options: ["pcs", "kg", "ltr", "set", "roll"],
                      admin: { description: "The unit the quantity is counted in.", placeholder: "e.g. pcs" },
                    },
                    {
                      name: "unitPrice",
                      type: "number",
                      label: "Unit price (USD)",
                      min: 0,
                      admin: { description: "The selling price per unit in US dollars.", placeholder: "e.g. 24.50" },
                    },
                  ],
                },
                {
                  name: "supplier",
                  type: "relationship",
                  relationTo: "suppliers",
                  admin: { description: "Who supplies this line.", placeholder: "Search suppliers" },
                },
              ],
            },
          ],
        },
        {
          label: "Pricing",
          fields: [
            {
              name: "pricing",
              type: "group",
              access: { read: costVisible },
              admin: { description: "How shared charges and the discount are priced; hidden from Sales." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "allocation",
                      type: "select",
                      label: "Shared charges allocated",
                      defaultValue: "value",
                      options: [
                        { label: "By line value", value: "value" },
                        { label: "By quantity", value: "qty" },
                        { label: "Equal per line", value: "lines" },
                      ],
                      admin: {
                        description: "How shared charges are split across the lines.",
                        placeholder: "By line value",
                      },
                    },
                    {
                      name: "discountPct",
                      type: "number",
                      label: "Customer discount %",
                      min: 0,
                      max: 50,
                      defaultValue: 0,
                      admin: {
                        description: "Discount given to the customer on the whole quote.",
                        placeholder: "e.g. 5",
                      },
                    },
                    {
                      name: "fxRateUSD",
                      type: "number",
                      label: "FX snapshot USD/EGP",
                      min: 0,
                      admin: { readOnly: true, description: "The dollar rate in EGP fixed when the case was priced." },
                    },
                  ],
                },
                {
                  name: "charges",
                  type: "array",
                  labels: { singular: "Shared charge", plural: "Shared charges" },
                  admin: { description: "Charges shared by the whole case, such as port fees." },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "label",
                          type: "text",
                          required: true,
                          admin: { description: "What the charge is for.", placeholder: "e.g. Port clearance" },
                        },
                        {
                          name: "amountEGP",
                          type: "number",
                          min: 0,
                          label: "Amount (EGP)",
                          admin: { description: "The estimated amount in Egyptian pounds.", placeholder: "e.g. 8,500" },
                        },
                        {
                          name: "status",
                          type: "select",
                          options: ["Estimate", "Confirmed", "Not applicable"],
                          defaultValue: "Estimate",
                          admin: {
                            description: "Whether the charge is a guess or confirmed.",
                            placeholder: "Estimate",
                          },
                        },
                        {
                          name: "actualEGP",
                          type: "number",
                          min: 0,
                          label: "Actual (EGP)",
                          admin: {
                            description: "What the charge actually cost in Egyptian pounds.",
                            placeholder: "e.g. 9,200",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Service",
          fields: [
            {
              name: "service",
              type: "group",
              label: "Spare-parts clearance & forwarding",
              admin: {
                condition: (data) => data?.caseType === "service",
                description: "Customs and forwarding for spare parts sent to a vessel.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "awb",
                      type: "text",
                      label: "AWB / B/L",
                      admin: {
                        description: "The air waybill or bill of lading number.",
                        placeholder: "e.g. 176-12345675",
                      },
                    },
                    {
                      name: "carrier",
                      type: "text",
                      admin: {
                        description: "The airline or shipping line carrying the parcel.",
                        placeholder: "e.g. Emirates SkyCargo",
                      },
                    },
                    { name: "arrival", type: "date", admin: { description: "When the shipment lands in Egypt." } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "customsDeclaration",
                      type: "text",
                      admin: { description: "The customs declaration number.", placeholder: "e.g. 2026/118452" },
                    },
                    {
                      name: "customsStatus",
                      type: "select",
                      options: ["Documents pending", "Submitted", "Released", "Held by customs"],
                      admin: { description: "Where customs clearance stands.", placeholder: "Pick a status" },
                    },
                    { name: "releasedAt", type: "date", admin: { description: "When customs released the goods." } },
                  ],
                },
                {
                  name: "consolidateWith",
                  type: "relationship",
                  relationTo: "cases",
                  label: "Deliver together with case",
                  admin: {
                    description: "Another case whose delivery goes out with this one.",
                    placeholder: "e.g. GS-RFQ-0142",
                  },
                },
                {
                  name: "fees",
                  type: "array",
                  admin: { description: "Extra fees paid for clearance and forwarding." },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "label",
                          type: "text",
                          required: true,
                          admin: { description: "What the fee is for.", placeholder: "e.g. Customs duty" },
                        },
                        {
                          name: "amountUSD",
                          type: "number",
                          min: 0,
                          admin: { description: "The fee in US dollars.", placeholder: "e.g. 350" },
                        },
                        {
                          name: "atCost",
                          type: "checkbox",
                          label: "Re-billed at cost",
                          defaultValue: false,
                          admin: { description: "Tick when the fee is passed on without markup." },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "held",
              type: "group",
              label: "Held stores",
              admin: {
                condition: (data) => data?.caseType === "held",
                description: "Stores we keep for a vessel until it arrives.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "location",
                      type: "text",
                      admin: {
                        description: "Where in our warehouse the stores sit.",
                        placeholder: "e.g. Alexandria, rack B3",
                      },
                    },
                    { name: "receivedAt", type: "date", admin: { description: "When the stores arrived with us." } },
                    {
                      name: "freeDays",
                      type: "number",
                      min: 0,
                      defaultValue: 14,
                      admin: { description: "Days we hold the stores free of charge.", placeholder: "e.g. 14" },
                    },
                    {
                      name: "dailyChargeUSD",
                      type: "number",
                      min: 0,
                      defaultValue: 5,
                      admin: {
                        description: "The charge per day in US dollars once free days run out.",
                        placeholder: "e.g. 5",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "caseType",
      type: "select",
      options: CASE_TYPES,
      defaultValue: "rfq",
      admin: { position: "sidebar", description: "What kind of job this is.", placeholder: "Pick a case type" },
    },
    {
      name: "stage",
      type: "select",
      required: true,
      defaultValue: "New",
      options: STAGES,
      custom: tones({
        New: "info",
        Validating: "info",
        Sourcing: "info",
        "Awaiting supplier": "warning",
        "Comparing offers": "info",
        "Awaiting corrected offer": "warning",
        "Awaiting management approval": "warning",
        "Quotation submitted": "info",
        "Awaiting customer decision": "warning",
        "Revision requested": "warning",
        "Won — PO mismatch": "error",
        "Won — sales order confirmed": "success",
        Purchasing: "info",
        "Delivering (drop 1 of 2)": "info",
        Delivered: "success",
        "Invoiced — partially paid": "warning",
        "Customs clearance": "info",
        "Held for vessel": "warning",
        "Closed — settled": "success",
        "On hold": "error",
        Lost: "neutral",
        Expired: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: "Where the case is, from first email to settlement.",
        placeholder: "Pick a stage",
      },
    },
    {
      name: "decision",
      type: "select",
      label: "Customer decision",
      options: [...QUOTE_DECISIONS, "Partially won"],
      admin: {
        position: "sidebar",
        description: "The customer's answer on our quotation.",
        placeholder: "Pick a decision",
      },
    },
    {
      name: "wait",
      type: "select",
      label: "Waiting for",
      options: WAITS,
      custom: tones({
        "Awaiting supplier": "warning",
        "Awaiting corrected offer": "warning",
        "Awaiting internal approval": "warning",
        "Awaiting customer decision": "info",
        "Awaiting delivery or payment": "info",
      }),
      admin: {
        position: "sidebar",
        description: "What the case is waiting on right now.",
        placeholder: "Pick what it waits for",
      },
    },
    {
      name: "tone",
      type: "select",
      label: "Risk",
      defaultValue: "info",
      options: [
        { label: "Blocked", value: "danger" },
        { label: "At risk", value: "warn" },
        { label: "On track", value: "info" },
        { label: "Done", value: "ok" },
        { label: "Paused", value: "neutral" },
      ],
      custom: tones({ danger: "error", warn: "warning", info: "info", ok: "success", neutral: "neutral" }),
      admin: {
        position: "sidebar",
        description: "How worried we are about this case.",
        placeholder: "Pick a risk level",
      },
    },
    {
      name: "riskRank",
      type: "number",
      label: "Risk rank",
      admin: { hidden: true, readOnly: true, description: "0 blocked … 4 paused: what queues sort by." },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: { position: "sidebar", description: "The person responsible for the case.", placeholder: "Search team" },
    },
    {
      name: "backup",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: "Covers the case when the owner is away.",
        placeholder: "Search team",
      },
    },
    {
      name: "value",
      type: "number",
      label: "Value (USD)",
      min: 0,
      custom: formats.money("USD"),
      // The selling value: never for Sales (as everywhere else).
      access: { read: costVisible },
      admin: {
        position: "sidebar",
        description: "The selling value of the case in US dollars; hidden from Sales.",
        placeholder: "e.g. 18,500",
      },
    },
    {
      name: "urgent",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Tick for a case that must jump the queue." },
    },
    {
      name: "lostReason",
      type: "text",
      admin: {
        position: "sidebar",
        condition: (data) => data?.stage === "Lost",
        description: "Why we lost the case, for later review.",
        placeholder: "e.g. Customer chose a cheaper bid",
      },
    },
    {
      name: "sourceMessage",
      type: "relationship",
      relationTo: "intake-messages",
      admin: { position: "sidebar", readOnly: true, description: "The email this case was created from." },
    },
    {
      name: "closedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true, description: "When the case was settled and closed." },
    },
    // Worked out on read, the same on every screen that shows a case (never stored).
    computed(
      {
        name: "due",
        type: "text",
        label: "Due",
        // Red once the deadline has passed.
        custom: { toneWhen: [{ when: { deadline: { less_than: NOW } }, tone: "error" }] },
        admin: { position: "sidebar", description: "How long until the quote deadline." },
      },
      (c) => relativeDue(c.deadline),
    ),
    computed(
      {
        name: "vesselPort",
        type: "text",
        label: "Vessel · port",
        admin: { condition: () => false, description: "The vessel and its port on one line." },
      },
      (c) => [scalar(c.vessel), scalar(c.port)].filter(Boolean).join(" · "),
    ),
    // How far the lines are before the order (`lineCounts`): each count a bar of all of them, ready
    // in green (amber while any is blocked). Nothing for a case with no lines yet.
    computed(
      {
        name: "lineCount",
        type: "group",
        label: "Lines",
        admin: { condition: () => false, description: "How far the lines are before the order." },
        fields: [
          {
            name: "total",
            type: "number",
            label: "Lines",
            admin: { description: "How many lines the case has.", placeholder: "e.g. 6" },
          },
          {
            name: "ready",
            type: "number",
            label: "Ready",
            admin: { description: "Lines ready to quote or order.", placeholder: "e.g. 4" },
            custom: {
              gauge: { max: "lineCount.total" },
              toneWhen: [
                { when: { "lineCount.blocked": { greater_than: 0 } }, tone: "warning" },
                { when: {}, tone: "success" },
              ],
            },
          },
          ...LINE_GAUGES.map(([name, label, tone]) => ({
            name,
            type: "number" as const,
            label,
            admin: { description: `Lines that are ${label.toLowerCase()}.`, placeholder: "e.g. 1" },
            custom: { gauge: { max: "lineCount.total" }, toneWhen: [{ when: {}, tone }] },
          })),
          {
            name: "readyPct",
            type: "number",
            label: "Ready share",
            admin: { description: "Share of the lines that are ready.", placeholder: "e.g. 67" },
            custom: formats.percent(0),
          },
        ],
      },
      (c) => {
        const l = lineCounts(c);
        return l.total
          ? {
              total: l.total,
              ready: l.ready,
              waiting: l.waiting,
              blocked: l.blocked,
              noOffer: l.noOffer,
              readyPct: Math.round((l.ready / l.total) * 100),
            }
          : null;
      },
    ),
    // Under the ready count: of how many, and how many are blocked ("of 6 · 1 blocked").
    computed(
      {
        name: "lineNote",
        type: "text",
        label: "Lines",
        admin: { condition: () => false, description: "Of how many lines, and how many are blocked." },
      },
      (c) => {
        const l = lineCounts(c);
        return l.total ? [`of ${l.total}`, l.blocked ? `${l.blocked} blocked` : ""].filter(Boolean).join(" · ") : null;
      },
    ),
    computed(
      {
        name: "flag",
        type: "select",
        label: "Urgency",
        options: ["Urgent"],
        custom: tones({ Urgent: "error" }),
        admin: { condition: () => false, description: "Shows Urgent when the case is marked urgent." },
      },
      (c) => (c.urgent === true ? "Urgent" : null),
    ),
    // Whether the person reading may hand it over (the "Reassign" action).
    computed(
      {
        name: "canReassign",
        type: "checkbox",
        admin: { condition: () => false, description: "Whether the reader may hand this case over." },
      },
      (c, req) => mayReassign(c, req.user as Reader),
    ),
    // Who it can be handed to: the desk without its owner, the backup marked.
    computed(
      {
        name: "handoverTeam",
        type: "json",
        admin: { condition: () => false, description: "The people this case can be handed to." },
      },
      async (c, req) =>
        (await desk(req))
          .filter((u) => u.id !== idOf(c.owner))
          .map((u) => ({ label: `${scalar(u.name)}${u.id === idOf(c.backup) ? " (backup)" : ""}`, value: u.id })),
    ),
  ],
};
