interface Runtime {
  startCoverage(options: unknown): unknown;
  takeCoverage(options?: unknown): unknown;
  stopCoverage(options: { isolate?: boolean }): unknown;
}

interface BrowserRunner {
  __vitest_browser_runner__: { commands: { triggerCommand(command: string, args: unknown[]): Promise<unknown> } };
}

const inBrowser = typeof window !== "undefined" && "__vitest_browser_runner__" in globalThis;
const trigger = (command: string, args: unknown[] = []) =>
  (globalThis as unknown as BrowserRunner).__vitest_browser_runner__.commands.triggerCommand(command, args);

let started = false;
const browser: Runtime = {
  async startCoverage() {
    if (started) return;
    started = true;
    await trigger("__vitest_startV8Coverage");
  },
  takeCoverage: () => trigger("__vitest_takeV8Coverage", [window.location.href]),
  async stopCoverage({ isolate }) {
    if (isolate === false) return;
    await trigger("__vitest_stopV8Coverage");
  },
};

const load = async <T>(specifier: string): Promise<T> => (await import(/* @vite-ignore */ specifier)) as T;

let nodeRuntime: Promise<Runtime> | undefined;
const node = () =>
  (nodeRuntime ??= (async () => {
    const { createRequire } = await load<typeof import("node:module")>("node:module");
    const { pathToFileURL } = await load<typeof import("node:url")>("node:url");
    const from = createRequire(`${process.cwd()}/package.json`);
    const url = pathToFileURL(from.resolve("@vitest/coverage-v8")).href;
    return (await load<{ default: Runtime }>(url)).default;
  })());

const impact = !inBrowser && process.env.TEST_IMPACT === "1";
const reads = () => load<typeof import("./reads.ts")>(new URL("./reads.ts", import.meta.url).href);

export default {
  startCoverage: (options: unknown) =>
    inBrowser
      ? browser.startCoverage(options)
      : node().then(async (r) => {
          if (impact) (await reads()).watchReads();
          return r.startCoverage(options);
        }),
  takeCoverage: (options?: unknown) =>
    inBrowser
      ? browser.takeCoverage(options)
      : node().then(async (r) => {
          const file = await r.takeCoverage(options);
          if (impact && typeof file === "string") (await reads()).writeReads(file);
          return file;
        }),
  stopCoverage: (options: { isolate?: boolean }) =>
    inBrowser ? browser.stopCoverage(options) : node().then((r) => r.stopCoverage(options)),
  async getProvider() {
    const { impactProvider } = await load<typeof import("./provider.ts")>(
      new URL("./provider.ts", import.meta.url).href,
    );
    return impactProvider();
  },
};
