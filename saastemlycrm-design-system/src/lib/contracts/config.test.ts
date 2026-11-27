import { describe, expect, it } from "vite-plus/test";
import * as contracts from "./index.ts";
import { defineConfig, formats, tones, type MockConfig } from "./index.ts";

describe("defineConfig", () => {
  it("returns the config it is given", () => {
    const config: MockConfig = {
      collections: [{ slug: "deals", fields: [{ name: "title", type: "text" }] }],
      admin: { user: "users", meta: { titleSuffix: "· CRM" } },
      localization: { locales: ["en", { code: "ar", rtl: true }], defaultLocale: "en" },
    };
    expect(defineConfig(config)).toBe(config);
  });
});

describe("tones", () => {
  it("wraps option tones for a field's custom settings", () => {
    expect(tones({ won: "success", lost: "error", open: "neutral" })).toEqual({
      tones: { won: "success", lost: "error", open: "neutral" },
    });
  });
});

describe("formats", () => {
  it("formats money in a fixed currency when given a currency code", () => {
    expect(formats.money("AED")).toEqual({ number: { unit: "money", currency: "AED" } });
    expect(formats.money("USD", { decimals: 0, compact: true })).toEqual({
      number: { unit: "money", currency: "USD", decimals: 0, compact: true },
    });
  });

  it("formats money in the currency another field holds when given a field name", () => {
    expect(formats.money("currency")).toEqual({ number: { unit: "money", currencyField: "currency" } });
    expect(formats.money("AEDX")).toEqual({ number: { unit: "money", currencyField: "AEDX" } });
    expect(formats.money("aed", { decimals: 2 })).toEqual({
      number: { unit: "money", currencyField: "aed", decimals: 2 },
    });
  });

  it("formats percentages and days with default or chosen decimals", () => {
    expect(formats.percent()).toEqual({ number: { unit: "pct", decimals: 1 } });
    expect(formats.percent(0)).toEqual({ number: { unit: "pct", decimals: 0 } });
    expect(formats.days()).toEqual({ number: { unit: "days", decimals: 0 } });
    expect(formats.days(1)).toEqual({ number: { unit: "days", decimals: 1 } });
  });
});

describe("contracts entry", () => {
  it("exports the config helpers, field checks and language helpers a Payload project uses", () => {
    for (const name of [
      "defineConfig",
      "tones",
      "inputOf",
      "zodOf",
      "zodOfFields",
      "fieldError",
      "fieldProblems",
      "isLocalized",
      "locale",
      "localize",
      "localizeConfig",
    ])
      expect(typeof (contracts as Record<string, unknown>)[name]).toBe("function");
    expect(typeof contracts.intl.number).toBe("function");
    expect(contracts.LOCALES).toEqual(["en", "ar"]);
    expect(contracts.MAX_HINT).toBe(120);
  });
});
