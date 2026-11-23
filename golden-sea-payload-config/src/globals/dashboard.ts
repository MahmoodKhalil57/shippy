import type { CollectionConfig, GlobalConfig } from "payload";
import { ROLES, anyone, loggedIn, management } from "../collections/shared.ts";

/**
 * The dashboard's own content, as data people edit in the dashboard: the brand (read before
 * anyone signs in), the in-app helper, its platform guide, and the guided tours. Seeded from
 * src/seed, so a new project changes records, not code.
 */

export const Branding: GlobalConfig = {
  slug: "branding",
  label: "Branding",
  admin: { group: "Configuration", description: "Name, icon and photos of the dashboard; shown before sign-in too." },
  access: { read: anyone, update: management },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      defaultValue: "Dashboard",
      admin: {
        description: "Shown in the browser tab, the sidebar and the login page.",
        placeholder: "e.g. Golden Sea",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "One line about the business, used for search results and link previews.",
        placeholder: "e.g. Ship chandler supplying vessels in Egyptian ports.",
      },
    },
    {
      name: "icon",
      type: "text",
      defaultValue: "grid",
      admin: {
        description: "An icon name from the design system, such as anchor, grid or cube.",
        placeholder: "e.g. anchor",
      },
    },
    {
      name: "loginIntro",
      type: "textarea",
      label: "Line on the login page",
      admin: {
        description: "A welcome line shown above the sign-in form.",
        placeholder: "e.g. Sign in to manage RFQs, quotes and deliveries.",
      },
    },
    {
      name: "poweredBy",
      type: "text",
      label: "Footer: powered by",
      admin: { description: "Credit line in the footer of the login page.", placeholder: "e.g. Powered by SaaSTEMLY" },
    },
    {
      name: "backgrounds",
      type: "array",
      label: "Background photos",
      admin: { description: "Login page photos, one row each." },
      custom: { about: "Paths are below the site root without .jpg. Each photo needs a -thumb.jpg next to it." },
      fields: [
        {
          name: "path",
          type: "text",
          required: true,
          admin: { description: "Where the photo lives, without .jpg.", placeholder: "e.g. backgrounds/port-said" },
        },
        {
          name: "label",
          type: "text",
          required: true,
          admin: { description: "Caption naming what the photo shows.", placeholder: "e.g. Port Said at dawn" },
        },
      ],
    },
    {
      name: "backgroundCredit",
      type: "text",
      label: "Photo credit",
      admin: { description: "Who took the background photos.", placeholder: "e.g. Photos by Unsplash contributors" },
    },
  ],
};

