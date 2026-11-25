import type { TileSize } from "../../components/base/board.ts";
import type { Query } from "./kinds.ts";
import type { Action, Stat, Tag, Tone, ViewBlock, ViewHeader } from "./schema.ts";
import { m } from "../../i18n/index.ts";

export type Source =
  | { endpoint: string; query?: Record<string, string> }
  | {
      find: string;
      where?: Record<string, unknown>;
      sort?: string;
      limit?: number;
      depth?: number;
      select?: Record<string, boolean>;
      joins?: Record<string, unknown>;
    }
  | { count: string; where?: Record<string, unknown> }
  | { doc: true; depth?: number; joins?: Record<string, unknown> }
  | { global: string; depth?: number }
  | { all: Record<string, Source> };

export interface WidgetScope {
  user: { id: string; role?: string; [key: string]: unknown };
  doc?: { id: string; slug: string };
  params: Record<string, string>;
}

export interface RecordsSpec {
  collection?: string;
  global?: string;
  field?: string;
  doc?: boolean;
  where?: Record<string, unknown>;
  sort?: string;
  limit?: number;
  columns: string[];
  supporting?: Record<string, string>;
  labels?: Record<string, string>;
  layout?: "table" | "list" | "entries" | "timeline";
  text?: string;
  facts?: string[];
  notes?: string;
  notice?: string;
  tags?: string[];
  dot?: string;
  select?: { param: string; value?: string };
  actions?: boolean;
  keep?: Record<string, unknown>;
  empty?: string;
  more?: boolean;
}

export interface MetricsSpec {
  collection: string;
  items: {
    label: string;
    where?: Record<string, unknown>;
    sum?: string;
    keep?: Record<string, unknown>;
    collection?: string;
    note?: string;
    tone?: Tone | { some: Tone; none: Tone };
    main?: boolean;
  }[];
}

export interface BreakdownSpec {
  collection: string;
  where?: Record<string, unknown>;
  by: string;
  bucket?: "day" | "week" | "month";
  stack?: string;
  sum?: string;
  chart?: "bars" | "line";
  as?: "chart" | "table" | "ring" | "share" | "treemap";
  top?: number;
  sort?: "value";
  keep?: Record<string, unknown>;
}

export type CountsSpec = {
  collection: string;
  layout?: "figures" | "list" | "funnel";
} & (
  | {
      field: string;
      skip?: string[];
    }
  | {
      items: { label: string; where: Record<string, unknown>; tone?: Tone; note?: string; collection?: string }[];
    }
);

export interface FieldsSpec {
  fields: string[];
  actions?: boolean;
  layout?: "stacked" | "inline";
}

export interface CollectionViewSpec {
  collection: string;
  key?: string;
  home?: boolean;
  where?: Record<string, unknown>;
  filters?: { field: string; operator: string; value: unknown }[];
  sort?: string;
  limit?: 10 | 25 | 50 | 100;
  layout?:
    | "table"
    | "cards"
    | "list"
    | "compact"
    | "focus"
    | "groups"
    | "board"
    | "calendar"
    | "timeline"
    | "heatmap"
    | "chart"
    | "ranking"
    | "treemap"
    | "scatter";
  chart?: { by?: string; bucket?: "day" | "week" | "month"; sum?: string; kind?: "bars" | "line"; days?: number };
  figure?: string;
  scatter?: {
    x?: string;
    y?: string;
    xMid?: number;
    yMid?: number;
    invertY?: boolean;
    quadrants?: [string, string, string, string];
  };
  columns?: string[];
  hide?: (
    | "header"
    | "all"
    | "search"
    | "filters"
    | "columns"
    | "layouts"
    | "export"
    | "pager"
    | "select"
    | "create"
    | "around"
  )[];
}

export interface DocumentViewSpec {
  collection: string;
  id: string;
  key?: string;
  home?: boolean;
  tab?: string;
  hide?: ("header" | "summary" | "tabs" | "around" | "sidebar" | "delete")[];
}

