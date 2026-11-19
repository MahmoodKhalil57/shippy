/**
 * Auth primitives with WebCrypto: PBKDF2 password hashes (like Payload's
 * `salt` + `hash`) and HS256 JWTs (like Payload's tokens).
 */

const enc = new TextEncoder();
const hex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

export function randomHex(bytes = 32) {
  return hex(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function hashPassword(password: string, salt = randomHex(32)) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: 25000 },
    key,
    512,
  );
  return { salt, hash: hex(bits) };
}

export async function verifyPassword(password: string, salt: string, hash: string) {
  return (await hashPassword(password, salt)).hash === hash;
}

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const fromB64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

const hmacKey = (secret: string) =>
  crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

export interface TokenPayload {
  id: string;
  collection: string;
  email?: unknown;
  iat: number;
  exp: number;
}

export async function signToken(payload: Omit<TokenPayload, "iat" | "exp">, secret: string, expiresIn: number) {
  const iat = Math.floor(Date.now() / 1000);
  const body: TokenPayload = { ...payload, iat, exp: iat + expiresIn };
  const head = b64url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const data = `${head}.${b64url(enc.encode(JSON.stringify(body)))}`;
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(data));
  return { token: `${data}.${b64url(new Uint8Array(sig))}`, exp: body.exp };
}

export async function verifyToken(token: string, secret: string): Promise<TokenPayload | null> {
  const [head, body, sig] = token.split(".");
  if (!head || !body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromB64url(sig),
      enc.encode(`${head}.${body}`),
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as TokenPayload;
    return payload.exp * 1000 > Date.now() ? payload : null;
  } catch {
    return null;
  }
}
