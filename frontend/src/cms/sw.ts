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
  skipWaiting(): Promise<void>;
  addEventListener(type: "install" | "activate", listener: (event: ExtendableEvent) => void): void;
  addEventListener(type: "fetch", listener: (event: FetchEvent) => void): void;
};

const base = new URL(self.registration.scope).pathname; // e.g. "/" or "/mock/"
const apiRoute = `${base}api`;

const seeds = seedsFromGlob(import.meta.glob("./seed/**/*.json", { eager: true }));
const api = new RestApi(new Engine(config, new IndexedDbStore(), { apiRoute }), seeds);

self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

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
  if (isDashboardPage) event.respondWith(fetch(`${base}index.html`));
});
