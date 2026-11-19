import path from "node:path";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { matches, sortDocs } from "../src/payload/index.ts";
import type { BackendConfig } from "../src/types.ts";
import type { Where } from "payload";
import { MemoryStore, seedsFromDir, testBackend } from "../src/testing.ts";
import { fixture } from "./fixture/config.ts";

/** The mock backend, exercised through its REST API like the Service Worker serves it, on a fixture config. */

const seeds = seedsFromDir(path.join(import.meta.dirname, "fixture/seed"));
const backend = testBackend(fixture, seeds);
const { call } = backend;
const login = (user = "ada", password = "secret") => backend.login(`${user}@fixture.test`, password);

beforeEach(() => {
  backend.reset();
});

describe("REST: reading", () => {
  it("finds with Payload's paginated shape, default sort and depth", async () => {
    const { status, body } = await call("GET", "/api/posts?limit=2");
    expect(status).toBe(200);
    expect(body).toMatchObject({ totalDocs: 5, limit: 2, totalPages: 3, page: 1, hasNextPage: true, nextPage: 2 });
    expect(body.docs).toHaveLength(2);
    // defaultSort: published (ascending)
    expect(body.docs.map((d: { id: string }) => d.id)).toEqual(["p4", "p2"]);
    // depth 2 by default populates relationships (those the user may read: users need a login)
    expect(body.docs[0].category).toMatchObject({ id: "news", name: "News" });
    expect(body.docs[0].author).toBe("ada");
    await login();
    expect((await call("GET", "/api/posts?limit=1")).body.docs[0].author).toMatchObject({ id: "ada", name: "Ada" });
  });

  it("supports where (qs syntax), sort, limit=0 and depth=0", async () => {
    const q = "where[status][not_in]=draft&where[author][equals]=bob&sort=-views&limit=0&depth=0";
    const { body } = await call("GET", `/api/posts?${q}`);
    expect(body.docs.map((d: { ref: string }) => d.ref)).toEqual(["P-0002", "P-0005"]);
    expect(body.docs[0].author).toBe("bob");
    const or = await call("GET", "/api/posts?where[or][0][featured][equals]=true&where[or][1][views][greater_than]=30");
    expect(or.body.totalDocs).toBe(2);
    const like = await call("GET", "/api/posts?where[title][like]=guide marine");
    expect(like.body.docs.map((d: { title: string }) => d.title)).toEqual(["Marine stores guide"]);
    const nested = await call("GET", "/api/posts?where[meta.likes][greater_than]=2&depth=0");
    expect(nested.body.docs.map((d: { id: string }) => d.id)).toEqual(["p1"]);
    const inArray = await call("GET", "/api/posts?where[tags.label][equals]=supply&depth=0");
    expect(inArray.body.totalDocs).toBe(1);
  });

  it("finds by id, counts, 404s", async () => {
    expect((await call("GET", "/api/posts/p2?depth=0")).body.ref).toBe("P-0002");
    expect((await call("GET", "/api/posts/count?where[author][equals]=bob")).body).toEqual({ totalDocs: 3 });
    const missing = await call("GET", "/api/posts/nope");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ errors: [{ name: "NotFound", message: "Not Found" }] });
  });

  it("select: only the chosen fields (and id), or all but the excluded ones", async () => {
    const only = await call("GET", "/api/posts?select[ref]=true&select[category]=true&depth=0&limit=2");
    expect(Object.keys(only.body.docs[0]).sort()).toEqual(["category", "id", "ref"]);
    const without = await call("GET", "/api/posts/p2?select[meta]=false&depth=0");
    expect(without.body).not.toHaveProperty("meta");
    expect(without.body.ref).toBe("P-0002");
  });

  it("populate: the fields of populated documents, per collection", async () => {
    const { body } = await call("GET", "/api/posts/p2?depth=1&select[category]=true&populate[categories][name]=true");
    expect(Object.keys(body.category).sort()).toEqual(["id", "name"]);
  });

  it("joins: related documents of a join field, counted, filtered, or skipped", async () => {
    const { body } = await call("GET", "/api/categories/news?depth=0&joins[posts][count]=true&joins[posts][limit]=1");
    expect(body.posts).toMatchObject({ totalDocs: 3, hasNextPage: true });
    expect(body.posts.docs).toEqual([expect.any(String)]); // depth 0: ids
    const populated = await call("GET", "/api/categories/news?depth=1");
    expect(populated.body.posts.docs[0]).toMatchObject({ category: expect.anything(), title: expect.any(String) });
    expect((await call("GET", "/api/categories/news?joins=false")).body).not.toHaveProperty("posts");
    expect((await call("GET", "/api/categories/news?select[name]=true")).body).not.toHaveProperty("posts");
  });

  it("applies access control: users need a login; password hashes never leak", async () => {
    const anonymous = await call("GET", "/api/users");
    expect(anonymous.status).toBe(403);
    const { body } = await login();
    expect(body.message).toBe("Auth Passed");
    expect(body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    const users = await call("GET", "/api/users");
    expect(users.status).toBe(200);
    expect(users.body.docs[0]).not.toHaveProperty("hash");
    expect(users.body.docs[0]).not.toHaveProperty("salt");
  });

  it("access returning a query: each user reads and edits only their own documents", async () => {
    for (const user of ["ada", "bob", "cy"]) {
      await login(user);
      const { body } = await call("GET", "/api/notes?limit=0&depth=0");
      expect(body.docs.length, user).toBeGreaterThan(0);
      expect(body.docs.every((d: { owner: string }) => d.owner === user)).toBe(true);
    }
    await login("bob");
    expect([403, 404]).toContain((await call("GET", "/api/notes/n-ada-1")).status);
    expect([403, 404]).toContain((await call("PATCH", "/api/notes/n-ada-1", { read: true })).status);
    await login("ada");
    expect((await call("GET", "/api/notes/n-ada-1")).body.read).toBe(false);
    await login("bob");
    // A beforeChange hook makes a new note belong to whoever made it.
    const { body } = await call("POST", "/api/notes", { text: "Mine" });
    expect(body.doc.owner.id ?? body.doc.owner).toBe("bob");
  });
});

