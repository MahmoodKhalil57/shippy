import type { Doc } from "mock-runner/server";
import { expect } from "vite-plus/test";
import { collectionNamed, Given, Then, When, type BusinessWorld } from "test-runner/steps";

type Check = { lineNo: number; field: string; matches?: boolean; resolution?: string };
type Undo = { path: string; body: unknown };

const undos = new WeakMap<BusinessWorld, Undo[]>();

const idOf = (v: unknown): string =>
  v && typeof v === "object" ? idOf((v as { id: unknown }).id) : typeof v === "string" ? v : "";
const caseOf = async (world: BusinessWorld, number: string) => world.record(collectionNamed("cases"), number);
const customerPo = async (world: BusinessWorld, number: string) =>
  world.record(collectionNamed("customer-pos"), number);
const purchaseOrder = async (world: BusinessWorld, number: string) =>
  world.record(collectionNamed("purchase-orders"), number);
const delivery = async (world: BusinessWorld, number: string) => world.record(collectionNamed("deliveries"), number);
const invoice = async (world: BusinessWorld, number: string) => world.record(collectionNamed("invoices"), number);
const approval = async (world: BusinessWorld, title: string) => world.record(collectionNamed("approvals"), title);

const upload = async (world: BusinessWorld, alt: string) => {
  const doc = (await world.backend.engine.create({
    collection: "media",
    data: { alt },
    file: {
      data: new Blob(["%PDF-1.4"], { type: "application/pdf" }),
      name: `${alt}.pdf`,
      mimetype: "application/pdf",
    },
  })) as Doc;
  return doc.id;
};

const checkIndex = (po: Doc, lineNo: number, field: string) => {
  const i = ((po.checks as Check[] | undefined) ?? []).findIndex(
    (c) => c.lineNo === lineNo && c.field.toLowerCase() === field.toLowerCase(),
  );
  if (i < 0) throw new Error(`Customer PO ${String(po.number)} has no ${field} check on line ${lineNo}.`);
  return i;
};

const agree = async (
  world: BusinessWorld,
  number: string,
  lineNo: number,
  field: string,
  text: string,
  proof: boolean,
) => {
  const po = await customerPo(world, number);
  await world.send("POST", "/operations/po-amend", {
    po: po.id,
    index: checkIndex(po, lineNo, field),
    resolution: text,
    evidence: proof ? await upload(world, `${number} amendment`) : undefined,
  });
};

When("I read the customer PO for case {string}", async (world: BusinessWorld, number: string) => {
  const c = await caseOf(world, number);
  await world.send("POST", `/case-order/${c.id}/po-check`);
});

When("I confirm the sales order for case {string}", async (world: BusinessWorld, number: string) => {
  const c = await caseOf(world, number);
  await world.send("POST", `/case-order/${c.id}/confirm-order`);
});

When(
  "I record the customer's agreement on customer PO {string} line {int} {string} as {string} with their written confirmation",
  (world: BusinessWorld, number: string, lineNo: number, field: string, text: string) =>
    agree(world, number, lineNo, field, text, true),
);

When(
  "I record the customer's agreement on customer PO {string} line {int} {string} as {string} without their written confirmation",
  (world: BusinessWorld, number: string, lineNo: number, field: string, text: string) =>
    agree(world, number, lineNo, field, text, false),
);

Given("every mismatch on customer PO {string} is agreed in writing", async (world: BusinessWorld, number: string) => {
  const po = await customerPo(world, number);
  const open = ((po.checks as Check[] | undefined) ?? []).filter((c) => !c.matches && !c.resolution);
  for (const c of open) await agree(world, number, c.lineNo, c.field, "Agreed by the customer by email", true);
});

const award = async (world: BusinessWorld, number: string, lineNo: number, outcome: string, reason?: string) => {
  const po = await customerPo(world, number);
  const r = await world.send("POST", "/operations/po-award", { po: po.id, lineNo, outcome, reason });
  const undo = (r.body as { undo?: Undo } | null)?.undo;
  if (undo) undos.set(world, [...(undos.get(world) ?? []), undo]);
};

