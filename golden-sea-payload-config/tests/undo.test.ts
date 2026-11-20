import { beforeEach, describe, expect, it } from "vite-plus/test";
import { backend, call, login } from "./backend.ts";

/**
 * Undo: every reversible action answers with the call that takes it back (`undo: { path, body }`,
 * the snackbar's Undo). Each undo endpoint runs as the signed-in user, puts things back as they
 * were, and refuses once what it would take back has been built on. Outward actions (sending,
 * paying) answer with no `undo`.
 */

type Undo = { path: string; body?: Record<string, unknown> };
/** Runs a reply's `undo` the way the dashboard does: POST /api + path with its body. */
const undo = (u: Undo) => call("POST", `/api${u.path}`, u.body ?? {});
const message = (r: { body: { errors?: { message: string }[] } }) => r.body.errors?.[0]?.message ?? "";
const decide = (id: string, decision: "Approve" | "Reject", reason?: string) =>
  call("POST", `/api/commercial/approvals/${id}/decide`, { decision, reason });
const logout = () => call("POST", "/api/users/logout");
const doc = async (collection: string, id: string) => (await call("GET", `/api/${collection}/${id}?depth=0`)).body;

beforeEach(() => backend.reset());

describe("an approval decision can be withdrawn while nothing is built on it", () => {
  it("approve → undo: the request and its quotation wait again", async () => {
    await login("karim.balbaa");
    const ok = await decide("ap-quote-0135", "Approve");
    expect(ok.body).toMatchObject({ status: "Approved", canDecide: false });
    expect(ok.body.undo).toEqual({ path: "/commercial/approvals/ap-quote-0135/withdraw", body: {} });
    expect((await doc("quotations", "q-0135-v2")).status).toBe("Approved");

    const back = await undo(ok.body.undo);
    expect(back.status).toBe(200);
    expect(back.body).toMatchObject({ status: "Pending", canDecide: true });
    expect(back.body.message).toMatch(/withdrawn/i);
    expect(await doc("quotations", "q-0135-v2")).toMatchObject({ status: "Awaiting approval", approvedBy: null });
    expect((await doc("approvals", "ap-quote-0135")).decisions).toEqual([]);
    // It can be decided again, and withdrawn again.
    expect((await decide("ap-quote-0135", "Approve")).body.undo).toBeTruthy();
  });

  it("return → undo: the quotation is awaiting approval again, not returned", async () => {
    await login("karim.balbaa");
    const ret = await decide("ap-margin-0137", "Reject", "Margin too thin");
    expect(ret.body.status).toBe("Rejected");
    expect((await doc("quotations", "q-0137-v2")).status).toBe("Returned");
    expect((await undo(ret.body.undo)).status).toBe(200);
    expect((await doc("quotations", "q-0137-v2")).status).toBe("Awaiting approval");
    expect((await doc("approvals", "ap-margin-0137")).status).toBe("Pending");
    expect((await doc("cases", "gs-rfq-0137")).nextAction).toMatch(/approve/i);
  });

  it("refuses once the quotation was sent to the customer", async () => {
    await login("karim.balbaa");
    const ok = await decide("ap-quote-0135", "Approve");
    expect((await call("POST", "/api/commercial/quotations/q-0135-v2/send", { method: "email" })).status).toBe(200);
    const late = await undo(ok.body.undo);
    expect(late.status).toBe(409);
    expect(message(late)).toMatch(/already submitted/);
    expect((await doc("approvals", "ap-quote-0135")).status).toBe("Approved");
  });

  it("is the approver's own: nobody withdraws for someone else, or without signing in", async () => {
    await login("karim.balbaa");
    const ok = await decide("ap-quote-0135", "Approve");
    await login("mohamed.helmy");
    const other = await undo(ok.body.undo);
    expect(other.status).toBe(409);
    expect(message(other)).toMatch(/no decision/);
    await logout();
    expect((await undo(ok.body.undo)).status).toBe(401);
    await login("karim.balbaa");
    expect((await doc("approvals", "ap-quote-0135")).status).toBe("Approved");
  });

  it("two-person rule: only the last decision can go, back to one of two", async () => {
    // The finance director approved the bank-detail change earlier; the CEO approves second.
    await login("karim.balbaa");
    const second = await decide("ap-bank-s3", "Approve", "Call-back done");
    expect(second.body.status).toBe("Approved");
    await login("mohamed.helmy");
    const first = await undo({ path: "/commercial/approvals/ap-bank-s3/withdraw" });
    expect(first.status).toBe(409);
    expect(message(first)).toMatch(/decided after you/);
    await login("karim.balbaa");
    expect((await undo(second.body.undo)).body).toMatchObject({ status: "Approved 1 of 2", canDecide: true });
  });

  it("refuses once the approved bank details are applied", async () => {
    await login("karim.balbaa");
    const ok = await decide("ap-bank-s3", "Approve", "Call-back done");
    expect((await call("POST", "/api/cash/apply-bank", { approval: "ap-bank-s3" })).status).toBe(200);
    const late = await undo(ok.body.undo);
    expect(late.status).toBe(409);
    expect(message(late)).toMatch(/already applied/);
  });

  it("an exchange rate takes effect at once: its decision has no undo", async () => {
    await login("karim.balbaa");
    const fx = await decide("ap-fx-usd", "Approve");
    expect(fx.body.status).toBe("Approved");
    expect(fx.body.undo).toBeNull();
    expect((await undo({ path: "/commercial/approvals/ap-fx-usd/withdraw" })).status).toBe(409);
  });

  it("a payment approval (Cash) can be withdrawn until the payment is recorded", async () => {
    await login("karim.balbaa");
    const ok = await call("POST", "/api/cash/decide", { approval: "ap-deposit-0133", decision: "Approve" });
    expect(ok.body.undo).toEqual({ path: "/commercial/approvals/ap-deposit-0133/withdraw", body: {} });
    expect((await undo(ok.body.undo)).status).toBe(200);
    expect((await doc("approvals", "ap-deposit-0133")).status).toBe("Pending");

    const again = await call("POST", "/api/cash/decide", { approval: "ap-deposit-0133", decision: "Approve" });
    const paid = await call("POST", "/api/cash/record-payment", { approval: "ap-deposit-0133", reference: "TRX-1" });
    expect(paid.status).toBe(200);
    // Recording a payment is outward: it answers with no undo, and the approval now stands.
    expect(paid.body.undo).toBeUndefined();
    const late = await undo(again.body.undo);
    expect(late.status).toBe(409);
    expect(message(late)).toMatch(/already recorded/);
  });
});