describe("REST: writing", () => {
  it("creates with defaults, hooks and Payload's message; anonymous writes are forbidden", async () => {
    const data = { title: "New post", published: "2026-02-01T12:00:00.000Z", category: "guides" };
    expect((await call("POST", "/api/posts", data)).status).toBe(403);
    await login();
    const { status, body } = await call("POST", "/api/posts?depth=0", data);
    expect(status).toBe(201);
    expect(body.message).toBe("Post successfully created.");
    expect(body.doc).toMatchObject({
      ref: "P-0006", // beforeValidate hook
      status: "draft", // defaultValue
      featured: false,
      meta: { words: 0, likes: 0 }, // group defaults
      id: expect.stringMatching(/^[0-9a-f]{24}$/),
      createdAt: expect.any(String),
    });
  });

  it("validates like Payload (required, options, min, unique)", async () => {
    await login();
    const { status, body } = await call("POST", "/api/posts", { status: "Nope", views: -1 });
    expect(status).toBe(400);
    expect(body.errors[0].name).toBe("ValidationError");
    expect(body.errors[0].message).toMatch(/^The following fields are invalid: /);
    expect(body.errors[0].data.errors.map((e: { path: string }) => e.path).sort()).toEqual(
      ["category", "published", "status", "title", "views"].sort(),
    );
    const dup = await call("POST", "/api/categories", { name: "News" });
    expect(dup.body.errors[0].data.errors).toEqual([{ path: "name", message: "Value must be unique" }]);
  });

  it("updates (partial, groups merge, arrays keep row ids) and deletes", async () => {
    await login();
    const before = (await call("GET", "/api/posts/p2?depth=0")).body;
    const { body } = await call("PATCH", "/api/posts/p2?depth=0", {
      status: "draft",
      meta: { likes: 5 },
      unknownField: "dropped",
    });
    expect(body.message).toBe("Updated successfully.");
    expect(body.doc.status).toBe("draft");
    expect(body.doc.meta).toEqual({ ...before.meta, likes: 5 });
    expect(body.doc).not.toHaveProperty("unknownField");
    expect(body.doc.tags.map((r: { id: string }) => r.id)).toEqual(before.tags.map((r: { id: string }) => r.id));
    expect(body.doc.updatedAt > before.updatedAt).toBe(true);

    const bulk = await call("PATCH", "/api/posts?where[author][equals]=ada", { featured: true });
    expect(bulk.body.docs).toHaveLength(2);
    expect(bulk.body.message).toBe("Updated 2 Posts successfully.");

    // Only admins may delete posts.
    expect((await call("DELETE", "/api/posts/p4")).body.message).toBe("Post successfully deleted.");
    await login("bob");
    expect((await call("DELETE", "/api/posts/p3")).status).toBe(403);
  });

  it("globals: read anonymously, update with permission", async () => {
    expect((await call("GET", "/api/globals/settings")).body).toMatchObject({ siteName: "Fixture site", perPage: 10 });
    expect((await call("POST", "/api/globals/settings", { perPage: 20 })).status).toBe(403);
    await login("bob");
    expect((await call("POST", "/api/globals/settings", { perPage: 20 })).status).toBe(403);
    await login();
    const { body } = await call("POST", "/api/globals/settings", { perPage: 20 });
    expect(body.result.perPage).toBe(20);
  });
});

