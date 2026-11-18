import type { Engine } from "./engine.ts";
import { text } from "./util.ts";

/**
 * Seed data: `src/cms/seed/<collection>.json` (an array of documents) and
 * `src/cms/seed/globals/<slug>.json`. Documents go through the Local API
 * (hooks, defaults, validation; auth users' `password` is hashed). Give
 * documents an `id` to reference them from relationships in other seeds.
 */
export interface Seeds {
  collections: Record<string, Record<string, unknown>[]>;
  globals: Record<string, Record<string, unknown>>;
}

/** Collects seeds from `import.meta.glob("./seed/**\/*.json", { eager: true })` output. */
export function seedsFromGlob(modules: Record<string, unknown>): Seeds {
  const seeds: Seeds = { collections: {}, globals: {} };
  for (const [path, mod] of Object.entries(modules)) {
    const value = (mod as { default?: unknown }).default ?? mod;
    const name = path
      .split("/")
      .pop()!
      .replace(/\.json$/, "");
    if (/\/globals\/[^/]+\.json$/.test(path)) seeds.globals[name] = value as Record<string, unknown>;
    else seeds.collections[name] = value as Record<string, unknown>[];
  }
  return seeds;
}

/** A short fingerprint of the seed, to tell when it changed since it was loaded. */
export function seedHash(seeds: Seeds): string {
  const text = JSON.stringify(seeds);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
}

/** Replaces the stored data with the seed. (Starts from empty, so an interrupted seed can simply run again.) */
export async function seedStore(engine: Engine, seeds: Seeds) {
  await engine.store.setMeta("seededAt", null);
  await engine.store.clear();
  const context = { seed: true };
  // Auth collections first so other seeds' hooks can look users up.
  const order = [...engine.config.collections].sort((a, b) => Number(!!b.auth) - Number(!!a.auth));
  for (const c of order) {
    for (const data of seeds.collections[c.slug] ?? []) {
      try {
        await engine.create({ collection: c.slug, data, context, depth: 0 });
      } catch (e) {
        console.warn(`[mock backend] seed ${c.slug}/${text(data.id ?? "?")} skipped:`, (e as Error).message, e);
      }
    }
  }
  for (const [slug, data] of Object.entries(seeds.globals)) {
    if (engine.hasGlobal(slug)) await engine.updateGlobal({ slug, data, context, depth: 0 });
  }
  await engine.store.setMeta("seededAt", new Date().toISOString());
  await engine.store.setMeta("seedHash", seedHash(seeds));
}
