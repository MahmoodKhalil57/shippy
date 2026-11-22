import type { Action } from "saastemlycrm-design-system/contracts";
import type { CaseProfit, CloseCheck } from "../endpoints/profit.ts";
import { egp, pct } from "../format/profit.ts";

/**
 * A case's profit and close: what people can do from the profit widgets (POST
 * /api/case-profit/:id/…, ../endpoints/profit.ts, which re-checks who may do what): confirm
 * actuals, record the receipt, settle a claim, close.
 */
export function profitActions(p: CaseProfit) {
  const base = `/case-profit/${encodeURIComponent(p.id)}`;
  const billed = p.lines.filter((l) => l.kind === "charge" && l.state === "Billed");
  const actuals: Action = {
    label: "Confirm actuals",
    main: true,
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
    main: true,
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

/** The action that turns an open close check green, under the check's own label. */
export function checkAction(k: CloseCheck, p: CaseProfit, a: ReturnType<typeof profitActions>): Action | undefined {
  if (k.ok || !k.action || p.closed) return undefined;
  const pick =
    k.action === "actuals"
      ? a.actuals
      : k.action === "receipt"
        ? a.receipt
        : a.claim(p.claims.find((c) => !c.settled)?.ref ?? "");
  return pick && { ...pick, label: k.actionLabel ?? pick.label };
}
