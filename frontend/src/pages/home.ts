import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import type { BadgeVariants } from "../components/primitives/data/badge.ts";
import type { TableColumn } from "../components/primitives/data/table.ts";
import "../components/index.ts";
import { BRIEFING, CASES, FOLLOW_UPS, ME, NOW, USERS, WAITS, type Case, type Tone } from "./home-data.ts";

/**
 * Home page: "My day" on the Golden Sea sourcing desk. The signed-in person's
 * waiting states, case queue, briefing and follow-ups.
 *
 * Composed entirely from `ui-*` primitives: no classes, no inline styles, only
 * design-token values (enforced by tests/architecture.test.ts).
 */

const TONE_COLOR: Record<Tone, BadgeVariants["color"]> = {
  danger: "error",
  warn: "warning",
  info: "info",
  ok: "success",
  neutral: undefined,
};
const TONE_ICON = { danger: "error", warn: "warning", info: "info", ok: "success", neutral: "info" } as const;
const TONE_RANK: Record<Tone, number> = { danger: 0, warn: 1, info: 2, ok: 3, neutral: 4 };

const usd = (n: number) => `USD ${n.toLocaleString("en-US")}`;
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
const time = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

/** "in 5 h", "in 2 d", "3 d overdue". */
function until(iso: string) {
  const hours = (new Date(iso).getTime() - NOW.getTime()) / 36e5;
  if (hours < 0) return { text: `${Math.ceil(-hours / 24)} d overdue`, late: true };
  return { text: hours < 24 ? `in ${Math.round(hours)} h` : `in ${Math.round(hours / 24)} d`, late: false };
}

const queueColumns: TableColumn<Case & Record<string, unknown>>[] = [
  {
    key: "id",
    label: "Case",
    header: true,
    render: (c) =>
      html`<ui-flex direction="col" gap="1">
        <ui-text weight="semibold" mono>${c.id}</ui-text>
        ${c.urgent ? html`<ui-badge color="error" size="xs">Urgent</ui-badge>` : ""}
      </ui-flex>`,
  },
  {
    key: "customer",
    label: "Customer · vessel",
    render: (c) =>
      html`<ui-flex direction="col">
        <ui-text>${c.customer}</ui-text>
        <ui-text size="xs" color="muted">${c.vessel} · ${c.port} · ETA ${day(c.eta)}</ui-text>
      </ui-flex>`,
  },
  {
    key: "stage",
    label: "Stage",
    render: (c) =>
      html`<ui-flex direction="col" gap="1">
        <ui-badge .color=${TONE_COLOR[c.tone]} variant="soft" size="sm">${c.stage}</ui-badge>
        <ui-text size="xs" color="muted">${c.wait}</ui-text>
      </ui-flex>`,
  },
  {
    key: "lines",
    label: "Lines ready",
    render: (c) => {
      const total = c.lines.reduce((a, b) => a + b, 0);
      return html`<ui-flex direction="col" gap="1">
        <ui-progress .value=${c.lines[0]} .max=${total} color="success" width="xs" label="Lines ready"></ui-progress>
        <ui-text size="xs" color="muted">${c.lines[0]}/${total}</ui-text>
      </ui-flex>`;
    },
  },
  {
    key: "deadline",
    label: "Deadline",
    render: (c) => {
      const left = until(c.deadline);
      return html`<ui-flex direction="col">
        <ui-text>${day(c.deadline)} ${time(c.deadline)}</ui-text>
        <ui-text size="xs" .color=${left.late ? "error" : "muted"}>${left.text}</ui-text>
      </ui-flex>`;
    },
  },
  {
    key: "next",
    label: "Next action · blocker",
    render: (c) =>
      html`<ui-flex direction="col">
        <ui-text>${c.next}</ui-text>
        ${c.blocker ? html`<ui-text size="xs" .color=${c.tone === "danger" ? "error" : "muted"}>${c.blocker}</ui-text>` : ""}
      </ui-flex>`,
  },
  { key: "value", label: "Value", render: (c) => html`<ui-text mono>${usd(c.value)}</ui-text>` },
];

