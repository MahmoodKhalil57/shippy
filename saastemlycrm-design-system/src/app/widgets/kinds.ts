import type { Action, Tag, ViewBlock, ViewBlocks, ViewHeader } from "./schema.ts";
import type {
  EachSpec,
  Source,
  Widget,
  WidgetBase,
  WidgetEmpty,
  WidgetHead,
  WidgetHeader,
  WidgetScope,
} from "./widget.ts";

/**
 * Widget kinds: reusable widgets named for what they draw (`chart`, `table`, `list`, `steps`…),
 * each knowing nothing of any business. A project's config picks a kind, feeds it a Payload query
 * (`query.find`, `query.endpoint`…) and a formatter, and says where and when it shows:
 *
 * ```ts
 * export default chart({
 *   title: "Receivables ageing by customer",
 *   size: "m",
 *   data: query.endpoint<Cash>("/operations/cash"),
 *   format: (d) => ({ chart: { kind: "bars", labels: …, series: … } }),
 * });
 * ```
 *
 * The formatter holds the business logic (which records, what they mean, which tone, which
 * actions) and returns the kind's data: the fields of its block, plus the slots every kind has,
 * drawn in the same places around it (`Slots`): a quiet `note` and `tags` above, `choice` (a
 * parameter the screen reloads with) and `alerts` over it, `actions` under it, and the card's
 * `head` (its count, tags and actions). It returns nothing to draw nothing. A kind is a `Widget`
 * like any other: the board, the skeletons, the agent tools and the design check see no
 * difference.
 *
 * Everything here is pure (the config also runs in a service worker).
 */

/** A Payload query whose answer is a `T` (a `Source`, typed): `query.find<Case>("cases", …)`. */
export type Query<T> = Source & { readonly __data?: T };

/** What a query answers: `DataOf<typeof cash>`, for a formatter written apart from its widget. */
export type DataOf<Q> = Q extends Query<infer T> ? T : never;

type Find = Extract<Source, { find: string }>;
type Count = Extract<Source, { count: string }>;
type Doc = Extract<Source, { doc: true }>;
type Global = Extract<Source, { global: string }>;

/** Payload's API as the signed-in user, typed by what it answers. Strings may hold `$doc.id`, `$param.x`… */
export const query = {
  /** GET below /api: a data endpoint (aggregates the collections can't answer alone). */
  endpoint: <T>(endpoint: string, params?: Record<string, string>): Query<T> =>
    params ? { endpoint, query: params } : { endpoint },
  /** A collection's documents (REST `find`): `{ docs, totalDocs, … }`. */
  find: <T>(collection: string, options: Omit<Find, "find"> = {}): Query<{ docs: T[]; totalDocs: number }> => ({
    find: collection,
    ...options,
  }),
  /** How many documents match: `{ totalDocs }`. */
  count: (collection: string, options: Omit<Count, "count"> = {}): Query<{ totalDocs: number }> => ({
    count: collection,
    ...options,
  }),
  /** The document the screen is about (an edit tab). */
  doc: <T>(options: Omit<Doc, "doc"> = {}): Query<T> => ({ doc: true, ...options }),
  /** A global's values. */
  global: <T>(slug: string, options: Omit<Global, "global"> = {}): Query<T> => ({ global: slug, ...options }),
  /** Several at once: the answer has the same keys. */
  all: <Q extends Record<string, Query<unknown>>>(
    queries: Q,
  ): Query<{ [K in keyof Q]: Q[K] extends Query<infer T> ? T : never }> => ({ all: queries }),
};

/** What every kind can draw around its own content, from the same data. */
export interface Slots {
  /** A quiet line above (what it's for, a rule). */
  note?: string;
  /** Tags above. */
  tags?: Tag[];
  /** Choices that set screen parameters (the period, a filter, an order): the screen reloads with them. */
  choice?: Omit<ViewBlocks["choice"], "type"> | Omit<ViewBlocks["choice"], "type">[];
  /** Alerts over the content. */
  alerts?: Omit<ViewBlocks["alert"], "type">[];
  /** Buttons under it. */
  actions?: Action[];
  /** The card's header: its count, tags, actions, subhead. */
  head?: WidgetHead;
}

/** A kind's data: its block's fields and the slots. */
export type KindData<K extends keyof ViewBlocks> = Omit<ViewBlocks[K], "type"> & Slots;

/** A widget of a kind: where it goes, the query that feeds it and the formatter that reads it. */
export type KindWidget<T, D> = Omit<WidgetBase<T>, "source" | "head"> & {
  /** The query (no query: `format` gets nothing, for a widget made of fixed words). */
  data?: Query<T>;
  /** The business logic: the data the kind draws, or nothing to draw nothing. */
  format(data: T, scope: WidgetScope): D | null | undefined;
};

/**
 * One tile per item of the data (a card per order), each of the kind: `tiles` of them, decided
 * before the data, and what a tile with no item says (`empty`).
 */
export type KindEach<T, I, D> = Omit<WidgetBase<T>, "source" | "head" | "title" | "subhead" | "empty"> & {
  data?: Query<T>;
  /** How many tiles it takes: fixed, or from who is looking (never from the data). */
  tiles: EachSpec<T, I>["tiles"];
  /** What a tile with no item says (fewer items than tiles), and when there are none at all. */
  empty: WidgetEmpty<T>;
  items(data: T, scope: WidgetScope): I[];
  /** The same for the same item (its tile keeps its place). */
  key(item: I, index: number): string;
  title(item: I, index: number): string;
  subhead?(item: I, data: T, scope: WidgetScope): string;
  format(item: I, data: T, scope: WidgetScope): D | null | undefined;
};

