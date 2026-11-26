import { describe, expect, it } from "vite-plus/test";
import { ApiError } from "../api/errors.ts";
import type { Doc } from "../contracts/config.ts";
import { memoryData } from "./memory.ts";

const doc = (id: string, extra: Record<string, unknown> = {}) => ({ id, ...extra }) as Doc;

describe("memoryData", () => {
  it("finds with where, sort, limit and page, and counts", async () => {
    const data = memoryData({
      docs: { invoices: [doc("a", { n: 3 }), doc("b", { n: 1 }), doc("c", { n: 2 })] },
    });
    const sorted = await data.find("invoices", { sort: "n" });
    expect(sorted.docs.map((d) => d.id)).toEqual(["b", "c", "a"]);
    const paged = await data.find("invoices", { sort: "-n", limit: 2, page: 2 });
    expect(paged.docs.map((d) => d.id)).toEqual(["b"]);
    expect(paged.totalDocs).toBe(3);
    const all = await data.find("invoices", { limit: 0 });
    expect(all.docs).toHaveLength(3);
    expect((await data.find("invoices")).docs).toHaveLength(3);
    expect((await data.find("missing")).docs).toEqual([]);
    expect(await data.count("invoices", { n: { greater_than: 1 } })).toEqual({ totalDocs: 2 });
    expect(data.calls.map((c) => c.method)).toEqual(["find", "find", "find", "find", "find", "count"]);
  });

  it("reads, creates, updates and deletes documents without sharing objects with callers", async () => {
    const data = memoryData({ docs: { notes: [doc("a", { text: "first" })] } });
    const read = await data.findByID("notes", "a");
    read.text = "changed outside";
    expect((await data.findByID("notes", "a", { depth: 0 })).text).toBe("first");
    const made = await data.create("notes", { text: "second" });
    expect(made.doc).toMatchObject({ id: "doc-1", text: "second" });
    expect(made.doc.createdAt).toBe(made.doc.updatedAt);
    expect((await data.create("notes", { id: "fixed", text: "third" })).doc.id).toBe("fixed");
    expect((await data.update("notes", "a", { text: "edited" })).doc.text).toBe("edited");
    expect((await data.delete("notes", "a")).doc.id).toBe("a");
    expect((await data.deleteMany("notes", { text: { equals: "second" } })).docs.map((d) => d.id)).toEqual(["doc-1"]);
    expect((await data.find("notes")).docs.map((d) => d.id)).toEqual(["fixed"]);
    await expect(data.findByID("notes", "a")).rejects.toMatchObject({ status: 404 });
  });

  it("reads and updates globals", async () => {
    const data = memoryData({ globals: { branding: { name: "Workspace" } } });
    expect(await data.findGlobal("branding", { depth: 0 })).toEqual({ name: "Workspace" });
    expect((await data.updateGlobal("branding", { icon: "grid" })).result).toEqual({ name: "Workspace", icon: "grid" });
    expect((await data.updateGlobal("fresh", { on: true })).result).toEqual({ on: true });
    await expect(data.findGlobal("missing")).rejects.toBeInstanceOf(ApiError);
  });

  it("signs people in and out, and registers the first user", async () => {
    const data = memoryData({
      users: [{ collection: "users", email: "Ana@example.com", password: "secret", doc: doc("u1", { name: "Ana" }) }],
      initialized: false,
    });
    expect(await data.me("users")).toEqual({ user: null });
    await expect(data.login("users", "ana@example.com", "wrong")).rejects.toMatchObject({ status: 401 });
    expect((await data.login("users", "ana@example.com", "secret")).user.id).toBe("u1");
    expect((await data.me("users")).user).toMatchObject({ id: "u1", collection: "users" });
    expect(await data.me("admins")).toEqual({ user: null });
    expect(await data.logout("users")).toEqual({ message: "Logged out" });
    expect(await data.me("users")).toEqual({ user: null });
    expect(await data.init("users")).toEqual({ initialized: false });
    expect((await data.firstRegister("users", { email: "first@example.com" })).user.email).toBe("first@example.com");
    expect(await data.init("users")).toEqual({ initialized: true });
    expect((await data.me("users")).user?.email).toBe("first@example.com");
  });

  it("answers access and endpoints, and rejects unknown endpoints", async () => {
    const access = { canAccessAdmin: false, collections: {}, globals: {} };
    const data = memoryData({
      access,
      user: { id: "u1", collection: "users" } as Doc & { collection: string },
      endpoints: {
        "GET /reports/summary": (_body, query) => ({ total: 4, query }),
        "POST /notes/archive": (body) => ({ archived: body }),
        "PATCH /notes/a/pin": () => ({ pinned: true }),
      },
    });
    expect(await data.access()).toEqual(access);
    expect(await memoryData().access()).toEqual({ canAccessAdmin: true, collections: {}, globals: {} });
    expect(await data.get("/reports/summary", { week: 2 })).toEqual({ total: 4, query: { week: 2 } });
    expect(await data.post("/notes/archive", ["a"])).toEqual({ archived: ["a"] });
    expect(await data.call("patch", "/notes/a/pin")).toEqual({ pinned: true });
    await expect(data.get("/nowhere")).rejects.toMatchObject({ status: 404 });
    expect((await data.me("users")).user?.id).toBe("u1");
  });
});
