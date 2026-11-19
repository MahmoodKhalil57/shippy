import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type Row, type Tone, type View, type ViewBlock } from "../../app/view/schema.ts";
import { cash, collectionDraftFor } from "../endpoints/operations.ts";

/**
 * Root view "Receivables & payables" (/cash): what customers owe (ageing by customer, collection
 * reminders that respect each customer's contact rule) and what we owe suppliers (deposits,
 * balances on delivery, bills on hold), payments waiting for the Financial Director or the CEO,
 * the two-person bank-detail change with its call-back check, and cash in vs out for the next
 * 8 weeks. Data: GET /api/operations/cash (../endpoints/operations.ts); Sales sees receivables
 * only. The actions below re-check who may do what. The system records payments after the bank
 * movement — it never pays.
 */

interface Receivable {
  id: string;
  number: string;
  caseId: string | null;
  case: string | null;
  customer: string;
  customerName: string;
  contactRule: string;
  currency: string;
  amount: number;
  paid: number;
  balance: number;
  dueDate: string;
  daysOverdue: number;
  eInvoice: string;
  lastReminder: string | null;
}
interface Payable {
  id: string;
  po: string;
  case: string;
  caseId: string | null;
  supplier: string;
  supplierName: string;
  currency: string;
  total: number;
  paid: number;
  balance: number;
  deposit: number;
  depositPct: number;
  depositApproval: { id: string; status: string } | null;
  bill: { id: string; number: string; status: string; holdReason?: string | null } | null;
  due: string;
  stage: string;
}
interface Decision {
  user: string;
  name: string;
  decision: string;
  reason?: string;
  at?: string;
}
interface PaymentApproval {
  id: string;
  title: string;
  type: string;
  detail?: string;
  status: string;
  caseId: string | null;
  case: string | null;
  approvers: { id: string; name: string }[];
  decisions: Decision[];
  po: { id: string; number: string; supplier: string; currency: string } | null;
  amount: number;
  kind: string;
  canDecide: boolean;
}
interface BankChange {
  id: string;
  title: string;
  status: string;
  supplierName: string;
  applied: boolean;
  decisions: Decision[];
  canDecide: boolean;
  request: {
    supplier: string;
    current: string;
    requested: { beneficiary: string; bankName: string; iban: string };
    requestedVia: string;
    phoneOnFile: string;
    phoneInRequest: string;
  } | null;
}
interface Cash {
  fx: { USD: number; EUR: number };
  receivables: Receivable[];
  ageing: { customer: string; values: number[]; total: number }[];
  buckets: string[];
  totals: { receivableUsd: number; overdueUsd: number };
  weeks: string[];
  canSeePayables: boolean;
  canFinance: boolean;
  payables: Payable[];
  payablesTotalEgp?: number;
  approvals: PaymentApproval[];
  bankChanges: BankChange[];
  cashIn: number[];
  cashOut: number[];
  fixedWeeklyEgp?: number;
}
interface Draft {
  mode: "internal" | "customer";
  rule: string;
  to?: string;
  title: string;
  subject?: string;
  body: string;
  confidence: number;
  note?: string;
}

/* ---------------------------------------------------------------- formats */

