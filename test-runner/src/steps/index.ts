import type { Doc, FieldLike } from "mock-runner/server";
import type { CollectionConfig, GlobalConfig } from "payload";
import { BeforeAll, defineParameterType, Given, QuickPickleWorld, setWorldConstructor, Then } from "quickpickle";
import { expect } from "vite-plus/test";
import { backend, type Backend, type Reply } from "../backend.ts";
import { everyField, optionValues } from "../fields.ts";
import { collectionNamed, globalNamed, labelOf, personNamed, project, type Person } from "../project.ts";

export class BusinessWorld extends QuickPickleWorld {
  backend!: Backend;
  person?: Person;
  reply?: Reply;

  override async init() {
    await super.init();
    this.backend = await backend();
    this.backend.reset();
  }

  async send(method: string, path: string, body?: unknown): Promise<Reply> {
    this.reply = await this.backend.send(method, path, { body, as: this.person });
    return this.reply;
  }

  async record(collection: CollectionConfig, title: string): Promise<Doc> {
    const by = collection.admin?.useAsTitle ?? "id";
    const name = labelOf(collection.labels?.singular) ?? collection.slug;
    const found = await this.backend.engine.find({
      collection: collection.slug,
      where: { or: [{ [by]: { equals: title } }, { id: { equals: title } }] },
      limit: 2,
      depth: 0,
    });
    const docs = (found as { docs: Doc[] }).docs;
    if (!docs.length) throw new Error(`There is no ${name} "${title}".`);
    if (docs.length > 1) throw new Error(`More than one ${name} is called "${title}". Name it by its id instead.`);
    return docs[0]!;
  }

  message(): string {
    const body = this.reply?.body as { message?: string; errors?: { message?: string }[] } | null;
    return body?.message ?? body?.errors?.[0]?.message ?? "";
  }
}

setWorldConstructor(BusinessWorld);

BeforeAll(async () => {
  await backend();
});

const SPECIAL = new Set("\\^$.*+?()[]{}|/");
const anyCase = (name: string) =>
  Array.from(name)
    .map((ch) => {
      if (ch.toLowerCase() !== ch.toUpperCase()) return `[${ch.toLowerCase()}${ch.toUpperCase()}]`;
      return SPECIAL.has(ch) ? `\\${ch}` : ch;
    })
    .join("");

const alternatives = (names: (string | undefined)[]) =>
  new RegExp(
    [...new Set(names.filter((n): n is string => !!n).map((n) => n.toLowerCase()))]
      .sort((a, b) => b.length - a.length)
      .map(anyCase)
      .join("|"),
  );

defineParameterType({
  name: "collection",
  regexp: alternatives(
    project.collections.flatMap((c) => [c.slug, labelOf(c.labels?.singular), labelOf(c.labels?.plural)]),
  ),
  transformer: (name: string) => collectionNamed(name),
});

defineParameterType({
  name: "global",
  regexp: alternatives((project.globals ?? []).flatMap((g) => [g.slug, labelOf(g.label)])),
  transformer: (name: string) => globalNamed(name),
});

const owners: (CollectionConfig | GlobalConfig)[] = [...project.collections, ...(project.globals ?? [])];

defineParameterType({
  name: "field",
  regexp: alternatives(
    owners.flatMap((o) =>
      everyField(o.fields as unknown as FieldLike[]).flatMap(({ path, field }) => [path, labelOf(field.label)]),
    ),
  ),
  transformer: (name: string) => name,
});

const nameOf = (owner: CollectionConfig | GlobalConfig) =>
  ("labels" in owner ? labelOf(owner.labels?.singular) : labelOf((owner as GlobalConfig).label)) ?? owner.slug;

export function fieldNamed(owner: CollectionConfig | GlobalConfig, name: string): FieldLike & { path: string } {
  const wanted = name.toLowerCase();
  const fields = everyField(owner.fields as unknown as FieldLike[]);
  const depth = (path: string) => path.split(".").length;
  const found =
    fields.find(({ path }) => path.toLowerCase() === wanted) ??
    fields
      .filter(({ field }) => labelOf(field.label)?.toLowerCase() === wanted)
      .sort((a, b) => depth(a.path) - depth(b.path))[0];
  if (!found) throw new Error(`${nameOf(owner)} has no field called "${name}".`);
  return { ...found.field, path: found.path };
}

