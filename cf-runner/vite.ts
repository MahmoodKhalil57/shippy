import { cloudflare } from "@cloudflare/vite-plugin";

export function cfBackend({ configPath = "./wrangler.jsonc" }: { configPath?: string } = {}) {
  return cloudflare({ configPath });
}
