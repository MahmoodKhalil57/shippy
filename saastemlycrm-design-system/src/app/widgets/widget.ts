import type { Action, Tag, Tone, ViewBlock, ViewHeader } from "./schema.ts";

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

/** A collection's documents as a table or list, with no code: columns are field names. */
export interface RecordsSpec {
  collection: string;
  where?: Record<string, unknown>;
  sort?: string;
  limit?: number;
  /** Field names; the first links to the document. */
  columns: string[];
  /** A field shown as the second line under a column: `{ customer: "city" }`. */
  supporting?: Record<string, string>;
  layout?: "table" | "list";
  empty?: string;
  /** Add "All <plural>" to the card, linking to the list with the same `where`. */
  more?: boolean;
}

/** Counts of a collection's documents, each linking to the filtered list. */
export type CountsSpec = { collection: string } & (
  | /** One per value of a select field, in the value's tone. `skip` leaves values out. */ {
      field: string;
      skip?: string[];
      /** Hide values with no documents. */
      hideEmpty?: boolean;
    }
  | {
      /** Each a count of its own `where` (in its own `collection` if set), with an optional `note` under it. */
      items: { label: string; where: Record<string, unknown>; tone?: Tone; note?: string; collection?: string }[];
    }
);

/** The document's own fields as label / value pairs (an edit tab). */
export interface FieldsSpec {
  fields: string[];
  layout?: "stacked" | "inline";
}

/** What every widget that draws something can say about itself. */
interface WidgetBase<T> {
  /**
   * Card heading: the widget is a card (shown with its heading while it loads). When it draws an
   * `entries` block it is a section instead: the heading over the entries' own cards (set
   * `skeleton: "entries"` to load in that shape).
   */
  title?: string;
  subhead?: string;
  /** Tags, count and actions in the card's header, from the data. */
  head?(
    data: T,
    scope: WidgetScope,
  ): { count?: number; countTone?: Tone; tags?: Tag[]; actions?: Action[]; subhead?: string };
  /** Show it only when this says so (layout by role; the data's own access rules still apply). */
  visible?: (scope: WidgetScope) => boolean;
  /** Hide it once its data is in, when this says so (a section with nothing to show yet). */
  hidden?(data: T, scope: WidgetScope): boolean;
  /** Where its data comes from. */
  source?: Source;
  /** The skeleton's shape while loading. */
  skeleton?: "card" | "stats" | "table" | "list" | "chart" | "text" | "entries";
  /** Shown instead of hiding the widget when its data is refused (403). */
  denied?: string;
}

/** A layout widget draws nothing of its own: no heading, source or header. */
type NoBase = { [K in Exclude<keyof WidgetBase<unknown>, "visible">]?: never };

type Only<K extends string> = {
  [P in Exclude<"render" | "records" | "counts" | "fields" | "grid" | "split", K>]?: never;
};

/**
 * A widget is exactly one kind: it draws its data (`render`), is a no-code data widget
 * (`records`, `counts`, `fields`), or lays out other widgets (`grid`, `split`).
 */
export type Widget<T = unknown> =
  | (WidgetBase<T> &
      Only<"render"> & {
        /** What it shows, from its data (or from nothing, without a source). */
        render(data: T, scope: WidgetScope): ViewBlock | ViewBlock[] | null | undefined;
      })
  | (WidgetBase<T> & Only<"records"> & { records: RecordsSpec })
  | (WidgetBase<T> & Only<"counts"> & { counts: CountsSpec })
  | (WidgetBase<T> & Only<"fields"> & { fields: FieldsSpec })
  /** Children side by side, as many columns as fit. */
  | (NoBase & Only<"grid"> & { grid: Widget[]; visible?: (scope: WidgetScope) => boolean })
  /** A main column and a side column. */
  | (NoBase & Only<"split"> & { split: { main: Widget[]; side: Widget[] }; visible?: (scope: WidgetScope) => boolean });

/** `$doc.id`, `$user.role`, `$param.period` in a string: the whole value when it's only that, else spliced in. */
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
 * Widgets that share one source: `const on = from<Cash>({ endpoint: "/cash" })`, then
 * `on({ title, render })`. Each gets the source and stays typed by its data.
 */
export const from =
  <T>(source: Source) =>
  (w: Omit<DrawingWidget<T>, "source">): DrawingWidget<T> =>
    ({ ...w, source }) as DrawingWidget<T>;

/** The top of a root screen: fixed, or from data. */
export type WidgetHeader =
  | ViewHeader
  /** From data (`source`), or from who is looking (no source). */
  | { source?: Source; render(data: unknown, scope: WidgetScope): ViewHeader };

export interface WidgetPage {
  header?: WidgetHeader;
  /** Default values of the screen's parameters. */
  params?: Record<string, string>;
  widgets: Widget[];
}

/** A screen of widgets, in Payload's component form (`{ path, clientProps }`). */
export const widgets = (page: WidgetPage) => ({ path: "app-widgets", clientProps: { page } });

/** A widget, typed by its data: `widget<CaseProfit>({ source, render: (p) => … })`. */
export const widget = <T>(w: Widget<T>): Widget<T> => w;
