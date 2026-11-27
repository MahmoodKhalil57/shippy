import { readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { TestModule, TestSpecification, Vitest } from "vite-plus/test/node";
import { COVERAGE_MODULE } from "./index.ts";
import { globalFiles, globalHash, ownHash, type GlobalProject } from "./inputs.ts";
import { comparable, moduleHash, type ImpactProject, type Recorded } from "./provider.ts";
import { codeChanged, decide, staleDependencies, summary, type Reason, type Snapshot } from "./rules.ts";
import { readStore, STORE_FILE, testKey, writeStore, type Store, type TestRecord } from "./store.ts";
import { splitUnits } from "./units.ts";

interface Options {
  all: boolean;
  dryRun: boolean;
  explain: boolean;
  compare: boolean;
  changed: string | true;
  projects: string[];
  filters: string[];
}

export function parseArgs(args: readonly string[]): Options {
  const options: Options = {
    all: false,
    dryRun: false,
    explain: false,
    compare: false,
    changed: true,
    projects: [],
    filters: [],
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    const [flag, inline] = arg.split("=", 2) as [string, string | undefined];
    const value = () => inline ?? args[++i] ?? "";
    if (flag === "--all") options.all = true;
    else if (flag === "--dry-run") options.dryRun = true;
    else if (flag === "--explain") options.explain = true;
    else if (flag === "--compare") options.compare = true;
    else if (flag === "--project") options.projects.push(value());
    else if (flag === "--changed") options.changed = inline || true;
    else if (arg.startsWith("--")) throw new Error(`Unknown option ${arg}.`);
    else options.filters.push(arg);
  }
  return options;
}

interface Internals {
  specifications: { filterTestsBySource(specs: TestSpecification[]): Promise<TestSpecification[]> };
  config: { changed?: string | boolean; related?: string[] };
  _sourceFilterResult?: unknown;
  coverageProvider: { records: Map<string, Recorded> } | null | undefined;
}

async function affectedBy(
  vitest: Vitest,
  specs: TestSpecification[],
  source: { changed: string | true } | { related: string[] },
) {
  if (!specs.length) return new Set<TestSpecification>();
  const internal = vitest as unknown as Internals;
  const before = { changed: internal.config.changed, related: internal.config.related };
  internal.config.changed = "changed" in source ? source.changed : undefined;
  internal.config.related = "related" in source ? source.related : undefined;
  try {
    return new Set(await internal.specifications.filterTestsBySource(specs));
  } catch {
    return new Set(specs);
  } finally {
    internal.config.changed = before.changed;
    internal.config.related = before.related;
    internal._sourceFilterResult = undefined;
  }
}

const posix = (p: string) => p.split(path.sep).join("/");

interface Selection {
  specs: number;
  selected: Map<string, Reason>;
  owns: Map<string, string>;
  global: string;
}

async function select(vitest: Vitest, options: Options, root: string, store: Store): Promise<Selection> {
  const specs = await vitest.globTestSpecifications(options.filters);
  const keyOf = (spec: TestSpecification) => testKey(spec.project.name, posix(path.relative(root, spec.moduleId)));
  const global = globalHash(
    root,
    globalFiles(root, vitest.vite.config.configFile, vitest.projects as unknown as GlobalProject[]),
  );

  const trees = new Map<string, Map<string, string> | undefined>();
  const units = (file: string) => {
    if (!trees.has(file)) {
      const absolute = path.resolve(root, file);
      let text: string | undefined;
      try {
        text = readFileSync(absolute, "utf8");
      } catch {
        text = undefined;
      }
      trees.set(
        file,
        text === undefined ? undefined : new Map(splitUnits(absolute, text).units.map((u) => [u.id, u.hash])),
      );
    }
    return trees.get(file);
  };
  const modules = new Map<string, Promise<string>>();
  const snapshot = (spec: TestSpecification, environment: string): Snapshot => ({
    units,
    module(id) {
      const key = `${spec.project.name}\u0001${environment}\u0001${id}`;
      let found = modules.get(key);
      if (!found) {
        found = moduleHash(spec.project as unknown as ImpactProject, environment, id);
        modules.set(key, found);
      }
      return found;
    },
  });

  const owns = new Map(specs.map((spec) => [keyOf(spec), ownHash(spec.moduleId)]));
  const unrecorded = specs.filter((spec) => !store.tests[keyOf(spec)]);
  let affected: Promise<Set<TestSpecification>> | undefined;
  const decisions = await Promise.all(
    specs.map(async (spec) => {
      const record = store.tests[keyOf(spec)];
      const reason = await decide({
        all: options.all,
        recorded: !!record,
        affectedByChanges: async () =>
          (await (affected ??= affectedBy(vitest, unrecorded, { changed: options.changed }))).has(spec),
        testChanged: () => record!.own !== owns.get(keyOf(spec)),
        globalChanged: () => record!.global !== global,
        failedLastTime: () => !record!.passed,
        codeChanged: () => codeChanged(record!, snapshot(spec, record!.environment)),
      });
      return { spec, reason };
    }),
  );
  const selected = new Map<string, Reason>();
  for (const { spec, reason } of decisions) if (reason) selected.set(keyOf(spec), reason);

  if (options.explain)
    for (const { spec, reason } of decisions) {
      if (!reason) continue;
      const record = store.tests[keyOf(spec)];
      const stale =
        reason === "code" && record ? await staleDependencies(record, snapshot(spec, record.environment)) : [];
      console.log(`  ${reason.padEnd(6)} ${keyOf(spec)}`);
      for (const dependency of stale) console.log(`           changed: ${dependency.replace("\0", "\0")}`);
    }
  if (options.compare) {
    const changedFiles = new Set<string>();
    for (const spec of specs)
      for (const [file, recorded] of Object.entries(store.tests[keyOf(spec)]?.units ?? {})) {
        const current = units(file);
        if (!current || Object.entries(recorded).some(([id, hash]) => current.get(id) !== hash))
          changedFiles.add(posix(path.resolve(root, file)));
      }
    const graph = await affectedBy(vitest, specs, { related: [...changedFiles] });
    console.log(
      `import graph of the ${changedFiles.size} changed source files would pick ${graph.size} of ${specs.length} test files`,
    );
  }
  return { specs: specs.length, selected, owns, global };
}

async function record(vitest: Vitest, options: Options, root: string, store: Store, selection: Selection) {
  const started = Date.now();
  await vitest.standalone();
  const keyOf = (spec: TestSpecification) => testKey(spec.project.name, posix(path.relative(root, spec.moduleId)));
  const specs = (await vitest.globTestSpecifications(options.filters)).filter((s) => selection.selected.has(keyOf(s)));
  const result = await vitest.runTestSpecifications(specs, specs.length === selection.specs);
  const records = (vitest as unknown as Internals).coverageProvider?.records ?? new Map<string, Recorded>();
  const clean = result.unhandledErrors.length === 0;
  const moduleOf = new Map<string, TestModule>(
    result.testModules.map((m) => [`${m.project.name}\u0001${comparable(m.moduleId)}`, m]),
  );
  const touched = (file: string) => {
    try {
      return statSync(file).mtimeMs > started;
    } catch {
      return true;
    }
  };
  let failed = !clean || specs.length !== selection.selected.size;
  for (const spec of specs) {
    const id = `${spec.project.name}\u0001${comparable(spec.moduleId)}`;
    const recorded = records.get(id);
    const ok = clean && !!moduleOf.get(id)?.ok();
    if (!ok) failed = true;
    const entry: TestRecord = {
      own: selection.owns.get(keyOf(spec))!,
      global: selection.global,
      passed: ok && !!recorded,
      environment: recorded?.environment ?? "",
      units: Object.fromEntries(
        Object.entries(recorded?.units ?? {}).map(([f, u]) => [posix(path.relative(root, f)), u]),
      ),
      modules: recorded?.modules ?? {},
    };
    if (entry.passed && [spec.moduleId, ...recorded!.files].some(touched)) entry.passed = false;
    store.tests[keyOf(spec)] = entry;
  }
  return failed;
}

export async function main(argv: readonly string[]): Promise<number> {
  const options = parseArgs(argv);
  const root = process.cwd();
  process.env.TEST_IMPACT = "1";
  process.env.TEST = "true";
  process.env.VITEST = "true";
  process.env.NODE_ENV ??= "test";
  const host = createRequire(path.join(root, "package.json"));
  const { createVitest } = (await import(
    pathToFileURL(host.resolve("vite-plus/test/node")).href
  )) as typeof import("vite-plus/test/node");
  const open = () =>
    createVitest({
      run: true,
      watch: false,
      passWithNoTests: true,
      ...(options.projects.length ? { project: options.projects } : {}),
      coverage: { enabled: true, provider: "custom", customProviderModule: COVERAGE_MODULE } as never,
    });
  const storeFile = path.join(root, STORE_FILE);
  const { store } = readStore(storeFile);

  const selector = await open();
  let selection: Selection;
  try {
    selection = await select(selector, options, root, store);
  } finally {
    await selector.close();
  }
  const reasons = new Map<Reason, number>();
  for (const reason of selection.selected.values()) reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
  console.log(summary(selection.selected.size, selection.specs, reasons));
  if (options.dryRun || !selection.selected.size) return 0;

  const runner = await open();
  try {
    const failed = await record(runner, options, root, store, selection);
    writeStore(storeFile, store);
    return failed ? 1 : 0;
  } finally {
    await runner.close();
  }
}

if (import.meta.main) process.exit(await main(process.argv.slice(2)));
