import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { parse } from "qs-esm";
import * as builtIn from "../lib/agent/built-in-ai.ts";
import * as codex from "../lib/agent/codex.ts";
import * as identity from "../lib/agent/identity.ts";
import * as polyfill from "../lib/agent/ai-polyfill.ts";
import * as webmcp from "../lib/agent/webmcp.ts";
import { api, setBackendReady } from "../lib/api/client.ts";
import type { ApiError } from "../lib/api/errors.ts";
import type { MockConfig } from "../lib/contracts/config.ts";
import { memoryData, type MemoryData } from "../lib/dashboard/memory.ts";
import { bookmarks, notifications, palette, preferences, tour } from "../lib/stores/index.ts";
import { dashboardOf, memoryPlace, startDashboard } from "./index.ts";
import { loadGuide, loadTours, site } from "./site.ts";

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

const config = {
  collections: [
    { slug: "users", auth: true, admin: { useAsTitle: "name" }, fields: [{ name: "name", type: "text" }] },
    {
      slug: "deals",
      labels: { singular: { en: "Deal", ar: "صفقة" }, plural: { en: "Deals", ar: "صفقات" } },
      fields: [{ name: "title", type: "text", label: { en: "Title", ar: "العنوان" } }],
    },
  ],
  admin: { user: "users", meta: { titleSuffix: "· Atlas" } },
} as unknown as MockConfig;

const start = location.href;
const title = document.title;
const { lang, dir } = document.documentElement;

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  vi.stubGlobal("sessionStorage", new MemoryStorage());
});

afterEach(() => {
  history.replaceState(null, "", start);
  document.title = title;
  Object.assign(document.documentElement, { lang, dir });
  setBackendReady(Promise.resolve());
  for (const store of [preferences, notifications, palette, tour, bookmarks]) store.reset();
  vi.unstubAllGlobals();
});

describe("startDashboard", () => {
  it("wraps every dashboard app on the page in a provider, waits for the backend and starts each app", async () => {
    serve({ user: null, initialized: true });
    const hosts = [document.createElement("section"), document.createElement("section")];
    for (const host of hosts) {
      host.append(document.createElement("dashboard-app"));
      document.body.append(host);
    }
    let open!: () => void;
    const ready = new Promise<void>((resolve) => (open = resolve));
    document.documentElement.lang = "fr";
    document.documentElement.dir = "rtl";
    try {
      await startDashboard({ config, ready });
      expect([document.documentElement.lang, document.documentElement.dir]).toEqual(["en", "ltr"]);
      const providers = hosts.map((h) => h.firstElementChild as HTMLElementTagNameMap["dashboard-provider"]);
      expect(providers.map((p) => p.localName)).toEqual(["dashboard-provider", "dashboard-provider"]);
      expect(providers.map((p) => p.firstElementChild?.localName)).toEqual(["dashboard-app", "dashboard-app"]);
      expect(providers[0]!.dashboard).toBe(providers[1]!.dashboard);
      expect(providers[0]!.dashboard.project.config.collections[1]!.labels).toEqual({
        singular: "Deal",
        plural: "Deals",
      });
      expect(customElements.get("dashboard-app")).toBeDefined();
      await Promise.resolve();
      expect(urls).toEqual([]);
      open();
      await until(() => hosts.every((h) => !!h.querySelector("dashboard-login")) && document.title === "Login · Atlas");
      expect(location.pathname).toBe("/login");
      expect(urls.filter((u) => u.startsWith("/api/users/init"))).toHaveLength(2);
    } finally {
      for (const host of hosts) host.remove();
    }
  });
});

