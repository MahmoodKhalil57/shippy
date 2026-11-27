import { createHash } from "node:crypto";
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { designSystem } from "saastemlycrm-design-system/vite";
import { build, normalizePath, type Plugin, type ResolvedConfig } from "vite-plus";
import {
  CHECKPOINTS_MANIFEST,
  CHECKPOINTS_PATH,
  EMBEDDED_SVG_FILE,
  SVG_FILE,
  boundsOf,
  defaultFrames,
  framesOf,
  layout,
  type CheckpointManifest,
  type ExplodeFrame,
  type PlacedFrame,
} from "../src/explode/pages.ts";
import { captureCheckpoints, SCALE, typeOf } from "./checkpoints.ts";
import { explodeSvg } from "./explode-svg.ts";
import { explodeWatch, type ExplodeWatch } from "./explode-watch.ts";

const SW_ENTRY = path.resolve(import.meta.dirname, "../src/mock/sw.ts");
const PAGES_ROOT = path.resolve(import.meta.dirname, "../src/explode/pages");
const PAGES = ["explode", "explode/frame"];
const pageFile = (page: string) => path.join(PAGES_ROOT, page, "index.html");
const fsUrl = (base: string, file: string) => `${base}@fs/${file.split(path.sep).join("/").replace(/^\//, "")}`;
const BACKEND_MODULE = "virtual:mock-backend";

export interface MockBackendOptions {
  config: string;
  seed: string;
  watch?: string[];
  banner?: string;
  explode?: { frames?: ExplodeFrame[] };
}

const EXPLODE_FILES = new Set([CHECKPOINTS_MANIFEST, SVG_FILE, EMBEDDED_SVG_FILE]);
const isExplodeFile = (rest: string) =>
  EXPLODE_FILES.has(rest) ||
  (rest.startsWith(`${CHECKPOINTS_PATH}/`) && /^[\w.@-]+$/.test(rest.slice(CHECKPOINTS_PATH.length + 1)));

function placeholder(frames: PlacedFrame[]): CheckpointManifest {
  return { builtAt: new Date().toISOString(), source: "dev", deviceScaleFactor: SCALE, ...boundsOf(frames), frames };
}

function backendModule(paths: () => { config: string; seed: string }): Plugin {
  const id = "\0" + BACKEND_MODULE;
  const spec = (p: string) => JSON.stringify(p.split(path.sep).join("/"));
  return {
    name: "mock-runner:backend-module",
    resolveId: (source) => (source === BACKEND_MODULE ? id : null),
    load(source) {
      if (source !== id) return null;
      const { config, seed } = paths();
      return `export { default } from ${spec(config)};\nexport { seedModules } from ${spec(seed)};\n`;
    },
  };
}

