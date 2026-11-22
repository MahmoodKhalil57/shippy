/**
 * Shared set-up for the audits (./settle.ts, ./motion.ts, ./trace.ts): a headless Chrome on the app,
 * signed in, and the screens to visit. Nothing here knows a project: the screens come from the
 * app's own navigation, the person from the environment.
 *
 * Environment:
 *   AUDIT_URL       the app (default http://localhost:5173; a built site: http://localhost:4174/<base>)
 *   AUDIT_EMAIL     who signs in (required)
 *   AUDIT_PASSWORD  their password (required)
 *   AUDIT_LOGIN     the login endpoint under the app (default /api/users/login)
 *   AUDIT_CHROME    Chrome's executable (default: the usual Windows, macOS or Linux location)
 *   AUDIT_SIZE      window size (default 1280x800)
 *   AUDIT_SCREENS   comma-separated paths to visit instead of the navigation's
 */
import { existsSync } from "node:fs";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

export const env = {
  url: (process.env.AUDIT_URL ?? "http://localhost:5173").replace(/\/$/, ""),
  email: process.env.AUDIT_EMAIL ?? "",
  password: process.env.AUDIT_PASSWORD ?? "",
  login: process.env.AUDIT_LOGIN ?? "/api/users/login",
  chrome: process.env.AUDIT_CHROME ?? CHROMES.find((p) => existsSync(p)) ?? "",
  size: (process.env.AUDIT_SIZE ?? "1280x800").split("x").map(Number) as [number, number],
  screens: process.env.AUDIT_SCREENS?.split(",").filter(Boolean),
};

/** The app's base path (a built site lives under one, e.g. /shippy). */
export const base = new URL(env.url).pathname.replace(/\/$/, "");

/** Whether nothing on the screen is loading (no tile, header or skeleton waiting). */
const SETTLED = () =>
  !!document.querySelector("ui-frame-main main") &&
  !document.querySelector("ui-frame-main ui-tile[loading], ui-frame-main ui-page-header[loading]");

export async function open(): Promise<{ browser: Browser; page: Page }> {
  if (!env.email || !env.password) throw new Error("Set AUDIT_EMAIL and AUDIT_PASSWORD (a seeded user).");
  if (!env.chrome) throw new Error("Chrome not found: set AUDIT_CHROME.");
  const [width, height] = env.size;
  const browser = await puppeteer.launch({
    executablePath: env.chrome,
    headless: true,
    args: [`--window-size=${width},${height}`],
    defaultViewport: { width, height },
  });
  const page = await browser.newPage();
  await page.goto(`${env.url}/login`, { waitUntil: "load" });
  // The backend may be a service worker: wait until it controls the page.
  // (An app on a real backend has no worker: the wait just runs out.)
  await page
    .waitForFunction(() => !("serviceWorker" in navigator) || !!navigator.serviceWorker.controller, { timeout: 15000 })
    .catch(() => {});
  const status = await page.evaluate(
    async (url: string, email: string, password: string) =>
      (
        await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
      ).status,
    `${base}${env.login}`,
    env.email,
    env.password,
  );
  if (status !== 200) throw new Error(`Sign-in failed (${status}).`);
  await page.goto(`${env.url}/`, { waitUntil: "load" });
  await settled(page);
  return { browser, page };
}

/** Waits until the screen has nothing loading for `quietMs` (at most `timeout`). */
export async function settled(page: Page, quietMs = 800, timeout = 15000) {
  const start = Date.now();
  let quietSince = 0;
  while (Date.now() - start < timeout) {
    const done = await page.evaluate(SETTLED).catch(() => false);
    if (!done) quietSince = 0;
    else if (!quietSince) quietSince = Date.now();
    else if (Date.now() - quietSince >= quietMs) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return false;
}

/** Changes page inside the app (as a link would), from a path under the app. */
export function go(page: Page, path: string) {
  return page.evaluate((to: string) => {
    history.pushState({}, "", to);
    dispatchEvent(new PopStateEvent("popstate"));
  }, `${base}${path}`);
}

/** The screens to visit: AUDIT_SCREENS, else every page the navigation links to (once). */
export async function screens(page: Page): Promise<string[]> {
  if (env.screens) return env.screens;
  const paths = await page.evaluate(
    (prefix: string) =>
      [...document.querySelectorAll<HTMLAnchorElement>("ui-frame-column a[href]")]
        .map((a) => new URL(a.href).pathname)
        .filter((p) => p.startsWith(prefix || "/"))
        .map((p) => p.slice(prefix.length) || "/"),
    base,
  );
  return [...new Set(["/", ...paths])];
}

/** A file name for a screen's path. */
export const slug = (path: string) => path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home";
