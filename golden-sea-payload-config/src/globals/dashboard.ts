import type { CollectionConfig, GlobalConfig } from "payload";
import { ROLES, anyone, loggedIn, management } from "../collections/shared.ts";

/**
 * The dashboard's own content, as data people edit in the dashboard: the brand (read before
 * anyone signs in), the in-app helper, its platform guide, and the guided tours. Seeded from
 * src/cms/seed, so a new project changes records, not code.
 */

export const Branding: GlobalConfig = {
  slug: "branding",
  label: "Branding",
  admin: { group: "Configuration", description: "Name, icon and photos of the dashboard; shown before sign-in too." },
  access: { read: anyone, update: management },
  fields: [
    { name: "name", type: "text", required: true, defaultValue: "Dashboard" },
    {
      name: "description",
      type: "textarea",
      admin: { description: "One line about the business: the page description for search engines and link previews." },
    },
    {
      name: "icon",
      type: "text",
      defaultValue: "grid",
      admin: { description: "An icon name from the design system (anchor, grid, cube…)." },
    },
    { name: "loginIntro", type: "textarea", label: "Line on the login page" },
    { name: "poweredBy", type: "text", label: "Footer: powered by" },
    {
      name: "backgrounds",
      type: "array",
      label: "Background photos",
      admin: { description: "Paths below the site root without .jpg; each needs a -thumb.jpg next to it." },
      fields: [
        { name: "path", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    { name: "backgroundCredit", type: "text", label: "Photo credit" },
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
    { name: "name", type: "text", required: true, defaultValue: "Assistant" },
    {
      name: "business",
      type: "text",
      label: "What the business is",
      admin: { description: 'Read by the AI prompts: "a ship chandler in Egypt".' },
    },
    {
      name: "ask",
      type: "text",
      label: "Question endpoint",
      defaultValue: "/ask",
      admin: { description: "POST endpoint that answers business questions from the records." },
    },
    {
      name: "roleNotes",
      type: "array",
      label: "What each role does",
      fields: [
        { name: "role", type: "select", options: ROLES, required: true },
        { name: "note", type: "textarea", required: true },
        {
          name: "suggestions",
          type: "text",
          hasMany: true,
          label: "Starter questions",
          admin: { description: "Offered when someone in this role opens the helper." },
        },
      ],
    },
    {
      name: "suggestions",
      type: "text",
      hasMany: true,
      label: "Starter questions (other roles)",
      admin: { description: "Offered to roles without starter questions of their own." },
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
          admin: { description: '"Status of …" looks records up here first (a collection slug: "cases").' },
        },
        {
          name: "recordPattern",
          type: "text",
          label: "Record number pattern",
          admin: { description: 'What record numbers look like, as a regular expression ("GS-[A-Z]+-\\d+").' },
        },
        {
          name: "businessKeywords",
          type: "text",
          hasMany: true,
          label: "Business words",
          admin: {
            description: 'Words (or their starts: "approv") that make a message a question for the records.',
          },
        },
        {
          name: "examples",
          type: "array",
          label: "Example requests",
          admin: { description: "One or two per kind: the on-device model follows examples better than rules." },
          fields: [
            {
              type: "row",
              fields: [
                { name: "question", type: "text", required: true, admin: { width: "50%" } },
                {
                  name: "kind",
                  type: "select",
                  required: true,
                  admin: { width: "25%" },
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
                { name: "argument", type: "text", label: "What the tool gets", admin: { width: "25%" } },
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
    { name: "topic", type: "text", required: true },
    { name: "keywords", type: "text", admin: { description: "Words people use when they ask about it." } },
    { name: "text", type: "textarea", required: true, admin: { rows: 6 } },
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
    { name: "title", type: "text", required: true },
    { name: "summary", type: "text", required: true },
    {
      name: "steps",
      type: "array",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        {
          type: "row",
          fields: [
            { name: "as", type: "text", label: "Sign in as (user id)", admin: { width: "33%" } },
            { name: "go", type: "text", label: "Go to path", admin: { width: "33%" } },
            { name: "open", type: "select", options: ["aside", "nav"], label: "Open column", admin: { width: "33%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "click", type: "text", label: "Click the button with text", admin: { width: "66%" } },
            { name: "wait", type: "number", label: "Wait (ms)", admin: { width: "33%" } },
          ],
        },
        {
          name: "target",
          type: "group",
          label: "Spotlight",
          fields: [
            { name: "text", type: "text", label: "Element with text" },
            { name: "sel", type: "text", label: "CSS selector (default: a card)" },
          ],
        },
      ],
    },
  ],
};
