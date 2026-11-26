import preview from "#.storybook/preview";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, spyOn, waitFor } from "storybook/test";
import "./app-shell.ts";
import "../../primitives/navigation/menu.ts";
import "../../primitives/actions/icon-button.ts";
import "../../primitives/typography/text.ts";
import "../../primitives/layout/container.ts";
import "../actions/appearance.ts";
import { applyBackground } from "../../../lib/base/appearance.ts";
import { columnsFor } from "../../../lib/base/tiles.ts";
import { iconSvg, type IconName } from "../../primitives/media/icon.ts";
import { ICON_NAMES } from "../../../lib/base/icon-names.ts";
import type { MenuItem } from "../../primitives/navigation/menu.ts";
import type { UiFrame } from "../../primitives/layout/frame.ts";
import type { UiAppShell } from "./app-shell.ts";
import type { LocalizedString } from "../../../lib/i18n/paraglide/runtime.js";

const entry = (label: string, icon: IconName, active = false): MenuItem => ({
  label,
  icon: iconSvg(icon, { size: "md" }),
  href: "#",
  active,
});

const nav: MenuItem[] = [
  entry("Home", "home", true),
  entry("Orders", "clipboard"),
  entry("Customers", "users"),
  entry("Reports", "chart"),
];

const aside: MenuItem[] = [entry("Notifications", "bell"), entry("Messages", "chat")];

const copy = {
  heading: "Good morning",
  body: "Twelve orders are waiting to be packed and three shipments are running late.",
  footer: "All systems normal",
  navFooter: "Signed in as a guest",
  asideFooter: "Two unread",
  start: "Today",
  secondary: "Three drafts",
  neutral: "Archived",
};

const svg = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="40"><rect width="64" height="40" fill="${fill}"/></svg>`,
  )}`;

const images = {
  dark: svg("#0b0b0b"),
  dim: svg("#202020"),
  light: svg("#fafafa"),
  broken: "data:image/png;base64,AAAA",
};

type ShellArgs = {
  brand: string;
  brandHref?: string;
  brandIcon?: IconName;
  navOpen: boolean;
  asideOpen: boolean;
  navLabel?: LocalizedString;
  asideLabel?: LocalizedString;
  navExpanded: boolean | null;
  onChange: (detail: { nav: boolean; aside: boolean; expanded?: boolean }) => void;
};

const changed = (args: ShellArgs) => (e: CustomEvent<{ nav: boolean; aside: boolean; expanded?: boolean }>) => {
  if (e.target === e.currentTarget) args.onChange(e.detail);
};

const root = document.documentElement;

const keepRoot = () => {
  const style = root.getAttribute("style");
  const data = { background: root.dataset.background, scheme: root.dataset.scheme, theme: root.dataset.theme };
  return () => {
    if (style == null) root.removeAttribute("style");
    else root.setAttribute("style", style);
    for (const [k, v] of Object.entries(data)) {
      if (v == null) delete root.dataset[k];
      else root.dataset[k] = v;
    }
    window.dispatchEvent(new Event("ui-background"));
  };
};

const textAt = (px: number) => () => {
  root.style.fontSize = `${px}px`;
};

const shellOf = (el: HTMLElement) => el.querySelector<UiAppShell>("ui-app-shell")!;
const frameOf = (el: HTMLElement) => el.querySelector<UiFrame>("ui-frame")!;

