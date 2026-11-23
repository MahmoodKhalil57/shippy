/**
 * The app's scrollbar (src/index.css: a 10px gutter, a 4px rounded thumb in the theme's colours,
 * no arrow buttons) on a select's open list too. That list is a pseudo-element
 * (`::picker(select)`): the global `::-webkit-scrollbar` rules (`*`) never reach its bar, so
 * Chromium drew its own grey one with arrows there. Its rules chain two pseudo-elements
 * (`::picker(select)::-webkit-scrollbar`), which Chromium reads but Lightning CSS (Tailwind's and
 * Vite's CSS pass) rejects and drops from the stylesheet, so they are added here at runtime, as a
 * constructed stylesheet the build never sees. A browser without `::picker()` ignores them.
 */
const RULES = `
@supports selector(::-webkit-scrollbar) {
  select::picker(select)::-webkit-scrollbar { width: 10px; height: 10px; background: transparent; }
  select::picker(select)::-webkit-scrollbar-track,
  select::picker(select)::-webkit-scrollbar-corner { background: transparent; }
  select::picker(select)::-webkit-scrollbar-track:vertical { margin-block: var(--radius-box); }
  select::picker(select)::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
  select::picker(select)::-webkit-scrollbar-thumb {
    border: 3px solid transparent;
    border-radius: 9999px;
    background-clip: padding-box;
    background-color: color-mix(in oklab, var(--color-base-content) 22%, transparent);
  }
  select::picker(select)::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
  }
  select::picker(select)::-webkit-scrollbar-thumb:active {
    background-color: color-mix(in oklab, var(--color-primary) 70%, transparent);
  }
}`;

let sheet: CSSStyleSheet | undefined;

/** Adds the rules to the document once (a no-op outside a browser). */
export function installPickerScrollbar(doc: Document | undefined = globalThis.document) {
  if (!doc || typeof CSSStyleSheet !== "function" || !("adoptedStyleSheets" in doc)) return;
  if (sheet && doc.adoptedStyleSheets.includes(sheet)) return;
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(RULES);
  }
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
}

installPickerScrollbar();
