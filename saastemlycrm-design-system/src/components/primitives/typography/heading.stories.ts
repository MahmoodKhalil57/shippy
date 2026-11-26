import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./heading.ts";

const meta = preview.type<{ args: { text: string } }>().meta({
  title: "Primitives/Typography/Heading",
  component: "ui-heading",
  args: {
    text: "Quarterly report",
    level: 2,
    variant: undefined,
    emphasized: false,
    color: "base-content",
    align: "start",
    tracking: "normal",
    balance: false,
  },
  argTypes: {
    text: { control: "text", description: "The heading text (its content)." },
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    variant: {
      control: "select",
      options: [
        undefined,
        "page",
        "display-lg",
        "display-md",
        "display-sm",
        "headline-lg",
        "headline-md",
        "headline-sm",
        "title-lg",
        "title-md",
        "title-sm",
        "label-lg",
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
    align: { control: "select", options: ["left", "center", "right", "start", "end"] },
    tracking: { control: "select", options: ["tighter", "tight", "normal", "wide", "wider", "widest"] },
  },
  render: (args) => html`
    <ui-heading
      level=${ifDefined(args.level)}
      variant=${ifDefined(args.variant)}
      color=${ifDefined(args.color)}
      align=${ifDefined(args.align)}
      tracking=${ifDefined(args.tracking)}
      ?emphasized=${args.emphasized}
      .balance=${args.balance}
      >${args.text}</ui-heading
    >
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the heading; level sets the element." } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "Quarterly report" })).toBeVisible();
  },
});

export const PageTitle = meta.story({
  name: "Page title",
  args: { level: 1, variant: "page", text: "Invoices" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Invoices" })).toBeVisible();
  },
});

export const EmphasizedTitle = meta.story({
  name: "Emphasized",
  args: { level: 3, emphasized: true, text: "Open invoices" },
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 3, name: "Open invoices" });
    await expect(getComputedStyle(title).fontWeight).toBe("700");
  },
});

export const Levels = meta.story({
  name: "Levels",
  parameters: {
    docs: { description: { story: "level sets the h1 to h6 element; each level has a default type role." } },
    canvas: "column",
  },
  render: () => html`
    <ui-heading level="1">Level 1, headline large</ui-heading>
    <ui-heading level="2">Level 2, headline small</ui-heading>
    <ui-heading level="3">Level 3, title large</ui-heading>
    <ui-heading level="4">Level 4, title medium</ui-heading>
    <ui-heading level="5">Level 5, title small</ui-heading>
    <ui-heading level="6">Level 6, label large</ui-heading>
  `,
});

export const TypeRoles = meta.story({
  name: "Type roles",
  parameters: {
    docs: {
      description: { story: "variant changes the look without changing the level, so the outline stays correct." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-heading level="1" variant="page">Page title</ui-heading>
    <ui-heading level="2" variant="display-lg">Display large</ui-heading>
    <ui-heading level="2" variant="display-md">Display medium</ui-heading>
    <ui-heading level="2" variant="display-sm">Display small</ui-heading>
    <ui-heading level="2" variant="headline-lg">Headline large</ui-heading>
    <ui-heading level="2" variant="headline-md">Headline medium</ui-heading>
    <ui-heading level="2" variant="headline-sm">Headline small</ui-heading>
    <ui-heading level="3" variant="title-lg">Title large</ui-heading>
    <ui-heading level="3" variant="title-md">Title medium</ui-heading>
    <ui-heading level="3" variant="title-sm">Title small</ui-heading>
    <ui-heading level="4" variant="label-lg">Label large</ui-heading>
  `,
});

export const Emphasis = meta.story({
  name: "Emphasis",
  parameters: {
    docs: {
      description: {
        story: "emphasized steps the weight up: bold for headline and title roles, semibold for the rest.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-heading level="2">Quarterly report</ui-heading>
    <ui-heading level="2" emphasized>Quarterly report</ui-heading>
    <ui-heading level="3" variant="label-lg">Open invoices</ui-heading>
    <ui-heading level="3" variant="label-lg" emphasized>Open invoices</ui-heading>
  `,
  play: async ({ canvas }) => {
    const [plain, bold] = canvas.getAllByRole("heading", { level: 3 });
    await expect(Number(getComputedStyle(bold!).fontWeight)).toBeGreaterThan(
      Number(getComputedStyle(plain!).fontWeight),
    );
  },
});

export const Colours = meta.story({
  name: "Colours",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-heading level="4" color="base-content">Base content</ui-heading>
    <ui-heading level="4" color="muted">Muted</ui-heading>
    <ui-heading level="4" color="primary">Primary</ui-heading>
    <ui-heading level="4" color="secondary">Secondary</ui-heading>
    <ui-heading level="4" color="accent">Accent</ui-heading>
    <ui-heading level="4" color="neutral">Neutral</ui-heading>
    <ui-heading level="4" color="info">Info</ui-heading>
    <ui-heading level="4" color="success">Success</ui-heading>
    <ui-heading level="4" color="warning">Warning</ui-heading>
    <ui-heading level="4" color="error">Error</ui-heading>
  `,
});

export const AlignmentAndTracking = meta.story({
  name: "Alignment and tracking",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-heading level="4" align="start">Aligned to the start</ui-heading>
    <ui-heading level="4" align="center">Centred</ui-heading>
    <ui-heading level="4" align="end">Aligned to the end</ui-heading>
    <ui-heading level="4" tracking="tighter">Tracking tighter</ui-heading>
    <ui-heading level="4" tracking="normal">Tracking normal</ui-heading>
    <ui-heading level="4" tracking="widest">Tracking widest</ui-heading>
  `,
});

export const BalancedWrapping = meta.story({
  name: "Balanced wrapping",
  parameters: {
    docs: { description: { story: "balance evens out line lengths when a long heading wraps." } },
    canvas: "column",
  },
  render: () => html`
    <ui-heading level="2" align="center"
      >Everything you need to send invoices, follow up on payments and close the quarter</ui-heading
    >
    <ui-heading level="2" align="center" balance
      >Everything you need to send invoices, follow up on payments and close the quarter</ui-heading
    >
  `,
});

export const UnknownLevel = meta.story({
  name: "Unknown level",
  parameters: { docs: { description: { story: "A level outside 1 to 6 falls back to a level-2 heading." } } },
  render: () => html`<ui-heading level=${9}>Open invoices</ui-heading>`,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "Open invoices" })).toBeVisible();
  },
});
