import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./text.ts";
import "../layout/box.ts";

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Typography/Text",
  component: "ui-text",
  args: {
    text: "Invoices are due 30 days after the issue date.",
    as: "p",
    variant: "body-md",
    emphasized: false,
    color: "base-content",
    align: "start",
    leading: "normal",
    clamp: undefined,
    truncate: false,
    mono: false,
    italic: false,
    uppercase: false,
    highlight: false,
    preLine: false,
  },
  argTypes: {
    text: { control: "text", description: "The text (its content)." },
    as: { control: "select", options: ["p", "span", "div", "small", "strong", "em", "code", "mark"] },
    variant: {
      control: "select",
      options: [
        "display-lg",
        "display-md",
        "display-sm",
        "headline-lg",
        "headline-md",
        "headline-sm",
        "title-lg",
        "title-md",
        "title-sm",
        "body-lg",
        "body-md",
        "body-sm",
        "label-lg",
        "label-md",
        "label-sm",
      ],
    },
    color: {
      control: "select",
      options: [
        "base-content",
        "muted",
        "primary",
        "secondary",
        "accent",
        "neutral",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
    align: { control: "select", options: ["left", "center", "right", "justify", "start", "end"] },
    leading: { control: "select", options: ["none", "tight", "snug", "normal", "relaxed", "loose"] },
    clamp: { control: "select", options: ["1", "2", "3", "4", "5", "6"] },
    preLine: { control: "boolean", description: "Keep the line breaks in the text (the pre-line attribute)." },
  },
  render: (args) => html`
    <ui-text
      as=${ifDefined(args.as)}
      variant=${ifDefined(args.variant)}
      color=${ifDefined(args.color)}
      align=${ifDefined(args.align)}
      leading=${ifDefined(args.leading)}
      clamp=${ifDefined(args.clamp)}
      ?emphasized=${args.emphasized}
      .truncate=${args.truncate}
      .mono=${args.mono}
      .italic=${args.italic}
      .uppercase=${args.uppercase}
      .highlight=${args.highlight}
      .preLine=${args.preLine}
      >${args.text}</ui-text
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the text." } } },
  play: async ({ canvas }) => {
    const paragraph = canvas.getByText("Invoices are due 30 days after the issue date.");
    await expect(paragraph.tagName).toBe("P");
    await expect(paragraph).toBeVisible();
  },
});

export const AsCode = meta.story({
  name: "As code",
  args: { as: "code", mono: true, text: "INV-0042" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("INV-0042").tagName).toBe("CODE");
  },
});

export const AsStrong = meta.story({
  name: "As strong",
  args: { as: "strong", emphasized: true, text: "Payment overdue" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Payment overdue").tagName).toBe("STRONG");
  },
});

export const PreLine = meta.story({
  name: "Pre-line",
  args: { preLine: true, text: "Line one\nLine two" },
  play: async ({ canvas }) => {
    const paragraph = canvas.getByText(/Line one/);
    await expect(getComputedStyle(paragraph).whiteSpace).toBe("pre-line");
  },
});

export const TypeRoles = meta.story({
  name: "Type roles",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-text variant="display-sm">Display small</ui-text>
    <ui-text variant="headline-md">Headline medium</ui-text>
    <ui-text variant="title-lg">Title large</ui-text>
    <ui-text variant="title-md">Title medium</ui-text>
    <ui-text variant="title-sm">Title small</ui-text>
    <ui-text variant="body-lg">Body large: invoices are due 30 days after the issue date.</ui-text>
    <ui-text variant="body-md">Body medium: invoices are due 30 days after the issue date.</ui-text>
    <ui-text variant="body-sm">Body small: invoices are due 30 days after the issue date.</ui-text>
    <ui-text variant="label-lg">Label large</ui-text>
    <ui-text variant="label-md">Label medium</ui-text>
    <ui-text variant="label-sm">Label small</ui-text>
  `,
});

export const Elements = meta.story({
  name: "Elements",
  parameters: {
    docs: { description: { story: "as picks the element, so inline text stays inline and code stays code." } },
  },
  render: () => html`
    <ui-text as="span" variant="body-md">span</ui-text>
    <ui-text as="small" variant="body-sm">small</ui-text>
    <ui-text as="strong" variant="body-md">strong</ui-text>
    <ui-text as="em" variant="body-md">em</ui-text>
    <ui-text as="code" variant="body-md" mono>INV-0042</ui-text>
    <ui-text as="mark" variant="body-md" highlight>mark, highlighted</ui-text>
  `,
});

