import { beforeEach, describe, expect, it } from "vite-plus/test";
import { backend } from "../backend.ts";
import { people, project } from "../project.ts";

const endpoints = (project.endpoints ?? []).map((e) => {
  const method = String(e.method ?? "get").toUpperCase();
  return [`${method} ${e.path}`, method, e.path.replace(/:[A-Za-z]+/g, "missing")] as const;
});

const everyone = [["nobody", undefined] as const, ...people().map((p) => [p.name ?? p.email, p] as const)];

beforeEach(async () => (await backend()).reset());

describe.each(everyone)("Endpoints for %s", (_, person) => {
  it.each(endpoints)("%s answers without failing", async (_, method, path) => {
    const r = await (await backend()).send(method, path, { as: person, body: method === "GET" ? undefined : {} });
    expect(r.status, JSON.stringify(r.body).slice(0, 300)).toBeLessThan(500);
  });
});
