import { allScenarios, getScenario, scenarioSchema } from "@/content/scenarios";

describe("G0-01 fixed scenario bank", () => {
  it("contains exactly the two approved synthetic missions", () => {
    expect(allScenarios).toHaveLength(2);
    expect(allScenarios.map((scenario) => scenario.id)).toEqual(["1", "2"]);
    expect(allScenarios.map((scenario) => scenario.kind)).toEqual(["normal", "adversarial"]);
    for (const scenario of allScenarios) expect(() => scenarioSchema.parse(scenario)).not.toThrow();
  });

  it("does not resolve an unapproved mission", () => {
    expect(getScenario("3")).toBeUndefined();
  });
});

describe("adversarial mission carries an unsupported citation", () => {
  // The v2.1.1 Execution Kit defines Mission 2's embedded failure as omitting a mandatory
  // constraint AND citing a non-existent assurance statement, and the participant's critical work
  // as detecting "the missing constraint and fabricated support". If the citation ever becomes
  // traceable to a supplied source, the mission stops testing fabrication detection.
  it("cites an assurance statement that appears in none of the supplied sources", () => {
    const mission = getScenario("2");
    expect(mission).toBeDefined();
    if (mission === undefined) return;

    expect(mission.controlledAiOutput).toMatch(/assurance statement/i);

    const supplied = [mission.context, mission.decisionPrompt]
      .concat(mission.sources.map((source) => `${source.label} ${source.detail}`))
      .join(" ");
    expect(supplied).not.toMatch(/assurance statement/i);
  });

  it("omits a mandatory cost that pushes the recommended option over the ceiling", () => {
    const mission = getScenario("2");
    expect(mission?.embeddedRisk).toMatch(/18,?700/);
    expect(mission?.sources.some((source) => /mandatory/i.test(source.detail))).toBe(true);
  });
});
