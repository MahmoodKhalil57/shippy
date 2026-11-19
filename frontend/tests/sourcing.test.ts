import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import config from "../src/cms/config.ts";
import { Engine } from "../src/mock/runtime/engine.ts";
import { RestApi } from "../src/mock/runtime/rest.ts";
import { seedsFromGlob } from "../src/mock/runtime/seed.ts";
import { MemoryStore } from "../src/mock/runtime/store.ts";
import { lineCategory } from "../src/cms/endpoints/sourcing.ts";

/** The sourcing desk's endpoints: inbox (extraction, matching, case creation), inbox history, supplier RFQs. */

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
  const type = res.headers.get("content-type") ?? "";
  // oxlint-disable-next-line typescript/no-explicit-any
  const body: any = type.includes("json") ? await res.json() : await res.text();
  return { status: res.status, body };
};
const login = (email = "karim.youssef@goldensea.test") =>
  call("POST", "/api/users/login", { email, password: "demo1234" });

beforeEach(() => {
  api = new RestApi(new Engine(config, new MemoryStore()), seeds);
});

describe("inbox", () => {
  it("needs a signed-in user", async () => {
    expect((await call("GET", "/api/inbox")).status).toBe(401);
  });

  it("lists live messages with their channels and the review queue", async () => {
    await login();
    const { status, body } = await call("GET", "/api/inbox");
    expect(status).toBe(200);
    expect(body.messages.length).toBeGreaterThanOrEqual(8);
    expect(body.messages.map((m: { channel: string }) => m.channel)).toEqual(
      expect.arrayContaining(["Email", "WhatsApp", "Website form"]),
    );
    const review = body.messages.find((m: { id: string }) => m.id === "msg-delta-uncertain");
    expect(review.status).toBe("Needs review");
    expect(review.match.candidates.map((c: { caseId: string }) => c.caseId)).toEqual(["GS-RFQ-0142", "GS-RFQ-0140"]);
  });

  it("simulates the Aurora Crest RFQ, extracts a draft with confidence and creates the case once", async () => {
    await login();
    const sim = await call("POST", "/api/inbox/simulate", { kind: "rfq" });
    expect(sim.status).toBe(201);
    const id = sim.body.doc.id;
    expect(sim.body.doc.files.map((f: { name: string }) => f.name)).toEqual([
      "RFQ_AuroraCrest.xlsx",
      "deck_stores.pdf",
      "WhatsApp photo · label.jpg",
    ]);

    const x = await call("POST", `/api/inbox/${id}/extract`);
    expect(x.body.kind).toBe("extraction");
    expect(x.body.lines).toHaveLength(6);
    expect(x.body.lines[0]).toMatchObject({ impa: "812561", brandRule: "Exact brand", source: "RFQ_AuroraCrest.xlsx" });
    const low = x.body.lines.filter((l: { confidence: number }) => l.confidence < 0.8);
    expect(low.map((l: { lineNo: number }) => l.lineNo)).toEqual([6]);
    expect(x.body.header.find((f: { field: string }) => f.field === "Customer ref").confidence).toBeLessThan(0.6);
    expect(x.body.assignment).toMatchObject({ owner: "ky", backup: "sa" });
    expect(x.body.clarification).toContain("Gasket sheet");

    const created = await call("POST", `/api/inbox/${id}/create-case`, {});
    expect(created.status).toBe(201);
    expect(created.body.acknowledged).toBe(true);
    const c = await call("GET", `/api/cases/${created.body.case.id}?depth=0`);
    expect(c.body).toMatchObject({
      customer: "nordvik",
      vessel: "MV Aurora Crest",
      port: "Alexandria",
      owner: "ky",
      sourceMessage: id,
    });
    expect(c.body.items).toHaveLength(6);
    expect(c.body.items[4].unit).toBe("roll");
    expect(c.body.items[5].status).toBe("Clarification needed");

    const again = await call("POST", `/api/inbox/${id}/create-case`, {});
    expect(again.body).toMatchObject({ already: true, case: { id: created.body.case.id } });
    const msg = await call("GET", `/api/intake-messages/${id}?depth=0`);
    expect(msg.body).toMatchObject({ status: "Case created", createdCase: created.body.case.id });
    expect(msg.body.acknowledgedAt).toBeTruthy();

    // The forwarded copy (same files) is a duplicate: no new case.
    const fw = await call("POST", "/api/inbox/simulate", { kind: "forward" });
    const dup = await call("POST", `/api/inbox/${fw.body.doc.id}/extract`);
    expect(dup.body.kind).toBe("duplicate");
    expect(dup.body.match).toMatchObject({ outcome: "duplicate", case: created.body.case.id });
    expect(dup.body.message.status).toBe("Linked");
  });

  it("matches a reply with a changed subject by its reference and captures the offer", async () => {
    await login();
    const sim = await call("POST", "/api/inbox/simulate", { kind: "reply" });
    const { body } = await call("POST", `/api/inbox/${sim.body.doc.id}/match`);
    expect(body.match).toMatchObject({
      outcome: "linked",
      reference: "GS-SRFQ-0142-E",
      caseId: "GS-RFQ-0142",
      supplier: "S3",
    });
    expect(body.match.basis.join(" ")).toContain("Subject changed");
    const rfq = await call("GET", "/api/supplier-rfqs/srfq-0142-e?depth=0");
    expect(rfq.body).toMatchObject({ status: "Replied", nextReminderAt: null });
    const offers = await call("GET", "/api/offers?where[supplierRfq][equals]=srfq-0142-e&depth=0");
    expect(offers.body.docs).toHaveLength(1);
    expect(offers.body.docs[0]).toMatchObject({ lineNo: 4, price: 980, currency: "EGP" });
  });

  it("gives the reading pane one message with its saved draft, the newest by default", async () => {
    await login();
    const first = await call("GET", "/api/inbox/message");
    const list = await call("GET", "/api/inbox");
    expect(first.body.message.id).toBe(list.body.messages[0].id);
    const sim = await call("POST", "/api/inbox/simulate", { kind: "rfq" });
    expect(sim.body.href).toBe(`?message=${sim.body.doc.id}`);
    const before = await call("GET", `/api/inbox/message?id=${sim.body.doc.id}`);
    expect(before.body).toMatchObject({ rfq: true, extraction: null });
    await call("POST", `/api/inbox/${sim.body.doc.id}/extract`);
    const after = await call("GET", `/api/inbox/message?id=${sim.body.doc.id}`);
    expect(after.body.extraction.lines).toHaveLength(6);
    expect(after.body.message.urgency).toBeGreaterThanOrEqual(4);
  });

  it("links an uncertain match only when a person picks the case", async () => {
    await login();
    const { body } = await call("POST", "/api/inbox/msg-delta-uncertain/review", {
      decision: "link",
      case: "gs-rfq-0142",
    });
    expect(body.message).toMatchObject({
      status: "Linked",
      match: { case: { caseId: "GS-RFQ-0142" }, reviewedBy: "Karim Youssef" },
    });
  });
});

