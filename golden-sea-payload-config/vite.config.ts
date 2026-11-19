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
  // Its behaviour is tested against a backend: mock-runner's tests run every endpoint and widget.
  test: {
    include: ["tests/**/*.test.ts"],
    passWithNoTests: true,
  },
});
