import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * The three packages keep their roles:
 * - saastemlycrm-design-system draws any project: it imports neither other package and never
 *   names a business.
 * - mock-runner is a Payload-compatible backend for any config: it imports neither other package
 *   and never names a business. A real backend (D1, Workers) can replace it.
 * - golden-sea-payload-config is the project and its app. Its config (src/) implements the design
 *   system's contracts (`/contracts`, `/payload`, pure) and nothing else, stays pure (it also runs
 *   in a service worker or on a server) and defines no UI. Only its app entry (app/), its
 *   vite.config.ts and its tests join the dashboard and the backend.
 */

const workspace = path.resolve(import.meta.dirname, "../..");
const DS = path.join(workspace, "saastemlycrm-design-system");
const MR = path.join(workspace, "mock-runner");
const GS = path.join(workspace, "golden-sea-payload-config");

const files = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) return e.name === "node_modules" ? [] : files(p);
        return /\.(ts|css)$/.test(e.name) ? [p] : [];
      })
    : [];
const rel = (f: string) => path.relative(workspace, f).split(path.sep).join("/");
const specifiers = (source: string) =>
  [...source.matchAll(/(?:from\s+|import\s+|import\(\s*)["']([^"']+)["']/g)].map((m) => m[1]!);

/** Imports of the other two packages (by name, or by a relative path out of the package). */
const foreign = (file: string, own: string, others: string[]) =>
  specifiers(readFileSync(file, "utf8")).filter(
    (s) =>
      others.some((o) => s === o || s.startsWith(`${o}/`)) ||
      (s.startsWith(".") && !path.resolve(path.dirname(file), s).startsWith(own + path.sep)),
  );

// The business's name, from its seeded `branding` global.
const brandFile = path.join(GS, "src/seed/globals/branding.json");
const brand = existsSync(brandFile)
  ? (JSON.parse(readFileSync(brandFile, "utf8")) as { name?: string }).name
  : undefined;

describe("saastemlycrm-design-system stands alone", () => {
  const dsFiles = [...files(path.join(DS, "src")), ...files(path.join(DS, "vite")), ...files(path.join(DS, "lint"))];
  it.each(dsFiles.map((f) => [rel(f), f]))("%s imports neither other package", (_, file) => {
    expect(
      foreign(file, DS, ["golden-sea-payload-config", "mock-runner"]),
      "a project hands itself over with startDashboard({ config })",
    ).toEqual([]);
  });
  it.each(dsFiles.map((f) => [rel(f), f]))("%s doesn't name the business", (_, file) => {
    if (!brand) return;
    expect(readFileSync(file, "utf8").includes(brand), `"${brand}" belongs in the project`).toBe(false);
  });
});

describe("mock-runner stands alone", () => {
  const mrFiles = [
    ...files(path.join(MR, "src")),
    ...files(path.join(MR, "plugins")),
    ...files(path.join(MR, "tests")),
  ];
  it.each(mrFiles.map((f) => [rel(f), f]))("%s imports neither other package", (_, file) => {
    expect(
      foreign(file, MR, ["golden-sea-payload-config", "saastemlycrm-design-system"]),
      "an app passes its config with mockBackend({ config, seed })",
    ).toEqual([]);
  });
  it.each(mrFiles.map((f) => [rel(f), f]))("%s doesn't name the business", (_, file) => {
    if (!brand) return;
    expect(readFileSync(file, "utf8").includes(brand), `"${brand}" belongs in the project`).toBe(false);
  });
  it("depends on neither other package", () => {
    const pkg = JSON.parse(readFileSync(path.join(MR, "package.json"), "utf8")) as Record<
      string,
      Record<string, string>
    >;
    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    expect(
      Object.keys(deps).filter((d) => d === "golden-sea-payload-config" || d === "saastemlycrm-design-system"),
    ).toEqual([]);
  });
});

describe("golden-sea-payload-config implements the contracts", () => {
  it.each(files(path.join(GS, "src")).map((f) => [rel(f), f]))("%s", (_, file) => {
    const source = readFileSync(file, "utf8");
    const bad = specifiers(source).filter(
      (s) =>
        // Only the design system's pure contracts and Payload helpers.
        (s.startsWith("saastemlycrm-design-system") &&
          !/^saastemlycrm-design-system\/(?:contracts|payload)$/.test(s)) ||
        s === "lit" ||
        s.startsWith("lit/") ||
        s.startsWith("mock-runner") ||
        // Relative imports stay inside the package.
        (s.startsWith(".") && !path.resolve(path.dirname(file), s).startsWith(GS + path.sep)),
    );
    expect(bad, "use saastemlycrm-design-system/contracts (pure); UI belongs in the design system").toEqual([]);
    expect(/customElement\(|customElements\.define/.test(source), "UI belongs in a block or the design system").toBe(
      false,
    );
  });
});
