import { describe, expect, it } from "vite-plus/test";
import { UiOtp } from "../src/components/primitives/forms/otp.ts";

describe("<ui-otp> keeps only what a code holds", () => {
  it("drops letters, spaces, dashes and symbols, as typed or pasted", () => {
    expect(UiOtp.clean("1a2-3 4!5x6", 6)).toBe("123456");
    expect(UiOtp.clean("abc", 6)).toBe("");
    expect(UiOtp.clean("1234567", 6)).toBe("123456");
  });

  it("reads Arabic-Indic and Persian digits as 0–9", () => {
    expect(UiOtp.clean("١٢٣٤٥٦", 6)).toBe("123456");
    expect(UiOtp.clean("۰۷۸۹", 4)).toBe("0789");
  });

  it("keeps letters only when it's alphanumeric", () => {
    expect(UiOtp.clean("ab-12 c", 6, true)).toBe("ab12c");
  });
});
