import type { Endpoint } from "payload";
import { block, type Action, type Row, type View, type ViewBlock } from "../../app/view/schema.ts";
import { egp, formatDateTime, pct, signed } from "../endpoints/insights-shared.ts";
import { guarded, type CaseProfit, type CloseCheck, type LineState } from "../endpoints/profit.ts";

/**
 * Case tab "Profit & close": the profit expected when the quotation was approved against the
 * actual once costs are billed, the FX differences on receipts, claims, and the close checklist.
 * Data and actions: /api/case-profit/:id (../endpoints/profit.ts). Sales never sees it.
 */

const STATE: Record<LineState, { label: string; tone: "success" | "warning" | "neutral" | "info" }> = {
  Confirmed: { label: "Actual", tone: "success" },
  Billed: { label: "Billed, to confirm", tone: "warning" },
  Estimate: { label: "Estimate", tone: "neutral" },
  "Not applicable": { label: "Not applicable", tone: "info" },
};

const money = (v?: number) => (v === undefined ? null : egp(v));
const diffCell = (d: number) => ({
  text: signed(Math.round(d), egp),
  tone: d > 0 ? ("error" as const) : d < 0 ? ("success" as const) : undefined,
});

function actions(p: CaseProfit) {
  const base = `/case-profit/${encodeURIComponent(p.id)}`;
  const billed = p.lines.filter((l) => l.kind === "charge" && l.state === "Billed");
  const actuals: Action = {
    label: "Confirm actuals",
    variant: "filled",
    call: { path: `${base}/actuals` },
    confirm: {
      heading: "Replace estimates with actuals",
      text: [
        "These billed amounts replace the estimates on the case's shared charges:",
        ...billed.map((l) => `${l.label} (${l.detail}): ${egp(l.expected)} to ${egp(l.actual ?? 0)}`),
      ].join("\n"),
      label: "Confirm actuals",
    },
    done: "Actual costs confirmed. Estimates replaced on the case.",
  };
  const r = p.receipt;
  const receipt: Action | undefined = r && {
    label: "Record receipt",
    call: { path: `${base}/receipt` },
    prompt: `Record receipt for ${r.number}`,
    fields: [
      {
        type: "text",
        name: "reference",
        label: "Bank reference",
        required: true,
        defaultValue: "TRX-77984",
        admin: {
          description: `${r.currency} ${r.amount.toLocaleString("en-US")} received from ${p.customer}${
            r.currency === "EGP" ? "" : ` at ${r.rate.toFixed(2)} EGP/${r.currency}`
          }. Recorded after the bank movement; the platform never starts transfers.`,
        },
      },
    ],
    done: `Receipt recorded and allocated to ${r.number}.`,
  };
  const claim = (ref: string): Action | undefined => {
    const c = p.claims.find((x) => x.ref === ref);
    return (
      c && {
        label: "Record credit note",
        call: { path: `${base}/claims/${encodeURIComponent(c.ref)}` },
        confirm: {
          heading: `Settle claim ${c.ref}`,
          text: `${c.title}. ${c.note}\nCredit note ${c.creditNote} from ${c.against} for ${egp(c.amount)} is booked against the replacement cost.`,
          label: "Record credit note",
        },
        done: `Credit note ${c.creditNote} recorded. Claim ${c.ref} settled.`,
      }
    );
  };
  const close: Action = {
    label: "Close case",
    variant: "filled",
    call: { path: `${base}/close` },
    disabled: !p.canClose,
    reason: p.canClose
      ? "Every check is green."
      : p.canAct
        ? "Turn every check green to close."
        : "Management and finance close cases.",
    confirm: {
      heading: `Close ${p.caseId}?`,
      text: `Actual gross profit ${egp(p.actual.profit)} (${pct(p.actual.margin)}) against ${egp(p.expected.profit)} expected (${pct(p.expected.margin)}).\nSupplier prices, lead times and on-time results feed back to the supplier records.`,
      label: "Close case",
    },
    done: `${p.caseId} closed. Supplier prices and on-time results fed back.`,
  };
  return { actuals, receipt, claim, close };
}