function stored(field: FieldLike, value: string): unknown {
  const option = (field.options ?? []).find(
    (o) => typeof o !== "string" && labelOf(o.label)?.toLowerCase() === value.toLowerCase(),
  );
  if (option && typeof option !== "string") return option.value;
  if (field.type === "number") return Number(value);
  if (field.type === "checkbox") return value === "yes" || value === "true";
  return value;
}

async function shown(world: BusinessWorld, field: FieldLike, value: unknown): Promise<string[]> {
  if (field.type === "checkbox") return value ? ["yes", "true"] : ["no", "false"];
  const target =
    (field.type === "relationship" || field.type === "upload") && typeof field.relationTo === "string"
      ? project.collections.find((c) => c.slug === field.relationTo)
      : undefined;
  if (target) {
    const ids = [value].flat().filter((v): v is string => typeof v === "string");
    const by = target.admin?.useAsTitle ?? "id";
    const titles = await Promise.all(
      ids.map(async (id) => {
        const doc = await world.backend.engine.findByID({
          collection: target.slug,
          id,
          depth: 0,
          disableErrors: true,
        });
        const title = doc?.[by];
        return typeof title === "string" || typeof title === "number" ? String(title) : id;
      }),
    );
    return [...ids, titles.join(", ")];
  }
  const option = (field.options ?? []).find((o) => typeof o !== "string" && o.value === value);
  const label = option && typeof option !== "string" ? labelOf(option.label) : undefined;
  return [String(value), ...(label ? [label] : []), ...optionValues(field).filter((v) => v === value)];
}

const valueAt = (doc: Record<string, unknown>, path: string) =>
  path.split(".").reduce<unknown>((v, k) => (v as Record<string, unknown> | undefined)?.[k], doc);

const expectShown = async (world: BusinessWorld, field: FieldLike, value: unknown, wanted: string) => {
  const seen = await shown(world, field, value);
  expect(seen.map((v) => v.toLowerCase())).toContain(wanted.toLowerCase());
};

Given("I am signed in as {string}", (world: BusinessWorld, who: string) => {
  world.person = personNamed(who);
});

Given("I am not signed in", (world: BusinessWorld) => {
  world.person = undefined;
});

Given(
  "the {collection} {string} has its {field} set to {string}",
  async (world: BusinessWorld, c: CollectionConfig, title: string, name: string, value: string) => {
    const doc = await world.record(c, title);
    const field = fieldNamed(c, name);
    const data = field.path.split(".").reduceRight<unknown>((v, k) => ({ [k]: v }), stored(field, value));
    await world.backend.engine.update({
      collection: c.slug,
      id: doc.id,
      data: data as Record<string, unknown>,
      context: { seed: true },
    });
  },
);

Then(
  "the {collection} {string} has {field} {string}",
  async (world: BusinessWorld, c: CollectionConfig, title: string, name: string, value: string) => {
    const doc = await world.record(c, title);
    const field = fieldNamed(c, name);
    await expectShown(world, field, valueAt(doc, field.path), value);
  },
);

Then(
  "the {global} has {field} {string}",
  async (world: BusinessWorld, g: GlobalConfig, name: string, value: string) => {
    const doc = await world.backend.engine.findGlobal({ slug: g.slug, depth: 0 });
    const field = fieldNamed(g, name);
    await expectShown(world, field, valueAt(doc, field.path), value);
  },
);

Then("there is no {collection} {string}", async (world: BusinessWorld, c: CollectionConfig, title: string) => {
  await expect(world.record(c, title)).rejects.toThrow(/^There is no /);
});

Then("I am told {string}", (world: BusinessWorld, message: string) => {
  expect(world.reply?.status, world.message()).toBeLessThan(400);
  expect(world.message()).toBe(message);
});

Then("I am stopped with {string}", (world: BusinessWorld, message: string) => {
  expect(world.reply?.status).toBeGreaterThanOrEqual(400);
  expect(world.reply?.status).toBeLessThan(500);
  expect(world.message()).toBe(message);
});

Then("I am not allowed", (world: BusinessWorld) => {
  expect([401, 403]).toContain(world.reply?.status);
});

export { Given, Then, When } from "quickpickle";
export type { Backend, Reply } from "../backend.ts";
export { collectionNamed, globalNamed, personNamed, type Person } from "../project.ts";
