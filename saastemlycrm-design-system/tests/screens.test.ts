import { describe, expect, it } from "vite-plus/test";
import {
  block,
  collectionPage,
  documentPage,
  globalPage,
  links,
  widgets,
  type MockConfig,
} from "../src/contracts/index.ts";
import { screenDesignProblems, screensOf, type ScreenBackend } from "../src/testing/index.ts";

/** The screen check (src/testing/screens.ts) against a tiny fake of Payload's REST API. */

const link = links();

/**
 * A config with users, posts and a settings global, one root view drawing `items`, and where the
 * posts' list, users' and posts' records and the settings are (nothing has a page of its own).
 */
const withScreen = (items: { label: string; href: string }[]): MockConfig => ({
  collections: [
    { slug: "users", auth: true, fields: [] },
    { slug: "posts", fields: [] },
  ],
  globals: [{ slug: "settings", fields: [] }],
  admin: {
    components: {
      views: {
        board: {
          path: "/board",
          Component: widgets({ widgets: [{ title: "Board", size: "s", render: () => block("actions", { items }) }] }),
        },
        posts: collectionPage("posts"),
        post: documentPage("posts"),
        user: documentPage("users"),
        settings: globalPage("settings"),
      },
    },
  },
});

/** Ada exists; anything else is a 404. */
const backend: ScreenBackend = {
  login: async (email) => ({ status: email === "ada@test" ? 200 : 401 }),
  call: async (_method, url) =>
    url === "/api/users/me"
      ? { status: 200, body: { user: { id: "ada" } } }
      : url.startsWith("/api/users/ada")
        ? { status: 200, body: { id: "ada" } }
        : { status: 404, body: {} },
};

const check = (items: { label: string; href: string }[], users = ["ada@test"]) =>
  screenDesignProblems({ config: withScreen(items), backend, users, password: "x" });

describe("screenDesignProblems", () => {
  it("finds the config's screens", () => {
    expect(screensOf(withScreen([])).map((s) => s.name)).toContain("/board");
  });

  it("passes links that lead somewhere", async () => {
    expect(
      await check([
        { label: "Posts", href: link.list("posts") },
        { label: "Settings", href: link.global("settings") },
        { label: "Board", href: link.view("/board") },
        { label: "Ada", href: link.doc("users", "ada") },
      ]),
    ).toEqual([]);
  });

  it("reports links that lead nowhere", async () => {
    const problems = (
      await check([
        { label: "Gone", href: link.list("archive") },
        { label: "Nobody", href: link.doc("users", "zed") },
        { label: "Tab", href: link.doc("users", "ada", "billing") },
        { label: "Global", href: link.global("theme") },
        { label: "View", href: link.view("/nowhere") },
      ])
    ).join("\n");
    expect(problems).toMatch(/no collection "archive"/);
    expect(problems).toMatch(/no users document "zed"/);
    expect(problems).toMatch(/no "billing" tab on users/);
    expect(problems).toMatch(/no global "theme"/);
    expect(problems).toMatch(/no view at "\/nowhere"/);
  });

  it("reports links to a collection no view holds", async () => {
    // Users have record pages but no list.
    const problems = await check([{ label: "People", href: link.list("users") }]);
    expect(problems.join(" ")).toMatch(/no view holds the users list/);
  });

  it("says who can't sign in", async () => {
    expect(await check([], ["bob@test"])).toEqual(["bob@test: can't sign in (401)"]);
  });
});
