import { html, nothing } from "lit";
import { LightElement } from "../components/base/light-element.ts";
import { customElement, state } from "lit/decorators.js";
import { api, ApiError } from "../api/client.ts";
import "../components/index.ts";
import { defaultLogin, demoPassword } from "./demo-users.ts";
import { localAiState, useLocalModel, type LocalAiState } from "../agent/ai-polyfill.ts";
import { collectionOf, formFields, toast, userSlug } from "./shared.ts";
import { site } from "./site.ts";

/** Login and create-first-user. Both fire `dashboard-auth` once signed in. */

const signedIn = (el: HTMLElement) => el.dispatchEvent(new CustomEvent("dashboard-auth", { bubbles: true }));

/** Demo second factor: any 6-digit code is accepted (no authenticator is set up). */
const CODE_LENGTH = 6;
/** How long the simulated passkey prompt takes. */
const PASSKEY_MS = 1200;

/**
 * Two-step login (a demo of passwordless sign-in): 1. email; 2. a 6-digit authenticator code or
 * the device's passkey. Both second factors are simulated — any 6 digits pass, the passkey
 * prompt resolves after a moment — and then the user is signed in to the mock backend with
 * their seeded password, which never appears in the UI.
 */
@customElement("dashboard-login")
export class DashboardLogin extends LightElement {
  @state() private step: "email" | "verify" = "email";
  /** Pre-filled with a demo user (switch roles from the dashboard afterwards). */
  @state() private email = defaultLogin?.email ?? "";
  @state() private code = "";
  @state() private error = "";
  /** The second factor in progress, if any. */
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

  /** Second factor passed: sign in to the backend. */
  private async _signIn() {
    try {
      await api.login(userSlug, this.email, demoPassword(this.email));
      toast("Welcome back.");
      signedIn(this);
    } catch (e) {
      this.error = (e as Error).message;
      this.busy = "";
    }
  }

