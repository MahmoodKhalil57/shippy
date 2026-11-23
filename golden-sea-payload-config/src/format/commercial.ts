import type {
  Action,
  Cell,
  Doc,
  DocumentSpec,
  Figure,
  KindData,
  Row,
  Tone,
  WidgetScope,
} from "saastemlycrm-design-system/contracts";
import type {
  CmpLine,
  CmpOffer,
  CmpPart,
  CompareWithDrafts,
  CorrectionDraft,
  Pricing,
  QuoteView,
} from "../endpoints/commercial.ts";
import * as link from "../links.ts";

/**
 * The commercial side of a case, read for the widgets that show it: its offers compared (with the
 * AI-drafted correction requests), its pricing, and a quotation as the customer receives it, with
 * its approvals, versions and decision. Pure: data in (../endpoints/commercial.ts's answers), what
 * a kind draws out. First the formats they share: EGP rounded to the pound, amounts in the
 * supplier's or the quote's currency, percentages and short dates.
 */

export const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
export const amount = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
/** An amount in its currency: EGP rounded, any other with `d` decimals. */
export const priced = (n: number, currency: string, d = 2) =>
  currency === "EGP" ? egp(n) : `${currency} ${amount(n, d)}`;
export const pct = (n: number) => `${n.toFixed(1)}%`;
/** "17 Nov" (with the time: "17 Nov, 09:30"), in UTC. */
export const shortDay = (iso: string, time = false) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
        timeZone: "UTC",
      })
    : "—";

/** How a case's shared charges (launch, freight, bank charges…) are spread over its lines. */
export const ALLOCATION = [
  { label: "By line value", value: "value" },
  { label: "By quantity", value: "qty" },
  { label: "Equal per line", value: "lines" },
];

/* ------------------------------------------------------------------ shared */

type Option = { value: string; label: string };

/**
 * A tile that is only a choice of a screen parameter (`param`): its options from the data, the
 * current one from the URL (`fallback` until one is chosen).
 */
export const paramChoice =
  <T>(param: string, label: string, options: (d: T) => Option[], fallback: string) =>
  (d: T, { params }: WidgetScope): KindData<"actions"> => ({
    choice: { param, label, value: params[param] ?? fallback, options: options(d) },
    items: [],
  });

/** A row's checks as marks: each flag in its tone, or one `ok` mark when there is none. */
export const checkMarks = (flags: { text: string; tone: Tone }[], ok: string): { text: string; tone: Tone }[] =>
  flags.length ? flags.map((f) => ({ text: f.text, tone: f.tone })) : [{ text: ok, tone: "success" }];

/** An email someone reads before it goes: who it's to, its subject and body. */
export const email = (to: string, subject: string, body: string): KindData<"message"> => ({
  meta: [`To: ${to}`],
  subject,
  body,
});

/** A quotation's customer copy (its preview tab). */
export const quoteLink = (id: string, label: string): Action => ({
  label,
  href: link.doc("quotations", id, "preview"),
});

/* ------------------------------------------------------------- the offers */

type Mode = "unit" | "landed";
const modeOf = (params: Record<string, string>): Mode => (params.by === "landed" ? "landed" : "unit");
const metric = (o: CmpOffer, mode: Mode) => (mode === "unit" ? o.unitPerBase : o.landedPerBase);

const BEST = "This is the best-fit choice. A reason is optional.";
const NOT_BEST = "Not the best-fit offer: give a reason. It's kept on the case and shown to the approver.";
const reason = (required: boolean) => ({
  type: "textarea",
  name: "reason",
  label: "Reason",
  required,
  admin: { placeholder: "e.g. Delta is our approved helmet supplier; Nile only has 10 in stock" },
});

/**
 * Selecting an offer is internal and reversible (the endpoint answers with `undo`: the line's
 * selection as it was), so the best-fit offer is one press with Undo in the snackbar. Off the
 * best fit, the form stays: it asks for the reason the approver reads.
 */
function selectOne(base: string, line: CmpLine, o: CmpOffer, sole: boolean): Action {
  const best = o.id === line.best;
  const call = { path: `${base}/select`, body: { lineNo: line.lineNo, parts: [{ offer: o.id, qty: line.qty }] } };
  if (best)
    return {
      label: sole ? "Selected" : "Select",
      disabled: sole,
      call,
      done: `Line ${line.lineNo}: ${o.supplier} selected (best fit)`,
    };
  return {
    label: sole ? "Selected" : "Select",
    disabled: sole,
    call,
    confirm: {
      heading: `Line ${line.lineNo}: select offer`,
      text: [
        `${line.description} · requested ${line.requested}`,
        `${o.supplier} v${o.version} × ${line.qty} ${line.unit} · ${egp(o.landedPerBase * line.baseQty)} landed`,
        best ? BEST : NOT_BEST,
      ].join("\n"),
      label: "Save selection",
    },
    fields: [reason(!best)],
    done: `Line ${line.lineNo}: selection saved to the case.`,
  };
}

