import { defineConfig } from "../mock/types.ts";
import { aside } from "./widgets/aside.ts";
import { cashPage } from "./widgets/cash.ts";
import { controlRoom } from "./widgets/control-room.ts";
import { homePage } from "./widgets/home.ts";
import { inboxHistoryPage } from "./widgets/inbox-history.ts";
import { inboxPage } from "./widgets/inbox.ts";
import { approvalsPage } from "./widgets/approvals.ts";
import { automationsPage } from "./widgets/automations.ts";
import { growthPage } from "./widgets/growth.ts";
import { integrationsPage } from "./widgets/integrations.ts";
import { projectPage } from "./widgets/project.ts";
import { rolesPage } from "./widgets/roles.ts";
import { Cases } from "./collections/cases.ts";
import { Pricelists, Products, Stock, SupplierPrices } from "./collections/catalog.ts";
import { Approvals, CustomerPOs, Quotations } from "./collections/commercial.ts";
import { Customers, Media, Suppliers, Vessels } from "./collections/directory.ts";
import { Invoices, Payments } from "./collections/finance.ts";
import { Deliveries, PurchaseOrders, Receipts, SupplierBills } from "./collections/fulfilment.ts";
import { Campaigns, Opportunities, VendorRegistrations } from "./collections/growth.ts";
import { IntakeMessages, Offers, SupplierRfqs } from "./collections/sourcing.ts";
import { Users } from "./collections/users.ts";
import { Activities, Bookmarks, IntegrationExceptions, Notifications, Tasks } from "./collections/work.ts";
import { globals } from "./globals/index.ts";
import { GuideTopics, Tours } from "./globals/dashboard.ts";
import { endpoints } from "./endpoints/index.ts";

/**
 * The mock backend's data model: real Payload collection / global / endpoint
 * configs (copy them into a real `payload.config.ts` later). Served in the
 * browser by src/mock/sw.ts; managed in the dashboard (site root); seeded
 * from src/cms/seed. (`admin` keys are Payload's config API: they configure the
 * dashboard's views, as they would Payload's admin panel.)
 *
 * The state behind every screen of the sourcing-desk demo is mapped in STATE-AUDIT.md.
 */
export default defineConfig({
  admin: {
    user: "users",
    // The dashboard's structure: navigation groups in the order work flows (from the first email
    // to the last payment, then insight and setup) and the side panel's counters. Its content
    // (brand, assistant, guide, tours) is data: ./globals/dashboard.ts.
    custom: {
      nav: {
        groups: [
          { label: "Sourcing desk", icon: "inbox" },
          { label: "Commercial", icon: "briefcase" },
          { label: "Fulfilment", icon: "truck" },
          { label: "Finance", icon: "banknotes" },
          { label: "Insights", icon: "chart" },
          { label: "Growth", icon: "trending-up" },
          { label: "Work", icon: "clipboard" },
          { label: "Directory", icon: "users" },
          { label: "Catalogue", icon: "cube" },
          { label: "Team", icon: "user" },
          { label: "Configuration", icon: "settings" },
        ],
      },
      aside,
    },
    meta: { titleSuffix: "· Golden Sea" },
    // The demo's purpose-built screens (Payload custom views). Each `Component` is a screen of
    // widgets in src/cms/widgets; collection tabs (case workspace, quotation preview) are
    // registered on their collections (`admin.components.views.edit`).
    components: {
      views: {
        // The home page: the signed-in user's day (src/cms/widgets/home.ts).
        dashboard: { Component: homePage, path: "/" },
        inbox: {
          Component: inboxPage,
          path: "/inbox",
          meta: { title: "Inbox", description: "Every channel in one inbox; AI reads, people decide." },
          nav: { group: "Sourcing desk", label: "Inbox" },
        },
        history: {
          Component: inboxHistoryPage,
          path: "/inbox-history",
          meta: {
            title: "Inbox history",
            description: "Years of email organised into customers, vessels, suppliers and dated prices.",
          },
          nav: { group: "Sourcing desk", label: "Inbox history" },
        },
        approvals: {
          Component: approvalsPage,
          path: "/approvals",
          meta: { title: "Approvals", description: "Decisions waiting for a named person." },
          nav: { group: "Commercial", label: "Approvals queue" },
        },
        cash: {
          Component: cashPage,
          path: "/cash",
          meta: {
            title: "Receivables & payables",
            description: "What customers owe, what we owe suppliers, and what needs approval.",
          },
          nav: { group: "Finance", label: "Receivables & payables" },
        },
        controlRoom: {
          Component: controlRoom,
          path: "/control-room",
          meta: { title: "Control room", description: "The business, live. Briefed at 07:00." },
          nav: { group: "Insights", label: "Control room" },
        },
        growth: {
          Component: growthPage,
          path: "/growth",
          meta: { title: "Growth board", description: "Prospects, fleets and vendor registrations." },
          nav: { group: "Growth", label: "Growth board" },
        },
        automations: {
          Component: automationsPage,
          path: "/automations",
          meta: { title: "Automations", description: "Every rule explicit, nothing failing silently." },
          nav: { group: "Work", label: "Automations" },
        },
        roles: {
          Component: rolesPage,
          path: "/roles",
          meta: { title: "Roles & permissions", description: "Who can see and approve what." },
          nav: { group: "Team", label: "Roles & permissions" },
        },
        integrations: {
          Component: integrationsPage,
          path: "/integrations",
          meta: { title: "Integrations", description: "Mailboxes, website form, WhatsApp, e-invoicing and Odoo." },
          nav: { group: "Configuration", label: "Integrations" },
        },
        project: {
          Component: projectPage,
          path: "/project",
          meta: { title: "Delivery plan", description: "Phases, requirements coverage and acceptance tests." },
          nav: { group: "Insights", label: "Delivery plan" },
        },
      },
    },
  },
  collections: [
    // The original five first (tests and existing pages rely on this order).
    Cases,
    Customers,
    Suppliers,
    Users,
    Media,
    // Sourcing desk
    IntakeMessages,
    SupplierRfqs,
    Offers,
    // Commercial
    Quotations,
    Approvals,
    CustomerPOs,
    // Fulfilment
    PurchaseOrders,
    SupplierBills,
    Receipts,
    Deliveries,
    // Finance
    Invoices,
    Payments,
    // Catalogue & directory
    Vessels,
    Products,
    SupplierPrices,
    Pricelists,
    Stock,
    // Work
    Tasks,
    Activities,
    IntegrationExceptions,
    Notifications,
    Bookmarks,
    // Growth
    Opportunities,
    VendorRegistrations,
    Campaigns,
    // The dashboard's own content (./globals/dashboard.ts)
    GuideTopics,
    Tours,
  ],
  globals,
  // Root endpoints (/api/home, /api/ask, …), by area: src/cms/endpoints.
  endpoints,
});
