import { defineConfig } from "vite-plus";
import { designSystem } from "saastemlycrm-design-system/vite";
import mockBackend from "./plugins/mock-backend.ts";

export default defineConfig({
  plugins: [
    // The design system: component stylesheets, Tailwind, cascade layers, icons.
    ...designSystem(),
    // The in-browser Payload-compatible backend (src/mock): a service worker serving the
    // project's REST API from IndexedDB.
    mockBackend(),
  ],
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
  // The build is the demo website: GitHub Pages serves the repository's docs/ folder (at
  // /shippy/, set by `--base` in the package.json build script).
  build: { outDir: "../docs", emptyOutDir: true },
});
