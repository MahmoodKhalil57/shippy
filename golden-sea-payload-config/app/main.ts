import "saastemlycrm-design-system/styles.css";
import { startDashboard } from "saastemlycrm-design-system/app";
import { startMockBackend } from "mock-runner/client";
import config from "../src/config.ts";
import { seedUsers } from "../src/seed.ts";

/**
 * Golden Sea's app: this config's dashboard (saastemlycrm-design-system) with its backend in the
 * browser (mock-runner). The service worker serves the config's Payload REST API from IndexedDB,
 * and the dashboard talks to it as it would to a real Payload server. A real deployment (Payload
 * on D1 and Workers) replaces only the backend: `ready` resolves once it answers.
 */
void startDashboard({ config, seedUsers, ready: startMockBackend() });
