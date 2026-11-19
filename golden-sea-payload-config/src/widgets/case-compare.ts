import { block, type Action, type Cell, type Row, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source } from "saastemlycrm-design-system/contracts";
import type { CmpLine, CmpOffer, CmpPart, CompareWithDrafts, CorrectionDraft } from "../endpoints/commercial.ts";
import * as link from "../links.ts";

/**
 * Case tab "Compare offers": every offer checked against the customer's original line,
 * normalised to EGP per base unit at the approved FX rate. "Compare by" (the `by` parameter)
 * switches unit price and landed cost (freight to the vessel's port included): the cheapest unit
 * price is not always the cheapest on board. Own Alexandria stock and agency pricelists sit next
 * to supplier offers; deviations block or flag offers; the best fit is recommended; a person
 * selects (one offer or a split) and gives a reason when it isn't the best fit. Sales never sees
 * supplier costs (the data is refused, 403). Data and actions: /api/commercial/cases/:id/*
 * (../endpoints/commercial.ts).
 */

/* ------------------------------------------------------------ formats (shared with pricing) */

export const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
export const amount = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const money = (n: number, currency: string, d = 2) =>
  currency === "EGP" ? egp(n) : `${currency} ${amount(n, d)}`;
export const pct = (n: number) => `${n.toFixed(1)}%`;
export const day = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "—";

/* ------------------------------------------------------------ the widgets */

const compareOf: Source = { endpoint: "/commercial/cases/$doc.id/compare" };
const on = from<CompareWithDrafts>(compareOf);

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

function selectOne(base: string, line: CmpLine, o: CmpOffer, sole: boolean): Action {
  const best = o.id === line.best;
  return {
    label: sole ? "Selected" : "Select",
    disabled: sole,
    call: { path: `${base}/select`, body: { lineNo: line.lineNo, parts: [{ offer: o.id, qty: line.qty }] } },
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
      marks: o.flags.length
        ? o.flags.map((f) => ({ text: f.text, tone: f.tone }))
        : [{ text: "No issues", tone: "success" }],
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
      price: money(o.price, o.currency),
      priceNote: `per ${o.per} · total ${egp(o.goodsEGP)}`,
      metric: { text: amount(metric(o, mode)), strong: true, tone: rank === 0 && !o.blocked ? "success" : undefined },
      metricNote:
        mode === "landed"
          ? `${o.freightEGP ? `+ ${egp(o.freightEGP)}` : "no freight"} · ${o.freightNote}`
          : `landed ${amount(o.landedPerBase)}`,
      lead: { text: `${o.leadDays} d`, tone: leadLate ? "error" : undefined },
      ready: `ready ${day(o.readyBy)}`,
      terms: `${o.validUntil ? `Valid to ${day(o.validUntil)}` : "No expiry"} · ${o.terms || "—"}`,
      basis: o.basis,
      checks,
    };
  });
}

/** An on-device second look at the offers against the request: things to check, never a verdict. */
function offerCheck(line: CmpLine): ViewBlock[] {
  const offers = line.offers.filter((o) => !o.superseded).slice(0, 6);
  if (!offers.length) return [];
  return [
    block("custom", {
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
    }),
  ];
}

function correction(base: string, o: CmpOffer, d: CorrectionDraft): ViewBlock {
  return block("card", {
    open: false,
    heading: `Correction request · ${o.supplier} v${o.version}`,
    tags: [
      { label: "AI draft", tone: "primary", icon: "sparkles" },
      { label: d.status, tone: d.sent ? "success" : "warning" },
    ],
    blocks: [
      block("details", {
        layout: "inline",
        items: [
          { label: "To", value: d.to },
          { label: "Subject", value: d.subject },
        ],
      }),
      block("custom", { element: "ui-ai-text", key: o.id, props: { text: d.body, translatable: true } }),
      block("text", {
        muted: true,
        text: "The client is never named to the supplier. v1 stays on the case for audit; only a corrected version can be priced.",
      }),
      ...(d.sent
        ? []
        : [
            block("actions", {
              items: [
                {
                  label: "Send to supplier",
                  main: true,
                  call: { path: `${base}/correction`, body: { offer: o.id, send: true } },
                  confirm: {
                    heading: "Send the correction request?",
                    text: `To ${d.to}: “${d.subject}”.`,
                    label: "Send to supplier",
                  },
                  done: "Correction request sent. The offer stays blocked until a corrected version arrives.",
                },
              ],
            }),
          ]),
    ],
  });
}