  private async _verifyCode(code = this.code) {
    if (this.busy) return;
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(code)) {
      this.error = `Enter the ${CODE_LENGTH}-digit code from your authenticator app.`;
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
      label="Log in"
      @ui-submit=${(e: CustomEvent<{ data: FormData }>) => this._continue((e.detail.data.get("email") as string | null) ?? "")}
    >
      <ui-flex direction="col" gap="3">
        <ui-text variant="body-md" color="muted"
          >${site().branding.loginIntro ?? "A demo user is filled in; switch roles any time from the dashboard."}</ui-text
        >
        ${this.error ? html`<ui-alert tone="error">${this.error}</ui-alert>` : nothing}
        <ui-text-input
          legend="Email"
          name="email"
          type="email"
          autocomplete="username webauthn"
          .value=${this.email}
          required
          field-width="full"
          width="full"
        ></ui-text-input>
        <ui-button type="submit" color="primary" block>Continue</ui-button>
      </ui-flex>
    </ui-form>`;
  }

  private _verifyStep() {
    return html`<ui-form label="Verify it's you" @ui-submit=${() => this._verifyCode()}>
      <ui-flex direction="col" gap="4">
        <ui-flex align="center" justify="between" gap="2" wrap>
          <ui-text variant="body-md" color="muted">Signing in as <strong>${this.email}</strong></ui-text>
          <ui-button variant="text" size="xs" .disabled=${!!this.busy} @click=${() => this._back()}>Change</ui-button>
        </ui-flex>
        ${this.error ? html`<ui-alert tone="error">${this.error}</ui-alert>` : nothing}
        <ui-flex direction="col" gap="2">
          <ui-text emphasized>Authenticator code</ui-text>
          <ui-text variant="body-md" color="muted"
            >Enter the ${CODE_LENGTH}-digit code from your authenticator app.</ui-text
          >
          <ui-otp
            focus-on-show
            name="code"
            length=${CODE_LENGTH}
            color="primary"
            label="Authenticator code"
            .value=${this.code}
            .disabled=${!!this.busy}
            @ui-change=${(e: CustomEvent<{ value: string }>) => (this.code = e.detail.value)}
            @ui-complete=${(e: CustomEvent<{ value: string }>) => this._verifyCode(e.detail.value)}
          ></ui-otp>
          <ui-button type="submit" color="primary" block .disabled=${!!this.busy}>
            ${this.busy === "code" ? html`<ui-loading size="sm"></ui-loading> Verifying…` : "Verify and log in"}
          </ui-button>
        </ui-flex>
        <ui-divider>or</ui-divider>
        <ui-button variant="outlined" block .disabled=${!!this.busy} @click=${() => this._passkey()}>
          ${
            this.busy === "passkey"
              ? html`<ui-loading size="sm"></ui-loading> Waiting for your device…`
              : html`<ui-icon name="passkey"></ui-icon> Use a passkey`
          }
        </ui-button>
        <ui-text variant="body-sm" color="muted" align="center"
          >Demo: any ${CODE_LENGTH}-digit code works, and the passkey prompt is simulated.</ui-text
        >
      </ui-flex>
    </ui-form>`;
  }

  /** Chrome's on-device AI here: on, the downloadable model in use, or neither (offer it). */
  @state() private localAi: LocalAiState = "off";

  connectedCallback() {
    super.connectedCallback();
    void localAiState().then((s) => (this.localAi = s));
  }

  /** How to turn on Chrome's on-device AI (Saastama-Micro-3.5 and the AI helpers on every screen). */
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
      this.localAi === "native"
        ? "Chrome's on-device AI is on in this browser."
        : this.localAi === "local"
          ? "This browser uses the downloaded model."
          : "";
    return html`<ui-collapse heading="Turn on AI features" icon="arrow" mode="details">
      <ui-flex direction="col" gap="3">
        ${status ? html`<ui-text variant="body-md" color="success">${status}</ui-text>` : nothing}
        <ui-flex direction="col" gap="1">
          <ui-flex gap="2" align="center" wrap>
            <ui-text variant="title-sm">Switch on Chrome's on-device AI</ui-text>
            <ui-tag tone="primary">Recommended</ui-tag>
          </ui-flex>
          <ui-text variant="body-md"
            >In desktop Chrome, open <strong>chrome://flags</strong>, enable these flags, then click Relaunch:</ui-text
          >
          <ui-flex gap="1" wrap>${flags.map((f) => html`<ui-tag>${f}</ui-tag>`)}</ui-flex>
          <ui-text variant="body-sm" color="muted"
            >Also enable the Summarization, Writer, Rewriter, Proofreader, Translation and Language Detection APIs. For
            the first flag, choose "Enabled BypassPerfRequirement".</ui-text
          >
        </ui-flex>
        <ui-flex direction="col" gap="1">
          <ui-text variant="title-sm">Or download a model</ui-text>
          <ui-text variant="body-md">It works in any browser. It is slower and reads text only.</ui-text>
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
                    >${this.localAi === "loading" ? "Loading…" : "Download (800 MB)"}</ui-button
                  >
                </ui-flex>`
          }
        </ui-flex>
      </ui-flex>
    </ui-collapse>`;
  }

  render() {
    return html`<ui-flex justify="center" padding="4">
      <ui-box width="full" max="md" padding="fluid">
        <ui-flex direction="col" gap="4">
          <ui-card heading=${this.step === "email" ? "Log in" : "Verify it's you"}>
            ${this.step === "email" ? this._emailStep() : this._verifyStep()}
          </ui-card>
          ${this._onDeviceAi()}
        </ui-flex>
      </ui-box>
    </ui-flex>`;
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
      toast("Account created.");
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
        <ui-card heading="Create the first user">
          <ui-form label="Create the first user" @ui-submit=${() => this._submit()}>
            <ui-flex direction="col" gap="4">
              <ui-text variant="body-md" color="muted">The mock backend has no users yet.</ui-text>
              <ui-doc-form
                .fields=${formFields(c)}
                .value=${this.value}
                .errors=${this.errors}
                @ui-change=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
                  if (e.target === e.currentTarget) this.value = e.detail.value;
                }}
              ></ui-doc-form>
              <ui-text-input
                legend="Password *"
                type="password"
                autocomplete="new-password"
                required
                field-width="full"
                width="full"
                @input=${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}
              ></ui-text-input>
              ${this.errors.password ? html`<ui-text variant="body-md" color="error">${this.errors.password}</ui-text>` : nothing}
              <ui-button type="submit" color="primary" block>Create</ui-button>
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
