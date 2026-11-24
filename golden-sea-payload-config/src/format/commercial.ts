import {
  formatNumber,
  type Action,
  type Cell,
  type Doc,
  type DocumentSpec,
  type Figure,
  type KindData,
  type Row,
  type Tone,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import type {
  CmpLine,
  CmpOffer,
  CmpPart,
  CompareWithDrafts,
  CorrectionDraft,
  Pricing,
  QuoteView,
} from "../endpoints/commercial.ts";
import { m } from "../i18n/paraglide/messages.js";
import * as link from "../links.ts";
import { count, dateFormat, money, numberFormat } from "./index.ts";

/**
 * The commercial side of a case, read for the widgets that show it: its offers compared (with the
 * AI-drafted correction requests), its pricing, and a quotation as the customer receives it, with
 * its approvals, versions and decision. Pure: data in (../endpoints/commercial.ts's answers), what
 * a kind draws out. First the formats they share: EGP rounded to the pound, amounts in the
 * supplier's or the quote's currency, percentages and short dates, in the interface's language.
 */

export const egp = (n: number) => money(Math.round(n), "EGP");
export const amount = (n: number, d = 2) =>
  numberFormat({ minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
/** An amount in its currency: EGP rounded, any other with `d` decimals. */
export const priced = (n: number, currency: string, d = 2) =>
  currency === "EGP" ? egp(n) : m.index_money({ currency, amount: amount(n, d) });
/** A landed-cost charge's status in words; the stored value stays as it is. */
const CHARGE_STATUS: Record<string, () => string> = {
  Estimate: m.commercial_charge_estimate,
  Confirmed: m.commercial_charge_confirmed,
  Actual: m.commercial_charge_actual,
};
export const pct = (n: number) => formatNumber(n, { unit: "pct", decimals: 1 });
/** "17 Nov" (with the time: "17 Nov, 09:30"), in UTC. */
export const shortDay = (iso: string, time = false) =>
  iso
    ? dateFormat({
        day: "numeric",
        month: "short",
        ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
        timeZone: "UTC",
      }).format(new Date(iso))
    : "—";

/** How a case's shared charges (launch, freight, bank charges…) are spread over its lines. */
export const allocation = () => [
  { label: m.commercial_allocation_value(), value: "value" },
  { label: m.commercial_allocation_qty(), value: "qty" },
  { label: m.commercial_allocation_lines(), value: "lines" },
];

/* ------------------------------------------------------------------ shared */

type Option = { value: string; label: string };

/**
 * A tile that is only a choice of a screen parameter (`param`): its options from the data, the
 * current one from the URL (`fallback` until one is chosen). `label` gives its words.
 */
export const paramChoice =
  <T>(param: string, label: () => string, options: (d: T) => Option[], fallback: string) =>
  (d: T, { params }: WidgetScope): KindData<"actions"> => ({
    choice: { param, label: label(), value: params[param] ?? fallback, options: options(d) },
    items: [],
  });

/** A row's checks as marks: each flag in its tone, or one `ok` mark when there is none. */
export const checkMarks = (flags: { text: string; tone: Tone }[], ok: string): { text: string; tone: Tone }[] =>
  flags.length ? flags.map((f) => ({ text: f.text, tone: f.tone })) : [{ text: ok, tone: "success" }];

/** An email someone reads before it goes: who it's to, its subject and body. */
export const email = (to: string, subject: string, body: string): KindData<"message"> => ({
  meta: [m.commercial_email_to({ to })],
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
/** An offer as it's named: its supplier and version. */
const offerName = (o: CmpOffer) => m.commercial_offer_version({ supplier: o.supplier, version: o.version });

const reason = (required: boolean) => ({
  type: "textarea",
  name: "reason",
  label: m.commercial_reason(),
  required,
  admin: { placeholder: m.commercial_reason_placeholder() },
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
      label: sole ? m.commercial_selected() : m.commercial_select(),
      disabled: sole,
      call,
      done: m.commercial_select_done_best({ line: line.lineNo, supplier: o.supplier }),
    };
  return {
    label: sole ? m.commercial_selected() : m.commercial_select(),
    disabled: sole,
    call,
    confirm: {
      heading: m.commercial_select_heading({ line: line.lineNo }),
      text: [
        m.commercial_line_requested({ description: line.description, requested: line.requested }),
        m.commercial_select_offer_line({
          offer: offerName(o),
          qty: line.qty,
          unit: line.unit,
          landed: egp(o.landedPerBase * line.baseQty),
        }),
        best ? m.commercial_reason_best() : m.commercial_reason_not_best(),
      ].join("\n"),
      label: m.commercial_save_selection(),
    },
    fields: [reason(!best)],
    done: m.commercial_selection_saved({ line: line.lineNo }),
  };
}

function split(base: string, line: CmpLine, label: string, parts: CmpPart[], best: boolean): Action {
  const offer = (p: CmpPart) => line.offers.find((o) => o.id === p.offer)!;
  const per = line.baseQty / line.qty;
  return {
    label,
    call: { path: `${base}/split`, body: { lineNo: line.lineNo, offers: parts.map((p) => p.offer) } },
    confirm: {
      heading: m.commercial_split_heading({ line: line.lineNo }),
      text: [
        m.commercial_line_requested({ description: line.description, requested: line.requested }),
        m.commercial_split_adds_up({ qty: line.qty, unit: line.unit }),
        best ? m.commercial_reason_best() : m.commercial_split_reason(),
      ].join("\n"),
      label: m.commercial_save_selection(),
    },
    fields: [
      ...parts.map((p, i) => {
        const o = offer(p);
        return {
          type: "number",
          name: `q${i}`,
          label: m.commercial_quantity_from({ supplier: o.supplier }),
          min: 0,
          defaultValue: p.qty,
          admin: {
            description: m.commercial_split_part_note({
              offer: offerName(o),
              landed: amount(o.landedPerBase),
              baseUnit: line.baseUnit,
              max: Math.floor(o.baseQty / per),
              unit: line.unit,
            }),
          },
        };
      }),
      reason(false),
    ],
    done: m.commercial_selection_saved({ line: line.lineNo }),
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
      ...(o.kind === "stock" ? [{ label: m.commercial_tag_own_stock(), tone: "success" as const }] : []),
      ...(o.kind === "agency" ? [{ label: m.commercial_tag_agency(), tone: "info" as const }] : []),
      ...(o.id === line.best ? [{ label: m.commercial_tag_best_fit(), tone: "success" as const }] : []),
      ...(mode === "unit" && o.id === line.cheapestUnit && o.id !== line.best
        ? [{ label: m.commercial_tag_cheapest_unit(), tone: "warning" as const }]
        : []),
      ...(isSelected
        ? [
            {
              label:
                selected.size > 1
                  ? m.commercial_selected_qty({ qty: selected.get(o.id) ?? 0 })
                  : m.commercial_selected(),
              tone: "primary" as const,
            },
          ]
        : []),
    ];
    const actions: Action[] = [];
    if (!o.blocked) actions.push(selectOne(base, line, o, sole));
    const accepted = o.needsAcceptance && isSelected && line.selection.customerAccepted;
    if (o.needsAcceptance && isSelected && !line.selection.customerAccepted)
      actions.push({
        label: m.commercial_record_acceptance(),
        call: { path: `${base}/accept`, body: { lineNo: line.lineNo } },
        confirm: {
          heading: m.commercial_record_acceptance(),
          text: m.commercial_acceptance_text({ line: line.lineNo }),
          label: m.commercial_record_acceptance_confirm(),
        },
        fields: [
          {
            type: "textarea",
            name: "note",
            label: m.commercial_evidence(),
            required: true,
            defaultValue: m.commercial_evidence_default(),
          },
        ],
        done: m.commercial_acceptance_done({ line: line.lineNo }),
      });
    const leadLate = o.flags.some((f) => f.type === "Lead time vs ETA" && f.tone === "error");
    const checks: Cell = {
      text: "",
      marks: checkMarks(o.flags, m.commercial_no_issues()),
      tags: accepted ? [{ label: m.commercial_accepted_in_writing(), tone: "success" }] : undefined,
      actions: actions.length ? actions : undefined,
    };
    const coverage = count(Math.round(o.coverage * 100));
    const terms = o.terms || "—";
    return {
      supplier: { text: offerName(o), strong: !o.superseded, tags },
      note: o.supplierNote,
      offered: o.offered,
      coverage: {
        text: o.expiry
          ? m.commercial_coverage_expiry({ pct: coverage, expiry: o.expiry })
          : m.commercial_coverage({ pct: coverage }),
        tone: o.coverage < 1 ? "warning" : undefined,
      },
      price: priced(o.price, o.currency),
      priceNote: m.commercial_price_note({ per: o.per, total: egp(o.goodsEGP) }),
      metric: { text: amount(metric(o, mode)), strong: true, tone: rank === 0 && !o.blocked ? "success" : undefined },
      metricNote:
        mode === "landed"
          ? o.freightEGP
            ? m.commercial_metric_freight({ freight: egp(o.freightEGP), note: o.freightNote })
            : m.commercial_metric_no_freight({ note: o.freightNote })
          : m.commercial_metric_landed({ amount: amount(o.landedPerBase) }),
      lead: { text: m.commercial_lead_days({ days: o.leadDays }), tone: leadLate ? "error" : undefined },
      ready: m.commercial_ready({ day: shortDay(o.readyBy) }),
      terms: o.validUntil
        ? m.commercial_terms_valid({ day: shortDay(o.validUntil), terms })
        : m.commercial_terms_no_expiry({ terms }),
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
      heading: m.commercial_recommendation_heading(),
      text: line.split.savesEGP
        ? m.commercial_recommendation_split_saves({
            split: line.split.text,
            cost: egp(line.split.costEGP),
            saves: egp(line.split.savesEGP),
          })
        : m.commercial_recommendation_split({ split: line.split.text, cost: egp(line.split.costEGP) }),
    };
  if (best)
    return {
      tone: "success" as const,
      heading: m.commercial_recommendation_heading(),
      text: m.commercial_recommendation_best({
        offer: offerName(best),
        landed: amount(best.landedPerBase),
        baseUnit: line.baseUnit,
      }),
    };
  if (line.offers.length) return { tone: "warning" as const, text: m.commercial_no_recommendation() };
  return null;
}

/**
 * "Compare by": unit price or landed cost, the screen's `by` parameter that steers every line's
 * ranking.
 */
export const compareBy = paramChoice<CompareWithDrafts>(
  "by",
  () => m.commercial_compare_by(),
  () => [
    { value: "unit", label: m.commercial_unit_price() },
    { value: "landed", label: m.commercial_landed_cost() },
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
  const inferred = line.selection.inferred ? "yes" : "no";
  return {
    head: { tags: [{ label: line.status, tone: line.statusTone }] },
    note: [
      m.commercial_requested_rules({ requested: line.requested, rules: line.rules }),
      selected
        ? line.selection.reason
          ? m.commercial_selected_note_reason({ selected, reason: line.selection.reason, inferred })
          : m.commercial_selected_note({ selected, inferred })
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    alerts: [
      ...(line.missing
        ? [{ tone: "warning" as const, text: m.commercial_not_sent_yet({ missing: line.missing }) }]
        : []),
      ...(recommended ? [recommended] : []),
    ],
    empty: m.commercial_no_offers(),
    columns: [
      { key: "supplier", label: m.commercial_col_supplier(), supporting: "note" },
      { key: "offered", label: m.commercial_col_offered(), supporting: "coverage" },
      { key: "price", label: m.commercial_col_price_offered(), supporting: "priceNote" },
      {
        key: "metric",
        label:
          mode === "unit"
            ? m.commercial_col_unit_price({ unit: line.baseUnit })
            : m.commercial_col_landed_per({ unit: line.baseUnit }),
        supporting: "metricNote",
      },
      { key: "lead", label: m.commercial_col_lead(), supporting: "ready" },
      { key: "terms", label: m.commercial_col_terms(), supporting: "basis" },
      { key: "checks", label: m.commercial_col_checks() },
    ],
    rows: offerRows(base, line, mode),
    actions:
      line.split || open.length > 1
        ? [
            ...(line.split ? [split(base, line, m.commercial_use_split(), line.split.parts, true)] : []),
            split(
              base,
              line,
              m.commercial_split_across(),
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
      label: m.commercial_check_offers(),
      text: [
        m.commercial_check_requested({ description: line.description, requested: line.requested, rules: line.rules }),
        ...offers.map((o, i) =>
          m.commercial_check_offer({
            n: i + 1,
            supplier: o.supplier,
            offered: o.offered,
            note: o.supplierNote || m.commercial_none(),
          }),
        ),
      ].join("\n"),
      questions: offers.map((o, i) => ({
        id: `offer${i + 1}`,
        prompt: m.commercial_check_question({ n: i + 1, supplier: o.supplier }),
        yes: m.commercial_check_yes({ supplier: o.supplier }),
        no: m.commercial_check_no({ supplier: o.supplier }),
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
      { label: m.commercial_tag_ai_draft(), tone: "primary", icon: "sparkles" },
      { label: d.status, tone: d.sent ? "success" : "warning" },
    ],
  },
  note: m.commercial_correction_note(),
  ...email(d.to, d.subject, d.body),
  assist: true,
  actions: d.sent
    ? undefined
    : [
        {
          label: m.commercial_send_to_supplier(),
          main: true,
          call: {
            path: `/commercial/cases/${encodeURIComponent(c.id)}/correction`,
            body: { offer: o.id, send: true },
          },
          confirm: {
            heading: m.commercial_send_correction_heading(),
            text: m.commercial_send_correction_text({ to: d.to, subject: d.subject }),
            label: m.commercial_send_to_supplier(),
          },
          done: m.commercial_correction_sent(),
        },
      ],
});

/** Once the offers are selected, the case moves on to pricing. */
export const toPricing = (c: { id: string }): KindData<"actions"> => ({
  items: [{ label: m.commercial_continue_pricing(), main: true, href: link.doc("cases", c.id, "pricing") }],
});

/**
 * How offers are compared: normalised to the requested base unit in EGP at the approved FX rate,
 * landed cost with the freight to the vessel's port, and how many lines are selected.
 */
export const howCompared = (c: CompareWithDrafts): KindData<"text"> => {
  const selected = c.lines.filter((l) => l.selection.parts.length).length;
  return {
    muted: true,
    text: m.commercial_how_compared({ port: c.port }),
    tags: [
      { label: c.fxLabel, tone: "info" },
      { label: m.commercial_eta_days({ day: shortDay(c.eta), days: c.daysToEta }) },
      {
        label: m.commercial_lines_selected({ selected, total: c.lines.length }),
        tone: selected ? "success" : undefined,
      },
    ],
  };
};

/* ------------------------------------------------------------- the pricing */

/** The pricing figures' keys, one tile each, in order (`pricingFigures`); `pricingFigureName` gives their words. */
export const PRICING_FIGURES = [
  "Landed cost (priced lines)",
  "Selling total (excl. VAT)",
  "Expected gross profit",
  "Recoverable input VAT",
  "Lines priced",
] as const;
type PricingFigure = (typeof PRICING_FIGURES)[number];

/** A pricing figure's words in the interface's language. */
export const pricingFigureName = (key: PricingFigure): string =>
  ({
    "Landed cost (priced lines)": m.commercial_fig_landed,
    "Selling total (excl. VAT)": m.commercial_fig_selling,
    "Expected gross profit": m.commercial_fig_expected_profit,
    "Recoverable input VAT": m.commercial_fig_input_vat,
    "Lines priced": m.commercial_fig_lines_priced,
  })[key]();

/**
 * The case's price at a glance: landed cost, selling total, expected gross profit (red below
 * zero, amber under the policy minimum), recoverable input VAT and how many lines are priced, each
 * against its whole or target; until a line is priced, only how many lines are.
 */
export const pricingFigures = (P: Pricing): Figure<PricingFigure>[] => {
  const t = P.totals;
  const estimates = P.charges.filter((c) => c.status === "Estimate").length;
  const lines = P.rows.length + P.unpriced.length;
  const linesPriced: Figure<"Lines priced"> = {
    key: "Lines priced",
    label: pricingFigureName("Lines priced"),
    value: `${P.rows.length} / ${lines}`,
    share: {
      value: lines ? P.rows.length / lines : 0,
      text: lines ? m.commercial_of_the_lines() : m.commercial_no_lines_yet(),
    },
    note: P.unpriced.length ? m.commercial_to_follow({ count: P.unpriced.length }) : m.commercial_all_lines_priced(),
  };
  // Nothing priced yet: only the lines (the others would all read zero, so they show "—").
  if (!t.landedEGP) return [linesPriced];
  const fx = amount(P.fx, 2);
  return [
    {
      key: "Landed cost (priced lines)",
      label: pricingFigureName("Landed cost (priced lines)"),
      value: egp(t.landedEGP),
      note: estimates
        ? m.commercial_landed_note_estimates({ charges: egp(P.chargesEGP), count: estimates })
        : m.commercial_landed_note_confirmed({ charges: egp(P.chargesEGP) }),
      share: t.sellEGP ? { value: t.landedEGP / t.sellEGP, text: m.commercial_of_selling_price() } : undefined,
    },
    {
      key: "Selling total (excl. VAT)",
      label: pricingFigureName("Selling total (excl. VAT)"),
      value: priced(t.sellQuote, P.currency, 0),
      note: P.discountPct
        ? m.commercial_sell_note_discount({
            sell: egp(t.sellEGP),
            currency: P.currency,
            fx,
            discount: P.discountPct,
          })
        : m.commercial_sell_note({ sell: egp(t.sellEGP), currency: P.currency, fx }),
      share: t.sellEGP
        ? { value: Math.max(0, t.profitEGP) / t.sellEGP, text: m.commercial_profit_share({ pct: pct(t.marginPct) }) }
        : undefined,
    },
    {
      key: "Expected gross profit",
      label: pricingFigureName("Expected gross profit"),
      value: egp(t.profitEGP),
      note: m.commercial_margin_markup({ margin: pct(t.marginPct), markup: pct(t.markupPct) }),
      tone: t.profitEGP < 0 ? "error" : t.marginPct < P.policy.minPct ? "warning" : "success",
      share: {
        value: Math.max(0, t.marginPct) / P.policy.targetPct,
        text: m.commercial_margin_vs_target({ target: P.policy.targetPct }),
      },
    },
    {
      key: "Recoverable input VAT",
      label: pricingFigureName("Recoverable input VAT"),
      value: egp(t.inputVatEGP),
      note: m.commercial_vat_note(),
      share: t.landedEGP ? { value: t.inputVatEGP / t.landedEGP, text: m.commercial_on_top_landed() } : undefined,
    },
    linesPriced,
  ];
};

/**
 * What Sales sees instead of the pricing (refused them): why, and the case's latest quotation,
 * which carries the selling prices only.
 */
export const pricingForSales = ({ docs }: { docs: Doc[] }): KindData<"actions"> => ({
  note: m.commercial_sales_note(),
  items: docs[0] ? [quoteLink(docs[0].id, m.commercial_view_quotation())] : [],
});

/** The margin and markup figures' keys, one tile each, in order (`marginVsMarkup`); `marginFigureName` gives their words. */
export const MARGIN_FIGURES = ["Margin = profit ÷ selling price", "Markup = profit ÷ landed cost"] as const;
type MarginFigure = (typeof MARGIN_FIGURES)[number];

/** A margin figure's words in the interface's language. */
export const marginFigureName = (key: MarginFigure): string =>
  key === "Margin = profit ÷ selling price" ? m.commercial_fig_margin() : m.commercial_fig_markup();

/**
 * The same profit read two ways, each a figure of its own: margin (on the selling price, what the
 * policy is set on) and markup (on landed cost), so nobody prices "cost + 25%" thinking it is a
 * 25% margin. Until a line is priced, both show "—".
 */
export const marginVsMarkup = (P: Pricing): Figure<MarginFigure>[] => {
  const t = P.totals;
  if (!t.landedEGP) return [];
  return [
    {
      key: "Margin = profit ÷ selling price",
      label: marginFigureName("Margin = profit ÷ selling price"),
      value: pct(t.marginPct),
      note: m.commercial_margin_note({ profit: egp(t.profitEGP), sell: egp(t.sellEGP) }),
      share: {
        value: Math.max(0, t.marginPct) / 100,
        text: m.commercial_policy_target({ target: P.policy.targetPct }),
      },
    },
    {
      key: "Markup = profit ÷ landed cost",
      label: marginFigureName("Markup = profit ÷ landed cost"),
      value: pct(t.markupPct),
      note: m.commercial_markup_note({ profit: egp(t.profitEGP), landed: egp(t.landedEGP) }),
      share: { value: Math.max(0, t.markupPct) / 100, text: m.commercial_on_top_landed() },
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
    : [{ headline: m.commercial_within_policy(), dot: "success" as const }],
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
    label: m.commercial_request_approval(),
    main: true,
    disabled: pending || !P.rows.length,
    call: { path: `/commercial/cases/${encodeURIComponent(P.id)}/request-approval` },
    confirm: {
      heading: m.commercial_request_approval(),
      text: [
        m.commercial_request_approval_text({
          lines: P.rows.length,
          sell: priced(P.totals.sellQuote, P.currency),
          margin: pct(P.totals.marginPct),
          type: P.approvalType,
        }),
        ...P.exceptions.map((x) => `• ${x}`),
      ].join("\n"),
      label: m.commercial_request_approval(),
    },
    fields: [
      {
        type: "textarea",
        name: "note",
        label: m.commercial_note_for_approver(),
        admin: { placeholder: m.commercial_note_approver_placeholder() },
      },
    ],
    done: m.commercial_approval_requested_done(),
  };
  return {
    note: m.commercial_approval_rule({ max: P.policy.maxDiscountPct }),
    alerts: [
      P.exceptions.length
        ? {
            tone: "warning" as const,
            text: m.commercial_exceptions({ count: P.exceptions.length, type: P.approvalType }),
          }
        : { tone: "success" as const, text: m.commercial_no_exceptions() },
      ...(a?.status === "Approved"
        ? [{ tone: "success" as const, text: m.commercial_quote_approved({ number: String(q?.number) }) }]
        : a?.status === "Rejected"
          ? [{ tone: "error" as const, text: m.commercial_quote_returned({ number: String(q?.number) }) }]
          : pending
            ? [{ tone: "info" as const, text: m.commercial_approval_pending({ title: a!.title, status: a!.status }) }]
            : []),
    ],
    items: [
      ...(q ? [quoteLink(q.id, m.commercial_preview_quote({ number: q.number }))] : []),
      ...(pending ? [{ label: m.commercial_open_approvals(), href: "/approvals" }] : []),
      request,
    ],
  };
};

/**
 * The pricing levers: how shared charges are spread, the customer discount and each line's
 * margin, under the pricing policy (target, minimum, the discount that needs approval).
 */
export const pricingLevers = (P: Pricing): KindData<"form"> => ({
  head: { actions: [{ label: m.commercial_pricing_policy(), href: link.global("pricing-policy") }] },
  note: m.commercial_policy_note({
    target: P.policy.targetPct,
    min: P.policy.minPct,
    max: P.policy.maxDiscountPct,
    fx: P.fxLabel,
  }),
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
        { type: "select", name: "allocation", label: m.commercial_shared_allocated(), options: allocation() },
        { type: "number", name: "discountPct", label: m.commercial_customer_discount(), min: 0, max: 20 },
      ],
    },
    {
      type: "group",
      name: "margins",
      label: m.commercial_margin_per_line(),
      fields: [
        {
          type: "row",
          name: "lines",
          fields: P.rows.map((r) => ({
            type: "number",
            name: String(r.lineNo),
            label: m.commercial_margin_for_line({ line: r.lineNo }),
            min: -50,
            max: 90,
            admin: { description: m.commercial_target_min({ target: r.targetPct, min: r.minPct }) },
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
          .map((u) => m.commercial_unpriced_line({ line: u.lineNo, description: u.description, status: u.status }))
          .join("\n")
      : undefined,
    columns: [
      { key: "lineNo", label: "#" },
      { key: "description", label: m.commercial_col_line_supplier(), supporting: "sourcing" },
      { key: "cost", label: m.commercial_supplier_cost(), align: "end" },
      { key: "alloc", label: m.commercial_col_plus_shared(), align: "end" },
      { key: "landed", label: m.commercial_col_landed(), align: "end" },
      { key: "margin", label: m.commercial_col_margin_pct(), align: "end", supporting: "policy" },
      { key: "markup", label: m.commercial_col_markup(), align: "end" },
      { key: "sell", label: m.commercial_col_sell({ currency: cur }), align: "end", supporting: "sellEGP" },
      { key: "unit", label: m.commercial_col_unit({ currency: cur }), align: "end", supporting: "qty" },
      { key: "checks", label: m.commercial_col_checks() },
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
        text: m.commercial_target_min({ target: r.targetPct, min: r.minPct }),
        tone: r.marginPct < r.minPct ? "warning" : undefined,
      },
      markup: pct(r.markupPct),
      sell: { text: priced(r.sellQuote, cur), strong: true },
      sellEGP: egp(r.sellEGP),
      unit: amount(r.unitQuote),
      qty: `× ${r.quoteQty} ${r.quoteUnit}`,
      checks: { text: "", marks: checkMarks(r.checks, m.commercial_ok()) },
    })),
  };
};

/** Each line's selling price stacked from what makes it: supplier cost, shared charges, gross profit. */
export const priceBuildUp = (P: Pricing): KindData<"chart"> => ({
  label: m.commercial_price_build_up(),
  chart: {
    kind: "bars",
    stacked: true,
    labels: P.rows.map((r) => `L${r.lineNo}`),
    series: [
      { name: m.commercial_supplier_cost(), values: P.rows.map((r) => Math.round(r.costEGP)) },
      { name: m.commercial_shared_charges(), values: P.rows.map((r) => Math.round(r.allocEGP)) },
      { name: m.commercial_gross_profit(), values: P.rows.map((r) => Math.max(0, Math.round(r.profitEGP))) },
    ],
    format: { unit: "money", currency: "EGP" },
  },
});

/**
 * The case's shared charges (launch, freight, bank charges…) and how they're spread: estimates
 * are marked until actuals replace them at close. VAT is expected at 0% for a vessel in transit.
 */
export const sharedCharges = (P: Pricing): KindData<"table"> => ({
  note: [m.commercial_charges_allocated({ allocation: P.allocation }), m.commercial_charges_vat()].join("\n"),
  totals: true,
  columns: [
    { key: "label", label: m.commercial_col_charge() },
    { key: "status", label: m.commercial_col_status() },
    { key: "amount", label: m.commercial_col_amount(), align: "end" },
  ],
  rows: [
    ...P.charges.map((c): Row => ({
      label: c.label,
      status: {
        // The status's words; the value stays as stored.
        text: CHARGE_STATUS[c.status]?.() ?? c.status,
        tag: true,
        tone: c.status === "Estimate" ? "warning" : c.status === "Confirmed" ? "success" : "neutral",
      },
      amount: { text: egp(c.amountEGP), strong: true },
    })),
    {
      label: { text: m.commercial_total_shared(), strong: true },
      amount: { text: egp(P.chargesEGP), strong: true },
    },
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
    head: { tags: [{ label: m.commercial_tag_ai_check(), tone: "primary", icon: "sparkles" }] },
    note: m.commercial_portal_note(),
    alerts: rows.length
      ? [
          diffs.length
            ? {
                tone: "warning" as const,
                text: m.commercial_portal_diffs({ fields: diffs.map((r) => r.field.toLowerCase()).join(", ") }),
              }
            : { tone: "success" as const, text: m.commercial_portal_all_match() },
        ]
      : undefined,
    empty: m.commercial_portal_empty(),
    columns: [
      { key: "field", label: m.commercial_col_field() },
      { key: "portal", label: m.commercial_col_portal() },
      { key: "quote", label: m.commercial_col_approved_quote() },
      { key: "matches", label: "" },
    ],
    rows: rows.map((r) => ({
      field: r.field,
      portal: r.portal,
      quote: r.quote,
      matches: r.matches
        ? { text: m.commercial_match(), tone: "success" as const, tag: true as const }
        : { text: m.commercial_difference(), tone: "error" as const, tag: true as const },
    })),
    actions: [
      {
        label: rows.length ? m.commercial_check_again() : m.commercial_upload_compare(),
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
  () => m.commercial_currency(),
  (v) => [
    { value: "quote", label: String(v.quotation.currency) },
    { value: "EGP", label: "EGP" },
  ],
  "quote",
);

/** A quotation's steps before the customer's decision, in order. */
const steps = () => [
  m.commercial_step_prepared(),
  m.commercial_step_approval_requested(),
  m.commercial_step_approved(),
  m.commercial_step_sent(),
];
/** The customer's decisions: the stored values (their words: `decisionWords`). */
const DECISIONS = ["Won", "Partially won", "Revision requested", "Lost"];
const decisionWords = (decision: string) =>
  (
    {
      Won: m.commercial_decision_won,
      "Partially won": m.commercial_decision_partially_won,
      "Revision requested": m.commercial_decision_revision_requested,
      Lost: m.commercial_decision_lost,
    } as Record<string, () => string>
  )[decision]?.() ?? decision;
const WRITING = "formal shorter proofread translate";

const meOf = (user: WidgetScope["user"]) => (typeof user.name === "string" ? user.name : "");

function quoteActions(v: QuoteView, me: string): Action[] {
  const q = v.quotation;
  const data = "/commercial/quotations/$doc.id";
  const own = "/quote-preview/$doc.id";
  const out: Action[] = [];
  if (v.can.requestApproval)
    out.push({
      label: m.commercial_request_approval(),
      main: true,
      call: { path: `${data}/request-approval` },
      done: m.commercial_approval_requested_short(),
    });
  if (v.can.approve && v.approvalId) {
    const decide = `/commercial/approvals/${encodeURIComponent(v.approvalId)}/decide`;
    out.push(
      {
        label: m.commercial_return(),
        tone: "error",
        call: { path: decide, body: { decision: "Reject" } },
        confirm: {
          heading: m.commercial_return_heading({ number: q.number }),
          text: m.commercial_return_text({ number: q.number }),
          label: m.commercial_return(),
          tone: "error",
        },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: m.commercial_reason(),
            required: true,
            admin: { placeholder: m.commercial_return_placeholder() },
          },
        ],
        assist: { field: "reason", tools: WRITING },
        done: m.commercial_returned_done(),
      },
      // Approving is internal and can be withdrawn until the quotation is sent: no dialog, the
      // snackbar offers Undo (the endpoint's `undo`). Sending is the step that asks first.
      {
        label: m.commercial_approve(),
        main: true,
        call: { path: decide, body: { decision: "Approve" } },
        done: m.commercial_approved_done({ number: q.number }),
      },
    );
  }
  if (v.can.send) {
    const portal = sendsByPortal(v.case);
    out.push({
      label: m.commercial_send_to_customer(),
      main: true,
      call: { path: `${own}/send`, body: { to: v.case.email } },
      confirm: {
        heading: m.commercial_send_heading({ number: q.number }),
        text: [
          m.commercial_send_ai_draft(),
          "",
          m.commercial_send_email_line({
            to: v.case.email || m.commercial_customer(),
            number: q.number,
            vessel: v.case.vessel,
            ref: v.case.customerRef,
          }),
          m.commercial_send_portal_line({ portal: v.case.portal || m.commercial_customers_portal() }),
        ].join("\n"),
        label: m.commercial_send(),
      },
      fields: [
        {
          type: "radio",
          name: "method",
          label: m.commercial_submission_method(),
          defaultValue: portal ? "portal" : "email",
          options: [
            { value: "email", label: m.commercial_email_from_odoo() },
            { value: "portal", label: m.commercial_customer_portal() },
          ],
        },
        {
          type: "textarea",
          name: "message",
          label: m.commercial_message(),
          admin: { rows: 9 },
          defaultValue: [
            m.commercial_letter_dear({ name: v.case.attention }),
            "",
            m.commercial_letter_body({
              number: q.number,
              vessel: v.case.vessel,
              ref: v.case.customerRef || "—",
              port: v.case.port,
            }),
            m.commercial_letter_valid({ day: shortDay(String(q.validUntil ?? "")) }),
            "",
            m.commercial_letter_regards(),
            me,
            m.commercial_letter_company(),
          ].join("\n"),
        },
      ],
      assist: { field: "message", tools: WRITING },
      reply: true,
    });
  }
  if (v.can.decide)
    out.push({
      label: m.commercial_record_decision(),
      call: { path: `${own}/decision` },
      confirm: {
        heading: m.commercial_customer_decision(),
        text: m.commercial_decision_text({ number: q.number }),
        label: m.commercial_record(),
      },
      fields: [
        {
          type: "radio",
          name: "decision",
          label: m.commercial_decision(),
          defaultValue: "Won",
          options: DECISIONS.map((d) => ({ value: d, label: decisionWords(d) })),
        },
        {
          type: "textarea",
          name: "note",
          label: m.commercial_decision_note_label(),
          admin: { placeholder: m.commercial_decision_placeholder() },
        },
      ],
      assist: { field: "note", tools: WRITING },
      reply: true,
    });
  if (v.can.revise)
    out.push({
      label: m.commercial_create_revision(),
      call: { path: `${own}/revise` },
      confirm: {
        heading: m.commercial_revise_heading({ number: q.number }),
        text: m.commercial_revise_text({
          version: (v.quotation.versions?.at(-1)?.version ?? 1) + 1,
          number: q.number,
        }),
        label: m.commercial_create_revision(),
      },
      fields: [
        {
          type: "textarea",
          name: "reason",
          label: m.commercial_what_changes(),
          admin: { placeholder: m.commercial_revise_placeholder() },
        },
      ],
      assist: { field: "reason", tools: WRITING },
      reply: true,
    });
  out.push({ label: m.commercial_print(), print: true });
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
  const said = [
    q.decision ? decisionWords(q.decision) : "",
    sub?.submittedAt ? m.commercial_sent_via({ when: shortDay(sub.submittedAt, true), method: sub.method ?? "" }) : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const why = v.why.approve && v.approvalId && !v.can.approve ? v.why.approve : "";
  return {
    head: { actions: quoteActions(v, meOf(user)) },
    tags: [{ label: q.number, tone: "primary" }, { label: q.status }],
    note: [said, why].filter(Boolean).join("\n") || undefined,
    current: v.step,
    items: [
      ...steps().map((label) => ({ label })),
      { label: v.step === 4 ? v.stepLabel : m.commercial_customer_decision() },
    ],
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

/**
 * The customer's copy as a printable document (`document` kind), in its language and currency.
 * Its words, dates and amounts are in the copy's language (`lang`), whatever the interface's.
 */
function paper(v: QuoteView, lang: Lang, egpOn: boolean): DocumentSpec {
  const q = v.quotation;
  const locale = { locale: lang };
  const tag = lang === "ar" ? "ar-u-nu-latn" : "en-GB";
  const day = (iso: string, time = false) =>
    iso
      ? new Intl.DateTimeFormat(tag, {
          day: "numeric",
          month: "short",
          ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
          timeZone: "UTC",
        }).format(new Date(iso))
      : "—";
  const cur = egpOn ? "EGP" : String(q.currency ?? "USD");
  const rate = egpOn ? v.fx : 1;
  const d = egpOn ? 0 : 2;
  const fmt = (n: number, places = d) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-u-nu-latn" : "en-US", {
      minimumFractionDigits: places,
      maximumFractionDigits: places,
    }).format(n);
  const lines = ((q.lines as QuoteLine[] | undefined) ?? []).map((l, i) => ({
    s: String(i + 1).padStart(2, "0"),
    partNo: l.partNo ?? "",
    description: l.description ?? "",
    unit: l.unit ?? "",
    qty: String(l.qty ?? ""),
    price: fmt((l.unitPrice ?? 0) * rate),
    total: fmt((l.qty ?? 0) * (l.unitPrice ?? 0) * rate),
    sum: (l.qty ?? 0) * (l.unitPrice ?? 0) * rate,
  }));
  const gross = lines.reduce((s, l) => s + l.sum, 0);
  const discount = Number(q.discountPct) || 0;
  const total = gross * (1 - discount / 100);
  const draft = !["Approved", "Submitted"].includes(String(q.status)) && q.status !== "Superseded";
  const created = new Date(String(q.createdAt ?? unsavedQuoteDate()));
  const ymd = `${String(created.getUTCDate()).padStart(2, "0")}/${String(created.getUTCMonth() + 1).padStart(2, "0")}/${created.getUTCFullYear()}`;
  return {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    notices: [
      ...(draft
        ? [{ tone: "warning" as const, text: m.commercial_paper_draft({ version: Number(q.version) || 1 }, locale) }]
        : []),
      ...(q.status === "Superseded"
        ? [{ tone: "info" as const, text: m.commercial_paper_superseded({}, locale) }]
        : []),
    ],
    // The company's name stays in Latin letters in both languages.
    issuer: { name: "GOLDEN SEA", tagline: m.commercial_paper_brand({}, locale) },
    title: m.commercial_paper_title({}, locale),
    meta: [
      { text: m.commercial_paper_no({ number: q.number }, locale), accent: true },
      { text: m.commercial_paper_ref({ ref: v.case.customerRef || "—" }, locale) },
      { text: m.commercial_paper_date({ date: ymd }, locale), accent: true },
    ],
    party: {
      title: m.commercial_paper_client({}, locale),
      rows: [
        { label: m.commercial_paper_company({}, locale), value: v.case.customer },
        {
          label: m.commercial_paper_attention({}, locale),
          value: `${v.case.attention}${v.case.email ? ` · ${v.case.email}` : ""}`,
        },
        {
          label: m.commercial_paper_vessel({}, locale),
          value: `${v.case.vessel}${v.case.imo ? ` (IMO ${v.case.imo})` : ""}`,
        },
        {
          label: m.commercial_paper_port({}, locale),
          value: m.commercial_paper_port_eta({ port: v.case.port, eta: day(v.case.eta, true) }, locale),
        },
      ],
    },
    intro: m.commercial_paper_intro({}, locale),
    columns: [
      { key: "s", label: m.commercial_paper_s({}, locale) },
      { key: "partNo", label: m.commercial_paper_part({}, locale) },
      { key: "description", label: m.commercial_paper_desc({}, locale), ltr: true },
      { key: "unit", label: m.commercial_paper_uom({}, locale), upper: true },
      { key: "qty", label: m.commercial_paper_qty({}, locale) },
      { key: "price", label: m.commercial_paper_price({ currency: cur }, locale) },
      { key: "total", label: m.commercial_paper_total({ currency: cur }, locale) },
    ],
    lines: lines.map(({ sum: _sum, ...l }) => l),
    adjustments: discount
      ? [{ label: m.commercial_paper_discount({ pct: discount }, locale), value: `− ${fmt(gross - total)}` }]
      : [],
    total: { label: m.commercial_paper_grand({ currency: cur }, locale), value: fmt(total) },
    totalNote: egpOn
      ? m.commercial_paper_converted({ currency: String(q.currency), fx: fmt(v.fx, 2) }, locale)
      : undefined,
    notes: {
      title: m.commercial_paper_remarks({}, locale),
      items: [
        m.commercial_paper_delivery({ port: v.case.port, eta: day(v.case.eta) }, locale),
        m.commercial_paper_vat({}, locale),
        m.commercial_paper_qty_rule({}, locale),
        m.commercial_paper_valid({ day: day(String(q.validUntil ?? "")) }, locale),
        m.commercial_paper_pay({ terms: String(q.paymentTerms ?? "—") }, locale),
        ...(q.remarks ? String(q.remarks).split("\n") : []),
      ],
      closing: m.commercial_paper_wish({}, locale),
    },
    footer: {
      start: v.approvedBy
        ? m.commercial_paper_prepared_approved({ prepared: v.preparedBy || "—", approved: v.approvedBy }, locale)
        : m.commercial_paper_prepared({ prepared: v.preparedBy || "—" }, locale),
      end: v.approvedBy
        ? m.commercial_paper_signature({ name: v.approvedBy }, locale)
        : m.commercial_paper_signature_pending({}, locale),
    },
    contact: [letterheadContact(), m.commercial_paper_address({}, locale)],
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
      label: m.commercial_language(),
      value: lang,
      // Each language named in itself.
      options: [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
      ],
    },
    ...paper(v, lang, params.currency === "EGP"),
  };
};

/** The date on a quotation not saved yet. */
function unsavedQuoteDate(): string {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    // The demo's morning.
    return "2026-11-17T09:30:00.000Z";
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError("the date on an unsaved quotation: today, not the demo's 17 Nov 2026");
  }
}

/** The phone and email on the quotation's letterhead. */
function letterheadContact(): string {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return "+20 10 0000 0000 · Sales@goldensea.com.eg";
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError("the letterhead's phone and email from the branding global, not a placeholder number");
  }
}

/** A quotation goes through the customer's procurement portal (else by email). */
function sendsByPortal(c: { portal?: string; customer: string }): boolean {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    // Nordvik has a portal on file but takes this quotation by email in the demo's story.
    return Boolean(c.portal && /portal/i.test(c.portal) && !/Nordvik/.test(c.customer));
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "how a customer takes quotations (portal or email) from its record, not an exception for Nordvik by name",
    );
  }
}
