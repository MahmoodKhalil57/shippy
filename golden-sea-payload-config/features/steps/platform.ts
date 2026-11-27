import { collectionNamed, Given, personNamed, Then, When, type BusinessWorld } from "test-runner/steps";
import { expect } from "vite-plus/test";
import type { Answer, Briefing } from "../../src/endpoints/assistant.ts";
import type { ControlRoom } from "../../src/endpoints/control-room.ts";
import type { Home } from "../../src/endpoints/home.ts";
import type {
  AutomationsView,
  CaseOverview,
  IntegrationsView,
  ProjectView,
  RolesView,
  Routing,
} from "../../src/endpoints/platform.ts";
import type { Visuals } from "../../src/endpoints/visuals.ts";
import { automationFigures, reviewQueue } from "../../src/format/automations.ts";
import { briefing as roomBriefing, roomFigures, roomHeader } from "../../src/format/control-room.ts";
import { agenda, briefing as homeBriefing, homeFigures, homeHeader } from "../../src/format/home.ts";
import { backups, languages } from "../../src/format/integrations.ts";
import { acceptance, acceptancePassing } from "../../src/format/project.ts";
import { escalation, permissionChecks, routingSimulator } from "../../src/format/roles.ts";
import { calendar, deadlines } from "../../src/format/visuals.ts";
import { PERMISSIONS } from "../../src/globals/index.ts";
import { ROLES } from "../../src/collections/shared.ts";
import { myDecisions } from "../../src/queries/aside.ts";

type Row = Record<string, unknown>;

const shown = <T>(world: BusinessWorld): T => {
  expect(world.reply?.status, world.message()).toBe(200);
  return world.reply!.body as T;
};
const scope = (world: BusinessWorld, params: Record<string, string> = {}) =>
  ({ user: { id: world.person?.id, role: world.person?.role }, params }) as never;

const engine = (world: BusinessWorld) => world.backend.engine;
const globalOf = (world: BusinessWorld, slug: string) => engine(world).findGlobal({ slug, locale: "en" } as never);
const saveGlobal = (world: BusinessWorld, slug: string, data: Row) =>
  engine(world).updateGlobal({ slug, data, context: { seed: true } } as never);
const userId = (who: string) => personNamed(who).id;
const nameOf = (id: unknown): string => {
  if (id && typeof id === "object") return String((id as Row).name ?? (id as Row).id);
  try {
    return personNamed(String(id)).name ?? String(id);
  } catch {
    return String(id);
  }
};
const cairo = (when: string) => new Date(`${when.replace(" ", "T")}:00+02:00`).toISOString();
const findCase = (world: BusinessWorld, caseId: string) => world.record(collectionNamed("cases"), caseId);

Given("the supplier has replied to {string}", async (world: BusinessWorld, reference: string) => {
  const rfq = await world.record(collectionNamed("supplier-rfqs"), reference);
  await engine(world).update({
    collection: "supplier-rfqs",
    id: rfq.id,
    data: { status: "Replied" },
    context: { seed: true },
  } as never);
});

When("I open my home page", (world: BusinessWorld) => world.send("GET", "/home"));

Then("my home page greets me with {string}", (world: BusinessWorld, text: string) => {
  expect(shown<Home>(world).greeting).toBe(text);
});

Then("my home page summary reads {string}", (world: BusinessWorld, text: string) => {
  expect(shown<Home>(world).subtitle).toBe(text);
});

Then("my home page shows the figures {string}", (world: BusinessWorld, names: string) => {
  expect(homeFigures(shown<Home>(world)).map((f) => f.label)).toEqual(names.split("; "));
});

Then("my home page shows {string} as {string}", (world: BusinessWorld, name: string, value: string) => {
  const figure = homeFigures(shown<Home>(world)).find((f) => f.label === name);
  expect(figure?.value, `${name} is not on the home page`).toBe(value);
});

Then("the main button on my home page is {string}", (world: BusinessWorld, label: string) => {
  const unread = { docs: [] };
  expect(homeHeader({ home: shown<Home>(world), unread }).actions?.find((a) => a.main)?.label).toBe(label);
});

const briefingLines = (world: BusinessWorld) =>
  (homeBriefing(shown<Home>(world))?.items ?? []).map((i) => `${i.headline} · ${i.supporting ?? ""}`);

Then("my daily briefing mentions {string}", (world: BusinessWorld, text: string) => {
  expect(
    briefingLines(world).some((l) => l.includes(text)),
    briefingLines(world).join("\n"),
  ).toBe(true);
});

