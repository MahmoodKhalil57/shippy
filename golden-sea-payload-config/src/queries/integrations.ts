import { query } from "saastemlycrm-design-system/contracts";
import type { IntegrationsView } from "../endpoints/platform.ts";
import type { IntegrationsGlobal } from "../format/integrations.ts";

/**
 * Integrations & data (GET /api/integrations/status, ../endpoints/platform.ts): the
 * acknowledgement template in both languages and the language settings.
 */
export const integrations = query.endpoint<IntegrationsView>("/integrations/status");

/** The integrations global as stored: its email-history import and its backups (groups). */
export const integrationsGlobal = query.global<IntegrationsGlobal>("integrations", { depth: 0 });