describe("an inbox review can be taken back by the person who made it", () => {
  const REVIEW = "/api/inbox/msg-delta-uncertain/review";

  it("not related → undo: back in the review queue with its candidates", async () => {
    await login();
    const before = await doc("intake-messages", "msg-delta-uncertain");
    const gone = await call("POST", REVIEW, { decision: "not-related" });
    expect(gone.body.message.status).toBe("Ignored");
    expect(gone.body.undo.path).toBe("/inbox/msg-delta-uncertain/reopen");

    // Someone else can't take another person's decision back.
    await login("karim.balbaa");
    expect((await undo(gone.body.undo)).status).toBe(403);
    await login();
    const back = await undo(gone.body.undo);
    expect(back.status).toBe(200);
    const after = await doc("intake-messages", "msg-delta-uncertain");
    expect(after.status).toBe("Needs review");
    expect(after.match.reviewedBy ?? null).toBeNull();
    expect(after.match.case ?? null).toEqual(before.match.case ?? null);
    expect(after.match.candidates).toEqual(before.match.candidates);
    // Nothing left to take back.
    expect((await undo(gone.body.undo)).status).toBe(409);
  });

  it("link → undo: a link that only filed the message comes off again", async () => {
    await login();
    // Delta Marine has no supplier RFQ on GS-RFQ-0140, so linking there saves and changes nothing else.
    const linked = await call("POST", REVIEW, { decision: "link", case: "gs-rfq-0140" });
    expect(linked.body.message).toMatchObject({ status: "Linked", match: { case: { caseId: "GS-RFQ-0140" } } });
    expect(linked.body.undo).toEqual({
      path: "/inbox/msg-delta-uncertain/reopen",
      body: { status: "Needs review", case: null },
    });
    const back = await undo(linked.body.undo);
    expect(back.body).toMatchObject({ doc: { status: "Needs review" }, message: "Back in the review queue" });
    const after = await doc("intake-messages", "msg-delta-uncertain");
    expect(after.match.case ?? null).toBeNull();
    expect(after.match.reviewedBy ?? null).toBeNull();
    // The case timeline says so.
    const log = await call("GET", "/api/activities?where[case][equals]=gs-rfq-0140&depth=0&limit=0");
    expect(log.body.docs.some((a: { text?: string }) => /put back in the review queue/.test(a.text ?? ""))).toBe(true);
  });

  it("a link that counted a supplier's reply on the case stands", async () => {
    await login();
    const linked = await call("POST", REVIEW, { decision: "link", case: "gs-rfq-0142" });
    expect(linked.body.message.status).toBe("Linked");
    expect(linked.body.undo).toBeNull();
    const late = await undo({ path: "/inbox/msg-delta-uncertain/reopen" });
    expect(late.status).toBe(409);
    expect(message(late)).toMatch(/already counted/);
  });
});

