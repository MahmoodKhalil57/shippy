import { block, type Action, type Row, type ViewBlock } from "../../app/widgets/schema.ts";
import { widget, widgets, type Source, type Widget } from "../../app/widgets/widget.ts";
import type { Pricing } from "../endpoints/commercial.ts";
import type { Doc } from "../../mock/types.ts";
import { amount, egp, money, pct } from "./case-compare.ts";

/**
 * Case tab "Pricing": the selected offers become landed costs (shared charges — launch, freight,
 * bank charges… — allocated by value, quantity or equally), a margin per line (shown next to its
 * markup), an optional customer discount and the selling price in the quote currency at the
 * approved FX rate. Policy checks come from the pricing-policy global; "Request approval"
 * snapshots the quotation and creates a real approval for Karim Balbaa. Sales is refused the
 * pricing (403) and sees why, with a link to the quotation. Data and actions:
 * /api/commercial/cases/:id/pricing and /request-approval (../endpoints/commercial.ts).
 */

const pricingOf: Source = { endpoint: "/commercial/cases/$doc.id/pricing" };
const on = (w: Widget<Pricing>): Widget<Pricing> => ({ source: pricingOf, ...w });
const base = (P: Pricing) => `/commercial/cases/${encodeURIComponent(P.id)}`;

const ALLOCATION = [
  { label: "By line value", value: "value" },
  { label: "By quantity", value: "qty" },
  { label: "Equal per line", value: "lines" },
];

const flagTone = (x: string) => (/negative|expired|misses/i.test(x) ? ("error" as const) : ("warning" as const));

const stats = on({
  skeleton: "stats",
  render: (P) => {
    const t = P.totals;
    const estimates = P.charges.filter((c) => c.status === "Estimate").length;
    return block("stats", {
      size: "md",
      items: [
        {
          label: "Landed cost (priced lines)",
          value: egp(t.landedEGP),
          note: `incl. ${egp(P.chargesEGP)} shared charges · ${estimates ? `${estimates} estimate` : "all confirmed"}`,
        },
        {
          label: `Selling total (${P.currency}, excl. VAT)`,
          value: money(t.sellQuote, P.currency, 0),
          note: `${egp(t.sellEGP)} at ${P.currency}/EGP ${P.fx.toFixed(2)}${P.discountPct ? ` · after ${P.discountPct}% discount` : ""}`,
        },
        {
          label: "Expected gross profit",
          value: egp(t.profitEGP),
          note: `Margin ${pct(t.marginPct)} · markup ${pct(t.markupPct)}`,
          tone: t.profitEGP < 0 ? "error" : t.marginPct < P.policy.minPct ? "warning" : "success",
        },
        {
          label: "Recoverable input VAT",
          value: egp(t.inputVatEGP),
          note: "14% on local supplier bills — excluded from cost",
        },
        {
          label: "Lines priced",
          value: `${P.rows.length} / ${P.rows.length + P.unpriced.length}`,
          note: P.unpriced.length ? `${P.unpriced.length} to follow as a revision` : "all lines priced",
        },
      ],
    });
  },
});

