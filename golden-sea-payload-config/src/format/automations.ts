import type { Action, Figure, IconName, KindData } from "saastemlycrm-design-system/contracts";
import type { AutomationsView } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";

export const AUTOMATION_FIGURES = ["Rules enabled", "AI-assisted"] as const;

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

type Line = () => string;

export const AUTOMATIC: Line[] = [
  m.automations_auto_capture,
  m.automations_auto_assign,
  m.automations_auto_calculate,
  m.automations_auto_remind,
  m.automations_auto_prepare,
];

export const BY_PEOPLE: Line[] = [
  m.automations_people_uncertain,
  m.automations_people_overrides,
  m.automations_people_prices,
  m.automations_people_messages,
  m.automations_people_commitments,
];

export const iconLines = (icon: IconName, lines: Line[]) => (): KindData<"list"> => ({
  items: lines.map((line) => ({ headline: line(), icon })),
});
