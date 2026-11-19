/** The config and seed the worker serves (set by `mockBackend({ config, seed })` in the app's vite.config.ts). */
declare module "virtual:mock-backend" {
  const config: import("./types.ts").BackendConfig;
  export default config;
  /** Every seed file (collections and `globals/`), as Vite glob modules keyed by path. */
  export const seedModules: Record<string, unknown>;
}
