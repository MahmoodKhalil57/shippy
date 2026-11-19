import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * The repository is a template: the project lives in src/cms (collections, globals, endpoints,
 * widgets, seed), and everything else draws it: the app (src/app), the agent (src/agent), the
 * design system (src/components, src/styles) and the in-browser backend (src/mock). These checks
 * keep it that way:
 * - code outside src/cms imports from it only the config (and the seed, for demo sign-in), never
 *   a project's endpoints, collections or widgets;
 * - none of it names the business (its brand, from the seeded `branding` global);
 * - src/cms uses only the pure parts of the template (the widget vocabulary, the config types,
 *   the mock runtime), because the config also runs in the service worker, and defines no custom
 *   elements: anything the widget vocabulary can't draw becomes a generic block or a
 *   design-system component.
 */

const src = path.resolve(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.(ts|css)$/.test(e.name) ? [p] : [];
  });
const rel = (f: string) => path.relative(src, f).split(path.sep).join("/");
const outsideCms = files(src).filter((f) => !rel(f).startsWith("cms/"));

/** The parts of src/cms the rest may use: the config and the seed (demo sign-in, the mock backend). */
const ALLOWED = /^cms\/(?:config\.ts|seed\/)/;

describe("the app draws the project; it holds none of it", () => {
  it.each(outsideCms.map((f) => [rel(f), f]))("%s imports only the CMS's config", (_, file) => {
    const source = readFileSync(file, "utf8");
    const imports = [...source.matchAll(/(?:from\s+|import\s*\(?\s*|import\.meta\.glob[^(]*\(\s*)["']([^"']+)["']/g)]
      .map((m) => m[1]!)
      .filter((p) => p.startsWith("."))
      .map((p) => rel(path.resolve(path.dirname(file), p)))
      .filter((p) => p.startsWith("cms/"));
    const bad = imports.filter((p) => !ALLOWED.test(p));
    expect(bad, "move this into src/cms (an endpoint, a widget, a setting) or read it from the config").toEqual([]);
  });

  // The config (collections, endpoints, widgets) also runs in the service worker, so the CMS uses
  // only the app's pure widget vocabulary, and defines no UI of its own.
  const cmsFiles = files(path.join(src, "cms"));
  it.each(cmsFiles.map((f) => [rel(f), f]))("%s uses only the pure widget vocabulary from the app", (_, file) => {
    const source = readFileSync(file, "utf8");
    const bad = [...source.matchAll(/(?:from\s+|import\s+)["']([^"']+)["']/g)]
      .map((m) => m[1]!)
      .filter((p) => p.startsWith("."))
      .map((p) => rel(path.resolve(path.dirname(file), p)))
      .filter(
        (p) =>
          !p.startsWith("cms/") &&
          !/^app\/widgets\/(?:schema|widget)\.ts$/.test(p) &&
          !/^mock\/(?:types\.ts|runtime\/)/.test(p),
      );
    expect(bad, "widget code must stay pure (no UI imports): it also runs in the service worker").toEqual([]);
    expect(/customElement\(|customElements\.define/.test(source), "UI belongs in a block or the design system").toBe(
      false,
    );
  });

  // The business's name, from its seeded `branding` global (src/cms/seed/globals/branding.json).
  const brandFile = path.join(src, "cms/seed/globals/branding.json");
  const brand = existsSync(brandFile)
    ? (JSON.parse(readFileSync(brandFile, "utf8")) as { name?: string }).name
    : undefined;
  it.each(outsideCms.map((f) => [rel(f), f]))("%s doesn't name the business", (_, file) => {
    if (!brand) return;
    expect(readFileSync(file, "utf8").includes(brand), `"${brand}" belongs in src/cms`).toBe(false);
  });
});
