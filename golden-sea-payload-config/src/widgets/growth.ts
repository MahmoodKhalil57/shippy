import { block, note, type Action, type Entry, type Tone } from "saastemlycrm-design-system/contracts";
import { widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { Growth, NextStep } from "../endpoints/growth-crm.ts";

/**
 * The growth board (/growth): the growth CRM, kept apart from operational RFQs — prospects by
 * stage, the sales next steps with "what to say" and "Record outcome", fleets per ship manager
 * (vessels with IMO), vendor registrations and campaigns. Data: GET /api/growth; recording an
 * outcome: POST /api/growth/:id/outcome, which answers with what it planned
 * (../endpoints/growth-crm.ts).
 */

const data: Source = { endpoint: "/growth" };
const on = (w: Widget<Growth>): Widget<Growth> => ({ source: data, ...w });

const CHANNEL_ICON: Record<string, string> = {
  Call: "phone",
  Email: "mail",
  WhatsApp: "chat",
  "Site visit": "compass",
  Meeting: "users",
};
const DOC_TONE: Record<string, Tone> = { Submitted: "success", Ready: "info", Missing: "warning", Expired: "error" };
/** A week after the demo's "today". */
const IN_A_WEEK = "2026-11-24";

const stats = on({
  skeleton: "stats",
  render: ({ totals: t }) =>
    block("stats", {
      items: [
        { label: "Open opportunities", value: String(t.open), note: "prospects to active accounts" },
        { label: "Next steps this week", value: String(t.dueThisWeek), note: "calls, emails and visits planned" },
        {
          label: "No next step",
          value: String(t.noNext),
          note: "plan one or close the opportunity",
          tone: t.noNext ? "error" : undefined,
        },
        {
          label: "Registrations in progress",
          value: String(t.registrations),
          note: "waiting on documents or a committee",
          tone: t.registrations ? "warning" : undefined,
        },
      ],
    }),
});

const board = on({
  title: "Prospects by stage",
  head: () => ({ actions: [{ label: "All opportunities", href: "/collections/opportunities", variant: "text" }] }),
  render: (g) => [
    note(
      "Introduced → registration submitted → approved vendor → first RFQ → active account. Every open opportunity has a next step, or it's flagged.",
    ),
    block("grid", {
      fit: "xs",
      blocks: g.columns.map((c) =>
        block("card", {
          heading: c.stage,
          count: c.deals.length,
          variant: "filled",
          blocks: [
            block("list", {
              empty: "—",
              items: c.deals.map((d) => ({
                headline: d.name,
                href: d.href,
                supporting: [
                  d.kind,
                  d.noNext ? "" : d.next ? `Next: ${d.next}${d.due ? ` · ${d.due}` : ""}` : "",
                  [d.value, d.owner, d.source].filter(Boolean).join(" · "),
                ]
                  .filter(Boolean)
                  .join(" · "),
                tags: d.noNext
                  ? [{ label: "No next step — plan one or close", tone: "error" as const }]
                  : d.overdue
                    ? [{ label: "Overdue", tone: "error" as const }]
                    : undefined,
              })),
            }),
          ],
        }),
      ),
    }),
  ],
});

/** "Record outcome": the endpoint saves it and says what was planned (`reply`). */
function outcome(g: Growth, s: NextStep): Action {
  const label = s.noNext ? "Plan next step" : "Record outcome";
  return {
    label,
    call: { path: `/growth/${encodeURIComponent(s.id)}/outcome`, body: { company: s.company } },
    prompt: `${label} — ${s.company}`,
    fields: [
      {
        type: "select",
        name: "result",
        label: "Outcome",
        required: true,
        options: g.results,
        defaultValue: s.noNext ? "Sent" : "Reached — positive",
        admin: s.goal ? { description: `Step: ${s.goal} (${s.channel}, ${s.who || "—"})` } : undefined,
      },
      {
        type: "textarea",
        name: "note",
        label: "What happened",
        admin: { placeholder: "Who said what — e.g. Registration committee meets 24 Nov; documents complete." },
      },
      {
        type: "text",
        name: "nextStep",
        label: "Next step",
        admin: {
          placeholder: "e.g. Call after the committee decision",
          description: "Saved on the opportunity; the next step goes on the owner's follow-ups.",
        },
      },
      { type: "date", name: "nextStepDue", label: "Next step date", defaultValue: IN_A_WEEK, admin: { width: "50%" } },
      {
        type: "select",
        name: "stage",
        label: "Stage",
        options: [...g.stages, "Closed"],
        defaultValue: s.stage,
        admin: { width: "50%" },
      },
    ],
    reply: true,
  };
}

function step(g: Growth, s: NextStep): Entry {
  return {
    heading: s.company,
    meta: [s.who, s.stage, s.owner],
    status: s.noNext
      ? { label: "No next step", tone: "error" }
      : { label: s.overdue ? `Overdue · ${s.due}` : s.due, tone: s.overdue ? "error" : "neutral" },
    tags: [{ label: s.channel, tone: "info", icon: CHANNEL_ICON[s.channel] ?? "phone" }],
    text: s.goal || "Plan the next step, or close the opportunity.",
    facts: s.script ? [{ label: "What to say", value: s.script }] : undefined,
    notes: s.last
      ? [
          `Last: ${s.last.result}${s.last.note ? ` — ${s.last.note}` : ""} (${s.last.by}${s.last.at ? `, ${s.last.at}` : ""})`,
        ]
      : undefined,
    actions: [{ label: "Open", href: s.href }, outcome(g, s)],
  };
}

const steps = on({
  title: "Sales next steps",
  subhead:
    "Each step has a channel, a date and what to say. Call or message yourself, then record what happened — the next step lands on the owner's follow-ups.",
  skeleton: "entries",
  head: (g) => ({ count: g.steps.length }),
  render: (g) => block("entries", { items: g.steps.map((s) => step(g, s)) }),
});

const fleets = on({
  title: "Fleets per ship manager",
  skeleton: "table",
  render: (g) => [
    note("Vessels with IMO for customers and prospects — the room to grow is every vessel we don't supply yet."),
    ...g.fleets.flatMap((f) => [
      block("list", {
        items: [
          {
            headline: f.company,
            href: f.href,
            supporting: `${f.vessels.length} of ${f.fleetSize} vessels on file · ${f.vessels.filter((v) => v.supplied).length} supplied`,
            tags: [{ label: f.relation, tone: f.tone }],
          },
        ],
      }),
      block("table", {
        columns: [
          { key: "name", label: "Vessel" },
          { key: "imo", label: "IMO" },
          { key: "type", label: "Type" },
          { key: "supplied", label: "" },
        ],
        rows: f.vessels.map((v) => ({
          name: v.href ? { text: v.name, href: v.href } : v.name,
          imo: v.imo ? { text: v.imo, mono: true } : null,
          type: v.type || null,
          supplied: { text: v.supplied ? "Supplied" : "Not yet", tone: v.supplied ? "success" : "neutral", tag: true },
        })),
      }),
    ]),
  ],
});

const registrations = on({
  title: "Vendor registrations",
  skeleton: "table",
  head: () => ({
    actions: [{ label: "All registrations", href: "/collections/vendor-registrations", variant: "text" }],
  }),
  render: (g) => [
    note("Applications to become an approved supplier of a ship manager or owner."),
    block("table", {
      columns: [
        { key: "company", label: "Company", supporting: "portal" },
        { key: "status", label: "Status" },
        { key: "dates", label: "Dates" },
        { key: "documents", label: "Documents" },
        { key: "next", label: "Next" },
      ],
      rows: g.registrations.map((r) => ({
        company: { text: r.company, href: r.href, strong: true },
        portal: r.portal,
        status: { text: r.status, tone: r.tone, tag: true },
        dates:
          [
            r.submitted && `Submitted ${r.submitted}`,
            r.committee && `Committee ${r.committee}`,
            r.renewBy && `Renew by ${r.renewBy}`,
          ]
            .filter(Boolean)
            .join(" · ") || null,
        documents: {
          text: "",
          tags: r.documents.map((d) => ({
            label: `${d.name}${d.status === "Missing" ? " — missing" : ""}`,
            tone: DOC_TONE[d.status] ?? "neutral",
          })),
        },
        next: r.next || null,
      })),
    }),
    block("custom", {
      element: "ui-ai-extract",
      props: {
        source: "file",
        label: "Read a registration document",
        what: "company registration document (commercial register, tax card or vendor certificate)",
        fields: [
          { id: "company", label: "Company" },
          { id: "registration", label: "Commercial register no." },
          { id: "tax", label: "Tax card no." },
          { id: "issued", label: "Issued" },
          { id: "expires", label: "Expires", hint: "the expiry or renewal date" },
        ],
      },
    }),
  ],
});

const campaigns = on({
  title: "Campaigns",
  skeleton: "table",
  render: (g) => [
    note(
      `Approved lists and content only. ${g.canSend ? "You can schedule and send." : "Only Karim Balbaa schedules or sends."}`,
    ),
    block("table", {
      columns: [
        { key: "name", label: "Campaign", supporting: "audience" },
        { key: "content", label: "Content" },
        { key: "status", label: "Status", supporting: "scheduled" },
        { key: "stats", label: "Results" },
      ],
      rows: g.campaigns.map((c) => ({
        name: { text: c.name, href: c.href, strong: true },
        audience: `${c.audience} · ${c.recipients} contacts${c.consentOnly ? " · consented only" : ""}`,
        content: { text: c.content, tone: c.content === "Approved" ? "success" : "warning", tag: true },
        status: c.status,
        scheduled: c.scheduled,
        stats: c.stats ? `${c.stats.sent} sent · ${c.stats.opened} opened · ${c.stats.replied} replied` : null,
      })),
    }),
  ],
});

export const growthPage = widgets({
  header: {
    eyebrow: "Growth",
    heading: "Growth board",
    subtitle:
      "Prospects, fleets, introductions and vendor registrations — kept apart from operational RFQs, and linked to the customer once business is won.",
    actions: [
      { label: "Campaigns", href: "/collections/campaigns" },
      { label: "Add opportunity", href: "/collections/opportunities/create", variant: "filled" },
    ],
  },
  widgets: [stats, board, steps, { grid: [fleets, registrations], fit: "lg" }, campaigns],
});
