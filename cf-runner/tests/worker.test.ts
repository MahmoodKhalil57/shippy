import path from "node:path";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { seedsFromDir } from "mock-runner/testing";
import { fixture } from "../../mock-runner/tests/fixture/config.ts";
import { D1Store } from "../src/d1-store.ts";
import { seedSql } from "../src/seed-sql.ts";
import { createWorker, type CfEnv } from "../src/worker.ts";
import { migrated } from "./sqlite-d1.ts";

/**
 * cf-runner on SQLite (D1's engine, ./sqlite-d1.ts): the D1 store keeps what the browser's store
 * keeps, the seed SQL starts the database as the browser's backend starts, and the Worker serves
 * the same REST API with a cookie session per browser, its pages as static assets.
 */

const seeds = seedsFromDir(path.join(import.meta.dirname, "../../mock-runner/tests/fixture/seed"));

describe("D1Store", () => {
  it("keeps documents, globals, uploads and bookkeeping as the browser's store does", async () => {
    const db = await migrated();
    const store = new D1Store(db);
    await store.put("posts", { id: "p1", title: "One" });
    await store.put("posts", { id: "p2", title: "Two" });
    await store.put("posts", { id: "p1", title: "One again" });
    // A new store (a new request) reads what the database has.
    const next = new D1Store(db);
    expect((await next.all("posts")).map((d) => d.title)).toEqual(["One again", "Two"]);
    expect(await next.get("posts", "p2")).toEqual({ id: "p2", title: "Two" });
    expect(await next.get("posts", "nope")).toBeUndefined();
    await next.delete("posts", "p2");
    expect((await new D1Store(db).all("posts")).map((d) => d.id)).toEqual(["p1"]);
    // What a store hands out is a copy: changing it changes nothing kept.
    const p1 = (await next.get("posts", "p1"))!;
    p1.title = "changed";
    expect((await next.get("posts", "p1"))!.title).toBe("One again");

    await store.putGlobal("settings", { siteName: "Fixture" });
    expect(await new D1Store(db).getGlobal("settings")).toEqual({ siteName: "Fixture" });
    await store.setMeta("seededAt", "2026-11-24");
    expect(await new D1Store(db).getMeta("seededAt")).toBe("2026-11-24");

    await store.putFile("media", "a.txt", { blob: new Blob(["hello"], { type: "text/plain" }), type: "text/plain" });
    const file = await new D1Store(db).getFile("media", "a.txt");
    expect(file?.type).toBe("text/plain");
    expect(await file?.blob.text()).toBe("hello");
    expect((await store.listFiles()).map((f) => f.filename)).toEqual(["a.txt"]);

    await store.clear();
    expect(await new D1Store(db).all("posts")).toEqual([]);
    expect(await new D1Store(db).getGlobal("settings")).toBeUndefined();
    expect(await new D1Store(db).getMeta("seededAt")).toBe("2026-11-24");
  });
});

describe("the Worker", () => {
  let env: CfEnv & { DB: Awaited<ReturnType<typeof migrated>> };
  const worker = createWorker({ config: fixture });
  const call = async (method: string, url: string, body?: unknown, cookie?: string) => {
    const headers: Record<string, string> = cookie ? { cookie } : {};
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(
      new Request(`https://app.test${url}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
      env,
    );
    const text = await res.text();
    return { status: res.status, res, body: text.startsWith("{") ? JSON.parse(text) : text };
  };

  beforeEach(async () => {
    const db = await migrated();
    await db.exec(await seedSql(fixture, seeds));
    env = { DB: db, ASSETS: { fetch: async () => new Response("<app>") } };
  });

  it("serves the seeded database through the same REST API, localized as asked", async () => {
    const posts = await call("GET", "/api/posts?limit=2");
    expect(posts.status).toBe(200);
    expect(posts.body).toMatchObject({ totalDocs: 5, limit: 2, page: 1 });
    expect((await call("GET", "/api/categories/news?locale=ar")).body.blurb).toBe("ما حدث");
  });

  it("keeps a session per browser in Payload's cookie, and writes that later requests read", async () => {
    const login = await call("POST", "/api/users/login", { email: "ada@fixture.test", password: "secret" });
    expect(login.status).toBe(200);
    const cookie = login.res.headers.get("set-cookie")!.split(";")[0]!;
    expect((await call("GET", "/api/users/me")).body.user).toBeNull();
    expect((await call("GET", "/api/users/me", undefined, cookie)).body.user).toMatchObject({ id: "ada" });
    const created = await call("POST", "/api/categories", { name: "Sport" }, cookie);
    expect(created.status).toBe(201);
    expect((await call("GET", `/api/categories/${created.body.doc.id}`)).body.name).toBe("Sport");
  });

  it("serves the app's pages for everything else, and never the mock's tools", async () => {
    expect((await call("GET", "/collections/posts")).body).toBe("<app>");
    expect((await call("POST", "/api/_mock/reset")).status).toBe(404);
  });

  it("seeds only what the database doesn't have: running the seed again changes nothing people did", async () => {
    const login = await call("POST", "/api/users/login", { email: "ada@fixture.test", password: "secret" });
    const cookie = login.res.headers.get("set-cookie")!.split(";")[0]!;
    await call("PATCH", "/api/categories/news", { name: "Headlines" }, cookie);
    await env.DB.exec(await seedSql(fixture, seeds));
    expect((await call("GET", "/api/categories/news")).body.name).toBe("Headlines");
    await env.DB.exec(await seedSql(fixture, seeds, { reset: true }));
    expect((await call("GET", "/api/categories/news")).body.name).toBe("News");
  });
});
