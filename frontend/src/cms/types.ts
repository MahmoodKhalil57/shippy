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
  };
  /** Signs auth tokens. Generated and kept in the browser when omitted. */
  secret?: string;
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
    date?: { pickerAppearance?: string };
    [key: string]: unknown;
  };
}

export type FieldHook = (args: Record<string, unknown>) => unknown;
