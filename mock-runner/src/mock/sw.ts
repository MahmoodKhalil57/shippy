import config, { seedModules } from "virtual:mock-backend";
import { Engine } from "./runtime/engine.ts";
import { RestApi } from "./runtime/rest.ts";
import { seedsFromGlob } from "./runtime/seed.ts";
import { IndexedDbStore } from "./runtime/store.ts";

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

const base = new URL(self.registration.scope).pathname;
const apiRoute = `${base}api`;

const seeds = seedsFromGlob(seedModules);
const api = new RestApi(new Engine(config, new IndexedDbStore(), { apiRoute }), seeds);

declare const __PRECACHE__: { version: string; core: string[]; later: string[] } | undefined;
const precache = typeof __PRECACHE__ === "undefined" ? null : __PRECACHE__;
const CACHE = precache ? `mock-runner-${precache.version}` : "";
const shell = `${base}index.html`;

self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      if (precache) {
        const cache = await caches.open(CACHE);
        await cache.addAll(precache.core.map((f) => new Request(`${base}${f}`, { cache: "reload" })));
      }
      await self.skipWaiting();
    })(),
  ),
);

self.addEventListener("message", (event) => {
  if (event.data === "claim") event.waitUntil(self.clients.claim());
});

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      if (precache) {
        for (const key of await caches.keys())
          if (key.startsWith("mock-runner-") && key !== CACHE) await caches.delete(key);
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

async function cached(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") void cache.put(request, response.clone());
  return response;
}

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
  if (url.pathname === `${base}explode` || /^explode[/.]/.test(url.pathname.slice(base.length))) return;
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