Then("my daily briefing does not mention {string}", (world: BusinessWorld, text: string) => {
  expect(
    briefingLines(world).some((l) => l.includes(text)),
    briefingLines(world).join("\n"),
  ).toBe(false);
});

Then("my daily briefing warns {string}", (world: BusinessWorld, text: string) => {
  const items = homeBriefing(shown<Home>(world))?.items ?? [];
  const item = items.find((i) => `${i.headline} · ${i.supporting ?? ""}`.includes(text));
  expect(item, briefingLines(world).join("\n")).toBeDefined();
  expect(item?.dot).toBe("warning");
});

Then("my daily briefing starts with {string}", (world: BusinessWorld, text: string) => {
  expect(briefingLines(world)[0]).toContain(text);
});

Then("my sidebar counts {int} decision(s) waiting for me", async (world: BusinessWorld, n: number) => {
  const where = JSON.parse(
    JSON.stringify(myDecisions.where).replaceAll('"$user.id"', JSON.stringify(world.person?.id)),
  );
  const found = (await engine(world).find({ collection: "approvals", where, pagination: false } as never)) as {
    docs: Row[];
  };
  expect(found.docs.length).toBe(n);
});

const nextUp = (world: BusinessWorld) => agenda(shown<Home>(world))?.items ?? [];

Then("my next up list includes {string}", (world: BusinessWorld, title: string) => {
  expect(nextUp(world).map((i) => i.headline)).toContain(title);
});

Then("my next up list does not include {string}", (world: BusinessWorld, title: string) => {
  expect(nextUp(world).map((i) => i.headline)).not.toContain(title);
});

Then("{string} is marked late in my next up list", (world: BusinessWorld, title: string) => {
  const item = nextUp(world).find((i) => i.headline === title);
  expect(item?.tags?.map((t) => t.label)).toEqual(["Late"]);
});

Then("my next up list says {string}", (world: BusinessWorld, text: string) => {
  expect(agenda(shown<Home>(world))?.head?.subhead).toBe(text);
});

Then("while I was away I got {string}", async (world: BusinessWorld, title: string) => {
  const home = shown<Home>(world);
  const unread = await world.send("GET", "/notifications?where[read][equals]=false&limit=20&depth=0");
  const text = homeHeader({ home, unread: unread.body as { docs: Row[] } }).summary?.text ?? "";
  expect(text).toContain(title);
});

Then("while I was away I got nothing about {string}", async (world: BusinessWorld, title: string) => {
  const home = shown<Home>(world);
  const unread = await world.send("GET", "/notifications?where[read][equals]=false&limit=20&depth=0");
  const text = homeHeader({ home, unread: unread.body as { docs: Row[] } }).summary?.text ?? "";
  expect(text).not.toContain(title);
});

const PERIOD: Record<string, string> = { "last 4 weeks": "4w", "last 12 weeks": "12w", "last 6 months": "6m" };

When("I open the control room", (world: BusinessWorld) => world.send("GET", "/control-room"));

When("I open the control room for the {string}", (world: BusinessWorld, period: string) =>
  world.send("GET", `/control-room?period=${PERIOD[period] ?? period}`),
);

const roomFigure = (world: BusinessWorld, name: string) => {
  const figure = roomFigures(shown<ControlRoom>(world)).find((f) => f.label === name);
  expect(figure, `${name} is not in the control room`).toBeDefined();
  return figure!;
};

Then("the control room shows {string} as {string}", (world: BusinessWorld, name: string, value: string) => {
  expect(roomFigure(world, name).value).toBe(value);
});

Then("the control room note under {string} reads {string}", (world: BusinessWorld, name: string, note: string) => {
  expect(roomFigure(world, name).note).toBe(note);
});

Then("the control room marks {string} as needing attention", (world: BusinessWorld, name: string) => {
  expect(roomFigure(world, name).tone).toBe("warning");
});

Then("the control room does not mark {string}", (world: BusinessWorld, name: string) => {
  expect(roomFigure(world, name).tone).toBeUndefined();
});

Then("the control room shares {string} as {string}", (world: BusinessWorld, name: string, text: string) => {
  expect(roomFigure(world, name).share?.text).toBe(text);
});

Then("the control room shows money", (world: BusinessWorld) => {
  const room = shown<ControlRoom>(world);
  expect(roomFigures(room).map((f) => f.label)).toEqual(expect.arrayContaining(["Gross profit", "Receivables open"]));
  expect(room.sections.map((s) => s.id)).toContain("money");
  expect(roomHeader(room).actions?.map((a) => a.label)).toContain("Receivables & payables");
});

