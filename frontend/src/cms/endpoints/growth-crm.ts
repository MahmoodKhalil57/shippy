import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "../../mock/types.ts";
import { GROWTH_STAGES, SALES_RESULTS } from "../collections/growth.ts";
import { logActivity } from "../collections/shared.ts";
import {
  NOW,
  type Tone,
  all,
  body,
  date,
  docHref,
  fail,
  fmtDay,
  idOf,
  meOf,
  nameOf,
  num,
  str,
  unauthorized,
} from "./insights-shared.ts";

/**
 * The growth CRM (root view /growth), kept apart from operational RFQs:
 *
 * - GET /api/growth — prospects by stage, fleets per ship manager (vessels with IMO), vendor
 *   registrations, campaigns and the sales next steps with their "what to say" scripts.
 * - POST /api/growth/:id/outcome { result, note, nextStep, nextStepDue, stage? } — records what
 *   happened on a next step: appends the outcome to the opportunity, plans the next step (and its
 *   task on the owner's follow-ups), closes the step's open task and logs it.
 */

/** The board's columns, in order ("Closed" stays off the board). */
export const BOARD_STAGES = GROWTH_STAGES.filter((s) => s !== "Closed");

export interface Deal {
  id: string;
  href: string;
  name: string;
  kind: string;
  stage: string;
  value: string;
  owner: string;
  source: string;
  next: string;
  due: string;
  overdue: boolean;
  noNext: boolean;
}
export interface FleetVessel {
  name: string;
  imo: string;
  type: string;
  href?: string;
  /** Whether Golden Sea has had a case for this vessel. */
  supplied: boolean;
}
export interface Fleet {
  company: string;
  href: string;
  relation: string;
  tone: Tone;
  fleetSize: number;
  vessels: FleetVessel[];
}
export interface Registration {
  id: string;
  href: string;
  company: string;
  portal: string;
  status: string;
  tone: Tone;
  submitted: string;
  committee: string;
  renewBy: string;
  documents: { name: string; status: string }[];
  missing: number;
  next: string;
}
export interface CampaignRow {
  id: string;
  href: string;
  name: string;
  audience: string;
  recipients: number;
  consentOnly: boolean;
  content: string;
  status: string;
  scheduled: string;
  stats?: { sent: number; opened: number; replied: number };
}
export interface NextStep {
  id: string;
  href: string;
  company: string;
  stage: string;
  who: string;
  channel: string;
  goal: string;
  due: string;
  overdue: boolean;
  owner: string;
  ownerId: string;
  script: string;
  noNext: boolean;
  last?: { result: string; note: string; at: string; by: string };
}
export interface Growth {
  stages: string[];
  columns: { stage: string; deals: Deal[] }[];
  fleets: Fleet[];
  registrations: Registration[];
  campaigns: CampaignRow[];
  steps: NextStep[];
  results: string[];
  /** Only management schedules or sends campaigns. */
  canSend: boolean;
  totals: { open: number; noNext: number; dueThisWeek: number; registrations: number };
}

const REG_TONE: Record<string, Tone> = {
  "Documents requested": "warning",
  Submitted: "info",
  "Under review": "info",
  Approved: "success",
  Rejected: "error",
  "Renewal overdue": "error",
};

