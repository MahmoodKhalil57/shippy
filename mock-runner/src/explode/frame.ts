import "saastemlycrm-design-system/styles.css";
import { startDashboard } from "saastemlycrm-design-system/app";
import config, { seedModules } from "virtual:mock-backend";
import { seedsFromGlob } from "../mock/runtime/seed.ts";
import { startMockBackend } from "../start.ts";
import { BLANK_ROUTE, FRAME_PATH, OPAQUE, frameSearch, renderKey, shellSettled } from "./pages.ts";

type DashboardConfig = Parameters<typeof startDashboard>[0]["config"];
type Person = { id: string; email: string; password: string; name?: string; initials?: string; role?: string };
type App = HTMLElement & { route?: unknown; updateComplete?: Promise<unknown> };

class ExplodeBlank extends HTMLElement {}
if (!customElements.get("explode-blank")) customElements.define("explode-blank", ExplodeBlank);

const BASE = import.meta.env.BASE_URL;
const ROOT = BASE.replace(/\/$/, "");
const project = config as unknown as DashboardConfig;
const userSlug = config.admin?.user ?? config.collections.find((c) => c.auth)?.slug ?? "users";
const people = (seedsFromGlob(seedModules).collections[userSlug] ?? []).filter(
  (u): u is Person => typeof u.email === "string" && typeof u.password === "string" && !!u.password,
);

const params = new URLSearchParams(location.search);
const wanted = params.get("as")?.toLowerCase();
const person =
  people.find((u) => wanted && (String(u.id).toLowerCase() === wanted || u.email.toLowerCase() === wanted)) ??
  people[0];

const pathOf = (route: string) => (route === "/" ? `${ROOT}/` : `${ROOT}${route}`);
const routeOf = () => {
  const path = decodeURI(location.pathname);
  const route = path.startsWith(ROOT) ? path.slice(ROOT.length) || "/" : path;
  return route.replace(/(.)\/$/, "$1") === BLANK_ROUTE ? BLANK_ROUTE : route;
};

const start = params.get("route");
if (start && start.startsWith("/") && start !== BLANK_ROUTE) history.replaceState(null, "", pathOf(start));

const blank: DashboardConfig = {
  ...project,
  admin: {
    ...project.admin,
    components: {
      ...project.admin?.components,
      views: {
        ...project.admin?.components?.views,
        "explode-blank": { path: `/${FRAME_PATH}`, Component: "explode-blank", meta: { title: "Blank" } },
      },
    },
  },
};

const auth = `${BASE}api/${userSlug}`;

async function signedIn(): Promise<string | null> {
  const response = await fetch(`${auth}/me`, { credentials: "same-origin" }).catch(() => null);
  if (!response?.ok) return null;
  const body = (await response.json().catch(() => null)) as { user?: { email?: unknown } | null } | null;
  const email = body?.user?.email;
  return typeof email === "string" ? email.toLowerCase() : null;
}

async function signIn() {
  await startMockBackend();
  if (!person) return;
  if ((await signedIn()) === person.email.toLowerCase()) return;
  await fetch(`${auth}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: person.email, password: person.password }),
  });
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const app = () => document.querySelector<App>("dashboard-app");

async function go(route: string) {
  const target = pathOf(route);
  if (decodeURI(location.pathname) === target || routeOf() === route) return;
  const shell = app();
  const before = shell?.route;
  history.pushState(null, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
  while (shell && shell.route === before) await nextFrame();
  await shell?.updateComplete;
}

const ready = signIn();

const moving = () =>
  document
    .getAnimations()
    .filter((a) => a.playState === "running" && a.effect?.getComputedTiming().endTime !== Infinity);

async function settle(): Promise<true> {
  await ready;
  for (;;) {
    while (!shellSettled()) await nextFrame();
    await nextFrame();
    await document.fonts.ready;
    await Promise.all(
      [...document.images].filter((i) => i.loading !== "lazy").map((i) => i.decode().catch(() => undefined)),
    );
    for (let running = moving(); running.length; running = moving()) {
      for (const animation of running) animation.finish();
      await nextFrame();
    }
    await nextFrame();
    await nextFrame();
    if (shellSettled()) return true;
  }
}

async function shot(route: string) {
  await go(route);
  await settle();
  return (await renderKey()) ?? OPAQUE;
}

window.explode = { ready, route: routeOf, go, settle, shot };

import.meta.hot?.on("vite:beforeFullReload", () => {
  history.replaceState(null, "", `${BASE}${FRAME_PATH}/${frameSearch(routeOf(), wanted)}`);
});

void startDashboard({ config: blank, seedUsers: people, ready });