export const Colours = meta.story({
  name: "Colours",
  render: () => html`
    <ui-text variant="label-lg" color="base-content">Base content</ui-text>
    <ui-text variant="label-lg" color="muted">Muted</ui-text>
    <ui-text variant="label-lg" color="primary">Primary</ui-text>
    <ui-text variant="label-lg" color="secondary">Secondary</ui-text>
    <ui-text variant="label-lg" color="accent">Accent</ui-text>
    <ui-text variant="label-lg" color="neutral">Neutral</ui-text>
    <ui-text variant="label-lg" color="info">Info</ui-text>
    <ui-text variant="label-lg" color="success">Success</ui-text>
    <ui-text variant="label-lg" color="warning">Warning</ui-text>
    <ui-text variant="label-lg" color="error">Error</ui-text>
  `,
});

export const Style = meta.story({
  name: "Style",
  render: () => html`
    <ui-text variant="body-md" emphasized>Emphasized</ui-text>
    <ui-text variant="title-md" emphasized>Emphasized title</ui-text>
    <ui-text variant="body-md" italic>Italic</ui-text>
    <ui-text variant="label-md" uppercase>Uppercase</ui-text>
    <ui-text variant="body-md" mono>Monospace 1,240.00</ui-text>
    <ui-text variant="body-md" highlight>Highlighted</ui-text>
  `,
});

export const AlignmentAndLeading = meta.story({
  name: "Alignment and leading",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-text variant="body-md" align="start">Aligned to the start.</ui-text>
    <ui-text variant="body-md" align="center">Centred.</ui-text>
    <ui-text variant="body-md" align="end">Aligned to the end.</ui-text>
    <ui-text variant="body-md" align="justify" leading="tight"
      >Justified with tight leading. Revenue grew 12% against the previous quarter, led by renewals and a strong month
      for new deals. Overdue invoices fell to three, the lowest this year.</ui-text
    >
    <ui-text variant="body-md" leading="loose"
      >Loose leading. Revenue grew 12% against the previous quarter, led by renewals and a strong month for new deals.
      Overdue invoices fell to three, the lowest this year.</ui-text
    >
  `,
});

export const TruncationAndClamping = meta.story({
  name: "Truncation and clamping",
  parameters: {
    docs: { description: { story: "truncate cuts to one line with an ellipsis; clamp keeps up to that many lines." } },
    canvas: "column",
  },
  render: () => html`
    <ui-box width="64">
      <ui-text variant="body-md" truncate
        >Invoice INV-0042 for Ana Silva, 1,240.00, due on Friday, sent on 3 November</ui-text
      >
    </ui-box>
    <ui-box width="64">
      <ui-text variant="body-md" clamp="2"
        >Revenue grew 12% against the previous quarter, led by renewals and a strong month for new deals. Overdue
        invoices fell to three, the lowest this year.</ui-text
      >
    </ui-box>
  `,
});

export const PreservedLineBreaks = meta.story({
  name: "Preserved line breaks",
  parameters: {
    docs: {
      description: {
        story: "pre-line keeps the line breaks in the text, as for an address or a note typed by a user.",
      },
    },
    canvas: "column",
  },
  render: () => html`<ui-text variant="body-md" pre-line>${"Ana Silva\n12 Harbour Road\nPorto 4000-123"}</ui-text>`,
});

export const FallbacksAndDefaultEmphasis = meta.story({
  name: "Fallbacks and default emphasis",
  parameters: {
    docs: {
      description: {
        story: "An unknown as renders a paragraph; emphasis without a variant uses the regular step.",
      },
    },
  },
  render: () => html`
    <ui-text as="section">Shipping resumes on Monday.</ui-text>
    <ui-text emphasized>Two parcels are waiting.</ui-text>
  `,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Shipping resumes on Monday.").tagName).toBe("P");
    const emphasized = canvas.getByText("Two parcels are waiting.");
    await expect(emphasized).toHaveClass("font-semibold");
    await expect(emphasized).not.toHaveClass("font-bold");
  },
});
