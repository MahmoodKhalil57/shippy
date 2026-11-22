import { beforeEach, describe, expect, it } from "vite-plus/test";
import type { FieldLike } from "saastemlycrm-design-system/contracts";
import { matches, sortDocs } from "saastemlycrm-design-system/payload";
import { backend, call, config, login } from "./backend.ts";

/** Order-to-cash endpoints (src/cms/endpoints/operations.ts): PO check, purchasing, delivery, invoicing, cash. */

const ops = (id: string) => call("GET", `/api/operations/case/${id}`);

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
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
    // Drop-ship or warehouse is the PO's own route.
    const created = (await call("GET", "/api/purchase-orders?where[case][equals]=gs-rfq-0136&depth=0")).body.docs;
    expect(created.some((p: { deliverTo: string }) => /dropship/.test(p.deliverTo))).toBe(true);

    // Re-check before confirming; only management confirms.
    const nile = o.purchaseOrders.find((p: { supplier: string }) => p.supplier === "S4");
    const re = await call("POST", "/api/operations/po-recheck", { po: nile.id });
    expect(re.body.changed).toBe(1);
    expect((await call("PATCH", `/api/purchase-orders/${nile.id}`, { status: "Confirmed" })).status).toBe(400);
    await login("karim.balbaa");
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
    await login("soaad.amer");
    const o = (await ops("gs-rfq-0133")).body;
    expect(o.canSeeCosts).toBe(false);
    expect(o.lines[0].sources).toBeUndefined();
    expect(o.bills).toEqual([]);
    // The PO's own fields: no supplier price, deposit or payable for Sales.
    const po = (await call("GET", "/api/purchase-orders/po-0418?depth=0")).body;
    expect(po.total).toBeUndefined();
    expect(po.lines[0].unitPrice).toBeUndefined();
    expect(po.linesSummary).not.toMatch(/EGP/);
    expect(po.payable ?? null).toBeNull();
    expect(po.deposit ?? null).toBeNull();
    const cash = (await call("GET", "/api/operations/cash")).body;
    expect(cash.canSeePayables).toBe(false);
    expect(cash.cashOut).toEqual([]);
    expect(cash.receivables.length).toBeGreaterThan(0);
    expect((await call("POST", "/api/operations/po-recheck", { po: "po-0418" })).status).toBe(403);
  });
});

