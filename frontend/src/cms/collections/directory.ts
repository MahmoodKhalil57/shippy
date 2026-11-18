import type { CollectionConfig } from "payload";

/** Anyone can read (the mock pages work without logging in); changes need a logged-in user. */
const publicRead: CollectionConfig["access"] = {
  read: () => true,
  create: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
  delete: ({ req }) => Boolean(req.user),
};

export const CATEGORIES = [
  "Chemicals",
  "Deck & engine stores",
  "Deck stores",
  "Engine spares",
  "Paints",
  "Safety & PPE",
  "Welding",
  "Adhesives",
];

export const Customers: CollectionConfig = {
  slug: "customers",
  admin: { useAsTitle: "name", defaultColumns: ["name", "country", "doNotChase"], group: "Directory" },
  access: publicRead,
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "country", type: "text" },
    { name: "contactEmail", type: "email" },
    {
      name: "doNotChase",
      type: "checkbox",
      label: "Do not chase",
      defaultValue: false,
      admin: { description: "Never send status requests; internal reminders only." },
    },
  ],
};

export const Suppliers: CollectionConfig = {
  slug: "suppliers",
  admin: { useAsTitle: "name", defaultColumns: ["name", "city", "status", "onTime"], group: "Directory" },
  access: publicRead,
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, unique: true },
        { name: "city", type: "text" },
      ],
    },
    { name: "categories", type: "select", hasMany: true, options: CATEGORIES },
    {
      name: "status",
      type: "select",
      defaultValue: "Approved",
      options: ["Approved", "Trial", "Blocked"],
      admin: { position: "sidebar" },
    },
    {
      type: "collapsible",
      label: "Performance",
      fields: [
        {
          type: "row",
          fields: [
            { name: "replyHrs", type: "number", label: "Average reply (hours)", min: 0 },
            { name: "onTime", type: "number", label: "On-time delivery %", min: 0, max: 100 },
          ],
        },
      ],
    },
    { name: "contact", type: "text" },
    { name: "terms", type: "text", admin: { position: "sidebar" } },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  admin: { useAsTitle: "filename", group: "Directory" },
  access: publicRead,
  fields: [{ name: "alt", type: "text", label: "Alt text" }],
};
