import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "role"], group: "Team" },
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
      options: [
        { label: "Supply chain & customer service", value: "supply-chain" },
        { label: "Management approver", value: "management" },
        { label: "Sales", value: "sales" },
        { label: "Operations & finance", value: "operations" },
      ],
    },
  ],
};