const lines = on({
  title: "Line pricing",
  skeleton: "table",
  head: () => ({ actions: [{ label: "Pricing policy", variant: "text", href: "/globals/pricing-policy" }] }),
  render: (P) => {
    const cur = P.currency;
    const rows = P.rows.map((r): Row => ({
      lineNo: `L${r.lineNo}`,
      description: { text: r.description, strong: true },
      sourcing: r.sourcing,
      cost: egp(r.costEGP),
      alloc: egp(r.allocEGP),
      landed: { text: egp(r.landedEGP), strong: true },
      margin: pct(r.marginPct),
      policy: {
        text: `target ${r.targetPct}% · min ${r.minPct}%`,
        tone: r.marginPct < r.minPct ? "warning" : undefined,
      },
      markup: pct(r.markupPct),
      sell: { text: money(r.sellQuote, cur), strong: true },
      sellEGP: egp(r.sellEGP),
      unit: amount(r.unitQuote),
      qty: `× ${r.quoteQty} ${r.quoteUnit}`,
      checks: {
        text: "",
        marks: r.checks.length
          ? r.checks.map((f) => ({ text: f.text, tone: f.tone }))
          : [{ text: "OK", tone: "success" }],
      },
    }));
    const blocks: ViewBlock[] = [
      block("text", {
        muted: true,
        text: `Policy: target ${P.policy.targetPct}%, minimum ${P.policy.minPct}% (per store where set), discounts above ${P.policy.maxDiscountPct}% need approval. ${P.fxLabel}.`,
      }),
      block("form", {
        save: { path: `${base(P)}/pricing` },
        value: {
          allocation: P.allocation,
          discountPct: P.discountPct,
          margins: Object.fromEntries(P.rows.map((r) => [String(r.lineNo), r.marginPct])),
        },
        fields: [
          {
            type: "row",
            name: "settings",
            fields: [
              { type: "select", name: "allocation", label: "Shared charges allocated", options: ALLOCATION },
              { type: "number", name: "discountPct", label: "Customer discount %", min: 0, max: 20 },
            ],
          },
          {
            type: "group",
            name: "margins",
            label: "Margin % per line",
            fields: [
              {
                type: "row",
                name: "lines",
                fields: P.rows.map((r) => ({
                  type: "number",
                  name: String(r.lineNo),
                  label: `Margin for line ${r.lineNo}`,
                  min: -50,
                  max: 90,
                  admin: { description: `target ${r.targetPct}% · min ${r.minPct}%` },
                })),
              },
            ],
          },
        ],
      }),
      block("table", {
        columns: [
          { key: "lineNo", label: "#" },
          { key: "description", label: "Line · selected supplier(s)", supporting: "sourcing" },
          { key: "cost", label: "Supplier cost", align: "end" },
          { key: "alloc", label: "+ Shared", align: "end" },
          { key: "landed", label: "Landed", align: "end" },
          { key: "margin", label: "Margin %", align: "end", supporting: "policy" },
          { key: "markup", label: "Markup", align: "end" },
          { key: "sell", label: `Sell (${cur})`, align: "end", supporting: "sellEGP" },
          { key: "unit", label: `Unit (${cur})`, align: "end", supporting: "qty" },
          { key: "checks", label: "Checks" },
        ],
        rows,
      }),
    ];
    if (P.unpriced.length)
      blocks.push(
        block("text", {
          muted: true,
          variant: "body-sm",
          text: P.unpriced
            .map((u) => `L${u.lineNo} · ${u.description} — ${u.status}: no cost yet, excluded from this version.`)
            .join("\n"),
        }),
      );
    return blocks;
  },
});

const marginVsMarkup = on({
  title: "Margin vs markup",
  skeleton: "stats",
  render: (P) => {
    const t = P.totals;
    return [
      block("text", { muted: true, text: "Same profit, two ways to read it — Golden Sea's policy is set on margin." }),
      block("stats", {
        size: "md",
        items: [
          {
            label: "Margin = profit ÷ selling price",
            value: pct(t.marginPct),
            note: `${egp(t.profitEGP)} ÷ ${egp(t.sellEGP)}`,
          },
          {
            label: "Markup = profit ÷ landed cost",
            value: pct(t.markupPct),
            note: `${egp(t.profitEGP)} ÷ ${egp(t.landedEGP)}`,
          },
        ],
      }),
      block("text", {
        muted: true,
        variant: "body-sm",
        text: "A 25% margin is a 33.3% markup: pricing “cost + 25%” would land at a 20% margin.",
      }),
    ];
  },
});

const buildUp = on({
  skeleton: "chart",
  render: (P) =>
    block("chart", {
      title: "Price build-up per line",
      subhead: "Supplier cost + shared charges + gross profit = selling price (EGP)",
      chart: {
        kind: "bars",
        stacked: true,
        labels: P.rows.map((r) => `L${r.lineNo}`),
        series: [
          { name: "Supplier cost", values: P.rows.map((r) => Math.round(r.costEGP)) },
          { name: "Shared charges", values: P.rows.map((r) => Math.round(r.allocEGP)) },
          { name: "Gross profit", values: P.rows.map((r) => Math.max(0, Math.round(r.profitEGP))) },
        ],
        format: { unit: "money", currency: "EGP" },
      },
    }),
});

const charges = on({
  title: "Shared charges",
  skeleton: "table",
  render: (P) => [
    block("text", {
      muted: true,
      text: `Allocated ${ALLOCATION.find((a) => a.value === P.allocation)?.label.toLowerCase()}. Estimates are marked; actuals replace them at close.`,
    }),
    block("table", {
      totals: true,
      columns: [
        { key: "label", label: "Charge" },
        { key: "status", label: "Status" },
        { key: "amount", label: "Amount", align: "end" },
      ],
      rows: [
        ...P.charges.map((c): Row => ({
          label: c.label,
          status: {
            text: c.status,
            tag: true,
            tone: c.status === "Estimate" ? "warning" : c.status === "Confirmed" ? "success" : "neutral",
          },
          amount: { text: egp(c.amountEGP), strong: true },
        })),
        { label: { text: "Total shared", strong: true }, amount: { text: egp(P.chargesEGP), strong: true } },
      ],
    }),
    block("text", {
      muted: true,
      variant: "body-sm",
      text: "VAT: supply to a foreign vessel in transit is expected at 0% — finance confirms. The quotation shows prices excl. VAT.",
    }),
  ],
});

