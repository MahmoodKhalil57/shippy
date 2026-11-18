import { html, nothing } from "lit";
import { LightElement } from "../../components/base/light-element.ts";
import { customElement, state } from "lit/decorators.js";
import { api, ApiError } from "../../cms/client.ts";
import "../../components/index.ts";
import { cellText, collectionOf, dataFields, fieldsOf, formFields, toast, userSlug } from "./shared.ts";

/** Login and create-first-user. Both fire `dashboard-auth` once signed in. */

const signedIn = (el: HTMLElement) => el.dispatchEvent(new CustomEvent("dashboard-auth", { bubbles: true }));

interface SeedUser {
  name?: string;
  email: string;
  password: string;
  role?: string;
}

/** Seeded users with their passwords (src/cms/seed/<users>.json). */
const seeds = import.meta.glob<SeedUser[]>("../../cms/seed/*.json", { eager: true, import: "default" });
const seedUsers = (seeds[`../../cms/seed/${userSlug}.json`] ?? []).filter((u) => u.email && u.password);

/** A role's option label ("Sales", "Management approver"…), when the user collection has a `role` field. */
const roleField = dataFields(fieldsOf(collectionOf(userSlug)!)).find((f) => f.name === "role");
const roleLabel = (role?: string) => (roleField && role ? cellText(roleField, role) : (role ?? ""));

/** One-click login: one seeded user per role (the first one seeded with it). */
const roleLogins = seedUsers.filter((u, i, all) => u.role && all.findIndex((x) => x.role === u.role) === i);

@customElement("dashboard-login")
export class DashboardLogin extends LightElement {
  @state() private error = "";
  @state() private busy = false;
  @state() private email = "";
  @state() private password = "";

  private _fill(user: SeedUser) {
    this.email = user.email;
    this.password = user.password;
    this.error = "";
  }

  private async _submit(data: FormData) {
    this.busy = true;
    this.error = "";
    try {
      await api.login(
        userSlug,
        (data.get("email") as string | null) ?? "",
        (data.get("password") as string | null) ?? "",
      );
      toast("Welcome back.");
      signedIn(this);
    } catch (e) {
      this.error = (e as Error).message;
    } finally {
      this.busy = false;
    }
  }

  render() {
    return html`<ui-flex justify="center" padding="4">
      <ui-box width="full md:md" padding="4 md:16">
        <ui-card heading="Log in" variant="border">
          <ui-form label="Log in" @ui-submit=${(e: CustomEvent<{ data: FormData }>) => this._submit(e.detail.data)}>
            <ui-flex direction="col" gap="3">
              <ui-text size="sm" color="muted"
                >Golden Sea dashboard. Pick a role below to fill in a seeded login for it.</ui-text
              >
              ${this.error ? html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>` : nothing}
              <ui-text-input
                legend="Email"
                name="email"
                type="email"
                autocomplete="email"
                .value=${this.email}
                required
                field-width="full"
                width="full"
              ></ui-text-input>
              <ui-text-input
                legend="Password"
                name="password"
                type="password"
                autocomplete="current-password"
                .value=${this.password}
                required
                field-width="full"
                width="full"
              ></ui-text-input>
              <ui-button type="submit" color="primary" block .disabled=${this.busy}>Log in</ui-button>
              ${
                roleLogins.length
                  ? html`<ui-divider>Log in as</ui-divider>
                      <ui-flex direction="col" gap="2">
                        ${roleLogins.map(
                          (u) =>
                            html`<ui-button
                              variant="outline"
                              size="sm"
                              justify="start"
                              block
                              .label=${`Fill in the ${roleLabel(u.role)} login (${u.name ?? u.email})`}
                              @click=${() => this._fill(u)}
                            >
                              ${roleLabel(u.role)}
                            </ui-button>`,
                        )}
                      </ui-flex>`
                  : nothing
              }
            </ui-flex>
          </ui-form>
        </ui-card>
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
      <ui-box width="full md:lg" padding="4 md:16">
        <ui-card heading="Create the first user" variant="border">
          <ui-form label="Create the first user" @ui-submit=${() => this._submit()}>
            <ui-flex direction="col" gap="4">
              <ui-text size="sm" color="muted">The mock backend has no users yet.</ui-text>
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
              ${this.errors.password ? html`<ui-text size="sm" color="error">${this.errors.password}</ui-text>` : nothing}
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
