export const missionStages = [
  "Independent judgment",
  "Frame the decision",
  "Delegate deliberately",
  "Inspect AI output",
  "Verify and decide",
  "Completion receipt",
] as const;

export type MissionAnswers = {
  initialDecision: string;
  initialConfidence: string;
  objective: string;
  audience: string;
  constraints: string;
  assumptions: string;
  uncertainty: string;
  dependencyMap: string;
  humanWork: string;
  aiWork: string;
  verificationPlan: string;
  evidenceCheck: string;
  aiContributions: string;
  finalDecision: string;
  residualRisk: string;
  accountableOwner: string;
  finalConfidence: string;
  claimEvidence: string;
};

export const emptyAnswers: MissionAnswers = {
  initialDecision: "",
  initialConfidence: "",
  objective: "",
  audience: "",
  constraints: "",
  assumptions: "",
  uncertainty: "",
  dependencyMap: "",
  humanWork: "",
  aiWork: "",
  verificationPlan: "",
  evidenceCheck: "",
  aiContributions: "",
  finalDecision: "",
  residualRisk: "",
  accountableOwner: "",
  finalConfidence: "",
  claimEvidence: "",
};

/**
 * `missionId` is only consulted for the Mission 2 claim/evidence table, which
 * `05_Mission_Briefs.md` requires of the adversarial mission alone. It is optional so that callers
 * checking a mission-agnostic stage do not have to supply it.
 */
export function stageIsComplete(
  stage: number,
  answers: MissionAnswers,
  missionId?: string,
): boolean {
  if (stage === 0) return Boolean(answers.initialDecision.trim() && answers.initialConfidence);
  if (stage === 1)
    return Boolean(
      answers.objective.trim() &&
      answers.audience.trim() &&
      answers.constraints.trim() &&
      answers.assumptions.trim() &&
      answers.uncertainty.trim(),
    );
  // The dependency map is required here because the Execution Kit's completion definition
  // (03_Interview_and_Prototype_Protocol.md) lists a "task/dependency map" among the artifacts a
  // submitted Mission 1 must contain, and M1_COMPLETE is coded against that list.
  if (stage === 2)
    return Boolean(
      answers.dependencyMap.trim() &&
      answers.humanWork.trim() &&
      answers.aiWork.trim() &&
      answers.verificationPlan.trim(),
    );
  if (stage === 3) return true;
  // 05_Mission_Briefs.md requires the final stage to record what was accepted, modified and
  // rejected from the AI output, plus residual risk and an accountable owner. Mission 2 adds an
  // explicit claim/evidence table, because its embedded failure includes fabricated support.
  if (stage === 4)
    return Boolean(
      answers.evidenceCheck.trim() &&
      answers.aiContributions.trim() &&
      answers.finalDecision.trim() &&
      answers.residualRisk.trim() &&
      answers.accountableOwner.trim() &&
      answers.finalConfidence &&
      (missionId !== "2" || answers.claimEvidence.trim()),
    );
  return true;
}