Then("the control room hides money", (world: BusinessWorld) => {
  const room = shown<ControlRoom>(world);
  expect(roomFigures(room).map((f) => f.label)).not.toContain("Receivables open");
  expect(room.sections.map((s) => s.id)).not.toContain("money");
  expect(room.visuals.ageing).toEqual([]);
  expect(roomHeader(room).actions?.map((a) => a.label)).not.toContain("Receivables & payables");
});

When("I read the morning briefing", (world: BusinessWorld) => world.send("GET", "/briefing"));

When("I ask for the morning briefing to be summarised again", (world: BusinessWorld) =>
  world.send("POST", "/briefing/refresh"),
);

const briefingItems = (world: BusinessWorld) => shown<Briefing>(world).items.map((i) => i.text);

Then("the morning briefing mentions {string}", (world: BusinessWorld, text: string) => {
  expect(
    briefingItems(world).some((t) => t.includes(text)),
    briefingItems(world).join("\n"),
  ).toBe(true);
});

Then("the morning briefing does not mention {string}", (world: BusinessWorld, text: string) => {
  expect(
    briefingItems(world).some((t) => t.includes(text)),
    briefingItems(world).join("\n"),
  ).toBe(false);
});

Then("the morning briefing opens with {string}", (world: BusinessWorld, text: string) => {
  expect(shown<Briefing>(world).summary.split("\n")[0]).toBe(text);
});

Then("the morning briefing note reads {string}", (world: BusinessWorld, text: string) => {
  expect(roomBriefing(shown<Briefing>(world)).note).toBe(text);
});

Then("the morning briefing says it was summarised again at the time I asked", async (world: BusinessWorld) => {
  const me = (await engine(world).findByID({ collection: "users", id: world.person?.id, depth: 0 } as never)) as Row;
  const at = new Date(String(me.briefingSummarisedAt)).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
  expect(roomBriefing(shown<Briefing>(world)).note).toBe(
    `Summarised again at ${at} from 75 live records. A draft to read: nothing is sent, priced or paid.`,
  );
});

Then("the morning briefing links to {string}", (world: BusinessWorld, label: string) => {
  expect(roomBriefing(shown<Briefing>(world)).actions?.map((a) => a.label)).toContain(label);
});

When("I ask Golden Sea {string}", (world: BusinessWorld, question: string) => world.send("POST", "/ask", { question }));

When("I ask Golden Sea nothing", (world: BusinessWorld) => world.send("POST", "/ask", { question: "  " }));

Then("Golden Sea answers {string}", (world: BusinessWorld, text: string) => {
  expect(shown<Answer>(world).answer).toBe(text);
});

Then("Golden Sea refuses to answer", (world: BusinessWorld) => {
  expect(shown<Answer>(world).refused).toBe(true);
});

Then("Golden Sea's answer lists {string}", (world: BusinessWorld, text: string) => {
  const points = shown<Answer>(world).points;
  expect(
    points.some((p) => p.includes(text)),
    points.join("\n"),
  ).toBe(true);
});

Then("Golden Sea's answer does not list {string}", (world: BusinessWorld, text: string) => {
  const points = shown<Answer>(world).points;
  expect(
    points.some((p) => p.includes(text)),
    points.join("\n"),
  ).toBe(false);
});

Then("Golden Sea cites {string}", (world: BusinessWorld, label: string) => {
  expect(shown<Answer>(world).sources.map((s) => s.label)).toContain(label);
});

Then("the AI work {string} is logged as {string}", async (world: BusinessWorld, subject: string, outcome: string) => {
  const found = (await engine(world).find({
    collection: "ai-calls",
    where: { subject: { equals: subject } },
    pagination: false,
  } as never)) as { docs: Row[] };
  expect(found.docs.map((d) => d.outcome)).toContain(outcome);
});

When("I open the suggested questions", (world: BusinessWorld) => world.send("GET", "/ask/suggestions"));

Then("I am offered the question {string}", (world: BusinessWorld, q: string) => {
  expect(shown<{ suggestions: string[] }>(world).suggestions).toContain(q);
});

Then("I am not offered the question {string}", (world: BusinessWorld, q: string) => {
  expect(shown<{ suggestions: string[] }>(world).suggestions).not.toContain(q);
});

When("I open the automations page", (world: BusinessWorld) => world.send("GET", "/automations"));

