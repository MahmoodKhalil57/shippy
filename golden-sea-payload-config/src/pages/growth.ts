import { custom, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/growth.ts";
import * as link from "../links.ts";
import { growth, nextSteps, openOpportunities, registrationsInProgress, funnelStages } from "../queries/growth.ts";
import { m } from "../i18n/paraglide/messages.js";

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
  widgets: [
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
