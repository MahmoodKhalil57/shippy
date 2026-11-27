/// <reference types="vite/client" />
import "saastemlycrm-design-system/styles.css";
import { type Decorator, definePreview } from "@storybook/web-components-vite";
import { html } from "lit";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import { configure, sb } from "storybook/test";
import { place } from "./address.ts";

configure({ asyncUtilTimeout: 5000 });

sb.mock(import("../src/lib/agent/built-in-ai.ts"), { spy: true });
sb.mock(import("../src/lib/agent/ai-polyfill.ts"), { spy: true });

const withPage: Decorator = (story, { globals }) => {
  const root = document.documentElement;
  if (globals.theme === "light" || globals.theme === "dark") root.dataset.theme = globals.theme;
  else delete root.dataset.theme;
  root.dir = globals.dir === "rtl" ? "rtl" : "ltr";
  root.lang = globals.dir === "rtl" ? "ar" : "en";
  return story();
};

const withCanvas: Decorator = (story, { parameters }) =>
  html`<div class=${parameters.canvas === "column" ? "sb-canvas sb-canvas-column" : "sb-canvas"}>${story()}</div>`;

export default definePreview({
  tags: ["autodocs"],
  beforeEach: () => {
    place.reset("/");
    if (!("__vitest_browser__" in globalThis)) return;
    localStorage.clear();
    sessionStorage.clear();
  },
  decorators: [withCanvas, withPage],
  argTypes: { _slotParts: { table: { disable: true } } },
  parameters: {
    layout: "padded",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i }, exclude: /^_/ },
    a11y: { test: "error" },
  },
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "system", title: "System" },
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    dir: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "Left to right" },
          { value: "rtl", title: "Right to left" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "system", dir: "ltr" },
  addons: [addonA11y(), addonDocs()],
});
