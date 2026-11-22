import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { scopedInvalidationCss } from "../vite/scoped-invalidation.ts";

/**
 * vite/scoped-invalidation.ts: no rule that makes a class change restyle a whole subtree. daisyUI's
 * button carries one (`[class~="not-prose"] *`, for Tailwind Typography's `.prose`), and with it a
 * class change on the frame's root restyled the whole app.
 */
describe("scoped invalidation", () => {
  it("drops a rule that matches on not-prose, and only that selector of a list", () => {
    const css =
      '.prose :where(a.btn):not(:where([class~="not-prose"], [class~="not-prose"] *)){text-decoration:none}.a,.b :not([class~="not-prose"] *){color:red}.c{color:blue}';
    const out = scopedInvalidationCss(css);
    expect(out).not.toContain("not-prose");
    expect(out).toContain(".a{color:red}");
    expect(out).toContain(".c{color:blue}");
  });

  it("leaves daisyUI's button with no not-prose rule", () => {
    const daisy = path.dirname(createRequire(import.meta.url).resolve("daisyui/package.json"));
    const button = readFileSync(path.join(daisy, "components/button.css"), "utf8");
    // The rule is there to begin with (so this pass still has something to do)…
    expect(button).toContain("not-prose");
    // …and gone after it.
    expect(scopedInvalidationCss(button)).not.toContain("not-prose");
  });
});
