import { formatNumber, type Cell, type ListItem, type Stat, type ViewBlock } from "./schema.ts";
import { formatInt, intl, m } from "../../i18n/index.ts";

/**
 * A widget's mini version: what it shows, cut down to a glance for the side panel's Widgets (a
 * widget dragged there from its screen). Worked out from the blocks it renders, so every widget has
 * one, whatever kind it is:
 *
 * - figures (`stats`): the main one (else the first) as a mini figure (`mini`): its label on one
 *   line, the value with its sparkline beside it, its share bar under it; the note left out;
 * - a chart over time: its first series' latest value as a mini figure, the series its sparkline,
 *   the change from the point before as its delta; a chart of categories (no digit in any label):
 *   its parts as one share bar;
 * - a dial or a waffle: its reading as a mini figure, its share of the most as the bar; a heatmap:
 *   its total, its weeks as the sparkline; a waterfall: where it ends, against where it starts;
 * - a mini figure's tile is bare, the figure named by the widget's title (`miniFigure`);
 * - parts of a whole (a ring, a share bar, a treemap): one share bar of the largest `MINI_PARTS`;
 * - rows of anything (a table, a list, entries, a timeline, a gantt's rows, tiles) as a list of the
 *   first `MINI_ITEMS`, a line each: the row's first text, and its last value at the end;
 * - a funnel's stages as rows, in order, each with its value; dates as "3 Nov";
 * - gauges and description lists, their first `MINI_ITEMS`; a stepper, the step it's at; an alert
 *   or an empty state as it is, without actions;
 * - what's for working in the screen itself (forms, choices, actions, attachments, documents,
 *   messages, settings, the assistant, assists, headings and dividers) left out: the mini version
 *   opens its screen for that (`miniOpen`).
 *
 * Cards, grids and splits are opened up. A mini version's tile fits what it draws (the board's
 * `rows: "fit"`), so nothing in it is cut and no room is left over.
 */
export const MINI_ITEMS = 3;
/** Most parts in a mini share bar: the largest, the rest folded into "Other". */
export const MINI_PARTS = 4;

/**
 * Tiles down a mini version takes: a figure (a stat's skeleton) or a chart one, its one line;
 * anything else its title and `MINI_ITEMS` lines of up to two lines each (a line's text wraps
 * beside its value: `ui-list-item`), 4 tiles of 56px for 3 lines of 60px.
 */
export const miniRows = (titled: boolean, skeleton?: string) =>
  skeleton === "stats" || skeleton === "chart" ? 1 : (titled ? 1 : 0) + Math.ceil((MINI_ITEMS * 60) / 56);

/**
 * A mini version that is one figure (a `stats` block of one item), named `title` (its widget's,
 * when it has one): drawn bare, the figure's line its whole tile. Anything else: undefined.
 */
export function miniFigure(blocks: ViewBlock[], title?: string): ViewBlock[] | undefined {
  const [b] = blocks;
  if (blocks.length !== 1 || b?.type !== "stats" || b.items.length !== 1) return undefined;
  return [{ ...b, mini: true, items: [{ ...b.items[0]!, label: title || b.items[0]!.label }] }];
}

/** One figure as a mini figure: its label, its value and sparkline, its share; no note. */
const figure = (s: Stat): ViewBlock[] => [
  { type: "stats", size: "md", mini: true, items: [{ ...s, note: undefined }] },
];

type Part = { label: string; value: number; valueText?: string; href?: string };

/** Parts of a whole as one share bar: the largest `MINI_PARTS`, the rest as "Other". */
function parts(list: Part[], label?: string): ViewBlock[] {
  const sorted = [...list].filter((p) => p.value > 0).sort((p, q) => q.value - p.value);
  if (!sorted.length) return [];
  const top = sorted.slice(0, sorted.length > MINI_PARTS ? MINI_PARTS - 1 : MINI_PARTS);
  const other = sorted.slice(top.length).reduce((t, p) => t + p.value, 0);
  return [
    {
      type: "share",
      ...(label ? { label } : {}),
      parts: other ? [...top, { label: m.widget_mini_other(), value: other }] : top,
    },
  ];
}

