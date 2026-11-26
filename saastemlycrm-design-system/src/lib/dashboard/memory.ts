import type { Where } from "payload";
import type { FindOptions, ReadOptions } from "../api/client.ts";
import { ApiError } from "../api/errors.ts";
import type { Doc } from "../contracts/config.ts";
import { matches, paginate, sortDocs } from "../payload/query.ts";
import { clone } from "../payload/util.ts";
import type { DataPort } from "./context.ts";

type Access = Awaited<ReturnType<DataPort["access"]>>;
type Endpoint = (body: unknown, query: Record<string, unknown> | undefined) => unknown;

export interface MemoryData {
  docs?: Record<string, Doc[]>;
  globals?: Record<string, Record<string, unknown>>;
  users?: { collection: string; email: string; password: string; doc: Doc }[];
  user?: (Doc & { collection: string }) | null;
  access?: Access;
  initialized?: boolean;
  endpoints?: Record<string, Endpoint>;
}

const notFound = () => new ApiError(404, [{ message: "Not Found" }]);

export function memoryData(seed: MemoryData = {}): DataPort & { calls: { method: string; args: unknown[] }[] } {
  const docs: Record<string, Doc[]> = clone(seed.docs ?? {});
  const globals: Record<string, Record<string, unknown>> = clone(seed.globals ?? {});
  let user = seed.user ?? null;
  let initialized = seed.initialized ?? true;
  let next = 1;
  const calls: { method: string; args: unknown[] }[] = [];
  const log = (method: string, args: unknown[]) => calls.push({ method, args });
  const table = (collection: string) => (docs[collection] ??= []);
  const byId = (collection: string, id: string) => {
    const doc = table(collection).find((d) => String(d.id) === id);
    if (!doc) throw notFound();
    return doc;
  };
  const stamp = () => new Date().toISOString();
  const endpoint = (method: string, path: string, body?: unknown, query?: object) => {
    const handler = seed.endpoints?.[`${method.toUpperCase()} ${path}`];
    if (!handler) throw notFound();
    return handler(body, query as Record<string, unknown> | undefined);
  };
  const run = async <T>(method: string, args: unknown[], work: () => unknown): Promise<T> => {
    log(method, args);
    return clone(await work()) as T;
  };

  const port: DataPort = {
    find: (collection, options?: FindOptions) =>
      run("find", [collection, options], () => {
        const hits = table(collection).filter((d) => matches(d, options?.where));
        return paginate(sortDocs(hits, options?.sort), options?.limit ?? 10, options?.page ?? 1, options?.limit !== 0);
      }),
    findByID: (collection, id, options?: ReadOptions) =>
      run("findByID", [collection, id, options], () => byId(collection, id)),
    count: (collection, where?: Where) =>
      run("count", [collection, where], () => ({
        totalDocs: table(collection).filter((d) => matches(d, where)).length,
      })),
    create: (collection, data, file) =>
      run("create", [collection, data, file], () => {
        const now = stamp();
        const doc = {
          id: typeof data.id === "string" ? data.id : `doc-${next++}`,
          ...data,
          createdAt: now,
          updatedAt: now,
        } as Doc;
        table(collection).push(doc);
        return { doc, message: "Created" };
      }),
    update: (collection, id, data, file) =>
      run("update", [collection, id, data, file], () => {
        const doc = Object.assign(byId(collection, id), data, { updatedAt: stamp() });
        return { doc, message: "Updated" };
      }),
    delete: (collection, id) =>
      run("delete", [collection, id], () => {
        const doc = byId(collection, id);
        docs[collection] = table(collection).filter((d) => d !== doc);
        return { doc, message: "Deleted" };
      }),
    deleteMany: (collection, where) =>
      run("deleteMany", [collection, where], () => {
        const gone = table(collection).filter((d) => matches(d, where));
        docs[collection] = table(collection).filter((d) => !gone.includes(d));
        return { docs: gone, errors: [], message: "Deleted" };
      }),
    findGlobal: (slug, options?: ReadOptions) =>
      run("findGlobal", [slug, options], () => {
        const g = globals[slug];
        if (!g) throw notFound();
        return g;
      }),
    updateGlobal: (slug, data) =>
      run("updateGlobal", [slug, data], () => ({
        result: (globals[slug] = { ...globals[slug], ...data }),
        message: "Updated",
      })),
    login: (collection, email, password) =>
      run("login", [collection, email, password], () => {
        const hit = seed.users?.find(
          (u) =>
            u.collection === collection && u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (!hit) throw new ApiError(401, [{ message: "The email or password provided is incorrect." }]);
        user = { ...hit.doc, collection };
        return { user: hit.doc, token: "memory", exp: 0 };
      }),
    logout: (collection) =>
      run("logout", [collection], () => {
        user = null;
        return { message: "Logged out" };
      }),
    me: (collection) => run("me", [collection], () => ({ user: user && user.collection === collection ? user : null })),
    init: (collection) => run("init", [collection], () => ({ initialized })),
    firstRegister: (collection, data) =>
      run("firstRegister", [collection, data], () => {
        const doc = { id: `doc-${next++}`, ...data } as Doc;
        table(collection).push(doc);
        initialized = true;
        user = { ...doc, collection };
        return { user: doc };
      }),
    access: () => run("access", [], () => seed.access ?? { canAccessAdmin: true, collections: {}, globals: {} }),
    get: (path, query) => run("get", [path, query], () => endpoint("GET", path, undefined, query)),
    post: (path, body) => run("post", [path, body], () => endpoint("POST", path, body)),
    call: (method, path, body) => run("call", [method, path, body], () => endpoint(method, path, body)),
  };
  return Object.assign(port, { calls });
}
