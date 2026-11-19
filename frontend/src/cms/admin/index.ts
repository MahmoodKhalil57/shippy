import type { DashboardSettings } from "../types.ts";
import { assistant } from "./assistant.ts";
import { TOURS } from "./tours.ts";
import { widgets } from "./widgets.ts";

/**
 * Golden Sea's dashboard settings (`admin.custom` in ../config.ts): everything the app shows that
 * belongs to this business. A new project replaces this folder.
 */
export const dashboard: DashboardSettings = {
  branding: {
    name: "Golden Sea",
    icon: "anchor",
    poweredBy: "SaastemlyCRM",
    // Golden Sea's own photos first, then the Pexels set (public/; each has a `-thumb.jpg`).
    backgrounds: [
      { path: "goldensea/Slider1", label: "Container port at dusk" },
      { path: "goldensea/Slider7", label: "Ships in harbour" },
      { path: "goldensea/Slider8", label: "Bollard at sunset" },
      { path: "goldensea/Slider6", label: "Mooring line" },
      { path: "backgrounds/waves", label: "Ocean waves" },
      { path: "backgrounds/night-ship", label: "Ship at night" },
      { path: "backgrounds/seaport", label: "Seaport at sunset" },
      { path: "backgrounds/lighthouse", label: "Lighthouse storm" },
      { path: "backgrounds/fluid", label: "Fluid" },
    ],
    backgroundCredit: "Photos: Golden Sea, Pexels",
    loginIntro: "Golden Sea dashboard. A demo user is filled in; switch roles any time from the dashboard.",
  },
  // The order work flows in: from the first email to the last payment, then insight and setup.
  nav: {
    groups: [
      { label: "Sourcing desk", icon: "inbox" },
      { label: "Commercial", icon: "briefcase" },
      { label: "Fulfilment", icon: "truck" },
      { label: "Finance", icon: "banknotes" },
      { label: "Insights", icon: "chart" },
      { label: "Growth", icon: "trending-up" },
      { label: "Work", icon: "clipboard" },
      { label: "Directory", icon: "users" },
      { label: "Catalogue", icon: "cube" },
      { label: "Team", icon: "user" },
      { label: "Configuration", icon: "settings" },
    ],
  },
  notificationTones: { Approval: "warning", Alert: "error", Payment: "success", Reply: "info", Reminder: "info" },
  widgets,
  tours: TOURS,
  assistant,
};
