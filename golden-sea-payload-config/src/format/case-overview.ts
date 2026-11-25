import type { KindData, Tone } from "saastemlycrm-design-system/contracts";
import type { CaseOverview } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";
import { formatDate } from "./index.ts";

const lineGauges = (total: number, items: [label: string, value: number, tone: Tone][]) =>
  items.map(([label, value, tone]) => ({
    label,
    value,
    max: Math.max(total, 1),
    tone,
    valueText: `${value} / ${total}`,
    a11y: m.case_overview_gauge_a11y({ label, value, total }),
  }));

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

export const fulfilment = ({ fulfilment: f }: CaseOverview): KindData<"gauges"> => ({
  items: lineGauges(f.total, [
    [m.case_overview_ordered(), f.ordered, "info"],
    [m.case_overview_received(), f.received, "info"],
    [m.case_overview_delivered(), f.delivered, "info"],
    [m.case_overview_invoiced(), f.invoiced, "info"],
  ]),
  alerts: f.notes.length ? [{ tone: "warning", text: f.notes.map((n) => `⚑ ${n}`).join("\n") }] : [],
});

export const timelineSummary = (d: CaseOverview): KindData<"custom"> => ({
  element: "ui-ai-summary",
  props: {
    label: m.case_overview_summary_label(),
    context: m.case_overview_summary_context(),
    text: d.timeline.map((t) => `${formatDate(t.at)} · ${t.actor}: ${t.text}`).join("\n"),
  },
});
