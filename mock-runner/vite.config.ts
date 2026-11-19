import { defineConfig } from "vite-plus";

/**
 * The backend's own checks (lint, format, tests). It has no app: an app adds it with
 * `mockBackend({ config, seed })` from `mock-runner/vite` and starts it with `startMockBackend()`
 * from `mock-runner/client`.
 */
export default defineConfig({
  fmt: {
    ignorePatterns: ["dist/**", "bun.lock"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ["dist/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
