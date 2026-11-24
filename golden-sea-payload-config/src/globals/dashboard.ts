import type { CollectionConfig, GlobalConfig } from "payload";
import { ROLE_OPTIONS, anyone, loggedIn, management, words } from "../collections/shared.ts";

/**
 * The dashboard's own content, as data people edit in the dashboard: the brand (read before
 * anyone signs in), the in-app helper, its platform guide, and the guided tours. Seeded from
 * src/seed, so a new project changes records, not code.
 */

export const Branding: GlobalConfig = {
  slug: "branding",
  label: { en: "Branding", ar: "الهوية" },
  admin: {
    group: { en: "Configuration", ar: "الإعدادات" },
    description: {
      en: "Name, icon and photos of the dashboard; shown before sign-in too.",
      ar: "اسم لوحة التحكم وأيقونتها وصورها؛ تظهر قبل تسجيل الدخول أيضًا.",
    },
  },
  access: { read: anyone, update: management },
  fields: [
    {
      name: "name",
      type: "text",
      label: { en: "Name", ar: "الاسم" },
      required: true,
      defaultValue: "Dashboard",
      admin: {
        description: {
          en: "Shown in the browser tab, the sidebar and the login page.",
          ar: "يظهر في تبويب المتصفح والشريط الجانبي وصفحة الدخول.",
        },
        placeholder: { en: "e.g. Golden Sea", ar: "مثال: Golden Sea" },
      },
    },
    {
      name: "description",
      type: "textarea",
      label: { en: "Description", ar: "الوصف" },
      admin: {
        description: {
          en: "One line about the business, used for search results and link previews.",
          ar: "سطر واحد عن العمل، يُستخدم في نتائج البحث ومعاينات الروابط.",
        },
        placeholder: {
          en: "e.g. Ship chandler supplying vessels in Egyptian ports.",
          ar: "مثال: مورّد سفن يخدم السفن في الموانئ المصرية.",
        },
      },
    },
    {
      name: "icon",
      type: "text",
      label: { en: "Icon", ar: "الأيقونة" },
      defaultValue: "grid",
      admin: {
        description: {
          en: "An icon name from the design system, such as anchor, grid or cube.",
          ar: "اسم أيقونة من نظام التصميم، مثل anchor أو grid أو cube.",
        },
        placeholder: { en: "e.g. anchor", ar: "مثال: anchor" },
      },
    },
    {
      name: "loginIntro",
      type: "textarea",
      localized: true,
      label: { en: "Line on the login page", ar: "سطر صفحة الدخول" },
      admin: {
        description: {
          en: "A welcome line shown above the sign-in form.",
          ar: "سطر ترحيب يظهر فوق نموذج تسجيل الدخول.",
        },
        placeholder: {
          en: "e.g. Sign in to manage RFQs, quotes and deliveries.",
          ar: "مثال: سجّل الدخول لإدارة طلبات العروض وعروض الأسعار والتسليمات.",
        },
      },
    },
    {
      name: "poweredBy",
      type: "text",
      label: { en: "Footer: powered by", ar: "التذييل: مشغَّل بواسطة" },
      admin: {
        description: { en: "Credit line in the footer of the login page.", ar: "سطر الإشادة في تذييل صفحة الدخول." },
        placeholder: { en: "e.g. Powered by SaaSTEMLY", ar: "مثال: Powered by SaaSTEMLY" },
      },
    },
    {
      name: "backgrounds",
      type: "array",
      label: { en: "Background photos", ar: "صور الخلفية" },
      admin: { description: { en: "Login page photos, one row each.", ar: "صور صفحة الدخول، صف لكل صورة." } },
      custom: {
        about: {
          en: "Paths are below the site root without .jpg. Each photo needs a -thumb.jpg next to it.",
          ar: "المسارات تحت جذر الموقع بدون .jpg. تحتاج كل صورة ملف -thumb.jpg بجانبها.",
        },
      },
      fields: [
        {
          name: "path",
          type: "text",
          label: { en: "Path", ar: "المسار" },
          required: true,
          admin: {
            description: { en: "Where the photo lives, without .jpg.", ar: "مكان الصورة، بدون .jpg." },
            placeholder: { en: "e.g. backgrounds/port-said", ar: "مثال: backgrounds/port-said" },
          },
        },
        {
          name: "label",
          type: "text",
          label: { en: "Label", ar: "التسمية" },
          localized: true,
          required: true,
          admin: {
            description: { en: "Caption naming what the photo shows.", ar: "تعليق يوضح ما تعرضه الصورة." },
            placeholder: { en: "e.g. Port Said at dawn", ar: "مثال: بورسعيد عند الفجر" },
          },
        },
      ],
    },
    {
      name: "backgroundCredit",
      type: "text",
      label: { en: "Photo credit", ar: "حقوق الصور" },
      admin: {
        description: { en: "Who took the background photos.", ar: "من التقط صور الخلفية." },
        placeholder: { en: "e.g. Photos by Unsplash contributors", ar: "مثال: صور من مساهمي Unsplash" },
      },
    },
  ],
};

