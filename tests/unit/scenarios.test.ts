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