function split(base: string, line: CmpLine, label: string, parts: CmpPart[], best: boolean): Action {
  const offer = (p: CmpPart) => line.offers.find((o) => o.id === p.offer)!;
  const per = line.baseQty / line.qty;
  return {
    label,
    call: { path: `${base}/split`, body: { lineNo: line.lineNo, offers: parts.map((p) => p.offer) } },
    confirm: {
      heading: `Line ${line.lineNo}: split sourcing`,
      text: [
        `${line.description} · requested ${line.requested}`,
        `The quantities add up to ${line.qty} ${line.unit}.`,
        best
          ? BEST
          : "If this isn't the recommended split, give a reason: it's kept on the case and shown to the approver.",
      ].join("\n"),
      label: "Save selection",
    },
    fields: [
      ...parts.map((p, i) => {
        const o = offer(p);
        return {
          type: "number",
          name: `q${i}`,
          label: `Quantity from ${o.supplier}`,
          min: 0,
          defaultValue: p.qty,
          admin: {
            description: `${o.supplier} v${o.version} · ${amount(o.landedPerBase)} EGP / ${line.baseUnit} landed · up to ${Math.floor(o.baseQty / per)} ${line.unit}`,
          },
        };
      }),
      reason(false),
    ],
    done: `Line ${line.lineNo}: selection saved to the case.`,
  };
}

function offerRows(base: string, line: CmpLine, mode: Mode): Row[] {
  const selected = new Map(line.selection.parts.map((p) => [p.offer, p.qty]));
  const sorted = [...line.offers].sort(
    (a, b) => Number(a.blocked) - Number(b.blocked) || metric(a, mode) - metric(b, mode),
  );
  return sorted.map((o, rank): Row => {
    const isSelected = selected.has(o.id);
    const sole = selected.size === 1 && isSelected;
    const tags = [
      ...(o.kind === "stock" ? [{ label: "Own stock", tone: "success" as const }] : []),
      ...(o.kind === "agency" ? [{ label: "Agency", tone: "info" as const }] : []),
      ...(o.id === line.best ? [{ label: "Best fit", tone: "success" as const }] : []),
      ...(mode === "unit" && o.id === line.cheapestUnit && o.id !== line.best
        ? [{ label: "Cheapest unit price", tone: "warning" as const }]
        : []),
      ...(isSelected
        ? [{ label: `Selected${selected.size > 1 ? ` × ${selected.get(o.id)}` : ""}`, tone: "primary" as const }]
        : []),
    ];
    const actions: Action[] = [];
    if (!o.blocked) actions.push(selectOne(base, line, o, sole));
    const accepted = o.needsAcceptance && isSelected && line.selection.customerAccepted;
    if (o.needsAcceptance && isSelected && !line.selection.customerAccepted)
      actions.push({
        label: "Record customer acceptance",
        call: { path: `${base}/accept`, body: { lineNo: line.lineNo } },
        confirm: {
          heading: "Record customer acceptance",
          text: `Line ${line.lineNo} uses an alternative pack. The quotation can only show it as accepted with the customer's written confirmation.`,
          label: "Record acceptance",
        },
        fields: [
          {
            type: "textarea",
            name: "note",
            label: "Evidence",
            required: true,
            defaultValue: "Customer email 17 Nov 10:12 — “500 ml cans OK”, attached",
          },
        ],
        done: `Line ${line.lineNo}: customer acceptance recorded.`,
      });
    const leadLate = o.flags.some((f) => f.type === "Lead time vs ETA" && f.tone === "error");
    const checks: Cell = {
      text: "",
      marks: checkMarks(o.flags, "No issues"),
      tags: accepted ? [{ label: "Customer accepted in writing", tone: "success" }] : undefined,
      actions: actions.length ? actions : undefined,
    };
    return {
      supplier: { text: `${o.supplier} v${o.version}`, strong: !o.superseded, tags },
      note: o.supplierNote,
      offered: o.offered,
      coverage: {
        text: `${Math.round(o.coverage * 100)}% of requested${o.expiry ? ` · exp. ${o.expiry}` : ""}`,
        tone: o.coverage < 1 ? "warning" : undefined,
      },
      price: priced(o.price, o.currency),
      priceNote: `per ${o.per} · total ${egp(o.goodsEGP)}`,
      metric: { text: amount(metric(o, mode)), strong: true, tone: rank === 0 && !o.blocked ? "success" : undefined },
      metricNote:
        mode === "landed"
          ? `${o.freightEGP ? `+ ${egp(o.freightEGP)}` : "no freight"} · ${o.freightNote}`
          : `landed ${amount(o.landedPerBase)}`,
      lead: { text: `${o.leadDays} d`, tone: leadLate ? "error" : undefined },
      ready: `ready ${shortDay(o.readyBy)}`,
      terms: `${o.validUntil ? `Valid to ${shortDay(o.validUntil)}` : "No expiry"} · ${o.terms || "—"}`,
      basis: o.basis,
      checks,
    };
  });
}

/** The recommendation over the offers: a split, the best-fit offer, or why there is none. */
function recommendation(line: CmpLine) {
  const best = line.offers.find((o) => o.id === line.best);
  if (line.split)
    return {
      tone: "success" as const,
      heading: "Recommendation · Suggested",
      text: `Split sourcing: ${line.split.text} — ${egp(line.split.costEGP)} landed${
        line.split.savesEGP ? `, saves ${egp(line.split.savesEGP)} vs the best single supplier` : ""
      }, all before ETA.`,
    };
  if (best)
    return {
      tone: "success" as const,
      heading: "Recommendation · Suggested",
      text: `${best.supplier} v${best.version}: ${amount(best.landedPerBase)} EGP / ${line.baseUnit} landed — lowest cost on board among offers that pass every check.`,
    };
  if (line.offers.length)
    return { tone: "warning" as const, text: "No offer passes every check yet — no recommendation." };
  return null;
}

/**
 * "Compare by": unit price or landed cost, the screen's `by` parameter that steers every line's
 * ranking.
 */
export const compareBy = paramChoice<CompareWithDrafts>(
  "by",
  "Compare by",
  () => [
    { value: "unit", label: "Unit price" },
    { value: "landed", label: "Landed cost" },
  ],
  "unit",
);

