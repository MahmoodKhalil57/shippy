/// <reference path="./virtual.d.ts" />
import { seedsFromGlob, type BackendConfig } from "mock-runner/server";
import type { CollectionConfig, GlobalConfig } from "payload";
import { config, seedModules } from "virtual:test-runner/project";

export const project: BackendConfig = config;
export const seeds = seedsFromGlob(seedModules);

export function labelOf(value: unknown, locale = "en"): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "function")
    return labelOf((value as (a: { t: (k: string) => string }) => unknown)({ t: (k) => k }), locale);
  if (value && typeof value === "object") {
    const byLocale = value as Record<string, unknown>;
    return labelOf(byLocale[locale] ?? Object.values(byLocale)[0], locale);
  }
  return undefined;
}

export const authCollection = (): CollectionConfig => {
  const slug = project.admin?.user;
  const found = project.collections.find((c) => (slug ? c.slug === slug : !!c.auth));
  if (!found) throw new Error("The config has no collection that people sign in to.");
  return found;
};

export const collectionNamed = (name: string): CollectionConfig => {
  const wanted = name.trim().toLowerCase();
  const found = project.collections.find((c) =>
    [c.slug, labelOf(c.labels?.singular), labelOf(c.labels?.plural)].some((n) => n?.toLowerCase() === wanted),
  );
  if (!found) throw new Error(`No collection is called "${name}".`);
  return found;
};

export const globalNamed = (name: string): GlobalConfig => {
  const wanted = name.trim().toLowerCase();
  const found = (project.globals ?? []).find((g) =>
    [g.slug, labelOf(g.label)].some((n) => n?.toLowerCase() === wanted),
  );
  if (!found) throw new Error(`No global is called "${name}".`);
  return found;
};

export interface Person {
  id: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export const people = (): Person[] =>
  (seeds.collections[authCollection().slug] ?? [])
    .filter((d) => typeof d.email === "string" && typeof d.password === "string")
    .map((d) => d as unknown as Person);

export const personNamed = (who: string): Person => {
  const wanted = who
    .trim()
    .toLowerCase()
    .replace(/^(a|an|the)\s+/, "");
  const found =
    people().find((p) => [p.name, p.email, p.id].some((n) => n?.toLowerCase() === wanted)) ??
    people().find((p) => p.role?.toLowerCase() === wanted);
  if (!found) throw new Error(`No seeded person or role is called "${who}".`);
  return found;
};
