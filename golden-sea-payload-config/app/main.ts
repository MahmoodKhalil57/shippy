import "saastemlycrm-design-system/styles.css";
import { startDashboard } from "saastemlycrm-design-system/app";
import { startMockBackend } from "mock-runner/client";
import { startCfBackend } from "cf-runner/client";
import config from "../src/config.ts";
import { seedUsers } from "../src/seed.ts";

/**
 * Golden Sea's app: this config's dashboard (saastemlycrm-design-system) with its backend in the
 * browser (mock-runner): the service worker serves the config's Payload REST API from IndexedDB,
 * and the dashboard talks to it as it would to a real Payload server. On Cloudflare (cf-runner,
 * `PUBLIC_BACKEND=cf`, src/env.ts) the same API is served from D1 by the Worker that serves these pages: only
 * `ready` changes.
 */
// The backend this build runs on: Cloudflare (`PUBLIC_BACKEND=cf`: the API is on the pages' own Worker,
// nothing to start) or the browser (the mock's service worker). A constant in each build, so the
// other one isn't bundled.
const ready = import.meta.env.PUBLIC_BACKEND === "cf" ? startCfBackend() : startMockBackend();
void startDashboard({ config, seedUsers, ready });
