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
  if (stage === 2)
    return Boolean(
      answers.humanWork.trim() && answers.aiWork.trim() && answers.verificationPlan.trim(),
    );
  if (stage === 3) return true;
  if (stage === 4)
    return Boolean(
      answers.evidenceCheck.trim() && answers.finalDecision.trim() && answers.finalConfidence,
    );
  return true;
}
