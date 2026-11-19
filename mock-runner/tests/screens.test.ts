import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { block, links, widgets, type MockConfig } from "saastemlycrm-design-system/contracts";
import { screenDesignProblems, screensOf, seedsFromDir, testBackend } from "../src/testing.ts";
import { fixture } from "./fixture/config.ts";

/** The screen check (src/screens.ts): every screen drawn as every user, its links resolved. */

const link = links();
const seeds = seedsFromDir(path.join(import.meta.dirname, "fixture/seed"));

/** The fixture with one root view that draws the given actions. */
const withScreen = (items: { label: string; href: string }[]): MockConfig => ({
  ...fixture,
  admin: {
    ...fixture.admin,
    components: {
      views: {
        board: {
          path: "/board",
          Component: widgets({ widgets: [{ title: "Board", render: () => block("actions", { items }) }] }),
        },
      },
    },
  },
});

describe("screenDesignProblems", () => {
  it("finds the config's screens", () => {
    expect(screensOf(withScreen([])).map((s) => s.name)).toEqual(["/board"]);
  });

  it("passes links that lead somewhere", async () => {
    const backend = testBackend(
      withScreen([
        { label: "Posts", href: link.list("posts") },
        { label: "Settings", href: link.global("settings") },
        { label: "Board", href: link.view("/board") },
        { label: "Ada", href: link.doc("users", "ada") },
      ]),
      seeds,
    );
    expect(await screenDesignProblems(backend, { password: "secret" })).toEqual([]);
  });

  it("reports links that lead nowhere", async () => {
    const backend = testBackend(
      withScreen([
        { label: "Gone", href: link.list("archive") },
        { label: "Nobody", href: link.doc("users", "zed") },
        { label: "Tab", href: link.doc("users", "ada", "billing") },
        { label: "Global", href: link.global("theme") },
        { label: "View", href: link.view("/nowhere") },
      ]),
      seeds,
    );
    const problems = await screenDesignProblems(backend, { password: "secret" });
    expect(problems.join("\n")).toMatch(/no collection "archive"/);
    expect(problems.join("\n")).toMatch(/no users document "zed"/);
    expect(problems.join("\n")).toMatch(/no "billing" tab on users/);
    expect(problems.join("\n")).toMatch(/no global "theme"/);
    expect(problems.join("\n")).toMatch(/no view at "\/nowhere"/);
  });
});
