import type { ReactiveController, ReactiveControllerHost } from "lit";

export interface Store<T extends object> {
  get(): T;
  set(patch: Partial<T> | ((state: T) => Partial<T>)): void;
  subscribe(listener: (state: T, previous: T) => void): () => void;
  reset(): void;
}

export interface StoreOptions<T> {
  persist?: string;
  persistKeys?: (keyof T)[];
}

const storage = (): Storage | undefined => {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
};

export function createStore<T extends object>(initial: T, options: StoreOptions<T> = {}): Store<T> {
  const { persist, persistKeys } = options;
  let state: T = { ...initial };
  if (persist) {
    try {
      const saved = storage()?.getItem(persist);
      if (saved) state = { ...state, ...(JSON.parse(saved) as Partial<T>) };
    } catch {}
  }
  const listeners = new Set<(state: T, previous: T) => void>();

  const save = () => {
    if (!persist) return;
    try {
      const out = persistKeys ? Object.fromEntries(persistKeys.map((k) => [k, state[k]])) : state;
      storage()?.setItem(persist, JSON.stringify(out));
    } catch {}
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
        } catch {}
      }
      for (const l of listeners) l(state, previous);
    },
  };
}

export class StoreController<T extends object, S = T> implements ReactiveController {
  #unsubscribe?: () => void;
  readonly host: ReactiveControllerHost;
  readonly store: Store<T>;
  readonly select: (state: T) => S;
  readonly #changed: (state: T, previous: T) => boolean;

  constructor(
    host: ReactiveControllerHost,
    store: Store<T>,
    select: (state: T) => S = (s) => s as unknown as S,
    only: { keys?: (keyof T)[]; changed?: (state: T, previous: T) => boolean } = {},
  ) {
    this.host = host;
    this.store = store;
    this.select = select;
    const { keys, changed } = only;
    this.#changed =
      changed ??
      (keys
        ? (s, p) => keys.some((k) => !Object.is(s[k], p[k]))
        : (s, p) => !Object.is(this.select(s), this.select(p)));
    host.addController(this);
  }

  get value(): S {
    return this.select(this.store.get());
  }

  hostConnected() {
    this.#unsubscribe = this.store.subscribe((state, previous) => {
      if (this.#changed(state, previous)) this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.#unsubscribe?.();
  }
}
