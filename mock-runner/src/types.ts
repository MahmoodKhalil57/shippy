import type { CollectionConfig, Endpoint, GlobalConfig } from "payload";

/**
 * What the backend reads from a project's config: the parts of a Payload config that describe
 * the data model and the API, in Payload's own types. Any Payload config (and any dashboard's
 * config built on one) fits; the backend ignores everything else.
 */
export interface BackendConfig {
  collections: CollectionConfig[];
  globals?: GlobalConfig[];
  endpoints?: Endpoint[];
  admin?: {
    /** The auth collection people sign in with (default: the first auth collection). */
    user?: string;
  };
  /** Signs auth tokens. Generated and kept in the store when omitted. */
  secret?: string;
  /** Payload's `localization`: the locales a `localized` field holds a value in (./mock/runtime/locales.ts). */
  localization?: Localization;
}

/** Payload's `localization` config (the parts the engine reads). */
export interface Localization {
  locales: (string | { code: string; label?: unknown; rtl?: boolean })[];
  defaultLocale: string;
  /** Read a missing value from the default locale (default true). */
  fallback?: boolean;
}

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

export type FieldHook = (args: Record<string, unknown>) => unknown;

/** A field as the backend reads it: Payload's `Field` union, read loosely. */
export interface FieldLike {
  type: string;
  name?: string;
  /** Payload's `virtual`: never stored, filled in on read (an `afterRead` hook computes it). */
  virtual?: boolean;
  /** Payload's `localized`: one value per locale (`localization`). */
  localized?: boolean;
  label?: unknown;
  required?: boolean;
  unique?: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  hasMany?: boolean;
  relationTo?: string | string[];
  /** Payload's `filterOptions`: a `where` (or a function returning one, `true` or `false`), select options, block slugs. */
  filterOptions?: Record<string, unknown> | ((args: Record<string, unknown>) => unknown);
  options?: (string | { label: unknown; value: string })[];
  custom?: Record<string, unknown>;
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
  admin?: { [key: string]: unknown };
}
