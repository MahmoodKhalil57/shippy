import { beforeEach, describe, expect, it } from "vite-plus/test";
import type { CollectionSettings } from "saastemlycrm-design-system/contracts";
import { matches } from "saastemlycrm-design-system/payload";
import { Approvals, Quotations } from "../src/collections/commercial.ts";
import { backend, call, login } from "./backend.ts";
import { actionsOn } from "./collection-actions.ts";

/** Offer comparison, pricing, quotations and approvals (src/cms/endpoints/commercial.ts). */

const CASE = "/api/commercial/cases/gs-rfq-0142";
// oxlint-disable-next-line typescript/no-explicit-any
const line = (cmp: any, n: number) => cmp.lines.find((l: { lineNo: number }) => l.lineNo === n);
// oxlint-disable-next-line typescript/no-explicit-any
const offer = (l: any, id: string) => l.offers.find((o: { id: string }) => o.id === id);

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
});

describe("offer comparison", () => {
  it("normalises offers to EGP per base unit and adds freight for landed cost", async () => {
    const { status, body } = await call("GET", `${CASE}/compare`);
    expect(status).toBe(200);
    const l1 = line(body, 1);
    const horizon = offer(l1, "off-l1-s5");
    expect(horizon.unitPerBase).toBeCloseTo(9.8 * 48.6, 2); // USD at the approved rate
    expect(horizon.freightEGP).toBe(600); // ex-stock Damietta → Port Said
    expect(horizon.landedPerBase).toBeCloseTo((9.8 * 48.6 * 24 + 600) / 24, 2);
    expect(l1.best).toBe("off-l1-s5");
    // Own Alexandria stock sits next to supplier offers.
    const stock = offer(l1, "stock:st-p1-alex");
    expect(stock).toMatchObject({ kind: "stock", supplier: "Golden Sea stock — Alexandria", unitPerBase: 455 });
    expect(stock.landedPerBase).toBeGreaterThan(stock.unitPerBase);
  });

  it("cheapest unit price isn't the cheapest on board (helmets)", async () => {
    const l5 = line((await call("GET", `${CASE}/compare`)).body, 5);
    expect(l5.cheapestUnit).toBe("off-l5-gs"); // own stock, 295 per helmet
    expect(offer(l5, "off-l5-gs").landedPerBase).toBeGreaterThan(offer(l5, "off-l5-s4").landedPerBase);
    expect(l5.split.parts).toEqual([
      { offer: "off-l5-s4", qty: 10 },
      { offer: "off-l5-s1", qty: 5 },
    ]);
    expect(l5.split.savesEGP).toBeGreaterThan(0);
  });

  it("flags deviations: wrong part blocked (v1 kept), pack size, shelf life, ETA, expiry", async () => {
    const cmp = (await call("GET", `${CASE}/compare`)).body;
    const l2 = line(cmp, 2);
    expect(offer(l2, "off-l2-s2-v1")).toMatchObject({ blocked: true, superseded: true, correctable: true });
    expect(l2.best).toBe("off-l2-s2-v2");
    const l3 = line(cmp, 3);
    expect(offer(l3, "off-l3-s2").needsAcceptance).toBe(true);
    expect(offer(l3, "off-l3-s1").shelfShort).toBe(true);
    expect(offer(l3, "off-l3-s10").blocked).toBe(true); // 9-day import misses the ETA
    expect(offer(l3, "off-l3-s10").kind).toBe("agency");
    const l1 = line(cmp, 1);
    expect(offer(l1, "off-l1-s2").flags.some((f: { type?: string }) => f.type === "Expired validity")).toBe(true);
    expect(offer(l1, "off-l1-s2").blocked).toBe(true);
    // Delta was asked for line 4 but didn't quote it.
    expect(line(cmp, 4).others.find((o: { supplier: string }) => o.supplier === "Delta Marine Stores").status).toBe(
      "Missing item",
    );
  });

  it("saves selections; needs a reason off the best fit; turns own stock into an offer", async () => {
    const noReason = await call("POST", `${CASE}/select`, { lineNo: 1, parts: [{ offer: "off-l1-s1", qty: 24 }] });
    expect(noReason.status).toBe(400);
    const blocked = await call("POST", `${CASE}/select`, {
      lineNo: 2,
      parts: [{ offer: "off-l2-s2-v1", qty: 3 }],
      reason: "x",
    });
    expect(blocked.status).toBe(400);
    const ok = await call("POST", `${CASE}/select`, {
      lineNo: 1,
      parts: [
        { offer: "stock:st-p1-alex", qty: 6 },
        { offer: "off-l1-s1", qty: 18 },
      ],
      reason: "Use our own stock first; Delta is an approved supplier",
    });
    expect(ok.status).toBe(200);
    const c = (await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body;
    const item = c.items.find((i: { lineNo: number }) => i.lineNo === 1);
    expect(item.status).toBe("Split offer selected");
    expect(item.selection.splitQty).toHaveLength(2);
    const stockOffer = await call("GET", `/api/offers/${item.selection.splitQty[0].offer}?depth=0`);
    expect(stockOffer.body).toMatchObject({ source: "Own stock", supplier: "GS", lineNo: 1 });
  });

  it("records the customer's written acceptance of an alternative pack", async () => {
    const before = line((await call("GET", `${CASE}/compare`)).body, 3);
    expect(before.status).toBe("Awaiting customer acceptance");
    const after = line((await call("POST", `${CASE}/accept`, { lineNo: 3, note: "email" })).body, 3);
    expect(after).toMatchObject({ status: "Offer selected", selection: { customerAccepted: true } });
  });
});

describe("pricing", () => {
  it("allocates shared charges, shows margin and markup, checks the policy", async () => {
    const { body: P } = await call("GET", `${CASE}/pricing`);
    expect(P.rows.map((r: { lineNo: number }) => r.lineNo)).toEqual([1, 2, 3, 5]);
    expect(P.unpriced.map((u: { lineNo: number }) => u.lineNo)).toEqual([4, 6]);
    const alloc = P.rows.reduce((s: number, r: { allocEGP: number }) => s + r.allocEGP, 0);
    expect(alloc).toBeCloseTo(P.chargesEGP, 0);
    for (const r of P.rows) {
      expect(r.profitEGP / r.sellEGP).toBeCloseTo(r.marginPct / 100, 3);
      expect(r.markupPct).toBeCloseTo((r.profitEGP / r.landedEGP) * 100, 0);
    }
    // The contact-cleaner alternative is quoted in the offered 500 ml cans, pending acceptance.
    const l3 = P.rows.find((r: { lineNo: number }) => r.lineNo === 3);
    expect(l3).toMatchObject({ alternative: true, quoteQty: 100, accepted: false });
    expect(P.exceptions.some((x: string) => /alternative pack/.test(x))).toBe(true);

    const low = (await call("POST", `${CASE}/pricing`, { margins: { 1: 10 }, allocation: "qty" })).body;
    expect(low.allocation).toBe("qty");
    expect(low.rows[0].checks.some((c: { type?: string }) => c.type === "below-min")).toBe(true);
    expect(low.approvalType).toBe("Quotation margin exception");
  });

  it("refuses costs and margins to sales", async () => {
    await login("soaad.amer");
    expect((await call("GET", `${CASE}/pricing`)).status).toBe(403);
    expect((await call("GET", `${CASE}/compare`)).status).toBe(403);
    expect((await call("POST", `${CASE}/request-approval`, {})).status).toBe(403);
    const view = (await call("GET", "/api/commercial/quotations/q-0142-v1")).body;
    expect(view.internal).toBeUndefined();
    expect(view.quotation.internal).toBeUndefined();
  });
});

describe("quotation → approval → send → decision", () => {
  it("runs the whole flow with the approval rules enforced", async () => {
    const req = await call("POST", `${CASE}/request-approval`, { note: "Helmets split to make the ETA" });
    expect(req.status).toBe(200);
    expect(req.body.approval).toMatchObject({ approvers: ["kb"], status: "Pending" });
    expect(req.body.quotation).toMatchObject({ id: "q-0142-v1", status: "Awaiting approval" });
    const apId = req.body.approval.id;

    // Karim Youssef isn't an approver.
    expect((await call("POST", `/api/commercial/approvals/${apId}/decide`, { decision: "Approve" })).status).toBe(400);
    await login("karim.balbaa");
    // Returning needs a reason.
    expect((await call("POST", `/api/commercial/approvals/${apId}/decide`, { decision: "Reject" })).status).toBe(400);
    const ok = await call("POST", `/api/commercial/approvals/${apId}/decide`, { decision: "Approve", reason: "OK" });
    expect(ok.body.status).toBe("Approved");

    await login("karim.youssef");
    const view = (await call("GET", "/api/commercial/quotations/q-0142-v1")).body;
    expect(view).toMatchObject({ approvedBy: "Karim Balbaa", step: 2, can: { send: true } });
    const sent = (await call("POST", "/api/commercial/quotations/q-0142-v1/send", { method: "email" })).body;
    expect(sent).toMatchObject({ step: 3, quotation: { status: "Submitted" } });
    const won = (await call("POST", "/api/commercial/quotations/q-0142-v1/decision", { decision: "Partially won" }))
      .body;
    expect(won).toMatchObject({ step: 4, stepLabel: "Partially won" });
    expect((await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body.decision).toBe("Partially won");
  });

  it("revises into a new version and keeps the old one for audit", async () => {
    const r = await call("POST", "/api/commercial/quotations/q-0139-v1/revise", {
      reason: "Customer asked for 4 rolls",
    });
    expect(r.status).toBe(200);
    expect(r.body.view.quotation).toMatchObject({ number: "GS-Q-0139 v2", version: 2, status: "Draft" });
    expect((await call("GET", "/api/quotations/q-0139-v1?depth=0")).body.status).toBe("Superseded");
  });

  it("compares a portal screenshot with the approved quote", async () => {
    const r = await call("POST", "/api/commercial/quotations/q-0139-v1/portal-check");
    expect(r.body.rows.filter((x: { matches: boolean }) => !x.matches).map((x: { field: string }) => x.field)).toEqual([
      "Payment terms",
    ]);
  });
});

describe("a quotation's own fields", () => {
  // What its preview tab reads with no code: its versions, and its cost and margin (never printed).
  const read = async (id: string) => (await call("GET", `/api/quotations/${id}?depth=0`)).body;

  it("lists every version of it, oldest first, each linking to its preview", async () => {
    const q = await read("q-0137-v2");
    expect(q.versions.map((v: { number: string; status: string }) => v.number)).toEqual([
      "GS-Q-0137 v1",
      "GS-Q-0137 v2",
    ]);
    expect(q.versions[1]).toMatchObject({ id: "q-0137-v2", version: 2 });
  });

  it("reads the margin against the pricing policy's minimum, hidden from Sales, with the pricing link", async () => {
    await login("karim.balbaa");
    const q = await read("q-0137-v2");
    expect(q.internal).toMatchObject({ marginPct: 12.4, minMarginPct: 15, belowMinimum: true });
    expect(actionsOn(Quotations, q, "management").map((a) => a.href)).toEqual([
      "/collections/cases/gs-rfq-0137/pricing",
    ]);
    await login("soaad.amer");
    expect((await read("q-0137-v2")).internal).toBeUndefined();
    expect(actionsOn(Quotations, q, "sales")).toEqual([]);
  });
});

describe("approvals queue", () => {
  // Who may decide, how far a request has got and why you can't: the approvals' own virtual
  // fields, worked out for whoever reads them.
  const read = async (id: string) => (await call("GET", `/api/approvals/${id}?depth=0`)).body;

  it("shows who can decide and the two-person progress", async () => {
    await login("karim.balbaa");
    expect(await read("ap-bank-s3")).toMatchObject({
      status: "Approved 1 of 2",
      canDecide: true,
      progress: "Mohamed Helmy approved · waiting for you",
      twoPerson: true,
    });
    expect(await read("ap-quote-0139")).toMatchObject({ status: "Approved", canDecide: false });
    const decided = (await call("GET", "/api/approvals?where[status][in]=Approved,Rejected&depth=0")).body.docs;
    expect(decided.some((a: { id: string }) => a.id === "ap-quote-0139")).toBe(true);

    await login("mohamed.helmy");
    const mine = await read("ap-bank-s3");
    expect(mine.canDecide).toBe(false);
    expect(mine.why).toMatch(/^You approved this/);
    expect((await read("ap-fx-usd")).why).toMatch(/^Only Karim Balbaa can decide/);
  });

  it("shows the evidence behind a request, margins hidden from Sales", async () => {
    // Where the evidence comes from: the request's link actions, filled from it as a widget reads it.
    const links = async (id: string) => {
      const me = (await call("GET", "/api/users/me")).body.user;
      return Object.fromEntries(
        actionsOn(Approvals, (await call("GET", `/api/approvals/${id}?depth=1`)).body, me.role)
          .filter((a) => a.href)
          .map((a) => [a.label, a.href]),
      );
    };
    await login("karim.balbaa");
    const margin = await read("ap-margin-0137");
    expect(margin.evidence).toMatch(/^Quotation: GS-Q-0137 v2/);
    expect(margin.evidence).toMatch(/Margin: 12\.4% \(policy minimum 15%\)/);
    expect(margin.links).toBeUndefined();
    expect(await links("ap-margin-0137")).toEqual({
      "Open GS-RFQ-0137": "/collections/cases/gs-rfq-0137/overview",
      "Preview quotation": "/collections/quotations/q-0137-v2/preview",
      Pricing: "/collections/cases/gs-rfq-0137/pricing",
    });
    expect(await links("ap-fx-usd")).toMatchObject({ "Exchange rates": "/globals/fx-rates" });
    expect(await links("ap-bank-s3")).toEqual({ "Supplier record": "/collections/suppliers/S3" });
    expect(await links("ap-deposit-0133")).toMatchObject({
      "PO P0418": expect.stringMatching(/^\/collections\/purchase-orders\/.+/),
    });
    // The request's type and its two-person rule read as its tags.
    expect(await read("ap-bank-s3")).toMatchObject({ type: "Bank detail change", rule: "Two-person rule" });
    expect((await read("ap-margin-0137")).rule).toBe("");
    expect((await read("ap-fx-usd")).evidence).toMatch(/Proposed: USD\/EGP 48\.95/);
    const deposit = await read("ap-deposit-0133");
    expect(deposit.payment).toMatchObject({ purchaseOrder: "P0418", amount: 48200, recorded: false, open: true });
    await login("soaad.amer");
    const sales = await read("ap-margin-0137");
    expect(sales.evidence).toMatch(/Margin: Hidden for your role/);
    expect(await links("ap-margin-0137")).not.toHaveProperty("Pricing");
  });

  it("offers deciding to a listed approver who hasn't decided, and recording an approved payment to finance", async () => {
    // The collection's actions that apply to the document as this person reads it (as the
    // dashboard picks them: `when` on the document, `roles` on the user).
    const labels = async (id: string) => {
      const me = (await call("GET", "/api/users/me")).body.user;
      const doc = (await call("GET", `/api/approvals/${id}?depth=0`)).body;
      return ((Approvals.custom as CollectionSettings).actions ?? [])
        .filter((a) => (!a.roles || a.roles.includes(me.role)) && (!a.when || matches(doc, a.when as never)))
        .map((a) => a.label);
    };
    await login("karim.balbaa");
    expect(await labels("ap-deposit-0133")).toEqual([
      "Open $row.case.caseId",
      "PO $row.payment.purchaseOrder",
      "Return",
      "Approve",
    ]);
    expect(await labels("ap-bank-s3")).toEqual(["Supplier record", "Return", "Approve"]);
    // Deciding goes through the action's endpoint, then finance records the payment.
    const call1 = (Approvals.custom as CollectionSettings).actions!.find((a) => a.label === "Approve")!.call!;
    expect(call1.path).toBe("/commercial/approvals/$row.id/decide");
    expect(
      (await call("POST", "/api/commercial/approvals/ap-deposit-0133/decide", { decision: "Approve" })).status,
    ).toBe(200);
    expect(await labels("ap-deposit-0133")).toEqual([
      "Open $row.case.caseId",
      "PO $row.payment.purchaseOrder",
      "Record payment",
    ]);
    await login("soaad.amer");
    expect(await labels("ap-deposit-0133")).toEqual(["Open $row.case.caseId", "PO $row.payment.purchaseOrder"]);
    await login("karim.balbaa");
    expect(
      (await call("POST", "/api/cash/record-payment", { approval: "ap-deposit-0133", reference: "TRX-1" })).status,
    ).toBe(200);
    expect(await labels("ap-deposit-0133")).toEqual(["Open $row.case.caseId", "PO $row.payment.purchaseOrder"]);
    expect((await read("ap-deposit-0133")).payment).toMatchObject({ recorded: true, open: false });
  });

  it("an approved FX rate becomes the active rate", async () => {
    await login("karim.balbaa");
    await call("POST", "/api/commercial/approvals/ap-fx-usd/decide", { decision: "Approve" });
    const fx = (await call("GET", "/api/globals/fx-rates")).body;
    const usd = fx.rates.filter(
      (r: { currency: string; status: string }) => r.currency === "USD" && r.status === "Active",
    );
    expect(usd.map((r: { egpPerUnit: number }) => r.egpPerUnit)).toEqual([48.95]);
  });

  it("an approved margin exception approves the quotation behind it", async () => {
    await login("karim.balbaa");
    const r = await call("POST", "/api/commercial/approvals/ap-margin-0137/decide", { decision: "Approve" });
    expect(r.body.status).toBe("Approved");
    expect((await call("GET", "/api/quotations/q-0137-v2?depth=0")).body.status).toBe("Approved");
  });
});