describe("a history decision can be taken back until the import is approved", () => {
  it("confirm → undo: the item needs a decision again; approved imports stand", async () => {
    await login("karim.balbaa");
    const org = (await call("POST", "/api/inbox-history/organise")).body;
    const [first, ...rest] = org.review as { id: string }[];
    const done = await call("POST", `/api/inbox-history/review/${first!.id}`, { decision: "confirm" });
    expect(done.body.pending).toBe(org.pending - 1);
    expect(done.body.undo).toEqual({ path: `/inbox-history/review/${first!.id}`, body: { decision: "reopen" } });

    await login("karim.youssef");
    expect((await undo(done.body.undo)).status).toBe(403);
    await login("karim.balbaa");
    const back = await undo(done.body.undo);
    expect(back.body.pending).toBe(org.pending);
    expect((await undo(done.body.undo)).status).toBe(409); // already waiting

    for (const item of [first!, ...rest])
      await call("POST", `/api/inbox-history/review/${item.id}`, { decision: "confirm" });
    expect((await call("POST", "/api/inbox-history/approve")).body.approved).toBe(true);
    const late = await undo(done.body.undo);
    expect(late.status).toBe(409);
    expect(message(late)).toMatch(/approved and saved/);
  });
});

describe("a partial-award decision on a line can be taken back", () => {
  const award = (po: string, outcome: string, reason?: string) =>
    call("POST", "/api/operations/po-award", { po, lineNo: 6, outcome, reason });
  const line6 = async (po: string) =>
    ((await doc("customer-pos", po)).unawarded ?? []).find((u: { lineNo: number }) => u.lineNo === 6) ?? null;

  it("keep open → undo: undecided again; close → undo: kept open again", async () => {
    await login();
    const po = (await call("POST", "/api/operations/po-check", { case: "gs-rfq-0142" })).body.doc.id as string;
    expect(await line6(po)).toBeNull();

    const open = await award(po, "Open — revision to follow");
    expect(open.body.undo).toMatchObject({ path: "/operations/po-award-undo", body: { lineNo: 6, was: null } });
    const closed = await award(po, "Closed", "Vessel bought it locally");
    expect(closed.body.undo.body.was).toMatchObject({ outcome: "Open — revision to follow" });

    // The older undo is stale: the line was decided again since.
    expect((await undo(open.body.undo)).status).toBe(409);
    const reopened = await undo(closed.body.undo);
    expect(reopened.status).toBe(200);
    expect(await line6(po)).toMatchObject({ outcome: "Open — revision to follow" });
    // Now the first decision is the current one again, and can go too.
    expect((await undo(open.body.undo)).status).toBe(200);
    expect(await line6(po)).toBeNull();
  });

  it("needs a signed-in user", async () => {
    await login();
    const po = (await call("POST", "/api/operations/po-check", { case: "gs-rfq-0142" })).body.doc.id as string;
    const open = await award(po, "Open — revision to follow");
    await logout();
    expect((await undo(open.body.undo)).status).toBe(401);
  });
});

