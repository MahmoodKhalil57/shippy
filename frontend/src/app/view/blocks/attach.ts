import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { FieldLike } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import "../../../components/index.ts";
import { toast } from "../../shared.ts";
import { action as actionButton } from "../blocks.ts";
import { defineBlock, type ViewContext } from "../registry.ts";
import type { ViewBlocks } from "../schema.ts";

/**
 * `attach`: an action that needs a file as evidence (a signed note, a scan, a photo). Its dialog
 * asks for the file and a few fields; the file is uploaded to `file.upload.collection` first and
 * its id joins the request body as `file.name`. Optional: a sample file for a demo (offered on a
 * button, or used when nothing is picked), dictation into a field, and filling fields from a
 * photo with AI.
 */

declare module "../schema.ts" {
  interface ViewBlocks {
    attach: {
      type: "attach";
      /** The button that opens the dialog. */
      action: Pick<Action, "label" | "icon" | "variant" | "tone" | "disabled" | "reason">;
      /** A line next to the button. */
      text?: string;
      heading: string;
      intro?: string;
      file: {
        name: string;
        legend: string;
        hint?: string;
        accept?: string;
        required?: boolean;
        upload: { collection: string; data?: Record<string, unknown> };
        /**
         * A stand-in file: offered on a button with this `label`, or used when nothing is picked
         * (no label). `{field}` in a line is that field's value.
         */
        sample?: { filename: string; lines: string[]; label?: string };
      };
      fields?: PromptField[];
      /** Speak into a text field (appended). */
      dictate?: { label: string; field: string };
      /** Read these values from a photo; `into` maps a value to a field (`append` adds a line). */
      extract?: {
        label: string;
        what: string;
        fields: { id: string; label: string; hint?: string }[];
        into: Record<string, { field: string; append?: boolean }>;
      };
      /** A warning shown while no file is attached. */
      missing?: string;
      call: NonNullable<Action["call"]>;
      confirmLabel: string;
      done?: string;
    };
  }
}

type Spec = ViewBlocks["attach"];
const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

@customElement("app-attach")
export class AppAttach extends LightElement {
  @property({ attribute: false }) spec!: Spec;
  @property({ attribute: false }) ctx!: ViewContext;
  @state() private open = false;
  @state() private file: File | null = null;
  @state() private draft: Record<string, unknown> = {};
  @state() private busy = false;
  @state() private failed = "";

  private _open() {
    this.file = null;
    this.failed = "";
    this.draft = Object.fromEntries((this.spec.fields ?? []).map((f) => [f.name, f.defaultValue]));
    this.open = true;
  }

  private _sample() {
    const s = this.spec.file.sample!;
    const lines = s.lines.map((l) => l.replace(/\{(\w+)\}/g, (_, k: string) => str(this.draft[k])));
    return new File([lines.join("\n")], s.filename, { type: "application/pdf" });
  }

  private get _missing() {
    const { file, fields = [] } = this.spec;
    const empty = fields.filter(
      (f) => f.required && (this.draft[f.name] === undefined || str(this.draft[f.name]).trim() === ""),
    );
    return { file: file.required && !this.file, fields: empty };
  }

  private async _confirm() {
    const s = this.spec;
    const missing = this._missing;
    if (missing.file || missing.fields.length) {
      this.failed = missing.file
        ? `Attach ${s.file.legend.toLowerCase()}.`
        : `Fill in ${missing.fields.map((f) => f.label ?? f.name).join(", ")}.`;
      return;
    }
    this.busy = true;
    try {
      const file = this.file ?? (s.file.sample && !s.file.sample.label ? this._sample() : null);
      const id = file ? (await api.create(s.file.upload.collection, s.file.upload.data ?? {}, file)).doc.id : null;
      await api.call(s.call.method ?? "POST", s.call.path, { ...s.call.body, ...this.draft, [s.file.name]: id });
      this.open = false;
      if (s.done) toast(s.done);
      this.ctx.reload();
    } catch (e) {
      this.failed = (e as Error).message || "That didn't work.";
    } finally {
      this.busy = false;
    }
  }

  private _set(field: string, value: string, append = false) {
    const now = str(this.draft[field]);
    this.draft = { ...this.draft, [field]: append && now ? `${now}\n${value}` : value };
  }

  render() {
    const s = this.spec;
    const f = s.file;
    return html`<ui-flex gap="2" align="center" wrap>
        ${actionButton({ ...s.action }, { ...this.ctx, run: () => this._open() })}
        ${s.text ? html`<ui-text variant="body-sm" color="muted">${s.text}</ui-text>` : nothing}
        ${
          s.action.disabled && s.action.reason
            ? html`<ui-text variant="body-sm" color="muted">${s.action.reason}</ui-text>`
            : nothing
        }
      </ui-flex>
      <ui-modal
        .open=${this.open}
        .heading=${s.heading}
        .confirmLabel=${s.confirmLabel}
        .confirmTone=${s.action.tone ?? "primary"}
        ?confirm-disabled=${this.busy || this._missing.file || this._missing.fields.length > 0}
        @ui-confirm=${() => void this._confirm()}
        @ui-close=${() => (this.open = false)}
      >
        <ui-flex direction="col" gap="3">
          ${s.intro ? html`<ui-text variant="body-md" pre-line>${s.intro}</ui-text>` : nothing}
          <ui-file-input
            .legend=${f.legend}
            .accept=${f.accept}
            .hint=${this.file ? this.file.name : (f.hint ?? "")}
            @ui-change=${(e: CustomEvent<{ files: FileList | null }>) => {
              e.stopPropagation();
              this.file = e.detail.files?.[0] ?? null;
            }}
          ></ui-file-input>
          ${
            f.sample?.label && !this.file
              ? html`<ui-flex
                  ><ui-button size="xs" variant="text" @click=${() => (this.file = this._sample())}
                    >${f.sample.label}</ui-button
                  ></ui-flex
                >`
              : nothing
          }
          ${
            s.fields?.length
              ? html`<ui-doc-form
                  .fields=${s.fields as unknown as FieldLike[]}
                  .value=${this.draft}
                  @ui-change=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
                    if (e.target === e.currentTarget) this.draft = e.detail.value;
                  }}
                ></ui-doc-form>`
              : nothing
          }
          ${
            s.dictate
              ? html`<ui-ai-dictate
                  .label=${s.dictate.label}
                  @ui-select=${(e: CustomEvent<{ value: string }>) => this._set(s.dictate!.field, e.detail.value, true)}
                ></ui-ai-dictate>`
              : nothing
          }
          ${
            s.extract
              ? html`<ui-ai-extract
                  source="file"
                  pickable
                  use-label="Fill in"
                  .label=${s.extract.label}
                  .what=${s.extract.what}
                  .fields=${s.extract.fields}
                  @ui-select=${(e: CustomEvent<{ values: Record<string, string | number | null> }>) => {
                    for (const [id, to] of Object.entries(s.extract!.into)) {
                      const v = e.detail.values[id];
                      if (v) this._set(to.field, String(v), to.append);
                    }
                  }}
                ></ui-ai-extract>`
              : nothing
          }
          ${s.missing && !this.file ? html`<ui-alert tone="warning">${s.missing}</ui-alert>` : nothing}
          ${this.failed ? html`<ui-alert tone="error">${this.failed}</ui-alert>` : nothing}
        </ui-flex>
      </ui-modal>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-attach": AppAttach;
  }
}

defineBlock("attach", (b, ctx) => html`<app-attach .spec=${b} .ctx=${ctx}></app-attach>`);
