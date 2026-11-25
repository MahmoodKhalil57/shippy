import type { Engine } from "./engine.ts";
import { withSeedLocales } from "./locales.ts";
import { text } from "../../payload/index.ts";

export interface Seeds {
  collections: Record<string, Record<string, unknown>[]>;
  globals: Record<string, Record<string, unknown>>;
}

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

export function seedHash(seeds: Seeds): string {
  const text = JSON.stringify(seeds);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
}

export async function seedStore(engine: Engine, seeds: Seeds) {
  await engine.store.setMeta("seededAt", null);
  await engine.store.clear();
  const context = { seed: true };
  const order = [...engine.config.collections].sort((a, b) => Number(!!b.auth) - Number(!!a.auth));
  for (const c of order) {
    for (const data of seeds.collections[c.slug] ?? []) {
      try {
        await engine.create({ collection: c.slug, data, context, depth: 0, locale: "all" });
      } catch (e) {
        console.warn(`[mock backend] seed ${c.slug}/${text(data.id ?? "?")} skipped:`, (e as Error).message, e);
      }
    }
  }
  for (const [slug, data] of Object.entries(seeds.globals)) {
    if (engine.hasGlobal(slug)) await engine.updateGlobal({ slug, data, context, depth: 0, locale: "all" });
  }
  await engine.store.setMeta("seededIds", seedIds(seeds));
  await engine.store.setMeta("seededAt", new Date().toISOString());
  await engine.store.setMeta("seedHash", seedHash(seeds));
}

function seedIds(seeds: Seeds): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(seeds.collections).map(([slug, docs]) => [
      slug,
      docs.filter((d) => d.id != null).map((d) => text(d.id)),
    ]),
  );
}

export async function topUpSeed(engine: Engine, seeds: Seeds) {
  if ((await engine.store.getMeta<string>("seedHash")) === seedHash(seeds)) return;
  const loaded = (await engine.store.getMeta<Record<string, string[]>>("seededIds")) ?? {};
  const context = { seed: true };
  const order = [...engine.config.collections].sort((a, b) => Number(!!b.auth) - Number(!!a.auth));
  const added: string[] = [];
  for (const c of order) {
    const known = new Set(loaded[c.slug] ?? []);
    for (const data of seeds.collections[c.slug] ?? []) {
      if (data.id == null) continue;
      const id = text(data.id);
      const stored = await engine.store.get(c.slug, id);
      if (stored) {
        const next = withSeedLocales(engine.fields(c.slug), stored, data, engine.config.localization);
        if (next) {
          await engine.store.put(c.slug, next);
          added.push(`${c.slug}/${id} (languages)`);
        }
        continue;
      }
      if (known.has(id)) continue;
      try {
        await engine.create({ collection: c.slug, data, context, depth: 0, locale: "all" });
        added.push(`${c.slug}/${id}`);
      } catch (e) {
        console.warn(`[mock backend] seed ${c.slug}/${id} skipped:`, (e as Error).message, e);
      }
    }
  }
  for (const [slug, data] of Object.entries(seeds.globals)) {
    if (!engine.hasGlobal(slug)) continue;
    let stored = await engine.store.getGlobal(slug);
    const translated = stored && withSeedLocales(engine.globalFields(slug), stored, data, engine.config.localization);
    if (translated) {
      await engine.store.putGlobal(slug, translated);
      stored = translated;
      added.push(`globals/${slug} (languages)`);
    }
    const missing = stored ? Object.fromEntries(Object.entries(data).filter(([k]) => stored[k] === undefined)) : data;
    if (!Object.keys(missing).length) continue;
    try {
      await engine.updateGlobal({ slug, data: missing, context, depth: 0, locale: "all" });
      added.push(stored ? `globals/${slug} (${Object.keys(missing).join(", ")})` : `globals/${slug}`);
    } catch (e) {
      console.warn(`[mock backend] seed globals/${slug} skipped:`, (e as Error).message, e);
    }
  }
  if (added.length) console.info(`[mock backend] added ${added.length} new seed documents:`, added.join(", "));
  await engine.store.setMeta("seededIds", seedIds(seeds));
  await engine.store.setMeta("seedHash", seedHash(seeds));
}
