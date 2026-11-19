import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import config from "golden-sea-payload-config";
import { Engine } from "../src/mock/runtime/engine.ts";
import { RestApi } from "../src/mock/runtime/rest.ts";
import { seedsFromGlob } from "../src/mock/runtime/seed.ts";
import { MemoryStore } from "../src/mock/runtime/store.ts";

/** Order-to-cash endpoints (src/cms/endpoints/operations.ts): PO check, purchasing, delivery, invoicing, cash. */

const seedDir = path.resolve(import.meta.dirname, "../../golden-sea-payload-config/src/seed");
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
const as = async (user: string) => {
  token = "";
  const { body } = await call("POST", "/api/users/login", { email: `${user}@goldensea.test`, password: "demo1234" });
  token = body.token;
};
const ops = (id: string) => call("GET", `/api/operations/case/${id}`);

beforeEach(async () => {
  token = "";
  api = new RestApi(new Engine(config, new MemoryStore()), seeds);
  await as("karim.youssef");
});

describe("customer PO check", () => {
  it("blocks commitment until every mismatch has written agreement, then prepares supplier POs", async () => {
    const before = (await ops("gs-rfq-0136")).body;
    expect(before.customerPo).toMatchObject({
      number: "NSM-PO-77104",
      status: "Blocked — mismatch",
      openMismatches: 3,
    });
    expect(before.purchaseOrders).toEqual([]);
    expect((await call("POST", "/api/operations/confirm-order", { case: "gs-rfq-0136" })).status).toBe(400);

    const po = before.customerPo;
    const mismatches = po.checks
      .map((c: { matches: boolean }, i: number) => ({ c, i }))
      .filter((x: { c: { matches: boolean } }) => !x.c.matches);
    // Evidence is required.
    expect(
      (await call("POST", "/api/operations/po-amend", { po: po.id, index: mismatches[0].i, resolution: "ok" })).status,
    ).toBe(400);
    for (const m of mismatches) {
      const r = await call("POST", "/api/operations/po-amend", {
        po: po.id,
        index: m.i,
        resolution: m.c.suggestion,
        evidence: "media-test",
      });
      expect(r.status).toBe(200);
    }
    const after = (await ops("gs-rfq-0136")).body;
    expect(after.customerPo.status).toBe("Validated");

    const confirmed = await call("POST", "/api/operations/confirm-order", { case: "gs-rfq-0136" });
    expect(confirmed.status).toBe(200);
    expect(confirmed.body.created).toHaveLength(3); // Delta Marine, Suez Industrial, Nile Safety; line 4 not awarded
    const o = (await ops("gs-rfq-0136")).body;
    expect(o.case.stage).toBe("Won — sales order confirmed");
    expect(o.purchaseOrders.map((p: { status: string }) => p.status)).toEqual([
      "Awaiting approval",
      "Awaiting approval",
      "Awaiting approval",
    ]);
    expect(o.purchaseOrders.some((p: { deliverTo: string }) => /dropship/.test(p.deliverTo))).toBe(true);

    // Re-check before confirming; only management confirms.
    const nile = o.purchaseOrders.find((p: { supplier: string }) => p.supplier === "S4");
    const re = await call("POST", "/api/operations/po-recheck", { po: nile.id });
    expect(re.body.changed).toBe(1);
    expect((await call("PATCH", `/api/purchase-orders/${nile.id}`, { status: "Confirmed" })).status).toBe(400);
    await as("karim.balbaa");
    expect((await call("PATCH", `/api/purchase-orders/${nile.id}`, { status: "Confirmed" })).status).toBe(200);
  });

  it("reads the flagship's PO on arrival and records partial awards with reasons", async () => {
    expect((await ops("gs-rfq-0142")).body.poExpected).toBe(true);
    const r = await call("POST", "/api/operations/po-check", { case: "gs-rfq-0142" });
    expect(r.body.created).toBe(true);
    expect(r.body.doc).toMatchObject({ number: "NSM-PO-77231", status: "Blocked — mismatch", openMismatches: 2 });
    expect((await ops("gs-rfq-0142")).body.case.stage).toBe("Won — PO mismatch");
    // Re-running is idempotent.
    expect((await call("POST", "/api/operations/po-check", { case: "gs-rfq-0142" })).body.created).toBe(false);
    const id = r.body.doc.id;
    expect((await call("POST", "/api/operations/po-award", { po: id, lineNo: 6, outcome: "Closed" })).status).toBe(400);
    const closed = await call("POST", "/api/operations/po-award", {
      po: id,
      lineNo: 6,
      outcome: "Closed",
      reason: "Vessel bought it locally",
    });
    expect(closed.body.doc.unawarded).toEqual(
      expect.arrayContaining([expect.objectContaining({ lineNo: 6, outcome: "Closed" })]),
    );
  });
});

