import type { CollectionConfig } from "payload";
import {
  CURRENCIES,
  STORE_OPTIONS,
  UNIT_OPTIONS,
  WAREHOUSE_OPTIONS,
  costVisible,
  deskAccess,
  isManagement,
  management,
  words,
} from "./shared.ts";

/** The product catalogue: Golden Sea's stores by IMPA series, with aliases so any customer wording finds the item. */
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: { en: "Product", ar: "منتج" }, plural: { en: "Products", ar: "المنتجات" } },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "store", "brand", "impa", "unit"],
    group: { en: "Catalogue", ar: "الكتالوج" },
    listSearchableFields: ["name", "impa", "issa", "oemPartNo"],
  },
  access: deskAccess,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Product", ar: "المنتج" },
          fields: [
            {
              name: "name",
              type: "text",
              label: { en: "Name", ar: "الاسم" },
              localized: true,
              required: true,
              admin: {
                description: { en: "The product name as stocked and quoted.", ar: "اسم المنتج كما يُخزَّن ويُسعَّر." },
                placeholder: { en: "e.g. Welding electrode E6013, 3.2 mm", ar: "مثال: قطب لحام E6013، 3.2 مم" },
              },
            },
            {
              name: "aliases",
              type: "array",
              label: { en: "Aliases", ar: "الأسماء البديلة" },
              labels: { singular: { en: "Alias", ar: "اسم بديل" }, plural: { en: "Aliases", ar: "الأسماء البديلة" } },
              admin: {
                description: {
                  en: "Other names customers use, so any wording finds the item.",
                  ar: "أسماء أخرى يستخدمها العملاء، ليُعثر على الصنف بأي صياغة.",
                },
              },
              fields: [
                {
                  name: "alias",
                  type: "text",
                  label: { en: "Alias", ar: "الاسم البديل" },
                  required: true,
                  admin: {
                    description: {
                      en: "One alternative name a customer might type.",
                      ar: "اسم بديل واحد قد يكتبه العميل.",
                    },
                    placeholder: { en: "e.g. Loctite blue", ar: "مثال: لوكتايت أزرق" },
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
                  label: { en: "Store", ar: "القسم" },
                  options: STORE_OPTIONS,
                  required: true,
                  admin: {
                    description: {
                      en: "The ship store section the item belongs to.",
                      ar: "قسم مستلزمات السفينة الذي ينتمي إليه الصنف.",
                    },
                    placeholder: words({ en: "Pick a store", ar: "اختر قسمًا" }),
                  },
                },
                {
                  name: "impaSeries",
                  type: "text",
                  label: { en: "IMPA series / section", ar: "سلسلة / قسم IMPA" },
                  admin: {
                    description: { en: "IMPA series the item is filed under.", ar: "سلسلة IMPA المصنّف تحتها الصنف." },
                    placeholder: { en: "e.g. 23 Welding", ar: "مثال: 23 لحام" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "brand",
                  type: "text",
                  label: { en: "Brand", ar: "العلامة التجارية" },
                  admin: {
                    description: { en: "The maker or brand.", ar: "الشركة المصنّعة أو العلامة التجارية." },
                    placeholder: { en: "e.g. ESAB", ar: "مثال: ESAB" },
                  },
                },
                {
                  name: "oemPartNo",
                  type: "text",
                  label: { en: "OEM part no.", ar: "رقم قطعة المصنّع" },
                  admin: {
                    description: { en: "The maker's own part number.", ar: "رقم القطعة الخاص بالمصنّع." },
                    placeholder: { en: "e.g. OK 46.00", ar: "مثال: OK 46.00" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "impa",
                  type: "text",
                  label: { en: "IMPA", ar: "IMPA" },
                  index: true,
                  admin: {
                    description: {
                      en: "Six-digit IMPA code vessels order by.",
                      ar: "رمز IMPA من ستة أرقام تطلب به السفن.",
                    },
                    placeholder: { en: "e.g. 232101", ar: "مثال: 232101" },
                  },
                },
                {
                  name: "issa",
                  type: "text",
                  label: { en: "ISSA", ar: "ISSA" },
                  admin: {
                    description: { en: "ISSA code, where the customer uses it.", ar: "رمز ISSA، حين يستخدمه العميل." },
                    placeholder: { en: "e.g. 54.011.02", ar: "مثال: 54.011.02" },
                  },
                },
                {
                  name: "hsCode",
                  type: "text",
                  label: { en: "HS code", ar: "رمز النظام المنسّق (HS)" },
                  admin: {
                    description: {
                      en: "Customs tariff code used for import and duty.",
                      ar: "رمز التعريفة الجمركية للاستيراد والرسوم.",
                    },
                    placeholder: { en: "e.g. 8311.10", ar: "مثال: 8311.10" },
                  },
                },
              ],
            },
            {
              name: "specification",
              type: "textarea",
              label: { en: "Specification", ar: "المواصفات" },
              localized: true,
              admin: {
                description: {
                  en: "Size, grade, standard and anything a buyer must match.",
                  ar: "المقاس والدرجة والمعيار وكل ما يجب أن يطابقه المشتري.",
                },
                placeholder: {
                  en: "e.g. AWS E6013, 3.2 mm x 350 mm, 5 kg pack",
                  ar: "مثال: AWS E6013، 3.2 × 350 مم، عبوة 5 كجم",
                },
              },
            },
          ],
        },
        {
          label: { en: "Units & packs", ar: "الوحدات والعبوات" },
          fields: [
            {
              name: "unit",
              type: "select",
              options: UNIT_OPTIONS,
              required: true,
              defaultValue: "EA",
              label: { en: "Base unit", ar: "الوحدة الأساسية" },
              admin: {
                description: {
                  en: "The smallest unit stock and prices are counted in.",
                  ar: "أصغر وحدة يُعدّ بها المخزون والأسعار.",
                },
                placeholder: words({ en: "e.g. EA", ar: "مثال: EA" }),
              },
            },
            {
              name: "packs",
              type: "array",
              label: { en: "Packs", ar: "العبوات" },
              labels: {
                singular: { en: "Pack size", ar: "حجم العبوة" },
                plural: { en: "Pack sizes", ar: "أحجام العبوات" },
              },
              admin: {
                description: {
                  en: "Pack sizes and their base units, to compare offers.",
                  ar: "أحجام العبوات ووحداتها الأساسية، لمقارنة العروض.",
                },
              },
              custom: {
                about: {
                  en: "Lets 200 cans of 250 ml match 100 cans of 500 ml: both are 50 L in base units.",
                  ar: "يجعل 200 علبة سعة 250 مل تطابق 100 علبة سعة 500 مل: كلاهما 50 لترًا بالوحدات الأساسية.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      label: { en: "Label", ar: "التسمية" },
                      localized: true,
                      required: true,
                      admin: {
                        description: { en: "How the pack is sold.", ar: "طريقة بيع العبوة." },
                        placeholder: { en: "e.g. Can 250 ml", ar: "مثال: علبة 250 مل" },
                      },
                    },
                    {
                      name: "baseQty",
                      type: "number",
                      required: true,
                      min: 0,
                      label: { en: "Base units per pack", ar: "الوحدات الأساسية في كل عبوة" },
                      admin: {
                        description: {
                          en: "How many base units one pack holds.",
                          ar: "عدد الوحدات الأساسية في العبوة الواحدة.",
                        },
                        placeholder: { en: "e.g. 0.25", ar: "مثال: 0.25" },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: "Compliance", ar: "المطابقة" },
          fields: [
            {
              name: "certificates",
              type: "select",
              label: { en: "Certificates", ar: "الشهادات" },
              hasMany: true,
              admin: {
                description: {
                  en: "Documents that must come with this item.",
                  ar: "المستندات التي يجب أن ترافق هذا الصنف.",
                },
                placeholder: words({ en: "e.g. Mill certificate", ar: "مثال: شهادة المصنع" }),
              },
              options: [
                { value: "SDS", label: { en: "SDS", ar: "SDS" } },
                { value: "TDS", label: { en: "TDS", ar: "TDS" } },
                { value: "Mill certificate", label: { en: "Mill certificate", ar: "شهادة المصنع" } },
                { value: "EN 397", label: { en: "EN 397", ar: "EN 397" } },
                { value: "EN ISO 11612", label: { en: "EN ISO 11612", ar: "EN ISO 11612" } },
                { value: "MED / SOLAS", label: { en: "MED / SOLAS", ar: "MED / SOLAS" } },
                { value: "Test certificate", label: { en: "Test certificate", ar: "شهادة اختبار" } },
                { value: "Health certificate", label: { en: "Health certificate", ar: "شهادة صحية" } },
                { value: "Halal", label: { en: "Halal", ar: "حلال" } },
                { value: "Customs bond release", label: { en: "Customs bond release", ar: "إفراج من الإيداع الجمركي" } },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "shelfLifeMonths",
                  type: "number",
                  min: 0,
                  label: { en: "Shelf life (months)", ar: "مدة الصلاحية (أشهر)" },
                  admin: {
                    description: {
                      en: "Months the item lasts from manufacture.",
                      ar: "عدد أشهر صلاحية الصنف من تاريخ التصنيع.",
                    },
                    placeholder: { en: "e.g. 24", ar: "مثال: 24" },
                  },
                },
                {
                  name: "minShelfLifeMonths",
                  type: "number",
                  min: 0,
                  label: { en: "Min. at delivery (months)", ar: "الحد الأدنى عند التسليم (أشهر)" },
                  admin: {
                    description: {
                      en: "Shelf life the vessel requires on arrival.",
                      ar: "مدة الصلاحية التي تشترطها السفينة عند الوصول.",
                    },
                    placeholder: { en: "e.g. 12", ar: "مثال: 12" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "coldChain",
                  type: "checkbox",
                  label: { en: "Cold chain (reefer)", ar: "سلسلة التبريد" },
                  defaultValue: false,
                  admin: {
                    description: {
                      en: "Tick when it must travel and stay chilled.",
                      ar: "حدّد عندما يجب نقله وحفظه مبرّدًا.",
                    },
                  },
                },
                {
                  name: "bonded",
                  type: "checkbox",
                  label: { en: "Bond store (customs)", ar: "مخزن الإيداع الجمركي" },
                  defaultValue: false,
                  admin: {
                    description: {
                      en: "Tick when it ships from the customs bond store.",
                      ar: "حدّد عندما يُشحن من مخزن الإيداع الجمركي.",
                    },
                  },
                },
                {
                  name: "licensed",
                  type: "checkbox",
                  label: { en: "Licensed (medicine)", ar: "مرخّص (أدوية)" },
                  defaultValue: false,
                  admin: {
                    description: {
                      en: "Tick when a licence is needed to supply it.",
                      ar: "حدّد عندما يلزم ترخيص لتوريده.",
                    },
                  },
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
      label: { en: "Agency", ar: "الوكالة" },
      relationTo: "suppliers",
      filterOptions: { kind: { equals: "agency" } },
      admin: {
        position: "sidebar",
        description: {
          en: "Agency principal whose pricelist prices this item.",
          ar: "الوكيل الأصلي الذي تحدد قائمة أسعاره سعر هذا الصنف.",
        },
        placeholder: words({ en: "e.g. Vecom Marine", ar: "مثال: Vecom Marine" }),
      },
    },
    {
      name: "active",
      type: "checkbox",
      label: { en: "Active", ar: "نشط" },
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: {
          en: "Untick to stop offering it on new quotations.",
          ar: "ألغِ التحديد لإيقاف عرضه في عروض الأسعار الجديدة.",
        },
      },
    },
  ],
};

/** Every dated price ever quoted — kept even when nothing was ordered. */
export const SupplierPrices: CollectionConfig = {
  slug: "supplier-prices",
  labels: {
    singular: { en: "Supplier price", ar: "سعر مورّد" },
    plural: { en: "Supplier prices", ar: "أسعار الموردين" },
  },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["product", "supplier", "price", "currency", "quotedAt", "validUntil", "source"],
    group: { en: "Catalogue", ar: "الكتالوج" },
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
    { name: "label", type: "text", label: { en: "Label", ar: "التسمية" }, admin: { hidden: true } },
    {
      type: "row",
      fields: [
        {
          name: "product",
          type: "relationship",
          label: { en: "Product", ar: "المنتج" },
          relationTo: "products",
          admin: {
            description: { en: "The catalogue item this price is for.", ar: "صنف الكتالوج الذي يخصه هذا السعر." },
            placeholder: words({ en: "Search products", ar: "ابحث في المنتجات" }),
          },
        },
        {
          name: "supplier",
          type: "relationship",
          label: { en: "Supplier", ar: "المورّد" },
          relationTo: "suppliers",
          required: true,
          admin: {
            description: { en: "Who quoted the price.", ar: "من قدّم السعر." },
            placeholder: words({ en: "e.g. Port Said Welding Co.", ar: "مثال: Port Said Welding Co." }),
          },
        },
      ],
    },
    {
      name: "description",
      type: "text",
      label: { en: "Description", ar: "الوصف" },
      admin: {
        description: {
          en: "Supplier's own wording when not matched to a product.",
          ar: "صياغة المورّد نفسه عندما لا يُطابَق بمنتج.",
        },
        placeholder: { en: "e.g. Electrode 3.2 mm, 5 kg box", ar: "مثال: قطب 3.2 مم، صندوق 5 كجم" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          label: { en: "Price", ar: "السعر" },
          required: true,
          min: 0,
          admin: {
            description: { en: "The supplier's price for one unit or pack.", ar: "سعر المورّد للوحدة أو العبوة." },
            placeholder: { en: "e.g. 18.50", ar: "مثال: 18.50" },
          },
        },
        {
          name: "currency",
          type: "select",
          label: { en: "Currency", ar: "العملة" },
          options: CURRENCIES,
          required: true,
          defaultValue: "EGP",
          admin: {
            description: { en: "Currency the supplier quoted in.", ar: "العملة التي سعّر بها المورّد." },
            placeholder: words({ en: "e.g. EGP", ar: "مثال: EGP" }),
          },
        },
        {
          name: "per",
          type: "text",
          label: { en: "Per (unit / pack)", ar: "لكل (وحدة / عبوة)" },
          defaultValue: "EA",
          admin: {
            description: { en: "What one price covers.", ar: "ما يغطيه السعر الواحد." },
            placeholder: { en: "e.g. kg", ar: "مثال: كجم" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "quotedAt",
          type: "date",
          label: { en: "Quoted At", ar: "تاريخ التسعير" },
          required: true,
          admin: {
            description: { en: "The day the supplier gave this price.", ar: "اليوم الذي قدّم فيه المورّد هذا السعر." },
          },
        },
        {
          name: "validUntil",
          type: "date",
          label: { en: "Valid Until", ar: "ساري حتى" },
          admin: { description: { en: "Last day the supplier honours it.", ar: "آخر يوم يلتزم فيه المورّد بالسعر." } },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "source",
          type: "select",
          label: { en: "Source", ar: "المصدر" },
          options: [
            { value: "Case offer", label: { en: "Case offer", ar: "عرض ملف" } },
            { value: "Email reply", label: { en: "Email reply", ar: "رد بالبريد" } },
            { value: "WhatsApp / phone", label: { en: "WhatsApp / phone", ar: "WhatsApp / هاتف" } },
            { value: "Purchase order", label: { en: "Purchase order", ar: "أمر شراء" } },
            { value: "Agency pricelist", label: { en: "Agency pricelist", ar: "قائمة أسعار وكالة" } },
          ],
          required: true,
          admin: {
            description: { en: "How we got the price.", ar: "كيف حصلنا على السعر." },
            placeholder: words({ en: "e.g. Email reply", ar: "مثال: رد بالبريد" }),
          },
        },
        {
          name: "case",
          type: "relationship",
          label: { en: "Case", ar: "الملف" },
          relationTo: "cases",
          admin: {
            description: { en: "The customer case it was asked for.", ar: "ملف العميل الذي طُلب السعر من أجله." },
            placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
          },
        },
        {
          name: "ordered",
          type: "checkbox",
          label: { en: "Ordered", ar: "تم الطلب" },
          defaultValue: false,
          admin: { description: { en: "Tick when we bought at this price.", ar: "حدّد عندما اشترينا بهذا السعر." } },
        },
      ],
    },
  ],
};

/** Agency principals' price lists (Vecom, Lalizas, Lukoil, Marichem…), versioned and approved. */
export const Pricelists: CollectionConfig = {
  slug: "pricelists",
  labels: { singular: { en: "Pricelist", ar: "قائمة أسعار" }, plural: { en: "Pricelists", ar: "قوائم الأسعار" } },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "principal", "currency", "discountPct", "validUntil", "status"],
    group: { en: "Catalogue", ar: "الكتالوج" },
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
      label: { en: "Title", ar: "العنوان" },
      localized: true,
      required: true,
      admin: {
        description: {
          en: "Principal and period, so versions are easy to tell apart.",
          ar: "الوكيل والفترة، ليسهل التمييز بين الإصدارات.",
        },
        placeholder: { en: "e.g. Vecom 2026 price list", ar: "مثال: قائمة أسعار Vecom 2026" },
      },
    },
    {
      name: "principal",
      type: "relationship",
      label: { en: "Principal", ar: "الشركة الأم" },
      relationTo: "suppliers",
      required: true,
      admin: {
        description: { en: "The agency principal who issued the list.", ar: "الوكيل الأصلي الذي أصدر القائمة." },
        placeholder: words({ en: "e.g. Vecom Marine", ar: "مثال: Vecom Marine" }),
      },
      filterOptions: { kind: { equals: "agency" } },
    },
    {
      type: "row",
      fields: [
        {
          name: "currency",
          type: "select",
          label: { en: "Currency", ar: "العملة" },
          options: CURRENCIES,
          required: true,
          admin: {
            description: { en: "Currency the list prices are in.", ar: "عملة أسعار القائمة." },
            placeholder: words({ en: "e.g. EUR", ar: "مثال: EUR" }),
          },
        },
        {
          name: "discountPct",
          type: "number",
          label: { en: "Agency discount %", ar: "خصم الوكالة %" },
          min: 0,
          max: 100,
          admin: {
            description: { en: "Our discount off list price.", ar: "خصمنا من سعر القائمة." },
            placeholder: { en: "e.g. 20", ar: "مثال: 20" },
          },
        },
        {
          name: "leadDays",
          type: "number",
          label: { en: "Import lead time (days)", ar: "مدة توريد الاستيراد (أيام)" },
          min: 0,
          admin: {
            description: { en: "Days from order to arrival in Egypt.", ar: "الأيام من الطلب حتى الوصول إلى مصر." },
            placeholder: { en: "e.g. 21", ar: "مثال: 21" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "validFrom",
          type: "date",
          label: { en: "Valid From", ar: "ساري من" },
          admin: { description: { en: "First day the list applies.", ar: "أول يوم تسري فيه القائمة." } },
        },
        {
          name: "validUntil",
          type: "date",
          label: { en: "Valid Until", ar: "ساري حتى" },
          admin: { description: { en: "Last day the list applies.", ar: "آخر يوم تسري فيه القائمة." } },
        },
      ],
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: { en: "Source file (XLSX / CSV / PDF)", ar: "الملف المصدر (XLSX / CSV / PDF)" },
      admin: { description: { en: "The list as the principal sent it.", ar: "القائمة كما أرسلها الوكيل." } },
    },
    {
      name: "items",
      type: "array",
      label: { en: "Items", ar: "البنود" },
      labels: { singular: { en: "Item", ar: "صنف" }, plural: { en: "Items", ar: "الأصناف" } },
      admin: { description: { en: "Each product on the list with its list price.", ar: "كل منتج في القائمة بسعره." } },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "product",
              type: "relationship",
              label: { en: "Product", ar: "المنتج" },
              relationTo: "products",
              admin: {
                description: { en: "The catalogue item this line prices.", ar: "صنف الكتالوج الذي يسعّره هذا البند." },
                placeholder: words({ en: "Search products", ar: "ابحث في المنتجات" }),
              },
            },
            {
              name: "code",
              type: "text",
              label: { en: "Principal code", ar: "رمز الوكيل" },
              admin: {
                description: { en: "The principal's own code for it.", ar: "الرمز الخاص بالوكيل لهذا الصنف." },
                placeholder: { en: "e.g. VC-10452", ar: "مثال: VC-10452" },
              },
            },
            {
              name: "listPrice",
              type: "number",
              label: { en: "List Price", ar: "سعر القائمة" },
              min: 0,
              required: true,
              admin: {
                description: { en: "Price before our agency discount.", ar: "السعر قبل خصم الوكالة." },
                placeholder: { en: "e.g. 120.00", ar: "مثال: 120.00" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      defaultValue: "Draft",
      options: [
        { value: "Draft", label: { en: "Draft", ar: "مسودة" } },
        { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
        { value: "Superseded", label: { en: "Superseded", ar: "مُستبدَل" } },
        { value: "Expired", label: { en: "Expired", ar: "منتهي" } },
      ],
      access: { update: isManagement },
      admin: {
        position: "sidebar",
        description: {
          en: "Only approved pricelists price lines automatically.",
          ar: "قوائم الأسعار المعتمدة وحدها تسعّر البنود تلقائيًا.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
  ],
};

/** Own stock per warehouse, with lots and expiry (FIFO). */
export const Stock: CollectionConfig = {
  slug: "stock",
  labels: { singular: { en: "Stock item", ar: "صنف مخزون" }, plural: { en: "Stock", ar: "المخزون" } },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["product", "warehouse", "onHand", "reserved", "available"],
    group: { en: "Catalogue", ar: "الكتالوج" },
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
    { name: "label", type: "text", label: { en: "Label", ar: "التسمية" }, admin: { hidden: true } },
    {
      type: "row",
      fields: [
        {
          name: "product",
          type: "relationship",
          label: { en: "Product", ar: "المنتج" },
          relationTo: "products",
          required: true,
          admin: {
            description: { en: "The catalogue item held.", ar: "صنف الكتالوج المحفوظ." },
            placeholder: words({ en: "Search products", ar: "ابحث في المنتجات" }),
          },
        },
        {
          name: "warehouse",
          type: "select",
          label: { en: "Warehouse", ar: "المستودع" },
          options: WAREHOUSE_OPTIONS,
          required: true,
          admin: {
            description: { en: "Which warehouse holds it.", ar: "المستودع الذي يحفظه." },
            placeholder: words({ en: "e.g. Alexandria", ar: "مثال: الإسكندرية" }),
          },
        },
        {
          name: "bin",
          type: "text",
          label: { en: "Location / bin", ar: "الموقع / الرف" },
          admin: {
            description: { en: "Shelf or bin where it sits.", ar: "الرف أو الخانة التي يوجد فيها." },
            placeholder: { en: "e.g. A-03-2", ar: "مثال: A-03-2" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "onHand",
          type: "number",
          label: { en: "On Hand", ar: "المتوفر" },
          min: 0,
          defaultValue: 0,
          admin: {
            description: {
              en: "Units physically in the warehouse; the lots add up to it.",
              ar: "الوحدات الموجودة فعليًا في المستودع؛ مجموع الدفعات يساويها.",
            },
            placeholder: { en: "e.g. 120", ar: "مثال: 120" },
          },
        },
        {
          name: "reserved",
          type: "number",
          label: { en: "Reserved", ar: "المحجوز" },
          min: 0,
          defaultValue: 0,
          admin: {
            description: {
              en: "Units promised to cases and not yet shipped.",
              ar: "الوحدات المحجوزة لملفات ولم تُشحن بعد.",
            },
            placeholder: { en: "e.g. 20", ar: "مثال: 20" },
          },
        },
        {
          name: "available",
          type: "number",
          label: { en: "Available", ar: "المتاح" },
          min: 0,
          admin: { readOnly: true, description: { en: "On hand minus reserved.", ar: "المتاح ناقص المحجوز." } },
        },
      ],
    },
    {
      name: "avgCostEGP",
      type: "number",
      label: { en: "Average cost (EGP)", ar: "متوسط التكلفة (EGP)" },
      min: 0,
      access: { read: costVisible },
      admin: {
        description: { en: "What one unit cost us on average, in EGP.", ar: "متوسط تكلفة الوحدة علينا بالجنيه." },
        placeholder: { en: "e.g. 42.80", ar: "مثال: 42.80" },
      },
    },
    {
      name: "lots",
      type: "array",
      label: { en: "Lots", ar: "الدفعات" },
      labels: { singular: { en: "Lot", ar: "دفعة" }, plural: { en: "Lots", ar: "الدفعات" } },
      admin: {
        description: {
          en: "Batches with their expiry, issued oldest first.",
          ar: "الدفعات بتواريخ انتهائها، يُصرف الأقدم أولًا.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lot",
              type: "text",
              label: { en: "Lot", ar: "الدفعة" },
              required: true,
              admin: {
                description: { en: "Batch number from the label.", ar: "رقم الدفعة من الملصق." },
                placeholder: { en: "e.g. LT-2511-04", ar: "مثال: LT-2511-04" },
              },
            },
            {
              name: "expiry",
              type: "date",
              label: { en: "Expiry", ar: "تاريخ الانتهاء" },
              admin: {
                description: { en: "Expiry date printed on the batch.", ar: "تاريخ الانتهاء المطبوع على الدفعة." },
              },
            },
            {
              name: "qty",
              type: "number",
              label: { en: "Qty", ar: "الكمية" },
              min: 0,
              required: true,
              admin: {
                description: { en: "Units left in this batch.", ar: "الوحدات المتبقية في هذه الدفعة." },
                placeholder: { en: "e.g. 60", ar: "مثال: 60" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "heldFor",
      type: "relationship",
      label: { en: "Held For", ar: "محجوز لـ" },
      relationTo: "cases",
      admin: {
        position: "sidebar",
        description: { en: "Held stores reserved for a vessel's case.", ar: "مستلزمات محتجزة مخصصة لملف سفينة." },
        placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
      },
    },
  ],
};
