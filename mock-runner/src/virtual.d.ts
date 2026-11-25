declare module "virtual:mock-backend" {
  const config: import("./types.ts").BackendConfig;
  export default config;
  export const seedModules: Record<string, unknown>;
}
