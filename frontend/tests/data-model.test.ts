import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import config from "../src/cms/config.ts";
import { Engine } from "../src/mock/runtime/engine.ts";
import { RestApi } from "../src/mock/runtime/rest.ts";
import { seedsFromGlob } from "../src/mock/runtime/seed.ts";
import { MemoryStore } from "../src/mock/runtime/store.ts";
import { createStore, endTour, filters, setCaseFilters, startTour, toast, toasts, tour } from "../src/stores/index.ts";

/** The sourcing-desk data model (STATE-AUDIT.md): seeds load cleanly and the business rules hold. */

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
const as = async (user: string) => {
  token = "";
  const { body } = await call("POST", "/api/users/login", { email: `${user}@goldensea.test`, password: "demo1234" });
  token = body.token;
};

beforeEach(async () => {
  token = "";
  api = new RestApi(new Engine(config, new MemoryStore()), seeds);
  await as("karim.balbaa");
});

describe("seed data", () => {
  it("loads every seeded document without validation errors", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await call("POST", "/api/_mock/reset");
    await as("karim.balbaa");
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
    for (const [slug, docs] of Object.entries(seeds.collections)) {
      const { body } = await call("GET", `/api/${slug}/count`);
      // Per-user collections (notifications, bookmarks) show only the signed-in user's own.
      const visible = docs.some((d) => "user" in d) ? docs.filter((d) => d.user === "kb") : docs;
      expect(body.totalDocs, slug).toBe(visible.length);
    }
  });

  it("defines a global for every seeded global", async () => {
    for (const slug of Object.keys(seeds.globals)) {
      const { status } = await call("GET", `/api/globals/${slug}`);
      expect(status, slug).toBe(200);
    }
    const fx = (await call("GET", "/api/globals/fx-rates")).body;
    expect(fx.rates.filter((r: { status: string }) => r.status === "Active")).toHaveLength(2);
  });
});

