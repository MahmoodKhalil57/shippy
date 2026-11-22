import { stringify } from "qs-esm";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import type { CollectionSettings } from "saastemlycrm-design-system/contracts";
import { matches } from "saastemlycrm-design-system/payload";
import { IntakeMessages, SupplierRfqs } from "../src/collections/sourcing.ts";
import { lineCategory } from "../src/endpoints/sourcing.ts";
import { ORDERS, SHOWS } from "../src/format/inbox.ts";
import { liveMessages, messagesToReview } from "../src/queries/inbox.ts";
import { repliesOnCase, repliesToReview } from "../src/queries/sourcing.ts";
import { backend, call, login } from "./backend.ts";
import { actionsOn } from "./collection-actions.ts";

// oxlint-disable-next-line typescript/no-explicit-any
type Json = any;

/** Intake messages as a widget's query reads them (depth 1: relationships populated), `$doc.id` filled. */
async function messages(where: Json, sort = "-receivedAt", doc = ""): Promise<Json[]> {
  const filled = JSON.parse(JSON.stringify(where).replaceAll("$doc.id", doc));
  const query = stringify({ where: filled, sort, limit: 0, depth: 1 }, { addQueryPrefix: true });
  const r = await call("GET", `/api/intake-messages${query}`);
  expect(r.status).toBe(200);
  return r.body.docs;
}
/** What the signed-in person can do to a message (the collection's actions), by label. */
const labels = async (m: Json) => {
  const me = (await call("GET", "/api/users/me")).body.user;
  return actionsOn(IntakeMessages, m, me.role).map((a) => a.label);
};

/** The sourcing desk's endpoints: inbox (extraction, matching, case creation), inbox history, supplier RFQs. */

beforeEach(() => {
  backend.reset();
});

