import { testBackend } from "mock-runner/testing";
import config from "../src/config.ts";
import { seedModules } from "../src/seed.ts";

/**
 * Golden Sea's backend for tests: this config and seed on mock-runner's engine and REST API, in
 * memory (`mock-runner/testing`). Each test file resets it in `beforeEach`.
 */
export const backend = testBackend(config, seedModules);
export const { call, seeds } = backend;
export { config };

/** Signs in a seeded user by the part of their email before `@goldensea.test` (demo password). */
export const login = (user = "karim.youssef", password = "demo1234") =>
  backend.login(user.includes("@") ? user : `${user}@goldensea.test`, password);
