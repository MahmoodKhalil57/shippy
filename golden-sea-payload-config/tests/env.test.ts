import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { describe, expect, it } from "vite-plus/test";
import { buildEnvSchema, publicEnvSchema, readBuildEnv, readPublicEnv } from "../src/env.ts";

/**
 * The environment files (src/env.ts): each mode's `.env.<mode>` names only declared variables,
 * every value passes the schema, and the browser's (`PUBLIC_`) are exactly the public schema's.
 */
const root = path.join(import.meta.dirname, "..");
const files = readdirSync(root).filter((f) => f.startsWith(".env."));
const declared = new Set([...Object.keys(publicEnvSchema.shape), ...Object.keys(buildEnvSchema.shape)]);

describe("the env files", () => {
  it("are the three modes", () => {
    expect(files.sort()).toEqual([".env.cf.local", ".env.cf.remote", ".env.mock"]);
  });

  it.each(files)("%s names only declared variables, each valid", (file) => {
    const vars = parseEnv(readFileSync(path.join(root, file), "utf8"));
    expect(Object.keys(vars).filter((k) => !declared.has(k))).toEqual([]);
    expect(() => readPublicEnv(vars)).not.toThrow();
    expect(() => readBuildEnv(vars)).not.toThrow();
  });

  it("pick their backend and database", () => {
    const read = (file: string) => {
      const vars = parseEnv(readFileSync(path.join(root, file), "utf8"));
      return [readPublicEnv(vars).PUBLIC_BACKEND, readBuildEnv(vars).D1_TARGET];
    };
    expect(read(".env.mock")[0]).toBe("mock");
    expect(read(".env.cf.local")).toEqual(["cf", "local"]);
    expect(read(".env.cf.remote")).toEqual(["cf", "remote"]);
  });
});

describe("the schema", () => {
  it("gives the browser only PUBLIC_ names, and keeps them out of the build's", () => {
    expect(Object.keys(publicEnvSchema.shape).every((k) => k.startsWith("PUBLIC_"))).toBe(true);
    expect(Object.keys(buildEnvSchema.shape).some((k) => k.startsWith("PUBLIC_"))).toBe(false);
  });

  it("refuses a misspelt value, naming the variable", () => {
    expect(() => readPublicEnv({ PUBLIC_BACKEND: "cloudflare" })).toThrow(/PUBLIC_BACKEND/);
    expect(() => readPublicEnv({ PUBLIC_IS_MOCK: "maybe" })).toThrow(/PUBLIC_IS_MOCK/);
  });

  it("defaults to the demo: the mock backend, both flags on", () => {
    expect(readPublicEnv({})).toEqual({ PUBLIC_BACKEND: "mock", PUBLIC_IS_MOCK: true, PUBLIC_IS_TEMP_MOCK: true });
    expect(readPublicEnv({ PUBLIC_IS_MOCK: " ", PUBLIC_IS_TEMP_MOCK: "OFF" })).toMatchObject({
      PUBLIC_IS_MOCK: true,
      PUBLIC_IS_TEMP_MOCK: false,
    });
  });
});
