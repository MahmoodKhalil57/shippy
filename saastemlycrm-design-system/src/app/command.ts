import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../api/client.ts";
import type { Doc } from "../contracts/config.ts";
import { LightElement } from "../components/base/light-element.ts";
import type { IconName } from "../components/primitives/media/icon.ts";
import type { MenuItem } from "../components/primitives/navigation/menu.ts";
import "../components/index.ts";
import { StoreController, closePalette, isBookmarked, openPalette, palette } from "../stores/index.ts";
import type { Access } from "./app.ts";
import { highlightParts, search, type EntryKind, type SearchEntry, type SearchHit } from "./command-search.ts";
import {
  groupIcon,
  cellText,
  columnsOf,
  config,
  dashboardPath,
  globalLabel,
  groupOf,
  labels,
  navigate,
  settings,
  titleOf,
  toggleBookmark,
  useAsTitle,
} from "./shared.ts";
import { m } from "../i18n/index.ts";

const SECTION: Record<EntryKind, () => string> = {
  action: () => m.command_section_actions(),
  page: () => m.command_section_pages(),
  record: () => m.command_section_records(),
};
const keywords = (say: () => string) =>
  say()
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);
const PER_SECTION: Record<EntryKind, number> = { action: 5, page: 6, record: 12 };
const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

