import { html, LitElement } from "lit";
import type { Doc, MockConfig } from "../../src/lib/contracts/config.ts";
import type { Access } from "../../src/lib/dashboard/context.ts";
import type { MemoryData } from "../../src/lib/dashboard/memory.ts";
import type { SeedUser } from "../../src/lib/dashboard/project.ts";

const perm = (permission: boolean) => ({ permission });
export const crud = (create = true, read = true, update = true, remove = true) => ({
  create: perm(create),
  read: perm(read),
  update: perm(update),
  delete: perm(remove),
});

export const config = {
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "name" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "role",
          type: "select",
          options: [
            { label: "Administrator", value: "admin" },
            { label: "Sales", value: "sales" },
            { label: "Viewer", value: "viewer" },
          ],
        },
      ],
    },
    {
      slug: "companies",
      labels: { singular: "Company", plural: "Companies" },
      admin: { useAsTitle: "name", description: "Organisations you sell to." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "industry", type: "text" },
        { name: "deals", type: "join", collection: "deals", on: "company" },
        {
          name: "openDeals",
          label: "Open deals",
          type: "join",
          collection: "deals",
          on: "company",
          admin: { defaultColumns: ["title", "company", "owner", "amount", "updatedAt"] },
        },
      ],
    },
    {
      slug: "deals",
      admin: {
        useAsTitle: "title",
        components: {
          views: {
            edit: {
              activity: { Component: "demo-activity-tab", path: "/activity", tab: { label: "Activity" } },
              history: { Component: "demo-missing-tab", path: "/history", tab: { label: "History" } },
            },
          },
        },
      },
      custom: {
        list: { status: "status" },
        edit: {
          steps: { field: "status", skip: ["lost"] },
          before: [
            {
              title: "Pipeline at a glance",
              metrics: {
                collection: "deals",
                items: [
                  { label: "Open deals", where: { status: { equals: "open" } } },
                  { label: "Lost deals", where: { status: { equals: "lost" } } },
                ],
              },
            },
          ],
        },
      },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Open", value: "open" },
            { label: "Proposal sent", value: "proposal" },
            { label: "Won", value: "won" },
            { label: "Lost", value: "lost" },
          ],
        },
        { name: "stage", type: "select", options: ["Discovery", "Negotiation"] },
        { name: "amount", label: "Deal value", type: "number", custom: { number: { unit: "money", currency: "USD" } } },
        { name: "seats", type: "number" },
        { name: "company", type: "relationship", relationTo: "companies" },
        { name: "owner", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
        { name: "closeDate", type: "date", admin: { position: "sidebar" } },
        { name: "notes", type: "textarea" },
      ],
    },
    {
      slug: "files",
      upload: true,
      admin: { useAsTitle: "filename" },
      fields: [{ name: "alt", type: "text" }],
    },
    {
      slug: "orders",
      admin: { useAsTitle: "reference" },
      custom: { edit: { steps: { field: "fulfilment" } } },
      fields: [
        { name: "reference", type: "text" },
        { name: "fulfilment", type: "select", options: ["Draft", "Packed", "Shipped"] },
        { name: "total", label: "Order total", type: "number", custom: { number: { unit: "money", currency: "EUR" } } },
        {
          type: "tabs",
          tabs: [
            {
              label: "Items",
              fields: [
                {
                  name: "lines",
                  type: "array",
                  fields: [
                    { name: "supplier", type: "relationship", relationTo: "companies" },
                    { name: "quantity", type: "number" },
                  ],
                },
              ],
            },
            {
              name: "shipping",
              label: "Shipping",
              fields: [{ name: "carrier", type: "relationship", relationTo: "companies" }],
            },
            { name: "returns", label: "Returns", fields: [{ name: "reason", type: "text" }] },
          ],
        },
        {
          name: "address",
          type: "group",
          fields: [
            { name: "city", type: "text" },
            { name: "contact", type: "relationship", relationTo: "users" },
          ],
        },
        { name: "billing", type: "group", fields: [{ name: "vatNumber", type: "text" }] },
        {
          name: "content",
          type: "blocks",
          blocks: [{ slug: "note", fields: [{ name: "author", type: "relationship", relationTo: "users" }] }],
        },
        { name: "extras", type: "array", fields: [{ name: "label", type: "text" }] },
        { name: "sections", type: "blocks", blocks: [{ slug: "text", fields: [{ name: "body", type: "text" }] }] },
        {
          type: "row",
          fields: [
            { name: "attachment", type: "upload", relationTo: "files" },
            { name: "related", type: "relationship", relationTo: ["deals", "companies"], hasMany: true },
          ],
        },
        {
          type: "collapsible",
          label: "Internal",
          fields: [
            { name: "approval", type: "relationship", relationTo: "secrets" },
            { name: "followUp", type: "relationship", relationTo: "deals" },
            { name: "deals", type: "join", collection: "deals", admin: { defaultColumns: ["title", "company"] } },
          ],
        },
      ],
    },
    { slug: "secrets", admin: { useAsTitle: "code" }, fields: [{ name: "code", type: "text" }] },
  ],
  globals: [
    {
      slug: "settings",
      label: "Workspace settings",
      admin: {
        description: "Defaults used across the workspace.",
        components: {
          views: { edit: { audit: { Component: "demo-activity-tab", path: "/audit", tab: { label: "Audit log" } } } },
        },
      },
      custom: {
        edit: {
          before: [
            {
              title: "Workspace size",
              metrics: { collection: "deals", items: [{ label: "All deals", where: {} }] },
            },
          ],
        },
      },
      fields: [
        { name: "workspaceName", type: "text" },
        { name: "taxRate", type: "number" },
      ],
    },
  ],
  admin: {
    user: "users",
    custom: { today: "2026-03-02", nav: { groups: [{ label: "Sales" }, { label: "Setup" }] } },
    components: {
      views: {
        setup: {
          Component: "app-widgets",
          path: "/setup",
          nav: { group: "Setup", label: "Workspace setup" },
        },
        pipeline: {
          Component: "app-widgets",
          path: "/pipeline",
          nav: { group: "Sales", label: "Pipeline" },
          meta: { title: "Pipeline", description: "Every open deal by stage." },
        },
        accounts: {
          Component: {
            path: "app-widgets",
            clientProps: { page: { widgets: [{ collection: { collection: "deals" } }] } },
          },
          path: "/accounts",
          nav: { group: "Sales", label: "Accounts" },
        },
        reports: { Component: "app-widgets", path: "/reports", nav: { group: "Insights", label: "Reports" } },
        deal: { Component: "app-widgets", path: "/deal/:id", nav: { group: "Sales", label: "Deal" } },
        hidden: { Component: "app-widgets", path: "/hidden" },
      },
    },
  },
} as unknown as MockConfig;

