import type { D1Database, R2Bucket } from "@cloudflare/workers-types/index.ts";
import { Engine, RestApi, type BackendConfig } from "mock-runner/server";
import { D1Store } from "./d1-store.ts";

/**
 * What a project's Worker is given (its wrangler config's bindings):
 * - `DB`: the D1 database (../migrations applied, seeded with `seedSql`);
 * - `FILES`: an R2 bucket for uploads (optional: without it, uploads are kept in D1);
 * - `ASSETS`: the app's built pages and files (Workers static assets);
 * - `PAYLOAD_SECRET`: signs sessions (a Wrangler secret; without it one is made and kept in D1).
 */
export interface CfEnv {
  DB: D1Database;
  FILES?: R2Bucket;
  /** The static assets binding (its `fetch`). */
  ASSETS: { fetch(request: Request): Promise<Response> };
  PAYLOAD_SECRET?: string;
}

/**
 * The app on Cloudflare: one Worker serving a Payload config's REST API (the same engine and API
 * as the browser's mock backend, mock-runner/server, its data in D1) at `apiRoute`, and the
 * dashboard's built pages everywhere else (static assets; an unknown path gets the app, which
 * routes it). Each API request has its own store and engine: nothing a request reads or who it
 * is outlives it. Sessions are Payload's `payload-token` cookie. The database is seeded ahead of
 * time (`seedSql`), never by a request; the mock's tools (reset, import) aren't served.
 */
export function createWorker({ config, apiRoute = "/api" }: { config: BackendConfig; apiRoute?: string }): {
  fetch(request: Request, env: CfEnv): Promise<Response>;
} {
  return {
    async fetch(request, env) {
      const { pathname } = new URL(request.url);
      if (pathname !== apiRoute && !pathname.startsWith(`${apiRoute}/`)) return env.ASSETS.fetch(request);
      const engine = new Engine(
        env.PAYLOAD_SECRET ? { ...config, secret: env.PAYLOAD_SECRET } : config,
        new D1Store(env.DB, env.FILES),
        { apiRoute },
      );
      return new RestApi(engine, undefined, { session: "cookie", tools: false, seed: false }).handle(request);
    },
  };
}
