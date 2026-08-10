import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("G0-08 start and mission pages have no serious automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const startResults = await new AxeBuilder({ page }).analyze();
  expect(
    startResults.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);

  await page.getByRole("link", { name: "Start Mission 1" }).click();
  await expect(
    page.getByRole("heading", { name: /choose a training delivery plan/i }),
  ).toBeVisible();
  const missionResults = await new AxeBuilder({ page }).analyze();
  expect(
    missionResults.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
