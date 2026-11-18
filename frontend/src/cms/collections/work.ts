import type { CollectionConfig } from "payload";
import { deskAccess, idOf, loggedIn, management, ruleError } from "./shared.ts";

/** Case timeline + audit log: every automatic step and human decision. Append-only. */
export const Activities: CollectionConfig = {
  slug: "activities",
  labels: { singular: "Activity", plural: "Activity log" },
  admin: { useAsTitle: "text", defaultColumns: ["at", "case", "kind", "text", "actor"], group: "Work" },
  defaultSort: "-at",
  access: { read: loggedIn, create: loggedIn, update: () => false, delete: management },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "at",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: "dayAndTime" } },
        },
        { name: "case", type: "relationship", relationTo: "cases", index: true },
        {
          name: "kind",
          type: "select",
          options: [
            { label: "Automatic", value: "auto" },
            { label: "Human", value: "human" },
            { label: "Alert", value: "alert" },
          ],
          defaultValue: "auto",
        },
      ],
    },
    { name: "text", type: "textarea", required: true },
    {
      type: "row",
      fields: [
        { name: "actor", type: "relationship", relationTo: "users" },
        { name: "entity", type: "text", admin: { description: "collection/id of the record changed" } },
        {
          name: "rule",
          type: "text",
          label: "Automation rule",
          admin: { description: "Set when an automation did it." },
        },
      ],
    },
    { name: "undoOf", type: "relationship", relationTo: "activities", label: "Undoes" },
  ],
};

/**
 * Everything someone has to do by a time: supplier reminders, customer follow-ups (respecting the
 * account's contact rule), sales next steps, collections, delivery tasks.
 */
export const Tasks: CollectionConfig = {
  slug: "tasks",
  admin: { useAsTitle: "title", defaultColumns: ["title", "type", "channel", "due", "owner", "status"], group: "Work" },
  defaultSort: "due",
  access: deskAccess,
  hooks: {
    beforeChange: [
      // Customer-facing follow-ups are refused for "do not chase" accounts (internal reminders only).
      async ({ data, req }) => {
        if (data.type !== "Customer follow-up" || !data.customer || data.internalOnly) return data;
        const c = (await req.payload
          .findByID({ collection: "customers", id: String(idOf(data.customer)), depth: 0 })
          .catch(() => null)) as { contactRule?: string } | null;
        if (c?.contactRule === "do-not-chase")
          throw ruleError("This customer must not be chased — create an internal reminder instead.");
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            "Supplier reminder",
            "Customer follow-up",
            "Internal reminder",
            "Sales next step",
            "Collection",
            "Delivery task",
            "Clarification",
          ],
        },
        {
          name: "channel",
          type: "select",
          options: ["Email", "Call", "WhatsApp", "Site visit", "Meeting", "Internal"],
        },
        { name: "due", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "case", type: "relationship", relationTo: "cases" },
        { name: "customer", type: "relationship", relationTo: "customers" },
        { name: "supplier", type: "relationship", relationTo: "suppliers" },
        { name: "opportunity", type: "relationship", relationTo: "opportunities" },
      ],
    },
    { name: "who", type: "text", label: "Who (person / role)" },
    { name: "goal", type: "text" },
    { name: "script", type: "textarea", label: "What to say / draft" },
    { name: "internalOnly", type: "checkbox", label: "Internal only (no customer contact)", defaultValue: false },
    {
      name: "outcome",
      type: "group",
      admin: { condition: (data) => data?.status === "Done" || data?.status === "Skipped" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "result",
              type: "select",
              options: ["Reached — positive", "Reached — call back", "No answer", "Not interested", "Sent"],
            },
            { name: "nextDate", type: "date" },
          ],
        },
        { name: "note", type: "textarea" },
      ],
    },
    { name: "owner", type: "relationship", relationTo: "users", required: true, admin: { position: "sidebar" } },
    {
      name: "status",
      type: "select",
      defaultValue: "Open",
      options: ["Open", "Done", "Skipped", "Cancelled"],
      admin: { position: "sidebar" },
    },
    { name: "createdByRule", type: "text", admin: { position: "sidebar", readOnly: true } },
    {
      name: "stopCondition",
      type: "text",
      admin: { position: "sidebar", description: "e.g. reply received, case closed" },
    },
  ],
};

/** Failed integrations and uncertain automation results — nothing fails silently; retries are idempotent. */
export const IntegrationExceptions: CollectionConfig = {
  slug: "integration-exceptions",
  labels: { singular: "Exception", plural: "Exception queue" },
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["occurredAt", "source", "summary", "status", "retries"],
    group: "Work",
  },
  defaultSort: "-occurredAt",
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: management },
  fields: [
    {
      type: "row",
      fields: [
        { name: "occurredAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
        {
          name: "source",
          type: "select",
          required: true,
          options: ["Outlook", "Gmail", "Website form", "AI extraction", "E-invoicing", "Automation rule", "Import"],
        },
      ],
    },
    { name: "summary", type: "text", required: true },
    { name: "impact", type: "text" },
    {
      name: "idempotencyKey",
      type: "text",
      admin: { description: "Message-id / document id: a retry checks it first so nothing is created or sent twice." },
    },
    { name: "payload", type: "json", admin: { description: "Technical detail for the retry." } },
    {
      type: "row",
      fields: [
        { name: "retries", type: "number", min: 0, defaultValue: 0 },
        { name: "lastRetryAt", type: "date" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Open",
      options: ["Open", "Waiting for review", "Resolved", "Auto-resolved", "Ignored"],
      admin: { position: "sidebar" },
    },
    { name: "resolvedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  ],
};