export async function growth(req: PayloadRequest): Promise<Growth> {
  const me = meOf(req)!;
  const [opps, regs, campaigns, customers, vessels, cases, users] = await Promise.all(
    ["opportunities", "vendor-registrations", "campaigns", "customers", "vessels", "cases", "users"].map((c) =>
      all(req, c, 0),
    ),
  );
  const userName = (v: unknown) => str(users.find((u) => u.id === idOf(v))?.name ?? nameOf(v));
  const open = opps.filter((o) => o.stage !== "Closed");
  const noNext = (o: Doc) => !o.nextStep && o.stage !== "Active account" && o.stage !== "Closed";
  const day = (v: unknown) => (date(v) ? fmtDay(date(v)!) : "");

  const deal = (o: Doc): Deal => ({
    id: o.id,
    href: docHref("opportunities", o.id),
    name: str(o.name),
    kind: str(o.kind),
    stage: str(o.stage),
    value: str(o.estimatedValue),
    owner: userName(o.owner),
    source: str(o.source),
    next: str(o.nextStep),
    due: day(o.nextStepDue),
    overdue: Boolean(date(o.nextStepDue) && date(o.nextStepDue)! < new Date(NOW.toISOString().slice(0, 10))),
    noNext: noNext(o),
  });
  const byDue = (a: Doc, b: Doc) => str(a.nextStepDue || "9999").localeCompare(str(b.nextStepDue || "9999"));

  /* fleets: customers (their vessel records) and prospects (the fleet on the opportunity) */
  const suppliedVessels = new Set(cases.map((c) => str(c.vessel).toLowerCase()));
  const fleets: Fleet[] = [];
  for (const c of customers) {
    if (!["Ship manager", "Shipowner"].includes(str(c.type))) continue;
    const own = vessels.filter((v) => idOf(v.customer) === c.id);
    const opp = opps.find((o) => idOf(o.customer) === c.id);
    fleets.push({
      company: str(c.name),
      href: docHref("customers", c.id),
      relation: `Customer · ${str((c.registration as { status?: string } | undefined)?.status) || str(c.type)}`,
      tone: /overdue/i.test(str((c.registration as { status?: string } | undefined)?.status)) ? "warning" : "success",
      fleetSize: num(c.fleetSize) || num(opp?.fleetSize) || own.length,
      vessels: own.map((v) => ({
        name: str(v.name),
        imo: str(v.imo),
        type: str(v.vesselType),
        href: docHref("vessels", v.id),
        supplied: [...suppliedVessels].some((s) =>
          s.includes(
            str(v.name)
              .toLowerCase()
              .replace(/^(mv|mt) /, ""),
          ),
        ),
      })),
    });
  }
  for (const o of open) {
    if (idOf(o.customer)) continue;
    const fleet = (o.fleet as { name?: string; imo?: string; vesselType?: string }[] | undefined) ?? [];
    if (!fleet.length && !num(o.fleetSize)) continue;
    fleets.push({
      company: str(o.name),
      href: docHref("opportunities", o.id),
      relation: `Prospect · ${str(o.stage)}`,
      tone: "info",
      fleetSize: num(o.fleetSize) || fleet.length,
      vessels: fleet.map((v) => ({ name: str(v.name), imo: str(v.imo), type: str(v.vesselType), supplied: false })),
    });
  }

  const registrations: Registration[] = regs.map((r) => {
    const documents = ((r.documents as { name?: string; status?: string }[] | undefined) ?? []).map((d) => ({
      name: str(d.name),
      status: str(d.status) || "Missing",
    }));
    return {
      id: r.id,
      href: docHref("vendor-registrations", r.id),
      company: str(r.company),
      portal: str(r.portal),
      status: str(r.status),
      tone: REG_TONE[str(r.status)] ?? "neutral",
      submitted: day(r.submittedAt),
      committee: day(r.committeeDate),
      renewBy: day(r.renewBy),
      documents,
      missing: documents.filter((d) => d.status === "Missing" || d.status === "Expired").length,
      next: str(r.nextStep),
    };
  });

  const campaignRows: CampaignRow[] = campaigns.map((c) => {
    const s = c.stats as { sent?: number; opened?: number; replied?: number } | undefined;
    return {
      id: c.id,
      href: docHref("campaigns", c.id),
      name: str(c.name),
      audience: str(c.audience),
      recipients: num(c.recipients),
      consentOnly: c.consentOnly !== false,
      content: str(c.contentStatus) || "Draft",
      status: str(c.status) || "Draft",
      scheduled: date(c.scheduledAt) ? `${fmtDay(date(c.scheduledAt)!)} ${str(c.scheduledAt).slice(11, 16)}` : "",
      stats: s && num(s.sent) ? { sent: num(s.sent), opened: num(s.opened), replied: num(s.replied) } : undefined,
    };
  });

  const steps: NextStep[] = open
    .filter((o) => o.stage !== "Active account" || o.nextStep)
    .sort(byDue)
    .map((o) => {
      const outs = (o.outcomes as { at?: string; result?: string; note?: string; by?: unknown }[] | undefined) ?? [];
      const last = outs.at(-1);
      const d = deal(o);
      return {
        id: o.id,
        href: d.href,
        company: d.name,
        stage: d.stage,
        who: str(o.contact),
        channel: str(o.channel) || "Call",
        goal: d.next,
        due: d.due,
        overdue: d.overdue,
        owner: d.owner,
        ownerId: str(idOf(o.owner)),
        script: str(o.script),
        noNext: d.noNext,
        last: last
          ? { result: str(last.result), note: str(last.note), at: day(last.at), by: userName(last.by) }
          : undefined,
      };
    });

  const weekEnd = new Date(NOW.getTime() + 7 * 86_400_000);
  return {
    stages: BOARD_STAGES,
    columns: BOARD_STAGES.map((stage) => ({
      stage,
      deals: open
        .filter((o) => o.stage === stage)
        .sort(byDue)
        .map(deal),
    })),
    fleets,
    registrations,
    campaigns: campaignRows,
    steps,
    results: SALES_RESULTS,
    canSend: str(me.role) === "management",
    totals: {
      open: open.length,
      noNext: open.filter(noNext).length,
      dueThisWeek: open.filter((o) => date(o.nextStepDue) && date(o.nextStepDue)! <= weekEnd).length,
      registrations: regs.filter((r) => !["Approved", "Rejected"].includes(str(r.status))).length,
    },
  };
}

