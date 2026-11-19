import { describe, expect, it } from "vite-plus/test";
import { block } from "../src/app/widgets/schema.ts";
import { blocksText, headerText } from "../src/app/widgets/text.ts";

describe("blocks as text (for agents)", () => {
  it("reads key figures, lists and tables, and leaves out explanations and controls", () => {
    const lines = blocksText(
      [
        block("stats", { items: [{ label: "Overdue", value: "USD 12k", note: "2 invoices" }] }),
        block("card", {
          heading: "Queue",
          count: 7,
          blocks: [
            block("text", { text: "How this queue is sorted.", muted: true }),
            block("table", {
              columns: [
                { key: "id", label: "Order", supporting: "who" },
                { key: "stage", label: "Stage" },
              ],
              rows: [
                { id: { text: "ORD-0142", href: "/x" }, who: "Acme Ltd", stage: { text: "Open", dot: "info" } },
                { id: "ORD-0143", who: "", stage: "Closed" },
              ],
            }),
            block("actions", { items: [{ label: "All orders", href: "/orders" }] }),
          ],
        }),
        block("list", { items: [{ headline: "Call Acme", supporting: "today" }, { headline: "B" }], empty: "—" }),
      ],
      { rows: 1 },
    );
    expect(lines).toEqual([
      "- Overdue: USD 12k (2 invoices)",
      "Queue (7):",
      "- ORD-0142 · Acme Ltd · Open",
      "… 1 more",
      "- Call Acme · today",
      "… 1 more",
    ]);
  });

  it("reads a header's heading and subtitle", () => {
    expect(headerText({ heading: "Good morning", subtitle: "3 things need you" })).toEqual([
      "Good morning",
      "3 things need you",
    ]);
    expect(headerText(null)).toEqual([]);
  });
});