describe("inbox", () => {
  it("needs a signed-in user", async () => {
    expect((await call("GET", "/api/inbox")).status).toBe(401);
  });

  it("lists live messages with their channels and the review queue, from the collection", async () => {
    await login();
    const { status, body } = await call("GET", "/api/inbox");
    expect(status).toBe(200);
    expect(body.stats.review).toBe(1);
    // The list: every live message, filtered by status (`show`) and ordered (`order`).
    const all = await messages({ ...liveMessages, status: { in: SHOWS.all } }, ORDERS.time);
    expect(all.length).toBeGreaterThanOrEqual(8);
    expect(all.map((m) => m.channel)).toEqual(expect.arrayContaining(["Email", "WhatsApp", "Website form"]));
    expect(all.find((m) => m.id === "msg-nordvik-fw")).toMatchObject({ status: "Linked", via: "Outlook · sales@" });
    expect(all.find((m) => m.id === "msg-web-petro").via).toBe("Website quick-quote form");
    const fresh = await messages({ ...liveMessages, status: { in: SHOWS.new } });
    expect(fresh.length).toBeGreaterThan(0);
    expect(fresh.every((m) => m.status === "New")).toBe(true);
    // Most urgent first: the stored urgency, newest first within it.
    const urgent = await messages({ ...liveMessages, status: { in: SHOWS.all } }, ORDERS.urgency);
    expect(urgent.map((m) => m.urgency)).toEqual(urgent.map((m) => m.urgency).sort((a, b) => b - a));
    expect(urgent[0].urgency).toBeGreaterThanOrEqual(4);
    expect(urgent[0].urgencyTag).toBe(`Urgency ${urgent[0].urgency}/5`);

    // The review queue: below 85%, a person picks the case — one "Link to…" per candidate.
    const [review, ...more] = await messages(messagesToReview);
    expect(more).toEqual([]);
    expect(review).toMatchObject({ id: "msg-delta-uncertain", match: { confidencePct: 62 } });
    expect(review.candidates.map((c: Json) => [c.case.caseId, c.confidencePct])).toEqual([
      ["GS-RFQ-0142", 62],
      ["GS-RFQ-0140", 38],
    ]);
    expect(await labels(review)).toEqual(["Link to GS-RFQ-0142 (62%)", "Link to GS-RFQ-0140 (38%)", "Not related"]);
    expect(actionsOn(IntakeMessages, review, "supply-chain").map((a) => a.call)).toEqual([
      { path: "/inbox/msg-delta-uncertain/review", body: { decision: "link", case: "gs-rfq-0142" } },
      { path: "/inbox/msg-delta-uncertain/review", body: { decision: "link", case: "gs-rfq-0140" } },
      { path: "/inbox/msg-delta-uncertain/review", body: { decision: "not-related" } },
    ]);
    // A linked reply: its case, and a supplier reply's RFQs there; a duplicate: its case only.
    const [reply] = await messages({ id: { equals: "msg-horizon-reply" } });
    expect(actionsOn(IntakeMessages, reply, "supply-chain").map((a) => [a.label, a.href])).toEqual([
      ["Supplier RFQs", "/collections/cases/gs-rfq-0142/rfqs"],
      ["Open GS-RFQ-0142", "/collections/cases/gs-rfq-0142"],
    ]);
    const [copy] = await messages({ id: { equals: "msg-nordvik-fw" } });
    expect(await labels(copy)).toEqual(["Open GS-RFQ-0142"]);
    // Once decided, nothing is left to decide.
    await call("POST", "/api/inbox/msg-delta-uncertain/review", { decision: "not-related" });
    const [decided] = await messages({ id: { equals: "msg-delta-uncertain" } });
    expect(decided.status).toBe("Ignored");
    expect(await labels(decided)).toEqual([]);
    expect(await messages(messagesToReview)).toEqual([]);
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
    const [newest] = await messages(liveMessages);
    expect(first.body.message.id).toBe(newest.id);
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
    const waiting = await call(
      "GET",
      `/api/supplier-rfqs?where[case][equals]=${caseId}&where[status][in]=Sent,Awaiting reply,Partial reply,Clarification needed&limit=0`,
    );
    expect(waiting.body.totalDocs).toBe(plan.body.drafts.length);
    expect(view.body.rfqs[0].schedule.map((s: { label: string }) => s.label)).toEqual([
      "Sent",
      "Reminder 1",
      "Reminder 2",
      "Escalate to case owner",
    ]);
  });

  it("offers Remind now on an RFQ still waiting, from the collection, and says where its reminders stand", async () => {
    await login();
    const remind = async (id: string) => {
      const doc = (await call("GET", `/api/supplier-rfqs/${id}?depth=0`)).body;
      const actions = ((SupplierRfqs.custom as CollectionSettings).actions ?? []).filter(
        (a) => !a.when || matches(doc, a.when as never),
      );
      return { doc, actions };
    };
    const waiting = await remind("srfq-0142-e");
    expect(waiting.doc.reminderState).toBe("1 of 2 · next 17 Nov, 15:00");
    // The second reminder also alerts the owner: internal, so no dialog.
    expect(waiting.actions.map((a) => [a.label, Boolean(a.confirm)])).toEqual([["Remind now", false]]);
    expect(waiting.actions[0]!.call!.path).toBe("/sourcing/rfqs/$row.id/remind");
    const replied = await remind("srfq-0142-a");
    expect(replied.doc.reminderState).toBe("0 of 2 · stopped");
    expect(replied.actions).toEqual([]);
    await call("POST", "/api/sourcing/rfqs/srfq-0142-e/remind");
    const escalated = await remind("srfq-0142-e");
    expect(escalated.doc.reminderState).toBe("2 of 2 · escalated");
    expect(escalated.actions).toEqual([]);
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
    // The new supplier's unclear unit, plus the seeded Delta Marine reply that may belong here: the
    // case tab's "Needs a person", each with the collection's decisions.
    const review = await messages(repliesToReview, "-receivedAt", "gs-rfq-0142");
    expect(review).toHaveLength(2);
    const unit = review.find((m) => m.match.case?.id === "gs-rfq-0142");
    expect(unit.uncertain).toContain("Confirm the unit");
    expect(await labels(unit)).toEqual(["Confirm offer", "Not related"]);
    expect(actionsOn(IntakeMessages, unit, "supply-chain")[0]!.call!.body).toEqual({
      decision: "link",
      case: "gs-rfq-0142",
    });
    expect(await labels(review.find((m) => m.id === "msg-delta-uncertain"))).toContain("Link to GS-RFQ-0142 (62%)");
    expect(body.newSuppliers.map((s: { name: string }) => s.name)).toContain("Alex Weld Trading");
    // The replies matched to the case, by reference.
    const matched = await messages(repliesOnCase, "-receivedAt", "gs-rfq-0142");
    expect(matched.map((m) => m.match.reference)).toEqual(expect.arrayContaining(["GS-SRFQ-0142-C"]));

    // A person confirms the uncertain unit: the AI deviation goes, the message is linked.
    await call("POST", `/api/inbox/${unit.id}/review`, { decision: "link", case: "gs-rfq-0142" });
    const after = await messages(repliesToReview, "-receivedAt", "gs-rfq-0142");
    expect(after.map((m) => m.id)).toEqual(["msg-delta-uncertain"]);
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
    expect((await messages(liveMessages)).some((m) => m.messageId.startsWith("history-"))).toBe(false);
    // Each uncertain item reads its confidence as a percentage, and is confirmed or rejected.
    const history = await messages({ source: { equals: "History import" } }, "receivedAt");
    expect(history).toHaveLength(6);
    for (const m of history) expect(m.history.confidencePct).toBe(Math.round(m.history.confidence * 100));
    expect(await labels(history[0])).toEqual(["Confirm", "Reject"]);
    expect(actionsOn(IntakeMessages, history[0], "supply-chain")[1]!.call).toEqual({
      path: `/inbox-history/review/${history[0].id}`,
      body: { decision: "reject" },
    });

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
    // Decided: changeable (to the other decision) until the import is approved.
    const decided = await messages({ source: { equals: "History import" } }, "receivedAt");
    for (const m of decided) {
      expect(await labels(m)).toEqual(["Change"]);
      const [change] = actionsOn(IntakeMessages, m, "management");
      expect(change!.call!.body).toEqual({ decision: m.history.decision === "Confirmed" ? "reject" : "confirm" });
    }

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
    // Approved: its decisions are final.
    for (const m of await messages({ source: { equals: "History import" } }))
      expect([m.history.locked, await labels(m)]).toEqual([true, []]);
  });
});
