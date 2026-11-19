import { recommended } from "saastemlycrm-design-system/lint";
import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["bun.lock"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    // The design system's rules for a project (saastemlycrm-design-system/lint): the import
    // boundary, pure widgets, endpoints that return data, and the block conventions.
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "saastemly", specifier: "saastemlycrm-design-system/lint" },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      ...recommended,
      "saastemly/sentence-case-titles": ["warn", { properNouns: ["Golden Sea"] }],
    },
    options: { typeAware: true, typeCheck: true },
  },
  // Its behaviour is tested against a backend: every endpoint and widget, through mock-runner's
  // engine (`mock-runner/testing`).
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