describe("delivery and invoicing", () => {
  it("re-plans open drops on an ETA change and escalates it", async () => {
    const before = (await ops("gs-rfq-0133")).body;
    const helmets = before.backorders.find((b: { lineNo: number }) => b.lineNo === 3);
    expect(helmets).toMatchObject({ qty: 2, followsIn: "DN-0002", late: true, owner: "ah" });
    // The receipt's own `backorder` says the same.
    const receipt = async () =>
      (await call("GET", "/api/receipts?where[case][equals]=gs-rfq-0133&where[lineNo][equals]=3")).body.docs[0];
    expect(await receipt()).toMatchObject({
      quantity: "8 of 10",
      item: "L3 · Safety helmet EN 397, white",
      backorder: { followsIn: "DN-0002", owner: "Ahmedy", risk: "Arrives after the drop is packed" },
    });

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
    expect((await receipt()).backorder.risk).toBe("In time for the drop");
    expect(after.alerts[0].text).toMatch(/ETA change/);
    const tasks = await call(
      "GET",
      "/api/tasks?where[case][equals]=gs-rfq-0133&where[createdByRule][equals]=ETA change",
    );
    expect(tasks.body.totalDocs).toBe(seededTasks + 1);
    await login("ahmedy");
    const bell = await call("GET", "/api/notifications?where[title][like]=ETA change");
    expect(bell.body.totalDocs).toBe(1);
    // Idempotent: the same email again changes nothing.
    expect((await call("POST", "/api/operations/eta-change", { case: "gs-rfq-0133" })).body.changed).toBe(0);
  });

  it("confirms delivery only with proof and invoices delivered quantities once", async () => {
    await login("ahmedy");
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
    await login("mohamed.helmy");
    const retries = (await call("GET", "/api/integration-exceptions/ex-eta?depth=0")).body.retries ?? 0;
    const r = await call("POST", "/api/operations/einvoice", { invoice: "inv-0419" });
    expect(r.body.result).toBe("submitted");
    const ex = (await call("GET", "/api/integration-exceptions/ex-eta?depth=0")).body;
    expect(ex).toMatchObject({ status: "Resolved", retries: retries + 1 });
    await login("karim.youssef");
    expect((await call("POST", "/api/operations/einvoice", { invoice: "inv-0419" })).status).toBe(403);
  });

  it("gives each invoice its next e-invoice step and records payments through the invoice's actions", async () => {
    await login("mohamed.helmy");
    const inv = async (id: string) => (await call("GET", `/api/invoices/${id}`)).body;
    // What the invoices' actions read: retry after an outage, correct a rejection, refresh a submission.
    expect((await inv("inv-0419")).eInvoiceNext).toMatchObject({ mode: "foreign", label: "Retry (safe)" });
    expect((await inv("inv-0419")).eInvoiceNote).toMatch(/Signature service unreachable/);
    expect((await inv("inv-0417")).eInvoiceNext).toMatchObject({ mode: "local", label: "Correct & resubmit" });
    expect((await inv("inv-0418")).eInvoiceNext).toMatchObject({ mode: "refresh" });
    expect((await inv("inv-0412")).eInvoiceNext ?? null).toBeNull();
    // The actions' endpoint: a local buyer's tax ID is checked, then submitted and confirmed at once.
    expect((await call("POST", "/api/cash/einvoice", { invoice: "inv-0417" })).body.result).toBe("rejected");
    const ok = await call("POST", "/api/cash/einvoice", { invoice: "inv-0417", taxId: "100-200-300" });
    expect(ok.body.message).toMatch(/valid/);
    expect((await inv("inv-0417")).eInvoice.status).toBe("Valid");
    expect((await inv("inv-0417")).eInvoiceNext ?? null).toBeNull();

    // A payment against the invoice: its balance and payments line follow.
    const before = await inv("inv-0412");
    expect(before.paymentDraft).toMatchObject({ reference: "TRX-77412" });
    const paid = await call("POST", "/api/cash/payment", { invoice: "inv-0412", amount: 200, reference: "TRX-1" });
    expect(paid.body.message).toMatch(/allocated to INV\/2026\/0412/);
    const after = await inv("inv-0412");
    expect(after.balance).toBe(before.balance - 200);
    expect(after.paymentsNote).toMatch(/TRX-1/);
    expect((await call("POST", "/api/cash/payment", { invoice: "inv-0412", amount: 0 })).status).toBe(400);
    await login("soaad.amer");
    expect(
      (await call("POST", "/api/cash/payment", { invoice: "inv-0412", amount: 10 })).status,
    ).toBeGreaterThanOrEqual(400);
  });

  it("does not offer to invoice a delivery an earlier invoice already covers", async () => {
    const o = (await ops("gs-rfq-0131")).body;
    expect(o.deliveries[0]).toMatchObject({ status: "Delivered — confirmed", invoice: "INV/2026/0412" });
    // The case's balance is its invoices' own (the delivery tab adds them up).
    const invoices = (await call("GET", "/api/invoices?where[case][equals]=gs-rfq-0131&depth=0")).body.docs;
    expect(invoices[0]).toMatchObject({ balance: 4200, paid: 10000 });
  });
});