const meta = preview.type<{ args: ShellArgs }>().meta({
  title: "Composed/Layout/App shell",
  component: "ui-app-shell",
  args: {
    brand: "Workspace",
    brandHref: "#",
    brandIcon: "cube",
    navOpen: false,
    asideOpen: false,
    navLabel: undefined,
    asideLabel: "Activity" as LocalizedString,
    navExpanded: null,
    onChange: fn(),
  },
  argTypes: {
    brand: { control: "text", description: "The header's brand name." },
    brandHref: { control: "text", description: "Where the brand links to." },
    brandIcon: { control: "select", options: ICON_NAMES, description: "The header's brand icon." },
    navOpen: { control: "boolean", description: "Whether the navigation column is open." },
    asideOpen: { control: "boolean", description: "Whether the side panel is open." },
    navLabel: { control: "text", description: "The navigation column's name." },
    asideLabel: { control: "text", description: "The side panel's name." },
    navExpanded: {
      control: "inline-radio",
      options: [null, true, false],
      description: "The user's choice to keep the navigation open; null follows the screen width.",
    },
    onChange: { table: { category: "events" } },
  },
  parameters: { canvas: "column" },
  beforeEach: () => keepRoot(),
  render: (args) => html`
    <ui-app-shell
      brand=${args.brand}
      brand-href=${ifDefined(args.brandHref)}
      brand-icon=${ifDefined(args.brandIcon)}
      ?nav-open=${args.navOpen}
      ?aside-open=${args.asideOpen}
      nav-label=${ifDefined(args.navLabel)}
      aside-label=${ifDefined(args.asideLabel)}
      .navExpanded=${args.navExpanded}
      @ui-change=${changed(args)}
    >
      <ui-text slot="start" variant="label-lg" data-start>${copy.start}</ui-text>
      <ui-icon-button slot="actions" icon="search" label="Search"></ui-icon-button>
      <ui-appearance slot="actions" kind="language"></ui-appearance>
      <ui-menu slot="nav" layout="nav" width="full" surface="false" .items=${nav}></ui-menu>
      <ui-menu slot="rail" layout="rail" surface="false" .items=${nav}></ui-menu>
      <ui-text slot="nav-footer" variant="body-sm" color="muted">${copy.navFooter}</ui-text>
      <ui-menu slot="aside" layout="nav" width="full" surface="false" .items=${aside}></ui-menu>
      <ui-menu slot="aside-rail" layout="rail" surface="false" .items=${aside}></ui-menu>
      <ui-text slot="aside-footer" variant="body-sm" color="muted">${copy.asideFooter}</ui-text>
      <ui-container width="full" padding-x="slack" padding-y="half">
        <ui-text as="h1" variant="headline-sm">${copy.heading}</ui-text>
        <ui-text variant="body-md" data-body>${copy.body}</ui-text>
      </ui-container>
      <ui-text slot="footer" variant="body-sm" color="muted">${copy.footer}</ui-text>
    </ui-app-shell>
  `,
});

export const Playground = meta.story({
  name: "Playground",
  parameters: {
    docs: { description: { story: "On a wide screen both columns push the window aside when opened." } },
  },
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const shell = shellOf(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
    await expect(canvas.getByRole("complementary", { name: "Activity" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: /Workspace/ })).toHaveAttribute("href", "#");
    await expect(canvas.getByText(copy.body)).toBeVisible();
    await expect(canvas.getByText(copy.footer)).toBeVisible();
    await expect(frameOf(canvasElement).cols).toBe(columnsFor(root.clientWidth));
    await waitFor(() => expect(frameOf(canvasElement).settling).toBe(false));
    await expect(args.onChange).toHaveBeenCalledWith({ nav: false, aside: false, expanded: undefined });

    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: true });
    await expect(shell).toHaveAttribute("nav-open");
    await expect(shell.navExpanded).toBe(true);
    await expect(canvasElement.querySelector("ui-frame-main")).toHaveAttribute("push-start");
    await expect(await canvas.findByText(copy.navFooter)).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Expand activity" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: true, expanded: undefined });
    await expect(shell).toHaveAttribute("aside-open");
    await expect(canvasElement.querySelector("ui-frame-main")).toHaveAttribute("push-end");

    await userEvent.click(canvas.getByRole("button", { name: "Collapse navigation" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: true, expanded: false });
    await expect(shell.navExpanded).toBe(false);
    await userEvent.click(canvas.getByRole("button", { name: "Collapse activity" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: false, expanded: undefined });
    await expect(shell).not.toHaveAttribute("aside-open");

    await userEvent.keyboard("{Escape}");
    await expect(args.onChange).toHaveBeenCalledTimes(5);
  },
});

export const DragHandles = meta.story({
  name: "Drag handles",
  parameters: { docs: { description: { story: "The window's edge handles open and close the columns by keyboard." } } },
  play: async ({ canvas, userEvent, args }) => {
    const start = canvas.getByRole("separator", { name: "Resize to open navigation" });
    start.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: true });
    const end = canvas.getByRole("separator", { name: "Resize to open activity" });
    end.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: true, expanded: undefined });
    canvas.getByRole("separator", { name: "Resize to close activity" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: undefined });
  },
});

