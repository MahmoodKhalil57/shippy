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
  };
  /** Signs auth tokens. Generated and kept in the browser when omitted. */
  secret?: string;
}

/** A custom root view (Payload `admin.components.views.<key>`). */
export interface RootView {
  /** Custom element that renders the view (Payload: the component's import path). */
  Component: string;
  /** URL path below the dashboard root, e.g. `/inbox`. */
  path: string;
  meta?: { title: string; description?: string };
  /** Navigation link: its group (an `admin.group`) and label. */
  nav?: { group: string; label: string };
}

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
