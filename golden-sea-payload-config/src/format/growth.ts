import type { KindData } from "saastemlycrm-design-system/contracts";
import type { Growth } from "../endpoints/growth-crm.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * The growth CRM's fleets per ship manager (GET /api/growth, ../endpoints/growth-crm.ts): customers'
 * vessel records and prospects' known fleets, each vessel marked when we supply it (customers,
 * vessels, cases and opportunities at once), and the on-device registration reader. The board's
 * stages, the sales next steps, registrations and campaigns read their collections (data widgets).
 * Pure: data in, what a kind draws out.
 */

/** What the on-device reader (`ui-ai-extract`) reads from a registration document, and from where. */
export const registrationExtract = () => ({
  source: "file",
  label: m.growth_extract_label(),
  what: m.growth_extract_what(),
  fields: [
    { id: "company", label: m.growth_extract_company() },
    { id: "registration", label: m.growth_extract_registration() },
    { id: "tax", label: m.growth_extract_tax() },
    { id: "issued", label: m.growth_extract_issued() },
    { id: "expires", label: m.growth_extract_expires(), hint: m.growth_extract_expires_hint() },
  ],
});

/**
 * Each ship manager's fleet: how many of its vessels are on file and how many we supply, and
 * whether it's a customer or a prospect. The vessels themselves are beside it (`fleetVessels`).
 */
export const fleets = (g: Growth): KindData<"list"> => ({
  items: g.fleets.map((f) => ({
    headline: f.company,
    href: f.href,
    supporting: m.growth_fleet_supporting({
      count: f.vessels.length,
      size: f.fleetSize,
      supplied: f.vessels.filter((v) => v.supplied).length,
    }),
    tags: [{ label: f.relation, tone: f.tone }],
  })),
});

/**
 * Every vessel on file per ship manager, with its IMO and type, and whether we supply it: the
 * room to grow is every vessel we don't supply yet.
 */
export const fleetVessels = (g: Growth): KindData<"table"> => ({
  columns: [
    { key: "manager", label: m.growth_column_manager() },
    { key: "name", label: m.growth_column_vessel() },
    { key: "imo", label: m.growth_column_imo() },
    { key: "type", label: m.growth_column_type() },
    { key: "supplied", label: "" },
  ],
  rows: g.fleets.flatMap((f) =>
    f.vessels.map((v) => ({
      manager: f.href ? { text: f.company, href: f.href } : f.company,
      name: v.href ? { text: v.name, href: v.href } : v.name,
      imo: v.imo ? { text: v.imo, mono: true } : null,
      type: v.type || null,
      supplied: {
        text: v.supplied ? m.growth_supplied() : m.growth_not_yet(),
        tone: v.supplied ? "success" : "neutral",
        tag: true,
      },
    })),
  ),
});

/**
 * Reads a registration document (commercial register, tax card or vendor certificate) on this
 * device: the company, its register and tax numbers, and when it was issued and expires.
 */
export const registrationReader = (): KindData<"custom"> => ({
  element: "ui-ai-extract",
  props: registrationExtract(),
});
