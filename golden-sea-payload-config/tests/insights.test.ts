import type { CollectionSettings } from "saastemlycrm-design-system/contracts";
import { matches } from "saastemlycrm-design-system/payload";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { Suppliers } from "../src/collections/directory.ts";
import { Opportunities } from "../src/collections/growth.ts";
import { controlRoom } from "../src/pages/control-room.ts";
import { BOARD_STAGES } from "../src/queries/growth.ts";
import { backend, call, login } from "./backend.ts";

/** Insights & growth: profit & close, the control room, the 07:00 briefing, Ask Golden Sea, growth CRM. */

beforeEach(() => {
  backend.reset();
});

// oxlint-disable-next-line typescript/no-explicit-any
const check = (p: any, key: string) => p.checks.find((k: { key: string }) => k.key === key);

describe("profit & close (/api/case-profit/:id)", () => {
  it("keeps profit from Sales and needs a login", async () => {
    expect((await call("GET", "/api/case-profit/gs-rfq-0131")).status).toBe(401);
    await login("soaad.amer");
    expect((await call("GET", "/api/case-profit/gs-rfq-0131")).status).toBe(403);
  });

  it("compares expected with actual: actual costs, FX on receipts and the open claim", async () => {
    await login("mohamed.helmy");
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
    await login("mohamed.helmy");
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
    await login("karim.youssef");
    expect((await call("GET", "/api/case-profit/gs-rfq-0133")).status).toBe(200);
    expect((await call("POST", "/api/case-profit/gs-rfq-0133/actuals")).status).toBe(403);
  });
});

describe("control room (/api/control-room)", () => {
  it("sends profit & cash to management and finance only", async () => {
    await login("karim.balbaa");
    const kb = (await call("GET", "/api/control-room?period=4w")).body;
    expect(kb.money).toBe(true);
    expect(kb.sections.map((s: { id: string }) => s.id)).toEqual(["pipeline", "speed", "money", "delivery"]);
    const turnaround = kb.sections[1].widgets.find((w: { title: string }) => w.title === "Quote turnaround");
    // The period sets the key figures' window; a trend always carries its whole history for the chart to cut.
    expect(kb.tiles.find((t: { trend?: unknown }) => t.trend).trend.labels).toHaveLength(4);
    expect(turnaround.labels).toHaveLength(12);
    expect(turnaround.ranges).toEqual([4, 8, 12]);
    await login("soaad.amer");
    const sa = (await call("GET", "/api/control-room")).body;
    expect(sa.money).toBe(false);
    expect(JSON.stringify(sa)).not.toMatch(/Gross profit|Margin by/);
  });

  it("counts each supplier's open RFQs on the supplier, as the supplier table reads it", async () => {
    await login("karim.balbaa");
    const open = ["Sent", "Awaiting reply", "Partial reply", "No response"];
    const rfqs = (await call("GET", "/api/supplier-rfqs?limit=0&depth=0")).body.docs as {
      supplier: string;
      status: string;
    }[];
    const suppliers = (await call("GET", "/api/suppliers?limit=0&depth=0")).body.docs as {
      id: string;
      openRfqs: number;
    }[];
    for (const s of suppliers)
      expect(s.openRfqs, s.id).toBe(rfqs.filter((r) => r.supplier === s.id && open.includes(r.status)).length);
    expect(suppliers.some((s) => s.openRfqs > 0)).toBe(true);
  });

  it("says on the suppliers' fields what their figures mean, and ranks the busiest owner first", async () => {
    await login("karim.balbaa");
    type Field = { name?: string; fields?: Field[]; tabs?: { fields: Field[] }[]; custom?: Record<string, never> };
    const flat = (fs: Field[]): Field[] =>
      fs.flatMap((f) => (f.tabs ? f.tabs.flatMap((t) => flat(t.fields)) : !f.name && f.fields ? flat(f.fields) : [f]));
    const field = (name: string) => flat(Suppliers.fields as Field[]).find((f) => f.name === name)!;
    const tone = (name: string, doc: Record<string, unknown>) =>
      (field(name).custom!.toneWhen as { when: never; tone: string }[]).find((r) => matches(doc, r.when))?.tone;
    const table = controlRoom.clientProps.page.widgets.find((w) => w.title === "Supplier on-time vs reply time")!;
    expect(table.records!.columns).toEqual(["name", "onTime", "replyHrs", "openRfqs"]);
    // On time: a bar of 100%, amber under 85%, green from there; a reply past a day in amber.
    expect(field("onTime").custom!.gauge).toEqual({ max: 100 });
    const suppliers = (await call("GET", "/api/suppliers?limit=0&depth=0")).body.docs as Record<string, number>[];
    const late = suppliers.filter((s) => typeof s.onTime === "number" && s.onTime < 85);
    expect(late.length).toBeGreaterThan(0);
    for (const s of suppliers.filter((x) => typeof x.onTime === "number"))
      expect(tone("onTime", s)).toBe(s.onTime! < 85 ? "warning" : "success");
    expect(tone("replyHrs", { replyHrs: 30 })).toBe("warning");
    expect(tone("replyHrs", { replyHrs: 6 })).toBeUndefined();
    const owners = controlRoom.clientProps.page.widgets.find((w) => w.title === "Live cases per owner")!;
    // A ring of each owner's share, its parts largest first (the ring's own order).
    expect(owners.breakdown).toMatchObject({ collection: "cases", by: "owner", as: "ring" });
  });
});

