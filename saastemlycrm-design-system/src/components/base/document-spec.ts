export interface DocumentSpec {
  lang?: string;
  dir?: "ltr" | "rtl";
  notices?: { tone: "warning" | "info"; text: string }[];
  issuer: { name: string; tagline?: string };
  title: string;
  meta: { text: string; accent?: boolean }[];
  party?: { title: string; rows: { label: string; value: string }[] };
  intro?: string;
  columns: { key: string; label: string; ltr?: boolean; upper?: boolean }[];
  lines: Record<string, string>[];
  adjustments?: { label: string; value: string }[];
  total?: { label: string; value: string };
  totalNote?: string;
  notes?: { title?: string; items: string[]; closing?: string };
  footer?: { start?: string; end?: string };
  contact?: string[];
}