Then("the automations page shows {string} as {string}", (world: BusinessWorld, name: string, value: string) => {
  const figure = automationFigures(shown<AutomationsView>(world)).find((f) => f.label === name);
  expect(`${figure?.value} (${figure?.share?.text})`).toBe(value);
});

const queue = (world: BusinessWorld) => reviewQueue(shown<AutomationsView>(world)).items;

Then("the review queue holds {int} items", (world: BusinessWorld, n: number) => {
  expect(queue(world)).toHaveLength(n);
});

Then("the review queue includes {string}", (world: BusinessWorld, title: string) => {
  expect(queue(world).map((i) => i.headline)).toContain(title);
});

Then("the review queue does not include {string}", (world: BusinessWorld, title: string) => {
  expect(queue(world).map((i) => i.headline)).not.toContain(title);
});

Then("{string} in the review queue can be marked reviewed", (world: BusinessWorld, title: string) => {
  const item = queue(world).find((i) => i.headline === title);
  expect(item?.actions?.map((a) => a.label)).toContain("Mark reviewed");
});

Then("{string} in the review queue can only be opened", (world: BusinessWorld, title: string) => {
  const item = queue(world).find((i) => i.headline === title);
  expect(item?.actions?.map((a) => a.label)).toEqual(["Open"]);
});

Then(
  "{string} in the review queue shows a confidence of {string}",
  (world: BusinessWorld, title: string, pct: string) => {
    const item = queue(world).find((i) => i.headline === title);
    expect(item?.tags?.map((t) => t.label)).toEqual([pct]);
  },
);

const ruleNamed = async (world: BusinessWorld, name: string) => {
  const rules = ((await globalOf(world, "automation-rules")).rules as Row[] | undefined) ?? [];
  return rules.find((r) => r.name === name);
};

const switchRule = async (world: BusinessWorld, name: string, value: boolean) => {
  const rule = await ruleNamed(world, name);
  await world.send("POST", "/automations/rule", { id: rule?.id ?? name, value });
};

When("I pause the automation rule {string}", (world: BusinessWorld, name: string) => switchRule(world, name, false));
When("I enable the automation rule {string}", (world: BusinessWorld, name: string) => switchRule(world, name, true));

Then("the automation rule {string} is paused", async (world: BusinessWorld, name: string) => {
  expect((await ruleNamed(world, name))?.enabled).toBe(false);
});

Then("the automation rule {string} is running", async (world: BusinessWorld, name: string) => {
  expect((await ruleNamed(world, name))?.enabled).not.toBe(false);
});

Then("the rule change can be undone", (world: BusinessWorld) => {
  expect((shown<Row>(world).undo as Row | undefined)?.body).toMatchObject({ value: true });
});

When(
  "I lower the confidence needed to create a case from an RFQ email to {string}",
  async (world: BusinessWorld, pct: string) => {
    const g = await globalOf(world, "automation-rules");
    const rules = ((g.rules as Row[]) ?? []).map((r) =>
      r.name === "Create case from RFQ email" ? { ...r, confidenceThreshold: Number(pct.replace("%", "")) / 100 } : r,
    );
    await saveGlobal(world, "automation-rules", { rules });
  },
);

const exception = (world: BusinessWorld, summary: string) =>
  world.record(collectionNamed("integration-exceptions"), summary);

When("I retry the exception {string}", async (world: BusinessWorld, summary: string) => {
  const x = await exception(world, summary);
  await world.send("POST", `/automations/retry/${x.id}`);
});

When("I retry an exception that does not exist", (world: BusinessWorld) =>
  world.send("POST", "/automations/retry/no-such-exception"),
);

When("I mark the exception {string} as reviewed", async (world: BusinessWorld, summary: string) => {
  const x = await exception(world, summary);
  await world.send("POST", `/automations/review/${x.id}`, {});
});

When(
  "I mark the exception {string} as reviewed with the note {string}",
  async (world: BusinessWorld, summary: string, note: string) => {
    const x = await exception(world, summary);
    await world.send("POST", `/automations/review/${x.id}`, { note });
  },
);

When("I mark an exception that does not exist as reviewed", (world: BusinessWorld) =>
  world.send("POST", "/automations/review/no-such-exception", {}),
);

Then("nothing more needs reviewing there", (world: BusinessWorld) => {
  expect(shown<Row>(world)).toMatchObject({ ok: true, alreadyDone: true });
});

Then("the activity log records {string}", async (world: BusinessWorld, text: string) => {
  const found = (await engine(world).find({ collection: "activities", pagination: false, locale: "en" } as never)) as {
    docs: Row[];
  };
  const texts = found.docs.map((a) => String(a.text));
  expect(
    texts.some((t) => t.includes(text)),
    texts.slice(-5).join("\n"),
  ).toBe(true);
});

