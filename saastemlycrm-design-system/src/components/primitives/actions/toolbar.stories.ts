import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fireEvent, fn } from "storybook/test";
import "./toolbar.ts";
import "./button.ts";
import "./icon-button.ts";
import "./button-group.ts";
import type { ButtonGroupOption } from "./button-group.ts";

const views: ButtonGroupOption[] = [
  { value: "list", label: "List", icon: "list" },
  { value: "board", label: "Board", icon: "columns" },
];

const meta = preview.type<{ args: { endText: string; onClick: (e: Event) => void } }>().meta({
  title: "Primitives/Actions/Toolbar",
  component: "ui-toolbar",
  args: { label: "Invoice actions", endText: "Send invoice", onClick: fn() },
  argTypes: {
    label: { control: "text" },
    endText: { control: "text", description: "The label of the button in the end slot." },
    onClick: { table: { category: "events" } },
  },
  parameters: { canvas: "column" },
  render: (args) => html`
    <ui-toolbar label=${ifDefined(args.label)} @click=${args.onClick}>
      <ui-icon-button icon="edit" label="Edit"></ui-icon-button>
      <ui-icon-button icon="copy" label="Duplicate"></ui-icon-button>
      <ui-icon-button icon="archive" label="Archive" disabled></ui-icon-button>
      <ui-icon-button icon="print" label="Print"></ui-icon-button>
      <ui-button slot="end" color="primary">${args.endText}</ui-button>
    </ui-toolbar>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Every control drives the toolbar; arrow keys move focus and skip disabled buttons." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("toolbar", { name: "Invoice actions" })).toBeVisible();
    const edit = canvas.getByRole("button", { name: "Edit" });
    edit.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Print" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    const send = canvas.getByRole("button", { name: "Send invoice" });
    await expect(send).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(edit).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(send).toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Archive" })).toBeDisabled();
    await userEvent.keyboard("{Home}");
    await expect(send).toHaveFocus();
    const toolbar = canvas.getByRole("toolbar");
    await expect(await fireEvent.keyDown(toolbar, { key: "ArrowRight" })).toBe(true);
    await expect(send).toHaveFocus();
    await userEvent.click(send);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
});

export const Unlabelled = meta.story({
  name: "Unlabelled",
  args: { label: "" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("toolbar")).not.toHaveAttribute("aria-label");
  },
});

export const StartAndEnd = meta.story({
  name: "Start and end",
  parameters: {
    docs: {
      description: { story: "Arrow keys move focus between the toolbar's buttons and links, skipping disabled ones." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-toolbar label="Invoice actions">
      <ui-icon-button icon="edit" label="Edit"></ui-icon-button>
      <ui-icon-button icon="copy" label="Duplicate"></ui-icon-button>
      <ui-icon-button icon="print" label="Print"></ui-icon-button>
      <ui-icon-button icon="archive" label="Archive" disabled></ui-icon-button>
      <ui-button slot="end" variant="outlined">Download PDF</ui-button>
      <ui-button slot="end" color="primary">Send invoice</ui-button>
    </ui-toolbar>
  `,
});

export const StartOnly = meta.story({
  name: "Start only",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-toolbar label="Formatting">
      <ui-icon-button icon="link" label="Insert link"></ui-icon-button>
      <ui-icon-button icon="list" label="Bulleted list" toggle selected></ui-icon-button>
      <ui-icon-button icon="table" label="Insert table"></ui-icon-button>
      <ui-icon-button icon="file" label="Attach file"></ui-icon-button>
    </ui-toolbar>
  `,
});

export const WithAButtonGroup = meta.story({
  name: "With a button group",
  parameters: {
    docs: {
      description: { story: "The button group keeps its own arrow keys; the toolbar's arrow keys pass over it." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-toolbar label="Deals">
      <ui-button-group label="View" value="board" .options=${views}></ui-button-group>
      <ui-icon-button icon="filter" label="Filter"></ui-icon-button>
      <ui-icon-button icon="search" label="Search"></ui-icon-button>
      <ui-button slot="end" color="primary">New deal</ui-button>
    </ui-toolbar>
  `,
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole("radio", { name: "Board" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    const list = canvas.getByRole("radio", { name: "List" });
    await expect(list).toHaveFocus();
    await expect(list).toHaveAttribute("aria-checked", "true");
  },
});

export const EndOnly = meta.story({
  name: "End only",
  parameters: { canvas: "column" },
  render: () => html`
    <ui-toolbar label="Form actions">
      <ui-button slot="end" variant="text">Cancel</ui-button>
      <ui-button slot="end" color="primary">Save changes</ui-button>
    </ui-toolbar>
  `,
});
