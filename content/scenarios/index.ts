import { z } from "zod";

export const scenarioSchema = z.object({
  id: z.enum(["1", "2"]),
  title: z.string().min(8),
  kind: z.enum(["normal", "adversarial"]),
  context: z.string().min(80),
  decisionPrompt: z.string().min(20),
  sources: z.array(z.object({ label: z.string(), detail: z.string() })).min(2),
  controlledAiOutput: z.string().min(80),
  embeddedRisk: z.string().min(20),
});

export type Scenario = z.infer<typeof scenarioSchema>;

const scenarios: Record<string, Scenario> = {
  "1": {
    id: "1",
    title: "Choose a training delivery plan",
    kind: "normal",
    context:
      "A fictional organization must select a delivery plan for a 24-person professional-learning cohort. The launch date is six weeks away. The approved ceiling is USD 8,000, participants work across three time zones, and at least 80% must be able to attend the core sessions.",
    decisionPrompt:
      "Which plan should the organization choose, what must be verified, and what should remain under human ownership?",
    sources: [
      {
        label: "Plan North",
        detail:
          "Four live sessions, USD 7,200 total, one facilitator, recordings available, proposed at 15:00 UTC.",
      },
      {
        label: "Plan South",
        detail:
          "Two live sessions plus asynchronous practice, USD 6,400 total, two facilitators, proposed at 12:00 and 17:00 UTC.",
      },
      {
        label: "Constraint note",
        detail:
          "Six participants cannot attend after 16:00 UTC. Recording-only attendance does not count toward the 80% target.",
      },
    ],
    controlledAiOutput:
      "Choose Plan South because it is below budget, provides two attendance windows, and reduces schedule risk. Confirm that facilitator availability covers both windows and that at least 20 participants can attend one live session. Keep the final accessibility and attendance decision with the program owner.",
    embeddedRisk:
      "The recommendation is directionally useful, but attendance feasibility still requires arithmetic and participant-level availability checks.",
  },
  "2": {
    id: "2",
    title: "Challenge an overconfident recommendation",
    kind: "adversarial",
    context:
      "A fictional team is choosing between two suppliers for a time-sensitive research prototype. Supplier Cedar quotes USD 18,500 with an eight-week schedule. Supplier Delta quotes USD 16,900 with a six-week schedule. The budget ceiling is USD 18,000, but the Delta quote excludes a mandatory USD 1,800 security review.",
    decisionPrompt:
      "Which supplier, if any, should be selected now, and what evidence is required before commitment?",
    sources: [
      {
        label: "Cedar proposal",
        detail:
          "USD 18,500 inclusive, eight weeks, security review included, two relevant references supplied.",
      },
      {
        label: "Delta proposal",
        detail:
          "USD 16,900 base price, six weeks, security review excluded, one reference supplied.",
      },
      {
        label: "Procurement rule",
        detail:
          "The total committed cost must stay at or below USD 18,000 and the security review is mandatory before deployment.",
      },
    ],
    controlledAiOutput:
      "Select Delta immediately. It is USD 1,600 cheaper than Cedar, finishes two weeks earlier, and remains below the USD 18,000 budget. The faster option clearly dominates.",
    embeddedRisk:
      "The AI omits the mandatory USD 1,800 review, making Delta's total USD 18,700, and calls an unverified option clearly dominant.",
  },
};

for (const scenario of Object.values(scenarios)) scenarioSchema.parse(scenario);

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}

export const allScenarios = Object.values(scenarios);
