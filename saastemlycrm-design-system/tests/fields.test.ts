import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vite-plus/test";
import { fieldError, fieldProblems, inputOf, MAX_HINT, zodOf, zodOfFields } from "../src/contracts/fields.ts";
import type { FieldLike } from "../src/contracts/config.ts";
import { mockFields, mockOf } from "../src/testing/mocks.ts";

/** What every field owes, accepts and is entered with (src/contracts/fields.ts, src/testing/mocks.ts). */

const opts = (n: number) => Array.from({ length: n }, (_, i) => `Option ${i + 1}`);

describe("inputOf", () => {
  it("picks the most direct input for every select size, single and many", () => {
    for (let n = 0; n <= 12; n++) {
      const one = inputOf({ type: "select", name: "s", options: opts(n) });
      expect(one).toBe(n >= 2 && n <= 4 ? "segmented" : "select");
      expect(inputOf({ type: "select", name: "s", hasMany: true, options: opts(n) })).toBe(n <= 8 ? "chips" : "select");
    }
    // A long label doesn't fit a segment: a menu.
    expect(inputOf({ type: "select", name: "s", options: ["Short", "A very long option label here"] })).toBe("select");
  });

  it("picks a number's input from its range and unit, for every small range", () => {
    for (let min = -2; min <= 3; min++)
      for (let max = min; max <= min + 12; max++) {
        const kind = inputOf({ type: "number", name: "n", min, max });
        const span = max - min;
        expect(kind).toBe(min === 0 && max === 1 ? "slider" : span >= 2 && span <= 10 ? "scale" : "number");
      }
    expect(inputOf({ type: "number", name: "supplierRating", min: 1, max: 5 })).toBe("rating");
    expect(inputOf({ type: "number", name: "n", custom: { number: { unit: "money", currency: "EGP" } } })).toBe(
      "money",
    );
    expect(inputOf({ type: "number", name: "n", custom: { number: { unit: "days" } } })).toBe("stepper");
    expect(inputOf({ type: "number", name: "n", min: 0, max: 100, custom: { number: { unit: "pct" } } })).toBe(
      "slider",
    );
    expect(inputOf({ type: "number", name: "n", custom: { number: { unit: "pct" } } })).toBe("percent");
    expect(inputOf({ type: "checkbox", name: "c" })).toBe("switch");
    expect(inputOf({ type: "select", name: "s", options: opts(3), custom: { input: "select" } })).toBe("select");
  });
});

describe("zodOf and fieldError", () => {
  it("says what's wrong in plain words", () => {
    const text: FieldLike = { type: "text", name: "t", required: true, maxLength: 5 };
    expect(fieldError(text, "")).toBe("Fill this in to save.");
    expect(fieldError(text, "toolong")).toBe("At most 5 characters.");
    expect(fieldError(text, "ok")).toBeUndefined();
    expect(fieldError({ type: "number", name: "n", min: 1, max: 5 }, 9)).toBe("5 or less.");
    expect(fieldError({ type: "email", name: "e" }, "nope")).toMatch(/email address/);
    expect(fieldError({ type: "select", name: "s", options: ["A", "B"] }, "C")).toBe("Pick one of the options.");
    // Not required: empty is fine.
    expect(fieldError({ type: "number", name: "n", min: 1 }, null)).toBeUndefined();
  });

  it("accepts every option of a select, and nothing else", () => {
    const f: FieldLike = { type: "select", name: "s", options: opts(6) };
    for (const o of opts(6)) expect(zodOf(f).safeParse(o).success).toBe(true);
    expect(zodOf(f).safeParse("Option 7").success).toBe(false);
  });
});

describe("mocks", () => {
  // Every field type the schemas know, with bounds, nested and many.
  const fields: FieldLike[] = [
    { type: "text", name: "vessel", required: true, minLength: 3, maxLength: 12 },
    { type: "textarea", name: "note", maxLength: 40 },
    { type: "email", name: "email", required: true },
    { type: "number", name: "qty", min: 1, max: 5, required: true },
    { type: "number", name: "share", min: 0, max: 1 },
    { type: "number", name: "total", custom: { number: { unit: "money", currency: "EGP" } } },
    { type: "checkbox", name: "urgent" },
    { type: "date", name: "eta", required: true },
    { type: "select", name: "port", options: ["Suez", "Port Said"], required: true },
    { type: "select", name: "tags", options: opts(5), hasMany: true },
    { type: "relationship", name: "customer", relationTo: "customers", required: true },
    { type: "point", name: "at" },
    {
      type: "array",
      name: "lines",
      minRows: 1,
      maxRows: 4,
      fields: [
        { type: "text", name: "description", required: true },
        { type: "number", name: "qty", min: 1 },
      ],
    },
    { type: "group", name: "bank", fields: [{ type: "text", name: "iban" }] },
    { type: "row", fields: [{ type: "text", name: "city" }] },
    {
      type: "tabs",
      tabs: [{ name: "extra", fields: [{ type: "text", name: "x" }] }, { fields: [{ type: "text", name: "y" }] }],
    },
  ];

  it("draws every mock inside its own schema (faker seeded 1…200)", () => {
    const schema = zodOfFields(fields);
    for (let seed = 1; seed <= 200; seed++) {
      faker.seed(seed);
      const r = schema.safeParse(mockFields(fields, faker, { ids: { customers: ["c1", "c2"] } }));
      expect(r.success, r.success ? "" : JSON.stringify(r.error.issues[0])).toBe(true);
    }
  });

  it("uses a field's own mock when it gives one", () => {
    expect(mockOf({ type: "text", name: "t", custom: { mock: () => "MV Nordic Tern" } })).toBe("MV Nordic Tern");
  });
});

describe("fieldProblems", () => {
  it("asks for a hint on every shown field and a placeholder on every typed one", () => {
    const problems = fieldProblems({
      collections: [
        {
          slug: "cases",
          fields: [
            { type: "text", name: "a" },
            { type: "text", name: "b", admin: { description: "What goes in.", placeholder: "e.g. 1" } },
            { type: "checkbox", name: "c", admin: { description: "Yes or no." } },
            { type: "text", name: "d", hidden: true },
            { type: "text", name: "e", admin: { description: "x".repeat(MAX_HINT + 1), placeholder: "e.g." } },
            { type: "json", name: "f", admin: { description: "Raw data." } },
          ],
        },
      ],
    });
    expect(problems.map((p) => `${p.at}: ${p.problem}`)).toEqual([
      "cases › a: needs a hint (admin.description)",
      "cases › a: needs a placeholder (admin.placeholder)",
      `cases › e: hint is ${MAX_HINT + 1} characters; keep ${MAX_HINT}, move the rest to custom.about`,
    ]);
  });
});
