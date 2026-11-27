export interface Address {
  pathname: string;
  search: string;
}

export interface Place {
  address(): Address;
  go(path: string, replace: boolean): void;
  back(): void;
}

export interface MemoryPlace extends Place {
  reset(at: string): void;
}

export const browserPlace: Place = {
  address: () => ({ pathname: location.pathname, search: location.search }),
  go: (path, replace) => (replace ? history.replaceState(null, "", path) : history.pushState(null, "", path)),
  back: () => history.back(),
};

export function memoryPlace(at = "/"): MemoryPlace {
  let entries = [new URL(at, "http://localhost")];
  let index = 0;
  return {
    address: () => ({ pathname: entries[index]!.pathname, search: entries[index]!.search }),
    go: (path, replace) => {
      const next = new URL(path, entries[index]);
      if (replace) entries[index] = next;
      else entries = [...entries.slice(0, ++index), next];
    },
    back: () => {
      if (!index) return;
      index--;
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
    reset: (to) => {
      entries = [new URL(to, "http://localhost")];
      index = 0;
    },
  };
}
