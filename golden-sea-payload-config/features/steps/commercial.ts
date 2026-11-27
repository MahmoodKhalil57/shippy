import { collectionNamed, Then, When, type BusinessWorld } from "test-runner/steps";
import { expect } from "vite-plus/test";

type Json = Record<string, unknown>;
type Offer = { id: string; supplier: string };
type Line = { lineNo: number; status: string; offers: Offer[] };
type Check = { label: string; ok: boolean };

const quotation = (world: BusinessWorld, number: string) => world.record(collectionNamed("quotations"), number);
const caseNamed = (world: BusinessWorld, caseId: string) => world.record(collectionNamed("cases"), caseId);
const approvalNamed = (world: BusinessWorld, title: string) => world.record(collectionNamed("approvals"), title);
const opportunity = (world: BusinessWorld, name: string) => world.record(collectionNamed("opportunities"), name);
const body = (world: BusinessWorld) => (world.reply?.body ?? {}) as Json;

const decide = async (world: BusinessWorld, number: string, decision: string, note?: string) => {
  const q = await quotation(world, number);
  await world.send("POST", `/quote-preview/${q.id}/decision`, { decision, note });
};

When(
  "I record the customer's decision on quotation {string} as {string}",
  (world: BusinessWorld, number: string, decision: string) => decide(world, number, decision),
);

When(
  "I record the customer's decision on quotation {string} as {string} because {string}",
  (world: BusinessWorld, number: string, decision: string, note: string) => decide(world, number, decision, note),
);

const quoteAction = async (world: BusinessWorld, number: string, action: string, payload: Json = {}) => {
  const q = await quotation(world, number);
  await world.send("POST", `/commercial/quotations/${q.id}/${action}`, payload);
};

When("I email quotation {string} to {string}", async (world: BusinessWorld, number: string, to: string) => {
  const q = await quotation(world, number);
  await world.send("POST", `/quote-preview/${q.id}/send`, { method: "email", to });
});

When("I mark quotation {string} as entered in the customer portal", async (world: BusinessWorld, number: string) => {
  const q = await quotation(world, number);
  await world.send("POST", `/quote-preview/${q.id}/send`, { method: "portal" });
});

When("I check quotation {string} against the customer portal", (world: BusinessWorld, number: string) =>
  quoteAction(world, number, "portal-check"),
);

Then("the portal check flags only {string}", (world: BusinessWorld, field: string) => {
  const rows = (body(world).rows ?? []) as { field: string; matches: boolean }[];
  expect(rows.filter((r) => !r.matches).map((r) => r.field)).toEqual([field]);
});

When("I revise quotation {string} because {string}", async (world: BusinessWorld, number: string, reason: string) => {
  const q = await quotation(world, number);
  await world.send("POST", `/quote-preview/${q.id}/revise`, { reason });
});

When("I request approval for quotation {string}", (world: BusinessWorld, number: string) =>
  quoteAction(world, number, "request-approval"),
);

When("I request a margin exception for quotation {string}", (world: BusinessWorld, number: string) =>
  quoteAction(world, number, "request-approval", { type: "Quotation margin exception" }),
);

When("I send the pricing of case {string} for approval", async (world: BusinessWorld, caseId: string) => {
  const c = await caseNamed(world, caseId);
  await world.send("POST", `/commercial/cases/${c.id}/request-approval`, {});
});

const openApproval = async (world: BusinessWorld, number: string) => {
  const q = await quotation(world, number);
  const found = await world.backend.engine.find({
    collection: "approvals",
    where: { "subject.value": { equals: q.id } },
    limit: 0,
    depth: 0,
  });
  const docs = (found as { docs: Json[] }).docs;
  const approval = docs.find((a) => !["Approved", "Rejected"].includes(String(a.status))) ?? docs.at(-1);
  if (!approval) throw new Error(`Quotation "${number}" has no approval request.`);
  return String(approval.id);
};

const decideApproval = async (world: BusinessWorld, id: string, decision: string, reason = "") => {
  await world.send("POST", `/commercial/approvals/${id}/decide`, { decision, reason });
};

Then("quotation {string} is {string}", async (world: BusinessWorld, number: string, status: string) => {
  expect((await quotation(world, number)).status).toBe(status);
});

Then("quotation {string} replaces {string}", async (world: BusinessWorld, number: string, previous: string) => {
  const [q, p] = await Promise.all([quotation(world, number), quotation(world, previous)]);
  expect(q.previousVersion).toBe(p.id);
});

