import { html, nothing } from "lit";
import { LightElement } from "../../components/base/light-element.ts";
import { customElement, state } from "lit/decorators.js";
import { API_ROUTE, api } from "../../cms/client.ts";
import "../../components/index.ts";
import { collectionOf, formatDate, labels, toast } from "./shared.ts";

interface Status {
  seededAt?: string;
  seedChanged: boolean;
  counts: Record<string, number>;
}

/** Mock data tools: what's stored in this browser, export / import, reset to the seed files. */
@customElement("dashboard-mock-data")
export class DashboardMockData extends LightElement {
  @state() private status: Status | null = null;
  @state() private file: File | null = null;
  @state() private confirmReset = false;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    this.status = await api.get<Status>("/_mock/status");
  }

  private async _import() {
    if (!this.file) return;
    try {
      const { message } = await api.post<{ message: string }>("/_mock/import", JSON.parse(await this.file.text()));
      toast(message);
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _reset() {
    this.confirmReset = false;
    const { message } = await api.post<{ message: string }>("/_mock/reset");
    toast(message);
    await this._load();
  }

  render() {
    const s = this.status;
    return html`<ui-flex direction="col" gap="6">
      <ui-flex direction="col" gap="1">
        <ui-heading level="1" size="3xl">Mock data</ui-heading>
        <ui-text color="muted">
          Everything lives in this browser (IndexedDB), served by a Service Worker at
          <ui-kbd size="sm">${API_ROUTE}</ui-kbd>. It starts from the seed files in <strong>src/cms/seed</strong>; edits
          stay here until you reset.
        </ui-text>
      </ui-flex>

      ${
        s?.seedChanged
          ? html`<ui-alert color="info" variant="soft" heading="The seed files changed">
              Reset to load the new seed (this discards local edits).
            </ui-alert>`
          : nothing
      }

      <ui-grid cols="1 md:2" gap="6">
        <ui-card heading="Stored documents" variant="border">
          ${
            s
              ? html`<ui-table
                    size="sm"
                    .columns=${[
                      { key: "collection", label: "Collection" },
                      { key: "count", label: "Documents" },
                    ]}
                    .rows=${Object.entries(s.counts).map(([slug, count]) => ({
                      collection: collectionOf(slug) ? labels(collectionOf(slug)!).plural : slug,
                      count,
                    }))}
                  ></ui-table>
                  <ui-text size="xs" color="muted">Seeded ${formatDate(s.seededAt)}</ui-text>`
              : html`<ui-loading></ui-loading>`
          }
        </ui-card>

        <ui-flex direction="col" gap="6">
          <ui-card heading="Export" variant="border">
            <ui-text size="sm" color="muted"
              >Download everything (documents, globals and uploads) as one JSON file.</ui-text
            >
            <ui-flex>
              <ui-button href=${`${API_ROUTE}/_mock/export`}>Download export</ui-button>
            </ui-flex>
          </ui-card>

          <ui-card heading="Import" variant="border">
            <ui-text size="sm" color="muted">Replace the stored data with an export.</ui-text>
            <ui-file-input
              accept="application/json"
              @ui-change=${(e: CustomEvent<{ files: FileList | null }>) => (this.file = e.detail.files?.[0] ?? null)}
            ></ui-file-input>
            <ui-flex>
              <ui-button .disabled=${!this.file} @click=${() => this._import()}>Import</ui-button>
            </ui-flex>
          </ui-card>

          <ui-card heading="Reset" variant="border">
            <ui-text size="sm" color="muted">Throw away local changes and reload the seed files.</ui-text>
            <ui-flex>
              <ui-button color="error" variant="soft" @click=${() => (this.confirmReset = true)}
                >Reset to seed</ui-button
              >
            </ui-flex>
          </ui-card>
        </ui-flex>
      </ui-grid>

      <ui-modal heading="Reset to seed data?" .open=${this.confirmReset} @ui-close=${() => (this.confirmReset = false)}>
        <ui-text>All documents, globals and uploads in this browser are replaced by the seed files.</ui-text>
        <ui-flex slot="actions" gap="2">
          <ui-button variant="ghost" @click=${() => (this.confirmReset = false)}>Cancel</ui-button>
          <ui-button color="error" @click=${() => this._reset()}>Reset</ui-button>
        </ui-flex>
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-mock-data": DashboardMockData;
  }
}