describe("supplier RFQs", () => {
  it("splits lines by category, holds unclear lines and anonymises the preview", async () => {
    await login();
    const sim = await call("POST", "/api/inbox/simulate", { kind: "rfq" });
    await call("POST", `/api/inbox/${sim.body.doc.id}/extract`);
    const created = await call("POST", `/api/inbox/${sim.body.doc.id}/create-case`, {});
    const caseId = created.body.case.id;
    const plan = await call("POST", `/api/sourcing/cases/${caseId}/plan`, { mode: "split" });
    expect(plan.body.held.map((h: { lineNo: number }) => h.lineNo)).toEqual([6]);
    const bySupplier = Object.fromEntries(
      plan.body.drafts.map((d: { supplierName: string; lineNos: number[] }) => [d.supplierName, d.lineNos]),
    );
    expect(bySupplier["Nile Lubricants"]).toEqual([4]);
    expect(bySupplier["Red Sea Safety"]).toEqual([2, 3]);
    const preview = plan.body.drafts[0].preview;
    expect(`${preview.subject}\n${preview.body}`).not.toMatch(/Nordvik|Aurora|NSM-/);
    expect(preview.body).toContain(plan.body.drafts[0].reference);

    const sent = await call("POST", `/api/sourcing/cases/${caseId}/send`, { drafts: plan.body.drafts, mode: "split" });
    expect(sent.status).toBe(201);
    expect(sent.body.sent.map((r: { reference: string }) => r.reference)).toEqual(
      plan.body.drafts.map((d: { reference: string }) => d.reference),
    );
    const view = await call("GET", `/api/sourcing/cases/${caseId}`);
    expect(view.body.counts.waiting).toBe(plan.body.drafts.length);
    expect(view.body.rfqs[0].schedule.map((s: { label: string }) => s.label)).toEqual([
      "Sent",
      "Reminder 1",
      "Reminder 2",
      "Escalate to case owner",
    ]);
  });

  it("escalates after two reminders and stops reminding once answered", async () => {
    await login();
    const first = await call("POST", "/api/sourcing/rfqs/srfq-0142-e/remind");
    expect(first.body.event.outcome).toBe("Escalated");
    const rfq = await call("GET", "/api/supplier-rfqs/srfq-0142-e?depth=0");
    expect(rfq.body).toMatchObject({ reminders: 2, escalated: true });
    expect((await call("POST", "/api/sourcing/rfqs/srfq-0142-a/remind")).status).toBe(400);
  });

  it("simulates replies: matched by reference, a new supplier saved with its dated price, offers for Compare", async () => {
    await login();
    const { body } = await call("POST", "/api/sourcing/cases/gs-rfq-0142/simulate-replies");
    expect(body.events.map((e: { outcome: string }) => e.outcome)).toEqual(["Replied", "New supplier saved"]);
    const sup = await call("GET", "/api/suppliers?where[name][equals]=Alex Weld Trading&depth=0");
    expect(sup.body.docs[0]).toMatchObject({ status: "New", emailDomain: "alexweld.example" });
    const prices = await call("GET", `/api/supplier-prices?where[supplier][equals]=${sup.body.docs[0].id}&depth=0`);
    expect(prices.body.docs[0].validUntil).toBeTruthy();
    const offers = await call("GET", "/api/offers?where[case][equals]=gs-rfq-0142&where[lineNo][equals]=4&depth=0");
    expect(offers.body.docs.map((o: { supplier: string }) => o.supplier)).toEqual(
      expect.arrayContaining(["S3", sup.body.docs[0].id]),
    );
    // The new supplier's unclear unit, plus the seeded Delta Marine reply that may belong here.
    expect(body.review.map((r: { kind: string }) => r.kind).sort()).toEqual(["match", "new-supplier"]);
    const unit = body.review.find((r: { kind: string }) => r.kind === "new-supplier");
    expect(unit.uncertain[0]).toContain("Confirm the unit");
    expect(body.newSuppliers.map((s: { name: string }) => s.name)).toContain("Alex Weld Trading");

    // A person confirms the uncertain unit: the AI deviation goes, the message is linked.
    await call("POST", `/api/inbox/${unit.id}/review`, { decision: "link", case: "gs-rfq-0142" });
    const after = await call("GET", "/api/sourcing/cases/gs-rfq-0142");
    expect(after.body.review.map((r: { kind: string }) => r.kind)).toEqual(["match"]);
    const fixed = await call("GET", "/api/offers?where[case][equals]=gs-rfq-0142&where[lineNo][equals]=4&depth=0");
    expect(
      fixed.body.docs.every((o: { deviations?: { type: string }[] }) => !o.deviations?.some((x) => x.type === "Unit")),
    ).toBe(true);
    // Running it again doesn't duplicate anything.
    const again = await call("POST", "/api/sourcing/cases/gs-rfq-0142/simulate-replies");
    expect(again.body.events).toEqual([]);
  });

  it("hides prices from sales", async () => {
    await login();
    await call("POST", "/api/sourcing/cases/gs-rfq-0142/simulate-replies");
    await login("soaad.amer@goldensea.test");
    const { body } = await call("GET", "/api/sourcing/cases/gs-rfq-0142");
    expect(body.canSeeCosts).toBe(false);
    expect(body.newSuppliers[0].prices.every((p: { price?: number }) => p.price === undefined)).toBe(true);
  });

  it("knows which category a line is sourced in", () => {
    expect(lineCategory({ description: "Welding electrodes E6013" })).toBe("Welding");
    expect(lineCategory({ description: "LOCTITE 243 threadlocker" })).toBe("Adhesives");
    expect(lineCategory({ description: "Safety helmet", store: "Safety stores" })).toBe("Safety & PPE");
    expect(lineCategory({ description: "Hydraulic oil ISO VG 46" })).toBe("Lubricants");
  });
});

