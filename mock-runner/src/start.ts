/**
 * Starts the in-browser backend: registers the service worker (./mock/sw.ts, served as
 * `<base>cms-sw.js` by plugins/mock-backend.ts) and waits until it controls the page. After that,
 * plain `fetch("/api/…")` calls hit the mock exactly as they would hit a real Payload server.
 */

const BASE = import.meta.env.BASE_URL; // "/" or "/sub/path/"

let started: Promise<void> | undefined;

/** At most one update check per this long while navigating (a check is one small conditional request). */
const UPDATE_CHECK_INTERVAL = 30_000;

/**
 * A new deploy (or, in dev, a config / runtime edit) installs a new worker — the mock backend and
 * the offline copy. The app checks for one in the background as the user moves around — on every
 * navigation (in-app links and back/forward both fire `popstate`, at most every 30 s), when the
 * tab comes back into view, and now — and when the new worker takes over, the page reloads where
 * the user is, so page and backend always match the latest deploy.
 */
function keepUpToDate(registration: ServiceWorkerRegistration) {
  navigator.serviceWorker.addEventListener("controllerchange", () => location.reload(), { once: true });
  let last = 0;
  const check = () => {
    if (Date.now() - last < UPDATE_CHECK_INTERVAL) return;
    last = Date.now();
    void registration.update().catch(() => undefined); // offline: try again on a later navigation
  };
  check();
  window.addEventListener("popstate", check);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && check());
}

export function startMockBackend(): Promise<void> {
  started ??= (async () => {
    if (!("serviceWorker" in navigator)) throw new Error("This browser has no Service Worker support.");
    const url = `${BASE}cms-sw.js`;
    const registration = await navigator.serviceWorker.register(url, {
      scope: BASE,
      type: import.meta.env.DEV ? "module" : "classic",
      updateViaCache: "none",
    });
    if (!navigator.serviceWorker.controller) {
      const controlled = new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }),
      );
      // First visit: the worker claims the page when it activates. A hard reload ("Empty cache and
      // hard reload", Shift+reload) bypasses an already-active worker instead, and nothing would
      // claim the page: ask it to. If the page still isn't controlled after a few seconds, a normal
      // reload is (the browser hands normal loads to the active worker).
      const active = (await navigator.serviceWorker.ready).active;
      if (!navigator.serviceWorker.controller) active?.postMessage("claim");
      const timedOut = await Promise.race([
        controlled.then(() => false),
        new Promise<boolean>((resolve) => setTimeout(resolve, 4000, true)),
      ]);
      if (timedOut && !navigator.serviceWorker.controller) {
        location.reload();
        await new Promise(() => {}); // the page is going away
      }
    }
    keepUpToDate(registration);
  })();
  return started;
}