When("I open roles and permissions", (world: BusinessWorld) => world.send("GET", "/roles"));

const check = (world: BusinessWorld, label: string) => {
  const item = permissionChecks(shown<RolesView>(world)).items.find((i) => i.headline === label);
  expect(item, `No check called ${label}`).toBeDefined();
  return item!;
};

Then("the check {string} is {string}", (world: BusinessWorld, label: string, state: string) => {
  expect(check(world, label).tags?.map((t) => t.label)).toEqual([state]);
});

Then("the check {string} explains {string}", (world: BusinessWorld, label: string, text: string) => {
  expect(check(world, label).supporting).toBe(text);
});

Then("the permission {string} is enforced by {string}", (world: BusinessWorld, label: string, text: string) => {
  expect(shown<RolesView>(world).permissions.find((p) => p.label === label)?.enforced).toBe(text);
});

When("the bank detail change rule no longer needs two people", async (world: BusinessWorld) => {
  const g = await globalOf(world, "approval-rules");
  const rules = ((g.rules as Row[]) ?? []).map((r) =>
    r.type === "Bank detail change" ? { ...r, twoPerson: false } : r,
  );
  await saveGlobal(world, "approval-rules", { rules });
});

const roleValue = (label: string) => ROLES.find((r) => r.label === label)?.value ?? label;
const permissionKey = (label: string) => PERMISSIONS.find((p) => p.label === label)?.key ?? label;

const setPermission = (world: BusinessWorld, role: string, permission: string, value: boolean) =>
  world.send("POST", "/roles/permission", { role: roleValue(role), [permissionKey(permission)]: value });

When("I give {string} the permission {string}", (world: BusinessWorld, role: string, p: string) =>
  setPermission(world, role, p, true),
);
When("I take the permission {string} away from {string}", (world: BusinessWorld, p: string, role: string) =>
  setPermission(world, role, p, false),
);
When("I save the permissions of {string} without changing any", (world: BusinessWorld, role: string) =>
  world.send("POST", "/roles/permission", { role: roleValue(role) }),
);

const hasPermission = async (world: BusinessWorld, role: string, permission: string) => {
  const rows = ((await globalOf(world, "settings")).permissions as Row[]) ?? [];
  return rows.find((r) => r.role === roleValue(role))?.[permissionKey(permission)];
};

Then("{string} has the permission {string}", async (world: BusinessWorld, role: string, p: string) => {
  expect(await hasPermission(world, role, p)).toBe(true);
});

Then("{string} does not have the permission {string}", async (world: BusinessWorld, role: string, p: string) => {
  expect(await hasPermission(world, role, p)).toBe(false);
});

When("I check who gets an urgent RFQ that arrives at {string} Cairo time", (world: BusinessWorld, when: string) =>
  world.send("GET", `/on-call/route?at=${encodeURIComponent(cairo(when))}`),
);

When("I check who gets an urgent RFQ that arrives at {string}", (world: BusinessWorld, when: string) =>
  world.send("POST", "/on-call/route", { at: when }),
);

When("I send a test alert for an urgent RFQ at {string} Cairo time", (world: BusinessWorld, when: string) =>
  world.send("POST", "/on-call/route", { at: cairo(when), simulate: true }),
);

Then("it is picked up in office hours by the case owner", (world: BusinessWorld) => {
  const r = shown<Routing>(world);
  expect(r.inHours).toBe(true);
  expect(r.routedTo).toBeNull();
  expect(routingSimulator(r).tags?.map((t) => t.label)).toContain("Office hours");
  expect(escalation(r)).toBeNull();
});

Then("it goes to {string} with {string} as backup", (world: BusinessWorld, who: string, backup: string) => {
  const r = shown<Routing>(world);
  expect(r.inHours).toBe(false);
  expect(r.routedTo?.name).toBe(who);
  expect(r.backup?.name).toBe(backup);
  expect(escalation(r)?.items.map((i) => i.label)[0]).toContain(who);
});

Then("the routing explains {string}", (world: BusinessWorld, text: string) => {
  expect(shown<Routing>(world).reason).toBe(text);
});

Then("{string} is notified {string}", async (world: BusinessWorld, who: string, title: string) => {
  const found = (await engine(world).find({
    collection: "notifications",
    where: { user: { equals: userId(who) } },
    pagination: false,
    locale: "en",
  } as never)) as { docs: Row[] };
  expect(found.docs.map((n) => String(n.title))).toContain(title);
});

