import type { Action, Figure, IconName, KindData } from "saastemlycrm-design-system/contracts";
import type { AutomationsView } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";

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
export const AUTOMATION_FIGURES = ["Rules enabled", "AI-assisted"] as const;

/** An automation figure's words in the interface's language (the keys are `AUTOMATION_FIGURES`). */
export const automationFigureName = (key: (typeof AUTOMATION_FIGURES)[number]): string =>
  ({ "Rules enabled": m.automations_figure_enabled, "AI-assisted": m.automations_figure_ai })[key]();

export const automationFigures = ({ stats: st }: AutomationsView): Figure<(typeof AUTOMATION_FIGURES)[number]>[] => [
  {
    key: "Rules enabled",
    label: automationFigureName("Rules enabled"),
    value: String(st.enabled),
    note: m.automations_enabled_note(),
    share: st.rules
      ? { value: st.enabled / st.rules, text: m.automations_of_rules({ count: st.enabled, total: st.rules }) }
      : undefined,
  },
  {
    key: "AI-assisted",
    label: automationFigureName("AI-assisted"),
    value: String(st.ai),
    note: m.automations_ai_note(),
    share: st.rules
      ? { value: st.ai / st.rules, text: m.automations_of_rules({ count: st.ai, total: st.rules }) }
      : undefined,
  },
];

/**
 * Results below the confidence threshold, never applied by the AI: each opens at its source, and
 * an exception is marked reviewed under the person's name.
 */
export const reviewQueue = (d: AutomationsView): KindData<"list"> => ({
  head: { count: d.review.length, countTone: d.review.length ? "warning" : "success" },
  note: m.automations_review_note(),
  empty: m.automations_review_empty(),
  items: d.review.map((r) => ({
    headline: r.title,
    supporting: r.detail,
    icon: "sparkles",
    tags: r.confidence === undefined ? undefined : [{ label: `${Math.round(r.confidence * 100)}%`, tone: "warning" }],
    actions: [
      { label: m.automations_open(), href: r.href },
      ...(r.kind === "exception"
        ? [
            {
              label: m.automations_mark_reviewed(),
              call: { path: `/automations/review/${encodeURIComponent(r.id)}`, body: {} },
              confirm: {
                heading: m.automations_confirm_heading(),
                text: m.automations_confirm_text({ title: r.title }),
                label: m.automations_confirm_label(),
              },
              done: m.automations_reviewed_done(),
            } satisfies Action,
          ]
        : []),
    ],
  })),
});

/** A fixed line's words, read when it is drawn (in the interface's language). */
type Line = () => string;

/** What runs on its own under approved rules. */
export const AUTOMATIC: Line[] = [
  m.automations_auto_capture,
  m.automations_auto_assign,
  m.automations_auto_calculate,
  m.automations_auto_remind,
  m.automations_auto_prepare,
];

/** What is prepared and waits for an authorised person. */
export const BY_PEOPLE: Line[] = [
  m.automations_people_uncertain,
  m.automations_people_overrides,
  m.automations_people_prices,
  m.automations_people_messages,
  m.automations_people_commitments,
];

/** Fixed lines, no data: a list of them, each with the same icon. */
export const iconLines = (icon: IconName, lines: Line[]) => (): KindData<"list"> => ({
  items: lines.map((line) => ({ headline: line(), icon })),
});
