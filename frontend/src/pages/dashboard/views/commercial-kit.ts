import { html, nothing } from "lit";
import type { Flag, Tone } from "../../../cms/endpoints/commercial.ts";
import "../../../components/index.ts";

/**
 * Small shared pieces of the commercial views (compare, pricing, quotation, approvals):
 * number formats and the flag / check rows. Templates use `ui-*` elements only.
 */

export const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
export const amount = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const money = (n: number, currency: string, d = 2) =>
  currency === "EGP" ? egp(n) : `${currency} ${amount(n, d)}`;
export const pct = (n: number) => `${n.toFixed(1)}%`;
export const day = (iso: string, time = false) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
        timeZone: "UTC",
      })
    : "—";

export type StatusColor = "error" | "warning" | "info" | "success" | "neutral";
export const TONE: Record<Tone, StatusColor> = {
  error: "error",
  warning: "warning",
  info: "info",
  success: "success",
  neutral: "neutral",
};

/** A check / deviation line: a coloured dot and the text (wraps, never overflows). */
export const flagRow = (f: Flag) =>
  html`<ui-flex gap="2" align="baseline">
    <ui-status size="xs" .color=${TONE[f.tone]} .label=${f.tone}></ui-status>
    <ui-text size="xs" .color=${f.tone === "error" ? "error" : undefined}>${f.text}</ui-text>
  </ui-flex>`;

export const flagList = (flags: Flag[], empty = "No issues") =>
  html`<ui-flex direction="col" gap="1">
    ${flags.length ? flags.map(flagRow) : html`<ui-text size="xs" color="success">${empty}</ui-text>`}
  </ui-flex>`;

/** The card Sales sees instead of costs and margins. */
export const hiddenForRole = (body: string, link?: { label: string; href: string }) =>
  html`<ui-card variant="border" shadow="false" heading="Costs and margins are hidden for your role">
    <ui-text color="muted">${body}</ui-text>
    ${link ? html`<ui-button slot="actions" size="sm" variant="soft" .href=${link.href}>${link.label}</ui-button>` : nothing}
  </ui-card>`;

export const loadingBlock = (label = "Loading…") =>
  html`<ui-flex justify="center" align="center" gap="3" padding="8">
    <ui-loading size="md" color="primary"></ui-loading><ui-text color="muted">${label}</ui-text>
  </ui-flex>`;

/** The "AI draft" marker on anything an AI step produced. */
export const aiBadge = (label = "AI draft") =>
  html`<ui-badge size="sm" variant="soft" color="secondary">✦ ${label}</ui-badge>`;
