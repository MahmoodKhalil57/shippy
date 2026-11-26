import { defineMain } from "@storybook/web-components-vite/node";
import { mergeConfig } from "vite-plus";
import { designSystem } from "../vite/index.ts";

export default defineMain({
  stories: ["../src/**/*.stories.ts"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/web-components-vite",
  core: { disableTelemetry: true },
  viteFinal: (config) => mergeConfig(config, { plugins: designSystem() }),
});
