import { describe, expect, it } from "vite-plus/test";
import { block, designProblems, note, type Action, type ViewBlock } from "../src/contracts/index.ts";

/** The data-driven design rules (src/app/widgets/design-check.ts), each grounded in M3 or the HIG. */

const one = (b: ViewBlock) => designProblems([b], "screen");

describe("designProblems", () => {
  it("passes a screen built the intended way", () => {
    expect(
      designProblems(
        [
          block("stats", { items: [{ label: "Open", value: "3" }] }),
          block("card", {
            heading: "Requests",
            blocks: [
              note("What this is for."),
              block("entries", {
                items: [
                  {
                    heading: "Quote v1",
                    facts: [{ label: "Total", value: "USD 1,790" }],
                    actions: [{ label: "Approve", main: true }],
                  },
                ],
              }),
            ],
          }),
        ],
        "screen",
      ),
    ).toEqual([]);
  });

  it("flags button labels past four words (M3 Buttons: ideally 1–3)", () => {
    expect(one(block("actions", { items: [{ label: "Request approval from the manager" }] }))[0]).toMatch(/5 words/);
    expect(one(block("actions", { items: [{ label: "Request approval" }] }))).toEqual([]);
  });

  it("flags an info alert with nothing to do (HIG Alerts)", () => {
    expect(one(block("alert", { tone: "info", text: "Just so you know." }))[0]).toMatch(/note\(\)/);
    const act: Action = { label: "Open", href: "/x" };
    expect(one(block("alert", { tone: "info", text: "Act on this.", actions: [act] }))).toEqual([]);
    expect(one(block("alert", { tone: "warning", text: "Careful." }))).toEqual([]);
  });

  it("flags headings that wrap past two lines (HIG Alerts)", () => {
    expect(one(block("card", { heading: "x".repeat(91), blocks: [note("y")] }))[0]).toMatch(/91 characters/);
  });

  it("flags an entry that says the same thing twice", () => {
    const same = "New supplier asks for a 50% advance";
    const problems = one(
      block("entries", { items: [{ heading: "Quote", facts: [{ label: "Exceptions", value: same }], notes: [same] }] }),
    );
    expect(problems[0]).toMatch(/said twice/);
  });

  it("flags cards three levels deep and empty cards", () => {
    const deep = block("card", { blocks: [block("card", { blocks: [block("card", { blocks: [note("x")] })] })] });
    expect(one(deep).some((p) => /three levels deep/.test(p))).toBe(true);
    expect(one(block("card", { heading: "Empty", blocks: [] }))[0]).toMatch(/empty card/);
  });
});

describe("Action", () => {
  it("can't be both the main action and destructive (HIG Buttons)", () => {
    // @ts-expect-error main and tone "error" don't go together
    const bad: Action = { label: "Delete", main: true, tone: "error" };
    expect(bad.label).toBe("Delete");
  });
});
