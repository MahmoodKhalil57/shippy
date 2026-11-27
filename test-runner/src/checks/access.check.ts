import { beforeEach, describe, expect, it } from "vite-plus/test";
import { backend } from "../backend.ts";
import { people, project, type Person } from "../project.ts";

type Allowed = Record<string, Record<string, { permission: boolean }>>;
interface Permissions {
  collections: Allowed;
  globals: Allowed;
}

const permissionsOf = async (person?: Person) =>
  (await (await backend()).send("GET", "/access", { as: person })).body as Permissions;

const everyone = [["nobody", undefined] as const, ...people().map((p) => [p.name ?? p.email, p] as const)];

beforeEach(async () => (await backend()).reset());

describe.each(everyone)("Signed in as %s", (_, person) => {
  it.each(project.collections.map((c) => [c.slug]))("lists %s only when allowed", async (slug) => {
    const allowed = (await permissionsOf(person)).collections[slug]!.read!.permission;
    const r = await (await backend()).send("GET", `/${slug}?limit=1&depth=0`, { as: person });
    expect(r.status).toBe(allowed ? 200 : 403);
  });

  it.each((project.globals ?? []).map((g) => [g.slug]))("reads the %s global only when allowed", async (slug) => {
    const allowed = (await permissionsOf(person)).globals[slug]!.read!.permission;
    const r = await (await backend()).send("GET", `/globals/${slug}?depth=0`, { as: person });
    expect(r.status).toBe(allowed ? 200 : 403);
  });
});
