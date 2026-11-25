import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { seedsFromGlob, type Seeds } from "./mock/runtime/seed.ts";

export function seedsFromDir(dir: string): Seeds {
  const modules: Record<string, unknown> = {};
  for (const f of readdirSync(dir, { recursive: true }) as string[]) {
    if (f.endsWith(".json"))
      modules[`./seed/${f.split(path.sep).join("/")}`] = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
  }
  return seedsFromGlob(modules);
}
