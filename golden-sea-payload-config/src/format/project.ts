import type { Action, KindData, Tone } from "saastemlycrm-design-system/contracts";
import type { ProjectView } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";
import { formatDate } from "./index.ts";

export const weeks = () => Array.from({ length: 13 }, (_, i) => m.project_week({ n: i + 1 }));

export const PHASE_TONE: Record<string, Tone> = { 0: "neutral", 1: "primary", 2: "info", 3: "success" };

export const see = (href: string, label = m.project_open_in_demo()): Action[] => (href ? [{ label, href }] : []);

export const two = (i: number) => String(i + 1).padStart(2, "0");

export const passing = (d: ProjectView) => d.acceptance.filter((a) => a.pass).length;

export type Phase = ProjectView["phases"][number];

export const roadmap = (d: ProjectView): KindData<"gantt"> => ({
  note: m.project_roadmap_note(),
  label: m.project_phase(),
  periods: weeks(),
  rows: d.phases.map((p) => ({
    label: p.name,
    supporting: p.weeks,
    from: p.from - 1,
    to: p.to - 1,
    tone: PHASE_TONE[p.key] ?? "neutral",
    tag: p.key,
  })),
});

export const monthlyPlan = (d: ProjectView): KindData<"list"> => ({
  note: [m.project_monthly_note(), m.project_monthly_note_licences()].join("\n"),
  items: d.monthly.map(([title, text]) => ({ headline: title, supporting: text, icon: "check" })),
});

export const milestoneWeeks = (d: ProjectView): KindData<"steps"> => ({
  current: -1,
  items: d.milestones.map((m) => ({ label: m.week })),
});

export const milestones = (d: ProjectView): KindData<"tiles"> => ({
  fit: "xs",
  items: d.milestones.map((m) => ({ overline: m.week, heading: m.title, text: m.text })),
});

export const phase = (p: Phase): KindData<"list"> => ({
  head: { tags: [{ label: p.weeks, tone: PHASE_TONE[p.key] ?? "neutral" }] },
  note: p.goal,
  items: p.packages.map((w) => ({ headline: w.name, supporting: w.detail, actions: see(w.href) })),
});

export const platformWork = (d: ProjectView): KindData<"tiles"> => ({
  items: d.platform.map((w) => ({ heading: w.name, text: w.detail, actions: see(w.href) })),
});

export const problems = (d: ProjectView): KindData<"tiles"> => ({
  look: "card",
  items: d.problems.map(([problem, answer, href], i) => ({
    overline: m.project_problem({ n: two(i) }),
    heading: problem,
    text: m.project_answer({ answer }),
    actions: see(href, m.project_show_me()),
    filled: true,
  })),
});

export const trust = (d: ProjectView): KindData<"tiles"> => ({
  items: d.trust.map(([title, text, href], i) => ({
    overline: two(i),
    heading: title,
    text,
    actions: see(href, m.project_show_me()),
  })),
});

export const payment = (d: ProjectView): KindData<"tiles"> => ({
  note: m.project_payment_note(),
  look: "card",
  figure: true,
  fit: "xs",
  items: d.payment.map(([share, text], i) => ({ heading: share, text, filled: i === 2 })),
});

export const brief = (d: ProjectView): KindData<"table"> => ({
  head: {
    tags: [
      { label: m.project_covered_of({ done: d.requirements.length, total: d.requirements.length }), tone: "success" },
    ],
  },
  note: m.project_brief_note(),
  columns: [
    { key: "requirement", label: m.project_col_requirement() },
    { key: "phase", label: m.project_phase() },
    { key: "covered", label: m.project_covered() },
    { key: "open", label: "" },
  ],
  rows: d.requirements.map(([requirement, phase, href]) => ({
    requirement,
    phase: { text: m.project_phase_n({ n: phase }), tone: PHASE_TONE[phase] ?? "neutral", tag: true },
    covered: { text: m.project_covered(), dot: "success" },
    open: { text: "", actions: see(href, m.project_show_me()) },
  })),
});

export const acceptancePassing = (d: ProjectView): KindData<"gauges"> => {
  const passed = passing(d);
  const total = d.acceptance.length;
  return {
    items: [
      {
        label: m.project_passing(),
        value: passed,
        max: total,
        tone: "success",
        valueText: m.project_done_of({ done: passed, total }),
        a11y: m.project_tests_pass({ count: passed, total }),
      },
    ],
  };
};

export const acceptance = (d: ProjectView): KindData<"table"> => {
  const passed = passing(d);
  const total = d.acceptance.length;
  return {
    head: {
      tags: [{ label: m.project_pass_of({ done: passed, total }), tone: passed === total ? "success" : "info" }],
    },
    note: m.project_acceptance_note({ at: formatDate(d.checkedAt) }),
    columns: [
      { key: "no", label: "#" },
      { key: "scenario", label: m.project_col_scenario(), supporting: "evidence" },
      { key: "check", label: m.project_col_checked() },
      { key: "status", label: m.project_col_status() },
      { key: "open", label: "" },
    ],
    rows: d.acceptance.map((a) => ({
      no: { text: String(a.no), strong: true },
      scenario: { text: a.scenario, strong: true },
      evidence: a.evidence,
      check: a.check,
      status: { text: a.status, tone: a.pass ? "success" : "warning", tag: true },
      open: { text: "", actions: see(a.href, m.project_open()) },
    })),
  };
};
