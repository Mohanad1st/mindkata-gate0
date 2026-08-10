# ADR 0002: Record the Gate 0 STOP floors and warning bands in the scope lock

**Status:** accepted
**Date:** 10 August 2026

## Decision

Transcribe the Gate 0A warning bands, the Gate 0A and Gate 0B STOP floors, the bounded-retest
definitions, and the "without added incentive or direct prompting" qualifier on Mission 2 into
`docs/scope-lock.md`. No threshold is created, relaxed, or tightened; every figure is copied from
the controlling Version 2.1 decision package.

## Why

`docs/protocol/study-protocol.md` directs the facilitator to "use the locked thresholds in
`../scope-lock.md`", and the scope lock allowed PIVOT only when "no stop floor is crossed" — but
it never stated what any floor was. A facilitator reading only this repository could not tell
whether a session had crossed a STOP boundary, which is exactly the judgement the gate turns on.
Leaving the numbers in a separate document meant the decision rule was unavailable at the moment
it had to be applied.

## Sources

Both controlling documents agree, and their figures interlock: each warning band's lower bound is
the corresponding STOP floor.

- `01_Final_Validation_and_Strategy_Report_v2_1.docx` — warning bands (need 40–59%; comprehension
  50–69%; Mission 1 completion 50–74% or median 12–18 minutes; Mission 2 completion 25–49%; buyer
  relevance 30–49%), the one-primary-variable retest with at least 5 new users and 5 new buyers,
  and the full Mission 2 criterion including "without added incentive or direct prompting".
- `04_Build_Ready_PRD_v2_1.docx` — STOP floors (need <40%; comprehension <50%; Mission 1 <50% or
  median >18 minutes; Mission 2 <25%; buyer relevance <30%) and the Gate 0B PIVOT and STOP rules.

## Notes on the Mission 2 criterion

The Build-Ready PRD's summary table abbreviates this criterion to ">=50% (minimum 4) voluntary
Mission 2", which reads as though starting Mission 2 might be sufficient. The Final Validation and
Strategy Report states it in full: users must voluntarily **start and complete** Mission 2. The
scope lock already required start _and_ complete, so no change was needed; the qualifier about
incentive and prompting was the only missing element. This distinction is material because the
prototype records `M2_STARTED` and `M2_COMPLETED` as separate evidence, so the two readings can
produce different verdicts on the same participants.

## Consequences

- The GO / PIVOT / STOP rule can be applied from this repository alone during an observed session.
- The Version 2.1.1 Gate 0 Execution Starter Kit remains the controlling source for recruitment,
  consent language, interview scripts, scorecards, and coding. This transcription does not replace
  it, facilitator training, or independent research and privacy review.
- If the controlling package is revised, `docs/scope-lock.md` must be updated by a new dated
  decision record. The transcription is a convenience copy, not a second source of truth.
