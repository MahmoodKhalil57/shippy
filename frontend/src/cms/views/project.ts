import type { Endpoint } from "payload";
import { block, type Action, type Tone, type View } from "../../app/view/schema.ts";
import { platformEndpoints, type ProjectView } from "../endpoints/platform.ts";
import { formatDate, via } from "./via.ts";

/**
 * The delivery plan (/project), for Golden Sea: phases and work packages, each with the demo
 * screen that shows it; the nine problems and the brief line by line; the acceptance tests from
 * their brief, checked live against the demo data; the trust principles, the monthly plan's scope
 * and the payment rule. Client-facing: no prices, rates, effort or costs (the data endpoint holds
 * none; tests/platform.test.ts guards it). Data: GET /api/project (../endpoints/platform.ts).
 */

const PHASE_TONE: Record<string, Tone> = { 0: "neutral", 1: "primary", 2: "info", 3: "success" };
const WEEKS = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);

const see = (href: string, label = "See it in the demo"): Action[] => (href ? [{ label, href, variant: "tonal" }] : []);
const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });
const two = (i: number) => String(i + 1).padStart(2, "0");

export function projectView(d: ProjectView): View {
  const passed = d.acceptance.filter((a) => a.pass).length;
  const total = d.acceptance.length;
  return {
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
    blocks: [
      block("card", {
        heading: "Value from week 7. Everything by week 13.",
        blocks: [
          block("steps", { current: -1, items: d.milestones.map((m) => ({ label: m.week })) }),
          block("tiles", {
            fit: "xs",
            items: d.milestones.map((m) => ({ overline: m.week, heading: m.title, text: m.text })),
          }),
        ],
      }),
      block("card", {
        heading: "Roadmap — 13 weeks, phased",
        blocks: [
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
      }),
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
      block("card", {
        heading: "Running through every phase",
        blocks: [
          block("tiles", {
            items: d.platform.map((w) => ({ heading: w.name, text: w.detail, actions: see(w.href) })),
          }),
        ],
      }),
      block("card", {
        heading: "Nine problems you named. Nine answers.",
        blocks: [
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
        ],
      }),
      block("card", {
        heading: "Your brief, line by line",
        tags: [{ label: `${d.requirements.length} / ${d.requirements.length} covered`, tone: "success" }],
        blocks: [
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
      }),
      block("card", {
        heading: "Acceptance tests from your brief",
        tags: [{ label: `${passed} / ${total} pass`, tone: passed === total ? "success" : "info" }],
        blocks: [
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
        ],
      }),
      block("card", {
        heading: "AI never sends, prices or pays without a person.",
        blocks: [
          block("tiles", {
            items: d.trust.map(([title, text, href], i) => ({
              overline: two(i),
              heading: title,
              text,
              actions: see(href, "Show me"),
            })),
          }),
        ],
      }),
      block("grid", {
        fit: "md",
        blocks: [
          block("card", {
            heading: "Monthly plan — from go-live",
            blocks: [
              block("text", { text: "One monthly plan keeps everything running after go-live.", muted: true }),
              block("list", {
                items: d.monthly.map(([title, text]) => ({ headline: title, supporting: text, icon: "check" })),
              }),
              muted("Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately."),
            ],
          }),
          block("card", {
            heading: "The last 20% is paid after 30 days of real use.",
            blocks: [
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
          }),
        ],
      }),
    ],
  };
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/project: the delivery plan as a View (src/app/view).
    path: "/views/project",
    method: "get",
    handler: async (req) => {
      const d = await via<ProjectView>(platformEndpoints, "get", "/project", req);
      return d instanceof Response ? d : Response.json(projectView(d));
    },
  },
];
