import { expect, test, type Page } from "@playwright/test";

async function completeMission(page: Page, missionId: "1" | "2") {
  await expect(page.getByText(/fixed synthetic output/i)).toHaveCount(0); // G0-02
  await page.getByLabel("Your initial decision").fill(`Initial decision for mission ${missionId}`);
  await page.getByLabel("Initial confidence").selectOption("medium");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("What outcome are you trying to achieve?").fill("A defensible decision");
  await page.getByLabel("Who is this decision for?").fill("The accountable program owner");
  await page
    .getByLabel("What constraints must not be missed?")
    .fill("Budget, timing, and evidence");
  await page.getByLabel("What are you assuming?").fill("The supplied summary is accurate");
  await page
    .getByLabel("What information is uncertain or missing?")
    .fill("Availability and assumptions");
  await page.getByRole("button", { name: "Continue" }).click(); // G0-03

  await page
    .getByLabel("Which steps depend on each other?")
    .fill("Confirm availability before booking facilitators");
  await page.getByLabel("What must remain human-owned?").fill("Final decision and accountability");
  await page.getByLabel("What can AI assist with?").fill("Structured comparison");
  await page
    .getByLabel("How will you verify the AI-assisted work?")
    .fill("Check arithmetic and constraints");
  await page.getByRole("button", { name: "Continue" }).click(); // G0-04

  await expect(page.getByText(/fixed synthetic output/i)).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/what did you verify/i).fill("I checked the supplied facts and arithmetic");
  if (missionId === "2") {
    // 05_Mission_Briefs.md requires the claim/evidence table on the adversarial mission only.
    await page
      .getByLabel(/list each ai claim/i)
      .fill("Assurance Statement A-114: not present in any supplied source");
  }
  await page
    .getByLabel("What did you accept, change, or reject from the AI output?")
    .fill("Accepted the cost comparison, rejected the recommendation");
  await page
    .getByLabel("Your final decision and rationale")
    .fill(`Final decision for mission ${missionId}`);
  await page.getByLabel("What risk remains after this decision?").fill("Unconfirmed availability");
  await page
    .getByLabel("Who is accountable, and who do you escalate to?")
    .fill("Program owner; escalate to the sponsor");
  await page.getByLabel("Final confidence").selectOption("high");
  await page.getByRole("button", { name: "Complete mission" }).click();
  await expect(page.getByRole("heading", { name: `Mission ${missionId} complete` })).toBeVisible();
}

test("G0-01 G0-02 G0-03 G0-04 G0-05 G0-06 completes both fixed missions with separate evidence", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start Mission 1" }).click();
  await completeMission(page, "1");

  const missionOne = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("mindkata-gate0:mission:1") ?? "{}"),
  );
  expect(missionOne.answers.initialDecision).toBe("Initial decision for mission 1"); // G0-05
  expect(missionOne.answers.finalDecision).toBe("Final decision for mission 1");
  // G0-12: order, not membership. M1_FIRST_INPUT must sit between the other two, or task time is
  // not the interval ADR 0010 defines.
  expect(missionOne.events.map((event: { name: string }) => event.name)).toEqual([
    "M1_STARTED",
    "M1_FIRST_INPUT",
    "M1_COMPLETED",
  ]);

  await page.getByRole("link", { name: "Start Mission 2" }).click();
  // Barrier before reading storage: page.evaluate() does not auto-wait, and MissionFlow only
  // leaves its "Preparing the fixed mission…" state after the init effect has written the
  // record. This locator must be mission-2 specific — the session code and other chrome are
  // already on screen from the Mission 1 completion page, so they would match instantly.
  await expect(page.getByText(/mission 2 of 2/i)).toBeVisible();
  const startedMissionTwo = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("mindkata-gate0:mission:2") ?? "{}"),
  );
  expect(startedMissionTwo.events.map((event: { name: string }) => event.name)).toEqual([
    "M2_STARTED",
  ]); // G0-06
  // G0-12: voluntary start is recorded with no input yet, so the two measures are independent.
  // Mission 2 continuation is a scored criterion and must not become contingent on typing.
  expect(startedMissionTwo.firstInputAt).toBeUndefined();

  await completeMission(page, "2");
  const completedMissionTwo = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("mindkata-gate0:mission:2") ?? "{}"),
  );
  expect(completedMissionTwo.events.map((event: { name: string }) => event.name)).toEqual([
    "M2_STARTED",
    "M2_FIRST_INPUT",
    "M2_COMPLETED",
  ]);
});

test("G0-07 exports and deletes the browser-session receipt", async ({ page }) => {
  await page.goto("/mission/1");
  await completeMission(page, "1");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export session receipt" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^MK-[A-F0-9]{8}-mission-1\.json$/);

  await page.getByRole("button", { name: /delete this browser-session record/i }).click();
  await expect(page).toHaveURL("/");
  expect(await page.evaluate(() => sessionStorage.getItem("mindkata-gate0:mission:1"))).toBeNull();
});
