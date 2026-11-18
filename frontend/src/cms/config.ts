import { defineConfig } from "./types.ts";
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
import { endpoints } from "./endpoints/index.ts";

/**
 * The mock backend's data model: real Payload collection / global / endpoint
 * configs (copy them into a real `payload.config.ts` later). Served in the
 * browser by src/cms/sw.ts; managed in the dashboard (site root); seeded
 * from src/cms/seed. (`admin` keys are Payload's config API: they configure the
 * dashboard's views, as they would Payload's admin panel.)
 *
 * The state behind every screen of the sourcing-desk demo is mapped in STATE-AUDIT.md.
 */
export default defineConfig({
  admin: {
    user: "users",
    meta: { titleSuffix: "· Golden Sea" },
    // The demo's purpose-built screens (Payload custom views). Each `Component` is a custom
    // element in src/pages/dashboard/views; collection tabs (case workspace, quotation preview)
    // are registered on their collections (`admin.components.views.edit`).
    components: {
      views: {
        inbox: {
          Component: "gs-inbox",
          path: "/inbox",
          meta: { title: "Inbox", description: "Every channel in one inbox; AI reads, people decide." },
          nav: { group: "Sourcing desk", label: "Inbox" },
        },
        history: {
          Component: "gs-inbox-history",
          path: "/inbox-history",
          meta: {
            title: "Inbox history",
            description: "Years of email organised into customers, vessels, suppliers and dated prices.",
          },
          nav: { group: "Sourcing desk", label: "Inbox history" },
        },
        approvals: {
          Component: "gs-approvals",
          path: "/approvals",
          meta: { title: "Approvals", description: "Decisions waiting for a named person." },
          nav: { group: "Commercial", label: "Approvals queue" },
        },
        cash: {
          Component: "gs-cash",
          path: "/cash",
          meta: {
            title: "Receivables & payables",
            description: "What customers owe, what we owe suppliers, and what needs approval.",
          },
          nav: { group: "Finance", label: "Receivables & payables" },
        },
        controlRoom: {
          Component: "gs-control-room",
          path: "/control-room",
          meta: { title: "Control room", description: "The business, live. Briefed at 07:00." },
          nav: { group: "Insights", label: "Control room" },
        },
        growth: {
          Component: "gs-growth",
          path: "/growth",
          meta: { title: "Growth board", description: "Prospects, fleets and vendor registrations." },
          nav: { group: "Growth", label: "Growth board" },
        },
        automations: {
          Component: "gs-automations",
          path: "/automations",
          meta: { title: "Automations", description: "Every rule explicit, nothing failing silently." },
          nav: { group: "Work", label: "Automations" },
        },
        roles: {
          Component: "gs-roles",
          path: "/roles",
          meta: { title: "Roles & permissions", description: "Who can see and approve what." },
          nav: { group: "Team", label: "Roles & permissions" },
        },
        integrations: {
          Component: "gs-integrations",
          path: "/integrations",
          meta: { title: "Integrations", description: "Mailboxes, website form, WhatsApp, e-invoicing and Odoo." },
          nav: { group: "Configuration", label: "Integrations" },
        },
        project: {
          Component: "gs-project",
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
  ],
  globals,
  // Root endpoints (/api/home, /api/ask, …), by area: src/cms/endpoints.
  endpoints,
});
