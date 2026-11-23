import {
  ask,
  bullet,
  chart,
  dial,
  figures,
  funnel,
  gauges,
  header,
  heatmap,
  ring,
  text,
  treemap,
  waterfall,
  widgets,
  type CollectionViewSpec,
} from "saastemlycrm-design-system/contracts";
import * as shapes from "../format/visuals.ts";
import { visuals } from "../queries/visuals.ts";
import type { CrChart, CrRanked } from "../endpoints/control-room.ts";
import * as fmt from "../format/control-room.ts";
import { LIVE } from "../queries/cases.ts";
import { briefing, room } from "../queries/control-room.ts";
import { m } from "../i18n/paraglide/messages.js";

/** The suppliers who deliver (not our own stock). */
const SUPPLIERS = { kind: { not_equals: "own-stock" } };
/** A collection widget on the room: its records and its layout menu, nothing else. */
const COMPACT: NonNullable<CollectionViewSpec["hide"]> = [
  "export",
  "columns",
  "select",
  "around",
  "search",
  "filters",
  "create",
];

/**
 * The control room (/control-room): "The business, live. Briefed at 07:00." for Karim Balbaa and
 * Mohamed Helmy: the 07:00 AI briefing (GET /api/briefing), "Ask Golden Sea" (an `ask` block on
 * POST /api/ask) and the management dashboards: one tile per trend chart, per ranking and per
 * table, each titled by the data, so a dashboard the role may not see has no tile. The key figures
 * cover the last four weeks (`period`); each trend chart opens on its whole history and its own
 * range switch cuts its history without asking again, so the screen needs no period control of
 * its own. Data: GET /api/control-room?period= (../endpoints/control-room.ts); profit & cash only
 * reach management and finance. Each widget is a design-system kind given a query and a formatter
 * (../format/control-room.ts). Live cases per owner (a ring of each owner's share) and the suppliers' on-time and reply times
 * read the cases and suppliers collections themselves, with no code: the busiest owner first, each
 * supplier's on-time share as a bar and its thresholds in amber (the fields' `gauge` and
 * `toneWhen`), its open RFQs its own `openRfqs`.
 */
