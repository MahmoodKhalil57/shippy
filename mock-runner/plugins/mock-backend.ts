import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { build, type Plugin, type ResolvedConfig } from "vite-plus";

/**
 * Serves and builds the in-browser mock backend (src/mock) for the project's config:
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
const PROJECT_MODULE = "virtual:mock-project";

/**
 * `virtual:mock-project`: the project the runner serves (its config, seed modules and seed users),
 * so the app and the worker import it without naming it.
 */
function projectModule(project: string): Plugin {
  const id = "\0" + PROJECT_MODULE;
  return {
    name: "mock-runner:project",
    resolveId: (source) => (source === PROJECT_MODULE ? id : null),
    load: (source) =>
      source === id
        ? `export { default } from "${project}";
export { seedModules, seedUsers } from "${project}/seed";
`
        : null,
  };
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/**
 * The in-browser backend for `project` (a Payload config package exporting its config as default
 * and `./seed` with `seedModules` and `seedUsers`). The site's public files are the project's
 * (`<project>/public`), and the page's title and description come from its seeded `branding`
 * global (`<project>/seed/branding.json`) when it has one.
 */
export default function mockBackend(options: { project: string }): Plugin[] {
  const require = createRequire(import.meta.url);
  const projectDir = path.dirname(require.resolve(`${options.project}/package.json`));
  /** Edits here change what the worker serves: the project and the runtime. */
  const BACKEND_DIRS = [
    path.join(projectDir, "src") + path.sep,
    path.resolve(import.meta.dirname, "../src/mock") + path.sep,
  ];
  let branding: { name?: string; description?: string } = {};
  try {
    branding = JSON.parse(readFileSync(require.resolve(`${options.project}/seed/branding.json`), "utf8"));
  } catch {
    // No branding seed: the page keeps its neutral title.
  }
  let config: ResolvedConfig;
  let stamp = Date.now();

  return [
    projectModule(options.project),
    {
      name: "mock-runner:backend",

      config: () => ({ publicDir: path.join(projectDir, "public") }),

      transformIndexHtml(html) {
        let out = html;
        if (branding.name) out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(branding.name)}</title>`);
        if (branding.description)
          out = out.replace(
            /(<meta\s+name="description"\s+content=")[^"]*(")/,
            `$1${escapeHtml(branding.description)}$2`,
          );
        return out;
      },

      configResolved(resolved) {
        config = resolved;
      },

      configureServer(server) {
        const base = server.config.base;
        server.watcher.add(BACKEND_DIRS);
        server.watcher.on("all", (_event, file) => {
          if (!BACKEND_DIRS.some((d) => path.resolve(file).startsWith(d))) return;
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
          plugins: [projectModule(options.project)],
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
