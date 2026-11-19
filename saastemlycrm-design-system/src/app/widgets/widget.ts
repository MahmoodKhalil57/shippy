import type { Action, CardBlock, Tag, Tone, ViewBlock, ViewHeader } from "./schema.ts";

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

export interface Widget<T = unknown> {
  /** Card heading: the widget is a card (shown with its heading while it loads). */
  title?: string;
  subhead?: string;
  variant?: CardBlock["variant"];
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
  /** What it shows, from its data (or from nothing, without a source). */
  render?(data: T, scope: WidgetScope): ViewBlock | ViewBlock[] | null | undefined;
  /** Built-in data widgets. */
  records?: RecordsSpec;
  counts?: CountsSpec;
  fields?: FieldsSpec;
  /** Children side by side (as many columns as fit), or a main column and a side column. */
  grid?: Widget[];
  fit?: "xs" | "sm" | "md" | "lg";
  split?: { main: Widget[]; side: Widget[] };
  /** The skeleton's shape while loading. */
  skeleton?: "card" | "stats" | "table" | "list" | "chart" | "text";
  /** Shown instead of hiding the widget when its data is refused (403). */
  denied?: string;
}

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
