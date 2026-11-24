/**
 * The backend for a server (a Worker, Node): the Payload-compatible engine and REST API over any
 * `Store`, with the seed loaders. No browser and no Node APIs, so a Worker can bundle it
 * (cf-runner keeps the store in D1). `RestApi` with `{ session: "cookie" }` keeps Payload's
 * `payload-token` cookie, one session per browser.
 */
export { Engine, type MockRequest } from "./mock/runtime/engine.ts";
export { RestApi, type RestOptions, type SessionMode } from "./mock/runtime/rest.ts";
export { seedStore, seedsFromGlob, topUpSeed, type Seeds } from "./mock/runtime/seed.ts";
export { MemoryStore, type Snapshot, type Store, type StoredFile } from "./mock/runtime/store.ts";
export type { BackendConfig, Doc } from "./types.ts";
