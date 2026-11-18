import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import config from "../src/cms/config.ts";
import { Engine } from "../src/cms/runtime/engine.ts";
import { RestApi } from "../src/cms/runtime/rest.ts";
import { seedsFromGlob } from "../src/cms/runtime/seed.ts";
import { MemoryStore } from "../src/cms/runtime/store.ts";

/** Insights & growth: profit & close, the control room, the 07:00 briefing, Ask Golden Sea, growth CRM. */

const seedDir = path.resolve(import.meta.dirname, "../src/cms/seed");
const seedFiles: Record<string, unknown> = {};
for (const f of readdirSync(seedDir, { recursive: true }) as string[]) {
  if (f.endsWith(".json"))
    seedFiles[`./seed/${f.split(path.sep).join("/")}`] = JSON.parse(readFileSync(path.join(seedDir, f), "utf8"));
}
const seeds = seedsFromGlob(seedFiles);

let api: RestApi;
const call = async (method: string, url: string, payload?: unknown) => {
  const init: RequestInit = { method, headers: {} };
  if (payload !== undefined) {
    init.body = JSON.stringify(payload);
    (init.headers as Record<string, string>)["content-type"] = "application/json";
  }
  const res = await api.handle(new Request(`http://mock.test${url}`, init));
  // oxlint-disable-next-line typescript/no-explicit-any
  const body: any = await res.json().catch(() => ({}));
  return { status: res.status, body };
};
const as = (user: string) =>
  call("POST", "/api/users/login", { email: `${user}@goldensea.test`, password: "demo1234" });

beforeEach(() => {
  api = new RestApi(new Engine(config, new MemoryStore()), seeds);
});

// oxlint-disable-next-line typescript/no-explicit-any
const check = (p: any, key: string) => p.checks.find((k: { key: string }) => k.key === key);

describe("profit & close (/api/case-profit/:id)", () => {
  it("keeps profit from Sales and needs a login", async () => {
    expect((await call("GET", "/api/case-profit/gs-rfq-0131")).status).toBe(401);
    await as("soaad.amer");
    expect((await call("GET", "/api/case-profit/gs-rfq-0131")).status).toBe(403);
  });

  it("compares expected with actual: actual costs, FX on receipts and the open claim", async () => {
    await as("mohamed.helmy");
    const { status, body: p } = await call("GET", "/api/case-profit/gs-rfq-0131");
    expect(status).toBe(200);
    expect(p).toMatchObject({ caseId: "GS-RFQ-0131", closed: false, costed: true, currency: "USD", quoteRate: 48.6 });
    expect(p.expected.revenue).toBeCloseTo(14_200 * 48.6);
    const launch = p.lines.find((l: { label: string }) => /Launch/.test(l.label));
    expect(launch).toMatchObject({ expected: 3_800, actual: 6_900, state: "Billed" });
    // USD 10,000 received at 48.80 instead of 48.60.
    expect(p.fx[0]).toMatchObject({ realised: true, rate: 48.8 });
    expect(p.fx[0].difference).toBeCloseTo(2_000);
    expect(p.actual.profit).toBeLessThan(p.expected.profit);
    expect(check(p, "deliveries").ok).toBe(true);
    expect(check(p, "einvoice").ok).toBe(true);
    expect(check(p, "paid")).toMatchObject({ ok: false, action: "receipt" });
    expect(check(p, "claims")).toMatchObject({ ok: false, action: "claim" });
    expect(check(p, "actuals")).toMatchObject({ ok: false, action: "actuals" });
    expect(p.canClose).toBe(false);
  });

  it("closes only when every check is green", async () => {
    await as("mohamed.helmy");
    expect((await call("POST", "/api/case-profit/gs-rfq-0131/close")).status).toBe(400);

    let p = (await call("POST", "/api/case-profit/gs-rfq-0131/actuals")).body;
    expect(check(p, "actuals").ok).toBe(true);
    const c = (await call("GET", "/api/cases/gs-rfq-0131?depth=0")).body;
    expect(c.pricing.charges.find((x: { label: string }) => /Launch/.test(x.label))).toMatchObject({
      amountEGP: 3_800,
      actualEGP: 6_900,
      status: "Confirmed",
    });

    p = (await call("POST", "/api/case-profit/gs-rfq-0131/claims/CLM-0131-1")).body;
    expect(check(p, "claims").ok).toBe(true);
    const cn = (await call("GET", "/api/supplier-bills?where[billNumber][equals]=CN-DM-031&depth=0")).body;
    expect(cn.docs[0]).toMatchObject({ status: "Credit note", amount: 1_240 });

    p = (await call("POST", "/api/case-profit/gs-rfq-0131/receipt", { reference: "TRX-80001" })).body;
    expect(check(p, "paid").ok).toBe(true);
    expect((await call("GET", "/api/invoices/inv-0412?depth=0")).body.status).toBe("Paid");
    expect(p.checks.filter((k: { ok: boolean }) => !k.ok)).toEqual([]);
    expect(p.canClose).toBe(true);

    p = (await call("POST", "/api/case-profit/gs-rfq-0131/close")).body;
    expect(p.closed).toBe(true);
    expect((await call("GET", "/api/cases/gs-rfq-0131?depth=0")).body.stage).toBe("Closed — settled");
  });

  it("lets only finance roles act", async () => {
    await as("karim.youssef");
    expect((await call("GET", "/api/case-profit/gs-rfq-0133")).status).toBe(200);
    expect((await call("POST", "/api/case-profit/gs-rfq-0133/actuals")).status).toBe(403);
  });
});

