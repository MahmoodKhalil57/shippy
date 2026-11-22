import type { CollectionConfig, Endpoint, GlobalConfig } from "payload";
import type { Action, NumberFormat } from "../app/widgets/schema.ts";
import type { Widget } from "../app/widgets/widget.ts";

/**
 * The mock backend's config: the parts of a Payload config that describe the
 * data model and API. Collections, globals and endpoints are real Payload
 * types, so they can be copied into a real `payload.config.ts` unchanged.
 */
export interface MockConfig {
  collections: CollectionConfig[];
  globals?: GlobalConfig[];
  endpoints?: Endpoint[];
  admin?: {
    /** Slug of the auth collection used to log into the dashboard (default: the first auth collection). */
    user?: string;
    meta?: { titleSuffix?: string };
    /**
     * Payload's custom admin views (`admin.components.views`): extra dashboard screens at
     * `path`, rendered by the custom element named in `Component` (Payload: a component path).
     * `nav` places a link in the navigation (Payload does this with `afterNavLinks`).
     */
    components?: { views?: Record<string, RootView> };
    /**
     * The project's own dashboard settings (Payload's `admin.custom`, free-form there): brand,
     * navigation groups, side-panel widgets, guided tours and the assistant's guide. The app
     * reads them; it holds no project content of its own.
     */
    custom?: DashboardSettings;
  };
  /** Signs auth tokens. Generated and kept in the browser when omitted. */
  secret?: string;
}

/** A custom root view (Payload `admin.components.views.<key>`). */
export interface RootView {
  /**
   * What renders the screen (Payload: the component's import path): a custom element's name, or
   * Payload's object form `{ path, clientProps }`. `widgets({ … })` (src/app/widgets/widget.ts)
   * gives `{ path: "app-widgets", clientProps: { page } }`, a screen of widgets.
   */
  Component: ViewComponent;
  /** URL path below the dashboard root, e.g. `/inbox`; a parameter takes a segment (`/cases/:id`, `$param.id`). */
  path: string;
  meta?: { title: string; description?: string };
  /**
   * Navigation link: its group (an `admin.group`) and label; `auto` for a view that is a collection's
   * or a global's page (its group, Configuration for a global, and its plural label).
   */
  nav?: { group: string; label: string } | "auto";
}

/** Payload's `PayloadComponent`: a path, or `{ path, clientProps }`. */
export type ViewComponent = string | { path: string; clientProps?: Record<string, unknown> };

export const defineConfig = (config: MockConfig): MockConfig => config;

/** A stored document. */
export type Doc = { id: string; [key: string]: unknown };