export interface GlobalViewSpec {
  global: string;
  key?: string;
  home?: boolean;
  tab?: string;
  hide?: ("header" | "summary" | "tabs" | "around")[];
}

export interface WidgetBase<T> {
  title?: string;
  subhead?: string;
  head?(data: T, scope: WidgetScope): WidgetHead;
  visible?: (scope: WidgetScope) => boolean;
  empty?: WidgetEmpty<T>;
  source?: Source;
  rows?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  minSize?: TileSize;
  maxSize?: TileSize;
  minRows?: number;
  maxRows?: number;
  skeleton?: "card" | "stats" | "table" | "list" | "chart" | "text" | "entries";
  denied?: string;
  size: TileSize;
  emphasis?: TileEmphasis;
}

export interface WidgetEmpty<T = unknown> {
  when?(data: T, scope: WidgetScope): boolean;
  heading: string;
  description?: string;
}

export type TileEmphasis = "inverse" | "tinted";

export interface WidgetHead {
  count?: number;
  countTone?: Tone;
  tags?: Tag[];
  actions?: Action[];
  subhead?: string;
}

export interface EachSpec<T, I = any> {
  tiles: number | ((scope: WidgetScope) => number);
  slots?(scope: WidgetScope): readonly string[];
  slotOf?(item: I, index: number): string;
  name?(slot: string, scope: WidgetScope): string;
  vacant?(slot: string, scope: WidgetScope): ViewBlock | ViewBlock[];
  items(data: T, scope: WidgetScope): I[];
  key(item: I, index: number): string;
  title(item: I, index: number): string;
  render(item: I, data: T, scope: WidgetScope): ViewBlock | ViewBlock[] | null | undefined;
  subhead?(item: I, data: T, scope: WidgetScope): string;
  head?(item: I, data: T, scope: WidgetScope): WidgetHead;
}

type NoBase = { [K in Exclude<keyof WidgetBase<unknown>, "visible">]?: never };

type Only<K extends string> = {
  [
    P in Exclude<
      | "render"
      | "records"
      | "counts"
      | "metrics"
      | "breakdown"
      | "fields"
      | "each"
      | "grid"
      | "split"
      | "collection"
      | "document"
      | "global"
      | "header",
      K
    >
  ]?: never;
};

export type Widget<T = unknown> =
  | (WidgetBase<T> &
      Only<"render"> & {
        render(data: T, scope: WidgetScope): ViewBlock | ViewBlock[] | null | undefined;
      })
  | (WidgetBase<T> & Only<"records"> & { records: RecordsSpec })
  | (WidgetBase<T> & Only<"counts"> & { counts: CountsSpec })
  | (WidgetBase<T> & Only<"metrics"> & { metrics: MetricsSpec })
  | (WidgetBase<T> & Only<"breakdown"> & { breakdown: BreakdownSpec })
  | (WidgetBase<T> & Only<"fields"> & { fields: FieldsSpec })
  | (WidgetBase<T> & Only<"each"> & { each: EachSpec<T> })
  | (WidgetBase<T> & Only<"collection"> & { collection: CollectionViewSpec })
  | (WidgetBase<T> & Only<"document"> & { document: DocumentViewSpec })
  | (WidgetBase<T> & Only<"global"> & { global: GlobalViewSpec })
  | (WidgetBase<T> & Only<"header"> & { header: WidgetHeader })
  | (NoBase & Only<"grid"> & { grid: Widget[]; visible?: (scope: WidgetScope) => boolean })
  | (NoBase & Only<"split"> & { split: { main: Widget[]; side: Widget[] }; visible?: (scope: WidgetScope) => boolean });

let today: string | undefined;
export const setToday = (iso: string | undefined) => (today = iso);
export const todayIso = () => (today ? new Date(today) : new Date()).toISOString().slice(0, 10);

function relativeDay(v: string): string | undefined {
  const m = /^\$today(?:([+-])(\d+)([dw]))?$/.exec(v);
  if (!m) return undefined;
  const base = today ? new Date(today) : new Date();
  const day = Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate());
  const n = m[1] ? Number(m[2]) * (m[3] === "w" ? 7 : 1) * (m[1] === "-" ? -1 : 1) : 0;
  return new Date(day + n * 86_400_000).toISOString();
}

