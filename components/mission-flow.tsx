"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Scenario } from "@/content/scenarios";
import {
  emptyAnswers,
  missionStages,
  stageIsComplete,
  type MissionAnswers,
} from "@/lib/mission-state";

type EvidenceEvent = {
  name: "M1_STARTED" | "M1_COMPLETED" | "M2_STARTED" | "M2_COMPLETED";
  at: string;
};

type StoredMission = {
  schemaVersion: 1;
  sessionCode: string;
  missionId: string;
  startedAt: string;
  completedAt?: string;
  answers: MissionAnswers;
  events: EvidenceEvent[];
};

function newSessionCode() {
  return `MK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export function MissionFlow({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const storageKey = `mindkata-gate0:mission:${scenario.id}`;
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<MissionAnswers>(emptyAnswers);
  const [record, setRecord] = useState<StoredMission | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StoredMission;
          setRecord(parsed);
          setAnswers({ ...emptyAnswers, ...parsed.answers });
          setReady(true);
          return;
        } catch {
          sessionStorage.removeItem(storageKey);
        }
      }
      const created: StoredMission = {
        schemaVersion: 1,
        sessionCode: newSessionCode(),
        missionId: scenario.id,
        startedAt: new Date().toISOString(),
        answers: emptyAnswers,
        events: [
          {
            name: scenario.id === "1" ? "M1_STARTED" : "M2_STARTED",
            at: new Date().toISOString(),
          },
        ],
      };
      setRecord(created);
      sessionStorage.setItem(storageKey, JSON.stringify(created));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(initialize);
  }, [scenario.id, storageKey]);

  useEffect(() => {
    if (!ready || !record) return;
    const next = { ...record, answers };
    sessionStorage.setItem(storageKey, JSON.stringify(next));
  }, [answers, ready, record, storageKey]);

  const receiptRecord = useMemo(() => (record ? { ...record, answers } : null), [answers, record]);
  const receipt = useMemo(
    () => (receiptRecord ? JSON.stringify(receiptRecord, null, 2) : ""),
    [receiptRecord],
  );

  function update<K extends keyof MissionAnswers>(key: K, value: MissionAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function continueFlow() {
    if (!stageIsComplete(stage, answers, scenario.id)) return;
    if (stage === 4 && record && !record.completedAt) {
      const completed: StoredMission = {
        ...record,
        completedAt: new Date().toISOString(),
        answers,
        events: [
          ...record.events,
          {
            name: scenario.id === "1" ? "M1_COMPLETED" : "M2_COMPLETED",
            at: new Date().toISOString(),
          },
        ],
      };
      setRecord(completed);
      sessionStorage.setItem(storageKey, JSON.stringify(completed));
    }
    setStage((current) => Math.min(current + 1, missionStages.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearMission() {
    sessionStorage.removeItem(storageKey);
    router.push("/");
  }

  function downloadReceipt() {
    if (!receiptRecord) return;
    const blob = new Blob([JSON.stringify(receiptRecord, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${receiptRecord.sessionCode}-mission-${scenario.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!ready || !record) {
    return (
      <main id="main-content" className="shell" aria-busy="true">
        <p>Preparing the fixed mission…</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="shell mission-shell">
      <header className="mission-header">
        <Link className="text-link" href="/">
          ← Exit to start
        </Link>
        <p className="eyebrow">
          Mission {scenario.id} of 2 · {scenario.kind}
        </p>
        <h1>{scenario.title}</h1>
        <p className="session-code">Anonymous session code: {record.sessionCode}</p>
      </header>

      <nav aria-label="Mission progress" className="progress-wrap">
        <p>
          Step {stage + 1} of {missionStages.length}: <strong>{missionStages[stage]}</strong>
        </p>
        <progress value={stage + 1} max={missionStages.length}>
          {stage + 1} of {missionStages.length}
        </progress>
      </nav>

      {stage === 0 && (
        <section className="card" aria-labelledby="judgment-title">
          <p className="step-label">Answer before seeing AI output</p>
          <h2 id="judgment-title">Make an independent judgment</h2>
          <p>{scenario.context}</p>
          <div className="source-grid">
            {scenario.sources.map((source) => (
              <article key={source.label} className="source-card">
                <h3>{source.label}</h3>
                <p>{source.detail}</p>
              </article>
            ))}
          </div>
          <p className="prompt">{scenario.decisionPrompt}</p>
          <Field label="Your initial decision" id="initial-decision">
            <textarea
              id="initial-decision"
              value={answers.initialDecision}
              onChange={(event) => update("initialDecision", event.target.value)}
              rows={5}
            />
          </Field>
          <Confidence
            id="initial-confidence"
            label="Initial confidence"
            value={answers.initialConfidence}
            onChange={(value) => update("initialConfidence", value)}
          />
        </section>
      )}

      {stage === 1 && (
        <section className="card" aria-labelledby="frame-title">
          <p className="step-label">Clarify before delegating</p>
          <h2 id="frame-title">Frame the decision</h2>
          <Field label="What outcome are you trying to achieve?" id="objective">
            <textarea
              id="objective"
              value={answers.objective}
              onChange={(e) => update("objective", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="Who is this decision for?" id="audience">
            <textarea
              id="audience"
              value={answers.audience}
              onChange={(e) => update("audience", e.target.value)}
              rows={2}
            />
          </Field>
          <Field label="What constraints must not be missed?" id="constraints">
            <textarea
              id="constraints"
              value={answers.constraints}
              onChange={(e) => update("constraints", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="What are you assuming?" id="assumptions">
            <textarea
              id="assumptions"
              value={answers.assumptions}
              onChange={(e) => update("assumptions", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="What information is uncertain or missing?" id="uncertainty">
            <textarea
              id="uncertainty"
              value={answers.uncertainty}
              onChange={(e) => update("uncertainty", e.target.value)}
              rows={3}
            />
          </Field>
        </section>
      )}

      {stage === 2 && (
        <section className="card" aria-labelledby="delegate-title">
          <p className="step-label">Assign ownership deliberately</p>
          <h2 id="delegate-title">Decide what humans and AI should do</h2>
          <Field label="Which steps depend on each other?" id="dependency-map">
            <textarea
              id="dependency-map"
              value={answers.dependencyMap}
              onChange={(e) => update("dependencyMap", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="What must remain human-owned?" id="human-work">
            <textarea
              id="human-work"
              value={answers.humanWork}
              onChange={(e) => update("humanWork", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="What can AI assist with?" id="ai-work">
            <textarea
              id="ai-work"
              value={answers.aiWork}
              onChange={(e) => update("aiWork", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="How will you verify the AI-assisted work?" id="verification-plan">
            <textarea
              id="verification-plan"
              value={answers.verificationPlan}
              onChange={(e) => update("verificationPlan", e.target.value)}
              rows={3}
            />
          </Field>
        </section>
      )}

      {stage === 3 && (
        <section className="card" aria-labelledby="ai-title">
          <p className="step-label">Fixed synthetic output · not a live model call</p>
          <h2 id="ai-title">Inspect the AI recommendation</h2>
          <blockquote className="ai-output">{scenario.controlledAiOutput}</blockquote>
          <p>
            Do not accept or reject it based on tone. Compare its claims with the supplied evidence,
            your constraints, and your verification plan.
          </p>
        </section>
      )}

      {stage === 4 && (
        <section className="card" aria-labelledby="verify-title">
          <p className="step-label">Verify before deciding</p>
          <h2 id="verify-title">Record evidence and make the final decision</h2>
          <Field
            label="What did you verify, and what did the AI miss or get right?"
            id="evidence-check"
          >
            <textarea
              id="evidence-check"
              value={answers.evidenceCheck}
              onChange={(e) => update("evidenceCheck", e.target.value)}
              rows={5}
            />
          </Field>
          {scenario.id === "2" && (
            <Field
              label="List each AI claim and the evidence that supports or fails to support it"
              id="claim-evidence"
            >
              <textarea
                id="claim-evidence"
                value={answers.claimEvidence}
                onChange={(e) => update("claimEvidence", e.target.value)}
                rows={5}
              />
            </Field>
          )}
          <Field
            label="What did you accept, change, or reject from the AI output?"
            id="ai-contributions"
          >
            <textarea
              id="ai-contributions"
              value={answers.aiContributions}
              onChange={(e) => update("aiContributions", e.target.value)}
              rows={4}
            />
          </Field>
          <Field label="Your final decision and rationale" id="final-decision">
            <textarea
              id="final-decision"
              value={answers.finalDecision}
              onChange={(e) => update("finalDecision", e.target.value)}
              rows={5}
            />
          </Field>
          <Field label="What risk remains after this decision?" id="residual-risk">
            <textarea
              id="residual-risk"
              value={answers.residualRisk}
              onChange={(e) => update("residualRisk", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="Who is accountable, and who do you escalate to?" id="accountable-owner">
            <textarea
              id="accountable-owner"
              value={answers.accountableOwner}
              onChange={(e) => update("accountableOwner", e.target.value)}
              rows={2}
            />
          </Field>
          <Confidence
            id="final-confidence"
            label="Final confidence"
            value={answers.finalConfidence}
            onChange={(value) => update("finalConfidence", value)}
          />
          <details className="debrief">
            <summary>Facilitator debrief note</summary>
            <p>{scenario.embeddedRisk}</p>
          </details>
        </section>
      )}

      {stage === 5 && (
        <section className="card receipt" aria-labelledby="receipt-title">
          <p className="step-label">Finite endpoint reached</p>
          <h2 id="receipt-title">Mission {scenario.id} complete</h2>
          <p>
            Your original and final judgments are preserved in the session receipt. This prototype
            makes no claim that completing a mission improves cognitive capability.
          </p>
          <div className="actions">
            <button type="button" onClick={downloadReceipt}>
              Export session receipt
            </button>
            <button type="button" className="secondary" onClick={clearMission}>
              Delete this browser-session record
            </button>
          </div>
          <details>
            <summary>Review receipt JSON</summary>
            <pre>{receipt}</pre>
          </details>
          {scenario.id === "1" && (
            <aside className="continue-card" aria-labelledby="mission-two-title">
              <h3 id="mission-two-title">Optional Mission 2</h3>
              <p>
                Continuing is voluntary. Starting and completing Mission 2—not merely opening it—is
                the Gate 0 continuation outcome.
              </p>
              <Link className="button" href="/mission/2">
                Start Mission 2
              </Link>
            </aside>
          )}
          {scenario.id === "2" && (
            <Link className="button" href="/">
              Return to start
            </Link>
          )}
        </section>
      )}

      {stage < 5 && (
        <div className="actions nav-actions">
          {stage > 0 && (
            <button
              type="button"
              className="secondary"
              onClick={() => setStage((current) => current - 1)}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={continueFlow}
            disabled={!stageIsComplete(stage, answers, scenario.id)}
          >
            {stage === 4 ? "Complete mission" : "Continue"}
          </button>
        </div>
      )}
    </main>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function Confidence({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} id={id}>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select confidence</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </Field>
  );
}
