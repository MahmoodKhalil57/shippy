import { beforeEach, describe, expect, it } from "vite-plus/test";
import { migration } from "../src/format/integrations.ts";
import { payback } from "../src/format/service.ts";
import type { UsageView } from "../src/endpoints/service.ts";
import { backend, call, login } from "./backend.ts";

type Json = Record<string, any>;

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
});

describe("AI log", () => {
  it("logs every AI call the platform makes, marked as the demo stub", async () => {
    const before = (await call("GET", "/api/ai-calls?limit=0&depth=0")).body.totalDocs;
    await call("POST", "/api/ask", { question: "What's the status of Aurora Crest?" });
    const docs = (await call("GET", "/api/ai-calls?limit=0&depth=0&sort=-at")).body.docs as Json[];
    expect(docs).toHaveLength(before + 1);
    expect(docs[0]).toMatchObject({
      task: "Answer a question",
      subject: "What's the status of Aurora Crest?",
      model: "Demo stub (no live AI)",
    });
  });

  it("confirms an AI handover draft under the name of the person who sent it", async () => {
    const draft = await call("POST", "/api/case-overview/gs-rfq-0142/handover", { to: "sa" });
    const q = `where[case][equals]=gs-rfq-0142&where[task][equals]=Draft a handover&depth=0`;
    expect((await call("GET", `/api/ai-calls?${q}`)).body.docs[0]).toMatchObject({ outcome: "Waiting for review" });
    await call("POST", "/api/case-overview/gs-rfq-0142/reassign", { to: "sa", note: draft.body.draft });
    expect((await call("GET", `/api/ai-calls?${q}`)).body.docs[0]).toMatchObject({
      outcome: "Confirmed by a person",
      reviewedBy: "ky",
    });
  });

  it("can't be deleted, and only management changes an entry", async () => {
    expect((await call("DELETE", "/api/ai-calls/ai-001")).status).toBeGreaterThanOrEqual(400);
    expect((await call("PATCH", "/api/ai-calls/ai-001", { outcome: "Rejected" })).status).toBe(403);
  });
});

describe("service usage", () => {
  it("counts each measure this month in units, never prices", async () => {
    const { text, body } = await call("GET", "/api/usage");
    expect(text).not.toMatch(/\b(EGP|USD|EUR)\b|\d{1,3}(,\d{3})+|per month/i);
    const u = body as UsageView;
    expect(u.month).toBe("November 2026");
    expect(u.lines.map((l) => l.measure)).toEqual([
      "Documents read",
      "Questions answered",
      "Briefings written",
      "Emails processed",
      "Support hours",
      "Change requests",
    ]);
    const used = Object.fromEntries(u.lines.map((l) => [l.measure, l.used]));
    // What was counted earlier this month, plus the AI log, the inbox and the global's logs.
    expect(used["Support hours"]).toBe(7.5);
    expect(used["Change requests"]).toBe(3);
    expect(used["Emails processed"]).toBe(1120 + 8);
    expect(u.measured.waitingForReview).toBe(2);
  });

  it("counts a question asked now", async () => {
    const before = (await call("GET", "/api/usage")).body as UsageView;
    await call("POST", "/api/ask", { question: "Who owes us money this week?" });
    const after = (await call("GET", "/api/usage")).body as UsageView;
    const q = (u: UsageView) => u.lines.find((l) => l.measure === "Questions answered")!.used;
    expect(q(after)).toBe(q(before) + 1);
  });
});

describe("value", () => {
  it("starts the payback at the proposal's illustration, Golden Sea's side only", async () => {
    const u = (await call("GET", "/api/usage")).body as UsageView;
    const w = payback(u);
    const start = Object.fromEntries(w.inputs.map((i) => [i.key, i.value]));
    const out = Object.fromEntries(w.compute(start).map((f) => [f.label, f.value]));
    // 5 × 56,417 × 20% + 5 people × 5 h × 52/12 weeks × EGP 150 (the proposal's ≈ 72,700).
    expect(out["Margin from extra orders a month"]).toBe("EGP 56,417");
    expect(out["Time saved a month"]).toBe("EGP 16,250");
    expect(out["Value a month"]).toBe("EGP 72,667");
    expect(JSON.stringify(w.compute(start))).not.toMatch(/running|licen|net of/i);
  });
});

describe("Odoo migration", () => {
  it("adds up what moved and what a person checked, and holds Odoo on until every part is done", async () => {
    const g = (await call("GET", "/api/globals/integrations?depth=0")).body as Json;
    expect(g.migration.length).toBeGreaterThan(0);
    const items = migration(g).items;
    expect(items.map((i) => i.label)).toEqual(["Moved into the platform", "Checked against Odoo", "Parts done"]);
    expect(items[2]!.note).toBe("Odoo stays on until every part is done");
    const done = { migration: g.migration.map((p: Json) => ({ ...p, status: "Done" })) };
    expect(migration(done).items[2]!.note).toBe("Ready to switch Odoo off");
  });
});

describe("seed matches the proposal", () => {
  it("has a handover note, a 4-of-6-months shelf life, an escalated RFQ and a dated price history", async () => {
    const c = (await call("GET", "/api/cases/gs-rfq-0135?depth=0")).body as Json;
    expect(c.handoverNote).toMatch(/ESAB alternative/);
    const offer = (await call("GET", "/api/offers/off-l3-s1?depth=0")).body as Json;
    expect(offer.deviations.find((d: Json) => d.type === "Shelf life").detail).toMatch(/4 months left.*6 months/);
    const rfq = (await call("GET", "/api/supplier-rfqs/srfq-0141-a?depth=0")).body as Json;
    expect(rfq).toMatchObject({ reminders: 2, escalated: true });
    const prices = (await call("GET", "/api/supplier-prices?limit=0&depth=0")).body.docs as Json[];
    expect(prices.length).toBeGreaterThanOrEqual(10);
    expect(prices.filter((p) => !p.ordered).length).toBeGreaterThan(prices.filter((p) => p.ordered).length);
  });
});