When(
  "I keep line {int} of customer PO {string} open for a revision",
  (world: BusinessWorld, lineNo: number, n: string) =>
    award(world, n, lineNo, "Open — revision to follow", "Revision to follow"),
);

When("I close line {int} of customer PO {string}", (world: BusinessWorld, lineNo: number, n: string) =>
  award(world, n, lineNo, "Closed"),
);

When(
  "I close line {int} of customer PO {string} because {string}",
  (world: BusinessWorld, lineNo: number, n: string, reason: string) => award(world, n, lineNo, "Closed", reason),
);

const takeBack = async (world: BusinessWorld, pick: (list: Undo[]) => Undo | undefined) => {
  const undo = pick(undos.get(world) ?? []);
  if (!undo) throw new Error("No line decision to take back.");
  await world.send("POST", undo.path, undo.body);
};

When("I take back that line decision", (world: BusinessWorld) => takeBack(world, (list) => list.at(-1)));

When("I take back the first line decision", (world: BusinessWorld) => takeBack(world, (list) => list[0]));

When("I re-check purchase order {string} with the supplier", async (world: BusinessWorld, number: string) => {
  const po = await purchaseOrder(world, number);
  await world.send("POST", "/operations/po-recheck", { po: po.id });
});

const confirmPo = async (world: BusinessWorld, number: string, extra: Record<string, unknown> = {}) => {
  const po = await purchaseOrder(world, number);
  await world.send("POST", "/operations/po-confirm", { po: po.id, ...extra });
};

When("I confirm purchase order {string} to the supplier", (world: BusinessWorld, number: string) =>
  confirmPo(world, number),
);

When(
  "I confirm purchase order {string} to the supplier, saying the re-check is done",
  (world: BusinessWorld, number: string) => confirmPo(world, number, { recheckDone: true }),
);

When(
  "I edit purchase order {string} to confirmed and tick re-check completed",
  async (world: BusinessWorld, number: string) => {
    const po = await purchaseOrder(world, number);
    await world.send("PATCH", `/purchase-orders/${po.id}`, { status: "Confirmed", recheckDone: true });
  },
);

When("I ask management to approve purchase order {string}", async (world: BusinessWorld, number: string) => {
  const po = await purchaseOrder(world, number);
  await world.send("POST", `/case-order/${idOf(po.case)}/ask-approval`, { po: po.id });
});

When("I apply the agent's ETA update to case {string}", async (world: BusinessWorld, number: string) => {
  const c = await caseOf(world, number);
  await world.send("POST", `/case-delivery/${c.id}/eta`);
});

const confirm = async (world: BusinessWorld, number: string, signedBy: string, proof: boolean, shortages?: string) => {
  const d = await delivery(world, number);
  await world.send("POST", "/operations/confirm-delivery", {
    delivery: d.id,
    signedBy,
    shortages,
    proof: proof ? await upload(world, `${number} signed`) : undefined,
  });
};

When(
  "I confirm delivery {string} signed by {string} with the signed delivery note",
  (world: BusinessWorld, number: string, signedBy: string) => confirm(world, number, signedBy, true),
);

When(
  "I confirm delivery {string} signed by {string} with the signed delivery note, noting {string}",
  (world: BusinessWorld, number: string, signedBy: string, shortages: string) =>
    confirm(world, number, signedBy, true, shortages),
);

When(
  "I confirm delivery {string} signed by {string} without the signed delivery note",
  (world: BusinessWorld, number: string, signedBy: string) => confirm(world, number, signedBy, false),
);

When(
  "I confirm delivery {string} with the signed delivery note but no signer",
  (world: BusinessWorld, number: string) => confirm(world, number, "", true),
);

When("I invoice delivery {string}", async (world: BusinessWorld, number: string) => {
  const d = await delivery(world, number);
  await world.send("POST", `/case-delivery/${idOf(d.case)}/invoice`, { delivery: d.id });
});

