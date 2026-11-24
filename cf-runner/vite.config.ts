import { defineConfig } from "vite-plus";

/**
 * The runner's own checks (lint, format, tests). It has no app: an app adds `cfBackend()` from
 * `cf-runner/vite`, a Worker calling `createWorker({ config })` from `cf-runner/worker`, and seeds
 * its D1 database with `seedSql` from `cf-runner/seed`.
 */
export default defineConfig({
  fmt: {
    ignorePatterns: ["dist/**", "bun.lock", ".wrangler/**"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ["dist/**", ".wrangler/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
