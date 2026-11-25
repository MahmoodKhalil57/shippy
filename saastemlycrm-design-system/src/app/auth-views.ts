import { html, nothing } from "lit";
import { LightElement } from "../components/base/light-element.ts";
import { customElement, state } from "lit/decorators.js";
import { api, ApiError } from "../api/client.ts";
import "../components/index.ts";
import { defaultLogin, demoPassword } from "./demo-users.ts";
import { localAiState, useLocalModel, type LocalAiState } from "../agent/ai-polyfill.ts";
import { collectionOf, formFields, toast, userSlug } from "./shared.ts";
import { site } from "./site.ts";
import { dir, m } from "../i18n/index.ts";
import type { IconName } from "../components/primitives/media/icon-names.ts";

const isolate = (s: string) => `${String.fromCharCode(0x2068)}${s}${String.fromCharCode(0x2069)}`;

const signedIn = (el: HTMLElement) => el.dispatchEvent(new CustomEvent("dashboard-auth", { bubbles: true }));

const CODE_LENGTH = 6;
const PASSKEY_MS = 1200;

@customElement("dashboard-login")
export class DashboardLogin extends LightElement {
  @state() private step: "email" | "verify" = "email";
  @state() private email = defaultLogin?.email ?? "";
  @state() private code = "";
  @state() private error = "";
  @state() private busy: "" | "code" | "passkey" = "";

  private _continue(email: string) {
    this.email = email.trim();
    this.error = "";
    this.code = "";
    if (this.email) this.step = "verify";
  }

  private _back() {
    this.step = "email";
    this.error = "";
    this.busy = "";
  }

  private async _signIn() {
    try {
      await api.login(userSlug, this.email, demoPassword(this.email));
      toast(m.auth_welcome_back());
      signedIn(this);
    } catch (e) {
      this.error = (e as Error).message;
      this.busy = "";
    }
  }

