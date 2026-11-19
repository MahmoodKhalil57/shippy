import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import config from "../src/cms/config.ts";

import { Engine } from "../src/cms/runtime/engine.ts";
import { RestApi } from "../src/cms/runtime/rest.ts";
import { seedsFromGlob } from "../src/cms/runtime/seed.ts";
import { MemoryStore } from "../src/cms/runtime/store.ts";

/** The case workspace tabs as views (src/cms/views/case-*.ts): what they show, per role, and their actions. */

const seedDir = path.resolve(import.meta.dirname, "../src/cms/seed");
const seedFiles: Record<string, unknown> = {};
for (const f of readdirSync(seedDir, { recursive: true }) as string[]) {
  if (f.endsWith(".json"))
    seedFiles[`./seed/${f.split(path.sep).join("/")}`] = JSON.parse(readFileSync(path.join(seedDir, f), "utf8"));
}
const seeds = seedsFromGlob(seedFiles);

let api: RestApi;
let token = "";
const call = async (method: string, url: string, payload?: unknown) => {
  const headers: Record<string, string> = token ? { authorization: `JWT ${token}` } : {};
  const init: RequestInit = { method, headers };
  if (payload !== undefined) {
    init.body = JSON.stringify(payload);
    headers["content-type"] = "application/json";
  }
  const res = await api.handle(new Request(`http://mock.test${url}`, init));
  // oxlint-disable-next-line typescript/no-explicit-any
  const body: any = await res.json().catch(() => ({}));
  return { status: res.status, body };
};
const login = async (user: string) => {
  token = "";
  const { body } = await call("POST", "/api/users/login", { email: `${user}@goldensea.test`, password: "demo1234" });
  token = body.token;
};

beforeEach(async () => {
  token = "";
  api = new RestApi(new Engine(config, new MemoryStore()), seeds);
  await login("karim.youssef");
});

// oxlint-disable-next-line typescript/no-explicit-any
type Json = any;
/** Every block of a view, nested ones included. */
const blocks = (v: Json): Json[] =>
  (v.blocks ?? []).flatMap((b: Json) => [
    b,
    ...blocks({ blocks: [...(b.blocks ?? []), ...(b.main ?? []), ...(b.side ?? [])] }),
  ]);
const card = (v: Json, heading: string) => blocks(v).find((b) => b.type === "card" && b.heading?.startsWith(heading));
const text = (v: unknown) => JSON.stringify(v);

describe("case views", () => {
  it("overview: lifecycle, line progress, owner & backup with the handover, timeline filter", async () => {
    const { status, body } = await call("GET", "/api/views/case-overview/gs-rfq-0142");
    expect(status).toBe(200);
    for (const h of [
      "Lifecycle",
      "Line progress",
      "Owner & backup",
      "Activity timeline",
      "Clarifications log",
      "Next action",
    ])
      expect(card(body, h), h).toBeTruthy();
    expect(text(card(body, "Owner & backup"))).toMatch(/gs-case-handover/);
    expect(text(body)).toMatch(/USD 7,480/);
    const human = (await call("GET", "/api/views/case-overview/gs-rfq-0142?show=human")).body;
    const items = blocks(human).find((b) => b.type === "timeline").items;
    expect(items.every((i: Json) => i.heading.startsWith("Human"))).toBe(true);
    await login("soaad.amer");
    expect(text((await call("GET", "/api/views/case-overview/gs-rfq-0142")).body)).not.toMatch(/USD 7,480/);
  });

  it("rfqs: table with reminders, simulate replies shows what arrived", async () => {
    const before = (await call("GET", "/api/views/case-rfqs/gs-rfq-0142")).body;
    expect(card(before, "Supplier RFQs").actions[0].label).toBe("Simulate replies");
    expect(card(before, "Draft supplier RFQs")).toBeTruthy();
    const sim = await call("POST", "/api/views/case-rfqs/gs-rfq-0142/simulate-replies");
    expect(sim.status).toBe(200);
    const after = (await call("GET", "/api/views/case-rfqs/gs-rfq-0142")).body;
    expect(card(after, "Replies arriving")).toBeTruthy();
    expect(card(after, "New suppliers saved")).toBeTruthy();
    expect(card(after, "Needs a person")).toBeTruthy();
    const full = (await call("GET", "/api/views/case-rfqs/gs-rfq-0142?send=full")).body;
    expect(text(card(full, "Draft supplier RFQs"))).toMatch(/General chandlers/);
  });

  it("compare: per-line cards, landed ranking, split selection, hidden for Sales", async () => {
    const unit = (await call("GET", "/api/views/case-compare/gs-rfq-0142")).body;
    expect(card(unit, "How offers are compared")).toBeTruthy();
    expect(card(unit, "L2 · LOCTITE 243")).toBeTruthy();
    const helmet = card(unit, "L5 · Safety helmet");
    expect(helmet).toBeTruthy();
    const landed = (await call("GET", "/api/views/case-compare/gs-rfq-0142?by=landed")).body;
    expect(text(landed)).toMatch(/Landed · EGP/);
    const useSplit = blocks({ blocks: [helmet] })
      .find((b) => b.type === "actions")
      .items.find((a: Json) => a.label.startsWith("Use split"));
    const values = Object.fromEntries(
      useSplit.fields.filter((f: Json) => f.name !== "reason").map((f: Json) => [f.name, f.defaultValue]),
    );
    const saved = await call("POST", `/api${useSplit.call.path}`, { ...useSplit.call.body, ...values });
    expect(saved.status).toBe(200);
    await login("soaad.amer");
    expect(text((await call("GET", "/api/views/case-compare/gs-rfq-0142")).body)).toMatch(/hidden for your role/);
  });

  it("pricing: margin vs markup, approval request, Sales sees the quotation link", async () => {
    const { status, body } = await call("GET", "/api/views/case-pricing/gs-rfq-0142");
    expect(status).toBe(200);
    expect(card(body, "Margin vs markup")).toBeTruthy();
    expect(card(body, "Approval")).toBeTruthy();
    expect(blocks(body).some((b) => b.type === "form")).toBe(true);
    await login("soaad.amer");
    expect(text((await call("GET", "/api/views/case-pricing/gs-rfq-0142")).body)).toMatch(/hidden for your role/);
  });
});