export const emptyConfig = { collections: config.collections, globals: [] } as unknown as MockConfig;

export const seedUsers: SeedUser[] = [
  { id: "u1", name: "Maya Patel", email: "maya@example.com", password: "maya-pass", role: "admin" },
  { id: "u2", name: "Jordan Lee", email: "jordan@example.com", password: "jordan-pass", role: "sales" },
  { id: "u3", name: "Sam Rivera", email: "sam@example.com", password: "sam-pass", role: "sales" },
];

export const maya = { id: "u1", name: "Maya Patel", email: "maya@example.com", role: "admin", collection: "users" };

const doc = (d: Record<string, unknown>) => d as Doc;

export const docs: Record<string, Doc[]> = {
  users: [
    doc({ id: "u1", name: "Maya Patel", email: "maya@example.com", role: "admin" }),
    doc({ id: "u2", name: "Jordan Lee", email: "jordan@example.com", role: "sales" }),
  ],
  companies: [
    doc({
      id: "c1",
      name: "Harbor Logistics",
      industry: "Freight",
      deals: {
        docs: [
          { id: "d1", title: "Warehouse fit-out", status: "proposal", stage: "Negotiation", amount: 48000 },
          { id: "d3", title: "Delivery vans", status: "open" },
        ],
        totalDocs: 2,
      },
      openDeals: {
        docs: [{ id: "d3", title: "Delivery vans", company: "c1", owner: "u2", amount: 1200 }],
        totalDocs: 1,
      },
    }),
    doc({ id: "c2", name: "Riverside Bakery", industry: "Food" }),
  ],
  deals: [
    doc({
      id: "d1",
      title: "Warehouse fit-out",
      status: "proposal",
      stage: "Negotiation",
      amount: 48000,
      seats: 12,
      company: "c1",
      owner: "u1",
      closeDate: "2026-04-15T00:00:00.000Z",
      notes: "Waiting on the revised floor plan.",
      createdAt: "2026-01-10T09:30:00.000Z",
      updatedAt: "2026-02-20T14:05:00.000Z",
    }),
    doc({ id: "d2", title: "Annual maintenance", status: "lost", company: "c2", owner: "u2" }),
    doc({ id: "d3", title: "Delivery vans", status: "open", company: "c1" }),
  ],
  files: [
    doc({
      id: "f1",
      filename: "floor-plan.png",
      mimeType: "image/png",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      filesize: 2048,
      width: 1,
      height: 1,
      alt: "Floor plan of the warehouse",
      updatedAt: "2026-02-01T10:00:00.000Z",
    }),
    doc({
      id: "f2",
      filename: "contract.pdf",
      mimeType: "application/pdf",
      url: "/files/contract.pdf",
      filesize: 3_500_000,
    }),
    doc({ id: "f3", filename: "notes.txt", mimeType: "text/plain", filesize: 300 }),
    doc({ id: "f4", filename: "empty.csv", mimeType: "text/csv", filesize: 0 }),
  ],
  orders: [
    doc({
      id: "o1",
      reference: "PO-1042",
      fulfilment: "Packed",
      total: 1250,
      lines: [{ supplier: { id: "c1", name: "Harbor Logistics" }, quantity: 3 }],
      shipping: { carrier: { id: "c2", name: "Riverside Bakery" } },
      returns: "none",
      address: { city: "Leeds", contact: { id: "u1", name: "Maya Patel" } },
      billing: null,
      content: [
        { blockType: "note", author: "u2" },
        { blockType: "retired", body: "Old block" },
      ],
      extras: "none",
      sections: null,
      attachment: { id: "f1", filename: "floor-plan.png" },
      related: [
        { relationTo: "deals", value: { id: "d1", title: "Warehouse fit-out" } },
        { relationTo: "companies", value: "c2" },
      ],
      approval: { code: "A-7" },
      followUp: "d1",
      deals: {
        docs: [
          { id: "d1", title: "Warehouse fit-out", company: "c1" },
          { id: "d5", title: "Spare parts", company: "c9" },
          { id: "d6", title: "Racking", company: { id: "c2", name: "Riverside Bakery" } },
        ],
        totalDocs: 3,
      },
    }),
    doc({ id: "o2", reference: "PO-1043", followUp: "d9" }),
  ],
  secrets: [doc({ id: "s1", code: "A-7" })],
};

