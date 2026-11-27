import { describe, expect, it } from "vite-plus/test";
import { z } from "zod";
import {
  fieldError,
  fieldProblems,
  inputOf,
  MAX_HINT,
  zodOf,
  zodOfFields,
  type FieldInput,
  type FieldLike,
} from "./index.ts";

const field = (f: Partial<FieldLike> & { type: string }) => f as FieldLike;
const ok = (schema: z.ZodType, value: unknown) => schema.safeParse(value).success;
const options = (n: number, label = (i: number) => `Option ${i}`) =>
  Array.from({ length: n }, (_, i) => ({ label: label(i), value: `o${i}` }));

describe("inputOf", () => {
  it("uses the input a field asks for", () => {
    const every: FieldInput[] = [
      "text",
      "email",
      "textarea",
      "code",
      "json",
      "number",
      "stepper",
      "slider",
      "rating",
      "scale",
      "money",
      "percent",
      "segmented",
      "chips",
      "select",
      "radio",
      "switch",
      "checkbox",
      "date",
      "tags",
      "relationship",
      "upload",
      "point",
    ];
    for (const input of every) expect(inputOf(field({ type: "text", custom: { input } }))).toBe(input);
  });

  it("picks the input of every plain field type", () => {
    const plain: [string, FieldInput][] = [
      ["checkbox", "switch"],
      ["text", "text"],
      ["email", "email"],
      ["textarea", "textarea"],
      ["richText", "textarea"],
      ["code", "code"],
      ["json", "json"],
      ["date", "date"],
      ["relationship", "relationship"],
      ["upload", "upload"],
      ["point", "point"],
      ["number", "number"],
      ["group", "text"],
      ["blocks", "text"],
    ];
    for (const [type, input] of plain) expect(inputOf(field({ type }))).toBe(input);
  });

  it("uses tags for text and numbers with many values", () => {
    expect(inputOf(field({ type: "text", hasMany: true }))).toBe("tags");
    expect(inputOf(field({ type: "number", hasMany: true }))).toBe("tags");
  });

  it("uses chips for up to eight options with many values, and a select above that", () => {
    for (const type of ["select", "radio"]) {
      expect(inputOf(field({ type, hasMany: true, options: options(8) }))).toBe("chips");
      expect(inputOf(field({ type, hasMany: true, options: options(9) }))).toBe("select");
      expect(inputOf(field({ type, hasMany: true }))).toBe("chips");
    }
  });

  it("uses a segmented control for two to four short options, and a select otherwise", () => {
    for (const type of ["select", "radio"]) {
      expect(inputOf(field({ type, options: options(1) }))).toBe("select");
      expect(inputOf(field({ type, options: options(2) }))).toBe("segmented");
      expect(inputOf(field({ type, options: options(4) }))).toBe("segmented");
      expect(inputOf(field({ type, options: options(5) }))).toBe("select");
      expect(inputOf(field({ type, options: ["open", "won", "lost"] }))).toBe("segmented");
      expect(inputOf(field({ type, options: options(2, () => "x".repeat(16)) }))).toBe("segmented");
      expect(inputOf(field({ type, options: options(2, () => "x".repeat(17)) }))).toBe("select");
      expect(
        inputOf(field({ type, options: [{ label: { en: "Open" }, value: "an-option-value-too-long" }, "won"] })),
      ).toBe("select");
      expect(inputOf(field({ type, options: [{ label: { en: "A long label" }, value: "open" }, "won"] }))).toBe(
        "segmented",
      );
      expect(inputOf(field({ type }))).toBe("select");
    }
  });

  it("picks a number input from its unit and range", () => {
    const number = (f: Partial<FieldLike>) => inputOf(field({ type: "number", ...f }));
    expect(number({ custom: { number: { unit: "money", currency: "AED" } } })).toBe("money");
    expect(number({ custom: { number: { unit: "pct" } }, min: 0, max: 100 })).toBe("slider");
    expect(number({ custom: { number: { unit: "pct" } }, min: 0 })).toBe("percent");
    expect(number({ custom: { number: { unit: "pct" } }, max: 100 })).toBe("percent");
    expect(number({ custom: { number: { unit: "days" } } })).toBe("stepper");
    expect(number({ min: 0, max: 1 })).toBe("slider");
    expect(number({ name: "rating", min: 1, max: 5 })).toBe("rating");
    expect(number({ name: "fitScore", min: 0, max: 10 })).toBe("rating");
    expect(number({ name: "Stars", min: 1, max: 3 })).toBe("rating");
    expect(number({ name: "priority", min: 1, max: 5 })).toBe("scale");
    expect(number({ min: 1, max: 5, admin: { step: 1 } })).toBe("scale");
    expect(number({ min: 1, max: 5, admin: { step: 2 } })).toBe("number");
    expect(number({ min: 1, max: 2 })).toBe("number");
    expect(number({ min: 0, max: 11 })).toBe("number");
    expect(number({ min: 1 })).toBe("number");
    expect(number({ max: 5 })).toBe("number");
    expect(number({ custom: { number: { unit: "count" } } })).toBe("number");
  });
});

