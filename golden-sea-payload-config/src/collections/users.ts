import type { CollectionConfig } from "payload";
import { ROLES, WAREHOUSES } from "./shared.ts";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "role", "office"], group: "Team" },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === "management",
    update: ({ req, id }) => req.user?.role === "management" || req.user?.id === id,
    delete: ({ req }) => req.user?.role === "management",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "initials", type: "text", maxLength: 3, admin: { position: "sidebar" } },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "sales",
      options: ROLES,
      // Only management changes roles (users may edit their own profile otherwise).
      access: { update: ({ req }) => req.user?.role === "management" },
    },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", admin: { description: "Used for WhatsApp / SMS alerts (after-hours RFQs)." } },
        { name: "office", type: "select", options: [...WAREHOUSES.map((w) => w.split(" ")[0]), "Greece", "US"] },
      ],
    },
    {
      name: "language",
      type: "select",
      label: "Language",
      defaultValue: "en",
      options: [
        { label: "English", value: "en" },
        { label: "العربية (Arabic)", value: "ar" },
      ],
      admin: { position: "sidebar", description: "Dashboard language for this person." },
    },
    {
      name: "notifications",
      type: "group",
      fields: [
        { name: "dailyBriefing", type: "checkbox", label: "Daily briefing at 07:00", defaultValue: true },
        {
          name: "afterHoursAlerts",
          type: "checkbox",
          label: "After-hours RFQ alerts when on call",
          defaultValue: false,
        },
      ],
    },
  ],
};