export const globals = { settings: { workspaceName: "Main office", taxRate: 20 } };

export const fullAccess: Access = {
  canAccessAdmin: true,
  collections: {
    users: crud(),
    companies: crud(),
    deals: crud(),
    files: crud(),
    orders: crud(),
    secrets: crud(false, false, false, false),
  },
  globals: { settings: { read: perm(true), update: perm(true) } },
};

export const readOnlyAccess: Access = {
  canAccessAdmin: true,
  collections: {
    users: crud(false, true, false, false),
    companies: crud(false, true, false, false),
    deals: crud(false, true, false, false),
    files: crud(false, true, false, false),
    orders: crud(false, true, false, false),
    secrets: crud(false, false, false, false),
  },
  globals: { settings: { read: perm(true), update: perm(false) } },
};

export const data = (extra: MemoryData = {}): MemoryData => ({ docs, globals, access: fullAccess, ...extra });

export class DemoActivityTab extends LitElement {
  static properties = { docId: {}, slug: {} };
  declare docId: string;
  declare slug: string;

  constructor() {
    super();
    this.docId = "";
    this.slug = "";
  }

  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`<ui-alert tone="info" heading="Activity">Calls and emails for ${this.slug} ${this.docId}.</ui-alert>`;
  }
}

customElements.define("demo-activity-tab", DemoActivityTab);

declare global {
  interface HTMLElementTagNameMap {
    "demo-activity-tab": DemoActivityTab;
  }
}
