import { API_ROUTE, DASHBOARD_ROUTE, api, setBackendReady } from "../lib/api/client.ts";
import * as builtIn from "../lib/agent/built-in-ai.ts";
import * as codex from "../lib/agent/codex.ts";
import * as identity from "../lib/agent/identity.ts";
import * as polyfill from "../lib/agent/ai-polyfill.ts";
import * as webmcp from "../lib/agent/webmcp.ts";
import type { MockConfig } from "../lib/contracts/config.ts";
import { dir, locale, localizeConfig } from "../lib/i18n/index.ts";
import { bookmarks, notifications, palette, preferences, tour } from "../lib/stores/index.ts";
import "../components/dashboard/dashboard-provider.ts";
import type { Dashboard, DataPort, Site } from "../lib/dashboard/context.ts";
import { createProject, type SeedUser } from "../lib/dashboard/project.ts";
import { loadGuide, loadSite, loadTours, resetSite, site } from "./site.ts";

export type { SeedUser };

const data: DataPort = {
  ...api,
  me: async (collection) => {
    const me = await api.me(collection);
    resetSite();
    await loadSite();
    return me;
  },
};

const siteOf = (): Site => ({
  get branding() {
    return site().branding;
  },
  get assistant() {
    return site().assistant;
  },
  tours: loadTours,
  guide: loadGuide,
});

export function dashboardOf(options: { config: MockConfig; seedUsers?: SeedUser[] }): Dashboard {
  const project = createProject({ ...options, base: DASHBOARD_ROUTE, apiRoute: API_ROUTE });
  return {
    project,
    site: siteOf(),
    data,
    stores: { preferences, notifications, palette, tour, bookmarks },
    ai: { builtIn, codex, identity, polyfill, webmcp },
    navigate: (to, replace = false) => {
      const path = project.withBase(to);
      if (replace) history.replaceState(null, "", path);
      else history.pushState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
    notify: (message, tone = "success", action) =>
      void document
        .querySelector("ui-snackbar")
        ?.push(message, { tone: tone === "success" || tone === "error" ? tone : "neutral", action }),
  };
}

function mount(dashboard: Dashboard) {
  const apps = [...document.querySelectorAll("dashboard-app")];
  if (!apps.length) apps.push(document.body.appendChild(document.createElement("dashboard-app")));
  for (const app of apps) {
    const provider = document.createElement("dashboard-provider");
    provider.dashboard = dashboard;
    app.replaceWith(provider);
    provider.append(app);
  }
}

export async function startDashboard(options: { config: MockConfig; seedUsers?: SeedUser[]; ready?: Promise<void> }) {
  document.documentElement.lang = locale();
  document.documentElement.dir = dir();
  const config = localizeConfig(options.config);
  if (options.ready) setBackendReady(options.ready);
  mount(dashboardOf({ config, seedUsers: options.seedUsers }));
  await import("../components/shell/app.ts");
}
