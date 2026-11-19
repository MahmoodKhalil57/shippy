import { screenDesignProblems } from "mock-runner/testing";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { backend } from "./backend.ts";

/**
 * The design rules that need real data (the design system's `designProblems`): every screen,
 * drawn as every seeded user, with the seed's data. Each line names the user, screen and widget.
 */

beforeEach(() => {
  backend.reset();
});

describe("design", () => {
  it("every screen follows the design system, for every user", async () => {
    expect(await screenDesignProblems(backend, { password: "demo1234" })).toEqual([]);
  }, 120_000);
});
