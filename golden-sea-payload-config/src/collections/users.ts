import type { CollectionConfig } from "payload";
import { ROLE_OPTIONS, words } from "./shared.ts";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: { en: "User", ar: "مستخدم" }, plural: { en: "Users", ar: "المستخدمون" } },
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "office"],
    group: { en: "Team", ar: "الفريق" },
  },
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
      label: { en: "Name", ar: "الاسم" },
      required: true,
      admin: {
        description: { en: "How this person appears across the dashboard.", ar: "كيف يظهر هذا الشخص في لوحة التحكم." },
        placeholder: { en: "e.g. Karim Youssef", ar: "مثال: كريم يوسف" },
      },
    },
    {
      name: "initials",
      type: "text",
      label: { en: "Initials", ar: "الأحرف الأولى" },
      maxLength: 3,
      admin: {
        position: "sidebar",
        description: { en: "Two or three letters shown on avatars.", ar: "حرفان أو ثلاثة تظهر على الصورة الرمزية." },
        placeholder: { en: "e.g. KY", ar: "مثال: KY" },
      },
    },
    {
      name: "role",
      type: "select",
      label: { en: "Role", ar: "الدور" },
      required: true,
      defaultValue: "sales",
      options: ROLE_OPTIONS,
      access: { update: ({ req }) => req.user?.role === "management" },
      admin: {
        description: { en: "Decides what this person can see and do.", ar: "يحدد ما يمكن لهذا الشخص رؤيته وفعله." },
        placeholder: words({ en: "Pick a role", ar: "اختر دورًا" }),
      },
      custom: {
        about: {
          en: "Only management can change a role. Sales never sees costs, margins or case values.",
          ar: "الإدارة وحدها تغيّر الدور. المبيعات لا ترى التكاليف أو الهوامش أو قيم الملفات أبدًا.",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "phone",
          type: "text",
          label: { en: "Phone", ar: "الهاتف" },
          admin: {
            description: {
              en: "Used for WhatsApp / SMS alerts (after-hours RFQs).",
              ar: "يُستخدم لتنبيهات واتساب / الرسائل النصية (طلبات العروض بعد الدوام).",
            },
            placeholder: { en: "e.g. +20 100 123 4567", ar: "مثال: +20 100 123 4567" },
          },
        },
        {
          name: "office",
          type: "select",
          label: { en: "Office", ar: "المكتب" },
          options: [
            { value: "Cairo", label: { en: "Cairo", ar: "القاهرة" } },
            { value: "Alexandria", label: { en: "Alexandria", ar: "الإسكندرية" } },
            { value: "Greece", label: { en: "Greece", ar: "اليونان" } },
            { value: "US", label: { en: "US", ar: "الولايات المتحدة" } },
          ],
          admin: {
            description: {
              en: "The office or warehouse this person works from.",
              ar: "المكتب أو المستودع الذي يعمل منه هذا الشخص.",
            },
            placeholder: words({ en: "e.g. Alexandria", ar: "مثال: الإسكندرية" }),
          },
        },
      ],
    },
    {
      name: "language",
      type: "select",
      label: { en: "Language", ar: "اللغة" },
      defaultValue: "en",
      options: [
        { label: { en: "English", ar: "الإنجليزية" }, value: "en" },
        { label: { en: "العربية (Arabic)", ar: "العربية" }, value: "ar" },
      ],
      admin: {
        position: "sidebar",
        description: { en: "Dashboard language for this person.", ar: "لغة لوحة التحكم لهذا الشخص." },
        placeholder: words({ en: "English", ar: "الإنجليزية" }),
      },
    },
    {
      name: "notifications",
      type: "group",
      label: { en: "Notifications", ar: "الإشعارات" },
      admin: { description: { en: "Which alerts this person receives.", ar: "التنبيهات التي يتلقاها هذا الشخص." } },
      fields: [
        {
          name: "dailyBriefing",
          type: "checkbox",
          label: { en: "Daily briefing at 07:00", ar: "الملخص اليومي الساعة 07:00" },
          defaultValue: true,
          admin: {
            description: {
              en: "Tick to get the morning summary of open cases.",
              ar: "حدّد لتلقي ملخص الصباح للملفات المفتوحة.",
            },
          },
        },
        {
          name: "afterHoursAlerts",
          type: "checkbox",
          label: { en: "After-hours RFQ alerts when on call", ar: "تنبيهات طلبات العروض بعد الدوام أثناء المناوبة" },
          defaultValue: false,
          admin: {
            description: {
              en: "Tick to be alerted about RFQs that arrive outside office hours.",
              ar: "حدّد لتلقي تنبيه بطلبات العروض الواردة خارج ساعات العمل.",
            },
          },
        },
      ],
    },
    {
      name: "briefingSummarisedAt",
      type: "date",
      label: { en: "Briefing summarised again at", ar: "أُعيد تلخيص الملخص في" },
      admin: {
        hidden: true,
        description: {
          en: "When this person last asked for the morning briefing to be summarised again.",
          ar: "آخر مرة طلب فيها هذا الشخص إعادة تلخيص ملخص الصباح.",
        },
      },
    },
  ],
};
