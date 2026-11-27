import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { API_ROUTE, ApiError, DASHBOARD_ROUTE, api, backendReady, setBackendReady, withBase } from "./client.ts";

interface Sent {
  url: string;
  method: string;
  headers: unknown;
  body: unknown;
}

let sent: Sent[] = [];
let reply: () => Response = () => Response.json({ ok: true });

beforeEach(() => {
  sent = [];
  reply = () => Response.json({ ok: true });
  vi.stubGlobal("fetch", (url: string, init: RequestInit) => {
    sent.push({ url, method: init.method!, headers: init.headers, body: init.body });
    return Promise.resolve(reply());
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  setBackendReady(Promise.resolve());
});

const last = () => sent.at(-1)!;
const json = (s: Sent) => JSON.parse(s.body as string) as unknown;

describe("routes", () => {
  it("serves the API under the base path and leaves paths alone when the base is the root", () => {
    expect(API_ROUTE).toBe("/api");
    expect(DASHBOARD_ROUTE).toBe("");
    for (const path of ["/deals", "deals", "/", ""]) expect(withBase(path)).toBe(path);
  });

  it("puts absolute paths under a base path that is not the root", async () => {
    vi.stubEnv("BASE_URL", "/crm/");
    const variant = "./client.ts?base=crm";
    const crm = (await import(variant)) as typeof import("./client.ts");
    vi.unstubAllEnvs();
    expect(crm.API_ROUTE).toBe("/crm/api");
    expect(crm.DASHBOARD_ROUTE).toBe("/crm");
    expect(crm.withBase("/crm")).toBe("/crm");
    expect(crm.withBase("/crm/deals")).toBe("/crm/deals");
    expect(crm.withBase("deals")).toBe("deals");
    expect(crm.withBase("/deals")).toBe("/crm/deals");
    expect(crm.withBase("/crmx")).toBe("/crm/crmx");
    await crm.api.find("deals");
    expect(last().url).toBe("/crm/api/deals?locale=en");
  });
});

describe("backend readiness", () => {
  it("holds every request until the backend is ready", async () => {
    let open!: () => void;
    const ready = new Promise<void>((resolve) => (open = resolve));
    setBackendReady(ready);
    expect(backendReady()).toBe(ready);
    const pending = api.get("/health");
    await Promise.resolve();
    expect(sent).toEqual([]);
    open();
    await pending;
    expect(sent.map((s) => s.url)).toEqual(["/api/health?locale=en"]);
  });
});

describe("api", () => {
  it("finds documents with the query Payload reads", async () => {
    expect(
      await api.find("deals", {
        where: { stage: { equals: "won" } },
        sort: "-amount",
        limit: 5,
        page: 2,
        depth: 1,
        select: { title: true },
        locale: "ar",
      }),
    ).toEqual({ ok: true });
    expect(last()).toEqual({
      url: "/api/deals?locale=ar&where[stage][equals]=won&sort=-amount&limit=5&page=2&depth=1&select[title]=true",
      method: "GET",
      headers: {},
      body: undefined,
    });
    await api.find("deals");
    expect(last().url).toBe("/api/deals?locale=en");
  });

  it("reads one document by an id it encodes", async () => {
    await api.findByID("files", "2026/03 report", { depth: 0 });
    expect(last()).toMatchObject({ url: "/api/files/2026%2F03%20report?locale=en&depth=0", method: "GET" });
    await api.findByID("files", "f1");
    expect(last().url).toBe("/api/files/f1?locale=en");
  });

  it("counts documents", async () => {
    await api.count("deals", { stage: { in: ["open", "won"] } });
    expect(last().url).toBe("/api/deals/count?locale=en&where[stage][in][0]=open&where[stage][in][1]=won");
    await api.count("deals");
    expect(last().url).toBe("/api/deals/count?locale=en");
  });

  it("creates and updates documents as JSON", async () => {
    await api.create("deals", { title: "Lease", amount: 5 });
    expect(last()).toEqual({
      url: "/api/deals?locale=en&depth=0",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"title":"Lease","amount":5}',
    });
    await api.update("deals", "d 1", { stage: "won" }, null);
    expect(last()).toMatchObject({ url: "/api/deals/d%201?locale=en&depth=0", method: "PATCH" });
    expect(json(last())).toEqual({ stage: "won" });
  });

  it("creates and updates documents with a file as a form", async () => {
    const file = new File(["%PDF"], "contract.pdf", { type: "application/pdf" });
    await api.create("media", { alt: "Contract" }, file);
    const created = last();
    expect([created.url, created.method, created.headers]).toEqual(["/api/media?locale=en&depth=0", "POST", {}]);
    const form = created.body as FormData;
    expect((form.get("file") as File).name).toBe("contract.pdf");
    expect(form.get("_payload")).toBe('{"alt":"Contract"}');
    await api.update("media", "m1", { alt: "Signed" }, file);
    expect([last().url, last().method]).toEqual(["/api/media/m1?locale=en&depth=0", "PATCH"]);
    expect((last().body as FormData).get("_payload")).toBe('{"alt":"Signed"}');
  });

  it("deletes one document or every match", async () => {
    await api.delete("deals", "d/1");
    expect(last()).toEqual({ url: "/api/deals/d%2F1?locale=en", method: "DELETE", headers: {}, body: undefined });
    await api.deleteMany("deals", { stage: { equals: "lost" } });
    expect(last()).toMatchObject({ url: "/api/deals?locale=en&where[stage][equals]=lost", method: "DELETE" });
  });

  it("reads and updates globals", async () => {
    await api.findGlobal("branding", { depth: 0 });
    expect(last()).toMatchObject({ url: "/api/globals/branding?locale=en&depth=0", method: "GET" });
    await api.findGlobal("branding");
    expect(last().url).toBe("/api/globals/branding?locale=en");
    await api.updateGlobal("branding", { name: "Atlas" });
    expect(last()).toMatchObject({ url: "/api/globals/branding?locale=en&depth=0", method: "POST" });
    expect(json(last())).toEqual({ name: "Atlas" });
  });

  it("signs people in and out and registers the first user", async () => {
    await api.login("users", "ana@example.com", "secret");
    expect(last()).toMatchObject({ url: "/api/users/login?locale=en", method: "POST" });
    expect(json(last())).toEqual({ email: "ana@example.com", password: "secret" });
    await api.logout("users");
    expect(last()).toMatchObject({ url: "/api/users/logout?locale=en", method: "POST", body: undefined });
    await api.me("users");
    expect(last()).toMatchObject({ url: "/api/users/me?locale=en", method: "GET" });
    await api.init("users");
    expect(last()).toMatchObject({ url: "/api/users/init?locale=en", method: "GET" });
    await api.firstRegister("users", { email: "ana@example.com", password: "secret" });
    expect(last()).toMatchObject({ url: "/api/users/first-register?locale=en", method: "POST" });
    expect(json(last())).toEqual({ email: "ana@example.com", password: "secret" });
    await api.access();
    expect(last()).toMatchObject({ url: "/api/access?locale=en", method: "GET" });
  });

  it("calls custom endpoints, adding to a query the path already has", async () => {
    await api.get("/reports/pipeline", { year: 2026 });
    expect(last()).toMatchObject({ url: "/api/reports/pipeline?locale=en&year=2026", method: "GET" });
    await api.get("/reports/pipeline?view=board");
    expect(last().url).toBe("/api/reports/pipeline?view=board&locale=en");
    await api.post("/deals/d1/approve", { note: "ok" });
    expect(last()).toMatchObject({ url: "/api/deals/d1/approve?locale=en", method: "POST" });
    expect(json(last())).toEqual({ note: "ok" });
    await api.post("/cache/clear");
    expect(last()).toMatchObject({ method: "POST", body: undefined, headers: {} });
    await api.call("PUT", "/deals/d1/stage", { stage: "won" });
    expect(last()).toMatchObject({ url: "/api/deals/d1/stage?locale=en", method: "PUT" });
  });

  it("returns an empty object when a successful reply has no JSON", async () => {
    reply = () => new Response(null, { status: 204 });
    expect(await api.post("/cache/clear")).toEqual({});
  });

  it("throws the errors Payload sends back", async () => {
    reply = () =>
      Response.json(
        { errors: [{ message: "Invalid", data: { errors: [{ path: "email", message: "Taken" }] } }] },
        { status: 400 },
      );
    const error = await api.create("users", { email: "ana@example.com" }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, message: "Invalid", fieldErrors: { email: "Taken" } });
  });

  it("throws a plain failure when an error reply has no errors", async () => {
    reply = () => new Response("Bad gateway", { status: 502 });
    await expect(api.find("deals")).rejects.toMatchObject({ status: 502, errors: [], message: "Request failed (502)" });
    reply = () => Response.json({ message: "nope" }, { status: 403 });
    await expect(api.find("deals")).rejects.toMatchObject({ status: 403, errors: [] });
  });
});