function checkAction(k: CloseCheck, p: CaseProfit, a: ReturnType<typeof actions>): Action | undefined {
  if (k.ok || !k.action || p.closed) return undefined;
  const pick =
    k.action === "actuals"
      ? a.actuals
      : k.action === "receipt"
        ? a.receipt
        : a.claim(p.claims.find((c) => !c.settled)?.ref ?? "");
  return pick && { ...pick, label: k.actionLabel ?? pick.label, variant: "tonal" };
}

export function caseProfitView(p: CaseProfit): View {
  const a = actions(p);
  const blocks: ViewBlock[] = [];
  if (p.closed)
    blocks.push(
      block("alert", {
        tone: "success",
        heading: "Case closed and settled",
        text: `${p.closedAt ? `Closed ${formatDateTime(p.closedAt)}. ` : ""}Actual profit recorded; supplier prices and on-time results fed back to the supplier records.`,
      }),
    );

  if (p.costed) {
    const diff = p.actual.profit - p.expected.profit;
    const open = p.checks.filter((k) => !k.ok).length;
    blocks.push(
      block("stats", {
        size: "md",
        items: [
          {
            label: "Expected gross profit",
            value: egp(p.expected.profit),
            note: `at quotation · ${pct(p.expected.margin)} margin`,
          },
          {
            label: p.actual.final ? "Actual gross profit" : "Actual gross profit so far",
            value: egp(p.actual.profit),
            note: `${pct(p.actual.margin)} margin · ${p.actual.final ? "final, every cost is actual" : `${open} close check${open === 1 ? "" : "s"} open`}`,
            tone: p.actual.margin < 15 ? "error" : undefined,
          },
          {
            label: "Difference",
            value: signed(Math.round(diff), egp),
            note: `${signed(p.actual.margin - p.expected.margin, (n) => `${n.toFixed(1)} pts`)} of margin`,
            tone: diff < 0 ? "error" : "success",
          },
          {
            label: "FX difference",
            value: p.currency === "EGP" ? "—" : signed(Math.round(p.fxTotal), egp),
            note:
              p.currency === "EGP"
                ? "invoiced in EGP"
                : `quoted at ${p.quoteRate.toFixed(2)} · today ${p.currentRate.toFixed(2)} EGP/${p.currency}`,
            tone: p.fxTotal < 0 ? "error" : undefined,
          },
        ],
      }),
    );

    const costRows: Row[] = p.lines.map((l) => ({
      label: { text: l.label, href: l.href, strong: true },
      detail: l.note ? { text: `${l.detail} · ${l.note}`, tone: "warning" } : l.detail,
      expected: money(l.expected),
      actual: money(l.actual),
      difference: l.actual === undefined ? null : diffCell(l.actual - l.expected),
      state: { text: STATE[l.state].label, tone: STATE[l.state].tone, tag: true },
    }));
    costRows.push({
      label: { text: "Total cost", strong: true },
      expected: money(p.expected.cost),
      actual: money(p.actual.cost),
      difference: diffCell(p.actual.cost - p.expected.cost),
    });
    const costs = block("card", {
      heading: "Expected vs actual cost",
      actions: p.checks.find((k) => k.key === "actuals")?.action && !p.closed ? [a.actuals] : undefined,
      blocks: [
        block("text", {
          muted: true,
          variant: "body-sm",
          text: "Costs as estimated when the quotation was approved, and as billed. Bills replace estimates once a person confirms them; nothing changes on its own.",
        }),
        block("table", {
          totals: true,
          columns: [
            { key: "label", label: "Cost", supporting: "detail" },
            { key: "expected", label: "Expected", align: "end" },
            { key: "actual", label: "Actual", align: "end" },
            { key: "difference", label: "Difference", align: "end" },
            { key: "state", label: "Status" },
          ],
          rows: costRows,
        }),
      ],
    });

    const fx = block("card", {
      heading: "FX differences",
      blocks: [
        block("text", {
          muted: true,
          variant: "body-sm",
          text: `Revenue is booked at the quotation's rate (${p.quoteRate.toFixed(2)} EGP/${p.currency}); each receipt converts at the bank's actual rate. Expected revenue ${egp(p.expected.revenue)} · actual ${egp(p.actual.revenue)}.`,
        }),
        p.currency === "EGP"
          ? block("text", { text: "Invoiced in EGP, so there's no exchange-rate difference." })
          : block("table", {
              empty: "No receipts yet.",
              columns: [
                { key: "label", label: "Receipt", supporting: "amount" },
                { key: "rate", label: "Rate", align: "end", supporting: "quoted" },
                { key: "difference", label: "FX difference", align: "end" },
                { key: "realised", label: "" },
              ],
              rows: p.fx.map((r) => ({
                label: { text: r.label, href: r.href },
                amount: r.amount,
                rate: r.rate.toFixed(2),
                quoted: `quoted ${r.quoteRate.toFixed(2)}`,
                difference: { ...diffCell(-r.difference), text: signed(Math.round(r.difference), egp) },
                realised: {
                  text: r.realised ? "Realised" : "Unrealised",
                  tone: r.realised ? "success" : "neutral",
                  tag: true,
                },
              })),
            }),
      ],
    });

    const claims = block("card", {
      heading: "Claims",
      blocks: [
        block("list", {
          empty: "No claims on this case.",
          items: p.claims.map((c) => ({
            headline: `${c.ref} · ${c.title}`,
            supporting: `${egp(c.amount)} against ${c.against} · ${c.note}${c.settled ? ` · settled by credit note ${c.creditNote}` : ""}`,
            dot: c.settled ? "success" : "warning",
            href: c.settled ? c.href : undefined,
            actions: !c.settled && p.canAct ? [a.claim(c.ref)!] : undefined,
          })),
        }),
        block("custom", {
          element: "ui-ai-read-file",
          props: {
            label: "Describe damage from a photo",
            imagePrompt:
              "This photo shows goods delivered to a ship. Describe any damage for a claim: which items, how many, what is damaged (dents, leaks, broken seals, wet cartons), and any visible labels, part numbers or batch numbers. Write only what you can see.",
            audioPrompt:
              "This voice note describes goods delivered to a ship. Write down the damage or shortage for a claim: which items, how many, and what is wrong.",
          },
        }),
      ],
    });
    blocks.push(block("split", { main: [costs], side: [fx, claims] }));
  } else {
    blocks.push(
      block("alert", {
        tone: "info",
        heading: "Expected profit is fixed at the customer PO",
        text: `${p.caseId} is at "${p.stage}". The expected profit is taken from the approved quotation once the customer's PO is confirmed; actuals follow as supplier bills arrive.`,
      }),
    );
  }

  const done = p.checks.filter((k) => k.ok).length;
  const all = done === p.checks.length;
  blocks.push(
    block("card", {
      heading: "Close checklist",
      tags: [{ label: `${done} of ${p.checks.length} green`, tone: all ? "success" : "warning" }],
      blocks: [
        block("text", {
          muted: true,
          variant: "body-sm",
          text: "The case closes only when quantities, documents, claims and balances reconcile.",
        }),
        block("gauges", {
          items: [
            {
              label: "Checks green",
              value: done,
              max: p.checks.length,
              tone: all ? "success" : "warning",
              valueText: `${done} / ${p.checks.length}`,
            },
          ],
        }),
        block("list", {
          items: p.checks.map((k) => {
            const act = checkAction(k, p, a);
            return {
              headline: k.label,
              supporting: k.detail,
              icon: k.ok ? "success" : "warning",
              tags: k.ok
                ? [{ label: "Done", tone: "success" as const }]
                : [{ label: "Open", tone: "warning" as const }],
              actions: [
                ...k.sources.map((s): Action => ({ label: s.label, href: s.href, variant: "text" })),
                ...(act ? [act] : []),
              ],
            };
          }),
        }),
        ...(p.closed ? [] : [block("actions", { items: [a.close] })]),
      ],
    }),
  );
  return { blocks };
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/case-profit/:id: the "Profit & close" tab as a View (src/app/view).
    path: "/views/case-profit/:id",
    method: "get",
    handler: async (req) => {
      const p = await guarded(req);
      return p instanceof Response ? p : Response.json(caseProfitView(p));
    },
  },
];