describe("business rules", () => {
  it("numbers supplier RFQs per case and stops reminders on reply", async () => {
    const { body } = await call("POST", "/api/supplier-rfqs", {
      case: "gs-rfq-0142",
      supplier: "S2",
      lineNos: [4],
      dueAt: "2026-11-18T12:00:00.000Z",
      nextReminderAt: "2026-11-18T09:00:00.000Z",
      status: "Sent",
    });
    expect(body.doc.reference).toBe("GS-SRFQ-0142-F");
    const updated = await call("PATCH", `/api/supplier-rfqs/${body.doc.id}`, { status: "Replied" });
    expect(updated.body.doc.nextReminderAt).toBeNull();
  });

  it("refuses supplier RFQs that would reveal the client", async () => {
    const { status } = await call("POST", "/api/supplier-rfqs", {
      case: "gs-rfq-0142",
      supplier: "S2",
      lineNos: [4],
      dueAt: "2026-11-18T12:00:00.000Z",
      anonymised: false,
    });
    expect(status).toBe(400);
  });

  it("supersedes the previous offer version and records the price", async () => {
    const { body } = await call("POST", "/api/offers", {
      case: "gs-rfq-0142",
      lineNo: 5,
      supplier: "S4",
      version: 2,
      supersedes: "off-l5-s4",
      price: 335,
      currency: "EGP",
      packs: 15,
      leadDays: 2,
      source: "Email",
    });
    expect(body.doc.label).toBe("L5 · Nile Safety Equipment v2");
    expect((await call("GET", "/api/offers/off-l5-s4?depth=0")).body.superseded).toBe(true);
    const prices = await call("GET", "/api/supplier-prices?where[supplier][equals]=S4&depth=0");
    expect(prices.body.docs.some((p: { price: number }) => p.price === 335)).toBe(true);
  });

  it("applies the two-person rule on bank-detail changes", async () => {
    const ap = (await call("GET", "/api/approvals/ap-bank-s3?depth=0")).body;
    expect(ap.status).toBe("Approved 1 of 2");
    // Mohamed Helmy already approved: he can't approve twice.
    await as("mohamed.helmy");
    const twice = await call("PATCH", "/api/approvals/ap-bank-s3", {
      decisions: [...ap.decisions, { user: "mh", decision: "Approve" }],
    });
    expect(twice.status).toBe(400);
    // Nobody records a decision for someone else, and non-approvers can't decide.
    await as("karim.youssef");
    const other = await call("PATCH", "/api/approvals/ap-bank-s3", {
      decisions: [...ap.decisions, { user: "kb", decision: "Approve" }],
    });
    expect(other.status).toBe(400);
    await as("karim.balbaa");
    const ok = await call("PATCH", "/api/approvals/ap-bank-s3", {
      decisions: [...ap.decisions, { decision: "Approve" }],
    });
    expect(ok.body.doc.status).toBe("Approved");
  });

  it("blocks a duplicate supplier bill and holds a bill that doesn't match receipts", async () => {
    const held = (await call("GET", "/api/supplier-bills/bill-dm-5512?depth=0")).body;
    expect(held.status).toBe("On hold");
    expect(held.holdReason).toMatch(/Billed 200, received 180/);
    const dup = await call("POST", "/api/supplier-bills", { billNumber: "DM-5512", supplier: "S1", amount: 96400 });
    expect(dup.status).toBe(400);
    expect(JSON.stringify(dup.body)).toMatch(/Duplicate bill/);
    const otherSupplier = await call("POST", "/api/supplier-bills", {
      billNumber: "DM-5512",
      supplier: "S2",
      amount: 10,
    });
    expect(otherSupplier.status).toBe(201);
  });

  it("keeps a customer PO blocked until every mismatch is resolved", async () => {
    const po = {
      number: "NSM-PO-77231",
      case: "gs-rfq-0142",
      quotation: "q-0142-v1",
      checks: [
        { lineNo: 1, field: "Price", po: "24 × 14.05", quote: "24 × 14.05", matches: true },
        { lineNo: 5, field: "Quantity", po: "20 EA", quote: "15 EA", matches: false },
      ],
    };
    const created = await call("POST", "/api/customer-pos", po);
    expect(created.body.doc.status).toBe("Blocked — mismatch");
    po.checks[1] = { ...po.checks[1], resolution: "Customer confirmed 15 EA (email 18 Nov)" } as never;
    const fixed = await call("PATCH", `/api/customer-pos/${created.body.doc.id}`, { checks: po.checks });
    expect(fixed.body.doc.status).toBe("Validated");
  });

  it("refuses customer follow-ups for do-not-chase accounts", async () => {
    const task = {
      title: "Chase Atlas",
      type: "Customer follow-up",
      channel: "Email",
      due: "2026-11-19T09:00:00.000Z",
      customer: "atlas",
      owner: "ky",
    };
    expect((await call("POST", "/api/tasks", task)).status).toBe(400);
    expect((await call("POST", "/api/tasks", { ...task, internalOnly: true })).status).toBe(201);
  });

  it("only management approves quotations and confirms supplier POs", async () => {
    await as("karim.youssef");
    expect((await call("PATCH", "/api/quotations/q-0142-v1", { status: "Approved" })).status).toBe(400);
    const po = await call("POST", "/api/purchase-orders", {
      case: "gs-rfq-0142",
      supplier: "S5",
      currency: "USD",
      lines: [{ lineNo: 1, description: "CRC Belt Grip", qty: 24, unitPrice: 9.8 }],
    });
    expect(po.body.doc).toMatchObject({ number: "P0419", total: 235.2 });
    expect(
      (await call("PATCH", `/api/purchase-orders/${po.body.doc.id}`, { status: "Confirmed", recheckDone: true }))
        .status,
    ).toBe(400);
    await as("karim.balbaa");
    expect((await call("PATCH", `/api/purchase-orders/${po.body.doc.id}`, { status: "Confirmed" })).status).toBe(400); // no re-check
    expect(
      (await call("PATCH", `/api/purchase-orders/${po.body.doc.id}`, { status: "Confirmed", recheckDone: true }))
        .status,
    ).toBe(200);
    expect((await call("PATCH", "/api/quotations/q-0142-v1", { status: "Approved" })).body.doc.status).toBe("Approved");
  });

  it("allocates customer receipts to invoices and needs approval for supplier payments", async () => {
    await call("POST", "/api/payments", {
      direction: "in",
      reference: "TRX-1",
      paidAt: "2026-11-20T00:00:00.000Z",
      amount: 4200,
      currency: "USD",
      invoice: "inv-0412",
    });
    const inv = (await call("GET", "/api/invoices/inv-0412?depth=0")).body;
    expect(inv).toMatchObject({ paid: 14200, balance: 0, status: "Paid" });
    const out = {
      direction: "out",
      reference: "TRX-2",
      paidAt: "2026-11-20T00:00:00.000Z",
      amount: 48200,
      currency: "EGP",
      purchaseOrder: "po-0418",
    };
    expect((await call("POST", "/api/payments", out)).status).toBe(400);
    expect(
      (await call("POST", "/api/payments", { ...out, approval: "ap-deposit-0133", status: "Planned" })).status,
    ).toBe(201);
  });

  it("hides costs and margins from sales", async () => {
    await as("soaad.amer");
    const offer = (await call("GET", "/api/offers/off-l1-s1?depth=0")).body;
    expect(offer.price).toBeUndefined();
    const c = (await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body;
    expect(c.pricing).toBeUndefined();
    expect(c.items[0].selection.marginPct).toBeUndefined();
  });

  it("logs stage changes on the case timeline and numbers service cases separately", async () => {
    await call("PATCH", "/api/cases/gs-rfq-0142", { stage: "Awaiting management approval" });
    const acts = await call("GET", "/api/activities?where[case][equals]=gs-rfq-0142&depth=0&limit=0");
    expect(
      acts.body.docs.some(
        (a: { text: string }) => a.text === "Stage: Comparing offers → Awaiting management approval.",
      ),
    ).toBe(true);
    const svc = await call("POST", "/api/cases", {
      caseType: "service",
      customer: "nordvik",
      vessel: "MV Aurora Crest",
      deadline: "2026-11-20T12:00:00.000Z",
      nextAction: "Clear AWB 41 2233 9081",
      owner: "ah",
    });
    expect(svc.body.doc.caseId).toMatch(/^GS-SVC-\d{4}$/);
  });
});

describe("frontend stores", () => {
  it("merges, notifies only on change, and resets", () => {
    const s = createStore({ a: 1, b: "x" });
    const seen: number[] = [];
    s.subscribe((st) => seen.push(st.a));
    s.set({ a: 1 });
    s.set({ a: 2 });
    s.set((st) => ({ a: st.a + 1 }));
    expect(seen).toEqual([2, 3]);
    s.reset();
    expect(s.get()).toEqual({ a: 1, b: "x" });
  });

  it("updates nested case filters, tours and toasts", () => {
    setCaseFilters({ view: "board" });
    expect(filters.get().cases).toMatchObject({ view: "board", scope: "all" });
    startTour("morning");
    endTour(true);
    expect(tour.get()).toMatchObject({ active: null, completed: ["morning"] });
    const id = toast("Saved", "success", 0);
    expect(toasts.get().items.map((t) => t.id)).toContain(id);
  });
});