export const ExpandedByDefault = meta.story({
  name: "Expanded on a wide screen",
  parameters: {
    docs: { description: { story: "With room for a full page beside it, the navigation opens by itself." } },
  },
  beforeEach: textAt(14),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const shell = shellOf(canvasElement);
    await expect(frameOf(canvasElement).cols).toBeGreaterThanOrEqual(24);
    await expect(shell.navOpen).toBe(true);
    await expect(args.onChange).toHaveBeenCalledWith({ nav: true, aside: false, expanded: undefined });
    await userEvent.click(canvas.getByRole("button", { name: "Expand activity" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: true, expanded: undefined });
    await userEvent.click(canvas.getByRole("button", { name: "Collapse activity" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: undefined });
    await expect(shell.navOpen).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Collapse navigation" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: false, expanded: false });
    await expect(shell.navExpanded).toBe(false);
    shell.navExpanded = true;
    await waitFor(() => expect(shell.navOpen).toBe(true));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: undefined });
  },
});

export const Sheets = meta.story({
  name: "Sheets with large text",
  parameters: {
    docs: { description: { story: "When a column would squeeze the window, it opens as a sheet over it instead." } },
  },
  beforeEach: textAt(32),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const shell = shellOf(canvasElement);
    const header = canvasElement.querySelector("ui-frame-header")!;
    const start = () => canvasElement.querySelector('ui-frame-column[side="start"]')!;
    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: undefined });
    await expect(start()).toHaveProperty("sheet", true);
    await expect(header).toHaveProperty("liftStart", true);
    await expect(canvasElement.querySelector("ui-frame-main")).not.toHaveAttribute("push-start");
    await userEvent.keyboard("{Shift}");
    await expect(shell.navOpen).toBe(true);
    await userEvent.keyboard("{Escape}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: false, expanded: undefined });
    await expect(header).toHaveProperty("liftStart", false);

    await userEvent.click(canvas.getByRole("button", { name: "Expand activity" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: true, expanded: undefined });
    await expect(header).toHaveProperty("liftEnd", true);
    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: true, expanded: undefined });
    await userEvent.keyboard("{Escape}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: true, expanded: undefined });
    await userEvent.keyboard("{Escape}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: false, expanded: undefined });

    await userEvent.click(canvas.getByRole("button", { name: "Expand navigation" }));
    await userEvent.click(canvas.getByRole("button", { name: "Expand activity" }));
    await expect(shell.navOpen && shell.asideOpen).toBe(true);
    window.dispatchEvent(new PopStateEvent("popstate"));
    await waitFor(() => expect(shell.navOpen || shell.asideOpen).toBe(false));
    window.dispatchEvent(new PopStateEvent("popstate"));
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: false, expanded: undefined });
  },
});

export const Compact = meta.story({
  name: "Compact",
  parameters: {
    docs: {
      description: {
        story: "On a narrow screen the side panel's icons share the navigation rail, and both columns open as sheets.",
      },
    },
  },
  beforeEach: textAt(48),
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const shell = shellOf(canvasElement);
    await expect(frameOf(canvasElement).compact).toBe(true);
    const swap = canvas.getByRole("button", { name: "Show activity icons" });
    await userEvent.click(swap);
    await expect(await canvas.findByRole("button", { name: "Show navigation icons" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Show navigation icons" }));
    await expect(await canvas.findByRole("button", { name: "Show activity icons" })).toBeVisible();
    void shell.toggleAside();
    await waitFor(() => expect(shell.asideOpen).toBe(true));
    await expect(canvasElement.querySelector("ui-frame-header")).toHaveProperty("liftStart", true);
    await expect(canvasElement.querySelector("ui-frame-main")).not.toHaveAttribute("push-end");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(shell.asideOpen).toBe(false));
    await shell.toggleNav();
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: undefined });
    await shell.toggleNav();
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: false, aside: false, expanded: undefined });
  },
});

export const Resize = meta.story({
  name: "Refit as the text grows",
  parameters: {
    docs: {
      description: { story: "On a refit the shell closes what no longer fits and turns compact as the text grows." },
    },
  },
  args: { navOpen: true, asideOpen: true, navExpanded: true },
  play: async ({ canvasElement, args }) => {
    const shell = shellOf(canvasElement);
    const end = canvasElement.querySelector('ui-frame-column[side="end"]')!;
    await expect(shell.navOpen && shell.asideOpen).toBe(true);
    root.style.fontSize = "28px";
    shell.navExpanded = null;
    await waitFor(() => expect(shell.asideOpen).toBe(false));
    await expect(shell.navOpen).toBe(true);
    await expect(args.onChange).toHaveBeenLastCalledWith({ nav: true, aside: false, expanded: undefined });
    await shell.toggleAside(true);
    await expect(shell.asideOpen).toBe(true);
    await expect(shell.navOpen).toBe(false);
    await expect(end).toHaveProperty("sheet", false);
    root.style.fontSize = "48px";
    shell.navExpanded = true;
    await waitFor(() => expect(frameOf(canvasElement).compact).toBe(true));
    await expect(end).toHaveProperty("sheet", true);
    await expect(end).toHaveProperty("merged", true);
    shell.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await waitFor(() => expect(shell.asideOpen).toBe(false));
    root.style.fontSize = "";
    shell.navExpanded = false;
    await waitFor(() => expect(frameOf(canvasElement).compact).toBe(false));
    await expect(shell.navOpen).toBe(false);
    shell.navExpanded = true;
    await waitFor(() => expect(shell.navOpen).toBe(true));
  },
});

