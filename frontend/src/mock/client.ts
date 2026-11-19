import type { Joins, Select } from "./runtime/select.ts";
import type { Where } from "payload";
import { stringify } from "qs-esm";
import type { Doc, PaginatedDocs } from "./types.ts";

/**
 * Page-side access to the mock backend.
 *
 * `startMockBackend()` registers the Service Worker (src/mock/sw.ts) and waits
 * until it controls the page; after that, plain `fetch("/api/…")` calls hit
 * the mock exactly as they would hit a real Payload server. `api` is a small
 * typed REST client on top (like Payload's REST SDK).
 */

const BASE = import.meta.env.BASE_URL; // "/" or "/sub/path/"
export const API_ROUTE = `${BASE}api`;
/** The dashboard lives at the site root ("" for "/", "/sub" for "/sub/"). */
export const DASHBOARD_ROUTE = BASE.replace(/\/$/, "");
/**
 * A dashboard path written from the site root (`/collections/…`, as endpoints and seeds write
 * links) under the base path the site is served from (e.g. `/shippy/collections/…` on GitHub Pages).
 */
export const withBase = (path: string) =>
  !DASHBOARD_ROUTE || !path.startsWith("/") || path === DASHBOARD_ROUTE || path.startsWith(`${DASHBOARD_ROUTE}/`)
    ? path
    : `${DASHBOARD_ROUTE}${path}`;

let started: Promise<void> | undefined;

/** At most one update check per this long while navigating (a check is one small conditional request). */
const UPDATE_CHECK_INTERVAL = 30_000;

/**
 * A new deploy (or, in dev, a config / runtime edit) installs a new worker — the mock backend and
 * the offline copy. The app checks for one in the background as the user moves around — on every
 * navigation (in-app links and back/forward both fire `popstate`, at most every 30 s), when the
 * tab comes back into view, and now — and when the new worker takes over, the page reloads where
 * the user is, so page and backend always match the latest deploy.
 */
function keepUpToDate(registration: ServiceWorkerRegistration) {
  navigator.serviceWorker.addEventListener("controllerchange", () => location.reload(), { once: true });
  let last = 0;
  const check = () => {
    if (Date.now() - last < UPDATE_CHECK_INTERVAL) return;
    last = Date.now();
    void registration.update().catch(() => undefined); // offline: try again on a later navigation
  };
  check();
  window.addEventListener("popstate", check);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && check());
}

export function startMockBackend(): Promise<void> {
  started ??= (async () => {
    if (!("serviceWorker" in navigator)) throw new Error("This browser has no Service Worker support.");
    const url = `${BASE}cms-sw.js`;
    const registration = await navigator.serviceWorker.register(url, {
      scope: BASE,
      type: import.meta.env.DEV ? "module" : "classic",
      updateViaCache: "none",
    });
    if (!navigator.serviceWorker.controller) {
      const controlled = new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }),
      );
      // First visit: the worker claims the page when it activates. A hard reload ("Empty cache and
      // hard reload", Shift+reload) bypasses an already-active worker instead, and nothing would
      // claim the page: ask it to. If the page still isn't controlled after a few seconds, a normal
      // reload is (the browser hands normal loads to the active worker).
      const active = (await navigator.serviceWorker.ready).active;
      if (!navigator.serviceWorker.controller) active?.postMessage("claim");
      const timedOut = await Promise.race([
        controlled.then(() => false),
        new Promise<boolean>((resolve) => setTimeout(resolve, 4000, true)),
      ]);
      if (timedOut && !navigator.serviceWorker.controller) {
        location.reload();
        await new Promise(() => {}); // the page is going away
      }
    }
    keepUpToDate(registration);
  })();
  return started;
}

export class ApiError extends Error {
  status: number;
  errors: { message: string; name?: string; data?: { errors?: { path: string; message: string }[] } }[];

  constructor(status: number, errors: ApiError["errors"]) {
    super(errors.map((e) => e.message).join("; ") || `Request failed (${status})`);
    this.status = status;
    this.errors = errors;
  }

  /** Field errors of a ValidationError, by path. */
  get fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const e of this.errors) for (const f of e.data?.errors ?? []) out[f.path] = f.message;
    return out;
  }
}

/** Payload's REST query parameters for reads (payloadcms.com/docs/rest-api/overview). */
export interface ReadOptions {
  depth?: number;
  /** Only these fields (`{ title: true }`), or all but these (`{ lines: false }`). */
  select?: Select;
  /** Per related collection, the fields of documents populated into this one. */
  populate?: Record<string, Select>;
  /** Per join field `{ limit, page, sort, where, count }`, or `false` to skip it (or all of them). */
  joins?: Joins;
  locale?: string;
  "fallback-locale"?: string;
}

export interface FindOptions extends ReadOptions {
  where?: Where;
  /** One field or several, `-` for descending: `"-quoteDeadline,ref"`. */
  sort?: string;
  limit?: number;
  page?: number;
}

async function request<T>(method: string, path: string, body?: unknown, query?: object): Promise<T> {
  await startMockBackend();
  const qs = query ? stringify(query, { addQueryPrefix: true, encodeValuesOnly: true }) : "";
  const init: RequestInit = { method, headers: {} };
  if (body instanceof FormData) init.body = body;
  else if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "content-type": "application/json" };
  }
  const res = await fetch(`${API_ROUTE}${path}${qs}`, init);
  const data = (await res.json().catch(() => ({}))) as { errors?: ApiError["errors"] };
  if (!res.ok) throw new ApiError(res.status, data.errors ?? []);
  return data as T;
}

/** Upload collections take a `file`; it's sent as multipart with `_payload`, like Payload's admin does. */
const withFile = (data: Record<string, unknown>, file?: File | null) => {
  if (!file) return data;
  const form = new FormData();
  form.append("file", file);
  form.append("_payload", JSON.stringify(data));
  return form;
};

export const api = {
  find: <T = Doc>(collection: string, options: FindOptions = {}) =>
    request<PaginatedDocs<T>>("GET", `/${collection}`, undefined, options),
  findByID: <T = Doc>(collection: string, id: string, options: ReadOptions = {}) =>
    request<T>("GET", `/${collection}/${encodeURIComponent(id)}`, undefined, options),
  count: (collection: string, where?: Where) =>
    request<{ totalDocs: number }>("GET", `/${collection}/count`, undefined, { where }),
  create: <T = Doc>(collection: string, data: Record<string, unknown>, file?: File | null) =>
    request<{ doc: T; message: string }>("POST", `/${collection}`, withFile(data, file), { depth: 0 }),
  update: <T = Doc>(collection: string, id: string, data: Record<string, unknown>, file?: File | null) =>
    request<{ doc: T; message: string }>("PATCH", `/${collection}/${encodeURIComponent(id)}`, withFile(data, file), {
      depth: 0,
    }),
  delete: <T = Doc>(collection: string, id: string) =>
    request<{ doc: T; message: string }>("DELETE", `/${collection}/${encodeURIComponent(id)}`),
  deleteMany: (collection: string, where: Where) =>
    request<{ docs: Doc[]; errors: unknown[]; message: string }>("DELETE", `/${collection}`, undefined, { where }),
  findGlobal: <T = Record<string, unknown>>(slug: string, options: ReadOptions = {}) =>
    request<T>("GET", `/globals/${slug}`, undefined, options),
  updateGlobal: <T = Record<string, unknown>>(slug: string, data: Record<string, unknown>) =>
    request<{ result: T; message: string }>("POST", `/globals/${slug}`, data, { depth: 0 }),
  login: (collection: string, email: string, password: string) =>
    request<{ user: Doc; token: string; exp: number }>("POST", `/${collection}/login`, { email, password }),
  logout: (collection: string) => request<{ message: string }>("POST", `/${collection}/logout`),
  me: (collection: string) => request<{ user: (Doc & { collection: string }) | null }>("GET", `/${collection}/me`),
  init: (collection: string) => request<{ initialized: boolean }>("GET", `/${collection}/init`),
  firstRegister: (collection: string, data: Record<string, unknown>) =>
    request<{ user: Doc }>("POST", `/${collection}/first-register`, data),
  access: () =>
    request<{
      canAccessAdmin: boolean;
      collections: Record<string, Record<"create" | "read" | "update" | "delete", { permission: boolean }>>;
      globals: Record<string, Record<"read" | "update", { permission: boolean }>>;
    }>("GET", "/access"),
  get: <T>(path: string, query?: object) => request<T>("GET", path, undefined, query),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  /** Any method, for actions a view declares (`{ call: { method, path, body } }`). */
  call: <T>(method: string, path: string, body?: unknown) => request<T>(method, path, body),
};
