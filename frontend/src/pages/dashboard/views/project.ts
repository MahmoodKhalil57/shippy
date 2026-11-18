import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { AcceptanceTest, ProjectView } from "../../../cms/endpoints/platform.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { formatDate } from "../shared.ts";
import type { ViewProps } from "../views.ts";

/**
 * The delivery plan (root view /project), for Golden Sea: phases and work packages, each with
 * the demo screen that shows it; the nine problems and the brief line by line; the acceptance
 * tests from their brief, checked live against the demo data; the trust principles, the monthly
 * plan's scope and the payment rule. Client-facing: no prices, rates, effort or costs (the
 * endpoint holds none; tests/platform.test.ts guards it). Data: GET /api/project.
 */

const PHASE_COLOR = { 0: "neutral", 1: "primary", 2: "secondary", 3: "accent" } as const;
type PhaseKey = keyof typeof PHASE_COLOR;
const WEEKS = Array.from({ length: 13 }, (_, i) => i + 1);

@customElement("gs-project")
export class GsProject extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: ViewProps["access"];
  @property({ attribute: false }) user!: ViewProps["user"];

  @state() private data: ProjectView | null = null;
  @state() private error = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<ProjectView>("/project");
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private _see(href: string, label = "See it in the demo") {
    return href
      ? html`<ui-button size="xs" variant="soft" color="primary" .href=${href}>${label}</ui-button>`
      : nothing;
  }

  private _milestones(d: ProjectView) {
    return html`<ui-card variant="border" shadow="false" heading="Value from week 7. Everything by week 13.">
      <ui-steps scrollable .current=${-1} .items=${d.milestones.map((m) => ({ label: m.week }))}></ui-steps>
      <ui-grid fit="xs" gap="4">
        ${d.milestones.map(
          (m) =>
            html`<ui-flex direction="col" gap="1">
              <ui-text size="xs" color="muted" uppercase weight="medium">${m.week}</ui-text>
              <ui-text weight="semibold">${m.title}</ui-text>
              <ui-text size="sm" color="muted">${m.text}</ui-text>
            </ui-flex>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _gantt(d: ProjectView) {
    type Row = ProjectView["phases"][number] & Record<string, unknown>;
    const columns: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Phase",
        render: (p) =>
          html`<ui-flex direction="col" gap="0"
            ><ui-text size="sm" weight="semibold">${p.name}</ui-text
            ><ui-text size="xs" color="muted">${p.weeks}</ui-text></ui-flex
          >`,
      },
      ...WEEKS.map((w): TableColumn<Row> => ({
        key: `w${w}`,
        label: `W${w}`,
        render: (p) =>
          w >= p.from && w <= p.to
            ? html`<ui-badge size="sm" .color=${PHASE_COLOR[Number(p.key) as PhaseKey]} .label=${`${p.name}, week ${w}`}
                >${w === p.from ? p.key : ""}</ui-badge
              >`
            : nothing,
      })),
    ];
    return html`<ui-card variant="border" shadow="false" heading="Roadmap — 13 weeks, phased">
      <ui-table size="xs" nowrap .columns=${columns} .rows=${d.phases as Row[]}></ui-table>
      <ui-text size="xs" color="muted"
        >Each phase is approved on its own; a weekly 45-minute review keeps progress, baseline numbers and decisions in
        one place.</ui-text
      >
    </ui-card>`;
  }

  private _phase(p: ProjectView["phases"][number]) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>${p.name}</span>
        <ui-badge size="sm" variant="soft" .color=${PHASE_COLOR[Number(p.key) as PhaseKey]}>${p.weeks}</ui-badge>
      </ui-flex>
      <ui-text size="sm" color="muted">${p.goal}</ui-text>
      <ui-flex direction="col" gap="3">
        ${p.packages.map(
          (w) =>
            html`<ui-flex gap="3" align="center" justify="between" wrap>
              <ui-flex direction="col" gap="0" shrink grow>
                <ui-text size="sm" weight="semibold">${w.name}</ui-text>
                <ui-text size="xs" color="muted">${w.detail}</ui-text>
              </ui-flex>
              ${this._see(w.href)}
            </ui-flex>`,
        )}
      </ui-flex>
    </ui-card>`;
  }

  private _platform(d: ProjectView) {
    return html`<ui-card variant="border" shadow="false" heading="Running through every phase">
      <ui-grid fit="sm" gap="4">
        ${d.platform.map(
          (w) =>
            html`<ui-flex direction="col" gap="1" align="start">
              <ui-text size="sm" weight="semibold">${w.name}</ui-text>
              <ui-text size="xs" color="muted">${w.detail}</ui-text>
              ${this._see(w.href)}
            </ui-flex>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _problems(d: ProjectView) {
    return html`<ui-card variant="border" shadow="false" heading="Nine problems you named. Nine answers.">
      <ui-grid fit="sm" gap="4">
        ${d.problems.map(
          ([problem, answer, href], i) =>
            html`<ui-card variant="dash" size="sm" shadow="false">
              <ui-text size="xs" color="muted" uppercase weight="medium"
                >Problem ${String(i + 1).padStart(2, "0")}</ui-text
              >
              <ui-text size="sm" weight="semibold">${problem}</ui-text>
              <ui-text size="sm">→ ${answer}</ui-text>
              <ui-flex>${this._see(href, "Show me")}</ui-flex>
            </ui-card>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _requirements(d: ProjectView) {
    type Row = { requirement: string; phase: number; href: string };
    const rows: Row[] = d.requirements.map(([requirement, phase, href]) => ({ requirement, phase, href }));
    const columns: TableColumn<Row & Record<string, unknown>>[] = [
      {
        key: "requirement",
        label: "From your brief",
        render: (r) => html`<ui-text size="sm">${r.requirement}</ui-text>`,
      },
      {
        key: "phase",
        label: "Phase",
        render: (r) =>
          html`<ui-badge size="sm" variant="soft" .color=${PHASE_COLOR[r.phase as PhaseKey]}
            >Phase ${r.phase}</ui-badge
          >`,
      },
      {
        key: "covered",
        label: "Covered",
        render: () => html`<ui-icon name="check" color="success" label="Covered"></ui-icon>`,
      },
      { key: "href", label: "", render: (r) => this._see(r.href, "Show me") },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Your brief, line by line</span>
        <ui-badge size="sm" variant="soft" color="success">${rows.length} / ${rows.length} covered</ui-badge>
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Every requirement designed, with the screen that shows it and an acceptance test.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${rows as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  private _acceptance(d: ProjectView) {
    const passed = d.acceptance.filter((a) => a.pass).length;
    const columns: TableColumn<AcceptanceTest & Record<string, unknown>>[] = [
      { key: "no", label: "#", render: (a) => html`<ui-text size="sm" weight="semibold">${a.no}</ui-text>` },
      {
        key: "scenario",
        label: "Scenario",
        render: (a) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="semibold">${a.scenario}</ui-text>
            <ui-text size="xs" color="muted">${a.evidence}</ui-text>
          </ui-flex>`,
      },
      { key: "check", label: "Checked live", render: (a) => html`<ui-text size="xs">${a.check}</ui-text>` },
      {
        key: "status",
        label: "Status",
        render: (a) =>
          html`<ui-badge size="sm" variant="soft" .color=${a.pass ? "success" : "warning"}>${a.status}</ui-badge>`,
      },
      { key: "href", label: "", render: (a) => this._see(a.href, "Open") },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Acceptance tests from your brief</span>
        <ui-badge size="sm" variant="soft" .color=${passed === d.acceptance.length ? "success" : "info"}
          >${passed} / ${d.acceptance.length} pass</ui-badge
        >
      </ui-flex>
      <ui-progress
        color="success"
        width="full"
        .value=${passed}
        .max=${d.acceptance.length}
        .label=${`${passed} of ${d.acceptance.length} acceptance tests pass`}
      ></ui-progress>
      <ui-text size="xs" color="muted"
        >The ten scenarios you asked to see live, each with its evidence. Checked against the data in this demo
        ${formatDate(d.checkedAt)}; at go-live they run on your own data.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.acceptance as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  private _trust(d: ProjectView) {
    return html`<ui-card variant="border" shadow="false" heading="AI never sends, prices or pays without a person.">
      <ui-grid fit="sm" gap="4">
        ${d.trust.map(
          ([title, text, href], i) =>
            html`<ui-flex direction="col" gap="1" align="start">
              <ui-text size="xs" color="muted" weight="medium">${String(i + 1).padStart(2, "0")}</ui-text>
              <ui-text weight="semibold">${title}</ui-text>
              <ui-text size="sm" color="muted">${text}</ui-text>
              ${this._see(href, "Show me")}
            </ui-flex>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _monthly(d: ProjectView) {
    return html`<ui-card variant="border" shadow="false" heading="Monthly plan — from go-live">
      <ui-text size="sm" color="muted">One monthly plan keeps everything running after go-live.</ui-text>
      <ui-flex direction="col" gap="3">
        ${d.monthly.map(
          ([title, text]) =>
            html`<ui-flex gap="3" align="start">
              <ui-icon name="check" color="success" size="sm"></ui-icon>
              <ui-flex direction="col" gap="0" shrink>
                <ui-text size="sm" weight="semibold">${title}</ui-text>
                <ui-text size="xs" color="muted">${text}</ui-text>
              </ui-flex>
            </ui-flex>`,
        )}
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately.</ui-text
      >
    </ui-card>`;
  }

  private _payment(d: ProjectView) {
    return html`<ui-card variant="border" shadow="false" heading="The last 20% is paid after 30 days of real use.">
      <ui-text size="sm" color="muted"
        >Each phase is paid in three steps, so you only pay the last part once it works in your hands.</ui-text
      >
      <ui-grid fit="xs" gap="4">
        ${d.payment.map(
          ([pct, text], i) =>
            html`<ui-card variant="border" size="sm" shadow="false" .color=${i === 2 ? "primary" : undefined}>
              <ui-text size="3xl" weight="bold" leading="tight">${pct}</ui-text>
              <ui-text size="sm">${text}</ui-text>
            </ui-card>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text size="xs" color="muted" weight="medium" uppercase>Golden Sea × SaaSTEMLY · delivery plan</ui-text>
          <ui-heading level="1" size="page">From the first email to the last payment</ui-heading>
          <ui-text color="muted"
            >Four phases over 13 weeks, each shown in this demo. Every requirement from your brief is covered and proven
            by an acceptance test before the final payment.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" color="primary" href="/inbox">Start at the inbox</ui-button>
          <ui-button size="sm" variant="soft" href="/collections/cases/gs-rfq-0142/overview">Follow one case</ui-button>
        </ui-flex>
      </ui-flex>
      ${this._milestones(d)} ${this._gantt(d)}
      <ui-grid fit="md" gap="6" align="start">${d.phases.map((p) => this._phase(p))}</ui-grid>
      ${this._platform(d)} ${this._problems(d)} ${this._requirements(d)} ${this._acceptance(d)} ${this._trust(d)}
      <ui-grid fit="md" gap="6" align="start">${this._monthly(d)} ${this._payment(d)}</ui-grid>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-project": GsProject;
  }
}
