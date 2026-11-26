import type { CollectionConfig, Endpoint, GlobalConfig } from "payload";
import type { Action, NumberFormat } from "../widgets/schema.ts";
import type { Widget } from "../widgets/widget.ts";
import type { Localizable } from "../i18n/index.ts";

export interface MockConfig {
  collections: CollectionConfig[];
  globals?: GlobalConfig[];
  endpoints?: Endpoint[];
  admin?: {
    user?: string;
    meta?: { titleSuffix?: string };
    components?: { views?: Record<string, RootView> };
    custom?: DashboardSettings;
  };
  secret?: string;
  localization?: {
    locales: (string | { code: string; label?: unknown; rtl?: boolean })[];
    defaultLocale: string;
    fallback?: boolean;
  };
}

export interface RootView {
  Component: ViewComponent;
  path: string;
  meta?: { title: string; description?: string };
  nav?: { group: string; label: string } | "auto";
}

export type ViewComponent = string | { path: string; clientProps?: Record<string, unknown> };

export const defineConfig = (config: MockConfig): MockConfig => config;

export type Doc = { id: string; [key: string]: unknown };

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

export interface FieldLike {
  type: string;
  name?: string;
  virtual?: boolean;
  localized?: boolean;
  label?: unknown;
  required?: boolean;
  unique?: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  hasMany?: boolean;
  relationTo?: string | string[];
  filterOptions?: Record<string, unknown> | ((args: Record<string, unknown>) => unknown);
  options?: (string | { label: unknown; value: string })[];
  custom?: {
    tones?: Record<string, OptionTone>;
    number?: FieldNumber;
    toneWhen?: { when: Record<string, unknown>; tone: OptionTone }[];
    gauge?: { max: number | string };
    href?: string;
    actions?: CollectionAction[];
    about?: string;
    input?: import("./fields.ts").FieldInput;
    zod?: (base: import("zod").ZodType) => import("zod").ZodType;
    mock?: (faker: import("@faker-js/faker").Faker) => unknown;
    suffix?: string;
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
    step?: number;
    rows?: number;
    layout?: "horizontal" | "vertical";
    initCollapsed?: boolean;
    isSortable?: boolean;
    isClearable?: boolean;
    allowCreate?: boolean;
    allowEdit?: boolean;
    width?: string;
    hideGutter?: boolean;
    defaultColumns?: string[];
    [key: string]: unknown;
  };
}

export type FieldHook = (args: Record<string, unknown>) => unknown;

export type OptionTone = "neutral" | "primary" | "info" | "success" | "warning" | "error";

export const tones = (t: Record<string, OptionTone>) => ({ tones: t });

export type FieldNumber = NumberFormat & { currencyField?: string };

export const formats = {
  money: (currency: string, f: Omit<NumberFormat, "unit" | "currency"> = {}) => ({
    number: /^[A-Z]{3}$/.test(currency)
      ? { unit: "money" as const, currency, ...f }
      : { unit: "money" as const, currencyField: currency, ...f },
  }),
  percent: (decimals = 1) => ({ number: { unit: "pct" as const, decimals } }),
  days: (decimals = 0) => ({ number: { unit: "days" as const, decimals } }),
};

export type CollectionAction = Action & {
  when?: Record<string, unknown>;
  each?: string;
  itemWhen?: Record<string, unknown>;
  roles?: string[];
};

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
  actions?: CollectionAction[];
}

export interface DashboardSettings {
  nav?: { groups: { label: string; icon?: string; section?: string }[] };
  aside?: Widget[];
  search?: { synonyms?: string[][] };
  statusWords?: Partial<Record<"neutral" | "error" | "warning" | "info" | "success", string[]>>;
  today?: string;
}

export interface TourTarget {
  text: Localizable;
  sel?: string;
}

export interface TourStep {
  as?: string;
  go?: string;
  open?: "aside" | "nav";
  click?: Localizable;
  wait?: number;
  target?: TourTarget;
  title: string;
  body: string;
}

export interface Tour {
  id: string;
  title: string;
  summary: string;
  steps: TourStep[];
}
