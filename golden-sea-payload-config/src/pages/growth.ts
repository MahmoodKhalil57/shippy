import { custom, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/growth.ts";
import * as link from "../links.ts";
import {
  BOARD_STAGES,
  growth,
  nextSteps,
  openOpportunities,
  registrationsInProgress,
  funnelStages,
} from "../queries/growth.ts";

/**
 * The growth board (/growth): the growth CRM, kept apart from operational RFQs — prospects by
 * stage, the sales next steps with "what to say" and "Record outcome", fleets per ship manager
 * (vessels with IMO), vendor registrations and campaigns.
 *
 * The board, the next steps, registrations and campaigns read their collections with no code: the
 * figures are counts (`metrics`), each stage a list of its opportunities tagged by where the step
 * stands (`step`: red with no next step or past its date), each next step an entry with that
 * status, its channel as a tag, the step (`brief`), what to say (`script`), the last outcome
 * (`lastOutcome`) and the opportunities' own "Record outcome" (POST /api/growth/:id/outcome,
 * ../endpoints/growth-crm.ts).
 * Fleets per ship manager span customers, vessels, cases and prospects: GET /api/growth through a
 * formatter (../format/growth.ts).
 */
export const growthPage = widgets({
  header: {
    eyebrow: "Growth",
    heading: "Growth board",
    subtitle:
      "Prospects, fleets, introductions and vendor registrations — kept apart from operational RFQs, and linked to the customer once business is won.",
    actions: [
      { label: "Campaigns", href: link.list("campaigns") },
      { label: "Add opportunity", href: link.create("opportunities"), main: true },
    ],
  },
  // The figures, one tile per stage of the board (in order), then the steps, fleets, registrations and campaigns.
  widgets: [
    // The pipeline as a funnel (each stage: the prospects that reached it or went further) and
    // where the prospects come from, as one bar: no code, the opportunities themselves.
    {
      title: "Growth funnel",
      subhead: "Prospects that reached each stage or went further",
      size: "s",
      rows: 8,
      maxRows: 10,
      counts: {
        collection: "opportunities",
        layout: "funnel",
        items: funnelStages,
      },
    },
    {
      title: "Where prospects come from",
      size: "m",
      rows: 4,
      maxRows: 5,
      breakdown: { collection: "opportunities", by: "source", as: "share" },
    },
    // One tile per figure, 4 tiles wide, as the figures were.
    {
      size: "s",
      width: 4,
      metrics: {
        collection: "opportunities",
        items: [
          { label: "Open opportunities", where: openOpportunities, note: "prospects to active accounts" },
          {
            label: "Next steps this week",
            where: { ...openOpportunities, nextStepDue: { less_than_equal: "$today+7d" } },
            note: "calls, emails and visits planned",
          },
          {
            label: "No next step",
            where: { noNextStep: { equals: true } },
            note: "plan one or close the opportunity",
            tone: { some: "error", none: "neutral" },
          },
          {
            label: "Registrations in progress",
            collection: "vendor-registrations",
            where: registrationsInProgress,
            note: "waiting on documents or a committee",
            tone: { some: "warning", none: "neutral" },
          },
        ],
      },
    },
    // One list per stage, soonest next step first, each opportunity tagged by where its step stands,
    // with its "Record outcome".
    ...BOARD_STAGES.map((stage) => ({
      title: stage,
      size: "s" as const,
      records: {
        collection: "opportunities",
        where: { stage: { equals: stage } },
        sort: "nextStepDue",
        limit: 20,
        columns: ["name", "kind", "nextStep", "estimatedValue", "owner", "source"],
        tags: ["step"],
        layout: "list" as const,
        empty: "—",
      },
    })),
    {
      title: "Sales next steps",
      size: "m",
      subhead:
        "Each step has a channel, a date and what to say. Call or message yourself, then record what happened — the next step lands on the owner's follow-ups.",
      records: {
        collection: "opportunities",
        where: nextSteps,
        sort: "nextStepDue",
        limit: 50,
        columns: ["name", "step", "contact", "stage", "owner"],
        tags: ["channel"],
        layout: "entries",
        text: "brief",
        facts: ["script"],
        notes: "lastOutcome",
      },
    },
    list({
      title: "Fleets per ship manager",
      size: "s",
      skeleton: "list",
      data: growth,
      format: fmt.fleets,
    }),
    table({
      title: "Vessels per ship manager",
      size: "l",
      skeleton: "table",
      subhead: "Vessels with IMO for customers and prospects — the room to grow is every vessel we don't supply yet.",
      data: growth,
      format: fmt.fleetVessels,
    }),
    {
      title: "Vendor registrations",
      subhead: "Applications to become an approved supplier of a ship manager or owner.",
      size: "l",
      records: {
        collection: "vendor-registrations",
        sort: "renewBy",
        limit: 50,
        columns: ["company", "status", "dates", "paperwork", "nextStep"],
        supporting: { company: "portal" },
        labels: { nextStep: "Next" },
        more: true,
      },
    },
    custom({
      title: "Registration documents",
      size: "s",
      skeleton: "text",
      format: fmt.registrationReader,
    }),
    // Approved lists and content only; only management schedules or sends (the collection's hook).
    {
      title: "Campaigns",
      size: "l",
      head: (_data, { user }) => ({
        subhead: `Approved lists and content only. ${user.role === "management" ? "You can schedule and send." : "Only Karim Balbaa schedules or sends."}`,
      }),
      records: {
        collection: "campaigns",
        limit: 50,
        columns: ["name", "contentStatus", "status", "results"],
        supporting: { name: "reach", status: "scheduledAt" },
        labels: { name: "Campaign", contentStatus: "Content" },
      },
    },
    // The pipeline as a board (drag a prospect to its next stage) and the vendor registrations as
    // cards with their renewal dates.
    {
      title: "Pipeline board",
      size: "full",
      rows: 10,
      minRows: 8,
      collection: {
        collection: "opportunities",
        key: "board",
        layout: "board",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: "Registrations at a glance",
      size: "l",
      rows: 9,
      minRows: 6,
      collection: {
        collection: "vendor-registrations",
        key: "registrations",
        layout: "cards",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
