import { setBackendReady } from "../api/client.ts";
import type { MockConfig } from "../contracts/config.ts";
import { setProject, type SeedUser } from "./config.ts";

export type { SeedUser } from "./config.ts";

/**
 * Starts the dashboard for a project: `config` is its Payload config, `seedUsers` the demo
 * sign-ins (optional), `ready` resolves once its backend can answer (the mock runner's service
 * worker; a real server needs none). The app's modules load after, so they read this project.
 *
 * @example
 * import config from "my-payload-config";
 * await startDashboard({ config, seedUsers, ready: startMockBackend() });
 */
export async function startDashboard(options: { config: MockConfig; seedUsers?: SeedUser[]; ready?: Promise<void> }) {
  setProject(options);
  if (options.ready) setBackendReady(options.ready);
  await import("./app.ts");
}
