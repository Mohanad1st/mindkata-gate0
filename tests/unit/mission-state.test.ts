import { emptyAnswers, stageIsComplete } from "@/lib/mission-state";

describe("mission-stage completion", () => {
  it("requires all framing fields for G0-03", () => {
    expect(
      stageIsComplete(1, {
        ...emptyAnswers,
        objective: "Choose a workable plan",
        constraints: "Budget and attendance",
        uncertainty: "Facilitator availability",
      }),
    ).toBe(true);
    expect(stageIsComplete(1, { ...emptyAnswers, objective: "Only one field" })).toBe(false);
  });

  it("requires separate human, AI, and verification work for G0-04", () => {
    expect(
      stageIsComplete(2, {
        ...emptyAnswers,
        humanWork: "Own the final decision",
        aiWork: "Compare the options",
        verificationPlan: "Recalculate costs and attendance",
      }),
    ).toBe(true);
    expect(stageIsComplete(2, { ...emptyAnswers, aiWork: "Delegate everything" })).toBe(false);
  });
});
