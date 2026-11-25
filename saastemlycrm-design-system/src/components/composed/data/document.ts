import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import type { TableColumn } from "../../primitives/data/table.ts";
import "../../primitives/index.ts";
import type { DocumentSpec } from "../../base/document-spec.ts";

@customElement("ui-document")
export class UiDocument extends LightElement {
  @property({ attribute: false }) doc?: DocumentSpec;

  render() {
    const d = this.doc;
    if (!d) return nothing;
    const columns: TableColumn<Record<string, string>>[] = d.columns.map((c) => ({
      key: c.key,
      label: c.label,
      render: c.ltr
        ? (l) => html`<ui-text variant="body-md" dir="ltr">${l[c.key]}</ui-text>`
        : c.upper
          ? (l) => html`<ui-text variant="body-md" uppercase>${l[c.key]}</ui-text>`
          : undefined,
    }));
    return html`<ui-box
      surface="base-100"
      border
      rounded="box"
      padding="6"
      lang=${d.lang ?? "en"}
      dir=${d.dir ?? "ltr"}
    >
      <ui-flex direction="col" gap="5">
        ${(d.notices ?? []).map((n) => html`<ui-alert .tone=${n.tone}>${n.text}</ui-alert>`)}
        <ui-flex justify="between" align="start" gap="4" wrap>
          <ui-flex direction="col" gap="0">
            <ui-heading level="2" variant="headline-sm" color="primary" tracking="wide">${d.issuer.name}</ui-heading>
            ${d.issuer.tagline ? html`<ui-text variant="body-sm" color="muted" uppercase>${d.issuer.tagline}</ui-text>` : nothing}
          </ui-flex>
          <ui-flex direction="col" gap="1" align="end">
            <ui-heading level="2" variant="headline-sm" color="primary">${d.title}</ui-heading>
            ${d.meta.map((m) => html`<ui-text variant="body-md" .color=${m.accent ? "primary" : undefined}>${m.text}</ui-text>`)}
          </ui-flex>
        </ui-flex>
        ${
          d.party
            ? html`<ui-flex direction="col" gap="0">
                <ui-box surface="primary" padding="2" rounded="field"
                  ><ui-text variant="title-sm">${d.party.title}</ui-text></ui-box
                >
                <ui-table
                  size="sm"
                  .columns=${[
                    {
                      key: "label",
                      label: "",
                      render: (r: Record<string, unknown>) =>
                        html`<ui-text variant="title-sm" color="primary">${r.label}</ui-text>`,
                    },
                    { key: "value", label: "" },
                  ]}
                  .rows=${d.party.rows}
                ></ui-table>
              </ui-flex>`
            : nothing
        }
        ${d.intro ? html`<ui-text emphasized color="primary">${d.intro}</ui-text>` : nothing}
        <ui-table size="sm" .columns=${columns} .rows=${d.lines}></ui-table>
        ${
          d.total || d.adjustments?.length
            ? html`<ui-flex direction="col" gap="1">
                ${(d.adjustments ?? []).map(
                  (a) =>
                    html`<ui-flex justify="between" gap="2" padding="2">
                      <ui-text variant="body-md">${a.label}</ui-text>
                      <ui-text variant="body-md">${a.value}</ui-text>
                    </ui-flex>`,
                )}
                ${
                  d.total
                    ? html`<ui-box surface="primary" padding="2" rounded="field">
                        <ui-flex justify="between" gap="2">
                          <ui-text emphasized>${d.total.label}</ui-text>
                          <ui-text emphasized>${d.total.value}</ui-text>
                        </ui-flex>
                      </ui-box>`
                    : nothing
                }
                ${d.totalNote ? html`<ui-text variant="body-sm" color="muted">${d.totalNote}</ui-text>` : nothing}
              </ui-flex>`
            : nothing
        }
        ${
          d.notes
            ? html`<ui-flex direction="col" gap="2">
                ${d.notes.title ? html`<ui-text emphasized italic>${d.notes.title}</ui-text>` : nothing}
                <ui-list
                  >${d.notes.items.map((x) => html`<ui-list-item .supporting=${x} lines="3"></ui-list-item>`)}</ui-list
                >
                ${d.notes.closing ? html`<ui-text variant="body-md" italic>${d.notes.closing}</ui-text>` : nothing}
              </ui-flex>`
            : nothing
        }
        ${
          d.footer
            ? html`<ui-flex justify="between" align="end" gap="4" wrap>
                <ui-text variant="body-sm" color="muted">${d.footer.start ?? ""}</ui-text>
                <ui-text variant="body-sm" italic>${d.footer.end ?? ""}</ui-text>
              </ui-flex>`
            : nothing
        }
        ${
          d.contact?.length
            ? html`<ui-box surface="primary-soft" padding="3" rounded="field">
                <ui-flex direction="col" gap="0">
                  ${d.contact.map((c) => html`<ui-text variant="body-sm" dir="ltr">${c}</ui-text>`)}
                </ui-flex>
              </ui-box>`
            : nothing
        }
      </ui-flex>
    </ui-box>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-document": UiDocument;
  }
}
