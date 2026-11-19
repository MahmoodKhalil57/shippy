import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["bun.lock"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  // Its behaviour is tested against a backend: every endpoint and widget, through mock-runner's
  // engine (`mock-runner/testing`).
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
