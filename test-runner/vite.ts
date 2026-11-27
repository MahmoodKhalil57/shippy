import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { quickpickle } from "quickpickle";

const here = import.meta.dirname;
const PROJECT = "virtual:test-runner/project";
const posix = (p: string) => p.split(path.sep).join("/");
const packageDir = (name: string) =>
  path.dirname(realpathSync(createRequire(import.meta.url).resolve(`${name}/package.json`)));

export interface TestRunnerOptions {
  config: string;
  seed: string;
  features?: string[];
  steps?: string[];
  tours?: { features: string; messages: string; seed: string };
}

export interface PlaywrightOptions {
  launchOptions: { args: string[] };
  contextOptions: { timezoneId: string };
}

interface ProjectPlugin {
  name: string;
  configResolved(config: { root: string }): void;
  resolveId(id: string): string | null;
  load(id: string): string | null;
}

function projectModule(options: TestRunnerOptions): ProjectPlugin {
  let root = process.cwd();
  return {
    name: "test-runner:project",
    configResolved(config: { root: string }) {
      root = config.root;
    },
    resolveId: (id: string) => (id === PROJECT ? `\0${PROJECT}` : null),
    load(id: string) {
      if (id !== `\0${PROJECT}`) return null;
      const at = (p: string) => JSON.stringify(posix(path.resolve(root, p)));
      return [
        `export { default as config } from ${at(options.config)};`,
        `import * as seed from ${at(options.seed)};`,
        "export const seedModules = seed.seedModules;",
        "export const seedUsers = seed.seedUsers;",
        `export const tours = ${JSON.stringify(
          options.tours && {
            features: path.resolve(root, options.tours.features),
            messages: path.resolve(root, options.tours.messages),
            seed: path.resolve(root, options.tours.seed),
          },
        )};`,
        "",
      ].join("\n");
    },
  };
}

export function testRunner<Provider>(
  options: TestRunnerOptions & { playwright: (options: PlaywrightOptions) => Provider },
) {
  const project = projectModule(options);
  const pickle: { name: string } = quickpickle({ skipTags: ["@skip", "@tour"] });
  return [
    {
      extends: true,
      plugins: [project],
      test: {
        name: "checks",
        environment: "node",
        include: [posix(path.join(here, "src/checks/*.check.ts"))],
      },
    },
    {
      extends: true,
      plugins: [project, pickle],
      resolve: { alias: { quickpickle: posix(path.join(here, "node_modules/quickpickle")) } },
      test: {
        name: "features",
        environment: "node",
        testTimeout: 30_000,
        include: options.features ?? ["features/**/*.feature"],
        setupFiles: [posix(path.join(here, "src/steps/index.ts")), ...(options.steps ?? [])],
      },
    },
    {
      extends: true,
      plugins: [project],
      server: {
        fs: {
          allow: [process.cwd(), here, packageDir("saastemlycrm-design-system"), packageDir("mock-runner")],
        },
      },
      test: {
        name: "ui",
        include: [posix(path.join(here, "src/ui/screens/*.ui.ts"))],
        browser: {
          enabled: true,
          headless: true,
          provider: options.playwright({
            launchOptions: { args: ["--disable-frame-rate-limit", "--disable-gpu-vsync"] },
            contextOptions: { timezoneId: "Etc/UTC" },
          }),
          instances: [{ browser: "chromium" as const }],
        },
      },
    },
  ];
}
