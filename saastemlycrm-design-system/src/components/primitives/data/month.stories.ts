import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "./month.ts";
import type { MonthEvent } from "./month.ts";
import { getLocale, overwriteGetLocale } from "../../../lib/i18n/paraglide/runtime.js";

const events: MonthEvent[] = [
  { date: "2026-03-02", label: "Payroll run" },
  { date: "2026-03-05", label: "Supplier invoice 7712 due", tone: "warning" },
  { date: "2026-03-09", label: "Quarterly tax filing", tone: "error" },
  { date: "2026-03-09", label: "Renewal quote sent", tone: "success" },
  { date: "2026-03-12", label: "Stock count, central hub", tone: "neutral" },
  { date: "2026-03-16", label: "Board pack due" },
  { date: "2026-03-16", label: "Invoice INV-20418 due", tone: "warning" },
  { date: "2026-03-16", label: "Freight contract review", tone: "neutral" },
  { date: "2026-03-16", label: "Pricing update goes live", tone: "success" },
  { date: "2026-03-16", label: "Team planning", tone: "neutral" },
  { date: "2026-03-23", label: "Insurance renewal", tone: "error", href: "#insurance" },
  { date: "2026-03-31", label: "Month-end close", href: "#close" },
];

const fewPerDay: MonthEvent[] = events.filter(
  (e) => e.date !== "2026-03-16" || ["Board pack due", "Invoice INV-20418 due", "Team planning"].includes(e.label),
);

