import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type PromptField, type Row, type View } from "../../app/view/schema.ts";
import { PERMISSIONS } from "../globals/index.ts";
import { platformEndpoints, routeUrgent, type RolesView, type Routing } from "../endpoints/platform.ts";
import type { Doc } from "../types.ts";
import { bodyOf, refuse, via } from "./via.ts";

/**
 * Roles & permissions (/roles): the permissions matrix per role and person (the settings
 * global; management switches permissions, others read), where each permission is enforced with
 * live checks, the after-hours routing simulator (`?at=`: urgent RFQs outside Sun–Thu 08:00–17:00
 * go to the on-duty person) and the on-call roster (the `on-call-roster` global; management and
 * the office manager edit it). Data: GET /api/roles; the alert: POST /api/on-call/route.
 */

/** Simulator presets (Cairo time; the demo is set on Tue 17 Nov, 11:30). */
const PRESETS = [
  { label: "Tue 17 Nov 11:30 — office hours", at: "2026-11-17T09:30:00.000Z" },
  { label: "Tonight 21:40", at: "2026-11-17T19:40:00.000Z" },
  { label: "Fri 20 Nov 10:00 — weekend", at: "2026-11-20T08:00:00.000Z" },
  { label: "Sat 21 Nov 14:00 — weekend", at: "2026-11-21T12:00:00.000Z" },
  { label: "Sun 22 Nov 06:30 — before office", at: "2026-11-22T04:30:00.000Z" },
];

const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const role = (req: PayloadRequest) => str((req.user as Doc | null)?.role);
const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });

function matrix(d: RolesView) {
  const edit = d.canEditPermissions;
  const rows: Row[] = d.roles.map((r) => ({
    role: { text: r.label, strong: true, tags: r.users.map((u) => ({ label: u.name })) },
    note: [r.users.length ? "" : "System account", typeof r.note === "string" ? r.note : ""]
      .filter(Boolean)
      .join(" · "),
    ...Object.fromEntries(
      d.permissions.map((p) => [
        p.key,
        {
          text: `${r.label}: ${p.label}`,
          switch: {
            value: r[p.key] === true,
            call: edit ? { path: "/views/roles/permission", body: { role: r.role, key: p.key } } : undefined,
            done: "Permissions saved (logged on the audit trail)",
          },
        },
      ]),
    ),
  }));
  return block("card", {
    heading: "Permissions matrix",
    tags: edit ? undefined : [{ label: "Read only — management edits" }],
    blocks: [
      muted(
        `Who can see and approve what, per role and person. Named users and licences are confirmed in Phase 0.${
          edit ? " Changes apply to every person in the role and are logged on the audit trail." : ""
        }`,
      ),
      block("table", {
        columns: [
          { key: "role", label: "Role · people", supporting: "note" },
          ...d.permissions.map((p) => ({ key: p.key, label: p.label })),
        ],
        rows,
      }),
    ],
  });
}

function enforced(d: RolesView) {
  return block("card", {
    heading: "Enforced, not just written down",
    blocks: [
      block("list", {
        items: d.checks.map((c) => ({
          headline: c.label,
          supporting: c.detail,
          tags: [{ label: c.pass ? "Verified" : "Failing", tone: c.pass ? "success" : "error" }],
        })),
      }),
      block("divider", {}),
      block("details", { layout: "inline", items: d.permissions.map((p) => ({ label: p.label, value: p.enforced })) }),
      block("alert", {
        tone: "info",
        text: "Try it: switch the signed-in user to Soaad Amer (Sales) and open the pricing tab of GS-RFQ-0142 — costs and margins are gone.",
        actions: [{ label: "Open GS-RFQ-0142 pricing", href: "/collections/cases/gs-rfq-0142/pricing" }],
      }),
    ],
  });
}

function simulator(r: Routing) {
  const alert: Action | undefined = r.routedTo
    ? {
        label: "Send the alert (simulated)",
        call: { path: "/on-call/route", body: { at: r.at, simulate: true } },
        done: `Alert sent to ${r.routedTo.name} (WhatsApp / SMS simulated · notification created)`,
      }
    : undefined;
  return block("card", {
    heading: "After-hours routing — try it",
    blocks: [
      muted(
        "Pick when an urgent RFQ arrives. The rule “After-hours & weekend RFQ” decides who is alerted; the alert is simulated and lands in that person's notifications.",
      ),
      block("choice", {
        param: "at",
        label: "When the urgent RFQ arrives",
        value: r.at,
        options: PRESETS.map((p) => ({ value: p.at, label: p.label })),
      }),
      block("tags", {
        items: [{ label: r.inHours ? "Office hours" : "After hours", tone: r.inHours ? "info" : "warning" }],
      }),
      block("text", { text: r.atText, variant: "title-md" }),
      block("text", { text: r.reason }),
      ...(r.routedTo
        ? [
            block("steps", {
              direction: "vertical",
              tone: "warning",
              current: 0,
              items: [
                { label: `Now: ${r.routedTo.name} (on duty)` },
                { label: `+${r.escalateAfterMinutes} min: ${r.backup?.name ?? "—"} (backup)` },
                { label: `Then: ${r.senior.map((p) => p.name).join(", ")} (senior)` },
              ],
            }),
            block("actions", { items: [alert!] }),
          ]
        : [muted("Office hours — the case owner picks it up; no alert needed")]),
    ],
  });
}

