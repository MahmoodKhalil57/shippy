import { describe, expect, it } from "vite-plus/test";
import { dedupeCssRules } from "../vite/dedupe-css.ts";

describe("dedupe-css (build)", () => {
  it("drops repeated rules under the same at-rule path", () => {
    const css = "@layer u{.a{color:red}.b{color:blue}}@layer u{.a{color:red}}";
    expect(dedupeCssRules(css)).toBe("@layer u{.b{color:blue}}@layer u{.a{color:red}}");
  });

  it("keeps a fallback + @supports pair together when the first copy was merged by the minifier", () => {
    // Sheet A: its fallback merged into a combined selector; sheet B: the plain pair.
    const fallback = ".x{background-color:var(--color-primary)}";
    const supports =
      "@supports (color:color-mix(in lab,red,red)){.x{background-color:color-mix(in oklab,var(--color-primary) 20%,transparent)}}";
    const a = `.y,.x{background-color:var(--color-primary)}${supports}`;
    const b = `${fallback}${supports}`;
    const out = dedupeCssRules(`@layer u{${a}}@layer u{${b}}`);
    // The enhancement must come after the last plain fallback.
    expect(out.lastIndexOf("color-mix(in oklab")).toBeGreaterThan(out.lastIndexOf(fallback));
  });
});
