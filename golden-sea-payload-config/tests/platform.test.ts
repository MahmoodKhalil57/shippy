import { stringify } from "qs-esm";
import type { CollectionSettings } from "saastemlycrm-design-system/contracts";
import { matches } from "saastemlycrm-design-system/payload";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { Cases } from "../src/collections/cases.ts";
import type { Field } from "payload";
import { IntegrationExceptions } from "../src/collections/work.ts";
import { inOfficeHours } from "../src/endpoints/platform.ts";
import { AutomationRules, Integrations, OnCallRoster, Settings } from "../src/globals/index.ts";
import { automationsPage } from "../src/pages/automations.ts";
import { integrationsPage } from "../src/pages/integrations.ts";
import { rolesPage } from "../src/pages/roles.ts";
import { autoResolvedExceptions, openExceptions } from "../src/queries/automations.ts";
import { backend, call, login } from "./backend.ts";
import { rowActionsOn } from "./collection-actions.ts";

type Json = Record<string, any>; // oxlint-disable-line typescript/no-explicit-any

/** A field of a global by name, through its rows and tabs. */
function fieldOf(fields: Field[], name: string): Json {
  for (const f of fields as Json[]) {
    if (f.name === name) return f;
    const inner = [...(f.fields ?? []), ...(f.tabs ?? []).flatMap((t: Json) => t.fields)];
    const found = inner.length ? fieldOf(inner, name) : undefined;
    if (found) return found;
  }
  return undefined as never;
}
/** A value's tone as the dashboard reads it: its field's first `toneWhen` that holds, else its select's tone. */
const toneOf = (f: Json, row: Json): string | undefined =>
  f.custom?.toneWhen?.find((r: { when: never }) => matches(row, r.when))?.tone ?? f.custom?.tones?.[row[f.name]];
/** The records widget of a page with this title. */
const recordsOf = (page: { clientProps: { page: { widgets: Json[] } } }, title: string) =>
  page.clientProps.page.widgets.find((w) => w.title === title)!.records;

/** Platform & trust: case overview and handover, automations, roles & on-call, integrations, delivery plan. */

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
});