  private async _verifyCode(code = this.code) {
    if (this.busy) return;
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(code)) {
      this.error = m.auth_code_prompt({ length: CODE_LENGTH });
      return;
    }
    this.error = "";
    this.busy = "code";
    await this._signIn();
  }

  private async _passkey() {
    if (this.busy) return;
    this.error = "";
    this.busy = "passkey";
    await new Promise((r) => setTimeout(r, PASSKEY_MS));
    await this._signIn();
  }

  private _emailStep() {
    return html`<ui-form
      label=${m.auth_log_in()}
      @ui-submit=${(e: CustomEvent<{ data: FormData }>) => this._continue((e.detail.data.get("email") as string | null) ?? "")}
    >
      <ui-flex direction="col" gap="3">
        <ui-text variant="body-md" color="muted">${site().branding.loginIntro ?? m.auth_login_intro()}</ui-text>
        ${this.error ? html`<ui-alert tone="error">${this.error}</ui-alert>` : nothing}
        <ui-text-input
          legend=${m.auth_email()}
          name="email"
          type="email"
          autocomplete="username webauthn"
          .value=${this.email}
          required
          field-width="full"
          width="full"
        ></ui-text-input>
        <ui-button type="submit" color="primary" block>${m.auth_continue()}</ui-button>
      </ui-flex>
    </ui-form>`;
  }

  private _verifyStep() {
    return html`<ui-form label=${m.auth_verify_heading()} @ui-submit=${() => this._verifyCode()}>
      <ui-flex direction="col" gap="4">
        <ui-box surface="base-200" rounded="full" padding="2">
          <ui-flex align="center" gap="3">
            <ui-avatar initials=${this.email.slice(0, 2).toUpperCase()} size="xs" tone="secondary"></ui-avatar>
            <ui-flex direction="col" gap="0" fill>
              <ui-text as="span" variant="body-sm" color="muted">${m.auth_signing_in_as()}</ui-text>
              <!-- An address reads left to right in any language: cut at its end, on the page's side. -->
              <ui-text as="span" variant="label-lg" truncate dir="ltr" align=${dir() === "rtl" ? "right" : "left"}
                >${this.email}</ui-text
              >
            </ui-flex>
            <ui-button variant="text" size="sm" .disabled=${!!this.busy} @click=${() => this._back()}
              >${m.auth_change()}</ui-button
            >
          </ui-flex>
        </ui-box>
        ${this.error ? html`<ui-alert tone="error">${this.error}</ui-alert>` : nothing}
        <ui-flex direction="col" gap="4">
          <ui-flex direction="col" gap="1">
            <ui-text emphasized>${m.auth_code_label()}</ui-text>
            <ui-text variant="body-md" color="muted">${m.auth_code_prompt({ length: CODE_LENGTH })}</ui-text>
          </ui-flex>
          <ui-flex justify="center">
            <ui-otp
              focus-on-show
              name="code"
              length=${CODE_LENGTH}
              size="lg"
              color="primary"
              label=${m.auth_code_label()}
              .value=${this.code}
              .disabled=${!!this.busy}
              @ui-change=${(e: CustomEvent<{ value: string }>) => (this.code = e.detail.value)}
              @ui-complete=${(e: CustomEvent<{ value: string }>) => this._verifyCode(e.detail.value)}
            ></ui-otp>
          </ui-flex>
          <ui-button type="submit" color="primary" block .disabled=${!!this.busy}>
            ${this.busy === "code" ? html`<ui-loading size="sm"></ui-loading> ${m.auth_verifying()}` : m.auth_verify_and_log_in()}
          </ui-button>
        </ui-flex>
        <ui-divider>${m.auth_or()}</ui-divider>
        <ui-button variant="outlined" block .disabled=${!!this.busy} @click=${() => this._passkey()}>
          ${
            this.busy === "passkey"
              ? html`<ui-loading size="sm"></ui-loading> ${m.auth_passkey_waiting()}`
              : html`<ui-icon name="passkey"></ui-icon> ${m.auth_passkey_use()}`
          }
        </ui-button>
        <ui-text variant="body-sm" color="muted" align="center">${m.auth_demo_note({ length: CODE_LENGTH })}</ui-text>
      </ui-flex>
    </ui-form>`;
  }

  @state() private localAi: LocalAiState = "off";

  connectedCallback() {
    super.connectedCallback();
    void localAiState().then((s) => (this.localAi = s));
  }

  private _onDeviceAi() {
    const flags = [
      "#optimization-guide-on-device-model",
      "#prompt-api",
      "#prompt-api-multimodal-input",
      "#prompt-api-tool-use",
      "#prompt-api-sampling-mode",
      "#on-device-model-speculative-decoding",
      "#gemma4-for-built-in-ai",
      "#decisions-api",
    ];
    const status =
      this.localAi === "native" ? m.auth_ai_native_on() : this.localAi === "local" ? m.auth_ai_local_on() : "";
    return html`<ui-collapse heading=${m.auth_ai_heading()} icon="arrow" mode="details">
      <ui-flex direction="col" gap="3">
        ${status ? html`<ui-text variant="body-md" color="success">${status}</ui-text>` : nothing}
        <ui-flex direction="col" gap="1">
          <ui-flex gap="2" align="center" wrap>
            <ui-text variant="title-sm">${m.auth_ai_native_title()}</ui-text>
            <ui-tag tone="primary">${m.auth_ai_recommended()}</ui-tag>
          </ui-flex>
          <ui-text variant="body-md">${m.auth_ai_flags({ url: isolate("chrome://flags") })}</ui-text>
          <ui-flex gap="1" wrap>${flags.map((f) => html`<ui-tag lang="en" dir="ltr">${f}</ui-tag>`)}</ui-flex>
          <ui-text variant="body-sm" color="muted">${m.auth_ai_flags_more()}</ui-text>
        </ui-flex>
        <ui-flex direction="col" gap="1">
          <ui-text variant="title-sm">${m.auth_ai_download_title()}</ui-text>
          <ui-text variant="body-md">${m.auth_ai_download_body()}</ui-text>
          ${
            this.localAi === "native" || this.localAi === "local"
              ? nothing
              : html`<ui-flex>
                  <ui-button
                    size="xs"
                    ?disabled=${this.localAi === "loading"}
                    @click=${async () => {
                      this.localAi = "loading";
                      await useLocalModel().catch(() => undefined);
                      this.localAi = await localAiState();
                    }}
                    >${this.localAi === "loading" ? m.auth_ai_loading() : m.auth_ai_download({ size: "800 MB" })}</ui-button
                  >
                </ui-flex>`
          }
        </ui-flex>
      </ui-flex>
    </ui-collapse>`;
  }

  render() {
    const brand = site().branding;
    return html`<ui-box height="screen" overflow="auto" backdrop center>
      <ui-box width="full" max="md" padding="fluid">
        <ui-flex direction="col" gap="6">
          <ui-flex align="center" justify="between" gap="2">
            <ui-flex align="center" gap="3" shrink>
              <ui-avatar size="xs" tone="secondary"><ui-icon name=${brand.icon as IconName}></ui-icon></ui-avatar>
              <ui-text as="span" variant="title-lg" truncate>${brand.name}</ui-text>
            </ui-flex>
            <ui-flex align="center" gap="1">
              <ui-appearance kind="language"></ui-appearance>
              <ui-appearance kind="theme" persist></ui-appearance>
            </ui-flex>
          </ui-flex>
          <ui-card heading=${this.step === "email" ? m.auth_log_in() : m.auth_verify_heading()}>
            ${this.step === "email" ? this._emailStep() : this._verifyStep()}
          </ui-card>
          ${this._onDeviceAi()}
        </ui-flex>
      </ui-box>
    </ui-box>`;
  }
}

@customElement("dashboard-first-user")
export class DashboardFirstUser extends LightElement {
  @state() private value: Record<string, unknown> = {};
  @state() private errors: Record<string, string> = {};
  @state() private password = "";

  private async _submit() {
    try {
      await api.firstRegister(userSlug, { ...this.value, password: this.password });
      toast(m.auth_account_created());
      signedIn(this);
    } catch (e) {
      if (e instanceof ApiError) this.errors = e.fieldErrors;
      toast((e as Error).message, "error");
    }
  }

  render() {
    const c = collectionOf(userSlug)!;
    return html`<ui-flex justify="center" padding="4">
      <ui-box width="full" max="lg" padding="fluid">
        <ui-card heading=${m.auth_first_user_heading()}>
          <ui-form label=${m.auth_first_user_heading()} @ui-submit=${() => this._submit()}>
            <ui-flex direction="col" gap="4">
              <ui-text variant="body-md" color="muted">${m.auth_first_user_intro()}</ui-text>
              <ui-doc-form
                .fields=${formFields(c)}
                .value=${this.value}
                .errors=${this.errors}
                @ui-change=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
                  if (e.target === e.currentTarget) this.value = e.detail.value;
                }}
              ></ui-doc-form>
              <ui-text-input
                legend=${m.auth_password_required()}
                type="password"
                autocomplete="new-password"
                required
                field-width="full"
                width="full"
                @input=${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}
              ></ui-text-input>
              ${this.errors.password ? html`<ui-text variant="body-md" color="error">${this.errors.password}</ui-text>` : nothing}
              <ui-button type="submit" color="primary" block>${m.auth_create()}</ui-button>
            </ui-flex>
          </ui-form>
        </ui-card>
      </ui-box>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-login": DashboardLogin;
    "dashboard-first-user": DashboardFirstUser;
  }
}
