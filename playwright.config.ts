import { defineConfig, devices } from "@playwright/test";

// E2E runs on its own port and always starts its own server.
// Previously this pointed at :3000 with `reuseExistingServer` on, so when another local app
// already owned :3000 Playwright silently drove THAT app: the 13 Aug run reported 3 failures
// and 58 axe violations that belonged to a different project entirely, while CI was green.
// A dedicated port plus `reuseExistingServer: false` makes that class of false result
// impossible - if the port is busy the run fails loudly instead of testing the wrong thing.
const E2E_PORT = process.env.E2E_PORT ?? "3100";
// `localhost`, not `127.0.0.1`: Next.js dev treats the raw IP as a foreign origin and
// blocks every `/_next/*` chunk, so the page never hydrates and each spec times out.
const BASE_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  // Each spec drives a whole mission against `next dev`, which compiles routes on demand.
  // The 30s default is not enough for the first /mission/[missionId] compile on a slow
  // machine. CI runs the full suite in ~23s, so this ceiling costs nothing there.
  timeout: 90_000,
  // Assertion timeout, separate from the per-test timeout above. The default 5s is not enough for
  // the first assertion after navigating to a route `next dev` has not compiled yet: measured
  // passing in ~20s total on a quiet run but failing on the Mission 2 barrier when the machine is
  // contended. Sized against the slow case, not the fast one. No assertion is weakened — this only
  // changes how long a locator may take to appear before it is called absent.
  expect: { timeout: 20_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    // `next start`, not `next dev`, for three reasons. Next 16 allows only ONE dev server per
    // directory regardless of port, so a dev server left open for fieldwork would block the
    // suite. The production build is also what actually ships, and it serves prebuilt routes,
    // so no test waits on an on-demand compile. The full loop runs `build` in the stage
    // immediately before this one, so the build is always fresh; a standalone `npm run test:e2e`
    // needs `npm run build` first and says so plainly if the build is missing.
    command: `npx next start --port ${E2E_PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
