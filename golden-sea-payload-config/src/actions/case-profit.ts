import type { Action } from "saastemlycrm-design-system/contracts";
import type { CaseProfit, CloseCheck } from "../endpoints/profit.ts";
import { numberFormat } from "../format/index.ts";
import { IS_MOCK } from "../flags.ts";
import { egp, pct } from "../format/profit.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * A case's profit and close: what people can do from the profit widgets (POST
 * /api/case-profit/:id/…, ../endpoints/profit.ts, which re-checks who may do what): confirm
 * actuals, record the receipt, settle a claim, close.
 */

/** An amount in its currency, as received, in the interface's language: "USD 12,480.5". */
const money = (amount: number, currency: string) => m.action_money({ currency, amount: numberFormat().format(amount) });

/** The bank reference the receipt form starts with. */
function receiptReference(): string | undefined {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    // The simulated bank movement's reference, filled in for the presenter.
    return "TRX-77984";
  } else {
    // TODO implement actual prod third party connections
    // The person types the reference from the bank statement.
    return undefined;
  }
}

export function profitActions(p: CaseProfit) {
  const base = `/case-profit/${encodeURIComponent(p.id)}`;
  const billed = p.lines.filter((l) => l.kind === "charge" && l.state === "Billed");
  const actuals: Action = {
    label: m.action_profit_confirm_actuals(),
    main: true,
    call: { path: `${base}/actuals` },
    confirm: {
      heading: m.action_profit_actuals_heading(),
      text: [
        m.action_profit_actuals_intro(),
        ...billed.map((l) =>
          m.action_profit_actual_line({
            label: l.label,
            detail: l.detail,
            expected: egp(l.expected),
            actual: egp(l.actual ?? 0),
          }),
        ),
      ].join("\n"),
      label: m.action_profit_confirm_actuals(),
    },
    done: m.action_profit_actuals_done(),
  };
  const r = p.receipt;
  const receipt: Action | undefined = r && {
    label: m.action_profit_record_receipt(),
    call: { path: `${base}/receipt` },
    prompt: m.action_profit_receipt_prompt({ invoice: r.number }),
    fields: [
      {
        type: "text",
        name: "reference",
        label: m.action_profit_bank_reference(),
        required: true,
        defaultValue: receiptReference(),
        admin: {
          description:
            r.currency === "EGP"
              ? m.action_profit_receipt_description({ amount: money(r.amount, r.currency), customer: p.customer })
              : m.action_profit_receipt_description_rate({
                  amount: money(r.amount, r.currency),
                  customer: p.customer,
                  rate: r.rate.toFixed(2),
                  currency: r.currency,
                }),
        },
      },
    ],
    done: m.action_profit_receipt_done({ invoice: r.number }),
  };
  const claim = (ref: string): Action | undefined => {
    const c = p.claims.find((x) => x.ref === ref);
    return (
      c && {
        label: m.action_profit_record_credit_note(),
        call: { path: `${base}/claims/${encodeURIComponent(c.ref)}` },
        confirm: {
          heading: m.action_profit_claim_heading({ ref: c.ref }),
          text: m.action_profit_claim_text({
            title: c.title,
            note: c.note,
            creditNote: c.creditNote,
            against: c.against,
            amount: egp(c.amount),
          }),
          label: m.action_profit_record_credit_note(),
        },
        done: m.action_profit_claim_done({ creditNote: c.creditNote, ref: c.ref }),
      }
    );
  };
  const close: Action = {
    label: m.action_profit_close(),
    main: true,
    call: { path: `${base}/close` },
    disabled: !p.canClose,
    reason: p.canClose
      ? m.action_profit_close_ready()
      : p.canAct
        ? m.action_profit_close_open()
        : m.action_profit_close_role(),
    confirm: {
      heading: m.action_profit_close_heading({ case: p.caseId }),
      text: m.action_profit_close_text({
        actual: egp(p.actual.profit),
        actualMargin: pct(p.actual.margin),
        expected: egp(p.expected.profit),
        expectedMargin: pct(p.expected.margin),
      }),
      label: m.action_profit_close(),
    },
    done: m.action_profit_close_done({ case: p.caseId }),
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
