import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../cms/client.ts";
import type { Doc } from "../../cms/types.ts";
import { LightElement } from "../../components/base/light-element.ts";
import type { IconName } from "../../components/primitives/media/icon.ts";
import type { MenuItem } from "../../components/primitives/navigation/menu.ts";
import "../../components/index.ts";
import {
  StoreController,
  closePalette,
  isBookmarked,
  openPalette,
  palette,
  toggleBookmark,
} from "../../stores/index.ts";
import type { Access } from "./app.ts";
import { highlightParts, search, type EntryKind, type SearchEntry, type SearchHit } from "./command-search.ts";
import {
  GROUP_ICONS,
  cellText,
  columnsOf,
  config,
  dashboardPath,
  globalLabel,
  groupOf,
  labels,
  navigate,
  titleOf,
  useAsTitle,
} from "./shared.ts";

const SECTION: Record<EntryKind, string> = { action: "Actions", page: "Pages", record: "Records" };
const PER_SECTION: Record<EntryKind, number> = { action: 5, page: 6, record: 12 };
const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * The header's search: a button that opens a command palette (also Ctrl/⌘ K, or "/"). It searches
 * actions, pages and every readable record with fuzzy + semantic matching (./command-search.ts)
 * and lists them like a docs search: "Group › Title" with the matched characters highlighted and
 * a description underneath. ↑ ↓ move, Enter opens, Esc closes.
 */
@customElement("dashboard-command")
export class DashboardCommand extends LightElement {
  @property({ attribute: false }) access!: Access;
  /** Current page, for "Bookmark this page". */
  @property() path = "";
  @property() pageTitle = "";
  @property({ attribute: false }) onLogout?: () => void;
  #palette = new StoreController(this, palette);
  /** Records index, built when the palette opens. */
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

  // ---------------------------------------------------------------- index

  private _can = (slug: string, op: "read" | "create" = "read") =>
    this.access.collections[slug]?.[op].permission === true;

  private _entry(e: SearchEntry, icon: IconName): SearchEntry {
    this.#icons.set(e.id, icon);
    return e;
  }