describe("control room (/api/control-room)", () => {
  it("sends profit & cash to management and finance only", async () => {
    await as("karim.balbaa");
    const kb = (await call("GET", "/api/control-room?period=4w")).body;
    expect(kb.money).toBe(true);
    expect(kb.sections.map((s: { id: string }) => s.id)).toEqual(["pipeline", "speed", "money", "delivery"]);
    const turnaround = kb.sections[1].widgets.find((w: { title: string }) => w.title === "Quote turnaround");
    expect(turnaround.labels).toHaveLength(4);
    await as("soaad.amer");
    const sa = (await call("GET", "/api/control-room")).body;
    expect(sa.money).toBe(false);
    expect(JSON.stringify(sa)).not.toMatch(/Gross profit|Margin by/);
  });
});

describe("07:00 briefing and Ask Golden Sea", () => {
  it("writes the briefing from live records, with sources", async () => {
    await as("karim.balbaa");
    const b = (await call("GET", "/api/briefing")).body;
    expect(b.at).toBe("07:00");
    expect(b.greeting).toBe("Good morning Karim.");
    expect(b.items.length).toBeGreaterThan(2);
    expect(b.items.every((i: { sources: unknown[] }) => i.sources.length > 0)).toBe(true);
  });

  it("answers about a vessel and cites the case", async () => {
    await as("karim.balbaa");
    const a = (await call("POST", "/api/ask", { question: "What's the status of Aurora Crest?" })).body;
    expect(a.intent).toBe("case");
    expect(a.answer).toMatch(/GS-RFQ-0142/);
    expect(a.sources[0]).toMatchObject({ label: "GS-RFQ-0142", href: "/collections/cases/gs-rfq-0142" });
  });

  it("answers approvals, cash and suppliers, and refuses margins for Sales", async () => {
    await as("karim.balbaa");
    expect((await call("POST", "/api/ask", { question: "What is waiting for approval?" })).body.intent).toBe(
      "approvals",
    );
    const cash = (await call("POST", "/api/ask", { question: "Who owes us money?" })).body;
    expect(cash.intent).toBe("cash");
    expect(cash.sources.length).toBeGreaterThan(0);
    expect((await call("POST", "/api/ask", { question: "Which suppliers are late?" })).body.intent).toBe("suppliers");
    expect((await call("POST", "/api/ask", { question: "What's our margin this month?" })).body.intent).toBe("margin");
    await as("soaad.amer");
    const refused = (await call("POST", "/api/ask", { question: "What's our margin this month?" })).body;
    expect(refused).toMatchObject({ intent: "refused", refused: true, sources: [] });
  });
});

describe("growth CRM (/api/growth)", () => {
  it("lays out the board, fleets, registrations, campaigns and next steps", async () => {
    await as("soaad.amer");
    const g = (await call("GET", "/api/growth")).body;
    expect(g.stages).not.toContain("Closed");
    const stage = (s: string) => g.columns.find((c: { stage: string }) => c.stage === s).deals;
    expect(stage("Registration submitted").map((d: { name: string }) => d.name)).toContain("Gulf Star Shipping");
    expect(g.steps.find((s: { company: string }) => s.company === "Medline Tankers").noNext).toBe(true);
    const gulf = g.fleets.find((f: { company: string }) => f.company === "Gulf Star Shipping");
    expect(gulf.vessels[0]).toMatchObject({ imo: "9441201" });
    expect(g.canSend).toBe(false);
  });

  it("records an outcome and plans the next step", async () => {
    await as("karim.youssef");
    expect(
      (await call("POST", "/api/growth/op-gulfstar/outcome", { result: "Reached — positive", note: "x" })).status,
    ).toBe(400);
    const g = (
      await call("POST", "/api/growth/op-gulfstar/outcome", {
        result: "Reached — positive",
        note: "Committee meets 24 Nov; documents complete.",
        nextStep: "Call after the committee decision",
        nextStepDue: "2026-11-25",
      })
    ).body;
    const step = g.steps.find((s: { id: string }) => s.id === "op-gulfstar");
    expect(step).toMatchObject({ goal: "Call after the committee decision", due: "25 Nov" });
    expect(step.last).toMatchObject({ result: "Reached — positive", by: "Karim Youssef" });
    const tasks = (await call("GET", "/api/tasks?where[opportunity][equals]=op-gulfstar&depth=0")).body.docs;
    expect(
      tasks.some((t: { status: string; type: string }) => t.status === "Open" && t.type === "Sales next step"),
    ).toBe(true);
    expect((await call("GET", "/api/tasks/t-gulfstar?depth=0")).body.status).toBe("Done");
  });
});
