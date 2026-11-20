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
    /**
     * App shell columns as they are now: navigation expanded (vs. rail) and side panel open (vs.
     * its rail). `navOpen` mirrors the frame, which decides it from the window's room
     * (`<ui-app-shell>`); the side panel starts as it was left, where it fits beside the page.
     */
    navOpen: false,
    asideOpen: false,
    /**
     * What the person chose for the navigation: `true` expanded it beside the page, `false`
     * collapsed it to the rail, `null` nothing yet (expanded from an extra-large window, the rail below).
     */
    navExpanded: null as boolean | null,
    /** Side-panel sections that are collapsed, by id (everything else is open). */
    asideCollapsed: [] as string[],
    /** Collection tables: the columns someone hid or showed, by collection (absent: the defaults). */
    listColumns: {} as Record<string, string[]>,
    /** Collection tables: the column order someone dragged into place, by collection (keys). */
    listColumnOrder: {} as Record<string, string[]>,
    /** Collection tables: the widths someone set, by collection, then column key (px). */
    listColumnWidths: {} as Record<string, Record<string, number>>,
    /** Collection tables' row height (M3 density: 0 default, -1 compact, -2 dense), for every table. */
    listDensity: "0" as "0" | "-1" | "-2",
    /** Collection lists shown as cards instead of a table, by collection. */
    listView: {} as Record<string, "table" | "cards" | "board">,
    /**
     * Boards someone arranged, by screen (its path, a document's id as `:id`): their tiles' order
     * (keys, applied leniently), sizes and hidden tiles. The board's rules still place them.
     */
    boards: {} as Record<
      string,
      { order?: string[]; sizes?: Record<string, "s" | "m" | "l" | "full">; hidden?: string[] }
    >,
  },
  { persist: "saastemly:preferences" },
);

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
    /** Id of the running guided tour (src/cms/admin/tours.ts), or null. */
    active: null as string | null,
    step: 0,
    /** Tours already shown (demo-script ticks). */
    completed: [] as string[],
  },
  { persist: "saastemly:tour", persistKeys: ["completed"] },
);
export const startTour = (id: string) => tour.set({ active: id, step: 0 });
export const endTour = (finished = false) =>
  tour.set((s) => ({
    active: null,
    step: 0,
    completed:
      finished && s.active != null && !s.completed.includes(s.active) ? [...s.completed, s.active] : s.completed,
  }));

/* ---------------------------------------------------------------- bookmarks */

/** The signed-in user's bookmarks: a cache of their `bookmarks` documents (loaded per user, see src/app/shared.ts). */
export interface Bookmark {
  id?: string;
  href: string;
  label: string;
}
export const bookmarks = createStore({ items: [] as Bookmark[] });
export const isBookmarked = (href: string) => bookmarks.get().items.some((b) => b.href === href);
