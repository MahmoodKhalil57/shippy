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
import { Activities, IntegrationExceptions, Tasks } from "./collections/work.ts";
import { globals } from "./globals/index.ts";

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
  admin: { user: "users", meta: { titleSuffix: "· Golden Sea" } },
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
    // Growth
    Opportunities,
    VendorRegistrations,
    Campaigns,
  ],
  globals,
});