Then(
  "quotation {string} waits for a {string} approval by {string}",
  async (world: BusinessWorld, number: string, type: string, approver: string) => {
    const approval = await world.backend.engine.findByID({
      collection: "approvals",
      id: await openApproval(world, number),
      depth: 1,
    });
    expect(approval.type).toBe(type);
    expect(approval.status).toBe("Pending");
    expect(((approval.approvers ?? []) as { name?: string }[]).map((a) => a.name)).toEqual([approver]);
  },
);

When("I approve quotation {string}", async (world: BusinessWorld, number: string) =>
  decideApproval(world, await openApproval(world, number), "Approve"),
);

When("I return quotation {string} because {string}", async (world: BusinessWorld, number: string, reason: string) =>
  decideApproval(world, await openApproval(world, number), "Reject", reason),
);

When("I return quotation {string} without a reason", async (world: BusinessWorld, number: string) =>
  decideApproval(world, await openApproval(world, number), "Reject"),
);

When("I withdraw my decision on quotation {string}", async (world: BusinessWorld, number: string) => {
  await world.send("POST", `/commercial/approvals/${await openApproval(world, number)}/withdraw`, {});
});

When("I open the approval request for quotation {string}", async (world: BusinessWorld, number: string) => {
  await world.send("GET", `/approvals/${await openApproval(world, number)}?depth=0`);
});

Then("the request shows the type {string}", (world: BusinessWorld, type: string) => {
  expect(body(world).type).toBe(type);
});

Then("the request shows neither its type nor its detail", (world: BusinessWorld) => {
  expect(world.reply?.status).toBe(200);
  expect(body(world).type).toBeUndefined();
  expect(body(world).detail).toBeUndefined();
});

Then("nothing on the request reveals the margin or the policy minimum", (world: BusinessWorld) => {
  const seen = JSON.stringify(body(world));
  expect(seen).not.toMatch(/\d+(\.\d+)?\s?%/);
  expect(seen).not.toMatch(/minimum|exception/i);
});

Then(
  "the progress of quotation {string} shows {string}",
  async (world: BusinessWorld, number: string, label: string) => {
    const q = await quotation(world, number);
    const reply = await world.backend.send("GET", `/commercial/quotations/${q.id}`, { as: world.person });
    expect((reply.body as { stepLabel?: string }).stepLabel).toBe(label);
  },
);

Then("the pricing converts {word} at {float}", (world: BusinessWorld, currency: string, rate: number) => {
  expect(body(world).currency).toBe(currency);
  expect(body(world).fx).toBe(rate);
});

When("I approve the request {string}", async (world: BusinessWorld, title: string) =>
  decideApproval(world, String((await approvalNamed(world, title)).id), "Approve"),
);

When("I withdraw my decision on the request {string}", async (world: BusinessWorld, title: string) => {
  await world.send("POST", `/commercial/approvals/${(await approvalNamed(world, title)).id}/withdraw`, {});
});

Then("the exchange rate for {string} is {string}", async (world: BusinessWorld, currency: string, status: string) => {
  const g = (await world.backend.engine.findGlobal({ slug: "fx-rates", depth: 0 })) as {
    rates?: { currency?: string; status?: string; egpPerUnit?: number }[];
  };
  expect(g.rates?.find((r) => `${r.currency} ${r.egpPerUnit}` === currency)?.status).toBe(status);
});

When("I look at the offers for case {string}", async (world: BusinessWorld, caseId: string) => {
  const c = await caseNamed(world, caseId);
  await world.send("GET", `/commercial/cases/${c.id}/compare`);
});

When("I look at the pricing of case {string}", async (world: BusinessWorld, caseId: string) => {
  const c = await caseNamed(world, caseId);
  await world.send("GET", `/commercial/cases/${c.id}/pricing`);
});

const setPricing = async (world: BusinessWorld, caseId: string, change: Json) => {
  const c = await caseNamed(world, caseId);
  await world.send("POST", `/commercial/cases/${c.id}/pricing`, change);
};

When(
  "I set the margin on line {int} of case {string} to {float}%",
  (world: BusinessWorld, lineNo: number, caseId: string, pct: number) =>
    setPricing(world, caseId, { margins: { [lineNo]: pct } }),
);

When(
  "I give the customer on case {string} a discount of {float}%",
  (world: BusinessWorld, caseId: string, pct: number) => setPricing(world, caseId, { discountPct: pct }),
);

Then("the pricing needs a {string} approval", (world: BusinessWorld, type: string) => {
  expect(body(world).approvalType).toBe(type);
});

