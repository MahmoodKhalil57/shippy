import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * A minimal store for UI / session state (business data lives in the Payload backend — see STATE-AUDIT.md).
 *
 *   const filters = createStore({ view: "list" }, { persist: "gs:filters" });
 *   filters.set({ view: "board" });            // shallow merge
 *   filters.set((s) => ({ view: s.view === "list" ? "board" : "list" }));
 *   const off = filters.subscribe((s) => …);   // called on every change
 *
 * In Lit components: `#filters = new StoreController(this, filters)` → `this.#filters.value`.
 */
export interface Store<T extends object> {
  get(): T;
  set(patch: Partial<T> | ((state: T) => Partial<T>)): void;
  subscribe(listener: (state: T, previous: T) => void): () => void;
  reset(): void;
}

export interface StoreOptions<T> {
  /** localStorage key; when set, the state survives reloads. */
  persist?: string;
  /** Only these keys are persisted (default: all). */
  persistKeys?: (keyof T)[];
}

const storage = (): Storage | undefined => {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined; // private mode / blocked storage
  }
};

export function createStore<T extends object>(initial: T, options: StoreOptions<T> = {}): Store<T> {
  const { persist, persistKeys } = options;
  let state: T = { ...initial };
  if (persist) {
    try {
      const saved = storage()?.getItem(persist);
      if (saved) state = { ...state, ...(JSON.parse(saved) as Partial<T>) };
    } catch {
      /* corrupt or unavailable: start from the initial state */
    }
  }
  const listeners = new Set<(state: T, previous: T) => void>();

  const save = () => {
    if (!persist) return;
    try {
      const out = persistKeys ? Object.fromEntries(persistKeys.map((k) => [k, state[k]])) : state;
      storage()?.setItem(persist, JSON.stringify(out));
    } catch {
      /* quota / blocked: keep working in memory */
    }
  };

  return {
    get: () => state,
    set(patch) {
      const previous = state;
      const next = typeof patch === "function" ? patch(state) : patch;
      if (Object.entries(next).every(([k, v]) => Object.is(state[k as keyof T], v))) return;
      state = { ...state, ...next };
      save();
      for (const l of listeners) l(state, previous);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset() {
      const previous = state;
      state = { ...initial };
      if (persist) {
        try {
          storage()?.removeItem(persist);
        } catch {
          /* ignore */
        }
      }
      for (const l of listeners) l(state, previous);
    },
  };
}

/** Re-renders a Lit host whenever the store (or the selected slice) changes. */
export class StoreController<T extends object, S = T> implements ReactiveController {
  #unsubscribe?: () => void;
  readonly host: ReactiveControllerHost;
  readonly store: Store<T>;
  readonly select: (state: T) => S;

  constructor(host: ReactiveControllerHost, store: Store<T>, select: (state: T) => S = (s) => s as unknown as S) {
    this.host = host;
    this.store = store;
    this.select = select;
    host.addController(this);
  }

  get value(): S {
    return this.select(this.store.get());
  }

  hostConnected() {
    this.#unsubscribe = this.store.subscribe((state, previous) => {
      if (!Object.is(this.select(state), this.select(previous))) this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.#unsubscribe?.();
  }
}
