/// <reference path="../virtual.d.ts" />
import axe from "axe-core";
import { Engine, RestApi } from "mock-runner/server";
import { dashboardOf, memoryPlace } from "saastemlycrm-design-system/app";
import "saastemlycrm-design-system/styles.css";
import "saastemlycrm-design-system/src/components/shell/app.ts";
import "saastemlycrm-design-system/src/components/dashboard/dashboard-provider.ts";
import { localizeConfig } from "saastemlycrm-design-system/src/lib/i18n/index.ts";
import type { MockConfig } from "saastemlycrm-design-system/contracts";
import {
  frames,
  problems,
  settleAnimations,
  type Screen,
} from "saastemlycrm-design-system/src/lib/dashboard/tiling.ts";
import { seedUsers } from "virtual:test-runner/project";
import { page } from "vite-plus/test/browser";
import { SnapshotStore } from "../backend.ts";
import { describe, expect, it } from "vite-plus/test";
import { authCollection, people, project, seeds, type Person } from "../project.ts";
import { speak, type Direction } from "./language.ts";

export type { Direction };

const BUSY = "[aria-busy=true], ui-skeleton, ui-loading, ui-tile[loading]";
const PATIENCE_MS = 8000;
const BENIGN = /ResizeObserver loop completed with undelivered notifications/;

export interface Backend {
  store: SnapshotStore;
  api: RestApi;
}

export async function inPageBackend(): Promise<Backend> {
  const store = new SnapshotStore();
  const api = new RestApi(new Engine(project, store), seeds, { session: "store", tools: false });
  await api.ready();
  store.save();
  const real = globalThis.fetch;
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    return new URL(request.url).pathname.startsWith("/api") ? api.handle(request) : real(input, init);
  };
  return { store, api };
}

const routes = dashboardOf({ config: project as unknown as MockConfig }).project;

export function patternOf(href: string): string | null {
  const url = new URL(href, location.origin);
  const route = routes.parseRoute(url.pathname, "");
  if (route.name === "not-found") return null;
  if (route.name === "view") return `view ${route.key}`;
  if (route.name === "address")
    return url.pathname
      .split("/")
      .map((part, i) => (i >= 3 ? ":id" : part))
      .join("/");
  return route.name;
}

export async function quiet() {
  const until = performance.now() + PATIENCE_MS;
  let still = 0;
  while (still < 2) {
    if (performance.now() > until) return false;
    settleAnimations();
    await frames(1);
    still = document.querySelector("main") && !document.querySelector(BUSY) ? still + 1 : 0;
  }
  settleAnimations();
  await frames(1);
  return true;
}

const place = memoryPlace();

export const currentPath = () => {
  const { pathname, search } = place.address();
  return pathname + search;
};

function go(href: string) {
  place.go(href, false);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export async function signInAs(person: Person, dir: Direction) {
  localStorage.clear();
  speak(dir);
  await fetch(`/api/${authCollection().slug}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: person.email, password: person.password }),
  });
  for (const old of document.querySelectorAll("dashboard-provider")) old.remove();
  place.reset("/");
  const dashboard = dashboardOf({
    config: localizeConfig(project as unknown as MockConfig),
    seedUsers: seedUsers as never,
    place,
  });
  const provider = document.createElement("dashboard-provider");
  provider.dashboard = dashboard;
  provider.append(document.createElement("dashboard-app"));
  document.body.append(provider);
  return dashboard;
}

const links = () =>
  [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
    .map((a) => new URL(a.href, location.origin))
    .filter((u) => u.origin === location.origin && !u.pathname.startsWith("/api") && !/\.\w+$/.test(u.pathname))
    .map((u) => u.pathname + u.search);

export async function visitAll(backend: Backend, person: Person, screen: Screen, dir: Direction): Promise<string[]> {
  backend.store.restore();
  await page.viewport(screen.width, screen.height);
  const errors: string[] = [];
  const keep = console.error;
  console.error = (...args: unknown[]) => errors.push(args.map(String).join(" "));
  const crash = (e: ErrorEvent | PromiseRejectionEvent) => errors.push(String("reason" in e ? e.reason : e.message));
  addEventListener("error", crash);
  addEventListener("unhandledrejection", crash);
  const found: string[] = [];
  try {
    await signInAs(person, dir);
    const seen = new Set<string>(["dashboard"]);
    const queue = ["/"];
    for (let href = queue.shift(); href !== undefined; href = queue.shift()) {
      go(href);
      const at = `${href}`;
      if (!(await quiet())) found.push(`${at}: still loading after ${PATIENCE_MS / 1000} s`);
      found.push(...problems(document.body).map((p) => `${at}: ${p}`));
      const a11y = await axe.run(document, { resultTypes: ["violations"] });
      found.push(...a11y.violations.map((v) => `${at}: axe ${v.id} on ${v.nodes.length} element(s)`));
      found.push(
        ...errors
          .splice(0)
          .filter((e) => !BENIGN.test(e))
          .map((e) => `${at}: console error: ${e.slice(0, 200)}`),
      );
      for (const link of links()) {
        const pattern = patternOf(link);
        if (pattern === null) found.push(`${at}: the link to ${link} leads nowhere`);
        else if (!seen.has(pattern)) {
          seen.add(pattern);
          queue.push(link);
        }
      }
    }
  } finally {
    console.error = keep;
    removeEventListener("error", crash);
    removeEventListener("unhandledrejection", crash);
  }
  return found;
}

export function everyPage(screen: Screen, dir: Direction) {
  const backend = inPageBackend();
  describe(`${screen.width}×${screen.height} ${dir}`, () => {
    it.each(people().map((p) => [p.name ?? p.email, p] as const))(
      "every page %s can reach fits and passes the audits",
      async (_, person) => {
        const found = await visitAll(await backend, person, screen, dir);
        expect(found.length, [`${found.length} problems:`, ...found].join("\n")).toBe(0);
      },
      1_800_000,
    );
  });
}
