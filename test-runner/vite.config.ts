import { defineConfig } from "vite-plus";

export default defineConfig({
  test: { include: ["src/impact/**/*.test.ts"], environment: "node" },
  fmt: {
    ignorePatterns: ["dist/**", "bun.lock"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ["dist/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error", "typescript/triple-slash-reference": "off" },
    options: { typeAware: true, typeCheck: true },
  },
});
