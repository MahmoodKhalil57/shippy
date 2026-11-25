import { query } from "saastemlycrm-design-system/contracts";
import type { ProjectView } from "../endpoints/platform.ts";

export const plan = query.endpoint<ProjectView>("/project");
