/**
 * The page's side of cf-runner: nothing to start. The API is on the same Worker as the pages, so
 * the dashboard's `ready` resolves at once (mock-runner's `startMockBackend` registers a service
 * worker instead).
 */
export const startCfBackend = (): Promise<void> => Promise.resolve();
