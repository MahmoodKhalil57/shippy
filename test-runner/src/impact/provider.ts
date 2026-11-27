import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { executedCounts, hitUnits, identityHits, type V8Function } from "./executed.ts";
import { hashText, stripTrailers, stripVersionQueries } from "./normalize.ts";
import { Queue } from "./queue.ts";
import { readHash, readPath, takeReads } from "./reads.ts";
import { UNAVAILABLE } from "./rules.ts";
import { splitUnits, type UnitTree } from "./units.ts";

interface ScriptCoverage {
  url: string;
  functions: V8Function[];
  startOffset?: number;
  isExtendedContext?: boolean;
}

interface SuiteMeta {
  coverage?: unknown;
  testFiles: string[];
  environment: string;
  projectName?: string;
}

export interface RawMap {
  mappings: string;
  sources?: (string | null)[];
  sourcesContent?: (string | null)[];
}

export interface Transformed {
  code: string;
  map?: RawMap | null;
}

export interface ImpactProject {
  name: string;
  config: { root: string };
  isBrowserEnabled(): boolean;
  vite: { environments: Record<string, { transformRequest(url: string): Promise<Transformed | null> }> };
}

interface Context {
  config: { root: string };
  getProjectByName(name: string): ImpactProject;
}

interface V8Provider {
  ctx: Context;
  initialize(ctx: Context): void;
  onAfterSuiteRun(meta: SuiteMeta): void;
  generateCoverage(context: { allTestsRun?: boolean }): Promise<unknown>;
  reportCoverage(coverage: unknown, context: { allTestsRun?: boolean }): Promise<void>;
  onTestFailure(): Promise<void>;
  cleanAfterRun(): Promise<void>;
  createCoverageMap(): unknown;
  transformFile(url: string, project: ImpactProject, environment: string): Promise<Transformed | null | undefined>;
}

type V8ProviderClass = new () => V8Provider;

export interface Recorded {
  project: string;
  file: string;
  environment: string;
  units: Record<string, Record<string, string>>;
  modules: Record<string, string>;
  files: string[];
}

const TS = /\.[cm]?tsx?$/;
export const GLOBAL_MODULES = new Set(["\0vitest/browser"]);

export const comparable = (file: string) => {
  const p = path.normalize(path.resolve(file));
  return process.platform === "win32" ? p.toLowerCase() : p;
};

export interface Location {
  file?: string;
  id: string;
  typescript: boolean;
}

export function locate(url: string, project: ImpactProject, environment: string): Location {
  const [pathname = url, query] = url.split("?", 2);
  if (pathname.startsWith("file://")) {
    const file = path.normalize(fileURLToPath(pathname));
    const id = file.split(path.sep).join("/");
    return {
      file,
      id: query === undefined ? id : `${id}?${query}`,
      typescript: query === undefined && TS.test(file),
    };
  }
  if (pathname.startsWith("/@id/"))
    return {
      id: pathname.slice("/@id/".length).replace(/^__x00__/, "\0") + (query ? `?${query}` : ""),
      typescript: false,
    };
  const browser = environment === "client" && project.isBrowserEnabled();
  if (!browser) return { id: url, typescript: false };
  const file = pathname.startsWith("/@fs/")
    ? path.normalize(pathname.slice("/@fs".length).replace(/^\/([A-Za-z]:)/, "$1"))
    : path.normalize(path.join(project.config.root, pathname));
  return { file, id: url, typescript: query === undefined && TS.test(file) && existsSync(file) };
}

export function originalSource(file: string, map: RawMap | null | undefined): { index: number[]; text?: string } {
  const sources = map?.sources ?? [];
  const index: number[] = [];
  sources.forEach((source, i) => {
    if (source == null) return;
    const resolved = source.startsWith("file://")
      ? fileURLToPath(source)
      : path.isAbsolute(source)
        ? source
        : path.resolve(path.dirname(file), source);
    if (comparable(resolved) === comparable(file)) index.push(i);
  });
  const content = index.length ? map?.sourcesContent?.[index[0]!] : undefined;
  return { index, text: content ?? undefined };
}

async function v8ProviderClass(): Promise<V8ProviderClass> {
  const from = createRequire(path.join(process.cwd(), "package.json"));
  const entry = from.resolve("@vitest/coverage-v8");
  const providerUrl = pathToFileURL(path.join(path.dirname(entry), "provider.js")).href;
  return ((await import(providerUrl)) as { V8CoverageProvider: V8ProviderClass }).V8CoverageProvider;
}