/**
 * A requested line's offers (a tile per line): ranked by unit price or landed cost ("Compare by",
 * the `by` parameter: the cheapest unit price is not always the cheapest on board), own Alexandria
 * stock and agency pricelists next to supplier offers, the checks that block or flag an offer, the
 * recommendation, and the selection (one offer or a split), with a reason when it isn't the best
 * fit.
 */
export const lineOffers = (line: CmpLine, c: CompareWithDrafts, { params }: WidgetScope): KindData<"table"> => {
  const mode = modeOf(params);
  const base = `/commercial/cases/${encodeURIComponent(c.id)}`;
  const name = (id: string) => line.offers.find((o) => o.id === id)?.supplier ?? id;
  const selected = line.selection.parts.map((p) => `${name(p.offer)} × ${p.qty}`).join(" + ");
  const open = line.offers.filter((o) => !o.blocked);
  const recommended = recommendation(line);
  return {
    head: { tags: [{ label: line.status, tone: line.statusTone }] },
    note: [
      `Requested: ${line.requested} · ${line.rules}`,
      selected
        ? `Selected: ${selected}${line.selection.reason ? ` · ${line.selection.reason}` : ""}${
            line.selection.inferred ? " (from the line status)" : ""
          }`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    alerts: [
      ...(line.missing
        ? [
            {
              tone: "warning" as const,
              text: `Not sent to suppliers yet: ${line.missing}. Waiting for the customer's answer.`,
            },
          ]
        : []),
      ...(recommended ? [recommended] : []),
    ],
    empty: "No offers yet.",
    columns: [
      { key: "supplier", label: "Supplier", supporting: "note" },
      { key: "offered", label: "Offered", supporting: "coverage" },
      { key: "price", label: "Price (as offered)", supporting: "priceNote" },
      {
        key: "metric",
        label: mode === "unit" ? `Unit price · EGP / ${line.baseUnit}` : `Landed · EGP / ${line.baseUnit}`,
        supporting: "metricNote",
      },
      { key: "lead", label: "Lead", supporting: "ready" },
      { key: "terms", label: "Valid · terms · basis", supporting: "basis" },
      { key: "checks", label: "Checks" },
    ],
    rows: offerRows(base, line, mode),
    actions:
      line.split || open.length > 1
        ? [
            ...(line.split ? [split(base, line, "Use suggested split", line.split.parts, true)] : []),
            split(
              base,
              line,
              "Split across suppliers…",
              open.map((o) => ({ offer: o.id, qty: line.split?.parts.find((p) => p.offer === o.id)?.qty ?? 0 })),
              false,
            ),
          ]
        : undefined,
  };
};

/** A line's current offers (not superseded), at most six: what the AI check reads. */
export const currentOffers = (l: CmpLine) => l.offers.filter((o) => !o.superseded).slice(0, 6);

/**
 * An on-device second look at a line's offers against the customer's request: things to check
 * (same product, brand or approved equivalent, unit and pack size), never a verdict.
 */
export const offerCheck = (line: CmpLine): KindData<"custom"> => {
  const offers = currentOffers(line);
  return {
    element: "ui-ai-check",
    key: `L${line.lineNo}`,
    props: {
      label: "Check offers against the request",
      text: [
        `Requested: ${line.description} — ${line.requested}. Rules: ${line.rules}.`,
        ...offers.map(
          (o, i) => `Offer ${i + 1} from ${o.supplier}: ${o.offered}. Supplier note: ${o.supplierNote || "none"}.`,
        ),
      ].join("\n"),
      questions: offers.map((o, i) => ({
        id: `offer${i + 1}`,
        prompt: `Does offer ${i + 1} (${o.supplier}) match the requested item: the same product, brand or an approved equivalent, unit and pack size?`,
        yes: `${o.supplier}: matches the request`,
        no: `${o.supplier}: may differ from the request — check`,
      })),
    },
  };
};

/**
 * A line's suppliers asked who haven't offered it (yet): still due, declined, or a partial reply
 * that left the line out (a follow-up is drafted).
 */
export const askedNoOffer = (line: CmpLine): KindData<"list"> => ({
  items: line.others.map((o) => ({
    headline: o.supplier,
    supporting: o.note,
    dot: o.tone,
    tags: [{ label: o.status, tone: o.tone }],
  })),
});

/** An offer with its AI-drafted correction request. */
export type Correction = { offer: CmpOffer; draft: CorrectionDraft };

/** The offers that deviate in a way the supplier can fix, each with its drafted correction request. */
export const corrections = (c: CompareWithDrafts): Correction[] =>
  c.lines.flatMap((l) =>
    l.offers.flatMap((o) => (o.correctable && c.drafts[o.id] ? [{ offer: o, draft: c.drafts[o.id]! }] : [])),
  );

/**
 * An AI-drafted correction request for an offer the supplier can fix: a person reads it and sends
 * it. The offer stays blocked until a corrected version arrives; v1 stays on the case for audit.
 */
export const correctionRequest = ({ offer: o, draft: d }: Correction, c: CompareWithDrafts): KindData<"message"> => ({
  head: {
    tags: [
      { label: "AI draft", tone: "primary", icon: "sparkles" },
      { label: d.status, tone: d.sent ? "success" : "warning" },
    ],
  },
  note: "The client is never named to the supplier. v1 stays on the case for audit; only a corrected version can be priced.",
  ...email(d.to, d.subject, d.body),
  assist: true,
  actions: d.sent
    ? undefined
    : [
        {
          label: "Send to supplier",
          main: true,
          call: {
            path: `/commercial/cases/${encodeURIComponent(c.id)}/correction`,
            body: { offer: o.id, send: true },
          },
          confirm: {
            heading: "Send the correction request?",
            text: `To ${d.to}: “${d.subject}”.`,
            label: "Send to supplier",
          },
          done: "Correction request sent. The offer stays blocked until a corrected version arrives.",
        },
      ],
});

/** Once the offers are selected, the case moves on to pricing. */
export const toPricing = (c: { id: string }): KindData<"actions"> => ({
  items: [{ label: "Continue to pricing", main: true, href: link.doc("cases", c.id, "pricing") }],
});

/**
 * How offers are compared: normalised to the requested base unit in EGP at the approved FX rate,
 * landed cost with the freight to the vessel's port, and how many lines are selected.
 */
export const howCompared = (c: CompareWithDrafts): KindData<"text"> => {
  const selected = c.lines.filter((l) => l.selection.parts.length).length;
  return {
    muted: true,
    text: `Each offer is checked against the original line and normalised to the requested base unit (EA / L / kg) in EGP at the approved FX rate, keeping the supplier's own units and currency. Landed cost adds the freight to ${c.port} (lane rates, import costs for agency lines). AI suggests matches and deviations; technical equivalence is a person's decision.`,
    tags: [
      { label: c.fxLabel, tone: "info" },
      { label: `ETA ${shortDay(c.eta)} · ${c.daysToEta} days` },
      { label: `${selected} of ${c.lines.length} lines selected`, tone: selected ? "success" : undefined },
    ],
  };
};

/* ------------------------------------------------------------- the pricing */

/** The pricing figures' labels, one tile each, in order (`pricingFigures`). */
export const PRICING_FIGURES = [
  "Landed cost (priced lines)",
  "Selling total (excl. VAT)",
  "Expected gross profit",
  "Recoverable input VAT",
  "Lines priced",
] as const;

/**
 * The case's price at a glance: landed cost, selling total, expected gross profit (red below
 * zero, amber under the policy minimum), recoverable input VAT and how many lines are priced, each
 * against its whole or target; until a line is priced, only how many lines are.
 */
export const pricingFigures = (P: Pricing): Figure<(typeof PRICING_FIGURES)[number]>[] => {
  const t = P.totals;
  const estimates = P.charges.filter((c) => c.status === "Estimate").length;
  const lines = P.rows.length + P.unpriced.length;
  const linesPriced: Figure<"Lines priced"> = {
    label: "Lines priced",
    value: `${P.rows.length} / ${lines}`,
    share: { value: lines ? P.rows.length / lines : 0, text: lines ? "of the lines" : "no lines requested yet" },
    note: P.unpriced.length ? `${P.unpriced.length} to follow as a revision` : "all lines priced",
  };
  // Nothing priced yet: only the lines (the others would all read zero, so they show "—").
  if (!t.landedEGP) return [linesPriced];
  return [
    {
      label: "Landed cost (priced lines)",
      value: egp(t.landedEGP),
      note: `incl. ${egp(P.chargesEGP)} shared charges · ${estimates ? `${estimates} estimate` : "all confirmed"}`,
      share: t.sellEGP ? { value: t.landedEGP / t.sellEGP, text: "of the selling price" } : undefined,
    },
    {
      label: "Selling total (excl. VAT)",
      value: priced(t.sellQuote, P.currency, 0),
      note: `${egp(t.sellEGP)} at ${P.currency}/EGP ${P.fx.toFixed(2)}${P.discountPct ? ` · after ${P.discountPct}% discount` : ""}`,
      share: t.sellEGP
        ? { value: Math.max(0, t.profitEGP) / t.sellEGP, text: `${pct(t.marginPct)} of it is profit` }
        : undefined,
    },
    {
      label: "Expected gross profit",
      value: egp(t.profitEGP),
      note: `Margin ${pct(t.marginPct)} · markup ${pct(t.markupPct)}`,
      tone: t.profitEGP < 0 ? "error" : t.marginPct < P.policy.minPct ? "warning" : "success",
      share: {
        value: Math.max(0, t.marginPct) / P.policy.targetPct,
        text: `margin against the ${P.policy.targetPct}% target`,
      },
    },
    {
      label: "Recoverable input VAT",
      value: egp(t.inputVatEGP),
      note: "14% on local supplier bills — excluded from cost",
      share: t.landedEGP ? { value: t.inputVatEGP / t.landedEGP, text: "on top of landed cost" } : undefined,
    },
    linesPriced,
  ];
};

/**
 * What Sales sees instead of the pricing (refused them): why, and the case's latest quotation,
 * which carries the selling prices only.
 */
export const pricingForSales = ({ docs }: { docs: Doc[] }): KindData<"actions"> => ({
  note: "Soaad Amer (Sales) sees selling prices on the quotation; supplier costs, landed costs and margins are restricted to supply chain, finance and management.",
  items: docs[0] ? [quoteLink(docs[0].id, "View quotation")] : [],
});

/** The margin and markup figures' labels, one tile each, in order (`marginVsMarkup`). */
export const MARGIN_FIGURES = ["Margin = profit ÷ selling price", "Markup = profit ÷ landed cost"] as const;

/**
 * The same profit read two ways, each a figure of its own: margin (on the selling price, what the
 * policy is set on) and markup (on landed cost), so nobody prices "cost + 25%" thinking it is a
 * 25% margin. Until a line is priced, both show "—".
 */
export const marginVsMarkup = (P: Pricing): Figure<(typeof MARGIN_FIGURES)[number]>[] => {
  const t = P.totals;
  if (!t.landedEGP) return [];
  return [
    {
      label: "Margin = profit ÷ selling price",
      value: pct(t.marginPct),
      note: `${egp(t.profitEGP)} ÷ ${egp(t.sellEGP)} · the policy is set on margin`,
      share: { value: Math.max(0, t.marginPct) / 100, text: `policy target ${P.policy.targetPct}%` },
    },
    {
      label: "Markup = profit ÷ landed cost",
      value: pct(t.markupPct),
      note: `${egp(t.profitEGP)} ÷ ${egp(t.landedEGP)} · a 25% margin is a 33.3% markup`,
      share: { value: Math.max(0, t.markupPct) / 100, text: "on top of landed cost" },
    },
  ];
};

const flagTone = (x: string) => (/negative|expired|misses/i.test(x) ? ("error" as const) : ("warning" as const));

/**
 * Where the pricing breaks the pricing policy (a margin under the minimum, an expired offer, a
 * missed ETA…): each goes to the approver with the request. None: within policy.
 */
export const policyChecks = (P: Pricing): KindData<"list"> => ({
  items: P.exceptions.length
    ? P.exceptions.map((x) => ({ headline: x, dot: flagTone(x) }))
    : [{ headline: "Within policy.", dot: "success" as const }],
});

/**
 * The quotation's approval: every customer quotation, discount above the policy and margin
 * exception goes to Karim Balbaa. "Request approval" snapshots the quotation and creates the
 * approval, with the exceptions; nothing reaches the customer until it's approved and sent.
 */
export const pricingApproval = (P: Pricing): KindData<"actions"> => {
  const q = P.quotation;
  const a = P.approval;
  const pending = Boolean(a && !["Approved", "Rejected"].includes(a.status));
  const request: Action = {
    label: "Request approval",
    main: true,
    disabled: pending || !P.rows.length,
    call: { path: `/commercial/cases/${encodeURIComponent(P.id)}/request-approval` },
    confirm: {
      heading: "Request approval",
      text: [
        `Creates the customer quotation (${P.rows.length} priced lines, ${priced(P.totals.sellQuote, P.currency)} excl. VAT, margin ${pct(P.totals.marginPct)}) and a ${P.approvalType} approval for Karim Balbaa. Nothing is sent to the customer until it's approved and someone sends it.`,
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
  return {
    note: `Rule: every customer quotation, discounts above ${P.policy.maxDiscountPct}% and margin exceptions go to Karim Balbaa. Exceptions travel with the request.`,
    alerts: [
      P.exceptions.length
        ? {
            tone: "warning" as const,
            text: `${P.exceptions.length} exception${P.exceptions.length === 1 ? "" : "s"} — shown to the approver as “${P.approvalType}”.`,
          }
        : { tone: "success" as const, text: "No exceptions — standard approval." },
      ...(a?.status === "Approved"
        ? [{ tone: "success" as const, text: `${q?.number} approved — ready to send.` }]
        : a?.status === "Rejected"
          ? [{ tone: "error" as const, text: `${q?.number} was returned. Adjust the pricing and request again.` }]
          : pending
            ? [{ tone: "info" as const, text: `${a!.title} · ${a!.status}. Karim Balbaa decides in Approvals.` }]
            : []),
    ],
    items: [
      ...(q ? [quoteLink(q.id, `Preview ${q.number}`)] : []),
      ...(pending ? [{ label: "Open approvals", href: "/approvals" }] : []),
      request,
    ],
  };
};

/**
 * The pricing levers: how shared charges are spread, the customer discount and each line's
 * margin, under the pricing policy (target, minimum, the discount that needs approval).
 */
export const pricingLevers = (P: Pricing): KindData<"form"> => ({
  head: { actions: [{ label: "Pricing policy", href: link.global("pricing-policy") }] },
  note: `Policy: target ${P.policy.targetPct}%, minimum ${P.policy.minPct}% (per store where set), discounts above ${P.policy.maxDiscountPct}% need approval. ${P.fxLabel}.`,
  save: { path: `/commercial/cases/${encodeURIComponent(P.id)}/pricing` },
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
});

/**
 * Each priced line from supplier cost to selling price: shared charges added, landed cost, margin
 * against the policy (amber under the minimum) next to its markup, the selling price in the quote
 * currency and the checks. Lines with no cost yet are named: they follow as a revision.
 */
export const linePricing = (P: Pricing): KindData<"table"> => {
  const cur = P.currency;
  return {
    note: P.unpriced.length
      ? P.unpriced
          .map((u) => `L${u.lineNo} · ${u.description} — ${u.status}: no cost yet, excluded from this version.`)
          .join("\n")
      : undefined,
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
    rows: P.rows.map((r): Row => ({
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
      sell: { text: priced(r.sellQuote, cur), strong: true },
      sellEGP: egp(r.sellEGP),
      unit: amount(r.unitQuote),
      qty: `× ${r.quoteQty} ${r.quoteUnit}`,
      checks: { text: "", marks: checkMarks(r.checks, "OK") },
    })),
  };
};

/** Each line's selling price stacked from what makes it: supplier cost, shared charges, gross profit. */
export const priceBuildUp = (P: Pricing): KindData<"chart"> => ({
  label: "Price build-up per line",
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
});

/**
 * The case's shared charges (launch, freight, bank charges…) and how they're spread: estimates
 * are marked until actuals replace them at close. VAT is expected at 0% for a vessel in transit.
 */
export const sharedCharges = (P: Pricing): KindData<"table"> => ({
  note: [
    `Allocated ${ALLOCATION.find((a) => a.value === P.allocation)?.label.toLowerCase()}. Estimates are marked; actuals replace them at close.`,
    "VAT: supply to a foreign vessel in transit is expected at 0% — finance confirms. The quotation shows prices excl. VAT.",
  ].join("\n"),
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
});

/* ----------------------------------------------------------- the quotation */

interface PortalRow {
  field: string;
  portal: string;
  quote: string;
  matches: boolean;
}

/** The portal confirmation compared field by field (none until a screenshot is checked). */
export const portalRows = (v: QuoteView) => (v.quotation.submission?.portalCheck as PortalRow[] | undefined) ?? [];

/**
 * For customers who buy through a procurement portal: the confirmation screenshot compared field
 * by field with the approved quotation by the AI. The submission is complete only when every
 * field matches.
 */
export const portalCheck = (v: QuoteView): KindData<"table"> => {
  const rows = portalRows(v);
  const diffs = rows.filter((r) => !r.matches);
  return {
    head: { tags: [{ label: "AI check", tone: "primary", icon: "sparkles" }] },
    note: "For customers who buy through a procurement portal: upload the confirmation screenshot and the AI compares it with the approved quotation. The submission is complete only when every field matches.",
    alerts: rows.length
      ? [
          diffs.length
            ? {
                tone: "warning" as const,
                text: `Not marked complete: ${diffs.map((r) => r.field.toLowerCase()).join(", ")} differ. Correct it in the portal or record the customer's agreement.`,
              }
            : { tone: "success" as const, text: "All fields match — submission complete." },
        ]
      : undefined,
    empty: "No screenshot compared yet.",
    columns: [
      { key: "field", label: "Field" },
      { key: "portal", label: "Portal" },
      { key: "quote", label: "Approved quote" },
      { key: "matches", label: "" },
    ],
    rows: rows.map((r) => ({
      field: r.field,
      portal: r.portal,
      quote: r.quote,
      matches: r.matches
        ? { text: "Match", tone: "success" as const, tag: true as const }
        : { text: "Difference", tone: "error" as const, tag: true as const },
    })),
    actions: [
      {
        label: rows.length ? "Check again" : "Upload screenshot & compare",
        call: { path: "/commercial/quotations/$doc.id/portal-check" },
      },
    ],
  };
};

/**
 * The customer copy's currency (`?currency=`): the quote currency or EGP at the approved rate. The
 * language is chosen on the copy itself (`customerCopy`).
 */
export const quoteCurrency = paramChoice<QuoteView>(
  "currency",
  "Currency",
  (v) => [
    { value: "quote", label: String(v.quotation.currency) },
    { value: "EGP", label: "EGP" },
  ],
  "quote",
);

const STEPS = ["Prepared", "Approval requested", "Approved", "Sent"];
const DECISIONS = ["Won", "Partially won", "Revision requested", "Lost"];
const WRITING = "formal shorter proofread translate";

const meOf = (user: WidgetScope["user"]) => (typeof user.name === "string" ? user.name : "");

function quoteActions(v: QuoteView, me: string): Action[] {
  const q = v.quotation;
  const data = "/commercial/quotations/$doc.id";
  const own = "/quote-preview/$doc.id";
  const out: Action[] = [];
  if (v.can.requestApproval)
    out.push({
      label: "Request approval",
      main: true,
      call: { path: `${data}/request-approval` },
      done: "Approval requested from Karim Balbaa.",
    });
  if (v.can.approve && v.approvalId) {
    const decide = `/commercial/approvals/${encodeURIComponent(v.approvalId)}/decide`;
    out.push(
      {
        label: "Return",
        tone: "error",
        call: { path: decide, body: { decision: "Reject" } },
        confirm: {
          heading: `Return ${q.number}`,
          text: `Return ${q.number} to the preparer. A reason is required and goes on the case timeline.`,
          label: "Return",
          tone: "error",
        },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: "Reason",
            required: true,
            admin: { placeholder: "e.g. Re-check line 3 — margin too thin for a new supplier" },
          },
        ],
        assist: { field: "reason", tools: WRITING },
        done: "Returned to the preparer with your reason.",
      },
      // Approving is internal and can be withdrawn until the quotation is sent: no dialog, the
      // snackbar offers Undo (the endpoint's `undo`). Sending is the step that asks first.
      {
        label: "Approve",
        main: true,
        call: { path: decide, body: { decision: "Approve" } },
        done: `Approved ${q.number} — it can be sent`,
      },
    );
  }
  if (v.can.send) {
    const portal = Boolean(v.case.portal && /portal/i.test(v.case.portal) && !/Nordvik/.test(v.case.customer));
    out.push({
      label: "Send to customer",
      main: true,
      call: { path: `${own}/send`, body: { to: v.case.email } },
      confirm: {
        heading: `Send ${q.number}`,
        text: [
          "AI draft · Nothing is sent until you confirm.",
          "",
          `Email from Odoo — To: ${v.case.email || "customer"} · Subject: Quotation ${q.number} — ${v.case.vessel} — ref. ${v.case.customerRef} · Attachment: ${q.number}.pdf`,
          `Customer portal — enter the quotation in ${v.case.portal || "the customer's portal"}, then upload the confirmation screenshot below — the submission is only complete when it matches the approved quote.`,
        ].join("\n"),
        label: "Send",
      },
      fields: [
        {
          type: "radio",
          name: "method",
          label: "Submission method",
          defaultValue: portal ? "portal" : "email",
          options: [
            { value: "email", label: "Email from Odoo" },
            { value: "portal", label: "Customer portal" },
          ],
        },
        {
          type: "textarea",
          name: "message",
          label: "Message",
          admin: { rows: 9 },
          defaultValue: [
            `Dear ${v.case.attention},`,
            "",
            `Please find attached our quotation ${q.number} for ${v.case.vessel} (your ref. ${v.case.customerRef || "—"}), delivery on board at ${v.case.port}.`,
            `Valid until ${shortDay(String(q.validUntil ?? ""))}. Prices exclude VAT.`,
            "",
            "Best regards,",
            me,
            "Golden Sea for Trading & Marketing",
          ].join("\n"),
        },
      ],
      assist: { field: "message", tools: WRITING },
      reply: true,
    });
  }
  if (v.can.decide)
    out.push({
      label: "Record customer decision",
      call: { path: `${own}/decision` },
      confirm: {
        heading: "Customer decision",
        text: `The customer's decision on ${q.number}. No response never means lost.`,
        label: "Record",
      },
      fields: [
        {
          type: "radio",
          name: "decision",
          label: "Decision",
          defaultValue: "Won",
          options: DECISIONS.map((d) => ({ value: d, label: d })),
        },
        {
          type: "textarea",
          name: "note",
          label: "Note (the lost reason, if lost)",
          admin: { placeholder: "e.g. PO NSM-PO-77231 received for lines 1–3" },
        },
      ],
      assist: { field: "note", tools: WRITING },
      reply: true,
    });
  if (v.can.revise)
    out.push({
      label: "Create revision",
      call: { path: `${own}/revise` },
      confirm: {
        heading: `Revise ${q.number}`,
        text: `Creates version ${(v.quotation.versions?.at(-1)?.version ?? 1) + 1} as a draft with the same lines; ${q.number} is kept for audit and marked superseded.`,
        label: "Create revision",
      },
      fields: [
        {
          type: "textarea",
          name: "reason",
          label: "What changes",
          admin: { placeholder: "e.g. Customer asked for ESAB on line 1" },
        },
      ],
      assist: { field: "reason", tools: WRITING },
      reply: true,
    });
  out.push({ label: "Print", print: true });
  return out;
}

/**
 * Where the quotation stands (prepared, approval requested, approved, sent, the customer's
 * decision) with what may be done next, by the rules: request approval, approve or return
 * (management only), send (a draft email someone confirms), record the customer's decision,
 * revise, print. Who is still to decide is the approvals collection's own `progress`.
 */
export const quoteDecision = (v: QuoteView, { user }: WidgetScope): KindData<"steps"> => {
  const q = v.quotation;
  const sub = q.submission;
  const said = [q.decision, sub?.submittedAt ? `sent ${shortDay(sub.submittedAt, true)} via ${sub.method}` : ""]
    .filter(Boolean)
    .join(" · ");
  const why = v.why.approve && v.approvalId && !v.can.approve ? v.why.approve : "";
  return {
    head: { actions: quoteActions(v, meOf(user)) },
    tags: [{ label: q.number, tone: "primary" }, { label: q.status }],
    note: [said, why].filter(Boolean).join("\n") || undefined,
    current: v.step,
    items: [...STEPS.map((label) => ({ label })), { label: v.step === 4 ? v.stepLabel : "Customer decision" }],
  };
};

type Lang = "en" | "ar";
interface QuoteLine {
  lineNo?: number;
  partNo?: string;
  description?: string;
  unit?: string;
  qty?: number;
  unitPrice?: number;
}

/** The customer-facing wording, in both languages. */
const T = {
  en: {
    title: "QUOTATION",
    no: "Quotation No.",
    ref: "Your ref",
    date: "Date",
    client: "Client Information",
    company: "Company",
    attention: "Attention",
    vessel: "Vessel",
    port: "Delivery port",
    intro: "We are pleased to furnish our quotation as below:",
    s: "S.",
    part: "Part Number",
    desc: "Description",
    uom: "UOM",
    qty: "QTY",
    price: (c: string) => `Price/${c}`,
    total: (c: string) => `Total/${c}`,
    grand: (c: string) => `Total in ${c}`,
    discount: (p: number) => `Less discount ${p}%`,
    remarks: "Remarks:",
    delivery: (port: string, eta: string) => `Delivery: on board at ${port} on arrival (${eta}).`,
    vat: "Prices are exclusive of Value Added Tax (VAT).",
    qtyRule: "QTY in the quote can’t be reduced; prices are based on the QTY listed.",
    valid: (d: string) => `Valid until ${d}; may be renewed thereafter upon mutual agreement.`,
    pay: (t: string) => `Payment terms: ${t}.`,
    wish: "Wish our offer wins your approvals ☺",
    prepared: "Prepared by",
    approved: "Approved by",
    issuer: "GOLDEN SEA",
    brand: "FOR TRADING & MARKETING · EST. 2011",
    draft: (v: number) => `DRAFT — not yet approved. Will be issued as version ${v}.`,
  },
  ar: {
    title: "عرض سعر",
    no: "رقم العرض",
    ref: "مرجعكم",
    date: "التاريخ",
    client: "بيانات العميل",
    company: "الشركة",
    attention: "عناية",
    vessel: "السفينة",
    port: "ميناء التسليم",
    intro: "يسعدنا أن نقدم لكم عرض أسعارنا كما يلي:",
    s: "م",
    part: "رقم القطعة",
    desc: "الوصف",
    uom: "الوحدة",
    qty: "الكمية",
    price: (c: string) => `السعر/${c}`,
    total: (c: string) => `الإجمالي/${c}`,
    grand: (c: string) => `الإجمالي بال${c}`,
    discount: (p: number) => `خصم ${p}%`,
    remarks: "ملاحظات:",
    delivery: (port: string, eta: string) => `التسليم: على متن السفينة في ${port} عند الوصول (${eta}).`,
    vat: "الأسعار لا تشمل ضريبة القيمة المضافة.",
    qtyRule: "لا يمكن تخفيض الكميات الواردة في العرض، والأسعار مبنية على الكميات المذكورة.",
    valid: (d: string) => `العرض سارٍ حتى ${d}، ويمكن تجديده بعد ذلك باتفاق الطرفين.`,
    pay: (t: string) => `شروط الدفع: ${t}.`,
    wish: "نتمنى أن ينال عرضنا موافقتكم ☺",
    prepared: "أعدّه",
    approved: "اعتمده",
    issuer: "GOLDEN SEA",
    brand: "للتجارة والتسويق · تأسست 2011",
    draft: (v: number) => `مسودة — لم تُعتمد بعد. ستصدر كنسخة ${v}.`,
  },
};

/** The customer's copy as a printable document (`document` kind), in its language and currency. */
function paper(v: QuoteView, lang: Lang, egpOn: boolean): DocumentSpec {
  const q = v.quotation;
  const t = T[lang];
  const day = shortDay;
  const cur = egpOn ? "EGP" : String(q.currency ?? "USD");
  const rate = egpOn ? v.fx : 1;
  const d = egpOn ? 0 : 2;
  const lines = ((q.lines as QuoteLine[] | undefined) ?? []).map((l, i) => ({
    s: String(i + 1).padStart(2, "0"),
    partNo: l.partNo ?? "",
    description: l.description ?? "",
    unit: l.unit ?? "",
    qty: String(l.qty ?? ""),
    price: amount((l.unitPrice ?? 0) * rate, d),
    total: amount((l.qty ?? 0) * (l.unitPrice ?? 0) * rate, d),
    sum: (l.qty ?? 0) * (l.unitPrice ?? 0) * rate,
  }));
  const gross = lines.reduce((s, l) => s + l.sum, 0);
  const discount = Number(q.discountPct) || 0;
  const total = gross * (1 - discount / 100);
  const draft = !["Approved", "Submitted"].includes(String(q.status)) && q.status !== "Superseded";
  const created = new Date(String(q.createdAt ?? "2026-11-17T09:30:00.000Z"));
  const ymd = `${String(created.getUTCDate()).padStart(2, "0")}/${String(created.getUTCMonth() + 1).padStart(2, "0")}/${created.getUTCFullYear()}`;
  return {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    notices: [
      ...(draft ? [{ tone: "warning" as const, text: t.draft(Number(q.version) || 1) }] : []),
      ...(q.status === "Superseded"
        ? [{ tone: "info" as const, text: "Superseded — kept for audit. Not valid for ordering." }]
        : []),
    ],
    issuer: { name: t.issuer, tagline: t.brand },
    title: t.title,
    meta: [
      { text: `${t.no}: ${q.number}`, accent: true },
      { text: `${t.ref}: ${v.case.customerRef || "—"}` },
      { text: `${t.date}: ${ymd}`, accent: true },
    ],
    party: {
      title: t.client,
      rows: [
        { label: t.company, value: v.case.customer },
        { label: t.attention, value: `${v.case.attention}${v.case.email ? ` · ${v.case.email}` : ""}` },
        { label: t.vessel, value: `${v.case.vessel}${v.case.imo ? ` (IMO ${v.case.imo})` : ""}` },
        { label: t.port, value: `${v.case.port} · ETA ${day(v.case.eta, true)}` },
      ],
    },
    intro: t.intro,
    columns: [
      { key: "s", label: t.s },
      { key: "partNo", label: t.part },
      { key: "description", label: t.desc, ltr: true },
      { key: "unit", label: t.uom, upper: true },
      { key: "qty", label: t.qty },
      { key: "price", label: t.price(cur) },
      { key: "total", label: t.total(cur) },
    ],
    lines: lines.map(({ sum: _sum, ...l }) => l),
    adjustments: discount ? [{ label: t.discount(discount), value: `− ${amount(gross - total, d)}` }] : [],
    total: { label: `${t.grand(cur)} (excl. VAT)`, value: amount(total, d) },
    totalNote: egpOn
      ? `Converted at ${q.currency}/EGP ${v.fx.toFixed(2)} (approved rate on the quotation).`
      : undefined,
    notes: {
      title: t.remarks,
      items: [
        t.delivery(v.case.port, day(v.case.eta)),
        t.vat,
        t.qtyRule,
        t.valid(day(String(q.validUntil ?? ""))),
        t.pay(String(q.paymentTerms ?? "—")),
        ...(q.remarks ? String(q.remarks).split("\n") : []),
      ],
      closing: t.wish,
    },
    footer: {
      start: `${t.prepared}: ${v.preparedBy || "—"}${v.approvedBy ? ` · ${t.approved}: ${v.approvedBy}` : ""}`,
      end: v.approvedBy ? `${v.approvedBy} — authorised signature` : "Signature on approval",
    },
    contact: ["+20 10 0000 0000 · Sales@goldensea.com.eg", "6th of October City, Giza Governorate · demo document"],
  };
}

/**
 * The customer's copy as Golden Sea's customer receives it, in its own printable layout: in the
 * chosen language (English, or Arabic right to left: the "Language" choice on it, `?lang=`) and
 * currency (`?currency=`), marked as a draft until approved and as superseded once revised.
 */
export const customerCopy = (v: QuoteView, { params }: WidgetScope): KindData<"document"> => {
  const lang: Lang = params.lang === "ar" ? "ar" : "en";
  return {
    choice: {
      param: "lang",
      label: "Language",
      value: lang,
      options: [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
      ],
    },
    ...paper(v, lang, params.currency === "EGP"),
  };
};
