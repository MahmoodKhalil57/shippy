import type { CollectionConfig } from "payload";
import { CURRENCIES, STORES, UNITS, WAREHOUSES, costVisible, deskAccess, isManagement, management } from "./shared.ts";

/** The product catalogue: Golden Sea's stores by IMPA series, with aliases so any customer wording finds the item. */
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "store", "brand", "impa", "unit"],
    group: "Catalogue",
    listSearchableFields: ["name", "impa", "issa", "oemPartNo"],
  },
  access: deskAccess,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Product",
          fields: [
            { name: "name", type: "text", required: true },
            {
              name: "aliases",
              type: "array",
              labels: { singular: "Alias", plural: "Aliases" },
              admin: { description: "Other names customers use (“belt dressing spray”, “Loctite blue”…)." },
              fields: [{ name: "alias", type: "text", required: true }],
            },
            {
              type: "row",
              fields: [
                { name: "store", type: "select", options: STORES, required: true },
                { name: "impaSeries", type: "text", label: "IMPA series / section" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "brand", type: "text" },
                { name: "oemPartNo", type: "text", label: "OEM part no." },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "impa", type: "text", label: "IMPA", index: true },
                { name: "issa", type: "text", label: "ISSA" },
                { name: "hsCode", type: "text", label: "HS code" },
              ],
            },
            { name: "specification", type: "textarea" },
          ],
        },
        {
          label: "Units & packs",
          fields: [
            { name: "unit", type: "select", options: UNITS, required: true, defaultValue: "EA", label: "Base unit" },
            {
              name: "packs",
              type: "array",
              labels: { singular: "Pack size", plural: "Pack sizes" },
              admin: { description: "Conversions used to compare offers (200 × 250 ml = 100 × 500 ml = 50 L)." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { placeholder: "Can 250 ml" } },
                    { name: "baseQty", type: "number", required: true, min: 0, label: "Base units per pack" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Compliance",
          fields: [
            {
              name: "certificates",
              type: "select",
              hasMany: true,
              options: [
                "SDS",
                "TDS",
                "Mill certificate",
                "EN 397",
                "EN ISO 11612",
                "MED / SOLAS",
                "Test certificate",
                "Health certificate",
                "Halal",
                "Customs bond release",
              ],
            },
            {
              type: "row",
              fields: [
                { name: "shelfLifeMonths", type: "number", min: 0, label: "Shelf life (months)" },
                { name: "minShelfLifeMonths", type: "number", min: 0, label: "Min. at delivery (months)" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "coldChain", type: "checkbox", label: "Cold chain (reefer)", defaultValue: false },
                { name: "bonded", type: "checkbox", label: "Bond store (customs)", defaultValue: false },
                { name: "licensed", type: "checkbox", label: "Licensed (medicine)", defaultValue: false },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "agency",
      type: "relationship",
      relationTo: "suppliers",
      filterOptions: { kind: { equals: "agency" } },
      admin: { position: "sidebar", description: "Agency principal whose pricelist prices this item." },
    },
    { name: "active", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
  ],
};

/** Every dated price ever quoted — kept even when nothing was ordered. */
export const SupplierPrices: CollectionConfig = {
  slug: "supplier-prices",
  labels: { singular: "Supplier price", plural: "Supplier prices" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["product", "supplier", "price", "currency", "quotedAt", "validUntil", "source"],
    group: "Catalogue",
  },
  defaultSort: "-quotedAt",
  access: { ...deskAccess, read: ({ req }) => Boolean(req.user) && req.user?.role !== "sales" },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const product = data.product
          ? await req.payload
              .findByID({ collection: "products" as never, id: String(data.product), depth: 0 })
              .catch(() => null)
          : null;
        data.label = `${(product as { name?: string } | null)?.name ?? data.description ?? "Item"} · ${data.currency ?? ""} ${data.price ?? ""}`;
        return data;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", admin: { hidden: true } },
    {
      type: "row",
      fields: [
        { name: "product", type: "relationship", relationTo: "products" },
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
      ],
    },
    {
      name: "description",
      type: "text",
      admin: { description: "Supplier's own wording when not matched to a product." },
    },
    {
      type: "row",
      fields: [
        { name: "price", type: "number", required: true, min: 0 },
        { name: "currency", type: "select", options: CURRENCIES, required: true, defaultValue: "EGP" },
        { name: "per", type: "text", label: "Per (unit / pack)", defaultValue: "EA" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "quotedAt", type: "date", required: true },
        { name: "validUntil", type: "date" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "source",
          type: "select",
          options: ["Case offer", "Email reply", "WhatsApp / phone", "Purchase order", "Agency pricelist"],
          required: true,
        },
        { name: "case", type: "relationship", relationTo: "cases" },
        { name: "ordered", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};

/** Agency principals' price lists (Vecom, Lalizas, Lukoil, Marichem…), versioned and approved. */
export const Pricelists: CollectionConfig = {
  slug: "pricelists",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "principal", "currency", "discountPct", "validUntil", "status"],
    group: "Catalogue",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: management,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "principal",
      type: "relationship",
      relationTo: "suppliers",
      required: true,
      filterOptions: { kind: { equals: "agency" } },
    },
    {
      type: "row",
      fields: [
        { name: "currency", type: "select", options: CURRENCIES, required: true },
        { name: "discountPct", type: "number", label: "Agency discount %", min: 0, max: 100 },
        { name: "leadDays", type: "number", label: "Import lead time (days)", min: 0 },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "validFrom", type: "date" },
        { name: "validUntil", type: "date" },
      ],
    },
    { name: "file", type: "upload", relationTo: "media", label: "Source file (XLSX / CSV / PDF)" },
    {
      name: "items",
      type: "array",
      labels: { singular: "Item", plural: "Items" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "product", type: "relationship", relationTo: "products" },
            { name: "code", type: "text", label: "Principal code" },
            { name: "listPrice", type: "number", min: 0, required: true },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Draft",
      options: ["Draft", "Approved", "Superseded", "Expired"],
      access: { update: isManagement },
      admin: { position: "sidebar", description: "Only approved pricelists price lines automatically." },
    },
  ],
};

/** Own stock per warehouse, with lots and expiry (FIFO). */
export const Stock: CollectionConfig = {
  slug: "stock",
  labels: { singular: "Stock item", plural: "Stock" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["product", "warehouse", "onHand", "reserved", "available"],
    group: "Catalogue",
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const lots = (data.lots as { qty?: number }[] | undefined) ?? [];
        if (lots.length) data.onHand = lots.reduce((s, l) => s + (Number(l.qty) || 0), 0);
        data.available = Math.max(0, (Number(data.onHand) || 0) - (Number(data.reserved) || 0));
        const p = data.product
          ? await req.payload
              .findByID({ collection: "products" as never, id: String(data.product), depth: 0 })
              .catch(() => null)
          : null;
        data.label = `${(p as { name?: string } | null)?.name ?? "Item"} · ${data.warehouse ?? ""}`;
        return data;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", admin: { hidden: true } },
    {
      type: "row",
      fields: [
        { name: "product", type: "relationship", relationTo: "products", required: true },
        { name: "warehouse", type: "select", options: WAREHOUSES, required: true },
        { name: "bin", type: "text", label: "Location / bin" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "onHand", type: "number", min: 0, defaultValue: 0 },
        { name: "reserved", type: "number", min: 0, defaultValue: 0 },
        { name: "available", type: "number", min: 0, admin: { readOnly: true } },
      ],
    },
    { name: "avgCostEGP", type: "number", label: "Average cost (EGP)", min: 0, access: { read: costVisible } },
    {
      name: "lots",
      type: "array",
      labels: { singular: "Lot", plural: "Lots" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lot", type: "text", required: true },
            { name: "expiry", type: "date" },
            { name: "qty", type: "number", min: 0, required: true },
          ],
        },
      ],
    },
    {
      name: "heldFor",
      type: "relationship",
      relationTo: "cases",
      admin: { position: "sidebar", description: "Held stores reserved for a vessel's case." },
    },
  ],
};
