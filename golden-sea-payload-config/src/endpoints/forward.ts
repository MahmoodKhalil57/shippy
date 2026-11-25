import type { Endpoint, PayloadRequest } from "payload";

export async function forward<T>(
  req: PayloadRequest,
  endpoints: Endpoint[],
  path: string,
  opts: { method?: "get" | "post"; params?: Record<string, string>; body?: Record<string, unknown> } = {},
): Promise<T | Response> {
  const method = opts.method ?? (opts.body ? "post" : "get");
  const ep = endpoints.find((e) => e.path === path && e.method === method);
  if (!ep) return Response.json({ errors: [{ message: `No endpoint ${path}.` }] }, { status: 500 });
  const sub = {
    ...req,
    routeParams: opts.params ?? req.routeParams,
    json: opts.body ? () => Promise.resolve(opts.body) : (req as unknown as { json?: () => Promise<unknown> }).json,
  } as unknown as PayloadRequest;
  const res = await ep.handler(sub);
  if (!res.ok) return res;
  return (await res.json()) as T;
}

export async function bodyOf(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await (req as unknown as { json: () => Promise<unknown> }).json()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const failWith = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });
