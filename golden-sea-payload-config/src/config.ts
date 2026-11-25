import { defineConfig } from "saastemlycrm-design-system/contracts";
import { aside } from "./pages/aside.ts";
import { TODAY, words } from "./collections/shared.ts";
import { cashPage } from "./pages/cash.ts";
import { controlRoom } from "./pages/control-room.ts";
import { homePage } from "./pages/home.ts";
import { inboxHistoryPage } from "./pages/inbox-history.ts";
import { inboxPage } from "./pages/inbox.ts";
import { approvalsPage } from "./pages/approvals.ts";
import { automationsPage } from "./pages/automations.ts";
import { growthPage } from "./pages/growth.ts";
import { integrationsPage } from "./pages/integrations.ts";
import { projectPage } from "./pages/project.ts";
import { usagePage } from "./pages/usage.ts";
import { valuePage } from "./pages/value.ts";
import { rolesPage } from "./pages/roles.ts";
import { Cases } from "./collections/cases.ts";
import { Pricelists, Products, Stock, SupplierPrices } from "./collections/catalog.ts";
import { Approvals, CustomerPOs, Quotations } from "./collections/commercial.ts";
import { Customers, Media, Suppliers, Vessels } from "./collections/directory.ts";
import { Invoices, Payments } from "./collections/finance.ts";
import { Deliveries, PurchaseOrders, Receipts, SupplierBills } from "./collections/fulfilment.ts";
import { Campaigns, Opportunities, VendorRegistrations } from "./collections/growth.ts";
import { IntakeMessages, Offers, SupplierRfqs } from "./collections/sourcing.ts";
import { Users } from "./collections/users.ts";
import { Activities, AiCalls, Bookmarks, IntegrationExceptions, Notifications, Tasks } from "./collections/work.ts";
import { globals } from "./globals/index.ts";
import { withLooks } from "./collections/looks.ts";
import { GuideTopics, Tours } from "./globals/dashboard.ts";
import { endpoints } from "./endpoints/index.ts";
import { pages, sourcingPipeline } from "./pages.ts";

const collections = withLooks([
  Cases,
  Customers,
  Suppliers,
  Users,
  Media,
  IntakeMessages,
  SupplierRfqs,
  Offers,
  Quotations,
  Approvals,
  CustomerPOs,
  PurchaseOrders,
  SupplierBills,
  Receipts,
  Deliveries,
  Invoices,
  Payments,
  Vessels,
  Products,
  SupplierPrices,
  Pricelists,
  Stock,
  Tasks,
  Activities,
  IntegrationExceptions,
  AiCalls,
  Notifications,
  Bookmarks,
  Opportunities,
  VendorRegistrations,
  Campaigns,
  GuideTopics,
  Tours,
]);