function money(n: number | undefined | null, cur = "USD"): string {
  if (n == null || Number.isNaN(n)) return "—";
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`;
}
const valid = (iso?: string | null) => Boolean(iso) && !Number.isNaN(new Date(String(iso)).getTime());
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const TIME = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const day = (iso?: string | null) => (valid(iso) ? DAY.format(new Date(String(iso))) : "—");
const dayTime = (iso?: string | null) => (valid(iso) ? TIME.format(new Date(String(iso))) : "—");
const usdK = { unit: "money", currency: "USD", compact: true } as const;
const egpK = (v: number) => `EGP ${Math.round(v)}k`;
const usdKText = (v: number) => `USD ${(v / 1000).toFixed(v < 10000 ? 1 : 0)}k`;

/** The tone for a status word, as the collection lists colour it (src/app/shared.ts `statusColor`). */
function statusTone(status = ""): Tone {
  if (/not awarded|expired|cancelled|superseded|skipped|ignored/i.test(status)) return "neutral";
  if (
    /blocked|mismatch|rejected|invalid|declined|no response|on hold|held|overdue|short|damaged|wrong|missing|late|unreachable|clarification|not sourced|lost|failed|reversed/i.test(
      status,
    )
  )
    return "error";
  if (
    /awaiting|waiting|pending|partial|planned|rescheduled|draft|submitted|approved 1|open|due|deposit to pay|needs review|requested|revision|returned|on watch|under review|documents pending/i.test(
      status,
    )
  )
    return "warning";
  if (
    /new|sent|validating|sourcing|comparing|purchasing|delivering|customs|scheduled|loading|dispatched|on board|boat transfer|trial|ready|introduced|prospect|in progress/i.test(
      status,
    )
  )
    return "info";
  if (
    /valid|matched|confirmed|ok|paid|received|delivered|approved|closed|settled|acknowledged|reconciled|recorded|done|resolved|won|active|linked|created|replied|selected|ordered|invoiced|released|first rfq/i.test(
      status,
    )
  )
    return "success";
  return "neutral";
}

const RULE: Record<string, { label: string; tone: "success" | "warning" | "error" }> = {
  allowed: { label: "Follow-ups allowed", tone: "success" },
  "one-follow-up": { label: "One follow-up", tone: "warning" },
  "do-not-chase": { label: "Do not chase", tone: "error" },
};
const ruleOf = (r: string) => RULE[r] ?? RULE.allowed;

const decisionLines = (list: Decision[]) =>
  list
    .map(
      (x) =>
        `${x.decision === "Approve" ? "Approved" : "Rejected"} by ${x.name || x.user}${x.at ? ` · ${dayTime(x.at)}` : ""}${x.reason ? ` — ${x.reason}` : ""}`,
    )
    .join("\n");

/* ---------------------------------------------------------------- actions */

const ACT = "/views/cash";

function reminderAction(r: Receivable, d: Draft): Action {
  const internal = d.mode === "internal";
  const rule = ruleOf(d.rule);
  return {
    label: r.contactRule === "do-not-chase" ? "Internal reminder" : "Draft reminder",
    variant: "tonal",
    call: { path: `${ACT}/reminder`, body: { invoice: r.id } },
    confirm: {
      heading: `Collection reminder — ${r.number}`,
      text: `AI draft · ${Math.round(d.confidence * 100)}% · ${rule.label}\n${
        internal
          ? `${r.customerName} must not be chased: no customer message is drafted — an internal reminder for the account owner instead.`
          : `To: ${d.to} · Subject: ${d.subject}`
      }`,
      label: internal ? "Create internal reminder" : "Send reminder",
    },
    fields: [
      {
        type: "textarea",
        name: "body",
        label: internal ? "Internal reminder" : "Email (edit before sending)",
        required: true,
        defaultValue: d.body,
        admin: { rows: 10, description: d.note },
      },
    ],
    done: internal
      ? `Internal reminder created — nothing sent to ${r.customerName}.`
      : `Reminder sent to ${r.customerName} by you (logged on the account).`,
  };
}

function decideActions(a: { id: string; title: string }, bank: BankChange["request"] | false): Action[] {
  const call = (decision: "Approve" | "Reject") => ({
    path: `${ACT}/decide`,
    body: { approval: a.id, decision },
  });
  const approveFields: Action["fields"] = [
    ...(bank
      ? [
          {
            type: "checkbox",
            name: "callBack",
            label: "I called back on the number on file and the supplier confirmed the new account",
          },
        ]
      : []),
    { type: "textarea", name: "reason", label: "Note (optional)" },
  ];
  return [
    {
      label: "Reject",
      variant: "text",
      call: call("Reject"),
      confirm: { heading: `Reject: ${a.title}`, label: "Reject", tone: "error" },
      fields: [{ type: "textarea", name: "reason", label: "Reason (required)", required: true }],
      done: `Rejected: ${a.title}.`,
    },
    {
      label: bank ? "Approve after call-back" : "Approve",
      variant: "filled",
      call: call("Approve"),
      confirm: {
        heading: `Approve: ${a.title}`,
        text: bank
          ? `Call the supplier back on the number on file (${bank.phoneOnFile || "—"}) — never on a number from the request — and confirm the new account with them.`
          : undefined,
        label: "Approve",
      },
      fields: approveFields,
      done: `Approved: ${a.title}.`,
    },
  ];
}

/* ---------------------------------------------------------------- blocks */

function tiles(d: Cash): ViewBlock {
  const overdue = d.receivables.filter((r) => r.daysOverdue > 0);
  const pending = d.approvals.filter((a) => !["Approved", "Rejected"].includes(a.status)).length;
  const net = d.cashIn.reduce((s, v) => s + v, 0) - d.cashOut.reduce((s, v) => s + v, 0);
  return block("stats", {
    items: [
      {
        label: "Receivables",
        value: money(d.totals.receivableUsd, "USD"),
        note: `${d.receivables.length} open invoices · USD equivalent`,
      },
      {
        label: "Overdue",
        value: money(d.totals.overdueUsd, "USD"),
        note: `${overdue.length} invoices · ${new Set(overdue.map((o) => o.customer)).size} customers`,
        tone: overdue.length ? "error" : "success",
      },
      ...(d.canSeePayables
        ? [
            {
              label: "Payables",
              value: money(d.payablesTotalEgp ?? 0, "EGP"),
              note: `${d.payables.length} supplier balances open`,
            },
            {
              label: "Payments to approve",
              value: String(pending),
              note: "Financial Director or CEO",
              tone: pending ? ("warning" as const) : ("success" as const),
            },
            {
              label: "Net cash, 8 weeks",
              value: egpK(net),
              note: "Expected receipts − committed payments − fixed costs",
              tone: net < 0 ? ("error" as const) : ("success" as const),
            },
          ]
        : []),
    ],
  });
}

function ageing(d: Cash): ViewBlock {
  // Three series (the chart's limit): not due, 1–30, and 31+ days overdue.
  return block("card", {
    heading: "Receivables ageing by customer",
    blocks: [
      block("text", {
        muted: true,
        text: `Open balances in USD equivalent (USD/EGP ${d.fx.USD}, EUR/EGP ${d.fx.EUR}), by days past due.`,
      }),
      block("chart", {
        label: "Receivables ageing by customer",
        chart: {
          kind: "bars",
          labels: d.ageing.map((a) => a.customer.split(" ")[0]),
          series: [
            { name: "Not due", values: d.ageing.map((a) => a.values[0]) },
            { name: "1–30 days", values: d.ageing.map((a) => a.values[1]) },
            { name: "31+ days", values: d.ageing.map((a) => a.values[2] + a.values[3]) },
          ],
          format: usdK,
        },
      }),
      block("table", {
        columns: [
          { key: "customer", label: "Customer" },
          ...d.buckets.map((b) => ({ key: b, label: b, align: "end" as const })),
          { key: "total", label: "Total", align: "end" },
        ],
        rows: d.ageing.map((a) => ({
          customer: { text: a.customer, strong: true },
          ...Object.fromEntries(
            d.buckets.map((b, i) => {
              const v = a.values[i];
              return [b, v ? { text: usdKText(v), tone: i >= 2 ? "error" : i === 1 ? "warning" : undefined } : "—"];
            }),
          ),
          total: { text: usdKText(a.total), strong: true },
        })),
      }),
    ],
  });
}

function forecast(d: Cash): ViewBlock {
  const series = [{ name: "Cash in (expected receipts)", values: d.cashIn.map((v) => v * 1000) }];
  if (d.canSeePayables)
    series.push({
      name: "Cash out (payables + fixed costs)",
      values: d.cashOut.map((v) => v * 1000),
    });
  return block("card", {
    heading: "Cash in vs out — next 8 weeks",
    blocks: [
      block("text", {
        muted: true,
        text: `EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates${
          d.fixedWeeklyEgp
            ? `, plus EGP ${Math.round(d.fixedWeeklyEgp / 1000)}k a week of fixed costs from the budget`
            : ""
        }. Bills on hold are left out until they match.`,
      }),
      block("chart", {
        label: "Cash in vs out, next 8 weeks",
        chart: {
          kind: "line",
          labels: d.weeks,
          series,
          format: { unit: "money", currency: "EGP", compact: true, decimals: 0 },
        },
      }),
    ],
  });
}

function collections(d: Cash, drafts: Map<string, Draft>): ViewBlock {
  const rows: Row[] = d.receivables.map((r) => {
    const draft = drafts.get(r.id);
    const rule = ruleOf(r.contactRule);
    return {
      number: { text: r.number, href: `/collections/invoices/${r.id}`, strong: true },
      who: `${r.customerName}${r.caseId ? ` · ${r.caseId}` : ""}`,
      balance: money(r.balance, r.currency),
      paid: r.paid ? `of ${money(r.amount, r.currency)} · ${money(r.paid, r.currency)} paid` : null,
      due: day(r.dueDate),
      overdue: {
        text: r.daysOverdue > 0 ? `${r.daysOverdue} days overdue` : `in ${-r.daysOverdue} days`,
        tone: r.daysOverdue > 30 ? "error" : r.daysOverdue > 0 ? "warning" : undefined,
      },
      rule: { text: rule.label, tone: rule.tone, tag: true },
      einv: { text: r.eInvoice, tone: statusTone(r.eInvoice), tag: true },
      act: draft ? { text: "", actions: [reminderAction(r, draft)] } : "Not due yet",
      last: r.lastReminder ? `Last: ${r.lastReminder}` : null,
    };
  });
  return block("card", {
    heading: "Collections — open invoices",
    count: d.receivables.length,
    blocks: [
      block("text", {
        muted: true,
        text: "Reminders follow each customer's contact rule: “do not chase” accounts get an internal reminder only; for the others the AI drafts the email and a person reviews and sends it.",
      }),
      block("table", {
        columns: [
          { key: "number", label: "Invoice", supporting: "who" },
          { key: "balance", label: "Balance", supporting: "paid" },
          { key: "due", label: "Due", supporting: "overdue" },
          { key: "rule", label: "Contact rule" },
          { key: "einv", label: "E-invoice" },
          { key: "act", label: "Reminder", supporting: "last" },
        ],
        rows,
      }),
    ],
  });
}

function remittance(d: Cash): ViewBlock {
  return block("card", {
    heading: "Match a remittance",
    tags: [{ label: "On this device" }],
    blocks: [
      block("text", {
        muted: true,
        variant: "body-sm",
        text: "Paste a customer's payment advice or remittance email: the invoice numbers and amount are read on this device, then matched to open invoices. A person records the payment.",
      }),
      block("custom", {
        element: "gs-remittance-match",
        props: {
          invoices: d.receivables.map((r) => ({
            id: r.id,
            number: r.number,
            customerName: r.customerName,
            balance: r.balance,
            currency: r.currency,
            open: money(r.balance, r.currency),
          })),
        },
      }),
    ],
  });
}

function payables(d: Cash): ViewBlock {
  const rows: Row[] = d.payables.map((p) => {
    const hasApproval = d.approvals.some((a) => a.po?.id === p.id);
    const act =
      p.stage === "Bill on hold"
        ? "Waits for receipt / credit note"
        : hasApproval || p.depositApproval
          ? "Approval in progress"
          : d.canFinance
            ? {
                text: "",
                actions: [
                  {
                    label: "Request payment approval",
                    variant: "tonal" as const,
                    call: { path: `${ACT}/request-approval`, body: { payable: p.id } },
                    confirm: {
                      heading: `Request payment approval — ${p.supplierName}`,
                      text: `${p.supplierName} · ${p.po} · balance ${money(p.balance, p.currency)} due ${day(p.due)}${p.bill ? ` · bill ${p.bill.number} ${p.bill.status}` : ""}.\nRouted to Mohamed Helmy (Financial Director) or Karim Balbaa (CEO).`,
                      label: "Request approval",
                    },
                    done: "Payment approval requested from Mohamed Helmy or Karim Balbaa.",
                  },
                ],
              }
            : null;
    const stageNote = [
      p.bill?.holdReason ?? "",
      p.depositPct
        ? `Deposit ${p.depositPct}% ${money(p.deposit, p.currency)}${p.paid ? " · paid" : p.depositApproval ? ` · approval ${p.depositApproval.status}` : ""}`
        : "",
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      supplier: {
        text: p.supplierName,
        strong: true,
        href: p.caseId ? `/collections/cases/${p.case}/order` : undefined,
      },
      ref: `${p.po}${p.caseId ? ` · ${p.caseId}` : ""}${p.bill ? ` · bill ${p.bill.number}` : ""}`,
      stage: {
        text: p.stage,
        tag: true,
        tone:
          p.stage === "Bill on hold"
            ? "error"
            : p.stage === "Deposit to pay" || p.stage === "Balance due"
              ? "warning"
              : "neutral",
      },
      stageNote: stageNote ? { text: stageNote, tone: p.bill?.holdReason ? "error" : undefined } : null,
      total: money(p.total, p.currency),
      paid: p.paid ? money(p.paid, p.currency) : "—",
      balance: { text: money(p.balance, p.currency), strong: true },
      due: day(p.due),
      act,
    };
  });
  return block("card", {
    heading: "Supplier payables",
    count: d.payables.length,
    blocks: [
      block("text", {
        muted: true,
        text: "Deposits paid against pro formas, balances due on delivery, and bills held when PO, receipt and bill don't match.",
      }),
      block("table", {
        columns: [
          { key: "supplier", label: "Supplier", supporting: "ref" },
          { key: "stage", label: "Stage", supporting: "stageNote" },
          { key: "total", label: "Total", align: "end" },
          { key: "paid", label: "Paid", align: "end" },
          { key: "balance", label: "Balance", align: "end" },
          { key: "due", label: "Due" },
          { key: "act", label: "" },
        ],
        rows,
      }),
    ],
  });
}

function approvals(d: Cash): ViewBlock {
  const items = d.approvals.flatMap((a, i): ViewBlock[] => {
    const decisions = decisionLines(a.decisions);
    const actions: Action[] = [
      ...(a.canDecide
        ? decideActions(a, false).map((x) => (x.variant === "filled" ? { ...x, variant: "tonal" as const } : x))
        : []),
      ...(a.status === "Approved" && d.canFinance && a.po
        ? [
            {
              label: "Record payment",
              variant: "tonal" as const,
              call: { path: `${ACT}/record-payment`, body: { approval: a.id } },
              confirm: {
                heading: `Record supplier payment — ${a.po.number}`,
                text: `${money(a.amount, a.po.currency)} to ${a.po.supplier} (${a.kind}) — approved. Pay it in the bank first, then record the bank reference here.`,
                label: "Record payment",
              },
              fields: [
                {
                  type: "text",
                  name: "reference",
                  label: "Bank reference",
                  required: true,
                  defaultValue: "TRX-88" + String(Date.now()).slice(-3),
                },
              ],
              done: `Payment ${money(a.amount, a.po.currency)} to ${a.po.supplier} recorded against ${a.po.number}.`,
            },
          ]
        : []),
    ];
    return [
      ...(i ? [block("divider", {})] : []),
      block("text", { text: a.title, variant: "title-md" }),
      block("text", {
        muted: true,
        variant: "body-sm",
        text: [
          `${a.type}${a.caseId ? ` · ${a.caseId}` : ""}${a.po ? ` · ${money(a.amount, a.po.currency)}` : ""} · approvers ${a.approvers.map((p) => p.name).join(" or ")}`,
          a.detail ?? "",
          decisions,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
      block("tags", { items: [{ label: a.status, tone: statusTone(a.status) }] }),
      ...(actions.length ? [block("actions", { items: actions })] : []),
    ];
  });
  return block("card", {
    heading: "Payments needing approval",
    count: d.approvals.length,
    blocks: [
      block("text", {
        muted: true,
        text: "Every supplier payment needs the Financial Director or the CEO. Once approved, finance pays in the bank and records it here with the bank reference.",
      }),
      ...(items.length ? items : [block("empty", { heading: "Nothing waiting." })]),
    ],
  });
}

function bankChange(d: Cash, b: BankChange, me: string): ViewBlock {
  const approved = b.decisions.filter((x) => x.decision === "Approve");
  const callBackDone = approved.length > 0 || b.decisions.some((x) => /call-back/i.test(x.reason ?? ""));
  const current = b.applied ? 5 : b.status === "Approved" ? 4 : approved.length === 1 ? 3 : callBackDone ? 2 : 1;
  const decisions = decisionLines(b.decisions);
  const actions: Action[] = [
    ...(b.canDecide ? decideActions(b, b.request) : []),
    ...(b.status === "Approved" && !b.applied && d.canFinance
      ? [
          {
            label: "Apply new bank details",
            variant: "filled" as const,
            call: { path: `${ACT}/apply-bank`, body: { approval: b.id } },
            done: `New bank details applied to ${b.supplierName} — verified by two people.`,
          },
        ]
      : []),
  ];
  const waiting =
    !b.canDecide && b.status !== "Approved"
      ? b.decisions.some((x) => x.user === me)
        ? "You have decided — a second, different person must approve."
        : "Waiting for an approver."
      : "";
  return block("card", {
    heading: "Bank-detail change — two-person check",
    tags: [
      {
        label: b.applied ? "Applied" : b.status,
        tone: b.applied ? "success" : statusTone(b.status),
      },
    ],
    blocks: [
      block("text", { text: b.title, variant: "label-lg" }),
      block("steps", {
        current: current - 1,
        items: [
          { label: "Request received" },
          { label: "Call-back on number on file" },
          { label: "First approval" },
          { label: "Second approval" },
          { label: "Applied & verified" },
        ],
      }),
      ...(b.request
        ? [
            block("details", {
              items: [
                { label: "Current account", value: b.request.current },
                {
                  label: "Requested",
                  value: `${b.request.requested.bankName} · ${b.request.requested.iban}`,
                },
                { label: "Request came by", value: b.request.requestedVia },
                {
                  label: "Call back on",
                  value: b.request.phoneOnFile,
                  note: `Never: ${b.request.phoneInRequest}`,
                  noteTone: "error",
                },
              ],
            }),
          ]
        : []),
      ...(decisions ? [block("text", { text: decisions, variant: "body-sm" })] : []),
      block("alert", {
        tone: b.applied ? "success" : "warning",
        text: b.applied
          ? `New details applied to ${b.supplierName} and verified. Payments can use them.`
          : `Payments to ${b.supplierName} stay on the old, verified account until two different people — Finance and the CEO — approve after a call-back on the number on file.`,
      }),
      ...(actions.length ? [block("actions", { items: actions })] : []),
      ...(waiting ? [block("text", { text: waiting, muted: true, variant: "body-sm" })] : []),
    ],
  });
}

export function cashView(d: Cash, drafts: Map<string, Draft>, me: string): View {
  return {
    header: {
      eyebrow: "Finance · Tue 17 Nov",
      heading: "Receivables & payables",
      subtitle:
        "What customers owe, what we owe suppliers, and what needs a decision. Money moves only in the bank — here people approve and record it.",
      actions: [
        { label: "Approvals queue", href: "/approvals" },
        { label: "All invoices", href: "/collections/invoices" },
      ],
    },
    blocks: [
      tiles(d),
      block("grid", { fit: "lg", blocks: [ageing(d), forecast(d)] }),
      collections(d, drafts),
      remittance(d),
      ...(d.canSeePayables
        ? [payables(d), approvals(d), ...d.bankChanges.map((b) => bankChange(d, b, me))]
        : [
            block("alert", {
              tone: "info",
              text: "Supplier payables, payment approvals and bank details are not visible to Sales.",
            }),
          ]),
    ],
  };
}

/* ---------------------------------------------------------------- endpoints */

const fail = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });

async function input(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await (req as unknown as { json: () => Promise<unknown> }).json()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** The cash payload as the signed-in user sees it, or the refusal. */
async function load(req: PayloadRequest): Promise<Cash | Response> {
  const res = await cash(req);
  return res.ok ? ((await res.json()) as Cash) : res;
}

async function draft(req: PayloadRequest, invoice: string): Promise<Draft | null> {
  const res = await collectionDraftFor(req, invoice);
  return res.ok ? ((await res.json()) as Draft) : null;
}

const userId = (req: PayloadRequest) => String((req.user as { id?: string } | null)?.id ?? "");
const s = (v: unknown) => (typeof v === "string" ? v : "");

/** A POST under /views/cash that needs the cash payload and a signed-in user. */
const action = (
  path: string,
  run: (req: PayloadRequest, d: Cash, b: Record<string, unknown>) => Promise<Response>,
): Endpoint => ({
  path: `${ACT}/${path}`,
  method: "post",
  handler: async (req: PayloadRequest) => {
    if (!req.user) return fail("You are not allowed to perform this action.", 401);
    const d = await load(req);
    if (d instanceof Response) return d;
    try {
      return await run(req, d, await input(req));
    } catch (e) {
      const err = e as Error & { status?: number; data?: { errors?: { message: string }[] } };
      return fail(err.data?.errors?.map((x) => x.message).join("; ") || err.message, err.status ?? 400);
    }
  },
});

const create = (req: PayloadRequest, collection: string, data: Record<string, unknown>) =>
  req.payload.create({ collection: collection as never, data: data as never, req });
const update = (req: PayloadRequest, collection: string, id: string, data: Record<string, unknown>) =>
  req.payload.update({ collection: collection as never, id, data: data as never, req });

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/cash: receivables & payables as a View (src/app/view).
    path: ACT,
    method: "get",
    handler: async (req: PayloadRequest) => {
      const d = await load(req);
      if (d instanceof Response) return d;
      const drafts = new Map<string, Draft>();
      for (const r of d.receivables.filter((x) => x.daysOverdue > -5)) {
        const x = await draft(req, r.id);
        if (x) drafts.set(r.id, x);
      }
      return Response.json(cashView(d, drafts, userId(req)));
    },
  },
  // A person sends the reminder (or files the internal one): recorded as a task on the account.
  action("reminder", async (req, d, b) => {
    const invoice = d.receivables.find((r) => r.id === s(b.invoice));
    if (!invoice) return fail("Invoice not found.", 404);
    const x = await draft(req, invoice.id);
    if (!x) return fail("Invoice not found.", 404);
    const text = s(b.body).trim() || x.body;
    const internal = x.mode === "internal";
    await create(req, "tasks", {
      title: x.title,
      type: internal ? "Internal reminder" : "Customer follow-up",
      channel: internal ? "Internal" : "Email",
      due: new Date().toISOString(),
      case: invoice.case ?? undefined,
      customer: invoice.customer,
      who: internal ? "Account owner" : x.to,
      goal: `Collect ${money(invoice.balance, invoice.currency)} on ${invoice.number}`,
      script: internal ? text : `${x.subject}\n\n${text}`,
      internalOnly: internal,
      owner: userId(req),
      createdByRule: "Collection reminder",
      stopCondition: "Payment received",
      ...(internal ? {} : { status: "Done", outcome: { result: "Sent", note: "Reviewed and sent by a person." } }),
    });
    return Response.json({ ok: true });
  }),
  // An approver decides on a payment or a bank-detail change (once, and only if they are named on it).
  action("decide", async (req, d, b) => {
    const id = s(b.approval);
    const bank = d.bankChanges.find((x) => x.id === id);
    const item = bank ?? d.approvals.find((x) => x.id === id);
    if (!item) return fail("Approval not found.", 404);
    if (!item.canDecide) return fail("You can't decide on this approval.", 403);
    const decision = s(b.decision) === "Reject" ? "Reject" : "Approve";
    const note = s(b.reason).trim();
    if (decision === "Reject" && !note) return fail("Give a reason for rejecting.");
    if (bank && decision === "Approve" && b.callBack !== true)
      return fail("Call back on the number on file and tick the confirmation first.");
    const reason = bank && b.callBack === true ? `Call-back done on number on file. ${note}`.trim() : note;
    const current = (await req.payload.findByID({
      collection: "approvals" as never,
      id,
      depth: 0,
    })) as {
      decisions?: Record<string, unknown>[];
    };
    await update(req, "approvals", id, {
      decisions: [...(current.decisions ?? []), { decision, reason }],
    });
    return Response.json({ ok: true });
  }),
  // Finance applies the new bank details once two people approved.
  action("apply-bank", async (req, d, b) => {
    const bank = d.bankChanges.find((x) => x.id === s(b.approval));
    if (!bank?.request) return fail("Bank-detail change not found.", 404);
    if (!d.canFinance) return fail("Management and finance apply bank details.", 403);
    if (bank.status !== "Approved" || bank.applied) return fail("Two different people must approve first.");
    const r = bank.request;
    await update(req, "suppliers", r.supplier, {
      bank: {
        beneficiary: r.requested.beneficiary,
        bankName: r.requested.bankName,
        iban: r.requested.iban,
        verified: true,
        verifiedBy: userId(req),
        verifiedAt: new Date().toISOString(),
      },
    });
    return Response.json({ ok: true });
  }),
  // Finance records a supplier payment made in the bank against its approval.
  action("record-payment", async (req, d, b) => {
    const a = d.approvals.find((x) => x.id === s(b.approval));
    if (!a?.po) return fail("Approval not found.", 404);
    if (!d.canFinance) return fail("Management and finance record payments.", 403);
    if (a.status !== "Approved") return fail("The payment isn't approved yet.");
    const reference = s(b.reference).trim();
    if (!reference) return fail("Give the bank reference.");
    await create(req, "payments", {
      direction: "out",
      reference,
      paidAt: new Date().toISOString(),
      amount: a.amount,
      currency: a.po.currency,
      purchaseOrder: a.po.id,
      approval: a.id,
      kind: a.kind,
      status: "Recorded",
    });
    return Response.json({ ok: true });
  }),
  // Finance asks the Financial Director or the CEO to approve a supplier payment.
  action("request-approval", async (req, d, b) => {
    const p = d.payables.find((x) => x.id === s(b.payable));
    if (!p) return fail("Payable not found.", 404);
    if (!d.canFinance) return fail("Management and finance request payment approvals.", 403);
    if (p.stage === "Bill on hold" || p.depositApproval || d.approvals.some((a) => a.po?.id === p.id))
      return fail("An approval is already in progress for this payable.");
    await create(req, "approvals", {
      title: `Pay ${p.supplierName} ${money(p.balance, p.currency)} — ${p.po}`,
      type: "Supplier payment",
      case: p.case,
      detail: `PO ${p.po}${p.bill ? ` · bill ${p.bill.number} matched (PO = receipt = bill)` : ""} · due ${day(p.due)} · bank details unchanged.`,
      approvers: ["kb", "mh"],
      subject: { relationTo: "purchase-orders", value: p.id },
    });
    for (const user of ["kb", "mh"])
      await create(req, "notifications", {
        user,
        title: `Approve payment to ${p.supplierName}`,
        detail: `${money(p.balance, p.currency)} · ${p.po}`,
        kind: "Payment",
        href: "/cash",
      }).catch(() => null);
    return Response.json({ ok: true });
  }),
];
