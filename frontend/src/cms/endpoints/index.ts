import type { Endpoint } from "payload";
import { cashEndpoints } from "./cash.ts";
import { commercialEndpoints } from "./commercial.ts";
import { home } from "./home.ts";
import { insightsEndpoints } from "./insights.ts";
import { operationsEndpoints } from "./operations.ts";
import { orderToCashEndpoints } from "./order-to-cash.ts";
import { platformEndpoints } from "./platform.ts";
import { quotationEndpoints } from "./quotations.ts";
import { sourcingEndpoints } from "./sourcing.ts";

/** Every root endpoint (`/api/<path>`), by area. Collection endpoints live with their collection. */
export const endpoints: Endpoint[] = [
  home,
  ...sourcingEndpoints,
  ...commercialEndpoints,
  ...quotationEndpoints,
  ...operationsEndpoints,
  ...orderToCashEndpoints,
  ...cashEndpoints,
  ...insightsEndpoints,
  ...platformEndpoints,
];
