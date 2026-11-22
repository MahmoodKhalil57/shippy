import { stringify } from "qs-esm";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import {
  eachTiles,
  type Source,
  type Widget,
  type WidgetPage,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import { caseCompare } from "../src/pages/case-compare.ts";
import { caseOverview } from "../src/pages/case-overview.ts";
import { casePricing } from "../src/pages/case-pricing.ts";
import { caseProfit } from "../src/pages/case-profit.ts";
import { caseRfqs } from "../src/pages/case-rfqs.ts";
import { matches } from "saastemlycrm-design-system/payload";
import { Activities } from "../src/collections/work.ts";
import { Cases } from "../src/collections/cases.ts";
import { backend, call, login } from "./backend.ts";

type Field = { name?: string; type?: string; fields?: Field[]; tabs?: { fields: Field[] }[]; custom?: Json };
/** A field by name or dotted path, through tabs, rows, groups and arrays. */
function fieldAt(fields: Field[], path: string): Field | undefined {
  const [head, ...rest] = path.split(".");
  const flat = (fs: Field[]): Field[] =>
    fs.flatMap((f) => (f.tabs ? f.tabs.flatMap((t) => flat(t.fields)) : !f.name && f.fields ? flat(f.fields) : [f]));
  const f = flat(fields).find((x) => x.name === head);
  return rest.length ? fieldAt(f?.fields ?? [], rest.join(".")) : f;
}
/** A value's tone as the dashboard reads it: its field's first `toneWhen` that holds, else its select's tone. */
const toneOf = (f: Field, doc: Json): string | undefined =>
  f.custom?.toneWhen?.find((r: { when: never }) => matches(doc, r.when))?.tone ?? f.custom?.tones?.[doc[f.name!]];
/** The data widget of a page with this title. */
const titled = (page: WidgetPage, title: string) => page.widgets.find((w) => w.title?.startsWith(title))!;

/** The case workspace tabs as widgets (src/cms/widgets/case-*.ts): what they show, per role, and their actions. */

beforeEach(async () => {
  backend.reset();
  await login("karim.youssef");
});

// oxlint-disable-next-line typescript/no-explicit-any
type Json = any;

/** `$doc.id`, `$user.role`, `$param.x` filled in, as the widget host does. */
function fill<T>(value: T, scope: WidgetScope): T {
  const look = (p: string): unknown => {
    const [root, key] = p.split(".") as [string, string];
    return root === "doc" ? scope.doc?.[key as "id"] : root === "user" ? scope.user[key] : scope.params[key];
  };
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") {
      const whole = /^\$((?:doc|user|param)\.[\w-]+)$/.exec(v);
      if (whole) return look(whole[1]!);
      return v.replace(/\$((?:doc|user|param)\.[\w-]+)/g, (_, p: string) => {
        const x = look(p);
        return encodeURIComponent(typeof x === "string" || typeof x === "number" ? String(x) : "");
      });
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}

/** A widget's data as the host loads it: the response and its status. */
async function load(source: Source): Promise<{ status: number; data: unknown }> {
  if ("endpoint" in source) {
    const q = source.query ? stringify(source.query, { addQueryPrefix: true }) : "";
    const r = await call("GET", `/api${source.endpoint}${q}`);
    return { status: r.status, data: r.body };
  }
  if ("find" in source) {
    const { find, ...rest } = source;
    const r = await call("GET", `/api/${find}${stringify(rest, { addQueryPrefix: true })}`);
    return { status: r.status, data: r.body };
  }
  throw new Error(`Source not handled here: ${JSON.stringify(source)}`);
}

/**
 * A widget page drawn as blocks, as `<app-widgets>` would for the signed-in user: a titled widget
 * is a card (its head's count, tags and actions on it), a refused one shows its `denied` text or
 * nothing, a `hidden` one nothing. An `each` widget is a card per item. Data widgets (`records`…) show as
 * their card only.
 */
async function draw(page: WidgetPage, id: string, params: Record<string, string> = {}): Promise<Json> {
  const me = (await call("GET", "/api/users/me")).body.user;
  const scope: WidgetScope = { user: me, doc: { id, slug: "cases" }, params: { ...page.params, ...params } };
  const all = async (ws: Widget[]) => (await Promise.all(ws.map(one))).flat();
  const one = async (w: Widget): Promise<Json[]> => {
    if (w.visible && !w.visible(scope)) return [];
    if (w.grid) return [{ type: "grid", blocks: await all(w.grid) }];
    if (w.split) return [{ type: "split", main: await all(w.split.main), side: await all(w.split.side) }];
    // A data widget shows as its card (with what its head adds, e.g. an action): its records are the collection's.
    if (w.records || w.counts || w.fields || w.metrics)
      return w.title
        ? [fill({ type: "card", heading: w.title, ...w.head?.(undefined as never, scope), blocks: [] }, scope)]
        : [];
    const { status, data } = w.source ? await load(fill(w.source, scope)) : { status: 200, data: null };
    let out: Json[];
    if (status === 403) {
      if (!w.denied) return [];
      out = [{ type: "alert", tone: "info", text: w.denied }];
    } else {
      expect(status, `${w.title ?? "widget"}: ${JSON.stringify(data)}`).toBe(200);
      if (w.hidden?.(data, scope)) return [];
      if (w.each) return (await all(eachTiles(w, data, scope).map((t) => t.widget as Widget))).flat();
      const r = w.render?.(data, scope);
      out = r ? (Array.isArray(r) ? r : [r]) : [];
    }
    if (!w.title) return fill(out, scope);
    const head = status === 200 ? w.head?.(data, scope) : undefined;
    return [fill({ type: "card", heading: w.title, ...head, blocks: out }, scope)];
  };
  return { blocks: await all(page.widgets) };
}

/** Every block of a view, nested ones included. */
const blocks = (v: Json): Json[] =>
  (v.blocks ?? []).flatMap((b: Json) => [
    b,
    ...blocks({ blocks: [...(b.blocks ?? []), ...(b.main ?? []), ...(b.side ?? [])] }),
  ]);
const card = (v: Json, heading: string) => blocks(v).find((b) => b.type === "card" && b.heading?.startsWith(heading));
const text = (v: unknown) => JSON.stringify(v);

describe("case tabs", () => {
  it("overview: lifecycle, line progress, owner & backup with the handover, lines, clarifications, timeline", async () => {
    const page = caseOverview.clientProps.page;
    const body = await draw(page, "gs-rfq-0142");
    for (const h of [
      "Lifecycle",
      "Line progress",
      "Owner & backup",
      "Activity timeline",
      "Clarifications log",
      "Next action",
    ])
      expect(card(body, h), h).toBeTruthy();
    // The case's own fields, read from the cases collection (data widgets).
    const c = (await call("GET", "/api/cases/gs-rfq-0142?depth=1")).body;
    const fields = Cases.fields as Field[];
    // Line progress: each count a bar of all six lines, ready amber while one is blocked.
    expect(titled(page, "Line progress").fields!.fields).toEqual([
      "lineCount.readyPct",
      "lineCount.ready",
      "lineCount.waiting",
      "lineCount.blocked",
      "lineCount.noOffer",
    ]);
    expect(c.lineCount).toMatchObject({ total: 6, ready: 3, blocked: 1, readyPct: 50 });
    const ready = fieldAt(fields, "lineCount.ready")!;
    expect(ready.custom.gauge.max).toBe("lineCount.total");
    expect(toneOf(ready, c)).toBe("warning");
    expect(toneOf(fieldAt(fields, "lineCount.blocked")!, c)).toBe("error");
    // Owner & backup with the collection's "Reassign"; the facts around it without it.
    expect(titled(page, "Owner & backup").fields).toEqual({ fields: ["owner", "backup"] });
    for (const t of ["Next action", "Line progress", "Last handover note", "Customer contact rule"])
      expect(titled(page, t).fields!.actions, t).toBe(false);
    // The contact rule through the customer, with what it means.
    expect(titled(page, "Customer contact rule").fields!.fields).toContain("customer.contactNote");
    expect(c.customer.contactNote).toMatch(/One customer follow-up per quotation/);
    // Every line with its status in its bucket's tone, and how sure the AI was (amber under 85%).
    expect(titled(page, "Line status").records).toMatchObject({ doc: true, field: "items" });
    const status = fieldAt(fields, "items.status")!;
    const tones = c.items.map((l: Json) => toneOf(status, l));
    expect(tones.filter((t: string) => t === "success")).toHaveLength(3);
    expect(tones.filter((t: string) => t === "error")).toHaveLength(1);
    const aiRead = fieldAt(fields, "items.aiRead")!;
    for (const l of c.items)
      if (l.aiRead !== undefined && l.aiRead !== null)
        expect(toneOf(aiRead, l), String(l.lineNo)).toBe(l.aiRead < 85 ? "warning" : undefined);
    // The clarifications: the open one "Waiting", in amber.
    expect(titled(page, "Clarifications log").records).toMatchObject({ doc: true, field: "clarifications" });
    const waiting = c.clarifications.filter((q: Json) => q.reply === "Waiting");
    expect(waiting).toHaveLength(1);
    expect(toneOf(fieldAt(fields, "clarifications.reply")!, waiting[0])).toBe("warning");
    // The audit trail, newest first: each entry names the rule that fired or the person.
    // The activities collection itself, on its timeline (its `kind` is each entry's status).
    const log = titled(page, "Activity timeline").collection!;
    expect(log).toMatchObject({ collection: "activities", layout: "timeline", sort: "-at" });
    const q = stringify({ where: { case: { equals: "gs-rfq-0142" } }, sort: log.sort, limit: 0, depth: 1 });
    const entries = (await call("GET", `/api/activities?${q}`)).body.docs as Json[];
    expect(entries.length).toBeGreaterThan(1);
    expect(entries.every((a) => /^(Automatic|Human|Alert)/.test(a.byline))).toBe(true);
    expect(entries.filter((a) => a.rule).every((a) => a.byline.endsWith(`rule: ${a.rule}`))).toBe(true);
    expect(entries.filter((a) => a.kind === "human" && a.actor).every((a) => a.byline.includes(a.actor.name))).toBe(
      true,
    );
    expect(fieldAt(Activities.fields as Field[], "kind")!.custom.tones).toMatchObject({ alert: "warning" });
  });

  it("rfqs: table with reminders, simulate replies shows what arrived", async () => {
    const page = caseRfqs.clientProps.page;
    const before = await draw(page, "gs-rfq-0142");
    const simulate = card(before, "Supplier RFQs").actions[0];
    expect(simulate.label).toBe("Simulate replies");
    expect(card(before, "Draft supplier RFQs")).toBeTruthy();
    const sim = await call("POST", `/api${simulate.call.path}`);
    expect(sim.status).toBe(200);
    const after = await draw(page, "gs-rfq-0142");
    expect(card(after, "Replies arriving")).toBeTruthy();
    // Each new supplier saved from a reply is a card of its own.
    expect(text(after)).toMatch(/New · quoted, never ordered/);
    expect(card(after, "Needs a person")).toBeTruthy();
    // Nothing left waiting: the presenter is told to send RFQs first.
    expect((await call("POST", `/api${simulate.call.path}`)).status).toBe(400);
    const full = await draw(page, "gs-rfq-0142", { send: "full" });
    expect(text(card(full, "Draft supplier RFQs"))).toMatch(/General chandlers/);
  });

  it("rfqs: draft, remove one and send the supplier RFQs kept on the server", async () => {
    const page = caseRfqs.clientProps.page;
    const before = await draw(page, "gs-rfq-0142");
    expect(card(before, "Drafted supplier RFQs")).toBeFalsy();
    const draft = blocks({ blocks: [card(before, "Draft supplier RFQs")] })
      .find((b) => b.type === "actions")
      .items.find((a: Json) => a.label === "Draft RFQs");
    const lines = draft.fields.find((f: Json) => f.name === "lineNos");
    expect(lines.options.length).toBeGreaterThan(0);
    const values = { lineNos: lines.options.map((o: Json) => o.value) };
    const planned = await call("POST", `/api${draft.call.path}`, { ...draft.call.body, ...values });
    expect(planned.status).toBe(200);
    const n = planned.body.drafts.length;
    expect(n).toBeGreaterThan(1);

    const withDrafts = await draw(page, "gs-rfq-0142");
    const drafted = card(withDrafts, "Drafted supplier RFQs");
    expect(drafted.count).toBe(n);
    // Each draft's email is a tile of its own, after the list of drafts.
    expect(blocks(withDrafts).filter((b) => b.type === "message")).toHaveLength(n);
    const remove = blocks({ blocks: [drafted] }).find((b) => b.type === "list").items[0].actions[0];
    expect(remove.label).toBe("Remove");
    expect((await call("POST", `/api${remove.call.path}`, remove.call.body)).status).toBe(200);

    const left = card(await draw(page, "gs-rfq-0142"), "Drafted supplier RFQs");
    expect(left.count).toBe(n - 1);
    const send = left.actions.find((a: Json) => a.label.startsWith("Send"));
    expect(send.label).toBe(`Send ${n - 1} RFQ${n - 1 === 1 ? "" : "s"}`);
    expect(send.confirm.heading).toBe("Send these supplier RFQs?");
    const sent = await call("POST", `/api${send.call.path}`, send.call.body);
    expect(sent.status).toBe(201);
    expect(sent.body.sent).toHaveLength(n - 1);
    expect(card(await draw(page, "gs-rfq-0142"), "Drafted supplier RFQs")).toBeFalsy();
    expect((await call("POST", `/api${send.call.path}`)).status).toBe(400);
  });

  it("compare: per-line cards, landed ranking, split selection, hidden for Sales", async () => {
    const page = caseCompare.clientProps.page;
    const unit = await draw(page, "gs-rfq-0142");
    expect(card(unit, "How offers are compared")).toBeTruthy();
    expect(card(unit, "L2 · LOCTITE 243")).toBeTruthy();
    expect(card(unit, "Correction request")).toBeTruthy();
    const helmet = card(unit, "L5 · Safety helmet");
    expect(helmet).toBeTruthy();
    const landed = await draw(page, "gs-rfq-0142", { by: "landed" });
    expect(text(landed)).toMatch(/Landed · EGP/);
    const useSplit = blocks({ blocks: [helmet] })
      .find((b) => b.type === "actions")
      .items.find((a: Json) => a.label === "Use suggested split");
    const values = Object.fromEntries(
      useSplit.fields.filter((f: Json) => f.name !== "reason").map((f: Json) => [f.name, f.defaultValue]),
    );
    const saved = await call("POST", `/api${useSplit.call.path}`, { ...useSplit.call.body, ...values });
    expect(saved.status).toBe(200);
    await login("soaad.amer");
    const sales = await draw(page, "gs-rfq-0142");
    expect(text(sales)).toMatch(/hidden for your role/);
    expect(card(sales, "L5 · Safety helmet")).toBeFalsy();
  });

  it("pricing: margin vs markup, approval request, Sales sees the quotation link", async () => {
    const page = casePricing.clientProps.page;
    const body = await draw(page, "gs-rfq-0142");
    expect(text(body)).toMatch(/Margin = profit ÷ selling price/);
    expect(text(body)).toMatch(/Markup = profit ÷ landed cost/);
    expect(card(body, "Costs and margins are hidden")).toBeFalsy();
    expect(blocks(body).some((b) => b.type === "form")).toBe(true);
    const approval = card(body, "Approval");
    expect(approval).toBeTruthy();
    const request = blocks(approval)
      .find((b) => b.type === "actions")
      .items.find((a: Json) => a.label.startsWith("Request approval"));
    expect((await call("POST", `/api${request.call.path}`, { note: "Launch estimate confirmed" })).status).toBe(200);
    await login("soaad.amer");
    const sales = await draw(page, "gs-rfq-0142");
    expect(text(sales)).toMatch(/hidden for your role/);
    expect(text(sales)).toMatch(/View quotation/);
    expect(text(sales)).not.toMatch(/Markup = profit ÷ landed cost/);
  });

  it("profit: expected vs actual, FX, claims and the close checklist; refused to Sales", async () => {
    const page = caseProfit.clientProps.page;
    await login("mohamed.helmy");
    const body = await draw(page, "gs-rfq-0131");
    for (const h of ["Expected vs actual cost", "FX differences", "Claims", "Close checklist"])
      expect(card(body, h), h).toBeTruthy();
    expect(text(card(body, "Close checklist"))).toMatch(/Close case/);
    await login("soaad.amer");
    const sales = await draw(page, "gs-rfq-0131");
    expect(text(sales)).toMatch(/not visible to Sales/);
    expect(card(sales, "Close checklist")).toBeFalsy();
  });
});
