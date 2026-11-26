import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./loading.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const localized = (text: string) => text as LocalizedString;

const meta = preview.meta({
  title: "Primitives/Feedback/Loading",
  component: "ui-loading",
  args: { variant: "spinner", size: "md", color: "primary", label: localized("Loading invoices") },
  argTypes: {
    variant: { control: "inline-radio", options: ["spinner", "morph"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    color: { control: "inline-radio", options: [undefined, "primary"] },
    label: { control: "text" },
  },
  render: (args) => html`
    <ui-loading
      variant=${ifDefined(args.variant)}
      size=${ifDefined(args.size)}
      color=${ifDefined(args.color)}
      label=${ifDefined(args.label)}
    ></ui-loading>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: { docs: { description: { story: "Every control drives the indicator; its label names the status." } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading invoices" })).toBeVisible();
  },
});

export const Morph = meta.story({
  name: "Morph",
  args: { variant: "morph", size: "lg", label: localized("Loading contacts") },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading contacts" })).toBeVisible();
  },
});

export const DefaultLabel = meta.story({
  name: "Default label",
  args: { label: undefined, color: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeVisible();
  },
});

export const Variants = meta.story({
  name: "Variants",
  parameters: {
    docs: {
      description: {
        story:
          "Each indicator is a status with a label for assistive tech; morph falls back to a pulse when motion is reduced.",
      },
    },
  },
  render: () => html`
    <ui-loading variant="spinner" label="Loading invoices"></ui-loading>
    <ui-loading variant="morph" label="Loading invoices"></ui-loading>
    <ui-loading variant="spinner" color="primary" label="Loading invoices"></ui-loading>
    <ui-loading variant="morph" color="primary" label="Loading invoices"></ui-loading>
  `,
});

export const SpinnerSizes = meta.story({
  name: "Spinner sizes",
  render: () => html`
    <ui-loading size="sm" color="primary"></ui-loading>
    <ui-loading size="md" color="primary"></ui-loading>
    <ui-loading size="lg" color="primary"></ui-loading>
    <ui-loading size="xl" color="primary"></ui-loading>
  `,
});

export const MorphSizes = meta.story({
  name: "Morph sizes",
  render: () => html`
    <ui-loading variant="morph" size="sm" color="primary"></ui-loading>
    <ui-loading variant="morph" size="md" color="primary"></ui-loading>
    <ui-loading variant="morph" size="lg" color="primary"></ui-loading>
    <ui-loading variant="morph" size="xl" color="primary"></ui-loading>
  `,
});