describe("costs stay hidden from sales", () => {
  it("omits supplier prices, bills and payables", async () => {
    await as("soaad.amer");
    const o = (await ops("gs-rfq-0133")).body;
    expect(o.canSeeCosts).toBe(false);
    expect(o.purchaseOrders[0].total).toBeUndefined();
    expect(o.purchaseOrders[0].lines[0].unitPrice).toBeUndefined();
    expect(o.lines[0].sources).toBeUndefined();
    expect(o.bills).toEqual([]);
    const po = (await call("GET", "/api/purchase-orders/po-0418?depth=0")).body;
    expect(po.total).toBeUndefined();
    expect(po.lines[0].unitPrice).toBeUndefined();
    const cash = (await call("GET", "/api/operations/cash")).body;
    expect(cash.canSeePayables).toBe(false);
    expect(cash.payables).toEqual([]);
    expect(cash.receivables.length).toBeGreaterThan(0);
    expect((await call("POST", "/api/operations/po-recheck", { po: "po-0418" })).status).toBe(403);
  });
});

describe("delivery and invoicing", () => {
  it("re-plans open drops on an ETA change and escalates it", async () => {
    const before = (await ops("gs-rfq-0133")).body;
    const helmets = before.backorders.find((b: { lineNo: number }) => b.lineNo === 3);
    expect(helmets).toMatchObject({ qty: 2, followsIn: "DN-0002", late: true, owner: "ah" });

    const seededTasks = (
      await call("GET", "/api/tasks?where[case][equals]=gs-rfq-0133&where[createdByRule][equals]=ETA change")
    ).body.totalDocs;
    const r = await call("POST", "/api/operations/eta-change", { case: "gs-rfq-0133" });
    expect(r.body).toMatchObject({ changed: 1, moved: ["DN-0002"] });
    const after = (await ops("gs-rfq-0133")).body;
    expect(after.case.eta).toBe("2026-11-22T16:00:00.000Z");
    const drop2 = after.deliveries.find((d: { number: string }) => d.number === "DN-0002");
    expect(drop2).toMatchObject({ status: "Rescheduled", plannedAt: "2026-11-22T16:00:00.000Z" });
    expect(drop2.plan.launch).toMatch(/re-booked/);
    expect(after.deliveries.find((d: { number: string }) => d.number === "DN-0001").status).toBe("Dispatched");
    expect(after.backorders.find((b: { lineNo: number }) => b.lineNo === 3).late).toBe(false);
    expect(after.alerts[0].text).toMatch(/ETA change/);
    const tasks = await call(
      "GET",
      "/api/tasks?where[case][equals]=gs-rfq-0133&where[createdByRule][equals]=ETA change",
    );
    expect(tasks.body.totalDocs).toBe(seededTasks + 1);
    await as("ahmedy");
    const bell = await call("GET", "/api/notifications?where[title][like]=ETA change");
    expect(bell.body.totalDocs).toBe(1);
    // Idempotent: the same email again changes nothing.
    expect((await call("POST", "/api/operations/eta-change", { case: "gs-rfq-0133" })).body.changed).toBe(0);
  });

  it("confirms delivery only with proof and invoices delivered quantities once", async () => {
    await as("ahmedy");
    const noProof = await call("POST", "/api/operations/confirm-delivery", {
      delivery: "dn-0133-1",
      signedBy: "Chief Officer",
    });
    expect(noProof.status).toBe(400);
    expect(JSON.stringify(noProof.body)).toMatch(/signed delivery note/);
    expect(
      (
        await call("POST", "/api/operations/confirm-delivery", {
          delivery: "dn-0133-1",
          signedBy: "Chief Officer M. Sami",
          proof: "media-pod",
        })
      ).status,
    ).toBe(200);

    expect((await call("POST", "/api/operations/invoice-delivery", { delivery: "dn-0133-2" })).status).toBe(400);
    const inv = await call("POST", "/api/operations/invoice-delivery", { delivery: "dn-0133-1" });
    expect(inv.status).toBe(200);
    expect(inv.body.doc.number).toBe("INV/2026/0420");
    expect(inv.body.doc.lines.find((l: { lineNo: number }) => l.lineNo === 2)).toMatchObject({
      qty: 180,
      deliveredQty: 180,
    });
    expect(inv.body.doc).toMatchObject({
      currency: "EGP",
      vatTreatment: "14% standard",
      amount: 40 * 1650 + 180 * 360 + 8 * 520 + 6 * 27500,
    });
    // Never twice.
    const again = await call("POST", "/api/operations/invoice-delivery", { delivery: "dn-0133-1" });
    expect(again.status).toBe(400);
    expect(JSON.stringify(again.body)).toMatch(/more than delivered/);
    expect((await ops("gs-rfq-0133")).body.deliveries[0].invoice).toBe("INV/2026/0420");

    // E-invoice: rejected for the missing tax ID, then submitted, valid, and never resubmitted.
    const id = inv.body.doc.id;
    expect((await call("POST", "/api/operations/einvoice", { invoice: id })).body.result).toBe("rejected");
    expect((await call("POST", "/api/operations/einvoice", { invoice: id, taxId: "100-200-300" })).body.result).toBe(
      "submitted",
    );
    expect((await call("POST", "/api/operations/einvoice", { invoice: id })).body.result).toBe("valid");
    expect((await call("POST", "/api/operations/einvoice", { invoice: id })).body.result).toBe("already-valid");
  });

  it("retries an e-invoice after the signature service was unreachable and clears the exception", async () => {
    await as("mohamed.helmy");
    const retries = (await call("GET", "/api/integration-exceptions/ex-eta?depth=0")).body.retries ?? 0;
    const r = await call("POST", "/api/operations/einvoice", { invoice: "inv-0419" });
    expect(r.body.result).toBe("submitted");
    const ex = (await call("GET", "/api/integration-exceptions/ex-eta?depth=0")).body;
    expect(ex).toMatchObject({ status: "Resolved", retries: retries + 1 });
    await as("karim.youssef");
    expect((await call("POST", "/api/operations/einvoice", { invoice: "inv-0419" })).status).toBe(403);
  });

  it("does not offer to invoice a delivery an earlier invoice already covers", async () => {
    const o = (await ops("gs-rfq-0131")).body;
    expect(o.deliveries[0]).toMatchObject({ status: "Delivered — confirmed", invoice: "INV/2026/0412" });
    expect(o.invoices[0]).toMatchObject({ balance: 4200, paid: 10000 });
  });
});

