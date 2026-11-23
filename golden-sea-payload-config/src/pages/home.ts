import {
  bullet,
  chart,
  countdown,
  dial,
  figures,
  header,
  list,
  month,
  query,
  waffle,
  widgets,
  type Widget,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import * as shapes from "../format/visuals.ts";
import { visuals } from "../queries/visuals.ts";
import type { Home, HomeChart } from "../endpoints/home.ts";
import * as fmt from "../format/home.ts";
import { myDecisions, ROLES, toCollect } from "../queries/aside.ts";
import { BY_RISK, LIVE, mine, type Where } from "../queries/cases.ts";
import { home, unread } from "../queries/home.ts";
import { dueToday, toTriage } from "../queries/work.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * The dashboard's home (Payload `admin.components.views.dashboard`): the signed-in user's day,
 * tailored to their role. Every role's day has the same shape, so the first window says where
 * they stand: a greeting whose subtitle is the day's live numbers, a strip of the four figures
 * they steer by (the first tinted), the chart their work turns on beside "Next up" (what's due,
 * soonest first: the one inverse tile), then their two lists, their case queue and the other
 * charts.
 *
 * What is one collection's documents reads that collection with no code, declared per role
 * (`visible`): the case queue (cases, sorted by risk, each case's own `due` in red once passed,
 * its lines as a bar (`lineCount`), its blocker in red on a blocked case, `flag`… and its
 * "Reassign"), today's follow-ups (tasks, their `when` as a tag, red when overdue), the decisions
 * waiting (approvals, dotted by status, with who has decided so far: `progress`), the inbox to
 * triage (tagged by status), the pipeline's next steps (opportunities, tagged by where the step
 * stands, with "Record outcome") and the plain counts in the strip (`metrics`). What spans
 * several collections comes from GET /api/home (../endpoints/home.ts) through a formatter
 * (../format/home.ts): the greeting and its numbers, the figures with a trend (./history.ts),
 * "Next up", the 07:00 briefing and the trend charts. The header's "While you were away" summary
 * reads the user's unread notifications.
 *
 * The order fills the board's rows (saastemlycrm-design-system/AGENTS.md, "No lane left empty"):
 * four figures, each a widget 5 tiles wide; chart `m` + next up `s` (one row on 3 lanes; on 4 the
 * first list joins it); the queue `l` with the second list; then a compact chart and the other
 * charts `m`.
 */

/** Shown to these roles only; `"desk"` is everyone without a day of their own (the sourcing desk). */
const to =
  (...roles: string[]) =>
  ({ user }: WidgetScope) =>
    roles.includes(user.role ?? "") || (roles.includes("desk") && !ROLES.includes(user.role ?? ""));

/**
 * A chart tile per /home chart in this slice of the day, titled by the chart: as many tiles as the
 * role has charts there (`fmt.homeChartCount`), so the board is laid out before /home answers.
 */
const charts = (from: number, end?: number) => {
  const tiles = (s: WidgetScope) => Math.min(end ?? Infinity, fmt.homeChartCount(s)) - from;
  return {
    size: "m" as const,
    skeleton: "chart" as const,
    data: home,
    tiles,
    visible: (s: WidgetScope) => tiles(s) > 0,
    empty: { heading: m.page_home_no_chart() },
    items: (h: Home) => fmt.homeCharts(h).slice(from, end),
    key: (c: HomeChart) => c.title,
    title: (c: HomeChart) => c.title,
    subhead: (c: HomeChart) => c.sub,
    format: fmt.homeChart,
  };
};

/** A count in the strip of four, 5 tiles wide like the figures beside it. */
const counts = (
  visible: Widget["visible"],
  collection: string,
  items: NonNullable<Widget["metrics"]>["items"],
): Widget => ({
  size: "s",
  width: 5,
  visible,
  metrics: { collection, items },
});

/** Today's follow-ups (open tasks due by tonight, overdue first, in red), someone's or everyone's. */
const followUps = (visible: Widget["visible"], where: Where): Widget => ({
  title: m.page_home_follow_ups_title(),
  subhead: m.page_home_follow_ups_subhead(),
  size: "s",
  visible,
  records: {
    collection: "tasks",
    where,
    sort: "due",
    limit: 20,
    columns: ["title", "channel", "type", "stopCondition"],
    tags: ["when"],
    dot: "when",
    layout: "list",
    empty: m.page_home_no_follow_ups(),
    more: true,
  },
});

