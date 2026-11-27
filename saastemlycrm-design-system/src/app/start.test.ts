import { afterEach, expect, it, vi } from "vite-plus/test";
import { parse } from "qs-esm";
import type { ApiError } from "../lib/api/errors.ts";
import type { MockConfig } from "../lib/contracts/config.ts";
import { memoryData, type MemoryData } from "../lib/dashboard/memory.ts";
import { bookmarks, notifications, palette, preferences, tour } from "../lib/stores/index.ts";
import { startDashboard } from "./index.ts";

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

let urls: string[] = [];

function serve(seed: MemoryData) {
  const port = memoryData(seed);
  urls = [];
  vi.stubGlobal("fetch", async (url: string) => {
    urls.push(url);
    const { pathname, search } = new URL(url, location.origin);
    const path = pathname.replace(/^\/api/, "");
    const query = parse(search.slice(1)) as Record<string, string>;
    const [, first = "", second] = path.split("/");
    try {
      const body =
        first === "globals"
          ? await port.findGlobal(second!)
          : first === "access"
            ? await port.access()
            : second === "me"
              ? await port.me(first)
              : second === "init"
                ? await port.init(first)
                : await port.find(first, { limit: Number(query.limit), sort: query.sort });
      return Response.json(body);
    } catch (e) {
      const error = e as ApiError;
      return Response.json({ errors: error.errors }, { status: error.status });
    }
  });
}

const until = (done: () => boolean) =>
  new Promise<void>((resolve) => {
    if (done()) return resolve();
    const observer = new MutationObserver(() => {
      if (!done()) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(document, { childList: true, subtree: true, characterData: true, attributes: true });
  });

const start = location.href;
const title = document.title;
const { lang, dir } = document.documentElement;

afterEach(() => {
  history.replaceState(null, "", start);
  document.title = title;
  Object.assign(document.documentElement, { lang, dir });
  for (const store of [preferences, notifications, palette, tour, bookmarks]) store.reset();
  vi.unstubAllGlobals();
});

it("adds a dashboard app to a page that has none and sends a new project to create its first user", async () => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  vi.stubGlobal("sessionStorage", new MemoryStorage());
  serve({ user: null, initialized: false });
  const config: MockConfig = {
    collections: [{ slug: "users", auth: true, fields: [{ name: "email", type: "email" }] }],
    admin: { meta: { titleSuffix: "· Atlas" } },
  };
  expect(document.querySelector("dashboard-app")).toBeNull();
  await startDashboard({ config });
  const provider = document.body.lastElementChild as HTMLElementTagNameMap["dashboard-provider"];
  try {
    expect(provider.localName).toBe("dashboard-provider");
    expect(provider.dashboard.project.userSlug).toBe("users");
    expect([...provider.children].map((c) => c.localName)).toEqual(["dashboard-app"]);
    await until(() => !!provider.querySelector("dashboard-first-user"));
    expect(location.pathname).toBe("/create-first-user");
    expect(urls.map((u) => u.split("?")[0])).toEqual([
      "/api/users/me",
      "/api/globals/branding",
      "/api/globals/assistant",
      "/api/access",
      "/api/users/init",
    ]);
  } finally {
    provider.remove();
  }
});