export async function impactProvider(): Promise<V8Provider & { records: Map<string, Recorded> }> {
  const Base = await v8ProviderClass();

  class ImpactProvider extends Base {
    records = new Map<string, Recorded>();
    recordOnly = false;
    private trees = new Map<string, Promise<UnitTree>>();
    private moduleHashes = new Map<string, Promise<string>>();
    private queue = new Queue<SuiteMeta>(2, (meta) => this.record(meta));

    initialize(ctx: Context) {
      super.initialize(ctx);
      this.recordOnly = process.env.TEST_IMPACT === "1";
    }

    onAfterSuiteRun(meta: SuiteMeta) {
      super.onAfterSuiteRun(meta);
      if (this.recordOnly && typeof meta.coverage === "string") this.queue.push(meta);
    }

    async generateCoverage(context: { allTestsRun?: boolean }) {
      await this.queue.drained();
      if (this.recordOnly) return this.createCoverageMap();
      return super.generateCoverage(context);
    }

    async reportCoverage(coverage: unknown, context: { allTestsRun?: boolean }) {
      if (this.recordOnly) return this.cleanAfterRun();
      return super.reportCoverage(coverage, context);
    }

    async onTestFailure() {
      await this.queue.drained();
      return super.onTestFailure();
    }

    private tree(file: string, text: string) {
      const key = `${comparable(file)}\u0001${hashText(text)}`;
      let found = this.trees.get(key);
      if (!found) this.trees.set(key, (found = Promise.resolve(splitUnits(file, text))));
      return found;
    }

    private moduleHash(project: ImpactProject, environment: string, id: string) {
      const key = `${project.name}\u0001${environment}\u0001${id}`;
      let found = this.moduleHashes.get(key);
      if (!found) {
        found = moduleHash(project, environment, id);
        this.moduleHashes.set(key, found);
      }
      return found;
    }

    private async record(meta: SuiteMeta) {
      const project = this.ctx.getProjectByName(meta.projectName ?? "");
      const raw = JSON.parse(await readFile(meta.coverage as string, "utf8")) as { result: ScriptCoverage[] };
      const tests = new Set(meta.testFiles.map(comparable));
      const units: Recorded["units"] = {};
      const modules: Recorded["modules"] = {};
      const files = new Set<string>();
      for (const script of raw.result) {
        const where = locate(script.url, project, meta.environment);
        if (where.file && existsSync(where.file)) files.add(where.file);
        if (script.isExtendedContext) {
          modules[where.id] = UNAVAILABLE;
          continue;
        }
        if (GLOBAL_MODULES.has(where.id)) continue;
        if (where.file && tests.has(comparable(where.file))) continue;
        if (!where.typescript || !where.file) {
          modules[where.id] = await this.moduleHash(project, meta.environment, where.id);
          continue;
        }
        units[where.file] = {
          ...units[where.file],
          ...(await this.fileUnits(project, meta.environment, where.file, script)),
        };
      }
      for (const id of takeReads(meta.coverage as string)) {
        const file = readPath(id)!;
        if (tests.has(comparable(file))) continue;
        modules[id] = readHash(id)!;
        if (existsSync(file)) files.add(file);
      }
      for (const file of meta.testFiles)
        this.records.set(`${project.name}\u0001${comparable(file)}`, {
          project: project.name,
          file,
          environment: meta.environment,
          units,
          modules,
          files: [...files],
        });
    }

    private async fileUnits(project: ImpactProject, environment: string, file: string, script: ScriptCoverage) {
      const disk = await readFile(file, "utf8");
      const transformed = await this.transformFile(file, project, environment).catch(() => null);
      const { index, text } = originalSource(file, transformed?.map);
      const original = text ?? disk;
      const tree = await this.tree(file, original);
      const stored = original === disk ? tree : await this.tree(file, disk);
      const byId = new Map(stored.units.map((u) => [u.id, u.hash]));
      const picked: Record<string, string> = {};
      let lost = false;
      const take = (i: number) => {
        const id = tree.units[i]!.id;
        const hash = byId.get(id);
        if (hash === undefined) lost = true;
        else picked[id] = hash;
      };
      take(0);
      const counts = transformed && executedCounts(transformed.code.length, script.functions, script.startOffset ?? 0);
      const hits =
        transformed && counts && !transformed.map && transformed.code === disk
          ? identityHits(tree, disk, counts)
          : transformed?.map && counts && index.length
            ? hitUnits(
                tree,
                original,
                { generated: transformed.code, mappings: transformed.map.mappings, sources: index },
                counts,
              )
            : ({ all: true } as const);
      if (hits.all) tree.units.forEach((_, i) => take(i));
      else for (const i of hits.units) take(i);
      return lost || hits.all ? Object.fromEntries(byId) : picked;
    }
  }

  return new ImpactProvider() as unknown as V8Provider & { records: Map<string, Recorded> };
}

export async function moduleHash(project: ImpactProject, environment: string, id: string): Promise<string> {
  const read = readHash(id);
  if (read !== undefined) return read;
  const env = project.vite.environments[environment];
  const result = await env?.transformRequest(id).catch(() => null);
  return result ? hashText(`module\u0001${stripVersionQueries(stripTrailers(result.code))}`) : UNAVAILABLE;
}
