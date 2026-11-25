import type { CollectionConfig, GlobalConfig } from "payload";
import { collectionPage, documentPage, globalPage, widgets, type PageView } from "saastemlycrm-design-system/contracts";
import { m } from "./i18n/paraglide/messages.js";
import { LIST_PAGES } from "./pages/records.ts";

export function pages(collections: CollectionConfig[], globals: GlobalConfig[]): Record<string, PageView> {
  const lists = collections.filter((c) => c.admin?.hidden !== true);
  return Object.fromEntries([
    ...lists.map((c) => [`list:${c.slug}`, collectionPage(c.slug, LIST_PAGES[c.slug] ?? {})]),
    ...collections.map((c) => [`doc:${c.slug}`, documentPage(c.slug)]),
    ...globals.map((g) => [`global:${g.slug}`, globalPage(g.slug)]),
  ]);
}

export const sourcingPipeline: PageView = {
  Component: widgets({
    header: {
      eyebrow: m.page_sourcing_eyebrow(),
      heading: m.page_sourcing_heading(),
      subtitle: m.page_sourcing_subtitle(),
    },
    widgets: [
      {
        title: m.page_sourcing_messages_title(),
        subhead: m.page_sourcing_messages_subhead(),
        size: "full",
        rows: 10,
        collection: {
          collection: "intake-messages",
          key: "messages",
          layout: "list",
          where: { status: { in: ["New", "Needs review"] } },
          columns: ["subject", "fromName", "channel", "classification", "receivedAt"],
          sort: "-receivedAt",
          hide: ["export", "around", "select"],
        },
      },
      {
        title: m.page_sourcing_rfqs_title(),
        size: "m",
        rows: 8,
        minRows: 6,
        collection: {
          collection: "supplier-rfqs",
          key: "rfqs",
          layout: "list",
          where: { status: { in: ["Sent", "Awaiting reply"] } },
          columns: ["reference", "case", "supplier", "dueAt", "reminders"],
          sort: "dueAt",
          hide: ["export", "around", "select", "create"],
        },
      },
      {
        title: m.page_sourcing_offers_title(),
        subhead: m.page_sourcing_offers_subhead(),
        size: "m",
        rows: 8,
        minRows: 6,
        collection: {
          collection: "offers",
          key: "offers",
          layout: "cards",
          where: { compliance: { equals: "Pending" } },
          columns: ["label", "case", "supplier", "price", "currency", "leadDays"],
          hide: ["export", "around", "select", "create", "filters"],
        },
      },
    ],
  }),
  path: "/sourcing-pipeline",
  meta: {
    title: m.page_sourcing_heading(),
    description: m.page_sourcing_description(),
  },
  nav: { group: m.page_sourcing_eyebrow(), label: m.page_sourcing_nav() },
};
