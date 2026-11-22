import type { Action, KindData, Tone } from "saastemlycrm-design-system/contracts";
import type { ProjectView } from "../endpoints/platform.ts";
import { formatDate } from "./index.ts";

/**
 * The delivery plan (GET /api/project, ../endpoints/platform.ts), read for the widgets that show
 * it: the roadmap and its phases, the milestones, the work across every phase, the problems and
 * the brief line by line, the trust principles, the monthly plan, the payment rule and the
 * acceptance tests checked live. No prices, rates, effort or costs. Pure: data in, what a kind
 * draws out.
 */

/** The plan's 13 weeks, W1 to W13. */
export const WEEKS = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);

export const PHASE_TONE: Record<string, Tone> = { 0: "neutral", 1: "primary", 2: "info", 3: "success" };

/** A link to the demo screen that shows it (none when the plan names no screen). */
export const see = (href: string, label = "Open in demo"): Action[] => (href ? [{ label, href }] : []);

/** 01, 02…: an item's number in a list of principles or problems. */
export const two = (i: number) => String(i + 1).padStart(2, "0");

export const passing = (d: ProjectView) => d.acceptance.filter((a) => a.pass).length;

export type Phase = ProjectView["phases"][number];

/** The four phases over 13 weeks, each approved on its own. */
export const roadmap = (d: ProjectView): KindData<"gantt"> => ({
  note: "Each phase is approved on its own; a weekly 45-minute review keeps progress, baseline numbers and decisions in one place.",
  label: "Phase",
  periods: WEEKS,
  rows: d.phases.map((p) => ({
    label: p.name,
    supporting: p.weeks,
    from: p.from - 1,
    to: p.to - 1,
    tone: PHASE_TONE[p.key] ?? "neutral",
    tag: p.key,
  })),
});

/** What the one monthly plan covers after go-live (Odoo licences and larger changes are apart). */
export const monthlyPlan = (d: ProjectView): KindData<"list"> => ({
  note: [
    "One monthly plan keeps everything running after go-live.",
    "Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately.",
  ].join("\n"),
  items: d.monthly.map(([title, text]) => ({ headline: title, supporting: text, icon: "check" })),
});

/** The milestones' weeks in a row, from the first value to everything delivered. */
export const milestoneWeeks = (d: ProjectView): KindData<"steps"> => ({
  current: -1,
  items: d.milestones.map((m) => ({ label: m.week })),
});

/** What each milestone delivers, by its week. */
export const milestones = (d: ProjectView): KindData<"tiles"> => ({
  fit: "xs",
  items: d.milestones.map((m) => ({ overline: m.week, heading: m.title, text: m.text })),
});

/** One phase's tile: its weeks in the header, its goal, its work packages with the demo screen that shows each. */
export const phase = (p: Phase): KindData<"list"> => ({
  head: { tags: [{ label: p.weeks, tone: PHASE_TONE[p.key] ?? "neutral" }] },
  note: p.goal,
  items: p.packages.map((w) => ({ headline: w.name, supporting: w.detail, actions: see(w.href) })),
});

/** The work that runs through every phase, each with the demo screen that shows it. */
export const platformWork = (d: ProjectView): KindData<"tiles"> => ({
  items: d.platform.map((w) => ({ heading: w.name, text: w.detail, actions: see(w.href) })),
});

/** The nine problems Golden Sea named, each with its answer and the screen that shows it. */
export const problems = (d: ProjectView): KindData<"tiles"> => ({
  look: "card",
  items: d.problems.map(([problem, answer, href], i) => ({
    overline: `Problem ${two(i)}`,
    heading: problem,
    text: `→ ${answer}`,
    actions: see(href, "Show me"),
    filled: true,
  })),
});

/** The trust principles: AI never sends, prices or pays without a person, each shown in the demo. */
export const trust = (d: ProjectView): KindData<"tiles"> => ({
  items: d.trust.map(([title, text, href], i) => ({
    overline: two(i),
    heading: title,
    text,
    actions: see(href, "Show me"),
  })),
});

/** The payment rule: each phase paid in three steps, the last after 30 days of real use. */
export const payment = (d: ProjectView): KindData<"tiles"> => ({
  note: "Each phase is paid in three steps, so you only pay the last part once it works in your hands.",
  look: "card",
  figure: true,
  fit: "xs",
  items: d.payment.map(([share, text], i) => ({ heading: share, text, filled: i === 2 })),
});

/** Every requirement from the brief, the phase that delivers it and the screen that shows it. */
export const brief = (d: ProjectView): KindData<"table"> => ({
  head: {
    tags: [{ label: `${d.requirements.length} / ${d.requirements.length} covered`, tone: "success" }],
  },
  note: "Every requirement designed, with the screen that shows it and an acceptance test.",
  columns: [
    { key: "requirement", label: "From your brief" },
    { key: "phase", label: "Phase" },
    { key: "covered", label: "Covered" },
    { key: "open", label: "" },
  ],
  rows: d.requirements.map(([requirement, phase, href]) => ({
    requirement,
    phase: { text: `Phase ${phase}`, tone: PHASE_TONE[phase] ?? "neutral", tag: true },
    covered: { text: "Covered", dot: "success" },
    open: { text: "", actions: see(href, "Show me") },
  })),
});

/** How many of the brief's acceptance tests pass on the demo data right now. */
export const acceptancePassing = (d: ProjectView): KindData<"gauges"> => {
  const passed = passing(d);
  const total = d.acceptance.length;
  return {
    items: [
      {
        label: "Passing",
        value: passed,
        max: total,
        tone: "success",
        valueText: `${passed} / ${total}`,
        a11y: `${passed} of ${total} acceptance tests pass`,
      },
    ],
  };
};

/**
 * The ten scenarios from the brief, each checked live against the demo data with its evidence;
 * at go-live they run on Golden Sea's own data.
 */
export const acceptance = (d: ProjectView): KindData<"table"> => {
  const passed = passing(d);
  const total = d.acceptance.length;
  return {
    head: { tags: [{ label: `${passed} / ${total} pass`, tone: passed === total ? "success" : "info" }] },
    note: `The ten scenarios you asked to see live, each with its evidence. Checked against the data in this demo ${formatDate(d.checkedAt)}; at go-live they run on your own data.`,
    columns: [
      { key: "no", label: "#" },
      { key: "scenario", label: "Scenario", supporting: "evidence" },
      { key: "check", label: "Checked live" },
      { key: "status", label: "Status" },
      { key: "open", label: "" },
    ],
    rows: d.acceptance.map((a) => ({
      no: { text: String(a.no), strong: true },
      scenario: { text: a.scenario, strong: true },
      evidence: a.evidence,
      check: a.check,
      status: { text: a.status, tone: a.pass ? "success" : "warning", tag: true },
      open: { text: "", actions: see(a.href, "Open") },
    })),
  };
};