describe("receivables and payables", () => {
  it("ages receivables by customer and respects contact rules in reminders", async () => {
    await as("mohamed.helmy");
    const cash = (await call("GET", "/api/operations/cash")).body;
    const atlas = cash.ageing.find((a: { customer: string }) => a.customer === "Atlas Tankers");
    expect(atlas.values).toEqual([0, 0, 6500, 1400]);
    expect(cash.weeks).toHaveLength(8);
    expect(cash.cashIn).toHaveLength(8);
    expect(cash.cashOut).toHaveLength(8);

    const internal = (await call("POST", "/api/operations/collection-draft", { invoice: "inv-0388" })).body;
    expect(internal.mode).toBe("internal");
    const email = (await call("POST", "/api/operations/collection-draft", { invoice: "inv-0396" })).body;
    expect(email).toMatchObject({ mode: "customer", rule: "one-follow-up" });
    expect(email.body).toMatch(/INV\/2026\/0396/);
  });

  it("routes payments through approval and keeps deposits, holds and balances apart", async () => {
    await as("mohamed.helmy");
    const cash = (await call("GET", "/api/operations/cash")).body;
    const stages = Object.fromEntries(cash.payables.map((p: { po: string; stage: string }) => [p.po, p.stage]));
    expect(stages).toMatchObject({ P0418: "Deposit to pay", P0417: "Bill on hold", P0416: "Balance on delivery" });
    const deposit = cash.approvals.find((a: { id: string }) => a.id === "ap-deposit-0133");
    expect(deposit).toMatchObject({ amount: 48200, canDecide: true });

    const pay = {
      direction: "out",
      reference: "TRX-1",
      paidAt: "2026-11-18T00:00:00.000Z",
      amount: 48200,
      currency: "EGP",
      purchaseOrder: "po-0418",
      approval: "ap-deposit-0133",
      kind: "Deposit / advance",
      status: "Recorded",
    };
    expect((await call("POST", "/api/payments", pay)).status).toBe(400); // not approved yet
    await call("PATCH", "/api/approvals/ap-deposit-0133", { decisions: [{ decision: "Approve" }] });
    expect((await call("POST", "/api/payments", pay)).status).toBe(201);
    const after = (await call("GET", "/api/operations/cash")).body;
    expect(after.payables.find((p: { po: string }) => p.po === "P0418").stage).toBe("Bill on hold");
    expect(after.approvals.some((a: { id: string }) => a.id === "ap-deposit-0133")).toBe(false);
  });

  it("needs two different people for a bank-detail change", async () => {
    await as("mohamed.helmy");
    let bank = (await call("GET", "/api/operations/cash")).body.bankChanges[0];
    expect(bank).toMatchObject({ id: "ap-bank-s3", status: "Approved 1 of 2", canDecide: false, applied: false });
    await as("karim.balbaa");
    bank = (await call("GET", "/api/operations/cash")).body.bankChanges[0];
    expect(bank.canDecide).toBe(true);
    const ap = (await call("GET", "/api/approvals/ap-bank-s3?depth=0")).body;
    const ok = await call("PATCH", "/api/approvals/ap-bank-s3", {
      decisions: [...ap.decisions, { decision: "Approve", reason: "Call-back done on number on file." }],
    });
    expect(ok.body.doc.status).toBe("Approved");
  });
});