export const PageTransition = meta.story({
  name: "Page transition",
  play: async ({ canvasElement }) => {
    const shell = shellOf(canvasElement);
    const page = canvasElement.querySelector<HTMLElement>("ui-frame-main main > div")!;
    shell.pageTransition("forward");
    await expect(page.getAnimations().length).toBeGreaterThan(0);
    const detached = document.createElement("ui-app-shell");
    await expect(() => detached.pageTransition("backward")).not.toThrow();
  },
});

const darkMedia = { list: undefined as (EventTarget & { matches: boolean }) | undefined };

const withBackground = (src: string | null) => () => {
  const real = window.matchMedia;
  const dark = Object.assign(new EventTarget(), {
    matches: false,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
  });
  darkMedia.list = dark;
  window.matchMedia = ((q: string) =>
    q === "(prefers-color-scheme: dark)" ? dark : real.call(window, q)) as typeof window.matchMedia;
  applyBackground(src);
  return () => {
    window.matchMedia = real;
    darkMedia.list = undefined;
  };
};

const scrimOf = (el: HTMLElement) => frameOf(el).scrim;

export const OverAnImage = meta.story({
  name: "Over a background image",
  globals: { theme: "light" },
  parameters: {
    docs: { description: { story: "Over a dark photo the shell lays the least scrim that keeps its text legible." } },
  },
  beforeEach: withBackground(images.dark),
  play: async ({ canvasElement }) => {
    const shell = shellOf(canvasElement);
    await waitFor(() => expect(scrimOf(canvasElement)).toMatch(/^color-mix\(in oklab, var\(--color-base-200\)/));
    await expect(frameOf(canvasElement).windowScrim).toMatch(/^color-mix/);
    const header = canvasElement.querySelector("header")!.getBoundingClientRect();
    const plain = shell.backdropAt(header)!;
    await expect(plain).toHaveLength(64);
    const frosted = shell.backdropAt(header, 8)!;
    await expect(frosted).toHaveLength(64);
    const body = canvasElement.querySelector("[data-body]")!.getBoundingClientRect();
    await expect(shell.backdropAt(body)).toHaveLength(64);

    const start = canvasElement.querySelector<HTMLElement>("[data-start]")!;
    const spin = start.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 600_000 });
    const header0 = canvasElement.querySelector<HTMLElement>("[data-frame-region]")!;
    const looked = spyOn(header0, "getAnimations");
    try {
      start.append(" ");
      await waitFor(() => expect(looked).toHaveBeenCalled());
      const before = looked.mock.calls.length;
      spin.finish();
      await waitFor(() => expect(looked.mock.calls.length).toBeGreaterThan(before));
    } finally {
      looked.mockRestore();
      spin.cancel();
    }

    darkMedia.list!.dispatchEvent(new Event("change"));
    root.dataset.theme = "light";
    canvasElement.querySelector("ui-appearance")!.dispatchEvent(new CustomEvent("ui-change", { bubbles: true }));

    const scrim = scrimOf(canvasElement);
    window.dispatchEvent(new Event("ui-background"));
    await waitFor(() => expect(scrimOf(canvasElement)).toBe(scrim));

    applyBackground(images.broken);
    await expect(scrimOf(canvasElement)).toBe(scrim);

    applyBackground(images.light);
    await waitFor(() => expect(scrimOf(canvasElement)).toBe(""));

    start.append(" ");
    await Promise.resolve();
    applyBackground(null);
    await waitFor(() => expect(frameOf(canvasElement).windowScrim).toBe(""));
    await expect(shell.backdropAt(header)).toBeNull();

    root.style.setProperty("--app-background", "linear-gradient(black, white)");
    window.dispatchEvent(new Event("ui-background"));
    await expect(shell.backdropAt(header)).toBeNull();
  },
});