export function fill<T>(value: T, scope: WidgetScope): T {
  const look = (path: string): unknown => {
    const [root, key] = path.split(".");
    if (root === "doc") return scope.doc?.[key as "id" | "slug"];
    if (root === "user") return scope.user[key!];
    if (root === "param") return scope.params[key!];
    return undefined;
  };
  const scalar = (x: unknown) => (typeof x === "string" || typeof x === "number" ? String(x) : "");
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") {
      const day = relativeDay(v);
      if (day) return day;
      const whole = /^\$((?:doc|user|param)\.[\w-]+)$/.exec(v);
      if (whole) return look(whole[1]!);
      return v.replace(/\$((?:doc|user|param)\.[\w-]+)/g, (_, p: string) => encodeURIComponent(scalar(look(p))));
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype)
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}

export type DrawingWidget<T = unknown> = Extract<Widget<T>, { render(data: T, scope: WidgetScope): unknown }>;

export type Figure<L extends string> = Stat & ({ key: L } | { label: L; key?: undefined });

export type FiguresSpec<T, L extends string = string> = Omit<
  WidgetBase<T>,
  "title" | "subhead" | "head" | "size" | "source" | "empty"
> & {
  size?: TileSize;
  data?: Query<T>;
  labels: readonly L[] | ((scope: WidgetScope) => readonly L[]);
  name?(key: L): string;
  format(data: T, scope: WidgetScope): Figure<L>[];
};

export function figures<T, L extends string = string>({
  format: of,
  data,
  labels,
  name,
  ...w
}: FiguresSpec<T, L>): Widget<T> {
  const words = (slot: string) => name?.(slot as L) ?? slot;
  const keyOf = (f: Stat & { key?: string }) => f.key ?? f.label;
  const named = (scope: WidgetScope) => (typeof labels === "function" ? labels(scope) : labels);
  const size = w.rows === 1 ? "sm" : "md";
  return {
    size: "s",
    width: 4,
    skeleton: "stats",
    ...w,
    source: data,
    each: {
      tiles: (scope: WidgetScope) => named(scope).length,
      slots: named,
      slotOf: (f: Stat & { key?: string }) => keyOf(f),
      name: words,
      vacant: (slot: string) => ({ type: "stats", size, items: [{ label: words(slot), value: "\u2014" }] }),
      items: (data: T, scope: WidgetScope) => of(data, scope),
      key: (f: Stat & { key?: string }, i: number) => keyOf(f) || String(i),
      title: () => "",
      render: (f: Stat) => ({ type: "stats", size, items: [f] }),
    },
  } as Widget<T>;
}

export type WidgetHeader =
  | ViewHeader
  | { source?: Source; render(data: unknown, scope: WidgetScope): ViewHeader; rows?: number };

export interface WidgetPage {
  header?: WidgetHeader;
  headerRows?: number;
  params?: Record<string, string>;
  widgets: Widget[];
}

export const widgets = (page: WidgetPage) => ({ path: "app-widgets", clientProps: { page } });

export interface PageView {
  Component: ReturnType<typeof widgets>;
  path: string;
  meta?: { title: string; description?: string };
  nav?: { group: string; label: string } | "auto";
}

export interface Around {
  before?: Widget[];
  after?: Widget[];
}

export const collectionPage = (
  collection: string,
  options: Omit<CollectionViewSpec, "collection"> &
    Around & { path?: string; nav?: PageView["nav"] | false; rows?: number } = {},
): PageView => {
  const { path, nav, before = [], after = [], rows, ...spec } = options;
  return {
    Component: widgets({
      widgets: [...before, { collection: { home: true, ...spec, collection }, size: "full", rows }, ...after],
    }),
    path: path ?? `/collections/${collection}`,
    ...(nav === false ? {} : { nav: nav ?? "auto" }),
  };
};

