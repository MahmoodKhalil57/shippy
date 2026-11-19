/** The project the runner serves (set by `mockBackend({ project })` in vite.config.ts). */
declare module "virtual:mock-project" {
  import type { MockConfig } from "saastemlycrm-design-system/contracts";
  import type { SeedUser } from "saastemlycrm-design-system/app";
  const config: MockConfig;
  export default config;
  /** Every seed file (collections and `globals/`), as Vite glob modules keyed by path. */
  export const seedModules: Record<string, unknown>;
  export const seedUsers: SeedUser[];
}
