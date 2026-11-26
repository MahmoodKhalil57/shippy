import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { expect, fn, waitFor } from "storybook/test";
import "./coachmark.ts";
import "../actions/button.ts";
import "../actions/toolbar.ts";
import "../actions/icon-button.ts";
import type { UiCoachmark } from "./coachmark.ts";

interface Stop {
  target: Ref<HTMLElement>;
  heading: string;
  body?: string;
}

const tour = (mark: Ref<UiCoachmark>, stops: Stop[]) => {
  const go = (step: number) => {
    const m = mark.value;
    const stop = stops[step - 1];
    if (!m || !stop) return;
    m.step = step;
    m.total = stops.length;
    m.heading = stop.heading;
    m.body = stop.body ?? "";
    m.target = stop.target.value ?? null;
    m.open = true;
  };
  return {
    start: () => go(1),
    next: () => go((mark.value?.step ?? 0) + 1),
    back: () => go((mark.value?.step ?? 2) - 1),
    close: () => mark.value && (mark.value.open = false),
  };
};

const meta = preview
  .type<{
    args: {
      text: string;
      onNext: (e: Event) => void;
      onBack: (e: Event) => void;
      onClose: (e: Event) => void;
      onFinish: (e: Event) => void;
    };
  }>()
  .meta({
    title: "Primitives/Feedback/Coachmark",
    component: "ui-coachmark",
    args: {
      eyebrow: "Getting started",
      heading: "Create an invoice",
      text: "Start here to bill a customer.",
      step: 2,
      total: 3,
      busy: false,
      open: false,
      onNext: fn(),
      onBack: fn(),
      onClose: fn(),
      onFinish: fn(),
    },
    argTypes: {
      eyebrow: { control: "text" },
      heading: { control: "text" },
      text: { control: "text", description: "The step's body (its content)." },
      step: { control: { type: "number", min: 1, step: 1 } },
      total: { control: { type: "number", min: 1, step: 1 } },
      target: { control: false },
      onNext: { table: { category: "events" } },
      onBack: { table: { category: "events" } },
      onClose: { table: { category: "events" } },
      onFinish: { table: { category: "events" } },
    },
    render: (args) => {
      const mark = createRef<UiCoachmark>();
      const target = createRef<HTMLElement>();
      const start = () => {
        if (!mark.value) return;
        mark.value.target = target.value ?? null;
        mark.value.open = true;
      };
      const close = (e: Event) => {
        args.onClose(e);
        if (mark.value) mark.value.open = false;
      };
      return html`
        <ui-button ${ref(target)} color="primary">New invoice</ui-button>
        <ui-button variant="outlined" @click=${start}>Start tour</ui-button>
        <ui-coachmark
          ${ref(mark)}
          eyebrow=${ifDefined(args.eyebrow as string | undefined)}
          heading=${ifDefined(args.heading as string | undefined)}
          .step=${args.step ?? 1}
          .total=${args.total ?? 1}
          ?busy=${args.busy}
          ?open=${args.open}
          @ui-next=${args.onNext}
          @ui-back=${args.onBack}
          @ui-close=${close}
          @ui-finish=${args.onFinish}
          >${args.text}</ui-coachmark
        >
      `;
    },
  });

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Every control drives the coachmark; Start tour opens it, arrow keys step and Escape closes it.",
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start tour" }));
    const card = await canvas.findByRole("dialog", { name: "Create an invoice" });
    await waitFor(() => expect(card).toBeVisible());
    await expect(canvas.getByLabelText("Step 2 of 3")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(args.onNext).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await expect(args.onBack).toHaveBeenCalledOnce();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onNext).toHaveBeenCalledTimes(2);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(args.onBack).toHaveBeenCalledTimes(2);
    await userEvent.keyboard("{Escape}");
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Escape}");
    await expect(args.onNext).toHaveBeenCalledTimes(2);
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
});

export const BusyStep = meta.story({
  name: "Busy step",
  args: { busy: true, step: 1, heading: "Reading your file", eyebrow: "Importing" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start tour" }));
    await canvas.findByRole("dialog", { name: "Reading your file" });
    const buttons = canvas.getAllByRole("button").filter((b) => b.closest("ui-coachmark"));
    await expect(buttons.at(-1)!).toBeDisabled();
    await expect(canvas.queryByRole("button", { name: "Back" })).toBeNull();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onNext).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Skip" }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
});

