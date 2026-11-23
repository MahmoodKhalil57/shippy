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
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "How this person appears across the dashboard.", placeholder: "e.g. Karim Youssef" },
    },
    {
      name: "initials",
      type: "text",
      maxLength: 3,
      admin: { position: "sidebar", description: "Two or three letters shown on avatars.", placeholder: "e.g. KY" },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "sales",
      options: ROLES,
      // Only management changes roles (users may edit their own profile otherwise).
      access: { update: ({ req }) => req.user?.role === "management" },
      admin: { description: "Decides what this person can see and do.", placeholder: "Pick a role" },
      custom: { about: "Only management can change a role. Sales never sees costs, margins or case values." },
    },
    {
      type: "row",
      fields: [
        {
          name: "phone",
          type: "text",
          admin: {
            description: "Used for WhatsApp / SMS alerts (after-hours RFQs).",
            placeholder: "e.g. +20 100 123 4567",
          },
        },
        {
          name: "office",
          type: "select",
          options: [...WAREHOUSES.map((w) => w.split(" ")[0]), "Greece", "US"],
          admin: { description: "The office or warehouse this person works from.", placeholder: "e.g. Alexandria" },
        },
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
      admin: { position: "sidebar", description: "Dashboard language for this person.", placeholder: "English" },
    },
    {
      name: "notifications",
      type: "group",
      admin: { description: "Which alerts this person receives." },
      fields: [
        {
          name: "dailyBriefing",
          type: "checkbox",
          label: "Daily briefing at 07:00",
          defaultValue: true,
          admin: { description: "Tick to get the morning summary of open cases." },
        },
        {
          name: "afterHoursAlerts",
          type: "checkbox",
          label: "After-hours RFQ alerts when on call",
          defaultValue: false,
          admin: { description: "Tick to be alerted about RFQs that arrive outside office hours." },
        },
      ],
    },
  ],
};
