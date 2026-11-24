import { createWorker } from "cf-runner/worker";
import config from "../src/config.ts";

/**
 * Golden Sea on Cloudflare (cf-runner): this config's Payload REST API from D1 at /api, and the
 * dashboard's built pages for everything else, from one Worker (wrangler.jsonc). The same config
 * the browser's mock backend runs.
 */
export default createWorker({ config });
