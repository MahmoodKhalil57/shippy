import type { CollectionConfig, Endpoint, GlobalConfig } from "payload";

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
   * What renders the view (Payload: the component's import path). A custom element's name, or
   * Payload's object form `{ path, clientProps }`: `{ path: "app-view", clientProps: { src: "/views/inbox" } }`
   * draws the `View` that endpoint returns (src/app/view).
   */
  Component: ViewComponent;
  /** URL path below the dashboard root, e.g. `/inbox`. */
  path: string;
  meta?: { title: string; description?: string };
  /** Navigation link: its group (an `admin.group`) and label. */
  nav?: { group: string; label: string };
}

/** Payload's `PayloadComponent`: a path, or `{ path, clientProps }`. */
export type ViewComponent = string | { path: string; clientProps?: Record<string, unknown> };

/** A screen drawn from a view endpoint (`src`, `:id` is the document's id in edit tabs). */
export const viewEndpoint = (src: string): ViewComponent => ({ path: "app-view", clientProps: { src } });

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
  /** Payload's free-form `custom`. The dashboard reads `tones`: a select value's tag tone. */
  custom?: { tones?: Record<string, OptionTone>; [key: string]: unknown };
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
 * A collection's own dashboard settings (Payload's free-form collection `custom`).
 * - `list.board`: a select field to lay the list out as a board, one column per option.
 * - `list.cardFields`: the fields a card or board item shows under its title.
 * - `edit.steps`: a select field shown as steps above the form (`skip`: values that aren't
 *   steps, e.g. "Lost"; on one of those the steps show in the error tone).
 * - `edit.summary`: a view endpoint (`/views/…/:id`) drawn above the form.
 */
export interface CollectionSettings {
  list?: { board?: string; cardFields?: string[] };
  edit?: { steps?: { field: string; skip?: string[] }; summary?: string };
}

export interface DashboardSettings {
  branding?: Branding;
  /** Navigation groups (`admin.group` names) in order, with their icons; others follow. */
  nav?: { groups: { label: string; icon?: string }[] };
  /** Notification kinds and their tag tone in the side panel ("Alert": "error"). */
  notificationTones?: Record<string, "neutral" | "info" | "success" | "warning" | "error">;
  /** Counters in the side panel for the signed-in user (`role`, `id`). */
  widgets?: (user: { id: string; role?: string }) => SideWidget[];
  tours?: Tour[];
  assistant?: AssistantSettings;
}

export interface Branding {
  name: string;
  /** An icon name from the registry (src/components/primitives/media/icon.ts). */
  icon?: string;
  /** "This Demo Powered by" line at the foot of the page. */
  poweredBy?: string;
  /** Background photos offered in the header: paths below the site root, without `.jpg`. */
  backgrounds?: { path: string; label: string }[];
  backgroundCredit?: string;
  /** One line on the login page under the title. */
  loginIntro?: string;
}

export interface SideWidget {
  label: string;
  /** What it counts, under the label. */
  hint?: string;
  slug: string;
  where: Record<string, unknown>;
  href?: string;
  /** Draw a non-zero count as needing attention. */
  alert?: boolean;
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

export interface AssistantSettings {
  /** The helper's name ("Golden Sea helper"). */
  name: string;
  /** What the business is, for on-device summaries and checks ("a ship chandler"). */
  business: string;
  /** How the platform works, in short sections a small model can look up and quote. */
  guide: { topic: string; keywords: string; text: string }[];
  /** What each role mostly does (the helper's sense of who it's talking to). */
  roles: Record<string, string>;
  /** POST endpoint answering business questions from the records: `{ question }` in, `{ answer, points, sources }` out. */
  ask?: string;
}
