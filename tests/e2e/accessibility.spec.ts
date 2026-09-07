import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const serious = (violations: { impact?: string | null }[]) =>
  violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));

test("G0-08 start and mission pages have no serious automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const startResults = await new AxeBuilder({ page }).analyze();
  expect(serious(startResults.violations)).toEqual([]);

  await page.getByRole("link", { name: "Start Mission 1" }).click();
  await expect(
    page.getByRole("heading", { name: /choose a training delivery plan/i }),
  ).toBeVisible();
  const missionResults = await new AxeBuilder({ page }).analyze();
  expect(serious(missionResults.violations)).toEqual([]);
});

// The dark theme is a token swap in globals.css, so every colour pair changes at once and
// none of them are exercised by the light-mode run above. Its contrast ratios were
// calculated by hand when the tokens were chosen; this measures them instead, on both the
// start page and a mission page, so a future token edit cannot quietly fail contrast for
// anyone whose device is set to dark.
test("G0-08 the dark theme has no serious automated accessibility violations", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const startResults = await new AxeBuilder({ page }).analyze();
  expect(serious(startResults.violations)).toEqual([]);

  await page.getByRole("link", { name: "Start Mission 1" }).click();
  await expect(
    page.getByRole("heading", { name: /choose a training delivery plan/i }),
  ).toBeVisible();
  const missionResults = await new AxeBuilder({ page }).analyze();
  expect(serious(missionResults.violations)).toEqual([]);

  await context.close();
});
