import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { Person, RolesView, Routing } from "../../../cms/endpoints/platform.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";

/**
 * Roles & permissions (root view /roles): the permissions matrix per role and user (the
 * Settings › Roles & permissions; management edits it, others read), where each permission is enforced
 * with live checks, and the on-call / after-hours roster (the `on-call-roster` global) with a
 * routing simulator: urgent RFQs outside Sun–Thu 08:00–17:00 go to the on-duty person.
 * Data: GET /api/roles, POST /api/on-call/route.
 */

type RoleRow = RolesView["roles"][number];
type Shift = { from: string; to: string; user: string; backup: string };

/** Simulator presets (Cairo time; the demo is set on Tue 17 Nov, 11:30). */
const PRESETS = [
  { label: "Tue 17 Nov 11:30 — office hours", at: "2026-11-17T09:30:00.000Z" },
  { label: "Tonight 21:40", at: "2026-11-17T19:40:00.000Z" },
  { label: "Fri 20 Nov 10:00 — weekend", at: "2026-11-20T08:00:00.000Z" },
  { label: "Sat 21 Nov 14:00 — weekend", at: "2026-11-21T12:00:00.000Z" },
  { label: "Sun 22 Nov 06:30 — before office", at: "2026-11-22T04:30:00.000Z" },
];

