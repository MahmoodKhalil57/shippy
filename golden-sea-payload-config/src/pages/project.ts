import { gantt, gauges, list, steps, table, tiles, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/project.ts";
import * as link from "../links.ts";
import { plan } from "../queries/project.ts";
import { m } from "../i18n/paraglide/messages.js";

export const projectPage = widgets({
  header: {
    eyebrow: m.page_project_eyebrow(),
    heading: m.page_project_heading(),
    subtitle: m.page_project_subtitle(),
    actions: [
      { label: m.page_project_start(), href: "/inbox", main: true },
      { label: m.page_project_follow(), href: link.doc("cases", "gs-rfq-0142", "overview") },
    ],
  },
  widgets: [
    gantt({
      title: m.page_project_roadmap(),
      size: "l",
      skeleton: "table",
      data: plan,
      format: fmt.roadmap,
    }),
    list({
      title: m.page_project_monthly(),
      size: "s",
      skeleton: "list",
      data: plan,
      format: fmt.monthlyPlan,
    }),
    steps({
      title: m.page_project_weeks(),
      size: "m",
      rows: 3,
      data: plan,
      format: fmt.milestoneWeeks,
    }),
    tiles({ title: m.page_project_milestones(), size: "m", data: plan, format: fmt.milestones }),
    list.each({
      size: "s",
      skeleton: "list",
      data: plan,
      tiles: 4,
      empty: { heading: m.page_project_no_phase() },
      items: (d) => d.phases,
      key: (p: fmt.Phase) => p.key,
      title: (p: fmt.Phase) => p.name,
      format: fmt.phase,
    }),
    tiles({ title: m.page_project_every_phase(), size: "m", data: plan, format: fmt.platformWork }),
    tiles({ title: m.page_project_problems(), size: "m", data: plan, format: fmt.problems }),
    tiles({ title: m.page_project_trust(), size: "m", data: plan, format: fmt.trust }),
    tiles({ title: m.page_project_payment(), size: "m", data: plan, format: fmt.payment }),
    table({
      title: m.page_project_brief(),
      size: "l",
      skeleton: "table",
      data: plan,
      format: fmt.brief,
    }),
    gauges({
      title: m.page_project_passing(),
      size: "s",
      rows: 3,
      data: plan,
      format: fmt.acceptancePassing,
    }),
    table({
      title: m.page_project_acceptance(),
      size: "l",
      skeleton: "table",
      data: plan,
      format: fmt.acceptance,
    }),
    {
      title: m.page_project_calendar(),
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
