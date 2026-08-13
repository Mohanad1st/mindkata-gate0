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
  constraints: string;
  uncertainty: string;
  dependencyMap: string;
  humanWork: string;
  aiWork: string;
  verificationPlan: string;
  evidenceCheck: string;
  finalDecision: string;
  finalConfidence: string;
};

export const emptyAnswers: MissionAnswers = {
  initialDecision: "",
  initialConfidence: "",
  objective: "",
  constraints: "",
  uncertainty: "",
  dependencyMap: "",
  humanWork: "",
  aiWork: "",
  verificationPlan: "",
  evidenceCheck: "",
  finalDecision: "",
  finalConfidence: "",
};

export function stageIsComplete(stage: number, answers: MissionAnswers): boolean {
  if (stage === 0) return Boolean(answers.initialDecision.trim() && answers.initialConfidence);
  if (stage === 1)
    return Boolean(
      answers.objective.trim() && answers.constraints.trim() && answers.uncertainty.trim(),
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
  if (stage === 4)
    return Boolean(
      answers.evidenceCheck.trim() && answers.finalDecision.trim() && answers.finalConfidence,
    );
  return true;
}
