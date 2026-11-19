import { api } from "../mock/client.ts";
import type { Doc, Tour } from "../mock/types.ts";

/**
 * The dashboard's own content, read from the project's data rather than code: the `branding`
 * global (read before sign-in too), the `assistant` global, and the `tours` and `guide-topics`
 * collections. `loadSite()` runs at start and after each sign-in; the rest load when first asked.
 * Nothing here names a business: an empty project gets neutral defaults.
 */

export interface Branding {
  name: string;
  icon: string;
  loginIntro?: string;
  poweredBy?: string;
  backgrounds: { path: string; label: string }[];
  backgroundCredit?: string;
}

export interface AssistantInfo {
  name: string;
  business: string;
  ask: string;
  roleNotes: { role: string; note: string }[];
}

let branding: Branding = { name: "Dashboard", icon: "grid", backgrounds: [] };
let assistant: AssistantInfo = { name: "Assistant", business: "a business", ask: "/ask", roleNotes: [] };

export const site = () => ({ branding, assistant });

const text = (v: unknown, fallback = "") => (typeof v === "string" && v ? v : fallback);

/** Read the branding (always) and the assistant (when signed in). */
export async function loadSite() {
  const b = await api.findGlobal<Doc>("branding").catch(() => null);
  if (b)
    branding = {
      name: text(b.name, branding.name),
      icon: text(b.icon, "grid"),
      loginIntro: text(b.loginIntro) || undefined,
      poweredBy: text(b.poweredBy) || undefined,
      backgrounds: ((b.backgrounds as { path?: string; label?: string }[] | undefined) ?? []).flatMap((x) =>
        x.path ? [{ path: x.path, label: text(x.label, x.path) }] : [],
      ),
      backgroundCredit: text(b.backgroundCredit) || undefined,
    };
  const a = await api.findGlobal<Doc>("assistant").catch(() => null);
  if (a)
    assistant = {
      name: text(a.name, "Assistant"),
      business: text(a.business, "a business"),
      ask: text(a.ask, "/ask"),
      roleNotes: ((a.roleNotes as { role?: string; note?: string }[] | undefined) ?? []).flatMap((x) =>
        x.role && x.note ? [{ role: x.role, note: x.note }] : [],
      ),
    };
}

let tours: Promise<Tour[]> | null = null;
/** The guided tours (`tours` collection), loaded once per sign-in. */
export function loadTours(): Promise<Tour[]> {
  tours ??= api
    .find<Doc>("tours", { limit: 0, depth: 0, sort: "createdAt" })
    .then((r) =>
      r.docs.map((d) => ({
        id: String(d.id),
        title: text(d.title),
        summary: text(d.summary),
        steps: ((d.steps as Tour["steps"] | undefined) ?? []).map((s) => {
          // Empty optional fields come back as null or "": drop them, so "no target" stays absent.
          const clean = Object.fromEntries(Object.entries(s).filter(([k, v]) => k !== "id" && v !== null && v !== ""));
          const target = clean.target as { text?: string; sel?: string } | undefined;
          return {
            ...clean,
            target: target?.text ? { text: target.text, sel: target.sel || undefined } : undefined,
          } as Tour["steps"][number];
        }),
      })),
    )
    .catch(() => {
      tours = null;
      return [];
    });
  return tours;
}

let guide: Promise<{ topic: string; keywords: string; text: string }[]> | null = null;
/** The platform guide the helper quotes (`guide-topics` collection). */
export function loadGuide() {
  guide ??= api
    .find<Doc>("guide-topics", { limit: 0, depth: 0 })
    .then((r) => r.docs.map((d) => ({ topic: text(d.topic), keywords: text(d.keywords), text: text(d.text) })))
    .catch(() => {
      guide = null;
      return [];
    });
  return guide;
}

/** Forget what was loaded for the previous user (after a sign-in or sign-out). */
export function resetSite() {
  tours = null;
  guide = null;
}