export default function mockBackend(options: MockBackendOptions): Plugin[] {
  let config: ResolvedConfig;
  let stamp = Date.now();
  const abs = (p: string) => path.resolve(config.root, p);
  const paths = () => ({ config: abs(options.config), seed: abs(options.seed) });
  const modules = backendModule(paths);
  const explodeFrames = (): PlacedFrame[] => {
    const routes = (process.env.MOCK_EXPLODE_ROUTES ?? "")
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.startsWith("/"));
    return layout(routes.length ? framesOf(routes) : (options.explode?.frames ?? defaultFrames()));
  };
  const explodeCache = (kind: string) => path.join(config.cacheDir, "mock-runner-explode", kind);
  let watch: ExplodeWatch | null = null;

  async function explodeFile(file: string): Promise<{ body: string | Buffer; type: string } | null> {
    if (watch?.ready()) {
      const body = await readFile(path.join(watch.dir, file)).catch(() => null);
      if (body) return { body, type: typeOf(file) };
    }
    if (file.startsWith(`${CHECKPOINTS_PATH}/`)) return null;
    const manifest = placeholder(explodeFrames());
    if (file === CHECKPOINTS_MANIFEST) return { body: JSON.stringify(manifest), type: typeOf(file) };
    return { body: explodeSvg(manifest, () => ""), type: typeOf(file) };
  }

  const watched = () =>
    [
      ...new Set([
        path.dirname(paths().config),
        path.dirname(paths().seed),
        ...(options.watch ?? []).map(abs),
        path.dirname(SW_ENTRY),
      ]),
    ].map((d) => d + path.sep);

  return [
    modules,
    {
      name: "mock-runner:backend",

      hotUpdate() {
        if (this.environment.name === "client") watch?.changed();
      },

      configResolved(resolved) {
        config = resolved;
        resolved.server.fs.allow.push(normalizePath(path.resolve(import.meta.dirname, "..")));
      },

      configureServer(server) {
        const base = server.config.base;
        if (process.env.MOCK_EXPLODE_WATCH === "1") {
          watch = explodeWatch(server, {
            frames: explodeFrames,
            dir: explodeCache("dev"),
            log: (message) => server.config.logger.info(message, { timestamp: true }),
          });
          server.httpServer?.once("close", () => void watch?.close());
        }
        const dirs = watched();
        server.watcher.add(dirs);
        server.watcher.on("all", (_event, file) => {
          if (!dirs.some((d) => path.resolve(file).startsWith(d))) return;
          stamp = Date.now();
          server.ws.send({ type: "full-reload" });
        });
        const entry = fsUrl(base, SW_ENTRY);
        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? "").split("?")[0] ?? "";
          const rest = url.startsWith(base) ? url.slice(base.length) : "";
          if (isExplodeFile(rest)) {
            explodeFile(rest)
              .then((found) => {
                if (!found) {
                  res.statusCode = 404;
                  res.end();
                  return;
                }
                res.setHeader("content-type", found.type);
                res.setHeader("cache-control", "no-cache");
                res.end(found.body);
              })
              .catch(next);
            return;
          }
          const page = PAGES.find((p) => url === `${base}${p}/` || url === `${base}${p}`);
          if (page) {
            if (url === `${base}${page}`) {
              res.statusCode = 302;
              res.setHeader("location", `${base}${page}/${(req.url ?? "").slice(url.length)}`);
              res.end();
              return;
            }
            const file = pageFile(page);
            readFile(file, "utf8")
              .then((html) =>
                html.replace(/(src|href)="(\.[^"]+)"/g, (_m, attr: string, rel: string) => {
                  return `${attr}="${fsUrl(base, path.resolve(path.dirname(file), rel))}"`;
                }),
              )
              .then((html) => server.transformIndexHtml(req.url ?? url, html))
              .then((html) => {
                res.setHeader("content-type", "text/html");
                res.setHeader("cache-control", "no-cache");
                res.end(html);
              })
              .catch(next);
            return;
          }
          if (url === `${base}cms-sw.js`) {
            res.setHeader("content-type", "text/javascript");
            res.setHeader("cache-control", "no-cache");
            res.end(`import "${entry}?v=${stamp}";\n`);
            return;
          }
          next();
        });
      },

      async closeBundle() {
        if (config.command !== "build") return;
        const out = path.resolve(config.root, config.build.outDir);
        const banner = options.banner ? { output: { postBanner: options.banner } } : {};
        await build({
          configFile: false,
          root: PAGES_ROOT,
          base: config.base,
          mode: config.mode,
          envDir: config.envDir,
          envPrefix: config.envPrefix,
          cacheDir: config.cacheDir,
          publicDir: false,
          logLevel: "warn",
          plugins: [...designSystem(), backendModule(paths)],
          build: {
            outDir: out,
            emptyOutDir: false,
            copyPublicDir: false,
            minify: "oxc",
            rollupOptions: { input: Object.fromEntries(PAGES.map((p) => [p, pageFile(p)])), ...banner },
          },
        });
        const worker = (precache: Awaited<ReturnType<typeof precacheOf>> | undefined) =>
          build({
            configFile: false,
            root: config.root,
            base: config.base,
            mode: config.mode,
            envDir: config.envDir,
            envPrefix: config.envPrefix,
            logLevel: "warn",
            plugins: [backendModule(paths)],
            define: { __PRECACHE__: precache ? JSON.stringify(precache) : "undefined" },
            build: {
              outDir: config.build.outDir,
              emptyOutDir: false,
              copyPublicDir: false,
              minify: "oxc",
              rollupOptions: banner,
              lib: {
                entry: SW_ENTRY,
                formats: ["iife"],
                name: "mockBackendWorker",
                fileName: () => "cms-sw.js",
              },
            },
          });
        await captureCheckpoints({
          out,
          base: config.base,
          cache: explodeCache("build"),
          frames: explodeFrames(),
          worker: () => worker(undefined).then(() => undefined),
          log: (message) => config.logger.info(message),
        });
        await worker(await precacheOf(out));
        await copyFile(path.join(out, "index.html"), path.join(out, "404.html"));
        await writeFile(path.join(out, ".nojekyll"), "");
      },
    },
  ];
}

const LATER = /\.(jpe?g|png|webp|avif)$/i;
const EXPLODED = /^explode(\/|\.)/;

async function precacheOf(out: string) {
  const files = (await readdir(out, { recursive: true, withFileTypes: true }))
    .filter((d) => d.isFile())
    .map((d) => path.relative(out, path.join(d.parentPath, d.name)).split(path.sep).join("/"))
    .filter((f) => !["cms-sw.js", "404.html", ".nojekyll"].includes(f) && !EXPLODED.test(f))
    .sort();
  const hash = createHash("sha256");
  for (const f of files) hash.update(f).update(await readFile(path.join(out, f)));
  const later = (f: string) => LATER.test(f) && !f.includes("-thumb.") && !f.startsWith("icons/");
  return {
    version: hash.digest("hex").slice(0, 12),
    core: files.filter((f) => !later(f)),
    later: files.filter(later),
  };
}