describe("zodOf", () => {
  it("checks text length", () => {
    const name = field({ type: "text", minLength: 2, maxLength: 4 });
    expect(fieldError(name, "a")).toBe("At least 2 characters.");
    expect(fieldError(name, "abcde")).toBe("At most 4 characters.");
    expect(fieldError(field({ type: "textarea", minLength: 1 }), 5)).toBe("Text only.");
    expect(fieldError(field({ type: "code", maxLength: 1 }), "ab")).toBe("At most 1 character.");
    expect(fieldError(field({ type: "richText" }), "anything")).toBeUndefined();
    expect(fieldError(name, "abc")).toBeUndefined();
  });

  it("checks email addresses", () => {
    expect(fieldError(field({ type: "email" }), "ana@")).toBe("An email address, like name@company.com.");
    expect(fieldError(field({ type: "email" }), "ana@example.com")).toBeUndefined();
  });

  it("checks numbers and their range", () => {
    const qty = field({ type: "number", min: 1, max: 10 });
    expect(fieldError(qty, "3")).toBe("A number.");
    expect(fieldError(qty, Infinity)).toBe("A number.");
    expect(fieldError(qty, -Infinity)).toBe("A number.");
    expect(fieldError(qty, NaN)).toBe("A number.");
    expect(fieldError(qty, 0)).toBe("1 or more.");
    expect(fieldError(qty, 11)).toBe("10 or less.");
    expect(fieldError(qty, 10)).toBeUndefined();
    expect(fieldError(field({ type: "number" }), -5)).toBeUndefined();
  });

  it("checks checkboxes, dates, points and json", () => {
    expect(ok(zodOf(field({ type: "checkbox" })), true)).toBe(true);
    expect(ok(zodOf(field({ type: "checkbox" })), "yes")).toBe(false);
    expect(fieldError(field({ type: "date" }), "not a date")).toBe("Pick a date.");
    expect(fieldError(field({ type: "date" }), "2026-03-14")).toBeUndefined();
    expect(fieldError(field({ type: "date" }), new Date(0))).toBeUndefined();
    expect(ok(zodOf(field({ type: "point" })), [55.27, 25.2])).toBe(true);
    expect(ok(zodOf(field({ type: "point" })), [55.27])).toBe(false);
    expect(ok(zodOf(field({ type: "json" })), { any: ["thing"] })).toBe(true);
  });

  it("checks options", () => {
    const stage = field({ type: "select", options: ["open", { label: "Won", value: "won" }] });
    expect(fieldError(stage, "lost")).toBe("Pick one of the options.");
    expect(fieldError(stage, "won")).toBeUndefined();
    expect(fieldError(field({ type: "radio", options: ["a"] }), "b")).toBe("Pick one of the options.");
    expect(fieldError(field({ type: "select" }), "free text")).toBeUndefined();
  });

  it("accepts every shape of a relation", () => {
    for (const type of ["relationship", "upload"]) {
      const s = zodOf(field({ type }));
      expect(ok(s, "cus-1")).toBe(true);
      expect(ok(s, 7)).toBe(true);
      expect(ok(s, { id: "cus-1", name: "Atlas" })).toBe(true);
      expect(ok(s, { id: 7 })).toBe(true);
      expect(ok(s, { relationTo: "customers", value: "cus-1" })).toBe(true);
      expect(ok(s, "")).toBe(false);
      expect(ok(s, { name: "Atlas" })).toBe(false);
    }
  });

  it("checks groups, arrays and blocks with their own fields", () => {
    const address = field({ type: "group", fields: [{ name: "city", type: "text", required: true }] });
    expect(ok(zodOf(address), { city: "Dubai" })).toBe(true);
    expect(ok(zodOf(address), { city: "  " })).toBe(false);
    expect(ok(zodOf(address), null)).toBe(true);
    expect(ok(zodOf(field({ type: "group" })), { anything: 1 })).toBe(true);

    const lines = field({ type: "array", minRows: 1, maxRows: 2, fields: [{ name: "qty", type: "number" }] });
    expect(fieldError(lines, [{ qty: 1 }])).toBeUndefined();
    expect(fieldError(lines, [{ qty: 1 }, { qty: 2 }, { qty: 3 }])).toBe("At most 2 rows.");
    expect(fieldError(field({ type: "array", minRows: 2 }), [{}])).toBe("At least 2 rows.");
    expect(fieldError(lines, [{ qty: "one" }])).toBe("A number.");

    expect(ok(zodOf(field({ type: "blocks" })), [{ blockType: "anything" }])).toBe(true);
    const one = field({ type: "blocks", blocks: [{ slug: "hero", fields: [{ name: "heading", type: "text" }] }] });
    expect(ok(zodOf(one), [{ blockType: "hero", heading: "Hi" }])).toBe(true);
    expect(ok(zodOf(one), [{ blockType: "quote" }])).toBe(false);
    const two = field({
      type: "blocks",
      blocks: [
        { slug: "hero", fields: [{ name: "heading", type: "text" }] },
        { slug: "quote", fields: [{ name: "by", type: "text" }] },
      ],
    });
    expect(ok(zodOf(two), [{ blockType: "hero" }, { blockType: "quote", by: "Ana" }])).toBe(true);
    expect(ok(zodOf(two), [{ blockType: "quote", by: 3 }])).toBe(false);
  });

  it("accepts anything for a type it does not know", () => {
    expect(ok(zodOf(field({ type: "ui" })), Symbol("x"))).toBe(true);
  });

  it("takes many values, at least one when required", () => {
    const tags = field({ type: "text", hasMany: true });
    expect(ok(zodOf(tags), ["vip", "export"])).toBe(true);
    expect(ok(zodOf(tags), [])).toBe(true);
    expect(ok(zodOf(tags), "vip")).toBe(false);
    expect(zodOf(field({ type: "text", hasMany: true, required: true })).safeParse([]).error?.issues[0]?.message).toBe(
      "Add at least one.",
    );
    expect(ok(zodOf(field({ type: "array", hasMany: true })), [{}])).toBe(true);
    expect(ok(zodOf(field({ type: "blocks", hasMany: true })), [{ blockType: "x" }])).toBe(true);
  });

  it("allows an empty value unless the field is required", () => {
    expect(ok(zodOf(field({ type: "number" })), null)).toBe(true);
    expect(ok(zodOf(field({ type: "number" })), undefined)).toBe(true);
    expect(ok(zodOf(field({ type: "number", required: true })), null)).toBe(false);
    for (const type of ["array", "blocks", "group", "checkbox"])
      expect(ok(zodOf(field({ type, required: true })), null)).toBe(true);
  });

  it("refuses blank text in a required text field", () => {
    for (const type of ["text", "textarea", "email", "code"]) {
      const s = zodOf(field({ type, required: true }));
      expect(s.safeParse("   ").error?.issues.map((i) => i.message)).toContain("Fill this in to save.");
    }
    expect(ok(zodOf(field({ type: "text", required: true })), "Ana")).toBe(true);
    expect(ok(zodOf(field({ type: "text", required: true, hasMany: true })), ["Ana"])).toBe(true);
  });

  it("lets a field change its own schema", () => {
    const code = field({ type: "text", custom: { zod: (base) => base.refine((v) => v === "OK", "Must be OK") } });
    expect(fieldError(code, "NO")).toBe("Must be OK");
    expect(fieldError(code, "OK")).toBeUndefined();
    const ignored = field({ type: "text", custom: { zod: "not a function" as never } });
    expect(fieldError(ignored, "anything")).toBeUndefined();
  });

  it("takes one value or one value per language for a localized field", () => {
    const title = field({ type: "text", localized: true });
    expect(ok(zodOf(title), "Lease")).toBe(true);
    expect(ok(zodOf(title), { en: "Lease", ar: "إيجار", "en-GB": "Lease" })).toBe(true);
    expect(ok(zodOf(title), { english: "Lease" })).toBe(false);
    expect(ok(zodOf(title), { en: 5 })).toBe(false);
  });
});

