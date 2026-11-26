import { describe, expect, it } from "vite-plus/test";
import type { ViewBlock } from "./schema.ts";
import { blocksText, cellWords, headerText } from "./text.ts";

const lines = (b: ViewBlock, limits?: { rows?: number; width?: number }) => blocksText([b], limits);

describe("cellWords and headerText", () => {
  it("reads cells with their tags", () => {
    expect(cellWords(null)).toBe("");
    expect(cellWords(4)).toBe("4");
    expect(cellWords("x")).toBe("x");
    expect(cellWords({ text: "Paid", tags: [{ label: "Late" }] })).toBe("Paid · Late");
    expect(cellWords({ text: "Paid", tag: true })).toBe("Paid");
  });

  it("reads a header", () => {
    expect(headerText(null)).toEqual([]);
    expect(headerText({ heading: "Invoices" })).toEqual(["Invoices"]);
    expect(headerText({ heading: "Invoices", subtitle: "All of them" })).toEqual(["Invoices", "All of them"]);
  });
});

describe("blocksText", () => {
  it("reads cards with their heading, tags and count", () => {
    expect(
      lines({
        type: "card",
        heading: "Week",
        tags: [{ label: "New" }],
        count: 2,
        blocks: [{ type: "text", text: "Hi" }],
      }),
    ).toEqual(["Week · New (2):", "Hi"]);
    expect(lines({ type: "card", tags: [{ label: "New" }], blocks: [] })).toEqual(["New:"]);
    expect(lines({ type: "card", heading: "Solo", blocks: [] })).toEqual(["Solo:"]);
    expect(lines({ type: "card", blocks: [{ type: "divider" }] })).toEqual([]);
  });

  it("reads entries, tables, lists, timelines, tiles and gantts with a limit", () => {
    expect(lines({ type: "entries", items: [], empty: "None" })).toEqual(["None"]);
    expect(lines({ type: "entries", items: [] })).toEqual([]);
    expect(
      lines(
        {
          type: "entries",
          items: [
            { heading: "A", status: { label: "Open" }, meta: ["Mon"], facts: [{ label: "Due", value: "Fri" }] },
            { heading: "B" },
          ],
        },
        { rows: 1 },
      ),
    ).toEqual(["- A · Open · Mon · Due: Fri", "… 1 more"]);
    expect(lines({ type: "entries", items: [{ heading: "Bare" }] })).toEqual(["- Bare"]);
    expect(lines({ type: "table", columns: [], rows: [], empty: "Empty" })).toEqual(["Empty"]);
    expect(lines({ type: "table", columns: [], rows: [] })).toEqual([]);
    expect(
      lines({
        type: "table",
        columns: [
          { key: "a", label: "A", supporting: "b" },
          { key: "c", label: "C" },
        ],
        rows: [{ a: "1", b: "2", c: "3" }],
      }),
    ).toEqual(["- 1 · 2 · 3"]);
    expect(lines({ type: "list", items: [], empty: "Nothing" })).toEqual(["Nothing"]);
    expect(lines({ type: "list", items: [] })).toEqual([]);
    expect(
      lines({
        type: "list",
        items: [{ headline: "H", lead: "L", overline: "O", supporting: "S", trailing: "T", tags: [{ label: "G" }] }],
      }),
    ).toEqual(["- L · O · H · S · T · G"]);
    expect(lines({ type: "list", items: [{ headline: "" }] })).toEqual([]);
    expect(lines({ type: "timeline", items: [{ time: "9", heading: "H", text: "T" }, {}, {}] }, { rows: 2 })).toEqual([
      "- 9 · H · T",
      "… 1 more",
    ]);
    expect(lines({ type: "tiles", items: [{ heading: "H", overline: "O", text: "T" }] })).toEqual(["- O · H · T"]);
    expect(
      lines({
        type: "gantt",
        label: "Job",
        periods: ["Mon", "Tue"],
        rows: [
          { label: "A", from: 0, to: 1, tag: "Crew" },
          { label: "B", from: 1, to: 1 },
        ],
      }),
    ).toEqual(["- A: Mon · Tue (Crew)", "- B: Tue · Tue"]);
  });

  it("reads figures, details, gauges and steps", () => {
    expect(
      lines({
        type: "stats",
        items: [
          { label: "Paid", value: "4", delta: { text: "+1", dir: "up" }, note: "this week" },
          { label: "Late", value: "1" },
        ],
      }),
    ).toEqual(["- Paid: 4 (up +1 · this week)", "- Late: 1"]);
    expect(lines({ type: "details", items: [{ label: "City", value: "Austin", note: "HQ" }] })).toEqual([
      "- City: Austin · HQ",
    ]);
    expect(
      lines({
        type: "gauges",
        items: [
          { label: "A", value: 1, max: 2 },
          { label: "B", value: 1, max: 2, valueText: "half" },
        ],
      }),
    ).toEqual(["- A: 1 of 2", "- B: half"]);
    expect(lines({ type: "steps", items: [{ label: "One" }, { label: "Two" }], current: 1 })).toEqual([
      "Step 2 of 2: Two",
    ]);
    expect(lines({ type: "steps", items: [], current: 0 })).toEqual([]);
  });

  it("reads the last point of a chart", () => {
    const chart = (extra: object) =>
      ({
        type: "chart",
        chart: {
          kind: "bars",
          labels: ["Jan", "Feb"],
          series: [
            { name: "A", values: [1, 2] },
            { name: "B", values: [3] },
          ],
        },
        ...extra,
      }) as ViewBlock;
    expect(lines(chart({ title: "Paid" }))).toEqual(["- Paid, Feb: A 2"]);
    expect(lines(chart({ label: "Due" }))).toEqual(["- Due, Feb: A 2"]);
    expect(lines(chart({}))).toEqual(["- Chart, Feb: A 2"]);
    expect(lines({ type: "chart", chart: { kind: "bars", labels: [], series: [{ name: "A", values: [] }] } })).toEqual(
      [],
    );
    expect(lines({ type: "chart", chart: { kind: "bars", labels: [], series: [{ name: "A", values: [5] }] } })).toEqual(
      [],
    );
  });

  it("reads alerts, empty states, tags, text, settings and messages", () => {
    expect(lines({ type: "alert", heading: "Late", text: "Two invoices" })).toEqual(["Late: Two invoices"]);
    expect(lines({ type: "alert", text: "Plain" })).toEqual(["Plain"]);
    expect(lines({ type: "empty", heading: "None", description: "Add one" })).toEqual(["None · Add one"]);
    expect(lines({ type: "tags", items: [{ label: "A" }, { label: "B" }] })).toEqual(["A · B"]);
    expect(lines({ type: "tags", items: [] })).toEqual([]);
    expect(lines({ type: "text", text: "  Hello  " })).toEqual(["Hello"]);
    expect(lines({ type: "text", text: "Quiet", muted: true })).toEqual([]);
    expect(lines({ type: "text", text: " " })).toEqual([]);
    expect(
      lines({
        type: "settings",
        items: [
          { label: "Email", value: true },
          { label: "SMS", value: false },
          { label: "Digest", value: "daily" },
        ],
      }),
    ).toEqual(["- Email: on", "- SMS: off", "- Digest: daily"]);
    expect(lines({ type: "message", meta: ["From A"], subject: "Hi", body: "…" })).toEqual(["From A · Hi"]);
    expect(lines({ type: "message", subject: "Hi", body: "…" })).toEqual(["Hi"]);
    expect(lines({ type: "divider" })).toEqual([]);
  });

  it("walks grids and splits and cuts long lines", () => {
    expect(
      blocksText(
        [
          { type: "grid", blocks: [{ type: "text", text: "abcdefgh" }] },
          { type: "split", main: [{ type: "text", text: "main" }], side: [{ type: "text", text: "side" }] },
        ],
        { width: 5 },
      ),
    ).toEqual(["abcd…", "main", "side"]);
  });
});