Then("the alert to {string} says {string}", async (world: BusinessWorld, who: string, detail: string) => {
  const found = (await engine(world).find({
    collection: "notifications",
    where: { user: { equals: userId(who) }, kind: { equals: "Alert" } },
    pagination: false,
    locale: "en",
  } as never)) as { docs: Row[] };
  expect(found.docs.map((n) => String(n.detail))).toContain(detail);
});

Then("nobody is notified {string}", async (world: BusinessWorld, title: string) => {
  const found = (await engine(world).find({
    collection: "notifications",
    pagination: false,
    locale: "en",
  } as never)) as {
    docs: Row[];
  };
  expect(found.docs.map((n) => String(n.title))).not.toContain(title);
});

const shiftFrom = async (world: BusinessWorld, when: string) => {
  const roster = await globalOf(world, "on-call-roster");
  const shifts = (roster.shifts as Row[]) ?? [];
  return shifts.find((s) => new Date(String(s.from)).toISOString() === cairo(when));
};

When(
  "I put {string} on duty for the shift from {string} with {string} as backup",
  async (world: BusinessWorld, who: string, when: string, backup: string) => {
    const shift = await shiftFrom(world, when);
    await world.send("POST", "/roles/roster", { id: shift?.id ?? when, user: userId(who), backup: userId(backup) });
  },
);

When("I leave nobody on duty for the shift from {string}", async (world: BusinessWorld, when: string) => {
  const shift = await shiftFrom(world, when);
  await world.send("POST", "/roles/roster", { id: shift?.id ?? when });
});

Then(
  "{string} is on duty for the shift from {string} with {string} as backup",
  async (world: BusinessWorld, who: string, when: string, backup: string) => {
    const shift = await shiftFrom(world, when);
    expect([nameOf(shift?.user), nameOf(shift?.backup)]).toEqual([who, backup]);
  },
);

const connection = async (world: BusinessWorld, account: string) => {
  const g = await globalOf(world, "integrations");
  return ((g.connections as Row[]) ?? []).find((c) => c.account === account);
};

When("I reconnect the mailbox {string}", async (world: BusinessWorld, account: string) => {
  const c = await connection(world, account);
  await world.send("POST", "/integrations/reconnect", { id: c?.id ?? account });
});

Then("the mailbox {string} is {string}", async (world: BusinessWorld, account: string, status: string) => {
  expect((await connection(world, account))?.status).toBe(status);
});

Then("the mailbox {string} has imported {int} emails", async (world: BusinessWorld, account: string, n: number) => {
  expect((await connection(world, account))?.emailsImported).toBe(n);
});

When("I refresh the staging copy", (world: BusinessWorld) => world.send("POST", "/integrations/staging"));

Then("the staging copy is fresh", async (world: BusinessWorld) => {
  const g = (await globalOf(world, "integrations")) as Row;
  const at = String((g.backups as Row).stagingRefreshedAt);
  expect(at).toBe((shown<Row>(world) as { stagingRefreshedAt: string }).stagingRefreshedAt);
});

Then("the staging copy is still from {string}", async (world: BusinessWorld, at: string) => {
  const g = (await globalOf(world, "integrations")) as Row;
  expect(new Date(String((g.backups as Row).stagingRefreshedAt)).toISOString()).toBe(cairo(at));
});

When("I open the integrations page", (world: BusinessWorld) => world.send("GET", "/integrations/status"));

Then("I can refresh the staging copy", async (world: BusinessWorld) => {
  const action = backups({ backups: {} }, scope(world)).actions?.[0] as { disabled?: boolean };
  expect(action.disabled).toBe(false);
});

Then("I cannot refresh the staging copy because {string}", async (world: BusinessWorld, reason: string) => {
  const action = backups({ backups: {} }, scope(world)).actions?.[0] as { disabled?: boolean; reason?: string };
  expect([action.disabled, action.reason]).toEqual([true, reason]);
});

Then("the company language settings are open for me", (world: BusinessWorld) => {
  const items = languages(shown<IntegrationsView>(world)).items as { disabled?: boolean }[];
  expect(items.slice(0, 3).map((i) => i.disabled)).toEqual([false, false, false]);
});

Then("the company language settings are locked for me", (world: BusinessWorld) => {
  const view = languages(shown<IntegrationsView>(world));
  const items = view.items as { disabled?: boolean }[];
  expect(items.slice(0, 3).map((i) => i.disabled)).toEqual([true, true, true]);
  expect(items[3]?.disabled).toBeUndefined();
});

