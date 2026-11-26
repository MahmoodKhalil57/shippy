import { provide } from "@lit/context";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { dashboardContext, type Dashboard } from "../../lib/dashboard/context.ts";

@customElement("dashboard-provider")
export class DashboardProvider extends LitElement {
  @provide({ context: dashboardContext })
  @property({ attribute: false })
  dashboard!: Dashboard;

  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-provider": DashboardProvider;
  }
}
