import { beforeEach, describe, expect, it } from "vite-plus/test";
import { inOfficeHours } from "../src/endpoints/platform.ts";
import { backend, call, login } from "./backend.ts";

/** Platform & trust: case overview and handover, automations, roles & on-call, integrations, delivery plan. */

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
});

describe("case overview", () => {
  it("places the case on the 16-step lifecycle and counts lines without showing them complete", async () => {
    const { status, body } = await call("GET", "/api/case-overview/gs-rfq-0142");
    expect(status).toBe(200);
    expect(body.steps).toHaveLength(16);
    expect(body.steps[body.current].label).toBe("Compare");
    expect(body.lines).toMatchObject({ total: 6, ready: 3, waiting: 2, blocked: 1, noOffer: 0 });
    expect(body.fulfilment.started).toBe(false);
    expect(body.customer.contactRule).toBe("one-follow-up");
    expect(body.clarifications.filter((q: { open: boolean }) => q.open)).toHaveLength(1);
    expect(body.timeline[0].at >= body.timeline[body.timeline.length - 1].at).toBe(true);
    expect(body.value).toBe(7480);
  });

  it("counts a short receipt and an undelivered drop as not done", async () => {
    const { body } = await call("GET", "/api/case-overview/gs-rfq-0133");
    expect(body.steps[body.current].label).toBe("Deliver");
    // Lines arrived short and the first drop isn't confirmed yet: nothing reads as done.
    expect(body.fulfilment).toMatchObject({ started: true, delivered: 0 });
    expect(body.fulfilment.received).toBeLessThan(body.fulfilment.ordered);
    expect(body.fulfilment.notes.join(" ")).toMatch(/short/);
  });

  it("never gives Sales the case value", async () => {
    await login("soaad.amer");
    const { body } = await call("GET", "/api/case-overview/gs-rfq-0142");
    expect(body.value).toBeUndefined();
  });

  it("drafts a handover and reassigns with a note, moving open tasks and notifying the new owner", async () => {
    const draft = await call("POST", "/api/case-overview/gs-rfq-0142/handover", { to: "sa" });
    expect(draft.body.draft).toMatch(/GS-RFQ-0142/);
    expect(draft.body.draft).toMatch(/size breakdown/);
    expect((await call("POST", "/api/case-overview/gs-rfq-0142/reassign", { to: "sa", note: "" })).status).toBe(400);
    const { body } = await call("POST", "/api/case-overview/gs-rfq-0142/reassign", {
      to: "sa",
      note: draft.body.draft,
    });
    expect(body.movedTasks).toBe(3);
    const c = (await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body;
    expect(c).toMatchObject({ owner: "sa", backup: "ky" });
    const acts = (await call("GET", "/api/activities?where[case][equals]=gs-rfq-0142&limit=0&depth=0")).body.docs;
    expect(acts.some((a: { text: string }) => a.text.startsWith("Reassigned to Soaad Amer"))).toBe(true);
    await login("soaad.amer");
    const n = (await call("GET", "/api/notifications?limit=0")).body.docs;
    expect(n.some((x: { title: string }) => x.title === "You now own GS-RFQ-0142")).toBe(true);
  });

  it("lets only the desk, management, owner or backup reassign", async () => {
    await login("mohamed.helmy");
    expect((await call("POST", "/api/case-overview/gs-rfq-0142/reassign", { to: "sa", note: "x" })).status).toBe(403);
  });
});

describe("automations", () => {
  it("lists the rule registry, exceptions, review queue and audit log", async () => {
    const { body } = await call("GET", "/api/automations");
    expect(body.rules.length).toBeGreaterThan(15);
    for (const r of body.rules) expect(r).toMatchObject({ trigger: expect.any(String), action: expect.any(String) });
    expect(body.stats.open).toBe(2);
    expect(body.review.some((r: { id: string }) => r.id === "gs-rfq-0142#6")).toBe(true);
    expect(body.review.some((r: { id: string }) => r.id === "ex-ai-polarbay")).toBe(true);
    expect(body.audit.length).toBeGreaterThan(10);
    expect(body.canEdit).toBe(false);
  });

  it("retries safely: the mailbox reconnects once, and a second retry changes nothing", async () => {
    const first = await call("POST", "/api/automations/retry/ex-outlook");
    expect(first.body).toMatchObject({ alreadyDone: false });
    expect(first.body.message).toMatch(/12 imported/);
    const x = (await call("GET", "/api/integration-exceptions/ex-outlook")).body;
    expect(x).toMatchObject({ status: "Resolved", retries: 4 });
    const g = (await call("GET", "/api/globals/integrations")).body;
    const mailbox = g.connections.find((c: { account: string }) => c.account === "purchasing@");
    expect(mailbox).toMatchObject({ status: "Connected", emailsImported: 1324 });
    const second = await call("POST", "/api/automations/retry/ex-outlook");
    expect(second.body.alreadyDone).toBe(true);
    const again = (await call("GET", "/api/globals/integrations")).body;
    expect(again.connections.find((c: { account: string }) => c.account === "purchasing@").emailsImported).toBe(1324);
    const audit = (await call("GET", "/api/activities?where[rule][equals]=Safe retry&limit=0")).body;
    expect(audit.totalDocs).toBe(1);
  });

  it("resolves a review item with a person's name on it", async () => {
    await call("POST", "/api/automations/review/ex-ai-polarbay", {});
    const x = (await call("GET", "/api/integration-exceptions/ex-ai-polarbay?depth=0")).body;
    expect(x).toMatchObject({ status: "Resolved", resolvedBy: "ky" });
  });
});

describe("roles & on-call", () => {
  it("knows office hours in Cairo (Sun–Thu 08:00–17:00)", () => {
    expect(inOfficeHours(new Date("2026-11-17T09:30:00.000Z"))).toBe(true); // Tue 11:30
    expect(inOfficeHours(new Date("2026-11-17T19:40:00.000Z"))).toBe(false); // Tue 21:40
    expect(inOfficeHours(new Date("2026-11-20T08:00:00.000Z"))).toBe(false); // Fri 10:00
    expect(inOfficeHours(new Date("2026-11-22T06:30:00.000Z"))).toBe(true); // Sun 08:30
  });

  it("routes urgent RFQs after hours to the on-duty person, and notifies them when simulated", async () => {
    const day = (await call("POST", "/api/on-call/route", { at: "2026-11-17T09:30:00.000Z" })).body;
    expect(day).toMatchObject({ inHours: true, routedTo: null });
    const night = (await call("POST", "/api/on-call/route", { at: "2026-11-17T19:40:00.000Z", simulate: true })).body;
    expect(night).toMatchObject({ inHours: false, routedTo: { id: "ky" }, backup: { id: "ah" } });
    const friday = (await call("POST", "/api/on-call/route", { at: "2026-11-20T08:00:00.000Z" })).body;
    expect(friday.routedTo.id).toBe("ky");
    const n = (await call("GET", "/api/notifications?limit=0")).body.docs;
    expect(n.some((x: { kind: string; title: string }) => x.kind === "Alert" && /on call/.test(x.title))).toBe(true);
  });

  it("serves the matrix with live checks; only management edits it", async () => {
    const { body } = await call("GET", "/api/roles");
    expect(body.permissions).toHaveLength(8);
    const sales = body.roles.find((r: { role: string }) => r.role === "sales");
    expect(sales).toMatchObject({ supplierCosts: false, margins: false });
    expect(sales.users.map((u: { id: string }) => u.id)).toEqual(["sa"]);
    expect(body.checks.every((c: { pass: boolean }) => c.pass)).toBe(true);
    expect(body.canEditPermissions).toBe(false);
    expect((await call("POST", "/api/globals/settings", { permissions: [] })).status).toBe(403);
    await login("karim.balbaa");
    expect((await call("POST", "/api/globals/settings", { permissions: body.roles })).status).toBe(200);
  });
});

describe("integrations", () => {
  it("renders the acknowledgement in English and Arabic and reconnects a mailbox through the safe retry", async () => {
    const { body } = await call("GET", "/api/integrations/status");
    expect(body.ack.en.subject).toContain("GS-RFQ-0142");
    expect(body.ack.ar.body).toContain("جولدن سي");
    expect(body.ack.en.body).not.toMatch(/\{\{/);
    expect(body.canManage).toBe(false);
    const idx = body.connections.findIndex((c: { account: string }) => c.account === "purchasing@");
    expect((await call("POST", "/api/integrations/reconnect", { index: idx })).status).toBe(403);
    await login("ahmedy");
    const r = await call("POST", "/api/integrations/reconnect", { index: idx });
    expect(r.body.message).toMatch(/12 imported/);
    expect((await call("GET", "/api/integration-exceptions/ex-outlook")).body.status).toBe("Resolved");
  });
});

describe("delivery plan (client-facing)", () => {
  it("links every work package to a demo screen and shows no prices, rates or effort", async () => {
    const { token } = (await login("karim.youssef")).body;
    const { text } = await call("GET", "/api/project", undefined, { authorization: `JWT ${token}` });
    // Currencies may be named (quotes in EGP or USD); amounts, rates, effort and our costs may not.
    expect(text).not.toMatch(
      /\b(EGP|USD|EUR)\s*\d|\d[\d.,]*\s*k?\s*(EGP|USD|EUR)\b|day rate|effort|our cost|partner note|\d{1,3}(,\d{3})+|per month|\/\s*mo\b/i,
    );
    const body = JSON.parse(text);
    expect(body.phases).toHaveLength(4);
    expect(body.acceptance).toHaveLength(10);
    expect(body.acceptance.filter((a: { pass: boolean }) => a.pass).length).toBeGreaterThanOrEqual(9);
    const hrefs = [...body.phases.flatMap((p: { packages: { href: string }[] }) => p.packages), ...body.platform]
      .map((p: { href: string }) => p.href)
      .filter(Boolean);
    for (const h of [
      "/inbox",
      "/inbox-history",
      "/collections/cases/gs-rfq-0142/rfqs",
      "/collections/cases/gs-rfq-0142/compare",
      "/collections/cases/gs-rfq-0142/pricing",
      "/collections/quotations/q-0142-v1/preview",
      "/approvals",
      "/collections/cases/gs-rfq-0136/order",
      "/collections/cases/gs-rfq-0133/delivery",
      "/cash",
      "/collections/cases/gs-rfq-0131/profit",
      "/control-room",
      "/growth",
      "/automations",
      "/roles",
      "/integrations",
    ])
      expect(hrefs, h).toContain(h);
  });
});
