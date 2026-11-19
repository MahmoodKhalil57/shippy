import { block, note, type Action, type Row, type Tone, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { BankChange, Cash, CashPayables, Decision, Draft, Receivable } from "../endpoints/cash.ts";
import * as link from "../links.ts";

/**
 * Root view "Receivables & payables" (/cash): what customers owe (ageing by customer, collection
 * reminders that respect each customer's contact rule) and what we owe suppliers (deposits,
 * balances on delivery, bills on hold), payments waiting for the Financial Director or the CEO,
 * the two-person bank-detail change with its call-back check, and cash in vs out for the next
 * 8 weeks. Data: GET /api/operations/cash (../endpoints/operations.ts), the reminder drafts
 * (GET /api/cash/reminder-drafts) and the payables side (GET /api/cash/payables, refused for
 * Sales); actions: POST /api/cash/… (../endpoints/cash.ts), which re-check who may do what. The
 * system records payments after the bank movement — it never pays.
 */

const cashData: Source = { endpoint: "/operations/cash" };
const payablesData: Source = { endpoint: "/cash/payables" };
const on = from<Cash>(cashData);
const onPayables = from<CashPayables>(payablesData);

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
const ruleOf = (r: string) => RULE[r] ?? RULE.allowed!;

const decisionLines = (list: Decision[]) =>
  list
    .map(
      (x) =>
        `${x.decision === "Approve" ? "Approved" : "Rejected"} by ${x.name || x.user}${x.at ? ` · ${dayTime(x.at)}` : ""}${x.reason ? ` — ${x.reason}` : ""}`,
    )
    .join("\n");

/* ---------------------------------------------------------------- actions */

function reminderAction(r: Receivable, d: Draft): Action {
  const internal = d.mode === "internal";
  const rule = ruleOf(d.rule);
  return {
    label: r.contactRule === "do-not-chase" ? "Internal reminder" : "Draft reminder",
    call: { path: "/cash/reminder", body: { invoice: r.id } },
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
  const call = (decision: "Approve" | "Reject") => ({ path: "/cash/decide", body: { approval: a.id, decision } });
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
      call: call("Reject"),
      confirm: { heading: `Reject: ${a.title}`, label: "Reject", tone: "error" },
      fields: [{ type: "textarea", name: "reason", label: "Reason (required)", required: true }],
      done: `Rejected: ${a.title}.`,
    },
    {
      label: bank ? "Approve after call-back" : "Approve",
      main: true,
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

/* ---------------------------------------------------------------- widgets */

const tiles = on({
  skeleton: "stats",
  render: (d) => {
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
  },
});

// Three series (the chart's limit): not due, 1–30, and 31+ days overdue.
const ageing = on({
  title: "Receivables ageing by customer",
  skeleton: "chart",
  render: (d) => [
    note(`Open balances in USD equivalent (USD/EGP ${d.fx.USD}, EUR/EGP ${d.fx.EUR}), by days past due.`),
    block("chart", {
      label: "Receivables ageing by customer",
      chart: {
        kind: "bars",
        labels: d.ageing.map((a) => a.customer.split(" ")[0]!),
        series: [
          { name: "Not due", values: d.ageing.map((a) => a.values[0]!) },
          { name: "1–30 days", values: d.ageing.map((a) => a.values[1]!) },
          { name: "31+ days", values: d.ageing.map((a) => a.values[2]! + a.values[3]!) },
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

const forecast = on({
  title: "Cash in vs out — next 8 weeks",
  skeleton: "chart",
  render: (d) => {
    const series = [{ name: "Cash in (expected receipts)", values: d.cashIn.map((v) => v * 1000) }];
    if (d.canSeePayables)
      series.push({ name: "Cash out (payables + fixed costs)", values: d.cashOut.map((v) => v * 1000) });
    return [
      note(
        `EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates${
          d.fixedWeeklyEgp
            ? `, plus EGP ${Math.round(d.fixedWeeklyEgp / 1000)}k a week of fixed costs from the budget`
            : ""
        }. Bills on hold are left out until they match.`,
      ),
      block("chart", {
        label: "Cash in vs out, next 8 weeks",
        chart: {
          kind: "line",
          labels: d.weeks,
          series,
          format: { unit: "money", currency: "EGP", compact: true, decimals: 0 },
        },
      }),
    ];
  },
});

const collections: Widget<{ cash: Cash; drafts: Record<string, Draft> }> = {
  title: "Collections — open invoices",
  skeleton: "table",
  source: { all: { cash: cashData, drafts: { endpoint: "/cash/reminder-drafts" } } },
  head: ({ cash: d }) => ({ count: d.receivables.length }),
  render: ({ cash: d, drafts }) => [
    note(
      "Reminders follow each customer's contact rule: “do not chase” accounts get an internal reminder only; for the others the AI drafts the email and a person reviews and sends it.",
    ),
    block("table", {
      columns: [
        { key: "number", label: "Invoice", supporting: "who" },
        { key: "balance", label: "Balance", supporting: "paid" },
        { key: "due", label: "Due", supporting: "overdue" },
        { key: "rule", label: "Contact rule" },
        { key: "einv", label: "E-invoice" },
        { key: "act", label: "Reminder", supporting: "last" },
      ],
      rows: d.receivables.map((r): Row => {
        const draft = drafts[r.id];
        const rule = ruleOf(r.contactRule);
        return {
          number: { text: r.number, href: link.doc("invoices", r.id), strong: true },
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
      }),
    }),
  ],
};

const remittance = on({
  title: "Match a remittance",
  head: () => ({ tags: [{ label: "On this device" }] }),
  render: (d) => [
    block("text", {
      muted: true,
      text: "Paste a customer's payment advice or remittance email: the invoice numbers and amount are read on this device, then matched to open invoices (by number, or by an equal balance). A person records the payment.",
    }),
    block("actions", {
      items: [
        {
          label: "Read and match",
          icon: "sparkles",
          disabled: !d.receivables.length,
          reason: d.receivables.length ? undefined : "No open invoices to match.",
          prompt: "Match a remittance",
          call: { path: "/cash/match" },
          fields: [
            { type: "text", name: "payer", label: "Paid by" },
            {
              type: "text",
              name: "invoices",
              label: "Invoice numbers",
              admin: { description: "Every invoice number mentioned, comma-separated." },
            },
            { type: "number", name: "amount", label: "Amount paid" },
            { type: "text", name: "reference", label: "Bank reference" },
          ],
          extract: {
            label: "Read and match",
            what: "customer remittance advice or payment email",
            placeholder: "Paste the remittance or payment advice…",
            fields: [
              { id: "invoices", label: "Invoice numbers", hint: "every invoice number mentioned, comma-separated" },
              { id: "amount", label: "Amount paid", type: "number" },
              { id: "currency", label: "Currency" },
              { id: "payer", label: "Paid by" },
              { id: "reference", label: "Bank reference" },
            ],
            into: {
              invoices: { field: "invoices" },
              amount: { field: "amount" },
              payer: { field: "payer" },
              reference: { field: "reference" },
            },
          },
          reply: true,
        },
      ],
    }),
  ],
});

const payables = onPayables({
  title: "Supplier payables",
  skeleton: "table",
  denied: "Supplier payables, payment approvals and bank details are not visible to Sales.",
  head: (d) => ({ count: d.payables.length }),
  render: (d) => [
    note(
      "Deposits paid against pro formas, balances due on delivery, and bills held when PO, receipt and bill don't match.",
    ),
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
      rows: d.payables.map((p): Row => {
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
                        call: { path: "/cash/request-approval", body: { payable: p.id } },
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
            href: p.caseId ? link.doc("cases", p.case, "order") : undefined,
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
      }),
    }),
  ],
});

const approvals = onPayables({
  title: "Payments needing approval",
  head: (d) => ({ count: d.approvals.length }),
  render: (d) => {
    const items = d.approvals.flatMap((a, i): ViewBlock[] => {
      const decisions = decisionLines(a.decisions);
      const actions: Action[] = [
        ...(a.canDecide ? decideActions(a, false).map((x): Action => ({ ...x, main: false as const })) : []),
        ...(a.status === "Approved" && d.canFinance && a.po
          ? [
              {
                label: "Record payment",
                call: { path: "/cash/record-payment", body: { approval: a.id } },
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
                    // A sample reference, fixed so the config stays pure.
                    defaultValue: `TRX-88${a.id.slice(-3)}`,
                  },
                ],
                done: `Payment ${money(a.amount, a.po.currency)} to ${a.po.supplier} recorded against ${a.po.number}.`,
              },
            ]
          : []),
      ];
      return [
        ...(i ? [block("divider", {})] : []),
        block("heading", { text: a.title }),
        block("text", {
          muted: true,
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
    return [
      note(
        "Every supplier payment needs the Financial Director or the CEO. Once approved, finance pays in the bank and records it here with the bank reference.",
      ),
      ...(items.length ? items : [block("empty", { heading: "Nothing waiting." })]),
    ];
  },
});

function bankChange(d: CashPayables, b: BankChange, me: string): ViewBlock {
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
            main: true,
            call: { path: "/cash/apply-bank", body: { approval: b.id } },
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
    tags: [{ label: b.applied ? "Applied" : b.status, tone: b.applied ? "success" : statusTone(b.status) }],
    blocks: [
      block("heading", { text: b.title }),
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
                { label: "Requested", value: `${b.request.requested.bankName} · ${b.request.requested.iban}` },
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
      ...(decisions ? [block("text", { text: decisions })] : []),
      block("alert", {
        tone: b.applied ? "success" : "warning",
        text: b.applied
          ? `New details applied to ${b.supplierName} and verified. Payments can use them.`
          : `Payments to ${b.supplierName} stay on the old, verified account until two different people — Finance and the CEO — approve after a call-back on the number on file.`,
      }),
      ...(actions.length ? [block("actions", { items: actions })] : []),
      ...(waiting ? [block("text", { text: waiting, muted: true })] : []),
    ],
  });
}

/** One card per bank-detail change in progress (as many as there are). */
const bankChanges = onPayables({ render: (d, { user }) => d.bankChanges.map((b) => bankChange(d, b, user.id)) });

export const cashPage = widgets({
  header: {
    eyebrow: "Finance · Tue 17 Nov",
    heading: "Receivables & payables",
    subtitle:
      "What customers owe, what we owe suppliers, and what needs a decision. Money moves only in the bank — here people approve and record it.",
    actions: [
      { label: "Approvals queue", href: "/approvals" },
      { label: "All invoices", href: link.list("invoices") },
    ],
  },
  widgets: [tiles, { grid: [ageing, forecast] }, collections, remittance, payables, approvals, bankChanges],
});