export const Assistant: GlobalConfig = {
  slug: "assistant",
  label: "Assistant",
  admin: {
    group: "Configuration",
    description: "The in-app helper: its name, what the business is, and who it talks to.",
  },
  access: { read: loggedIn, update: management },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      defaultValue: "Assistant",
      admin: { description: "What the helper calls itself in the chat panel.", placeholder: "e.g. Captain" },
    },
    {
      name: "business",
      type: "text",
      label: "What the business is",
      admin: {
        description: "One phrase the AI prompts use to describe the business.",
        placeholder: "e.g. a ship chandler in Egypt",
      },
    },
    {
      name: "ask",
      type: "text",
      label: "Question endpoint",
      defaultValue: "/ask",
      admin: { description: "POST endpoint that answers business questions from records.", placeholder: "e.g. /ask" },
    },
    {
      name: "roleNotes",
      type: "array",
      label: "What each role does",
      admin: { description: "A short job description per role, so answers fit who is asking." },
      fields: [
        {
          name: "role",
          type: "select",
          options: ROLES,
          required: true,
          admin: { description: "The role this note describes.", placeholder: "Pick a role" },
        },
        {
          name: "note",
          type: "textarea",
          required: true,
          admin: {
            description: "What this role does day to day.",
            placeholder: "e.g. Sales prices quotes and follows up with captains.",
          },
        },
        {
          name: "suggestions",
          type: "text",
          hasMany: true,
          label: "Starter questions",
          admin: {
            description: "Offered when someone in this role opens the helper.",
            placeholder: "e.g. Which quotes expire this week?",
          },
        },
      ],
    },
    {
      name: "suggestions",
      type: "text",
      hasMany: true,
      label: "Starter questions (other roles)",
      admin: {
        description: "Offered to roles without starter questions of their own.",
        placeholder: "e.g. What needs my attention today?",
      },
    },
    {
      type: "collapsible",
      label: "How the helper reads requests",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "mainRecord",
          type: "text",
          label: "Main record collection",
          admin: {
            description: "Where status questions look records up first, as a collection slug.",
            placeholder: "e.g. cases",
          },
        },
        {
          name: "recordPattern",
          type: "text",
          label: "Record number pattern",
          admin: {
            description: "What record numbers look like, as a regular expression.",
            placeholder: "e.g. GS-[A-Z]+-\\d+",
          },
        },
        {
          name: "businessKeywords",
          type: "text",
          hasMany: true,
          label: "Business words",
          admin: {
            description: "Words or word starts that make a message a question for the records.",
            placeholder: "e.g. approv",
          },
        },
        {
          name: "examples",
          type: "array",
          label: "Example requests",
          admin: { description: "One or two requests per kind of question." },
          custom: { about: "The on-device model follows examples better than rules, so show it real requests." },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "question",
                  type: "text",
                  required: true,
                  admin: {
                    width: "50%",
                    description: "What someone might type.",
                    placeholder: "e.g. Status of GS-RFQ-1042",
                  },
                },
                {
                  name: "kind",
                  type: "select",
                  required: true,
                  admin: { width: "25%", description: "Which tool answers it.", placeholder: "Pick a kind" },
                  options: [
                    { label: "Open a page", value: "open_page" },
                    { label: "What's on screen", value: "what_is_on_screen" },
                    { label: "My day", value: "my_day" },
                    { label: "Record status", value: "record_status" },
                    { label: "Find", value: "find" },
                    { label: "Ask the records", value: "ask_records" },
                    { label: "Platform guide", value: "platform_guide" },
                  ],
                },
                {
                  name: "argument",
                  type: "text",
                  label: "What the tool gets",
                  admin: {
                    width: "25%",
                    description: "The value passed to the tool.",
                    placeholder: "e.g. GS-RFQ-1042",
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
  labels: { singular: "Guide topic", plural: "Guide topics" },
  admin: {
    useAsTitle: "topic",
    defaultColumns: ["topic", "keywords"],
    group: "Configuration",
    description: "How the platform works, in short sections the helper looks up and quotes.",
  },
  access: { read: loggedIn, create: management, update: management, delete: management },
  fields: [
    {
      name: "topic",
      type: "text",
      required: true,
      admin: { description: "The section title the helper quotes.", placeholder: "e.g. How approvals work" },
    },
    {
      name: "keywords",
      type: "text",
      admin: {
        description: "Words people use when they ask about it.",
        placeholder: "e.g. approve, sign off, discount",
      },
    },
    {
      name: "text",
      type: "textarea",
      required: true,
      admin: {
        rows: 6,
        description: "The explanation, in short plain sentences.",
        placeholder: "e.g. Quotes over 50,000 EGP need a manager's approval before sending.",
      },
    },
  ],
};

export const Tours: CollectionConfig = {
  slug: "tours",
  labels: { singular: "Tour", plural: "Tours" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "summary"],
    group: "Configuration",
    description:
      "Guided tours, started from the side panel. A step can sign in as another user, open a page and click.",
  },
  access: { read: loggedIn, create: management, update: management, delete: management },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "The tour's name in the side panel.", placeholder: "e.g. From RFQ to quote" },
    },
    {
      name: "summary",
      type: "text",
      required: true,
      admin: {
        description: "One line saying what the tour teaches.",
        placeholder: "e.g. Follow a request from the inbox to a sent quotation.",
      },
    },
    {
      name: "steps",
      type: "array",
      admin: { initCollapsed: true, description: "The tour's steps, shown in order." },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          admin: { description: "A short heading for this step.", placeholder: "e.g. Open the inbox" },
        },
        {
          name: "body",
          type: "textarea",
          required: true,
          admin: {
            description: "What to notice or do in this step.",
            placeholder: "e.g. New requests land here. Open one to read it.",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "as",
              type: "text",
              label: "Sign in as (user id)",
              admin: { width: "33%", description: "Switch to this user first.", placeholder: "e.g. karim.youssef" },
            },
            {
              name: "go",
              type: "text",
              label: "Go to path",
              admin: { width: "33%", description: "Page to open for this step.", placeholder: "e.g. /inbox" },
            },
            {
              name: "open",
              type: "select",
              options: ["aside", "nav"],
              label: "Open column",
              admin: { width: "33%", description: "Side column to open.", placeholder: "Pick a column" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "click",
              type: "text",
              label: "Click the button with text",
              admin: { width: "66%", description: "Button label to press.", placeholder: "e.g. Send quotation" },
            },
            {
              name: "wait",
              type: "number",
              label: "Wait (ms)",
              admin: { width: "33%", description: "Pause after the step, in milliseconds.", placeholder: "e.g. 800" },
            },
          ],
        },
        {
          name: "target",
          type: "group",
          label: "Spotlight",
          admin: { description: "Which element to highlight in this step." },
          fields: [
            {
              name: "text",
              type: "text",
              label: "Element with text",
              admin: { description: "Text the highlighted element contains.", placeholder: "e.g. Open RFQs" },
            },
            {
              name: "sel",
              type: "text",
              label: "CSS selector (default: a card)",
              admin: { description: "A CSS selector, used when text is not enough.", placeholder: "e.g. #quote-total" },
            },
          ],
        },
      ],
    },
  ],
};