describe("dashboardOf", () => {
  it("builds a dashboard on the real API, the site, the shared stores and the agent modules", () => {
    const d = dashboardOf({
      config,
      seedUsers: [{ id: "u1", email: "ana@example.com", password: "x", role: "manager" }],
    });
    expect([d.project.base, d.project.apiRoute, d.project.userSlug]).toEqual(["", "/api", "users"]);
    expect(d.project.seedUsers.map((u) => u.email)).toEqual(["ana@example.com"]);
    expect(d.stores).toEqual({ preferences, notifications, palette, tour, bookmarks });
    expect(d.ai).toEqual({ builtIn, codex, identity, polyfill, webmcp });
    expect(d.site.branding).toBe(site().branding);
    expect(d.site.assistant).toBe(site().assistant);
    expect(d.site.tours).toBe(loadTours);
    expect(d.site.guide).toBe(loadGuide);
    for (const [name, call] of Object.entries(api))
      if (name !== "me") expect(d.data[name as keyof typeof api]).toBe(call);
  });

  it("reloads the site for the person who signs in", async () => {
    serve({
      user: { id: "u1", collection: "users", name: "Ana" },
      globals: { branding: { name: "Atlas CRM" } },
      docs: { tours: [] },
    });
    const d = dashboardOf({ config });
    await loadTours();
    expect(await d.data.me("users")).toEqual({ user: { id: "u1", collection: "users", name: "Ana" } });
    expect(d.site.branding.name).toBe("Atlas CRM");
    await loadTours();
    expect(urls.map((u) => u.split("?")[0])).toEqual([
      "/api/tours",
      "/api/users/me",
      "/api/globals/branding",
      "/api/globals/assistant",
      "/api/tours",
    ]);
  });

  it("navigates by pushing or replacing the address and telling the app", () => {
    const d = dashboardOf({ config });
    const heard: string[] = [];
    const listen = () => heard.push(location.pathname);
    window.addEventListener("popstate", listen);
    try {
      const length = history.length;
      d.navigate("/collections/deals");
      expect([location.pathname, history.length]).toEqual(["/collections/deals", length + 1]);
      d.navigate("/collections/deals/d1", true);
      expect([location.pathname, history.length]).toEqual(["/collections/deals/d1", length + 1]);
      expect(heard).toEqual(["/collections/deals", "/collections/deals/d1"]);
      expect(d.address()).toEqual({ pathname: "/collections/deals/d1", search: "" });
    } finally {
      window.removeEventListener("popstate", listen);
    }
  });

  it("reads, moves and goes back through the address source it is given", () => {
    const place = memoryPlace("/collections/deals?q=1");
    const d = dashboardOf({ config, place });
    const heard: string[] = [];
    const listen = () => heard.push(d.address().pathname);
    window.addEventListener("popstate", listen);
    try {
      const before = location.href;
      expect(d.address()).toEqual({ pathname: "/collections/deals", search: "?q=1" });
      d.navigate("/collections/deals/d1");
      d.back();
      expect(d.address()).toEqual({ pathname: "/collections/deals", search: "?q=1" });
      expect(heard).toEqual(["/collections/deals/d1", "/collections/deals"]);
      expect(location.href).toBe(before);
    } finally {
      window.removeEventListener("popstate", listen);
    }
  });

  it("shows notices in the page's snackbar with the tone it supports", () => {
    const d = dashboardOf({ config });
    expect(document.querySelector("ui-snackbar")).toBeNull();
    d.notify("Nobody is listening");
    const push = vi.fn();
    const element = document.createElement("ui-snackbar");
    Object.defineProperty(element, "push", { value: push });
    document.body.prepend(element);
    try {
      const action = { label: "Undo", onClick: () => undefined, undo: true };
      d.notify("Saved");
      d.notify("Deleted", "success", action);
      d.notify("Failed", "error");
      d.notify("Heads up", "info");
      d.notify("Careful", "warning");
      expect(push.mock.calls).toEqual([
        ["Saved", { tone: "success", action: undefined }],
        ["Deleted", { tone: "success", action }],
        ["Failed", { tone: "error", action: undefined }],
        ["Heads up", { tone: "neutral", action: undefined }],
        ["Careful", { tone: "neutral", action: undefined }],
      ]);
    } finally {
      element.remove();
    }
  });
});
