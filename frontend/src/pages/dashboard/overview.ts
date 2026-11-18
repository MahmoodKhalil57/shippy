import { html, nothing } from "lit";
import { LightElement } from "../../components/base/light-element.ts";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import "../../components/index.ts";
import type { Access } from "./app.ts";
import { dashboardPath, config, globalLabel, labels } from "./shared.ts";

/** Dashboard: a card per collection (grouped by `admin.group`) with its count, and the globals. */
@customElement("dashboard-overview")
export class DashboardOverview extends LightElement {
  @property({ attribute: false }) access!: Access;
  @state() private counts: Record<string, number> = {};

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    const entries = await Promise.all(
      config.collections
        .filter((c) => this.access.collections[c.slug]?.read.permission)
        .map(async (c) => [c.slug, (await api.count(c.slug)).totalDocs] as const),
    );
    this.counts = Object.fromEntries(entries);
  }

  render() {
    const groups = new Map<string, typeof config.collections>();
    for (const c of config.collections) {
      if (c.admin?.hidden === true || !this.access.collections[c.slug]?.read.permission) continue;
      const group = typeof c.admin?.group === "string" ? c.admin.group : "Collections";
      groups.set(group, [...(groups.get(group) ?? []), c]);
    }
    const globals = (config.globals ?? []).filter((g) => this.access.globals[g.slug]?.read.permission);

    return html`<ui-flex direction="col" gap="8">
      <ui-flex direction="col" gap="1">
        <ui-heading level="1" size="3xl">Dashboard</ui-heading>
        <ui-text color="muted"
          >Collections and globals from <strong>src/cms/config.ts</strong>, served in this browser.</ui-text
        >
      </ui-flex>
      ${[...groups].map(
        ([group, collections]) =>
          html`<ui-flex direction="col" gap="3">
            <ui-heading level="2" size="lg" color="muted">${group}</ui-heading>
            <ui-grid fit="sm" gap="4">
              ${collections.map((c) => {
                const canCreate = this.access.collections[c.slug]?.create.permission;
                return html`<ui-card variant="border" .heading=${labels(c).plural} actions-align="start">
                  <ui-text size="sm" color="muted">${this.counts[c.slug] ?? "…"} documents</ui-text>
                  <ui-flex gap="2" wrap>
                    <ui-button size="sm" href=${dashboardPath("collections", c.slug)}>View all</ui-button>
                    ${
                      canCreate
                        ? html`<ui-button
                            size="sm"
                            variant="soft"
                            color="primary"
                            href=${dashboardPath("collections", c.slug, "create")}
                            >+ Create new</ui-button
                          >`
                        : nothing
                    }
                  </ui-flex>
                </ui-card>`;
              })}
            </ui-grid>
          </ui-flex>`,
      )}
      ${
        globals.length
          ? html`<ui-flex direction="col" gap="3">
              <ui-heading level="2" size="lg" color="muted">Globals</ui-heading>
              <ui-grid fit="sm" gap="4">
                ${globals.map(
                  (g) =>
                    html`<ui-card variant="border" .heading=${globalLabel(g)}>
                      <ui-flex gap="2">
                        <ui-button size="sm" href=${dashboardPath("globals", g.slug)}>Edit</ui-button>
                      </ui-flex>
                    </ui-card>`,
                )}
              </ui-grid>
            </ui-flex>`
          : nothing
      }
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-overview": DashboardOverview;
  }
}
