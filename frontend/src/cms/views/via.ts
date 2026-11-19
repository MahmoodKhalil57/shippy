import type { Endpoint, PayloadRequest } from "payload";
import { bodyOf, forward } from "./forward.ts";

export { bodyOf };

/** `forward` with the arguments in the order these views use (same request, its own route params). */
export const via = <T>(
  endpoints: Endpoint[],
  method: "get" | "post",
  path: string,
  req: PayloadRequest,
  params: Record<string, string> = {},
): Promise<T | Response> => forward<T>(req, endpoints, path, { method, params });

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
/** A date as the dashboard shows it: just the day at midnight, else the day and time. */
export const formatDate = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  return d.getHours() === 0 && d.getMinutes() === 0 ? dayFmt.format(d) : dateFmt.format(d);
};

/** A JSON error in Payload's shape. */
export const refuse = (message: string, status = 403) => Response.json({ errors: [{ message }] }, { status });

/** A string or number as text; anything else is "". */
export const text = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
