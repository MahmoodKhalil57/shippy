import type { Joins, Select } from "../payload/select.ts";
import type { Where } from "payload";
import { stringify } from "qs-esm";
import type { Doc, PaginatedDocs } from "../contracts/config.ts";
import { locale } from "../i18n/index.ts";
import { ApiError } from "./errors.ts";

export { ApiError };

const BASE = import.meta.env.BASE_URL;
export const API_ROUTE = `${BASE}api`;
export const DASHBOARD_ROUTE = BASE.replace(/\/$/, "");
export const withBase = (path: string) =>
  !DASHBOARD_ROUTE || !path.startsWith("/") || path === DASHBOARD_ROUTE || path.startsWith(`${DASHBOARD_ROUTE}/`)
    ? path
    : `${DASHBOARD_ROUTE}${path}`;

let ready: Promise<void> = Promise.resolve();

export function setBackendReady(p: Promise<void>) {
  ready = p;
}

export const backendReady = () => ready;

export interface ReadOptions {
  depth?: number;
  select?: Select;
  populate?: Record<string, Select>;
  joins?: Joins;
  locale?: string;
  "fallback-locale"?: string;
}

export interface FindOptions extends ReadOptions {
  where?: Where;
  sort?: string;
  limit?: number;
  page?: number;
}

async function request<T>(method: string, path: string, body?: unknown, query?: object): Promise<T> {
  await ready;
  const q = { locale: locale(), ...(query as Record<string, unknown> | undefined) };
  const qs = (path.includes("?") ? "&" : "?") + stringify(q, { encodeValuesOnly: true });
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
  call: <T>(method: string, path: string, body?: unknown) => request<T>(method, path, body),
};