export const controlRoom = widgets({
  params: { period: "4w" },
  header: header({ data: room, format: fmt.roomHeader }),
  // The figures, the briefing beside "Ask", the trend charts two a row, the rankings, then the tables.
  widgets: [
    figures({ data: room, labels: fmt.roomFigureLabels, name: fmt.roomFigureName, format: fmt.roomFigures }),
    text({
      title: m.page_room_briefing(),
      size: "s",
      skeleton: "text",
      data: briefing,
      format: fmt.briefing,
    }),
    ask({ title: m.page_room_ask(), size: "m", rows: 6, maxRows: 8, format: fmt.askGoldenSea }),
    // The targets and the two speeds the desk is judged on, at a glance.
    bullet({
      title: m.page_room_targets(),
      size: "s",
      rows: 8,
      maxRows: 8,
      skeleton: "list",
      data: visuals,
      format: shapes.targets,
    }),
    dial({
      title: m.page_room_turnaround(),
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      data: visuals,
      format: shapes.turnaroundDial,
    }),
    dial({
      title: m.page_room_ack(),
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      data: visuals,
      format: shapes.ackDial,
    }),
    // What the live cases wait on: the cases themselves, grouped by `wait`, as one bar (no code).
    {
      title: m.page_room_waits(),
      size: "m",
      rows: 4,
      maxRows: 5,
      breakdown: { collection: "cases", where: LIVE, by: "wait", as: "share" },
    },
    // How the pipeline converts, why it leaks, and how busy each day has been: shapes to read at a glance.
    funnel({
      title: m.page_room_funnel(),
      size: "s",
      rows: 6,
      maxRows: 6,
      skeleton: "list",
      data: room,
      format: fmt.quoteFunnel,
    }),
    ring({
      title: m.page_room_lost(),
      size: "s",
      rows: 4,
      maxRows: 4,
      skeleton: "list",
      data: room,
      format: fmt.lostRing,
    }),
    heatmap({
      title: m.page_room_inquiries(),
      size: "m",
      rows: 5,
      maxRows: 5,
      skeleton: "chart",
      data: room,
      format: fmt.inquiryDays,
    }),
    ring({
      title: m.page_room_receivables_age(),
      size: "s",
      rows: 4,
      maxRows: 4,
      skeleton: "list",
      data: room,
      visible: shapes.seesMoney,
      empty: { when: (d) => !d.visuals.ageing.length, heading: m.page_room_no_receivables() },
      format: fmt.ageingRing,
    }),
    chart.each({
      size: "m",
      skeleton: "chart",
      data: room,
      tiles: fmt.roomChartTiles,
      empty: { heading: m.page_room_no_trend() },
      items: fmt.roomCharts,
      key: (w: CrChart) => w.title,
      title: (w: CrChart) => w.title,
      subhead: (w: CrChart) => w.sub,
      format: fmt.trendChart,
    }),
    gauges.each({
      size: "s",
      skeleton: "list",
      data: room,
      tiles: fmt.roomRankingTiles,
      empty: { heading: m.page_room_no_ranking() },
      items: fmt.roomRankings,
      key: (r: CrRanked) => r.title,
      title: (r: CrRanked) => r.title,
      subhead: (r: CrRanked) => r.sub,
      format: fmt.rankedGauges,
    }),
    // Who carries the load: every live case by its owner, the busiest first.
    {
      title: m.page_room_per_owner(),
      subhead: m.page_room_per_owner_subhead(),
      size: "s",
      rows: 4,
      maxRows: 4,
      // Each owner's share of the live book, as a ring: pointing at one reads it, choosing it opens their cases.
      breakdown: { collection: "cases", where: LIVE, by: "owner", as: "ring" },
    },
    text({
      title: m.page_room_profit_cash(),
      size: "s",
      skeleton: "text",
      data: room,
      visible: (scope) => !shapes.seesMoney(scope),
      format: fmt.moneyWithheld,
    }),
    // Where the money sits and where the profit went (management and finance).
    treemap({
      title: m.page_room_receivables_customer(),
      size: "m",
      rows: 6,
      maxRows: 7,
      skeleton: "chart",
      data: visuals,
      visible: shapes.seesMoney,
      empty: { when: (v) => !v.receivables.length, heading: m.page_room_no_receivables() },
      format: shapes.receivablesMap,
    }),
    waterfall({
      title: m.page_room_gp_bridge(),
      size: "m",
      rows: 5,
      maxRows: 7,
      skeleton: "chart",
      data: visuals,
      visible: shapes.seesMoney,
      empty: { when: (v) => !v.gp.length, heading: m.page_room_no_gp() },
      format: shapes.gpBridge,
    }),
    // The suppliers on two measures at once (who's reliable and fast, who's neither), and ranked by
    // on-time delivery: the suppliers collection itself, as a scatter and as a ranking, each
    // switchable to the collection's other layouts.
    {
      title: m.page_room_quadrant(),
      subhead: m.page_room_quadrant_subhead(),
      size: "m",
      rows: 8,
      maxRows: 9,
      collection: {
        collection: "suppliers",
        key: "quadrant",
        layout: "scatter",
        where: SUPPLIERS,
        scatter: {
          x: "onTime",
          y: "replyHrs",
          xMid: 85,
          yMid: 24,
          invertY: true,
          quadrants: [
            m.page_room_fast_late(),
            m.page_room_reliable_fast(),
            m.page_room_slow_late(),
            m.page_room_reliable_slow(),
          ],
        },
        hide: COMPACT,
      },
    },
    {
      title: m.page_room_ontime(),
      subhead: m.page_room_ontime_subhead(),
      size: "m",
      rows: 8,
      maxRows: 12,
      collection: {
        collection: "suppliers",
        key: "ontime",
        layout: "ranking",
        figure: "onTime",
        where: SUPPLIERS,
        hide: COMPACT,
      },
    },
    // The live cases as cards (stage, value, owner) and the deliveries on their month.
    {
      title: m.page_room_live_cases(),
      size: "l",
      rows: 12,
      minRows: 8,
      collection: {
        collection: "cases",
        key: "live",
        layout: "cards",
        where: { stage: { not_in: ["Closed — settled", "Lost", "Expired"] } },
        sort: "deadline",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_room_deliveries(),
      size: "s",
      rows: 10,
      minRows: 8,
      collection: {
        collection: "deliveries",
        key: "deliveries",
        layout: "calendar",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