Then("the acknowledgement preview has the subject {string}", (world: BusinessWorld, subject: string) => {
  expect(shown<IntegrationsView>(world).ack.en.subject).toBe(subject);
});

Then(
  "the acknowledgement is {string} version {int} by {string}",
  (world: BusinessWorld, status: string, v: number, by: string) => {
    const ack = shown<IntegrationsView>(world).ack;
    expect([ack.status, ack.version, ack.approvedBy]).toEqual([status, v, by]);
  },
);

const LANG: Record<string, string> = { English: "en", Arabic: "ar" };

When("I set my dashboard language to {string}", (world: BusinessWorld, lang: string) =>
  world.send("POST", "/integrations/language", { field: "mine", value: LANG[lang] ?? lang }),
);
When("I set the company default language to {string}", (world: BusinessWorld, lang: string) =>
  world.send("POST", "/integrations/language", { field: "default", value: LANG[lang] ?? lang }),
);
When("I stop issuing documents in {string}", (world: BusinessWorld, lang: string) =>
  world.send("POST", "/integrations/language", { field: "documents", lang: LANG[lang] ?? lang, value: false }),
);
When("I start issuing documents in {string}", (world: BusinessWorld, lang: string) =>
  world.send("POST", "/integrations/language", { field: "documents", lang: LANG[lang] ?? lang, value: true }),
);
When("I change the language setting {string}", (world: BusinessWorld, field: string) =>
  world.send("POST", "/integrations/language", { field, value: "en" }),
);

Then("documents are issued in {string}", async (world: BusinessWorld, langs: string) => {
  const docs = ((await globalOf(world, "settings")).documentLanguages as string[]) ?? [];
  expect(docs.map((d) => Object.keys(LANG).find((k) => LANG[k] === d) ?? d).join(" and ")).toBe(langs);
});

Then("the company default language is {string}", async (world: BusinessWorld, lang: string) => {
  expect((await globalOf(world, "settings")).defaultLanguage).toBe(LANG[lang]);
});

When("I open the project overview", (world: BusinessWorld) => world.send("GET", "/project"));

const acceptanceRow = (world: BusinessWorld, no: number) => {
  const row = acceptance(shown<ProjectView>(world)).rows.find((r) => (r.no as { text: string }).text === String(no));
  expect(row, `No acceptance test ${no}`).toBeDefined();
  return row!;
};

Then("acceptance test {int} shows {string}", (world: BusinessWorld, no: number, status: string) => {
  expect((acceptanceRow(world, no).status as { text: string }).text).toBe(status);
});

Then("acceptance test {int} was checked by {string}", (world: BusinessWorld, no: number, check: string) => {
  expect(acceptanceRow(world, no).check).toBe(check);
});

Then("{string} acceptance tests pass", (world: BusinessWorld, text: string) => {
  expect(acceptancePassing(shown<ProjectView>(world)).items[0]?.valueText).toBe(text);
});

When("I open the overview of case {string}", async (world: BusinessWorld, caseId: string) => {
  const c = await findCase(world, caseId);
  await world.send("GET", `/case-overview/${c.id}`);
});

When("I open the overview of a case that does not exist", (world: BusinessWorld) =>
  world.send("GET", "/case-overview/no-such-case"),
);

Then("the case overview gives the quote deadline as {string}", (world: BusinessWorld, text: string) => {
  expect(shown<CaseOverview>(world).deadlineText).toBe(text);
});

Then("the case overview shows the case as {string}", (world: BusinessWorld, state: string) => {
  const o = shown<CaseOverview>(world);
  const halted = { stopped: "lost", paused: "paused", moving: "" }[state];
  expect(o.halted).toBe(halted);
});

Then("the case overview is at step {string}", (world: BusinessWorld, step: string) => {
  const o = shown<CaseOverview>(world);
  expect(o.steps[o.current]?.label).toBe(step);
});

Then("the case overview counts {string}", (world: BusinessWorld, text: string) => {
  const f = shown<CaseOverview>(world).fulfilment;
  expect(
    `${f.ordered} ordered, ${f.received} received, ${f.delivered} delivered, ${f.invoiced} invoiced of ${f.total}`,
  ).toBe(text);
});

Then("the case overview notes {string}", (world: BusinessWorld, text: string) => {
  expect(shown<CaseOverview>(world).fulfilment.notes).toContain(text);
});

Then("I can hand the case over", (world: BusinessWorld) => {
  expect(shown<CaseOverview>(world).canReassign).toBe(true);
});

