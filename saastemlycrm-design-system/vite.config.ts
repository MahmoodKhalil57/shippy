import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["dist/**", "bun.lock", "src/i18n/paraglide/**", "project.inlang/cache/**"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ["dist/**", "src/i18n/paraglide/**", "project.inlang/cache/**"],
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "saastemly", specifier: "./lint/index.js" },
    ],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ["src/**/*.ts"],
        rules: { "typescript/unbound-method": "off" },
      },
      {
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
});
