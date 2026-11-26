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

export type Query<T> = Source & { readonly __data?: T };

export type DataOf<Q> = Q extends Query<infer T> ? T : never;

type Find = Extract<Source, { find: string }>;
type Count = Extract<Source, { count: string }>;
type Doc = Extract<Source, { doc: true }>;
type Global = Extract<Source, { global: string }>;

export const query = {
  endpoint: <T>(endpoint: string, params?: Record<string, string>): Query<T> =>
    params ? { endpoint, query: params } : { endpoint },
  find: <T>(collection: string, options: Omit<Find, "find"> = {}): Query<{ docs: T[]; totalDocs: number }> => ({
    find: collection,
    ...options,
  }),
  count: (collection: string, options: Omit<Count, "count"> = {}): Query<{ totalDocs: number }> => ({
    count: collection,
    ...options,
  }),
  doc: <T>(options: Omit<Doc, "doc"> = {}): Query<T> => ({ doc: true, ...options }),
  global: <T>(slug: string, options: Omit<Global, "global"> = {}): Query<T> => ({ global: slug, ...options }),
  all: <Q extends Record<string, Query<unknown>>>(
    queries: Q,
  ): Query<{ [K in keyof Q]: Q[K] extends Query<infer T> ? T : never }> => ({ all: queries }),
};

export interface Slots {
  note?: string;
  tags?: Tag[];
  choice?: Omit<ViewBlocks["choice"], "type"> | Omit<ViewBlocks["choice"], "type">[];
  alerts?: Omit<ViewBlocks["alert"], "type">[];
  actions?: Action[];
  head?: WidgetHead;
}

export type KindData<K extends keyof ViewBlocks> = Omit<ViewBlocks[K], "type"> & Slots;

export type KindWidget<T, D> = Omit<WidgetBase<T>, "source" | "head"> & {
  data?: Query<T>;
  format(data: T, scope: WidgetScope): D | null | undefined;
};

export type KindEach<T, I, D> = Omit<WidgetBase<T>, "source" | "head" | "title" | "subhead" | "empty"> & {
  data?: Query<T>;
  tiles: EachSpec<T, I>["tiles"];
  empty: WidgetEmpty<T>;
  items(data: T, scope: WidgetScope): I[];
  key(item: I, index: number): string;
  title(item: I, index: number): string;
  subhead?(item: I, data: T, scope: WidgetScope): string;
  format(item: I, data: T, scope: WidgetScope): D | null | undefined;
};

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

function one(type: string, d: Slots & Record<string, unknown>): ViewBlock[] {
  const { note, tags, choice, alerts, actions, head, ...body } = d;
  return draw([{ type, ...body } as ViewBlock], { note, tags, choice, alerts, actions, head });
}

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
export const ring = kind("ring");
export const funnel = kind("funnel");
export const heatmap = kind("heatmap");
export const bullet = kind("bullet");
export const dial = kind("dial");
export const waffle = kind("waffle");
export const share = kind("share");
export const treemap = kind("treemap");
export const waterfall = kind("waterfall");
export const quadrant = kind("quadrant");
export const countdown = kind("countdown");
export const month = kind("month");
export const whatif = kind("whatif");
export const steps = kind("steps");
export const timeline = kind("timeline");
export const gantt = kind("gantt");
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
export const custom = kind("custom");

export type AssistsData = { items: Omit<ViewBlocks["custom"], "type">[] } & Slots;

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

export const header = <T = void>({
  data,
  format,
  rows,
}: {
  data?: Query<T>;
  format(data: T, scope: WidgetScope): ViewHeader;
  rows?: number;
}): WidgetHeader => ({ source: data, render: (d, scope) => format(d as T, scope), rows });
