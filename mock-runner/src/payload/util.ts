/** Errors carry an HTTP status and serialise like Payload's (`{ errors: [{ message, name, data }] }`). */
export class APIError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status = 400, data?: unknown, name = "APIError") {
    super(message);
    this.status = status;
    this.data = data;
    this.name = name;
  }
}

export const notFound = () => new APIError("Not Found", 404, undefined, "NotFound");
export const forbidden = () => new APIError("You are not allowed to perform this action.", 403, undefined, "Forbidden");
export const unauthorized = () =>
  new APIError("Unauthorized, you must be logged in to make this request.", 401, undefined, "UnauthorizedError");

/** MongoDB-style ObjectID (Payload's default id format): 4-byte time + 8 random bytes, hex. */
export function objectId(): string {
  const time = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");
  const random = crypto.getRandomValues(new Uint8Array(8));
  return time + Array.from(random, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Blob);

export const clone = <T>(v: T): T => structuredClone(v);

/** "cases" -> "Case", "media" -> "Media". */
export function singular(slug: string, labels?: { singular?: unknown }) {
  if (typeof labels?.singular === "string") return labels.singular;
  const word = slug.replace(/[-_]/g, " ");
  const base = word.endsWith("ies") ? word.replace(/ies$/, "y") : word.endsWith("ss") ? word : word.replace(/s$/, "");
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function plural(slug: string, labels?: { plural?: unknown }) {
  if (typeof labels?.plural === "string") return labels.plural;
  const word = slug.replace(/[-_]/g, " ");
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Any value as display text: strings as-is, numbers/booleans stringified, objects as JSON. */
export const text = (v: unknown): string =>
  typeof v === "string"
    ? v
    : typeof v === "number" || typeof v === "boolean" || typeof v === "bigint"
      ? String(v)
      : v == null
        ? ""
        : JSON.stringify(v);