Then("the pricing warns {string}", (world: BusinessWorld, text: string) => {
  expect(body(world).exceptions).toContain(text);
});

Then("the pricing does not warn {string}", (world: BusinessWorld, text: string) => {
  expect(body(world).exceptions).not.toContain(text);
});

Then("the customer discount is {float}%", (world: BusinessWorld, pct: number) => {
  expect(body(world).discountPct).toBe(pct);
});

Then("line {int} is priced at a {float}% margin", (world: BusinessWorld, lineNo: number, pct: number) => {
  const rows = (body(world).rows ?? []) as { lineNo: number; marginPct: number }[];
  expect(rows.find((r) => r.lineNo === lineNo)?.marginPct).toBe(pct);
});

Then("line {int} is left off the quotation", (world: BusinessWorld, lineNo: number) => {
  const unpriced = (body(world).unpriced ?? []) as { lineNo: number }[];
  expect(unpriced.map((u) => u.lineNo)).toContain(lineNo);
});

Then("line {int} has the check {string}", (world: BusinessWorld, lineNo: number, text: string) => {
  const rows = (body(world).rows ?? []) as { lineNo: number; checks: { text: string }[] }[];
  expect(rows.find((r) => r.lineNo === lineNo)?.checks.map((c) => c.text)).toContain(text);
});

const lineOf = async (world: BusinessWorld, caseId: string, lineNo: number) => {
  const c = await caseNamed(world, caseId);
  const reply = await world.backend.send("GET", `/commercial/cases/${c.id}/compare`, { as: world.person });
  const line = ((reply.body as { lines?: Line[] }).lines ?? []).find((l) => l.lineNo === lineNo);
  if (!line) throw new Error(`Case ${caseId} has no line ${lineNo}.`);
  return { c, line };
};

const offerFrom = (line: Line, supplier: string) => {
  const offer = line.offers.find((o) => o.supplier === supplier);
  if (!offer) throw new Error(`Line ${line.lineNo} has no offer from ${supplier}.`);
  return offer.id;
};

const select = async (world: BusinessWorld, caseId: string, lineNo: number, parts: Json[], reason?: string) => {
  const { c } = await lineOf(world, caseId, lineNo);
  await world.send("POST", `/commercial/cases/${c.id}/select`, { lineNo, parts, reason });
};

When(
  "I select {int} from {string} for line {int} of case {string}",
  async (world: BusinessWorld, qty: number, supplier: string, lineNo: number, caseId: string) => {
    const { line } = await lineOf(world, caseId, lineNo);
    await select(world, caseId, lineNo, [{ offer: offerFrom(line, supplier), qty }]);
  },
);

When(
  "I select {int} from {string} for line {int} of case {string} because {string}",
  async (world: BusinessWorld, qty: number, supplier: string, lineNo: number, caseId: string, reason: string) => {
    const { line } = await lineOf(world, caseId, lineNo);
    await select(world, caseId, lineNo, [{ offer: offerFrom(line, supplier), qty }], reason);
  },
);

When(
  "I split line {int} of case {string} as {int} from {string} and {int} from {string}",
  async (world: BusinessWorld, lineNo: number, caseId: string, q1: number, s1: string, q2: number, s2: string) => {
    const { line } = await lineOf(world, caseId, lineNo);
    await select(world, caseId, lineNo, [
      { offer: offerFrom(line, s1), qty: q1 },
      { offer: offerFrom(line, s2), qty: q2 },
    ]);
  },
);

When("I take back that selection", async (world: BusinessWorld) => {
  const undo = body(world).undo as { path: string; body: Json } | null;
  if (!undo) throw new Error("That selection cannot be taken back.");
  await world.send("POST", undo.path, undo.body);
});

When(
  "I record that the customer accepts the alternative on line {int} of case {string}",
  async (world: BusinessWorld, lineNo: number, caseId: string) => {
    const c = await caseNamed(world, caseId);
    await world.send("POST", `/commercial/cases/${c.id}/accept`, { lineNo, note: "Accepted by email" });
  },
);

Then(
  "line {int} of case {string} is {string}",
  async (world: BusinessWorld, lineNo: number, caseId: string, status: string) => {
    const c = await caseNamed(world, caseId);
    const item = ((c.items ?? []) as { lineNo: number; status?: string }[]).find((i) => i.lineNo === lineNo);
    expect(item?.status).toBe(status);
  },
);

