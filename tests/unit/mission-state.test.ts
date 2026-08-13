import { emptyAnswers, stageIsComplete } from "@/lib/mission-state";

describe("mission-stage completion", () => {
  const framed = {
    ...emptyAnswers,
    objective: "Choose a workable plan",
    audience: "The program owner and the cohort",
    constraints: "Budget and attendance",
    assumptions: "The availability summary is accurate",
    uncertainty: "Facilitator availability",
  };

  it("requires all framing fields for G0-03", () => {
    expect(stageIsComplete(1, framed)).toBe(true);
    expect(stageIsComplete(1, { ...emptyAnswers, objective: "Only one field" })).toBe(false);
  });

  it("requires audience and assumptions, which 05_Mission_Briefs.md lists in the frame", () => {
    expect(stageIsComplete(1, { ...framed, audience: "   " })).toBe(false);
    expect(stageIsComplete(1, { ...framed, assumptions: "" })).toBe(false);
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

  describe("final stage", () => {
    const decided = {
      ...emptyAnswers,
      evidenceCheck: "Recomputed both totals by hand",
      aiContributions: "Accepted the cost table, rejected the recommendation",
      finalDecision: "Do not commit yet",
      residualRisk: "Availability could still fail",
      accountableOwner: "Program owner; escalate to the sponsor",
      finalConfidence: "medium",
    };

    it("requires accepted/modified/rejected, residual risk, and an accountable owner", () => {
      expect(stageIsComplete(4, decided, "1")).toBe(true);
      expect(stageIsComplete(4, { ...decided, aiContributions: "" }, "1")).toBe(false);
      expect(stageIsComplete(4, { ...decided, residualRisk: "  " }, "1")).toBe(false);
      expect(stageIsComplete(4, { ...decided, accountableOwner: "" }, "1")).toBe(false);
    });

    it("requires a claim/evidence table for Mission 2 only", () => {
      // 05_Mission_Briefs.md adds the claim/evidence table to the adversarial mission, because its
      // embedded failure includes a fabricated citation. Mission 1 must not demand it.
      expect(stageIsComplete(4, decided, "2")).toBe(false);
      expect(
        stageIsComplete(4, { ...decided, claimEvidence: "A-114: not in any source" }, "2"),
      ).toBe(true);
      expect(stageIsComplete(4, decided, "1")).toBe(true);
    });
  });
});
