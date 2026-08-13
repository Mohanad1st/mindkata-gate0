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

  it("requires a dependency map plus separate human, AI, and verification work for G0-04", () => {
    const complete = {
      ...emptyAnswers,
      dependencyMap: "Confirm availability before booking facilitators",
      humanWork: "Own the final decision",
      aiWork: "Compare the options",
      verificationPlan: "Recalculate costs and attendance",
    };
    expect(stageIsComplete(2, complete)).toBe(true);
    expect(stageIsComplete(2, { ...emptyAnswers, aiWork: "Delegate everything" })).toBe(false);
    // The Execution Kit's completion definition lists a task/dependency map among the artifacts a
    // submitted mission must contain, so delegation alone is not a complete stage.
    expect(stageIsComplete(2, { ...complete, dependencyMap: "   " })).toBe(false);
  });
});