describe("case overview", () => {
  it("places the case on the 16-step lifecycle and counts lines without showing them complete", async () => {
    const { status, body } = await call("GET", "/api/case-overview/gs-rfq-0142");
    expect(status).toBe(200);
    expect(body.steps).toHaveLength(16);
    expect(body.steps[body.current].label).toBe("Compare");
    expect(body.lines).toMatchObject({ total: 6, ready: 3, waiting: 2, blocked: 1, noOffer: 0 });
    expect(body.fulfilment.started).toBe(false);
    expect(body.customer.contactRule).toBe("one-follow-up");
    expect(body.clarifications.filter((q: { open: boolean }) => q.open)).toHaveLength(1);
    expect(body.timeline[0].at >= body.timeline[body.timeline.length - 1].at).toBe(true);
  });

  it("reads what the case says on its own from the case: due date, contact rule, line progress", async () => {
    const c = (await call("GET", "/api/cases/gs-rfq-0142?depth=1")).body;
    // Due 18 Nov 14:00, the demo's day is 17 Nov.
    expect(c).toMatchObject({
      value: 7480,
      due: "tomorrow 14:00",
      customer: { contactRule: "one-follow-up", contactNote: expect.stringMatching(/^One customer follow-up/) },
      lineCount: { total: 6, ready: 3, waiting: 2, blocked: 1, noOffer: 0, readyPct: 50 },
      lineNote: "of 6 · 1 blocked",
      vesselPort: expect.stringContaining(" · "),
    });
    // Each line's AI read as a share, each open question "Waiting".
    expect(
      c.items.every(
        (l: { confidence?: number; aiRead?: number }) =>
          l.confidence === undefined || l.aiRead === Math.round(l.confidence * 100),
      ),
    ).toBe(true);
    expect(c.clarifications.filter((q: { reply: string }) => q.reply === "Waiting")).toHaveLength(1);
    // Virtual: never stored, so never in a query.
    expect((await call("GET", "/api/cases?where[due][equals]=tomorrow%2014:00&depth=0")).body.docs).toHaveLength(0);
  });

  it("says on the case's fields what a value means: red when overdue or blocked, the lines' bar", async () => {
    const field = (name: string) => (Cases.fields as never as Record<string, any>[]).find((f) => f.name === name)!; // oxlint-disable-line typescript/no-explicit-any
    const toneOf = (name: string, doc: Record<string, unknown>) =>
      field(name).custom.toneWhen.find((r: { when: never }) => matches(doc, r.when))?.tone;
    expect(toneOf("due", { deadline: "2026-11-16T12:00:00.000Z" })).toBe("error");
    expect(toneOf("due", { deadline: "2026-11-18T14:00:00.000Z" })).toBeUndefined();
    const ready = field("lineCount").fields.find((f: { name: string }) => f.name === "ready");
    expect(ready.custom.gauge).toEqual({ max: "lineCount.total" });
    expect(
      ready.custom.toneWhen.find((r: { when: never }) => matches({ lineCount: { blocked: 1 } }, r.when)).tone,
    ).toBe("warning");
    expect(
      ready.custom.toneWhen.find((r: { when: never }) => matches({ lineCount: { blocked: 0 } }, r.when)).tone,
    ).toBe("success");
  });

  it("offers Reassign on the case to the desk, management, owner or backup", async () => {
    const reassign = (Cases.custom as CollectionSettings).actions!.find((a) => a.label === "Reassign")!;
    const read = async (user: string) => {
      await login(user);
      return (await call("GET", "/api/cases/gs-rfq-0142?depth=1")).body;
    };
    const ky = await read("karim.youssef");
    expect(ky.canReassign).toBe(true);
    expect(matches(ky, reassign.when as never)).toBe(true);
    // Hand over to: the desk without the owner, the backup marked.
    const team = ky.handoverTeam as { label: string; value: string }[];
    expect(team.some((p) => p.value === ky.owner.id)).toBe(false);
    expect(team.length).toBeGreaterThan(1);
    expect(reassign.call!.path).toBe("/case-overview/$row.id/reassign");
    expect(reassign.prefill!.call.path).toBe("/case-overview/$row.id/handover");
    const mh = await read("mohamed.helmy");
    expect(mh.canReassign).toBe(false);
    expect(matches(mh, reassign.when as never)).toBe(false);
  });

  it("counts a short receipt and an undelivered drop as not done", async () => {
    const { body } = await call("GET", "/api/case-overview/gs-rfq-0133");
    expect(body.steps[body.current].label).toBe("Deliver");
    // Lines arrived short and the first drop isn't confirmed yet: nothing reads as done.
    expect(body.fulfilment).toMatchObject({ started: true, delivered: 0 });
    expect(body.fulfilment.received).toBeLessThan(body.fulfilment.ordered);
    expect(body.fulfilment.notes.join(" ")).toMatch(/short/);
  });

  it("never gives Sales the case value", async () => {
    await login("soaad.amer");
    const { body } = await call("GET", "/api/cases/gs-rfq-0142?depth=0");
    expect(body.caseId).toBe("GS-RFQ-0142");
    expect(body.value).toBeUndefined();
  });

  it("drafts a handover and reassigns with a note, moving open tasks and notifying the new owner", async () => {
    const draft = await call("POST", "/api/case-overview/gs-rfq-0142/handover", { to: "sa" });
    expect(draft.body.draft).toMatch(/GS-RFQ-0142/);
    expect(draft.body.draft).toMatch(/size breakdown/);
    expect((await call("POST", "/api/case-overview/gs-rfq-0142/reassign", { to: "sa", note: "" })).status).toBe(400);
    const { body } = await call("POST", "/api/case-overview/gs-rfq-0142/reassign", {
      to: "sa",
      note: draft.body.draft,
    });
    expect(body.movedTasks).toBe(3);
    const c = (await call("GET", "/api/cases/gs-rfq-0142?depth=0")).body;
    expect(c).toMatchObject({ owner: "sa", backup: "ky" });
    const acts = (await call("GET", "/api/activities?where[case][equals]=gs-rfq-0142&limit=0&depth=0")).body.docs;
    expect(acts.some((a: { text: string }) => a.text.startsWith("Reassigned to Soaad Amer"))).toBe(true);
    await login("soaad.amer");
    const n = (await call("GET", "/api/notifications?limit=0")).body.docs;
    expect(n.some((x: { title: string }) => x.title === "You now own GS-RFQ-0142")).toBe(true);
  });

  it("lets only the desk, management, owner or backup reassign", async () => {
    await login("mohamed.helmy");
    expect((await call("POST", "/api/case-overview/gs-rfq-0142/reassign", { to: "sa", note: "x" })).status).toBe(403);
  });
});

