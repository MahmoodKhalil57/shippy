import type { TileSize } from "../../components/base/board.ts";
import type { Query } from "./kinds.ts";
import type { Action, Stat, Tag, Tone, ViewBlock, ViewHeader } from "./schema.ts";
import { m } from "../../i18n/index.ts";

/**
 * Widgets: how a project describes its screens next to its collections and globals.
 *
 * A widget is a design-system block plus where its data comes from. It loads on its own, with a
 * skeleton until its data arrives, so one slow or refused query never blanks the page. The data
 * comes from Payload's own API as the signed-in user: a collection query (`find`, `count`), the
 * document being edited (`doc`), a global, or a data endpoint for aggregates (`endpoint`). Data
 * endpoints return data, never UI; `render` turns data into blocks (./schema.ts).
 *
 * Collections and documents need no code: `records`, `counts` and `fields` widgets take their
 * labels, formats and tones from the field config.
 *
 * Widgets are placed in Payload's component slots with `widgets({ … })`, which is Payload's own
 * `{ path, clientProps }` form: `admin.components.views.dashboard`, a root view, an edit tab
 * (`admin.components.views.edit.<tab>`), `beforeList` / `afterList`, a global's view.
 *
 * Everything here is pure: the config (and so these functions) also runs in the service worker,
 * so a `render` must not import UI code. It builds plain block objects.
 */

/** Where a widget's data comes from. Strings may hold `$doc.id`, `$doc.slug`, `$user.id`, `$user.role`, `$param.<name>`. */
export type Source =
  /** GET below /api (a data endpoint); `query` becomes the query string. */
  | { endpoint: string; query?: Record<string, string> }
  /** A collection's documents (Payload REST `find`). */
  | {
      find: string;
      where?: Record<string, unknown>;
      sort?: string;
      limit?: number;
      depth?: number;
      select?: Record<string, boolean>;
      joins?: Record<string, unknown>;
    }
  /** How many documents match. */
  | { count: string; where?: Record<string, unknown> }
  /** The document this screen is about (an edit tab). */
  | { doc: true; depth?: number; joins?: Record<string, unknown> }
  /** A global's values. */
  | { global: string; depth?: number }
  /** Several at once: the data is an object with the same keys. */
  | { all: Record<string, Source> };

/** Who is looking and at what: what `visible`, `render` and the placeholders can use. */
export interface WidgetScope {
  user: { id: string; role?: string; [key: string]: unknown };
  /** In an edit tab: the document. */
  doc?: { id: string; slug: string };
  /** The screen's parameters (`choice` blocks set them; they live in the URL). */
  params: Record<string, string>;
}

/**
 * A collection's documents as a table, a list or entries, with no code: what each value means comes
 * from the field config (labels, select tones, number formats: `custom.number`), and what people
 * can do to each document from the collection's `custom.actions` (a table's last column, an
 * entry's buttons). Columns are field names, or dotted paths into a related document
 * (`customer.contactRule`).
 */
