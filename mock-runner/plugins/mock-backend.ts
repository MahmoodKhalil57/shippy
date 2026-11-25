import { createHash } from "node:crypto";
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, type Plugin, type ResolvedConfig } from "vite-plus";

const SW_ENTRY = path.resolve(import.meta.dirname, "../src/mock/sw.ts");
const BACKEND_MODULE = "virtual:mock-backend";

export interface MockBackendOptions {
  config: string;
  seed: string;
  watch?: string[];
  banner?: string;
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

      configResolved(resolved) {
        config = resolved;
      },

      configureServer(server) {
        const base = server.config.base;
        const dirs = watched();
        server.watcher.add(dirs);
        server.watcher.on("all", (_event, file) => {
          if (!dirs.some((d) => path.resolve(file).startsWith(d))) return;
          stamp = Date.now();
          server.ws.send({ type: "full-reload" });
        });
        const entry = `${base}@fs/${SW_ENTRY.split(path.sep).join("/").replace(/^\//, "")}`;
        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? "").split("?")[0];
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
        await build({
          configFile: false,
          root: config.root,
          base: config.base,
          mode: config.mode,
          envDir: config.envDir,
          envPrefix: config.envPrefix,
          logLevel: "warn",
          plugins: [backendModule(paths)],
          define: { __PRECACHE__: JSON.stringify(await precacheOf(out)) },
          build: {
            outDir: config.build.outDir,
            emptyOutDir: false,
            copyPublicDir: false,
            minify: "oxc",
            rollupOptions: options.banner ? { output: { postBanner: options.banner } } : undefined,
            lib: {
              entry: SW_ENTRY,
              formats: ["iife"],
              name: "mockBackendWorker",
              fileName: () => "cms-sw.js",
            },
          },
        });
        await copyFile(path.join(out, "index.html"), path.join(out, "404.html"));
        await writeFile(path.join(out, ".nojekyll"), "");
      },
    },
  ];
}

const LATER = /\.(jpe?g|png|webp|avif)$/i;

async function precacheOf(out: string) {
  const files = (await readdir(out, { recursive: true, withFileTypes: true }))
    .filter((d) => d.isFile())
    .map((d) => path.relative(out, path.join(d.parentPath, d.name)).split(path.sep).join("/"))
    .filter((f) => !["cms-sw.js", "404.html", ".nojekyll"].includes(f))
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