/** "2026-11-03" as "3 Nov": a short date for a narrow line. */
const shortDate = (iso: string) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : intl.date({ day: "numeric", month: "short", timeZone: "UTC" }).format(d);
};

/** A cell as one line of text. */
export function cellText(c: Cell): string {
  if (c == null) return "";
  if (typeof c === "string" || typeof c === "number") return String(c);
  return c.text;
}

/**
 * A line: its text, and a short value at its end. A time or date that leads an agenda's row goes at
 * the end instead: in a narrow panel the agenda's time column would leave its text a word a line.
 */
const line = (headline: string, value?: Cell, href?: string, lead?: string): ListItem => {
  const end = value !== undefined && cellText(value) ? value : lead;
  return { headline, ...(end ? { value: end } : {}), ...(href ? { href } : {}) };
};

const rows = (items: ListItem[]): ViewBlock[] =>
  items.length ? [{ type: "list", variant: "divided", items: items.slice(0, MINI_ITEMS) }] : [];

function mini(b: ViewBlock): ViewBlock[] {
  switch (b.type) {
    case "card":
      return miniBlocks(b.blocks);
    case "grid":
      return miniBlocks(b.blocks);
    case "split":
      return miniBlocks([...b.main, ...b.side]);
    case "stats": {
      const main = b.items.find((i) => i.main) ?? b.items[0];
      return main ? figure(main) : [];
    }
    case "chart": {
      const c = b.chart;
      const s = c.series[0];
      if (!s?.values.length) return [];
      // Bars of categories ("Draft", "Sent"): parts of a whole, not moments in time.
      const timed = c.kind === "line" || !!c.highlightLast || !!c.ranges || c.labels.some((l) => /\d/.test(l));
      if (!timed)
        return parts(
          c.labels.map((l, i) => ({
            label: l,
            value: s.values[i] ?? 0,
            valueText: formatNumber(s.values[i] ?? 0, c.format),
          })),
          b.title ?? b.label,
        );
      const n = s.values.length;
      const last = s.values[n - 1]!;
      const before = n > 1 ? s.values[n - 2]! : undefined;
      return figure({
        label: s.name,
        value: formatNumber(last, c.format),
        trend: { labels: c.labels.slice(0, n), values: s.values, format: c.format },
        ...(before !== undefined && before !== last
          ? {
              delta: {
                text: `${last > before ? "+" : "−"}${formatNumber(Math.abs(last - before), c.format)} vs ${c.labels[n - 2]}`,
                dir: last > before ? ("up" as const) : ("down" as const),
              },
            }
          : {}),
      });
    }
    case "table": {
      const body = b.totals ? b.rows.slice(0, -1) : b.rows;
      // Columns with text in them (a row's actions column has none).
      const cols = b.columns.filter((c) => body.some((r) => cellText(r[c.key] as Cell).trim()));
      const first = cols[0];
      const last = cols.length > 1 ? cols[cols.length - 1] : undefined;
      return rows(
        body.map((r) =>
          line(cellText(first ? (r[first.key] as Cell) : ""), last ? (r[last.key] as Cell) : undefined, r.href),
        ),
      );
    }
    case "list":
      return rows(
        b.items.map((i) => ({
          ...line(i.headline, i.value ?? i.trailing, i.href, i.lead),
          ...(i.dot ? { dot: i.dot } : {}),
        })),
      );
    case "entries":
      return rows(b.items.map((e) => line(e.heading, undefined, e.href)));
    case "timeline":
      return rows(b.items.map((t) => line(t.heading ?? t.text ?? "", undefined, undefined, t.time)));
    case "gantt":
      return rows(b.rows.map((r) => line(r.label, r.tag)));
    case "tiles":
      return rows(b.items.map((t) => line(t.heading, b.figure ? undefined : t.overline)));
    case "ring":
      // With `max`, one reading of a known most (a progress ring): a figure and its share.
      return b.max !== undefined && b.parts[0]
        ? figure({
            label: b.label ?? b.parts[0].label,
            value: b.parts[0].valueText ?? String(b.parts[0].value),
            share: { value: b.parts[0].value / (b.max || 1), text: b.total ?? m.widget_share_of_max({ max: b.max }) },
          })
        : parts(b.parts, b.label);
    case "funnel":
      return rows(b.stages.map((s) => line(s.label, s.valueText ?? String(s.value), s.href)));
    case "heatmap": {
      const total = b.days.reduce((t, d) => t + d.value, 0);
      // Its days as the sparkline, a week a point (a day's line is too fine in a narrow panel).
      const weeks: { label: string; value: number }[] = [];
      b.days.forEach((d, i) => {
        if (i % 7 === 0) weeks.push({ label: d.label, value: 0 });
        weeks[weeks.length - 1]!.value += d.value;
      });
      return figure({
        label: b.label ?? m.widget_total(),
        value: String(total),
        ...(weeks.length > 1
          ? { trend: { labels: weeks.map((w) => w.label), values: weeks.map((w) => w.value) } }
          : {}),
      });
    }
    case "bullet":
      return rows(b.items.map((i) => line(i.label, i.valueText ?? String(i.value))));
    case "dial": {
      const min = b.min ?? 0;
      const tone = b.zones?.find((z) => b.value <= z.to)?.tone;
      return figure({
        label: b.label ?? m.widget_mini_reading(),
        value: b.valueText ?? String(b.value),
        ...(tone ? { tone } : {}),
        share: {
          value: (b.value - min) / (b.max - min || 1),
          text: b.caption ?? m.widget_mini_of({ max: formatInt(b.max) }),
        },
      });
    }
    case "waffle": {
      const max = b.max ?? 100;
      return figure({
        label: b.label ?? m.widget_mini_share(),
        value: b.valueText ?? `${b.value ?? 0}`,
        share: { value: (b.value ?? 0) / (max || 1), text: b.caption ?? m.widget_mini_of({ max: formatInt(max) }) },
      });
    }
    case "share":
      return parts(b.parts, b.label);
    case "treemap":
      return parts(b.items, b.label);
    case "waterfall": {
      const last = [...b.steps].reverse().find((s) => s.total) ?? b.steps.at(-1);
      const first = b.steps[0];
      return last
        ? figure({
            label: last.label,
            value: last.valueText ?? formatNumber(last.value, b.format),
            ...(first && first !== last && first.value
              ? {
                  share: {
                    value: Math.max(0, last.value) / Math.abs(first.value),
                    text: m.widget_share_of_first({
                      label: first.label,
                      value: first.valueText ?? formatNumber(first.value, b.format),
                    }),
                  },
                }
              : {}),
          })
        : [];
    }
    case "quadrant":
      return rows(b.points.map((p) => line(p.label, p.valueText, p.href)));
    case "countdown":
      return rows(
        [...b.items].sort((p, q) => p.due.localeCompare(q.due)).map((i) => line(i.label, shortDate(i.due), i.href)),
      );
    case "month": {
      const from = b.today ?? "";
      return rows(
        [...b.events]
          .filter((e) => e.date >= from)
          .sort((p, q) => p.date.localeCompare(q.date))
          .map((e) => line(e.label, shortDate(e.date), e.href)),
      );
    }
    case "gauges":
      return [{ ...b, items: b.items.slice(0, MINI_ITEMS) }];
    case "details":
      return [{ ...b, items: b.items.slice(0, MINI_ITEMS) }];
    case "steps": {
      const at = b.items[b.current];
      return at
        ? [
            {
              type: "text",
              text: m.widget_mini_step({
                step: formatInt(b.current + 1),
                total: formatInt(b.items.length),
                label: at.label,
              }),
              muted: true,
            },
          ]
        : [];
    }
    case "alert":
      return [{ type: "alert", tone: b.tone, heading: b.heading, text: b.text }];
    case "empty":
    case "tags":
      return [b];
    case "text":
      return [{ type: "text", text: b.text, muted: b.muted }];
    default:
      return [];
  }
}

/** A widget's blocks as its mini version (see above). */
export const miniBlocks = (blocks: ViewBlock[]): ViewBlock[] => blocks.flatMap(mini);

/** What a mini version that keeps nothing shows: a line opening its screen. */
export const miniOpen = (href: string, label: string): ViewBlock[] => [
  { type: "list", variant: "divided", items: [{ headline: m.widget_mini_open({ label }), href }] },
];
