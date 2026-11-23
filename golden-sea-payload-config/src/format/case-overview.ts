import type { KindData, Tone } from "saastemlycrm-design-system/contracts";
import type { CaseOverview } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";
import { formatDate } from "./index.ts";

/**
 * A case at a glance, read for the widgets of the case overview tab that draw more than the case's
 * own fields: its place on the 16-step lifecycle (a workflow across quotations, orders, deliveries
 * and payments), what happened after the order (POs, receipts, deliveries and invoices: several
 * collections at once) and the on-device AI summary of its timeline. Pure: data in
 * (GET /api/case-overview/:id, ../endpoints/platform.ts), what a kind draws out. The next action,
 * line progress, owner and backup with "Reassign", the handover note, the line status, the
 * clarifications, the contact rule and the activity timeline are the case's own (data widgets).
 */

/** One gauge per count, each out of the case's lines (a `gauges` block's items). */
const lineGauges = (total: number, items: [label: string, value: number, tone: Tone][]) =>
  items.map(([label, value, tone]) => ({
    label,
    value,
    max: Math.max(total, 1),
    tone,
    valueText: `${value} / ${total}`,
    a11y: m.case_overview_gauge_a11y({ label, value, total }),
  }));

/**
 * Where the case is on the 16-step flow, from the first email to the last payment, across the
 * screen: the step and its phase, what it means, and why it stopped if it did.
 */
export const lifecycle = (d: CaseOverview): KindData<"steps"> => {
  const step = d.steps[d.current]!;
  return {
    head: {
      tags: [{ label: m.case_overview_step({ step: d.current + 1, total: d.steps.length }), tone: "primary" }],
      subhead: step.detail,
    },
    current: d.current,
    tone: d.halted === "lost" ? "error" : "primary",
    items: d.steps.map((s) => ({ label: s.label })),
    tags: [{ label: m.case_overview_phase({ phase: step.phase }) }],
    note: `${step.label}: ${d.stage}`,
    alerts: d.halted
      ? [
          {
            tone: d.halted === "lost" ? "error" : "warning",
            text:
              d.halted === "lost" ? m.case_overview_ended({ next: d.next }) : m.case_overview_paused({ next: d.next }),
          },
        ]
      : [],
  };
};

/** Once ordered: how far the lines are from order to invoice, and what holds them up. */
export const fulfilment = ({ fulfilment: f }: CaseOverview): KindData<"gauges"> => ({
  items: lineGauges(f.total, [
    [m.case_overview_ordered(), f.ordered, "info"],
    [m.case_overview_received(), f.received, "info"],
    [m.case_overview_delivered(), f.delivered, "info"],
    [m.case_overview_invoiced(), f.invoiced, "info"],
  ]),
  alerts: f.notes.length ? [{ tone: "warning", text: f.notes.map((n) => `⚑ ${n}`).join("\n") }] : [],
});

/**
 * "Catch me up on this case": the on-device AI reads the activity log and says where the case
 * stands and what is blocking it.
 */
export const timelineSummary = (d: CaseOverview): KindData<"custom"> => ({
  element: "ui-ai-summary",
  props: {
    label: m.case_overview_summary_label(),
    context: m.case_overview_summary_context(),
    text: d.timeline.map((t) => `${formatDate(t.at)} · ${t.actor}: ${t.text}`).join("\n"),
  },
});
