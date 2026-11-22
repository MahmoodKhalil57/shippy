import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../components/base/light-element.ts";
import "../components/index.ts";
import type { Access } from "./app.ts";
import { dashboardPath, navOf, rootViews, settings } from "./shared.ts";
import { site } from "./site.ts";

/**
 * The default home page, for a project that doesn't set `admin.components.views.dashboard`: like
 * Payload's own dashboard, every screen in the navigation, by group.
 */
@customElement("dashboard-home")
export class DashboardHome extends LightElement {
  @property({ attribute: false }) access?: Access;

  private _groups() {
    const groups = new Map<string, { headline: string; supporting: string; href: string }[]>();
    const add = (group: string, item: { headline: string; supporting: string; href: string }) =>
      groups.set(group, [...(groups.get(group) ?? []), item]);
    // Every view in the navigation (collections and globals show only where a view places them).
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
      <ui-page-header .heading=${site().branding.name}></ui-page-header>
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
