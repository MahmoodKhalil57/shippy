import { custom, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/growth.ts";
import * as link from "../links.ts";
import { growth, nextSteps, openOpportunities, registrationsInProgress, funnelStages } from "../queries/growth.ts";
import { m } from "../i18n/paraglide/messages.js";

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
    eyebrow: m.page_growth_eyebrow(),
    heading: m.page_growth_heading(),
    subtitle: m.page_growth_subtitle(),
    actions: [
      { label: m.page_growth_campaigns(), href: link.list("campaigns") },
      { label: m.page_growth_add(), href: link.create("opportunities"), main: true },
    ],
  },
  // The figures, one tile per stage of the board (in order), then the steps, fleets, registrations and campaigns.
  widgets: [
    // The pipeline as a funnel (each stage: the prospects that reached it or went further) and
    // where the prospects come from, as one bar: no code, the opportunities themselves.
    {
      title: m.page_growth_funnel(),
      subhead: m.page_growth_funnel_subhead(),
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
      title: m.page_growth_sources(),
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
          { label: m.page_growth_open(), where: openOpportunities, note: m.page_growth_open_note() },
          {
            label: m.page_growth_this_week(),
            where: { ...openOpportunities, nextStepDue: { less_than_equal: "$today+7d" } },
            note: m.page_growth_this_week_note(),
          },
          {
            label: m.page_growth_no_step(),
            where: { noNextStep: { equals: true } },
            note: m.page_growth_no_step_note(),
            tone: { some: "error", none: "neutral" },
          },
          {
            label: m.page_growth_registrations(),
            collection: "vendor-registrations",
            where: registrationsInProgress,
            note: m.page_growth_registrations_note(),
            tone: { some: "warning", none: "neutral" },
          },
        ],
      },
    },
    // The pipeline as a board, a column per stage: the opportunities collection itself (drag a
    // prospect to its next stage; switchable to rows, cards or a chart). "Record outcome" is on each
    // in "Sales next steps" and in its record.
    {
      title: m.page_growth_pipeline(),
      size: "full",
      rows: 10,
      minRows: 8,
      collection: {
        collection: "opportunities",
        key: "board",
        layout: "board",
        sort: "nextStepDue",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_growth_next_steps(),
      size: "m",
      subhead: m.page_growth_next_steps_subhead(),
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
      title: m.page_growth_fleets(),
      size: "s",
      skeleton: "list",
      data: growth,
      format: fmt.fleets,
    }),
    table({
      title: m.page_growth_vessels(),
      size: "l",
      skeleton: "table",
      subhead: m.page_growth_vessels_subhead(),
      data: growth,
      format: fmt.fleetVessels,
    }),
    {
      title: m.page_growth_vendor_title(),
      subhead: m.page_growth_vendor_subhead(),
      size: "l",
      records: {
        collection: "vendor-registrations",
        sort: "renewBy",
        limit: 50,
        columns: ["company", "status", "dates", "paperwork", "nextStep"],
        supporting: { company: "portal" },
        labels: { nextStep: m.page_growth_next() },
        more: true,
      },
    },
    custom({
      title: m.page_growth_documents(),
      size: "s",
      skeleton: "text",
      format: fmt.registrationReader,
    }),
    // Approved lists and content only; only management schedules or sends (the collection's hook).
    {
      title: m.page_growth_campaigns(),
      size: "l",
      head: (_data, { user }) => ({
        subhead:
          user.role === "management" ? m.page_growth_campaigns_can_send() : m.page_growth_campaigns_cannot_send(),
      }),
      records: {
        collection: "campaigns",
        limit: 50,
        columns: ["name", "contentStatus", "status", "results"],
        supporting: { name: "reach", status: "scheduledAt" },
        labels: { name: m.page_growth_campaign(), contentStatus: m.page_growth_content() },
      },
    },
    // The vendor registrations as cards with their renewal dates.
    {
      title: m.page_growth_registrations_glance(),
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