export const Assistant: GlobalConfig = {
  slug: "assistant",
  label: { en: "Assistant", ar: "المساعد" },
  admin: {
    group: { en: "Configuration", ar: "الإعدادات" },
    description: {
      en: "The in-app helper: its name, what the business is, and who it talks to.",
      ar: "المساعد داخل التطبيق: اسمه، وطبيعة العمل، ومن يحادثه.",
    },
  },
  access: { read: loggedIn, update: management },
  fields: [
    {
      name: "name",
      type: "text",
      label: { en: "Name", ar: "الاسم" },
      required: true,
      defaultValue: "Assistant",
      admin: {
        description: {
          en: "What the helper calls itself in the chat panel.",
          ar: "الاسم الذي يسمّي به المساعد نفسه في لوحة المحادثة.",
        },
        placeholder: { en: "e.g. Captain", ar: "مثال: الكابتن" },
      },
    },
    {
      name: "business",
      type: "text",
      localized: true,
      label: { en: "What the business is", ar: "طبيعة العمل" },
      admin: {
        description: {
          en: "One phrase the AI prompts use to describe the business.",
          ar: "عبارة واحدة تصف بها أوامر الذكاء الاصطناعي العمل.",
        },
        placeholder: { en: "e.g. a ship chandler in Egypt", ar: "مثال: مورّد سفن في مصر" },
      },
    },
    {
      name: "ask",
      type: "text",
      label: { en: "Question endpoint", ar: "نقطة الأسئلة" },
      defaultValue: "/ask",
      admin: {
        description: {
          en: "POST endpoint that answers business questions from records.",
          ar: "نقطة POST تجيب عن أسئلة العمل من السجلات.",
        },
        placeholder: { en: "e.g. /ask", ar: "مثال: /ask" },
      },
    },
    {
      name: "roleNotes",
      type: "array",
      label: { en: "What each role does", ar: "ما يفعله كل دور" },
      admin: {
        description: {
          en: "A short job description per role, so answers fit who is asking.",
          ar: "وصف وظيفي قصير لكل دور، لتناسب الإجابات السائل.",
        },
      },
      fields: [
        {
          name: "role",
          type: "select",
          label: { en: "Role", ar: "الدور" },
          options: ROLE_OPTIONS,
          required: true,
          admin: {
            description: { en: "The role this note describes.", ar: "الدور الذي تصفه هذه الملاحظة." },
            placeholder: words({ en: "Pick a role", ar: "اختر دورًا" }),
          },
        },
        {
          name: "note",
          type: "textarea",
          label: { en: "Note", ar: "ملاحظة" },
          localized: true,
          required: true,
          admin: {
            description: { en: "What this role does day to day.", ar: "ما يفعله هذا الدور يوميًا." },
            placeholder: {
              en: "e.g. Sales prices quotes and follows up with captains.",
              ar: "مثال: المبيعات تسعّر العروض وتتابع مع القباطنة.",
            },
          },
        },
        {
          name: "suggestions",
          type: "text",
          localized: true,
          hasMany: true,
          label: { en: "Starter questions", ar: "أسئلة البداية" },
          admin: {
            description: {
              en: "Offered when someone in this role opens the helper.",
              ar: "تُعرض عندما يفتح شخص بهذا الدور المساعد.",
            },
            placeholder: { en: "e.g. Which quotes expire this week?", ar: "مثال: أي العروض تنتهي هذا الأسبوع؟" },
          },
        },
      ],
    },
    {
      name: "suggestions",
      type: "text",
      localized: true,
      hasMany: true,
      label: { en: "Starter questions (other roles)", ar: "أسئلة البداية (الأدوار الأخرى)" },
      admin: {
        description: {
          en: "Offered to roles without starter questions of their own.",
          ar: "تُعرض للأدوار التي ليس لها أسئلة بداية خاصة.",
        },
        placeholder: { en: "e.g. What needs my attention today?", ar: "مثال: ما الذي يحتاج انتباهي اليوم؟" },
      },
    },
    {
      type: "collapsible",
      label: { en: "How the helper reads requests", ar: "كيف يقرأ المساعد الطلبات" },
      admin: { initCollapsed: true },
      fields: [
        {
          name: "mainRecord",
          type: "text",
          label: { en: "Main record collection", ar: "مجموعة السجل الرئيسي" },
          admin: {
            description: {
              en: "Where status questions look records up first, as a collection slug.",
              ar: "حيث تبحث أسئلة الحالة عن السجلات أولًا، كمعرّف مجموعة.",
            },
            placeholder: { en: "e.g. cases", ar: "مثال: cases" },
          },
        },
        {
          name: "recordPattern",
          type: "text",
          label: { en: "Record number pattern", ar: "نمط رقم السجل" },
          admin: {
            description: {
              en: "What record numbers look like, as a regular expression.",
              ar: "شكل أرقام السجلات، كتعبير نمطي.",
            },
            placeholder: { en: "e.g. GS-[A-Z]+-\\d+", ar: "مثال: GS-[A-Z]+-\\d+" },
          },
        },
        {
          name: "businessKeywords",
          type: "text",
          hasMany: true,
          label: { en: "Business words", ar: "كلمات العمل" },
          admin: {
            description: {
              en: "Words or word starts that make a message a question for the records.",
              ar: "كلمات أو بدايات كلمات تجعل الرسالة سؤالًا للسجلات.",
            },
            placeholder: { en: "e.g. approv", ar: "مثال: approv" },
          },
        },
        {
          name: "examples",
          type: "array",
          label: { en: "Example requests", ar: "أمثلة الطلبات" },
          admin: {
            description: { en: "One or two requests per kind of question.", ar: "طلب أو طلبان لكل نوع من الأسئلة." },
          },
          custom: {
            about: {
              en: "The on-device model follows examples better than rules, so show it real requests.",
              ar: "النموذج على الجهاز يتبع الأمثلة أفضل من القواعد، فأرِه طلبات حقيقية.",
            },
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "question",
                  type: "text",
                  label: { en: "Question", ar: "السؤال" },
                  required: true,
                  admin: {
                    width: "50%",
                    description: { en: "What someone might type.", ar: "ما قد يكتبه شخص." },
                    placeholder: { en: "e.g. Status of GS-RFQ-1042", ar: "مثال: حالة GS-RFQ-1042" },
                  },
                },
                {
                  name: "kind",
                  type: "select",
                  label: { en: "Kind", ar: "النوع" },
                  required: true,
                  admin: {
                    width: "25%",
                    description: { en: "Which tool answers it.", ar: "الأداة التي تجيب عنه." },
                    placeholder: words({ en: "Pick a kind", ar: "اختر نوعًا" }),
                  },
                  options: [
                    { label: { en: "Open a page", ar: "فتح صفحة" }, value: "open_page" },
                    { label: { en: "What's on screen", ar: "ما على الشاشة" }, value: "what_is_on_screen" },
                    { label: { en: "My day", ar: "يومي" }, value: "my_day" },
                    { label: { en: "Record status", ar: "حالة السجل" }, value: "record_status" },
                    { label: { en: "Find", ar: "بحث" }, value: "find" },
                    { label: { en: "Ask the records", ar: "اسأل السجلات" }, value: "ask_records" },
                    { label: { en: "Platform guide", ar: "دليل المنصة" }, value: "platform_guide" },
                  ],
                },
                {
                  name: "argument",
                  type: "text",
                  label: { en: "What the tool gets", ar: "ما تتلقاه الأداة" },
                  admin: {
                    width: "25%",
                    description: { en: "The value passed to the tool.", ar: "القيمة الممررة إلى الأداة." },
                    placeholder: { en: "e.g. GS-RFQ-1042", ar: "مثال: GS-RFQ-1042" },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const GuideTopics: CollectionConfig = {
  slug: "guide-topics",
  labels: { singular: { en: "Guide topic", ar: "موضوع الدليل" }, plural: { en: "Guide topics", ar: "موضوعات الدليل" } },
  admin: {
    useAsTitle: "topic",
    defaultColumns: ["topic", "keywords"],
    group: { en: "Configuration", ar: "الإعدادات" },
    description: {
      en: "How the platform works, in short sections the helper looks up and quotes.",
      ar: "كيف تعمل المنصة، في أقسام قصيرة يبحث فيها المساعد ويقتبس منها.",
    },
  },
  access: { read: loggedIn, create: management, update: management, delete: management },
  fields: [
    {
      name: "topic",
      type: "text",
      label: { en: "Topic", ar: "الموضوع" },
      localized: true,
      required: true,
      admin: {
        description: { en: "The section title the helper quotes.", ar: "عنوان القسم الذي يقتبسه المساعد." },
        placeholder: { en: "e.g. How approvals work", ar: "مثال: كيف تعمل الموافقات" },
      },
    },
    {
      name: "keywords",
      type: "text",
      label: { en: "Keywords", ar: "الكلمات المفتاحية" },
      admin: {
        description: { en: "Words people use when they ask about it.", ar: "كلمات يستخدمها الناس عند السؤال عنه." },
        placeholder: { en: "e.g. approve, sign off, discount", ar: "مثال: اعتماد، موافقة، خصم" },
      },
    },
    {
      name: "text",
      type: "textarea",
      label: { en: "Text", ar: "النص" },
      localized: true,
      required: true,
      admin: {
        rows: 6,
        description: { en: "The explanation, in short plain sentences.", ar: "الشرح، في جمل قصيرة بسيطة." },
        placeholder: {
          en: "e.g. Quotes over 50,000 EGP need a manager's approval before sending.",
          ar: "مثال: العروض التي تزيد على 50,000 جنيه تحتاج موافقة المدير قبل الإرسال.",
        },
      },
    },
  ],
};

export const Tours: CollectionConfig = {
  slug: "tours",
  labels: { singular: { en: "Tour", ar: "جولة" }, plural: { en: "Tours", ar: "الجولات" } },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "summary"],
    group: { en: "Configuration", ar: "الإعدادات" },
    description: {
      en: "Guided tours, started from the side panel. A step can sign in as another user, open a page and click.",
      ar: "جولات إرشادية تبدأ من اللوحة الجانبية. يمكن للخطوة تسجيل الدخول كمستخدم آخر وفتح صفحة والنقر.",
    },
  },
  access: { read: loggedIn, create: management, update: management, delete: management },
  fields: [
    {
      name: "title",
      type: "text",
      label: { en: "Title", ar: "العنوان" },
      localized: true,
      required: true,
      admin: {
        description: { en: "The tour's name in the side panel.", ar: "اسم الجولة في اللوحة الجانبية." },
        placeholder: { en: "e.g. From RFQ to quote", ar: "مثال: من طلب العرض إلى عرض السعر" },
      },
    },
    {
      name: "summary",
      type: "text",
      label: { en: "Summary", ar: "الملخص" },
      localized: true,
      required: true,
      admin: {
        description: { en: "One line saying what the tour teaches.", ar: "سطر واحد عمّا تعلّمه الجولة." },
        placeholder: {
          en: "e.g. Follow a request from the inbox to a sent quotation.",
          ar: "مثال: تتبّع طلبًا من صندوق الوارد حتى إرسال عرض السعر.",
        },
      },
    },
    {
      name: "steps",
      type: "array",
      label: { en: "Steps", ar: "الخطوات" },
      admin: {
        initCollapsed: true,
        description: { en: "The tour's steps, shown in order.", ar: "خطوات الجولة، بالترتيب." },
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: { en: "Title", ar: "العنوان" },
          localized: true,
          required: true,
          admin: {
            description: { en: "A short heading for this step.", ar: "عنوان قصير لهذه الخطوة." },
            placeholder: { en: "e.g. Open the inbox", ar: "مثال: افتح صندوق الوارد" },
          },
        },
        {
          name: "body",
          type: "textarea",
          label: { en: "Body", ar: "النص" },
          localized: true,
          required: true,
          admin: {
            description: { en: "What to notice or do in this step.", ar: "ما يُلاحظ أو يُفعل في هذه الخطوة." },
            placeholder: {
              en: "e.g. New requests land here. Open one to read it.",
              ar: "مثال: تصل الطلبات الجديدة هنا. افتح أحدها لقراءته.",
            },
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "as",
              type: "text",
              label: { en: "Sign in as (user id)", ar: "تسجيل الدخول باسم (معرّف المستخدم)" },
              admin: {
                width: "33%",
                description: { en: "Switch to this user first.", ar: "التبديل إلى هذا المستخدم أولًا." },
                placeholder: { en: "e.g. karim.youssef", ar: "مثال: karim.youssef" },
              },
            },
            {
              name: "go",
              type: "text",
              label: { en: "Go to path", ar: "الانتقال إلى المسار" },
              admin: {
                width: "33%",
                description: { en: "Page to open for this step.", ar: "الصفحة التي تُفتح في هذه الخطوة." },
                placeholder: { en: "e.g. /inbox", ar: "مثال: /inbox" },
              },
            },
            {
              name: "open",
              type: "select",
              options: [
                { value: "aside", label: { en: "aside", ar: "اللوحة الجانبية" } },
                { value: "nav", label: { en: "nav", ar: "التنقل" } },
              ],
              label: { en: "Open column", ar: "فتح عمود" },
              admin: {
                width: "33%",
                description: { en: "Side column to open.", ar: "العمود الجانبي الذي يُفتح." },
                placeholder: words({ en: "Pick a column", ar: "اختر عمودًا" }),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "click",
              type: "text",
              // The button's words in the page's language (it's found by them).
              localized: true,
              label: { en: "Click the button with text", ar: "النقر على الزر الذي نصه" },
              admin: {
                width: "66%",
                description: { en: "Button label to press.", ar: "نص الزر المطلوب الضغط عليه." },
                placeholder: { en: "e.g. Send quotation", ar: "مثال: إرسال عرض السعر" },
              },
            },
            {
              name: "wait",
              type: "number",
              label: { en: "Wait (ms)", ar: "الانتظار (ملّي ثانية)" },
              admin: {
                width: "33%",
                description: { en: "Pause after the step, in milliseconds.", ar: "التوقف بعد الخطوة، بالملّي ثانية." },
                placeholder: { en: "e.g. 800", ar: "مثال: 800" },
              },
            },
          ],
        },
        {
          name: "target",
          type: "group",
          label: { en: "Spotlight", ar: "التسليط" },
          admin: {
            description: { en: "Which element to highlight in this step.", ar: "العنصر المطلوب إبرازه في هذه الخطوة." },
          },
          fields: [
            {
              name: "text",
              type: "text",
              // On-screen words in the page's language (the spotlight finds its element by them).
              localized: true,
              label: { en: "Element with text", ar: "عنصر بنص" },
              admin: {
                description: { en: "Text the highlighted element contains.", ar: "النص الذي يحتويه العنصر المُبرز." },
                placeholder: { en: "e.g. Open RFQs", ar: "مثال: طلبات العروض المفتوحة" },
              },
            },
            {
              name: "sel",
              type: "text",
              label: { en: "CSS selector (default: a card)", ar: "محدِّد CSS (الافتراضي: بطاقة)" },
              admin: {
                description: {
                  en: "A CSS selector, used when text is not enough.",
                  ar: "محدِّد CSS، يُستخدم عندما لا يكفي النص.",
                },
                placeholder: { en: "e.g. #quote-total", ar: "مثال: #quote-total" },
              },
            },
          ],
        },
      ],
    },
  ],
};
