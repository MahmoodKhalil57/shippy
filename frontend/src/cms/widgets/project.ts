import { block, type Action, type Tone } from "../../app/widgets/schema.ts";
import { widgets, type Source, type Widget } from "../../app/widgets/widget.ts";
import type { ProjectView } from "../endpoints/platform.ts";
import { formatDate } from "./format.ts";

/**
 * The delivery plan (/project), for Golden Sea: phases and work packages, each with the demo
 * screen that shows it; the nine problems and the brief line by line; the acceptance tests from
 * their brief, checked live against the demo data; the trust principles, the monthly plan's scope
 * and the payment rule. Client-facing: no prices, rates, effort or costs (the data endpoint holds
 * none; tests/platform.test.ts guards it). Data: GET /api/project (../endpoints/platform.ts).
 */

const plan: Source = { endpoint: "/project" };
/** A widget drawn from the plan (one request, however many widgets use it). */
const on = (w: Widget<ProjectView>): Widget<ProjectView> => ({ source: plan, ...w });

const PHASE_TONE: Record<string, Tone> = { 0: "neutral", 1: "primary", 2: "info", 3: "success" };
const WEEKS = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);

const see = (href: string, label = "See it in the demo"): Action[] => (href ? [{ label, href, variant: "tonal" }] : []);
const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });
const two = (i: number) => String(i + 1).padStart(2, "0");
const passing = (d: ProjectView) => d.acceptance.filter((a) => a.pass).length;

const milestones = on({
  title: "Value from week 7. Everything by week 13.",
  render: (d) => [
    block("steps", { current: -1, items: d.milestones.map((m) => ({ label: m.week })) }),
    block("tiles", {
      fit: "xs",
      items: d.milestones.map((m) => ({ overline: m.week, heading: m.title, text: m.text })),
    }),
  ],
});

const roadmap = on({
  title: "Roadmap — 13 weeks, phased",
  skeleton: "table",
  render: (d) => [
    block("gantt", {
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
    }),
    muted(
      "Each phase is approved on its own; a weekly 45-minute review keeps progress, baseline numbers and decisions in one place.",
    ),
  ],
});

/** The phase cards: one per phase, side by side (their number comes from the plan). */
const phases = on({
  render: (d) =>
    block("grid", {
      fit: "md",
      blocks: d.phases.map((p) =>
        block("card", {
          heading: p.name,
          tags: [{ label: p.weeks, tone: PHASE_TONE[p.key] ?? "neutral" }],
          blocks: [
            block("text", { text: p.goal, muted: true }),
            block("list", {
              items: p.packages.map((w) => ({ headline: w.name, supporting: w.detail, actions: see(w.href) })),
            }),
          ],
        }),
      ),
    }),
});

const platform = on({
  title: "Running through every phase",
  render: (d) =>
    block("tiles", { items: d.platform.map((w) => ({ heading: w.name, text: w.detail, actions: see(w.href) })) }),
});

const problems = on({
  title: "Nine problems you named. Nine answers.",
  render: (d) =>
    block("tiles", {
      look: "card",
      items: d.problems.map(([problem, answer, href], i) => ({
        overline: `Problem ${two(i)}`,
        heading: problem,
        text: `→ ${answer}`,
        actions: see(href, "Show me"),
        filled: true,
      })),
    }),
});

const brief = on({
  title: "Your brief, line by line",
  skeleton: "table",
  head: (d) => ({
    tags: [{ label: `${d.requirements.length} / ${d.requirements.length} covered`, tone: "success" }],
  }),
  render: (d) => [
    muted("Every requirement designed, with the screen that shows it and an acceptance test."),
    block("table", {
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
    }),
  ],
});

const acceptance = on({
  title: "Acceptance tests from your brief",
  skeleton: "table",
  head: (d) => {
    const passed = passing(d);
    const total = d.acceptance.length;
    return { tags: [{ label: `${passed} / ${total} pass`, tone: passed === total ? "success" : "info" }] };
  },
  render: (d) => {
    const passed = passing(d);
    const total = d.acceptance.length;
    return [
      block("gauges", {
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
      }),
      muted(
        `The ten scenarios you asked to see live, each with its evidence. Checked against the data in this demo ${formatDate(d.checkedAt)}; at go-live they run on your own data.`,
      ),
      block("table", {
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
      }),
    ];
  },
});

const trust = on({
  title: "AI never sends, prices or pays without a person.",
  render: (d) =>
    block("tiles", {
      items: d.trust.map(([title, text, href], i) => ({
        overline: two(i),
        heading: title,
        text,
        actions: see(href, "Show me"),
      })),
    }),
});

const monthly = on({
  title: "Monthly plan — from go-live",
  skeleton: "list",
  render: (d) => [
    block("text", { text: "One monthly plan keeps everything running after go-live.", muted: true }),
    block("list", { items: d.monthly.map(([title, text]) => ({ headline: title, supporting: text, icon: "check" })) }),
    muted("Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately."),
  ],
});

const payment = on({
  title: "The last 20% is paid after 30 days of real use.",
  render: (d) => [
    block("text", {
      text: "Each phase is paid in three steps, so you only pay the last part once it works in your hands.",
      muted: true,
    }),
    block("tiles", {
      look: "card",
      figure: true,
      fit: "xs",
      items: d.payment.map(([share, text], i) => ({ heading: share, text, filled: i === 2 })),
    }),
  ],
});

export const projectPage = widgets({
  header: {
    eyebrow: "Golden Sea × SaaSTEMLY · delivery plan",
    heading: "From the first email to the last payment",
    subtitle:
      "Four phases over 13 weeks, each shown in this demo. Every requirement from your brief is covered and proven by an acceptance test before the final payment.",
    actions: [
      { label: "Start at the inbox", href: "/inbox", variant: "filled" },
      { label: "Follow one case", href: "/collections/cases/gs-rfq-0142/overview" },
    ],
  },
  widgets: [
    milestones,
    roadmap,
    phases,
    platform,
    problems,
    brief,
    acceptance,
    trust,
    { grid: [monthly, payment], fit: "md" },
  ],
});
