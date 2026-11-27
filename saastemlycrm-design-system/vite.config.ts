import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "vite-plus/test/browser-playwright";
import { defineConfig } from "vite-plus";
import { impactCoverage, impactPlugin } from "test-runner/impact";
import { designSystem } from "./vite/index.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

interface Pattern {
  group: string[];
  allowTypeImports?: boolean;
  message: string;
}
const CLASS_PATHS = [
  { name: "lit/directives/class-map.js", message: "Only primitives may set classes. Use a variant." },
  { name: "lit/directives/style-map.js", message: "Only primitives may set styles. Use a variant." },
];
const SERVICES: Pattern = {
  group: ["**/lib/api/client.ts", "**/lib/stores/**", "**/lib/agent/**", "**/app/**"],
  allowTypeImports: true,
  message: "Components get services from the dashboard context (lib/dashboard/context.ts); import only their types.",
};
const above = (...layers: string[]): Pattern => ({
  group: layers.map((l) => `**/${l}/**`),
  message:
    "A layer imports only from the layers below it: lib/base, primitives, composed, dashboard, widgets, views, shell. Logic in lib/dashboard, lib/widgets and lib/shell sits under the layer of the same name.",
});
const DATA: Pattern = { ...SERVICES, group: SERVICES.group.filter((g) => g !== "**/lib/agent/**") };
const COMPONENTS: Pattern = {
  group: ["**/components/**"],
  allowTypeImports: true,
  message: "lib holds logic that renders nothing; it imports components only for their types.",
};
const rule = (paths: typeof CLASS_PATHS, patterns: Pattern[]) => ({
  "no-restricted-imports": ["error", { paths, ...(patterns.length ? { patterns } : {}) }] as [
    "error",
    { paths: typeof CLASS_PATHS; patterns?: Pattern[] },
  ],
});
const restrict = (...patterns: Pattern[]) => rule(CLASS_PATHS, patterns);
const COVERED = [
  "src/components/**/*.ts",
  "src/lib/base/**/*.ts",
  "src/lib/dashboard/**/*.ts",
  "src/lib/widgets/**/*.ts",
  "src/lib/shell/**/*.ts",
  "src/styles/algebra.ts",
  "src/lib/contracts/**/*.ts",
  "src/lib/payload/**/*.ts",
  "src/lib/api/**/*.ts",
  "src/lib/stores/**/*.ts",
  "src/lib/i18n/index.ts",
  "src/app/**/*.ts",
];

const browser = (timezoneId: string) => ({
  enabled: true,
  headless: true,
  provider: playwright({
    launchOptions: { args: ["--disable-frame-rate-limit", "--disable-gpu-vsync"] },
    contextOptions: { timezoneId },
  }),
  instances: [{ browser: "chromium" as const }],
});

const SERIAL = [
  "src/components/primitives/media/waves.stories.ts",
  "src/components/primitives/media/magnet-lines.stories.ts",
];

const stories = (name: string, fileParallelism: boolean, exclude: string[]) => ({
  extends: true,
  plugins: [
    storybookTest({
      configDir: path.join(dirname, ".storybook"),
      storybookScript: "bun run storybook --no-open",
    }),
  ],
  test: { name, fileParallelism, exclude, browser: browser("Etc/UTC") },
});

export default defineConfig({
  plugins: [impactPlugin()],
  test: {
    maxWorkers: 10,
    projects: [
      stories("storybook", true, [...SERIAL, "src/**/*.fit.stories.ts", "src/**/*.fit.*.stories.ts"]),
      stories("storybook-fit", true, [
        "src/components/!(widgets|views|shell)/**",
        "src/components/*/*/**",
        "src/components/*/!(*.fit.stories.ts|*.fit.*.stories.ts)",
      ]),
      stories("storybook-serial", false, [
        "src/components/!(primitives)/**",
        "src/components/primitives/!(media)/**",
        "src/components/primitives/media/!(waves|magnet-lines).stories.ts",
      ]),
      {
        extends: true,
        plugins: designSystem(),
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.zoned.test.ts"],
          browser: browser("Etc/UTC"),
        },
      },
      {
        extends: true,
        plugins: designSystem(),
        test: { name: "zoned", include: ["src/**/*.zoned.test.ts"], browser: browser("Asia/Dubai") },
      },
    ],
    coverage: {
      ...impactCoverage(),
      include: COVERED,
      exclude: ["**/*.stories.ts", "**/*.test.ts"],
      thresholds: Object.fromEntries(
        COVERED.map((glob) => [glob, { statements: 100, branches: 100, functions: 100, lines: 100 }]),
      ),
    },
  },
  fmt: {
    ignorePatterns: [
      "dist/**",
      "bun.lock",
      "src/lib/i18n/paraglide/**",
      "project.inlang/cache/**",
      "storybook-static/**",
      "coverage/**",
      "custom-elements.json",
    ],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: [
      "dist/**",
      "src/lib/i18n/paraglide/**",
      "project.inlang/cache/**",
      "storybook-static/**",
      "coverage/**",
    ],
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
      { files: ["src/**/*.ts"], rules: restrict() },
      { files: ["src/components/**/*.ts"], rules: restrict(DATA) },
      { files: ["src/components/**/*.ts"], rules: { "saastemly/components-have-stories": "error" } },
      { files: ["src/**/*.ts"], rules: { "saastemly/templates-in-components": "error" } },
      {
        files: ["src/components/primitives/**/*.ts"],
        rules: rule([], [DATA, above("composed", "dashboard", "widgets", "views", "shell")]),
      },
      {
        files: ["src/components/composed/**/*.ts"],
        rules: restrict(DATA, above("dashboard", "widgets", "views", "shell")),
      },
      { files: ["src/components/dashboard/**/*.ts"], rules: restrict(SERVICES, above("views", "shell")) },
      { files: ["src/components/widgets/**/*.ts"], rules: restrict(SERVICES, above("views", "shell")) },
      { files: ["src/components/views/**/*.ts"], rules: restrict(SERVICES, above("shell")) },
      { files: ["src/components/shell/**/*.ts"], rules: restrict(SERVICES) },
      {
        files: ["src/lib/base/**/*.ts", "src/styles/**/*.ts"],
        rules: restrict(DATA, COMPONENTS, above("dashboard", "widgets", "shell")),
      },
      { files: ["src/lib/dashboard/**/*.ts"], rules: restrict(SERVICES, COMPONENTS, above("shell")) },
      { files: ["src/lib/widgets/**/*.ts"], rules: restrict(SERVICES, COMPONENTS, above("shell")) },
      { files: ["src/lib/shell/**/*.ts"], rules: restrict(SERVICES, COMPONENTS) },
      { files: ["src/**/*.stories.ts", "src/**/*.test.ts"], rules: restrict() },
    ],
  },
});
