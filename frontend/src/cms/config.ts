import { defineConfig, viewEndpoint } from "./types.ts";
import { dashboard } from "./admin/index.ts";
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
    // Brand, navigation groups, side-panel widgets, tours and the assistant's guide (./admin).
    custom: dashboard,
    meta: { titleSuffix: "· Golden Sea" },
    // The demo's purpose-built screens (Payload custom views). Each `Component` draws a view
    // endpoint in src/cms/views; collection tabs (case workspace, quotation preview) are
    // registered on their collections (`admin.components.views.edit`).
    components: {
      views: {
        // The home page: the signed-in user's day (src/cms/views/home.ts).
        dashboard: { Component: viewEndpoint("/views/home"), path: "/" },
        inbox: {
          Component: viewEndpoint("/views/inbox"),
          path: "/inbox",
          meta: { title: "Inbox", description: "Every channel in one inbox; AI reads, people decide." },
          nav: { group: "Sourcing desk", label: "Inbox" },
        },
        history: {
          Component: viewEndpoint("/views/inbox-history"),
          path: "/inbox-history",
          meta: {
            title: "Inbox history",
            description: "Years of email organised into customers, vessels, suppliers and dated prices.",
          },
          nav: { group: "Sourcing desk", label: "Inbox history" },
        },
        approvals: {
          Component: viewEndpoint("/views/approvals"),
          path: "/approvals",
          meta: { title: "Approvals", description: "Decisions waiting for a named person." },
          nav: { group: "Commercial", label: "Approvals queue" },
        },
        cash: {
          Component: viewEndpoint("/views/cash"),
          path: "/cash",
          meta: {
            title: "Receivables & payables",
            description: "What customers owe, what we owe suppliers, and what needs approval.",
          },
          nav: { group: "Finance", label: "Receivables & payables" },
        },
        controlRoom: {
          Component: viewEndpoint("/views/control-room"),
          path: "/control-room",
          meta: { title: "Control room", description: "The business, live. Briefed at 07:00." },
          nav: { group: "Insights", label: "Control room" },
        },
        growth: {
          Component: viewEndpoint("/views/growth"),
          path: "/growth",
          meta: { title: "Growth board", description: "Prospects, fleets and vendor registrations." },
          nav: { group: "Growth", label: "Growth board" },
        },
        automations: {
          Component: viewEndpoint("/views/automations"),
          path: "/automations",
          meta: { title: "Automations", description: "Every rule explicit, nothing failing silently." },
          nav: { group: "Work", label: "Automations" },
        },
        roles: {
          Component: viewEndpoint("/views/roles"),
          path: "/roles",
          meta: { title: "Roles & permissions", description: "Who can see and approve what." },
          nav: { group: "Team", label: "Roles & permissions" },
        },
        integrations: {
          Component: viewEndpoint("/views/integrations"),
          path: "/integrations",
          meta: { title: "Integrations", description: "Mailboxes, website form, WhatsApp, e-invoicing and Odoo." },
          nav: { group: "Configuration", label: "Integrations" },
        },
        project: {
          Component: viewEndpoint("/views/project"),
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