describe("automations", () => {
  it("serves what spans the rules and the collections: the review queue and its figures", async () => {
    const { body } = await call("GET", "/api/automations");
    expect(body.review.some((r: { id: string }) => r.id === "gs-rfq-0142#6")).toBe(true);
    expect(body.review.some((r: { id: string }) => r.id === "ex-ai-polarbay")).toBe(true);
    const rules = (await call("GET", "/api/globals/automation-rules")).body.rules as Json[];
    expect(body.stats).toEqual({
      rules: rules.length,
      enabled: rules.filter((r) => r.enabled !== false).length,
      ai: rules.filter((r) => r.usesAI).length,
      review: body.review.length,
    });
    // The registry and the queue are records of the global and the collection, not the endpoint's.
    expect(body.rules).toBeUndefined();
    expect(body.exceptions).toBeUndefined();
    expect(recordsOf(automationsPage, "Rule registry")).toMatchObject({ global: "automation-rules", field: "rules" });
    expect(recordsOf(automationsPage, "Exception queue")).toMatchObject({ collection: "integration-exceptions" });
    // Every exception fits the queue.
    const all = (await call("GET", "/api/integration-exceptions?limit=0&depth=0")).body.totalDocs;
    expect(all).toBeLessThanOrEqual(recordsOf(automationsPage, "Exception queue").limit);
  });

  it("reads the rule registry from the global: each rule's state, mode and AI review, with its switch", async () => {
    const rules = (await call("GET", "/api/globals/automation-rules")).body.rules as Json[];
    expect(rules.length).toBeGreaterThan(15);
    for (const r of rules) expect(r).toMatchObject({ trigger: expect.any(String), action: expect.any(String) });
    const create = rules.find((r) => r.name === "Create case from RFQ email")!;
    expect(create).toMatchObject({ state: "On", aiReview: "AI-assisted · review below 85%" });
    const field = (name: string) => fieldOf(AutomationRules.fields, name);
    expect(toneOf(field("mode"), create)).toBe("success");
    expect(toneOf(field("state"), create)).toBe("success");
    // Management pauses or enables a rule (the array's own actions); everyone else reads.
    const array = fieldOf(AutomationRules.fields, "rules");
    expect(rowActionsOn(array, create, "supply-chain", {})).toEqual([]);
    const [pause] = rowActionsOn(array, create, "management", {});
    expect(pause).toMatchObject({
      label: "Pause",
      call: { path: "/automations/rule", body: { id: create.id, value: false } },
    });
    expect((await call("POST", "/api/automations/rule", pause!.call!.body)).status).toBe(403);
    await login("karim.balbaa");
    const r = await call("POST", "/api/automations/rule", pause!.call!.body);
    expect(r.body.undo).toEqual({ path: "/automations/rule", body: { id: create.id, value: true } });
    const read = async () =>
      ((await call("GET", "/api/globals/automation-rules")).body.rules as Json[]).find((x) => x.id === create.id)!;
    const paused = await read();
    expect(paused).toMatchObject({ enabled: false, state: "Paused" });
    expect(rowActionsOn(array, paused, "management", {}).map((a) => a.label)).toEqual(["Enable"]);
    // Undo: the same call with the value it had.
    await call("POST", "/api/automations/rule", r.body.undo.body);
    expect((await read()).state).toBe("On");
  });

  it("counts the exception queue and reads the audit log from their collections (the page's data widgets)", async () => {
    const count = async (where: Record<string, unknown>) =>
      (await call("GET", `/api/integration-exceptions?${stringify({ where, limit: 0 })}`)).body.totalDocs;
    expect(await count(openExceptions)).toBe(2);
    expect(await count(autoResolvedExceptions)).toBeGreaterThan(0);
    // The audit log: every activity, latest first, as the signed-in user reads them.
    const log = (await call("GET", "/api/activities?sort=-at&limit=40&depth=1")).body.docs as { at: string }[];
    expect(log.length).toBeGreaterThan(10);
    expect(log.every((a, i) => i === 0 || log[i - 1]!.at >= a.at)).toBe(true);
  });

  it("retries safely: the mailbox reconnects once, and a second retry changes nothing", async () => {
    const first = await call("POST", "/api/automations/retry/ex-outlook");
    expect(first.body).toMatchObject({ alreadyDone: false });
    expect(first.body.message).toMatch(/12 imported/);
    const x = (await call("GET", "/api/integration-exceptions/ex-outlook")).body;
    expect(x).toMatchObject({ status: "Resolved", retries: 4 });
    const g = (await call("GET", "/api/globals/integrations")).body;
    const mailbox = g.connections.find((c: { account: string }) => c.account === "purchasing@");
    expect(mailbox).toMatchObject({ status: "Connected", emailsImported: 1324 });
    const second = await call("POST", "/api/automations/retry/ex-outlook");
    expect(second.body.alreadyDone).toBe(true);
    const again = (await call("GET", "/api/globals/integrations")).body;
    expect(again.connections.find((c: { account: string }) => c.account === "purchasing@").emailsImported).toBe(1324);
    const audit = (await call("GET", "/api/activities?where[rule][equals]=Safe retry&limit=0")).body;
    expect(audit.totalDocs).toBe(1);
  });

  it("offers each exception its own action, wherever exceptions show, calling the queue's endpoints", async () => {
    const actions = (IntegrationExceptions.custom as CollectionSettings).actions!;
    const docs = (await call("GET", "/api/integration-exceptions?limit=0&depth=0")).body.docs as Record<
      string,
      unknown
    >[];
    const offered = (x: Record<string, unknown>) =>
      actions.filter((a) => matches(x, a.when as never)).map((a) => a.label);
    const want: Record<string, string[]> = {
      Open: ["Safe retry"],
      "Waiting for review": ["Mark reviewed"],
      Resolved: ["Retry again"],
      "Auto-resolved": ["Retry again"],
      Ignored: ["Retry again"],
    };
    expect(docs.length).toBeGreaterThan(2);
    for (const x of docs) expect(offered(x), String(x.id)).toEqual(want[String(x.status)]);
    const by = (label: string) => actions.find((a) => a.label === label)!;
    expect(by("Safe retry")).toMatchObject({ call: { path: "/automations/retry/$row.id" }, reply: true });
    expect(by("Retry again")).toMatchObject({ call: { path: "/automations/retry/$row.id" }, reply: true });
    expect(by("Mark reviewed")).toMatchObject({ call: { path: "/automations/review/$row.id" } });
    expect(by("Mark reviewed").confirm).toBeTruthy();
    // The paths answer as the queue's buttons did.
    expect((await call("POST", "/api/automations/retry/ex-outlook")).status).toBe(200);
    expect((await call("POST", "/api/automations/review/ex-ai-polarbay", {})).status).toBe(200);
  });

  it("resolves a review item with a person's name on it", async () => {
    await call("POST", "/api/automations/review/ex-ai-polarbay", {});
    const x = (await call("GET", "/api/integration-exceptions/ex-ai-polarbay?depth=0")).body;
    expect(x).toMatchObject({ status: "Resolved", resolvedBy: "ky" });
  });
});

