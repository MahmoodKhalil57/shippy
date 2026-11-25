import { query } from "saastemlycrm-design-system/contracts";
import type { IntegrationsView } from "../endpoints/platform.ts";
import type { IntegrationsGlobal } from "../format/integrations.ts";

export const integrations = query.endpoint<IntegrationsView>("/integrations/status");

export const integrationsGlobal = query.global<IntegrationsGlobal>("integrations", { depth: 0 });
