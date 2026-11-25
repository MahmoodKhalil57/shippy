import { createStore } from "./store.ts";

export { createStore, StoreController, type Store } from "./store.ts";

export type Theme = "system" | "light" | "dark";
export const preferences = createStore(
  {
    theme: "system" as Theme,
    navOpen: false,
    asideOpen: false,
    navExpanded: null as boolean | null,
    asideCollapsed: [] as string[],
    listColumns: {} as Record<string, string[]>,
    listColumnOrder: {} as Record<string, string[]>,
    listColumnWidths: {} as Record<string, Record<string, number>>,
    listDensity: "0" as "0" | "-1" | "-2",
    listView: {} as Record<
      string,
      | "table"
      | "cards"
      | "list"
      | "compact"
      | "focus"
      | "groups"
      | "board"
      | "calendar"
      | "timeline"
      | "heatmap"
      | "chart"
      | "ranking"
      | "treemap"
      | "scatter"
    >,
    boards: {} as Record<
      string,
      {
        order?: string[];
        sizes?: Record<string, "s" | "m" | "l" | "full">;
        widths?: Record<string, number>;
        rows?: Record<string, number>;
        pins?: Record<string, number | { lane: number; row: number }>;
        lanes?: number;
        hidden?: string[];
        added?: { view: string; key: string; item?: string }[];
      }
    >,
  },
  { persist: "saastemly:preferences" },
);

export const notifications = createStore({ unread: 0 });

export const palette = createStore({ open: false, query: "", highlighted: 0 });
export const openPalette = (query = "") => palette.set({ open: true, query, highlighted: 0 });
export const closePalette = () => palette.set({ open: false });

export const tour = createStore(
  {
    active: null as string | null,
    step: 0,
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

export interface Bookmark {
  id?: string;
  href: string;
  label: string;
}
export const bookmarks = createStore({ items: [] as Bookmark[] });
export const isBookmarked = (href: string) => bookmarks.get().items.some((b) => b.href === href);
