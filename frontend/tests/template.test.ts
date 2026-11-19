import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import config from "../src/cms/config.ts";

/**
 * The repository is a template: the project lives in src/cms (data model, endpoints, views,
 * dashboard settings, seed), and everything else draws it. These checks keep it that way:
 * - the app, the agent and the design system import from src/cms only the client, the config,
 *   its types and the mock runtime, never a project's endpoints, collections, views or settings;
 * - none of them names the business (its brand name, from `admin.custom.branding`).
 * A screen that needs project logic is a view endpoint in src/cms/views; a widget the view
 * vocabulary can't draw is a project element in src/cms/components.
 */

const src = path.resolve(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.(ts|css)$/.test(e.name) ? [p] : [];
  });
const rel = (f: string) => path.relative(src, f).split(path.sep).join("/");
const outsideCms = files(src).filter((f) => !rel(f).startsWith("cms/"));

/** The parts of src/cms the app may use: the client, the config and its types, the mock runtime. */
const ALLOWED = /^cms\/(?:client\.ts|config\.ts|types\.ts|runtime\/|seed\/\*\.json|sw\.ts)/;

describe("the app draws the project; it holds none of it", () => {
  it.each(outsideCms.map((f) => [rel(f), f]))("%s imports only the CMS's client, config and types", (_, file) => {
    const source = readFileSync(file, "utf8");
    const imports = [...source.matchAll(/(?:from\s+|import\s*\(?\s*|import\.meta\.glob[^(]*\(\s*)["']([^"']+)["']/g)]
      .map((m) => m[1]!)
      .filter((p) => p.startsWith("."))
      .map((p) => rel(path.resolve(path.dirname(file), p)))
      .filter((p) => p.startsWith("cms/"));
    // The view host loads the project's own blocks (src/cms/components): the one plug-in point.
    const bad = imports.filter(
      (p) => !ALLOWED.test(p) && !(rel(file) === "app/view/view.ts" && p === "cms/components/*.ts"),
    );
    expect(bad, "move this into src/cms (a view endpoint, a setting) or read it from the config").toEqual([]);
  });

  const brand = config.admin?.custom?.branding?.name;
  it.each(outsideCms.map((f) => [rel(f), f]))("%s doesn't name the business", (_, file) => {
    if (!brand) return;
    expect(readFileSync(file, "utf8").includes(brand), `"${brand}" belongs in src/cms`).toBe(false);
  });
});
