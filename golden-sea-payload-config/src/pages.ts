import type { CollectionConfig, GlobalConfig } from "payload";
import { collectionPage, documentPage, globalPage, widgets, type PageView } from "saastemlycrm-design-system/contracts";
import { m } from "./i18n/paraglide/messages.js";
import { LIST_PAGES } from "./pages/records.ts";

/**
 * Where Golden Sea's collections, documents and globals are. Nothing has a page of its own (the
 * dashboard shows a collection, a record or a setting only where a view places its widget), so the
 * links that name them (`links()`: a case, the list of overdue invoices, the settings) open these:
 *
 * - each collection people work in: its list at `/collections/<slug>`, in the navigation under its
 *   `admin.group` (`collectionPage`), with the widgets about its records before it and the layout
 *   it starts in (./pages/records.ts);
 * - each collection's records: the record's form, with its tabs, at `/collections/<slug>/:id`
 *   (`documentPage`), new ones at `/collections/<slug>/create`;
 * - each global: its form at `/globals/<slug>`, under Configuration (`globalPage`).
 *
 * Collections hidden from the navigation (`admin.hidden`: a person's bookmarks) get no list.
 */
export function pages(collections: CollectionConfig[], globals: GlobalConfig[]): Record<string, PageView> {
  const lists = collections.filter((c) => c.admin?.hidden !== true);
  return Object.fromEntries([
    ...lists.map((c) => [`list:${c.slug}`, collectionPage(c.slug, LIST_PAGES[c.slug] ?? {})]),
    ...collections.map((c) => [`doc:${c.slug}`, documentPage(c.slug)]),
    ...globals.map((g) => [`global:${g.slug}`, globalPage(g.slug)]),
  ]);
}

/**
 * Related collections on one page: what the sourcing desk is waiting on, from the first message to
 * the offers to check. Each is a tile like any widget: the messages the page's width, 10 tiles high;
 * the supplier requests and the offers 12 tiles across, 8 high, side by side. Each list is the collection's own (search, sort, records opening in a sheet)
 * set up for this page: what it always keeps to (`where`), its columns, and no export or widgets
 * around it. Each keeps its state in the URL under its own key, so a filtered pipeline can
 * be shared. Messages and supplier requests start as rows, offers as cards (people switch to the
 * table or another layout); the full lists stay on their own pages.
 */
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
