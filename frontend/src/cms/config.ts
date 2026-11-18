import type { GlobalConfig } from "payload";
import { defineConfig } from "./types.ts";
import { Cases } from "./collections/cases.ts";
import { Customers, Media, Suppliers } from "./collections/directory.ts";
import { Users } from "./collections/users.ts";

/**
 * The mock backend's data model: real Payload collection / global / endpoint
 * configs (copy them into a real `payload.config.ts` later). Served in the
 * browser by src/cms/sw.ts; managed in the dashboard (site root); seeded
 * from src/cms/seed. (`admin` keys are Payload's config API: they configure the
 * dashboard's views, as they would Payload's admin panel.)
 */

const Settings: GlobalConfig = {
  slug: "settings",
  access: { read: () => true, update: ({ req }) => req.user?.role === "management" },
  fields: [
    { name: "companyName", type: "text", defaultValue: "Golden Sea" },
    { name: "marginFloor", type: "number", label: "Minimum margin %", defaultValue: 15, min: 0, max: 100 },
    { name: "workingHours", type: "text", defaultValue: "Sun–Thu 08:00–17:00" },
  ],
};

export default defineConfig({
  admin: { user: "users", meta: { titleSuffix: "· Golden Sea" } },
  collections: [Cases, Customers, Suppliers, Users, Media],
  globals: [Settings],
});
