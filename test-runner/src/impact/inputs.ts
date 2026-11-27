import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { hashText } from "./normalize.ts";

const LOCKFILES = ["bun.lock", "bun.lockb", "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "package.json"];
const STORYBOOK = [".storybook/preview.ts", ".storybook/main.ts"];
const IMPACT_DIR = import.meta.dirname;

export interface GlobalProject {
  config: { setupFiles: string[]; globalSetup: string[] };
  vite: { config: { configFileDependencies: string[] } };
}

const read = (file: string): string => {
  try {
    return readFileSync(file).toString("base64");
  } catch {
    return "missing";
  }
};

function playwright(root: string): string {
  const from = createRequire(path.join(root, "package.json"));
  const parts: string[] = [];
  for (const name of ["playwright-core/package.json", "playwright-core/browsers.json", "playwright/package.json"]) {
    try {
      parts.push(name, readFileSync(from.resolve(name), "utf8"));
    } catch {
      parts.push(name, "missing");
    }
  }
  return parts.join("\u0001");
}

export function globalFiles(
  root: string,
  configFile: string | undefined,
  projects: readonly GlobalProject[],
): string[] {
  const files = new Set<string>();
  const add = (file: string) => files.add(path.normalize(path.resolve(root, file)));
  for (const name of LOCKFILES) if (existsSync(path.join(root, name))) add(name);
  for (const name of readdirSync(root)) if (/^tsconfig.*\.json$/.test(name) || /^\.env(\.|$)/.test(name)) add(name);
  for (const name of STORYBOOK) add(name);
  if (configFile) add(configFile);
  for (const project of projects) {
    for (const file of project.vite.config.configFileDependencies) add(file);
    for (const file of [...project.config.setupFiles, ...project.config.globalSetup]) add(file);
  }
  for (const name of readdirSync(IMPACT_DIR))
    if (name.endsWith(".ts") && !name.endsWith(".test.ts")) add(path.join(IMPACT_DIR, name));
  return [...files].sort();
}

export function globalHash(root: string, files: readonly string[]): string {
  const parts = files.map((file) => `${path.relative(root, file).split(path.sep).join("/")}\u0001${read(file)}`);
  parts.push(`node\u0001${process.version}`, `playwright\u0001${playwright(root)}`);
  return hashText(parts.join("\u0002"));
}

export const ownHash = (file: string): string => hashText(`test\u0001${read(file)}`);