@customElement("dashboard-command")
export class DashboardCommand extends LightElement {
  @property({ attribute: false }) access!: Access;
  @property() path = "";
  @property() pageTitle = "";
  @property({ attribute: false }) onLogout?: () => void;
  #palette = new StoreController(this, palette);
  @state() private records: SearchEntry[] = [];
  @state() private indexing = false;
  #icons = new Map<string, IconName>();

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._onGlobalKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onGlobalKey);
  }

  private _onGlobalKey = (e: KeyboardEvent) => {
    const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select, [contenteditable]");
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing && !palette.get().open)) {
      e.preventDefault();
      this._open();
    }
  };

  private _open() {
    openPalette();
    void this._indexRecords();
  }

  private _can = (slug: string, op: "read" | "create" = "read") =>
    this.access.collections[slug]?.[op].permission === true;

  private _entry(e: SearchEntry, icon: IconName): SearchEntry {
    this.#icons.set(e.id, icon);
    return e;
  }

  private _static(): SearchEntry[] {
    const collections = config.collections.filter((c) => c.admin?.hidden !== true && this._can(c.slug));
    const desc = (c: { admin?: { description?: unknown } }) =>
      typeof c.admin?.description === "string" ? c.admin.description : undefined;
    const pages = [
      this._entry(
        {
          id: "page:dashboard",
          kind: "page",
          title: m.app_nav_dashboard(),
          group: m.app_nav_home(),
          description: m.command_dashboard_description(),
          href: dashboardPath(),
          keywords: ["dashboard", "overview", "home", ...keywords(m.command_dashboard_keywords)],
        },
        "home",
      ),
      ...collections.map((c) =>
        this._entry(
          {
            id: `page:${c.slug}`,
            kind: "page",
            title: labels(c).plural,
            group: groupOf(c),
            description: desc(c) ?? m.command_collection_all({ plural: labels(c).plural.toLowerCase() }),
            keywords: [labels(c).singular, c.slug],
            href: dashboardPath("collections", c.slug),
          },
          groupIcon(groupOf(c)),
        ),
      ),
      ...(config.globals ?? [])
        .filter((g) => this.access.globals[g.slug]?.read.permission)
        .map((g) =>
          this._entry(
            {
              id: `page:global:${g.slug}`,
              kind: "page",
              title: globalLabel(g),
              group: m.command_group_configuration(),
              description: desc(g),
              href: dashboardPath("globals", g.slug),
            },
            "settings",
          ),
        ),
      this._entry(
        {
          id: "page:account",
          kind: "page",
          title: m.app_title_account(),
          group: m.command_group_you(),
          description: m.command_account_description(),
          keywords: ["account", "profile", "password"],
          href: dashboardPath("account"),
        },
        "user",
      ),
    ];
    const here = isBookmarked(this.path);
    const actions = [
      ...collections
        .filter((c) => this._can(c.slug, "create"))
        .map((c) =>
          this._entry(
            {
              id: `action:create:${c.slug}`,
              kind: "action",
              title: m.command_create_title({ singular: labels(c).singular }),
              group: labels(c).plural,
              description: m.command_create_description({ singular: labels(c).singular.toLowerCase() }),
              keywords: ["create", "add", "new", ...keywords(m.command_create_keywords)],
              href: dashboardPath("collections", c.slug, "create"),
            },
            "plus",
          ),
        ),
      this._entry(
        {
          id: "action:bookmark",
          kind: "action",
          title: here ? m.command_bookmark_remove() : m.command_bookmark_add(),
          group: this.pageTitle || m.command_this_page(),
          description: m.command_bookmark_description(),
          keywords: ["bookmark", "favourite", "favorite", ...keywords(m.command_bookmark_keywords)],
          run: () => toggleBookmark({ href: this.path, label: this.pageTitle }),
        },
        "star",
      ),
      this._entry(
        {
          id: "action:contrast",
          kind: "action",
          title: m.command_contrast_title(),
          group: m.command_group_accessibility(),
          description: m.command_contrast_description(),
          keywords: [
            "accessibility",
            "a11y",
            "wcag",
            "contrast",
            "audit",
            "legibility",
            "colour",
            "color",
            "layout",
            "overflow",
            "responsive",
            ...keywords(m.command_contrast_keywords),
          ],
          run: () => window.dispatchEvent(new Event("ui-contrast-audit")),
        },
        "contrast",
      ),
      ...(this.onLogout
        ? [
            this._entry(
              {
                id: "action:logout",
                kind: "action",
                title: m.app_log_out(),
                group: m.command_group_you(),
                keywords: ["logout", "sign out", ...keywords(m.command_logout_keywords)],
                run: this.onLogout,
              },
              "arrow-right",
            ),
          ]
        : []),
    ];
    return [...actions, ...pages];
  }

  private async _indexRecords() {
    if (this.indexing) return;
    this.indexing = true;
    const collections = config.collections.filter(
      (c) => c.admin?.hidden !== true && this._can(c.slug) && useAsTitle(c) !== "id",
    );
    const lists = await Promise.all(
      collections.map(async (c) => {
        try {
          const { docs } = await api.find(c.slug, { limit: 200, depth: 1 });
          return docs.map((d: Doc) => {
            const columns = columnsOf(c).filter((f) => f.name !== useAsTitle(c) && f.name !== "updatedAt");
            const values = columns.map((f) => cellText(f, d[f.name!])).filter((v) => v && v !== "—");
            return this._entry(
              {
                id: `record:${c.slug}:${d.id}`,
                kind: "record",
                title: titleOf(c, d),
                group: labels(c).plural,
                description: values.slice(0, 3).join(" · "),
                keywords: [...values, labels(c).singular, String(d.id)],
                href: dashboardPath("collections", c.slug, String(d.id)),
              },
              groupIcon(groupOf(c)),
            );
          });
        } catch {
          return [];
        }
      }),
    );
    this.records = lists.flat();
    this.indexing = false;
  }

  private _sections(query: string): { kind: EntryKind; hits: SearchHit[] }[] {
    const all = [...this._static(), ...this.records];
    if (!query.trim()) {
      const pick = (kind: EntryKind, n: number) =>
        all
          .filter((e) => e.kind === kind)
          .slice(0, n)
          .map((entry) => ({ entry, score: 0, ranges: [], descriptionRanges: [], related: false }));
      return [
        { kind: "page", hits: pick("page", 6) },
        { kind: "action", hits: pick("action", 4) },
      ];
    }
    const hits = search(all, query, 200, settings.search?.synonyms);
    const sections = (["action", "page", "record"] as EntryKind[])
      .map((kind) => ({ kind, hits: hits.filter((h) => h.entry.kind === kind).slice(0, PER_SECTION[kind]) }))
      .filter((s) => s.hits.length);
    const rank = (s: { kind: EntryKind; hits: SearchHit[] }) => s.hits[0]!.score + (s.kind === "record" ? 0 : 0.1);
    return sections.sort((a, b) => rank(b) - rank(a));
  }

  private _label(hit: SearchHit): TemplateResult {
    const { entry } = hit;
    const marked = (text: string, ranges: SearchHit["ranges"]) =>
      highlightParts(text, ranges).map((p) =>
        p.match ? html`<ui-text as="mark" highlight>${p.text}</ui-text>` : p.text,
      );
    const title = marked(entry.title, hit.ranges);
    return html`<ui-flex direction="col" gap="0" shrink>
      <ui-text as="div" variant="label-lg" truncate
        ><ui-text as="span" color="muted">${entry.group} › </ui-text>${title}</ui-text
      >
      ${entry.description ? html`<ui-text as="div" variant="body-sm" color="muted" truncate>${marked(entry.description, hit.descriptionRanges)}</ui-text>` : nothing}
    </ui-flex>`;
  }

  private _activate(entry: SearchEntry) {
    closePalette();
    if (entry.run) entry.run();
    else if (entry.href) navigate(entry.href);
  }

  private _onKey(e: KeyboardEvent, flat: SearchHit[]) {
    const { highlighted } = palette.get();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!flat.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      palette.set({ highlighted: (highlighted + step + flat.length) % flat.length });
    } else if (e.key === "Enter" && flat[highlighted]) {
      e.preventDefault();
      this._activate(flat[highlighted].entry);
    }
  }

  render() {
    const { open, query, highlighted } = this.#palette.value;
    const sections = open ? this._sections(query) : [];
    const flat = sections.flatMap((s) => s.hits);
    let index = 0;
    const items: MenuItem[] = sections.flatMap((s) => [
      {
        label: query.trim()
          ? SECTION[s.kind]()
          : s.kind === "page"
            ? m.command_suggest_pages()
            : m.command_suggest_actions(),
        heading: true,
      },
      ...s.hits.map((hit) => {
        const i = index++;
        return {
          label: this._label(hit),
          icon: html`<ui-icon name=${this.#icons.get(hit.entry.id) ?? "grid"}></ui-icon>`,
          href: hit.entry.run ? undefined : hit.entry.href,
          value: hit.entry.id,
          focus: i === highlighted,
          badge: hit.related ? m.command_related() : undefined,
        } satisfies MenuItem;
      }),
    ]);
    const byId = new Map(flat.map((h) => [h.entry.id, h.entry]));
    const q = query.trim();
    return html`<ui-search
        launcher
        label=${m.command_launcher_label()}
        shortcut=${mac ? "⌘+K" : "Ctrl+K"}
        @click=${() => this._open()}
      ></ui-search>
      <ui-modal
        placement="spotlight"
        width="palette"
        sections
        ?open=${open}
        @ui-close=${() => closePalette()}
        @keydown=${(e: KeyboardEvent) => this._onKey(e, flat)}
      >
        <ui-flex slot="header" align="center" gap="2" padding="2">
          <ui-search
            variant="bare"
            size="lg"
            autocomplete="off"
            label=${m.command_input_label()}
            .value=${query}
            @input=${(e: Event) => palette.set({ query: (e.target as HTMLInputElement).value, highlighted: 0 })}
          ></ui-search>
          <ui-kbd size="sm" lang="en">Esc</ui-kbd>
        </ui-flex>
        ${
          items.length
            ? html`<ui-menu
                width="full"
                surface="false"
                nowrap
                .items=${items}
                @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
                  const entry = byId.get(String(e.detail.item.value));
                  if (entry?.run) entry.run();
                  closePalette();
                }}
              ></ui-menu>`
            : html`<ui-flex direction="col" align="center" gap="1" padding="8">
                <ui-text emphasized>${m.command_no_results({ query: q })}</ui-text>
                <ui-text variant="body-md" color="muted">${m.command_no_results_hint()}</ui-text>
              </ui-flex>`
        }
        ${this.indexing ? html`<ui-flex justify="center" padding="2"><ui-loading size="sm"></ui-loading></ui-flex>` : nothing}
        <ui-flex slot="footer" justify="between" align="center" gap="3">
          <ui-text variant="body-sm" color="muted" truncate
            >${q ? m.command_results({ count: flat.length }) : m.command_type_to_search()}</ui-text
          >
          <ui-flex align="center" gap="3">
            <ui-flex align="center" gap="1"
              ><ui-text as="span" variant="body-sm" color="muted">${m.command_navigate()}</ui-text
              ><ui-kbd size="xs">↑</ui-kbd><ui-kbd size="xs">↓</ui-kbd></ui-flex
            >
            <ui-flex align="center" gap="1"
              ><ui-text as="span" variant="body-sm" color="muted">${m.command_open()}</ui-text
              ><ui-kbd size="xs">↵</ui-kbd></ui-flex
            >
          </ui-flex>
        </ui-flex>
      </ui-modal>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-command": DashboardCommand;
  }
}