export interface RecordsSpec {
  /** Whose documents: a collection's (with `doc: true` and `field`, the screen's document's array rows). */
  collection?: string;
  /** Or a global's array rows (`field`). */
  global?: string;
  /** The rows of an array field (a dotted path) of the screen's document (`doc: true`) or of the global. */
  field?: string;
  doc?: boolean;
  where?: Record<string, unknown>;
  sort?: string;
  limit?: number;
  /** Field names (or dotted paths into related documents); the first links to the document. */
  columns: string[];
  /** A field shown as the second line under a column: `{ customer: "city" }`. */
  supporting?: Record<string, string>;
  /** Column headings other than the fields' own labels: `{ "eInvoice.status": "E-invoice" }`. */
  labels?: Record<string, string>;
  /** `entries`: one entry per document, its title as the heading, the columns as its meta line,
   * its first toned select as its status, `text` (a field) under it, and its actions. */
  layout?: "table" | "list" | "entries" | "timeline";
  /** For `entries`: the field read as each entry's text. */
  text?: string;
  /** For `entries`: fields shown as label / value facts; a field of lines (an array of text, or text) as its quiet notes; a field as its notice (in the field's tone). */
  facts?: string[];
  notes?: string;
  notice?: string;
  /** For `list` and `entries`: fields shown as tags after it (each in its field's tone). */
  tags?: string[];
  /**
   * `timeline`: one entry per row, in order: the first column is its time, the second its heading,
   * `text` its text and `dot` (a field) its tone.
   */
  /** For `list` and `timeline`: a field whose tone is the item's dot. */
  dot?: string;
  /**
   * For `list`: picking an item sets the screen parameter `param` to its `value` field (`id` by
   * default): master–detail, a detail widget's query reads `$param.<param>`.
   */
  select?: { param: string; value?: string };
  /** Show the collection's actions on each document (default true). */
  actions?: boolean;
  /**
   * Only the documents that match this, checked on them as read: for virtual fields (computed on
   * read, so a query can't filter on them, as in Payload). Everything is fetched first.
   */
  keep?: Record<string, unknown>;
  empty?: string;
  /** Add "All <plural>" to the card, linking to the list with the same `where`. */
  more?: boolean;
}

/**
 * Figures from a collection, one tile each: how many documents match, or the sum of a number field
 * over them (read in the field's format: money in a fixed currency, a share, days). With no
 * `where`, all of them.
 */
export interface MetricsSpec {
  collection: string;
  items: {
    label: string;
    where?: Record<string, unknown>;
    /**
     * A number field to add up; left out, the count. Money in a document's own currency shows in
     * it when every document added up shares it.
     */
    sum?: string;
    /** Only documents matching this as read (virtual fields): see `RecordsSpec.keep`. */
    keep?: Record<string, unknown>;
    /** Another collection's, for this figure. */
    collection?: string;
    /** Under the figure; `$count` and `$sum` are its document count and its sum. */
    note?: string;
    /** Its tone, or one tone when there are some and another when there are none. */
    tone?: Tone | { some: Tone; none: Tone };
    /** The one the strip is about. */
    main?: boolean;
  }[];
}

/**
 * A chart of a collection's documents with no code: grouped by a field (a select's options in their
 * order, a relationship's titles, a date's day, week or month), counting them or adding up a number
 * field, one series per value of `stack` (stacked) or one series. Values read in the summed field's
 * format.
 */
export interface BreakdownSpec {
  collection: string;
  where?: Record<string, unknown>;
  /** The field (or dotted path) on the axis. */
  by: string;
  /** For a date `by`: its bucket. */
  bucket?: "day" | "week" | "month";
  /** A field whose values are the series (stacked). */
  stack?: string;
  /** A number field to add up; left out, the count. */
  sum?: string;
  chart?: "bars" | "line";
  /**
   * `table`: the same numbers as a table, one row per group, a column per series and a total.
   * `ring`: the groups as parts of a whole (a donut, `<ui-ring>`), each opening its documents; one
   * series only (no `stack`), up to six parts (more fold into "Other"). `share`: the same parts as
   * one 100% bar (a ring for a small tile). `treemap`: as rectangles sized by value (many groups).
   */
  as?: "chart" | "table" | "ring" | "share" | "treemap";
  /** The largest groups only, the rest left out (by value). */
  top?: number;
  /** `value`: the groups largest first, not in the field's own order. */
  sort?: "value";
  /**
   * Only the documents that match this, checked on them as read: for virtual fields (computed on
   * read, so a query can't filter on them, as in Payload). Everything is fetched first.
   */
  keep?: Record<string, unknown>;
}

