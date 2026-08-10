import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  // Each spec drives a whole mission against `next dev`, which compiles routes on demand.
  // The 30s default is not enough for the first /mission/[missionId] compile on a slow
  // machine. CI runs the full suite in ~23s, so this ceiling costs nothing there.
  timeout: 90_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    // `localhost`, not `127.0.0.1`: Next.js dev treats the raw IP as a foreign origin and
    // blocks every `/_next/*` chunk, so the page never hydrates and each spec times out.
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