describe("roles & on-call", () => {
  it("knows office hours in Cairo (Sun–Thu 08:00–17:00)", () => {
    expect(inOfficeHours(new Date("2026-11-17T09:30:00.000Z"))).toBe(true); // Tue 11:30
    expect(inOfficeHours(new Date("2026-11-17T19:40:00.000Z"))).toBe(false); // Tue 21:40
    expect(inOfficeHours(new Date("2026-11-20T08:00:00.000Z"))).toBe(false); // Fri 10:00
    expect(inOfficeHours(new Date("2026-11-22T06:30:00.000Z"))).toBe(true); // Sun 08:30
  });

  it("routes urgent RFQs after hours to the on-duty person, and notifies them when simulated", async () => {
    const day = (await call("POST", "/api/on-call/route", { at: "2026-11-17T09:30:00.000Z" })).body;
    expect(day).toMatchObject({ inHours: true, routedTo: null });
    const night = (await call("POST", "/api/on-call/route", { at: "2026-11-17T19:40:00.000Z", simulate: true })).body;
    expect(night).toMatchObject({ inHours: false, routedTo: { id: "ky" }, backup: { id: "ah" } });
    const friday = (await call("POST", "/api/on-call/route", { at: "2026-11-20T08:00:00.000Z" })).body;
    expect(friday.routedTo.id).toBe("ky");
    const n = (await call("GET", "/api/notifications?limit=0")).body.docs;
    expect(n.some((x: { kind: string; title: string }) => x.kind === "Alert" && /on call/.test(x.title))).toBe(true);
  });

  it("serves where each permission is enforced, with live checks that pass", async () => {
    const { body } = await call("GET", "/api/roles");
    expect(body.permissions).toHaveLength(8);
    expect(body.checks.every((c: { pass: boolean }) => c.pass)).toBe(true);
  });

  it("reads the matrix from the settings global: the people in each role, what's granted in green", async () => {
    const matrix = recordsOf(rolesPage, "Permissions matrix");
    expect(matrix).toMatchObject({ global: "settings", field: "permissions" });
    const rows = (await call("GET", "/api/globals/settings")).body.permissions as Json[];
    expect(matrix.columns.slice(2)).toEqual(Object.keys(rows[0]!).filter((k) => typeof rows[0]![k] === "boolean"));
    const sales = rows.find((r) => r.role === "sales")!;
    expect(sales).toMatchObject({ supplierCosts: false, margins: false, people: "Soaad Amer" });
    expect(rows.find((r) => r.role === "office-admin")!.people).toBe("Esraa Mohamed, Nancy Elsobhy");
    expect(rows.find((r) => r.role === "system")!.people).toBe("System account");
    expect(toneOf(fieldOf(Settings.fields, "clientInfo"), sales)).toBe("success");
    expect(toneOf(fieldOf(Settings.fields, "margins"), sales)).toBeUndefined();
  });

  it("lets only management edit a role's permissions, logged, with an Undo", async () => {
    const array = fieldOf(Settings.fields, "permissions");
    const sales = ((await call("GET", "/api/globals/settings")).body.permissions as Json[]).find(
      (r) => r.role === "sales",
    )!;
    expect(rowActionsOn(array, sales, "supply-chain", {})).toEqual([]);
    const [edit] = rowActionsOn(array, sales, "management", {});
    expect(edit!.call).toEqual({ path: "/roles/permission", body: { role: "sales" } });
    // The form starts from the row's own values.
    expect(Object.fromEntries(edit!.fields!.map((f) => [f.name, f.defaultValue]))).toMatchObject({
      clientInfo: true,
      margins: false,
    });
    expect((await call("POST", "/api/roles/permission", { role: "sales", margins: true })).status).toBe(403);
    expect((await call("POST", "/api/globals/settings", { permissions: [] })).status).toBe(403);
    await login("karim.balbaa");
    const r = await call("POST", "/api/roles/permission", { role: "sales", margins: true });
    expect(r.body.undo).toEqual({ path: "/roles/permission", body: { role: "sales", margins: false } });
    const read = async () =>
      ((await call("GET", "/api/globals/settings")).body.permissions as Json[]).find((x) => x.role === "sales")!;
    expect((await read()).margins).toBe(true);
    await call("POST", "/api/roles/permission", r.body.undo.body);
    expect((await read()).margins).toBe(false);
    const log = (await call("GET", "/api/activities?where[entity][equals]=globals/settings&limit=0")).body;
    expect(log.totalDocs).toBe(2);
  });

  it("reads the on-call roster from its global: each shift in Cairo time, edited by management and the office manager", async () => {
    expect(recordsOf(rolesPage, "On-call roster")).toMatchObject({ global: "on-call-roster", field: "shifts" });
    const shifts = (await call("GET", "/api/globals/on-call-roster?depth=1")).body.shifts as Json[];
    expect(shifts).toHaveLength(6);
    // Tue 17 Nov 17:00 → Wed 18 Nov 08:00 Cairo; at the demo's 11:30 no shift is on (office hours).
    expect(shifts[1]!.shift).toBe("Tue 17 Nov, 17:00 → Wed 18 Nov, 08:00");
    expect(shifts.every((x) => x.now === false)).toBe(true);
    expect(toneOf(fieldOf(OnCallRoster.fields, "shift"), { ...shifts[1], now: true })).toBe("primary");
    const array = fieldOf(OnCallRoster.fields, "shifts");
    expect(rowActionsOn(array, shifts[1]!, "sales", {})).toEqual([]);
    const [edit] = rowActionsOn(array, shifts[1]!, "office-admin", {});
    expect(edit!.call).toEqual({ path: "/roles/roster", body: { id: shifts[1]!.id } });
    expect(edit!.fields!.map((f) => [f.name, f.defaultValue])).toEqual([
      ["user", "ky"],
      ["backup", "ah"],
    ]);
    expect((await call("POST", "/api/roles/roster", { id: shifts[1]!.id, user: "sa" })).status).toBe(403);
    await login("esraa.mohamed");
    const r = await call("POST", "/api/roles/roster", { id: shifts[1]!.id, user: "sa", backup: "ky" });
    expect(r.body.undo).toEqual({ path: "/roles/roster", body: { id: shifts[1]!.id, user: "ky", backup: "ah" } });
    // Whoever is on duty then is who an urgent RFQ at that time goes to.
    const night = (await call("GET", "/api/on-call/route?at=2026-11-17T19:40:00.000Z")).body;
    expect(night).toMatchObject({ routedTo: { id: "sa" }, backup: { id: "ky" } });
    await call("POST", "/api/roles/roster", r.body.undo.body);
    expect((await call("GET", "/api/on-call/route?at=2026-11-17T19:40:00.000Z")).body.routedTo.id).toBe("ky");
  });
});

