import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../components/base/light-element.ts";
import "../components/index.ts";
import type { Access } from "./app.ts";
import { config, dashboardPath, globalLabel, groupOf, labels, rootViews, settings } from "./shared.ts";
import { site } from "./site.ts";

/**
 * The default home page, for a project that doesn't set `admin.components.views.dashboard`: like
 * Payload's own dashboard, every screen, collection and global the user can read, by group.
 */
@customElement("dashboard-home")
export class DashboardHome extends LightElement {
  @property({ attribute: false }) access?: Access;

  private _groups() {
    const groups = new Map<string, { headline: string; supporting: string; href: string }[]>();
    const add = (group: string, item: { headline: string; supporting: string; href: string }) =>
      groups.set(group, [...(groups.get(group) ?? []), item]);
    for (const v of rootViews())
      if (v.nav)
        add(v.nav.group, {
          headline: v.nav.label,
          supporting: v.meta?.description ?? "",
          href: dashboardPath(v.path.slice(1)),
        });
    for (const c of config.collections) {
      if (c.admin?.hidden === true || this.access?.collections[c.slug]?.read.permission === false) continue;
      const description = typeof c.admin?.description === "string" ? c.admin.description : "";
      add(groupOf(c), {
        headline: labels(c).plural,
        supporting: description,
        href: dashboardPath("collections", c.slug),
      });
    }
    for (const g of config.globals ?? []) {
      if (this.access?.globals[g.slug]?.read.permission === false) continue;
      add("Configuration", { headline: globalLabel(g), supporting: "", href: dashboardPath("globals", g.slug) });
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