/** Counts of a collection's documents, each linking to the filtered list. */
export type CountsSpec = {
  collection: string;
  /**
   * How a titled one draws its counts: `figures` (the default) a row of figures; `list` one row
   * each, the label and its note (wrapping) at the start and the count at the end, in its tone
   * only while there are any. A list reads well in a narrow column (a side panel). `funnel`: the counts as stages, in their
   * order, each a bar as long as its share of the first, with the share that went on between two
   * (`<ui-funnel>`).
   */
  layout?: "figures" | "list" | "funnel";
} & (
  | /** One per value of a select field, in the value's tone. `skip` leaves values out. */ {
      field: string;
      skip?: string[];
    }
  | {
      /** Each a count of its own `where` (in its own `collection` if set), with an optional `note` under it. */
      items: { label: string; where: Record<string, unknown>; tone?: Tone; note?: string; collection?: string }[];
    }
);

/** The document's own fields as label / value pairs (an edit tab). */
export interface FieldsSpec {
  /** Field names, or dotted paths through relationships and groups (`customer.contactRule`). */
  fields: string[];
  /** Show the document's actions (its collection's `custom.actions`) under them (default true). */
  actions?: boolean;
  layout?: "stacked" | "inline";
}

/**
 * Payload's collection, document and global views as widgets: a root view shows them where the
 * owner places them, as many as it likes (related collections on one page, one collection on
 * several pages, each set up its own way). Nothing gets a page of its own: a link to a collection,
 * a document or a global (`links()`) opens the root view that holds it (its home: the one marked
 * `home`, else the first in the config), and leads nowhere when none does.
 *
 * Each keeps its state in the URL under its `key` (`?cases[q]=…&cases[page]=2`), so a filtered
 * list can be bookmarked, shared and gone back to, with several on one page.
 *
 * Each is a tile like any other widget: `size` / `width` and `rows` are its target, `min…` /
 * `max…` the bounds someone may resize it to, its skeleton waits in that box, and what doesn't fit
 * fades behind "Show all" (12 tiles high by default; a list loads as a table, a form as a card).
 * The tile's heading is the widget's `title`, else the collection's plural, the record's title or
 * the global's name, with the list's count; `hide: ["header"]` makes it a bare tile. The widgets
 * around it (a collection's `beforeList` / `afterList`, a document's `custom.edit.before`) are
 * tiles of the same board beside it.
 */
