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

  it("drops a fallback that lands after its own enhancement (the table rows' state layer)", () => {
    // One sheet's pair survives as [enhancement]; a later sheet's fallback, not a duplicate
    // because the first copy was merged, would paint every row solid.
    const sel = ".v tbody tr";
    const enhance = `@supports (color:color-mix(in lab, red, red)){${sel}{background-image:linear-gradient(color-mix(in oklab, currentColor var(--s), transparent))}}`;
    const fallback = `${sel}{background-image:linear-gradient(currentColor,currentColor)}`;
    const out = dedupeCssRules(`@layer v{${enhance}${fallback}.other{color:red}}`);
    expect(out).not.toContain(fallback);
    expect(out).toContain("color-mix(in oklab, currentColor");
    expect(out).toContain(".other{color:red}");
    // A fallback before its enhancement stays (browsers without color-mix).
    expect(dedupeCssRules(`@layer v{${fallback}${enhance}}`)).toContain(fallback);
  });
});
