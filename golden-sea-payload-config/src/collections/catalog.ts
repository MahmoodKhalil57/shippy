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
            {
              name: "name",
              type: "text",
              required: true,
              admin: {
                description: "The product name as stocked and quoted.",
                placeholder: "e.g. Welding electrode E6013, 3.2 mm",
              },
            },
            {
              name: "aliases",
              type: "array",
              labels: { singular: "Alias", plural: "Aliases" },
              admin: { description: "Other names customers use, so any wording finds the item." },
              fields: [
                {
                  name: "alias",
                  type: "text",
                  required: true,
                  admin: {
                    description: "One alternative name a customer might type.",
                    placeholder: "e.g. Loctite blue",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "store",
                  type: "select",
                  options: STORES,
                  required: true,
                  admin: { description: "The ship store section the item belongs to.", placeholder: "Pick a store" },
                },
                {
                  name: "impaSeries",
                  type: "text",
                  label: "IMPA series / section",
                  admin: { description: "IMPA series the item is filed under.", placeholder: "e.g. 23 Welding" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "brand",
                  type: "text",
                  admin: { description: "The maker or brand.", placeholder: "e.g. ESAB" },
                },
                {
                  name: "oemPartNo",
                  type: "text",
                  label: "OEM part no.",
                  admin: { description: "The maker's own part number.", placeholder: "e.g. OK 46.00" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "impa",
                  type: "text",
                  label: "IMPA",
                  index: true,
                  admin: { description: "Six-digit IMPA code vessels order by.", placeholder: "e.g. 232101" },
                },
                {
                  name: "issa",
                  type: "text",
                  label: "ISSA",
                  admin: { description: "ISSA code, where the customer uses it.", placeholder: "e.g. 54.011.02" },
                },
                {
                  name: "hsCode",
                  type: "text",
                  label: "HS code",
                  admin: { description: "Customs tariff code used for import and duty.", placeholder: "e.g. 8311.10" },
                },
              ],
            },
            {
              name: "specification",
              type: "textarea",
              admin: {
                description: "Size, grade, standard and anything a buyer must match.",
                placeholder: "e.g. AWS E6013, 3.2 mm x 350 mm, 5 kg pack",
              },
            },
          ],
        },
        {
          label: "Units & packs",
          fields: [
            {
              name: "unit",
              type: "select",
              options: UNITS,
              required: true,
              defaultValue: "EA",
              label: "Base unit",
              admin: { description: "The smallest unit stock and prices are counted in.", placeholder: "e.g. EA" },
            },
            {
              name: "packs",
              type: "array",
              labels: { singular: "Pack size", plural: "Pack sizes" },
              admin: { description: "Pack sizes and their base units, to compare offers." },
              custom: { about: "Lets 200 cans of 250 ml match 100 cans of 500 ml: both are 50 L in base units." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      admin: { description: "How the pack is sold.", placeholder: "e.g. Can 250 ml" },
                    },
                    {
                      name: "baseQty",
                      type: "number",
                      required: true,
                      min: 0,
                      label: "Base units per pack",
                      admin: { description: "How many base units one pack holds.", placeholder: "e.g. 0.25" },
                    },
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
              admin: { description: "Documents that must come with this item.", placeholder: "e.g. Mill certificate" },
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
                {
                  name: "shelfLifeMonths",
                  type: "number",
                  min: 0,
                  label: "Shelf life (months)",
                  admin: { description: "Months the item lasts from manufacture.", placeholder: "e.g. 24" },
                },
                {
                  name: "minShelfLifeMonths",
                  type: "number",
                  min: 0,
                  label: "Min. at delivery (months)",
                  admin: { description: "Shelf life the vessel requires on arrival.", placeholder: "e.g. 12" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "coldChain",
                  type: "checkbox",
                  label: "Cold chain (reefer)",
                  defaultValue: false,
                  admin: { description: "Tick when it must travel and stay chilled." },
                },
                {
                  name: "bonded",
                  type: "checkbox",
                  label: "Bond store (customs)",
                  defaultValue: false,
                  admin: { description: "Tick when it ships from the customs bond store." },
                },
                {
                  name: "licensed",
                  type: "checkbox",
                  label: "Licensed (medicine)",
                  defaultValue: false,
                  admin: { description: "Tick when a licence is needed to supply it." },
                },
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
      admin: {
        position: "sidebar",
        description: "Agency principal whose pricelist prices this item.",
        placeholder: "e.g. Vecom Marine",
      },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Untick to stop offering it on new quotations." },
    },
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
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          admin: { description: "The catalogue item this price is for.", placeholder: "Search products" },
        },
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          admin: { description: "Who quoted the price.", placeholder: "e.g. Port Said Welding Co." },
        },
      ],
    },
    {
      name: "description",
      type: "text",
      admin: {
        description: "Supplier's own wording when not matched to a product.",
        placeholder: "e.g. Electrode 3.2 mm, 5 kg box",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          admin: { description: "The supplier's price for one unit or pack.", placeholder: "e.g. 18.50" },
        },
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          required: true,
          defaultValue: "EGP",
          admin: { description: "Currency the supplier quoted in.", placeholder: "e.g. EGP" },
        },
        {
          name: "per",
          type: "text",
          label: "Per (unit / pack)",
          defaultValue: "EA",
          admin: { description: "What one price covers.", placeholder: "e.g. kg" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "quotedAt",
          type: "date",
          required: true,
          admin: { description: "The day the supplier gave this price." },
        },
        { name: "validUntil", type: "date", admin: { description: "Last day the supplier honours it." } },
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
          admin: { description: "How we got the price.", placeholder: "e.g. Email reply" },
        },
        {
          name: "case",
          type: "relationship",
          relationTo: "cases",
          admin: { description: "The customer case it was asked for.", placeholder: "e.g. GS-RFQ-0142" },
        },
        {
          name: "ordered",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Tick when we bought at this price." },
        },
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
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Principal and period, so versions are easy to tell apart.",
        placeholder: "e.g. Vecom 2026 price list",
      },
    },
    {
      name: "principal",
      type: "relationship",
      relationTo: "suppliers",
      required: true,
      admin: { description: "The agency principal who issued the list.", placeholder: "e.g. Vecom Marine" },
      filterOptions: { kind: { equals: "agency" } },
    },
    {
      type: "row",
      fields: [
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          required: true,
          admin: { description: "Currency the list prices are in.", placeholder: "e.g. EUR" },
        },
        {
          name: "discountPct",
          type: "number",
          label: "Agency discount %",
          min: 0,
          max: 100,
          admin: { description: "Our discount off list price.", placeholder: "e.g. 20" },
        },
        {
          name: "leadDays",
          type: "number",
          label: "Import lead time (days)",
          min: 0,
          admin: { description: "Days from order to arrival in Egypt.", placeholder: "e.g. 21" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "validFrom", type: "date", admin: { description: "First day the list applies." } },
        { name: "validUntil", type: "date", admin: { description: "Last day the list applies." } },
      ],
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: "Source file (XLSX / CSV / PDF)",
      admin: { description: "The list as the principal sent it." },
    },
    {
      name: "items",
      type: "array",
      labels: { singular: "Item", plural: "Items" },
      admin: { description: "Each product on the list with its list price." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "product",
              type: "relationship",
              relationTo: "products",
              admin: { description: "The catalogue item this line prices.", placeholder: "Search products" },
            },
            {
              name: "code",
              type: "text",
              label: "Principal code",
              admin: { description: "The principal's own code for it.", placeholder: "e.g. VC-10452" },
            },
            {
              name: "listPrice",
              type: "number",
              min: 0,
              required: true,
              admin: { description: "Price before our agency discount.", placeholder: "e.g. 120.00" },
            },
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
      admin: {
        position: "sidebar",
        description: "Only approved pricelists price lines automatically.",
        placeholder: "Pick a status",
      },
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
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          admin: { description: "The catalogue item held.", placeholder: "Search products" },
        },
        {
          name: "warehouse",
          type: "select",
          options: WAREHOUSES,
          required: true,
          admin: { description: "Which warehouse holds it.", placeholder: "e.g. Alexandria" },
        },
        {
          name: "bin",
          type: "text",
          label: "Location / bin",
          admin: { description: "Shelf or bin where it sits.", placeholder: "e.g. A-03-2" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "onHand",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { description: "Units physically in the warehouse; the lots add up to it.", placeholder: "e.g. 120" },
        },
        {
          name: "reserved",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { description: "Units promised to cases and not yet shipped.", placeholder: "e.g. 20" },
        },
        {
          name: "available",
          type: "number",
          min: 0,
          admin: { readOnly: true, description: "On hand minus reserved." },
        },
      ],
    },
    {
      name: "avgCostEGP",
      type: "number",
      label: "Average cost (EGP)",
      min: 0,
      access: { read: costVisible },
      admin: { description: "What one unit cost us on average, in EGP.", placeholder: "e.g. 42.80" },
    },
    {
      name: "lots",
      type: "array",
      labels: { singular: "Lot", plural: "Lots" },
      admin: { description: "Batches with their expiry, issued oldest first." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lot",
              type: "text",
              required: true,
              admin: { description: "Batch number from the label.", placeholder: "e.g. LT-2511-04" },
            },
            { name: "expiry", type: "date", admin: { description: "Expiry date printed on the batch." } },
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              admin: { description: "Units left in this batch.", placeholder: "e.g. 60" },
            },
          ],
        },
      ],
    },
    {
      name: "heldFor",
      type: "relationship",
      relationTo: "cases",
      admin: {
        position: "sidebar",
        description: "Held stores reserved for a vessel's case.",
        placeholder: "e.g. GS-RFQ-0142",
      },
    },
  ],
};
