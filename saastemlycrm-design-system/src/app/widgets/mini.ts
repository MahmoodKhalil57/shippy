import { formatNumber, type Cell, type ListItem, type ViewBlock } from "./schema.ts";

/**
 * A widget's mini version: what it shows, cut down to a glance for the side panel's Widgets (a
 * widget dragged there from its screen). Worked out from the blocks it renders, so every widget has
 * one, whatever kind it is:
 *
 * - figures (`stats`): the main one (else the first) on one line (`size: "sm"`), its label and
 *   value (no sparkline: in a narrow panel it leaves the label a word);
 * - a chart, its first series' latest value on one line, its period (the last label) as the note;
 * - either way the tile is that one line, bare, the figure named by the widget's title (`miniFigure`);
 * - rows of anything (a table, a list, entries, a timeline, a gantt's rows, tiles) as a list of the
 *   first `MINI_ITEMS`, a line each: the row's first text, and its last value at the end;
 * - a ring's or a funnel's parts as rows (a ring's largest first, a funnel's in order), each with
 *   its value; a heatmap, its summary (or the busiest day) as one figure;
 * - gauges and description lists, their first `MINI_ITEMS`; a stepper, the step it's at; an alert
 *   or an empty state as it is, without actions;
 * - what's for working in the screen itself (forms, choices, actions, attachments, documents,
 *   messages, settings, the assistant, assists, headings and dividers) left out: the mini version
 *   opens its screen for that (`miniOpen`).
 *
 * Cards, grids and splits are opened up. A mini version is never taller than `MINI_ROWS` tiles.
 */
export const MINI_ITEMS = 3;

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
  return [{ ...b, items: [{ ...b.items[0]!, label: title || b.items[0]!.label }] }];
}

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
      return main ? [{ type: "stats", size: "sm", items: [{ ...main, trend: undefined }] }] : [];
    }
    case "chart": {
      const s = b.chart.series[0];
      if (!s?.values.length) return [];
      const last = s.values[s.values.length - 1]!;
      return [
        {
          type: "stats",
          size: "sm",
          items: [
            {
              label: s.name,
              value: formatNumber(last, b.chart.format),
              note: b.chart.labels[s.values.length - 1],
            },
          ],
        },
      ];
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
      return rows(
        [...b.parts]
          .sort((p, q) => q.value - p.value)
          .map((p) => line(p.label, p.valueText ?? String(p.value), p.href)),
      );
    case "funnel":
      return rows(b.stages.map((s) => line(s.label, s.valueText ?? String(s.value), s.href)));
    case "heatmap": {
      const total = b.days.reduce((t, d) => t + d.value, 0);
      return [
        { type: "stats", size: "sm", items: [{ label: b.label ?? "Total", value: String(total), note: b.summary }] },
      ];
    }
    case "bullet":
      return rows(b.items.map((i) => line(i.label, i.valueText ?? String(i.value))));
    case "dial":
      return [
        {
          type: "stats",
          size: "sm",
          items: [{ label: b.label ?? "Reading", value: b.valueText ?? String(b.value), note: b.caption }],
        },
      ];
    case "waffle":
      return [
        {
          type: "stats",
          size: "sm",
          items: [{ label: b.label ?? "Share", value: b.valueText ?? `${b.value ?? 0}`, note: b.caption }],
        },
      ];
    case "share":
      return rows(
        [...b.parts]
          .sort((p, q) => q.value - p.value)
          .map((p) => line(p.label, p.valueText ?? String(p.value), p.href)),
      );
    case "treemap":
      return rows(
        [...b.items]
          .sort((p, q) => q.value - p.value)
          .map((p) => line(p.label, p.valueText ?? String(p.value), p.href)),
      );
    case "waterfall": {
      const last = [...b.steps].reverse().find((s) => s.total) ?? b.steps.at(-1);
      return last
        ? [
            {
              type: "stats",
              size: "sm",
              items: [{ label: last.label, value: last.valueText ?? formatNumber(last.value, b.format) }],
            },
          ]
        : [];
    }
    case "quadrant":
      return rows(b.points.map((p) => line(p.label, p.valueText, p.href)));
    case "countdown":
      return rows(
        [...b.items].sort((p, q) => p.due.localeCompare(q.due)).map((i) => line(i.label, i.due.slice(5, 10), i.href)),
      );
    case "month": {
      const from = b.today ?? "";
      return rows(
        [...b.events]
          .filter((e) => e.date >= from)
          .sort((p, q) => p.date.localeCompare(q.date))
          .map((e) => line(e.label, e.date.slice(5), e.href)),
      );
    }
    case "gauges":
      return [{ ...b, items: b.items.slice(0, MINI_ITEMS) }];
    case "details":
      return [{ ...b, items: b.items.slice(0, MINI_ITEMS) }];
    case "steps": {
      const at = b.items[b.current];
      return at ? [{ type: "text", text: `Step ${b.current + 1} of ${b.items.length}: ${at.label}`, muted: true }] : [];
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
  { type: "list", variant: "divided", items: [{ headline: `Open ${label}`, href }] },
];
