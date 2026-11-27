import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { parse } from "qs-esm";
import { ApiError } from "../lib/api/errors.ts";
import type { Doc } from "../lib/contracts/config.ts";
import { memoryData, type MemoryData } from "../lib/dashboard/memory.ts";
import { m } from "../lib/i18n/index.ts";
import { loadGuide, loadSite, loadTours, REQUEST_KINDS, resetSite, site } from "./site.ts";

let urls: string[] = [];
let failing = new Set<string>();

function serve(seed: MemoryData) {
  const port = memoryData(seed);
  urls = [];
  failing = new Set();
  vi.stubGlobal("fetch", async (url: string) => {
    urls.push(url);
    const { pathname, search } = new URL(url, location.origin);
    const path = pathname.replace(/^\/api/, "");
    const query = parse(search.slice(1)) as Record<string, string>;
    if (failing.has(path)) return Response.json({ errors: [{ message: "Server error" }] }, { status: 500 });
    try {
      const global = /^\/globals\/(.+)$/.exec(path);
      const body = global
        ? await port.findGlobal(global[1]!)
        : await port.find(path.slice(1), { limit: Number(query.limit), sort: query.sort });
      return Response.json(body);
    } catch (e) {
      const error = e as ApiError;
      return Response.json({ errors: error.errors }, { status: error.status });
    }
  });
}

beforeEach(() => resetSite());
afterEach(() => vi.unstubAllGlobals());

describe("site", () => {
  it("starts with a plain workspace and an assistant that knows nothing", () => {
    expect(site()).toEqual({
      branding: { name: m.site_default_name(), icon: "grid", backgrounds: [] },
      assistant: {
        name: m.site_assistant_name(),
        business: "a business",
        ask: "/ask",
        roleNotes: [],
        suggestions: [],
        businessKeywords: [],
        examples: [],
      },
    });
  });

  it("keeps the defaults when the project has no branding or assistant", async () => {
    serve({});
    const before = site();
    await loadSite();
    expect(urls).toEqual(["/api/globals/branding?locale=en", "/api/globals/assistant?locale=en"]);
    expect(site()).toEqual(before);
  });

  it("reads the branding and assistant globals, dropping anything incomplete", async () => {
    serve({
      globals: {
        branding: {
          name: "Atlas CRM",
          icon: "",
          loginIntro: "Welcome back to Atlas.",
          poweredBy: "",
          backgrounds: [{ path: "/bg/dunes.jpg", label: "Dunes" }, { path: "/bg/creek.jpg" }, { label: "No image" }],
          backgroundCredit: 5,
        },
        assistant: {
          name: "Sara",
          business: "",
          ask: "/assistant/ask",
          roleNotes: [
            { role: "sales", note: "Focus on open deals.", suggestions: ["My deals", " ", 3] },
            { role: "accounts", note: "Chase late invoices." },
            { role: "support" },
            { note: "Nobody" },
          ],
          suggestions: ["What is due today?", ""],
          mainRecord: "deals",
          recordPattern: "",
          businessKeywords: "deals",
          examples: [
            { question: "Open the deals", kind: "open_page", argument: "/deals" },
            { question: "Find Ana", kind: "find", argument: "" },
            { question: "Hello", kind: "chat" },
            { kind: "find" },
          ],
        },
      },
    });
    await loadSite();
    expect(site()).toEqual({
      branding: {
        name: "Atlas CRM",
        icon: "grid",
        loginIntro: "Welcome back to Atlas.",
        poweredBy: undefined,
        backgrounds: [
          { path: "/bg/dunes.jpg", label: "Dunes" },
          { path: "/bg/creek.jpg", label: "/bg/creek.jpg" },
        ],
        backgroundCredit: undefined,
      },
      assistant: {
        name: "Sara",
        business: "a business",
        ask: "/assistant/ask",
        roleNotes: [
          { role: "sales", note: "Focus on open deals.", suggestions: ["My deals"] },
          { role: "accounts", note: "Chase late invoices.", suggestions: [] },
        ],
        suggestions: ["What is due today?"],
        mainRecord: "deals",
        recordPattern: undefined,
        businessKeywords: [],
        examples: [
          { question: "Open the deals", kind: "open_page", argument: "/deals" },
          { question: "Find Ana", kind: "find", argument: undefined },
        ],
      },
    });
  });

  it("keeps the last name and falls back for every other missing value", async () => {
    serve({
      globals: {
        branding: { icon: "rocket", poweredBy: "Saastemly", backgroundCredit: "Photos by Lina" },
        assistant: { recordPattern: "DL-\\d+", businessKeywords: ["lease", " ", "warehouse"] },
      },
    });
    await loadSite();
    expect(site()).toEqual({
      branding: {
        name: "Atlas CRM",
        icon: "rocket",
        loginIntro: undefined,
        poweredBy: "Saastemly",
        backgrounds: [],
        backgroundCredit: "Photos by Lina",
      },
      assistant: {
        name: m.site_assistant_name(),
        business: "a business",
        ask: "/ask",
        roleNotes: [],
        suggestions: [],
        mainRecord: undefined,
        recordPattern: "DL-\\d+",
        businessKeywords: ["lease", "warehouse"],
        examples: [],
      },
    });
  });

  it("knows every kind of request the assistant answers", () => {
    expect(REQUEST_KINDS).toEqual([
      "open_page",
      "what_is_on_screen",
      "my_day",
      "record_status",
      "find",
      "ask_records",
      "platform_guide",
    ]);
  });
});

