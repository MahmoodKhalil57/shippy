import { createHash } from "node:crypto";
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, type Plugin, type ResolvedConfig } from "vite-plus";

/**
 * Serves and builds the in-browser backend (src/mock) for a Payload config, inside the app that
 * uses it. The app names its config and seed modules; this package names no project:
 *
 * - `<base>cms-sw.js`, the Service Worker. In dev it's a tiny module that imports src/mock/sw.ts
 *   through Vite (stamped, so editing the config or runtime installs a new worker and reloads the
 *   page). In `vp build` it's bundled into one classic script next to the app.
 *
 * The build also writes the worker's offline precache (`__PRECACHE__`, see src/mock/sw.ts): every
 * built file, versioned by a hash of their contents; full-size background photos are cached
 * after the app has started rather than before.
 *
 * Deep links into the dashboard (`<base>collections/cases/123`) load index.html through Vite's
 * SPA fallback in dev / preview, and through the worker once it's installed (so static hosting
 * works too).
 */

/** The worker's entry, in this package. */
const SW_ENTRY = path.resolve(import.meta.dirname, "../src/mock/sw.ts");
const BACKEND_MODULE = "virtual:mock-backend";

export interface MockBackendOptions {
  /** A module whose default export is the Payload config (relative to the app's root). */
  config: string;
  /** A module exporting `seedModules` (`import.meta.glob` of the seed's JSON files). */
  seed: string;
  /** More folders whose edits change what the worker serves (the config's and seed's folders always do). */
  watch?: string[];
  /** A legal banner kept at the top of the built worker (the app passes its own, naming no business here). */
  banner?: string;
}

/** `virtual:mock-backend`: the config and seed the worker serves (absolute paths). */
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

/**
 * The in-browser backend for an app: the worker serves the Payload REST API for the app's
 * `config` and `seed`. The app registers it with `startMockBackend()` from `mock-runner/client`
 * before it talks to `/api`.
 */
export default function mockBackend(options: MockBackendOptions): Plugin[] {
  let config: ResolvedConfig;
  let stamp = Date.now();
  const abs = (p: string) => path.resolve(config.root, p);
  const paths = () => ({ config: abs(options.config), seed: abs(options.seed) });
  const modules = backendModule(paths);
  /** Edits here change what the worker serves: the app's config and seed, and the runtime. */
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
        // The worker's source lives in this package: Vite serves it through `/@fs/`.
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
          logLevel: "warn",
          plugins: [backendModule(paths)],
          define: { __PRECACHE__: JSON.stringify(await precacheOf(out)) },
          build: {
            outDir: config.build.outDir,
            emptyOutDir: false,
            copyPublicDir: false,
            // This sub-build takes no config file, so it inherits nothing: set the production
            // hardening here too. oxc minifies and mangles identifiers and tree-shakes; the app's
            // legal banner is kept on top of the worker, which ships the whole engine and config.
            minify: "oxc",
            // `postBanner` is kept after minification (plain `banner` is minified away).
            rollupOptions: options.banner ? { output: { postBanner: options.banner } } : undefined,
            lib: {
              entry: SW_ENTRY,
              formats: ["iife"],
              name: "mockBackendWorker",
              fileName: () => "cms-sw.js",
            },
          },
        });
        // Static hosting (GitHub Pages): a first visit to a deep link (before the worker is
        // installed) gets the 404 page, so make that the dashboard too; and serve every file as is.
        await copyFile(path.join(out, "index.html"), path.join(out, "404.html"));
        await writeFile(path.join(out, ".nojekyll"), "");
      },
    },
  ];
}

/** Big images the app can start without: background photos (their `-thumb` previews stay core). */
const LATER = /\.(jpe?g|png|webp|avif)$/i;

/** The built files to cache for offline use, relative to the output folder, plus their version. */
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