@customElement("home-page")
export class HomePage extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  render() {
    const me = USERS[ME];
    const live = CASES.filter((c) => c.stage !== "Lost" && c.stage !== "Expired");
    const mine = live
      .filter((c) => c.owner === ME)
      .sort((a, b) => TONE_RANK[a.tone] - TONE_RANK[b.tone] || a.deadline.localeCompare(b.deadline));
    const today = NOW.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    return html`
      <ui-navbar brand="Golden Sea" brand-href="#/" center-from="md">
        <ui-flex slot="center" gap="1">
          <ui-button href="#/" variant="ghost" size="sm" active>My day</ui-button>
          <ui-button href="#/inbox" variant="ghost" size="sm">Inbox</ui-button>
          <ui-button href="#/cases" variant="ghost" size="sm">Cases</ui-button>
          <ui-button href="#/suppliers" variant="ghost" size="sm">Suppliers</ui-button>
        </ui-flex>
        <ui-flex slot="end" align="center" gap="3">
          <ui-theme-controller as="swap" theme="dark" persist></ui-theme-controller>
          <ui-avatar .initials=${me.initials} size="sm"></ui-avatar>
        </ui-flex>
      </ui-navbar>

      <ui-container as="main" width="7xl" padding-x="4" padding-y="8 md:12">
        <ui-flex direction="col" gap="8">
          <ui-flex as="header" direction="col md:row" justify="between" align="start md:end" gap="4">
            <ui-flex direction="col" gap="2">
              <ui-text size="sm" color="muted" uppercase>My day · ${today}</ui-text>
              <ui-heading level="1" size="3xl md:4xl">Good morning, ${me.name.split(" ")[0]}</ui-heading>
              <ui-text color="muted">
                Your prioritised queue. The drafts are prepared — you check, decide and send.
              </ui-text>
            </ui-flex>
            <ui-flex gap="2" wrap>
              <ui-button href="#/inbox">Review inbox</ui-button>
              <ui-button href="#/case/GS-RFQ-0142" color="primary">Continue GS-RFQ-0142</ui-button>
            </ui-flex>
          </ui-flex>

          <ui-stat
            direction="vertical lg:horizontal"
            surface
            .items=${WAITS.map((w) => ({
              heading: w.wait,
              value: String(live.filter((c) => c.wait === w.wait).length),
              desc: w.note,
            }))}
          ></ui-stat>

          <ui-card heading="My queue" variant="border">
            <ui-text size="sm" color="muted"
              >Sorted by risk, then deadline. Every live case has an owner, a deadline and a next action.</ui-text
            >
            <ui-table size="sm" nowrap="max-lg" .columns=${queueColumns} .rows=${mine}></ui-table>
          </ui-card>

          <ui-grid cols="1 lg:3" gap="6">
            <ui-list
              heading="Daily briefing"
              .items=${BRIEFING.map((b) => ({
                heading: html`<ui-flex align="center" gap="2">
                  <ui-icon .name=${TONE_ICON[b.tone]} .color=${TONE_COLOR[b.tone]} size="sm"></ui-icon>
                  <ui-text weight="medium">${b.title}</ui-text>
                </ui-flex>`,
                description: html`<ui-text size="sm" color="muted">${b.detail}</ui-text>`,
              }))}
            ></ui-list>

            <ui-list
              heading="Today's follow-ups"
              .items=${FOLLOW_UPS.map((f) => ({
                heading: html`<ui-flex align="center" gap="2" wrap>
                  <ui-badge .color=${f.overdue ? "error" : "info"} variant="soft" size="sm">${f.channel}</ui-badge>
                  <ui-text weight="medium">${f.who}</ui-text>
                  <ui-text size="sm" .color=${f.overdue ? "error" : "muted"}>${f.when}</ui-text>
                </ui-flex>`,
                description: html`<ui-text size="sm" color="muted">${f.goal}</ui-text>`,
              }))}
            ></ui-list>

            <ui-card heading="Start here for the demo" variant="border">
              <ui-flex direction="col" gap="3">
                <ui-text size="sm">
                  One case — <strong>GS-RFQ-0142, MV Aurora Crest</strong> — is modelled end to end, from sourcing to
                  customer PO, delivery and settlement.
                </ui-text>
                <ui-text size="sm"> Karim Balbaa approves; Soaad Amer (Sales) can't see costs or margins. </ui-text>
                <ui-text size="sm"
                  >Press <ui-kbd size="sm">Ctrl</ui-kbd> <ui-kbd size="sm">K</ui-kbd> to search cases, IMO numbers,
                  parts and suppliers.</ui-text
                >
              </ui-flex>
            </ui-card>
          </ui-grid>
        </ui-flex>
      </ui-container>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "home-page": HomePage;
  }
}
