declare module "virtual:test-runner/project" {
  export const config: import("mock-runner/server").BackendConfig;
  export const seedModules: Record<string, unknown>;
  export const seedUsers: unknown[] | undefined;
  export const tours: { features: string; messages: string; seed: string } | undefined;
}