describe("07:00 briefing and Ask Golden Sea", () => {
  it("writes the briefing from live records, with sources", async () => {
    await login("karim.balbaa");
    const b = (await call("GET", "/api/briefing")).body;
    expect(b.at).toBe("07:00");
    expect(b.greeting).toBe("Good morning Karim.");
    expect(b.items.length).toBeGreaterThan(2);
    expect(b.items.every((i: { sources: unknown[] }) => i.sources.length > 0)).toBe(true);
  });

  it("Summarise re-reads the records and stamps later briefings with the new time", async () => {
    await login("karim.balbaa");
    const r = await call("POST", "/api/briefing/refresh");
    expect(r.status).toBe(200);
    expect(r.body.message).toMatch(/^Summarised again at/);
    expect((await call("GET", "/api/briefing")).body.at).toBe(r.body.at);
  });

  it("matches a remittance to open invoices by number digits or equal balance", async () => {
    await login("mohamed.helmy");
    const byNumber = await call("POST", "/api/cash/match", { invoices: "0412" });
    expect(byNumber.status).toBe(200);
    expect(byNumber.body.message).toMatch(/INV\/2026\/0412/);
    expect(byNumber.body.href).toMatch(/^\/collections\/invoices\//);
    expect((await call("POST", "/api/cash/match", { invoices: "nothing", amount: 1.23 })).status).toBe(400);
  });

  it("answers about a vessel and cites the case", async () => {
    await login("karim.balbaa");
    const a = (await call("POST", "/api/ask", { question: "What's the status of Aurora Crest?" })).body;
    expect(a.intent).toBe("case");
    expect(a.answer).toMatch(/GS-RFQ-0142/);
    expect(a.sources[0]).toMatchObject({ label: "GS-RFQ-0142", href: "/collections/cases/gs-rfq-0142" });
  });

  it("answers approvals, cash and suppliers, and refuses margins for Sales", async () => {
    await login("karim.balbaa");
    expect((await call("POST", "/api/ask", { question: "What is waiting for approval?" })).body.intent).toBe(
      "approvals",
    );
    const cash = (await call("POST", "/api/ask", { question: "Who owes us money?" })).body;
    expect(cash.intent).toBe("cash");
    expect(cash.sources.length).toBeGreaterThan(0);
    expect((await call("POST", "/api/ask", { question: "Which suppliers are late?" })).body.intent).toBe("suppliers");
    expect((await call("POST", "/api/ask", { question: "What's our margin this month?" })).body.intent).toBe("margin");
    await login("soaad.amer");
    const refused = (await call("POST", "/api/ask", { question: "What's our margin this month?" })).body;
    expect(refused).toMatchObject({ intent: "refused", refused: true, sources: [] });
  });
});

describe("growth CRM (/api/growth)", () => {
  it("lays out the fleets per ship manager across customers, vessels and prospects", async () => {
    await login("soaad.amer");
    const g = (await call("GET", "/api/growth")).body;
    const gulf = g.fleets.find((f: { company: string }) => f.company === "Gulf Star Shipping");
    expect(gulf.vessels[0]).toMatchObject({ imo: "9441201" });
  });

  it("keeps the board, the next steps, registrations and campaigns on their collections", async () => {
    await login("soaad.amer");
    expect(BOARD_STAGES).not.toContain("Closed");
    const opps = (await call("GET", "/api/opportunities?limit=0&depth=1")).body.docs as Record<string, unknown>[];
    const byName = (n: string) => opps.find((o) => o.name === n)!;
    expect(byName("Gulf Star Shipping").stage).toBe("Registration submitted");
    // No next step: flagged (in red), briefed, and offered "Plan next step" rather than "Record outcome".
    const medline = byName("Medline Tankers");
    expect(medline).toMatchObject({ noNextStep: true, step: "No next step — plan one or close" });
    const step = (Opportunities.fields as never as { name?: string; custom?: Record<string, never> }[]).find(
      (f) => f.name === "step",
    )!;
    const stepTone = (o: Record<string, unknown>) =>
      (step.custom!.toneWhen as { when: never; tone: string }[]).find((r) => matches(o, r.when))?.tone;
    expect(stepTone(medline)).toBe("error");
    // A step past its date is overdue, in red; a planned one reads as its day.
    expect(stepTone({ noNextStep: false, nextStepDue: "2026-11-10" })).toBe("error");
    expect(stepTone({ noNextStep: false, nextStepDue: "2026-11-25" })).toBeUndefined();
    expect(medline.brief).toMatch(/^Plan the next step, or close the opportunity\./);
    const actions = (Opportunities.custom as CollectionSettings).actions!;
    const offered = (o: Record<string, unknown>) =>
      actions.filter((a) => matches(o, a.when as never)).map((a) => a.label);
    expect(offered(medline)).toEqual(["Plan next step"]);
    expect(offered(byName("Gulf Star Shipping"))).toEqual(["Record outcome"]);
    // A step with what to say; the last outcome only once one is recorded (below).
    expect(opps.some((o) => o.script && o.brief === o.nextStep)).toBe(true);
    expect(opps.filter((o) => !(o.outcomes as unknown[] | undefined)?.length).every((o) => o.lastOutcome == null)).toBe(
      true,
    );
    const regs = (await call("GET", "/api/vendor-registrations?limit=0&depth=0")).body.docs as Record<
      string,
      unknown
    >[];
    expect(regs.some((r) => /— missing/.test(String(r.paperwork)))).toBe(true);
    const campaigns = (await call("GET", "/api/campaigns?limit=0&depth=0")).body.docs as Record<string, unknown>[];
    expect(campaigns.every((c) => /contacts/.test(String(c.reach)))).toBe(true);
  });

  it("records an outcome and plans the next step", async () => {
    await login("karim.youssef");
    expect(
      (await call("POST", "/api/growth/op-gulfstar/outcome", { result: "Reached — positive", note: "x" })).status,
    ).toBe(400);
    const saved = (
      await call("POST", "/api/growth/op-gulfstar/outcome", {
        result: "Reached — positive",
        note: "Committee meets 24 Nov; documents complete.",
        nextStep: "Call after the committee decision",
        nextStepDue: "2026-11-25",
      })
    ).body;
    expect(saved.message).toMatch(/next step “Call after the committee decision” planned for 25 Nov/);
    // The opportunity now says so itself: its next step, its date and its brief with the outcome.
    const opp = (await call("GET", "/api/opportunities/op-gulfstar?depth=1")).body;
    expect(opp).toMatchObject({ nextStep: "Call after the committee decision", noNextStep: false, step: "25 Nov" });
    expect(opp.nextStepDue).toMatch(/^2026-11-25/);
    expect(opp.brief).toBe("Call after the committee decision");
    expect(opp.lastOutcome).toMatch(
      /Last: Reached — positive — Committee meets 24 Nov; documents complete\. \(Karim Youssef/,
    );
    const tasks = (await call("GET", "/api/tasks?where[opportunity][equals]=op-gulfstar&depth=0")).body.docs;
    expect(
      tasks.some((t: { status: string; type: string }) => t.status === "Open" && t.type === "Sales next step"),
    ).toBe(true);
    expect((await call("GET", "/api/tasks/t-gulfstar?depth=0")).body.status).toBe("Done");
  });
});
