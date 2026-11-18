import type { Endpoint, Where } from "payload";
import { parse } from "qs-esm";
import type { Doc } from "../types.ts";
import { Engine, type FileInput, type MockRequest } from "./engine.ts";
import { seedHash, seedStore, type Seeds } from "./seed.ts";
import type { Snapshot } from "./store.ts";
import { APIError, isObject, notFound, unauthorized } from "./util.ts";

/**
 * Payload's REST API on top of the Local API, as a `Request -> Response`
 * function (served by the Service Worker, or called directly in tests).
 *
 * Routes (under `apiRoute`, default `/api`):
 *   GET/POST/PATCH/DELETE  /:collection            find · create · bulk update · bulk delete
 *   GET                    /:collection/count
 *   GET/PATCH/DELETE       /:collection/:id
 *   POST /:collection/login · /logout · /refresh-token · /first-register,  GET /me · /init
 *   GET                    /:collection/file/:filename   (upload collections)
 *   GET/POST               /globals/:slug
 *   GET                    /access
 *   custom `endpoints` (collection-level at /:collection/<path>, root-level at /<path>)
 *   /_mock/status · /_mock/export · /_mock/import · /_mock/reset  (seed & snapshot tools)
 *
 * Browsers don't let a Service Worker set cookies, so the session works like
 * Payload's `payload-token` cookie by other means: login stores the token, and
 * requests without an `Authorization` header use it.
 */

const SESSION = "session";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

const errorResponse = (e: unknown) => {
  // Like Payload: APIError, or any error carrying an HTTP status (hooks throw Payload's APIError(msg, 400)).
  const status = e instanceof Error ? (e as { status?: unknown }).status : undefined;
  if (e instanceof APIError || (e instanceof Error && typeof status === "number" && status >= 400 && status < 600)) {
    const { data } = e as { data?: unknown };
    return json({ errors: [{ name: e.name, message: e.message, ...(data ? { data } : {}) }] }, status as number);
  }
  console.error("[mock backend]", e);
  return json({ errors: [{ message: e instanceof Error ? e.message : "Something went wrong." }] }, 500);
};

/** Matches `/:id/tracking` style paths; returns route params or null. */
function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split("/").filter(Boolean);
  const s = path.split("/").filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

const toNumber = (v: unknown, fallback?: number) =>
  v === undefined || v === "" ? fallback : Number.isNaN(Number(v)) ? fallback : Number(v);

async function readBody(request: Request): Promise<{ data: Record<string, unknown>; file?: FileInput }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("multipart/form-data")) {
    const form = await request.formData();
    const payload = form.get("_payload");
    const data: Record<string, unknown> =
      typeof payload === "string" ? (JSON.parse(payload) as Record<string, unknown>) : {};
    for (const [k, v] of form) if (k !== "_payload" && k !== "file" && typeof v === "string") data[k] = v;
    const f = form.get("file");
    const file =
      f instanceof Blob ? { data: f, name: (f as File).name || "upload", mimetype: f.type, size: f.size } : undefined;
    return { data, file };
  }
  const text = await request.text();
  if (!text) return { data: {} };
  try {
    return { data: JSON.parse(text) as Record<string, unknown> };
  } catch {
    throw new APIError("Invalid JSON body", 400);
  }
}

const toBase64 = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};

export class RestApi {
  readonly engine: Engine;
  readonly seeds: Seeds;
  private seeded?: Promise<void>;

  constructor(engine: Engine, seeds: Seeds = { collections: {}, globals: {} }) {
    this.engine = engine;
    this.seeds = seeds;
  }

  /** Loads the seed on first use (empty store). */
  ready() {
    this.seeded ??= (async () => {
      if (!(await this.engine.store.getMeta("seededAt"))) await seedStore(this.engine, this.seeds);
    })();
    return this.seeded;
  }

  async handle(request: Request): Promise<Response> {
    try {
      await this.ready();
      return await this.route(request);
    } catch (e) {
      return errorResponse(e);
    }
  }