const alphaOf = (scrim: string) => parseFloat(/([\d.]+)%/.exec(scrim)?.[1] ?? "0");

export const OverADimImage = meta.story({
  name: "Over a dim image",
  globals: { theme: "light" },
  parameters: {
    docs: {
      description: { story: "Over a dim photo a lighter scrim than the maximum already keeps the text legible." },
    },
  },
  beforeEach: withBackground(images.dim),
  play: async ({ canvasElement }) => {
    const shell = shellOf(canvasElement);
    const header = canvasElement.querySelector("header")!.getBoundingClientRect();
    await waitFor(() => expect(shell.backdropAt(header)).not.toBeNull());
    const shellAlpha = alphaOf(scrimOf(canvasElement));
    const windowAlpha = alphaOf(frameOf(canvasElement).windowScrim);
    await expect(shellAlpha).toBeGreaterThan(5);
    await expect(shellAlpha).toBeLessThan(94);
    await expect(windowAlpha).toBeGreaterThan(5);
    await expect(windowAlpha).toBeLessThan(94);
  },
});

export const ColouredTextOverABrightImage = meta.story({
  name: "Coloured text over a bright image",
  globals: { theme: "dark" },
  parameters: {
    docs: {
      description: {
        story:
          "Text no scrim can rescue is left out of the search; text that only the full scrim rescues gets the most the shell offers.",
      },
    },
  },
  beforeEach: withBackground(images.light),
  render: (args) => html`
    <ui-app-shell brand=${args.brand} aside-label=${ifDefined(args.asideLabel)} @ui-change=${changed(args)}>
      <ui-text slot="start" variant="label-lg" color="secondary">${copy.secondary}</ui-text>
      <ui-text slot="start" variant="label-lg" color="neutral">${copy.neutral}</ui-text>
      <ui-menu slot="nav" layout="nav" width="full" surface="false" .items=${nav}></ui-menu>
      <ui-menu slot="rail" layout="rail" surface="false" .items=${nav}></ui-menu>
      <ui-container width="full" padding-x="slack" padding-y="half">
        <ui-text as="h1" variant="headline-sm">${copy.heading}</ui-text>
      </ui-container>
    </ui-app-shell>
  `,
  play: async ({ canvasElement }) => {
    const shell = shellOf(canvasElement);
    const header = canvasElement.querySelector("header")!.getBoundingClientRect();
    await waitFor(() => expect(shell.backdropAt(header)).not.toBeNull());
    const before = alphaOf(scrimOf(canvasElement));
    await expect(before).toBeGreaterThan(5);
    await expect(before).toBeLessThan(94);
    root.dataset.scheme = "t3-chat";
    await waitFor(() => expect(alphaOf(scrimOf(canvasElement))).toBe(94));
  },
});

export const WithoutAnchors = meta.story({
  name: "Without anchor positioning",
  globals: { theme: "light" },
  parameters: {
    docs: { description: { story: "Where anchor positioning is missing the window keeps no scrim of its own." } },
  },
  beforeEach: () => {
    const supports = CSS.supports;
    CSS.supports = ((...a: [string, string?]) =>
      a[0] === "anchor-name: --a" ? false : supports.apply(CSS, a as [string])) as typeof CSS.supports;
    const restore = withBackground(images.dark)();
    return () => {
      CSS.supports = supports;
      restore();
    };
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(scrimOf(canvasElement)).toMatch(/^color-mix/));
    await expect(frameOf(canvasElement).windowScrim).toBe("");
    const shell = shellOf(canvasElement);
    const body = canvasElement.querySelector("[data-body]")!.getBoundingClientRect();
    await expect(shell.backdropAt(body)).toHaveLength(64);
  },
});

export const LiveBackground = meta.story({
  name: "Live background",
  beforeEach: () => applyBackground(null, "live-waves"),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector("[data-frame-live] ui-waves")).toBeInTheDocument());
    applyBackground(null);
    await waitFor(() => expect(canvasElement.querySelector("[data-frame-live]")).toBeNull());
  },
});

export const UnreadableTextScale = meta.story({
  name: "Unreadable text scale",
  parameters: {
    docs: { description: { story: "A root font size of zero falls back to the base tile size." } },
  },
  beforeEach: textAt(0),
  play: async ({ canvasElement }) => {
    try {
      await expect(frameOf(canvasElement).cols).toBe(columnsFor(root.clientWidth, 1));
    } finally {
      root.style.fontSize = "";
    }
  },
});
