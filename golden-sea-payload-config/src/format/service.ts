import type { Figure, KindData } from "saastemlycrm-design-system/contracts";
import type { UsageView } from "../endpoints/service.ts";
import { m } from "../i18n/paraglide/messages.js";
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import { money as amount, numberFormat } from "./index.ts";

/**
 * The service and what it's worth to Golden Sea: this month's use of each measure against the
 * plan at full use (GET /api/usage, in units, never prices), what the AI's work saved, and the
 * payback what-if, on Golden Sea's side only (the value of extra orders and saved hours; running
 * costs aren't part of it). Pure: data in, what a kind draws out.
 */

const count = (n: number) => numberFormat({ maximumFractionDigits: 1 }).format(n);
const money = (n: number) => amount(Math.round(n), "EGP");

/** Each measure this month: a bar of what's used, the tick at full use, and where the month ends at this pace. */
export const againstPlan = (u: UsageView): KindData<"bullet"> => ({
  note: m.service_plan_note({ month: u.month, day: count(u.day), days: count(u.days) }),
  items: u.lines.map((l) => ({
    label: l.measure,
    value: l.used,
    max: Math.max(l.fullUse, l.pace, l.used, 1) * 1.1,
    target: l.fullUse,
    valueText: m.service_so_far({ used: count(l.used), pace: count(l.pace) }),
    targetText: m.service_at_full_use({ full: count(l.fullUse) }),
  })),
});

/** A part of a whole as a share bar's value (0 when there's no whole). */
const part = (n: number, of: number) => (of > 0 ? Math.min(1, n / of) : 0);

/**
 * What the AI's work this month saved and how much of it a person checked, a figure each: the
 * hours of typing saved (the documents read, against the plan at full use), the replies matched
 * (those needing no person), the results a person checked and those waiting for one (of all calls).
 * These are the figures' keys (their tiles on the board); `measuredFigureName` gives their words.
 */
export const MEASURED = [
  "Hours of typing saved",
  "Replies matched",
  "Checked by a person",
  "Waiting for review",
] as const;
export type MeasuredFigure = (typeof MEASURED)[number];

/** A measured figure's words, in the interface's language. */
export const measuredFigureName = (key: MeasuredFigure): string =>
  ({
    "Hours of typing saved": m.service_hours_saved,
    "Replies matched": m.service_replies_matched,
    "Checked by a person": m.service_checked,
    "Waiting for review": m.service_waiting,
  })[key]();

export const measured = ({ measured: u }: UsageView): Figure<MeasuredFigure>[] => [
  {
    key: "Hours of typing saved",
    label: measuredFigureName("Hours of typing saved"),
    value: count(u.hoursSaved),
    note: m.service_hours_saved_note({ n: u.minutesPerDocument, minutes: count(u.minutesPerDocument) }),
    share: {
      value: part(u.documents, u.documentsFullUse),
      text: m.service_documents_share({ documents: count(u.documents), full: count(u.documentsFullUse) }),
    },
    main: true,
  },
  {
    key: "Replies matched",
    label: measuredFigureName("Replies matched"),
    value: count(u.repliesMatched),
    note: m.service_replies_matched_note(),
    share: {
      value: part(u.repliesAutomatic, u.repliesMatched),
      text: m.service_replies_share({ automatic: count(u.repliesAutomatic), matched: count(u.repliesMatched) }),
    },
  },
  {
    key: "Checked by a person",
    label: measuredFigureName("Checked by a person"),
    value: count(u.reviewed),
    note: m.service_checked_note(),
    share: {
      value: part(u.reviewed, u.calls),
      text: m.service_calls_share({ part: count(u.reviewed), calls: count(u.calls) }),
    },
  },
  {
    key: "Waiting for review",
    label: measuredFigureName("Waiting for review"),
    value: count(u.waitingForReview),
    note: m.service_waiting_note(),
    tone: u.waitingForReview ? "warning" : undefined,
    href: "/automations",
    share: {
      value: part(u.waitingForReview, u.calls),
      text: m.service_calls_share({ part: count(u.waitingForReview), calls: count(u.calls) }),
    },
  },
];

/**
 * When the platform pays for itself, on Golden Sea's side: extra orders won a month at their value
 * and margin, plus the hours saved a week at their cost. It starts at the proposal's illustration
 * (5 orders of EGP 56,417 at 20%; 5 people saving 5 hours a week at EGP 150 an hour), to replace
 * with Golden Sea's own figures. Nothing is saved.
 */
/** Where the payback what-if starts: extra orders, their value and margin, people, hours saved and their cost. */
function paybackStart() {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    // The proposal's illustration.
    return { orders: 5, value: 56417, margin: 20, people: 5, hours: 5, rate: 150 };
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the payback what-if's starting values from Golden Sea's own figures (order value and margin from closed cases, hours saved from the AI log), not the proposal's illustration",
    );
  }
}

export const payback = (u: UsageView): KindData<"whatif"> => {
  const start = paybackStart();
  return {
    label: m.service_payback(),
    note: m.service_payback_note({ documents: count(u.measured.documents), hours: count(u.measured.hoursSaved) }),
    inputs: [
      { key: "orders", label: m.service_extra_orders(), min: 0, max: 20, step: 1, value: start.orders },
      {
        key: "value",
        label: m.service_order_value(),
        min: 10000,
        max: 250000,
        step: 1,
        value: start.value,
        format: { unit: "money", currency: "EGP" },
      },
      {
        key: "margin",
        label: m.service_gross_margin(),
        min: 5,
        max: 40,
        step: 0.5,
        value: start.margin,
        format: { unit: "pct" },
      },
      { key: "people", label: m.service_people(), min: 1, max: 20, step: 1, value: start.people },
      { key: "hours", label: m.service_hours_per_person(), min: 0, max: 15, step: 0.5, value: start.hours },
      {
        key: "rate",
        label: m.service_hour_cost(),
        min: 50,
        max: 600,
        step: 10,
        value: start.rate,
        format: { unit: "money", currency: "EGP" },
      },
    ],
    compute: ({ orders = 0, value = 0, margin = 0, people = 0, hours = 0, rate = 0 }) => {
      const won = orders * value * (margin / 100);
      const weeks = 52 / 12;
      const hoursMonth = people * hours * weeks;
      const time = hoursMonth * rate;
      const total = won + time;
      const h = Math.round(hoursMonth);
      return [
        { label: m.service_margin_month(), value: money(won) },
        { label: m.service_time_month(), value: money(time), note: m.service_hours({ n: h, hours: count(h) }) },
        { label: m.service_value_month(), value: money(total), tone: total > 0 ? "success" : undefined },
        { label: m.service_value_year(), value: money(total * 12) },
      ];
    },
  };
};