/** The blocks a kind draws: the slots in their places around its own block (or blocks). */
function draw(main: ViewBlock[], slots: Slots): ViewBlock[] {
  const { note, tags, choice, alerts, actions } = slots;
  const out: ViewBlock[] = [];
  if (note) out.push({ type: "text", text: note, muted: true });
  if (tags?.length) out.push({ type: "tags", items: tags });
  for (const c of [choice ?? []].flat()) out.push({ type: "choice", ...c });
  for (const a of alerts ?? []) out.push({ type: "alert", ...a });
  out.push(...main);
  if (actions?.length) out.push({ type: "actions", items: actions });
  return out;
}

/** A kind's own block, split from its slots. */
function one(type: string, d: Slots & Record<string, unknown>): ViewBlock[] {
  const { note, tags, choice, alerts, actions, head, ...body } = d;
  return draw([{ type, ...body } as ViewBlock], { note, tags, choice, alerts, actions, head });
}

/** A kind: a widget maker for one block type, plus `.each` for one tile per item. */
export function kind<K extends keyof ViewBlocks>(type: K) {
  const make = <T = void>({ data, format, ...w }: KindWidget<T, KindData<K>>): Widget<T> =>
    ({
      ...w,
      source: data,
      head: (d: T, scope: WidgetScope) => format(d, scope)?.head ?? {},
      render: (d: T, scope: WidgetScope) => {
        const got = format(d, scope);
        return got ? one(type, got as Slots & Record<string, unknown>) : null;
      },
    }) as Widget<T>;
  return Object.assign(make, {
    each: <T, I>({ data, tiles, items, key, title, subhead, format, ...w }: KindEach<T, I, KindData<K>>): Widget<T> =>
      ({
        ...w,
        source: data,
        each: {
          tiles,
          items,
          key,
          title,
          subhead,
          head: (item: I, d: T, scope: WidgetScope) => format(item, d, scope)?.head ?? {},
          render: (item: I, d: T, scope: WidgetScope) => {
            const got = format(item, d, scope);
            return got ? one(type, got as Slots & Record<string, unknown>) : null;
          },
        },
      }) as Widget<T>,
  });
}

export const chart = kind("chart");
export const table = kind("table");
export const list = kind("list");
export const entries = kind("entries");
export const stats = kind("stats");
export const details = kind("details");
export const gauges = kind("gauges");
/** Parts of a whole as a donut (`ring` block), or one reading of a known most. */
export const ring = kind("ring");
/** Stages one after another, with the share that went on between them (`funnel` block). */
export const funnel = kind("funnel");
/** How much happened each day, a calendar of weeks (`heatmap` block). */
export const heatmap = kind("heatmap");
/** Readings against targets on qualitative bands (`bullet` block). */
export const bullet = kind("bullet");
/** One reading on a half-circle gauge with a needle (`dial` block). */
export const dial = kind("dial");
/** A share as a 10 × 10 grid (`waffle` block). */
export const waffle = kind("waffle");
/** Parts of a whole as one 100% bar (`share` block). */
export const share = kind("share");
/** Parts of a whole as rectangles sized by value (`treemap` block). */
export const treemap = kind("treemap");
/** How one figure becomes another, step by step (`waterfall` block). */
export const waterfall = kind("waterfall");
/** Who's where on two measures, in four quadrants (`quadrant` block). */
export const quadrant = kind("quadrant");
/** Deadlines with the time left, live (`countdown` block). */
export const countdown = kind("countdown");
/** A month's calendar of what's due (`month` block). */
export const month = kind("month");
/** Sliders in, figures out (`whatif` block). */
export const whatif = kind("whatif");
export const steps = kind("steps");
export const timeline = kind("timeline");
export const gantt = kind("gantt");
/** Words: a paragraph (`text`), with the slots around it. */
export const text = kind("text");
export const message = kind("message");
export const tiles = kind("tiles");
export const form = kind("form");
export const document = kind("document");
export const settings = kind("settings");
export const ask = kind("ask");
export const attach = kind("attach");
export const alert = kind("alert");
export const actions = kind("actions");
export const empty = kind("empty");
/** An on-device AI assist (`assist()`'s element and props). */
export const custom = kind("custom");

/** Data of a group of on-device AI assists: each one `assist()`'s element, key and props. */
export type AssistsData = { items: Omit<ViewBlocks["custom"], "type">[] } & Slots;

/** Several on-device AI assists in one tile (what to check about a message, read it, reply to it). */
export const assists = <T = void>({ data, format, ...w }: KindWidget<T, AssistsData>): Widget<T> =>
  ({
    ...w,
    source: data,
    head: (d: T, scope: WidgetScope) => format(d, scope)?.head ?? {},
    render: (d: T, scope: WidgetScope) => {
      const got = format(d, scope);
      if (!got?.items.length) return null;
      const { items, ...slots } = got;
      return draw(
        items.map((a): ViewBlock => ({ type: "custom", ...a })),
        slots,
      );
    },
  }) as Widget<T>;

/**
 * A screen's header from data (its eyebrow, heading, subtitle, tags, AI summary and actions): a
 * query and a formatter, as for a kind. No query: the formatter reads only who is looking. `rows`:
 * its height in tiles (2 by default). A page takes it as its `header`.
 */
export const header = <T = void>({
  data,
  format,
  rows,
}: {
  data?: Query<T>;
  format(data: T, scope: WidgetScope): ViewHeader;
  rows?: number;
}): WidgetHeader => ({ source: data, render: (d, scope) => format(d as T, scope), rows });
