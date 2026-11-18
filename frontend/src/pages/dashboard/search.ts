import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import "../../components/index.ts";
import type { Access } from "./app.ts";
import { config, dashboardPath, globalLabel, labels, titleOf, useAsTitle } from "./shared.ts";

/**
 * Header search: matches collection and global names, then each readable collection's
 * title field (`admin.useAsTitle`, like Payload's list search). Results open under the field.
 */
@customElement("dashboard-search")
export class DashboardSearch extends LightElement {
  @property({ attribute: false }) access!: Access;
  @state() private query = "";
  @state() private results: MenuItem[] = [];
  @state() private searching = false;
  #timer?: ReturnType<typeof setTimeout>;
  #run = 0;

  private _onInput(e: Event) {
    this.query = (e.target as HTMLInputElement).value;
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => void this._search(), 200);
  }

  private async _search() {
    const q = this.query.trim();
    const run = ++this.#run;
    if (q.length < 2) {
      this.results = [];
      return;
    }
    this.searching = true;
    const lower = q.toLowerCase();
    const readable = config.collections.filter(
      (c) => c.admin?.hidden !== true && this.access.collections[c.slug]?.read.permission,
    );
    const pages: MenuItem[] = [
      ...readable
        .filter((c) => labels(c).plural.toLowerCase().includes(lower))
        .map((c) => ({ label: labels(c).plural, href: dashboardPath("collections", c.slug) })),
      ...(config.globals ?? [])
        .filter((g) => this.access.globals[g.slug]?.read.permission && globalLabel(g).toLowerCase().includes(lower))
        .map((g) => ({ label: globalLabel(g), href: dashboardPath("globals", g.slug) })),
    ];
    const groups = await Promise.all(
      readable
        .filter((c) => useAsTitle(c) !== "id")
        .map(async (c) => {
          try {
            const { docs } = await api.find(c.slug, { where: { [useAsTitle(c)]: { like: q } }, limit: 4, depth: 0 });
            return docs.length
              ? [
                  { label: labels(c).plural, heading: true },
                  ...docs.map((d) => ({ label: titleOf(c, d), href: dashboardPath("collections", c.slug, d.id) })),
                ]
              : [];
          } catch {
            return [];
          }
        }),
    );
    if (run !== this.#run) return; // a newer search started meanwhile
    this.results = [...(pages.length ? [{ label: "Pages", heading: true }, ...pages] : []), ...groups.flat()];
    this.searching = false;
  }

  render() {
    const q = this.query.trim();
    return html`<ui-dropdown align="center" panel="card" panel-width="80" panel-offset="2" panel-shadow="lg">
      <ui-text-input
        slot="trigger"
        type="search"
        icon="search"
        placeholder="Search cases, vessels, suppliers, products…"
        width="full"
        size="lg"
        pill
        .value=${this.query}
        @input=${this._onInput}
      ></ui-text-input>
      ${
        q.length < 2
          ? html`<ui-text size="sm" color="muted">Type at least 2 characters.</ui-text>`
          : this.searching && !this.results.length
            ? html`<ui-loading size="sm"></ui-loading>`
            : this.results.length
              ? html`<ui-menu width="full" surface="false" .items=${this.results}></ui-menu>`
              : html`<ui-text size="sm" color="muted">No matches for “${q}”.</ui-text>`
      }
    </ui-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-search": DashboardSearch;
  }
}