describe("receivables and payables", () => {
  it("ages receivables by customer and respects contact rules in reminders", async () => {
    await login("mohamed.helmy");
    // Ageing is each open invoice's own `ageBucket` and `balanceUsd` (the page's breakdown adds them up).
    const invoices = (await call("GET", "/api/invoices?depth=1&limit=0")).body.docs as {
      customer: { name: string };
      balanceUsd: number;
      ageBucket: string | null;
    }[];
    const atlas = Object.fromEntries(
      ["Not due", "1–30 days", "31–60 days", "60+ days"].map((b) => [
        b,
        invoices
          .filter((i) => i.customer.name === "Atlas Tankers" && i.ageBucket === b)
          .reduce((t, i) => Math.round((t + i.balanceUsd) * 100) / 100, 0),
      ]),
    );
    expect(atlas).toEqual({ "Not due": 0, "1–30 days": 0, "31–60 days": 6500, "60+ days": 1400 });
    const cash = (await call("GET", "/api/operations/cash")).body;
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
    await login("mohamed.helmy");
    const cash = (await call("GET", "/api/operations/cash")).body;
    // What we owe on each PO is the PO's own `payable`.
    const stagesNow = async () =>
      Object.fromEntries(
        (await call("GET", "/api/purchase-orders?depth=0&limit=0")).body.docs.map(
          (p: { number: string; payable?: { stage: string } | null }) => [p.number, p.payable?.stage],
        ),
      );
    expect(await stagesNow()).toMatchObject({
      P0418: "Deposit to pay",
      P0417: "Bill on hold",
      P0416: "Balance on delivery",
    });
    const deposit = cash.approvals.find((a: { id: string }) => a.id === "ap-deposit-0133");
    expect(deposit).toMatchObject({ amount: 48200, canDecide: true });
    // The PO's own deposit: in approval, so its cell links to /cash and its note reads as a warning.
    const po0418 = async () => (await call("GET", "/api/purchase-orders/po-0418?depth=0")).body;
    expect((await po0418()).deposit).toMatchObject({ state: "In approval", href: "/cash" });

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
    expect((await stagesNow()).P0418).toBe("Bill on hold");
    expect((await po0418()).deposit).toMatchObject({ state: "Paid", href: null });
    expect(after.approvals.some((a: { id: string }) => a.id === "ap-deposit-0133")).toBe(false);
  });

  it("requests a payment approval through the PO's own action, once", async () => {
    await login("mohamed.helmy");
    const po = async (id: string) => (await call("GET", `/api/purchase-orders/${id}`)).body;
    // A bill on hold waits; a deposit already in approval is under way.
    expect((await po("po-0417")).payable).toMatchObject({
      requestable: false,
      next: "Waits for receipt / credit note",
    });
    expect((await po("po-0418")).payable).toMatchObject({ requestable: false, next: "Approval in progress" });
    const open = (await call("GET", "/api/purchase-orders?depth=0&limit=0")).body.docs.find(
      (p: { payable?: { requestable?: boolean } | null }) => p.payable?.requestable,
    );
    expect(open).toBeTruthy();
    expect((await call("POST", "/api/cash/request-approval", { payable: "po-0417" })).status).toBe(400);
    const r = await call("POST", "/api/cash/request-approval", { payable: open.id });
    expect(r.status).toBe(200);
    const approval = (await call("GET", `/api/approvals?where[title][like]=${open.number}&sort=-createdAt`)).body
      .docs[0];
    expect(approval).toMatchObject({ type: "Supplier payment" });
    expect(approval.title).toContain(open.payable.summary.split(" · ")[0]);
    expect((await po(open.id)).payable).toMatchObject({ requestable: false, next: "Approval in progress" });
    expect((await call("POST", "/api/cash/request-approval", { payable: open.id })).status).toBe(400);
    await login("soaad.amer");
    expect((await call("POST", "/api/cash/request-approval", { payable: open.id })).status).toBe(403);
  });

  it("matches each supplier bill to its case and refuses booking the same bill twice", async () => {
    await login("mohamed.helmy");
    const bill = (await call("GET", "/api/supplier-bills/bill-dm-5512?depth=0")).body;
    expect(bill).toMatchObject({
      case: "gs-rfq-0133",
      status: "On hold",
      matchLines: "L1: 40 · 40 · 40; L2: 200 · 180 · 200",
    });
    const again = await call("POST", "/api/case-order/book-bill", { bill: "bill-dm-5512" });
    expect(again.status).toBe(400);
    expect(JSON.stringify(again.body)).toMatch(/Duplicate bill blocked/);
  });

  it("needs two different people for a bank-detail change", async () => {
    await login("mohamed.helmy");
    let bank = (await call("GET", "/api/operations/cash")).body.bankChanges[0];
    expect(bank).toMatchObject({ id: "ap-bank-s3", status: "Approved 1 of 2", canDecide: false, applied: false });
    await login("karim.balbaa");
    bank = (await call("GET", "/api/operations/cash")).body.bankChanges[0];
    expect(bank.canDecide).toBe(true);
    const ap = (await call("GET", "/api/approvals/ap-bank-s3?depth=0")).body;
    const ok = await call("PATCH", "/api/approvals/ap-bank-s3", {
      decisions: [...ap.decisions, { decision: "Approve", reason: "Call-back done on number on file." }],
    });
    expect(ok.body.doc.status).toBe("Approved");
  });
});

/* ------------------------------------------------------------- what the pages' data widgets read */

// oxlint-disable-next-line typescript/no-explicit-any
type Json = any;