const policy = on({
  title: "Policy checks",
  skeleton: "list",
  render: (P) =>
    P.exceptions.length
      ? block("list", { items: P.exceptions.map((x) => ({ headline: x, dot: flagTone(x) })) })
      : block("alert", { tone: "success", text: "Within policy." }),
});

const approval = on({
  title: "Approval",
  skeleton: "text",
  render: (P) => {
    const q = P.quotation;
    const a = P.approval;
    const pending = Boolean(a && !["Approved", "Rejected"].includes(a.status));
    const request: Action = {
      label: "Request approval from Karim Balbaa",
      variant: "filled",
      disabled: pending || !P.rows.length,
      call: { path: `${base(P)}/request-approval` },
      confirm: {
        heading: "Request approval",
        text: [
          `Creates the customer quotation (${P.rows.length} priced lines, ${money(P.totals.sellQuote, P.currency)} excl. VAT, margin ${pct(P.totals.marginPct)}) and a ${P.approvalType} approval for Karim Balbaa. Nothing is sent to the customer until it's approved and someone sends it.`,
          ...P.exceptions.map((x) => `• ${x}`),
        ].join("\n"),
        label: "Request approval",
      },
      fields: [
        {
          type: "textarea",
          name: "note",
          label: "Note for the approver",
          admin: { placeholder: "e.g. Helmets split to make the ETA; launch estimate confirmed tomorrow" },
        },
      ],
      done: "Approval requested from Karim Balbaa. He decides in Approvals.",
    };
    return [
      block("text", {
        muted: true,
        text: `Rule: every customer quotation, discounts above ${P.policy.maxDiscountPct}% and margin exceptions go to Karim Balbaa. Exceptions travel with the request.`,
      }),
      P.exceptions.length
        ? block("alert", {
            tone: "warning",
            text: `${P.exceptions.length} exception${P.exceptions.length === 1 ? "" : "s"} — shown to the approver as “${P.approvalType}”.`,
          })
        : block("alert", { tone: "success", text: "No exceptions — standard approval." }),
      ...(a?.status === "Approved"
        ? [block("alert", { tone: "success", text: `${q?.number} approved — ready to send.` })]
        : a?.status === "Rejected"
          ? [
              block("alert", {
                tone: "error",
                text: `${q?.number} was returned. Adjust the pricing and request again.`,
              }),
            ]
          : pending
            ? [block("alert", { tone: "info", text: `${a!.title} · ${a!.status}. Karim Balbaa decides in Approvals.` })]
            : []),
      block("actions", {
        items: [
          ...(q ? [{ label: `Preview ${q.number}`, href: `/collections/quotations/${q.id}/preview` }] : []),
          ...(pending ? [{ label: "Open approvals", href: "/approvals" }] : []),
          request,
        ],
      }),
    ];
  },
});

/**
 * What Sales sees instead (the pricing itself is refused them): why, and the latest quotation,
 * which carries the selling prices only.
 */
const forSales = widget<{ docs: Doc[] }>({
  title: "Costs and margins are hidden for your role",
  skeleton: "text",
  visible: ({ user }) => user.role === "sales",
  source: { find: "quotations", where: { case: { equals: "$doc.id" } }, sort: "-version", limit: 1, depth: 0 },
  render: ({ docs }) => [
    block("text", {
      muted: true,
      text: "Soaad Amer (Sales) sees selling prices on the quotation; supplier costs, landed costs and margins are restricted to supply chain, finance and management.",
    }),
    ...(docs[0]
      ? [
          block("actions", {
            items: [{ label: "View quotation", href: `/collections/quotations/${docs[0].id}/preview` }],
          }),
        ]
      : []),
  ],
});

export const casePricing = widgets({
  widgets: [
    forSales as Widget,
    stats,
    lines,
    { grid: [marginVsMarkup, buildUp], fit: "md" },
    { grid: [charges, policy, approval], fit: "md" },
  ],
});
