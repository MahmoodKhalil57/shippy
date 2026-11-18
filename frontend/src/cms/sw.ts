import config from "./config.ts";
import { Engine } from "./runtime/engine.ts";
import { RestApi } from "./runtime/rest.ts";
import { seedsFromGlob } from "./runtime/seed.ts";
import { IndexedDbStore } from "./runtime/store.ts";

/**
 * The mock backend's Service Worker: answers `<base>api/*` with Payload's REST
 * API (from IndexedDB) and serves the dashboard (index.html) for page loads of
 * its routes, e.g. `<base>collections/cases/123`.
 * Registered by src/cms/client.ts; built/served as `<base>cms-sw.js` by
 * plugins/mock-backend.ts.
 *
 * Offline (the installable app, public/manifest.webmanifest): in the build, the plugin writes the
 * list of built files into `__PRECACHE__`. Installing caches them all (the app shell: index.html,
 * scripts, styles, icons, picker thumbnails), so once the app has loaded it works without a
 * network; the data is already local (IndexedDB). The full-size background photos are fetched in
 * the background after activation, and anything else the page loads is cached when first used.
 * A new deploy changes the list's version, so the worker updates and drops the old caches.
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
};

const base = new URL(self.registration.scope).pathname; // e.g. "/" or "/mock/"
const apiRoute = `${base}api`;

const seeds = seedsFromGlob(import.meta.glob("./seed/**/*.json", { eager: true }));
const api = new RestApi(new Engine(config, new IndexedDbStore(), { apiRoute }), seeds);

/** Written by plugins/mock-backend.ts in `vp build`: paths relative to the base. */
declare const __PRECACHE__: { version: string; core: string[]; later: string[] } | undefined;
const precache = typeof __PRECACHE__ === "undefined" ? null : __PRECACHE__;
const CACHE = precache ? `golden-sea-${precache.version}` : "";
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

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      if (precache) {
        for (const key of await caches.keys())
          if (key.startsWith("golden-sea-") && key !== CACHE) await caches.delete(key);
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

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname === apiRoute || url.pathname.startsWith(`${apiRoute}/`)) {
    event.respondWith(api.handle(event.request));
    return;
  }
  // Deep links into the dashboard (e.g. /collections/cases/123) load index.html.
  const isDashboardPage =
    event.request.mode === "navigate" && url.pathname.startsWith(base) && !/\.\w+$/.test(url.pathname);
  if (isDashboardPage) {
    event.respondWith(precache ? cached(new Request(shell)) : fetch(shell));
    return;
  }
  if (precache && event.request.method === "GET" && url.pathname.startsWith(base))
    event.respondWith(cached(event.request));
});