  private async route(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const root = this.engine.apiRoute;
    if (!url.pathname.startsWith(`${root}/`) && url.pathname !== root) throw notFound();
    const path = url.pathname.slice(root.length).replace(/\/+$/, "") || "/";
    const method = request.method.toUpperCase();
    const query = parse(url.search, { ignoreQueryPrefix: true, depth: 10, arrayLimit: 1000 }) as Record<
      string,
      unknown
    >;
    const req = await this.makeRequest(request, query);
    const e = this.engine;
    const segments = path.split("/").filter(Boolean).map(decodeURIComponent);
    const [first, second, third] = segments;
    const base = { req, overrideAccess: false, depth: toNumber(query.depth, 2) };

    if (first === "_mock") return this.mockTools(second, method, request);
    if (first === "access" && segments.length === 1) return json(await e.permissions(req));

    if (first === "globals" && second && e.hasGlobal(second)) {
      const custom = await this.customEndpoint(
        e.global(second).endpoints,
        `/${segments.slice(2).join("/")}`,
        method,
        req,
      );
      if (custom) return custom;
      if (segments.length !== 2) throw notFound();
      if (method === "GET") return json(await e.findGlobal({ ...base, slug: second }));
      if (method === "POST" || method === "PATCH") {
        const { data } = await readBody(request);
        const result = await e.updateGlobal({ ...base, slug: second, data });
        return json({ message: "Updated successfully.", result });
      }
      throw new APIError("Method not allowed", 405);
    }

    if (first && e.hasCollection(first)) {
      const slug = first;
      const c = e.collection(slug);
      const custom = await this.customEndpoint(c.endpoints, `/${segments.slice(1).join("/")}`, method, req);
      if (custom) return custom;
      const labels = e.labels(slug);
      const where = query.where as Where | undefined;

      if (segments.length === 1) {
        if (method === "GET") {
          return json(
            await e.find({
              ...base,
              collection: slug,
              where,
              sort: query.sort as string | undefined,
              limit: toNumber(query.limit, 10),
              page: toNumber(query.page, 1),
              pagination: query.pagination !== "false",
            }),
          );
        }
        if (method === "POST") {
          const { data, file } = await readBody(request);
          const doc = await e.create({ ...base, collection: slug, data, file });
          return json({ doc, message: `${labels.singular} successfully created.` }, 201);
        }
        if (method === "PATCH" || method === "DELETE") {
          if (!where) throw new APIError("Bulk operations require a `where` query.", 400);
          const result =
            method === "PATCH"
              ? await e.update({ ...base, collection: slug, where, data: (await readBody(request)).data })
              : await e.delete({ ...base, collection: slug, where });
          const verb = method === "PATCH" ? "Updated" : "Deleted";
          return json({
            ...result,
            message: `${verb} ${result.docs.length} ${result.docs.length === 1 ? labels.singular : labels.plural} successfully.`,
          });
        }
      }

      if (segments.length === 2 && second === "count" && method === "GET") {
        return json(await e.count({ ...base, collection: slug, where }));
      }

      if (c.auth && segments.length === 2) {
        const auth = await this.authRoute(slug, second, method, request, req);
        if (auth) return auth;
      }

      if (c.upload && second === "file" && third && method === "GET") {
        const file = await e.store.getFile(slug, third);
        if (!file) throw notFound();
        const doc = (await e.store.all(slug)).find((d) => d.filename === third);
        if (doc) await e.findByID({ ...base, collection: slug, id: doc.id, depth: 0 }); // read access
        return new Response(file.blob, { headers: { "content-type": file.type, "cache-control": "no-cache" } });
      }

      if (segments.length === 2) {
        const id = second;
        if (method === "GET") return json(await e.findByID({ ...base, collection: slug, id }));
        if (method === "PATCH") {
          const { data, file } = await readBody(request);
          const doc = await e.update({ ...base, collection: slug, id, data, file });
          return json({ doc, message: "Updated successfully." });
        }
        if (method === "DELETE") {
          const doc = await e.delete({ ...base, collection: slug, id });
          return json({ doc, message: `${labels.singular} successfully deleted.` });
        }
      }
      throw notFound();
    }

    const custom = await this.customEndpoint(e.config.endpoints, path, method, req);
    if (custom) return custom;
    throw notFound();
  }

  private async makeRequest(request: Request, query: Record<string, unknown>): Promise<MockRequest> {
    const header = request.headers.get("authorization") ?? "";
    const bearer = /^(?:JWT|Bearer)\s+(.+)$/i.exec(header)?.[1];
    const token = bearer ?? (await this.engine.store.getMeta<string>(SESSION));
    const user = await this.engine.userFromToken(token);
    return {
      payload: this.engine,
      user,
      payloadAPI: "REST",
      context: {},
      headers: request.headers,
      method: request.method,
      url: request.url,
      query,
      json: () => request.clone().json(),
      formData: () => request.clone().formData(),
    };
  }