const meta = preview.meta({
  title: "Primitives/Data/Month",
  component: "ui-month",
  parameters: { canvas: "column" },
  args: {
    month: "2026-03",
    today: "2026-03-09",
    events: fewPerDay,
    label: "March deadlines",
    weekStart: 1,
  },
  argTypes: {
    month: { control: "text", description: "The month shown, as YYYY-MM." },
    today: { control: "text", description: "Today as YYYY-MM-DD, fixed so the story never reads the clock." },
    events: { control: "object" },
    label: { control: "text" },
    weekStart: { control: { type: "number", min: 0, max: 6, step: 1 } },
  },
  render: (args) => html`
    <ui-month
      month=${ifDefined(args.month)}
      today=${ifDefined(args.today)}
      .events=${args.events}
      label=${ifDefined(args.label)}
      week-start=${ifDefined(args.weekStart)}
    ></ui-month>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Every control drives the month; arrow keys, Home and End move focus and Enter or a click picks a day.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("group", { name: "March deadlines" })).toBeInTheDocument();
    const today = canvas.getByRole("button", { name: "Mon 9 March, 2 due" });
    await expect(today).toHaveAttribute("aria-pressed", "true");
    await expect(today).toHaveAttribute("aria-current", "date");
    await expect(canvas.getByText("Mon 9 Mar")).toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
    await expect(canvas.getByText("Quarterly tax filing")).toBeInTheDocument();
    await userEvent.tab();
    await expect(today).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Tue 10 March" })).toHaveFocus();
    await expect(today).toHaveAttribute("aria-pressed", "true");
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("button", { name: "Tue 17 March" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{ArrowLeft}");
    await expect(today).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByRole("button", { name: "Sun 1 March" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("button", { name: "Sun 1 March" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    const last = canvas.getByRole("button", { name: "Tue 31 March, 1 due" });
    await expect(last).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(last).toHaveAttribute("aria-pressed", "true");
    await expect(today).toHaveAttribute("aria-pressed", "false");
    await expect(canvas.getByRole("link", { name: "Month-end close" })).toHaveAttribute("href", "#close");
    await userEvent.click(canvas.getByRole("button", { name: "Mon 16 March, 3 due" }));
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    await expect(canvas.getByText("Mon 16 Mar")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Tue 3 March" }));
    await expect(canvas.getByText("Nothing due")).toBeInTheDocument();
    await expect(canvas.queryAllByRole("listitem")).toHaveLength(0);
  },
});

export const TodayOutsideMonth = meta.story({
  name: "Today in another month",
  args: { today: "2026-04-14" },
  play: async ({ canvas }) => {
    const first = canvas.getByRole("button", { name: "Mon 2 March, 1 due" });
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(first).toHaveAttribute("tabindex", "0");
    await expect(canvas.getByText("Payroll run")).toBeInTheDocument();
    await expect(canvas.getAllByRole("button").some((b) => b.hasAttribute("aria-current"))).toBe(false);
  },
});

export const SundayStart = meta.story({
  name: "Weeks from Sunday",
  args: { weekStart: 0, events: [], label: "March, weeks from Sunday" },
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("button", { name: "Sun 1 March" });
    const eighth = canvas.getByRole("button", { name: "Sun 8 March" });
    canvas.getByRole("button", { name: "Mon 9 March" }).focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("button", { name: "Mon 2 March" })).toHaveFocus();
    await expect(first.compareDocumentPosition(eighth) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await expect(canvas.getByText("Nothing due")).toBeInTheDocument();
  },
});

export const InvalidMonth = meta.story({
  name: "Invalid month",
  args: { month: "not a month", label: "Broken month" },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("group")).toBeNull();
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
  },
});

export const DeadlinesInAMonth = meta.story({
  name: "Deadlines in a month",
  parameters: {
    docs: {
      description: {
        story:
          "Days are toggle buttons in one tab stop: arrow keys move a day or a week, and the agenda below lists the chosen day.",
      },
    },
    canvas: "column",
  },
  render: () => html`
    <ui-month label="March deadlines" month="2026-03" today="2026-03-09" .events=${events}></ui-month>
  `,
});

export const BusyDay = meta.story({
  name: "Busy day",
  parameters: {
    docs: { description: { story: "A day shows up to three dots and counts the rest." } },
    canvas: "column",
  },
  render: () => html`
    <ui-month label="March deadlines" month="2026-03" today="2026-03-16" .events=${events}></ui-month>
  `,
  play: async ({ canvas }) => {
    const busy = canvas.getByRole("button", { name: "Mon 16 March, 5 due" });
    await expect(busy).toHaveTextContent("+2");
    await expect(busy).not.toHaveAttribute("aria-label");
    await expect(busy).toHaveAccessibleName(/^Mon 16 March, 5 due$/);
    await expect(busy).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
  },
});

export const WeekStart = meta.story({
  name: "Week start",
  parameters: {
    docs: { description: { story: "week-start overrides the locale's first weekday, 0 for Sunday and 1 for Monday." } },
    canvas: "column",
  },
  render: () => html`
    <ui-month label="March, weeks from Sunday" month="2026-03" week-start="0" .events=${events}></ui-month>
    <ui-month label="March, weeks from Monday" month="2026-03" week-start="1" .events=${events}></ui-month>
  `,
});

export const NothingDue = meta.story({
  name: "Nothing due",
  parameters: {
    docs: { description: { story: "Without events today is chosen and the agenda says nothing is due." } },
    canvas: "column",
  },
  render: () => html`<ui-month label="April deadlines" month="2026-04" today="2026-04-14" .events=${[]}></ui-month>`,
});

const weekdays = (group: HTMLElement) => [...group.children].slice(0, 7).map((c) => c.textContent!.trim());

export const LateEvents = meta.story({
  name: "Events arriving later",
  parameters: {
    docs: {
      description: {
        story:
          "Without today or events nothing is chosen; the first events to arrive pick their earliest day, later ones keep the choice. Without week info the week starts on Sunday.",
      },
    },
  },
  args: { today: undefined, events: [], label: "", weekStart: undefined },
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector("ui-month")!;
    const group = canvas.getByRole("group");
    await expect(group).not.toHaveAttribute("aria-label");
    await expect(canvas.getAllByRole("button").every((b) => b.getAttribute("aria-pressed") === "false")).toBe(true);
    await expect(canvasElement.querySelector("[aria-live]")!.children).toHaveLength(0);
    const proto = Intl.Locale.prototype;
    const saved = ["getWeekInfo", "weekInfo"].map((k) => [k, Object.getOwnPropertyDescriptor(proto, k)] as const);
    for (const [k] of saved) Object.defineProperty(proto, k, { value: undefined, configurable: true });
    try {
      el.requestUpdate();
      await el.updateComplete;
      await expect(weekdays(group)[0]).toBe("Sun");
    } finally {
      for (const [k, d] of saved) if (d) Object.defineProperty(proto, k, d);
    }
    el.events = [
      { date: "2026-03", label: "No day" },
      { date: "2026-03-xx", label: "Bad day" },
      { date: "2026-03-12", label: "Stock count" },
      { date: "2026-03-05", label: "Supplier invoice due" },
    ];
    await el.updateComplete;
    const fifth = canvas.getByRole("button", { name: "Thu 5 March, 1 due" });
    await expect(fifth).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Thu 12 March, 1 due" })).toBeInTheDocument();
    await expect(canvas.queryByText("No day")).toBeNull();
    el.events = [...el.events, { date: "2026-03-01", label: "Opening stock" }];
    await el.updateComplete;
    await expect(fifth).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("Supplier invoice due")).toBeInTheDocument();
  },
});

export const TodayWithoutDay = meta.story({
  name: "Today without a day",
  args: { today: "2026-03" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button").some((b) => b.hasAttribute("aria-current"))).toBe(false);
    await expect(canvas.getByRole("button", { name: "Mon 2 March, 1 due" })).toHaveAttribute("aria-pressed", "true");
  },
});

export const RightToLeft = meta.story({
  name: "Right to left",
  parameters: { docs: { description: { story: "In right-to-left the arrow keys follow the mirrored week." } } },
  render: (args) => html`
    <div dir="rtl">
      <ui-month month=${args.month} today=${args.today!} .events=${args.events} label=${args.label}></ui-month>
    </div>
  `,
  play: async ({ canvas, userEvent }) => {
    const today = canvas.getByRole("button", { name: "Mon 9 March, 2 due" });
    today.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("button", { name: "Tue 10 March" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(today).toHaveFocus();
    await userEvent.keyboard("a");
    await expect(today).toHaveFocus();
  },
});

export const Arabic = meta.story({
  name: "Arabic weekdays",
  parameters: { docs: { description: { story: "In Arabic the weekday headings use the narrow names." } } },
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector("ui-month")!;
    const group = canvas.getByRole("group");
    await expect(weekdays(group)[0]).toBe("Mon");
    const original = getLocale;
    overwriteGetLocale(() => "ar");
    try {
      el.requestUpdate();
      await el.updateComplete;
      const names = weekdays(group);
      await expect(names.every((n) => n.length === 1)).toBe(true);
      await expect(new Set(names).size).toBeGreaterThan(1);
    } finally {
      overwriteGetLocale(original);
      el.requestUpdate();
      await el.updateComplete;
    }
    await expect(weekdays(group)[0]).toBe("Mon");
  },
});
