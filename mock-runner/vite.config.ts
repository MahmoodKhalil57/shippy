import { defineConfig } from "vite-plus";
import { designSystem } from "saastemlycrm-design-system/vite";
import mockBackend from "./plugins/mock-backend.ts";

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/shippy/" : "/",
  plugins: [
    // The design system: component stylesheets, Tailwind, cascade layers, icons.
    ...designSystem(),
    // The in-browser Payload-compatible backend (src/mock): a service worker serving the
    // project's REST API from IndexedDB. The project is this one setting.
    ...mockBackend({ project: "golden-sea-payload-config" }),
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
  // The build is the demo website: GitHub Pages serves the repository's docs/ folder at /shippy/.
  // The base lives here, not as a `--base` flag: Git Bash rewrites `/shippy/` on a command line
  // into a Windows path ("C:/Program Files/Git/shippy/"), which broke every asset URL once.
  build: { outDir: "../docs", emptyOutDir: true },
}));
