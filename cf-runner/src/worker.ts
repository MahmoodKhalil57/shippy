import type { D1Database, R2Bucket } from "@cloudflare/workers-types/index.ts";
import { Engine, RestApi, type BackendConfig } from "mock-runner/server";
import { D1Store } from "./d1-store.ts";

export interface CfEnv {
  DB: D1Database;
  FILES?: R2Bucket;
  ASSETS: { fetch(request: Request): Promise<Response> };
  PAYLOAD_SECRET?: string;
}

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