function roster(d: RolesView, people: Doc[]) {
  const edit = d.canEditRoster;
  const options = people.map((u) => ({ label: str(u.name) || u.id, value: u.id }));
  const fields: PromptField[] = d.roster.shifts.flatMap((s, i) => [
    {
      type: "select",
      name: `user${i}`,
      label: `On duty, ${s.fromText}`,
      required: true,
      options,
      defaultValue: s.user?.id ?? "",
      admin: { width: "50%" },
    },
    {
      type: "select",
      name: `backup${i}`,
      label: `Backup, ${s.fromText}`,
      options,
      defaultValue: s.backup?.id ?? "",
      admin: { width: "50%" },
    },
  ]);
  const save: Action = {
    label: "Edit roster",
    variant: "filled",
    call: { path: "/views/roles/roster" },
    confirm: {
      heading: "Save the on-call roster?",
      text: "The new shifts decide who is alerted after hours from now on. The change is logged.",
      label: "Save",
    },
    fields,
    done: "Roster saved",
  };
  return block("card", {
    heading: "On-call roster",
    tags: edit ? undefined : [{ label: "Read only — management & office manager edit" }],
    actions: edit ? [save] : undefined,
    blocks: [
      muted(
        `Office hours Sun–Thu 08:00–17:00 Cairo. Outside them, urgent RFQs (or a vessel ETA under 24 h) alert the on-duty person by WhatsApp / SMS; the backup after ${d.roster.escalateAfterMinutes} min, then senior contacts: ${d.roster.senior.map((p) => p.name).join(", ")}.`,
      ),
      block("table", {
        columns: [
          { key: "shift", label: "Shift (Cairo)" },
          { key: "user", label: "On duty" },
          { key: "backup", label: "Backup" },
        ],
        rows: d.roster.shifts.map((s) => ({
          shift: {
            text: `${s.fromText} → ${s.toText}`,
            tags: s.now ? [{ label: "Now", tone: "primary" as const }] : undefined,
          },
          user: { text: s.user?.name ?? "—", strong: true },
          backup: s.backup?.name ?? "—",
        })),
      }),
    ],
  });
}

async function log(req: PayloadRequest, text: string, entity: string) {
  await req.payload.create({
    collection: "activities",
    data: { kind: "human", text, entity, actor: (req.user as Doc | null)?.id },
    req,
    overrideAccess: false,
  } as never);
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/roles?at=<iso>: roles & permissions as a View (src/app/view).
    path: "/views/roles",
    method: "get",
    handler: async (req) => {
      const d = await via<RolesView>(platformEndpoints, "get", "/roles", req);
      if (d instanceof Response) return d;
      const at = str(req.query?.at);
      const preset = PRESETS.find((p) => p.at === at);
      const [routing, users] = await Promise.all([
        preset ? routeUrgent(req, new Date(preset.at)) : Promise.resolve(d.now),
        req.payload.find({ collection: "users", pagination: false, depth: 0, sort: "name" } as never),
      ]);
      const view: View = {
        header: {
          eyebrow: "Team · access",
          heading: "Roles & permissions",
          subtitle:
            "Sales never sees costs or margins; approvals need a named person; bank-detail changes need two. Urgent RFQs after hours go to whoever is on call.",
          actions: [
            { label: "People", href: "/collections/users" },
            { label: "Approval rules", href: "/globals/approval-rules" },
          ],
        },
        blocks: [
          matrix(d),
          block("grid", { fit: "md", blocks: [enforced(d), simulator(routing)] }),
          roster(d, users.docs as unknown as Doc[]),
        ],
      };
      return Response.json(view);
    },
  },
  {
    // POST /api/views/roles/permission { role, key, value }: switch one permission of a role (management).
    path: "/views/roles/permission",
    method: "post",
    handler: async (req) => {
      if (!req.user) return refuse("Please sign in.", 401);
      if (role(req) !== "management") return refuse("Only management edits permissions.");
      const b = await bodyOf(req);
      const key = str(b.key);
      if (!PERMISSIONS.some((p) => p.key === key)) return refuse("Unknown permission.", 400);
      const settings = await req.payload.findGlobal({ slug: "settings", depth: 0 } as never);
      const permissions = ((settings.permissions as Record<string, unknown>[] | undefined) ?? []).map((r) =>
        r.role === str(b.role) ? { ...r, [key]: b.value === true } : r,
      );
      await req.payload.updateGlobal({ slug: "settings", data: { permissions }, req, overrideAccess: false } as never);
      await log(req, "Updated the roles & permissions matrix.", "globals/settings");
      return Response.json({ ok: true });
    },
  },
  {
    // POST /api/views/roles/roster { user<i>, backup<i> }: who is on duty for each shift.
    path: "/views/roles/roster",
    method: "post",
    handler: async (req) => {
      if (!req.user) return refuse("Please sign in.", 401);
      if (!["management", "office-admin"].includes(role(req)))
        return refuse("Management and the office manager edit the roster.");
      const b = await bodyOf(req);
      const roster = await req.payload.findGlobal({ slug: "on-call-roster", depth: 0 } as never);
      const shifts = ((roster.shifts as Record<string, unknown>[] | undefined) ?? []).map((s, i) => ({
        from: s.from,
        to: s.to,
        user: str(b[`user${i}`]) || s.user,
        backup: str(b[`backup${i}`]) || null,
      }));
      await req.payload.updateGlobal({
        slug: "on-call-roster",
        data: { ...roster, shifts },
        req,
        overrideAccess: false,
      } as never);
      await log(req, "Updated the on-call roster.", "globals/on-call-roster");
      return Response.json({ ok: true });
    },
  },
];
