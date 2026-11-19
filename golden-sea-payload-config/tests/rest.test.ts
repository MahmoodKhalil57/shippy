import { beforeEach, describe, expect, it } from "vite-plus/test";
import { MemoryStore } from "mock-runner/testing";
import type { MockConfig } from "saastemlycrm-design-system/contracts";
import { backend, call, config, login as signIn, seeds } from "./backend.ts";

/**
 * Golden Sea's collections, globals and access rules over the REST API (as the Service Worker
 * serves it): its data, hooks, validation and per-role rules. The engine's own behaviour is
 * tested in mock-runner with a fixture config.
 */

const login = (email = "karim.balbaa@goldensea.test", password = "demo1234") => signIn(email, password);

beforeEach(() => {
  backend.reset();
});

describe("REST: reading", () => {
  it("finds with Payload's paginated shape, default sort and depth", async () => {
    const { status, body } = await call("GET", "/api/cases?limit=3");
    expect(status).toBe(200);
    expect(body).toMatchObject({ totalDocs: 10, limit: 3, totalPages: 4, page: 1, hasNextPage: true, nextPage: 2 });
    expect(body.docs).toHaveLength(3);
    // defaultSort: deadline (ascending)
    const deadlines: string[] = body.docs.map((d: { deadline: string }) => d.deadline);
    expect([...deadlines].sort((a, b) => a.localeCompare(b))).toEqual(deadlines);
    // depth 2 by default populates relationships
    expect(body.docs[0].customer).toMatchObject({ id: expect.any(String), name: expect.any(String) });
  });

  it("supports where (qs syntax), sort, limit=0 and depth=0", async () => {
    const q = "where[stage][not_in]=Lost,Expired&where[owner][equals]=ky&sort=-value&limit=0&depth=0";
    const { body } = await call("GET", `/api/cases?${q}`);
    expect(body.docs.map((d: { caseId: string }) => d.caseId)).toEqual([
      "GS-RFQ-0139",
      "GS-RFQ-0140",
      "GS-RFQ-0142",
      "GS-RFQ-0136",
    ]);
    expect(body.docs[0].customer).toBe("atlas");
    const or = await call(
      "GET",
      "/api/cases?where[or][0][urgent][equals]=true&where[or][1][tone][equals]=danger&depth=0",
    );
    expect(or.body.totalDocs).toBe(2);
    const like = await call("GET", "/api/suppliers?where[name][like]=marine delta");
    expect(like.body.docs.map((d: { name: string }) => d.name)).toEqual(["Delta Marine Stores"]);
    const nested = await call("GET", "/api/cases?where[lines.blocked][greater_than]=0&depth=0");
    expect(nested.body.docs.map((d: { caseId: string }) => d.caseId)).toEqual(["GS-RFQ-0142"]);
    const inArray = await call("GET", "/api/cases?where[quoteLines.supplier][equals]=S4&depth=0");
    expect(inArray.body.totalDocs).toBe(1);
  });

  it("finds by id, counts, 404s", async () => {
    expect((await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body.caseId).toBe("GS-RFQ-0142");
    expect((await call("GET", "/api/cases/count?where[owner][equals]=sa")).body).toEqual({ totalDocs: 4 });
    const missing = await call("GET", "/api/cases/nope");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ errors: [{ name: "NotFound", message: "Not Found" }] });
  });

  it("select: only the chosen fields (and id), or all but the excluded ones", async () => {
    const only = await call("GET", "/api/cases?select[caseId]=true&select[customer]=true&depth=0&limit=2");
    expect(Object.keys(only.body.docs[0]).sort()).toEqual(["caseId", "customer", "id"]);
    const without = await call("GET", "/api/cases/gs-rfq-0142?select[lines]=false&depth=0");
    expect(without.body).not.toHaveProperty("lines");
    expect(without.body.caseId).toBe("GS-RFQ-0142");
  });

  it("populate: the fields of populated documents, per collection", async () => {
    const { body } = await call(
      "GET",
      "/api/cases/gs-rfq-0142?depth=1&select[customer]=true&populate[customers][name]=true",
    );
    expect(Object.keys(body.customer).sort()).toEqual(["id", "name"]);
  });

  it("joins: related documents of a join field, counted, filtered, or skipped", async () => {
    const all = await call("GET", "/api/vessels?depth=0&limit=0");
    const atlas = all.body.docs.filter((v: { customer: string }) => v.customer === "atlas");
    const { body } = await call(
      "GET",
      "/api/customers/atlas?depth=0&joins[vessels][count]=true&joins[vessels][limit]=1",
    );
    expect(body.vessels).toMatchObject({ totalDocs: atlas.length, hasNextPage: atlas.length > 1 });
    expect(atlas.length).toBeGreaterThan(0);
    expect(body.vessels.docs).toEqual([expect.any(String)]); // depth 0: ids
    const populated = await call("GET", "/api/customers/atlas?depth=1");
    expect(populated.body.vessels.docs[0]).toMatchObject({ customer: expect.anything(), name: expect.any(String) });
    expect((await call("GET", "/api/customers/atlas?joins=false")).body).not.toHaveProperty("vessels");
    expect((await call("GET", "/api/customers/atlas?select[name]=true")).body).not.toHaveProperty("vessels");
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
});

describe("REST: writing", () => {
  it("creates with defaults, hooks and Payload's message; anonymous writes are forbidden", async () => {
    const data = {
      customer: "nordvik",
      vessel: "MV Test",
      deadline: "2026-12-01T12:00:00.000Z",
      nextAction: "Quote",
      owner: "ky",
    };
    expect((await call("POST", "/api/cases", data)).status).toBe(403);
    await login();
    const { status, body } = await call("POST", "/api/cases?depth=0", data);
    expect(status).toBe(201);
    expect(body.message).toBe("Case successfully created.");
    expect(body.doc).toMatchObject({
      caseId: "GS-RFQ-0143", // beforeValidate hook
      stage: "New", // defaultValue
      urgent: false,
      lines: { ready: 0, waiting: 0, blocked: 0, noOffer: 0 }, // group defaults
      id: expect.stringMatching(/^[0-9a-f]{24}$/),
      createdAt: expect.any(String),
    });
  });

  it("validates like Payload (required, options, min, unique)", async () => {
    await login();
    const { status, body } = await call("POST", "/api/cases", { vessel: "x", stage: "Nope", value: -1, owner: "ky" });
    expect(status).toBe(400);
    expect(body.errors[0].name).toBe("ValidationError");
    expect(body.errors[0].message).toMatch(/^The following fields are invalid: /);
    expect(body.errors[0].data.errors.map((e: { path: string }) => e.path).sort()).toEqual(
      ["customer", "deadline", "nextAction", "stage", "value"].sort(),
    );
    const dup = await call("POST", "/api/customers", { name: "Atlas Tankers" });
    expect(dup.body.errors[0].data.errors).toEqual([{ path: "name", message: "Value must be unique" }]);
  });

  it("updates (partial, groups merge, arrays keep row ids) and deletes", async () => {
    await login();
    const before = (await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body;
    const { body } = await call("PATCH", "/api/cases/gs-rfq-0142?depth=0", {
      stage: "Sourcing",
      lines: { blocked: 0 },
      unknownField: "dropped",
    });
    expect(body.message).toBe("Updated successfully.");
    expect(body.doc.stage).toBe("Sourcing");
    expect(body.doc.lines).toEqual({ ...before.lines, blocked: 0 });
    expect(body.doc).not.toHaveProperty("unknownField");
    expect(body.doc.quoteLines.map((r: { id: string }) => r.id)).toEqual(
      before.quoteLines.map((r: { id: string }) => r.id),
    );
    expect(body.doc.updatedAt > before.updatedAt).toBe(true);

    const bulk = await call("PATCH", "/api/cases?where[owner][equals]=ah", { urgent: true });
    expect(bulk.body.docs).toHaveLength(2);
    expect(bulk.body.message).toBe("Updated 2 Cases successfully.");

    // Only management may delete cases.
    expect((await call("DELETE", "/api/cases/gs-rfq-0130")).body.message).toBe("Case successfully deleted.");
    await login("soaad.amer@goldensea.test");
    expect((await call("DELETE", "/api/cases/gs-rfq-0131")).status).toBe(403);
  });

  it("globals: read anonymously, update with permission", async () => {
    expect((await call("GET", "/api/globals/settings")).body).toMatchObject({
      companyName: "Golden Sea",
      marginFloor: 15,
    });
    expect((await call("POST", "/api/globals/settings", { marginFloor: 12 })).status).toBe(403);
    await login();
    const { body } = await call("POST", "/api/globals/settings", { marginFloor: 12 });
    expect(body.result.marginFloor).toBe(12);
  });
});

describe("REST: filterOptions", () => {
  it("rejects a relationship value its filterOptions don't allow, accepts one they do", async () => {
    await login();
    const { body } = await call("GET", "/api/products?limit=1&depth=0");
    const id = body.docs[0].id as string;
    // products.agency: only suppliers of kind "agency" (S10); S1 is a local supplier.
    const bad = await call("PATCH", `/api/products/${id}`, { agency: "S1" });
    expect(bad.status).toBe(400);
    expect(JSON.stringify(bad.body)).toContain("invalid selections: S1");
    const good = await call("PATCH", `/api/products/${id}`, { agency: "S10" });
    expect(good.status).toBe(200);
  });
});

describe("REST: auth, endpoints, uploads, mock tools", () => {
  it("session behaves like Payload's cookie: me, logout, Authorization header", async () => {
    expect((await call("GET", "/api/users/me")).body).toEqual({ user: null });
    const { body } = await login("karim.youssef@goldensea.test");
    expect((await call("GET", "/api/users/me")).body.user).toMatchObject({ id: "ky", collection: "users" });
    await call("POST", "/api/users/logout");
    expect((await call("GET", "/api/users/me")).body).toEqual({ user: null });
    const viaHeader = await call("GET", "/api/users/me", undefined, { authorization: `JWT ${body.token}` });
    expect(viaHeader.body.user.id).toBe("ky");
    expect((await login("karim.youssef@goldensea.test", "wrong")).status).toBe(401);
    expect((await call("GET", "/api/users/init")).body).toEqual({ initialized: true });
  });

  it("serves collection custom endpoints", async () => {
    const summary = await call("GET", "/api/cases/gs-rfq-0142/summary");
    expect(summary.body.summary).toBe(
      "GS-RFQ-0142 · Nordvik Ship Management · MV Aurora Crest: Comparing offers. Next: Select offers & price lines 1–5.",
    );
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
    await call("DELETE", "/api/cases/gs-rfq-0130");
    const exported = await call("GET", "/api/_mock/export");
    expect(exported.res.headers.get("content-disposition")).toMatch(/attachment/);
    expect(exported.body.collections.cases).toHaveLength(9);
    await call("POST", "/api/_mock/reset");
    expect((await call("GET", "/api/cases/count")).body.totalDocs).toBe(10);
    await call("POST", "/api/_mock/import", exported.body);
    expect((await call("GET", "/api/cases/count")).body.totalDocs).toBe(9);
    expect((await call("GET", "/api/_mock/status")).body).toMatchObject({ seedChanged: false, counts: { cases: 9 } });
  });
});

describe("config", () => {
  it("is a real Payload config", () => {
    const c: MockConfig = config;
    expect(c.collections.map((x) => x.slug).slice(0, 5)).toEqual(["cases", "customers", "suppliers", "users", "media"]);
    expect(c.collections).toHaveLength(32);
    expect(c.globals).toHaveLength(10);
  });
});

describe("seed top-up", () => {
  it("adds seed documents a store has never loaded (e.g. users added to the seed later)", async () => {
    const store = new MemoryStore();
    const users = seeds.collections.users ?? [];
    const older = {
      ...seeds,
      collections: { ...seeds.collections, users: users.filter((u) => u.email !== "mohamed.helmy@goldensea.test") },
    };
    await backend.reset({ store, seeds: older }).ready();
    // The seed has grown since: starting again tops the store up, keeping what was there.
    backend.reset({ store });
    const { status, body } = await login("mohamed.helmy@goldensea.test");
    expect(status).toBe(200);
    expect(body.user).toMatchObject({ email: "mohamed.helmy@goldensea.test", role: "finance-director" });
  });
});

describe("role dashboards (GET /api/home)", () => {
  // oxlint-disable-next-line typescript/no-explicit-any
  const kinds = (body: any) => body.widgets.map((w: { kind: string; id: string }) => `${w.kind}:${w.id}`);

  it("needs a signed-in user", async () => {
    expect((await call("GET", "/api/home")).status).toBe(401);
  });

  it("puts the approver's decisions first, and only theirs", async () => {
    await login("karim.balbaa@goldensea.test");
    const { body } = await call("GET", "/api/home");
    expect(body).toMatchObject({ role: "management", greeting: "Good morning, Karim" });
    expect(kinds(body)[0]).toBe("lists:decisions");
    const decisions = body.widgets[0].lists[0].items.map((i: { title: string }) => i.title);
    expect(decisions.length).toBeGreaterThan(0);
    // The finance director already decided the bank change; the CEO still has to.
    await login("mohamed.helmy@goldensea.test");
    const fd = (await call("GET", "/api/home")).body;
    expect(fd.widgets[0].lists[0].items.every((i: { title: string }) => !/bank/i.test(i.title))).toBe(true);
  });

  it("gives each role its own day, and never sends Sales a value", async () => {
    const seen = new Set<string>();
    for (const email of [
      "karim.youssef@goldensea.test",
      "soaad.amer@goldensea.test",
      "ahmedy@goldensea.test",
      "esraa.mohamed@goldensea.test",
    ]) {
      await login(email);
      seen.add(kinds((await call("GET", "/api/home")).body).join());
    }
    expect(seen.size).toBe(4);
    await login("soaad.amer@goldensea.test");
    const sales = (await call("GET", "/api/home")).body;
    const queue = sales.widgets.find((w: { kind: string }) => w.kind === "queue");
    expect(queue.value).toBe(false);
    expect(queue.cases.every((c: { value?: number }) => c.value === undefined)).toBe(true);
    expect(JSON.stringify(sales)).not.toMatch(/Gross profit|EGP \d/);
  });
});

describe("per-user notifications and bookmarks", () => {
  it("each user sees only their own, seeded for every user", async () => {
    const users = ["ky", "kb", "sa", "ah", "mh", "em", "ne"];
    const emails: Record<string, string> = {
      ky: "karim.youssef@goldensea.test",
      kb: "karim.balbaa@goldensea.test",
      sa: "soaad.amer@goldensea.test",
      ah: "ahmedy@goldensea.test",
      mh: "mohamed.helmy@goldensea.test",
      em: "esraa.mohamed@goldensea.test",
      ne: "nancy.elsobhy@goldensea.test",
    };
    for (const id of users) {
      await login(emails[id]);
      for (const slug of ["notifications", "bookmarks"]) {
        const { body } = await call("GET", `/api/${slug}?limit=0&depth=0`);
        expect(body.docs.length, `${id} ${slug}`).toBeGreaterThan(0);
        expect(body.docs.every((d: { user: string }) => d.user === id)).toBe(true);
      }
    }
    // Someone else's notification can't be read or marked read.
    await login(emails.sa);
    expect([403, 404]).toContain((await call("GET", "/api/notifications/n-kb-1")).status);
    expect([403, 404]).toContain((await call("PATCH", "/api/notifications/n-kb-1", { read: true })).status);
    await login(emails.kb);
    expect((await call("GET", "/api/notifications/n-kb-1")).body.read).toBe(false);
    await login(emails.sa);
    // A new bookmark belongs to whoever made it.
    const { body } = await call("POST", "/api/bookmarks", { label: "Invoices", href: "/collections/invoices" });
    expect(body.doc.user.id ?? body.doc.user).toBe("sa");
  });
});
