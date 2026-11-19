import { defineConfig } from "vite-plus";

// The design system's own checks (lint, format, tests). Apps use its plugins through
// `designSystem()` from "saastemlycrm-design-system/vite".
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
    overrides: [
      {
        // Lit calls template event listeners (`@click=${this._onClick}`) with
        // `this` bound to the host element, so passing methods unbound is the
        // intended pattern there, not a bug.
        files: ["src/**/*.ts"],
        rules: { "typescript/unbound-method": "off" },
      },
      {
        // Only primitives style things (see tests/architecture.test.ts): no
        // dynamic class/style escape hatches anywhere else.
        files: ["src/**/*.ts"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              paths: [
                { name: "lit/directives/class-map.js", message: "Only primitives may set classes. Use a variant." },
                { name: "lit/directives/style-map.js", message: "Only primitives may set styles. Use a variant." },
              ],
            },
          ],
        },
      },
      {
        // Layering: primitives are the leaves. Composed components are built from
        // primitives, never the other way round. (Primitives may use classMap /
        // styleMap: they are where styling lives.)
        files: ["src/components/primitives/**/*.ts"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["**/composed/**"],
                  message: "Primitives must not depend on composed components.",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