Then("line {int} shows offers from {string}", (world: BusinessWorld, lineNo: number, suppliers: string) => {
  const line = ((body(world).lines ?? []) as Line[]).find((l) => l.lineNo === lineNo);
  expect(line?.offers.map((o) => o.supplier).join(", ")).toBe(suppliers);
});

When("I open the profit of case {string}", async (world: BusinessWorld, caseId: string) => {
  const c = await caseNamed(world, caseId);
  await world.send("GET", `/case-profit/${c.id}`);
});

const profitAction = async (world: BusinessWorld, caseId: string, action: string, payload: Json = {}) => {
  const c = await caseNamed(world, caseId);
  await world.send("POST", `/case-profit/${c.id}/${action}`, payload);
};

When("I confirm the actual costs of case {string}", (world: BusinessWorld, caseId: string) =>
  profitAction(world, caseId, "actuals"),
);

When(
  "I record the customer's payment on case {string} with bank reference {string}",
  (world: BusinessWorld, caseId: string, reference: string) => profitAction(world, caseId, "receipt", { reference }),
);

When(
  "I record the credit note for claim {string} on case {string}",
  (world: BusinessWorld, ref: string, caseId: string) => profitAction(world, caseId, `claims/${ref}`),
);

When("I close case {string} as settled", (world: BusinessWorld, caseId: string) =>
  profitAction(world, caseId, "close"),
);

const checkNamed = (world: BusinessWorld, label: string) => {
  const check = ((body(world).checks ?? []) as Check[]).find((k) => k.label === label);
  if (!check) throw new Error(`There is no close check "${label}".`);
  return check;
};

Then("the close check {string} is done", (world: BusinessWorld, label: string) => {
  expect(checkNamed(world, label).ok).toBe(true);
});

Then("the close check {string} is open", (world: BusinessWorld, label: string) => {
  expect(checkNamed(world, label).ok).toBe(false);
});

Then("the case can be closed", (world: BusinessWorld) => {
  expect(body(world).canClose).toBe(true);
});

Then("the case cannot be closed", (world: BusinessWorld) => {
  expect(body(world).canClose).toBe(false);
});

const outcome = async (world: BusinessWorld, name: string, payload: Json) => {
  const o = await opportunity(world, name);
  await world.send("POST", `/growth/${o.id}/outcome`, payload);
};

When("I log the outcome {string} for {string}", (world: BusinessWorld, result: string, name: string) =>
  outcome(world, name, { result }),
);

When(
  "I log the outcome {string} for {string} and move it to {string}",
  (world: BusinessWorld, result: string, name: string, stage: string) => outcome(world, name, { result, stage }),
);

When(
  "I log the outcome {string} for {string} with the next step {string} on {string}",
  (world: BusinessWorld, result: string, name: string, nextStep: string, nextStepDue: string) =>
    outcome(world, name, { result, nextStep, nextStepDue, note: "Spoke to purchasing" }),
);

Then("there is an open sales task {string}", async (world: BusinessWorld, title: string) => {
  const found = await world.backend.engine.find({
    collection: "tasks",
    where: { and: [{ title: { equals: title } }, { status: { equals: "Open" } }] },
    limit: 0,
    depth: 0,
  });
  expect((found as { docs: unknown[] }).docs.length).toBe(1);
});

When("I look at the fleets", (world: BusinessWorld) => world.send("GET", "/growth"));

Then(
  "the fleet of {string} shows {int} vessels, {int} supplied",
  (world: BusinessWorld, company: string, count: number, supplied: number) => {
    const fleet = ((body(world).fleets ?? []) as { company: string; vessels: { supplied: boolean }[] }[]).find(
      (f) => f.company === company,
    );
    expect(fleet?.vessels.length).toBe(count);
    expect(fleet?.vessels.filter((v) => v.supplied).length).toBe(supplied);
  },
);

Then("the fleets do not show {string}", (world: BusinessWorld, company: string) => {
  const fleets = (body(world).fleets ?? []) as { company: string }[];
  expect(fleets.map((f) => f.company)).not.toContain(company);
});

When("I search the approvals for the type {string}", (world: BusinessWorld, type: string) =>
  world.send("GET", `/approvals?where[type][equals]=${encodeURIComponent(type)}&depth=0`),
);

Then("the search is refused", (world: BusinessWorld) => {
  expect(world.reply?.status).toBe(400);
});

Then("the search finds at least one approval", (world: BusinessWorld) => {
  expect(world.reply?.status).toBe(200);
  expect((world.reply!.body as { totalDocs: number }).totalDocs).toBeGreaterThan(0);
});
