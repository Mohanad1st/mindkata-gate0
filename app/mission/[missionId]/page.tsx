import { notFound } from "next/navigation";
import { MissionFlow } from "@/components/mission-flow";
import { getScenario } from "@/content/scenarios";

export default async function MissionPage({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const scenario = getScenario(missionId);
  if (!scenario) notFound();

  return <MissionFlow scenario={scenario} />;
}
