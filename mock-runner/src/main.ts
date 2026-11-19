import "saastemlycrm-design-system/styles.css";
import config, { seedUsers } from "virtual:mock-project";
import { startDashboard } from "saastemlycrm-design-system/app";
import { startMockBackend } from "./start.ts";

/**
 * The mock runner: the project's dashboard (the project is set in vite.config.ts) with its backend
 * in the browser. The service worker
 * (./mock/sw.ts) serves the project's Payload REST API from IndexedDB; the dashboard talks to it
 * as it would to a real Payload server. A real deployment replaces only this package.
 */
void startDashboard({ config, seedUsers, ready: startMockBackend() });
