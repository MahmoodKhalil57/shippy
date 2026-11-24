import { cloudflare } from "@cloudflare/vite-plugin";

/**
 * cf-runner's Vite plugin: the app's Worker (its wrangler config's `main`, which calls
 * `createWorker`) and its pages, built together by Cloudflare's Vite plugin. `vp dev` runs the
 * Worker locally (workerd, with a local D1 and R2) beside the dev server; `vp build` writes both
 * for `wrangler deploy`. The app's pages need no backend of their own (`ready` resolves at once).
 */
export function cfBackend({ configPath = "./wrangler.jsonc" }: { configPath?: string } = {}) {
  return cloudflare({ configPath });
}