export default defineConfig({
  localization: {
    locales: [
      { code: "en", label: "English" },
      { code: "ar", label: "العربية", rtl: true },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  admin: {
    user: "users",
    custom: {
      today: TODAY.toISOString(),
      nav: {
        groups: [
          {
            label: words({ en: "Sourcing desk", ar: "مكتب التوريد" }),
            icon: "inbox",
            section: words({ en: "Operations", ar: "العمليات" }),
          },
          {
            label: words({ en: "Commercial", ar: "التجاري" }),
            icon: "briefcase",
            section: words({ en: "Operations", ar: "العمليات" }),
          },
          {
            label: words({ en: "Fulfilment", ar: "التنفيذ" }),
            icon: "truck",
            section: words({ en: "Operations", ar: "العمليات" }),
          },
          {
            label: words({ en: "Finance", ar: "المالية" }),
            icon: "banknotes",
            section: words({ en: "Operations", ar: "العمليات" }),
          },
          {
            label: words({ en: "Insights", ar: "التحليلات" }),
            icon: "chart",
            section: words({ en: "Business", ar: "الأعمال" }),
          },
          {
            label: words({ en: "Growth", ar: "النمو" }),
            icon: "trending-up",
            section: words({ en: "Business", ar: "الأعمال" }),
          },
          {
            label: words({ en: "Work", ar: "العمل" }),
            icon: "clipboard",
            section: words({ en: "Business", ar: "الأعمال" }),
          },
          {
            label: words({ en: "Directory", ar: "الدليل" }),
            icon: "users",
            section: words({ en: "Records", ar: "السجلات" }),
          },
          {
            label: words({ en: "Catalogue", ar: "الكتالوج" }),
            icon: "cube",
            section: words({ en: "Records", ar: "السجلات" }),
          },
          { label: words({ en: "Team", ar: "الفريق" }), icon: "user", section: words({ en: "Setup", ar: "التهيئة" }) },
          {
            label: words({ en: "Configuration", ar: "الإعدادات" }),
            icon: "settings",
            section: words({ en: "Setup", ar: "التهيئة" }),
          },
        ],
      },
      aside,
      search: {
        synonyms: [
          ["customer", "client", "buyer", "shipowner", "operator", "manager", "company"],
          ["vessel", "ship", "boat", "tanker", "carrier", "rig", "fleet", "imo"],
          ["offer", "bid", "response", "supplier quote"],
          ["rfq", "request", "inquiry", "enquiry", "tender", "case", "requisition"],
          ["message", "email", "mail", "inbox", "intake", "whatsapp", "chat"],
          ["عميل", "زبون", "مشتري", "مالك سفن", "مشغل", "مدير سفن", "شركة", "customer"],
          ["سفينة", "مركب", "باخرة", "ناقلة", "حفار", "أسطول", "vessel"],
          ["عرض", "عطاء", "رد المورد", "عرض مورد", "offer"],
          ["طلب عرض أسعار", "طلب", "استفسار", "مناقصة", "ملف", "طلب توريد", "rfq"],
          ["رسالة", "بريد", "إيميل", "صندوق الوارد", "واتساب", "محادثة", "message"],
          ["مورد", "مورّد", "بائع", "supplier"],
          ["عرض سعر", "تسعيرة", "quotation"],
        ],
      },
      statusWords: {
        neutral: ["not awarded", "superseded", "لم يُرسَ", "مُستبدَل"],
        error: ["short", "damaged", "unreachable", "clarification", "not sourced", "نقص", "تالف", "توضيح", "لم يُورَّد"],
        warning: [
          "approved 1",
          "deposit to pay",
          "on watch",
          "documents pending",
          "دفعة مقدمة للدفع",
          "تحت المراقبة",
          "مستندات معلّقة",
        ],
        info: [
          "قيد التحقق",
          "قيد التوريد",
          "مقارنة",
          "قيد الشراء",
          "قيد التسليم",
          "التخليص الجمركي",
          "على متن",
          "تجريبي",
          "تم التعارف",
          "عميل محتمل",
          "validating",
          "sourcing",
          "comparing",
          "purchasing",
          "delivering",
          "customs",
          "loading",
          "dispatched",
          "on board",
          "boat transfer",
          "trial",
          "introduced",
          "prospect",
        ],
        success: ["first rfq", "أول طلب عرض"],
      },
    },
    meta: { titleSuffix: "· Golden Sea" },
    components: {
      views: {
        dashboard: { Component: homePage, path: "/" },
        inbox: {
          Component: inboxPage,
          path: "/inbox",
          meta: {
            title: words({ en: "Inbox", ar: "صندوق الوارد" }),
            description: words({
              en: "Every channel in one inbox; AI reads, people decide.",
              ar: "كل القنوات في صندوق واحد؛ الذكاء الاصطناعي يقرأ والناس يقررون.",
            }),
          },
          nav: {
            group: words({ en: "Sourcing desk", ar: "مكتب التوريد" }),
            label: words({ en: "Inbox", ar: "صندوق الوارد" }),
          },
        },
        history: {
          Component: inboxHistoryPage,
          path: "/inbox-history",
          meta: {
            title: words({ en: "Inbox history", ar: "سجل الوارد" }),
            description: words({
              en: "Years of email organised into customers, vessels, suppliers and dated prices.",
              ar: "سنوات من البريد منظمة في عملاء وسفن وموردين وأسعار مؤرخة.",
            }),
          },
          nav: {
            group: words({ en: "Sourcing desk", ar: "مكتب التوريد" }),
            label: words({ en: "Inbox history", ar: "سجل الوارد" }),
          },
        },
        approvals: {
          Component: approvalsPage,
          path: "/approvals",
          meta: {
            title: words({ en: "Approvals", ar: "الموافقات" }),
            description: words({ en: "Decisions waiting for a named person.", ar: "قرارات تنتظر شخصًا محددًا." }),
          },
          nav: {
            group: words({ en: "Commercial", ar: "التجاري" }),
            label: words({ en: "Approvals queue", ar: "قائمة الموافقات" }),
          },
        },
        cash: {
          Component: cashPage,
          path: "/cash",
          meta: {
            title: words({ en: "Receivables & payables", ar: "المستحقات والمدفوعات" }),
            description: words({
              en: "What customers owe, what we owe suppliers, and what needs approval.",
              ar: "ما يدين به العملاء، وما ندين به للموردين، وما يحتاج موافقة.",
            }),
          },
          nav: {
            group: words({ en: "Finance", ar: "المالية" }),
            label: words({ en: "Receivables & payables", ar: "المستحقات والمدفوعات" }),
          },
        },
        controlRoom: {
          Component: controlRoom,
          path: "/control-room",
          meta: {
            title: words({ en: "Control room", ar: "غرفة التحكم" }),
            description: words({ en: "The business, live. Briefed at 07:00.", ar: "العمل مباشرةً. ملخص الساعة 07:00." }),
          },
          nav: {
            group: words({ en: "Insights", ar: "التحليلات" }),
            label: words({ en: "Control room", ar: "غرفة التحكم" }),
          },
        },
        growth: {
          Component: growthPage,
          path: "/growth",
          meta: {
            title: words({ en: "Growth board", ar: "لوحة النمو" }),
            description: words({
              en: "Prospects, fleets and vendor registrations.",
              ar: "العملاء المحتملون والأساطيل وتسجيلات الموردين.",
            }),
          },
          nav: { group: words({ en: "Growth", ar: "النمو" }), label: words({ en: "Growth board", ar: "لوحة النمو" }) },
        },
        automations: {
          Component: automationsPage,
          path: "/automations",
          meta: {
            title: words({ en: "Automations", ar: "الأتمتة" }),
            description: words({
              en: "Every rule explicit, nothing failing silently.",
              ar: "كل قاعدة صريحة، ولا شيء يفشل بصمت.",
            }),
          },
          nav: { group: words({ en: "Work", ar: "العمل" }), label: words({ en: "Automations", ar: "الأتمتة" }) },
        },
        roles: {
          Component: rolesPage,
          path: "/roles",
          meta: {
            title: words({ en: "Roles & permissions", ar: "الأدوار والصلاحيات" }),
            description: words({ en: "Who can see and approve what.", ar: "من يمكنه رؤية ماذا واعتماده." }),
          },
          nav: {
            group: words({ en: "Team", ar: "الفريق" }),
            label: words({ en: "Roles & permissions", ar: "الأدوار والصلاحيات" }),
          },
        },
        integrations: {
          Component: integrationsPage,
          path: "/integrations",
          meta: {
            title: words({ en: "Integrations", ar: "التكاملات" }),
            description: words({
              en: "Mailboxes, website form, WhatsApp, e-invoicing and Odoo.",
              ar: "صناديق البريد ونموذج الموقع وواتساب والفاتورة الإلكترونية وOdoo.",
            }),
          },
          nav: {
            group: words({ en: "Configuration", ar: "الإعدادات" }),
            label: words({ en: "Integrations", ar: "التكاملات" }),
          },
        },
        project: {
          Component: projectPage,
          path: "/project",
          meta: {
            title: words({ en: "Delivery plan", ar: "خطة التنفيذ" }),
            description: words({
              en: "Phases, requirements coverage and acceptance tests.",
              ar: "المراحل وتغطية المتطلبات واختبارات القبول.",
            }),
          },
          nav: {
            group: words({ en: "Insights", ar: "التحليلات" }),
            label: words({ en: "Delivery plan", ar: "خطة التنفيذ" }),
          },
        },
        value: {
          Component: valuePage,
          path: "/value",
          meta: {
            title: words({ en: "Value", ar: "القيمة" }),
            description: words({
              en: "When the platform pays for itself, in your own figures.",
              ar: "متى تسدد المنصة تكلفتها، بأرقامكم أنتم.",
            }),
          },
          nav: { group: words({ en: "Insights", ar: "التحليلات" }), label: words({ en: "Value", ar: "القيمة" }) },
        },
        usage: {
          Component: usagePage,
          path: "/usage",
          meta: {
            title: words({ en: "Service usage", ar: "استخدام الخدمة" }),
            description: words({
              en: "This month's use of the service, counted in units.",
              ar: "استخدام الخدمة هذا الشهر، محسوبًا بالوحدات.",
            }),
          },
          nav: {
            group: words({ en: "Configuration", ar: "الإعدادات" }),
            label: words({ en: "Service usage", ar: "استخدام الخدمة" }),
          },
        },
        pipeline: sourcingPipeline,
        ...pages(collections, globals),
      },
    },
  },
  collections,
  globals,
  endpoints,
});