describe("REST: filterOptions", () => {
  it("rejects a relationship value its filterOptions don't allow, accepts one they do", async () => {
    await login();
    // posts.category: only categories of kind "topic"; weekly is a series.
    const bad = await call("PATCH", "/api/posts/p1", { category: "weekly" });
    expect(bad.status).toBe(400);
    expect(JSON.stringify(bad.body)).toContain("invalid selections: weekly");
    const good = await call("PATCH", "/api/posts/p1", { category: "guides" });
    expect(good.status).toBe(200);
  });
});

describe("REST: auth, endpoints, uploads, mock tools", () => {
  it("session behaves like Payload's cookie: me, logout, Authorization header", async () => {
    expect((await call("GET", "/api/users/me")).body).toEqual({ user: null });
    const { body } = await login("bob");
    expect((await call("GET", "/api/users/me")).body.user).toMatchObject({ id: "bob", collection: "users" });
    await call("POST", "/api/users/logout");
    expect((await call("GET", "/api/users/me")).body).toEqual({ user: null });
    const viaHeader = await call("GET", "/api/users/me", undefined, { authorization: `JWT ${body.token}` });
    expect(viaHeader.body.user.id).toBe("bob");
    expect((await login("bob", "wrong")).status).toBe(401);
    expect((await call("GET", "/api/users/init")).body).toEqual({ initialized: true });
  });

  it("serves collection and root custom endpoints", async () => {
    const summary = await call("GET", "/api/posts/p2/summary");
    expect(summary.body.summary).toBe("P-0002: Marine stores guide (Guides)");
    // Root-level endpoint, with route params, the Local API and the logged-in user.
    const withRoot: BackendConfig = {
      ...fixture,
      endpoints: [
        {
          path: "/authors/:id/published",
          method: "get",
          handler: async (req) => {
            const where = { author: { equals: req.routeParams?.id }, status: { not_in: ["draft"] } };
            const { totalDocs } = await req.payload.count({ collection: "posts" as never, where });
            return Response.json({ author: req.routeParams?.id, published: totalDocs, by: req.user?.id ?? null });
          },
        },
      ],
    };
    backend.reset({ config: withRoot });
    await login("bob");
    expect((await call("GET", "/api/authors/bob/published")).body).toEqual({ author: "bob", published: 2, by: "bob" });
  });

  it("stores and serves uploads (multipart with _payload, like Payload's admin)", async () => {
    await login();
    const form = new FormData();
    form.append("file", new File(["hello"], "note one.txt", { type: "text/plain" }));
    form.append("_payload", JSON.stringify({ alt: "A note" }));
    const { status, body } = await call("POST", "/api/media", form);
    expect(status).toBe(201);
    expect(body.doc).toMatchObject({ filename: "note-one.txt", mimeType: "text/plain", filesize: 5, alt: "A note" });
    expect(body.doc.url).toBe("/api/media/file/note-one.txt");
    const file = await call("GET", body.doc.url);
    expect(file.body).toBe("hello");
  });

  it("exports, resets to seed and imports", async () => {
    await login();
    await call("DELETE", "/api/posts/p3");
    const exported = await call("GET", "/api/_mock/export");
    expect(exported.res.headers.get("content-disposition")).toMatch(/attachment/);
    expect(exported.body.collections.posts).toHaveLength(4);
    await call("POST", "/api/_mock/reset");
    expect((await call("GET", "/api/posts/count")).body.totalDocs).toBe(5);
    await call("POST", "/api/_mock/import", exported.body);
    expect((await call("GET", "/api/posts/count")).body.totalDocs).toBe(4);
    expect((await call("GET", "/api/_mock/status")).body).toMatchObject({ seedChanged: false, counts: { posts: 4 } });
  });
});