When("I submit invoice {string} to the tax authority", async (world: BusinessWorld, number: string) => {
  const inv = await invoice(world, number);
  await world.send("POST", "/cash/einvoice", { invoice: inv.id });
});

When(
  "I submit invoice {string} to the tax authority with buyer tax ID {string}",
  async (world: BusinessWorld, number: string, taxId: string) => {
    const inv = await invoice(world, number);
    await world.send("POST", "/cash/einvoice", { invoice: inv.id, taxId });
  },
);

When(
  "I record a customer payment of {float} against invoice {string}",
  async (world: BusinessWorld, amount: number, number: string) => {
    const inv = await invoice(world, number);
    await world.send("POST", "/cash/payment", { invoice: inv.id, amount, reference: "TRX-90001" });
  },
);

When("I match a remittance naming invoices {string}", (world: BusinessWorld, invoices: string) =>
  world.send("POST", "/cash/match", { invoices }),
);

When("I match a remittance for the amount {float}", (world: BusinessWorld, amount: number) =>
  world.send("POST", "/cash/match", { amount }),
);

When("I send the collection reminder for invoice {string}", async (world: BusinessWorld, number: string) => {
  const inv = await invoice(world, number);
  await world.send("POST", "/cash/reminder", { invoice: inv.id });
});

When("I open the supplier payables", (world: BusinessWorld) => world.send("GET", "/cash/payables"));

When("I request payment approval for purchase order {string}", async (world: BusinessWorld, number: string) => {
  const po = await purchaseOrder(world, number);
  await world.send("POST", "/cash/request-approval", { payable: po.id });
});

const decide = async (world: BusinessWorld, title: string, decision: string, extra: Record<string, unknown> = {}) => {
  const a = await approval(world, title);
  await world.send("POST", "/cash/decide", { approval: a.id, decision, ...extra });
};

When("I approve {string}", (world: BusinessWorld, title: string) => decide(world, title, "Approve"));

When("I approve {string} after calling back on the number on file", (world: BusinessWorld, title: string) =>
  decide(world, title, "Approve", { callBack: true }),
);

When("I reject {string}", (world: BusinessWorld, title: string) => decide(world, title, "Reject"));

When("I reject {string} because {string}", (world: BusinessWorld, title: string, reason: string) =>
  decide(world, title, "Reject", { reason }),
);

When(
  "I record the payment for {string} with bank reference {string}",
  async (world: BusinessWorld, title: string, reference: string) => {
    const a = await approval(world, title);
    await world.send("POST", "/cash/record-payment", { approval: a.id, reference });
  },
);

When("I apply the approved bank details from {string}", async (world: BusinessWorld, title: string) => {
  const a = await approval(world, title);
  await world.send("POST", "/cash/apply-bank", { approval: a.id });
});

When("I book the incoming supplier bill {string}", async (world: BusinessWorld, number: string) => {
  const bill = await world.record(collectionNamed("supplier-bills"), number);
  await world.send("POST", "/case-order/book-bill", { bill: bill.id });
});

When("I open the order page of case {string}", async (world: BusinessWorld, number: string) => {
  const c = await caseOf(world, number);
  await world.send("GET", `/operations/case/${c.id}`);
});

When("I open the cash page", (world: BusinessWorld) => world.send("GET", "/operations/cash"));

When("I open the service usage", (world: BusinessWorld) => world.send("GET", "/usage"));

type Ops = {
  canSeeCosts: boolean;
  lines: { lineNo: number; sources?: unknown[] }[];
  bills: unknown[];
  deliveries: { number: string; invoice: string | null }[];
  backorders: { lineNo: number; followsIn: string | null; late: boolean }[];
};
const ops = (world: BusinessWorld) => world.reply?.body as Ops;

