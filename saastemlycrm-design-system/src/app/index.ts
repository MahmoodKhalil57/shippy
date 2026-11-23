import { setBackendReady } from "../api/client.ts";
import type { MockConfig } from "../contracts/config.ts";
import { setProject, type SeedUser } from "./config.ts";
import { dir, locale, localizeConfig } from "../i18n/index.ts";

export type { SeedUser } from "./config.ts";

/**
 * Starts the dashboard for a project: `config` is its Payload config, `seedUsers` the demo
 * sign-ins (optional), `ready` resolves once its backend can answer (the mock runner's service
 * worker; a real server needs none). The app's modules load after, so they read this project.
 * The config is read in the interface's language as it starts (`localizeConfig`): a label, hint
 * or placeholder may be a string or Payload's `{ en, ar }`.
 *
 * @example
 * import config from "my-payload-config";
 * await startDashboard({ config, seedUsers, ready: startMockBackend() });
 */
export async function startDashboard(options: { config: MockConfig; seedUsers?: SeedUser[]; ready?: Promise<void> }) {
  // The page's language (index.html set it before the first paint; set again for a page without
  // that script), and the config's labels, hints and placeholders read in it, once.
  document.documentElement.lang = locale();
  document.documentElement.dir = dir();
  setProject({ ...options, config: localizeConfig(options.config) });
  if (options.ready) setBackendReady(options.ready);
  await import("./app.ts");
}
