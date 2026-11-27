import { expect } from "vite-plus/test";
import { collectionNamed, personNamed, Then, When, type BusinessWorld } from "test-runner/steps";

const cases = collectionNamed("cases");
const messages = collectionNamed("intake-messages");
const supplierRfqs = collectionNamed("supplier-rfqs");

const lineNumbers = (lines: string) => (lines.match(/\d+/g) ?? []).map(Number);

const inbox = async (world: BusinessWorld, subject: string, step: string, body?: unknown) => {
  const message = await world.record(messages, subject);
  await world.send("POST", `/inbox/${message.id}/${step}`, body);
};

const desk = async (world: BusinessWorld, caseId: string, step: string, body?: unknown) => {
  const c = await world.record(cases, caseId);
  await world.send(step ? "POST" : "GET", `/sourcing/cases/${c.id}${step}`, body);
};

const history = async (world: BusinessWorld, subject: string, decision: string) => {
  const item = await world.record(messages, subject);
  await world.send("POST", `/inbox-history/review/${item.id}`, { decision });
};

type Reply = {
  drafts?: { supplierName: string }[];
  skipped?: string[];
  canSeeCosts?: boolean;
  canSeePrices?: boolean;
  canApprove?: boolean;
  prices?: { price?: number }[];
  newSuppliers?: { prices: { price?: number }[] }[];
  review?: { id: string; decision: string }[];
};
const answer = (world: BusinessWorld) => (world.reply?.body ?? {}) as Reply;

When("I create a case from the message {string}", (world: BusinessWorld, subject: string) =>
  inbox(world, subject, "create-case"),
);

When("I read the message {string}", (world: BusinessWorld, subject: string) => inbox(world, subject, "extract"));

When("I match the message {string}", (world: BusinessWorld, subject: string) => inbox(world, subject, "match"));

When("I link the message {string} to case {string}", async (world: BusinessWorld, subject: string, caseId: string) => {
  const c = await world.record(cases, caseId);
  await inbox(world, subject, "review", { decision: "link", case: c.id });
});

When("I link the message {string} to its suggested case", (world: BusinessWorld, subject: string) =>
  inbox(world, subject, "review", { decision: "link" }),
);

When("I mark the message {string} as not related", (world: BusinessWorld, subject: string) =>
  inbox(world, subject, "review", { decision: "not-related" }),
);

When("I take back my review of the message {string}", (world: BusinessWorld, subject: string) =>
  inbox(world, subject, "reopen"),
);

When("I draft supplier RFQs for case {string} for {string}", (world: BusinessWorld, caseId: string, lines: string) =>
  desk(world, caseId, "/plan", { mode: "split", lineNos: lineNumbers(lines) }),
);

When(
  "I draft one full-list RFQ for case {string} for {string}",
  (world: BusinessWorld, caseId: string, lines: string) =>
    desk(world, caseId, "/plan", { mode: "full", lineNos: lineNumbers(lines) }),
);

When("I draft supplier RFQs for case {string} without picking a line", (world: BusinessWorld, caseId: string) =>
  desk(world, caseId, "/plan", { mode: "split", lineNos: [] }),
);

When("I remove the draft {string} from case {string}", (world: BusinessWorld, reference: string, caseId: string) =>
  desk(world, caseId, "/plan/remove", { reference }),
);

When("I put back the drafts of case {string}", (world: BusinessWorld, caseId: string) =>
  desk(world, caseId, "/plan/restore"),
);

When("I discard the drafts of case {string}", (world: BusinessWorld, caseId: string) =>
  desk(world, caseId, "/plan/discard"),
);

When("I send the supplier RFQs for case {string}", (world: BusinessWorld, caseId: string) =>
  desk(world, caseId, "/send"),
);

When("I open the supplier RFQs of case {string}", (world: BusinessWorld, caseId: string) => desk(world, caseId, ""));

When("supplier replies arrive for case {string}", async (world: BusinessWorld, caseId: string) => {
  const c = await world.record(cases, caseId);
  await world.send("POST", `/case-rfqs/${c.id}/simulate-replies`);
});

