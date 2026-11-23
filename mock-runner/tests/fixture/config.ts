import type { Access, CollectionConfig, GlobalConfig } from "payload";
import type { BackendConfig } from "../../src/types.ts";

/**
 * A tiny Payload config for the engine's own tests: no project, just enough of Payload's
 * vocabulary (auth, access, hooks, validation, groups, arrays, relationships with filterOptions,
 * joins, uploads, custom endpoints, a global). Seeded from ./seed.
 */

const signedIn: Access = ({ req }) => Boolean(req.user);
const isAdmin: Access = ({ req }) => (req.user as { role?: string } | null)?.role === "admin";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: { read: signedIn, create: isAdmin, update: signedIn, delete: isAdmin },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "select", required: true, defaultValue: "editor", options: ["admin", "editor"] },
  ],
};

const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Post", plural: "Posts" },
  defaultSort: "published",
  access: { read: () => true, create: signedIn, update: signedIn, delete: isAdmin },
  hooks: {
    // A running reference, P-0001, P-0002…
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data || data.ref) return data;
        const { totalDocs } = await req.payload.count({ collection: "posts" as never });
        return { ...data, ref: `P-${String(totalDocs + 1).padStart(4, "0")}` };
      },
    ],
  },
  endpoints: [
    {
      path: "/:id/summary",
      method: "get",
      handler: async (req) => {
        const doc = await req.payload.findByID({ collection: "posts" as never, id: String(req.routeParams?.id) });
        const post = doc as unknown as { ref: string; title: string; category: { name: string } };
        return Response.json({ summary: `${post.ref}: ${post.title} (${post.category.name})` });
      },
    },
  ],
  fields: [
    { name: "ref", type: "text", unique: true },
    { name: "title", type: "text", required: true },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: ["draft", "published"] },
    { name: "views", type: "number", min: 0 },
    { name: "published", type: "date", required: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "author", type: "relationship", relationTo: "users" },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      filterOptions: { kind: { equals: "topic" } },
    },
    {
      name: "meta",
      type: "group",
      fields: [
        { name: "words", type: "number", defaultValue: 0 },
        { name: "likes", type: "number", defaultValue: 0 },
      ],
    },
    { name: "tags", type: "array", fields: [{ name: "label", type: "text" }] },
  ],
};

const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  access: { read: () => true, create: signedIn, update: signedIn, delete: isAdmin },
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "kind", type: "select", options: ["topic", "series"] },
    // Localized: one value per locale (fixture `localization`).
    { name: "blurb", type: "text", localized: true },
    { name: "aliases", type: "array", fields: [{ name: "label", type: "text", localized: true }] },
    { name: "posts", type: "join", collection: "posts", on: "category" },
  ],
};

/** Per-user documents: access returns a query, so each user reads and edits only their own. */
const Notes: CollectionConfig = {
  slug: "notes",
  access: {
    read: ({ req }) => (req.user ? { owner: { equals: req.user.id } } : false),
    update: ({ req }) => (req.user ? { owner: { equals: req.user.id } } : false),
    create: signedIn,
    delete: signedIn,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) =>
        operation === "create" && req.user && !data.owner ? { ...data, owner: req.user.id } : data,
    ],
  },
  fields: [
    { name: "owner", type: "relationship", relationTo: "users" },
    { name: "text", type: "text" },
    { name: "read", type: "checkbox", defaultValue: false },
  ],
};

const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  access: { read: () => true, create: signedIn, update: signedIn, delete: signedIn },
  fields: [{ name: "alt", type: "text" }],
};

const Settings: GlobalConfig = {
  slug: "settings",
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: "siteName", type: "text", defaultValue: "Untitled" },
    { name: "tagline", type: "text", localized: true },
    { name: "perPage", type: "number", defaultValue: 10, min: 1 },
  ],
};

export const fixture: BackendConfig = {
  admin: { user: "users" },
  collections: [Users, Categories, Posts, Notes, Media],
  globals: [Settings],
  localization: { locales: ["en", { code: "ar", rtl: true }], defaultLocale: "en", fallback: true },
};