const tour = (id: string, createdAt: string, extra: Record<string, unknown>) => ({ id, createdAt, ...extra }) as Doc;

describe("loadTours", () => {
  const tours = [
    tour("t2", "2026-02-01T00:00:00.000Z", {
      title: "Deals",
      summary: "Work a deal from start to finish.",
      steps: [
        {
          id: "s1",
          title: "Open deals",
          body: "Every open deal is here.",
          go: "/collections/deals",
          as: null,
          open: "",
          wait: 300,
          target: { text: "New deal", sel: "" },
        },
        { id: "s2", title: "Pick one", body: "Open the first deal.", target: { text: "", sel: "#first" } },
        { title: "Done", body: "That is all.", click: "Save" },
      ],
    }),
    tour("t1", "2026-01-01T00:00:00.000Z", {
      title: 7,
      steps: [{ title: "Start", body: "Hi", target: { text: { en: "Menu" }, sel: "ui-nav" } }],
    }),
  ];

  it("loads every tour oldest first with clean steps, once", async () => {
    serve({ docs: { tours } });
    const first = loadTours();
    expect(loadTours()).toBe(first);
    expect(await first).toEqual([
      {
        id: "t1",
        title: "",
        summary: "",
        steps: [{ title: "Start", body: "Hi", target: { text: { en: "Menu" }, sel: "ui-nav" } }],
      },
      {
        id: "t2",
        title: "Deals",
        summary: "Work a deal from start to finish.",
        steps: [
          {
            title: "Open deals",
            body: "Every open deal is here.",
            go: "/collections/deals",
            wait: 300,
            target: { text: "New deal", sel: undefined },
          },
          { title: "Pick one", body: "Open the first deal.", target: undefined },
          { title: "Done", body: "That is all.", click: "Save", target: undefined },
        ],
      },
    ]);
    expect(Object.keys((await first)[1]!.steps[0]!)).not.toContain("as");
    expect(urls).toEqual(["/api/tours?locale=en&limit=0&depth=0&sort=createdAt"]);
  });

  it("loads a tour without steps as an empty tour", async () => {
    serve({ docs: { tours: [tour("t3", "2026-03-01T00:00:00.000Z", { title: "Empty", summary: "Nothing" })] } });
    expect(await loadTours()).toEqual([{ id: "t3", title: "Empty", summary: "Nothing", steps: [] }]);
  });

  it("loads again after a reset", async () => {
    serve({ docs: { tours } });
    await loadTours();
    resetSite();
    await loadTours();
    expect(urls).toHaveLength(2);
  });

  it("returns no tours when loading fails and tries again next time", async () => {
    serve({ docs: { tours } });
    failing.add("/tours");
    expect(await loadTours()).toEqual([]);
    failing.clear();
    expect(await loadTours()).toHaveLength(2);
    expect(urls).toHaveLength(2);
  });
});

describe("loadGuide", () => {
  const topics = [
    { id: "g1", topic: "Deals", keywords: "deal pipeline", text: "A deal is a sale in progress." },
    { id: "g2", topic: "Invoices", keywords: 4 },
  ] as Doc[];

  it("loads every guide topic once", async () => {
    serve({ docs: { "guide-topics": topics } });
    const first = loadGuide();
    expect(loadGuide()).toBe(first);
    expect(await first).toEqual([
      { topic: "Deals", keywords: "deal pipeline", text: "A deal is a sale in progress." },
      { topic: "Invoices", keywords: "", text: "" },
    ]);
    expect(urls).toEqual(["/api/guide-topics?locale=en&limit=0&depth=0"]);
  });

  it("loads again after a reset", async () => {
    serve({ docs: { "guide-topics": topics } });
    await loadGuide();
    resetSite();
    await loadGuide();
    expect(urls).toHaveLength(2);
  });

  it("returns no topics when loading fails and tries again next time", async () => {
    serve({ docs: { "guide-topics": topics } });
    failing.add("/guide-topics");
    expect(await loadGuide()).toEqual([]);
    failing.clear();
    expect(await loadGuide()).toHaveLength(2);
  });
});