  /** Pages and actions (no data needed). */
  private _static(): SearchEntry[] {
    const collections = config.collections.filter((c) => c.admin?.hidden !== true && this._can(c.slug));
    const desc = (c: { admin?: { description?: unknown } }) =>
      typeof c.admin?.description === "string" ? c.admin.description : undefined;
    const pages = [
      this._entry(
        {
          id: "page:dashboard",
          kind: "page",
          title: "Dashboard",
          group: "Home",
          description: "Your day, KPIs and charts",
          href: dashboardPath(),
          keywords: ["overview", "home"],
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
            description: desc(c) ?? `All ${labels(c).plural.toLowerCase()}`,
            keywords: [labels(c).singular, c.slug],
            href: dashboardPath("collections", c.slug),
          },
          GROUP_ICONS[groupOf(c)] ?? "grid",
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
              group: "Configuration",
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
          title: "Account",
          group: "You",
          description: "Your profile and password",
          href: dashboardPath("account"),
        },
        "user",
      ),
      this._entry(
        {
          id: "page:mock-data",
          kind: "page",
          title: "Mock data",
          group: "Mock backend",
          description: "Export, import or reset the demo data",
          href: dashboardPath("mock-data"),
        },
        "database",
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
              title: `Create new ${labels(c).singular}`,
              group: labels(c).plural,
              description: `Open a blank ${labels(c).singular.toLowerCase()} form`,
              keywords: ["add", "new"],
              href: dashboardPath("collections", c.slug, "create"),
            },
            "plus",
          ),
        ),
      this._entry(
        {
          id: "action:bookmark",
          kind: "action",
          title: here ? "Remove this page from bookmarks" : "Bookmark this page",
          group: this.pageTitle || "This page",
          description: "Bookmarks are listed in the side panel",
          run: () => toggleBookmark({ href: this.path, label: this.pageTitle }),
        },
        "star",
      ),
      ...(this.onLogout
        ? [
            this._entry(
              { id: "action:logout", kind: "action", title: "Log out", group: "You", run: this.onLogout },
              "arrow-right",
            ),
          ]
        : []),
    ];
    return [...actions, ...pages];
  }

  /** Every readable record (title, list columns and other text), from the local backend. */
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
              GROUP_ICONS[groupOf(c)] ?? "grid",
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

  // ---------------------------------------------------------------- results

  /** Sections in order of their best hit, each capped; with no query, suggestions. */
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
    const hits = search(all, query, 200);
    const sections = (["action", "page", "record"] as EntryKind[])
      .map((kind) => ({ kind, hits: hits.filter((h) => h.entry.kind === kind).slice(0, PER_SECTION[kind]) }))
      .filter((s) => s.hits.length);
    // Best section first; pages and actions win near-ties (they're where people usually want to go).
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
      <ui-text as="div" size="sm" weight="medium" truncate
        ><ui-text as="span" color="muted">${entry.group} › </ui-text>${title}</ui-text
      >
      ${entry.description ? html`<ui-text as="div" size="xs" color="muted" truncate>${marked(entry.description, hit.descriptionRanges)}</ui-text>` : nothing}
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
      { label: query.trim() ? SECTION[s.kind] : s.kind === "page" ? "Go to" : "Quick actions", heading: true },
      ...s.hits.map((hit) => {
        const i = index++;
        return {
          label: this._label(hit),
          icon: html`<ui-icon name=${this.#icons.get(hit.entry.id) ?? "grid"}></ui-icon>`,
          href: hit.entry.run ? undefined : hit.entry.href,
          value: hit.entry.id,
          focus: i === highlighted,
          badge: hit.related ? "related" : undefined,
        } satisfies MenuItem;
      }),
    ]);
    const byId = new Map(flat.map((h) => [h.entry.id, h.entry]));
    const q = query.trim();
    return html`<ui-button variant="field" label="Search actions, pages and records" @click=${() => this._open()}>
        <ui-icon name="search" size="sm"></ui-icon>
        <ui-text as="span" size="sm" truncate>Search actions, pages, records…</ui-text>
        <ui-kbd size="xs" keys=${mac ? "⌘+K" : "Ctrl+K"}></ui-kbd>
      </ui-button>
      <ui-modal
        placement="spotlight"
        width="palette"
        sections
        ?open=${open}
        @ui-close=${() => closePalette()}
        @keydown=${(e: KeyboardEvent) => this._onKey(e, flat)}
      >
        <ui-flex slot="header" align="center" gap="2" padding="2">
          <ui-text-input
            type="search"
            icon="search"
            variant="ghost"
            size="lg"
            width="full"
            autocomplete="off"
            placeholder="Search actions, pages and records…"
            .value=${query}
            @input=${(e: Event) => palette.set({ query: (e.target as HTMLInputElement).value, highlighted: 0 })}
          ></ui-text-input>
          <ui-kbd size="sm">Esc</ui-kbd>
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
                <ui-text weight="medium">No results for “${q}”</ui-text>
                <ui-text size="sm" color="muted">Try other words — search understands related terms too.</ui-text>
              </ui-flex>`
        }
        ${this.indexing ? html`<ui-flex justify="center" padding="2"><ui-loading size="sm"></ui-loading></ui-flex>` : nothing}
        <ui-flex slot="footer" justify="between" align="center" gap="3">
          <ui-text size="xs" color="muted" truncate
            >${q ? `${flat.length} result${flat.length === 1 ? "" : "s"}` : "Type to search"} · fuzzy +
            semantic</ui-text
          >
          <ui-flex align="center" gap="3">
            <ui-flex align="center" gap="1"
              ><ui-text as="span" size="xs" color="muted">Navigate</ui-text><ui-kbd size="xs">↑</ui-kbd
              ><ui-kbd size="xs">↓</ui-kbd></ui-flex
            >
            <ui-flex align="center" gap="1"
              ><ui-text as="span" size="xs" color="muted">Open</ui-text><ui-kbd size="xs">↵</ui-kbd></ui-flex
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