describe("integrations", () => {
  it("renders the acknowledgement in English and Arabic", async () => {
    const { body } = await call("GET", "/api/integrations/status");
    expect(body.ack.en.subject).toContain("GS-RFQ-0142");
    expect(body.ack.ar.body).toContain("جولدن سي");
    expect(body.ack.en.body).not.toMatch(/\{\{/);
    expect(body.language).toEqual({ default: "en", documents: ["en", "ar"] });
    // The connections, the import and the backups are the global's own, read by the page.
    expect(body.connections).toBeUndefined();
  });

  it("offers Reconnect on an expired mailbox to those who may, which imports the waiting mail through the safe retry", async () => {
    const g = (await call("GET", "/api/globals/integrations")).body;
    const array = fieldOf(Integrations.fields, "mailboxes");
    const mailbox = (g.mailboxes as Json[]).find((c) => c.account === "purchasing@")!;
    expect(rowActionsOn(array, mailbox, "supply-chain", g)).toEqual([]);
    const [reconnect] = rowActionsOn(array, mailbox, "operations", g);
    expect(reconnect).toMatchObject({
      label: "Reconnect",
      call: { path: "/integrations/reconnect", body: { id: mailbox.id } },
      confirm: { heading: "Reconnect purchasing@", text: expect.stringContaining("Microsoft 365") },
    });
    // A connected mailbox has nothing to reconnect.
    const sales = (g.mailboxes as Json[]).find((c) => c.account === "sales@")!;
    expect(rowActionsOn(array, sales, "operations", g)).toEqual([]);
    expect((await call("POST", "/api/integrations/reconnect", reconnect!.call!.body)).status).toBe(403);
    await login("ahmedy");
    const r = await call("POST", "/api/integrations/reconnect", reconnect!.call!.body);
    expect(r.body.message).toMatch(/12 imported/);
    expect((await call("GET", "/api/integration-exceptions/ex-outlook")).body.status).toBe("Resolved");
  });
});

describe("integrations global", () => {
  it("works out each connection's days to expiry on read", async () => {
    const g = (await call("GET", "/api/globals/integrations")).body;
    const by = (account: string) => g.connections.find((c: { account: string }) => c.account === account);
    // From the demo's today (Tue 17 Nov 09:30): sales@ until 10 Feb, purchasing@ expired at 06:12.
    expect(by("sales@").expiresInDays).toBe(85);
    expect(by("purchasing@").expiresInDays).toBe(0);
    expect(g.connections.find((c: { kind: string }) => c.kind === "WhatsApp").expiresInDays ?? null).toBeNull();
    // Amber within 30 days, red once expired.
    const expires = fieldOf(Integrations.fields, "tokenExpiresAt");
    expect(toneOf(expires, by("sales@"))).toBeUndefined();
    expect(toneOf(expires, by("purchasing@"))).toBe("warning");
    expect(toneOf(expires, { expiresInDays: -2 })).toBe("error");
    expect(toneOf(fieldOf(Integrations.fields, "status"), by("purchasing@"))).toBe("error");
  });

  it("reads its mailboxes and channels as rows: what each does and the messages that came in through it", async () => {
    const g = (await call("GET", "/api/globals/integrations")).body;
    expect(recordsOf(integrationsPage, "Mailboxes")).toMatchObject({ global: "integrations", field: "mailboxes" });
    expect(recordsOf(integrationsPage, "Channels")).toMatchObject({ global: "integrations", field: "channels" });
    expect((g.mailboxes as Json[]).map((c) => c.account)).toEqual(["sales@", "purchasing@", "purchasing intake"]);
    expect((g.channels as Json[]).map((c) => c.title)).toEqual([
      "Website quick-quote form",
      "WhatsApp",
      "AI extraction",
      "Egyptian e-invoicing (ETA)",
      "Odoo",
      "Documents",
    ]);
    // Imported so far, and the messages in the inbox now.
    const live = async (where: string) =>
      (await call("GET", `/api/intake-messages?${where}&limit=0&depth=0`)).body.totalDocs as number;
    const sales = (g.mailboxes as Json[]).find((c) => c.account === "sales@")!;
    expect(sales).toMatchObject({
      poll: "every 2 min",
      received: 1840 + (await live("where[mailbox][equals]=sales@")),
    });
    const form = (g.channels as Json[]).find((c) => c.kind === "Website form")!;
    expect(form.received).toBe(37 + (await live("where[channel][equals]=Website form")));
    expect(form.about).toMatch(/quick quote/);
    expect((g.channels as Json[]).find((c) => c.kind === "WhatsApp")!.received ?? null).toBeNull();
    // Failed e-invoice submissions wait in the exception queue.
    const channels = fieldOf(Integrations.fields, "channels");
    const offered = (g.channels as Json[]).map((c) => rowActionsOn(channels, c, "supply-chain", g).map((a) => a.label));
    expect(offered).toEqual([[], [], [], ["Exception queue"], [], []]);
    // Worked out on read, never stored, and not in the form.
    expect(fieldOf(Integrations.fields, "mailboxes")).toMatchObject({ virtual: true, admin: { hidden: true } });
  });
});

describe("delivery plan (client-facing)", () => {
  it("links every work package to a demo screen and shows no prices, rates or effort", async () => {
    const { token } = (await login("karim.youssef")).body;
    const { text } = await call("GET", "/api/project", undefined, { authorization: `JWT ${token}` });
    // Currencies may be named (quotes in EGP or USD); amounts, rates, effort and our costs may not.
    expect(text).not.toMatch(
      /\b(EGP|USD|EUR)\s*\d|\d[\d.,]*\s*k?\s*(EGP|USD|EUR)\b|day rate|effort|our cost|partner note|\d{1,3}(,\d{3})+|per month|\/\s*mo\b/i,
    );
    const body = JSON.parse(text);
    expect(body.phases).toHaveLength(4);
    expect(body.acceptance).toHaveLength(10);
    expect(body.acceptance.filter((a: { pass: boolean }) => a.pass).length).toBeGreaterThanOrEqual(9);
    const hrefs = [...body.phases.flatMap((p: { packages: { href: string }[] }) => p.packages), ...body.platform]
      .map((p: { href: string }) => p.href)
      .filter(Boolean);
    for (const h of [
      "/inbox",
      "/inbox-history",
      "/collections/cases/gs-rfq-0142/rfqs",
      "/collections/cases/gs-rfq-0142/compare",
      "/collections/cases/gs-rfq-0142/pricing",
      "/collections/quotations/q-0142-v1/preview",
      "/approvals",
      "/collections/cases/gs-rfq-0136/order",
      "/collections/cases/gs-rfq-0133/delivery",
      "/cash",
      "/collections/cases/gs-rfq-0131/profit",
      "/control-room",
      "/growth",
      "/automations",
      "/roles",
      "/integrations",
    ])
      expect(hrefs, h).toContain(h);
  });
});
