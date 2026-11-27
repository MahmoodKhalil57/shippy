import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { createStore, StoreController } from "./index.ts";

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

const broken = {
  getItem: () => {
    throw new DOMException("Denied", "SecurityError");
  },
  setItem: () => {
    throw new DOMException("Quota exceeded", "QuotaExceededError");
  },
  removeItem: () => {
    throw new DOMException("Denied", "SecurityError");
  },
};

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
});

afterEach(() => vi.unstubAllGlobals());

describe("createStore", () => {
  it("starts from a copy of its initial state", () => {
    const initial = { count: 0, label: "Deals" };
    const store = createStore(initial);
    expect(store.get()).toEqual(initial);
    expect(store.get()).not.toBe(initial);
  });

  it("merges a patch or the result of a function and tells every listener the new and previous state", () => {
    const store = createStore({ count: 0, label: "Deals" });
    const seen: [unknown, unknown][] = [];
    store.subscribe((state, previous) => seen.push([state, previous]));
    store.set({ count: 1 });
    store.set((s) => ({ count: s.count + 1, label: "Won deals" }));
    expect(store.get()).toEqual({ count: 2, label: "Won deals" });
    expect(seen).toEqual([
      [
        { count: 1, label: "Deals" },
        { count: 0, label: "Deals" },
      ],
      [
        { count: 2, label: "Won deals" },
        { count: 1, label: "Deals" },
      ],
    ]);
  });

  it("does nothing for a patch that changes no value", () => {
    const list = ["a"];
    const store = createStore({ count: 0, list, missing: NaN });
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.get();
    store.set({ count: 0, list, missing: NaN });
    store.set({});
    store.set(() => ({ count: 0 }));
    expect(store.get()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
    store.set({ list: ["a"] });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops telling a listener once it unsubscribes", () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    const stop = store.subscribe(listener);
    store.set({ count: 1 });
    stop();
    store.set({ count: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("resets to the initial state and tells listeners", () => {
    const store = createStore({ count: 0 });
    const seen: unknown[] = [];
    store.set({ count: 3 });
    store.subscribe((state, previous) => seen.push(state, previous));
    store.reset();
    expect(store.get()).toEqual({ count: 0 });
    expect(seen).toEqual([{ count: 0 }, { count: 3 }]);
  });

  it("never touches storage without a key", () => {
    const store = createStore({ count: 0 });
    store.set({ count: 1 });
    store.reset();
    expect(storage.items.size).toBe(0);
  });

  it("saves to storage and loads what it saved", () => {
    const store = createStore({ theme: "system", navOpen: false }, { persist: "test:prefs" });
    store.set({ theme: "dark" });
    expect(storage.items.get("test:prefs")).toBe('{"theme":"dark","navOpen":false}');
    const again = createStore({ theme: "system", navOpen: false, added: 1 }, { persist: "test:prefs" });
    expect(again.get()).toEqual({ theme: "dark", navOpen: false, added: 1 });
  });

  it("saves only the chosen keys", () => {
    const store = createStore(
      { active: null as string | null, completed: [] as string[] },
      {
        persist: "test:tour",
        persistKeys: ["completed"],
      },
    );
    store.set({ active: "intro", completed: ["basics"] });
    expect(storage.items.get("test:tour")).toBe('{"completed":["basics"]}');
  });

  it("removes what it saved when it resets", () => {
    const store = createStore({ count: 0 }, { persist: "test:count" });
    store.set({ count: 4 });
    store.reset();
    expect(storage.items.has("test:count")).toBe(false);
    expect(store.get()).toEqual({ count: 0 });
  });

  it("starts from its initial state when nothing or something unreadable was saved", () => {
    expect(createStore({ count: 0 }, { persist: "test:none" }).get()).toEqual({ count: 0 });
    storage.items.set("test:bad", "{not json");
    expect(createStore({ count: 0 }, { persist: "test:bad" }).get()).toEqual({ count: 0 });
    storage.items.set("test:empty", "");
    expect(createStore({ count: 0 }, { persist: "test:empty" }).get()).toEqual({ count: 0 });
  });

  it("keeps working in memory when storage refuses every call", () => {
    vi.stubGlobal("localStorage", broken);
    const store = createStore({ count: 0 }, { persist: "test:denied" });
    store.set({ count: 1 });
    expect(store.get()).toEqual({ count: 1 });
    store.reset();
    expect(store.get()).toEqual({ count: 0 });
  });

  it("keeps working in memory where there is no storage", () => {
    vi.stubGlobal("localStorage", undefined);
    const store = createStore({ count: 0 }, { persist: "test:absent" });
    store.set({ count: 1 });
    store.reset();
    expect(store.get()).toEqual({ count: 0 });
  });

  it("keeps working in memory when reading storage itself throws", () => {
    const own = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => {
        throw new DOMException("Denied", "SecurityError");
      },
    });
    try {
      const store = createStore({ count: 0 }, { persist: "test:sandboxed" });
      store.set({ count: 1 });
      store.reset();
      expect(store.get()).toEqual({ count: 0 });
    } finally {
      Object.defineProperty(window, "localStorage", own!);
    }
  });
});

class Host implements ReactiveControllerHost {
  controllers: ReactiveController[] = [];
  updates = 0;
  updateComplete = Promise.resolve(true);
  addController(c: ReactiveController) {
    this.controllers.push(c);
  }
  removeController(c: ReactiveController) {
    this.controllers = this.controllers.filter((x) => x !== c);
  }
  requestUpdate() {
    this.updates++;
  }
}

describe("StoreController", () => {
  const prefs = () => createStore({ theme: "system", navOpen: false, density: "0" });

  it("adds itself to its host and reads the whole state by default", () => {
    const host = new Host();
    const store = prefs();
    const c = new StoreController(host, store);
    expect(host.controllers).toEqual([c]);
    expect(c.value).toBe(store.get());
    c.hostConnected();
    store.set({ theme: "dark" });
    expect(host.updates).toBe(1);
    expect(c.value).toEqual({ theme: "dark", navOpen: false, density: "0" });
  });

  it("updates the host only when the selected value changes", () => {
    const host = new Host();
    const store = prefs();
    const c = new StoreController(host, store, (s) => s.theme);
    c.hostConnected();
    store.set({ navOpen: true });
    expect(host.updates).toBe(0);
    store.set({ theme: "light" });
    expect([host.updates, c.value]).toEqual([1, "light"]);
  });

  it("updates the host only when one of the watched keys changes", () => {
    const host = new Host();
    const store = prefs();
    const c = new StoreController(host, store, undefined, { keys: ["navOpen", "density"] });
    c.hostConnected();
    store.set({ theme: "dark" });
    expect(host.updates).toBe(0);
    store.set({ density: "-1" });
    store.set({ navOpen: true });
    expect(host.updates).toBe(2);
  });

  it("asks its own test whether the host should update", () => {
    const host = new Host();
    const store = prefs();
    const changed = vi.fn((s: { theme: string }, p: { theme: string }) => s.theme === "dark" && p.theme !== "dark");
    const c = new StoreController(host, store, (s) => s.theme, { changed, keys: ["navOpen"] });
    c.hostConnected();
    store.set({ navOpen: true });
    store.set({ theme: "dark" });
    expect(host.updates).toBe(1);
    expect(changed).toHaveBeenCalledTimes(2);
  });

  it("stops updating the host once it disconnects, and disconnecting first is harmless", () => {
    const host = new Host();
    const store = prefs();
    const c = new StoreController(host, store);
    c.hostDisconnected();
    c.hostConnected();
    c.hostDisconnected();
    store.set({ theme: "dark" });
    expect(host.updates).toBe(0);
  });
});
