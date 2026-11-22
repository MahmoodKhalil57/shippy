import type { Action, IconName, KindData, Stat } from "saastemlycrm-design-system/contracts";
import type { AutomationsView } from "../endpoints/platform.ts";

/**
 * Automations & exceptions, read for the widgets no one collection can say: the figures that span
 * the rules and the review sources, the AI review queue (exceptions, messages and case lines
 * together), and the fixed lists of what runs on its own and what waits for a person. Pure: data
 * in (GET /api/automations, ../endpoints/platform.ts), what a kind draws out. The rule registry,
 * the exception queue, its counts and the audit log are data widgets on the page.
 */

/**
 * The rules enabled and the AI-assisted ones (the automation-rules global's rows), each its share
 * of all the rules. What waits for review is the review queue beside them, with its count.
 */
export const automationFigures = ({ stats: st }: AutomationsView): Stat[] => [
  {
    label: "Rules enabled",
    value: String(st.enabled),
    note: "every one explicit",
    share: st.rules ? { value: st.enabled / st.rules, text: `${st.enabled} of ${st.rules} rules` } : undefined,
  },
  {
    label: "AI-assisted",
    value: String(st.ai),
    note: "drafts only, confidence on every value",
    share: st.rules ? { value: st.ai / st.rules, text: `${st.ai} of ${st.rules} rules` } : undefined,
  },
];

/**
 * Results below the confidence threshold, never applied by the AI: each opens at its source, and
 * an exception is marked reviewed under the person's name.
 */
export const reviewQueue = (d: AutomationsView): KindData<"list"> => ({
  head: { count: d.review.length, countTone: d.review.length ? "warning" : "success" },
  note: "Below the confidence threshold the AI never applies a value: it leaves the field blank or the match unlinked and waits here for a person.",
  empty: "Nothing waiting for review.",
  items: d.review.map((r) => ({
    headline: r.title,
    supporting: r.detail,
    icon: "sparkles",
    tags: r.confidence === undefined ? undefined : [{ label: `${Math.round(r.confidence * 100)}%`, tone: "warning" }],
    actions: [
      { label: "Open", href: r.href },
      ...(r.kind === "exception"
        ? [
            {
              label: "Mark reviewed",
              call: { path: `/automations/review/${encodeURIComponent(r.id)}`, body: {} },
              confirm: {
                heading: "Mark as reviewed?",
                text: `${r.title}\nConfirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are never applied without this.`,
                label: "Confirm reviewed",
              },
              done: "Reviewed — your name is on the audit log",
            } satisfies Action,
          ]
        : []),
    ],
  })),
});

/** What runs on its own under approved rules. */
export const AUTOMATIC = [
  "Capture emails, link files, extract draft data, spot likely duplicates",
  "Assign owners, update proven events, calculate waiting times",
  "Calculate costs, FX conversions, margins and comparisons",
  "Create reminders, escalations, dashboards and daily briefings",
  "Prepare linked quotations, POs, bills and invoice drafts",
];

/** What is prepared and waits for an authorised person. */
export const BY_PEOPLE = [
  "Uncertain matches, technical interpretation, missing information",
  "Owner overrides, exception resolution, discretionary closure",
  "Final selling prices, discounts, substitutions, supplier selection",
  "External messages and follow-ups unless explicitly pre-approved",
  "Commercial commitments, accounting postings and payments",
];

/** Fixed lines, no data: a list of them, each with the same icon. */
export const iconLines = (icon: IconName, lines: string[]) => (): KindData<"list"> => ({
  items: lines.map((headline) => ({ headline, icon })),
});