export const LastStep = meta.story({
  name: "Last step",
  args: { step: 3, total: 3, heading: "Make it yours" },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start tour" }));
    await canvas.findByRole("dialog", { name: "Make it yours" });
    await userEvent.click(canvas.getByRole("button", { name: "Finish" }));
    await expect(args.onFinish).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
});

export const GuidedTour = meta.story({
  name: "Guided tour",
  parameters: {
    docs: {
      description: {
        story:
          "Start the tour to see the spotlight; the arrow keys step through it and Escape closes it. Each step sets its own body. It is not open on load because its scrim dims the whole page.",
      },
    },
  },
  render: () => {
    const mark = createRef<UiCoachmark>();
    const create = createRef<HTMLElement>();
    const search = createRef<HTMLElement>();
    const settings = createRef<HTMLElement>();
    const stops: Stop[] = [
      { target: create, heading: "Create an invoice", body: "Start here to bill a customer." },
      { target: search, heading: "Find anything", body: "Search invoices, customers and notes." },
      { target: settings, heading: "Make it yours", body: "Pick a theme and your language." },
    ];
    const t = tour(mark, stops);
    return html`
      <ui-toolbar label="Workspace">
        <ui-button ${ref(create)} color="primary">New invoice</ui-button>
        <ui-icon-button ${ref(search)} icon="search" label="Search"></ui-icon-button>
        <ui-icon-button ${ref(settings)} icon="settings" label="Settings"></ui-icon-button>
      </ui-toolbar>
      <ui-button variant="outlined" @click=${t.start}>Start tour</ui-button>
      <ui-coachmark
        ${ref(mark)}
        eyebrow="Getting started"
        @ui-next=${t.next}
        @ui-back=${t.back}
        @ui-close=${t.close}
        @ui-finish=${t.close}
      >
        Each step points at one control in the toolbar.
      </ui-coachmark>
    `;
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start tour" }));
    const first = await canvas.findByRole("dialog", { name: "Create an invoice" });
    await expect(first).toHaveTextContent("Start here to bill a customer.");
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    const second = await canvas.findByRole("dialog", { name: "Find anything" });
    await expect(second).toHaveTextContent("Search invoices, customers and notes.");
    await expect(second).not.toHaveTextContent("Start here to bill a customer.");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
});

export const BusyAndUntargeted = meta.story({
  name: "Busy and untargeted",
  parameters: {
    docs: {
      description: {
        story: "busy swaps Next for a spinner and disables it; with no target the card is centred in the viewport.",
      },
    },
  },
  render: () => {
    const busy = createRef<UiCoachmark>();
    const free = createRef<UiCoachmark>();
    const target = createRef<HTMLElement>();
    const open = (m: Ref<UiCoachmark>, on: HTMLElement | null) => {
      if (!m.value) return;
      m.value.target = on;
      m.value.open = true;
    };
    const shut = (e: Event) => ((e.currentTarget as UiCoachmark).open = false);
    return html`
      <ui-button ${ref(target)} variant="tonal">Import contacts</ui-button>
      <ui-button variant="outlined" @click=${() => open(busy, target.value ?? null)}>Show busy step</ui-button>
      <ui-button variant="outlined" @click=${() => open(free, null)}>Show untargeted step</ui-button>
      <ui-coachmark
        ${ref(busy)}
        busy
        eyebrow="Importing"
        heading="Reading your file"
        .step=${2}
        .total=${4}
        @ui-close=${shut}
      >
        This takes a moment for large files.
      </ui-coachmark>
      <ui-coachmark
        ${ref(free)}
        eyebrow="Welcome"
        heading="Your workspace is ready"
        @ui-close=${shut}
        @ui-finish=${shut}
      >
        A single-step note with nothing to point at.
      </ui-coachmark>
    `;
  },
});

const px = (el: HTMLElement, name: string) => parseFloat(el.style.getPropertyValue(name));

export const RichHeading = meta.story({
  name: "Rich heading",
  render: () => html`
    <ui-coachmark open .heading=${html`Meet <strong>search</strong>`}>Find invoices and customers.</ui-coachmark>
  `,
  play: async ({ canvas, userEvent, canvasElement }) => {
    const card = await canvas.findByRole("dialog", { name: "Guided tour" });
    await expect(card).toContainElement(canvas.getByText("search"));
    const mark = canvasElement.querySelector("ui-coachmark")!;
    mark.addEventListener("ui-close", () => (mark.open = false));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
});

export const Placement = meta.story({
  name: "Placement",
  parameters: {
    docs: {
      description: {
        story:
          "The card sits below its target when it fits, above it otherwise, and pinned to the viewport's bottom when neither fits; a target taller than the viewport gets a shortened spotlight.",
      },
    },
  },
  render: () => html`
    <div data-low style="position: fixed; bottom: 24px; inset-inline-start: 24px">
      <ui-button color="primary">Export</ui-button>
    </div>
    <div data-tall aria-hidden="true" style="position: fixed; top: 0; inset-inline-end: 0; height: 100vh"></div>
    <ui-coachmark
      eyebrow="Reports"
      heading="Export a report"
      @ui-close=${(e: Event) => ((e.currentTarget as UiCoachmark).open = false)}
      >Download any report as a spreadsheet.</ui-coachmark
    >
  `,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const mark = canvasElement.querySelector("ui-coachmark")!;
    const low = canvasElement.querySelector<HTMLElement>("[data-low]")!;
    const tall = canvasElement.querySelector<HTMLElement>("[data-tall]")!;
    const spot = () => canvasElement.querySelector<HTMLElement>("[data-spot]")!;

    mark.target = null;
    mark.open = true;
    const card = await canvas.findByRole("dialog", { name: "Export a report" });
    await waitFor(() => expect(px(card, "--top")).toBe(Math.max(16, (innerHeight - card.offsetHeight) / 2)));
    await expect(px(spot(), "--w")).toBe(0);
    await expect(px(spot(), "--top")).toBe(innerHeight / 2);

    mark.target = low;
    await waitFor(() =>
      expect(px(card, "--top") + card.offsetHeight).toBeLessThanOrEqual(low.getBoundingClientRect().top),
    );

    mark.target = tall;
    await waitFor(() => expect(px(spot(), "--h")).toBeLessThan(innerHeight - 16));
    await expect(px(spot(), "--h")).toBe(innerHeight - card.offsetHeight - 12 - 16 - 8);
    await expect(px(card, "--top") + card.offsetHeight).toBeLessThanOrEqual(innerHeight - 16);

    mark.target = low;
    mark.body = html`${Array.from({ length: 40 }, () => html`<p>Download any report as a spreadsheet.</p>`)}`;
    await waitFor(() => expect(card.offsetHeight).toBeGreaterThan(innerHeight / 2));
    await waitFor(() => expect(px(card, "--top")).toBe(Math.max(16, innerHeight - card.offsetHeight - 16)));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
});

export const FollowsItsTarget = meta.story({
  name: "Follows its target",
  parameters: {
    docs: { description: { story: "The spotlight follows its target when the page scrolls or resizes." } },
  },
  render: () => html`
    <div data-moving style="position: fixed; top: 120px; inset-inline-start: 24px">
      <ui-button color="primary">Export</ui-button>
    </div>
    <ui-coachmark eyebrow="Reports" heading="Export a report">Download any report as a spreadsheet.</ui-coachmark>
  `,
  play: async ({ canvas, canvasElement }) => {
    const mark = canvasElement.querySelector("ui-coachmark")!;
    const target = canvasElement.querySelector<HTMLElement>("[data-moving]")!;
    const spot = () => canvasElement.querySelector<HTMLElement>("[data-spot]")!;
    mark.target = target;
    mark.open = true;
    await canvas.findByRole("dialog", { name: "Export a report" });
    await waitFor(() => expect(px(spot(), "--w")).toBeGreaterThan(0));
    const start = px(spot(), "--top");

    target.style.top = "220px";
    document.dispatchEvent(new Event("scroll"));
    document.dispatchEvent(new Event("scroll"));
    await waitFor(() => expect(px(spot(), "--top")).toBe(start + 100));

    target.style.top = "320px";
    window.dispatchEvent(new Event("resize"));
    await waitFor(() => expect(px(spot(), "--top")).toBe(start + 200));
    mark.open = false;
  },
});
