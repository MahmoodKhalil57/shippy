import { gantt, gauges, list, steps, table, tiles, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/project.ts";
import * as link from "../links.ts";
import { plan } from "../queries/project.ts";

/**
 * The delivery plan (/project), for Golden Sea: phases and work packages, each with the demo
 * screen that shows it; the nine problems and the brief line by line; the acceptance tests from
 * their brief, checked live against the demo data; the trust principles, the monthly plan's scope
 * and the payment rule. Client-facing: no prices, rates, effort or costs (the data endpoint holds
 * none; tests/platform.test.ts guards it). Data: GET /api/project (../endpoints/platform.ts).
 * Each widget is a design-system kind given a query and a formatter (../format/project.ts).
 */
export const projectPage = widgets({
  header: {
    eyebrow: "Golden Sea × SaaSTEMLY · delivery plan",
    heading: "From the first email to the last payment",
    subtitle:
      "Four phases over 13 weeks, each shown in this demo. Every requirement from your brief is covered and proven by an acceptance test before the final payment.",
    actions: [
      { label: "Start at the inbox", href: "/inbox", main: true },
      { label: "Follow one case", href: link.doc("cases", "gs-rfq-0142", "overview") },
    ],
  },
  widgets: [
    // The roadmap and the monthly plan, the milestones with the phases, then two by two.
    gantt({
      title: "Roadmap — 13 weeks, phased",
      size: "l",
      skeleton: "table",
      data: plan,
      format: fmt.roadmap,
    }),
    list({
      title: "Monthly plan — from go-live",
      size: "s",
      skeleton: "list",
      data: plan,
      format: fmt.monthlyPlan,
    }),
    steps({
      title: "Value from week 7. Everything by week 13.",
      size: "m",
      rows: 3,
      data: plan,
      format: fmt.milestoneWeeks,
    }),
    tiles({ title: "Milestones", size: "m", data: plan, format: fmt.milestones }),
    // One tile per phase of the plan, in order.
    list.each({
      size: "s",
      skeleton: "list",
      data: plan,
      items: (d) => d.phases,
      key: (p: fmt.Phase) => p.key,
      title: (p: fmt.Phase) => p.name,
      format: fmt.phase,
    }),
    tiles({ title: "Running through every phase", size: "m", data: plan, format: fmt.platformWork }),
    tiles({ title: "Nine problems you named. Nine answers.", size: "m", data: plan, format: fmt.problems }),
    tiles({ title: "AI never sends, prices or pays without a person.", size: "m", data: plan, format: fmt.trust }),
    tiles({ title: "The last 20% is paid after 30 days of real use.", size: "m", data: plan, format: fmt.payment }),
    table({
      title: "Your brief, line by line",
      size: "l",
      skeleton: "table",
      data: plan,
      format: fmt.brief,
    }),
    gauges({
      title: "Acceptance tests passing",
      size: "s",
      rows: 3,
      data: plan,
      format: fmt.acceptancePassing,
    }),
    table({
      title: "Acceptance tests from your brief",
      size: "l",
      skeleton: "table",
      data: plan,
      format: fmt.acceptance,
    }),
    // The deliveries on their month, each opening its record.
    {
      title: "Delivery calendar",
      size: "m",
      rows: 10,
      minRows: 8,
      collection: {
        collection: "deliveries",
        key: "calendar",
        layout: "calendar",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
