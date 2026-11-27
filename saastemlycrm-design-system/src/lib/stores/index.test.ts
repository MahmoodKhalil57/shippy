import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import {
  bookmarks,
  closePalette,
  createDashboardStores,
  endTour,
  isBookmarked,
  notifications,
  openPalette,
  palette,
  preferences,
  startTour,
  tour,
} from "./index.ts";

class MemoryStorage {
  items = new Map<string, string>();
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
});

afterEach(() => {
  for (const store of [preferences, notifications, palette, tour, bookmarks]) store.reset();
  vi.unstubAllGlobals();
});

describe("createDashboardStores", () => {
  it("starts every store from its defaults", () => {
    const stores = createDashboardStores({ persist: false });
    expect(stores.preferences.get()).toEqual({
      theme: "system",
      navOpen: false,
      asideOpen: false,
      navExpanded: null,
      asideCollapsed: [],
      listColumns: {},
      listColumnOrder: {},
      listColumnWidths: {},
      listDensity: "0",
      listView: {},
      boards: {},
    });
    expect(stores.notifications.get()).toEqual({ unread: 0 });
    expect(stores.palette.get()).toEqual({ open: false, query: "", highlighted: 0 });
    expect(stores.tour.get()).toEqual({ active: null, step: 0, completed: [] });
    expect(stores.bookmarks.get()).toEqual({ items: [] });
  });

  it("saves preferences and finished tours by default", () => {
    const stores = createDashboardStores();
    stores.preferences.set({ theme: "dark" });
    stores.tour.set({ active: "intro", completed: ["basics"] });
    stores.palette.set({ open: true });
    expect(JSON.parse(storage.items.get("saastemly:preferences")!)).toMatchObject({ theme: "dark" });
    expect(storage.items.get("saastemly:tour")).toBe('{"completed":["basics"]}');
    expect([...storage.items.keys()].sort()).toEqual(["saastemly:preferences", "saastemly:tour"]);
    expect(createDashboardStores().tour.get()).toEqual({ active: null, step: 0, completed: ["basics"] });
  });

  it("keeps everything in memory without persistence", () => {
    const stores = createDashboardStores({ persist: false });
    stores.preferences.set({ theme: "dark" });
    stores.tour.set({ completed: ["basics"] });
    expect(storage.items.size).toBe(0);
  });
});

describe("the dashboard's own stores", () => {
  it("opens the palette with or without a query and closes it", () => {
    palette.set({ highlighted: 3 });
    openPalette();
    expect(palette.get()).toEqual({ open: true, query: "", highlighted: 0 });
    openPalette("invoices");
    expect(palette.get()).toEqual({ open: true, query: "invoices", highlighted: 0 });
    closePalette();
    expect(palette.get()).toEqual({ open: false, query: "invoices", highlighted: 0 });
  });

  it("starts a tour from its first step", () => {
    tour.set({ step: 4 });
    startTour("intro");
    expect(tour.get()).toEqual({ active: "intro", step: 0, completed: [] });
  });

  it("marks a tour finished once, and only when it was finished", () => {
    startTour("intro");
    tour.set({ step: 2 });
    endTour();
    expect(tour.get()).toEqual({ active: null, step: 0, completed: [] });
    startTour("intro");
    endTour(true);
    expect(tour.get()).toEqual({ active: null, step: 0, completed: ["intro"] });
    startTour("intro");
    endTour(true);
    expect(tour.get().completed).toEqual(["intro"]);
    startTour("reports");
    endTour(true);
    expect(tour.get().completed).toEqual(["intro", "reports"]);
    endTour(true);
    expect(tour.get().completed).toEqual(["intro", "reports"]);
  });

  it("tells whether a page is bookmarked", () => {
    bookmarks.set({
      items: [
        { href: "/deals", label: "Deals" },
        { id: "b2", href: "/reports", label: "Reports" },
      ],
    });
    expect(isBookmarked("/deals")).toBe(true);
    expect(isBookmarked("/reports")).toBe(true);
    expect(isBookmarked("/tasks")).toBe(false);
  });
});
