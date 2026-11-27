import type { Action, IconName, KindData, Tag, Tone, WidgetScope } from "saastemlycrm-design-system/contracts";
import type { CaseLine, CaseRfqRow, CaseRfqsPayload, ReplyEvent, RfqDraft } from "../endpoints/sourcing.ts";
import { m } from "../i18n/paraglide/messages.js";
import * as link from "../links.ts";
import { email } from "./commercial.ts";
import { count, dateFormat, numberFormat, numberLocale } from "./index.ts";

export const at = (v: string) =>
  v
    ? dateFormat({ day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(
        new Date(v),
      )
    : "—";
export const dated = (v: string) =>
  v ? dateFormat({ day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(v)) : "—";

const names = (list: string[]) => list.join(numberLocale().startsWith("ar") ? "، " : ", ");

export const OPEN = ["Sent", "Awaiting reply", "Partial reply", "Clarification needed", "Escalated"];

export const chased = (r: CaseRfqRow) => OPEN.includes(r.status) || r.escalated;

export type NewSupplier = CaseRfqsPayload["newSuppliers"][number];

export const newSupplier = (s: NewSupplier, d: CaseRfqsPayload): KindData<"list"> => ({
  head: { tags: [{ label: m.sourcing_new_supplier_tag(), tone: "primary" }] },
  note: [
    m.sourcing_saved_on_reply(),
    ...s.prices.map((p) =>
      m.sourcing_quoted_line({
        description: p.description,
        price:
          d.canSeeCosts && p.price !== undefined
            ? m.sourcing_price({ currency: p.currency, price: count(p.price), per: p.per })
            : m.sourcing_price_hidden(),
        quoted: dated(p.quotedAt),
        valid: dated(p.validUntil),
      }),
    ),
  ].join("\n"),
  items: [
    {
      headline: `${s.city} · ${s.source}`,
      href: link.doc("suppliers", s.id),
      supporting: m.sourcing_supplier_record(),
    },
  ],
});

const OUTCOME: Record<ReplyEvent["outcome"], { tone: Tone; icon: IconName; words: () => string }> = {
  Replied: { tone: "success", icon: "success", words: m.sourcing_outcome_replied },
  Declined: { tone: "neutral", icon: "x", words: m.sourcing_outcome_declined },
  "Reminder sent": { tone: "warning", icon: "send", words: m.sourcing_outcome_reminder },
  Escalated: { tone: "error", icon: "warning", words: m.sourcing_outcome_escalated },
  "New supplier saved": { tone: "info", icon: "user", words: m.sourcing_outcome_new_supplier },
};

export const replyArrivals = (d: CaseRfqsPayload): KindData<"timeline"> => ({
  items: d.arrivals.map((e) => ({
    heading: `${OUTCOME[e.outcome].words()} · ${e.supplier} · ${e.reference}`,
    text: [e.subject ? m.sourcing_subject({ subject: e.subject }) : "", e.detail].filter(Boolean).join("\n"),
    icon: OUTCOME[e.outcome].icon,
    tone: OUTCOME[e.outcome].tone,
    done: true,
  })),
});

export const reminderRule = (d: CaseRfqsPayload): KindData<"text"> => ({
  text: m.sourcing_reminder_rule({ owner: d.case.ownerName }),
  note: d.rfqs.some(chased) ? undefined : m.sourcing_no_one_chased(),
});

export const reminderSchedule = (r: CaseRfqRow): KindData<"steps"> => ({
  tone: r.escalated ? "error" : "primary",
  current: r.schedule.filter((s) => s.state === "done").length - 1,
  items: r.schedule.map((s) => ({
    label: s.label,
    supporting:
      s.state === "skipped"
        ? m.sourcing_not_needed()
        : s.state === "next"
          ? m.sourcing_next_at({ at: at(s.at) })
          : at(s.at),
    state: s.state === "done" || s.state === "skipped" ? s.state : undefined,
  })),
});

function picked(lines: CaseLine[]): number[] {
  const sendable = lines.filter((l) => !l.held);
  const fresh = sendable.filter((l) => !l.rfqs.length && !l.offers);
  return (fresh.length ? fresh : sendable).map((l) => l.lineNo);
}

const lineState = (l: CaseLine) =>
  [
    `${numberFormat({ useGrouping: false, maximumFractionDigits: 20 }).format(l.qty)} ${l.unit} · ${l.category}`,
    l.held
      ? m.sourcing_line_held({ reason: l.held })
      : l.rfqs.length
        ? m.sourcing_line_asked({ rfqs: names(l.rfqs) })
        : "",
    l.offers ? m.sourcing_line_offers({ n: l.offers, count: count(l.offers) }) : "",
  ]
    .filter(Boolean)
    .join(" · ");

const heldLines = (held: { lineNo: number; reason: string }[]) =>
  held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ");

export const rfqLines = (d: CaseRfqsPayload, { params }: WidgetScope): KindData<"list"> => {
  const mode = params.send === "full" ? "full" : "split";
  const sendable = d.lines.filter((l) => !l.held);
  const held = d.lines.filter((l) => l.held);
  return {
    choice: {
      param: "send",
      label: m.sourcing_how_to_send(),
      value: "split",
      options: [
        { value: "split", label: m.sourcing_split() },
        { value: "full", label: m.sourcing_full() },
      ],
    },
    note: mode === "split" ? m.sourcing_split_note() : m.sourcing_full_note(),
    items: d.lines.map((l) => ({
      headline: `L${l.lineNo} · ${l.description}`,
      supporting: lineState(l),
      dot: l.held
        ? ("warning" as const)
        : l.offers
          ? ("success" as const)
          : l.rfqs.length
            ? ("info" as const)
            : undefined,
    })),
    empty: m.sourcing_no_lines(),
    actions: d.canSource ? [draftAction(d, mode, sendable, held)] : undefined,
  };
};

const draftAction = (d: CaseRfqsPayload, mode: "split" | "full", sendable: CaseLine[], held: CaseLine[]): Action => ({
  label: m.sourcing_draft_rfqs(),
  icon: "sparkles",
  prompt: m.sourcing_draft_rfqs_prompt(),
  disabled: !sendable.length,
  reason: sendable.length ? undefined : m.sourcing_all_held(),
  call: { path: "/sourcing/cases/$doc.id/plan", body: { mode } },
  fields: [
    {
      type: "select",
      name: "lineNos",
      label: m.sourcing_lines(),
      hasMany: true,
      required: true,
      defaultValue: picked(d.lines).map(String),
      options: sendable.map((l) => ({
        value: String(l.lineNo),
        label: `L${l.lineNo} · ${l.description} · ${lineState(l)}`,
      })),
      admin: {
        description: held.length
          ? m.sourcing_held_back({ lines: heldLines(held.map((l) => ({ lineNo: l.lineNo, reason: l.held! }))) })
          : m.sourcing_system_chooses(),
      },
    },
  ],
  reply: true,
});

const anonymised = (): Tag[] =>
  [
    m.sourcing_client_removed(),
    m.sourcing_vessel_removed(),
    m.sourcing_no_customer_files(),
    m.sourcing_our_reference(),
  ].map((label) => ({ label, tone: "success", icon: "success" }));

export const rfqDrafts = (d: CaseRfqsPayload): KindData<"list"> | null => {
  const plan = d.plan;
  if (!plan) return null;
  const n = plan.drafts.length;
  const many = { n, count: count(n) };
  return {
    head: {
      count: n,
      tags: [{ label: plan.mode === "full" ? m.sourcing_full() : m.sourcing_split() }],
      actions: d.canSource
        ? [
            {
              label: m.sourcing_discard_drafts(),
              call: { path: "/sourcing/cases/$doc.id/plan/discard" },
              done: m.sourcing_drafts_discarded(),
            },
            {
              label: m.sourcing_send_n(many),
              icon: "send",
              main: true,
              call: { path: "/sourcing/cases/$doc.id/send" },
              confirm: {
                heading: m.sourcing_send_heading(),
                text: m.sourcing_send_text({
                  ...many,
                  suppliers: names(plan.drafts.map((r) => r.supplierName)),
                  due: at(plan.dueAt),
                }),
                label: m.sourcing_send_label(),
              },
              done: m.sourcing_sent(many),
            },
          ]
        : undefined,
    },
    alerts: plan.held.length
      ? [{ tone: "warning", text: m.sourcing_held_back({ lines: heldLines(plan.held) }) }]
      : undefined,
    note: plan.skipped.length ? m.sourcing_skipped({ list: plan.skipped.join(" · ") }) : undefined,
    tags: anonymised(),
    items: plan.drafts.map((r) => ({
      headline: `${r.supplierName} · ${r.reference}`,
      supporting: `${r.category} · L${r.lineNos.join(", L")} · ${r.note}`,
      tags: [{ label: m.sourcing_draft() }],
      actions: d.canSource
        ? [
            {
              label: m.sourcing_remove(),
              call: { path: "/sourcing/cases/$doc.id/plan/remove", body: { reference: r.reference } },
              done: m.sourcing_removed({ reference: r.reference }),
            },
          ]
        : undefined,
    })),
  };
};

export const rfqDraftEmail = (r: RfqDraft): KindData<"message"> => ({
  head: { tags: [{ label: m.sourcing_draft() }] },
  ...email(r.preview.to, r.preview.subject, r.preview.body),
});