/**
 * A case queue: each case's stage and what it waits for, how many lines are ready (a bar of all of
 * them, amber while any is blocked) and blocked, its deadline and how far off it is (red once
 * passed), its next action and blocker (red on a blocked case), urgent ones flagged; the owner and
 * the value where the queue shows them (never the value for Sales: the field's access too).
 */
const queue = (
  visible: Widget["visible"],
  title: string,
  subhead: string,
  where: Where,
  show: { owner?: boolean; value?: boolean },
): Widget => ({
  title,
  subhead,
  size: "l",
  visible,
  records: {
    collection: "cases",
    where,
    sort: BY_RISK,
    limit: 50,
    columns: [
      "caseId",
      "customer",
      "stage",
      "lineCount.ready",
      "deadline",
      "nextAction",
      ...(show.owner ? ["owner"] : []),
      ...(show.value ? ["value"] : []),
    ],
    supporting: {
      caseId: "flag",
      customer: "vesselPort",
      stage: "wait",
      "lineCount.ready": "lineNote",
      deadline: "due",
      nextAction: "blocker",
    },
    labels: {
      customer: m.page_home_customer_vessel(),
      "lineCount.ready": m.page_home_lines(),
      nextAction: m.page_home_next_blocker(),
    },
    empty: m.page_home_no_live_cases(),
    more: true,
  },
});