export interface CollectionViewSpec {
  /** The collection's slug. */
  collection: string;
  /** Its name in the URL (`?<key>[q]=…`); the collection's slug by default. Unique on a page. */
  key?: string;
  /** Where `links().list` / `links().doc` for this collection land (else the first view that has it). */
  home?: boolean;
  /** Always applied, under whatever people search and filter (not shown as a filter they can remove). */
  where?: Record<string, unknown>;
  /** Filters it starts with (people can change or remove them): field, operator, value. */
  filters?: { field: string; operator: string; value: unknown }[];
  /** The order it starts in (`-updatedAt`). */
  sort?: string;
  /** Rows per page it starts with. */
  limit?: 10 | 25 | 50 | 100;
  /**
   * The layout it starts in (people can switch, unless `layouts` is hidden). Always: a table,
   * cards, rich rows (`list`), chips (`compact`) and one record at a time (`focus`). With a status
   * field: `groups`. With the collection's `custom.list.board`: a `board`. With its
   * `custom.list.calendar` date: a month `calendar`, a `timeline` and a `heatmap` of the days. With
   * a money field: a `ranking` and a `treemap`. With a date or a status (or `chart`): a `chart` of
   * how many records (or how much) per day, week, month or status. With two number fields: a `scatter`. A layout the
   * collection can't take falls back to the table.
   */
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
  /**
   * The `chart` layout's set-up: the field its bars are by (`by`: a date, bucketed by `bucket`; a
   * select, in its options' order; or a relationship), a number field to add up (`sum`; else it
   * counts), `kind: "line"` for a line, and for a date by day, `days`: that many days from today,
   * each shown, empty or not. Left out, it charts the records by their calendar date, else their
   * status.
   */
  chart?: { by?: string; bucket?: "day" | "week" | "month"; sum?: string; kind?: "bars" | "line"; days?: number };
  /**
   * The number its cards, rows, `ranking` and `treemap` show large (a field; else the collection's
   * `list.figure`, else its first money field): a supplier's on-time share, ranked.
   */
  figure?: string;
  /**
   * The `scatter` layout's set-up: its two number fields (`x`, `y`; else `list.scatter`, else the
   * first two), where it splits (`xMid`, `yMid`; else the medians), `invertY` for a measure where
   * less is better, and the corners' captions (top start, top end, bottom start, bottom end).
   */
  scatter?: {
    x?: string;
    y?: string;
    xMid?: number;
    yMid?: number;
    invertY?: boolean;
    quadrants?: [string, string, string, string];
  };
  /** The columns it starts with (field names; the title stays first). */
  columns?: string[];
  /** Parts to leave out: the header (the tile's heading), "All" (the link to the collection's own page), search, filters, the column picker, the layout switch, export, the pager, selection (and bulk delete), Create, the widgets around the list (`beforeList` / `afterList`). */
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

/** A document's form (and its tabs), or a new one's. */
export interface DocumentViewSpec {
  collection: string;
  /** Which document: `$param.id` (the root view's path `/cases/:id`), `$doc.id`, an id, or `create`. */
  id: string;
  /** Its name in the URL (`?<key>[tab]=…`); the collection's slug by default. */
  key?: string;
  /** Where `links().doc` for this collection lands (else the first view whose id is a `$param`). */
  home?: boolean;
  /** One of its edit tabs (`admin.components.views.edit.<key>`) to show, instead of the form. */
  tab?: string;
  /** Parts to leave out: the header (the tile's heading), its summary (`<ui-record-hero>`), its tabs, the widgets about it (`custom.edit.before`), its sidebar, Delete. */
  hide?: ("header" | "summary" | "tabs" | "around" | "sidebar" | "delete")[];
}

/** A global's form (and its tabs). */
export interface GlobalViewSpec {
  global: string;
  key?: string;
  /** Where `links().global` lands (else the first view that has it). */
  home?: boolean;
  tab?: string;
  hide?: ("header" | "summary" | "tabs" | "around")[];
}

/** What every widget that draws something can say about itself. */
export interface WidgetBase<T> {
  /**
   * Card heading: the widget is a card (shown with its heading while it loads). When it draws an
   * `entries` block it is a section instead: the heading over the entries' own cards (set
   * `skeleton: "entries"` to load in that shape).
   */
  title?: string;
  /**
   * The line under its title. One whose subhead comes from its data (`head`) declares one here: it
   * shows while the data loads, so the line is there from the first frame.
   */
  subhead?: string;
  /** Tags, count and actions in the card's header, from the data. */
  head?(data: T, scope: WidgetScope): WidgetHead;
  /** Show it only when this says so (layout by role; the data's own access rules still apply). */
  visible?: (scope: WidgetScope) => boolean;
  /**
   * What it shows when it has nothing to show, in its own box: a widget's box is decided before its
   * data (its size and `rows`), so the data never removes it, adds it or moves the tiles around it.
   * `when` says, once the data is in, that there is nothing (no warnings in this message); an
   * `each` widget's tile with no item says it too.
   */
  empty?: WidgetEmpty<T>;
  /** Where its data comes from. */
  source?: Source;
  /**
   * Its height in tiles (56px each at the default text size; Android's `targetCellHeight`): the box it
   * waits in while loading and shows its data in, so nothing moves when the data arrives. Left out,
   * its kind's (`skeleton`: text 2, figures 3, lists, charts and cards 8, tables and entries 10),
   * else its size's. What doesn't fit fades behind "Show all".
   */
  rows?: number;
  /**
   * Its width in tiles (53px each at the default text size), when a size (`s` 6, `m` 12, `l` 18,
   * `full` all) isn't what it needs. Never more than the board has.
   */
  width?: number;
  /** The fewest and most tiles across someone may resize it to. */
  minWidth?: number;
  maxWidth?: number;
  /**
   * The bounds someone may resize it to on their board (Android's `minResize…` / `maxResize…`):
   * widths as sizes, heights as tiles. Left out, its kind's (`skeleton`: `KIND_BOUNDS` in
   * src/components/base/board.ts), else any width and about half to twice its height.
   */
  minSize?: TileSize;
  maxSize?: TileSize;
  minRows?: number;
  maxRows?: number;
  /** The skeleton's shape while loading. */
  skeleton?: "card" | "stats" | "table" | "list" | "chart" | "text" | "entries";
  /** Shown instead of hiding the widget when its data is refused (403). */
  denied?: string;
  /**
   * How many lanes of the screen's board its tile takes: `s` 1, `m` 2, `l` 3, `full` all (never
   * more than the board has). Required: every widget is a sized tile (`tileSizeOf`, tile.ts, says
   * what its content usually needs).
   */
  size: TileSize;
  /**
   * A contrasting surface for the tile the screen is about (a titled widget only: a bare tile has
   * no surface). `inverse` is M3's inverse surface: dark in a light theme, a raised surface in a
   * dark one; one per screen, the design check reports a second (M3: one prominent item).
   * `tinted` is the primary container. Every block reads on both: the surface re-scopes the
   * colour roles for what's inside (src/styles/theme.css, "emphasis surfaces").
   */
  emphasis?: TileEmphasis;
}

/** A widget's empty state (`WidgetBase.empty`). */
export interface WidgetEmpty<T = unknown> {
  /** Whether, with this data, there is nothing to show. */
  when?(data: T, scope: WidgetScope): boolean;
  /** What it says then ("No warnings in this message."). */
  heading: string;
  description?: string;
}

/** The surface a tile can take to stand apart (`<ui-tile emphasis>`). */
export type TileEmphasis = "inverse" | "tinted";

/** A tile's header from the data: its count, tags and actions (and a subhead). */
export interface WidgetHead {
  count?: number;
  countTone?: Tone;
  tags?: Tag[];
  actions?: Action[];
  subhead?: string;
}

/**
 * One tile per item of the data (an offer comparison per requested line, a card per purchase
 * order), each the widget's `size`, titled by its item. How many tiles it takes is decided before
 * the data (`tiles`), so the board's arrangement never depends on it: the items fill the tiles in
 * order, items past the last tile are drawn in the last one, in one card ("2 more", behind its
 * "Show all"), and a tile with no item shows the widget's `empty` state.
 */
export interface EachSpec<T, I = any> {
  /** How many tiles it takes: fixed, or from who is looking (never from the data). */
  tiles: number | ((scope: WidgetScope) => number);
  /**
   * Named tiles instead of numbered ones (figures: their labels), from who is looking: each item
   * goes to the tile `slotOf` names, and one named by no tile goes to the last.
   */
  slots?(scope: WidgetScope): readonly string[];
  slotOf?(item: I, index: number): string;
  /** A tile's name in words, where its slot is a key (a figure's label in the interface's language). */
  name?(slot: string, scope: WidgetScope): string;
  /** What a named tile with no item draws (a figure's label with no value), else `empty`'s words. */
  vacant?(slot: string, scope: WidgetScope): ViewBlock | ViewBlock[];
  items(data: T, scope: WidgetScope): I[];
  /** Stays the same for the same item (its tile keeps its place and state). */
  key(item: I, index: number): string;
  title(item: I, index: number): string;
  render(item: I, data: T, scope: WidgetScope): ViewBlock | ViewBlock[] | null | undefined;
  subhead?(item: I, data: T, scope: WidgetScope): string;
  head?(item: I, data: T, scope: WidgetScope): WidgetHead;
}

/** A layout widget draws nothing of its own: no heading, source or header. */
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

/**
 * A widget is exactly one kind: it draws its data (`render`), draws one tile per item of it
 * (`each`), is a no-code data widget (`records`, `counts`, `fields`), or groups other widgets
 * (`grid`, `split`: the board flattens them into tiles). Small widgets after a tall one need no
 * grouping: the board puts them one under another beside it (`place`).
 */
export type Widget<T = unknown> =
  | (WidgetBase<T> &
      Only<"render"> & {
        /** What it shows, from its data (or from nothing, without a source). */
        render(data: T, scope: WidgetScope): ViewBlock | ViewBlock[] | null | undefined;
      })
  | (WidgetBase<T> & Only<"records"> & { records: RecordsSpec })
  | (WidgetBase<T> & Only<"counts"> & { counts: CountsSpec })
  | (WidgetBase<T> & Only<"metrics"> & { metrics: MetricsSpec })
  | (WidgetBase<T> & Only<"breakdown"> & { breakdown: BreakdownSpec })
  | (WidgetBase<T> & Only<"fields"> & { fields: FieldsSpec })
  | (WidgetBase<T> & Only<"each"> & { each: EachSpec<T> })
  /** A collection's list, with its search, filters, layouts and records opening in a sheet. */
  | (WidgetBase<T> & Only<"collection"> & { collection: CollectionViewSpec })
  /** A document's form, or a new one's. */
  | (WidgetBase<T> & Only<"document"> & { document: DocumentViewSpec })
  /** A global's form. */
  | (WidgetBase<T> & Only<"global"> & { global: GlobalViewSpec })
  /**
   * The screen's header (its eyebrow, title, subtitle, tags, AI summary and actions), fixed or from
   * data: a bare tile like any other widget, with its size, rows (2 by default) and bounds. A
   * screen's `header` is this widget, first and the board's width.
   */
  | (WidgetBase<T> & Only<"header"> & { header: WidgetHeader })
  /** Children side by side, as many columns as fit. */
  | (NoBase & Only<"grid"> & { grid: Widget[]; visible?: (scope: WidgetScope) => boolean })
  /** A main column and a side column. */
  | (NoBase & Only<"split"> & { split: { main: Widget[]; side: Widget[] }; visible?: (scope: WidgetScope) => boolean });

/**
 * `$doc.id`, `$user.role`, `$param.period` in a string: the whole value when it's only that, else
 * spliced in. `$today`, `$today-30d`, `$today+2w`: that day (`setToday`).
 */
/**
 * The day relative dates count from (`$today-30d`): the project's `admin.custom.today` (a demo set
 * at a fixed time, `setToday`), else the real day.
 */
let today: string | undefined;
export const setToday = (iso: string | undefined) => (today = iso);
/** The day it is for the dashboard (`setToday`'s, else the real day), as YYYY-MM-DD. */
export const todayIso = () => (today ? new Date(today) : new Date()).toISOString().slice(0, 10);

/** `$today`, `$today+7d`, `$today-30d`, `$today-2w`: midnight UTC of that day, as ISO. */
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

/** A widget that draws its data with `render`. */
export type DrawingWidget<T = unknown> = Extract<Widget<T>, { render(data: T, scope: WidgetScope): unknown }>;

/**
 * A figure under one of a `figures` widget's tiles (`labels`): its formatter returns these. Its
 * tile is its `key` when it has one (a stable id, its words in `label` in the interface's
 * language), else its `label`. Translated figures have keys: a tile keyed by its words would
 * lose its place on the board (its size, its spot) when the language changes.
 */
export type Figure<L extends string> = Stat & ({ key: L } | { label: L; key?: undefined });

/** A strip of figures from one source (`figures`). */
export type FiguresSpec<T, L extends string = string> = Omit<
  WidgetBase<T>,
  "title" | "subhead" | "head" | "size" | "source" | "empty"
> & {
  /** 6 tiles across by default (`s`), 4 tiles wide (`width`), 3 high (a figure's `stats` rows). */
  size?: TileSize;
  /** The query that feeds them. */
  data?: Query<T>;
  /**
   * The figures' tiles, in order: one each, its key on the board, decided before the data (fixed,
   * or from who is looking). A figure the data has no value for shows its name and "-". Keys are
   * the figures' `key`s when they have one (then `name` gives each key's words), else their labels.
   */
  labels: readonly L[] | ((scope: WidgetScope) => readonly L[]);
  /** A key's words (its label in the interface's language), when the figures have keys. */
  name?(key: L): string;
  /** The figures, each under one of `labels`. */
  format(data: T, scope: WidgetScope): Figure<L>[];
};

/**
 * Figures as widgets: one tile per figure, untitled (the figure is the card and carries its label),
 * each moved, resized and hidden on its own, rather than one widget holding a strip of them. They
 * share one source, so they cost one request. `main` on a figure tints it (the one the strip is
 * about).
 *
 * @example figures({ data: query.endpoint<Cash>("/cash"), format: (d) => [{ label: "Overdue", value: String(d.overdue), main: true }, …] })
 */
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
  // A tile one row high draws the figure on one line.
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

/** The top of a root screen: fixed, or from data. */
export type WidgetHeader =
  | ViewHeader
  /** From data (`source`), or from who is looking (no source). */
  | { source?: Source; render(data: unknown, scope: WidgetScope): ViewHeader; rows?: number };

export interface WidgetPage {
  /**
   * The screen's header: a `header` widget, the board's first and its full width (to place it
   * elsewhere, size it otherwise or bound it, put a `header` widget in `widgets` instead).
   */
  header?: WidgetHeader;
  /**
   * The header's height in tiles, the same box while it loads and once its words are in (default 2,
   * 112px: an eyebrow, a title, a subtitle and a line under them).
   */
  headerRows?: number;
  /** Default values of the screen's parameters. */
  params?: Record<string, string>;
  widgets: Widget[];
}

/** A screen of widgets, in Payload's component form (`{ path, clientProps }`). */
export const widgets = (page: WidgetPage) => ({ path: "app-widgets", clientProps: { page } });

/** A root view (Payload `admin.components.views.<key>`), as `collectionPage` and friends make it. */
export interface PageView {
  Component: ReturnType<typeof widgets>;
  path: string;
  meta?: { title: string; description?: string };
  /** `auto`: in the navigation under the collection's `admin.group` (a global's: Configuration), by its plural label. */
  nav?: { group: string; label: string } | "auto";
}

/**
 * Widgets on a collection's, a document's or a global's own page beside its main tile: `before` it
 * (figures, a breakdown, a chart about the records) and `after` it. A document page's widgets read
 * `$param.id` (the record on the page).
 */
export interface Around {
  before?: Widget[];
  after?: Widget[];
}

/**
 * A collection's own page: its list, the whole width, at `/collections/<slug>` (or `path`), its home, in the
 * navigation under its group. Everything a `CollectionViewSpec` says applies.
 */
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

/** A document's own page: its form at `/collections/<slug>/:id` (or `path`, with `:id`), the collection's documents' home. */
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

/** A global's own page: its form at `/globals/<slug>` (or `path`), in the navigation under Configuration. */
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

/** A subhead line kept with nothing in it (a no-break space): the line's height, no words. */
export const KEPT_LINE = "\u00a0";

/** An `each` widget's tiles, named, before its data: numbered ("1", "2"...) or its `slots`. */
export function eachSlots(w: Widget, scope: WidgetScope): string[] {
  const e = w.each;
  if (!e) return [];
  if (e.slots) return [...e.slots(scope)];
  const n = Math.max(1, Math.floor(typeof e.tiles === "function" ? e.tiles(scope) : e.tiles));
  return Array.from({ length: n }, (_, i) => String(i + 1));
}

/**
 * An `each` widget's tiles once its data is in: exactly its tiles (`eachSlots`), the same before
 * and after the data, each drawing its item; items past the last tile are drawn in the last one, a
 * tile with no item its empty state. The key is the tile's name, so it never depends on the data.
 * Pure, so the host, the agent tools and the design check expand it alike.
 */
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
    // Each item's tile takes the widget's size and bounds, and is arranged on its own.
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
      // Its empty state, which is its own heading (under the widget's title, if it has one).
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
          // Its subhead line kept, as its items' tiles have it (one line, decided before the data).
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
        // The items past the last tile: one card after the tile's own item, each item under its own
        // heading in it, so the tile holds one block more than its item whatever the data holds
        // (what doesn't fit is behind "Show all").
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
