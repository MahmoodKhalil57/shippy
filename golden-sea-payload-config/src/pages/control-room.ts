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
  quadrant,
  ring,
  share,
  text,
  treemap,
  waterfall,
  widgets,
} from "saastemlycrm-design-system/contracts";
import * as shapes from "../format/visuals.ts";
import { visuals } from "../queries/visuals.ts";
import type { CrChart, CrRanked } from "../endpoints/control-room.ts";
import * as fmt from "../format/control-room.ts";
import { LIVE } from "../queries/cases.ts";
import { briefing, room } from "../queries/control-room.ts";

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
    figures({ data: room, format: fmt.roomFigures }),
    text({
      title: "07:00 · daily AI briefing",
      size: "s",
      skeleton: "text",
      data: briefing,
      format: fmt.briefing,
    }),
    ask({ title: "Ask Golden Sea", size: "m", rows: 6, maxRows: 8, format: fmt.askGoldenSea }),
    // The targets and the two speeds the desk is judged on, at a glance.
    bullet({
      title: "Targets",
      size: "s",
      rows: 8,
      maxRows: 8,
      skeleton: "list",
      data: visuals,
      format: shapes.targets,
    }),
    dial({
      title: "Quote turnaround",
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      data: visuals,
      format: shapes.turnaroundDial,
    }),
    dial({
      title: "Time to acknowledge",
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      data: visuals,
      format: shapes.ackDial,
    }),
    share({
      title: "What live cases wait on",
      size: "m",
      rows: 3,
      maxRows: 4,
      skeleton: "list",
      data: visuals,
      format: shapes.waiting,
    }),
    // How the pipeline converts, why it leaks, and how busy each day has been: shapes to read at a glance.
    funnel({
      title: "Quote funnel",
      size: "s",
      rows: 6,
      maxRows: 6,
      skeleton: "list",
      data: room,
      format: fmt.quoteFunnel,
    }),
    ring({
      title: "Why quotes were lost",
      size: "s",
      rows: 4,
      maxRows: 4,
      skeleton: "list",
      data: room,
      format: fmt.lostRing,
    }),
    heatmap({
      title: "Inquiries per day",
      size: "m",
      rows: 5,
      maxRows: 5,
      skeleton: "chart",
      data: room,
      format: fmt.inquiryDays,
    }),
    ring({
      title: "Receivables by age",
      size: "s",
      rows: 4,
      maxRows: 4,
      skeleton: "list",
      data: room,
      hidden: (d) => !d.money,
      format: fmt.ageingRing,
    }),
    chart.each({
      size: "m",
      skeleton: "chart",
      data: room,
      items: fmt.roomCharts,
      key: (w: CrChart) => w.title,
      title: (w: CrChart) => w.title,
      format: fmt.trendChart,
    }),
    gauges.each({
      size: "s",
      skeleton: "list",
      data: room,
      items: fmt.roomRankings,
      key: (r: CrRanked) => r.title,
      title: (r: CrRanked) => r.title,
      format: fmt.rankedGauges,
    }),
    // Who carries the load: every live case by its owner, the busiest first.
    {
      title: "Live cases per owner",
      subhead: "Every live case has an owner, a deadline and a next action",
      size: "s",
      rows: 4,
      maxRows: 4,
      // Each owner's share of the live book, as a ring: pointing at one reads it, choosing it opens their cases.
      breakdown: { collection: "cases", where: LIVE, by: "owner", as: "ring" },
    },
    text({
      title: "Profit & cash",
      size: "s",
      skeleton: "text",
      data: room,
      hidden: (d) => d.money,
      format: fmt.moneyWithheld,
    }),
    // Where the money sits and where the profit went (management and finance).
    treemap({
      title: "Receivables by customer",
      size: "m",
      rows: 6,
      maxRows: 7,
      skeleton: "chart",
      data: visuals,
      hidden: (v) => !v.money,
      format: shapes.receivablesMap,
    }),
    waterfall({
      title: "Gross profit: expected to actual",
      size: "m",
      rows: 5,
      maxRows: 7,
      skeleton: "chart",
      data: visuals,
      hidden: (v) => !v.money,
      format: shapes.gpBridge,
    }),
    // The suppliers on two measures at once: who's reliable and fast, who's neither.
    quadrant({
      title: "Suppliers: on time vs reply time",
      size: "m",
      rows: 7,
      maxRows: 8,
      skeleton: "chart",
      data: visuals,
      format: shapes.supplierQuadrant,
    }),
    // Who delivers on time (a bar of 100%, amber under 85%) and how fast they answer (amber past a
    // day): each supplier's own figures, best first.
    {
      title: "Supplier on-time vs reply time",
      subhead: "On-time delivery and average reply time per supplier — open RFQs from the live records",
      size: "l",
      records: {
        collection: "suppliers",
        where: { kind: { not_equals: "own-stock" } },
        sort: "-onTime",
        limit: 50,
        columns: ["name", "onTime", "replyHrs", "openRfqs"],
        labels: { name: "Supplier", onTime: "On time", replyHrs: "Avg reply", openRfqs: "Open RFQs" },
      },
    },
    // The live cases as cards (stage, value, owner) and the deliveries on their month.
    {
      title: "Live cases",
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
      title: "Deliveries this month",
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
