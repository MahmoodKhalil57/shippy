import { createHash } from "node:crypto";
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, type Plugin, type ResolvedConfig } from "vite-plus";

/**
 * Serves and builds the in-browser mock backend (src/cms):
 *
 * - `<base>cms-sw.js`, the Service Worker. In dev it's a tiny module that
 *   imports src/mock/sw.ts through Vite (stamped, so editing the config or
 *   runtime installs a new worker and reloads the page). In `vp build` it's
 *   bundled into one classic script next to the app.
 *
 * The build also writes the worker's offline precache (`__PRECACHE__`, see src/mock/sw.ts): every
 * built file, versioned by a hash of their contents; full-size background photos are cached
 * after the app has started rather than before.
 *
 * Deep links into the dashboard (`<base>collections/cases/123`) load index.html
 * through Vite's SPA fallback in dev / preview, and through the worker once
 * it's installed (so static hosting works too).
 */

const SW_ENTRY = "src/mock/sw.ts";
const CMS_DIR = `${path.sep}src${path.sep}cms${path.sep}`;

export default function mockBackend(): Plugin {
  let config: ResolvedConfig;
  let stamp = Date.now();

  return {
    name: "shippy:mock-backend",

    configResolved(resolved) {
      config = resolved;
    },

    configureServer(server) {
      const base = server.config.base;
      server.watcher.on("all", (_event, file) => {
        if (!path.resolve(file).includes(CMS_DIR)) return;
        stamp = Date.now();
        server.ws.send({ type: "full-reload" });
      });
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        if (url === `${base}cms-sw.js`) {
          res.setHeader("content-type", "text/javascript");
          res.setHeader("cache-control", "no-cache");
          res.end(`import "${base}${SW_ENTRY}?v=${stamp}";\n`);
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
        define: { __PRECACHE__: JSON.stringify(await precacheOf(out)) },
        build: {
          outDir: config.build.outDir,
          emptyOutDir: false,
          copyPublicDir: false,
          lib: {
            entry: path.resolve(config.root, SW_ENTRY),
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
  };
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
