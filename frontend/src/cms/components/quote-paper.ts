import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../components/base/light-element.ts";
import type { TableColumn } from "../../components/primitives/data/table.ts";
import "../../components/index.ts";

/**
 * The quotation as Golden Sea's customer receives it, in their own layout (ported from their
 * sample PDF), left-to-right or right-to-left. Everything on it is worked out by the view
 * endpoint (src/cms/views/quote-preview.ts): wording in the chosen language, amounts in the
 * chosen currency. Placed with `block("custom", { element: "gs-quote-paper", props: { paper } })`.
 */

export interface QuotePaper {
  lang: "en" | "ar";
  notices: { tone: "warning" | "info"; text: string }[];
  brand: string;
  title: string;
  number: string;
  ref: string;
  date: string;
  clientTitle: string;
  client: { label: string; value: string }[];
  intro: string;
  columns: { key: string; label: string }[];
  lines: Record<string, string>[];
  discount?: { label: string; value: string };
  total: { label: string; value: string };
  fxNote?: string;
  remarksTitle: string;
  remarks: string[];
  wish: string;
  prepared: string;
  signature: string;
  contact: string[];
}

/** Columns whose text stays left-to-right (part names) or in capitals (units). */
const LTR = new Set(["description"]);
const UPPER = new Set(["unit"]);

@customElement("gs-quote-paper")
export class GsQuotePaper extends LightElement {
  @property({ attribute: false }) paper?: QuotePaper;

  render() {
    const p = this.paper;
    if (!p) return nothing;
    const columns: TableColumn<Record<string, string>>[] = p.columns.map((c) => ({
      key: c.key,
      label: c.label,
      render: LTR.has(c.key)
        ? (l) => html`<ui-text variant="body-md" dir="ltr">${l[c.key]}</ui-text>`
        : UPPER.has(c.key)
          ? (l) => html`<ui-text variant="body-md" uppercase>${l[c.key]}</ui-text>`
          : undefined,
    }));
    return html`<ui-box
      surface="base-100"
      border
      rounded="box"
      padding="6"
      lang=${p.lang}
      dir=${p.lang === "ar" ? "rtl" : "ltr"}
    >
      <ui-flex direction="col" gap="5">
        ${p.notices.map((n) => html`<ui-alert .tone=${n.tone}>${n.text}</ui-alert>`)}
        <ui-flex justify="between" align="start" gap="4" wrap>
          <ui-flex direction="col" gap="0">
            <ui-heading level="2" variant="headline-sm" color="primary" tracking="wide">GOLDEN SEA</ui-heading>
            <ui-text variant="body-sm" color="muted" uppercase>${p.brand}</ui-text>
          </ui-flex>
          <ui-flex direction="col" gap="1" align="end">
            <ui-heading level="2" variant="headline-sm" color="primary">${p.title}</ui-heading>
            <ui-text variant="body-md" color="primary">${p.number}</ui-text>
            <ui-text variant="body-md">${p.ref}</ui-text>
            <ui-text variant="body-md" color="primary">${p.date}</ui-text>
          </ui-flex>
        </ui-flex>
        <ui-flex direction="col" gap="0">
          <ui-box surface="primary" padding="2" rounded="field"
            ><ui-text variant="title-sm">${p.clientTitle}</ui-text></ui-box
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
            .rows=${p.client}
          ></ui-table>
        </ui-flex>
        <ui-text emphasized color="primary">${p.intro}</ui-text>
        <ui-table size="sm" .columns=${columns} .rows=${p.lines}></ui-table>
        <ui-flex direction="col" gap="1">
          ${
            p.discount
              ? html`<ui-flex justify="between" gap="2" padding="2">
                  <ui-text variant="body-md">${p.discount.label}</ui-text>
                  <ui-text variant="body-md">${p.discount.value}</ui-text>
                </ui-flex>`
              : nothing
          }
          <ui-box surface="primary" padding="2" rounded="field">
            <ui-flex justify="between" gap="2">
              <ui-text emphasized>${p.total.label}</ui-text>
              <ui-text emphasized>${p.total.value}</ui-text>
            </ui-flex>
          </ui-box>
          ${p.fxNote ? html`<ui-text variant="body-sm" color="muted">${p.fxNote}</ui-text>` : nothing}
        </ui-flex>
        <ui-flex direction="col" gap="2">
          <ui-text emphasized italic>${p.remarksTitle}</ui-text>
          <ui-list>${p.remarks.map((x) => html`<ui-list-item .supporting=${x} lines="3"></ui-list-item>`)}</ui-list>
          <ui-text variant="body-md" italic>${p.wish}</ui-text>
        </ui-flex>
        <ui-flex justify="between" align="end" gap="4" wrap>
          <ui-text variant="body-sm" color="muted">${p.prepared}</ui-text>
          <ui-text variant="body-sm" italic>${p.signature}</ui-text>
        </ui-flex>
        <ui-box surface="primary-soft" padding="3" rounded="field">
          <ui-flex direction="col" gap="0">
            ${p.contact.map((c) => html`<ui-text variant="body-sm" dir="ltr">${c}</ui-text>`)}
          </ui-flex>
        </ui-box>
      </ui-flex>
    </ui-box>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-quote-paper": GsQuotePaper;
  }
}
