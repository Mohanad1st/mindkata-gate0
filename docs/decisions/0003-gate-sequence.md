# ADR 0003: The gate sequence, and why nothing beyond Gate 0 may be built here

**Status:** accepted
**Date:** 10 August 2026

## Decision

Record all five gates, their entry conditions, and their designs in this repository, so that a
future contributor can see _what_ Gate 1 and beyond are and _why_ building any of them now is out
of scope. `docs/scope-lock.md` already forbids "Gate 1 infrastructure" without ever saying what
Gate 1 is — the same gap the STOP floors had in ADR 0002. A prohibition nobody can interpret is a
prohibition that gets stepped over by accident.

This ADR grants no permission. It is a map, not a licence.

## Why this matters more than it looks

Gate 1 is **not an increment on this prototype**. It requires precisely what Gate 0 deliberately
excludes: persistent storage across weeks, a live controlled model configuration, a versioned task
and prompt library, blinded rater workflows, and scheduled baseline / post-test / delayed
follow-up. `config/scope-lock.json` and `scripts/check-scope.mjs` mechanically block part of that
today. Anyone who treats Gate 1 as "the next slice" will fight the scope check rather than
recognise it is a new approved build needing its own scope lock and ADR.

## The sequence

Each gate is blocked by the one before it. Per the controlling documents, "Gate 1 remains blocked
until both decisions are documented in writing" — a green engineering loop is not a gate decision,
and neither is a promising session.

### Gate 0 — proposition and commercial progression (current)

Gate 0A: at least 8 eligible users and 8 qualified buyers, against the five scored criteria in
`docs/scope-lock.md`. Gate 0B: 10 valid priced proposals, at least 8 substantive responses, at
least 2 hard commercial progressions, at least 1 financial or contractual commitment. Overall
Gate 0 passes only if both pass. Thresholds, warning bands, and STOP floors are in
`docs/scope-lock.md`; see ADR 0002.

**Exit to Gate 1 requires:** both decisions documented in writing. Any STOP, or a failed bounded
retest, blocks Gate 1 and requires a written stop or service-only pivot decision.

### Gate 1 — paid feasibility pilot

One buyer; approximately 12–20 participants; four weeks plus a delayed follow-up; three short
practices weekly and one longer integrated mission weekly; baseline, parallel post-test, and
delayed follow-up; an **AI-removed task** to test retained unaided performance; one controlled
model configuration; a fixed versioned task and prompt library; blinded human scoring.

It answers feasibility questions only — task duration, acceptability of structured friction,
rubric clarity, rater reliability, parallel-form equivalence, model consistency, evidence of
increased dependence or reduced unaided performance, buyer report usefulness, and the variance and
attrition needed to size a later study.

**No efficacy claim may be made from Gate 1.**

### Gate 2 — comparative validation

Two arms by default: full structured practice, against an _active_ informational control that is
equally polished, time-matched, and topic-relevant but without the structured-practice mechanisms.
The active control is the point — it controls for attention, novelty, topic exposure, and
presentation quality in a way a passive summary cannot.

Sample size derives from Gate 1 estimates. The figure of roughly 64 participants per arm before
attrition, for an expected standardized effect of 0.5, is **planning context only and must not
become a fixed guarantee**. Preregistration is required before data collection: primary dimensions
and composite, primary time point, task forms and counterbalancing, randomization and allocation
concealment, model configuration and AI-alone anchors, exclusions and missing-data rules, rater
procedures, analysis model and uncertainty intervals, adverse outcomes and stopping rules, and
secondary or exploratory outcomes.

### Gate 3 — paid replication

An unrelated organization and fresh scenarios. Requires a credible retained or near-transfer
signal, no meaningful harm to unaided performance, acceptable participant burden, stable scoring
and model controls, and buyer willingness to renew, expand, or fund further validation.

### Gate 4 — expansion

Expansion hypotheses, each requiring its own problem, impact, privacy, and commercial test:
personalized news, **Arabic and RTL**, automated sponsor dashboards, adaptive pathways, native
mobile, role packs, workflow integration, and private content.

## Note for contributors: this repository is intentionally English-only

Arabic and RTL support is a **Gate 4** expansion hypothesis. The approved Gate 0 build is "two
fixed English synthetic missions."

This is worth stating explicitly because it contradicts a standing convention in this maintainer's
global instructions, which requires every user-facing string to go through i18n with English and
Arabic added in the same commit, and describes that as applying to almost every project. **It does
not apply here.** Adding an i18n layer or Arabic copy to this repository would breach the scope
lock and expand the prototype beyond what Gate 0 approved. If a future session's tooling suggests
bilingual work, that suggestion is out of scope until Gate 4, and only then after its own test.

## Consequences

- A contributor can now see what Gate 1 is, and therefore why it is not the next slice.
- Building any Gate 1+ capability requires: a documented Gate 0 pass, a new scope lock, a new ADR,
  and founder approval. Per `CLAUDE.md`, "any move beyond Gate 0" is a protected decision.
- Gate 1 introduces real participant data, a live model, and consent obligations. None of those
  are engineering decisions. The Version 2.1.1 Gate 0 Execution Starter Kit remains the
  controlling source for consent, recruitment, scripts, scorecards, and coding, and this
  repository does not replace facilitator training or independent research and privacy review.
- If the controlling package is revised, this ADR must be updated by a new dated decision record.
  It is a convenience summary, not a second source of truth.