describe("inbox history", () => {
  it("organises, waits for decisions, and only management can approve", async () => {
    await login();
    const before = await call("GET", "/api/inbox-history");
    expect(before.body).toMatchObject({ organised: false, approved: false });
    expect(before.body.kept).toBe(before.body.scanned - 11_520);

    const org = await call("POST", "/api/inbox-history/organise");
    expect(org.body.organised).toBe(true);
    expect(org.body.pending).toBe(6);
    // Live inbox stays clean.
    const inbox = await call("GET", "/api/inbox");
    expect(inbox.body.messages.some((m: { messageId: string }) => m.messageId.startsWith("history-"))).toBe(false);

    expect((await call("POST", "/api/inbox-history/approve")).status).toBe(403);

    await login("karim.balbaa@goldensea.test");
    expect((await call("POST", "/api/inbox-history/approve")).status).toBe(400);
    let p = org.body;
    for (const item of p.review)
      p = (
        await call("POST", `/api/inbox-history/review/${item.id}`, {
          decision: item.kind === "Customer" && item.key === "bluefin" ? "reject" : "confirm",
        })
      ).body;
    expect(p.pending).toBe(0);

    const ok = await call("POST", "/api/inbox-history/approve");
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ approved: true, approvedBy: "Karim Balbaa" });
    expect(ok.body.created.map((c: { name: string }) => c.name)).toEqual(
      expect.arrayContaining([
        "Canal Ropes & Rigging",
        "Baltic Reefer Management",
        "Petro Delta",
        "MV Polar Bay (IMO 9651198)",
      ]),
    );
    const prices = await call("GET", "/api/supplier-prices?where[source][equals]=Email reply&limit=0&depth=0");
    expect(prices.body.docs.some((d: { price: number }) => d.price === 1_950)).toBe(true);
  });
});