export const homePage = widgets({
  // An eyebrow, a greeting, a summary line and "While you were away": 3 tiles.
  header: header({ rows: 3, data: query.all({ home, unread }), format: fmt.homeHeader }),
  widgets: [
    // The strip of four, 5 tiles each: the role's counts (from the collections) and its figures
    // with a trend (/home), in the role's order, the headline first.
    counts(to("finance-director"), "approvals", [
      {
        label: m.page_home_decisions_waiting(),
        where: myDecisions.where,
        note: m.page_home_decisions_note(),
        main: true,
      },
    ]),
    counts(to("sales", "desk"), "cases", [
      { label: m.page_home_my_live_cases(), where: mine(LIVE), note: m.page_home_my_live_cases_note(), main: true },
    ]),
    counts(to("office-admin"), "intake-messages", [
      { label: m.page_home_inbox_triage(), where: toTriage, note: m.page_home_inbox_note(), main: true },
      { label: m.page_home_due_today(), collection: "tasks", where: dueToday, note: m.page_home_due_today_note() },
    ]),
    figures({
      width: 5,
      data: home,
      labels: fmt.homeFigureLabels,
      name: fmt.homeFigureName,
      format: fmt.homeFigures,
    }),
    counts(to("operations"), "supplier-bills", [
      {
        label: m.page_home_bills_match(),
        where: { status: { not_equals: "Paid" } },
        note: m.page_home_bills_match_note(),
      },
      {
        label: m.page_home_to_collect(),
        collection: "invoices",
        where: toCollect.where,
        note: m.page_home_to_collect_note(),
      },
      {
        label: m.page_home_exceptions(),
        collection: "integration-exceptions",
        where: { status: { equals: "Open" } },
        note: m.page_home_exceptions_note(),
        tone: { some: "warning", none: "success" },
      },
    ]),
    // The day's chart with what's next and the first list beside it (4 lanes: 2 + 1 + 1).
    chart.each(charts(0, 1)),
    list({
      title: m.page_home_next_up(),
      // Its subhead comes with the data; this line holds its place while it loads.
      subhead: m.page_home_this_week(),
      size: "s",
      emphasis: "inverse",
      skeleton: "list",
      data: home,
      empty: { when: (h) => !fmt.homePart(h, "agenda"), heading: m.page_home_nothing_this_week() },
      format: fmt.agenda,
    }),
    // The first list: the decisions waiting for the approvers (tinted, so it reads first), the
    // follow-ups due today, the pipeline's next steps for Sales, the inbox for the office.
    {
      title: m.page_home_your_decision(),
      subhead: m.page_home_your_decision_subhead(),
      size: "s",
      emphasis: "tinted",
      visible: to("management", "finance-director"),
      collection: {
        collection: "approvals",
        key: "waiting-for-your-decisio",
        layout: "list",
        where: myDecisions.where,
        sort: "-createdAt",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    followUps(to("operations", "desk"), mine(dueToday)),
    {
      title: m.page_home_pipeline(),
      subhead: m.page_home_pipeline_subhead(),
      size: "s",
      visible: to("sales"),
      collection: {
        collection: "opportunities",
        key: "pipeline-next-steps",
        layout: "list",
        where: { owner: { equals: "$user.id" } },
        sort: "nextStepDue",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_home_inbox_triage(),
      subhead: m.page_home_inbox_subhead(),
      size: "s",
      visible: to("office-admin"),
      collection: {
        collection: "intake-messages",
        key: "inbox-to-triage",
        layout: "list",
        where: toTriage,
        sort: "-receivedAt",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    // The queue with the second list (3 + 1): every live case for management, finance and the
    // office (with owners), the user's own for everyone else.
    queue(to("management"), m.page_home_all_live(), m.page_home_all_live_subhead(), LIVE, { owner: true, value: true }),
    queue(to("finance-director"), m.page_home_all_live(), m.page_home_by_risk(), LIVE, {
      owner: true,
      value: true,
    }),
    queue(to("office-admin"), m.page_home_desk_cases(), m.page_home_desk_cases_subhead(), LIVE, { owner: true }),
    queue(to("operations"), m.page_home_my_queue(), m.page_home_my_queue_subhead(), mine(LIVE), { value: true }),
    queue(to("sales"), m.page_home_my_queue(), m.page_home_my_queue_subhead(), mine(LIVE), {}),
    queue(to("desk"), m.page_home_my_queue(), m.page_home_desk_queue_subhead(), mine(LIVE), { value: true }),
    // The second list: the 07:00 briefing (several collections: /home writes it), or for the
    // office everyone's follow-ups due today.
    list({
      title: m.page_home_briefing(),
      // Its subhead comes with the data; this line holds its place while it loads.
      subhead: m.page_home_this_morning(),
      size: "s",
      skeleton: "list",
      visible: (s) => s.user.role !== "office-admin",
      data: home,
      empty: { when: (h) => !fmt.homePart(h, "briefing"), heading: m.page_home_nothing_morning() },
      format: fmt.briefing,
    }),
    followUps(to("office-admin"), dueToday),
    // The day at a glance, alive: deadlines draining in real time, the month's calendar, and the
    // figures the role steers by against their targets.
    countdown({
      title: m.page_home_deadlines(),
      subhead: m.page_home_deadlines_subhead(),
      size: "s",
      rows: 8,
      maxRows: 9,
      skeleton: "list",
      data: visuals,
      format: shapes.deadlines,
    }),
    month({
      title: m.page_home_this_month(),
      size: "s",
      rows: 7,
      maxRows: 8,
      skeleton: "list",
      data: visuals,
      format: shapes.calendar,
    }),
    bullet({
      title: m.page_home_targets(),
      size: "s",
      rows: 8,
      maxRows: 8,
      skeleton: "list",
      visible: to("management", "finance-director"),
      data: visuals,
      format: shapes.targets,
    }),
    waffle({
      title: m.page_home_win_rate(),
      size: "s",
      rows: 3,
      maxRows: 4,
      skeleton: "stats",
      visible: to("sales", "management"),
      data: visuals,
      format: shapes.winWaffle,
    }),
    dial({
      title: m.page_home_turnaround(),
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      visible: to("desk", "sales", "operations"),
      data: visuals,
      format: shapes.turnaroundDial,
    }),
    // A compact chart, then the role's other charts, two a row.
    chart.each(charts(1)),
    // My quote deadlines over the next 7 days: the cases collection itself, drawn as a chart by
    // deadline (switchable to a calendar, a timeline or rows), not a chart computed by hand.
    {
      title: m.page_home_my_deadlines(),
      subhead: m.page_home_my_deadlines_subhead(),
      size: "m",
      rows: 7,
      minRows: 6,
      visible: to("desk"),
      collection: {
        collection: "cases",
        key: "mydeadlines",
        layout: "chart",
        where: {
          owner: { equals: "$user.id" },
          deadline: { greater_than_equal: "$today", less_than: "$today+7d" },
        },
        chart: { by: "deadline", bucket: "day", days: 7 },
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    // The collections themselves, laid out for a glance: the open tasks as rows, and the live cases
    // on a month calendar by their quote deadline (each switchable to a table, cards or a board).
    {
      title: m.page_home_open_tasks(),
      size: "m",
      rows: 8,
      minRows: 5,
      collection: {
        collection: "tasks",
        key: "mytasks",
        layout: "list",
        where: { status: { equals: "Open" } },
        sort: "due",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_home_quote_deadlines(),
      size: "m",
      rows: 10,
      minRows: 8,
      collection: {
        collection: "cases",
        key: "deadlines",
        layout: "calendar",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
