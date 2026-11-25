import { setBackendReady } from "../api/client.ts";
import type { MockConfig } from "../contracts/config.ts";
import { setProject, type SeedUser } from "./config.ts";
import { dir, locale, localizeConfig } from "../i18n/index.ts";

export type { SeedUser } from "./config.ts";

export async function startDashboard(options: { config: MockConfig; seedUsers?: SeedUser[]; ready?: Promise<void> }) {
  document.documentElement.lang = locale();
  document.documentElement.dir = dir();
  setProject({ ...options, config: localizeConfig(options.config) });
  if (options.ready) setBackendReady(options.ready);
  await import("./app.ts");
}
