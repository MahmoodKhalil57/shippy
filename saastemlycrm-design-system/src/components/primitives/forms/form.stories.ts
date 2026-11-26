import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, type Mock } from "storybook/test";
import "../actions/button.ts";
import "./checkbox.ts";
import "./field.ts";
import "./fieldset.ts";
import "./form.ts";
import "./select.ts";
import "./text-input.ts";
import "./textarea.ts";

const sample = { name: "Jordan Avery", email: "jordan.avery@example.com", badEmail: "jordan.avery" };

const submitted = (call: unknown[] = []) => (call[0] as CustomEvent<{ data: FormData }>).detail.data;

const meta = preview.type<{ args: { onSubmit: Mock<(e: CustomEvent) => void> } }>().meta({
  title: "Primitives/Forms/Form",
  component: "ui-form",
  args: {
    label: "New contact",
    novalidate: false,
    onSubmit: fn(),
  },
  argTypes: {
    label: { control: "text" },
    onSubmit: { table: { category: "events" } },
  },
  render: (args) => html`
    <ui-form label=${ifDefined(args.label)} ?novalidate=${args.novalidate} @ui-submit=${args.onSubmit}>
      <ui-fieldset legend="New contact" surface="base-200" width="full">
        <ui-field label="Full name" required control-id="fm-play-name">
          <ui-text-input input-id="fm-play-name" name="name" width="full" required></ui-text-input>
        </ui-field>
        <ui-field label="Email" required control-id="fm-play-email">
          <ui-text-input input-id="fm-play-email" name="email" type="email" width="full" required></ui-text-input>
        </ui-field>
        <ui-checkbox name="subscribe" label="Add to the monthly newsletter"></ui-checkbox>
        <ui-button slot="actions" type="submit" color="primary">Save contact</ui-button>
      </ui-fieldset>
    </ui-form>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: { story: "Invalid data is held back by the browser; valid data fires ui-submit with its FormData." },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("form", { name: "New contact" })).toBeInTheDocument();
    const name = canvas.getByLabelText("Full name");
    const email = canvas.getByLabelText("Email");
    const save = canvas.getByRole("button", { name: "Save contact" });
    await userEvent.click(save);
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(name).toBeInvalid();
    await userEvent.type(name, sample.name);
    await userEvent.type(email, sample.badEmail);
    await userEvent.click(save);
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(name).toBeValid();
    await expect(email).toBeInvalid();
    await userEvent.clear(email);
    await userEvent.type(email, sample.email);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Add to the monthly newsletter" }));
    await userEvent.click(save);
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    const data = submitted(args.onSubmit.mock.calls[0]);
    await expect(data.get("name")).toBe(sample.name);
    await expect(data.get("email")).toBe(sample.email);
    await expect(data.get("subscribe")).toBe("on");
  },
});

export const SubmitWithEnter = meta.story({
  name: "Submit with Enter",
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText("Full name"), sample.name);
    await userEvent.type(canvas.getByLabelText("Email"), `${sample.email}{Enter}`);
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    const data = submitted(args.onSubmit.mock.calls[0]);
    await expect(data.get("email")).toBe(sample.email);
    await expect(data.get("subscribe")).toBeNull();
  },
});

export const NoValidate = meta.story({
  name: "No validate",
  args: { novalidate: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save contact" }));
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    await expect(submitted(args.onSubmit.mock.calls[0]).get("name")).toBe("");
  },
});

export const ContactForm = meta.story({
  name: "Contact form",
  parameters: {
    docs: {
      description: {
        story:
          "Submitting is handled in place: the form fires ui-submit with its FormData and the button that sent it, and never navigates.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-form label="New contact">
      <ui-fieldset legend="New contact" surface="base-200" width="full">
        <ui-field label="Full name" required control-id="fm-name">
          <ui-text-input input-id="fm-name" name="name" width="full" required autocomplete="name"></ui-text-input>
        </ui-field>
        <ui-field label="Email" required control-id="fm-email">
          <ui-text-input
            input-id="fm-email"
            name="email"
            type="email"
            icon="mail"
            width="full"
            required
            autocomplete="email"
          ></ui-text-input>
        </ui-field>
        <ui-field label="Lead source" control-id="fm-source">
          <ui-select
            input-id="fm-source"
            name="source"
            width="full"
            placeholder="How did they find us?"
            .options=${["Referral", "Website", "Trade show", "Cold call"]}
          ></ui-select>
        </ui-field>
        <ui-field label="Notes" control-id="fm-notes">
          <ui-textarea input-id="fm-notes" name="notes" width="full" rows="3"></ui-textarea>
        </ui-field>
        <ui-checkbox name="subscribe" label="Add to the monthly newsletter"></ui-checkbox>
        <ui-button slot="actions" type="submit" color="primary">Save contact</ui-button>
        <ui-button slot="actions" type="reset" variant="text">Clear</ui-button>
      </ui-fieldset>
    </ui-form>
  `,
});

export const WithoutBrowserValidation = meta.story({
  name: "Without browser validation",
  parameters: {
    docs: {
      description: { story: "With novalidate the browser skips its own checks, leaving validation to the page." },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-form label="Quick note" novalidate>
      <ui-fieldset legend="Quick note" width="full">
        <ui-field label="Subject" required error="Add a subject before saving." control-id="fm-subject">
          <ui-text-input input-id="fm-subject" name="subject" width="full" required color="error"></ui-text-input>
        </ui-field>
        <ui-button slot="actions" type="submit" color="primary">Save note</ui-button>
      </ui-fieldset>
    </ui-form>
  `,
});