Then("I see the supplier costs and bills", (world: BusinessWorld) => {
  expect(ops(world).canSeeCosts).toBe(true);
  expect(ops(world).lines.some((l) => l.sources?.length)).toBe(true);
  expect(ops(world).bills.length).toBeGreaterThan(0);
});

Then("I see no supplier costs or bills", (world: BusinessWorld) => {
  expect(ops(world).canSeeCosts).toBe(false);
  expect(ops(world).lines.some((l) => l.sources)).toBe(false);
  expect(ops(world).bills).toEqual([]);
});

Then("delivery {string} shows invoice {string}", (world: BusinessWorld, number: string, inv: string) => {
  expect(ops(world).deliveries.find((d) => d.number === number)?.invoice).toBe(inv);
});

Then("delivery {string} shows no invoice", (world: BusinessWorld, number: string) => {
  expect(ops(world).deliveries.find((d) => d.number === number)?.invoice).toBeNull();
});

Then(
  "line {int} is on backorder for delivery {string}, {string}",
  (world: BusinessWorld, lineNo: number, number: string, timing: string) => {
    const b = ops(world).backorders.find((x) => x.lineNo === lineNo);
    expect(b?.followsIn).toBe(number);
    expect(b?.late ? "arriving too late" : "in time").toBe(timing);
  },
);

type CashView = { receivables: { number: string }[]; canSeePayables: boolean; cashOut: number[] };
const cashView = (world: BusinessWorld) => world.reply?.body as CashView;

Then("invoice {string} is on the receivables list", (world: BusinessWorld, number: string) => {
  expect(cashView(world).receivables.map((r) => r.number)).toContain(number);
});

Then("invoice {string} is not on the receivables list", (world: BusinessWorld, number: string) => {
  expect(cashView(world).receivables.map((r) => r.number)).not.toContain(number);
});

Then("I see the money going out to suppliers", (world: BusinessWorld) => {
  expect(cashView(world).canSeePayables).toBe(true);
  expect(cashView(world).cashOut.length).toBe(8);
});

Then("I see only the money coming in", (world: BusinessWorld) => {
  expect(cashView(world).canSeePayables).toBe(false);
  expect(cashView(world).cashOut).toEqual([]);
});

type Usage = { measured: { documents: number; hoursSaved: number; minutesPerDocument: number } };

Then("each document read counts as {int} minutes of typing saved", (world: BusinessWorld, minutes: number) => {
  const u = (world.reply!.body as Usage).measured;
  expect(u.minutesPerDocument).toBe(minutes);
  expect(u.hoursSaved).toBe(Math.round((u.documents * minutes) / 60));
});

type Unawarded = { lineNo: number; outcome?: string; reason?: string };
const lineDecision = async (world: BusinessWorld, number: string, lineNo: number) =>
  ((await customerPo(world, number)).unawarded as Unawarded[] | undefined)?.find((u) => u.lineNo === lineNo);

Then(
  "line {int} of customer PO {string} is {string}",
  async (world: BusinessWorld, lineNo: number, number: string, outcome: string) => {
    expect((await lineDecision(world, number, lineNo))?.outcome).toBe(outcome);
  },
);

Then(
  "line {int} of customer PO {string} is {string} because {string}",
  async (world: BusinessWorld, lineNo: number, number: string, outcome: string, reason: string) => {
    const u = await lineDecision(world, number, lineNo);
    expect([u?.outcome, u?.reason]).toEqual([outcome, reason]);
  },
);

Then(
  "line {int} of customer PO {string} is undecided",
  async (world: BusinessWorld, lineNo: number, number: string) => {
    expect(await lineDecision(world, number, lineNo)).toBeUndefined();
  },
);

Then("customer PO {string} is {string}", async (world: BusinessWorld, number: string, status: string) => {
  expect((await customerPo(world, number)).status).toBe(status);
});

Then("customer PO {string} has {int} open mismatch(es)", async (world: BusinessWorld, number: string, open: number) => {
  expect((await customerPo(world, number)).openMismatches).toBe(open);
});