describe("zodOfFields", () => {
  const schema = zodOfFields([
    { name: "title", type: "text", required: true },
    { type: "row", fields: [{ name: "amount", type: "number", min: 0 }] },
    { type: "collapsible", fields: [{ name: "won", type: "checkbox" }] },
    { type: "row" },
    {
      type: "tabs",
      tabs: [
        { name: "billing", fields: [{ name: "iban", type: "text", minLength: 4 }] },
        { fields: [{ name: "stage", type: "select", options: ["open", "won"] }] },
      ],
    },
    { type: "tabs" },
    { name: "divider", type: "ui" },
    { name: "invoices", type: "join" },
    { name: "total", type: "number", virtual: true },
    { type: "text" },
  ]);

  it("checks the fields inside rows, collapsibles and unnamed tabs at the top level", () => {
    expect(ok(schema, { title: "Lease", amount: 5, won: true, stage: "won" })).toBe(true);
    expect(ok(schema, { title: "Lease", amount: -1 })).toBe(false);
    expect(ok(schema, { title: "Lease", won: "yes" })).toBe(false);
    expect(ok(schema, { title: "Lease", stage: "lost" })).toBe(false);
    expect(ok(schema, { amount: 5 })).toBe(false);
  });

  it("checks a named tab as its own object, which may be empty", () => {
    expect(ok(schema, { title: "Lease", billing: { iban: "AE07" } })).toBe(true);
    expect(ok(schema, { title: "Lease", billing: { iban: "AE" } })).toBe(false);
    expect(ok(schema, { title: "Lease", billing: null })).toBe(true);
  });

  it("ignores layout, join, virtual and unnamed fields and keeps unknown keys", () => {
    expect(ok(schema, { title: "Lease", divider: 1, invoices: "x", total: "x", extra: true })).toBe(true);
    expect(schema.parse({ title: "Lease", extra: true })).toEqual({ title: "Lease", extra: true });
  });
});