Then("I cannot hand the case over", (world: BusinessWorld) => {
  expect(shown<CaseOverview>(world).canReassign).toBe(false);
});

Then("the case can be handed to {string}", (world: BusinessWorld, names: string) => {
  expect(
    shown<CaseOverview>(world)
      .team.map((p) => p.name)
      .sort(),
  ).toEqual(names.split(", ").sort());
});

When(
  "I ask for a handover draft of case {string} for {string}",
  async (world: BusinessWorld, caseId: string, who: string) => {
    const c = await findCase(world, caseId);
    await world.send("POST", `/case-overview/${c.id}/handover`, { to: userId(who) });
  },
);

Then("the handover draft says {string}", (world: BusinessWorld, line: string) => {
  const draft = shown<{ draft: string }>(world).draft.split("\n");
  expect(draft, draft.join("\n")).toContain(line);
});

const handOver = async (world: BusinessWorld, caseId: string, who: string, note?: string, backup?: string) => {
  const c = await findCase(world, caseId);
  await world.send("POST", `/case-overview/${c.id}/reassign`, {
    to: userId(who),
    note,
    ...(backup ? { backup: userId(backup) } : {}),
  });
};

When(
  "I hand case {string} over to {string} with the note {string}",
  (world: BusinessWorld, c: string, who: string, note: string) => handOver(world, c, who, note),
);
When("I hand case {string} over to {string} without a note", (world: BusinessWorld, c: string, who: string) =>
  handOver(world, c, who),
);
When(
  "I hand case {string} over to {string} with {string} as the new backup and the note {string}",
  (world: BusinessWorld, c: string, who: string, backup: string, note: string) => handOver(world, c, who, note, backup),
);

Then(
  "case {string} is owned by {string} with {string} as backup",
  async (world: BusinessWorld, caseId: string, who: string, backup: string) => {
    const c = await findCase(world, caseId);
    expect([nameOf(c.owner), nameOf(c.backup)]).toEqual([who, backup]);
  },
);

Then(
  "the open tasks on case {string} belong to {string}",
  async (world: BusinessWorld, caseId: string, who: string) => {
    const c = await findCase(world, caseId);
    const found = (await engine(world).find({
      collection: "tasks",
      where: { case: { equals: c.id }, status: { equals: "Open" } },
      pagination: false,
    } as never)) as { docs: Row[] };
    expect(found.docs.length).toBeGreaterThan(0);
    expect([...new Set(found.docs.map((t) => nameOf(t.owner)))]).toEqual([who]);
  },
);

When("I open my visual summary", (world: BusinessWorld) => world.send("GET", "/visuals"));

const countdown = (world: BusinessWorld) => deadlines(shown<Visuals>(world)).items.map((i) => i.label);

Then("my deadlines include {string}", (world: BusinessWorld, label: string) => {
  expect(countdown(world)).toContain(label);
});

Then("my deadlines do not include {string}", (world: BusinessWorld, label: string) => {
  expect(countdown(world)).not.toContain(label);
});

const TONE: Record<string, string> = { overdue: "error", "due soon": "warning", planned: "neutral", done: "success" };

Then(
  "the calendar shows {string} on {string} as {string}",
  (world: BusinessWorld, label: string, day: string, state: string) => {
    const events = calendar(shown<Visuals>(world)).events;
    const event = events.find((e) => e.label === label && e.date === day);
    expect(event, events.map((e) => `${e.date} ${e.label}`).join("\n")).toBeDefined();
    expect(event!.tone).toBe(TONE[state]);
  },
);

Then("the calendar shows no invoices", (world: BusinessWorld) => {
  expect(calendar(shown<Visuals>(world)).events.filter((e) => e.label.startsWith("Invoice"))).toEqual([]);
});

Then("the calendar shows no invoice {string}", (world: BusinessWorld, number: string) => {
  expect(calendar(shown<Visuals>(world)).events.filter((e) => e.label.includes(number))).toEqual([]);
});

Then("the calendar shows {string}", (world: BusinessWorld, label: string) => {
  expect(calendar(shown<Visuals>(world)).events.map((e) => e.label)).toContain(label);
});

Then("the calendar does not show {string}", (world: BusinessWorld, label: string) => {
  expect(calendar(shown<Visuals>(world)).events.map((e) => e.label)).not.toContain(label);
});

Then(
  "my visual summary shows the target {string} at {string}",
  (world: BusinessWorld, label: string, value: string) => {
    expect(shown<Visuals>(world).targets.find((t) => t.label === label)?.valueText).toBe(value);
  },
);
