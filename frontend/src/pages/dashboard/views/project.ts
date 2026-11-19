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

const PHASE_COLOR = { 0: "neutral", 1: "primary", 2: "info", 3: "success" } as const;
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
      ? html`<ui-button size="xs" variant="tonal" color="primary" .href=${href}>${label}</ui-button>`
      : nothing;
  }

  private _milestones(d: ProjectView) {
    return html`<ui-card heading="Value from week 7. Everything by week 13.">
      <ui-steps scrollable .current=${-1} .items=${d.milestones.map((m) => ({ label: m.week }))}></ui-steps>
      <ui-grid fit="xs" gap="4">
        ${d.milestones.map(
          (m) =>
            html`<ui-flex direction="col" gap="1">
              <ui-text variant="label-md" color="muted" uppercase>${m.week}</ui-text>
              <ui-text emphasized>${m.title}</ui-text>
              <ui-text variant="body-md" color="muted">${m.text}</ui-text>
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
            ><ui-text variant="title-sm">${p.name}</ui-text
            ><ui-text variant="body-sm" color="muted">${p.weeks}</ui-text></ui-flex
          >`,
      },
      ...WEEKS.map((w): TableColumn<Row> => ({
        key: `w${w}`,
        label: `W${w}`,
        render: (p) =>
          w >= p.from && w <= p.to
            ? w === p.from
              ? html`<ui-tag .tone=${PHASE_COLOR[Number(p.key) as PhaseKey]}>${p.key}</ui-tag>`
              : html`<ui-badge
                  dot
                  .tone=${PHASE_COLOR[Number(p.key) as PhaseKey]}
                  .label=${`${p.name}, week ${w}`}
                ></ui-badge>`
            : nothing,
      })),
    ];
    return html`<ui-card heading="Roadmap — 13 weeks, phased">
      <ui-table size="xs" nowrap .columns=${columns} .rows=${d.phases as Row[]}></ui-table>
      <ui-text variant="body-sm" color="muted"
        >Each phase is approved on its own; a weekly 45-minute review keeps progress, baseline numbers and decisions in
        one place.</ui-text
      >
    </ui-card>`;
  }

  private _phase(p: ProjectView["phases"][number]) {
    return html`<ui-card>
      <span slot="heading">${p.name}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag .tone=${PHASE_COLOR[Number(p.key) as PhaseKey]}>${p.weeks}</ui-tag></ui-flex
      >
      <ui-text variant="body-md" color="muted">${p.goal}</ui-text>
      <ui-flex direction="col" gap="3">
        ${p.packages.map(
          (w) =>
            html`<ui-flex gap="3" align="center" justify="between" wrap>
              <ui-flex direction="col" gap="0" shrink grow>
                <ui-text variant="title-sm">${w.name}</ui-text>
                <ui-text variant="body-sm" color="muted">${w.detail}</ui-text>
              </ui-flex>
              ${this._see(w.href)}
            </ui-flex>`,
        )}
      </ui-flex>
    </ui-card>`;
  }

  private _platform(d: ProjectView) {
    return html`<ui-card heading="Running through every phase">
      <ui-grid fit="sm" gap="4">
        ${d.platform.map(
          (w) =>
            html`<ui-flex direction="col" gap="1" align="start">
              <ui-text variant="title-sm">${w.name}</ui-text>
              <ui-text variant="body-sm" color="muted">${w.detail}</ui-text>
              ${this._see(w.href)}
            </ui-flex>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _problems(d: ProjectView) {
    return html`<ui-card heading="Nine problems you named. Nine answers.">
      <ui-grid fit="sm" gap="4">
        ${d.problems.map(
          ([problem, answer, href], i) =>
            html`<ui-card variant="filled" size="sm">
              <ui-text variant="label-md" color="muted" uppercase>Problem ${String(i + 1).padStart(2, "0")}</ui-text>
              <ui-text variant="title-sm">${problem}</ui-text>
              <ui-text variant="body-md">→ ${answer}</ui-text>
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
        render: (r) => html`<ui-text variant="body-md">${r.requirement}</ui-text>`,
      },
      {
        key: "phase",
        label: "Phase",
        render: (r) => html`<ui-tag .tone=${PHASE_COLOR[r.phase as PhaseKey]}>Phase ${r.phase}</ui-tag>`,
      },
      {
        key: "covered",
        label: "Covered",
        render: () => html`<ui-icon name="check" color="success" label="Covered"></ui-icon>`,
      },
      { key: "href", label: "", render: (r) => this._see(r.href, "Show me") },
    ];
    return html`<ui-card>
      <span slot="heading">Your brief, line by line</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag tone="success">${rows.length} / ${rows.length} covered</ui-tag></ui-flex
      >
      <ui-text variant="body-sm" color="muted"
        >Every requirement designed, with the screen that shows it and an acceptance test.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${rows as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  private _acceptance(d: ProjectView) {
    const passed = d.acceptance.filter((a) => a.pass).length;
    const columns: TableColumn<AcceptanceTest & Record<string, unknown>>[] = [
      { key: "no", label: "#", render: (a) => html`<ui-text variant="title-sm">${a.no}</ui-text>` },
      {
        key: "scenario",
        label: "Scenario",
        render: (a) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="title-sm">${a.scenario}</ui-text>
            <ui-text variant="body-sm" color="muted">${a.evidence}</ui-text>
          </ui-flex>`,
      },
      { key: "check", label: "Checked live", render: (a) => html`<ui-text variant="body-sm">${a.check}</ui-text>` },
      {
        key: "status",
        label: "Status",
        render: (a) => html`<ui-tag .tone=${a.pass ? "success" : "warning"}>${a.status}</ui-tag>`,
      },
      { key: "href", label: "", render: (a) => this._see(a.href, "Open") },
    ];
    return html`<ui-card>
      <span slot="heading">Acceptance tests from your brief</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag .tone=${passed === d.acceptance.length ? "success" : "info"}
          >${passed} / ${d.acceptance.length} pass</ui-tag
        ></ui-flex
      >
      <ui-gauge
        tone="success"
        .value=${passed}
        .max=${d.acceptance.length}
        .label=${`${passed} of ${d.acceptance.length} acceptance tests pass`}
      ></ui-gauge>
      <ui-text variant="body-sm" color="muted"
        >The ten scenarios you asked to see live, each with its evidence. Checked against the data in this demo
        ${formatDate(d.checkedAt)}; at go-live they run on your own data.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.acceptance as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  private _trust(d: ProjectView) {
    return html`<ui-card heading="AI never sends, prices or pays without a person.">
      <ui-grid fit="sm" gap="4">
        ${d.trust.map(
          ([title, text, href], i) =>
            html`<ui-flex direction="col" gap="1" align="start">
              <ui-text variant="label-md" color="muted">${String(i + 1).padStart(2, "0")}</ui-text>
              <ui-text emphasized>${title}</ui-text>
              <ui-text variant="body-md" color="muted">${text}</ui-text>
              ${this._see(href, "Show me")}
            </ui-flex>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _monthly(d: ProjectView) {
    return html`<ui-card heading="Monthly plan — from go-live">
      <ui-text variant="body-md" color="muted">One monthly plan keeps everything running after go-live.</ui-text>
      <ui-flex direction="col" gap="3">
        ${d.monthly.map(
          ([title, text]) =>
            html`<ui-flex gap="3" align="start">
              <ui-icon name="check" color="success" size="sm"></ui-icon>
              <ui-flex direction="col" gap="0" shrink>
                <ui-text variant="title-sm">${title}</ui-text>
                <ui-text variant="body-sm" color="muted">${text}</ui-text>
              </ui-flex>
            </ui-flex>`,
        )}
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately.</ui-text
      >
    </ui-card>`;
  }

  private _payment(d: ProjectView) {
    return html`<ui-card heading="The last 20% is paid after 30 days of real use.">
      <ui-text variant="body-md" color="muted"
        >Each phase is paid in three steps, so you only pay the last part once it works in your hands.</ui-text
      >
      <ui-grid fit="xs" gap="4">
        ${d.payment.map(
          ([pct, text], i) =>
            html`<ui-card size="sm" .variant=${i === 2 ? "filled" : undefined}>
              <ui-text variant="headline-md" emphasized leading="tight">${pct}</ui-text>
              <ui-text variant="body-md">${text}</ui-text>
            </ui-card>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  render() {
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const d = this.data;
    if (!d) return html`<ui-empty-state loading></ui-empty-state>`;
    return html`<ui-flex direction="col" gap="6">
      <ui-page-header>
        <span slot="eyebrow">Golden Sea × SaaSTEMLY · delivery plan</span>
        <span slot="heading">From the first email to the last payment</span>
        <span slot="subtitle"
          >Four phases over 13 weeks, each shown in this demo. Every requirement from your brief is covered and proven
          by an acceptance test before the final payment.</span
        >
        <ui-flex slot="actions" gap="2" wrap>
          <ui-button size="xs" color="primary" href="/inbox">Start at the inbox</ui-button>
          <ui-button size="xs" variant="tonal" href="/collections/cases/gs-rfq-0142/overview"
            >Follow one case</ui-button
          >
        </ui-flex>
      </ui-page-header>
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
