import { describe, expect, it } from "vite-plus/test";
import { widthViolations } from "../vite/layout-proof/check.ts";
import { allViolations } from "../vite/layout-proof/report.ts";

/**
 * The layout proof (vite/layout-proof/check.ts, the layout algebra in
 * src/components/primitives/layout/algebra.ts): every width-deciding class of every primitive comes
 * from the algebra, so the layout invariant holds on every page, at every width and text size, by
 * construction. This runs the proof over all primitives (the build runs it per stylesheet), and
 * shows the check refuses what it's meant to: each case below is a layout that once broke.
 */

const recipe = (classes: string) =>
  `import { rcva } from "../../base/variants.ts";\nexport const r = rcva(${JSON.stringify(classes)});`;
const flagged = (classes: string) => widthViolations(recipe(classes), "x.ts").map((v) => v.token);

describe("the layout proof", () => {
  it("holds for every primitive", () => {
    const all = allViolations();
    const lines = [...all].flatMap(([file, vs]) => vs.map((v) => `${file}:${v.line} ${v.token} — ${v.why}`));
    expect(lines).toEqual([]);
  });

  it("accepts the algebra's bundles, written out or referenced", () => {
    expect(flagged("flex flex-row flex-wrap max-w-full items-center gap-2")).toEqual([]);
    expect(flagged("flex flex-col gap-1")).toEqual([]);
    expect(flagged("w-full px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-3")).toEqual([]);
    expect(flagged("grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4")).toEqual([]);
    expect(flagged("grid grid-cols-[minmax(0,1fr)] @min-[18rem]:grid-cols-2")).toEqual([]);
    expect(flagged("@container w-full")).toEqual([]);
    expect(flagged("min-w-[min(100%,7rem)] [overflow-wrap:anywhere] text-body-md")).toEqual([]);
    const src = `import { row, inset } from "../layout/algebra.ts";\nimport { rcva } from "../../base/variants.ts";\nexport const r = rcva(\`\${row} \${inset["4"]} items-start\`);`;
    expect(widthViolations(src, "x.ts")).toEqual([]);
  });

  it("refuses what breaks a layout", () => {
    // A row that never wraps: its items push past the card (the approvals evidence, a toolbar).
    expect(flagged("flex items-center gap-2")).toContain("flex");
    // A column that turns into a non-wrapping row at a breakpoint.
    expect(flagged("flex flex-col md:flex-row")).toContain("md:flex-row");
    // A column that wraps: a second column beside the first in a short box (a menu in a short pane).
    expect(flagged("flex flex-col flex-wrap")).toContain("flex-wrap");
    // Fixed padding: three of them nested left an alert 80px for its text.
    expect(flagged("px-4 py-3")).toContain("px-4");
    // A size container without a width collapses to nothing in a centred column (the helper's panel).
    expect(flagged("@container/alert")).toContain("@container/alert");
    // Two columns at any width: each squeezed to a sliver on a phone.
    expect(flagged("grid grid-cols-2")).toContain("grid-cols-2");
    // Two columns from 12rem: not enough room to give each 7rem.
    expect(flagged("grid grid-cols-[minmax(0,1fr)] @min-[12rem]:grid-cols-2")).toContain("@min-[12rem]:grid-cols-2");
    // A trailing group that refuses to shrink beside the content.
    expect(flagged("shrink-0 gap-2")).toContain("shrink-0");
    // A fixed width wider than a phone column, uncapped.
    expect(flagged("w-96")).toContain("w-96");
    expect(flagged("w-96 max-w-full")).toEqual([]);
    // Text that never wraps and isn't cut.
    expect(flagged("whitespace-nowrap")).toContain("whitespace-nowrap");
    expect(flagged("whitespace-nowrap overflow-hidden")).toEqual([]);
    // Running text that doesn't say how it wraps.
    expect(flagged("text-body-md text-on-surface-variant")).toContain("text-body-md");
    // Physical sides: wrong in right-to-left.
    expect(flagged("left-4")).toContain("left-4");
    // A daisyUI component whose layout isn't declared.
    expect(flagged("stats")).toContain("stats");
    // A width set through a custom property, outside the algebra.
    expect(flagged("[--card-p:2rem]")).toContain("[--card-p:2rem]");
  });

  it("reads inline styles and class templates", () => {
    const style = `import { styleMap } from "lit/directives/style-map.js";\nexport const t = () => styleMap({ width: "30rem" });`;
    expect(widthViolations(style, "x.ts").map((v) => v.token)).toEqual(["width"]);
    const built = `import { rcva } from "../../base/variants.ts";\nconst w = "w-96";\nexport const r = rcva(\`\${someVariable} gap-2\`);`;
    expect(widthViolations(built, "x.ts").map((v) => v.token)).toEqual(["someVariable"]);
  });
});
