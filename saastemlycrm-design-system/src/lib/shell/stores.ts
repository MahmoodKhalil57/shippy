import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { Bookmark } from "../stores/index.ts";
import type { Store } from "../stores/store.ts";
import { m } from "../i18n/index.ts";
import { text } from "../payload/util.ts";
import type { Dashboard } from "../dashboard/context.ts";

export class Watch<T extends object> implements ReactiveController {
  readonly #host: ReactiveControllerHost;
  readonly #pick: () => Store<T>;
  readonly #keys: (keyof T)[] | undefined;
  #store: Store<T> | undefined;
  #off = () => {};

  constructor(host: ReactiveControllerHost, pick: () => Store<T>, keys?: (keyof T)[]) {
    this.#host = host;
    this.#pick = pick;
    this.#keys = keys;
    host.addController(this);
  }

  get value(): T {
    return this.#pick().get();
  }

  hostConnected() {
    this.#bind();
  }

  hostUpdate() {
    this.#bind();
  }

  hostDisconnected() {
    this.#off();
    this.#store = undefined;
  }

  #bind() {
    const store = this.#pick();
    if (store === this.#store) return;
    this.#off();
    this.#store = store;
    const keys = this.#keys;
    this.#off = store.subscribe((state, previous) => {
      if (!keys || keys.some((k) => !Object.is(state[k], previous[k]))) this.#host.requestUpdate();
    });
  }
}

export const openPalette = (d: Dashboard) => d.stores.palette.set({ open: true, query: "", highlighted: 0 });
export const closePalette = (d: Dashboard) => d.stores.palette.set({ open: false });
export const startTour = (d: Dashboard, id: string) => d.stores.tour.set({ active: id, step: 0 });
export const endTour = (d: Dashboard, finished = false) =>
  d.stores.tour.set((s) => ({
    active: null,
    step: 0,
    completed:
      finished && s.active != null && !s.completed.includes(s.active) ? [...s.completed, s.active] : s.completed,
  }));

export const isBookmarked = (d: Dashboard, href: string) => d.stores.bookmarks.get().items.some((b) => b.href === href);

export async function loadBookmarks(d: Dashboard) {
  const { docs } = await d.data
    .find("bookmarks", { limit: 0, depth: 0, sort: "createdAt" })
    .catch(() => ({ docs: [] }));
  d.stores.bookmarks.set({
    items: docs.map((x) => ({ id: x.id, href: d.project.withBase(text(x.href)), label: text(x.label) })),
  });
}

export async function toggleBookmark(d: Dashboard, b: Bookmark) {
  const existing = d.stores.bookmarks.get().items.find((x) => x.href === b.href);
  try {
    if (existing?.id) await d.data.delete("bookmarks", existing.id);
    else await d.data.create("bookmarks", { href: b.href, label: b.label });
  } catch (e) {
    d.notify(m.shared_bookmarks_failed({ error: (e as Error).message }), "error");
  }
  await loadBookmarks(d);
}
