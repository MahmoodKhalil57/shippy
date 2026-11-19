import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { MockConfig } from "saastemlycrm-design-system/contracts";
import { Engine } from "./mock/runtime/engine.ts";
import { RestApi } from "./mock/runtime/rest.ts";
import { seedsFromGlob, type Seeds } from "./mock/runtime/seed.ts";
import { MemoryStore } from "./mock/runtime/store.ts";

/**
 * A test harness for a Payload project (Node, `mock-runner/testing`): the project's config served
 * by the mock engine's REST API on an in-memory store, called the way the Service Worker serves it.
 * Knows no project: pass the config and the seed.
 *
 *   const backend = testBackend(config, seedModules);
 *   beforeEach(() => backend.reset());
 *   await backend.login("me@example.test", "secret");
 *   const { status, body } = await backend.call("GET", "/api/posts?limit=1");
 */

export { Engine, MemoryStore, RestApi, seedsFromGlob, type Seeds };

/** A response, with its body parsed (JSON, else text) for loose API-test assertions. */
export interface TestResponse {
  status: number;
  // oxlint-disable-next-line typescript/no-explicit-any
  body: any;
  /** The raw body text. */
  text: string;
  res: Response;
}

export interface TestBackend {
  /** The current REST API (replaced by `reset`). */
  readonly api: RestApi;
  readonly engine: Engine;
  readonly seeds: Seeds;
  /** A request to the REST API: JSON or `FormData` bodies, optional extra headers. */
  call: (method: string, url: string, body?: unknown, headers?: Record<string, string>) => Promise<TestResponse>;
  /** Signs in (`POST /api/<collection>/login`); later calls carry the session, as in the browser. */
  login: (email: string, password: string, collection?: string) => Promise<TestResponse>;
  /**
   * A fresh backend: an empty store, seeded on the next call. Optionally another config, seed or
   * store (pass the same store twice to start "again" on existing data, e.g. to test seed top-up).
   */
  reset: (options?: ResetOptions) => RestApi;
}

export interface ResetOptions {
  config?: MockConfig;
  seeds?: SeedInput;
  store?: MemoryStore;
}

/** Seed modules (`import.meta.glob("./seed/**\/*.json", { eager: true })` output) or ready seeds. */
export type SeedInput = Seeds | Record<string, unknown>;

const isSeeds = (s: SeedInput): s is Seeds =>
  typeof s.collections === "object" && s.collections !== null && typeof s.globals === "object" && s.globals !== null;

/** Seeds from either form. */
export const toSeeds = (s: SeedInput): Seeds => (isSeeds(s) ? s : seedsFromGlob(s));

/** The seed in a directory: `<slug>.json` collections and `globals/<slug>.json` globals. */
export function seedsFromDir(dir: string): Seeds {
  const modules: Record<string, unknown> = {};
  for (const f of readdirSync(dir, { recursive: true }) as string[]) {
    if (f.endsWith(".json"))
      modules[`./seed/${f.split(path.sep).join("/")}`] = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
  }
  return seedsFromGlob(modules);
}

/** Parses a response body like an API test reads it: JSON when it is JSON, else the text. */
async function read(res: Response): Promise<TestResponse> {
  const text = await res.text();
  const type = res.headers.get("content-type") ?? "";
  // oxlint-disable-next-line typescript/no-explicit-any
  let body: any = text;
  if (!type || type.includes("json")) {
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = text;
    }
  }
  return { status: res.status, body, text, res };
}

/** The project's backend for tests: `Engine` + `RestApi` on a `MemoryStore`, seeded on first call. */
export function testBackend(
  config: MockConfig,
  seedInput: SeedInput = { collections: {}, globals: {} },
  { origin = "http://mock.test" }: { origin?: string } = {},
): TestBackend {
  const seeds = toSeeds(seedInput);
  let api = new RestApi(new Engine(config, new MemoryStore()), seeds);

  const call: TestBackend["call"] = async (method, url, payload, headers = {}) => {
    const init: RequestInit = { method, headers: { ...headers } };
    if (payload instanceof FormData) init.body = payload;
    else if (payload !== undefined) {
      init.body = JSON.stringify(payload);
      (init.headers as Record<string, string>)["content-type"] = "application/json";
    }
    return read(await api.handle(new Request(`${origin}${url}`, init)));
  };

  const reset = (options: ResetOptions = {}) => {
    const store = options.store ?? new MemoryStore();
    api = new RestApi(new Engine(options.config ?? config, store), options.seeds ? toSeeds(options.seeds) : seeds);
    return api;
  };

  return {
    get api() {
      return api;
    },
    get engine() {
      return api.engine;
    },
    seeds,
    call,
    login: (email, password, collection = "users") =>
      call("POST", `${api.engine.apiRoute}/${collection}/login`, { email, password }),
    reset,
  };
}