  private async customEndpoint(
    endpoints: Endpoint[] | false | undefined,
    path: string,
    method: string,
    req: MockRequest,
  ): Promise<Response | null> {
    for (const ep of endpoints || []) {
      if (ep.method.toUpperCase() !== method) continue;
      const params = matchPath(ep.path, path);
      if (!params) continue;
      req.routeParams = params;
      const handler = ep.handler as unknown as (r: MockRequest) => Response | Promise<Response>;
      return await handler(req);
    }
    return null;
  }

  private async authRoute(slug: string, action: string, method: string, request: Request, req: MockRequest) {
    const e = this.engine;
    if (action === "login" && method === "POST") {
      const { data } = await readBody(request);
      const result = await e.login({ collection: slug, data: data as { email?: string; password?: string } });
      await e.store.setMeta(SESSION, result.token);
      return json({ message: "Auth Passed", ...result });
    }
    if (action === "logout" && method === "POST") {
      await e.store.setMeta(SESSION, null);
      return json({ message: "You have been logged out successfully." });
    }
    if (action === "me" && method === "GET") {
      if (!req.user || req.user.collection !== slug) return json({ user: null });
      const { token, exp } = await e.refresh(req.user);
      return json({ user: req.user, collection: slug, token, exp });
    }
    if (action === "refresh-token" && method === "POST") {
      if (!req.user) throw unauthorized();
      const { token, exp } = await e.refresh(req.user);
      await e.store.setMeta(SESSION, token);
      return json({ message: "Token refresh successful", refreshedToken: token, exp, user: req.user });
    }
    if (action === "init" && method === "GET") {
      return json({ initialized: (await e.count({ collection: slug })).totalDocs > 0 });
    }
    if (action === "first-register" && method === "POST") {
      if ((await e.count({ collection: slug })).totalDocs > 0) throw new APIError("Users already exist.", 403);
      const { data } = await readBody(request);
      await e.create({ collection: slug, data });
      const result = await e.login({ collection: slug, data: data as { email?: string; password?: string } });
      await e.store.setMeta(SESSION, result.token);
      return json({ message: "Successfully registered first user.", ...result });
    }
    return null;
  }

  /** Snapshot tools for the mock: status, export, import, reset to seed. */
  private async mockTools(action: string | undefined, method: string, request: Request) {
    const e = this.engine;
    if (action === "status" && method === "GET") {
      const counts: Record<string, number> = {};
      for (const c of e.config.collections) counts[c.slug] = (await e.store.all(c.slug)).length;
      const loaded = await e.store.getMeta<string>("seedHash");
      return json({
        seededAt: await e.store.getMeta("seededAt"),
        seedChanged: loaded !== seedHash(this.seeds),
        counts,
      });
    }
    if (action === "export" && method === "GET") {
      const snapshot: Snapshot = { collections: {}, globals: {}, files: [] };
      for (const c of e.config.collections) snapshot.collections[c.slug] = await e.store.all(c.slug);
      for (const g of e.config.globals ?? []) {
        const doc = await e.store.getGlobal(g.slug);
        if (doc) snapshot.globals[g.slug] = doc;
      }
      for (const f of await e.store.listFiles()) {
        snapshot.files!.push({
          collection: f.collection,
          filename: f.filename,
          type: f.file.type,
          base64: await toBase64(f.file.blob),
        });
      }
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      return json(snapshot, 200, { "content-disposition": `attachment; filename="mock-data-${stamp}.json"` });
    }
    if (action === "import" && method === "POST") {
      const snapshot = (await request.json()) as Snapshot;
      if (!isObject(snapshot) || !isObject(snapshot.collections)) throw new APIError("Not a mock-data export.", 400);
      await e.store.clear();
      for (const [slug, docs] of Object.entries(snapshot.collections)) {
        if (!e.hasCollection(slug)) continue;
        for (const d of docs as Doc[]) await e.store.put(slug, d);
      }
      for (const [slug, doc] of Object.entries(snapshot.globals ?? {}))
        if (e.hasGlobal(slug)) await e.store.putGlobal(slug, doc);
      for (const f of snapshot.files ?? []) {
        const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
        await e.store.putFile(f.collection, f.filename, { blob: new Blob([bytes], { type: f.type }), type: f.type });
      }
      return json({ message: "Imported." });
    }
    if (action === "reset" && method === "POST") {
      await e.store.clear();
      await seedStore(e, this.seeds);
      return json({ message: "Reset to seed data." });
    }
    throw notFound();
  }
}