/** Payload's paginated response shape. */
export interface PaginatedDocs<T = Doc> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * A field as the runtime sees it: Payload's `Field` union, read loosely.
 * (The config is typed strictly by Payload's own types.)
 */
export interface FieldLike {
  type: string;
  name?: string;
  /** Payload's `virtual`: never stored, computed on read (an `afterRead` hook); shown, never queried. */
  virtual?: boolean;
  label?: unknown;
  required?: boolean;
  unique?: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  hasMany?: boolean;
  relationTo?: string | string[];
  /**
   * Payload's `filterOptions`: which choices a field offers (and accepts).
   * - relationship / upload: a `where` the related documents must match, or a function of
   *   `{ data, siblingData, id, relationTo, user, req }` returning `true` (all), `false` (none) or a `where`;
   * - select: a function of `{ data, siblingData, options, req }` returning the options to offer;
   * - blocks: a function of `{ data, siblingData }` returning the allowed block slugs, or `true`.
   */
  filterOptions?: Record<string, unknown> | ((args: Record<string, unknown>) => unknown);
  options?: (string | { label: unknown; value: string })[];
  /**
   * Payload's free-form `custom`. The dashboard reads `tones` (a select value's tag tone) and
   * `number` (how a number field reads: money in the currency held by `currencyField`, a share,
   * days…; `formats.money("currency")`).
   */
  custom?: {
    tones?: Record<string, OptionTone>;
    number?: FieldNumber;
    /**
     * The value's tone by its document: the first rule whose `when` (a `where`, matched on the
     * document as read) holds. For any field, not only selects: a number past a threshold, a late date.
     */
    toneWhen?: { when: Record<string, unknown>; tone: OptionTone }[];
    /** A number drawn as a bar under it: of `max` (a number, or the field holding it). */
    gauge?: { max: number | string };
    /** Its cell links here (`$row.<path>` filled from the document): a link that isn't the record. */
    href?: string;
    /** For an array field: what people can do to one of its rows (`$row.…` is the row, `$parent.…` the document). */
    actions?: CollectionAction[];
    [key: string]: unknown;
  };
  fields?: FieldLike[];
  tabs?: { name?: string; label?: unknown; fields: FieldLike[] }[];
  blocks?: { slug: string; labels?: { singular?: unknown; plural?: unknown }; fields: FieldLike[] }[];
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  minRows?: number;
  maxRows?: number;
  validate?: (value: unknown, options: Record<string, unknown>) => true | string | Promise<true | string>;
  hooks?: Partial<Record<"beforeValidate" | "beforeChange" | "afterChange" | "afterRead", FieldHook[]>>;
  access?: Partial<Record<"read" | "create" | "update", (args: Record<string, unknown>) => boolean | Promise<boolean>>>;
  admin?: {
    hidden?: boolean;
    readOnly?: boolean;
    position?: "sidebar";
    description?: unknown;
    placeholder?: unknown;
    condition?: (data: Record<string, unknown>, siblingData: Record<string, unknown>) => boolean;
    date?: {
      pickerAppearance?: "dayAndTime" | "dayOnly" | "timeOnly" | "monthOnly";
      minDate?: Date | string;
      maxDate?: Date | string;
    };
    /** number: the input's step. */
    step?: number;
    /** textarea: visible lines. */
    rows?: number;
    /** radio: options side by side (default) or stacked. */
    layout?: "horizontal" | "vertical";
    /** array / blocks / collapsible: start folded. */
    initCollapsed?: boolean;
    /** array / blocks: rows can be reordered (default true). */
    isSortable?: boolean;
    /** select / relationship: an ✕ to empty it (default: when not required). */
    isClearable?: boolean;
    /** relationship / join: offer creating a related document (default true). */
    allowCreate?: boolean;
    /** relationship: offer opening the related document (default true). */
    allowEdit?: boolean;
    /** The field's width, e.g. `"50%"`: side by side with others in a row, or alone. */
    width?: string;
    /** group: no box around its fields. */
    hideGutter?: boolean;
    /** join: the related documents' columns. */
    defaultColumns?: string[];
    [key: string]: unknown;
  };
}

export type FieldHook = (args: Record<string, unknown>) => unknown;

/* ---------------------------------------------------------------- dashboard settings (admin.custom) */

export type OptionTone = "neutral" | "primary" | "info" | "success" | "warning" | "error";

/** A select field's `custom.tones`: how each value reads as a tag ("Overdue": "error"). */
export const tones = (t: Record<string, OptionTone>) => ({ tones: t });

/**
 * How a number field reads, wherever it shows (a column, a figure, a chart): a `NumberFormat`,
 * whose money currency may come from another field of the same document (`currencyField`).
 */
export type FieldNumber = NumberFormat & { currencyField?: string };

/** A number field's `custom` for its format: `custom: formats.money("currency")`. */
export const formats = {
  /** Money in the currency held by the document's `field` (or a fixed code: `"USD"`). */
  money: (currency: string, f: Omit<NumberFormat, "unit" | "currency"> = {}) => ({
    number: /^[A-Z]{3}$/.test(currency)
      ? { unit: "money" as const, currency, ...f }
      : { unit: "money" as const, currencyField: currency, ...f },
  }),
  percent: (decimals = 1) => ({ number: { unit: "pct" as const, decimals } }),
  days: (decimals = 0) => ({ number: { unit: "days" as const, decimals } }),
};

/**
 * Something people can do to one document, declared once on its collection (`custom.actions`):
 * it shows on each of the collection's records that match `when` (and to the `roles` named),
 * wherever they appear (a table's last column, an entry's buttons). Strings in `call`, `confirm`,
 * `fields` and `done` may hold `$row.<field>` (a dotted path into the document): `$row.id`,
 * `$row.customer.name`. The endpoint it calls re-checks who may do what.
 */
export type CollectionAction = Action & {
  /** The documents it applies to (Payload's `where`, matched on the document as read). */
  when?: Record<string, unknown>;
  /**
   * One action per row of this array field (a dotted path: `matches`), `$item.<path>` and `$index`
   * filled from the row ("Link to GS-RFQ-0142 (78%)" per candidate). `itemWhen`: the rows it applies to.
   */
  each?: string;
  itemWhen?: Record<string, unknown>;
  /** Who sees it (user roles); everyone when left out. */
  roles?: string[];
};

/**
 * A collection's own dashboard settings (Payload's free-form collection `custom`).
 * - `list.board`: a select field to lay the list out as a board, one column per option.
 * - `list.cardFields`: the fields a card or board item shows under its title.
 * - `list.calendar`: a date field to lay the list out as a month calendar, a record on its day, and
 *   along a timeline and a heatmap of the days.
 * - `list.scatter`: two number fields to plot the records on (else the first two number fields).
 * - `list.status`, `list.figure`, `list.eyebrow`: the select field a card and a row show as their
 *   status (else the board's field, else the first toned select), the number they show large
 *   (else the first money field) and the field over their title (a reference, a type).
 * - `edit.steps`: a select field shown as steps above the form (`skip`: values that aren't
 *   steps, e.g. "Lost"; on one of those the steps show in the error tone).
 * - `edit.before`: widgets drawn above the form (src/app/widgets/widget.ts), about this document.
 */
export interface CollectionSettings {
  list?: {
    board?: string;
    cardFields?: string[];
    calendar?: string;
    scatter?: [string, string];
    status?: string;
    figure?: string;
    eyebrow?: string;
  };
  edit?: { steps?: { field: string; skip?: string[] }; before?: Widget[] };
  /** What people can do to one of its documents, shown wherever its records are (`CollectionAction`). */
  actions?: CollectionAction[];
}

export interface DashboardSettings {
  /**
   * Navigation groups (`admin.group` names) in order, with their icons; others follow. `section`
   * is the heading the group sits under in the expanded navigation (consecutive groups with the
   * same one share it).
   */
  nav?: { groups: { label: string; icon?: string; section?: string }[] };
  /**
   * The side panel's widgets, in its Widgets section: widgets like any screen's (the same kinds,
   * data widgets and figures; `visible` by role), drawn on a board of their own 4 tiles wide that
   * people arrange like a screen's. A `counts` item marked `tone: "warning"` also feeds the
   * navigation's attention badges.
   */
  aside?: Widget[];
  /**
   * The command palette's search: `synonyms` are groups of this business's words that mean
   * (roughly) the same thing (["vehicle", "car", "van"]), added to the generic thesaurus.
   */
  search?: { synonyms?: string[][] };
  /**
   * The project's own status words by tone, added to the generic ones the dashboard colours
   * statuses by ("on board": "info"). Checked before them, in the order neutral, error, warning,
   * info, success. A select field's `custom.tones` still wins.
   */
  statusWords?: Partial<Record<"neutral" | "error" | "warning" | "info" | "success", string[]>>;
  /**
   * The day it is, for relative dates in widget queries (`$today-30d`): an ISO date, for a demo
   * whose records are set at a fixed time. Left out, the real day.
   */
  today?: string;
}

/** What to spotlight: the smallest element matching `sel` (default: a card) whose text includes `text`. */
export interface TourTarget {
  text: string;
  sel?: string;
}

export interface TourStep {
  /** Sign in as this seeded user (id) before the step. */
  as?: string;
  /** Go to this dashboard path before the step. */
  go?: string;
  /** Open a side column first (its sections hold the target). */
  open?: "aside" | "nav";
  /** Click the button or link whose text includes this, then wait for the page to react. */
  click?: string;
  /** Milliseconds to wait after the click (default 900). */
  wait?: number;
  target?: TourTarget;
  title: string;
  body: string;
}

export interface Tour {
  id: string;
  title: string;
  /** One line under the title in the Tours section. */
  summary: string;
  steps: TourStep[];
}
