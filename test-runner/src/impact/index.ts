import path from "node:path";

export const COVERAGE_MODULE = path.join(import.meta.dirname, "coverage.ts");

export const impactCoverage = () => ({ provider: "custom" as const, customProviderModule: COVERAGE_MODULE });

export const impactPlugin = () => ({
  name: "test-runner:impact",
  configResolved(config: { server: { fs: { allow: string[] } } }) {
    if (!config.server.fs.allow.includes(COVERAGE_MODULE)) config.server.fs.allow.push(COVERAGE_MODULE);
  },
});
