import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * The login page fills in a seeded user, and the role switcher (and the tours' `as`) sign in as
 * seeded users: src/app/demo-users.ts globs the seed and looks the user file up by the same path.
 */
describe("demo users", () => {
  const file = path.resolve(import.meta.dirname, "../src/app/demo-users.ts");
  const source = readFileSync(file, "utf8");
  it("look up the seed by the path they glob", () => {
    const glob = /import\.meta\.glob[^(]*\(\s*"([^"]+)\/\*\.json"/.exec(source)?.[1];
    const key = /seeds\[`([^`$]+)\/\$\{/.exec(source)?.[1];
    expect(glob).toBeTruthy();
    expect(key).toBe(glob);
    expect(existsSync(path.resolve(path.dirname(file), glob!, "users.json"))).toBe(true);
  });
});
