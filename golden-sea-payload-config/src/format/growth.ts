import type { KindData } from "saastemlycrm-design-system/contracts";
import type { Growth } from "../endpoints/growth-crm.ts";

/**
 * The growth CRM's fleets per ship manager (GET /api/growth, ../endpoints/growth-crm.ts): customers'
 * vessel records and prospects' known fleets, each vessel marked when we supply it (customers,
 * vessels, cases and opportunities at once), and the on-device registration reader. The board's
 * stages, the sales next steps, registrations and campaigns read their collections (data widgets).
 * Pure: data in, what a kind draws out.
 */

/** What the on-device reader (`ui-ai-extract`) reads from a registration document, and from where. */
export const REGISTRATION_EXTRACT = {
  source: "file",
  label: "Read a registration document",
  what: "company registration document (commercial register, tax card or vendor certificate)",
  fields: [
    { id: "company", label: "Company" },
    { id: "registration", label: "Commercial register no." },
    { id: "tax", label: "Tax card no." },
    { id: "issued", label: "Issued" },
    { id: "expires", label: "Expires", hint: "the expiry or renewal date" },
  ],
};

/**
 * Each ship manager's fleet: how many of its vessels are on file and how many we supply, and
 * whether it's a customer or a prospect. The vessels themselves are beside it (`fleetVessels`).
 */
export const fleets = (g: Growth): KindData<"list"> => ({
  items: g.fleets.map((f) => ({
    headline: f.company,
    href: f.href,
    supporting: `${f.vessels.length} of ${f.fleetSize} vessels on file · ${f.vessels.filter((v) => v.supplied).length} supplied`,
    tags: [{ label: f.relation, tone: f.tone }],
  })),
});

/**
 * Every vessel on file per ship manager, with its IMO and type, and whether we supply it: the
 * room to grow is every vessel we don't supply yet.
 */
export const fleetVessels = (g: Growth): KindData<"table"> => ({
  columns: [
    { key: "manager", label: "Ship manager" },
    { key: "name", label: "Vessel" },
    { key: "imo", label: "IMO" },
    { key: "type", label: "Type" },
    { key: "supplied", label: "" },
  ],
  rows: g.fleets.flatMap((f) =>
    f.vessels.map((v) => ({
      manager: f.href ? { text: f.company, href: f.href } : f.company,
      name: v.href ? { text: v.name, href: v.href } : v.name,
      imo: v.imo ? { text: v.imo, mono: true } : null,
      type: v.type || null,
      supplied: { text: v.supplied ? "Supplied" : "Not yet", tone: v.supplied ? "success" : "neutral", tag: true },
    })),
  ),
});

/**
 * Reads a registration document (commercial register, tax card or vendor certificate) on this
 * device: the company, its register and tax numbers, and when it was issued and expires.
 */
export const registrationReader = (): KindData<"custom"> => ({ element: "ui-ai-extract", props: REGISTRATION_EXTRACT });