describe("query semantics", () => {
  const docs = [
    { id: "1", n: 3, tags: ["a", "b"], g: { x: "hi" }, d: "2026-01-02T00:00:00.000Z" },
    { id: "2", n: 10, tags: ["c"], g: { x: "yo" }, d: "2026-01-01T00:00:00.000Z" },
  ];
  it("matches operators and coerces query-string values", () => {
    const ids = (w: Where) => docs.filter((d) => matches(d, w)).map((d) => d.id);
    expect(ids({ n: { greater_than: "5" } })).toEqual(["2"]);
    expect(ids({ tags: { in: "a,c" } })).toEqual(["1", "2"]);
    expect(ids({ tags: { not_in: ["a"] } })).toEqual(["2"]);
    expect(ids({ tags: { all: ["a", "b"] } })).toEqual(["1"]);
    expect(ids({ "g.x": { contains: "Y" } })).toEqual(["2"]);
    expect(ids({ d: { less_than: "2026-01-01T12:00:00.000Z" } })).toEqual(["2"]);
    expect(ids({ missing: { exists: "false" } })).toEqual(["1", "2"]);
  });
  it("sorts by several keys", () => {
    expect(sortDocs(docs, "-n").map((d) => d.id)).toEqual(["2", "1"]);
    expect(sortDocs(docs, ["d"]).map((d) => d.id)).toEqual(["2", "1"]);
  });
});

describe("seed top-up", () => {
  it("adds seed documents a store has never loaded (e.g. users added to the seed later)", async () => {
    const store = new MemoryStore();
    const users = seeds.collections.users ?? [];
    const older = { ...seeds, collections: { ...seeds.collections, users: users.filter((u) => u.id !== "cy") } };
    await backend.reset({ store, seeds: older }).ready();
    // The seed has grown since: starting again tops the store up, keeping what was there.
    backend.reset({ store });
    const { status, body } = await login("cy");
    expect(status).toBe(200);
    expect(body.user).toMatchObject({ email: "cy@fixture.test", role: "editor" });
  });

  it("loads the fixture seed without validation errors", async () => {
    await login();
    for (const [slug, docs] of Object.entries(seeds.collections)) {
      const visible = slug === "notes" ? docs.filter((d) => d.owner === "ada") : docs;
      expect((await call("GET", `/api/${slug}/count`)).body.totalDocs, slug).toBe(visible.length);
    }
  });
});