export const growthEndpoints: Endpoint[] = [
  {
    path: "/growth",
    method: "get",
    handler: async (req) => {
      if (!meOf(req)) return unauthorized();
      return Response.json(await growth(req));
    },
  },
  {
    // POST /api/growth/:id/outcome — record what happened and plan the next step.
    path: "/growth/:id/outcome",
    method: "post",
    handler: async (req) => {
      const me = meOf(req);
      if (!me) return unauthorized();
      const id = str(req.routeParams?.id);
      const opp = (await req.payload
        .findByID({ collection: "opportunities" as never, id, depth: 0 })
        .catch(() => null)) as unknown as Doc | null;
      if (!opp) return fail(404, "Opportunity not found.");
      const input = await body(req);
      const result = str(input.result);
      if (!SALES_RESULTS.includes(result)) return fail(400, "Choose an outcome.");
      const nextStep = str(input.nextStep).trim();
      const nextStepDue = str(input.nextStepDue);
      const stage = str(input.stage) || str(opp.stage);
      if (!GROWTH_STAGES.includes(stage)) return fail(400, "Unknown stage.");
      if (stage !== "Closed" && stage !== "Active account" && (!nextStep || !nextStepDue))
        return fail(400, "Plan the next step and its date (or close the opportunity).");
      const due = nextStepDue
        ? new Date(nextStepDue.length === 10 ? `${nextStepDue}T09:00:00.000Z` : nextStepDue)
        : null;
      if (due && Number.isNaN(due.getTime())) return fail(400, "The next step date isn't a date.");
      const at = new Date().toISOString();
      const outcomes = [
        ...((opp.outcomes as unknown[] | undefined) ?? []),
        { at, result, note: str(input.note), by: me.id },
      ];
      await req.payload.update({
        collection: "opportunities" as never,
        id,
        data: {
          outcomes,
          stage,
          nextStep: nextStep || null,
          nextStepDue: due ? due.toISOString() : null,
        } as never,
        req,
      });

      // The step's open task (on the owner's follow-ups) is done; the next one is planned.
      const name = str(opp.name).toLowerCase();
      const key = name.split(" ").slice(0, 2).join(" ");
      const tasks = (await all(req, "tasks", 0)).filter(
        (t) =>
          t.type === "Sales next step" &&
          (t.status ?? "Open") === "Open" &&
          (idOf(t.opportunity) === id || (!idOf(t.opportunity) && str(t.title).toLowerCase().includes(key))),
      );
      for (const t of tasks)
        await req.payload.update({
          collection: "tasks" as never,
          id: t.id,
          data: {
            status: "Done",
            outcome: { result, note: str(input.note), nextDate: due ? due.toISOString() : null },
          } as never,
          req,
        });
      if (nextStep && due)
        await req.payload.create({
          collection: "tasks" as never,
          data: {
            title: `${nextStep} — ${str(opp.name)}`,
            type: "Sales next step",
            channel: str(opp.channel) || "Call",
            due: due.toISOString(),
            opportunity: id,
            who: str(opp.contact) || undefined,
            goal: nextStep,
            script: str(opp.script) || undefined,
            owner: idOf(opp.owner) ?? me.id,
            status: "Open",
          } as never,
          req,
        });
      await logActivity(req, {
        text: `${str(opp.name)}: ${result}${input.note ? ` — ${str(input.note)}` : ""}. ${nextStep ? `Next: ${nextStep} (${due ? fmtDay(due) : ""}).` : `Stage: ${stage}.`}`,
        entity: `opportunities/${id}`,
      });
      // `message`: what the screen says once it's saved (the action's snackbar).
      const message =
        nextStep && due
          ? `Outcome saved — next step “${nextStep}” planned for ${due.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
          : `Outcome saved — ${str(opp.name)} is now “${stage}”`;
      return Response.json({ ...(await growth(req)), message });
    },
  },
];
