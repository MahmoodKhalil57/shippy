import type { KindData, Stat } from "saastemlycrm-design-system/contracts";
import type { UsageView } from "../endpoints/service.ts";

/**
 * The service and what it's worth to Golden Sea: this month's use of each measure against the
 * plan at full use (GET /api/usage, in units, never prices), what the AI's work saved, and the
 * payback what-if, on Golden Sea's side only (the value of extra orders and saved hours; running
 * costs aren't part of it). Pure: data in, what a kind draws out.
 */

const count = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const egp = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const money = (n: number) => `EGP ${egp.format(Math.round(n))}`;

/** Each measure this month: a bar of what's used, the tick at full use, and where the month ends at this pace. */
export const againstPlan = (u: UsageView): KindData<"bullet"> => ({
  note: `${u.month}, day ${u.day} of ${u.days}. The tick is the plan at full use; quieter months use less.`,
  items: u.lines.map((l) => ({
    label: l.measure,
    value: l.used,
    max: Math.max(l.fullUse, l.pace, l.used, 1) * 1.1,
    target: l.fullUse,
    valueText: `${count.format(l.used)} so far, on pace for ${count.format(l.pace)}`,
    targetText: `${count.format(l.fullUse)} at full use`,
  })),
});

/** A part of a whole as a share bar's value (0 when there's no whole). */
const part = (n: number, of: number) => (of > 0 ? Math.min(1, n / of) : 0);

/**
 * What the AI's work this month saved and how much of it a person checked, a figure each: the
 * hours of typing saved (the documents read, against the plan at full use), the replies matched
 * (those needing no person), the results a person checked and those waiting for one (of all calls).
 */
export const measured = ({ measured: m }: UsageView): Stat[] => [
  {
    label: "Hours of typing saved",
    value: count.format(m.hoursSaved),
    note: `about ${m.minutesPerDocument} minutes a document by hand`,
    share: {
      value: part(m.documents, m.documentsFullUse),
      text: `${count.format(m.documents)} of ${count.format(m.documentsFullUse)} documents at full use`,
    },
    main: true,
  },
  {
    label: "Replies matched",
    value: count.format(m.repliesMatched),
    note: "supplier replies filed on their case",
    share: {
      value: part(m.repliesAutomatic, m.repliesMatched),
      text: `${count.format(m.repliesAutomatic)} of ${count.format(m.repliesMatched)} with no one's help`,
    },
  },
  {
    label: "Checked by a person",
    value: count.format(m.reviewed),
    note: "AI results confirmed, corrected or rejected",
    share: {
      value: part(m.reviewed, m.calls),
      text: `${count.format(m.reviewed)} of ${count.format(m.calls)} AI calls`,
    },
  },
  {
    label: "Waiting for review",
    value: count.format(m.waitingForReview),
    note: "uncertain results are never applied alone",
    tone: m.waitingForReview ? "warning" : undefined,
    href: "/automations",
    share: {
      value: part(m.waitingForReview, m.calls),
      text: `${count.format(m.waitingForReview)} of ${count.format(m.calls)} AI calls`,
    },
  },
];

/**
 * When the platform pays for itself, on Golden Sea's side: extra orders won a month at their value
 * and margin, plus the hours saved a week at their cost. It starts at the proposal's illustration
 * (5 orders of EGP 56,417 at 20%; 5 people saving 5 hours a week at EGP 150 an hour), to replace
 * with Golden Sea's own figures. Nothing is saved.
 */
export const payback = (u: UsageView): KindData<"whatif"> => ({
  label: "Payback",
  note: `Starts at the proposal's illustration; slide to your own figures. This month the AI already read ${count.format(u.measured.documents)} documents, about ${count.format(u.measured.hoursSaved)} hours of typing.`,
  inputs: [
    { key: "orders", label: "Extra orders won a month", min: 0, max: 20, step: 1, value: 5 },
    {
      key: "value",
      label: "Average order value",
      min: 10000,
      max: 250000,
      step: 1,
      value: 56417,
      format: { unit: "money", currency: "EGP" },
    },
    { key: "margin", label: "Gross margin", min: 5, max: 40, step: 0.5, value: 20, format: { unit: "pct" } },
    { key: "people", label: "People using it", min: 1, max: 20, step: 1, value: 5 },
    { key: "hours", label: "Hours saved a person a week", min: 0, max: 15, step: 0.5, value: 5 },
    {
      key: "rate",
      label: "Cost of an hour",
      min: 50,
      max: 600,
      step: 10,
      value: 150,
      format: { unit: "money", currency: "EGP" },
    },
  ],
  compute: ({ orders = 0, value = 0, margin = 0, people = 0, hours = 0, rate = 0 }) => {
    const won = orders * value * (margin / 100);
    const weeks = 52 / 12;
    const hoursMonth = people * hours * weeks;
    const time = hoursMonth * rate;
    const total = won + time;
    return [
      { label: "Margin from extra orders a month", value: money(won) },
      { label: "Time saved a month", value: money(time), note: `${count.format(Math.round(hoursMonth))} hours` },
      { label: "Value a month", value: money(total), tone: total > 0 ? "success" : undefined },
      { label: "Value a year", value: money(total * 12) },
    ];
  },
});
