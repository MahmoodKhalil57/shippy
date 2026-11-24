-- cf-runner's tables (src/d1-store.ts): documents, globals, uploads and bookkeeping, each as
-- Payload's JSON (the engine reads and writes whole documents). Applied with
-- `wrangler d1 migrations apply <database>` (`migrations_dir` in the app's wrangler config).

CREATE TABLE IF NOT EXISTS docs (
  collection TEXT NOT NULL,
  id TEXT NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (collection, id)
);

CREATE TABLE IF NOT EXISTS globals (
  slug TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

-- An upload's bytes are in R2 (the `FILES` binding) when there is one, else in `body`.
CREATE TABLE IF NOT EXISTS files (
  collection TEXT NOT NULL,
  filename TEXT NOT NULL,
  type TEXT NOT NULL,
  body BLOB,
  PRIMARY KEY (collection, filename)
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