@customElement("gs-roles")
export class GsRoles extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: ViewProps["access"];
  @property({ attribute: false }) user!: ViewProps["user"];

  @state() private data: RolesView | null = null;
  @state() private error = "";
  @state() private matrix: RoleRow[] = [];
  @state() private dirty = false;
  @state() private shifts: Shift[] = [];
  @state() private rosterDirty = false;
  @state() private people: Doc[] = [];
  @state() private routing: Routing | null = null;
  @state() private routingBusy = false;
  @state() private confirm: "" | "matrix" | "roster" = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      const [d, users] = await Promise.all([
        api.get<RolesView>("/roles"),
        api.find("users", { limit: 0, depth: 0, sort: "name" }),
      ]);
      this.data = d;
      this.people = users.docs;
      this.matrix = d.roles.map((r) => ({ ...r }));
      this.shifts = d.roster.shifts.map((s) => ({
        from: s.from,
        to: s.to,
        user: s.user?.id ?? "",
        backup: s.backup?.id ?? "",
      }));
      this.dirty = false;
      this.rosterDirty = false;
      this.routing ??= d.now;
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private _set(i: number, key: string, value: boolean) {
    this.matrix = this.matrix.map((r, j) => (j === i ? { ...r, [key]: value } : r));
    this.dirty = true;
  }

  private async _saveMatrix() {
    this.confirm = "";
    try {
      const roles = this.matrix.map(({ users: _u, label: _l, ...r }) => r);
      await api.updateGlobal("settings", { permissions: roles });
      await api.create("activities", {
        kind: "human",
        text: "Updated the roles & permissions matrix.",
        entity: "globals/settings",
      });
      toast("Permissions saved (logged on the audit trail)");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _saveRoster() {
    this.confirm = "";
    try {
      const roster = await api.findGlobal<Record<string, unknown>>("on-call-roster", { depth: 0 });
      await api.updateGlobal("on-call-roster", {
        ...roster,
        shifts: this.shifts.map((s) => ({ from: s.from, to: s.to, user: s.user, backup: s.backup || null })),
      });
      await api.create("activities", {
        kind: "human",
        text: "Updated the on-call roster.",
        entity: "globals/on-call-roster",
      });
      toast("Roster saved");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _simulate(at: string) {
    this.routingBusy = true;
    try {
      const r = await api.post<Routing>("/on-call/route", { at, simulate: true });
      this.routing = r;
      toast(
        r.routedTo
          ? `Alert sent to ${r.routedTo.name} (WhatsApp / SMS simulated · notification created)`
          : "Office hours — the case owner picks it up; no alert needed",
        r.routedTo ? "success" : "info",
      );
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.routingBusy = false;
    }
  }

  /* ---------------------------------------------------------------- sections */

  private _names(users: Person[]) {
    return users.length
      ? html`<ui-flex gap="1" wrap>
          ${users.map(
            (u) =>
              html`<ui-tooltip .tip=${u.name}><ui-badge size="sm" variant="outline">${u.name}</ui-badge></ui-tooltip>`,
          )}
        </ui-flex>`
      : html`<ui-text variant="body-sm" color="muted">System account</ui-text>`;
  }

  private _matrix(d: RolesView) {
    const edit = d.canEditPermissions;
    const columns: TableColumn<RoleRow>[] = [
      {
        key: "role",
        label: "Role · people",
        render: (r) =>
          html`<ui-flex direction="col" gap="1">
            <ui-text variant="title-sm">${r.label}</ui-text>
            ${this._names(r.users)}
            ${typeof r.note === "string" && r.note ? html`<ui-text variant="body-sm" color="muted">${r.note}</ui-text>` : nothing}
          </ui-flex>`,
      },
      ...d.permissions.map((p): TableColumn<RoleRow> => ({
        key: p.key,
        label: p.label,
        render: (r, i) =>
          edit
            ? html`<ui-toggle
                size="sm"
                color="success"
                .checked=${r[p.key] === true}
                aria-label=${`${r.label}: ${p.label}`}
                @change=${(e: Event) => this._set(i, p.key, (e.target as HTMLInputElement).checked)}
              ></ui-toggle>`
            : r[p.key] === true
              ? html`<ui-icon name="check" color="success" .label=${`${r.label} can: ${p.label}`}></ui-icon>`
              : html`<ui-icon name="minus" color="muted" .label=${`${r.label} cannot: ${p.label}`}></ui-icon>`,
      })),
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Permissions matrix</span>
        ${
          edit
            ? html`<ui-button
                size="xs"
                color="primary"
                ?disabled=${!this.dirty}
                @click=${() => (this.confirm = "matrix")}
                >Save changes</ui-button
              >`
            : html`<ui-badge size="sm" variant="soft">Read only — management edits</ui-badge>`
        }
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >Who can see and approve what, per role and person. Named users and licences are confirmed in Phase 0.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${this.matrix}></ui-table>
    </ui-card>`;
  }

  private _enforced(d: RolesView) {
    return html`<ui-card variant="border" shadow="false" heading="Enforced, not just written down">
      <ui-flex direction="col" gap="3">
        ${d.checks.map(
          (c) =>
            html`<ui-flex gap="3" align="start">
              <ui-badge size="sm" variant="soft" .color=${c.pass ? "success" : "error"}
                >${c.pass ? "Verified" : "Failing"}</ui-badge
              >
              <ui-flex direction="col" gap="0" shrink>
                <ui-text variant="title-sm">${c.label}</ui-text>
                <ui-text variant="body-sm" color="muted">${c.detail}</ui-text>
              </ui-flex>
            </ui-flex>`,
        )}
      </ui-flex>
      <ui-divider></ui-divider>
      <ui-flex direction="col" gap="2">
        ${d.permissions.map((p) => html`<ui-text variant="body-sm"><strong>${p.label}:</strong> ${p.enforced}</ui-text>`)}
      </ui-flex>
      <ui-alert color="info" variant="soft"
        >Try it: switch the signed-in user to Soaad Amer (Sales) and open the pricing tab of GS-RFQ-0142 — costs and
        margins are gone.</ui-alert
      >
      <ui-button size="sm" variant="soft" href="/collections/cases/gs-rfq-0142/pricing"
        >Open GS-RFQ-0142 pricing</ui-button
      >
    </ui-card>`;
  }

  private _roster(d: RolesView) {
    const edit = d.canEditRoster;
    const options = this.people.map((u) => ({ label: typeof u.name === "string" ? u.name : u.id, value: u.id }));
    const columns: TableColumn<Shift & Record<string, unknown>>[] = [
      {
        key: "from",
        label: "Shift (Cairo)",
        render: (_s, i) => {
          const s = d.roster.shifts[i];
          return html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${s?.fromText} → ${s?.toText}</ui-text>
            ${s?.now ? html`<ui-badge size="xs" color="primary" variant="soft">Now</ui-badge>` : nothing}
          </ui-flex>`;
        },
      },
      {
        key: "user",
        label: "On duty",
        render: (s, i) =>
          edit
            ? html`<ui-select
                size="sm"
                .options=${options}
                .value=${s.user}
                @change=${(e: Event) => this._shift(i, "user", (e.target as HTMLSelectElement).value)}
              ></ui-select>`
            : html`<ui-text variant="title-sm">${d.roster.shifts[i]?.user?.name ?? "—"}</ui-text>`,
      },
      {
        key: "backup",
        label: "Backup",
        render: (s, i) =>
          edit
            ? html`<ui-select
                size="sm"
                .options=${options}
                .value=${s.backup}
                @change=${(e: Event) => this._shift(i, "backup", (e.target as HTMLSelectElement).value)}
              ></ui-select>`
            : html`<ui-text variant="body-md">${d.roster.shifts[i]?.backup?.name ?? "—"}</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>On-call roster</span>
        ${
          edit
            ? html`<ui-button
                size="xs"
                color="primary"
                ?disabled=${!this.rosterDirty}
                @click=${() => (this.confirm = "roster")}
                >Save roster</ui-button
              >`
            : html`<ui-badge size="sm" variant="soft">Read only — management & office manager edit</ui-badge>`
        }
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >Office hours Sun–Thu 08:00–17:00 Cairo. Outside them, urgent RFQs (or a vessel ETA under 24 h) alert the
        on-duty person by WhatsApp / SMS; the backup after ${d.roster.escalateAfterMinutes} min, then senior contacts:
        ${d.roster.senior.map((p) => p.name).join(", ")}.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${this.shifts as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  private _shift(i: number, key: "user" | "backup", value: string) {
    this.shifts = this.shifts.map((s, j) => (j === i ? { ...s, [key]: value } : s));
    this.rosterDirty = true;
  }

  private _simulator() {
    const r = this.routing;
    return html`<ui-card variant="border" shadow="false" heading="After-hours routing — try it">
      <ui-text variant="body-sm" color="muted"
        >Pick when an urgent RFQ arrives. The rule “After-hours & weekend RFQ” decides who is alerted; the alert is
        simulated and lands in that person's notifications.</ui-text
      >
      <ui-flex gap="2" wrap>
        ${PRESETS.map(
          (p) =>
            html`<ui-button
              size="xs"
              variant=${r?.at === p.at ? "soft" : "outline"}
              ?disabled=${this.routingBusy}
              @click=${() => this._simulate(p.at)}
              >${p.label}</ui-button
            >`,
        )}
      </ui-flex>
      ${this.routingBusy ? html`<ui-loading size="sm" color="primary"></ui-loading>` : nothing}
      ${
        r
          ? html`<ui-flex direction="col" gap="2">
              <ui-flex gap="2" align="center" wrap>
                <ui-badge size="sm" variant="soft" .color=${r.inHours ? "info" : "warning"}
                  >${r.inHours ? "Office hours" : "After hours"}</ui-badge
                >
                <ui-text variant="title-sm">${r.atText}</ui-text>
              </ui-flex>
              <ui-text variant="body-md">${r.reason}</ui-text>
              ${
                r.routedTo
                  ? html`<ui-steps
                      direction="vertical"
                      color="warning"
                      .current=${0}
                      .items=${[
                        { label: `Now: ${r.routedTo.name} (on duty)` },
                        { label: `+${r.escalateAfterMinutes} min: ${r.backup?.name ?? "—"} (backup)` },
                        { label: `Then: ${r.senior.map((p) => p.name).join(", ")} (senior)` },
                      ]}
                    ></ui-steps>`
                  : nothing
              }
            </ui-flex>`
          : nothing
      }
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
          <ui-text variant="label-md" color="muted" uppercase>Team · access</ui-text>
          <ui-heading level="1" variant="page">Roles & permissions</ui-heading>
          <ui-text color="muted"
            >Sales never sees costs or margins; approvals need a named person; bank-detail changes need two. Urgent RFQs
            after hours go to whoever is on call.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" variant="soft" href="/collections/users">People</ui-button>
          <ui-button size="sm" variant="soft" href="/globals/approval-rules">Approval rules</ui-button>
        </ui-flex>
      </ui-flex>
      ${this._matrix(d)}
      <ui-grid fit="md" gap="6" align="start">${this._enforced(d)} ${this._simulator()}</ui-grid>
      ${this._roster(d)}
      <ui-modal
        heading=${this.confirm === "matrix" ? "Save the permissions matrix?" : "Save the on-call roster?"}
        .open=${!!this.confirm}
        @ui-close=${() => (this.confirm = "")}
      >
        <ui-text variant="body-md"
          >${
            this.confirm === "matrix"
              ? "Changes apply to every person in the role and are logged on the audit trail."
              : "The new shifts decide who is alerted after hours from now on. The change is logged."
          }</ui-text
        >
        <ui-flex slot="actions" gap="2">
          <ui-button variant="ghost" @click=${() => (this.confirm = "")}>Cancel</ui-button>
          <ui-button
            color="primary"
            @click=${() => (this.confirm === "matrix" ? this._saveMatrix() : this._saveRoster())}
            >Save</ui-button
          >
        </ui-flex>
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-roles": GsRoles;
  }
}
