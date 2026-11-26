import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../base/light-element.ts";
import "../index.ts";
import { dashboardContext, type Access, type Dashboard } from "../../lib/dashboard/context.ts";

@customElement("dashboard-home")
export class DashboardHome extends LightElement {
  @property({ attribute: false }) access?: Access;
  @consume({ context: dashboardContext, subscribe: true }) @state() private dashboard!: Dashboard;

  private _groups() {
    const { rootViews, navOf, dashboardPath, settings } = this.dashboard.project;
    const groups = new Map<string, { headline: string; supporting: string; href: string }[]>();
    const add = (group: string, item: { headline: string; supporting: string; href: string }) =>
      groups.set(group, [...(groups.get(group) ?? []), item]);
    for (const v of rootViews()) {
      const nav = navOf(v);
      if (nav && !v.path.includes(":"))
        add(nav.group, {
          headline: nav.label,
          supporting: v.meta?.description ?? "",
          href: dashboardPath(v.path.slice(1)),
        });
    }
    const order = (settings.nav?.groups ?? []).map((g) => g.label);
    const rank = (g: string) => (order.indexOf(g) + 1 || order.length + 1) - 1;
    return [...groups].sort(([a], [b]) => rank(a) - rank(b));
  }

  render() {
    return html`<ui-flex direction="col" gap="6">
      <ui-page-header .heading=${this.dashboard.site.branding.name}></ui-page-header>
      <ui-grid fit="md" gap="4">
        ${this._groups().map(
          ([group, items]) =>
            html`<ui-card .heading=${group} .count=${items.length}>
              <ui-list>
                ${items.map(
                  (i) =>
                    html`<ui-list-item
                      .headline=${i.headline}
                      .supporting=${i.supporting}
                      .href=${i.href}
                    ></ui-list-item>`,
                )}
              </ui-list>
            </ui-card>`,
        )}
      </ui-grid>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-home": DashboardHome;
  }
}
