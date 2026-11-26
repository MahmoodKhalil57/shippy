import { describe, expect, it } from "vite-plus/test";
import { m } from "../i18n/index.ts";
import { assist, block, formatNumber, note } from "./schema.ts";

describe("schema helpers", () => {
  it("formats numbers by unit", () => {
    expect(formatNumber(1234.5)).toBe("1,235");
    expect(formatNumber(1234.5, { decimals: 2 })).toBe("1234.50");
    expect(formatNumber(12.345, { unit: "pct" })).toBe(m.number_pct({ value: "12.3" }));
    expect(formatNumber(3, { unit: "days", decimals: 0 })).toBe(m.number_days({ value: "3" }));
    expect(formatNumber(2.25, { unit: "days" })).toBe(m.number_days({ value: "2.3" }));
    expect(formatNumber(1.5, { unit: "hours" })).toBe(m.number_hours({ value: "1.5" }));
    expect(formatNumber(14.6, { unit: "minutes" })).toBe(m.number_minutes({ value: "15" }));
    expect(formatNumber(1200, { unit: "money" })).toBe("1,200");
    expect(formatNumber(1200.5, { unit: "money", decimals: 2, currency: "USD" })).toBe(
      m.number_money({ currency: "USD", amount: "1,200.50" }),
    );
    expect(formatNumber(1200, { unit: "money", compact: true })).toBe(m.number_thousands({ amount: "1.2" }));
    expect(formatNumber(25_000, { unit: "money", compact: true, currency: "USD" })).toBe(
      m.number_money_compact({ currency: "USD", amount: "25" }),
    );
    expect(formatNumber(25_000, { unit: "money", compact: true, decimals: 2 })).toBe(
      m.number_thousands({ amount: "25.00" }),
    );
  });

  it("builds blocks", () => {
    expect(assist("ui-speak", "k")).toEqual({ type: "custom", element: "ui-speak", key: "k", props: {} });
    expect(assist("ui-speak", "k", { text: "x" }).props).toEqual({ text: "x" });
    expect(note("Quiet")).toEqual({ type: "text", text: "Quiet", muted: true });
    expect(block("divider", {})).toEqual({ type: "divider" });
  });
});
