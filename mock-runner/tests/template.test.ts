import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * The three packages keep their roles:
 * - saastemlycrm-design-system draws any project: it never imports a project or a runner, and
 *   never names a business.
 * - golden-sea-payload-config is the project: it implements the design system's contracts
 *   (`saastemlycrm-design-system/contracts`, pure) and nothing else of it, stays pure (its config
 *   also runs in a service worker or on a server) and defines no UI of its own.
 * - mock-runner runs a project in the browser; a real backend (D1, Workers) can replace it.
 */

const workspace = path.resolve(import.meta.dirname, "../..");
const DS = path.join(workspace, "saastemlycrm-design-system");
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

describe("saastemlycrm-design-system holds no project", () => {
  const dsFiles = [...files(path.join(DS, "src")), ...files(path.join(DS, "vite"))];
  it.each(dsFiles.map((f) => [rel(f), f]))("%s imports no project or runner", (_, file) => {
    const bad = specifiers(readFileSync(file, "utf8")).filter(
      (s) => s.startsWith("golden-sea-payload-config") || s.startsWith("mock-runner") || s.includes("../../golden-sea"),
    );
    expect(bad, "a project reaches the app through startDashboard({ config })").toEqual([]);
  });

  // The business's name, from its seeded `branding` global.
  const brandFile = path.join(GS, "src/seed/globals/branding.json");
  const brand = existsSync(brandFile)
    ? (JSON.parse(readFileSync(brandFile, "utf8")) as { name?: string }).name
    : undefined;
  it.each(dsFiles.map((f) => [rel(f), f]))("%s doesn't name the business", (_, file) => {
    if (!brand) return;
    expect(readFileSync(file, "utf8").includes(brand), `"${brand}" belongs in the project`).toBe(false);
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
