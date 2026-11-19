import config, { seedModules } from "virtual:mock-backend";
import { Engine } from "./runtime/engine.ts";
import { RestApi } from "./runtime/rest.ts";
import { seedsFromGlob } from "./runtime/seed.ts";
import { IndexedDbStore } from "./runtime/store.ts";

/**
 * The mock backend's Service Worker: answers `<base>api/*` with Payload's REST
 * API (from IndexedDB) and serves the dashboard (index.html) for page loads of
 * its routes, e.g. `<base>collections/cases/123`.
 * Registered by src/mock/client.ts; built/served as `<base>cms-sw.js` by
 * plugins/mock-backend.ts.
 *
 * Offline: in the build, the plugin writes the
 * list of built files into `__PRECACHE__`. Installing caches them all (the app shell: index.html,
 * scripts, styles, icons, picker thumbnails), so once the app has loaded it works without a
 * network; the data is already local (IndexedDB). The full-size background photos are fetched in
 * the background after activation, and anything else the page loads is cached when first used.
 * The page (index.html) is network first, so a deploy shows on the next load without clearing
 * anything; a new deploy also changes the list's version, so the worker updates (the page reloads
 * once when it takes over, src/mock/client.ts) and drops the old caches.
 * In dev there is no precache (Vite serves modules live).
 */

// Minimal Service Worker types (the app's tsconfig uses the DOM lib, not WebWorker).
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}
interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Response | Promise<Response>): void;
}
declare const self: {
  registration: { scope: string };
  clients: { claim(): Promise<void> };
  location: Location;
  skipWaiting(): Promise<void>;
  addEventListener(type: "install" | "activate", listener: (event: ExtendableEvent) => void): void;
  addEventListener(type: "fetch", listener: (event: FetchEvent) => void): void;
  addEventListener(type: "message", listener: (event: ExtendableEvent & { data: unknown }) => void): void;
};

const base = new URL(self.registration.scope).pathname; // e.g. "/" or "/mock/"
const apiRoute = `${base}api`;

const seeds = seedsFromGlob(seedModules);
const api = new RestApi(new Engine(config, new IndexedDbStore(), { apiRoute }), seeds);

/** Written by plugins/mock-backend.ts in `vp build`: paths relative to the base. */
declare const __PRECACHE__: { version: string; core: string[]; later: string[] } | undefined;
const precache = typeof __PRECACHE__ === "undefined" ? null : __PRECACHE__;
const CACHE = precache ? `mock-runner-${precache.version}` : "";
const shell = `${base}index.html`;

self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      if (precache) {
        const cache = await caches.open(CACHE);
        // `reload`: straight from the network, never a stale HTTP-cache copy.
        await cache.addAll(precache.core.map((f) => new Request(`${base}${f}`, { cache: "reload" })));
      }
      await self.skipWaiting();
    })(),
  ),
);

// A page loaded with a hard reload ("Empty cache and hard reload", Shift+reload) starts without a
// controller even though this worker is active; it asks to be taken over (src/mock/client.ts).
self.addEventListener("message", (event) => {
  if (event.data === "claim") event.waitUntil(self.clients.claim());
});

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      if (precache) {
        for (const key of await caches.keys())
          if (key.startsWith("mock-runner-") && key !== CACHE) await caches.delete(key);
        // The big photos: not worth delaying the first load for, so after taking control.
        void caches.open(CACHE).then(async (cache) => {
          for (const f of precache.later) {
            const url = `${base}${f}`;
            if (!(await cache.match(url))) await cache.add(url).catch(() => undefined);
          }
        });
      }
      await self.clients.claim();
    })(),
  ),
);

/** Cache first (the files are versioned by the deploy), then the network, caching what it returns. */
async function cached(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE);
  // `ignoreVary`: module scripts send an Origin header the install-time requests did not.
  const hit = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") void cache.put(request, response.clone());
  return response;
}

/**
 * The page itself (index.html, for every dashboard URL): network first, so a deploy shows on the
 * next load — `no-cache` revalidates past the host's HTTP cache (GitHub Pages: 10 minutes). It
 * names the new hashed scripts, which `cached()` then fetches. Offline, or when the network takes
 * longer than a few seconds, the saved copy.
 */
async function fresh(): Promise<Response> {
  const cache = await caches.open(CACHE);
  const network = fetch(shell, { cache: "no-cache" }).then((response) => {
    if (response.ok) void cache.put(shell, response.clone());
    return response;
  });
  const saved = await cache.match(shell, { ignoreVary: true });
  if (!saved) return network;
  const slow = new Promise<undefined>((resolve) => setTimeout(resolve, 3000, undefined));
  return (await Promise.race([network.catch(() => undefined), slow])) ?? saved;
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname === apiRoute || url.pathname.startsWith(`${apiRoute}/`)) {
    event.respondWith(api.handle(event.request));
    return;
  }
  // Deep links into the dashboard (e.g. /collections/cases/123) load index.html.
  const isDashboardPage =
    event.request.mode === "navigate" &&
    url.pathname.startsWith(base) &&
    (!/\.\w+$/.test(url.pathname) || url.pathname === shell);
  if (isDashboardPage) {
    event.respondWith(precache ? fresh() : fetch(shell));
    return;
  }
  if (precache && event.request.method === "GET" && url.pathname.startsWith(base))
    event.respondWith(cached(event.request));
});
