import type { Endpoint } from "payload";
import { commercialEndpoints } from "./commercial.ts";
import { home } from "./home.ts";
import { insightsEndpoints } from "./insights.ts";
import { operationsEndpoints } from "./operations.ts";
import { platformEndpoints } from "./platform.ts";
import { sourcingEndpoints } from "./sourcing.ts";
import { viewEndpoints } from "../views/index.ts";

/** Every root endpoint (`/api/<path>`), by area. Collection endpoints live with their collection. */
export const endpoints: Endpoint[] = [
  home,
  ...sourcingEndpoints,
  ...commercialEndpoints,
  ...operationsEndpoints,
  ...insightsEndpoints,
  ...platformEndpoints,
  ...viewEndpoints,
];