export const documentPage = (
  collection: string,
  options: Omit<DocumentViewSpec, "collection" | "id"> & Around & { path?: string } = {},
): PageView => {
  const { path, before = [], after = [], ...spec } = options;
  return {
    Component: widgets({
      widgets: [...before, { document: { home: true, ...spec, collection, id: "$param.id" }, size: "full" }, ...after],
    }),
    path: path ?? `/collections/${collection}/:id`,
  };
};

export const globalPage = (
  global: string,
  options: Omit<GlobalViewSpec, "global"> & Around & { path?: string; nav?: PageView["nav"] | false } = {},
): PageView => {
  const { path, nav, before = [], after = [], ...spec } = options;
  return {
    Component: widgets({ widgets: [...before, { global: { home: true, ...spec, global }, size: "full" }, ...after] }),
    path: path ?? `/globals/${global}`,
    ...(nav === false ? {} : { nav: nav ?? "auto" }),
  };
};

export const KEPT_LINE = "\u00a0";

export function eachSlots(w: Widget, scope: WidgetScope): string[] {
  const e = w.each;
  if (!e) return [];
  if (e.slots) return [...e.slots(scope)];
  const n = Math.max(1, Math.floor(typeof e.tiles === "function" ? e.tiles(scope) : e.tiles));
  return Array.from({ length: n }, (_, i) => String(i + 1));
}

export function eachTiles<T>(w: Widget<T>, data: T, scope: WidgetScope): { key: string; widget: DrawingWidget<T> }[] {
  const e = w.each;
  if (!e) return [];
  const slots = eachSlots(w as Widget, scope);
  const held: unknown[][] = slots.map(() => []);
  e.items(data, scope).forEach((item, i) => {
    const named = e.slotOf ? slots.indexOf(e.slotOf(item, i)) : -1;
    const at = e.slotOf ? (named >= 0 ? named : slots.length - 1) : Math.min(i, slots.length - 1);
    held[at]!.push(item);
  });
  const base = {
    size: w.size,
    rows: w.rows,
    width: w.width,
    minWidth: w.minWidth,
    maxWidth: w.maxWidth,
    minSize: w.minSize,
    maxSize: w.maxSize,
    minRows: w.minRows,
    maxRows: w.maxRows,
    emphasis: w.emphasis,
    skeleton: w.skeleton,
  };
  const blocks = (x: ViewBlock | ViewBlock[] | null | undefined): ViewBlock[] => (x ? [x].flat() : []);
  return slots.map((key, at) => {
    const items = held[at]!;
    const [first, ...more] = items;
    if (first === undefined) {
      const vacant = e.vacant?.(key, scope);
      if (vacant) return { key, widget: { ...base, title: "", render: () => vacant } as DrawingWidget<T> };
      const words: ViewBlock = {
        type: "empty",
        heading: w.empty?.heading ?? m.widget_empty(),
        description: w.empty?.description,
      };
      return {
        key,
        widget: {
          ...base,
          title: w.title ?? "",
          subhead: e.subhead ? KEPT_LINE : undefined,
          render: () => [words],
        } as DrawingWidget<T>,
      };
    }
    const index = (item: unknown) => items.indexOf(item);
    return {
      key,
      widget: {
        ...base,
        title: e.title(first, index(first)),
        subhead: e.subhead ? e.subhead(first, data, scope) || KEPT_LINE : undefined,
        head: e.head ? () => e.head!(first, data, scope) : undefined,
        render: () => [
          ...blocks(e.render(first, data, scope)),
          ...(more.length
            ? [
                {
                  type: "card",
                  heading: m.widget_more_heading({ count: more.length }),
                  blocks: more.flatMap((item, i): ViewBlock[] => [
                    ...(i ? [{ type: "divider" } as ViewBlock] : []),
                    { type: "heading", text: e.title(item, index(item)) },
                    ...blocks(e.render(item, data, scope)),
                  ]),
                } as ViewBlock,
              ]
            : []),
        ],
      } as DrawingWidget<T>,
    };
  });
}