describe("fieldError", () => {
  it("asks for a required value that is empty", () => {
    const f = field({ type: "text", required: true });
    for (const empty of [null, undefined, "", []]) expect(fieldError(f, empty)).toBe("Fill this in to save.");
  });

  it("accepts an empty optional value without checking it", () => {
    const f = field({ type: "number", min: 5 });
    expect(fieldError(f, null)).toBeUndefined();
    expect(fieldError(f, undefined)).toBeUndefined();
    expect(fieldError(f, "")).toBeUndefined();
  });

  it("falls back to a general message when a schema fails without an issue", () => {
    const silent = { safeParse: () => ({ success: false, error: { issues: [] } }) } as unknown as z.ZodType;
    expect(fieldError(field({ type: "text", custom: { zod: () => silent } }), "x")).toBe("Check this value.");
  });
});

describe("fieldProblems", () => {
  it("finds nothing in an empty config", () => {
    expect(fieldProblems({})).toEqual([]);
  });

  it("asks every input for a short hint and every typed input for a placeholder", () => {
    const long = "x".repeat(MAX_HINT + 1);
    expect(
      fieldProblems({
        collections: [
          {
            slug: "deals",
            fields: [
              {
                name: "title",
                type: "text",
                admin: { description: "The deal's name", placeholder: "Warehouse lease" },
              },
              { name: "amount", type: "number" },
              { name: "stage", type: "select", admin: { description: long, readOnly: true } },
              { name: "fit", type: "number", admin: { description: "x".repeat(MAX_HINT), placeholder: "3" } },
              { name: "won", type: "checkbox", admin: { description: "Whether we won it" } },
              { name: "secret", type: "text", hidden: true },
              { name: "internal", type: "text", admin: { hidden: true } },
              { name: "divider", type: "ui" },
              { type: "text" },
              { name: "score", type: "number", virtual: true, admin: { description: "Worked out from the stage" } },
              { name: "email", type: "email", admin: { description: " ", placeholder: "ana@example.com" } },
              {
                type: "row",
                fields: [{ name: "city", type: "text", admin: { description: "City", placeholder: "Dubai" } }],
              },
              { type: "collapsible" },
              {
                type: "tabs",
                tabs: [
                  { name: "extra", fields: [{ name: "memo", type: "textarea", admin: { description: "Memo" } }] },
                  {
                    fields: [{ name: "phone", type: "text", admin: { description: "Phone", placeholder: " " } }],
                  },
                ],
              },
              { type: "tabs" },
              {
                name: "lines",
                type: "array",
                admin: { description: "What the deal sells" },
                fields: [{ name: "qty", type: "number", admin: { description: "How many" } }],
              },
              { name: "address", type: "group", admin: { description: "Where" } },
              { name: "rows", type: "array", admin: { description: "Rows" } },
              {
                name: "layout",
                type: "blocks",
                admin: { description: "Page layout" },
                blocks: [
                  { slug: "hero", fields: [{ name: "heading", type: "text", admin: { description: "Heading" } }] },
                ],
              },
              { name: "blank", type: "blocks", admin: { description: "No blocks" } },
            ],
          },
        ],
        globals: [{ slug: "branding", fields: [{ name: "name", type: "text" }] }],
      }),
    ).toEqual([
      { at: "deals › amount", problem: "needs a hint (admin.description)" },
      { at: "deals › amount", problem: "needs a placeholder (admin.placeholder)" },
      {
        at: "deals › stage",
        problem: `hint is ${MAX_HINT + 1} characters; keep ${MAX_HINT}, move the rest to custom.about`,
      },
      { at: "deals › email", problem: "needs a hint (admin.description)" },
      { at: "deals › extra › memo", problem: "needs a placeholder (admin.placeholder)" },
      { at: "deals › phone", problem: "needs a placeholder (admin.placeholder)" },
      { at: "deals › lines › qty", problem: "needs a placeholder (admin.placeholder)" },
      { at: "deals › layout › hero › heading", problem: "needs a placeholder (admin.placeholder)" },
      { at: "branding › name", problem: "needs a hint (admin.description)" },
      { at: "branding › name", problem: "needs a placeholder (admin.placeholder)" },
    ]);
  });

  it("asks a localized project for every text in every language", () => {
    const both = (en: string, ar: string) => ({ en, ar });
    expect(
      fieldProblems({
        localization: { locales: ["en", { code: "ar" }] },
        collections: [
          {
            slug: "deals",
            labels: { singular: both("Deal", "صفقة"), plural: both("Deals", "صفقات") },
            fields: [
              {
                name: "title",
                type: "text",
                label: both("Title", "العنوان"),
                admin: { description: both("Name", "الاسم"), placeholder: both("Lease", "إيجار") },
                custom: { about: both("More", "المزيد") as unknown as string },
              },
              {
                name: "stage",
                type: "select",
                label: "Stage",
                admin: { description: "Where it is", placeholder: { en: "Pick" } },
                custom: { about: "Stages" },
                options: ["open", { label: both("Won", "فازت"), value: "won" }, { label: "Lost", value: "lost" }],
              },
              {
                name: "memo",
                type: "textarea",
                label: false,
                admin: {
                  description: { en: "x".repeat(MAX_HINT + 9), ar: "ملاحظة" },
                  placeholder: both("Memo", "ملاحظة"),
                },
              },
              {
                name: "notes",
                type: "checkbox",
                label: both("Notes", " "),
                admin: { description: both("Notes", "ملاحظات") },
              },
              {
                name: "owner",
                type: "relationship",
                label: null,
                admin: { description: null, placeholder: both("Ana", "آنا") },
              },
            ],
          },
          { slug: "tasks", labels: { singular: both("Task", "مهمة") }, fields: [] },
          { slug: "notes", fields: [] },
        ],
        globals: [
          { slug: "branding", label: both("Branding", "الهوية"), fields: [] },
          { slug: "assistant", label: "Assistant", fields: [] },
        ],
      }),
    ).toEqual([
      { at: "deals › stage", problem: "needs a hint (admin.description) in en and ar" },
      { at: "deals › stage", problem: "needs a placeholder (admin.placeholder) in en and ar" },
      { at: "deals › stage", problem: "label needs en and ar" },
      { at: "deals › stage", problem: "custom.about needs en and ar" },
      { at: "deals › stage", problem: "option lost's label needs en and ar" },
      {
        at: "deals › memo",
        problem: `hint (en) is ${MAX_HINT + 9} characters; keep ${MAX_HINT}, move the rest to custom.about`,
      },
      { at: "deals › notes", problem: "label needs en and ar" },
      { at: "deals › owner", problem: "needs a hint (admin.description) in en and ar" },
      { at: "deals › owner", problem: "label needs en and ar" },
      { at: "tasks", problem: "labels (singular and plural) need en and ar" },
      { at: "notes", problem: "labels (singular and plural) need en and ar" },
      { at: "assistant", problem: "label needs en and ar" },
    ]);
  });

  it("asks every action text for every language", () => {
    const both = (en: string, ar: string) => ({ en, ar });
    const labels = { singular: both("Deal", "صفقة"), plural: both("Deals", "صفقات") };
    const quiet = { label: false, admin: { description: both("Hint", "تلميح"), readOnly: true } };
    const collections = [
      {
        slug: "deals",
        labels,
        custom: {
          actions: [
            {
              label: both("Approve", "اعتماد"),
              done: "Approved",
              prompt: null,
              reason: both("Why", "لماذا"),
              confirm: { heading: both("Approve?", "اعتماد؟"), text: "Sure?", label: "$doc.number #1" },
              fields: [{ label: "Reason" }, { label: both("Note", "ملاحظة") }],
            },
            { label: "Send", confirm: "yes" },
            { label: { en: "Close" } },
            { label: { ar: "فقط" } },
          ],
        },
        fields: [
          {
            name: "status",
            type: "select",
            ...quiet,
            custom: { actions: [{ label: "Reopen" }] },
          },
          {
            type: "row",
            fields: [{ name: "stage", type: "text", ...quiet, custom: { actions: [{ label: "Advance" }] } }],
          },
          { type: "ui", custom: { actions: [{ label: "Print" }] } },
          {
            name: "lines",
            type: "array",
            ...quiet,
            fields: [{ name: "qty", type: "number", ...quiet, custom: { actions: [{ label: "Double" }] } }],
          },
          {
            type: "tabs",
            tabs: [{ fields: [{ name: "memo", type: "text", ...quiet, custom: { actions: [{ label: "Copy" }] } }] }],
          },
        ],
      },
      { slug: "tasks", labels, custom: { actions: "not a list" }, fields: [] },
    ] as unknown as Parameters<typeof fieldProblems>[0]["collections"];
    expect(
      fieldProblems({
        localization: { locales: ["en", "ar"] },
        collections,
        globals: [
          {
            slug: "branding",
            label: both("Branding", "الهوية"),
            fields: [
              {
                name: "logo",
                type: "upload",
                ...quiet,
                custom: { actions: [{ label: both("Swap", "تبديل") as unknown as string }] },
              },
            ],
          },
        ],
      }),
    ).toEqual([
      { at: "deals", problem: 'action "Approve" done needs en and ar' },
      { at: "deals", problem: 'action "Approve" confirm text needs en and ar' },
      { at: "deals", problem: 'action "Approve" field label needs en and ar' },
      { at: "deals", problem: 'action "Send" label needs en and ar' },
      { at: "deals", problem: 'action "Close" label needs en and ar' },
      { at: "deals", problem: 'action "" label needs en and ar' },
      { at: "deals › status", problem: 'action "Reopen" label needs en and ar' },
      { at: "deals › stage", problem: 'action "Advance" label needs en and ar' },
      { at: "deals › ui", problem: 'action "Print" label needs en and ar' },
      { at: "deals › lines › qty", problem: 'action "Double" label needs en and ar' },
      { at: "deals › memo", problem: 'action "Copy" label needs en and ar' },
    ]);
  });

  it("does not check action texts in a project with one language", () => {
    expect(
      fieldProblems({
        collections: [{ slug: "deals", custom: { actions: [{ label: "Approve" }] }, fields: [] } as never],
      }),
    ).toEqual([]);
  });
});
