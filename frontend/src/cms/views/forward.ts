import type { Endpoint, PayloadRequest } from "payload";

/**
 * Runs one of the project's data endpoints for a view, as the same request (same user, so the
 * same access rules), with its own route params and body. Returns the parsed answer, or the
 * endpoint's error response as it is. Views read and write through the data endpoints this way
 * instead of repeating their logic.
 */
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

/** The request body of a view's own action endpoint. */
export async function bodyOf(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await (req as unknown as { json: () => Promise<unknown> }).json()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const failWith = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });
