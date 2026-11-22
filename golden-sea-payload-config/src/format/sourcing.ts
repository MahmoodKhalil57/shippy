import type { IconName, KindData, Tag, Tone, WidgetScope } from "saastemlycrm-design-system/contracts";
import type { CaseLine, CaseRfqRow, CaseRfqsPayload, ReplyEvent, RfqDraft } from "../endpoints/sourcing.ts";
import * as link from "../links.ts";
import { email } from "./commercial.ts";

/**
 * A case's supplier RFQs, read for the widgets that show them: its lines and where each stands,
 * the RFQs sent with their reminders, new suppliers saved from replies, and the drafts kept on the
 * server until sent (the replies themselves are intake messages, read with no code). Pure: data in
 * (../endpoints/sourcing.ts's answers), what a kind draws out. First the formats they share: when
 * things happened, and which RFQ statuses are still open.
 */

const FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

/** "17 Nov, 09:30". */
export const at = (v: string) => (v ? FMT.format(new Date(v)) : "—");
/** "17 Nov 2026". */
export const dated = (v: string) => (v ? DAY.format(new Date(v)) : "—");

/** RFQ statuses still waiting on the supplier: reminders apply. */
export const OPEN = ["Sent", "Awaiting reply", "Partial reply", "Clarification needed"];

/** An RFQ still being chased: waiting on the supplier, or escalated to the case owner. */
export const chased = (r: CaseRfqRow) => OPEN.includes(r.status) || r.escalated;

/** A supplier saved from a reply. */
export type NewSupplier = CaseRfqsPayload["newSuppliers"][number];

/**
 * A new supplier saved from a reply (even without an order): its record and the dated prices it
 * quoted (hidden for roles that don't see costs).
 */
export const newSupplier = (s: NewSupplier, d: CaseRfqsPayload): KindData<"list"> => ({
  head: { tags: [{ label: "New · quoted, never ordered", tone: "primary" }] },
  note: [
    "Saved the moment they replied, even without an order.",
    ...s.prices.map(
      (p) =>
        `${p.description}: ${
          d.canSeeCosts && p.price !== undefined
            ? `${p.currency} ${p.price.toLocaleString("en-US")} / ${p.per}`
            : "price hidden for your role"
        } · quoted ${dated(p.quotedAt)} · valid to ${dated(p.validUntil)}`,
    ),
  ].join("\n"),
  items: [{ headline: `${s.city} · ${s.source}`, href: link.doc("suppliers", s.id), supporting: "Supplier record" }],
});

const OUTCOME: Record<ReplyEvent["outcome"], { tone: Tone; icon: IconName }> = {
  Replied: { tone: "success", icon: "success" },
  Declined: { tone: "neutral", icon: "x" },
  "Reminder sent": { tone: "warning", icon: "send" },
  Escalated: { tone: "error", icon: "warning" },
  "New supplier saved": { tone: "info", icon: "user" },
};

/** What the last "Simulate replies" brought in (replies, declines, reminders, new suppliers), for a while after. */
export const replyArrivals = (d: CaseRfqsPayload): KindData<"timeline"> => ({
  items: d.arrivals.map((e) => ({
    heading: `${e.outcome} · ${e.supplier} · ${e.reference}`,
    text: [e.subject ? `Subject: “${e.subject}”` : "", e.detail].filter(Boolean).join("\n"),
    icon: OUTCOME[e.outcome].icon,
    tone: OUTCOME[e.outcome].tone,
    done: true,
  })),
});

/**
 * The reminder rule (two reminders, then the case owner is alerted; they stop on a reply), and
 * whether anyone is being chased. Each chased supplier's schedule is `reminderSchedule`.
 */
export const reminderRule = (d: CaseRfqsPayload): KindData<"text"> => ({
  text: `Reminder 1 after 24 h, reminder 2 after 48 h, then the case owner (${d.case.ownerName}) is alerted. Reminders stop the moment a supplier replies or declines.`,
  note: d.rfqs.some(chased) ? undefined : "No supplier is being chased right now.",
});

/** An RFQ being chased: where its reminders stand (sent, next, not needed, escalated). */
export const reminderSchedule = (r: CaseRfqRow): KindData<"steps"> => ({
  tone: r.escalated ? "error" : "primary",
  current: r.schedule.filter((s) => s.state === "done").length - 1,
  items: r.schedule.map((s) => ({
    label: s.label,
    supporting: s.state === "skipped" ? "not needed" : s.state === "next" ? `next · ${at(s.at)}` : at(s.at),
    state: s.state === "done" || s.state === "skipped" ? s.state : undefined,
  })),
});

/** Lines picked for the next RFQs by default: those not yet asked of anyone. */
function picked(lines: CaseLine[]): number[] {
  const sendable = lines.filter((l) => !l.held);
  const fresh = sendable.filter((l) => !l.rfqs.length && !l.offers);
  return (fresh.length ? fresh : sendable).map((l) => l.lineNo);
}