/** A collection's field by dotted path (through rows, groups and arrays), as the widgets find it. */
function fieldOf(slug: string, path: string): FieldLike {
  const find = (fields: FieldLike[], [head, ...rest]: string[]): FieldLike | undefined => {
    for (const f of fields) {
      if (!f.name && f.fields) {
        const x = find(f.fields, [head!, ...rest]);
        if (x) return x;
      }
      if (f.name === head) return rest.length ? find(f.fields ?? [], rest) : f;
    }
    return undefined;
  };
  const f = find(config.collections.find((c) => c.slug === slug)!.fields as FieldLike[], path.split("."));
  if (!f) throw new Error(`No field ${slug}.${path}`);
  return f;
}

/** The tone a field's `toneWhen` gives a document as read (the first rule that holds). */
const toneOf = (slug: string, path: string, doc: Json) =>
  fieldOf(slug, path).custom?.toneWhen?.find((r) => matches(doc, r.when as never))?.tone;

describe("what the order, delivery and cash pages' data widgets read", () => {
  it("supplier payables: sorted by due date as read, each supplier linking to its case's order tab", async () => {
    await login("mohamed.helmy");
    // `payable.due` is worked out on read, so the widget reads every PO and sorts them itself.
    expect(fieldOf("purchase-orders", "payable.due").virtual).toBe(true);
    const pos = (await call("GET", "/api/purchase-orders?depth=0&limit=0")).body.docs as Json[];
    const open = sortDocs(
      pos.filter((p) => p.payable?.balance > 0),
      "payable.due",
    );
    // A deposit to pay is due today: first.
    expect(open[0]).toMatchObject({ number: "P0418", payable: { stage: "Deposit to pay" } });
    expect(fieldOf("purchase-orders", "payable.supplier").custom?.href).toBe("/collections/cases/$row.case/order");
    expect(open[0]).toMatchObject({ case: "gs-rfq-0133", payable: { supplier: expect.stringMatching(/\w/) } });
    const held = open.find((p) => p.payable.stage === "Bill on hold");
    expect(toneOf("purchase-orders", "payable.note", held)).toBe("error");
    expect(toneOf("purchase-orders", "payable.note", open[0])).toBeUndefined();
  });

  it("the order tab: a deposit in approval links to /cash; deposits, the 3-way match and short receipts in their tone", async () => {
    const po = (await call("GET", "/api/purchase-orders/po-0418?depth=0")).body;
    expect(po.deposit).toMatchObject({ state: "In approval", href: "/cash" });
    expect(fieldOf("purchase-orders", "deposit.text").custom?.href).toBe("$row.deposit.href");
    expect(toneOf("purchase-orders", "deposit.note", po)).toBe("warning");
    const bills = (await call("GET", "/api/supplier-bills?where[case][equals]=gs-rfq-0133&depth=0")).body
      .docs as Json[];
    const held = bills.find((b) => b.status === "On hold");
    expect(toneOf("supplier-bills", "matchLines", held)).toBe("error");
    expect(toneOf("supplier-bills", "holdReason", held)).toBe("error");
    const matched = bills.filter((b) => b.status !== "On hold");
    expect(matched.length).toBeGreaterThan(0);
    expect(matched.map((b) => toneOf("supplier-bills", "matchLines", b))).not.toContain("error");
    const receipts = (await call("GET", "/api/receipts?where[case][equals]=gs-rfq-0133&depth=0&limit=0")).body
      .docs as Json[];
    const short = receipts.find((r) => r.lineNo === 3);
    expect(short.quantity).toBe("8 of 10");
    expect(toneOf("receipts", "quantity", short)).toBe("warning");
    expect(
      toneOf(
        "receipts",
        "quantity",
        receipts.find((r) => !r.shortfall),
      ),
    ).toBeUndefined();
  });

  it("the delivery tab: the case's invoices add up in their one currency", async () => {
    const invoices = (await call("GET", "/api/invoices?where[case][equals]=gs-rfq-0131&depth=0")).body.docs as Json[];
    expect(new Set(invoices.map((i) => i.currency))).toEqual(new Set(["USD"]));
    const sum = (k: string) => invoices.reduce((t, i) => t + i[k], 0);
    expect([sum("amount"), sum("paid"), sum("balance")]).toEqual([14200, 10000, 4200]);
    // A case with no invoice yet: the figures hide.
    expect((await call("GET", "/api/invoices?where[case][equals]=gs-rfq-0142&depth=0")).body.totalDocs).toBe(0);
  });
});
