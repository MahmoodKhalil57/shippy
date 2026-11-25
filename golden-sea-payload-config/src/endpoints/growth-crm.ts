import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { GROWTH_STAGES, SALES_RESULTS } from "../collections/growth.ts";
import { logActivity } from "../collections/shared.ts";
import { m } from "../i18n/paraglide/messages.js";
import {
  type Tone,
  all,
  body,
  docHref,
  fail,
  fmtDay,
  idOf,
  intlLocale,
  langOf,
  meOf,
  num,
  optionLabel,
  str,
  unauthorized,
} from "./insights-shared.ts";

export interface FleetVessel {
  name: string;
  imo: string;
  type: string;
  href?: string;
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
export interface Growth {
  fleets: Fleet[];
}

export async function growth(req: PayloadRequest): Promise<Growth> {
  const [opps, customers, vessels, cases] = await Promise.all(
    ["opportunities", "customers", "vessels", "cases"].map((c) => all(req, c, 0)),
  );
  const open = opps.filter((o) => o.stage !== "Closed");
  const o = { locale: langOf(req) };

  const suppliedVessels = new Set(cases.map((c) => str(c.vessel).toLowerCase()));
  const fleets: Fleet[] = [];
  for (const c of customers) {
    if (!["Ship manager", "Shipowner"].includes(str(c.type))) continue;
    const own = vessels.filter((v) => idOf(v.customer) === c.id);
    const opp = opps.find((o) => idOf(o.customer) === c.id);
    fleets.push({
      company: str(c.name),
      href: docHref("customers", c.id),
      relation: m.api_growth_crm_customer_relation(
        {
          status:
            optionLabel(
              req,
              "customers",
              "registration.status",
              (c.registration as { status?: string } | undefined)?.status,
            ) || optionLabel(req, "customers", "type", c.type),
        },
        o,
      ),
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
  for (const p of open) {
    if (idOf(p.customer)) continue;
    const fleet = (p.fleet as { name?: string; imo?: string; vesselType?: string }[] | undefined) ?? [];
    if (!fleet.length && !num(p.fleetSize)) continue;
    fleets.push({
      company: str(p.name),
      href: docHref("opportunities", p.id),
      relation: m.api_growth_crm_prospect_relation({ stage: optionLabel(req, "opportunities", "stage", p.stage) }, o),
      tone: "info",
      fleetSize: num(p.fleetSize) || fleet.length,
      vessels: fleet.map((v) => ({ name: str(v.name), imo: str(v.imo), type: str(v.vesselType), supplied: false })),
    });
  }

  return { fleets };
}

export const growthEndpoints: Endpoint[] = [
  {
    path: "/growth",
    method: "get",
    handler: async (req) => {
      if (!meOf(req)) return unauthorized(langOf(req));
      return Response.json(await growth(req));
    },
  },
  {
    path: "/growth/:id/outcome",
    method: "post",
    handler: async (req) => {
      const me = meOf(req);
      const lang = langOf(req);
      const o = { locale: lang };
      if (!me) return unauthorized(lang);
      const id = str(req.routeParams?.id);
      const opp = (await req.payload
        .findByID({ collection: "opportunities" as never, id, depth: 0 })
        .catch(() => null)) as unknown as Doc | null;
      if (!opp) return fail(404, m.api_growth_crm_opportunity_not_found({}, o));
      const input = await body(req);
      const result = str(input.result);
      if (!SALES_RESULTS.includes(result)) return fail(400, m.api_growth_crm_choose_outcome({}, o));
      const nextStep = str(input.nextStep).trim();
      const nextStepDue = str(input.nextStepDue);
      const stage = str(input.stage) || str(opp.stage);
      if (!GROWTH_STAGES.includes(stage)) return fail(400, m.api_growth_crm_unknown_stage({}, o));
      if (stage !== "Closed" && stage !== "Active account" && (!nextStep || !nextStepDue))
        return fail(400, m.api_growth_crm_plan_next_step({}, o));
      const due = nextStepDue
        ? new Date(nextStepDue.length === 10 ? `${nextStepDue}T09:00:00.000Z` : nextStepDue)
        : null;
      if (due && Number.isNaN(due.getTime())) return fail(400, m.api_growth_crm_next_step_date_invalid({}, o));
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

      const resultLabel = optionLabel(req, "opportunities", "outcomes.result", result);
      const stageLabel = optionLabel(req, "opportunities", "stage", stage);

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
            title: m.api_growth_crm_task_title({ step: nextStep, name: str(opp.name) }, o),
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
        text: m.api_growth_crm_activity(
          {
            name: str(opp.name),
            result: resultLabel,
            hasNote: input.note ? "yes" : "no",
            note: str(input.note),
            hasNext: nextStep ? "yes" : "no",
            step: nextStep,
            due: due ? fmtDay(due, lang) : "",
            stage: stageLabel,
          },
          o,
        ),
        entity: `opportunities/${id}`,
      });
      const message =
        nextStep && due
          ? m.api_growth_crm_outcome_planned(
              { step: nextStep, due: due.toLocaleDateString(intlLocale(lang), { day: "numeric", month: "short" }) },
              o,
            )
          : m.api_growth_crm_outcome_stage({ name: str(opp.name), stage: stageLabel }, o);
      return Response.json({ ok: true, message });
    },
  },
];
