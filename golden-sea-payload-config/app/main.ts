import "saastemlycrm-design-system/styles.css";
import { startDashboard } from "saastemlycrm-design-system/app";
import { startMockBackend } from "mock-runner/client";
import { startCfBackend } from "cf-runner/client";
import config from "../src/config.ts";
import { seedUsers } from "../src/seed.ts";

const ready = import.meta.env.PUBLIC_BACKEND === "cf" ? startCfBackend() : startMockBackend();
void startDashboard({ config, seedUsers, ready });
