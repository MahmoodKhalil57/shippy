const BASE = import.meta.env.BASE_URL;

let started: Promise<void> | undefined;

const UPDATE_CHECK_INTERVAL = 30_000;

function keepUpToDate(registration: ServiceWorkerRegistration) {
  navigator.serviceWorker.addEventListener("controllerchange", () => location.reload(), { once: true });
  let last = 0;
  const check = () => {
    if (Date.now() - last < UPDATE_CHECK_INTERVAL) return;
    last = Date.now();
    void registration.update().catch(() => undefined);
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
      const active = (await navigator.serviceWorker.ready).active;
      if (!navigator.serviceWorker.controller) active?.postMessage("claim");
      const timedOut = await Promise.race([
        controlled.then(() => false),
        new Promise<boolean>((resolve) => setTimeout(resolve, 4000, true)),
      ]);
      if (timedOut && !navigator.serviceWorker.controller) {
        location.reload();
        await new Promise(() => {});
      }
    }
    keepUpToDate(registration);
  })();
  return started;
}