When("I remind the supplier on {string}", async (world: BusinessWorld, reference: string) => {
  const rfq = await world.record(supplierRfqs, reference);
  await world.send("POST", `/sourcing/rfqs/${rfq.id}/remind`);
});

When("I organise the inbox history", (world: BusinessWorld) => world.send("POST", "/inbox-history/organise"));

When("I open the inbox history", (world: BusinessWorld) => world.send("GET", "/inbox-history"));

When("I confirm the history item {string}", (world: BusinessWorld, subject: string) =>
  history(world, subject, "confirm"),
);

When("I reject the history item {string}", (world: BusinessWorld, subject: string) =>
  history(world, subject, "reject"),
);

When("I take back my decision on the history item {string}", (world: BusinessWorld, subject: string) =>
  history(world, subject, "reopen"),
);

When("I confirm every history item", async (world: BusinessWorld) => {
  await world.send("GET", "/inbox-history");
  const { review = [] } = answer(world);
  for (const item of review.filter((r) => !r.decision))
    await world.send("POST", `/inbox-history/review/${item.id}`, { decision: "confirm" });
});

When("I approve the history import", (world: BusinessWorld) => world.send("POST", "/inbox-history/approve"));

Then("the inbox shows {int} message(s) to review", async (world: BusinessWorld, count: number) => {
  await world.send("GET", "/inbox");
  const body = world.reply?.body as { stats?: { review?: number } } | undefined;
  expect(body?.stats?.review).toBe(count);
});

Then("the RFQ drafts go to {string}", (world: BusinessWorld, names: string) => {
  expect((answer(world).drafts ?? []).map((d) => d.supplierName).join(", ")).toBe(names);
});

Then("the drafts leave out {string}", (world: BusinessWorld, skipped: string) => {
  expect(answer(world).skipped).toContain(skipped);
});

Then("I see what new suppliers charge", (world: BusinessWorld) => {
  const { canSeeCosts, newSuppliers = [] } = answer(world);
  expect(canSeeCosts).toBe(true);
  expect(newSuppliers.flatMap((s) => s.prices).every((p) => typeof p.price === "number")).toBe(true);
});

Then("what new suppliers charge is hidden from me", (world: BusinessWorld) => {
  const { canSeeCosts, newSuppliers = [] } = answer(world);
  expect(canSeeCosts).toBe(false);
  expect(newSuppliers.flatMap((s) => s.prices).every((p) => p.price === undefined)).toBe(true);
});

Then("I {word} see the prices found in the history", (world: BusinessWorld, can: string) => {
  const { canSeePrices, prices = [] } = answer(world);
  expect(canSeePrices).toBe(can === "can");
  expect(prices.every((p) => (typeof p.price === "number") === (can === "can"))).toBe(true);
});

Then("I {word} approve the history import", (world: BusinessWorld, can: string) => {
  expect(answer(world).canApprove).toBe(can === "can");
});

Then(
  "the review reason for the message {string} says {string}",
  async (world: BusinessWorld, subject: string, reason: string) => {
    const message = await world.record(messages, subject);
    const basis = (message.match as { basis?: string } | undefined)?.basis ?? "";
    expect(basis.split("\n")).toContain(reason);
  },
);

Then("the case {string} keeps {int} supplier RFQ draft(s)", async (world: BusinessWorld, caseId: string, n: number) => {
  const c = await world.record(cases, caseId);
  const drafts = (c.rfqDrafts as { plan?: { drafts?: unknown[] } | null } | undefined)?.plan?.drafts ?? [];
  expect(drafts).toHaveLength(n);
});

When(
  "I sign in as {string} and open the supplier RFQs of case {string}",
  async (world: BusinessWorld, who: string, caseId: string) => {
    world.person = personNamed(who);
    await desk(world, caseId, "");
  },
);

Then("the case shows replies that just arrived", (world: BusinessWorld) => {
  expect((world.reply!.body as { arrivals: unknown[] }).arrivals.length).toBeGreaterThan(0);
});

Then("the case shows no replies just in", (world: BusinessWorld) => {
  expect((world.reply!.body as { arrivals: unknown[] }).arrivals).toEqual([]);
});
