import { createStore } from "./store.ts";

/**
 * Frontend-only state (UI & session). Everything else is backend data — collections and globals
 * in src/cms (see STATE-AUDIT.md for the full mapping from the docs/ demo).
 */

export { createStore, StoreController, type Store } from "./store.ts";

/* ---------------------------------------------------------------- preferences (persisted) */

export type Theme = "system" | "light" | "dark";
export const preferences = createStore(
  {
    theme: "system" as Theme,
    /** App shell columns: navigation expanded (vs. rail) and side panel open. */
    navOpen: true,
    asideOpen: true,
    /** Side-panel sections that are collapsed, by id (everything else is open). */
    asideCollapsed: [] as string[],
    /** Collection tables: the columns someone hid or showed, by collection (absent: the defaults). */
    listColumns: {} as Record<string, string[]>,
    /** Collection lists shown as cards instead of a table, by collection. */
    listView: {} as Record<string, "table" | "cards">,
  },
  { persist: "gs:preferences" },
);

/* ---------------------------------------------------------------- demo session */

/** Demo-only controls: in production the role comes from `/api/users/me` and cases move through real stages. */
export type DemoPreset = "quote" | "won" | "delivery" | "settled";
export const session = createStore({
  /** "Viewing as" user id (demo role switcher); null = the logged-in user. */
  viewAs: null as string | null,
  /** Demo timeline position for the showcase case. */
  demoPreset: "quote" as DemoPreset,
});

/* ---------------------------------------------------------------- list filters (persisted) */

export type CaseScope = "all" | "mine" | "blocked" | "closed";
export type CaseType = "all" | "rfq" | "service" | "held";
export type SupplierFilter = "all" | "agency" | "local" | "own-stock" | "new";

export const filters = createStore(
  {
    cases: {
      view: "list" as "list" | "board",
      scope: "all" as CaseScope,
      wait: null as string | null,
      type: "all" as CaseType,
    },
    suppliers: "all" as SupplierFilter,
    coverage: "all" as string,
    managementPeriod: "12w" as "12w" | "month" | "quarter",
  },
  { persist: "gs:filters", persistKeys: ["cases", "suppliers", "managementPeriod"] },
);

/** Convenience updater for the nested case filters. */
export const setCaseFilters = (patch: Partial<ReturnType<typeof filters.get>["cases"]>) =>
  filters.set((s) => ({ cases: { ...s.cases, ...patch } }));

/* ---------------------------------------------------------------- inbox */

export interface ExtractionDraft {
  header: Record<string, [value: string, confidence: number]>;
  lines: unknown[][];
  missing: string[];
}
export const inbox = createStore({
  selectedId: null as string | null,
  /** AI drafts shown before the user confirms; confirming saves them on the intake-messages doc. */
  drafts: {} as Record<string, ExtractionDraft>,
});

/* ---------------------------------------------------------------- views & dialogs */

export type CaseTab =
  | "lines"
  | "sourcing"
  | "compare"
  | "pricing"
  | "quote"
  | "order"
  | "purchasing"
  | "delivery"
  | "billing"
  | "close"
  | "activity";

export const ui = createStore({
  caseTab: "lines" as CaseTab,
  settingsTab: "roles" as "roles" | "fx" | "pricing" | "templates" | "audit",
  /** Open dialog id (e.g. "reassign", "send-supplier-rfq") and its unsaved form draft. */
  dialog: null as null | { id: string; draft?: Record<string, unknown> },
  /** Cached AI daily-briefing text for this session. */
  briefing: null as string | null,
});

/* ---------------------------------------------------------------- notifications */

/** Unread notifications (approvals, exceptions, alerts), counted by the side panel; shown on the bell. */
export const notifications = createStore({ unread: 0 });

/* ---------------------------------------------------------------- command palette */

export const palette = createStore({ open: false, query: "", highlighted: 0 });
export const openPalette = (query = "") => palette.set({ open: true, query, highlighted: 0 });
export const closePalette = () => palette.set({ open: false });

/* ---------------------------------------------------------------- guided tours */

export const tour = createStore(
  {
    /** Id of the running guided tour (pages/dashboard/tours.ts), or null. */
    active: null as string | null,
    step: 0,
    /** Tours already shown (demo-script ticks). */
    completed: [] as string[],
  },
  { persist: "gs:tour", persistKeys: ["completed"] },
);
export const startTour = (id: string) => tour.set({ active: id, step: 0 });
export const endTour = (finished = false) =>
  tour.set((s) => ({
    active: null,
    step: 0,
    completed:
      finished && s.active != null && !s.completed.includes(s.active) ? [...s.completed, s.active] : s.completed,
  }));

/* ---------------------------------------------------------------- toasts */

export interface Toast {
  id: number;
  message: string;
  tone?: "info" | "success" | "warning" | "error";
}
export const toasts = createStore({ items: [] as Toast[] });
let nextToast = 1;
export function toast(message: string, tone: Toast["tone"] = "success", ms = 4500): number {
  const id = nextToast++;
  toasts.set((s) => ({ items: [...s.items, { id, message, tone }] }));
  if (ms > 0) setTimeout(() => dismissToast(id), ms);
  return id;
}
export const dismissToast = (id: number) => toasts.set((s) => ({ items: s.items.filter((t) => t.id !== id) }));

/* ---------------------------------------------------------------- bookmarks */

/** The signed-in user's bookmarks: a cache of their `bookmarks` documents (loaded per user, see pages/dashboard/shared.ts). */
export interface Bookmark {
  id?: string;
  href: string;
  label: string;
}
export const bookmarks = createStore({ items: [] as Bookmark[] });
export const isBookmarked = (href: string) => bookmarks.get().items.some((b) => b.href === href);