const lineState = (l: CaseLine) =>
  `${l.qty} ${l.unit} · ${l.category}${l.held ? ` · held: ${l.held}` : l.rfqs.length ? ` · asked: ${l.rfqs.join(", ")}` : ""}${l.offers ? ` · ${l.offers} offer${l.offers > 1 ? "s" : ""}` : ""}`;

/**
 * The case's lines and where each stands (held, asked, offered), and "Draft RFQs": pick the lines
 * and the system chooses the suppliers and drafts one anonymised RFQ each, split by category or as
 * the full list ("How to send", the `send` parameter). Held lines wait until clarified.
 */
export const rfqLines = (d: CaseRfqsPayload, { params }: WidgetScope): KindData<"list"> => {
  const mode = params.send === "full" ? "full" : "split";
  const sendable = d.lines.filter((l) => !l.held);
  const held = d.lines.filter((l) => l.held);
  return {
    choice: {
      param: "send",
      label: "How to send",
      value: "split",
      options: [
        { value: "split", label: "Split by category" },
        { value: "full", label: "Full list" },
      ],
    },
    note:
      mode === "split"
        ? "Each category goes to its specialists (best on-time first); a supplier asked for several categories gets one RFQ."
        : "General chandlers receive every line in one RFQ.",
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
    empty: "This case has no lines yet.",
    actions: [
      {
        label: "Draft RFQs",
        icon: "sparkles",
        prompt: "Draft supplier RFQs",
        disabled: !sendable.length,
        reason: sendable.length ? undefined : "Every line is held until clarified.",
        call: { path: "/sourcing/cases/$doc.id/plan", body: { mode } },
        fields: [
          {
            type: "select",
            name: "lineNos",
            label: "Lines",
            hasMany: true,
            required: true,
            defaultValue: picked(d.lines).map(String),
            options: sendable.map((l) => ({
              value: String(l.lineNo),
              label: `L${l.lineNo} · ${l.description} · ${lineState(l)}`,
            })),
            admin: {
              description: held.length
                ? `Held back until clarified: ${held.map((l) => `L${l.lineNo} (${l.held})`).join(" · ")}`
                : "The system chooses the suppliers and drafts one anonymised RFQ each.",
            },
          },
        ],
        reply: true,
      },
    ],
  };
};

const ANONYMISED: Tag[] = ["Client name removed", "Vessel removed", "No customer files", "Our reference only"].map(
  (label) => ({ label, tone: "success", icon: "success" }),
);

/**
 * The drafted supplier RFQs, kept on the server until a person sends them (after a confirmation)
 * or discards them: one per supplier, each removable, with what was held back or skipped. Each
 * draft's email is `rfqDraftEmail`.
 */
export const rfqDrafts = (d: CaseRfqsPayload): KindData<"list"> | null => {
  const plan = d.plan;
  if (!plan) return null;
  const n = plan.drafts.length;
  const s = n === 1 ? "" : "s";
  return {
    head: {
      count: n,
      tags: [{ label: plan.mode === "full" ? "Full list" : "Split by category" }],
      actions: [
        {
          label: "Discard drafts",
          call: { path: "/sourcing/cases/$doc.id/plan/discard" },
          done: "Drafts discarded — nothing was sent",
        },
        {
          label: `Send ${n} RFQ${s}`,
          icon: "send",
          main: true,
          call: { path: "/sourcing/cases/$doc.id/send" },
          confirm: {
            heading: "Send these supplier RFQs?",
            text: `${n} RFQ${s} to ${plan.drafts.map((r) => r.supplierName).join(", ")} — reply by ${at(plan.dueAt)}.\n\nThe client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a supplier answers, and the case owner is alerted after the second.`,
            label: "Send RFQs",
          },
          done: `${n} supplier RFQ${s} sent — replies will be matched automatically`,
        },
      ],
    },
    alerts: plan.held.length
      ? [
          {
            tone: "warning",
            text: `Held back until clarified: ${plan.held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ")}`,
          },
        ]
      : undefined,
    note: plan.skipped.length ? `Skipped (already asked): ${plan.skipped.join(" · ")}` : undefined,
    tags: ANONYMISED,
    items: plan.drafts.map((r) => ({
      headline: `${r.supplierName} · ${r.reference}`,
      supporting: `${r.category} · L${r.lineNos.join(", L")} · ${r.note}`,
      tags: [{ label: "Draft" }],
      actions: [
        {
          label: "Remove",
          call: { path: "/sourcing/cases/$doc.id/plan/remove", body: { reference: r.reference } },
          done: `${r.reference} removed from the drafts`,
        },
      ],
    })),
  };
};

/**
 * A drafted RFQ as the supplier will receive it: the anonymised email (no client, vessel or
 * customer files, our reference only), to read before sending.
 */
export const rfqDraftEmail = (r: RfqDraft): KindData<"message"> => ({
  head: { tags: [{ label: "Draft" }] },
  ...email(r.preview.to, r.preview.subject, r.preview.body),
});
