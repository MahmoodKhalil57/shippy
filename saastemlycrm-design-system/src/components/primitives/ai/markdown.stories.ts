import preview from "#.storybook/preview";
import { html } from "lit";
import { expect } from "storybook/test";
import "./markdown.ts";

const text = {
  answer: `Your order **10482** shipped yesterday and should arrive on *Thursday*.

- Two items are in the parcel: a desk lamp and a pack of bulbs.
- The phone case was sent separately and arrives a day later.
- You can follow both on the [tracking page](https://example.com/track).`,
  guide: `# Returning an item

You can return most items within **30 days** of delivery. Items must be unused and in their _original packaging_.

## Steps

1. Open the order and choose **Return an item**.
2. Pick the items and a reason for each.
3. Print the label, or show the code at a drop-off point.

## Refunds

Refunds go back to the original payment method. Store credit appears in your account straight away.

### Checking a refund by API

Call \`GET /refunds/:id\` with the refund's id:

\`\`\`
curl https://api.example.com/refunds/rf_2041 \\
  -H "Authorization: Bearer <token>"
\`\`\`

The response's \`status\` is one of \`pending\`, \`sent\` or \`failed\`.`,
  inline: `Inline styles: **bold**, *italic*, _also italic_, \`code\`, an [external link](https://example.com) and an [in-app link](/orders/10482).
A single line break stays inside the same paragraph.

Other schemes, such as [this file link](ftp://files.example.com/report), render as plain text.`,
};

const meta = preview.meta({
  title: "Primitives/Ai/Markdown",
  component: "ui-markdown",
  args: { text: text.guide },
  argTypes: { text: { control: "text", description: "The markdown source." } },
  render: (args) => html`<ui-markdown .text=${args.text}></ui-markdown>`,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Edit the text control to see it rendered." } }, canvas: "column" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("heading", { level: 3, name: "Returning an item" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 4, name: "Steps" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 5, name: "Checking a refund by API" })).toBeVisible();
    const list = canvas.getByRole("list");
    await expect(list.tagName).toBe("OL");
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    await expect(canvas.getByText("30 days").tagName).toBe("STRONG");
    await expect(canvas.getByText("original packaging").tagName).toBe("EM");
    await expect(canvas.getByText("GET /refunds/:id").tagName).toBe("CODE");
    await expect(canvasElement.querySelector("pre code")).toHaveTextContent(
      "curl https://api.example.com/refunds/rf_2041",
    );
  },
});

export const Answer = meta.story({
  name: "Answer",
  args: { text: text.answer },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list");
    await expect(list.tagName).toBe("UL");
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    const link = canvas.getByRole("link", { name: "tracking page" });
    await expect(link).toHaveAttribute("href", "https://example.com/track");
    await expect(link).toHaveAttribute("target", "_blank");
  },
});

export const Links = meta.story({
  name: "Links",
  args: { text: text.inline },
  parameters: { canvas: "column" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "external link" })).toHaveAttribute("target", "_blank");
    const inApp = canvas.getByRole("link", { name: "in-app link" });
    await expect(inApp).toHaveAttribute("href", "/orders/10482");
    await expect(inApp).not.toHaveAttribute("target");
    await expect(canvas.queryByRole("link", { name: "this file link" })).not.toBeInTheDocument();
    await expect(canvas.getByText(/this file link/)).toBeVisible();
    await expect(canvas.getAllByRole("link")).toHaveLength(2);
  },
});

export const Empty = meta.story({
  name: "Empty",
  args: { text: "" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("ui-markdown > div")?.children).toHaveLength(0);
  },
});

export const AssistantAnswer = meta.story({
  name: "Assistant answer",
  parameters: { canvas: "column" },
  render: () => html`<ui-markdown .text=${text.answer}></ui-markdown>`,
});

export const Document = meta.story({
  name: "Document",
  parameters: {
    docs: {
      description: {
        story: "Headings, ordered and unordered lists, paragraphs and fenced code; wide code scrolls sideways.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-markdown .text=${text.guide}></ui-markdown>`,
});

export const InlineFormattingAndLinks = meta.story({
  name: "Inline formatting and links",
  parameters: {
    docs: {
      description: { story: "Only http(s) and in-app links become anchors, and external ones open in a new tab." },
    },
    canvas: "column",
  },
  render: () => html`<ui-markdown .text=${text.inline}></ui-markdown>`,
});

export const Tables = meta.story({
  name: "Tables",
  args: {
    text: [
      "Open invoices this week:",
      "",
      "| Invoice | Customer | Amount |",
      "| :------ | :------: | -----: |",
      "| INV-0042 | Ana Silva | 1,240.00 |",
      "| INV-0043 | Omar \\| Sons | 860.00 |",
    ].join("\n"),
  },
  parameters: {
    docs: {
      description: { story: "GFM pipe tables render as tables; the delimiter row sets each column's alignment." },
    },
  },
  play: async ({ canvas }) => {
    const table = canvas.getByRole("table");
    await expect(canvas.getAllByRole("columnheader").map((h) => h.textContent?.trim())).toEqual([
      "Invoice",
      "Customer",
      "Amount",
    ]);
    await expect(canvas.getAllByRole("row")).toHaveLength(3);
    await expect(canvas.getByRole("cell", { name: "Omar | Sons" })).toHaveClass("text-center");
    await expect(canvas.getByRole("cell", { name: "860.00" })).toHaveClass("text-end");
    await expect(table.closest("p")).toBeNull();
    await expect(canvas.getByText("Open invoices this week:")).toBeVisible();
  },
});

export const LinksWithParentheses = meta.story({
  name: "Links with parentheses",
  args: { text: "See [the article](https://en.wikipedia.org/wiki/Invoice_(disambiguation)) for details." },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "the article" })).toHaveAttribute(
      "href",
      "https://en.wikipedia.org/wiki/Invoice_(disambiguation)",
    );
    await expect(canvas.getByText(/for details\./)).not.toHaveTextContent(")");
  },
});

export const BareTables = meta.story({
  name: "Bare tables",
  args: {
    text: ["Item | Qty | Note", "--- | --- | ---", "**Lamp** | 2 | ends with \\|", "Bulbs | 4"].join("\n"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outer pipes are optional, a column without colons keeps the default alignment, a trailing escaped pipe stays in the cell and a short row leaves its last cells empty.",
      },
    },
  },
  play: async ({ canvas }) => {
    const headers = canvas.getAllByRole("columnheader");
    await expect(headers.map((h) => h.textContent?.trim())).toEqual(["Item", "Qty", "Note"]);
    for (const h of headers) await expect(h.className).not.toMatch(/text-(start|center|end)/);
    await expect(canvas.getByText("Lamp").tagName).toBe("STRONG");
    await expect(canvas.getByRole("cell", { name: "ends with |" })).toBeVisible();
    const last = canvas.getAllByRole("row").at(-1)!;
    const cellsInLast = last.querySelectorAll("td");
    await expect(cellsInLast).toHaveLength(3);
    await expect(cellsInLast[1]).toHaveTextContent("4");
    await expect(cellsInLast[2]!.textContent?.trim()).toBe("");
  },
});
