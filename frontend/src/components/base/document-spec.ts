/** A printable document (`ui-document`): a header, a party block, lines, totals, notes and a footer. */
export interface DocumentSpec {
  lang?: string;
  dir?: "ltr" | "rtl";
  notices?: { tone: "warning" | "info"; text: string }[];
  /** The issuer: name (large) and a line under it. */
  issuer: { name: string; tagline?: string };
  title: string;
  /** Lines under the title (number, reference, date); `accent` ones in the primary colour. */
  meta: { text: string; accent?: boolean }[];
  /** Who it's for: a heading and label / value rows. */
  party?: { title: string; rows: { label: string; value: string }[] };
  intro?: string;
  /** `ltr`: keep left-to-right in a right-to-left document (part names); `upper`: capitals. */
  columns: { key: string; label: string; ltr?: boolean; upper?: boolean }[];
  lines: Record<string, string>[];
  /** Rows above the total (a discount). */
  adjustments?: { label: string; value: string }[];
  total?: { label: string; value: string };
  totalNote?: string;
  notes?: { title?: string; items: string[]; closing?: string };
  footer?: { start?: string; end?: string };
  /** Contact lines in a band at the foot (left-to-right). */
  contact?: string[];
}
