import { screenDesignProblems } from "saastemlycrm-design-system/testing";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { backend, config, seeds } from "./backend.ts";

/**
 * The design rules that need real data (the design system's `screenDesignProblems`): every
 * screen, drawn as every seeded user from the mock backend, with the seed's data. Each line names
 * the user, screen and widget, and what to change.
 */

beforeEach(() => {
  backend.reset();
});

describe("design", () => {
  it("every screen follows the design system, for every user", async () => {
    const users = (seeds.collections.users ?? []).map((u) => String(u.email));
    expect(await screenDesignProblems({ config, backend, users, password: "demo1234" })).toEqual([]);
  }, 120_000);
});