/** One line's card: its offers ranked, the recommendation, the selection and its actions. */
function lineCard(c: CompareWithDrafts, line: CmpLine, mode: Mode): ViewBlock {
  const base = `/commercial/cases/${encodeURIComponent(c.id)}`;
  const best = line.offers.find((o) => o.id === line.best);
  const name = (id: string) => line.offers.find((o) => o.id === id)?.supplier ?? id;
  const selected = line.selection.parts.map((p) => `${name(p.offer)} × ${p.qty}`).join(" + ");
  const open = line.offers.filter((o) => !o.blocked);
  const blocks: ViewBlock[] = [
    block("text", { muted: true, text: `Requested: ${line.requested} · ${line.rules}` }),
    ...offerCheck(line),
  ];
  if (line.missing)
    blocks.push(
      block("alert", {
        tone: "warning",
        text: `Not sent to suppliers yet: ${line.missing}. Waiting for the customer's answer.`,
      }),
    );
  if (line.offers.length)
    blocks.push(
      block("table", {
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
      }),
    );
  if (line.others.length)
    blocks.push(
      block("list", {
        items: line.others.map((o) => ({
          headline: o.supplier,
          supporting: o.note,
          dot: o.tone,
          tags: [{ label: o.status, tone: o.tone }],
        })),
      }),
    );
  if (best || line.split)
    blocks.push(
      block("alert", {
        tone: "success",
        heading: "Recommendation · Suggested",
        text: line.split
          ? `Split sourcing: ${line.split.text} — ${egp(line.split.costEGP)} landed${
              line.split.savesEGP ? `, saves ${egp(line.split.savesEGP)} vs the best single supplier` : ""
            }, all before ETA.`
          : `${best!.supplier} v${best!.version}: ${amount(best!.landedPerBase)} EGP / ${line.baseUnit} landed — lowest cost on board among offers that pass every check.`,
      }),
    );
  else if (line.offers.length)
    blocks.push(block("alert", { tone: "warning", text: "No offer passes every check yet — no recommendation." }));
  if (selected)
    blocks.push(
      block("text", {
        text: `Selected: ${selected}${line.selection.reason ? ` · ${line.selection.reason}` : ""}${
          line.selection.inferred ? " (from the line status)" : ""
        }`,
      }),
    );
  for (const o of line.offers) {
    const d = c.drafts[o.id];
    if (o.correctable && d) blocks.push(correction(base, o, d));
  }
  if (line.split || open.length > 1)
    blocks.push(
      block("actions", {
        items: [
          ...(line.split ? [split(base, line, `Use split ${line.split.text}`, line.split.parts, true)] : []),
          split(
            base,
            line,
            "Split across suppliers…",
            open.map((o) => ({ offer: o.id, qty: line.split?.parts.find((p) => p.offer === o.id)?.qty ?? 0 })),
            false,
          ),
        ],
      }),
    );
  return block("card", {
    heading: `L${line.lineNo} · ${line.description}`,
    tags: [{ label: line.status, tone: line.statusTone }],
    blocks,
  });
}

const how = on({
  title: "How offers are compared",
  skeleton: "text",
  denied:
    "Costs and margins are hidden for your role. Supplier offers carry supplier costs, so Sales sees the selling prices on the quotation instead. Supply chain, finance and management compare offers.",
  render: (c) => {
    const selected = c.lines.filter((l) => l.selection.parts.length).length;
    return [
      block("text", {
        muted: true,
        text: `Each offer is checked against the original line and normalised to the requested base unit (EA / L / kg) in EGP at the approved FX rate, keeping the supplier's own units and currency. Landed cost adds the freight to ${c.port} (lane rates, import costs for agency lines). AI suggests matches and deviations; technical equivalence is a person's decision.`,
      }),
      block("tags", {
        items: [
          { label: c.fxLabel, tone: "info" },
          { label: `ETA ${day(c.eta)} · ${c.daysToEta} days` },
          { label: `${selected} of ${c.lines.length} lines selected`, tone: selected ? "success" : undefined },
        ],
      }),
      block("choice", {
        param: "by",
        label: "Compare by",
        value: "unit",
        options: [
          { value: "unit", label: "Unit price" },
          { value: "landed", label: "Landed cost" },
        ],
      }),
    ];
  },
});

/** A card per line: how many depends on the case, so the widget draws the cards itself. */
const lines = on({
  skeleton: "table",
  render: (c, { params }) => c.lines.map((l) => lineCard(c, l, modeOf(params))),
});

const next = on({
  skeleton: "text",
  render: (c) =>
    block("actions", {
      items: [{ label: "Continue to pricing", main: true, href: link.doc("cases", c.id, "pricing") }],
    }),
});

export const caseCompare = widgets({ params: { by: "unit" }, widgets: [how, lines, next] });
