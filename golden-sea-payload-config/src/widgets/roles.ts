import { block, note, type Action, type PromptField, type Row } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { RolesView, Routing } from "../endpoints/platform.ts";
import type { Doc } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";

/**
 * Roles & permissions (/roles): the permissions matrix per role and person (the settings
 * global; management switches permissions, others read), where each permission is enforced with
 * live checks, the after-hours routing simulator (`?at=`: urgent RFQs outside Sun–Thu 08:00–17:00
 * go to the on-duty person) and the on-call roster (the `on-call-roster` global; management and
 * the office manager edit it). Data: GET /api/roles, GET /api/on-call/route?at= and the people
 * (users); actions: POST /api/roles/permission, /api/roles/roster, /api/on-call/route
 * (../endpoints/platform.ts).
 */

/** Simulator presets (Cairo time; the demo is set on Tue 17 Nov, 11:30). */
const PRESETS = [
  { label: "Tue 17 Nov 11:30 — office hours", at: "2026-11-17T09:30:00.000Z" },
  { label: "Tonight 21:40", at: "2026-11-17T19:40:00.000Z" },
  { label: "Fri 20 Nov 10:00 — weekend", at: "2026-11-20T08:00:00.000Z" },
  { label: "Sat 21 Nov 14:00 — weekend", at: "2026-11-21T12:00:00.000Z" },
  { label: "Sun 22 Nov 06:30 — before office", at: "2026-11-22T04:30:00.000Z" },
];

const roles: Source = { endpoint: "/roles" };
const on = from<RolesView>(roles);

const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

const matrix = on({
  title: "Permissions matrix",
  skeleton: "table",
  head: (d) => ({ tags: d.canEditPermissions ? undefined : [{ label: "Read only — management edits" }] }),
  render: (d) => {
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
              call: edit ? { path: "/roles/permission", body: { role: r.role, key: p.key } } : undefined,
              done: "Permissions saved (logged on the audit trail)",
            },
          },
        ]),
      ),
    }));
    return [
      note(
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
    ];
  },
});

const enforced = on({
  title: "Enforced, not just written down",
  skeleton: "list",
  render: (d) => [
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
      actions: [{ label: "Open GS-RFQ-0142 pricing", href: link.doc("cases", "gs-rfq-0142", "pricing") }],
    }),
  ],
});

/** The simulator: its own request, so picking a time asks only who the RFQ goes to then. */
const simulator: Widget<Routing> = {
  title: "After-hours routing — try it",
  skeleton: "text",
  source: { endpoint: "/on-call/route", query: { at: "$param.at" } },
  render: (r) => {
    const alert: Action | undefined = r.routedTo
      ? {
          label: "Send the alert (simulated)",
          call: { path: "/on-call/route", body: { at: r.at, simulate: true } },
          done: `Alert sent to ${r.routedTo.name} (WhatsApp / SMS simulated · notification created)`,
        }
      : undefined;
    return [
      note(
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
      block("heading", { text: r.atText }),
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
        : [note("Office hours — the case owner picks it up; no alert needed")]),
    ];
  },
};

interface RosterData {
  roles: RolesView;
  people: { docs: Doc[] };
}

/** The roster's edit form offers every person (the users collection, by name). */
function save(d: RolesView, people: Doc[]): Action {
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
  return {
    label: "Edit roster",
    main: true,
    call: { path: "/roles/roster" },
    confirm: {
      heading: "Save the on-call roster?",
      text: "The new shifts decide who is alerted after hours from now on. The change is logged.",
      label: "Save",
    },
    fields,
    done: "Roster saved",
  };
}

const roster: Widget<RosterData> = {
  title: "On-call roster",
  skeleton: "table",
  source: { all: { roles, people: { find: "users", sort: "name", limit: 100, depth: 0 } } },
  head: ({ roles: d, people }) =>
    d.canEditRoster
      ? { actions: [save(d, people.docs)] }
      : { tags: [{ label: "Read only — management & office manager edit" }] },
  render: ({ roles: d }) => [
    note(
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
};

export const rolesPage = widgets({
  header: {
    eyebrow: "Team · access",
    heading: "Roles & permissions",
    subtitle:
      "Sales never sees costs or margins; approvals need a named person; bank-detail changes need two. Urgent RFQs after hours go to whoever is on call.",
    actions: [
      { label: "People", href: link.list("users") },
      { label: "Approval rules", href: link.global("approval-rules") },
    ],
  },
  widgets: [matrix, { grid: [enforced, simulator] }, roster],
});
