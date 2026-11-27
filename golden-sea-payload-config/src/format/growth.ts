import type { KindData } from "saastemlycrm-design-system/contracts";
import type { Growth } from "../endpoints/growth-crm.ts";
import { m } from "../i18n/paraglide/messages.js";

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

export const fleetVessels = (g: Growth): KindData<"table"> => ({
  columns: [
    { key: "manager", label: m.growth_column_manager() },
    { key: "name", label: m.growth_column_vessel() },
    { key: "imo", label: m.growth_column_imo() },
    { key: "type", label: m.growth_column_type() },
    { key: "supplied", label: m.growth_column_supplied(), hideLabel: true },
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

export const registrationReader = (): KindData<"custom"> => ({
  element: "ui-ai-extract",
  props: registrationExtract(),
});