describe("an offer selection on a case line can be taken back", () => {
  const CASE = "/api/commercial/cases/gs-rfq-0142";
  const item = async (n: number) =>
    (await doc("cases", "gs-rfq-0142")).items.find((i: { lineNo: number }) => i.lineNo === n);
  const select = (offer: string, reason?: string) =>
    call("POST", `${CASE}/select`, { lineNo: 1, parts: [{ offer, qty: 24 }], reason });

  it("select → undo: the line has the selection and status it had; a later selection makes it stale", async () => {
    await login();
    const before = await item(1);
    const first = await select("off-l1-s1", "Delta is an approved supplier");
    expect(first.status).toBe(200);
    expect((await item(1)).selection.offers).toEqual(["off-l1-s1"]);
    expect(first.body.undo.path).toBe("/commercial/cases/gs-rfq-0142/select-undo");

    const second = await select("off-l1-s5");
    expect((await undo(first.body.undo)).status).toBe(409); // selected again since
    // Undoing the second gives the first back, with its reason; undoing that gives the start.
    expect((await undo(second.body.undo)).body.message).toMatch(/taken back/);
    expect((await item(1)).selection).toMatchObject({ offers: ["off-l1-s1"], reason: "Delta is an approved supplier" });
    expect((await undo(first.body.undo)).status).toBe(200);
    const after = await item(1);
    expect(after.status).toBe(before.status);
    expect(after.selection?.offers ?? []).toEqual(before.selection?.offers ?? []);
  });

  it("refuses for Sales, and once a quotation priced with it is on its way", async () => {
    await login();
    const picked = await select("off-l1-s5");
    await login("soaad.amer");
    expect((await undo(picked.body.undo)).status).toBe(403);
    await login();
    expect((await call("POST", `${CASE}/request-approval`, {})).status).toBe(200);
    const late = await undo(picked.body.undo);
    expect(late.status).toBe(409);
    expect(message(late)).toMatch(/awaiting approval/);
  });

  it("own stock turned into an offer record stands: no undo", async () => {
    await login();
    const stock = await call("POST", `${CASE}/select`, {
      lineNo: 1,
      parts: [
        { offer: "stock:st-p1-alex", qty: 6 },
        { offer: "off-l1-s1", qty: 18 },
      ],
      reason: "Use our own stock first",
    });
    expect(stock.status).toBe(200);
    expect(stock.body.undo).toBeNull();
  });
});

describe("removed or discarded RFQ drafts can be put back before anything is sent", () => {
  const CASE = "/api/sourcing/cases/gs-rfq-0142";
  const drafts = async () =>
    ((await call("GET", CASE)).body.plan?.drafts ?? []).map((d: { reference: string }) => d.reference) as string[];

  it("remove → undo and discard → undo restore the drafts; a new plan or a send makes them stale", async () => {
    await login();
    const plan = (await call("POST", `${CASE}/plan`, { mode: "split" })).body;
    const all = plan.drafts.map((d: { reference: string }) => d.reference) as string[];
    expect(all.length).toBeGreaterThan(1);

    const removed = await call("POST", `${CASE}/plan/remove`, { reference: all[0] });
    expect(await drafts()).toEqual(all.slice(1));
    expect((await undo(removed.body.undo)).status).toBe(200);
    expect(await drafts()).toEqual(all);
    expect((await undo(removed.body.undo)).status).toBe(409); // nothing left to put back

    const discarded = await call("POST", `${CASE}/plan/discard`);
    expect(await drafts()).toEqual([]);
    expect((await undo(discarded.body.undo)).body.message).toMatch(/nothing was sent/);
    expect(await drafts()).toEqual(all);

    // Drafted again since: the old undo no longer applies.
    const stale = await call("POST", `${CASE}/plan/discard`);
    await call("POST", `${CASE}/plan`, { mode: "split" });
    expect((await undo(stale.body.undo)).status).toBe(409);

    // Sending is outward: no undo, and nothing to restore afterwards.
    const gone = await call("POST", `${CASE}/plan/remove`, { reference: (await drafts())[0] });
    const sent = await call("POST", `${CASE}/send`, {});
    expect(sent.status).toBe(201);
    expect(sent.body.undo).toBeUndefined();
    expect((await undo(gone.body.undo)).status).toBe(409);
  });
});
